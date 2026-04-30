import { headers } from "next/headers";
import Logo from "./Logo";
import NavbarClient, { type NavbarLink, type NavbarUser } from "./NavbarClient";
import { auth } from "@/lib/auth";

const Navbar = async () => {
    let user: NavbarUser | null = null;

    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (session?.user) {
            user = {
                name: session.user.name,
                image: session.user.image,
                role: "role" in session.user ? String(session.user.role) : "member",
            };
        }
    } catch {
        user = null;
    }

    const links: NavbarLink[] = user
        ? [
              { href: "/feed", label: "Feed", icon: "feed" },
              { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
              { href: "/update-profile", label: "Profile", icon: "profile" },
              ...(user.role === "admin" ? [{ href: "/admin", label: "Admin", icon: "admin" as const }] : []),
          ]
        : [];

    return (
        <header className="fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
            <div className="mx-auto flex w-[min(1120px,94%)] items-center justify-between gap-4 py-3">
                <Logo />
                <NavbarClient links={links} user={user} />
            </div>

            {user && (
                <div className="border-t border-border/50 md:hidden">
                    <div className="mx-auto w-[min(1120px,94%)]">
                        <NavbarClient links={links} user={user} mobile />
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
