import { format, parseISO } from "date-fns";

function TopExpensesList({ data, darkMode }) {

    const bgColor = darkMode ? 'bg-neutral-800' : 'bg-white'

    const formatMonth = (monthStr) => {
        const [year, month] = monthStr.split("-");
        return format(new Date(`${year}-${month}-01`), "MMMM yyyy");
    };

    const formatDate = (dateStr) => {
        return format(parseISO(dateStr), "EEEE dd MMMM yyyy");
    };

    return (
        <div className={`pt-4 ${bgColor}`}>
            {/* <h2 className="text-xl font-bold mb-3 text-gray-800">Highest Expenses each Month</h2> */}
            <div className="space-y-4">
                {Object.entries(data)
                    .sort((a, b) => new Date(b[0]) - new Date(a[0]))
                    .map(([month, expenses]) => (
                    <div key={month}>
                        <h3 className={`text-sm font-semibold ${darkMode ? 'text-[#70aefd]': 'text-[#4f3af4]'} text-left mb-2 pb-1`}>
                            {formatMonth(month)}
                        </h3>
                        <ul className="space-y-2">
                            {expenses.map((e, idx) => (
                                <li
                                    key={idx}
                                    className="pb-2 rounded-md border-b"
                                >
                                    <div className={`text-xs text-left mb-1 ${darkMode ? 'text-[#e3f0fd]': 'text-gray-700'}`}>
                                        {formatDate(e.Date)}
                                    </div>
                                    <div className={`flex justify-between items-center text-sm font-medium`}>
                                        <span className={`${darkMode ? 'text-white': 'text-gray-900'}`}>{e.Category}</span>
                                        <span className={`${darkMode ? 'text-white': 'text-[#4f3af4]'} text-lg ml-4`}>${e.Amount.toFixed(2)}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TopExpensesList;
