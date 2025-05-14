import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Tooltip,
    Legend
);

const WEEKS_PER_MONTH = 3.5

function SummaryChart({ monthly, weekly, weeklyIncome }) {
    const labels = Array.from(new Set([
        ...Object.keys(monthly),
        ...Object.keys(weekly),
    ])).sort((a, b) => new Date(a) - new Date(b));

    const monthlyData = labels.map(label => monthly[label] ?? null);
    const weeklyData = labels.map(label => {
        const value = weekly[label];
        return value < 0 ? 0 : value;
    });
    const incomeLine = labels.map(label => {
        const expense = weekly[label] ?? 0;
        const extra = expense < 0 ? Math.abs(expense) : 0;
        return weeklyIncome + extra;
    });
    const monthlyIncomeData = labels.map((label, index) => {
        if (monthly[label] !== undefined && monthly[label] !== null) {
            // Check if the current label is the start of a new month
            if (index === 0 || new Date(labels[index]).getMonth() !== new Date(labels[index - 1]).getMonth()) {
                return weeklyIncome * WEEKS_PER_MONTH;
            }
        }
        return null;
    });
    

    const data = {
        labels,
        datasets: [
            {
                type: 'bar',
                label: 'Monthly',
                data: monthlyData,
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                yAxisID: 'y',
                order: 2,
                barPercentage: 0.8,
                categoryPercentage: 0.8,
            },
            {
                type: 'bar',
                label: 'Monthly Income',
                data: monthlyIncomeData,
                backgroundColor: 'rgba(34, 197, 94, 0.5)',
                yAxisID: 'y',
                order: 1,
                barPercentage: 0.8,
                categoryPercentage: 0.8,
                offset: true,
            },
            {
                type: 'line',
                label: 'Weekly',
                data: weeklyData,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                yAxisID: 'y',
                order: 1,
                fill: false,
                spanGaps: true,
            },
            {
                type: 'line',
                label: 'Weekly Income',
                data: incomeLine,
                borderColor: 'rgba(59, 130, 246, 1)',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderWidth: 2,
                fill: false,
                tension: 0.4,
                pointRadius: 0,
            },              
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Monthly vs Weekly Expenditure & Income' },
          },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Amount ($)'
                }
            },
            x: {
                type: 'category',  // Ensures the x-axis is set to 'category' type
                title: {
                    display: true,
                    text: 'Months'
                },
                ticks: {
                    callback: (value, index) => {
                        const currentDate = new Date(labels[index]);
                        const previousDate = index > 0 ? new Date(labels[index - 1]) : null;
                        // Only show tick if the current month is different from the previous month
                        if (previousDate && currentDate.getMonth() === previousDate.getMonth()) {
                            return '';
                        }
                        return currentDate.toLocaleString('default', { month: 'long' });
                    },
                    autoSkip: true,
                }
            },
        }
    }

    return <Chart type='bar' data={data} options={options} />;
}

export default SummaryChart;