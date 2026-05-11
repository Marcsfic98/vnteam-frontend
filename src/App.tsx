import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/navbar/Navbar";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="w-full h-full text-gray-800 flex-col items-center justify-center">
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </div>
        <Navbar />
      </BrowserRouter>
    </>
  );
}

export default App;
