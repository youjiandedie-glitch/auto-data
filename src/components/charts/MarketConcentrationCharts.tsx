"use client";

import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

interface MarketConcentrationChartsProps {
    data: any[];
}

export default function MarketConcentrationCharts({ data }: MarketConcentrationChartsProps) {
    const categories = data.map(d => d.date);

    // 1. CR3 & CR5 Area Chart Options
    const crOptions: Highcharts.Options = {
        chart: {
            type: 'area',
            backgroundColor: 'transparent',
            height: 350,
            style: { fontFamily: 'inherit' }
        },
        title: { text: undefined },
        xAxis: {
            categories: categories,
            gridLineWidth: 1,
            labels: { style: { color: '#64748b', fontSize: '10px' } }
        },
        yAxis: {
            title: { text: '市场占比 (%)', style: { fontWeight: 'bold' } },
            max: 100,
            labels: { format: '{value}%', style: { color: '#64748b' } }
        },
        tooltip: {
            shared: true,
            headerFormat: '<span style="font-size: 11px; font-weight: bold; color: #64748b">{point.key}</span><br/>',
            valueSuffix: '%'
        },
        plotOptions: {
            area: {
                stacking: undefined,
                lineColor: '#ffffff',
                lineWidth: 2,
                marker: {
                    lineWidth: 1,
                    lineColor: '#ffffff'
                },
                fillOpacity: 0.1
            }
        },
        series: [{
            name: 'CR5 (前五名合计)',
            data: data.map(d => parseFloat(d.cr5.toFixed(1))),
            color: '#3b82f6'
        }, {
            name: 'CR3 (前三名合计)',
            data: data.map(d => parseFloat(d.cr3.toFixed(1))),
            color: '#2dd4bf'
        }] as any,
        legend: {
            align: 'left',
            verticalAlign: 'top',
            itemStyle: { fontSize: '11px', fontWeight: 'bold' }
        },
        credits: { enabled: false }
    };

    // 2. HHI Trend Options
    const hhiOptions: Highcharts.Options = {
        chart: {
            type: 'spline',
            backgroundColor: 'transparent',
            height: 350,
            style: { fontFamily: 'inherit' }
        },
        title: { text: undefined },
        xAxis: {
            categories: categories,
            labels: { style: { color: '#64748b', fontSize: '10px' } }
        },
        yAxis: {
            title: { text: 'HHI 指数', style: { fontWeight: 'bold' } },
            plotLines: [{
                value: 1500,
                color: '#e2e8f0',
                dashStyle: 'Dash',
                width: 2,
                label: { text: '竞争型 / 集中分界线', style: { color: '#94a3b8', fontSize: '10px' } }
            }],
            labels: { style: { color: '#64748b' } }
        },
        tooltip: {
            headerFormat: '<span style="font-size: 11px; font-weight: bold; color: #64748b">{point.key}</span><br/>',
            pointFormat: 'HHI指数: <b>{point.y:,.0f}</b>'
        },
        series: [{
            name: 'HHI 指数趋势',
            data: data.map(d => Math.round(d.hhi)),
            color: '#6366f1',
            lineWidth: 3,
            marker: { radius: 4 }
        }] as any,
        legend: { enabled: false },
        credits: { enabled: false }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/40 backdrop-blur-xl border border-slate-200/50 p-8 rounded-[2.5rem] shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">CRn 集中度演变</h3>
                    <div className="flex items-center gap-2 px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold">
                        Top Players Dominance
                    </div>
                </div>
                <HighchartsReact highcharts={Highcharts} options={crOptions} />
            </div>

            <div className="bg-white/40 backdrop-blur-xl border border-slate-200/50 p-8 rounded-[2.5rem] shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">HHI 竞争结构动态</h3>
                    <div className="flex items-center gap-2 px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold">
                        Industry Consolidation
                    </div>
                </div>
                <HighchartsReact highcharts={Highcharts} options={hhiOptions} />
            </div>
        </div>
    );
}
