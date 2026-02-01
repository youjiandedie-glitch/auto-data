"use client";

import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

// Handle Highcharts-more in a way that satisfies TS/Next.js
if (typeof window !== "undefined") {
    const more = require("highcharts/highcharts-more");
    if (more && typeof more === 'function') {
        more(Highcharts);
    }
}

interface ValuationChartProps {
    data: any[];
}

export default function ValuationChart({ data }: ValuationChartProps) {
    const series = data.map(item => ({
        name: item.name,
        data: [{
            x: item.annualSalesVolume,
            y: item.marketCap / 100000000, // 亿元
            ps: item.psRatio,
            val: item.marketCapPerUnit,
            currency: item.currency,
            revenue: item.annualRevenue / 100000000 // 亿元
        }]
    }));

    const options: any = {
        chart: {
            type: 'bubble',
            backgroundColor: 'transparent',
            height: 500,
            style: { fontFamily: 'inherit' }
        },
        title: { text: undefined },
        xAxis: {
            title: { text: '年度销量 (辆)', style: { fontWeight: 'bold' } },
            gridLineWidth: 1,
            gridLineDashStyle: 'Dash',
            labels: { style: { color: '#64748b' } }
        },
        yAxis: {
            title: { text: '总市值 (亿元)', style: { fontWeight: 'bold' } },
            gridLineWidth: 1,
            gridLineDashStyle: 'Dash',
            labels: { style: { color: '#64748b' } }
        },
        tooltip: {
            useHTML: true,
            headerFormat: '<span style="font-size: 11px; font-weight: bold; color: #64748b">{series.name}</span><br/>',
            pointFormat: '<div style="padding: 4px; min-width: 140px">' +
                '<div style="display: flex; justify-between: space-between; margin-bottom: 4px">' +
                '<span>市值:</span> <b style="margin-left: auto">{point.y:,.1f} 亿 {point.currency}</b>' +
                '</div>' +
                '<div style="display: flex; justify-between: space-between; margin-bottom: 4px">' +
                '<span>销量:</span> <b style="margin-left: auto">{point.x:,.0f} 辆</b>' +
                '</div>' +
                '<div style="display: flex; justify-between: space-between; color: #3b82f6">' +
                '<span>PS (营收):</span> <b style="margin-left: auto">{point.ps:.2f}x</b>' +
                '</div>' +
                '</div>'
        },
        plotOptions: {
            bubble: {
                minSize: 20,
                maxSize: 60,
                zMin: 0,
                zMax: 100,
                displayNegative: false,
                dataLabels: {
                    enabled: true,
                    format: '{series.name}',
                    style: {
                        fontSize: '10px',
                        textOutline: 'none',
                        color: '#1e293b'
                    }
                }
            }
        },
        series: series as any,
        legend: { enabled: false },
        credits: { enabled: false }
    };

    return (
        <div className="bg-white/40 backdrop-blur-xl border border-slate-200/50 p-8 rounded-[2.5rem] shadow-sm relative group">
            <HighchartsReact highcharts={Highcharts} options={options} />
            <div className="absolute top-6 left-6 pointer-events-none">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Live Multi-Market Valuation</span>
                </div>
            </div>
        </div>
    );
}
