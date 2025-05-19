import React from 'react';

const getShade = (amount, min, max) => {
    const range = max - min;
    const step = range / 5;
    if (amount <= min + step) return 'bg-[#dbeafe]';   // very light blue (like Tailwind's blue-100)
    if (amount <= min + step * 2) return 'bg-[#bfdbfe]'; // light blue (blue-200)
    if (amount <= min + step * 3) return 'bg-[#93c5fd]'; // blue-300
    if (amount <= min + step * 4) return 'bg-[#60a5fa]'; // blue-400
    return 'bg-[#3b82f6]';  // blue-500 (stronger blue)
  };
  

const formatCurrency = (val) =>
  `$${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

const WeeklyHeatmap = ({ weekly, darkMode }) => {
  const weeklyEntries = Object.entries(weekly || {});
  if (weeklyEntries.length === 0) return <p>No data available</p>;

  const amounts = weeklyEntries.map(([, amount]) => amount);
  const min = Math.min(...amounts);
  const max = Math.max(...amounts);

  // Group weeks by month
  const weeksByMonth = {};
  weeklyEntries.forEach(([week, amount]) => {
    const date = new Date(week); // Format: "30 Dec 2024"
    if (isNaN(date)) return;
    const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
    if (!weeksByMonth[month]) weeksByMonth[month] = [];
    weeksByMonth[month].push({ week, amount });
  });

  const monthLabels = Object.keys(weeksByMonth);
  const monthGrids = Object.values(weeksByMonth);

  return (
    <div className="flex flex-col justify-between mt-4 h-full">
      {/* Two-column layout */}
      <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-4">
        {monthLabels.map((month, i) => (
          <React.Fragment key={month}>
            {/* Left column: month label */}
            <div className={`flex items-center text-xs font-sm mt-[6px] ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {month}
            </div>

            {/* Right column: week grid */}
            <div className="grid grid-cols-7 gap-1 w-full">
              {monthGrids[i].map(({ week, amount }) => (
                <div
                  key={week}
                  title={`$${amount.toFixed(2)} on ${week}`}
                  className={`rounded ${getShade(amount, min, max)} aspect-square`}
                />
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Legend */}
      <div className="min-w-full mt-6">
        <div className={`flex justify-between w-full text-xs ${darkMode ? 'text-white' : 'text-gray-700'}`}>
          {[...Array(5)].map((_, i) => {
            const start = min + ((i * (max - min)) / 5);
            const end = min + (((i + 1) * (max - min)) / 5);
            return (
              <div key={i} className="mx-1 text-center">
                <div className={`h-5 w-8 rounded mb-1 mx-auto ${getShade(start + 1, min, max)}`} />
                <div>{formatCurrency(start)}–{formatCurrency(end)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeeklyHeatmap;
