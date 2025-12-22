import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function PriceChart({ prices }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

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

    const dataPoints = prices.map((p) => p[1]);

    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Price (USD)",
            data: dataPoints,
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59,130,246,0.15)",
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
              label: (ctx) =>
                `$${ctx.parsed.y.toFixed(2)}`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              maxTicksLimit: 6, // cleaner for 24h
              color: "#9ca3af",
            },
          },
          y: {
            grid: { color: "#1f2937" },
            ticks: {
              color: "#9ca3af",
              callback: (value) => `$${value}`,
            },
          },
        },
      },
    });

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
}
