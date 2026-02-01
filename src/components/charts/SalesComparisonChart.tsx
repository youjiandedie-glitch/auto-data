"use client";

import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

interface SalesComparisonChartProps {
    series: { name: string; data: number[] }[];
    year: string;
}

export default function SalesComparisonChart({ series, year }: SalesComparisonChartProps) {
    const options: Highcharts.Options = {
        chart: {
            type: 'column',
            backgroundColor: 'transparent',
            style: {
                fontFamily: 'inherit'
            },
            height: 450
        },
        title: {
            text: undefined
        },
        xAxis: {
            categories: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            lineColor: '#e2e8f0',
            tickColor: '#e2e8f0',
            labels: {
                style: {
                    color: '#64748b',
                    fontWeight: 'bold',
                    fontSize: '11px'
                }
            }
        },
        yAxis: {
            title: {
                text: '销量 (辆)',
                style: {
                    color: '#64748b',
                    fontWeight: 'bold',
                    fontSize: '11px'
                }
            },
            gridLineColor: '#f1f5f9',
            labels: {
                style: {
                    color: '#94a3b8',
                    fontSize: '10px'
                }
            }
        },
        legend: {
            itemStyle: {
                color: '#334155',
                fontWeight: 'bold',
                fontSize: '12px'
            }
        },
        plotOptions: {
            column: {
                borderRadius: 4,
                borderWidth: 0,
                opacity: 0.85
            }
        },
        tooltip: {
            shared: true,
            useHTML: true,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderWidth: 0,
            shadow: true,
            padding: 12,
            style: {
                fontSize: '12px'
            },
            headerFormat: '<span style="font-size: 10px; font-weight: bold; color: #64748b">{point.key} ' + year + '</span><br/>',
            pointFormat: '<div style="display: flex; align-items: center; gap: 8px; margin-top: 4px">' +
                '<span style="color:{point.color}">●</span> ' +
                '<span style="font-weight: bold; color: #1e293b">{series.name}:</span> ' +
                '<span style="font-weight: black; color: #0f172a; margin-left: auto">{point.y:,.0f} 辆</span>' +
                '</div>'
        },
        series: series.map((s, i) => ({
            ...s,
            type: 'column',
            color: i === 0 ? '#3b82f6' : i === 1 ? '#6366f1' : i === 2 ? '#8b5cf6' : i === 3 ? '#ec4899' : '#f43f5e'
        })) as any,
        credits: {
            enabled: false
        }
    };

    return (
        <div className="bg-white/40 backdrop-blur-xl border border-slate-200/50 p-6 rounded-[2.5rem] shadow-sm">
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
}
