import { useEffect, useRef } from "react";
import {
  Chart,
  ChartConfiguration,
  ChartTypeRegistry,
} from "chart.js/auto";
import { PricePoint } from "../types/common";

/* ---------------- Types ---------------- */



interface PriceChartProps {
  prices: PricePoint[];
}

/* ---------------- Component ---------------- */

const PriceChart = ({ prices }: PriceChartProps) => {
  const canvasRef =
    useRef<HTMLCanvasElement | null>(null);

  const chartRef =
    useRef<
      Chart<
        keyof ChartTypeRegistry,
        number[],
        string
      > | null
    >(null);

  useEffect(() => {
    if (!prices || prices.length === 0) return;

    // Destroy old chart if exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const labels = prices.map((p) =>
      new Date(p[0]).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );

    const dataPoints = prices.map(
      (p) => p[1]
    );

    if (!canvasRef.current) return;

    const config: ChartConfiguration<
      "line",
      number[],
      string
    > = {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Price (USD)",
            data: dataPoints,
            borderColor: "#3b82f6",
            backgroundColor:
              "rgba(59,130,246,0.15)",
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const value =
                  ctx.parsed.y;

                if (
                  typeof value ===
                  "number"
                ) {
                  return `$${value.toFixed(
                    2
                  )}`;
                }

                return "$0.00";
              },
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              maxTicksLimit: 6,
              color: "#9ca3af",
            },
          },
          y: {
            grid: { color: "#1f2937" },
            ticks: {
              color: "#9ca3af",
              callback: (value) =>
                `$${value}`,
            },
          },
        },
      },
    };

    chartRef.current = new Chart(
      canvasRef.current,
      config
    );

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [prices]);

  return (
    <div className="h-80 bg-[#111a2b] p-4 rounded-xl">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default PriceChart;
