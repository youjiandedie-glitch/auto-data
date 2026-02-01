"use client";

import React, { useEffect, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useAppSelector } from "@/store/hooks";

interface MainChartProps {
    data: {
        stockSeries: any[];
        salesSeries: any[];
    } | null;
    onZoom: (granularity: "WEEK" | "MONTH" | "YEAR") => void;
}

const MainChart: React.FC<MainChartProps> = ({ data, onZoom }) => {
    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
    const { selectedCompanies, timeRange } = useAppSelector(state => state.chart);

    useEffect(() => {
        if (chartComponentRef.current && data) {
            const chart = chartComponentRef.current.chart;
            const now = new Date().getTime();
            let min: number | null = null;

            const dayMs = 24 * 3600 * 1000;

            switch (timeRange) {
                case "1W": min = now - 7 * dayMs; break;
                case "1M": min = now - 30 * dayMs; break;
                case "3M": min = now - 90 * dayMs; break;
                case "1Y": min = now - 365 * dayMs; break;
                case "MAX": min = null; break;
            }

            if (min !== null) {
                chart.xAxis[0].setExtremes(min, now);
            } else {
                chart.xAxis[0].setExtremes(undefined, undefined);
            }
        }
    }, [timeRange, data]);

    const options: Highcharts.Options = {
        chart: {
            type: "line",
            backgroundColor: "transparent",
            style: {
                fontFamily: "var(--font-sans)",
            },
            zoomType: "x",
            events: {
                afterSetExtremes: function (e: any) {
                    if (e.trigger === "zoom" || e.trigger === "rangeSelectorButton") {
                        const range = e.max - e.min;
                        const dayMs = 24 * 3600 * 1000;
                        if (range < 45 * dayMs) {
                            onZoom("WEEK");
                        } else if (range < 365 * dayMs) {
                            onZoom("MONTH");
                        } else {
                            onZoom("YEAR");
                        }
                    }
                },
            },
        },
        title: {
            text: undefined,
        },
        xAxis: {
            type: "datetime",
            gridLineWidth: 1,
            gridLineColor: "#f1f5f9",
            lineColor: "#e2e8f0",
            dateTimeLabelFormats: {
                millisecond: "%H:%M:%S.%L",
                second: "%H:%M:%S",
                minute: "%H:%M",
                hour: "%H:%M",
                day: "%m-%d",
                week: "%m-%d",
                month: "%Y-%m",
                year: "%Y"
            }
        },
        yAxis: [
            {
                title: {
                    text: "股价走势 (%)",
                    style: { color: "#2563eb" },
                },
                labels: {
                    format: "{value}%",
                    style: { color: "#64748b" },
                },
                gridLineColor: "#f1f5f9",
            },
            {
                title: {
                    text: "销量变动 (%)",
                    style: { color: "#10b981" },
                },
                labels: {
                    format: "{value}%",
                    style: { color: "#64748b" },
                },
                opposite: true,
                gridLineWidth: 0,
            },
        ],
        tooltip: {
            shared: true,
            useHTML: true,
            backgroundColor: "rgba(255, 255, 255, 0.96)",
            borderRadius: 12,
            borderWidth: 0,
            shadow: true,
            formatter: function (this: any) {
                let s = `<div style="padding: 10px; font-family: var(--font-sans);">`;
                s += `<div style="font-size: 13px; color: #64748b; margin-bottom: 8px; font-weight: 600;">${Highcharts.dateFormat('%Y年%m月%d日', this.x)}</div>`;

                this.points.forEach((point: any) => {
                    const color = point.color;
                    const isStock = point.series.name === "Stock Price";
                    const name = isStock ? "股价指数" : "销量指数";
                    const rawValue = point.point.rawValue || 0;
                    const unit = isStock ? " CNY" : " 台";
                    const change = point.y > 0 ? `+${point.y}%` : `${point.y}%`;

                    s += `<div style="margin-top: 4px; display: flex; align-items: center; justify-content: space-between; gap: 20px;">
                  <span style="color: ${color}">\u25CF</span> ${name}: 
                  <span>
                    <b style="color: #1e293b">${rawValue.toLocaleString()}${unit}</b>
                    <span style="font-size: 11px; color: ${point.y >= 0 ? '#10b981' : '#ef4444'}; margin-left: 8px;">(${change})</span>
                  </span>
                </div>`;
                });
                s += `</div>`;
                return s;
            }
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: true,
                        },
                    },
                },
                states: {
                    inactive: {
                        opacity: 1
                    }
                }
            },
        },
        series: [
            {
                name: "Stock Price",
                type: "line",
                yAxis: 0,
                data: data?.stockSeries || [],
                color: "#2563eb",
            },
            {
                name: "Sales Volume",
                type: "column",
                yAxis: 1,
                data: data?.salesSeries || [],
                color: "#10b981",
                opacity: 0.6,
            },
        ],
        credits: {
            enabled: false,
        },
    };

    return (
        <div className="w-full bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
                ref={chartComponentRef}
            />
        </div>
    );
};

export default MainChart;
