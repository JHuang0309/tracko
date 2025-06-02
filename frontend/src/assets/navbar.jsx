import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const handleScroll = () => {
        setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        // Set initial theme based on prefers-color-scheme or localStorage
        const storedTheme = localStorage.getItem('theme');
        let initialTheme = 'light';
        if (storedTheme) {
            initialTheme = storedTheme;
        }
        setTheme(initialTheme);
        document.documentElement.classList.toggle('dark', initialTheme === 'dark');
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        console.log(newTheme)
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-gray-200 transition-colors duration-300 ${scrolled ? "bg-transparent" : "bg-white"}`}
      style={{ backdropFilter: scrolled ? "blur(8px)" : "none" }}
    >
      <div className="container flex h-16 items-center justify-between px-[2rem]">
        <div className="flex items-center">
          <span className="text-2xl font-bold dark:text-white">TrackX</span>
        </div>
        <div className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-300">
          <button
            onClick={toggleTheme}
            className="p-1"
          >
            {theme === 'light' ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5 text-gray-300" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
