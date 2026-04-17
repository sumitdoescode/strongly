import Container from "./Container";
import Link from "next/link";
import { Button } from "@/components/ui/button";
// import Sidebar from "./Sidebar";
import Logo from "./Logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const Navbar = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    return (
        <nav className="fixed z-10 min-w-full w-full border-b border-border/60 bg-background/70 py-2 text-foreground backdrop-blur-xl">
            <Container>
                <div className="flex items-center justify-between">
                    {session ? (
                        // User is signed in
                        <>
                            {/* <Sidebar /> */}
                            <div className="flex items-center gap-4">
                                <Link href="/feed">
                                    <Button variant="outline" className="border-border/70 bg-background/60 text-foreground hover:text-foreground">
                                        Feed
                                    </Button>
                                </Link>

                                <Avatar>
                                    <AvatarImage src={session.user?.image || ""} alt={session.user?.name} />
                                    <AvatarFallback>{session.user?.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </div>
                        </>
                    ) : (
                        // User is signed out
                        <Logo />
                    )}
                </div>
            </Container>
        </nav>
    );
};

export default Navbar;
