"use client";

import React, { useState, useEffect } from "react";
import PricingChart from "@/components/charts/PricingChart";
import {
    Zap,
    TrendingDown,
    AlertTriangle,
    Activity,
    ArrowRight,
    Flame,
    Gauge,
    Info,
    ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PricingPage() {
    const [source, setSource] = useState("GASGOO");
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPricing = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/sales/pricing?source=${source}`);
                const result = await res.json();
                setData(result);
            } catch (e) {
                console.error("Failed to fetch pricing data", e);
            } finally {
                setLoading(false);
            }
        };
        fetchPricing();
    }, [source]);

    // Split model discounts into 'attack' and 'defense' style based on magnitude
    const attackModels = data?.modelDiscounts?.filter((m: any) => m.discount > 12) || [];
    const defenseModels = data?.modelDiscounts?.filter((m: any) => m.discount <= 12) || [];

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header Section */}
            <div className="relative overflow-hidden bg-slate-950 border border-slate-800 rounded-[2.5rem] p-8 lg:p-12 text-white shadow-2xl">
                <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[140%] bg-rose-600 blur-[120px] rounded-full" />
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-[0.2em] mb-3">
                            <span className="w-8 h-[2px] bg-rose-500" />
                            Live Warfare Monitor
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                            价格战<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">预警看板</span>
                        </h1>
                        <p className="text-slate-400 font-medium max-w-lg text-lg">
                            量化“以价换量”的战术成效。集成全网终端折扣率波动，实时感知行业竞争烈度与厂商毛利压力。
                        </p>
                    </div>

                    <div className="flex flex-col items-center gap-4 bg-slate-900/50 p-8 rounded-[2rem] border border-white/5 backdrop-blur-md">
                        <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mb-2 animate-pulse">
                            <Flame className="text-rose-500" size={32} />
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">Warfare Intensity</p>
                            <h3 className="text-3xl font-black text-white">{data?.summary?.currentAvgDiscount > 12 ? 'AGGRESSIVE' : 'NORMAL'}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Metrics Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm flex items-center gap-6">
                    <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <TrendingDown className="text-rose-600" size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">平均折扣率</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black text-slate-900">{data?.summary?.currentAvgDiscount || '--'}%</span>
                            <span className="text-xs font-bold text-rose-500">{data?.summary?.yoyChange} YoY</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm flex items-center gap-6">
                    <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Gauge className="text-orange-600" size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">价格样本数</p>
                        <span className="text-2xl font-black text-slate-900">42 + Models</span>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200 text-white flex items-center gap-6">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <ShieldCheck className="text-blue-400" size={24} />
                    </div>
                    <div className="flex-1">
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Data Source Detail</p>
                        <p className="text-[11px] font-bold opacity-80 leading-tight">
                            基于主流车型“官降”及“落地的平均交易价”加权计算。
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Trend Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                        <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center shadow-lg shadow-rose-500/20">
                            <Activity size={16} className="text-white" />
                        </div>
                        行业终端折扣水平指数
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
                            <option value="GASGOO">GAASGOO FEED</option>
                            <option value="CPCA">CPCA FEED</option>
                        </select>
                    </div>
                </div>

                <div className="relative min-h-[400px]">
                    {loading && (
                        <div className="absolute inset-0 z-20 bg-white/40 backdrop-blur-sm flex items-center justify-center rounded-[2.5rem]">
                            <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin" />
                        </div>
                    )}
                    {data?.trend && <PricingChart data={data.trend} />}
                </div>
            </div>

            {/* Real-time Rankings - Replced Mock Data */}
            <div className="bg-slate-50 border border-slate-200/60 rounded-[2.5rem] p-10 space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black text-slate-900">核心车系折扣排行 (Real-time)</h3>
                        <p className="text-slate-500 font-medium">
                            精准捕捉当前月度“杀价最狠”的 TOP 10 车系，揭示市场竞争核心火力点。
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-3xl border border-slate-200/50 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 blur-[50px] -mr-10 -mt-10 opacity-60" />
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-rose-50 pb-2">高折扣率车系 (Aggressive Pricing)</h4>
                        <div className="space-y-5 relative z-10">
                            {attackModels.map((m: any, i: number) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black text-rose-300">0{i + 1}</span>
                                        <span className="text-sm font-bold text-slate-700">{m.name}</span>
                                    </div>
                                    <span className="text-sm font-black text-rose-600">-{m.discount}%</span>
                                </div>
                            ))}
                            {attackModels.length === 0 && <p className="text-xs text-slate-400 italic">No aggressive discounting detected.</p>}
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-slate-200/50 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 blur-[50px] -mr-10 -mt-10 opacity-60" />
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-blue-50 pb-2">防御性定价/加权稳定 (Price Stable)</h4>
                        <div className="space-y-5 relative z-10">
                            {defenseModels.slice(0, 5).map((m: any, i: number) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black text-blue-300">0{i + 1}</span>
                                        <span className="text-sm font-bold text-slate-700">{m.name}</span>
                                    </div>
                                    <span className="text-sm font-black text-blue-600">-{m.discount}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-5 bg-amber-50 rounded-3xl border border-amber-100">
                    <Info size={18} className="text-amber-600" />
                    <p className="text-xs font-medium text-amber-900">
                        提示：以上折扣数据包含厂家限时金融补贴及终端现金让利。理想、问界等品牌由于采取“权益包”形式，其实际折扣强度可能在图表中呈现较低水平。
                    </p>
                </div>
            </div>
        </div>
    );
}
