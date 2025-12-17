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

    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels: prices.map(p =>
          new Date(p[0]).toLocaleDateString()
        ),
        datasets: [
          {
            label: "Price (USD)",
            data: prices.map(p => p[1]),
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59,130,246,0.15)",
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: "#1f2937" } },
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
