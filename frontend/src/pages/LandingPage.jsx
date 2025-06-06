import { useState, useEffect } from 'react'
import { useNavigate  } from 'react-router-dom'; 

import CsvDropZone from '../assets/utils/CsvDropZone';
import Navbar from '../assets/navbar';
import Footer from '../assets/footer';

function LandingPage() {
    const [fileReady, setFileReady] = useState(false);
    const [csvFile, setCsvFile] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false)

    const navigate = useNavigate();

    const handleFileInput = (file) => {
        setFileReady(true)
        setCsvFile(file)
    }

    const buttonHandle = () => {
        navigate('/dashboard', { state: { file: csvFile } });
    }

    // Toggle theme and update localStorage and document class
    const toggleTheme = () => {
        const theme = !isDarkMode;
        setIsDarkMode(theme);
        if (theme) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    }

    // On mount, set theme from localStorage and apply to document
    useEffect(() => {
        const theme = localStorage.getItem('theme');
        if (theme === 'dark') {
            setIsDarkMode(true);
        } else {
            setIsDarkMode(false);
        }
    }, []);

    useEffect(() => {
        localStorage.removeItem('lastUploadedFileContent');
        localStorage.removeItem('lastUploadedFileName');
        window.scrollTo(0, 0);
    }, [])

    return (
        <>
            <div className={`flex min-h-screen flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
                <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode}/>
                <section className={`flex flex-col items-center text-center py-18 bg-gradient-radial ${isDarkMode ? 'from-dark-blue-900 via-dark-blue-800 to-dark-blue-700' : 'from-blue-400/40 via-blue-200/30 to-white/80'} gradient-center-top`}>
                    <div className={`rounded-md px-3 py-1 text-sm mb-6 bg-opacity-60 ${isDarkMode ? 'text-white bg-neutral-700' : 'text-gray-900 bg-blue-100'}`}>Financial Management</div>
                    <h1 className={`text-5xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Take Control of Your Expenses Now</h1>
                    <p className={`text-xl ${isDarkMode ? 'text-blue-200' : 'text-gray-500'} w-35 mb-10`}>Create a snapshot of your current financial situation to track your spending and ongoing expenses</p>
                    <CsvDropZone onFile={(file) => handleFileInput(file)} buttonHandle={buttonHandle} isDarkMode={isDarkMode}/>
                </section>
                <Footer isDarkMode={isDarkMode}/>
            </div>
            
        </>
    );
}

export default LandingPage

