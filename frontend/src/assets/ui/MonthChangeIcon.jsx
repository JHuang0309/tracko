import { 
    ArrowUpRight, 
    ArrowDownLeft, 
    PiggyBank, 
    Star, 
    Trophy, 
    AlertTriangle,
    CreditCard,
} from "lucide-react";

// Custom icon component based on percent
export default function MonthChangeIcon({ percent, isDarkMode }) {
    if (percent === null || isNaN(percent)) {
    return (
        <div className="flex justify-between">
            <div className={`${isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'} rounded-lg p-2 w-10 h-10 flex items-center justify-center my-2`} title="No data">
                <CreditCard className="w-5 h-5" />
            </div>
            <div className="flex flex-col justify-center items-end">
                <div className={`text-gray-500 flex justify-end pr-0.5 font-semibold`}>No Data</div>
            </div>
        </div>
    );
}

    const p = Number(percent);
    // Negative (positive improvement)
    if (p < 0 && p >= -10) {
        return (
            <div className={`flex justify-between`}>
                <div className={`${isDarkMode ? 'bg-green-theme-highlight-dark text-green-theme-dark' : 'bg-green-theme-highlight text-green-theme'} rounded-lg p-2 w-10 h-10 flex items-center justify-center my-2`} title="Low positive change">
                    <PiggyBank className="w-5 h-5" />
                </div>
                <div className="flex flex-col justify-center items-end">
                    <div className={`${isDarkMode ? 'text-green-theme-dark' : 'text-green-theme'} flex justify-end pr-0.5 font-semibold`}>Good</div>
                    <div className={`flex w-fit ${isDarkMode ? 'bg-green-theme-highlight-dark text-green-theme-dark' : 'bg-green-theme-highlight text-green-theme'} items-center justify-end rounded-lg text-sm h-6 p-1 mt-1`}>
                        <ArrowDownLeft className="h-4"/><span className="pr-1 font-semibold">{p}%</span>
                    </div>
                </div>
            </div>
        );
    }
    if (p < -10 && p >= -20) {
        return (
            <div className="flex justify-between">
                <div className={`${isDarkMode ? 'bg-blue-theme-highlight-dark text-blue-theme-dark' : 'bg-blue-theme-highlight text-blue-theme'} rounded-lg p-2 w-10 h-10 flex items-center justify-center my-2`} title="Moderate positive change">
                    <Star className="w-5 h-5" />
                </div>
                <div className="flex flex-col justify-center items-end">
                    <div className={`${isDarkMode ? 'text-blue-theme-dark' : 'text-blue-theme'} flex justify-end pr-0.5 font-semibold`}>Great</div>
                    <div className={`flex w-fit ${isDarkMode ? 'bg-blue-theme-highlight-dark text-blue-theme-dark' : 'bg-blue-theme-highlight text-blue-theme'} items-center justify-end rounded-lg text-sm h-6 p-1 mt-1`}>
                        <ArrowDownLeft className="h-4"/><span className="pr-1 font-semibold">{p}%</span>
                    </div>
                </div>
            </div>
        );
    }
    if (p < -20 ) {
        return (
            <div className="flex justify-between">
                <div className={`${isDarkMode ? 'bg-purple-theme-highlight-dark text-purple-theme-dark' : 'bg-purple-theme-highlight text-purple-theme'} rounded-lg p-2 w-10 h-10 flex items-center justify-center my-2`} title="High positive change">
                    <Trophy className="w-5 h-5" />
                </div>
                <div className="flex flex-col justify-center items-end">
                    <div className={`${isDarkMode ? 'text-purple-theme-dark' : 'text-purple-theme'} flex justify-end pr-0.5 font-semibold`}>Exceptional</div>
                    <div className={`flex w-fit ${isDarkMode ? 'bg-purple-theme-highlight-dark text-purple-theme-dark' : 'bg-purple-theme-highlight text-purple-theme'} items-center justify-end rounded-lg text-sm h-6 p-1 mt-1`}>
                        <ArrowDownLeft className="h-4"/><span className="pr-1 font-semibold">{p}%</span>
                    </div>
                </div>
            </div>
        );
    }
    // Positive (negative outcome)
    if (p >= 0 && p <= 20) {
        return (
            <div className="flex justify-between">
                <div className={`${isDarkMode ? 'bg-amber-theme-highlight-dark text-amber-theme-dark' : 'bg-amber-theme-highlight text-amber-theme'} rounded-lg p-2 w-10 h-10 flex items-center justify-center my-2`} title="Low negative change">
                    <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex flex-col justify-center items-end">
                    <div className={`${isDarkMode ? 'text-amber-theme-dark' : 'text-amber-theme'} flex justify-end pr-0.5 font-semibold`}>Acceptable</div>
                    <div className={`flex w-fit ${isDarkMode ? 'bg-amber-theme-highlight-dark text-amber-theme-dark' : 'bg-amber-theme-highlight text-amber-theme'} items-center justify-end rounded-lg text-sm h-6 p-1 mt-1`}>
                        <ArrowUpRight className="h-4"/><span className="pr-1 font-semibold">{p}%</span>
                    </div>
                </div>
            </div>
        );
    }
    if (p > 20) {
        return (
            <div className="flex justify-between">
                <div className={`${isDarkMode ? 'bg-red-theme-highlight-dark text-red-theme-dark' : 'bg-red-theme-highlight text-red-theme'} rounded-lg p-2 w-10 h-10 flex items-center justify-center my-2`} title="High negative change">
                    <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex flex-col justify-center items-end">
                    <div className={`${isDarkMode ? 'text-red-theme-dark' : 'text-red-theme'} flex justify-end pr-0.5 font-semibold`}>Caution</div>
                    <div className={`flex w-fit ${isDarkMode ? 'bg-red-theme-highlight-dark text-red-theme-dark' : 'bg-red-theme-highlight text-red-theme'} items-center justify-end rounded-lg text-sm h-6 p-1 mt-1`}>
                        <ArrowUpRight className="h-4"/><span className="pr-1 font-semibold">{p}%</span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
}