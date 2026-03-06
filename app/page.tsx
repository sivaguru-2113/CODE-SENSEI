import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { LogoCloud } from "@/components/landing/logo-cloud"
import { FeaturesGrid } from "@/components/landing/features-grid"
import { HowItWorks } from "@/components/landing/how-it-works"
import { BentoTech } from "@/components/landing/bento-tech"
import { Testimonials } from "@/components/landing/testimonials"
import { FaqSection } from "@/components/landing/faq-section"
import { FinalCta } from "@/components/landing/final-cta"
import { Footer } from "@/components/landing/footer"

import { BackgroundMotion } from "@/components/background-motion"

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden selection:bg-cyan-500/30">
      {/* SaaS Interactive Motion Background */}
      <BackgroundMotion />

      <div className="relative z-10">
        <Navbar />
        <Hero />
        <LogoCloud />
        <FeaturesGrid />
        <HowItWorks />
        <BentoTech />
        <Testimonials />
        <FaqSection />
        <FinalCta />
        <Footer />
      </div>

      {/* Glass vignette for focus */}
      <div className="fixed inset-0 pointer-events-none z-20 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(10,10,15,0.4)_100%)]" />
    </main>
  )
}
