import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import Register from "./Pages/Register";
import Login from "./Pages/Login";
import ModifyDetails from "./Pages/ModifyDetails";
import ResetPassword from "./Pages/ResetPassword";
import UpdateDetails from "./Pages/UpdateDetails";
import Dashboard from "./Pages/Dashboard";
import AdminDashboard from "./Pages/AdminDashboard";
import TermsAndConditions from "./components/TermsAndConditions";

function App() {
  return (
    <Router>
      <Routes>
        {/* 👇 LANDING PAGE */}
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/modify-details" element={<ModifyDetails />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/update-details" element={<UpdateDetails />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/adminDashboard" element={<AdminDashboard/>} />
        <Route path= "/terms" element={<TermsAndConditions/>} />
      </Routes>
    </Router>
  );
}

export default App;
