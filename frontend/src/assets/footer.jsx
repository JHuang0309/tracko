import { useEffect, useState } from 'react';
import { Link  } from 'react-router-dom'; 
export default function Footer({ isDarkMode }) {
  const [darkMode, setDarkMode] = useState(isDarkMode);
  useEffect(() => {
    setDarkMode(isDarkMode);
  }, [isDarkMode]);
  const currentYear = new Date().getFullYear()

  return (
    <footer className={`bottom-0 w-full border-t py-12 ${darkMode ? 'border-gray-600 bg-gray-950' : 'border-gray-200 bg-white'}`}>
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-4 gap-6 pb-6">
          <div className="space-y-4">
            <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-neutral-900'}`}>TrackX Platform</h3>
            <p className="text-xs text-gray-500">
              Take control of your personal finances with intelligent expense tracking, budgeting tools, and
              personalized insights to help you achieve your financial goals.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-neutral-900'}`}>Product</h3>
            <nav aria-label="Product Navigation">
              <ul className="space-y-1 text-xs">
                <li>
                  <a href="#features" className="text-gray-500 hover:text-neutral-700 rounded py-1 inline-block">Features</a>
                </li>
                <li>
                  <a href="#security" className="text-gray-500 hover:text-neutral-700 rounded py-1 inline-block">Security</a>
                </li>
                <li>
                  <a href="#enterprise" className="text-gray-500 hover:text-neutral-700 rounded py-1 inline-block">Enterprise</a>
                </li>
                <li>
                  <a href="#government" className="text-gray-500 hover:text-neutral-700 rounded py-1 inline-block">Government</a>
                </li>
              </ul>
            </nav>
          </div>
          <div className="space-y-4">
            <h3 className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-neutral-900'}`}>Resources</h3>
            <nav aria-label="Resources Navigation">
              <ul className="space-y-1 text-xs">
                <li>
                  <a href="#documentation" className="text-gray-500 hover:text-neutral-700 rounded py-1 inline-block">Documentation</a>
                </li>
                <li>
                  <a href="#case-studies" className="text-gray-500 hover:text-neutral-700 rounded py-1 inline-block">Case Studies</a>
                </li>
                <li>
                  <a href="#blog" className="text-gray-500 hover:text-neutral-700 rounded py-1 inline-block">Blog</a>
                </li>
                <li>
                  <a href="#support" className="text-gray-500 hover:text-neutral-700 rounded py-1 inline-block">Support</a>
                </li>
              </ul>
            </nav>
          </div>
          <div className="space-y-4">
            <h3 className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-neutral-900'}`}>Company</h3>
            <nav aria-label="Company Navigation">
              <ul className="space-y-1 text-xs">
                <li>
                  <a href="#about" className="text-gray-500 hover:text-neutral-700 rounded py-1 inline-block">About</a>
                </li>
                <li>
                  <a href="#careers" className="text-gray-500 hover:text-neutral-700 rounded py-1 inline-block">Careers</a>
                </li>
                <li>
                  <a href="#contact" className="text-gray-500 hover:text-neutral-700 rounded py-1 inline-block">Contact</a>
                </li>
                <li>
                  <a href="#privacy-policy" className="text-gray-500 hover:text-neutral-700 rounded py-1 inline-block">Privacy Policy</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <div className={`mt-12 pt-6 border-t flex flex-row justify-between items-center gap-4 ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
          <p className="text-xs text-gray-500">© {currentYear} TrackX. All rights reserved.</p>
          <div className="flex gap-4">
            {/* Social links */}
            <a
              href="https://www.linkedin.com/in/JaydenHuang1"
              className="text-gray-500 hover:text-neutral-700 rounded p-2"
              target="_blank"
              rel="noopener noreferrer" 
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect width="4" height="12" x="2" y="9"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
            <a 
              href="https://github.com/JHuang0309" 
              className="text-gray-500 hover:text-neutral-700 rounded p-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                <path d="M9 18c-4.51 2-5-2-7-2"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
