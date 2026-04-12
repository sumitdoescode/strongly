import Container from "@/components/Container";
import CompleteProfile from "@/components/CompleteProfile";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const page = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    // if profile is already completed, redirect to dashboard
    if (session?.user.isProfileCompleted) {
        redirect("/dashboard");
    }

    return (
        <section className="py-20 grow">
            <Container>
                {/* <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6"> */}
                <div className="w-full max-w-sm mx-auto">
                    {/* Logo */}
                    <div className="text-center mb-12">
                        <h1 className={`text-4xl font-bold text-foreground tracking-tight`}>Strongly</h1>
                        <div className="w-12 h-0.5 bg-primary mx-auto mt-3"></div>
                    </div>

                    {/* Form */}
                    <div className="space-y-8">
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-semibold text-foreground">Complete Your Profile</h2>
                            <p className="text-muted-foreground text-sm">Let's get your account ready before you start checking in</p>
                        </div>

                        <CompleteProfile />
                    </div>
                </div>
                {/* </div> */}
            </Container>
        </section>
    );
};

export default page;
