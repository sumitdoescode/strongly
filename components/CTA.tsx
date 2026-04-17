import Container from "./Container";
import HeroButtons from "./HeroButtons";

const CTA = () => {
    return (
        <section className="pb-24 pt-8 sm:pb-28">
            <Container>
                <div className="rounded-[2rem] border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] px-6 py-12 text-center shadow-[0_28px_90px_-55px_rgba(0,0,0,1)] backdrop-blur-md sm:px-10 sm:py-14">
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-primary">Start now</p>
                    <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-black tracking-[-0.03em] text-foreground sm:text-5xl">A better attendance flow for your gym.</h2>
                    <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">Keep member check-ins simple and make attendance easier to understand.</p>

                    <div className="flex justify-center">
                        <HeroButtons />
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default CTA;
