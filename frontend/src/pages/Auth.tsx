import React, { FC, useEffect } from "react";
import "./Auth.css";
import { createMachine, assign } from "xstate";
import { useForm } from "react-hook-form";
import { useMachine } from "@xstate/react";
import { send } from "xstate/lib/actions";
import MessagePopUp from "../components/errorPopUp/MessagePopUp";

//signIn and signUp toggle machine
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

//auth machine
const authMachine = createMachine(
  {
    id: "auth",
    initial: "collectingFormData",
    context: {
      userId: "",
      token: "",
      tokenExpiration: "",
      signupSuccess: false,
      error: false,
      clear: true,
    },
    states: {
      collectingFormData: {
        on: {
          submit: {
            actions: ["savedata"],
          },
          error: {
            actions: ["error"],
          },
          reset: {
            actions: ["reset"],
          },
          clear: {
            actions: ["clear"],
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
            clear: false,
          };
        } else {
          return {
            signupSuccess: evnt.signupSuccess,
            clear: false,
          };
        }
      }),
      error: assign((_, evnt: any) => {
        return {
          ..._,
          error: true,
          signupSuccess: false,
          clear: false,
        };
      }),
      clear: assign((_, e) => {
        return { ..._, clear: true };
      }),
    },
  }
);

//submit formData
const submitUser = async (args: {
  email: string;
  password: string;
  signin: boolean;
  send: CallableFunction;
  form: any;
}) => {
  send("reset");
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
        if (resData?.errors?.length) {
          args.send("error");
        } else if (resData.data.login) {
          args.send("submit", { resData });
        } else if (resData.data.createUser) {
          args.send("submit", { signupSuccess: true });
        }
      })
      .catch((err) => {
        args.send("error");
        console.error(err, " error");
      });
    args.form.reset();
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
  const [currentStat, sendStat] = useMachine(authMachine);

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

  const messageClearer = () => {
    sendStat("clear");
  };

  const renderMessagePopUp = () => {
    if (currentStat.context.signupSuccess) {
      return (
        <MessagePopUp
          title="Message"
          message="Signup successful"
          onConfirmHandler={messageClearer}
        />
      );
    } else if (currentStat.context.userId) {
      return (
        <MessagePopUp
          title="Message"
          message="Signin successful"
          onConfirmHandler={messageClearer}
        />
      );
    } else if (currentStat.context.error) {
      return (
        <MessagePopUp
          title="Message"
          message="Error occurred"
          onConfirmHandler={messageClearer}
        />
      );
    }
  };

  return (
    <>
      {!currentStat.context.clear && renderMessagePopUp()}
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
              form: form,
            });
          } else if (currentTab.matches("signin")) {
            submitUser({
              email: values.email,
              password: values.password,
              signin: true,
              send: sendStat,
              form: form,
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
      <div
        className="tabSwitcher"
        onClick={() => {
          sendTab("TOGGLE");
          form.reset();
        }}
      >
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
