import Container from "@/components/Container";
import UpdateProfileForm from "@/components/UpdateProfileForm";
import Logo from "@/components/Logo";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import { getOwnProfileSummary } from "@/lib/profile";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const UpdateProfilePage = async () => {
    await connectDB();

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/");
    }

    if (!session.user.isProfileCompleted) {
        redirect("/complete-profile");
    }

    const profile = await getOwnProfileSummary(session.user);
    if (!profile) {
        redirect("/complete-profile");
    }

    return (
        <section className="pb-16">
            <Container>
                <div className="mx-auto max-w-lg">
                    <Card className="border border-border/60 bg-card/80">
                        <CardContent className="px-6 py-8 sm:px-8">
                            <div className="text-center">
                                <Logo />
                                <h1 className="mt-6 text-3xl font-black tracking-[-0.05em]">Update your profile</h1>
                                {/* <p className="mt-3 text-sm leading-6 text-muted-foreground">Update your profile</p> */}
                            </div>

                            <div className="mt-8">
                                <UpdateProfileForm initialValues={{ fullName: profile.fullName, gymCode: profile.gymCode }} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </Container>
        </section>
    );
};

export default UpdateProfilePage;
