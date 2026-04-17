"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LogOut, Radio, Settings, ShieldUser } from "lucide-react";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const Navbar = () => {
    const pathname = usePathname();
    const { data: session, isPending } = authClient.useSession();
    const sessionUser = session?.user;
    const isAdmin = sessionUser && "role" in sessionUser && sessionUser.role === "admin";

    const links = sessionUser
        ? [
              { href: "/feed", label: "Feed", icon: Radio },
              { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
              { href: "/update-profile", label: "Profile", icon: Settings },
              ...(isAdmin ? [{ href: "/admin", label: "Admin", icon: ShieldUser }] : []),
          ]
        : [];

    return (
        <header className="fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
            <div className="mx-auto flex w-[min(1120px,94%)] items-center justify-between gap-4 py-3">
                <Logo />

                <nav className="hidden items-center gap-1 md:flex">
                    {links.map(({ href, label, icon: Icon }) => {
                        const isActive = pathname === href;

                        return (
                            <Link key={href} href={href}>
                                <span
                                    className={cn(
                                        "inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                                        isActive && "bg-muted text-foreground",
                                    )}
                                >
                                    <Icon className="size-4" />
                                    {label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-2">
                    {isPending ? null : sessionUser ? (
                        <>
                            <div className="hidden items-center gap-3 md:flex">
                                <div className="text-right">
                                    <p className="text-sm font-medium text-foreground">{sessionUser.name}</p>
                                    <p className="text-xs text-muted-foreground">{isAdmin ? "Admin" : "Member"}</p>
                                </div>
                                <Avatar size="lg">
                                    <AvatarImage src={sessionUser.image || ""} alt={sessionUser.name ?? undefined} />
                                    <AvatarFallback>{sessionUser.name?.charAt(0) || "S"}</AvatarFallback>
                                </Avatar>
                                <Button variant="outline" onClick={() => authClient.signOut()}>
                                    <LogOut />
                                    Sign out
                                </Button>
                            </div>

                            <Link href="/dashboard" className="md:hidden">
                                <Avatar>
                                    <AvatarImage src={sessionUser.image || ""} alt={sessionUser.name ?? undefined} />
                                    <AvatarFallback>{sessionUser.name?.charAt(0) || "S"}</AvatarFallback>
                                </Avatar>
                            </Link>
                        </>
                    ) : (
                        <Link href="/">
                            <Button variant="outline">Home</Button>
                        </Link>
                    )}
                </div>
            </div>

            {sessionUser && (
                <div className="border-t border-border/50 md:hidden">
                    <div className="mx-auto flex w-[min(1120px,94%)] items-center gap-1 overflow-x-auto py-2">
                        {links.map(({ href, label, icon: Icon }) => {
                            const isActive = pathname === href;

                            return (
                                <Link key={href} href={href} className="shrink-0">
                                    <span
                                        className={cn(
                                            "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                                            isActive && "bg-muted text-foreground",
                                        )}
                                    >
                                        <Icon className="size-4" />
                                        {label}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
