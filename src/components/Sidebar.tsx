"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    BarChart3,
    TrendingUp,
    Award,
    Zap,
    Activity,
    PieChart,
    Clock,
    DollarSign,
    Menu,
    X
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
    { name: "关联分析", href: "/", icon: LayoutDashboard },
    { name: "品牌对比", href: "/comparison", icon: BarChart3 },
    { name: "行业大盘", href: "/ranking", icon: Award },
    { name: "车型看版", href: "/models", icon: PieChart },
    { name: "PS 估值", href: "/valuation", icon: DollarSign },
    { name: "YoY 热力图", href: "/growth", icon: TrendingUp },
    { name: "市场集中度", href: "/market", icon: Activity },
    { name: "生命周期", href: "/lifecycle", icon: Clock },
    { name: "价格战监控", href: "/pricing", icon: Zap },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = React.useState(true);

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed bottom-6 right-6 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out border-r border-slate-800",
                !isOpen && "-translate-x-full lg:translate-x-0"
            )}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <TrendingUp className="text-white" size={20} />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold tracking-tight">AutoData</h1>
                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-[0.2em]">Analytics Pro</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                                        isActive
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                            : "text-slate-400 hover:text-white hover:bg-slate-800"
                                    )}
                                >
                                    <Icon size={18} className={cn(
                                        "transition-transform group-hover:scale-110",
                                        isActive ? "text-white" : "text-slate-500 group-hover:text-blue-400"
                                    )} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 mt-auto">
                        <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">System Status</p>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-xs text-slate-300 font-medium">数据实时同步中</span>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
