import { Routes, Route } from 'react-router-dom';
import LandingPage from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import JobPage from "./pages/JobPage";
import CandidatePage from "./pages/CandidatePage";
import RecruiterPage from "./pages/RecruiterPage";
import CandidateOfferPage from './pages/CandidateOfferPage';
import JobOfferDetailPage from './pages/JobOfferDetailPage';
import AdminPage from './pages/AdminPage';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>  {/* ✅ Ici, on entoure tout avec le provider */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/job" element={<JobPage />} />
        <Route path="/job/:id" element={<JobOfferDetailPage />} />
        <Route path="/candidate" element={<CandidatePage />} />
        <Route path="/recruiter" element={<RecruiterPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/offres/:id/candidats" element={<CandidateOfferPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;