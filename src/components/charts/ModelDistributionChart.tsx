"use client";

import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

interface ModelDistributionChartProps {
    data: { name: string; y: number }[];
    title: string;
}

export default function ModelDistributionChart({ data, title }: ModelDistributionChartProps) {
    const total = data.reduce((sum, item) => sum + item.y, 0);

    const options: Highcharts.Options = {
        chart: {
            type: 'pie',
            backgroundColor: 'transparent',
            height: 400
        },
        title: {
            text: undefined
        },
        tooltip: {
            useHTML: true,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderWidth: 0,
            shadow: true,
            padding: 12,
            pointFormat: '<div style="display: flex; flex-direction: column; gap: 4px">' +
                '<span style="font-weight: bold; color: #1e293b">{point.name}</span>' +
                '<span style="color: #64748b">销量: <b style="color: #0f172a">{point.y:,.0f} 辆</b></span>' +
                '<span style="color: #64748b">占比: <b style="color: #3b82f6">{point.percentage:.1f}%</b></span>' +
                '</div>'
        },
        plotOptions: {
            pie: {
                innerSize: '70%',
                borderWidth: 0,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b style="color: #475569">{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        fontSize: '11px',
                        textOutline: 'none'
                    }
                },
                showInLegend: true
            }
        },
        legend: {
            itemStyle: {
                color: '#334155',
                fontWeight: 'bold',
                fontSize: '12px'
            },
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            itemMarginBottom: 8
        },
        series: [{
            name: '销量占比',
            type: 'pie',
            data: data.map((item, i) => ({
                ...item,
                color: i === 0 ? '#3b82f6' :
                    i === 1 ? '#6366f1' :
                        i === 2 ? '#8b5cf6' :
                            i === 3 ? '#a855f7' :
                                i === 4 ? '#d946ef' :
                                    i === 5 ? '#ec4899' : '#94a3b8'
            }))
        }] as any,
        credits: {
            enabled: false
        }
    };

    return (
        <div className="bg-white/40 backdrop-blur-xl border border-slate-200/50 p-6 rounded-[2.5rem] shadow-sm relative group">
            <div className="absolute top-1/2 left-[40%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Total Sales</span>
                <span className="text-3xl font-black text-slate-900 mt-1">{total.toLocaleString()}</span>
                <span className="text-[10px] text-slate-400 font-bold">UNITS</span>
            </div>
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
}
