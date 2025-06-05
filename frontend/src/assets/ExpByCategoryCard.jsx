import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Utensils,
  Car,
  HeartPulse,
  BookOpen,
  Dumbbell,
  ShoppingBag,
  MoreHorizontal,
  PieChart as PieChartIcon,
} from "lucide-react";

import { categoryIcons } from "./categoryIcons";


function getCategoryIcon(category) {
  if (!category) return { icon: MoreHorizontal, color: "text-gray-400" };
  const key = category.trim().toLowerCase();
  return categoryIcons[key] || { icon: MoreHorizontal, color: "text-gray-400" };
}

export default function ExpByCategoryCard({ data }) {
    // Sort months descending (latest first)

    // Only include months in the format "Month YYYY" (e.g., "May 2025")
    const months = Object.keys(data || {}).sort(
        (a, b) => new Date(b) - new Date(a)
    );

    const [monthIdx, setMonthIdx] = useState(0); // Start at latest month

    const currentMonth = months[monthIdx];
    const prevMonth = months[monthIdx + 1];
    const currentData = data[currentMonth] || {};
    const prevData = prevMonth ? data[prevMonth] || {} : {};

    const currentAmount = currentData.total || 0;
    const spendingCategories = currentData.spendingCategories || {};
    const prevSpendingCategories = prevData.spendingCategories || {};

    // Get all categories present this or last month
    const allCategories = Array.from(
        new Set([
        ...Object.keys(spendingCategories),
        ...Object.keys(prevSpendingCategories),
        ])
    );

    return (
        <>
            <div className="w-full max-w-xl mx-auto bg-white rounded-lg shadow p-3">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex flex-col">
                    <span className="text-gray-700 text-sm font-medium mb-1">
                        Monthly Spending
                    </span>
                    <span className="text-4xl font-bold mb-1">
                        ${currentAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-gray-700 text-xs">{currentMonth}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            className="p-2 rounded hover:bg-gray-100 disabled:opacity-40"
                            onClick={() => setMonthIdx((idx) => Math.max(0, idx - 1))}
                            disabled={monthIdx === 0}
                        >
                            <ChevronLeft />
                        </button>
                        <button
                            className="p-2 rounded hover:bg-gray-100 disabled:opacity-40"
                            onClick={() => setMonthIdx((idx) => Math.min(months.length - 1, idx + 1))}
                            disabled={monthIdx === months.length - 1}
                        >
                            <ChevronRight />
                        </button>
                    </div>
                </div>
                <div className="border my-4"></div>
                <div className="flex">
                    {/* Categories */}
                    <div className="flex flex-col flex-1">
                        <h3 className="text-base font-semibold mb-4">Spending Categories</h3>
                        <div className="flex flex-col gap-2">
                            {allCategories.map((cat) => {
                                const { icon: Icon, color, highlight, description } = getCategoryIcon(cat);
                                const spent = spendingCategories[cat] || 0;
                                const prevSpent = prevSpendingCategories[cat] || 0;
                                const diff = spent - prevSpent;
                                const percent =
                                prevSpent > 0 ? ((diff / prevSpent) * 100).toFixed(1) : null;
                                const isIncrease = diff > 0;
                                const isDecrease = diff < 0;

                                return (
                                <div key={cat} className="flex justify-between items-center">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Icon className={`w-10 h-10 ${color} ${highlight} text-blue-500 p-2 rounded-lg`} />
                                        <div className="flex flex-col">
                                            <span className="text-sm capitalize">
                                                {cat.replace(/(^|\s)\S/g, (l) => l.toUpperCase())}
                                            </span>
                                            <p className="text-xs text-gray-500">{`${description}`}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-sm">
                                            ${spent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                        {percent !== null && (
                                            <span
                                                className={`flex items-center text-xs font-medium ${
                                                    isIncrease
                                                    ? "text-red-500"
                                                    : isDecrease
                                                    ? "text-green-600"
                                                    : "text-gray-400"
                                                }`}
                                                >
                                                {isIncrease ? "▲" : isDecrease ? "▼" : ""}
                                                {Math.abs(percent)}%
                                            </span>
                                        )}
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="flex">
                        Pie Chart
                    </div>
                    {/* Pie chart */}
                </div>
                
                
            </div>
                
        </>
    );
}