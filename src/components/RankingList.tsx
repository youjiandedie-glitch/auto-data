"use client";

import React from "react";
import { TrendingUp, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface RankingItem {
    id: string;
    name: string;
    company?: string;
    volume: number;
    logoUrl?: string | null;
    market?: string;
    trend?: "up" | "down" | "stable";
}

interface RankingListProps {
    items: RankingItem[];
    type: "company" | "model";
    loading?: boolean;
}

export default function RankingList({ items, type, loading }: RankingListProps) {
    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="h-16 bg-slate-200/50 animate-pulse rounded-2xl" />
                ))}
            </div>
        );
    }

    const safeItems = Array.isArray(items) ? items : [];
    const maxVolume = Math.max(...safeItems.map(item => item.volume || 0), 1);

    return (
        <div className="space-y-3">
            {safeItems.map((item, index) => {
                const percentage = (item.volume / maxVolume) * 100;
                const isTop3 = index < 3;

                return (
                    <div
                        key={item.id}
                        className={cn(
                            "group relative overflow-hidden bg-white/60 backdrop-blur-md border border-slate-200/50 p-4 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-0.5",
                            isTop3 && "bg-gradient-to-r from-white/90 to-blue-50/30 border-blue-100/50"
                        )}
                    >
                        <div className="relative z-10 flex items-center gap-4">
                            {/* Rank Number */}
                            <div className={cn(
                                "w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm",
                                index === 0 ? "bg-amber-100 text-amber-600 shadow-sm shadow-amber-200/50" :
                                    index === 1 ? "bg-slate-100 text-slate-500" :
                                        index === 2 ? "bg-orange-100 text-orange-600" :
                                            "text-slate-400"
                            )}>
                                {index + 1}
                            </div>

                            {/* Avatar/Icon */}
                            <div className="w-10 h-10 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center border border-slate-200/50">
                                {item.logoUrl ? (
                                    <img src={item.logoUrl} alt={item.name} className="w-8 h-8 object-contain" />
                                ) : (
                                    <Trophy size={18} className="text-slate-300" />
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-slate-800 truncate">{item.name}</h3>
                                    {item.market && (
                                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded uppercase tracking-wider">
                                            {item.market}
                                        </span>
                                    )}
                                </div>
                                {type === "model" && item.company && (
                                    <p className="text-[11px] text-slate-500 font-medium">{item.company}</p>
                                )}
                            </div>

                            {/* Volume & Bar */}
                            <div className="text-right">
                                <div className="text-lg font-black text-slate-900 tabular-nums">
                                    {item.volume.toLocaleString()}
                                    <span className="text-[10px] text-slate-400 ml-1 font-bold">辆</span>
                                </div>
                                <div className="flex items-center justify-end gap-1.5">
                                    <TrendingUp size={12} className="text-emerald-500" />
                                    <span className="text-[10px] text-emerald-600 font-bold">8.4%</span>
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar Background */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100/50 overflow-hidden">
                            <div
                                className={cn(
                                    "h-full transition-all duration-1000 ease-out",
                                    isTop3 ? "bg-blue-500" : "bg-slate-400"
                                )}
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    </div>
                );
            })}
            {safeItems.length === 0 && (
                <div className="p-12 text-center bg-white/40 backdrop-blur-sm rounded-3xl border border-dashed border-slate-200">
                    <p className="text-slate-400 font-medium">暂无排名数据</p>
                </div>
            )}
        </div>
    );
}
