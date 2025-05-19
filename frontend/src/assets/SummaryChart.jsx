import { Chart } from 'react-chartjs-2';

const WEEKS_PER_MONTH = 3.5

const colors = {
    'primary1': '#7e87f6',
    'primary2': '#f69f62',
    'secondary1': '#70aefd',
    'secondary2': '#fd77c9',
    'bgSecondary1': '#e3f0fd',
    'bgSecondary2': '#eed4da',
}

function SummaryChart({ monthly, weekly, weeklyIncome, darkMode }) {

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
                label: 'Monthly Expenses',
                data: monthlyData,
                backgroundColor: colors.primary1,
                yAxisID: 'y',
                order: 2,
                barPercentage: 0.8,
                categoryPercentage: 0.8,
            },
            {
                type: 'bar',
                label: 'Monthly Income',
                data: monthlyIncomeData,
                backgroundColor: colors.primary2,
                yAxisID: 'y',
                order: 1,
                barPercentage: 0.8,
                categoryPercentage: 0.8,
                offset: true,
            },
            {
                type: 'line',
                label: 'Weekly Expenses',
                data: weeklyData,
                borderColor: colors.secondary1,
                backgroundColor: colors.bgSecondary1,
                yAxisID: 'y',
                order: 1,
                fill: false,
                spanGaps: true,
            },
            {
                type: 'line',
                label: 'Weekly Income',
                data: incomeLine,
                borderColor: colors.secondary2,
                backgroundColor: colors.bgSecondary2,
                borderWidth: 2,
                fill: false,
                tension: 0.4,
                pointRadius: 0,
            },              
        ]
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
                text: 'Monthly vs Weekly Expenditure & Income',
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
                //   display: true,
                //   text: 'Months',
                //   color: textColor
                // },
                ticks: {
                  color: textColor
                }
              }
            }
          };
        };

    return <Chart type='bar' data={data} options={getChartOptions(darkMode)} />;
}

export default SummaryChart;