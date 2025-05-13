import { useState } from 'react'
import axios from 'axios';
import './App.css'

function App() {
    const [csvFile, setCsvFile] = useState(null);
    const [summary, setSummary] = useState(null);

    const handleUpload = async () => {
        if (!csvFile) return;
        const formData = new FormData();
        formData.append("file", csvFile);

        try {
            const response = await axios.post("http://localhost:8000/upload", formData, {
                headers: {"Content-Type": "multipart/form-data"},
            });
            setSummary(response.data);
        } catch (err) {
            alert("Error uploading file");
        }
    };

    return (
        <>
            <h1>Tracko - Expense Tracker</h1>
            <input type="file" accept=".csv" onChange={(e) => setCsvFile(e.target.files[0])} />
            <button onClick={handleUpload}>Upload</button>

            {summary && (
                <div>
                    <h2>Monthyl Summary</h2>
                    <ul>
                        {Object.entries(summary.monthly.map(([month, amount]) => (
                            <li key={month}>{month}: ${amount}</li>
                        )))}
                    </ul>
                    <h2>Weekly Summary</h2>
                    <ul>
                        {Object.entries(summary.weekly.map(([week, amount]) => (
                            <li key={week}>{week}: ${amount}</li>
                        )))}
                    </ul>
                </div>
            )}
        </>
    );
}

export default App
