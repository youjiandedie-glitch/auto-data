import akshare as ak
import pandas as pd
import json
import sys
import argparse
import os
from datetime import datetime

def load_mapping():
    mapping_path = os.path.join(os.path.dirname(__file__), "model_mapping.json")
    if os.path.exists(mapping_path):
        with open(mapping_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

def match_manufacturer(model_name, mapping):
    """
    Match model name to manufacturer based on mapping.
    """
    for manufacturer, models in mapping.items():
        # Exact match or Model name starts with any keyword in models
        # e.g., 'Model Y' matches 'Model Y' or 'Tesle Model Y'? 
        # Actually our mapping has '海鸥'. 
        # If model_name is '比亚迪海鸥' it matches '海鸥'
        for m in models:
            if m.lower() in model_name.lower():
                return manufacturer
        
        # Also try prefix match with manufacturer name
        if manufacturer in model_name:
            return manufacturer
            
    return None

def fetch_model_sales(date_str, mapping):
    """
    Fetch model sales ranking from Gasgoo.
    """
    try:
        df = ak.car_sale_rank_gasgoo(symbol="车型榜", date=date_str)
        if df.empty:
            return []
            
        results = []
        # Columns: ['车型', '2024-12', ...]
        month_col = None
        for col in df.columns:
            if date_str[:4] in col and date_str[4:].lstrip('0') in col:
                month_col = col
                break
        if not month_col:
            month_col = df.columns[1]

        for _, row in df.iterrows():
            model_name = row['车型']
            vol = int(row[month_col]) if not pd.isna(row[month_col]) else 0
            if vol <= 0:
                continue
                
            manufacturer = match_manufacturer(model_name, mapping)
            # Only include models from our tracked brands (or all if we want, but task said focused)
            if manufacturer:
                results.append({
                    "name": manufacturer, # For backward compatibility or grouping
                    "model_name": model_name,
                    "volume": vol,
                    "date": date_str
                })
        return results
    except Exception as e:
        print(f"Error fetching model sales for {date_str}: {e}", file=sys.stderr)
        return []

def fetch_manufacturer_sales(date_str):
    """
    Fetch manufacturer sales ranking from Gasgoo.
    """
    try:
        df = ak.car_sale_rank_gasgoo(symbol="车企榜", date=date_str)
        if df.empty:
            return []
        
        month_col = None
        for col in df.columns:
            if date_str[:4] in col and date_str[4:].lstrip('0') in col:
                month_col = col
                break
        if not month_col:
            month_col = df.columns[1]

        results = []
        for _, row in df.iterrows():
            vol = int(row[month_col]) if not pd.isna(row[month_col]) else 0
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

def fetch_cpca_sales():
    """
    Fetch CPCA manufacturer sales ranking.
    """
    try:
        df = ak.car_market_man_rank_cpca(symbol="狭义乘用车-单月", indicator="批发")
        if df.empty:
            return []

        results = []
        for col in df.columns:
            if "年" in col and "月" in col and "厂商" not in col:
                try:
                    y_str, m_str = col.replace("月", "").split("年")
                    formatted_date = f"{y_str}{int(m_str):02d}"
                    
                    for _, row in df.iterrows():
                        man_name = row['厂商']
                        vol_raw = row[col]
                        if pd.isna(vol_raw): continue
                        vol = int(float(vol_raw) * 10000)
                        if vol > 0:
                            results.append({
                                "name": man_name,
                                "volume": vol,
                                "date": formatted_date
                            })
                except: pass
        return results
    except Exception as e:
        print(f"Error fetching CPCA: {e}", file=sys.stderr)
        return []

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--months", type=int, default=12, help="Number of months")
    parser.add_argument("--source", type=str, default="gasgoo", choices=["gasgoo", "cpca", "gasgoo_models"], help="Data source")
    args = parser.parse_args()

    mapping = load_mapping()
    all_data = []

    if args.source == "cpca":
        all_data = fetch_cpca_sales()
    elif args.source == "gasgoo_models":
        now = datetime.now()
        for i in range(args.months):
            month = now.month - i - 2 # Start from 2 months ago to be safe
            year = now.year
            while month <= 0:
                month += 12
                year -= 1
            date_str = f"{year}{month:02d}"
            print(f"DEBUG: Fetching gasgoo_models for {date_str}...", file=sys.stderr)
            all_data.extend(fetch_model_sales(date_str, mapping))
    else:
        now = datetime.now()
        for i in range(args.months):
            month = now.month - i - 1
            year = now.year
            while month <= 0:
                month += 12
                year -= 1
            date_str = f"{year}{month:02d}"
            all_data.extend(fetch_manufacturer_sales(date_str))

    print(json.dumps(all_data, ensure_ascii=False))

if __name__ == "__main__":
    main()
