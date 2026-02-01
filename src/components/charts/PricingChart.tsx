"use client";

import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

interface PricingChartProps {
    data: any[];
}

export default function PricingChart({ data }: PricingChartProps) {
    const categories = data.map(d => d.date);
    const seriesData = data.map(d => d.avgDiscount);

    const options: Highcharts.Options = {
        chart: {
            type: 'areaspline',
            backgroundColor: 'transparent',
            height: 400,
            style: { fontFamily: 'inherit' }
        },
        title: { text: undefined },
        xAxis: {
            categories: categories,
            gridLineWidth: 1,
            gridLineDashStyle: 'Dash',
            labels: { style: { color: '#64748b', fontSize: '10px' } }
        },
        yAxis: {
            title: { text: '平均折扣率 (%)', style: { fontWeight: 'bold' } },
            labels: { format: '{value}%', style: { color: '#64748b' } },
            gridLineWidth: 1
        },
        tooltip: {
            shared: true,
            useHTML: true,
            headerFormat: '<span style="font-size: 11px; font-weight: bold; color: #64748b">{point.key}</span><br/>',
            pointFormat: '<div style="padding: 4px">' +
                '<span style="color:#ef4444">●</span> 行业平均折扣: <b>{point.y:.1f}%</b>' +
                '</div>'
        },
        plotOptions: {
            areaspline: {
                fillColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, 'rgba(239, 68, 68, 0.2)'],
                        [1, 'rgba(239, 68, 68, 0)']
                    ]
                },
                marker: {
                    radius: 4,
                    fillColor: '#ffffff',
                    lineWidth: 2,
                    lineColor: '#ef4444'
                },
                lineWidth: 3,
                color: '#ef4444'
            }
        },
        series: [{
            name: '终端折扣率 (Industry Avg)',
            data: seriesData
        }] as any,
        legend: { enabled: false },
        credits: { enabled: false }
    };

    return (
        <div className="bg-white/40 backdrop-blur-xl border border-slate-200/50 p-8 rounded-[2.5rem] shadow-sm">
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
}
