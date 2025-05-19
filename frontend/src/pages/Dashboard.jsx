import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid'
import axios from 'axios';
import '../index.css'

// JSX component imports
import SummaryChart from '../assets/SummaryChart';
import NetIncomeChart from '../assets/NetIncomeChart';
import AvgWeeklyExpChart from '../assets/AvgWeeklyExpChart';
import TopExpensesList from '../assets/TopExpensesList';
import ChartDropdown from '../assets/ChartDropdown';
import WeeklyHeatmap from '../assets/WeeklyHeatmap';

function Dashboard() {
    const location = useLocation();
    const input_file = location.state?.file;

    const [csvFile, setCsvFile] = useState(input_file);
    const [summary, setSummary] = useState(null);
    const [weeklyIncome, setWeeklyIncome] = useState(0.0);
    const [chartView, setChartView] = useState('summary') // 'summary', 'netIncome', or 'avgWeekly'
    const [topExpenses, setTopExpenses] = useState({});
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [cardColor, setCardColor] = useState('bg-white'); // 'bg-white' or 'bg-neutral-700'
    const [bgColor, setBgColor] = useState('bg-gray-100'); // 'bg-gray-100' or 'bg-neutral-900'
    const [cardTextColor, setCardTextColor] = useState('text-black'); // 'text-white' or 'text-black'

    const toggleAppearance = () => setIsDarkMode(prev => !prev)

    useEffect(() => {
        if (!isDarkMode) {
            setCardColor('bg-white')
            setBgColor('bg-gray-100')
            setCardTextColor('text-black')
        } else {
            setCardColor('bg-neutral-800')
            setBgColor('bg-neutral-900')
            setCardTextColor('text-white')
        }
    }, [isDarkMode])

    useEffect(() => {
        if (csvFile) {
            handleUpload()
          } else {
            // maybe redirect back to LandingPage or show a message
            console.log('No file received');
          }
    }, []);

    const fetchTopExpenses = async () => {
        try {
            const res = await axios.get("http://localhost:8000/top_expenses_by_month");
            setTopExpenses(res.data);
        } catch (err) {
            console.error("Failed to fetch top expenses", err);
        }
    };


    const handleUpload = async () => {
        if (!csvFile) return;
        const formData = new FormData();
        formData.append("file", csvFile); // wrap csv file in a form object to send via HTTP

        try {
            const response = await axios.post("http://localhost:8000/upload", formData, {
                headers: {"Content-Type": "multipart/form-data"},
            });
            setSummary(response.data);
            fetchTopExpenses();
            // console.log(response.data)
        } catch (err) {
            alert("Error uploading file");
        }
    };

    const handleDownload = async () => {
        if (!csvFile) return;
        try {
            const response = await axios.get("http://localhost:8000/download_cleaned_csv", {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'cleaned_expenses.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            alert("Failed to download CSV.");
        }
    };

    return (
        <>
            <div className={`flex justify-between ${bgColor} p-4`}>
                <div 
                    className="flex bg-clip-text text-transparent items-center font-bold text-3xl"
                    style={{ backgroundImage: 'linear-gradient(to right, #560bad, #7209b7, #b5179e)' }}
                    >Tracko</div>
                <button
                    onClick={toggleAppearance}
                    className={`w-10 h-10 flex items-center justify-center rounded-md shadow-sm ${cardColor}
                                transition-colors duration-300 hover:shadow-md hover:ring-1 hover:ring-white`}
                >
                {isDarkMode ? (
                    <MoonIcon className="w-6 h-6 text-white" />
                ) : (
                    <SunIcon className="w-6 h-6 text-black" />
                )}
                </button>
            </div>
            <div className={`flex min-h-screen ${bgColor} ${cardTextColor} p-4 transition-colors duration-300 pd-8`}>  
                <div className="flex mx-auto grid grid-rows-2 gap-6">
                    {/* Row 1 */}
                    <div className="grid grid-cols-5 gap-4">
                        {/* Monthly expenses card */}
                        <div className={`col-span-1 ${cardColor} rounded-lg p-6 shadow-md flex flex-col`}>
                            <h2 className="text-sm font-medium">Monthly Expenditure</h2>
                            <div className="max-h-[30rem] flex flex-col gap-4 overflow-y-auto mt-2"> 
                                {summary?.monthly && Object.entries(summary.monthly).map(([month, amount], index, arr) => {
                                    const prevAmount = arr[index + 1]?.[1] || amount; // Previous month's amount or current if it's the first month
                                    const isIncrease = amount > prevAmount;
                                    const isDecrease = amount < prevAmount;
                                    const percentage = prevAmount !== 0 ? ((amount - prevAmount) / prevAmount) * 100 : 0;
                                    const formattedPercentage = Math.abs(percentage).toFixed(1);
                                    return (
                                        <div
                                            key={month}
                                            className={`flex flex-col bg-white-100 px-4 py-3 rounded shadow-md text-xs`}
                                        >
                                            <div className="font-light">{month}</div>
                                            <div className={`flex justify-between text-lg ${isDarkMode ? 'text-white': 'text-[#4f3af4]'} font-medium`}>
                                                <div>
                                                    ${amount.toFixed(2)}
                                                </div>
                                                <div className='flex items-center'>
                                                    {(isIncrease || isDecrease) && (
                                                        <span
                                                            className={`flex items-center px-2 py-0.5 rounded-full text-xs font-medium 
                                                                ${isIncrease
                                                                    ? isDarkMode
                                                                        ? 'bg-red-800 bg-opacity-20 text-red-400'
                                                                        : 'bg-red-100 text-red-700'
                                                                    : isDarkMode
                                                                        ? 'bg-green-800 bg-opacity-20 text-green-400'
                                                                        : 'bg-green-100 text-green-700'}`}
                                                        >
                                                            {isIncrease ? '↑' : '↓'} {formattedPercentage}%
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        
                        {/* Large chart card */}
                        <div className={`col-span-3 ${cardColor} rounded-lg p-6 shadow-md`}>
                            <h2 className="text-sm font-medium">Big Chart</h2>
                                <div className={`flex justify-end my-4 ${cardTextColor}`}>
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
                        <div className="col-span-1 grid grid-rows-2 gap-4">
                            <div className={`${cardColor} rounded-lg p-4 shadow-md`}>
                                <h3 className="text-sm font-medium">Upload new</h3>
                                <p className='text-xs text-gray-500'>Smaller upload box...grey dotted lines</p>
                            </div>
                            <div className={`${cardColor} rounded-lg p-4 shadow-md`}>
                                <h3 className="text-sm font-medium">Income</h3>
                                <p className='text-xs text-gray-500'>dynamic graph and input underneath...label with graph</p>
                            </div>
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div className="max-h-[35rem] grid grid-cols-3 gap-4">
                        <div className={`${cardColor} rounded-lg p-4 shadow-md overflow-y-auto`}>
                            <h3 className="text-sm font-medium">Highest Transactions</h3>
                            <TopExpensesList data={topExpenses} darkMode={isDarkMode}/>
                        </div>
                        <div className={`flex flex-col ${cardColor} rounded-lg p-4 shadow-md overflow-y-auto`}>
                            <h3 className="text-sm font-medium">Weekly breakdown</h3>
                            <WeeklyHeatmap weekly={summary?.weekly} darkMode={isDarkMode}/>
                        </div>
                        <div className={`${cardColor} rounded-lg p-4 shadow-md`}>
                            <h3 className="text-sm font-medium">Pie chart summary</h3>
                            <p className='text-xs text-gray-500'>Categories expenses...TODO:create miscellanous / general spending category</p>
                        </div>
                        </div>
                    </div>
            </div>        
        </>
        // <>
        //     <h1>Tracko - Expense Tracker</h1>
        //     <input type="file" accept=".csv" onChange={(e) => setCsvFile(e.target.files[0])} />
        //     <button onClick={handleUpload}>Upload CSV</button>

        //     <div className="my-6">
        //         <label className="block mb-2 font-medium text-gray-700">Weekly Income ($)</label>
        //         <input
        //             type="number"
        //             // value={weeklyIncome}
        //             onChange={(e) => setWeeklyIncome(Math.max(0, Number(e.target.value)))}
        //             className="w-48 px-3 py-2 border rounded shadow-md focus:outline-none focus:ring"
        //             placeholder="Enter amount"
        //         />
        //     </div>

        //     {summary && (
        //         <main>
        //                 {/* Weekly Summary */}
        //                 <h2 className="text-xl font-semibold mt-10 mb-10 mb-2">Weekly Summary</h2>
        //                 <div className="border border-gray-200 rounded">
        //                     {/* Header Row */}
        //                     <div className="flex flex-row justify-between font-semibold bg-gray-100 px-4 py-2 border-b border-gray-300">
        //                         <div className="text-left">Week</div>
        //                         <div className="text-right">Amount</div>
        //                     </div>
        //                     {/* Data Rows */}
        //                     {Object.entries(summary.weekly).map(([week, amount], index, arr) => {
        //                         const prevAmount = arr[index + 1]?.[1] || amount; // Previous week's amount or current if it's the latest week
        //                         const isIncrease = amount > prevAmount;
        //                         const isDecrease = amount < prevAmount;
                                
        //                         return (
        //                             <div 
        //                                 key={week}
        //                                 className={`flex flex-row justify-between px-4 py-2 border-b border-gray-300`}
        //                             >
        //                                 <div className="text-left">{week}</div>
        //                                 <div className="text-right">
        //                                     ${amount.toFixed(2)}
        //                                     {isIncrease && <span className="text-red-500"> ↑</span>}
        //                                     {isDecrease && <span className="text-green-500"> ↓</span>}
        //                                 </div>
        //                             </div>
        //                         );
        //                     })}
        //                 </div>
        //             </div>
        //             <button onClick={handleDownload} disabled={!csvFile}>
        //                 Export Expense Data
        //             </button>
        //             <TopExpensesList data={topExpenses} />
        //         </main>
        //     )}
        // </>
    );
}

export default Dashboard
