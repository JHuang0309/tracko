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
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      initialTheme = prefersDark ? 'dark' : 'light';
    }
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-gray-200 transition-colors duration-300 ${scrolled ? "bg-transparent" : "bg-white"}`}
      style={{ backdropFilter: scrolled ? "blur(8px)" : "none" }}
    >
      <div className="container mx-auto flex h-16 items-center justify-between p-4 px-[2rem]">
        <div className="flex items-center">
          <span className="text-2xl font-bold">TrackX</span>
        </div>
        <div className="flex items-center">
          <button
            onClick={toggleTheme}
            className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <SunIcon className="h-5 w-5 text-yellow-500" />
            ) : (
              <MoonIcon className="h-5 w-5 text-gray-300" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
