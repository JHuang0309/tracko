from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
from track_expenses import process_csv, summarise_expenses, export_cleaned_expenses

app = FastAPI()

# allow frontend to connect to backend
app.addmiddleware(
    CORSMiddleware,
    allow_origins=["http://locahost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload_csv(file: UploadFile = File(...)):
    contents = await file.read()
    df = pd.read_csv(io.StringIO(contents.decode("utf-8")))

    processed_df = process_csv(df)
    result = {
        "weekly": processed_df.groupby("Week")["Amount"].sum().round(2).to_dict(),
        "monthly": processed_df.groupby("Month")["Amount"].sum().round(2).to_dict(),
        "records": processed_df.to_dict(orient="records")
    }
    return result