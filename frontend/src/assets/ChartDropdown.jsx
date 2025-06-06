import { Listbox } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/20/solid'

const chartOptions = [
  { value: 'summary', label: 'Gross Expenses and Income' },
  { value: 'netIncome', label: 'Net Income' },
  { value: 'avgWeekly', label: 'Average Weekly Expenses' },
]

function ChartDropdown({ chartView, setChartView, isDarkMode }) {
  return (
    <div className="flex justify-end w-72">
      <Listbox value={chartView} onChange={setChartView}>
        <div className="relative">
          <Listbox.Button
            className={`
              relative w-full cursor-pointer rounded-md py-2 pl-3 pr-10 text-left text-xs 
              border shadow-sm 
              min-w-[19em]
              ${isDarkMode ? 'bg-neutral-900 text-white border-neutral-600' : 'bg-white text-black border-gray-100'}
            `}
          >
            {chartOptions.find(opt => opt.value === chartView)?.label}
            <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
              <ChevronUpDownIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
            </span>
          </Listbox.Button>

          <Listbox.Options className={`absolute mt-1 max-h-60 w-full overflow-auto rounded-md py-1 text-xs shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none
            ${isDarkMode ? 'bg-neutral-900 text-white' : 'bg-white text-black'}
          `}>
            {chartOptions.map((option) => (
              <Listbox.Option
                key={option.value}
                className={({ active }) =>
                  `cursor-pointer select-none px-4 py-2 transition-colors rounded-sm ${
                    active
                      ? isDarkMode
                        ? 'text-white hover:bg-neutral-800'
                        : 'bg-gray-100'
                      : isDarkMode ? 'hover:bg-gray-100' : ''

                  }`
                }
                value={option.value}
              >
                {option.label}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  )
}

export default ChartDropdown;