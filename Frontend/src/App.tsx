import { Routes, Route } from 'react-router-dom'
import LandingPage from "./pages/Landingpages"
import LoginPage from "./pages/Loginpage"
import RegisterPage from "./pages/Registrepage"
import Jobpage from "./pages/Jobpage"
import Condidatepage from "./pages/Condidatepage"
import Recruterpage from "./pages/Recruterpage"

function App() {
  return (
    <>
     <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
       <Route path="/jobpage" element={<Jobpage />} />
       <Route path="/condidatepage" element={<Condidatepage />} />
        <Route path="/recruterpage" element={<Recruterpage />} />
    </Routes>
 
    
    </>
  )
}

export default App
