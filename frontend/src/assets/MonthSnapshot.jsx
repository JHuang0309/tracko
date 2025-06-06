import React, { useState, useMemo, useEffect } from "react";
import { Calendar, Target } from "lucide-react";

import MonthChangeIcon from "./ui/MonthChangeIcon";

export default function MonthSnapshot({ data, revenue, exTarget, isDarkMode }) {
    const months = useMemo(
        () =>
            Object.keys(data?.monthly || {}).sort(
                (a, b) => new Date(b) - new Date(a)
            ),
        [data]
    );
    const [monthIdx, setMonthIdx] = useState(0);
    const initial = (revenue + exTarget) > 0 ? (exTarget / (revenue + exTarget)) * 100 : 0;
    const [targetPercent, setTargetPercent] = useState(exTarget / (initial))

    const currentMonth = months[monthIdx];
    const prevMonth = months[monthIdx + 1];
    const currentSpending = data?.monthly?.[currentMonth] || 0;
    const prevSpending = data?.monthly?.[prevMonth] || 0;
    const diff = currentSpending - prevSpending;
    const percent =
        prevSpending > 0 ? ((diff / prevSpending) * 100).toFixed(1) : null;

    // Filter records for the current month
    const monthRecords = (data?.records || []).filter(
        (rec) => rec.Month === currentMonth
    );

    // Revenue is now derived from the revenue prop (weekly income)
    // Sum all revenue values for weeks in the current month
    const monthRevenue = revenue || 0;

    const spending = monthRecords
        .filter((rec) => rec.Amount > 0 && !/revenue|income|deposit/i.test(rec.Category || ""))
        .reduce((sum, rec) => sum + rec.Amount, 0);

    // Progress bar calculation
    const total = monthRevenue + spending;
    const spendingPercent = total > 0 ? (spending / total) * 100 : 0;

    // Top transactions (by amount)
    const topTransactions = [...monthRecords]
        .sort((a, b) => b.Amount - a.Amount)
        .slice(0, 6);

    return (
        <div className={`w-full max-w-xl mx-auto rounded-lg shadow p-2 ${isDarkMode ? 'bg-neutral-900' : 'bg-white'}`}>
            {/* Header */}
            <div className="flex justify-between mb-2">
                <div className="w-full">
                    <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-700'} text-sm font-medium`}>Month Performance </span><span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>(relative to last)</span>
                    <MonthChangeIcon percent={percent} isDarkMode={isDarkMode}/>
                    <div className="flex items-center gap-1">
                        <span className={`${isDarkMode ? 'text-white' : ''} text-2xl font-bold`}>{currentMonth}</span>
                    </div>
                    <div>
                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Expenses: {monthRecords.length}</span>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="my-3">
                <div className="flex justify-between text-xs mb-1">
                    <span className={`${isDarkMode ? 'text-white' : ''}`}>Spending</span>
                    <span>
                        {spendingPercent.toFixed(0)}%
                    </span>
                </div>
                <div className={`w-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded-full h-2`}>
                    <div
                        className={`${isDarkMode ? 'bg-[#f59e0b]' : 'bg-[#f59e42]'} h-2 rounded-full`}
                        style={{ width: `${spendingPercent}%` }}
                    ></div>
                </div>
            </div>

            {/* Revenue | Spending */}
            <div className="grid grid-cols-2 gap-4 my-4">
                <div className="flex flex-col items-left">
                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Revenue</span>
                    <span className={`font-bold text-lg ${isDarkMode ? 'text-white' : ''}`}>
                        ${monthRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>
                <div className="flex flex-col items-left">
                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Spending</span>
                    <span className={`font-bold text-lg ${isDarkMode ? 'text-white' : ''}`}>
                        ${spending.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>
            </div>

            {/* Calendar/Target */}
            <div className="flex items-center gap-2 mb-4">
                <Calendar className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Expenditure target: ${exTarget}</span>
            </div>

            {/* Top Transactions */}
            <div className="mb-4">
                <h4 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : ''}`}>Top Transactions</h4>
                <ul className="text-xs">
                    {topTransactions.map((tx, idx) => (
                        <li key={idx} className={`flex justify-between py-1 border-b last:border-b-0 ${isDarkMode ? 'border-gray-600 text-white' : ''}`}>
                            <span className="truncate">{tx.Category}</span>
                            <span className="font-medium">${tx.Amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </li>
                    ))}
                    {topTransactions.length === 0 && (
                        <li className={`${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>No transactions</li>
                    )}
                </ul>
            </div>

            {/* Month navigation */}
            <div className="flex justify-center gap-2 mt-4">
                <button
                    className={`p-2 rounded ${isDarkMode ? 'text-gray-400 hover:text-white disabled:text-gray-700 disabled:hover:text-gray-700' : 'disabled:text-gray-300 hover:text-gray-300'}`}
                    onClick={() => setMonthIdx((idx) => Math.max(0, idx - 1))}
                    disabled={monthIdx === 0}
                >
                    {"<"}
                </button>
                <button
                    className={`p-2 rounded ${isDarkMode ? 'text-gray-400 hover:text-white disabled:text-gray-700 disabled:hover:text-gray-700' : 'disabled:text-gray-300 hover:text-gray-300'}`}
                    onClick={() => setMonthIdx((idx) => Math.min(months.length - 1, idx + 1))}
                    disabled={monthIdx === months.length - 1}
                >
                    {">"}
                </button>
            </div>
        </div>
    );
}