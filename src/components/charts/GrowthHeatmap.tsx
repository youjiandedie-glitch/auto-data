"use client";

import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

// Handle Highcharts module in a way that satisfies TS/Next.js
if (typeof window !== "undefined") {
    const heatmap = require("highcharts/modules/heatmap");
    if (heatmap && typeof heatmap === 'function') {
        heatmap(Highcharts);
    }
}

interface GrowthHeatmapProps {
    data: any[];
    year: string;
}

export default function GrowthHeatmap({ data, year }: GrowthHeatmapProps) {
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    const companies = data.map(item => item.name);

    const heatmapData: any[] = [];
    data.forEach((item, companyIndex) => {
        item.data.forEach((val: number | null, monthIndex: number) => {
            if (val !== null) {
                heatmapData.push([monthIndex, companyIndex, val]);
            }
        });
    });

    const options: any = {
        chart: {
            type: 'heatmap',
            backgroundColor: 'transparent',
            height: Math.max(companies.length * 40 + 100, 400),
            style: { fontFamily: 'inherit' }
        },
        title: { text: undefined },
        xAxis: {
            categories: months,
            opposite: true,
            borderWidth: 0,
            labels: {
                style: { fontWeight: 'bold', color: '#64748b' }
            }
        },
        yAxis: {
            categories: companies,
            title: undefined,
            reversed: true,
            labels: {
                style: { fontWeight: 'black', color: '#1e293b' }
            }
        },
        colorAxis: {
            stops: [
                [0, '#f43f5e'],
                [0.4, '#ffffff'],
                [0.5, '#fef08a'],
                [0.7, '#3b82f6'],
                [1, '#2dd4bf']
            ],
            min: -50,
            max: 100
        },
        legend: {
            align: 'right',
            layout: 'vertical',
            margin: 0,
            verticalAlign: 'middle',
            y: 0,
            symbolHeight: 280,
            title: {
                text: 'YoY %',
                style: { fontWeight: 'bold' }
            }
        },
        tooltip: {
            useHTML: true,
            headerFormat: '<span style="font-size: 11px; font-weight: bold; color: #64748b">{series.yAxis.categories[point.y]}</span><br/>',
            pointFormat: '<div style="padding: 4px">' +
                '<span style="font-weight: bold; color: #1e293b">{series.xAxis.categories[point.x]} YoY:</span> ' +
                '<b style="color: #3b82f6; font-size: 14px">{point.value}%</b>' +
                '</div>'
        },
        series: [{
            name: '销量同比增速',
            borderWidth: 1,
            borderColor: '#f1f5f9',
            data: heatmapData,
            dataLabels: {
                enabled: true,
                color: '#000',
                style: {
                    textOutline: 'none',
                    fontSize: '10px'
                },
                formatter: function (this: any) {
                    return this.point.value + '%';
                }
            }
        }],
        credits: { enabled: false }
    };

    return (
        <div className="bg-white/40 backdrop-blur-xl border border-slate-200/50 p-8 rounded-[2.5rem] shadow-sm overflow-x-auto custom-scrollbar">
            <div className="min-w-[800px]">
                <HighchartsReact highcharts={Highcharts} options={options} />
            </div>
        </div>
    );
}
