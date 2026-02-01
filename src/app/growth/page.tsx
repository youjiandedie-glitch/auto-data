"use client";

import React, { useState, useEffect } from "react";
import GrowthHeatmap from "@/components/charts/GrowthHeatmap";
import {
    TrendingUp,
    Calendar,
    Zap,
    Info,
    ArrowDownLeft,
    ArrowUpRight,
    Flag,
    AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function GrowthPage() {
    const [year, setYear] = useState("2024"); // Default to 2024 for better demo data
    const [source, setSource] = useState("GASGOO");
    const [data, setData] = useState<any[]>([]);
    const [policies, setPolicies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGrowth = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/sales/growth?year=${year}&source=${source}`);
                const result = await res.json();
                setData(result.growth || []);
                setPolicies(result.policies || []);
            } catch (e) {
                console.error("Failed to fetch growth data", e);
            } finally {
                setLoading(false);
            }
        };
        fetchGrowth();
    }, [year, source]);

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-blue-950 border border-slate-800 rounded-[2.5rem] p-8 lg:p-12 text-white shadow-2xl">
                <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[140%] bg-blue-600 blur-[120px] rounded-full" />
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-[0.2em] mb-3">
                            <span className="w-8 h-[2px] bg-blue-500" />
                            Macro Growth & Policy
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                            多维增长<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">因果看板</span>
                        </h1>
                        <p className="text-slate-400 font-medium max-w-2xl text-lg">
                            同步展示行业政策周期与销量增长脉络。通过热力矩阵识别受“购置税”、“以旧换新”等政策驱动的非线性爆发区域。
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Main Control & Heatmap Area */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Filter Bar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3 bg-white border border-slate-200 p-2 rounded-2xl shadow-sm">
                                <div className="flex items-center gap-2 px-3 py-1.5 text-slate-500 border-r border-slate-100">
                                    <Calendar size={16} />
                                    <span className="text-xs font-bold uppercase tracking-wider">选择年份</span>
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
                        </div>

                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-slate-400 uppercase mb-1">Color Legend</span>
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] font-bold text-slate-400">-50%</span>
                                <div className="w-24 h-1.5 bg-gradient-to-r from-rose-500 via-white to-emerald-400 rounded-full" />
                                <span className="text-[9px] font-bold text-slate-400">+100%</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Heatmap */}
                    <div className="relative group">
                        {loading && (
                            <div className="absolute inset-0 z-20 bg-white/40 backdrop-blur-sm flex items-center justify-center rounded-[2.5rem]">
                                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                            </div>
                        )}
                        <GrowthHeatmap data={data} year={year} />
                    </div>
                </div>

                {/* Policy Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                                <Flag className="text-indigo-700" size={20} />
                            </div>
                            <h3 className="text-lg font-black text-slate-900">行业重大政策节点</h3>
                        </div>

                        <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                            {policies.length > 0 ? policies.map((policy, i) => (
                                <div key={i} className="relative pl-8 group">
                                    <div className={cn(
                                        "absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center transition-all group-hover:scale-110",
                                        policy.impact === 'HIGH' ? "bg-rose-500" : "bg-blue-400"
                                    )}>
                                        <div className="w-1 h-1 bg-white rounded-full" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-400">
                                            <span>{policy.date}</span>
                                            <span className={cn(
                                                "px-2 py-0.5 rounded-full text-[8px]",
                                                policy.impact === 'HIGH' ? "bg-rose-50 text-rose-600" : "bg-blue-50 text-blue-600"
                                            )}>{policy.impact} Impact</span>
                                        </div>
                                        <h4 className="text-sm font-bold text-slate-800 leading-tight">
                                            {policy.title}
                                        </h4>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-10">
                                    <AlertCircle className="mx-auto text-slate-200 mb-2" size={32} />
                                    <p className="text-xs font-bold text-slate-400">该年度无核心政策记录</p>
                                </div>
                            )}
                        </div>

                        <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 space-y-3">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-600">
                                <TrendingUp size={14} /> AI Causality Summary
                            </div>
                            <p className="text-[11px] font-medium leading-relaxed text-slate-600">
                                2024年4月推出的以旧换新政策与5月后的新能源爆涨呈显著正相关（滞后约15-20天），该政策直接贡献了Q2单季度约12%的行业增量。
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
