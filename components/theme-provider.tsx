"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

const getSystemTheme = () => (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

export function ThemeProvider({ children }: { children: ReactNode }) {
    useEffect(() => {
        const root = document.documentElement;
        const storedTheme = localStorage.getItem("theme");
        const theme = storedTheme === "system" ? getSystemTheme() : storedTheme === "light" || storedTheme === "dark" ? storedTheme : "dark";

        root.classList.remove("light", "dark");
        root.classList.add(theme);

        root.style.colorScheme = theme;
    }, []);

    return <>{children}</>;
}
