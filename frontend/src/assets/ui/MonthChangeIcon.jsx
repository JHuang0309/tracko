import { 
    ArrowUpRight, 
    ArrowDownLeft, 
    PiggyBank, 
    Star, 
    Trophy, 
    AlertTriangle 
} from "lucide-react";

// Custom icon component based on percent
export default function MonthChangeIcon({ percent }) {
    if (percent === null || isNaN(percent)) return null;
    const p = Number(percent);

    // Negative (positive improvement)
    if (p < 0 && p >= -10) {
        return (
            <div className="flex justify-between">
                <div className="bg-green-theme-highlight text-green-theme rounded-lg p-2 w-10 h-10 flex items-center justify-center my-2" title="Low positive change">
                    <PiggyBank className="w-5 h-5" />
                </div>
                <div className="flex flex-col justify-center items-end">
                    <div className="flex justify-end pr-0.5 text-green-theme font-semibold">Good</div>
                    <div className="flex w-fit bg-green-theme-highlight text-green-theme items-center justify-end rounded-lg text-sm h-6 p-1 mt-1">
                        <ArrowDownLeft className="h-4"/><span className="pr-1 font-semibold">{p}%</span>
                    </div>
                </div>
            </div>
        );
    }
    if (p < -10 && p >= -20) {
        return (
            <div className="flex justify-between">
                <div className="bg-blue-theme-highlight text-blue-theme rounded-lg p-2 w-10 h-10 flex items-center justify-center my-2" title="Moderate positive change">
                    <Star className="w-5 h-5" />
                </div>
                <div className="flex flex-col justify-center items-end">
                    <div className="flex justify-end pr-0.5 text-blue-theme font-semibold">Great</div>
                    <div className="flex w-fit bg-blue-theme-highlight text-blue-theme items-center justify-end rounded-lg text-sm h-6 p-1 mt-1">
                        <ArrowDownLeft className="h-4"/><span className="pr-1 font-semibold">{p}%</span>
                    </div>
                </div>
            </div>
        );
    }
    if (p < -20 ) {
        return (
            <div className="flex justify-between">
                <div className="bg-purple-theme-highlight text-purple-theme rounded-lg p-2 w-10 h-10 flex items-center justify-center my-2" title="High positive change">
                    <Trophy className="w-5 h-5" />
                </div>
                <div className="flex flex-col justify-center items-end">
                    <div className="flex justify-end pr-0.5 text-purple-theme font-semibold">Exceptional</div>
                    <div className="flex w-fit bg-purple-theme-highlight text-purple-theme items-center justify-end rounded-lg text-sm h-6 p-1 mt-1">
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
                <div className="bg-amber-theme-highlight text-amber-theme rounded-lg p-2 w-10 h-10 flex items-center justify-center my-2" title="Low negative change">
                    <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex flex-col justify-center items-end">
                    <div className="flex justify-end pr-0.5 text-amber-theme font-semibold">Acceptable</div>
                    <div className="flex w-fit bg-amber-theme-highlight text-amber-theme items-center justify-end rounded-lg text-sm h-6 p-1 mt-1">
                        <ArrowUpRight className="h-4"/><span className="pr-1 font-semibold">{p}%</span>
                    </div>
                </div>
            </div>
        );
    }
    if (p > 20) {
        return (
            <div className="flex justify-between">
                <div className="bg-red-theme-highlight text-red-theme rounded-lg p-2 w-10 h-10 flex items-center justify-center my-2" title="High negative change">
                    <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex flex-col justify-center items-end">
                    <div className="flex justify-end pr-0.5 text-red-theme font-semibold">Caution</div>
                    <div className="flex w-fit bg-red-theme-highlight text-red-theme items-center justify-end rounded-lg text-sm h-6 p-1 mt-1">
                        <ArrowUpRight className="h-4"/><span className="pr-1 font-semibold">{p}%</span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
}