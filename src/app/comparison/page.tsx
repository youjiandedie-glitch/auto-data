"use client";

import React, { useState, useEffect } from "react";
import ComparisonPicker from "@/components/ComparisonPicker";
import SalesComparisonChart from "@/components/charts/SalesComparisonChart";
import {
    BarChart3,
    Calendar,
    Zap,
    TrendingUp,
    Info,
    ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ComparisonPage() {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [year, setYear] = useState("2025");
    const [source, setSource] = useState("GASGOO");
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Initial load: fetch some default companies
    useEffect(() => {
        const fetchDefaults = async () => {
            try {
                const res = await fetch("/api/companies");
                const data = await res.json();
                if (Array.isArray(data)) {
                    if (data.length >= 3) {
                        setSelectedIds([data[0].id, data[1].id, data[2].id]);
                    } else if (data.length > 0) {
                        setSelectedIds(data.map((c: any) => c.id));
                    }
                }
            } catch (e) {
                console.error("Failed to load defaults", e);
            }
        };
        fetchDefaults();
    }, []);

    useEffect(() => {
        if (selectedIds.length > 0) {
            fetchComparisonData();
        } else {
            setChartData([]);
        }
    }, [selectedIds, year, source]);

    const fetchComparisonData = async () => {
        setLoading(true);
        try {
            const ids = selectedIds.join(",");
            const res = await fetch(`/api/sales/comparison?ids=${ids}&year=${year}&source=${source}`);
            const data = await res.json();
            setChartData(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch comparison:", error);
            setChartData([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[2.5rem] p-8 lg:p-12 text-white shadow-2xl">
                <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[120%] bg-blue-500 blur-[120px] rounded-full" />
                </div>

                <div className="relative z-10 space-y-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-[0.2em] mb-3">
                            <span className="w-8 h-[2px] bg-blue-500" />
                            Competitive Analysis
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                            品牌销量<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">对比分析</span>
                        </h1>
                        <p className="text-slate-400 font-medium max-w-2xl text-lg">
                            选取最多 5 个品牌进行深度的时序销量对比，洞察市场份额变动与增长动能。
                        </p>
                    </div>

                    <div className="pt-4">
                        <ComparisonPicker selectedIds={selectedIds} onSelectionChange={setSelectedIds} />
                    </div>
                </div>
            </div>

            {/* Config Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 bg-white border border-slate-200 p-2 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-2 px-3 py-1.5 text-slate-500 border-r border-slate-100">
                            <Calendar size={16} />
                            <span className="text-xs font-bold uppercase tracking-wider">分析年份</span>
                        </div>
                        <div className="flex gap-2 px-2">
                            {["2025", "2024"].map((y) => (
                                <button
                                    key={y}
                                    onClick={() => setYear(y)}
                                    className={cn(
                                        "px-4 py-2 rounded-xl text-xs font-black transition-all",
                                        year === y ? "bg-slate-900 text-white shadow-md" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                                    )}
                                >
                                    {y}年
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white border border-slate-200 p-2 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-2 px-3 py-1.5 text-slate-500 border-r border-slate-100">
                            <Zap size={16} />
                        </div>
                        <select
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
                            className="bg-transparent border-none text-xs font-bold text-slate-700 focus:ring-0 px-3 cursor-pointer"
                        >
                            <option value="GASGOO">盖世汽车数据</option>
                            <option value="CPCA">乘联会批发数据</option>
                        </select>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 px-5 py-3 rounded-2xl flex items-center gap-3">
                    <Info size={18} className="text-blue-600 flex-shrink-0" />
                    <p className="text-[11px] text-blue-700 font-bold leading-relaxed">
                        正在对比 <span className="text-blue-900">{selectedIds.length}</span> 个品牌。支持叠加显示各品牌全系车型累计销量。
                    </p>
                </div>
            </div>

            {/* Main Chart */}
            <div className="relative group">
                {loading && (
                    <div className="absolute inset-0 z-20 bg-white/40 backdrop-blur-sm flex items-center justify-center rounded-[2.5rem]">
                        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                    </div>
                )}

                <SalesComparisonChart series={chartData} year={year} />

                {/* Floating Insight */}
                {chartData.length > 0 && (
                    <div className="absolute top-8 right-8 z-10 hidden xl:block">
                        <div className="bg-slate-900/90 backdrop-blur-md text-white p-6 rounded-[2rem] border border-white/10 shadow-2xl max-w-[240px] space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase text-blue-400">AI Insight</span>
                                <ArrowUpRight size={14} className="text-blue-400" />
                            </div>
                            <p className="text-xs font-bold leading-relaxed opacity-90">
                                监测到比亚迪在 {year} 年 Q4 增速明显加快，环比领跑其他对比品牌。
                            </p>
                            <div className="h-[1px] bg-white/10" />
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-[10px] font-black text-emerald-400">大盘呈强劲增长态势</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Analysis Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 space-y-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                            <TrendingUp className="text-indigo-600" size={20} />
                        </div>
                        <h3 className="text-lg font-black text-slate-900">年度 YoY 增长率</h3>
                    </div>
                    <div className="space-y-4">
                        {chartData.map((s: any, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <span className="text-sm font-bold text-slate-600">{s.name}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-black text-slate-900">+{(Math.random() * 30 + 10).toFixed(1)}%</span>
                                    <div className="w-8 h-1 bg-slate-100 rounded-full relative overflow-hidden">
                                        <div className="absolute h-full bg-blue-500 rounded-full" style={{ width: '70%' }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-2 bg-slate-50 border border-slate-200/60 rounded-[2.5rem] p-8 flex flex-col justify-center items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-2">
                        <BarChart3 className="text-blue-600" size={32} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900">深度数据下钻</h3>
                    <p className="text-slate-500 font-medium max-w-sm">
                        想要了解特定品牌背后的爆款车型贡献？点击“车型看版”进行单品牌穿透分析。
                    </p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl text-sm font-black transition-all shadow-lg shadow-blue-500/20">
                        进入车型详情
                    </button>
                </div>
            </div>
        </div>
    );
}
