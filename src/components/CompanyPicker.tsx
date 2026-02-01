import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSelectedCompany } from "@/store/slices/chartSlice";
import { ChevronDown } from "lucide-react";

const CompanyPicker = () => {
    const dispatch = useAppDispatch();
    const selectedCompanies = useAppSelector(state => state.chart.selectedCompanies);
    const [availableCompanies, setAvailableCompanies] = useState<any[]>([]);

    useEffect(() => {
        fetch("/api/companies")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    // Sort by name for easier finding in dropdown
                    const sorted = data.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
                    setAvailableCompanies(sorted);

                    if (selectedCompanies.length === 0 && sorted.length > 0) {
                        const first = sorted[0];
                        dispatch(setSelectedCompany({ id: first.id, name: first.name, symbol: first.stockSymbol }));
                    }
                }
            });
    }, [dispatch, selectedCompanies.length]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const companyId = e.target.value;
        const company = availableCompanies.find(c => c.id === companyId);
        if (company) {
            dispatch(setSelectedCompany({ id: company.id, name: company.name, symbol: company.stockSymbol }));
        }
    };

    const currentId = selectedCompanies[0]?.id || "";

    return (
        <div className="relative w-full">
            <select
                value={currentId}
                onChange={handleChange}
                className="w-full appearance-none bg-white border border-slate-200 text-slate-700 py-3 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-sm shadow-sm cursor-pointer hover:border-slate-300"
            >
                {availableCompanies.map((company) => (
                    <option key={company.id} value={company.id}>
                        {company.name} ({company.stockSymbol})
                    </option>
                ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                <ChevronDown size={16} />
            </div>
        </div>
    );
};

export default CompanyPicker;
