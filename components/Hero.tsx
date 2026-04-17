import Container from "@/components/Container";
import HeroButtons from "./HeroButtons";

const summaryItems = ["Live attendance updates", "Clear streak tracking", "Simple gym admin flow"];

const Hero = () => {
    return (
        <section className="relative overflow-hidden pb-18 pt-8 sm:pb-20 sm:pt-10">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top,rgba(132,204,22,0.18),transparent_48%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-24 h-40 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)] blur-3xl" />
            <Container>
                <div className="relative mx-auto max-w-4xl py-16 text-center sm:py-20">
                    <div className="mx-auto w-fit rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-primary">Attendance for modern gyms</div>
                    <h1 className="mt-6 text-5xl font-black leading-[0.92] tracking-[-0.05em] text-foreground sm:text-6xl lg:text-7xl">
                        Clean check-ins.
                        <br className="hidden sm:block" />
                        <span className="text-foreground/70"> Better visibility.</span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">Strongly helps gyms manage member attendance without messy logs, unclear streaks, or an overbuilt dashboard.</p>

                    <div className="flex justify-center">
                        <HeroButtons />
                    </div>

                    <div className="mt-12 grid gap-3 sm:grid-cols-3">
                        {summaryItems.map((item) => (
                            <div key={item} className="rounded-2xl border border-border/70 bg-card/45 px-4 py-4 text-sm font-medium text-foreground/85 shadow-[0_20px_60px_-45px_rgba(0,0,0,1)] backdrop-blur-md">
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default Hero;
