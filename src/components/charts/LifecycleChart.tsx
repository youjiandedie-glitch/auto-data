"use client";

import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

interface LifecycleChartProps {
    data: any[];
}

export default function LifecycleChart({ data }: LifecycleChartProps) {
    const series = data.map(model => ({
        name: `${model.name} (${model.company})`,
        data: model.series.map((s: any) => [s.monthIndex, s.volume]),
        marker: { enabled: false }
    }));

    const options: Highcharts.Options = {
        chart: {
            type: 'spline',
            backgroundColor: 'transparent',
            height: 500,
            style: { fontFamily: 'inherit' }
        },
        title: { text: undefined },
        xAxis: {
            title: { text: '上市月数 (Month index)', style: { fontWeight: 'bold' } },
            allowDecimals: false,
            gridLineWidth: 1,
            gridLineDashStyle: 'Dash',
            labels: { style: { color: '#64748b' } }
        },
        yAxis: {
            title: { text: '月销量 (辆)', style: { fontWeight: 'bold' } },
            gridLineWidth: 1,
            gridLineDashStyle: 'Dash',
            labels: { style: { color: '#64748b' } }
        },
        tooltip: {
            shared: true,
            useHTML: true,
            headerFormat: '<span style="font-size: 11px; font-weight: bold; color: #64748b">上市第 {point.key} 个月</span><br/>',
            pointFormat: '<div style="padding: 4px">' +
                '<span style="color:{point.color}">●</span> {series.name}: <b>{point.y:,.0f} 辆</b>' +
                '</div>'
        },
        plotOptions: {
            spline: {
                lineWidth: 3,
                states: {
                    hover: { lineWidth: 5 }
                }
            }
        },
        series: series as any,
        legend: {
            align: 'center',
            verticalAlign: 'bottom',
            itemStyle: { fontSize: '11px', fontWeight: 'bold' }
        },
        credits: { enabled: false }
    };

    return (
        <div className="bg-white/40 backdrop-blur-xl border border-slate-200/50 p-8 rounded-[2.5rem] shadow-sm">
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
}
