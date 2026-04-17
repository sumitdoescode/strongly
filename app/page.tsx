import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Workflow from "@/components/Workflow";
import Benefits from "@/components/Benefits";
import CTA from "@/components/CTA";

const LandingPage = () => {
    return (
        <main className="relative overflow-hidden bg-background">
            <Hero />
            <Features />
            <Workflow />
            <Benefits />
            <CTA />
        </main>
    );
};

export default LandingPage;
