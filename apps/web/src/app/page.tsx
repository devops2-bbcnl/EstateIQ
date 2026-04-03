import { auth } from '@/lib/auth'

import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import HowItWorks from '@/components/landing/HowItWorks'
import Testimonials from '@/components/landing/Testimonials'
import Pricing from '@/components/landing/Pricing'
import FAQ from '@/components/landing/FAQ'
import CTA from '@/components/landing/CTA'
import Footer from '@/components/landing/Footer'

export default async function RootPage() {
  const session = await auth()
  const isLoggedIn = !!session

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} />
      <main>
        <Hero isLoggedIn={isLoggedIn} />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA isLoggedIn={isLoggedIn} />
      </main>
      <Footer />
    </>
  )
}
