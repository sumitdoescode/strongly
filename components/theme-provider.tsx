"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

type Theme = "light" | "dark";
type RequestedTheme = Theme | "system";

type ThemeProviderProps = {
    children: ReactNode;
    attribute?: "class" | `data-${string}`;
    defaultTheme?: RequestedTheme;
    enableSystem?: boolean;
    storageKey?: string;
    disableTransitionOnChange?: boolean;
};

const getSystemTheme = () => (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

export function ThemeProvider({ children, attribute = "class", defaultTheme = "dark", enableSystem = true, storageKey = "theme" }: ThemeProviderProps) {
    useEffect(() => {
        const root = document.documentElement;
        const storedTheme = localStorage.getItem(storageKey) as RequestedTheme | null;
        const theme = storedTheme ?? defaultTheme;
        const resolvedTheme: Theme = theme === "system" ? (enableSystem ? getSystemTheme() : "dark") : theme;

        if (attribute === "class") {
            root.classList.remove("light", "dark");
            root.classList.add(resolvedTheme);
        } else {
            root.setAttribute(attribute, resolvedTheme);
        }

        root.style.colorScheme = resolvedTheme;
    }, [attribute, defaultTheme, enableSystem, storageKey]);

    return <>{children}</>;
}
