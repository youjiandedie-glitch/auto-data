import akshare as ak
import pandas as pd
import json
import sys
import argparse
from datetime import datetime

def fetch_manufacturer_sales(date_str):
    """
    Fetch manufacturer sales ranking from Gasgoo via AkShare.
    date_str: YYYYMM format
    """
    try:
        # car_sale_rank_gasgoo returns a subset of companies for a given month
        df = ak.car_sale_rank_gasgoo(symbol="车企榜", date=date_str)
        if df.empty:
            return []
        
        # Mapping column names to standard English keys
        # df columns: ['厂商', '2024-12', '12月同比', '12月环比', '2024-1到12', ...]
        # We look for the column that matches current month (date_str)
        month_col = f"{date_str[:4]}-{int(date_str[4:]):01d}"
        # Some versions might have different column names, let's be safe
        target_col = None
        for col in df.columns:
            if date_str[:4] in col and date_str[4:].lstrip('0') in col:
                target_col = col
                break
        
        if not target_col:
            # Fallback to the second column if name matching fails
            target_col = df.columns[1]

        results = []
        for _, row in df.iterrows():
            vol = int(row[target_col]) if not pd.isna(row[target_col]) else 0
            if vol <= 0:
                continue
            results.append({
                "name": row['厂商'],
                "volume": vol,
                "date": date_str
            })
        return results
    except Exception as e:
        print(f"Error fetching for {date_str}: {e}", file=sys.stderr)
        return []

def fetch_cpca_sales(month_offset=0):
    """
    Fetch CPCA manufacturer sales ranking.
    CPCA API returns a table with ALL available months in columns, or a subset.
    We need to parse columns like '2025年12月'.
    month_offset: 0 = current/latest, 1 = prev month, etc. (Not strictly used if API returns full table)
    """
    try:
        # symbol="狭义乘用车-单月", indicator="批发"
        df = ak.car_market_man_rank_cpca(symbol="狭义乘用车-单月", indicator="批发")
        if df.empty:
            return []

        results = []
        # Columns format: "厂商", "2024年12月", "2025年12月"...
        # We process all date columns found
        for col in df.columns:
            if "年" in col and "月" in col and "厂商" not in col:
                # Parse date: 2025年12月 -> 202512
                try:
                    y_str, m_str = col.replace("月", "").split("年")
                    formatted_date = f"{y_str}{int(m_str):02d}"
                    
                    for _, row in df.iterrows():
                        man_name = row['厂商']
                        vol_raw = row[col]
                        if pd.isna(vol_raw):
                            continue
                        # CPCA unit is usually "万辆", need to verify with user/data
                        # Earlier test: BYD 41.4784 -> 414784 (So unit is 10000)
                        vol = int(float(vol_raw) * 10000)
                        
                        if vol > 0:
                            results.append({
                                "name": man_name,
                                "volume": vol,
                                "date": formatted_date
                            })
                except Exception as e:
                    # Ignore non-date columns
                    pass
                    
        return results
    except Exception as e:
        print(f"Error fetching CPCA: {e}", file=sys.stderr)
        return []

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--months", type=int, default=12, help="Number of months (for Gasgoo)")
    parser.add_argument("--source", type=str, default="gasgoo", choices=["gasgoo", "cpca"], help="Data source")
    args = parser.parse_args()

    all_data = []

    if args.source == "cpca":
        # CPCA API returns a wide table with history, so we fetch once
        all_data = fetch_cpca_sales()
    else:
        # Gasgoo logic (Iterative by month)
        now = datetime.now()
        for i in range(args.months):
            month = now.month - i
            year = now.year
            while month <= 0:
                month += 12
                year -= 1
            
            date_str = f"{year}{month:02d}"
            month_data = fetch_manufacturer_sales(date_str)
            all_data.extend(month_data)

    print(json.dumps(all_data, ensure_ascii=False))

if __name__ == "__main__":
    main()
