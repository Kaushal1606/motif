import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";
import { useHashScroll } from "@/hooks/useHashScroll";

const Index = () => {
  useHashScroll();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <section id="features">
          <Features />
        </section>
        <section id="faq">
          <FAQ />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
