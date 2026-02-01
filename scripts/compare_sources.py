import akshare as ak
import pandas as pd
import json

def get_gasgoo_data(date_str):
    try:
        print(f"Fetching Gasgoo data for {date_str}...")
        df = ak.car_sale_rank_gasgoo(symbol="车企榜", date=date_str)
        # Standardize
        # Column 1 is Manufacturer, Column 2 is Sales
        res = {}
        target_col = df.columns[1] 
        for _, row in df.iterrows():
            name = row['厂商']
            try:
                vol = int(row[target_col])
                res[name] = vol
            except:
                pass
        return res
    except Exception as e:
        print(f"Gasgoo Error: {e}")
        return {}

def get_cpca_data():
    try:
        print(f"Fetching CPCA data...")
        # 1. Wholesale (批发)
        try:
            df_wholesale = ak.car_market_man_rank_cpca(symbol="新能源乘用车-单月", indicator="批发")
            print(f"CPCA Wholesale Shape: {df_wholesale.shape if df_wholesale is not None else 'None'}")
        except Exception as e:
            print(f"CPCA Wholesale Fetch Error: {e}")
            df_wholesale = pd.DataFrame()

        # 2. Retail (零售)
        try:
            df_retail = ak.car_market_man_rank_cpca(symbol="新能源乘用车-单月", indicator="零售")
            print(f"CPCA Retail Shape: {df_retail.shape if df_retail is not None else 'None'}")
        except Exception as e:
            print(f"CPCA Retail Fetch Error: {e}")
            df_retail = pd.DataFrame()
        
        return df_wholesale, df_retail
    except Exception as e:
        print(f"CPCA Error: {e}")
        return None, None

def main():
    date_str = "202512"
    
    # 1. Get Gasgoo (Wholesale)
    gasgoo_map = get_gasgoo_data(date_str)
    
    # 2. Get CPCA
    # CPCA API might not filter by date directly in the args, it often returns a big table or latest.
    # We will print the head to understand structure.
    df_cpca_w, df_cpca_r = get_cpca_data()
    
    print("\n--- Data Sample (CPCA Wholesale) ---")
    if df_cpca_w is not None and not df_cpca_w.empty:
        print("Columns:", df_cpca_w.columns.tolist())
        print(df_cpca_w.head())
        # Filter for 2025-12 if date column exists
        # Likely columns: 排名, 厂商, 销量, 同比, 份额
        
    print("\n--- Comparison Report (Target: 2025-12) ---")
    targets = ["比亚迪汽车", "特斯拉中国", "吉利汽车", "长安汽车", "奇瑞汽车", "赛力斯汽车", "理想汽车"]
    
    print(f"{'Manufacturer':<15} | {'Gasgoo (Wholesale)':<20} | {'CPCA (Wholesale)':<20} | {'CPCA (Retail)':<20}")
    print("-" * 80)
    
    # Simple extraction helper (Assuming CPCA df has '厂商' and '销量' and implies latest month)
    # Note: CPCA API often returns the *latest* month ranking. 
    # If 2025-12 is not the latest, this comparison might be tricky without date param.
    # We will check if the result mentions the date.
    
    for t in targets:
        g_val = gasgoo_map.get(t, "N/A")
        
        c_w_val = "N/A"
        if df_cpca_w is not None and not df_cpca_w.empty and '厂商' in df_cpca_w.columns:
            match = df_cpca_w[df_cpca_w['厂商'].str.contains(t, na=False)]
            if not match.empty:
                # Try to find date matching 202512 if possible, or just take the row
                # We assume the API returns the latest list.
                c_w_val = match.iloc[0].get('销量', 'N/A')
        
        c_r_val = "N/A"
        if df_cpca_r is not None and not df_cpca_r.empty and '厂商' in df_cpca_r.columns:
            match = df_cpca_r[df_cpca_r['厂商'].str.contains(t, na=False)]
            if not match.empty:
                c_r_val = match.iloc[0].get('销量', 'N/A')
                
        print(f"{t:<15} | {str(g_val):<20} | {str(c_w_val):<20} | {str(c_r_val):<20}")

if __name__ == "__main__":
    main()
