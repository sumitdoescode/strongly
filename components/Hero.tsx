import Container from "@/components/Container";
import HeroButtons from "./HeroButtons";

const Hero = async () => {
    return (
        <section className="min-h-[80vh] flex items-center">
            <Container>
                <div className="max-w-md sm:max-w-lg  md:max-w-3xl mx-auto">
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-center text-foreground tracking-tight">
                        Track <span className="text-primary">Attendance</span>
                        <br />
                        as it
                        <span className=""> happens</span>
                    </h1>
                    <p className="text-lg text-muted-foreground mt-3 text-center mx-auto max-w-xl">See every member check-in as it happens — track attendance, trends, streaks in real time.</p>
                    <HeroButtons />
                </div>
            </Container>
        </section>
    );
};

export default Hero;
