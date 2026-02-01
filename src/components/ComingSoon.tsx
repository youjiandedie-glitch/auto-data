"use client";

import React from "react";
import { Hammer, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ComingSoonProps {
    title: string;
    description?: string;
}

export default function ComingSoon({ title, description }: ComingSoonProps) {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center space-y-8 animate-in fade-in zoom-in duration-700">
            <div className="relative">
                <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-500/40 animate-bounce duration-[3s]">
                    <Hammer className="text-white" size={40} />
                </div>
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <Sparkles className="text-amber-900" size={20} />
                </div>
            </div>

            <div className="space-y-4 max-w-md">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                    {title} <span className="text-blue-600">建设中</span>
                </h1>
                <p className="text-slate-500 font-medium text-lg leading-relaxed">
                    {description || "该模块正处于深度研发阶段，我们将很快为您带来最前沿的数据分析能力。"}
                </p>
            </div>

            <div className="flex items-center gap-4">
                <Link
                    href="/ranking"
                    className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl text-sm font-black transition-all hover:bg-slate-800 shadow-xl shadow-slate-900/10"
                >
                    <ArrowLeft size={18} /> 返回排行榜
                </Link>
                <div className="px-6 py-4 rounded-2xl border border-slate-200 text-slate-400 text-xs font-bold uppercase tracking-widest bg-white/50">
                    Expected: Q2 2026
                </div>
            </div>

            {/* Decorative background elements */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] -z-10">
                <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-blue-600 blur-[150px] rounded-full" />
                <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] bg-indigo-600 blur-[150px] rounded-full" />
            </div>
        </div>
    );
}
