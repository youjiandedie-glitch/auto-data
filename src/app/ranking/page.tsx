"use client";

import React, { useState, useEffect } from "react";
import RankingList from "@/components/RankingList";
import {
    Trophy,
    Calendar,
    Filter,
    ChevronRight,
    Search,
    BarChart
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function RankingPage() {
    const [type, setType] = useState<"company" | "model">("company");
    const [date, setDate] = useState("202512");
    const [source, setSource] = useState("GASGOO");
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const months = ["202512", "202511", "202510", "202509", "202508", "202507"];

    useEffect(() => {
        fetchRankings();
    }, [type, date, source]);

    const fetchRankings = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/sales/ranking?date=${date}&type=${type}&source=${source}`);
            const result = await res.json();
            setData(Array.isArray(result) ? result : []);
        } catch (error) {
            console.error("Failed to fetch rankings:", error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-8 lg:p-12 text-white">
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 blur-[100px]" />
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-[0.2em] mb-3">
                            <span className="w-8 h-[2px] bg-blue-500" />
                            Industry Intelligence
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black tracking-tight">
                            行业大盘<span className="text-blue-500">排行榜</span>
                        </h1>
                        <p className="text-slate-400 font-medium max-w-md">
                            实时监控中国汽车市场销量领先企业与爆款车型，多维度透视竞争格局。
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="bg-slate-800/50 p-1.5 rounded-2xl border border-slate-700/50 flex">
                            <button
                                onClick={() => setType("company")}
                                className={cn(
                                    "px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                                    type === "company" ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
                                )}
                            >
                                厂商排行
                            </button>
                            <button
                                onClick={() => setType("model")}
                                className={cn(
                                    "px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                                    type === "model" ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
                                )}
                            >
                                车型排行
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-3 bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-2 px-3 py-1.5 text-slate-500">
                            <Calendar size={16} />
                            <span className="text-xs font-bold uppercase tracking-wider">时间维度</span>
                        </div>
                        <div className="flex gap-1">
                            {months.map((m) => (
                                <button
                                    key={m}
                                    onClick={() => setDate(m)}
                                    className={cn(
                                        "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                                        date === m ? "bg-slate-900 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"
                                    )}
                                >
                                    {m === "202512" ? "25年12月" :
                                        m === "202511" ? "25年11月" :
                                            m === "202510" ? "25年10月" :
                                                `${m.substring(2)}月`}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm">
                        <select
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
                            className="bg-transparent border-none text-xs font-bold text-slate-700 focus:ring-0 px-3 cursor-pointer"
                        >
                            <option value="GASGOO">盖世汽车数据 (Gasgoo)</option>
                            <option value="CPCA">乘联会数据 (CPCA)</option>
                            <option value="DCD">懂车帝实测数据 (DCD)</option>
                        </select>
                    </div>
                </div>

                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="快速筛选品牌/车型..."
                        className="bg-white border border-slate-200 pl-11 pr-6 py-3.5 rounded-2xl text-sm font-medium w-full md:w-64 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* Content Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8">
                    <div className="flex items-center justify-between mb-6 px-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                <Trophy className="text-blue-600" size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-slate-900">销量排行 Top {data.length}</h2>
                                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Based on Monthly Volume</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                            数据更新至: <span className="text-slate-900 font-bold">2026-02-01</span>
                        </div>
                    </div>

                    <RankingList items={data} type={type} loading={loading} />
                </div>

                {/* Sidebar Stats */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-6 text-white shadow-xl shadow-blue-500/20">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-bold opacity-80 uppercase tracking-widest text-[10px]">Market Insight</h3>
                            <BarChart size={18} className="opacity-80" />
                        </div>
                        <div className="space-y-6">
                            <div>
                                <p className="text-sm font-medium opacity-70 mb-1">本月大盘环比</p>
                                <div className="flex items-end gap-2">
                                    <span className="text-3xl font-black tracking-tight">+12.4%</span>
                                    <div className="mb-1 px-1.5 py-0.5 bg-white/20 rounded text-[10px] font-black underline decoration-2 underline-offset-2">STRONG</div>
                                </div>
                            </div>
                            <div className="h-[2px] bg-white/10 w-full" />
                            <div>
                                <p className="text-sm font-medium opacity-70 mb-1">新能源渗透率</p>
                                <div className="flex items-end gap-2">
                                    <span className="text-3xl font-black tracking-tight">48.2%</span>
                                    <div className="mb-1 px-1.5 py-0.5 bg-white/20 rounded text-[10px] font-black">RECORD</div>
                                </div>
                            </div>
                        </div>
                        <button className="w-full mt-8 bg-white/10 hover:bg-white/20 border border-white/20 py-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 group">
                            查看深度报告 <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm overflow-hidden relative group">
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-50 rounded-full group-hover:scale-150 transition-transform duration-700" />
                        <div className="relative z-10">
                            <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center justify-between">
                                快讯消息 <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                            </h3>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-blue-600 uppercase">Breaking</span>
                                    <p className="text-xs font-bold text-slate-800 leading-relaxed">比亚迪 12 月蝉联销量冠军，海鸥车型单月销破 4.5 万辆。</p>
                                </div>
                                <div className="h-[1px] bg-slate-100" />
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-indigo-600 uppercase">Trend</span>
                                    <p className="text-xs font-bold text-slate-800 leading-relaxed">蔚来、理想交付量均创新高，新能源厂商集中度呈上升趋势。</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
