import { useState, useEffect } from 'react'
import { useNavigate  } from 'react-router-dom'; 

import CsvDropZone from '../assets/CsvDropZone';
import Navbar from '../assets/navbar';
import Footer from '../assets/footer';

function LandingPage() {
    const [fileReady, setFileReady] = useState(false);
    const [csvFile, setCsvFile] = useState(null);

    const navigate = useNavigate();

    const handleFileInput = (file) => {
        setFileReady(true)
        setCsvFile(file)
    }

    const buttonHandle = () => {
        navigate('/dashboard', { state: { file: csvFile } });
        // navigate to dashbord
        // on dashboard, useeffect the upload
    }

    useEffect(() => {
        localStorage.removeItem('lastUploadedFileContent');
        localStorage.removeItem('lastUploadedFileName');
    }, [])

    return (
        <>
            <div className="flex min-h-screen flex-col">
                <Navbar />
                <div className='flex flex-col'>
                    <section className='flex flex-col items-center text-center'>
                    <div className='rounded-md px-3 py-1 bg-gray-100 text-sm'>Financial Management</div>
                    <h1 className='text-5xl font-bold'>Take Control of Your Expenses Now</h1>
                    <p className='text-xl text-gray-500'>Create a snapshot of your current financial situation to track your spending and ongoing expenses</p>
                    </section>
                    <section className='flex flex-col items-center text-center'>
                        <div className='rounded-md px-3 py-1 bg-blue-600 text-sm text-white'>Features</div>
                        <h1 className='text-5xl font-bold'>Personal Finance Tracker</h1>
                        <p className='text-xl text-gray-500'>Take control of your finances with powerful tracking and insights tools designed for personal use.</p>
                    </section>
                </div>
                <Footer />
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

