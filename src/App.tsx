import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Navbar from "./components/navbar/Navbar";

import { AuthProvider } from "./contexts/AuthContext";
import AuthCallback from "./pages/AuthCallback";
import BodyComposition from "./pages/BodyComposition";
import MonthlyConsistency from "./pages/ConsistencyPage";
import DietPage from "./pages/DietPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PlansPage from "./pages/PlansPage";
import ProfilePage from "./pages/ProfilePage";
import TrainingDayPage from "./pages/TrainingDayPage";
import TrainingPlanPage from "./pages/TrainingPlanPage";

function AppContent() {
  const location = useLocation();

  return (
    <div className="w-full h-full text-gray-800 flex-col items-center justify-center">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/training_plan" element={<TrainingPlanPage />} />
        <Route path="/training_day/:id" element={<TrainingDayPage />} />
        <Route path="/callback" element={<AuthCallback />} />
        <Route path="/diet" element={<DietPage />} />
        <Route path="/consistency" element={<MonthlyConsistency />} />
        <Route path="/plans" element={<PlansPage />} />
        <Route path="/body_user" element={<BodyComposition />} />
      </Routes>

      {location.pathname !== "/" &&
        location.pathname !== "/callback" &&
        location.pathname !== "/plans" && <Navbar />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
