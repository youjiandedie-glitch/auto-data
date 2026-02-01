"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addCompany, removeCompany } from "@/store/slices/chartSlice";
import { Search, X, Check } from "lucide-react";

const CompanyPicker = () => {
    const dispatch = useAppDispatch();
    const selectedCompanies = useAppSelector(state => state.chart.selectedCompanies);
    const [availableCompanies, setAvailableCompanies] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetch("/api/companies")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setAvailableCompanies(data);
                    if (selectedCompanies.length === 0 && data.length > 0) {
                        const first = data[0];
                        dispatch(addCompany({ id: first.id, name: first.name, symbol: first.stockSymbol }));
                    }
                }
            });
    }, [dispatch, selectedCompanies.length]);

    const toggleCompany = (company: any) => {
        const isSelected = selectedCompanies.find(c => c.id === company.id);
        if (isSelected) {
            if (selectedCompanies.length > 1) {
                dispatch(removeCompany(company.id));
            }
        } else {
            dispatch(addCompany({ id: company.id, name: company.name, symbol: company.stockSymbol }));
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="relative group">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <Search size={18} />
                </div>
                <input
                    type="text"
                    placeholder="搜索中国汽车品牌..."
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="flex flex-wrap gap-2">
                {availableCompanies
                    .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((company) => {
                        const isSelected = selectedCompanies.find(sc => sc.id === company.id);
                        return (
                            <button
                                key={company.id}
                                onClick={() => toggleCompany(company)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all text-xs font-medium ${isSelected
                                        ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm"
                                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                                    }`}
                            >
                                {isSelected && <Check size={14} />}
                                {company.name}
                            </button>
                        );
                    })}
            </div>
        </div>
    );
};

export default CompanyPicker;
