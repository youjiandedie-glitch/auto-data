"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setGranularity, setLoading, setError, setTimeRange, setDataSource, setCustomRange } from "@/store/slices/chartSlice";
import MainChart from "./charts/MainChart";
import CompanyPicker from "./CompanyPicker";
import { TrendingUp, BarChart2, RefreshCw, Calendar, ChevronDown } from "lucide-react";

export default function AnalyticsDashboard() {
    const dispatch = useAppDispatch();
    const { selectedCompanies, granularity, isLoading, timeRange, dataSource, customStartDate, customEndDate } = useAppSelector(state => state.chart);
    const [chartData, setChartData] = useState<any>(null);

    const fetchData = useCallback(async () => {
        if (selectedCompanies.length === 0) return;

        dispatch(setLoading(true));
        try {
            const primary = selectedCompanies[0];
            const res = await fetch(`/api/charts?companyId=${primary.id}&periodType=${granularity}&source=${dataSource}`);
            const data = await res.json();

            if (data.error) throw new Error(data.error);
            setChartData(data);
        } catch (err: any) {
            dispatch(setError(err.message));
        } finally {
            dispatch(setLoading(false));
        }
    }, [selectedCompanies, granularity, dispatch]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleZoom = (level: "WEEK" | "MONTH" | "YEAR") => {
        if (level !== granularity) {
            dispatch(setGranularity(level));
        }
    };

    const syncAll = async () => {
        alert("正在同步数据，可能需要几十秒...");
        await fetch("/api/sync", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ source: dataSource })
        });
        fetchData();
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-display font-bold tracking-tight text-slate-900">
                    中国车企 <span className="text-blue-600">关联分析</span>
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    实时分析销量增长与股价波动之间的相关性
                </p>
            </div>

            {/* Top Control Panel */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-end gap-4">
                {/* Brand Dropdown (CompanyPicker) */}
                <div className="flex flex-col gap-2 w-full md:w-56">
                    <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">品牌</span>
                    <CompanyPicker />
                </div>

                {/* Data Source Dropdown */}
                <div className="flex flex-col gap-2 w-full md:w-40">
                    <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">数据源</span>
                    <div className="relative">
                        <select
                            value={dataSource}
                            onChange={(e) => dispatch(setDataSource(e.target.value as any))}
                            className="w-full appearance-none bg-white border border-slate-200 text-slate-700 py-2.5 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-sm hover:border-slate-300"
                        >
                            <option value="GASGOO">盖世 (Gasgoo)</option>
                            <option value="CPCA">乘联会 (CPCA)</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-400">
                            <ChevronDown size={14} />
                        </div>
                    </div>
                </div>

                {/* Time Range Dropdown */}
                <div className="flex flex-col gap-2 w-full md:w-auto">
                    <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">时间范围</span>
                    <div className="flex items-center gap-2">
                        <div className="relative w-32">
                            <select
                                value={timeRange}
                                onChange={(e) => dispatch(setTimeRange(e.target.value as any))}
                                className="w-full appearance-none bg-white border border-slate-200 text-slate-700 py-2.5 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-sm hover:border-slate-300"
                            >
                                <option value="1M">近1月</option>
                                <option value="3M">近3月</option>
                                <option value="1Y">近1年</option>
                                <option value="MAX">全部</option>
                                <option value="CUSTOM">自定义</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-400">
                                <ChevronDown size={14} />
                            </div>
                        </div>

                        {timeRange === "CUSTOM" && (
                            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1 shadow-sm animate-in fade-in slide-in-from-left-2">
                                <input
                                    type="month"
                                    className="px-2 py-1.5 text-xs text-slate-600 border-none focus:ring-0 bg-transparent"
                                    onChange={(e) => dispatch(setCustomRange({ start: e.target.value, end: customEndDate }))}
                                    value={customStartDate || ""}
                                />
                                <span className="text-slate-300">-</span>
                                <input
                                    type="month"
                                    className="px-2 py-1.5 text-xs text-slate-600 border-none focus:ring-0 bg-transparent"
                                    onChange={(e) => dispatch(setCustomRange({ start: customStartDate, end: e.target.value }))}
                                    value={customEndDate || ""}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pb-0.5">
                    <button
                        onClick={syncAll}
                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-all shadow-md shadow-blue-200 h-[42px] whitespace-nowrap"
                    >
                        <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                        同步数据
                    </button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Chart */}
                <div className="lg:col-span-6 relative min-h-[500px]">
                    {isLoading && (
                        <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[2px] flex items-center justify-center rounded-2xl">
                            <RefreshCw size={32} className="text-blue-500 animate-spin" />
                        </div>
                    )}
                    <MainChart data={chartData} onZoom={handleZoom} />
                </div>
            </div>
        </div>
    );
}
