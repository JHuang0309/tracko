import { format, parseISO } from "date-fns";

function TopExpensesList({ data }) {
    const formatMonth = (monthStr) => {
        const [year, month] = monthStr.split("-");
        return format(new Date(`${year}-${month}-01`), "MMMM yyyy");
    };

    const formatDate = (dateStr) => {
        return format(parseISO(dateStr), "EEEE dd MMMM yyyy");
    };

    return (
        <div className="p-4 bg-white shadow rounded-lg">
            <h2 className="text-xl font-bold mb-3 text-gray-800">Highest Expenses each Month</h2>
            <div className="space-y-4">
                {Object.entries(data)
                    .sort((a, b) => new Date(b[0]) - new Date(a[0]))
                    .map(([month, expenses]) => (
                    <div key={month}>
                        <h3 className="text-md font-semibold text-blue-700 text-left mb-2 border-b border-gray-100 pb-1">
                            {formatMonth(month)}
                        </h3>
                        <ul className="space-y-2">
                            {expenses.map((e, idx) => (
                                <li
                                    key={idx}
                                    className="bg-gray-50 p-2 rounded-md border border-gray-200 hover:bg-gray-100 transition"
                                >
                                    <div className="text-sm text-left text-gray-700 mb-1">
                                        {formatDate(e.Date)}
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-medium text-gray-900">
                                        <span>{e.Category}</span>
                                        <span className="text-black-600">${e.Amount.toFixed(2)}</span>
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
