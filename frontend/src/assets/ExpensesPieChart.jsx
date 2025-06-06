import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { categoryIcons } from './utils/categoryIcons';

const getCategoryColor = (cat) => {
    const iconData = categoryIcons[cat?.toLowerCase()];
    // Extract hex from class string like "text-[#f97315]"
    if (iconData && iconData.color) {
        const match = iconData.color.match(/#([0-9a-fA-F]{6})/);
        if (match) return `#${match[1]}`;
    }
    // "miscellaneous" case: text-gray-500
    return "#6b7280";
};

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
});

function CustomLegend({ payload, chartData }) {
    if (!payload || !chartData) return null;

    // Calculate total for percentage
    const total = chartData.reduce((sum, entry) => sum + entry.value, 0);

    return (
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-left">
            {payload.map((entry) => {
                const dataEntry = chartData.find(e => e.name === entry.value);
                const percent = dataEntry && total > 0
                    ? ((dataEntry.value / total) * 100).toFixed(0)
                    : "0.0";
                return (
                    <div key={entry.value} className="flex items-center gap-2 mb-1">
                        <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        ></span>
                        <span className="truncate">{entry.value}</span>
                        <span className="text-gray-400 ml-1">{percent}%</span>
                    </div>
                );
            })}
        </div>
    );
}

function ExpensesPieChart({ data }) {
    return (
        <div className='flex items-center min-w-4md'>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={45}
                        label={false}
                        padAngle={4}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={getCategoryColor(entry.name)}
                            />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatter.format(value)} />
                    <Legend
                        content={props => <CustomLegend {...props} chartData={data} />}
                        layout="vertical"
                        verticalAlign="bottom"
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export default ExpensesPieChart;
