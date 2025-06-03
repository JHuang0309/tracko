import { useState, useEffect } from 'react'
import { useNavigate  } from 'react-router-dom'; 

import CsvDropZone from '../assets/CsvDropZone';
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
    }, [])

    return (
        <>
            <div className={`flex min-h-screen flex-col ${isDarkMode ? 'bg-dark-blue' : 'bg-white'}`}>
                <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode}/>
                <section className={`flex flex-col items-center text-center py-18 bg-gradient-radial ${isDarkMode ? 'from-dark-blue-900 via-dark-blue-800 to-dark-blue-700' : 'from-blue-400/40 via-blue-200/30 to-white/80'} gradient-center-top`}>
                    <div className={`rounded-md px-3 py-1 text-sm mb-6 bg-opacity-60 ${isDarkMode ? 'text-white bg-neutral-700' : 'text-gray-900 bg-blue-100'}`}>Financial Management</div>
                    <h1 className={`text-5xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Take Control of Your Expenses Now</h1>
                    <p className={`text-xl ${isDarkMode ? 'text-blue-200' : 'text-gray-500'} w-35 mb-10`}>Create a snapshot of your current financial situation to track your spending and ongoing expenses</p>
                    <CsvDropZone onFile={(file) => handleFileInput(file)} buttonHandle={buttonHandle} isDarkMode={isDarkMode}/>
                </section>
                {/* <section className='flex flex-col items-center text-center py-20'>
                    <div className='rounded-md px-3 py-1 bg-blue-600 text-sm text-white'>Features</div>
                    <h1 className='text-5xl font-bold'>Personal Finance Tracker</h1>
                    <p className='text-xl text-gray-500'>Take control of your finances with powerful tracking and insights tools designed for personal use.</p>
                </section> */}
                <Footer isDarkMode={isDarkMode}/>
            </div>
            
            {/* <div className='min-h-screen bg-gradient-to-b from-neutral-900 via-background to-gray-900
                flex flex-col items-center justify-center text-center px-[10rem]
            '>
                <div className='mx-auto mx-auto max-w-4xl'>
                    <h1 className="text-4xl font-semibold text-white lg:text-5xl">
                    Welcome to <span 
                        className=" bg-clip-text text-transparent"
                        style={{ backgroundImage: 'linear-gradient(to right, #560bad, #7209b7, #b5179e)' }}
                        >Tracko</span>
                    </h1>

                    <h3 className="mt-10 text-2xl font-semibold text-gray-100">
                        Your personal finance tracker
                    </h3>

                    <p className="mt-4 text-gray-100">Drop in your .csv file and watch your weekly and monthly spending come to life with vibrant visuals and insights</p>
                </div>

                <div className='mt-10'>
                    <CsvDropZone onFile={(file) => handleFileInput(file)} />
                    {fileReady && (
                        <button
                        className="
                          px-6 py-3 mt-8 rounded-lg border border-white text-white
                          bg-transparent
                          hover:text-white font-semibold
                          transition-colors duration-300
                          hover:ring-4 hover:ring-primary1 hover:ring-opacity-60
                          focus:outline-none focus:ring-4 focus:ring-primary1 focus:ring-opacity-70
                        "
                        onClick={buttonHandle}
                      >
                        Track and Visualise
                      </button>
                      
                    )}
                </div>
            </div> */}
        </>
    );
}

export default LandingPage

