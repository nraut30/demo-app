import React from "react";
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
      email: "",
      accesstoken: "",
      expiresIn: "",
    },
    states: {
      collectingFormData: {
        on: {
          submit: {
            target: "submitting",
          },
        },
      },
      submitting: {
        invoke: {
          id: "submitting",
          src: "submitting",
          onDone: {
            actions: "savedata",
          },
          onError: {
            actions: "showError",
          },
        },
      },
    },
  },
  {
    services: {
      submitting: (ctx: any) => {
        return submitUser(ctx);
      },
    },
    actions: {
      savedata: () => console.log(),
    },
  }
);

const submitUser = async (args: {
  email: string;
  password: string;
  signin: boolean;
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
      if (args.signin) {
      }
      console.log(resData, " resData");
    })
    .catch((err) => console.log(err, " error"));
};

const Auth = () => {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [currentTab, sendTab] = useMachine(toggleStateMachine);
  const [currentStat, sendStat] = useMachine(loginMachine);

  return (
    <>
      <div className="headAuth">
        {currentTab.matches("signin") ? "Sign-In" : "Sign-Up"}
      </div>
      <form
        onSubmit={form.handleSubmit((values) => {
          if (currentTab.matches("signup")) {
            sendStat("submitting", {
              email: values.email,
              password: values.password,
              signin: false,
            });
          } else if (currentTab.matches("signin")) {
            sendStat("submitting", {
              email: values.email,
              password: values.password,
              signin: true,
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
          <button>Submit</button>
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
