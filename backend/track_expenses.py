import csv
import re
from datetime import datetime
from collections import defaultdict
import pandas as pd

# Narrative Filters
INCLUDE_CODES = [
    re.compile(r'DEBIT CARD PURCHASE', re.IGNORECASE), # debit card purchases from checking account
    re.compile(r'EFTPOS DEBIT', re.IGNORECASE), # checking account debit transaction via Beem
    re.compile(r'EFTPOS CREDIT', re.IGNORECASE), # checking account credit transactions via Beem
]

REMOVE_KEYWORDS = ['DEBIT', 'CARD', 'PURCHASE', 'EFTPOS', 'CREDIT']

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

def export_cleaned_expenses(df, output_path='cleaned_expenses.csv'):
    if df.empty:
        print("No records to export.")
        return

    # Select only relevant columns
    export_df = df[['Date', 'Category', 'Amount', 'Month', 'Week']].copy()

    # Sort by Date
    export_df.sort_values(by='Date', ascending=False, inplace=True)

    # Write to CSV
    export_df.to_csv(output_path, index=False)
    print(f"\n✅ Cleaned expense records exported to: {output_path}")


def process_csv(df):
    records = []
    for _, row in df.iterrows():
        date = row['Date']
        narrative = row['Narrative']
        debit = row['Debit Amount'].strip()
        credit = row['Credit Amount'].strip()

        if not is_valid_expense(narrative):
            continue
            
        try:
            date = datetime.strptime(date, "%d/%m/%Y")
            debit_amt = float(debit.replace(',', '')) if debit else 0.0
            credit_amt = float(credit.replace(',', '')) if credit else 0.0
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
    processed_df['Week'] = processed_df['Date'].dt.to_period('W').apply(lambda r: r.start_time)
    processed_df['Month'] = processed_df['Date'].dt.to_period('M').astype(str)
    return processed_df

def summarise_expenses(df):
    if df.empty:
        print("No valid expense data found.")
        return

    # Ensure datetime columns exist
    df['Week'] = df['Date'].dt.to_period('W').apply(lambda r: r.start_time)
    df['Month'] = df['Date'].dt.to_period('M').astype(str)

    monthly_totals = df.groupby('Month')['Amount'].sum().round(2)
    weekly_totals = df.groupby('Week')['Amount'].sum().round(2)

    print("\n--- Monthly Expenses ---")
    print(monthly_totals)

    print("\n--- Weekly Expenses ---")
    print(weekly_totals)


if __name__ == "__main__":
    file_path = input("Enter the path to your CSV file: ").strip()
    df = process_csv(file_path)
    summarise_expenses(df)
    export_cleaned_expenses(df)




