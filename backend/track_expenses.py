import re
from datetime import datetime
import pandas as pd

# Narrative Filters
INCLUDE_CODES = [
    re.compile(r'DEBIT CARD PURCHASE', re.IGNORECASE), # debit card purchases from checking account
    re.compile(r'EFTPOS DEBIT', re.IGNORECASE), # checking account debit transaction via Beem
    re.compile(r'EFTPOS CREDIT', re.IGNORECASE), # checking account credit transactions via Beem
]

REMOVE_KEYWORDS = ['DEBIT', 'CARD', 'PURCHASE', 'EFTPOS', 'CREDIT']

# Define keyword-to-category mappings
CATEGORY_KEYWORDS = {
    "speedway": "Fuel / Transport",
    "opal": "Fuel / Transport",
    "dentistry": "Health / Personal Care",
    "allans": "Health / Personal Care",
    "woolworths": "Groceries",
    "coles": "Groceries",
    "parking": "Fuel / Transport",
    "beem": "University / Societies (Beem)",
    "tennis": "Sport / Exercise",
    "golf": "Sport / Exercise",
    "mcdonalds": "Food / Takeout",
    "yo-chi": "Food / Takeout",
    "guzman": "Food / Takeout",
    "supermarket": "Groceries",
}

def is_valid_expense(narrative):
    narrative_upper = narrative.upper()
    return any(label.search(narrative_upper) for label in INCLUDE_CODES)

def clean_narrative(narrative):
    # Handle Beem case
    narrative_upper = narrative.upper()
    if "BEEM" in narrative_upper:
        if "EFTPOS CREDIT" in narrative_upper:
            return "Beem Credit"
        elif "EFTPOS DEBIT" in narrative_upper:
            return "Beem Debit"
        else:
            return "Beem"
    
    # Handle regular case
    for word in REMOVE_KEYWORDS:
        narrative = re.sub(r'\b' + word + r'\b', '', narrative, flags=re.IGNORECASE)
    return re.sub(r'\s+', ' ', narrative).strip()

def standardise_categories(df):
    if 'Category' not in df.columns:
        return df

    def match_category(original):
        # check for empty record
        if pd.isna(original):
            return original
        # convert category value to a string
        text = str(original).lower()
        for keyword, mapped_category in CATEGORY_KEYWORDS.items():
            if re.search(rf"\b{re.escape(keyword)}\b", text):
                return mapped_category
        return original  # return original if no keyword matched

    df['Category'] = df['Category'].apply(match_category)
    return df

def process_csv(df):
    records = []
    for _, row in df.iterrows():
        date = row['Date']
        narrative = row['Narrative']
        debit = row['Debit Amount']
        credit = row['Credit Amount']

        if not is_valid_expense(narrative):
            continue
            
        try:
            date = datetime.strptime(date, "%d/%m/%Y")
            debit_amt = float(debit) if pd.notna(debit) else 0.0
            credit_amt = float(credit) if pd.notna(credit) else 0.0
        except ValueError:
            continue

        # categorise narrative (remove clutter)
        cleaned_narrative = clean_narrative(narrative)

        records.append({
            'Date': date,
            'Category': cleaned_narrative,
            'Debit': debit_amt,
            'Credit': credit_amt,
            'Amount': debit_amt if debit_amt > 0 else -credit_amt,
        })

    processed_df = pd.DataFrame(records)
    
    # Add a datetime object column for sorting
    processed_df['WeekStart'] = processed_df['Date'].dt.to_period('W').apply(lambda r: r.start_time)
    processed_df['MonthStart'] = processed_df['Date'].dt.to_period('M').apply(lambda r: r.start_time)

    # Add formatted string columns for display
    processed_df['Week'] = processed_df['WeekStart'].dt.strftime('%d %b %Y')
    processed_df['Month'] = processed_df['MonthStart'].dt.strftime('%B %Y')

    return processed_df

def summarise_expenses(df):
    if df.empty:
        print("No valid expense data found.")
        return

    months = (
        df.groupby(['MonthStart', 'Month'])['Amount']
        .sum()
        .sort_index(ascending=False)
        .round(2)
    )

    weeks = (
        df.groupby(['WeekStart', 'Week'])['Amount']
        .sum()
        .sort_index(ascending=False)
        .round(2)
    )

    # Drop datetime index and keep only display strings for output
    monthly_dict = dict(months.droplevel(0))
    weekly_dict = dict(weeks.droplevel(0))

    return {
        "weekly": weekly_dict,
        "monthly": monthly_dict,
        "records": df.to_dict(orient="records")
    }



def clean_data(df):
    if df.empty:
        print("No records to export.")
        return

    # Select only relevant columns
    export_df = df[['Date', 'Category', 'Amount', 'Month', 'Week']].copy()
    export_df = standardise_categories(export_df)

    # Sort by Date
    export_df.sort_values(by='Date', ascending=False, inplace=True)

    return export_df
    


