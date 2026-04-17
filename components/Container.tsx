import React from "react";

const Container = ({ children }: { children: React.ReactNode }) => {
    return <div className="mx-auto w-[min(1120px,94%)]">{children}</div>;
};

export default Container;
