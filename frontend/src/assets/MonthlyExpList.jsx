import {
    Calendar,
    ArrowUpRight,
    ArrowDownLeft,
    ShoppingBag,
    Utensils,
    Car,
    HeartPulse,
    BookOpen,
    Dumbbell,
    MoreHorizontal
} from "lucide-react";

// Helper to pick an icon based on category
const categoryIcons = {
    "miscellaneous": ShoppingBag,
    "transportation": Car,
    "personal health": HeartPulse,
    "food & dining": Utensils,
    "university (beem)": BookOpen,
    "leisure & exercise": Dumbbell,
};

function getCategoryIcon(category) {
    if (!category) return MoreHorizontal;
    const key = category.trim().toLowerCase();
    return categoryIcons[key] || MoreHorizontal;
}

export default function MonthlyExpList({ data, isDarkMode }) {
    // Get months sorted descending (latest first)
    const months = Object.keys(data).sort((a, b) => new Date(b) - new Date(a));

    return (
        <div className="max-h-[30rem] flex flex-col gap-4 overflow-y-auto mt-2">
            {months.map((month, idx, arr) => {
                const thisMonth = data[month];
                const prevMonth = arr[idx + 1] ? data[arr[idx + 1]] : null;
                const amount = thisMonth.total;
                const prevAmount = prevMonth ? prevMonth.total : amount;
                const isIncrease = amount > prevAmount;
                const isDecrease = amount < prevAmount;
                const percentage = prevAmount !== 0 ? ((amount - prevAmount) / prevAmount) * 100 : 0;
                const formattedPercentage = Math.abs(percentage).toFixed(1);

                const TopCategoryIcon = getCategoryIcon(thisMonth.topCategory);

                return (
                    <div
                        key={month}
                        className={`flex items-center justify-between bg-white p-2 rounded-md text-xs ${isDarkMode ? 'bg-dark-blue' : 'bg-white hover:bg-gray-100'}`}
                    >
                        {/* Month, change, and details */}
                        <div className="flex flex-col flex-grow min-w-0">
                            <div className="flex items-center gap-2">
                                <span className={`font-semibold text-md truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{month}</span>
                                {(isIncrease || isDecrease) && (
                                    <span className={`flex items-center text-xs font-medium ml-1
                                        ${isIncrease
                                            ? isDarkMode
                                                ? 'text-red-400'
                                                : 'text-[#F04C4B]'
                                            : isDarkMode
                                                ? 'text-green-400'
                                                : 'text-[#2FC65E]'
                                        }`}>
                                        {isIncrease
                                            ? <ArrowUpRight className="w-4 h-4 mr-0.5" />
                                            : <ArrowDownLeft className="w-4 h-4 mr-0.5" />}
                                        {formattedPercentage}%
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-col gap-2 mt-1">
                                <div className={`text-xs ${isDarkMode ? 'text-blue-100' : 'text-gray-500'}`}>
                                    {thisMonth.numExpenses} expenses
                                </div>
                                
                                <div className={`flex gap-2 text-xs truncate ${isDarkMode ? 'text-blue-100' : 'text-gray-500'}`}>
                                    <TopCategoryIcon className={`w-4 h-4 ${isDarkMode ? 'text-blue-200' : 'text-blue-500'}`} />
                                    {thisMonth.topCategory}
                                </div>
                            </div>
                        </div>
                        {/* Amount */}
                        <div className={`flex text-sm text-right font-bold ml-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}