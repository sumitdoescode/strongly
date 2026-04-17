import Container from "./Container";

const steps = [
    {
        number: "01",
        title: "Sign in",
        description: "Use Google to get started quickly.",
    },
    {
        number: "02",
        title: "Join your gym",
        description: "Enter your gym code and connect to the right profile.",
    },
    {
        number: "03",
        title: "Check in daily",
        description: "Track attendance, streaks, and activity in one place.",
    },
];

const Workflow = () => {
    return (
        <section id="workflow" className="py-20 sm:py-24">
            <Container>
                <div className="mx-auto max-w-2xl text-center">
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">How it works</p>
                    <h2 className="mt-4 text-4xl font-black tracking-[-0.03em] sm:text-5xl">Short setup, easy daily use.</h2>
                    <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">The flow stays simple enough for both members and staff.</p>
                </div>

                <div className="mt-12 grid gap-4 md:grid-cols-3">
                    {steps.map((step) => (
                        <div key={step.number} className="rounded-[1.6rem] border border-border/70 bg-card/45 p-6 shadow-[0_24px_70px_-52px_rgba(0,0,0,1)] backdrop-blur-sm">
                            <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">{step.number}</span>
                            <h3 className="mt-4 text-xl font-bold tracking-tight">{step.title}</h3>
                            <p className="mt-3 text-base leading-7 text-muted-foreground">{step.description}</p>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
};

export default Workflow;
