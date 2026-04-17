import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";

const AppLayout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <Navbar />
            <div className="grow pt-24">{children}</div>
        </>
    );
};

export default AppLayout;
