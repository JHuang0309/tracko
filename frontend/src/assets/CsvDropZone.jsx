import { useState, useCallback } from 'react'
import { FiUpload } from 'react-icons/fi'
import { Upload, FileText, X, CheckCircle2 } from "lucide-react"

function CsvDropZone({ onFile }) {
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false)

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
                <div className="flex flex-col items-center justify-center border-2 border-gray-100 border-opacity-30 rounded-lg border-dashed p-8 w-full max-w-2xl bg-white bg-opacity-10 text-gray-900">
                    <FiUpload className="text-5xl mb-4 opacity-70 text-blue-600" />
                    <span className="text-lg font-bold mb-2">Selected file:</span>
                    <span className="text-md font-medium mb-4">{file.name}</span>
                    <div className="flex gap-4 w-full max-w-xs">
                        <button
                            type="button"
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-md p-3 w-1/2 transition-colors duration-200"
                            onClick={() => onFile(file)}
                        >
                            Process File
                        </button>
                        <button
                            type="button"
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-md p-3 w-1/2 transition-colors duration-200"
                            onClick={() => { setFile(null); document.getElementById('csv-upload').value = ''; }}
                        >
                            Choose Different File
                        </button>
                    </div>
                </div>
            ) : (
                <label
                    htmlFor="csv-upload"
                    className={`cursor-pointer flex flex-col items-center justify-center
                                border-2 border-gray-100 border-opacity-30 rounded-lg border-dashed
                                hover:border-blue-300 hover:ring-opacity-60
                                p-8 w-full sm:min-w-lg 
                                transition duration-300
                                ${isDragging ? 'border-opacity-80 bg-white bg-opacity-10' : 'bg-transparent'}
                                text-white`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <FiUpload className="text-5xl mb-4 opacity-70 text-gray-800"/>
                    <span className="text-lg font-bold mb-2 text-gray-900">Upload your expense data</span>
                    <span className="text-sm opacity-70 text-gray-700 max-w-md mb-6">Drag and drop your CSV file here, or click to browse and select from your computer</span>
                    <div className="relative mb-2 w-full max-w-xs">
                        <button
                            type="button"
                            className="bg-blue-600 rounded-md p-3 hover:bg-blue-500 transition duration-300"
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