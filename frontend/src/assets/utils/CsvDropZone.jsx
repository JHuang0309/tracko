import { useState, useCallback, useEffect } from 'react'
import { FiUpload } from 'react-icons/fi'
import { Upload, FileText, X, CheckCircle2 } from "lucide-react"

function CsvDropZone({ onFile, buttonHandle, isDarkMode }) {
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false)
    const [darkMode, setDarkMode] = useState(isDarkMode);

    useEffect(() => {
        setDarkMode(isDarkMode);
    }, [isDarkMode]);

    const handleDragOver = useCallback((e) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])

    const handleDrop = useCallback((e) => {
        e.preventDefault()
        setIsDragging(false)
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0]
            if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
                setFile(file)
                onFile(file)
            } else {
                alert('Please upload a valid CSV file')
            }
            e.dataTransfer.clearData()
        }
    }, [onFile])

    const handleFileInput = (e) => {
        const file = e.target.files[0]
        setFile(file)
        if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
            onFile(file)
        } else {
            alert('Please upload a valid CSV file')
        }
    }

    return (
        <div>
            {file ? (
                <label
                    htmlFor="csv-upload"
                    className={`flex flex-col items-center justify-center
                                border-2 border-opacity-30 rounded-lg border-dashed
                                ${darkMode ? 'border-gray-600 hover:border-blue-900' : 'border-gray-100 hover:border-blue-300'}
                                hover:ring-opacity-60
                                p-8 w-full max-w-md sm:min-w-lg 
                                transition duration-300
                                ${isDragging ? 'border-opacity-80 bg-opacity-10' : (darkMode ? 'bg-neutral-900' : 'bg-white')}
                                `}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <CheckCircle2 className='text-5xl w-16 h-16 text-blue-600 mb-2'/>
                    <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>File Uploaded Succesfully!</h2>
                    <div className={`flex items-center mb-4 p-4 rounded-md ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                        <FileText className="opacity-70 text-blue-600 mr-4" />
                        <div className='flex flex-col text-left'>
                            <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {file.name}
                            </div>
                            <div className="text-sm text-gray-500">
                                {(file.size / 1024).toFixed(1)} KB
                            </div>
                        </div>
                        <X 
                          className={`h-4  justify-end ml-4 cursor-pointer ${darkMode ? 'text-white' : 'text-gray-900'}`}
                          onClick={e => { 
                            e.preventDefault(); 
                            setFile(null); 
                            document.getElementById('csv-upload').value = ''; 
                          }}
                        />
                    </div>
                    <span className={`text-md opacity-70 max-w-md mb-6 ${darkMode ? 'text-blue-200' : 'text-gray-700'}`}>Your expense data has been uploaded. You can now view your financial insights.</span>
                    <div className="flex relative mb-2 w-full max-w-xs justify-center gap-4">
                        <button
                            type="button"
                            className={`bg-blue-600 font-semibold rounded-md px-4 py-2 hover:bg-blue-500 transition duration-300 text-white`}
                            onClick={buttonHandle}
                        >
                            View Dashboard
                        </button>
                        <button
                            type="button"
                            className={`border font-semibold rounded-md px-4 py-2 transition duration-300 ${darkMode ? 'border-gray-600 hover:bg-gray-700 text-white' : 'text-gray-900 hover:bg-gray-100 '}`}
                            onClick={e => { e.preventDefault(); document.getElementById('csv-upload').click(); }}
                        >
                            Choose Different File
                        </button>
                        <input
                            id="csv-upload"
                            type="file"
                            accept=".csv,text/csv"
                            className="hidden"
                            onClick={e => {
                                e.preventDefault(); 
                                setFile(null); 
                            }}
                        />
                    </div>
                </label>
            ) : (
                <label
                    htmlFor="csv-upload"
                    className={`cursor-pointer flex flex-col items-center justify-center
                                border-2  border-opacity-30 rounded-lg border-dashed
                                ${darkMode ? 'border-gray-600 hover:border-blue-900' : 'border-gray-100 hover:border-blue-300'}
                                hover:ring-opacity-60
                                p-8 w-full max-w-md sm:min-w-lg 
                                transition duration-300
                                ${isDragging ? 'border-opacity-80 bg-opacity-10' : (darkMode ? 'bg-neutral-900' : 'bg-white')}
                                `}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <FiUpload className={`text-5xl mb-4 opacity-70 ${darkMode ? 'text-blue-200' : 'text-gray-800'}`}/>
                    <span className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Upload your expense data</span>
                    <span className={`text-sm opacity-70 max-w-md mb-6 ${darkMode ? 'text-blue-200' : 'text-gray-700'}`}>Drag and drop your CSV file here, or click to browse and select from your computer</span>
                    <div className="relative mb-2 w-full max-w-xs">
                        <button
                            type="button"
                            className="bg-blue-600 rounded-md p-3 hover:bg-blue-500 transition duration-300 text-white"
                            onClick={e => { e.preventDefault(); document.getElementById('csv-upload').click(); }}
                        >
                            Choose CSV File
                        </button>
                        <input
                            id="csv-upload"
                            type="file"
                            accept=".csv,text/csv"
                            className="hidden"
                            onChange={handleFileInput}
                        />
                    </div>
                    <p className='text-xs text-gray-500'>Supports .csv files up to 10MB</p>
                </label>
            )}
        </div>
    )
}

export default CsvDropZone;