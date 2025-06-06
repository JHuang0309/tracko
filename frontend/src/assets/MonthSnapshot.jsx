import React, { useState, useMemo } from "react";
import { Calendar, Target } from "lucide-react";

import MonthChangeIcon from "./ui/MonthChangeIcon";

export default function MonthSnapshot({ data, revenue, exTarget }) {
    const months = useMemo(
        () =>
            Object.keys(data?.monthly || {}).sort(
                (a, b) => new Date(b) - new Date(a)
            ),
        [data]
    );
    const [monthIdx, setMonthIdx] = useState(0);

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
        <div className="w-full max-w-xl mx-auto bg-white rounded-lg shadow p-2">
            {/* Header */}
            <div className="flex justify-between mb-2">
                <div className="w-full">
                    <span className="text-gray-700 text-sm font-medium">Month Breakdown</span>
                    <MonthChangeIcon percent={percent}/>
                    <div className="flex items-center gap-1">
                        <span className="text-2xl font-bold">{currentMonth}</span>
                    </div>
                    <div>
                        <span className="text-xs text-gray-500">Expenses: {monthRecords.length}</span>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="my-3">
                <div className="flex justify-between text-xs mb-1">
                    <span>Spending</span>
                    <span>
                        {spendingPercent.toFixed(0)}%
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-gray-900 h-2 rounded-full"
                        style={{ width: `${spendingPercent}%` }}
                    ></div>
                </div>
            </div>

            {/* Revenue | Spending */}
            <div className="grid grid-cols-2 gap-4 my-4">
                <div className="flex flex-col items-left">
                    <span className="text-xs text-gray-500">Revenue</span>
                    <span className="font-bold text-lg text-green-600">
                        ${monthRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>
                <div className="flex flex-col items-left">
                    <span className="text-xs text-gray-500">Spending</span>
                    <span className="font-bold text-lg text-red-500">
                        ${spending.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>
            </div>

            {/* Calendar/Target */}
            <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500">Expenditure target: ${exTarget}</span>
            </div>

            {/* Top Transactions */}
            <div className="mb-4">
                <h4 className="text-lg font-semibold mb-2">Top Transactions</h4>
                <ul className="text-xs">
                    {topTransactions.map((tx, idx) => (
                        <li key={idx} className="flex justify-between py-1 border-b last:border-b-0">
                            <span className="truncate">{tx.Category}</span>
                            <span className="font-medium">${tx.Amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </li>
                    ))}
                    {topTransactions.length === 0 && (
                        <li className="text-gray-400">No transactions</li>
                    )}
                </ul>
            </div>

            {/* Buttons */}
            {/* <div className="flex justify-between gap-2 mt-4">
                <button className="flex-1 py-2 bg-green-100 text-green-700 rounded font-semibold hover:bg-green-200 transition">
                    + Add revenue
                </button>
                <button className="flex-1 py-2 bg-blue-100 text-blue-700 rounded font-semibold hover:bg-blue-200 transition">
                    View Breakdown
                </button>
            </div> */}

            {/* Month navigation */}
            <div className="flex justify-center gap-2 mt-4">
                <button
                    className="p-2 rounded hover:bg-gray-100 disabled:opacity-40"
                    onClick={() => setMonthIdx((idx) => Math.max(0, idx - 1))}
                    disabled={monthIdx === 0}
                >
                    {"<"}
                </button>
                <button
                    className="p-2 rounded hover:bg-gray-100 disabled:opacity-40"
                    onClick={() => setMonthIdx((idx) => Math.min(months.length - 1, idx + 1))}
                    disabled={monthIdx === months.length - 1}
                >
                    {">"}
                </button>
            </div>
        </div>
    );
}