"use client";

import React, { useState, useEffect } from "react";
import ValuationChart from "@/components/charts/ValuationChart";
import {
    DollarSign,
    ArrowUpRight,
    TrendingUp,
    Target,
    Activity,
    Info,
    BarChart3,
    Zap,
    Percent
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ValuationPage() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/sales/valuation");
                const result = await res.json();
                setData(Array.isArray(result) ? result : []);
            } catch (e) {
                console.error("Failed to fetch valuation data", e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const topPS = [...data].sort((a, b) => (b.psRatio || 0) - (a.psRatio || 0)).slice(0, 3);
    const topMargin = [...data].sort((a, b) => (b.grossMargin || 0) - (a.grossMargin || 0)).slice(0, 3);

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header Section */}
            <div className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 lg:p-12 text-white shadow-2xl">
                <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[120%] bg-emerald-500 blur-[120px] rounded-full" />
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-[0.2em] mb-3">
                            <span className="w-8 h-[2px] bg-emerald-500" />
                            Financial Intelligence Peak
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                            经营效率<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">对标看板</span>
                        </h1>
                        <p className="text-slate-400 font-medium max-w-lg text-lg">
                            从 PS 估值延伸至单车毛利与经营效率，多维解析车企的“Alpha”超额盈利能力。
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-3xl min-w-[200px]">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Avg Gross Margin</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-white">16.2%</span>
                                <span className="text-xs font-bold text-emerald-400 opacity-80">Industry</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Analysis Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Main Visualization Area */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Scatter Chart */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                    <Activity size={16} className="text-white" />
                                </div>
                                <h2 className="text-xl font-black text-slate-900">市值 vs. 销量的规模效应</h2>
                            </div>
                            <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-[10px] font-black uppercase text-slate-400 shadow-sm">
                                <Info size={12} /> Live API Feed
                            </div>
                        </div>

                        {loading ? (
                            <div className="h-[500px] bg-slate-100 animate-pulse rounded-[2.5rem]" />
                        ) : (
                            <ValuationChart data={data} />
                        )}
                    </div>

                    {/* Operating Efficiency Table */}
                    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                                <BarChart3 className="text-white" size={20} />
                            </div>
                            <h3 className="text-lg font-black text-slate-900">经营指标深度透视 (TTM)</h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">品牌</th>
                                        <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">毛利率</th>
                                        <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">单车收入 (万)</th>
                                        <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 text-right">现金储备 (亿)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {data.map((item) => (
                                        <tr key={item.id} className="group hover:bg-slate-50/50 transition-all">
                                            <td className="py-5 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:bg-white group-hover:shadow-sm">
                                                        {item.symbol?.split('.')[0]}
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-800">{item.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-5 px-4 font-black text-sm text-emerald-600">
                                                {(item.grossMargin * 100).toFixed(1)}%
                                            </td>
                                            <td className="py-5 px-4 text-sm font-bold text-slate-600">
                                                {(item.revenuePerUnit / 10000).toFixed(1)}
                                            </td>
                                            <td className="py-5 px-4 text-sm font-black text-slate-900 text-right">
                                                {(item.cash / 100000000).toFixed(0)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Insight Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Top Multipliers Card */}
                    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                <TrendingUp className="text-blue-700" size={20} />
                            </div>
                            <h3 className="text-lg font-black text-slate-900">估值溢价排行 (PS)</h3>
                        </div>

                        <div className="space-y-6">
                            {topPS.map((item, i) => (
                                <div key={item.id} className="relative group">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-bold text-slate-800">{item.name}</span>
                                        <span className="text-sm font-black text-blue-600">{(item.psRatio || 0).toFixed(2)}x</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                                            style={{ width: `${Math.min((item.psRatio / 4) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Margins Card */}
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-8 shadow-2xl">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                                <Percent className="text-emerald-400" size={20} />
                            </div>
                            <h3 className="text-lg font-black italic">Profit Leaders</h3>
                        </div>

                        <div className="space-y-6">
                            {topMargin.map((item, i) => (
                                <div key={item.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-black text-slate-500">0{i + 1}</span>
                                        <span className="text-sm font-bold opacity-90">{item.name}</span>
                                    </div>
                                    <span className="text-sm font-black text-emerald-400">{(item.grossMargin * 100).toFixed(1)}%</span>
                                </div>
                            ))}
                        </div>

                        <div className="p-5 bg-white/5 rounded-3xl border border-white/10 space-y-3">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-amber-400">
                                <Zap size={14} /> Efficiency Insight
                            </div>
                            <p className="text-[11px] font-medium leading-relaxed text-slate-400">
                                检测到理想汽车单车收入已重回 30 万量级，其毛利护城河显著优于同销量规模的传统品牌。
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
