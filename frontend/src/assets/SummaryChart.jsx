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

function SummaryChart({ monthly, weekly }) {
    const labels = Array.from(new Set([
        ...Object.keys(monthly),
        ...Object.keys(weekly),
    ])).sort((a, b) => new Date(a) - new Date(b));

    const monthlyData = labels.map(label => monthly[label] ?? null);
    const weeklyData = labels.map(label => weekly[label] ?? null);

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
            },
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Monthly vs Weekly Expenditure' },
          },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Expenditure ($)'
                }
            }
        }
    }

    return <Chart type='bar' data={data} options={options} />;
}

export default SummaryChart;