import "./App.css";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Auth from "./pages/Auth";
import Books from "./pages/Books";
import Navbar from "./components/Navbar";
import { assign, createMachine } from "xstate";
import { useMachine } from "@xstate/react";
import { useEffect } from "react";

const initContext = {
  userId: "",
  token: "",
  tokenExpiration: "",
  books: [],
  showBooks: false,
  logoutUser: false,
};

const appMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QEMAOqCyyDGALAlgHZgB0ArocmQC65iHX7bLWQDEsyAbmAMID2DMAA9qAbQAMAXUShU-WPkaDZIYYgCcEkgFYJANgBMOgOzH9EgBwmJOgDQgAnogCMOjSX36ALDuMSNQwsNb28AXzCHNEwcAmISKlp6RmZWCA5cfgB3ACF+fgBrWEkZJBB5RWVCVXUEQ0MXXWsdAGYNH18JCRNvB2cEAFoPeu8NMZcrF0sdP0sIqPQsPCJSACN8orYAG34ofhoS1QqlfBUy2u82khbLk2mWqZd9QL7EQ0uSQxafGxbDEz0Fjm8xAhH4EDgqmiSziYCOChOZ1AtQGJn0JC0Rn0LlCNjGoVegw0lmulhcxh0lhCfm+LRB0NiK3IlBodAYTBYkHhlVO1XOiAGOhIZOs+haOm8lmxGhMOMJhmsnxMbR0Pj+DUMGnpi0Z8USbJSnIg3MRfORAoVGIMQRx3jxIUuhMsJPaos1XUsVk12piy3i60K8DKxyqNUQN0Mny6EgaJh6NjthJcGka-xVavq5K1ETCQA */
  createMachine(
    {
      context: initContext,
      id: "appMachine",
      initial: "unauthenticated",
      states: {
        unauthenticated: {
          on: {
            saveContext: {
              target: "authenticated",
              actions: "saveContext",
            },
          },
        },
        authenticated: {
          on: {
            showBooks: {
              actions: "showBooks",
            },
            logout: {
              target: "unauthenticated",
              actions: "logout",
            },
          },
        },
      },
    },
    {
      actions: {
        logout: assign((cntx, e) => {
          return {
            ...initContext,
          };
        }),
        saveContext: assign((c, e: any) => {
          return {
            ...c,
            userId: e.userId,
            token: e.token,
            tokenExpiration: e.tokenExpiration,
            showBooks: true,
          };
        }),
      },
    }
  );

function App() {
  const [current, send] = useMachine(appMachine);

  let navigate = useNavigate();
  const contextHandler = (ctx: {
    userId: String;
    token: String;
    tokenExpiration: String;
  }) => {
    if (ctx.userId && ctx.token && ctx.tokenExpiration) {
      send("saveContext", { ...ctx });
    }
  };

  useEffect(() => {
    if (
      current.context.userId &&
      current.context.token &&
      current.context.showBooks
    ) {
      navigate("/books");
    } else {
      navigate("/");
    }
  }, [current.context]);

  const handleLogout = (bool: boolean) => {
    send("logout");
  };

  return (
    <>
      <Navbar contxt={current.context} logout={handleLogout} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Auth context={contextHandler} />} />
          <Route
            path="/books"
            element={
              current.context.showBooks &&
              current.context.token && <Books token={current.context.token} />
            }
          />
        </Routes>
      </main>
    </>
  );
}

export default App;
