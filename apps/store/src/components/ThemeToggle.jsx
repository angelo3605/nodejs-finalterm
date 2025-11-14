import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa6";
import clsx from "clsx";

const THEME_KEY = "mint-boutique-theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY));
  const [spin, setSpin] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      localStorage.setItem(THEME_KEY, "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem(THEME_KEY, "light");
    }
  }, [theme]);

  const handleClick = () => {
    setSpin(true);
    setTheme(theme === "dark" ? "light" : "dark");
    setTimeout(() => setSpin(false), 500);
  };

  return (
    <button className="group btn btn-outline-light btn-jump" onClick={handleClick}>
      <span className={clsx("*:size-5", spin && "animate-[spin_500ms_ease-in-out_forwards]")}>{theme === "dark" ? <FaMoon className="text-teal-200" /> : <FaSun className="text-orange-200" />}</span>
    </button>
  );
}
