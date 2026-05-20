import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/navbar/Navbar";

import { AuthProvider } from "./contexts/AuthContext";
import AuthCallback from "./pages/AuthCallback";
import DietPage from "./pages/DietPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import TrainingDayPage from "./pages/TrainingDayPage";
import TrainingPlanPage from "./pages/TrainingPlanPage";

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <div className="w-full h-full text-gray-800 flex-col items-center justify-center">
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/training_plan" element={<TrainingPlanPage />} />
              <Route path="/training_day/:id" element={<TrainingDayPage />} />
              <Route path="/callback" element={<AuthCallback />} />
              <Route path="/diet" element={<DietPage />} />
            </Routes>
          </div>
          <Navbar />
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
