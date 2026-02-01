import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Granularity = "WEEK" | "MONTH" | "YEAR";
export type TimeRange = "1W" | "1M" | "3M" | "1Y" | "MAX";

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
    baselineDate: string | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: ChartState = {
    selectedCompanies: [],
    granularity: "MONTH",
    timeRange: "MAX",
    baselineDate: null,
    isLoading: false,
    error: null,
};

const chartSlice = createSlice({
    name: "chart",
    initialState,
    reducers: {
        addCompany: (state, action: PayloadAction<CompanySelection>) => {
            if (!state.selectedCompanies.find(c => c.id === action.payload.id)) {
                state.selectedCompanies.push(action.payload);
            }
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
    removeCompany,
    setGranularity,
    setTimeRange,
    setBaselineDate,
    setLoading,
    setError
} = chartSlice.actions;

export default chartSlice.reducer;
