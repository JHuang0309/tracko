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
  
import { Chart } from 'react-chartjs-2';
import React from 'react';

function NetIncomeChart({ weekly, weeklyIncome, darkMode }) {
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
            }
        ]
    };

    const getChartOptions = (isDarkMode) => {
        const textColor = isDarkMode ? '#ffffff' : '#1f2937';
        return {
            responsive: true,
            plugins: {
                legend: { 
                    display: true,
                    labels: {
                        color: textColor,
                    }
                },
                title: { display: true, text: 'Net Weekly Income' }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Amount ($)',
                        color: textColor,
                    },
                    ticks: {
                      color: textColor
                    }
                },
                x: {
                    // title: {
                    //     display: true,
                    //     text: 'Week',
                    //     color: textColor
                    // },
                    ticks: {
                      color: textColor
                    }
                }
            }
        }
    }

    return <Chart type="bar" data={data} options={getChartOptions(darkMode)} />;
}

export default NetIncomeChart;