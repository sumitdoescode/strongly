import type { ReactNode } from "react";

const Container = ({ children }: { children: ReactNode }) => {
    return <div className="mx-auto w-[min(1120px,94%)]">{children}</div>;
};

export default Container;
