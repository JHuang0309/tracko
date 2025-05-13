from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
from track_expenses import process_csv, summarise_expenses, export_cleaned_expenses

app = FastAPI()

# allow frontend to connect to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload_csv(file: UploadFile = File(...)):
    contents = await file.read()
    df = pd.read_csv(io.BytesIO(contents))

    processed_df = process_csv(df)
    result = summarise_expenses(processed_df)
    return result

# @app.post("/upload")
# async def upload_csv(file: UploadFile = File(...)):
#     # For now, just confirm the file was received
#     if not file:
#         return {"error": "No file uploaded."}
    
#     # Simulating a successful upload response
#     return {"message": f"File '{file.filename}' uploaded successfully!"}
