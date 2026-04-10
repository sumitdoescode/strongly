import React from "react";

const Container = ({ children }: { children: React.ReactNode }) => {
    return <div className="container mx-auto w-[95%]">{children}</div>;
};

export default Container;
