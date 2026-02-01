"use client";

import React, { useState, useEffect } from "react";
import ModelDistributionChart from "@/components/charts/ModelDistributionChart";
import {
    PieChart,
    Calendar,
    Shield,
    ArrowRight,
    Search,
    ChevronDown,
    Building2,
    TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ModelsPage() {
    const [companies, setCompanies] = useState([]);
    const [selectedCompanyId, setSelectedCompanyId] = useState("");
    const [date, setDate] = useState("202512");
    const [source, setSource] = useState("GASGOO");
    const [modelData, setModelData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const months = ["202512", "202511", "202510", "202509", "202508", "202507"];

    useEffect(() => {
        fetchCompanies();
    }, []);

    useEffect(() => {
        if (selectedCompanyId) {
            fetchModelSales();
        }
    }, [selectedCompanyId, date, source]);

    const fetchCompanies = async () => {
        try {
            const res = await fetch("/api/companies");
            const data = await res.json();
            if (Array.isArray(data)) {
                setCompanies(data as any);
                if (data.length > 0) setSelectedCompanyId(data[0].id);
            }
        } catch (e) {
            console.error("Failed to load companies", e);
        }
    };

    const fetchModelSales = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/sales/models?companyId=${selectedCompanyId}&date=${date}&source=${source}`);
            const result = await res.json();
            setModelData(Array.isArray(result) ? result : []);
        } catch (error) {
            console.error("Failed to fetch model sales:", error);
            setModelData([]);
        } finally {
            setLoading(false);
        }
    };

    const selectedCompany = companies.find((c: any) => c.id === selectedCompanyId) as any;

    const safeModelData = Array.isArray(modelData) ? modelData : [];
    const chartItems = safeModelData.map((m: any) => ({
        name: m.name,
        y: m.volume
    }));

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header Section */}
            <div className="relative overflow-hidden bg-white border border-slate-200 rounded-[2.5rem] p-8 lg:p-12 shadow-sm">
                <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[140%] bg-blue-50/50 blur-[100px] rounded-full" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-[0.2em] mb-3">
                            <span className="w-8 h-[2px] bg-blue-600" />
                            Model Drill-down
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
                            单一品牌<span className="text-blue-600">穿透分析</span>
                        </h1>
                        <p className="text-slate-500 font-medium max-w-lg text-lg">
                            深入挖掘特定车企的核心单品表现，透视销量结构与细分市场的爆款贡献。
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 min-w-[320px]">
                        <div className="relative group">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                            <select
                                value={selectedCompanyId}
                                onChange={(e) => setSelectedCompanyId(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 pl-12 pr-10 py-4 rounded-[1.25rem] text-sm font-bold text-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none appearance-none transition-all cursor-pointer shadow-sm"
                            >
                                {companies.map((c: any) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                        </div>

                        <div className="flex gap-3">
                            <div className="flex-1 relative group">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <select
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-3 rounded-[1.25rem] text-[13px] font-black text-slate-700 appearance-none outline-none focus:ring-2 focus:ring-blue-500/10 shadow-sm"
                                >
                                    {months.map(m => (
                                        <option key={m} value={m}>{m.substring(0, 4)}年{m.substring(4)}月</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex-1 relative group">
                                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <select
                                    value={source}
                                    onChange={(e) => setSource(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-3 rounded-[1.25rem] text-[13px] font-black text-slate-700 appearance-none outline-none focus:ring-2 focus:ring-blue-500/10 shadow-sm"
                                >
                                    <option value="GASGOO">盖世汽车</option>
                                    <option value="CPCA">乘联会</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Analysis Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Chart Section */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <PieChart size={16} className="text-white" />
                            </div>
                            车型销量构成 (销量 Top 10)
                        </h2>
                    </div>
                    {loading ? (
                        <div className="h-[400px] bg-slate-200/50 animate-pulse rounded-[2.5rem]" />
                    ) : (
                        <ModelDistributionChart data={chartItems.slice(0, 10)} title={`${selectedCompany?.name} 销量构成`} />
                    )}
                </div>

                {/* List Section */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white min-h-[464px] flex flex-col shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-50" />

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-sm font-black uppercase tracking-widest text-blue-400 flex items-center gap-2">
                                    <TrendingUp size={16} /> Data Breakdown
                                </h3>
                                <span className="text-[10px] font-bold text-slate-500">{selectedCompany?.name || "品牌"} 旗下全系车型</span>
                            </div>

                            <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2 max-h-[320px]">
                                {modelData.map((m: any, i) => (
                                    <div key={m.id} className="flex items-center justify-between group/row">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-black text-slate-600 w-4">{i + 1}</span>
                                            <span className="text-sm font-bold text-slate-200 group-hover/row:text-white transition-colors">{m.name}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <div className="text-sm font-black tabular-nums">{m.volume.toLocaleString()}</div>
                                                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Units</div>
                                            </div>
                                            <div className="w-1.5 h-1.5 bg-slate-800 rounded-full group-hover/row:bg-blue-500 transition-colors" />
                                        </div>
                                    </div>
                                ))}
                                {modelData.length === 0 && !loading && (
                                    <div className="text-center py-10 opacity-40">
                                        <Search size={32} className="mx-auto mb-3" />
                                        <p className="text-xs font-bold uppercase tracking-widest">No Model Data Found</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-800">
                                <button className="w-full flex items-center justify-between group/btn text-slate-400 hover:text-white transition-colors">
                                    <span className="text-xs font-black uppercase tracking-widest">导出深度报告</span>
                                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover/btn:bg-blue-600 transition-all">
                                        <ArrowRight size={14} />
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
