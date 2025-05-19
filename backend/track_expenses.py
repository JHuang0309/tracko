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
        return 'General / Miscellaneous';

    df['Category'] = df['Category'].apply(match_category)
    return df

def get_top_expenses_by_month(df):
    if df.empty:
        return {}

    df['Month'] = pd.to_datetime(df['Date']).dt.to_period('M').astype(str)
    monthly_top_expenses = {}

    for month, group in df.groupby('Month'):
        top_3 = group.sort_values(by='Amount', ascending=False).head(3)
        monthly_top_expenses[month] = top_3[['Date', 'Category', 'Amount']].to_dict(orient='records')

    return monthly_top_expenses


def process_csv(df):
    records = []

    if {'Date', 'Narrative', 'Debit Amount', 'Credit Amount'}.issubset(df.columns):
        format_type = 'westpac'
    elif {'Date', 'Description', 'Amount'}.issubset(df.columns):
        format_type = 'simple'
    else:
        raise ValueError("Unrecognized CSV format")

    for _, row in df.iterrows():
        try:
            date_str = row['Date']
            date = datetime.strptime(date_str, "%d/%m/%Y")
        except Exception:
            continue  # skip rows with bad dates

        if format_type == 'westpac':
            narrative = row['Narrative']
            if not is_valid_expense(narrative):
                continue
            debit = float(row['Debit Amount']) if pd.notna(row['Debit Amount']) else 0.0
            credit = float(row['Credit Amount']) if pd.notna(row['Credit Amount']) else 0.0
            amount = debit if debit > 0 else -credit
            cleaned_narrative = clean_narrative(narrative)

        elif format_type == 'simple':
            narrative = row['Description']
            if not is_valid_expense(narrative):
                continue
            amount = float(row['Amount'])
            cleaned_narrative = clean_narrative(narrative)
            debit = amount if amount > 0 else 0.0
            credit = -amount if amount < 0 else 0.0

        records.append({
            'Date': date,
            'Category': cleaned_narrative,
            'Debit': debit,
            'Credit': credit,
            'Amount': amount,
        })

    processed_df = pd.DataFrame(records)

    # Enrich with time periods
    processed_df['WeekStart'] = processed_df['Date'].dt.to_period('W').apply(lambda r: r.start_time)
    processed_df['MonthStart'] = processed_df['Date'].dt.to_period('M').apply(lambda r: r.start_time)
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
    


