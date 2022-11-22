import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import Books from "./pages/Books";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <>
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/books" element={<Books />} />
          </Routes>
        </main>
      </>
    </BrowserRouter>
  );
}

export default App;
