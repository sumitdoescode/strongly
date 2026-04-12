import Container from "./Container";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlignJustify } from "lucide-react";
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
        <nav className="text-primary py-2 fixed z-10 min-w-full border-b bg-background/20 backdrop-blur-md w-full">
            <Container>
                <div className="flex items-center justify-between">
                    {session ? (
                        // User is signed in
                        <>
                            {/* <Sidebar /> */}
                            <div className="flex items-center gap-4">
                                <Link href="/feed">
                                    <Button variant="outline" className="text-foreground hover:text-foreground">
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
