from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi import HTTPException
import pandas as pd
import io
from io import StringIO
from track_expenses import process_csv, summarise_expenses, clean_data, get_top_expenses_by_month

app = FastAPI()
stored_df = None

# allow frontend to connect to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://tracko-nine.vercel.app"
        # "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Backend is running"}

@app.post("/upload")
async def upload_csv(file: UploadFile = File(...)):
    contents = await file.read()
    df = pd.read_csv(io.BytesIO(contents))
    processed_df = process_csv(df)

    global stored_df
    stored_df = processed_df

    result = summarise_expenses(processed_df)
    return result

@app.get("/download_cleaned_csv")
def download_cleaned_csv():
    if stored_df is None or stored_df.empty:
        raise HTTPException(status_code=400, detail="No data to export.")
    
    cleaned_df = clean_data(stored_df)
    
    stream = StringIO()
    cleaned_df.to_csv(stream, index=False)
    stream.seek(0)

    return StreamingResponse(stream, media_type="text/csv", headers={
        "Content-Disposition": "attachment; filename=cleaned_expenses.csv"
    })

@app.get("/cleaned_expenses")
def get_cleaned_expenses():
    if stored_df is None or stored_df.empty:
        raise HTTPException(status_code=400, detail="No data to export.")
    
    return clean_data(stored_df).to_dict(orient="records")


@app.get("/top_expenses_by_month")
def top_expenses_by_month():
    if stored_df is None or stored_df.empty:
        raise HTTPException(status_code=400, detail="No data available.")

    result = get_top_expenses_by_month(stored_df)
    return result
