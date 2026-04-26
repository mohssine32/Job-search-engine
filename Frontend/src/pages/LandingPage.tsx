// src/pages/LandingPage.tsx
import Footer from '../components/Footer'
import  Navbar  from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import FindJobSection from '../components/FindJobSection'
//import JobStatsSection from '../components/JobStatsSection'
import LogoCarousel from '../components/LogoCarousel'
import JobStatsSection from '../components/JobStatsSection'

function LandingPage() {
  return (
    <>
    
       <Navbar />
       <HeroSection />
       <FindJobSection />
       <JobStatsSection />
       <Footer />
    </>
  )
}

export default LandingPage  

