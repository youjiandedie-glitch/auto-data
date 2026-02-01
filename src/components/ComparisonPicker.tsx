"use client";

import React, { useState, useEffect } from "react";
import { Check, Search, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Company {
    id: string;
    name: string;
    logoUrl?: string | null;
}

interface ComparisonPickerProps {
    selectedIds: string[];
    onSelectionChange: (ids: string[]) => void;
}

export default function ComparisonPicker({ selectedIds, onSelectionChange }: ComparisonPickerProps) {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const res = await fetch("/api/companies");
            const data = await res.json();
            setCompanies(data);
        } catch (error) {
            console.error("Failed to fetch companies:", error);
        }
    };

    const toggleSelection = (id: string) => {
        if (selectedIds.includes(id)) {
            onSelectionChange(selectedIds.filter(item => item !== id));
        } else {
            if (selectedIds.length < 5) {
                onSelectionChange([...selectedIds, id]);
            }
        }
    };

    const filtered = companies.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    const selectedCompanies = companies.filter(c => selectedIds.includes(c.id));

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
                {selectedCompanies.map(c => (
                    <div
                        key={c.id}
                        className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 group animate-in zoom-in duration-300"
                    >
                        {c.name}
                        <button onClick={() => toggleSelection(c.id)} className="hover:text-blue-200 transition-colors">
                            <X size={14} />
                        </button>
                    </div>
                ))}
                {selectedIds.length < 5 && (
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
                    >
                        <Plus size={14} />
                        添加对比对象 ({selectedIds.length}/5)
                    </button>
                )}
            </div>

            {isOpen && (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-4 absolute z-30 w-full max-w-sm animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input
                            type="text"
                            placeholder="搜索品牌..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-slate-50 border-none pl-9 pr-4 py-2 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 outline-none"
                        />
                    </div>
                    <div className="max-h-48 overflow-y-auto space-y-1 custom-scrollbar">
                        {filtered.map(c => {
                            const isSelected = selectedIds.includes(c.id);
                            return (
                                <button
                                    key={c.id}
                                    onClick={() => toggleSelection(c.id)}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors",
                                        isSelected ? "bg-blue-50 text-blue-600" : "hover:bg-slate-50 text-slate-700"
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        {c.logoUrl && <img src={c.logoUrl} alt={c.name} className="w-5 h-5 object-contain" />}
                                        {c.name}
                                    </div>
                                    {isSelected && <Check size={14} />}
                                </button>
                            );
                        })}
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="bg-slate-900 text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider"
                        >
                            完成
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
