import React, { FC, useEffect } from "react";
import "./Auth.css";
import { createMachine, assign } from "xstate";
import { useForm } from "react-hook-form";
import { useMachine } from "@xstate/react";

const toggleStateMachine = createMachine({
  id: "toggleStateMachine",
  initial: "signin",
  states: {
    signin: {
      on: {
        TOGGLE: "signup",
      },
    },
    signup: {
      on: {
        TOGGLE: "signin",
      },
    },
  },
});

const loginMachine = createMachine(
  {
    id: "login",
    initial: "collectingFormData",
    context: {
      userId: "",
      token: "",
      tokenExpiration: "",
      signupSuccess: false,
    },
    states: {
      collectingFormData: {
        on: {
          submit: {
            actions: ["savedata"],
          },
        },
      },
    },
  },
  {
    actions: {
      savedata: assign((_, evnt: any) => {
        if (!evnt.signupSuccess) {
          return {
            ..._,
            userId: evnt.resData.data.login.userId,
            token: evnt.resData.data.login.token,
            tokenExpiration: evnt.resData.data.login.tokenExpiration,
            signupSuccess: false,
          };
        } else {
          return {
            signupSuccess: evnt.signupSuccess,
          };
        }
      }),
    },
  }
);

const submitUser = async (args: {
  email: string;
  password: string;
  signin: boolean;
  send: CallableFunction;
}) => {
  let reqBody;
  if (!args.signin) {
    reqBody = {
      query: `
    mutation {
      createUser(userInput: {
        email: "${args.email}",
        password: "${args.password}"
      }) {
        _id
        email
      }
    }`,
    };
  } else if (args.signin) {
    reqBody = {
      query: `
      query {
        login(
          email: "${args.email}",
          password: "${args.password}"
        ) {
          userId,
          token,
          tokenExpiration
        }
      }`,
    };
  }
  if (reqBody) {
    fetch("http://localhost:3000/graphql", {
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed.");
        } else {
          return res.json();
        }
      })
      .then((resData) => {
        if (resData.data.login) {
          args.send("submit", { resData });
        } else {
          args.send("submit", { signupSuccess: true });
        }
      })
      .catch((err) => console.log(err, " error"));
  }
};

type AuthProps = {
  context: CallableFunction;
};

const Auth: FC<AuthProps> = ({ context }) => {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [currentTab, sendTab] = useMachine(toggleStateMachine);
  const [currentStat, sendStat] = useMachine(loginMachine);

  useEffect(() => {
    if (
      currentStat.context.userId &&
      currentStat.context.token &&
      currentStat.context.tokenExpiration
    ) {
      context(currentStat.context);
    }
  }, [
    currentStat.context.userId,
    currentStat.context.token,
    currentStat.context.tokenExpiration,
  ]);

  useEffect(() => {
    if (currentStat.context.signupSuccess) {
      window.alert("Signup successful");
    } else if (currentStat.context.userId) {
      window.alert("Signin succesful");
    }
  }, [currentStat.context.signupSuccess, currentStat.context.userId]);

  return (
    <>
      <div className="headAuth">
        {currentTab.matches("signin") ? "Sign-In" : "Sign-Up"}
      </div>
      <form
        onSubmit={form.handleSubmit((values) => {
          if (currentTab.matches("signup")) {
            submitUser({
              email: values.email,
              password: values.password,
              signin: false,
              send: sendStat,
            });
          } else if (currentTab.matches("signin")) {
            submitUser({
              email: values.email,
              password: values.password,
              signin: true,
              send: sendStat,
            });
          }
        })}
        className="auth-form"
      >
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input
            {...form.register("email", {
              validate: (value: string): any => {
                if (value.length < 1) {
                  return "Enter a valid email.";
                }
              },
            })}
            type="email"
            id="email"
          />
          {form.formState.errors.email && (
            <p>{form.formState.errors.email.message}</p>
          )}
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input
            {...form.register("password", {
              validate: (value: string): any => {
                if (value.length < 1) {
                  return "Enter a valid password.";
                }
              },
            })}
            type="password"
            id="password"
          />
          {form.formState.errors.password && (
            <p>{form.formState.errors.password.message}</p>
          )}
        </div>
        <div className="form-action">
          <button>
            {currentTab.matches("signin") ? " SignIn " : " SignUp "}
          </button>
        </div>
      </form>
      <div className="tabSwitcher" onClick={() => sendTab("TOGGLE")}>
        <u>
          {currentTab.matches("signin")
            ? " or you can Signup "
            : " or you can Signin "}
        </u>
      </div>
    </>
  );
};

export default Auth;
