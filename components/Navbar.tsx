// import React from "react";
// import Container from "./Container";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { AlignJustify } from "lucide-react";
// import Sidebar from "./Sidebar";
// import { usePathname } from "next/navigation";
// import Logo from "./Logo";
// import { useSession, signIn } from "next-auth/react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// const Navbar = () => {
//     const pathname = usePathname();
//     const { data: session, status } = useSession();

//     return (
//         <nav className="text-primary py-2 fixed z-10 min-w-full border-b bg-background/20 backdrop-blur-md w-full">
//             <Container>
//                 <div className="flex items-center justify-between">
//                     {session ? (
//                         // User is signed in
//                         <>
//                             <Sidebar />
//                             <div className="flex items-center gap-4">
//                                 {pathname === "/dashboard" ? (
//                                     <Link href="/feed">
//                                         <Button variant="outline" className="text-foreground hover:text-foreground">
//                                             Feed
//                                         </Button>
//                                     </Link>
//                                 ) : (
//                                     <Link href="/dashboard">
//                                         <Button variant="outline" className="text-foreground hover:text-foreground">
//                                             Dashboard
//                                         </Button>
//                                     </Link>
//                                 )}
//                                 {/* You can add a user avatar or menu here */}
//                                 <Avatar>
//                                     <AvatarImage src={session.user?.avatar} alt={session.user?.username} />
//                                     <AvatarFallback>{session.user?.username?.charAt(0) || "U"}</AvatarFallback>
//                                 </Avatar>
//                             </div>
//                         </>
//                     ) : (
//                         // User is signed out
//                         <Logo />
//                     )}
//                 </div>
//             </Container>
//         </nav>
//     );
// };

// export default Navbar;
