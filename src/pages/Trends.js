import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BACKEND_URL } from "./api";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import Starfield from "../components/Starfield";
import AppFooter from "../components/AppFooter";
export default function Trends() {
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const particlesRef = useRef([]);
  const containerRef = useRef(null);

  // --- Particle setup ---
  useEffect(() => {
    const canvas = containerRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.2 + 0.05,
        color: `rgba(255,255,255,${Math.random() * 0.5 + 0.3})`,
      });
    }

    const animate = () => {
      if (!canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach((p) => {
        p.y += p.speed;
        if (p.y > canvas.height) p.y = 0; // wrap around bottom
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });
      requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  async function loadSeries(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSeries(null);

    try {
      const res = await axios.get(`${BACKEND_URL}/api/power/historical`, {
        params: { lat, lon, start, end, params: "T2M,PRECTOT" },
      });

      const cleanedSeries = res.data.series.map((s) => ({
        ...s,
        T2M: s.T2M === -999 ? null : s.T2M,
        PRECTOT: s.PRECTOT === -999 ? null : s.PRECTOT,
      }));

      setSeries(cleanedSeries);
    } catch (err) {
      console.error("Error fetching historical data:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const chartData =
    series && series.length > 0
      ? {
          labels: series.map((s) => s.date),
          datasets: [
            {
              label: "Temperature (°C)",
              data: series.map((s) => s.T2M),
              borderColor: "#3b82f6",
              backgroundColor: "rgba(59, 130, 246, 0.2)",
              tension: 0.4,
              fill: true,
              pointRadius: 5,
              pointHoverRadius: 7,
            },
            {
              label: "Precipitation (mm)",
              data: series.map((s) => s.PRECTOT),
              borderColor: "#10b981",
              backgroundColor: "rgba(16, 185, 129, 0.15)",
              tension: 0.4,
              fill: true,
              pointRadius: 5,
              pointHoverRadius: 7,
            },
          ],
        }
      : null;

  const options = {
    responsive: true,
    animation: { duration: 1500 },
    plugins: {
      legend: { position: "top", labels: { color: "#fff", font: { weight: "600" } } },
    },
    scales: {
      x: { ticks: { color: "#ccc" }, grid: { color: "#444" } },
      y: { type: "linear", position: "left", title: { display: true, text: "Temperature (°C)", color: "#fff" }, ticks: { color: "#fff" }, grid: { color: "#444" } },
      y1: {
        type: "linear",
        position: "right",
        grid: { drawOnChartArea: false, color: "#444" },
        title: { display: true, text: "Precipitation (mm)", color: "#fff" },
        ticks: { color: "#fff" },
      },
    },
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b from-black via-gray-900 to-indigo-950 text-white overflow-hidden">
      {/* Particle Canvas */}
      <canvas ref={containerRef} className="absolute inset-0 z-0"></canvas>
      <Starfield starCount={200} />
       {/* Main content */}
    <div className="relative z-10 flex-grow w-full max-w-6xl mx-auto px-6 py-12 space-y-10">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-4 animate-pulse">
            🌌 Historical Climate Trends
          </h2>
          <p className="text-gray-300 text-lg">
            Explore temperature and precipitation trends anywhere in the world. Powered by NASA POWER API.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={loadSeries}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 backdrop-blur-sm bg-gray-900/50 p-6 rounded-2xl border border-purple-700 shadow-xl"
        >
          <input
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder="Latitude"
            className="px-4 py-3 border border-gray-700 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none transition"
          />
          <input
            value={lon}
            onChange={(e) => setLon(e.target.value)}
            placeholder="Longitude"
            className="px-4 py-3 border border-gray-700 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none transition"
          />
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="px-4 py-3 border border-gray-700 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none transition"
          />
          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="px-4 py-3 border border-gray-700 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none transition"
          />
          <div className="sm:col-span-2 md:col-span-4 flex justify-center mt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 font-bold rounded-2xl shadow-lg hover:scale-105 transform transition-all disabled:opacity-50"
            >
              {loading ? "Loading..." : "Load Data"}
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="p-3 text-red-400 bg-red-900 border border-red-700 rounded-lg text-center text-sm">
            {error}
          </div>
        )}

        {/* Chart */}
        {chartData ? (
          <div className="backdrop-blur-sm bg-gray-900/50 border border-purple-700 rounded-2xl p-6 shadow-xl overflow-x-auto">
            <Line data={chartData} options={options} height={140} />
          </div>
        ) : (
          series && series.length === 0 && (
            <p className="text-center text-gray-400 mt-4">
              No data available for the selected period.
            </p>
          )
        )}

        {/* Insights & Tips */}
        {series && series.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="backdrop-blur-sm bg-gray-900/60 rounded-2xl p-6 shadow-xl border border-purple-700 hover:scale-105 transform transition">
              <h3 className="text-2xl font-bold mb-4 text-purple-400">💡 Insights</h3>
              <p className="text-gray-300 mb-2">
                🌡 <strong>Temperature:</strong> Max: <strong>{Math.max(...series.map(s => s.T2M))}°C</strong>, Min: <strong>{Math.min(...series.map(s => s.T2M))}°C</strong>
              </p>
              <p className="text-gray-300 mb-2">
                ☔ <strong>Precipitation:</strong> Max: <strong>{Math.max(...series.map(s => s.PRECTOT))}mm</strong>, Min: <strong>{Math.min(...series.map(s => s.PRECTOT))}mm</strong>
              </p>
              <p className="text-gray-400 mt-2 text-sm">
                Data sourced from NASA POWER API. Analyze local climate trends effectively.
              </p>
            </div>

            <div className="backdrop-blur-sm bg-gray-900/60 rounded-2xl p-6 shadow-xl border border-purple-700 hover:scale-105 transform transition">
              <h3 className="text-2xl font-bold mb-4 text-purple-400">📊 Trend Summary</h3>
              <p className="text-gray-300 mb-2">- Temperature trend is mostly stable with occasional spikes.</p>
              <p className="text-gray-300 mb-2">- Precipitation shows clear peaks on rainy days.</p>
              <p className="text-gray-300 mb-2">- Useful for planning outdoor activities, agriculture, or research.</p>
              <p className="text-gray-400 mt-2 text-sm">Hover over chart points for exact values and daily insights.</p>
            </div>
          </div>
        )}
      </div>
      {/* 🛸 Footer */}
            <AppFooter />
    </div>
  );
}
