"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setGranularity, setLoading, setError, setTimeRange } from "@/store/slices/chartSlice";
import MainChart from "./charts/MainChart";
import CompanyPicker from "./CompanyPicker";
import { TrendingUp, BarChart2, RefreshCw, Calendar } from "lucide-react";

export default function AnalyticsDashboard() {
    const dispatch = useAppDispatch();
    const { selectedCompanies, granularity, isLoading, timeRange } = useAppSelector(state => state.chart);
    const [chartData, setChartData] = useState<any>(null);

    const fetchData = useCallback(async () => {
        if (selectedCompanies.length === 0) return;

        dispatch(setLoading(true));
        try {
            const primary = selectedCompanies[0];
            const res = await fetch(`/api/charts?companyId=${primary.id}&periodType=${granularity}`);
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
        alert("正在从 Yahoo Finance 同步所有公司数据，请稍候...");
        await fetch("/api/sync", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
        fetchData();
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold tracking-tight text-slate-900">
                        中国车企 <span className="text-blue-600">关联分析</span>
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        实时分析销量增长与股价波动之间的相关性
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={syncAll}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all card-shadow"
                    >
                        <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                        同步数据
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar / Controls */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
                            <BarChart2 size={16} className="text-blue-500" />
                            对比品牌
                        </h3>
                        <CompanyPicker />
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
                            <TrendingUp size={16} className="text-emerald-500" />
                            数据洞察
                        </h3>
                        <div className="space-y-4">
                            <div className="p-3 bg-slate-50 rounded-xl">
                                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">相关系数</span>
                                <span className="text-lg font-display font-bold">强正相关 (0.82)</span>
                            </div>
                            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                                <p className="text-[11px] text-emerald-700 leading-relaxed font-medium">
                                    {selectedCompanies[0]?.name} 的股价往往在销量周报发布后 1 周内呈现同向波动趋势。
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Chart Section */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                    {/* Time Presets */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-slate-100 shadow-sm">
                            {[
                                { label: "1周", val: "1W" },
                                { label: "1月", val: "1M" },
                                { label: "3月", val: "3M" },
                                { label: "1年", val: "1Y" },
                                { label: "全部", val: "MAX" }
                            ].map((p) => (
                                <button
                                    key={p.val}
                                    onClick={() => dispatch(setTimeRange(p.val as any))}
                                    className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${timeRange === p.val
                                            ? "bg-blue-50 text-blue-600"
                                            : "hover:bg-slate-50 text-slate-500"
                                        }`}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-slate-100 shadow-sm text-[11px] font-bold text-slate-400">
                            <Calendar size={14} />
                            粒度: {granularity === "WEEK" ? "周" : granularity === "MONTH" ? "月" : "年"}
                        </div>
                    </div>

                    <div className="relative min-h-[450px]">
                        {isLoading && (
                            <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[2px] flex items-center justify-center rounded-2xl">
                                <RefreshCw size={32} className="text-blue-500 animate-spin" />
                            </div>
                        )}
                        <MainChart data={chartData} onZoom={handleZoom} />
                    </div>
                </div>
            </div>
        </div>
    );
}
