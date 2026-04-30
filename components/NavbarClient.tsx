"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LogOut, Radio, Settings, ShieldUser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export type NavbarUser = {
    image?: string | null;
    name?: string | null;
    role?: string | null;
};

export type NavbarLink = {
    href: string;
    icon: "feed" | "dashboard" | "profile" | "admin";
    label: string;
};

const iconMap = {
    admin: ShieldUser,
    dashboard: LayoutDashboard,
    feed: Radio,
    profile: Settings,
} as const;

type NavbarClientProps = {
    links: NavbarLink[];
    mobile?: boolean;
    user: NavbarUser | null;
};

const NavbarClient = ({ links, mobile = false, user }: NavbarClientProps) => {
    const pathname = usePathname();
    const isAdmin = user?.role === "admin";

    if (mobile) {
        return (
            <div className="flex items-center gap-1 overflow-x-auto py-2">
                {links.map(({ href, icon, label }) => {
                    const Icon = iconMap[icon];
                    const isActive = pathname === href;

                    return (
                        <Link key={href} href={href} className="shrink-0">
                            <span className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground", isActive && "bg-muted text-foreground")}>
                                <Icon className="size-4" />
                                {label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        );
    }

    return (
        <>
            <nav className="hidden items-center gap-1 md:flex">
                {links.map(({ href, icon, label }) => {
                    const Icon = iconMap[icon];
                    const isActive = pathname === href;

                    return (
                        <Link key={href} href={href}>
                            <span className={cn("inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground", isActive && "bg-muted text-foreground")}>
                                <Icon className="size-4" />
                                {label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            <div className="flex items-center gap-2">
                {user ? (
                    <>
                        <div className="hidden items-center gap-3 md:flex">
                            <div className="text-right">
                                <p className="text-sm font-medium text-foreground">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{isAdmin ? "Admin" : "Member"}</p>
                            </div>
                            <Avatar size="lg">
                                <AvatarImage src={user.image || ""} alt={user.name ?? undefined} />
                                <AvatarFallback>{user.name?.charAt(0) || "S"}</AvatarFallback>
                            </Avatar>
                            <Button variant="outline" onClick={() => authClient.signOut()}>
                                <LogOut />
                                Sign out
                            </Button>
                        </div>

                        <Link href="/dashboard" className="md:hidden">
                            <Avatar>
                                <AvatarImage src={user.image || ""} alt={user.name ?? undefined} />
                                <AvatarFallback>{user.name?.charAt(0) || "S"}</AvatarFallback>
                            </Avatar>
                        </Link>
                    </>
                ) : (
                    <Link href="/">
                        <Button variant="outline">Home</Button>
                    </Link>
                )}
            </div>
        </>
    );
};

export default NavbarClient;
