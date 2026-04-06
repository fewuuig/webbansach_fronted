import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type AppTheme = "light" | "dark";
export type AppLanguage = "vi" | "en";

interface AppSettingsContextValue {
    theme: AppTheme;
    setTheme: (theme: AppTheme) => void;
    language: AppLanguage;
    setLanguage: (language: AppLanguage) => void;
}

const AppSettingsContext = createContext<AppSettingsContextValue | undefined>(undefined);

export const AppSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<AppTheme>("light");
    const [language, setLanguage] = useState<AppLanguage>("vi");

    useEffect(() => {
        const savedTheme = localStorage.getItem("app-theme");
        const savedLanguage = localStorage.getItem("app-language");

        if (savedTheme === "light" || savedTheme === "dark") {
            setTheme(savedTheme);
        }

        if (savedLanguage === "vi" || savedLanguage === "en") {
            setLanguage(savedLanguage);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("app-theme", theme);
        document.body.classList.remove("app-theme-light", "app-theme-dark");
        document.body.classList.add(theme === "dark" ? "app-theme-dark" : "app-theme-light");
    }, [theme]);

    useEffect(() => {
        localStorage.setItem("app-language", language);
        document.documentElement.lang = language;
    }, [language]);

    const value = useMemo(() => ({
        theme,
        setTheme,
        language,
        setLanguage
    }), [theme, language]);

    return (
        <AppSettingsContext.Provider value={value}>
            {children}
        </AppSettingsContext.Provider>
    );
};

export const useAppSettings = () => {
    const context = useContext(AppSettingsContext);

    if (!context) {
        throw new Error("useAppSettings must be used within AppSettingsProvider");
    }

    return context;
};
