import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import React from 'react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function NetIncomeChart({ weekly, weeklyIncome }) {
    const labels = Object.keys(weekly).sort((a, b) => new Date(a) - new Date(b));
    const netIncome = labels.map(label => {
        return weeklyIncome -weekly[label]
    });

    const data = {
        labels,
        datasets: [
            {
                label: 'Net Weekly Income',
                data: netIncome,
                backgroundColor: 'rgba(132, 204, 22, 0.6)',
                borderRadius: 4,
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: true },
            title: { display: true, text: 'Net Weekly Income' }
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
                title: {
                    display: true,
                    text: 'Week'
                }
            }
        }
    };
    return <Chart type="bar" data={data} options={options} />;
}

export default NetIncomeChart;