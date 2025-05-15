import { useState, useCallback } from 'react'
import { FiUpload } from 'react-icons/fi'

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
        <label
        htmlFor="csv-upload"
        className={`cursor-pointer flex flex-col items-center justify-center
                    border border-white border-opacity-30 rounded-lg
                    p-12 w-full max-w-md mx-auto
                    transition-colors duration-200
                    ${isDragging ? 'border-opacity-80 bg-white bg-opacity-10' : 'bg-transparent'}
                    text-white`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        >
        <FiUpload className="text-5xl mb-4 opacity-70" />
        <span className="text-lg font-semibold mb-2">Drag & drop your CSV file here</span>
        <span className="text-sm opacity-70">or click to browse</span>
        <input
            id="csv-upload"
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={handleFileInput}
        />
        {file && <p className="mt-4">Selected file: {file.name}</p>}
        </label>
    )
}

export default CsvDropZone;