import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Granularity = "WEEK" | "MONTH" | "YEAR";
export type TimeRange = "1W" | "1M" | "3M" | "1Y" | "MAX" | "CUSTOM";

interface CompanySelection {
    id: string;
    name: string;
    symbol: string;
    color?: string;
}

interface ChartState {
    selectedCompanies: CompanySelection[];
    granularity: Granularity;
    timeRange: TimeRange;
    customStartDate: string | null;
    customEndDate: string | null;
    baselineDate: string | null;
    isLoading: boolean;
    error: string | null;
    dataSource: "GASGOO" | "CPCA";
}

const initialState: ChartState = {
    selectedCompanies: [],
    granularity: "MONTH",
    timeRange: "MAX",
    customStartDate: null,
    customEndDate: null,
    baselineDate: null,
    isLoading: false,
    error: null,
    dataSource: "GASGOO",
};

const chartSlice = createSlice({
    name: "chart",
    initialState,
    reducers: {
        setDataSource: (state, action: PayloadAction<"GASGOO" | "CPCA">) => {
            state.dataSource = action.payload;
        },
        addCompany: (state, action: PayloadAction<CompanySelection>) => {
            if (!state.selectedCompanies.find(c => c.id === action.payload.id)) {
                state.selectedCompanies.push(action.payload);
            }
        },
        setSelectedCompany: (state, action: PayloadAction<CompanySelection>) => {
            state.selectedCompanies = [action.payload];
        },
        removeCompany: (state, action: PayloadAction<string>) => {
            state.selectedCompanies = state.selectedCompanies.filter(c => c.id !== action.payload);
        },
        setGranularity: (state, action: PayloadAction<Granularity>) => {
            state.granularity = action.payload;
        },
        setTimeRange: (state, action: PayloadAction<TimeRange>) => {
            state.timeRange = action.payload;
        },
        setCustomRange: (state, action: PayloadAction<{ start: string | null; end: string | null }>) => {
            state.customStartDate = action.payload.start;
            state.customEndDate = action.payload.end;
        },
        setBaselineDate: (state, action: PayloadAction<string | null>) => {
            state.baselineDate = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});

export const {
    addCompany,
    setSelectedCompany,
    removeCompany,
    setGranularity,
    setTimeRange,
    setCustomRange,
    setBaselineDate,
    setLoading,
    setError,
    setDataSource
} = chartSlice.actions;

export default chartSlice.reducer;
