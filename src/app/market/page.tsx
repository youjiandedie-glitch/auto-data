"use client";

import React, { useState, useEffect } from "react";
import MarketConcentrationCharts from "@/components/charts/MarketConcentrationCharts";
import {
    Activity,
    ArrowRight,
    Zap,
    Users,
    ShieldCheck,
    Info,
    LayoutGrid
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function MarketPage() {
    const [source, setSource] = useState("GASGOO");
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMarket = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/sales/market?source=${source}`);
                const result = await res.json();
                setData(Array.isArray(result) ? result : []);
            } catch (e) {
                console.error("Failed to fetch market data", e);
            } finally {
                setLoading(false);
            }
        };
        fetchMarket();
    }, [source]);

    const latest = data[data.length - 1];

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header Section */}
            <div className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 lg:p-12 text-white shadow-2xl">
                <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[140%] bg-indigo-600 blur-[120px] rounded-full" />
                </div>

                <div className="relative z-10 space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-[0.2em] mb-3">
                            <span className="w-8 h-[2px] bg-indigo-500" />
                            Market Structure Analysis
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                            市场集中度<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">分析看板</span>
                        </h1>
                        <p className="text-slate-400 font-medium max-w-2xl text-lg">
                            基于 HHI 指数与 CRn 模型，动态监测全行业竞争格局的集中与分化趋势，识别头部品牌的市场统治力变化。
                        </p>
                    </div>
                </div>
            </div>

            {/* Top Indicator Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-2">
                <div className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Users className="text-blue-600" size={16} />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CR3 占比</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-slate-900">{latest ? latest.cr3.toFixed(1) : '--'}%</span>
                        <span className="text-xs font-bold text-emerald-500">+1.2%</span>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <LayoutGrid className="text-indigo-600" size={16} />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">HHI 指数</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-slate-900">{latest ? Math.round(latest.hhi) : '--'}</span>
                        <span className="text-xs font-bold text-slate-400">中度集中</span>
                    </div>
                </div>

                <div className="md:col-span-2 bg-gradient-to-r from-indigo-600 to-blue-600 p-6 rounded-[2.5rem] text-white flex items-center justify-between shadow-xl shadow-blue-500/20">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-white/60 text-[10px] font-black uppercase tracking-widest">
                            <ShieldCheck size={14} /> Competition Insight
                        </div>
                        <p className="text-sm font-bold opacity-90 leading-tight">
                            当前市场处于由“自由竞争”向“头部聚合”演变的加速期。
                        </p>
                    </div>
                    <button className="bg-white/10 hover:bg-white/20 p-3 rounded-2xl transition-all">
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>

            {/* Config & Source Bar */}
            <div className="flex items-center gap-3 bg-white border border-slate-200 p-2 rounded-2xl shadow-sm w-fit ml-auto mr-4">
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

            {/* Main Charts */}
            <div className="relative min-h-[400px]">
                {loading && (
                    <div className="absolute inset-0 z-20 bg-white/40 backdrop-blur-sm flex items-center justify-center rounded-[2.5rem]">
                        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                    </div>
                )}
                <MarketConcentrationCharts data={data} />
            </div>

            {/* Bottom Analysis Table - Top 5 Players */}
            {latest && (
                <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                            <Activity className="text-white" size={20} />
                        </div>
                        <h3 className="text-lg font-black text-slate-900">头部品牌份额详情 (当前周期)</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        {latest.topPlayers.map((p: any, i: number) => (
                            <div key={p.id} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 group hover:border-blue-200 transition-all">
                                <div className="text-[10px] font-black text-slate-400 mb-2">RANK 0{i + 1}</div>
                                <h4 className="text-lg font-black text-slate-800 mb-1">{p.name}</h4>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-black text-blue-600">{p.share.toFixed(1)}%</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Share</span>
                                </div>
                                <div className="mt-4 h-1.5 bg-white rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 rounded-full group-hover:bg-blue-600 transition-all duration-700"
                                        style={{ width: `${(p.share / latest.topPlayers[0].share) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex items-center gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                        <Info size={16} className="text-amber-600" />
                        <p className="text-xs font-medium text-amber-800">
                            数据提示：该集中度计算仅包含当前选定数据源覆盖的样本品牌，总销量基准为该数据源的月度总量。
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
