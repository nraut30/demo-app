import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import Books from "./pages/Books";
import Navbar from "./components/Navbar";
import { assign, createMachine } from "xstate";
import { useMachine } from "@xstate/react";

const initContext = {
  userId: "",
  token: "",
  tokenExpiration: "",
  books: [],
  showBooks: false,
};

const appMachine = createMachine(
  {
    id: "appMachine",
    initial: "authenticated",
    context: initContext,
    states: {
      authenticated: {
        on: {
          saveContext: {
            actions: ["saveContext"],
          },
          bookShow: "books",
        },
      },
      books: {
        on: {
          logout: {
            actions: ["logout"],
          },
        },
      },
    },
  },
  {
    actions: {
      logout: assign({ ...initContext }),
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
  const contextHandler = (ctx: {
    userId: String;
    token: String;
    tokenExpiration: String;
  }) => {
    if (ctx.userId && ctx.token && ctx.tokenExpiration) {
      send("saveContext", { ctx });
    }
  };

  return (
    <BrowserRouter>
      <>
        <Navbar showBooks={current.context.showBooks} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Auth context={contextHandler} />} />
            <Route path="/books" element={<Books />} />
          </Routes>
        </main>
      </>
    </BrowserRouter>
  );
}

export default App;
