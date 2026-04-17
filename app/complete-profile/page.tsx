import Container from "@/components/Container";
import CompleteProfile from "@/components/CompleteProfile";
import Logo from "@/components/Logo";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const CompleteProfilePage = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/");
    }

    if (session.user.isProfileCompleted) {
        redirect("/dashboard");
    }

    return (
        <section className="py-20 grow">
            <Container>
                <div className="mx-auto w-full max-w-sm">
                    <div className="mb-12 text-center">
                        <div className="flex justify-center">
                            <Logo />
                        </div>
                        <div className="w-12 h-0.5 bg-primary mx-auto mt-3"></div>
                    </div>

                    <div className="space-y-8">
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-semibold text-foreground">Complete Your Profile</h2>
                            <p className="text-muted-foreground text-sm">Let&apos;s get your account ready before you start checking in</p>
                        </div>

                        <CompleteProfile />
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default CompleteProfilePage;
