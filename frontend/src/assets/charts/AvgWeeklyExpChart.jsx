import {
    Chart as ChartJS,
    LineController,
    LineElement,
    PointElement,
    BarController,
    BarElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  
  ChartJS.register(
    LineController,
    LineElement,
    PointElement,
    BarController,
    BarElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend,
  );
  
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function AvgWeeklyExpChart({ weekly, labels, darkMode }) {
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
            backgroundColor: '#f69f62',
        }]
    };

    const getChartOptions = (isDarkMode) => {
        const textColor = isDarkMode ? '#ffffff' : '#1f2937';
        return {
            responsive: true,
            plugins: {
                legend: { 
                    position: 'top',
                    labels: {
                        color: textColor
                    }
                },
                title: { 
                    display: true,
                    text: 'Average Weekly Expenses',
                    color: textColor
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Amount ($)',
                        color: textColor
                    },
                    ticks: {
                        color: textColor
                    }
                },
                x: {
                    type: 'category',
                    // title: {
                    //     display: true,
                    //     text: 'Months',
                    //     color: textColor
                    // },
                    ticks: {
                        color: textColor
                    }
                }
            }
        }
    }
    return <Bar data={data} options={getChartOptions(darkMode)} />;
}

export default AvgWeeklyExpChart;
