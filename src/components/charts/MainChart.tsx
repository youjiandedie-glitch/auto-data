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
    timeRange: string;
    customStart: string | null;
    customEnd: string | null;
}

const MainChart: React.FC<MainChartProps> = ({ data, onZoom, timeRange, customStart, customEnd }) => {
    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
    // Remove selector here since we pass via props

    useEffect(() => {
        if (chartComponentRef.current && data) {
            const chart = chartComponentRef.current.chart;
            const now = new Date().getTime();
            let min: number | null = null;
            let max: number | null = null;

            const dayMs = 24 * 3600 * 1000;

            switch (timeRange) {
                case "1W": min = now - 7 * dayMs; break;
                case "1M": min = now - 30 * dayMs; break;
                case "3M": min = now - 90 * dayMs; break;
                case "1Y": min = now - 365 * dayMs; break;
                case "CUSTOM":
                    if (customStart && customEnd) {
                        // Inputs are "YYYY-MM"
                        const startDate = new Date(customStart + "-01");
                        // For end date, we want to include the selected month.
                        // So we create date for next month 1st day, then subtract 1ms?
                        // Or just set to the last moment of that month.
                        // Actually, setExtremes(min, max) -> max is visible.
                        // If data point is on 1st of month (timestamp), setting max to end of month captures it.
                        // Construct "YYYY-MM-02" to avoid timezone issues pulling it back?
                        // Safest: Add one month to month index.
                        const [endYear, endMonth] = customEnd.split("-").map(Number);
                        // Date constructor: month is 0-indexed. 'endMonth' from string is 1-indexed (e.g. "03").
                        // So new Date(y, m, 0) gives last day of previous month?
                        // new Date(2023, 3, 0) -> April 0th -> March 31st.
                        // This uses local time.

                        min = startDate.getTime();

                        // Set Max to the end of the selected month
                        const endDate = new Date(endYear, endMonth, 0, 23, 59, 59);
                        max = endDate.getTime();
                    }
                    break;
                case "MAX": min = null; break;
            }

            if (min !== null) {
                // If max is set (Custom), use it. Otherwise use 'now' for presets? 
                // Using 'now' for presets is standard. For Custom, use specified end.
                const extremeMax = max || now;
                chart.xAxis[0].setExtremes(min, extremeMax);
            } else {
                chart.xAxis[0].setExtremes(undefined, undefined);
            }
        }
    }, [timeRange, data, customStart, customEnd]);

    const options: Highcharts.Options = {
        chart: {
            type: "line",
            backgroundColor: "transparent",
            style: {
                fontFamily: "var(--font-sans)",
            },
            zooming: {
                type: "x"
            },
            // Highcharts type definition might miss some events or I'm using it wrong.
            // Using selection or redraw might be safer for zoom detection on Chart level.
            // But for setExtremes, it must be on Axis.
            // Let's use 'selection' for zoom start, or redraw.
            // Actually, let's fix the type by using proper Axis events if this was intended for Axis.
            // Looking at line 53, it's inside `chart: { ... }`.
            // I will move this logic to xAxis.
        },
        title: {
            text: undefined,
        },
        xAxis: {
            type: "datetime",
            events: {
                afterSetExtremes: function (e: any) {
                    if (e.trigger === "zoom" || e.trigger === "rangeSelectorButton") {
                        const range = e.max - e.min;
                        const dayMs = 24 * 3600 * 1000;
                        // Always use MONTH as minimum granularity since weekly data is valid removed
                        if (range < 365 * dayMs) {
                            onZoom("MONTH");
                        } else {
                            onZoom("YEAR");
                        }
                    }
                }
            } as any,
            gridLineWidth: 1,
            gridLineColor: "#f1f5f9",
            lineColor: "#e2e8f0",
            dateTimeLabelFormats: {
                minute: "%H:%M",
                hour: "%H:%M",
                day: "%m-%d",
                week: "%m-%d",
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
                const timestamp = this.x;
                const dateObj = new Date(timestamp);
                const year = dateObj.getFullYear();
                const month = dateObj.getMonth();
                const day = dateObj.getDate();

                let s = `<div style="padding: 10px; font-family: var(--font-sans);">`;
                s += `<div style="font-size: 13px; color: #64748b; margin-bottom: 8px; font-weight: 600;">${Highcharts.dateFormat('%Y年%m月%d日', timestamp)}</div>`;

                // 1. Get Stock Point (Daily)
                let stockPoint = this.points.find((p: any) => p.series.name === "股价");
                let stockVal = stockPoint ? stockPoint.point.rawValue : null;
                let stockChange = stockPoint ? stockPoint.y : null;

                // If not found in points but hovering, try to find in data if needed (optional)
                // Assuming shared tooltip captures accurate stock point if hovering line.

                // 2. Get Sales Point (Monthly)
                // Look up in the source data for matching Month/Year
                let salesVal = null;
                let salesChange = null;
                let salesPoint = this.points.find((p: any) => p.series.name === "销量");

                if (salesPoint) {
                    salesVal = salesPoint.point.rawValue;
                    salesChange = salesPoint.y;
                } else if (data?.salesSeries) {
                    // Find matching month
                    const match = data.salesSeries.find((p: any) => {
                        const d = new Date(p.x);
                        return d.getFullYear() === year && d.getMonth() === month;
                    });
                    if (match) {
                        salesVal = match.rawValue;
                        salesChange = match.y;
                    }
                }

                // Render Stock Row
                if (stockVal !== null) {
                    const changeStr = stockChange > 0 ? `+${stockChange}%` : `${stockChange}%`;
                    const color = stockPoint ? stockPoint.color : "#2563eb";
                    s += `<div style="margin-top: 4px; display: flex; align-items: center; justify-content: space-between; gap: 20px;">
                        <span style="color: ${color}">\u25CF</span> 最新股价: 
                        <span>
                            <b style="color: #1e293b">${stockVal.toFixed(2)} CNY</b>
                            <span style="font-size: 11px; color: ${stockChange >= 0 ? '#10b981' : '#ef4444'}; margin-left: 8px;">(${changeStr})</span>
                        </span>
                    </div>`;
                }

                // Render Sales Row
                if (salesVal !== null) {
                    const changeStr = salesChange > 0 ? `+${salesChange}%` : `${salesChange}%`;
                    const color = "#10b981";
                    s += `<div style="margin-top: 4px; display: flex; align-items: center; justify-content: space-between; gap: 20px;">
                        <span style="color: ${color}">\u25CF</span> 月度销量 (${month + 1}月): 
                        <span>
                            <b style="color: #1e293b">${salesVal.toLocaleString()} 辆</b>
                            <span style="font-size: 11px; color: ${salesChange >= 0 ? '#10b981' : '#ef4444'}; margin-left: 8px;">(${changeStr})</span>
                        </span>
                    </div>`;
                }

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
                name: "股价",
                type: "line",
                yAxis: 0,
                data: data?.stockSeries || [],
                color: "#2563eb",
            },
            {
                name: "销量",
                type: "line",
                yAxis: 1,
                data: data?.salesSeries || [],
                color: "#10b981",
                dashStyle: "ShortDash",
                lineWidth: 2,
                opacity: 1,
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
