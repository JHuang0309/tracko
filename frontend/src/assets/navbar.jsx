import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'

export default function Navbar({ toggleTheme, isDarkMode }) {
    const [darkMode, setDarkMode] = useState(isDarkMode);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        setDarkMode(isDarkMode);
    }, [isDarkMode]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

  return (
    <header
      className={`sticky-top w-full border-b transition-colors duration-300 ${scrolled
  ? (darkMode
      ? "bg-dark-blue bg-opacity-80 border-neutral-600"
      : "bg-white bg-opacity-80 border-gray-200")
  : (darkMode
      ? "bg-dark-blue border-neutral-600"
      : "bg-white border-gray-200")}`}
      style={{ backdropFilter: scrolled ? "blur(8px)" : "none" }}
    >
      <div className="container flex h-16 items-center justify-between px-[2rem]">
        <div className="flex items-center">
          <span className={`text-2xl font-bold ${darkMode ? 'text-white' : ''}`}>TrackX</span>
        </div>
        <div className={`flex items-center justify-center h-10 w-10 rounded-full ${darkMode ? 'hover:bg-neutral-700' : 'hover:bg-gray-100'} transition duration-300`}>
          <button
            onClick={toggleTheme}
            className="p-1"
          >
            {!darkMode ? (
              <SunIcon className="h-5 w-5 text-gray-900" />
            ) : (
              <MoonIcon className="h-5 w-5 text-gray-100" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
