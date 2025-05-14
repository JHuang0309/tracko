// src/components/AverageWeeklyExpensesChart.jsx
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function AvgWeeklyExpChart({ weekly, labels }) {
    // Group weekly expenses by month
    const monthlyGroups = {};

    labels.forEach(label => {
        const date = new Date(label);
        const monthKey = date.toLocaleString('default', { month: 'long', year: 'numeric' });

        if (!monthlyGroups[monthKey]) {
            monthlyGroups[monthKey] = [];
        }

        if (weekly[label] >= 0) {
            monthlyGroups[monthKey].push(weekly[label]);
        }
    });

    const monthlyLabels = Object.keys(monthlyGroups);
    const averageData = monthlyLabels.map(month =>
        parseFloat(
            (
                monthlyGroups[month].reduce((sum, val) => sum + val, 0) / monthlyGroups[month].length
            ).toFixed(2)
        )
    );

    const data = {
        labels: monthlyLabels,
        datasets: [{
            label: 'Average Weekly Expenses',
            data: averageData,
            backgroundColor: 'rgba(255, 159, 64, 0.5)',
        }]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Average Weekly Expenses' },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Amount ($)'
                }
            }
        }
    };

    return <Bar data={data} options={options} />;
}

export default AvgWeeklyExpChart;
