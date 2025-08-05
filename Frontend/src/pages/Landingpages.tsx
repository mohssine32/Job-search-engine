// src/pages/LandingPage.tsx

import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import Findjobsection from '../components/Findjobsection'
import JobStatsSection from '../components/JobStatsSection'
import LogoCarousel from '../components/LogoCarousel'

function LandingPage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <LogoCarousel />
      <Findjobsection />
      <JobStatsSection />
    </>
  )
}

export default LandingPage