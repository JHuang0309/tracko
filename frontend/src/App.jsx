import { useState } from 'react'
import axios from 'axios';
import './App.css'

// JSX component imports
import SummaryChart from './assets/SummaryChart';
import NetIncomeChart from './assets/NetIncomeChart';
import AvgWeeklyExpChart from './assets/AvgWeeklyExpChart';
import TopExpensesList from './assets/TopExpensesList';

function App() {
    const [csvFile, setCsvFile] = useState(null);
    const [summary, setSummary] = useState(null);
    const [weeklyIncome, setWeeklyIncome] = useState(0.0);
    const [chartView, setChartView] = useState('summary') // 'summary', 'netIncome', or 'avgWeekly'
    const [topExpenses, setTopExpenses] = useState({});

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
            <h1>Tracko - Expense Tracker</h1>
            <input type="file" accept=".csv" onChange={(e) => setCsvFile(e.target.files[0])} />
            <button onClick={handleUpload}>Upload CSV</button>

            <div className="my-6">
                <label className="block mb-2 font-medium text-gray-700">Weekly Income ($)</label>
                <input
                    type="number"
                    // value={weeklyIncome}
                    onChange={(e) => setWeeklyIncome(Math.max(0, Number(e.target.value)))}
                    className="w-48 px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring"
                    placeholder="Enter amount"
                />
            </div>

            {summary && (
                <main>
                    <div>
                        <h2>Expenditure Overview</h2>
                        <div className='my-4'>
                            <label>
                                <input
                                    type='radio'
                                    value="summary"
                                    checked={chartView == 'summary'}
                                    onChange={() => setChartView('summary')}
                                />&nbsp;Gross Expenses and Income
                            </label>
                            <label className='ml-4'>
                                <input
                                    type='radio'
                                    value="netIncome"
                                    checked={chartView == 'netIncome'}
                                    onChange={() => setChartView('netIncome')}
                                />&nbsp;Net Income
                            </label>
                            <label className='ml-4'>
                                <input
                                    type='radio'
                                    value="avgWeekly"
                                    checked={chartView == 'avgWeekly'}
                                    onChange={() => setChartView('avgWeekly')}
                                />&nbsp;Average Weekly Expenses
                            </label>
                        </div>
                        {chartView === 'summary' && (
                            <SummaryChart 
                                monthly={summary.monthly}
                                weekly={summary.weekly}
                                weeklyIncome={weeklyIncome}
                            />
                        )}
                        {chartView === 'netIncome' && (
                            <NetIncomeChart 
                                weekly={summary.weekly}
                                weeklyIncome={weeklyIncome}
                            />
                        )}
                        {chartView === 'avgWeekly' && (
                            <AvgWeeklyExpChart 
                                weekly={summary.weekly}
                                labels={Object.keys(summary.weekly)}
                            />
                        )}
                    </div>
                    <div className="my-8">
                        {/* Monthly Summary */}
                        <h2 className="text-xl font-semibold mb-4">Monthly Summary</h2>
                        <div className="flex flex-wrap gap-4">
                            {Object.entries(summary.monthly).map(([month, amount], index, arr) => {
                                const prevAmount = arr[index + 1]?.[1] || amount; // Previous month's amount or current if it's the first month
                                const isIncrease = amount > prevAmount;
                                const isDecrease = amount < prevAmount;
                                
                                return (
                                    <div
                                        key={month}
                                        className={`bg-white-100 text-blue-800 px-4 py-2 rounded shadow-sm w-48 text-sm ${isIncrease ? 'border-l-4 border-red-500' : isDecrease ? 'border-l-4 border-green-500' : ''}`}
                                    >
                                        <div className="font-medium">{month}</div>
                                        <div className="text-lg font-semibold">
                                            ${amount.toFixed(2)}
                                            {isIncrease && <span className="text-red-500"> ↑</span>}
                                            {isDecrease && <span className="text-green-500"> ↓</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Weekly Summary */}
                        <h2 className="text-xl font-semibold mt-10 mb-10 mb-2">Weekly Summary</h2>
                        <div className="border border-gray-200 rounded">
                            {/* Header Row */}
                            <div className="flex flex-row justify-between font-semibold bg-gray-100 px-4 py-2 border-b border-gray-300">
                                <div className="text-left">Week</div>
                                <div className="text-right">Amount</div>
                            </div>
                            {/* Data Rows */}
                            {Object.entries(summary.weekly).map(([week, amount], index, arr) => {
                                const prevAmount = arr[index + 1]?.[1] || amount; // Previous week's amount or current if it's the latest week
                                const isIncrease = amount > prevAmount;
                                const isDecrease = amount < prevAmount;
                                
                                return (
                                    <div 
                                        key={week}
                                        className={`flex flex-row justify-between px-4 py-2 border-b border-gray-300`}
                                    >
                                        <div className="text-left">{week}</div>
                                        <div className="text-right">
                                            ${amount.toFixed(2)}
                                            {isIncrease && <span className="text-red-500"> ↑</span>}
                                            {isDecrease && <span className="text-green-500"> ↓</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <button onClick={handleDownload} disabled={!csvFile}>
                        Export Expense Data
                    </button>
                    <TopExpensesList data={topExpenses} />
                </main>
            )}
        </>
    );
}

export default App
