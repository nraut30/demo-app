import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
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

//app machine by xstate
const appMachine = createMachine(
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

  const navigate = useNavigate();
  const contextHandler = (ctx: {
    userId: string;
    token: string;
    tokenExpiration: string;
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
