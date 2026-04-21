import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import CTASection from "@/components/CTASection";

export default function Home() {
  return (
    <div className="pt-0 pb-24">
      <HeroSection />
      <HowItWorks />
      <CTASection />
    </div>
  );
}
