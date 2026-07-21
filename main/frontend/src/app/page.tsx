import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero";
import SocialProofBar from "@/components/social-proof-bar";
import ProblemSection from "@/components/problem-section";
import HowItWorks from "@/components/how-it-works";
import CapabilitySurfaces from "@/components/capability-surfaces";
import IntegrationWall from "@/components/integration-wall";
import UseCaseCarousel from "@/components/use-case-carousel";
import AIPlannerDemo from "@/components/ai-planner-demo";
import ApprovalSection from "@/components/approval-section";
import PricingSection from "@/components/pricing-section";
import FAQSection from "@/components/faq-section";
import ClosingCTA from "@/components/closing-cta";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1">
        <HeroSection />
        <SocialProofBar />
        <ProblemSection />
        <HowItWorks />
        <CapabilitySurfaces />
        <IntegrationWall />
        <UseCaseCarousel />
        <AIPlannerDemo />
        <ApprovalSection />
        <PricingSection />
        <FAQSection />
        <ClosingCTA />
      </main>
      <Footer />
    </div>
  );
}
