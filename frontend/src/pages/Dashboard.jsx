import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { Download } from 'lucide-react';
import axios from 'axios';
import '../index.css'

// JSX component imports
import SummaryChart from '../assets/charts/SummaryChart';
import NetIncomeChart from '../assets/charts/NetIncomeChart';
import AvgWeeklyExpChart from '../assets/charts/AvgWeeklyExpChart';
import ChartDropdown from '../assets/ChartDropdown';
import Navbar from '../assets/navbar';
import MonthlyExpList from '../assets/MonthlyExpList';
import ExpByCategoryCard from '../assets/ExpByCategoryCard';
import MonthSnapshot from '../assets/MonthSnapshot';
import Footer from '../assets/footer';

const API_URL = import.meta.env.VITE_API_URL;

function Dashboard() {
    const location = useLocation();
    const [csvFile, setCsvFile] = useState(null);

    const [weeklyIncome, setWeeklyIncome] = useState(() => {
        const saved = localStorage.getItem('weeklyIncome');
        return saved ? Number(saved) : 0.0;
    });
    const [exTarget, setExTarget] = useState(() => {
        const saved = localStorage.getItem('exTarget');
        return saved ? Number(saved) : 0.0;
    });
 
    const [chartView, setChartView] = useState('summary') // 'summary', 'netIncome', or 'avgWeekly'
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [summary, setSummary] = useState(null);
    // summary data structure
    // {
    //     weekly: {
    //         05 May 2025: 374.46,
    //         ...
    //     }
    //     monthly: {
    //         April 2025: 1018.71,
    //         ...
    //     }
    //     records: [
    //         {
    //             Date: "2025-05-19T00:00:00",
    //             Category: "Beem Debit",
    //             Amount: 9,
    //             Month: "May 2025",
    //         },
    //         ...
    //     ]
    // }
    const [expByMonth, setExpByMonth] = useState({});

    const MAX_WEEKLY_INCOME = 5000
    const percentage = (weeklyIncome / MAX_WEEKLY_INCOME) * 100;
    const exTargetPercentage = (exTarget / MAX_WEEKLY_INCOME) * 100;

    useEffect(() => {
        const savedFileContent = localStorage.getItem('lastUploadedFileContent');
        const savedFileName = localStorage.getItem('lastUploadedFileName');
      
        if (savedFileContent && savedFileName) {
          // Convert back to a "File-like" object if needed (e.g., for parsing CSV again)
          const restoredFile = new File([savedFileContent], savedFileName, { type: 'text/csv' });
          setCsvFile(restoredFile);
        } else {
            const input_file = location.state?.file;
            setCsvFile(input_file)
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('weeklyIncome', weeklyIncome);
    }, [weeklyIncome]);

    useEffect(() => {
        localStorage.setItem('exTarget', exTarget);
    }, [exTarget]);

    useEffect(() => {
        const theme = localStorage.getItem('theme');
        if (theme === 'dark') {
            setIsDarkMode(true);
        } else {
            setIsDarkMode(false);
        }
    }, []);

    useEffect(() => {
        if (csvFile) {
            handleUpload(csvFile)
          } else {
            // maybe redirect back to LandingPage or show a message
            console.log('No file received');
          }
    }, [csvFile]);

    const toggleTheme = () => {
        const theme = !isDarkMode;
        setIsDarkMode(theme);
        if (theme) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    }

    // const fetchTopExpenses = async () => {
    //     try {
    //         const res = await axios.get(`${API_URL}/top_expenses_by_month`);
    //     } catch (err) {
    //         console.error("Failed to fetch top expenses", err);
    //     }
    // };

    const fetchExpensesByMonth = async () => {
        try {
            const response = await axios.get(`${API_URL}/cleaned_expenses`);
            const arr = response.data;
            const months = [...new Set(arr.map(item => item.Month))];
            const result = {};
            months.forEach(month => {
                const monthExpenses = arr.filter(item => item.Month === month);
                const numExpenses = monthExpenses.length;
                const total = monthExpenses.reduce((sum, item) => sum + item.Amount, 0);

                const categoryTotals = {};
                monthExpenses.forEach(item => {
                    if (!categoryTotals[item.Category]) {
                        categoryTotals[item.Category] = 0;
                    }
                    categoryTotals[item.Category] += item.Amount;
                });
                // Find top category (category with max total amount)
                let topCategory = null;
                let maxCategoryTotal = -Infinity;
                for (const [category, catTotal] of Object.entries(categoryTotals)) {
                    if (catTotal > maxCategoryTotal) {
                        maxCategoryTotal = catTotal;
                        topCategory = category;
                    }
                }
                // If month is in the format YYYY-MM change to May 2025 (full format)
                let displayMonth = month;
                const match = month.match(/^(\d{4})-(\d{2})$/);
                if (match) {
                    const [_, year, monthNum] = match;
                    const date = new Date(`${year}-${monthNum}-01`);
                    const monthName = date.toLocaleString('default', { month: 'long' });
                    displayMonth = `${monthName} ${year}`;
                }
                result[displayMonth] = {
                    numExpenses,
                    total,
                    topCategory,
                    maxCategoryTotal,
                    spendingCategories: categoryTotals,
                };
            });
            return result;
        } catch {
            alert("Error obtaining monthly expenditure data");
        }
    }


    const handleUpload = async (file) => {

        if (!file) return;
        const formData = new FormData();
        formData.append("file", file); // wrap csv file in a form object to send via HTTP

        localStorage.setItem('lastUploadedFileName', file.name);
        const reader = new FileReader();
        reader.onload = () => {
            localStorage.setItem('lastUploadedFileContent', reader.result); // base64 or raw text
        };
        reader.readAsText(file);

        try {
            const response = await axios.post(`${API_URL}/upload`, formData, {
                headers: {"Content-Type": "multipart/form-data"},
            });
            setSummary(response.data);
            const monthExpData = await fetchExpensesByMonth()
            setExpByMonth(monthExpData);
        } catch (err) {
            alert("Error uploading file");
        }
    };

    const handleDownload = async () => {
        if (!csvFile) return;
        try {
            const response = await axios.get(`${API_URL}/download_cleaned_csv`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'cleaned_expenses.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            alert("Failed to download CSV.");
        }
    };

    return (
        <>
            <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode}/>
            <div className='flex flex-col'>
            <div className={`flex justify-between items-center p-4 ${isDarkMode ? 'bg-neutral-900' : ''}`}>
                <div>
                    <h2 className={`font-bold text-4xl pl-3 ${isDarkMode ? 'text-white' : ''}`}>Dashboard</h2>
                    <p className={`pl-3 mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Overview of your spending and net revenue</p>
                </div>
                
                <button 
                    className={`flex items-center gap-2 p-2 h-10 mx-2 text-xs rounded-md border   disabled:opacity-50
                                ${isDarkMode ? 'text-white hover:bg-neutral-800' : 'text-black hover:bg-gray-100'}`}
                    onClick={handleDownload}
                    disabled={!csvFile}
                    >
                    <Download className="w-4 h-4" />
                    Export Expense Data
                </button>
            </div>
            <div className={`flex min-h-screen p-4 transition-colors duration-300 pd-8 ${isDarkMode ? 'bg-neutral-900' : ''}`}>  
                <div className="flex mx-auto grid grid-rows-2 gap-6">
                    {/* Row 1 */}
                    <div className="grid grid-cols-5 gap-2">
                        {/* Monthly expenses card */}
                        <div className={`col-span-1 rounded-lg border p-4 flex flex-col ${isDarkMode ? 'border-neutral-600' : ''}`}>
                            <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : ''}`}>Monthly Expenditure</h2>
                            {Object.keys(expByMonth).length > 0 && <MonthlyExpList data={expByMonth} isDarkMode={isDarkMode}/>}
                        </div>
                        
                        {/* Large chart card */}
                        <div className={`col-span-3 rounded-lg p-4 border ${isDarkMode ? 'border-neutral-600' : ''}`}>
                            <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : ''}`}>Visualisations</h2>
                                <div className={`flex justify-end my-4`}>
                                    <ChartDropdown
                                        chartView={chartView}
                                        setChartView={setChartView}
                                        isDarkMode={isDarkMode}
                                    />
                                </div>
                                {chartView === 'summary' && summary?.monthly && summary?.weekly && (
                                    <SummaryChart 
                                        monthly={summary.monthly}
                                        weekly={summary.weekly}
                                        weeklyIncome={weeklyIncome}
                                        expTarget={exTarget}
                                        darkMode={isDarkMode}
                                    />
                                )}
                                {chartView === 'netIncome' && summary?.weekly && (
                                    <NetIncomeChart 
                                        weekly={summary.weekly }
                                        weeklyIncome={weeklyIncome}
                                        darkMode={isDarkMode}
                                    />
                                )}
                                {chartView === 'avgWeekly' && summary?.weekly && (
                                    <AvgWeeklyExpChart 
                                        weekly={summary.weekly}
                                        labels={Object.keys(summary.weekly)}
                                        darkMode={isDarkMode}
                                    />
                                )}
                        </div>

                        {/* Stack of smaller cards */}
                        <div className="col-span-1 grid grid-rows-3 gap-2">
                            {/* Income input card */}
                            <div className={`flex flex-col rounded-lg p-4 border ${isDarkMode ? 'border-neutral-600' : ''}`}>
                                <h3 className={`text-sm font-medium ${isDarkMode ? 'text-white' : ''}`}>Weekly Income</h3>
                                <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Adjust your weekly income using the slider below:
                                </p>

                                {/* Income Display */}
                                <input
                                    type="number"
                                    className={`text-4xl font-semibold mb-3 max-w-sm appearance-none outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 hover:ring-0 hover:ring-offset-0 border-0 bg-transparent ${
                                        weeklyIncome > 0 ? (isDarkMode ? 'text-[#e3f0fd]' : 'text-blue-600') : 'text-gray-500'
                                    }`}
                                    value={weeklyIncome === 0 ? '' : weeklyIncome}
                                    placeholder="0"
                                    min={0}
                                    onChange={e => {
                                        const val = e.target.value;
                                        setWeeklyIncome(val === '' ? 0 : Math.max(0, Number(val)));
                                    }}
                                    style={{
                                        boxShadow: 'none',
                                        MozBoxShadow: 'none',
                                        WebkitBoxShadow: 'none',
                                        outline: 'none',
                                        border: 'none',
                                        background: 'transparent',
                                        // Remove number input arrows
                                        MozAppearance: 'textfield',
                                    }}
                                    // Remove number input arrows for Chrome/Safari
                                    onWheel={e => e.target.blur()}
                                />
                                <style>{`
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
`}</style>
                                {/* Slider */}
                                <input
                                    type="range"
                                    min="0"
                                    max={MAX_WEEKLY_INCOME}
                                    step="50"
                                    value={weeklyIncome}
                                    onChange={(e) => setWeeklyIncome(Number(e.target.value))}
                                    style={{
                                        background: `linear-gradient(to right, #3B82F6 ${percentage}%, #E5E7EB ${percentage}%)`
                                    }}
                                    className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer 
                                                [&::-webkit-slider-thumb]:appearance-none
                                                [&::-webkit-slider-thumb]:w-4
                                                [&::-webkit-slider-thumb]:h-4
                                                [&::-webkit-slider-thumb]:bg-white
                                                [&::-webkit-slider-thumb]:rounded-md
                                                [&::-webkit-slider-thumb]:border
                                                [&::-webkit-slider-thumb]:border-blue-400
                                                [&::-webkit-slider-thumb]:shadow
                                                [&::-webkit-slider-thumb]:cursor-pointer
                                    "
                                />
                            </div>
                            {/* Monthly expenditure target card */}
                            <div className={`flex flex-col rounded-lg p-4 border ${isDarkMode ? 'border-neutral-600' : ''}`}>
                                <h3 className={`text-sm font-medium ${isDarkMode ? 'text-white' : ''}`}>Monthly Expenditure Target</h3>
                                <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Adjust your monthly expenditure target using the slider below:
                                </p>

                                {/* Target Display */}
                                <input
                                    type="number"
                                    className={`text-4xl font-semibold mb-4 max-w-sm appearance-none outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 hover:ring-0 hover:ring-offset-0 border-0 bg-transparent ${
                                        exTarget > 0 ? (isDarkMode ? 'text-[#fef3c7]' : 'text-[#f59e42]') : 'text-gray-500'
                                    }`}
                                    value={exTarget === 0 ? '' : exTarget}
                                    placeholder="0"
                                    min={0}
                                    onChange={e => {
                                        const val = e.target.value;
                                        setExTarget(val === '' ? 0 : Math.max(0, Number(val)));
                                    }}
                                    style={{
                                        boxShadow: 'none',
                                        MozBoxShadow: 'none',
                                        WebkitBoxShadow: 'none',
                                        outline: 'none',
                                        border: 'none',
                                        background: 'transparent',
                                        // Remove number input arrows
                                        MozAppearance: 'textfield',
                                    }}
                                    // Remove number input arrows for Chrome/Safari
                                    onWheel={e => e.target.blur()}
                                />
                                <style>{`
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
`}</style>

                                {/* Ex Target Slider */}
                                <input
                                    type="range"
                                    min="0"
                                    max={MAX_WEEKLY_INCOME}
                                    step="50"
                                    value={exTarget}
                                    onChange={(e) => setExTarget(Number(e.target.value))}
                                    style={{
                                        background: `linear-gradient(to right, #f59e42 ${exTargetPercentage}%, #E5E7EB ${exTargetPercentage}%)`
                                    }}
                                    className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer 
                                                [&::-webkit-slider-thumb]:appearance-none
                                                [&::-webkit-slider-thumb]:w-4
                                                [&::-webkit-slider-thumb]:h-4
                                                [&::-webkit-slider-thumb]:bg-white
                                                [&::-webkit-slider-thumb]:rounded-md
                                                [&::-webkit-slider-thumb]:border
                                                [&::-webkit-slider-thumb]:border-[#f59e42]
                                                [&::-webkit-slider-thumb]:shadow
                                                [&::-webkit-slider-thumb]:cursor-pointer
                                    "
                                />
                            </div>
                            {/* New csv file input card  */}
                            <div
                                className={`flex flex-col rounded-lg p-4 border ${isDarkMode ? 'border-neutral-600' : ''}`}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                e.preventDefault();
                                const file = e.dataTransfer.files[0];
                                if (file && file.name.endsWith('.csv')) {
                                    setCsvFile(file);
                                }
                                }}
                            >
                                <h3 className={`text-sm font-medium ${isDarkMode ? 'text-white' : ''}`}>Visualise another dataset</h3>
                                <p className={`text-xs mb-3 mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Drop a CSV file below or click to upload</p>

                                <label
                                    htmlFor="csvUpload"
                                    className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 text-sm cursor-pointer transition ${
                                        isDarkMode ? 'border-gray-600 text-white hover:bg-neutral-800' : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                {/* <svg className="w-6 h-4 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg> */}
                                <span className='text-xs'>Click to upload .csv</span>
                                <input
                                    id="csvUpload"
                                    type="file"
                                    accept=".csv"
                                    className={`hidden`}
                                    onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file && file.name.endsWith('.csv')) {
                                        setCsvFile(file);
                                    }
                                    }}
                                />
                                </label>
                                {csvFile && (
                                    <p className="mt-3 text-xs italic text-gray-500 truncate" title={csvFile.name}>
                                    Uploaded file: <span className="font-medium">{csvFile.name}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div className="max-h-[40rem] grid grid-cols-3 gap-4">
                        <div className={`col-span-2 rounded-lg p-4 border ${isDarkMode ? 'border-gray-600' : ''}`}>
                            <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : ''}`}>Expenditure by Category</h2>
                            {summary && Object.keys(summary).length > 0 && (
                                <ExpByCategoryCard data={expByMonth} isDarkMode={isDarkMode} />
                            )}
                        </div>
                        <div className={`col-span-1 rounded-lg p-4 border overflow-x-auto  ${isDarkMode ? 'border-gray-600' : ''}`}>
                            <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : ''}`}>Monthly Snapshot</h2>
                            {summary && Object.keys(summary).length > 0 && (
                                <MonthSnapshot data={summary} revenue={weeklyIncome} exTarget={exTarget} isDarkMode={isDarkMode} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer isDarkMode={isDarkMode}/>
            </div>
            
        </>
    );
}

export default Dashboard
