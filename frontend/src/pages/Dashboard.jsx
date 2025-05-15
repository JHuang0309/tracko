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

function Dashboard() {
    const location = useLocation();
    const input_file = location.state?.file;
    const navigate = useNavigate();

    const [csvFile, setCsvFile] = useState(input_file);
    const [summary, setSummary] = useState(null);
    const [weeklyIncome, setWeeklyIncome] = useState(0.0);
    const [chartView, setChartView] = useState('summary') // 'summary', 'netIncome', or 'avgWeekly'
    const [topExpenses, setTopExpenses] = useState({});
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [cardColor, setCardColor] = useState('bg-white'); // 'bg-white' or 'bg-neutral-700'
    const [bgColor, setBgColor] = useState('bg-gray-100'); // 'bg-gray-100' or 'bg-neutral-800'
    const [cardTextColor, setCardTextColor] = useState('text-black'); // 'text-white' or 'text-black'

    const toggleAppearance = () => setIsDarkMode(prev => !prev)

    useEffect(() => {
        if (!isDarkMode) {
            setCardColor('bg-white')
            setBgColor('bg-gray-100')
            setCardTextColor('text-black')
        } else {
            setCardColor('bg-neutral-700')
            setBgColor('bg-neutral-800')
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
            <div className={`flex justify-end ${bgColor} p-4`}>
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
            <div className={`flex min-h-screen ${bgColor} ${cardTextColor} p-8 transition-colors duration-300`}>  
                <div className="max-w-7xl mx-auto grid grid-rows-2 gap-6">
                    {/* Row 1 */}
                    <div className="grid grid-cols-5 gap-4">
                        {/* Large card taking half the row */}
                        <div className={`col-span-1 ${cardColor} rounded-lg p-6 shadow-md`}>
                            <h2 className="text-sm font-semibold">Monthly Expenditure</h2>
                            <p className='text-xs text-gray-500'>List of months...ability to scroll through</p>
                        </div>

                        <div className={`col-span-3 ${cardColor} rounded-lg p-6 shadow-md`}>
                            <h2 className="text-sm font-semibold">Big Chart</h2>
                            <p className='text-xs text-gray-500'>Visualisations..toggle</p>
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
                    <div className="grid grid-cols-3 gap-4">
                        <div className={`${cardColor} rounded-lg p-4 shadow-md`}>
                            <h3 className="text-sm font-medium">Highest Transactions</h3>
                            <p className='text-xs text-gray-500'>Table or list...</p>
                        </div>
                        <div className={`${cardColor} rounded-lg p-4 shadow-md`}>
                            <h3 className="text-sm font-medium">Weekly breakdown</h3>
                            <p className='text-xs text-gray-500'>List</p>
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
        //             <div>
        //                 <h2>Expenditure Overview</h2>
        //                 <div className='my-4'>
        //                     <label>
        //                         <input
        //                             type='radio'
        //                             value="summary"
        //                             checked={chartView == 'summary'}
        //                             onChange={() => setChartView('summary')}
        //                         />&nbsp;Gross Expenses and Income
        //                     </label>
        //                     <label className='ml-4'>
        //                         <input
        //                             type='radio'
        //                             value="netIncome"
        //                             checked={chartView == 'netIncome'}
        //                             onChange={() => setChartView('netIncome')}
        //                         />&nbsp;Net Income
        //                     </label>
        //                     <label className='ml-4'>
        //                         <input
        //                             type='radio'
        //                             value="avgWeekly"
        //                             checked={chartView == 'avgWeekly'}
        //                             onChange={() => setChartView('avgWeekly')}
        //                         />&nbsp;Average Weekly Expenses
        //                     </label>
        //                 </div>
        //                 {chartView === 'summary' && (
        //                     <SummaryChart 
        //                         monthly={summary.monthly}
        //                         weekly={summary.weekly}
        //                         weeklyIncome={weeklyIncome}
        //                     />
        //                 )}
        //                 {chartView === 'netIncome' && (
        //                     <NetIncomeChart 
        //                         weekly={summary.weekly}
        //                         weeklyIncome={weeklyIncome}
        //                     />
        //                 )}
        //                 {chartView === 'avgWeekly' && (
        //                     <AvgWeeklyExpChart 
        //                         weekly={summary.weekly}
        //                         labels={Object.keys(summary.weekly)}
        //                     />
        //                 )}
        //             </div>
        //             <div className="my-8">
        //                 {/* Monthly Summary */}
        //                 <h2 className="text-xl font-semibold mb-4">Monthly Summary</h2>
        //                 <div className="flex flex-wrap gap-4">
        //                     {Object.entries(summary.monthly).map(([month, amount], index, arr) => {
        //                         const prevAmount = arr[index + 1]?.[1] || amount; // Previous month's amount or current if it's the first month
        //                         const isIncrease = amount > prevAmount;
        //                         const isDecrease = amount < prevAmount;
                                
        //                         return (
        //                             <div
        //                                 key={month}
        //                                 className={`bg-white-100 text-blue-800 px-4 py-2 rounded shadow-md w-48 text-sm ${isIncrease ? 'border-l-4 border-red-500' : isDecrease ? 'border-l-4 border-green-500' : ''}`}
        //                             >
        //                                 <div className="font-medium">{month}</div>
        //                                 <div className="text-lg font-semibold">
        //                                     ${amount.toFixed(2)}
        //                                     {isIncrease && <span className="text-red-500"> ↑</span>}
        //                                     {isDecrease && <span className="text-green-500"> ↓</span>}
        //                                 </div>
        //                             </div>
        //                         );
        //                     })}
        //                 </div>

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
