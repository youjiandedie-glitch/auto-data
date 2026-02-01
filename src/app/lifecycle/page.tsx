"use client";

import React, { useState, useEffect } from "react";
import LifecycleChart from "@/components/charts/LifecycleChart";
import {
    Clock,
    ArrowUpRight,
    Zap,
    Trophy,
    TrendingUp,
    CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function LifecyclePage() {
    const [source, setSource] = useState("GASGOO");
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLifecycle = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/sales/lifecycle?source=${source}`);
                const result = await res.json();
                setData(Array.isArray(result) ? result : []);
            } catch (e) {
                console.error("Failed to fetch lifecycle data", e);
            } finally {
                setLoading(false);
            }
        };
        fetchLifecycle();
    }, [source]);

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-amber-950 border border-slate-800 rounded-[2.5rem] p-8 lg:p-12 text-white shadow-2xl">
                <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[140%] bg-amber-500 blur-[120px] rounded-full" />
                </div>

                <div className="relative z-10 space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-[0.2em] mb-3">
                            <span className="w-8 h-[2px] bg-amber-500" />
                            Product Maturity Model
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                            产品生命周期<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">对比看板</span>
                        </h1>
                        <p className="text-slate-400 font-medium max-w-2xl text-lg">
                            将不同车型按“上市月份”对齐，通过标准化的 S 曲线分析，揭示各爆款车型的爆发速度、生命周期长度及市场稳健性。
                        </p>
                    </div>
                </div>
            </div>

            {/* Analysis Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Curve Section */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                            <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/20">
                                <TrendingUp size={16} className="text-white" />
                            </div>
                            标准生命周期 S-曲线 (月度对齐)
                        </h2>

                        <div className="flex items-center gap-3 bg-white border border-slate-200 p-1.5 rounded-xl shadow-sm">
                            <div className="flex items-center gap-2 px-3 py-1 text-slate-500 border-r border-slate-100">
                                <Zap size={14} />
                            </div>
                            <select
                                value={source}
                                onChange={(e) => setSource(e.target.value)}
                                className="bg-transparent border-none text-[10px] font-black text-slate-700 focus:ring-0 px-2 cursor-pointer uppercase tracking-wider"
                            >
                                <option value="GASGOO">GASGOO DATA</option>
                                <option value="CPCA">CPCA DATA</option>
                            </select>
                        </div>
                    </div>

                    <div className="relative min-h-[500px]">
                        {loading && (
                            <div className="absolute inset-0 z-20 bg-white/40 backdrop-blur-sm flex items-center justify-center rounded-[2.5rem]">
                                <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
                            </div>
                        )}
                        <LifecycleChart data={data} />
                    </div>
                </div>

                {/* Legend & Stats Section */}
                <div className="space-y-6">
                    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                                <Trophy className="text-amber-700" size={20} />
                            </div>
                            <h3 className="text-lg font-black text-slate-900">对标车型</h3>
                        </div>

                        <div className="space-y-4">
                            {data.map((m) => (
                                <div key={m.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="min-w-0">
                                        <h4 className="text-xs font-black text-slate-900 truncate">{m.name}</h4>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{m.company}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-amber-600">{m.launchDate}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase">Launched</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-slate-900 rounded-[2rem] p-6 text-white space-y-4">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-amber-400">
                                <CheckCircle2 size={14} /> Lifecycle Insights
                            </div>
                            <ul className="space-y-3">
                                <li className="flex gap-2">
                                    <span className="text-amber-500 font-bold">•</span>
                                    <p className="text-[10px] leading-relaxed text-slate-300">
                                        多数爆款车型在上市第 3-6 个月进入销量爬坡高峰期。
                                    </p>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-amber-500 font-bold">•</span>
                                    <p className="text-[10px] leading-relaxed text-slate-300">
                                        理想 L 系列展现出极强的初期爆发力与长效生命周期。
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
