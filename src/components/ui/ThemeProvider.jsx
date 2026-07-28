import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null); // shared space

const getInitialTheme = () => {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem("devcollab-theme"); // checks in locastorage
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; //returns theme that OS currently using
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);  //we get initial theme using above function


  // whenever we click theme toggle button ,this will run (It is just for adding and removing dark class in classList so that it can apply respective Tailwind)
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("devcollab-theme", theme);
  }, [theme]); 

  // Keep theme in sync if system preference changes and user hasn't explicitly set one
  // this useEffect only runs once ,if user has not selected theme and user changed theme preference in browser setting while application is running then this will be executed
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (event) => {
      const stored = localStorage.getItem("devcollab-theme");
      if (!stored) {
        setTheme(event.matches ? "dark" : "light");
      }
    };
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []); 

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme((prev) => (prev === "dark" ? "light" : "dark")),
      setTheme,
    }),
    [theme] // returns prev stored result if theme has not changed
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;// here is the provider for the context
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
