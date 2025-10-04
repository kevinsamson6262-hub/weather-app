import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import AppFooter from "../components/AppFooter";
import { motion } from "framer-motion";
import { BACKEND_URL } from "./api";
import {
  Sun,
  CloudRain,
  Wind,
  Droplet,
  CloudLightning,
  CloudSnow,
  Cloud,
} from "lucide-react";

// 🌦 Weather Effect Canvas
function WeatherEffect({ weather }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let raindrops = [];
    let snowflakes = [];
    let humidityParticles = [];
    let windStreaks = [];

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 🌧 Rain
      if (weather?.PRECTOTCORR > 0) {
        if (raindrops.length < 300)
          raindrops.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            length: 10 + Math.random() * 10,
            speed: 4 + Math.random() * 4,
          });
        raindrops.forEach((r) => {
          ctx.strokeStyle = "rgba(135,206,250,0.7)";
          ctx.beginPath();
          ctx.moveTo(r.x, r.y);
          ctx.lineTo(r.x, r.y + r.length);
          ctx.stroke();
          r.y += r.speed;
          if (r.y > canvas.height) r.y = 0;
        });
      }

      // ❄ Snow
      if (weather?.T2M < 5) {
        if (snowflakes.length < 200)
          snowflakes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: 2 + Math.random() * 3,
            speed: 0.5 + Math.random(),
          });
        snowflakes.forEach((s) => {
          ctx.fillStyle = "rgba(255,255,255,0.8)";
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.fill();
          s.y += s.speed;
          if (s.y > canvas.height) s.y = 0;
        });
      }

      // 💧 Humidity mist
      if (weather?.RH2M > 70) {
        if (humidityParticles.length < 150)
          humidityParticles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: 2 + Math.random() * 4,
            speed: 0.1 + Math.random() * 0.2,
          });
        humidityParticles.forEach((h) => {
          ctx.fillStyle = "rgba(200, 200, 255, 0.15)";
          ctx.beginPath();
          ctx.arc(h.x, h.y, h.radius, 0, Math.PI * 2);
          ctx.fill();
          h.y -= h.speed;
          if (h.y < 0) h.y = canvas.height;
        });
      }

      // 🌬 Wind streaks
      if (weather?.WS2M > 7) {
        if (windStreaks.length < 100)
          windStreaks.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            length: 30 + Math.random() * 20,
            speed: 2 + Math.random() * 2,
          });
        windStreaks.forEach((w) => {
          ctx.strokeStyle = "rgba(173,216,230,0.3)";
          ctx.beginPath();
          ctx.moveTo(w.x, w.y);
          ctx.lineTo(w.x + w.length, w.y);
          ctx.stroke();
          w.x += w.speed;
          if (w.x > canvas.width) w.x = 0;
        });
      }

      // ☀ Warm sunny glow overlay
      if (
        typeof weather?.T2M === "number" &&
        weather.T2M > 30 &&
        (weather?.PRECTOTCORR === 0 || weather?.PRECTOTCORR < 0.1)
      ) {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, "rgba(255, 200, 100, 0.25)"); // golden top
        gradient.addColorStop(0.5, "rgba(255, 180, 80, 0.15)"); // mid glow
        gradient.addColorStop(1, "rgba(255, 150, 50, 0.1)");  // warm bottom

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Optional: subtle sun rays shimmer
        for (let i = 0; i < 8; i++) {
          const angle = (Math.PI * 2 * i) / 8 + Date.now() * 0.0003;
          const x = canvas.width / 2 + Math.cos(angle) * 300;
          const y = canvas.height * 0.2 + Math.sin(angle) * 200;

          ctx.strokeStyle = "rgba(255, 220, 120, 0.08)";
          ctx.lineWidth = 80;
          ctx.beginPath();
          ctx.moveTo(canvas.width / 2, canvas.height * 0.2);
          ctx.lineTo(x, y);
          ctx.stroke();
        }
      }



      requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [weather]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0 pointer-events-none"
    />
  );
}

export default function Forecast() {
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() - 3);

  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [date, setDate] = useState(defaultDate.toISOString().split("T")[0]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const starfieldRef = useRef(null);

  // 🌌 Fetch forecast
  const fetchForecast = async () => {
    if (!lat || !lon) {
      setError("Latitude and Longitude are required.");
      return;
    }
    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await axios.get(`${BACKEND_URL}/api/power/daily`, {
        params: {
          lat: parseFloat(lat),
          lon: parseFloat(lon),
          date: date,
          params: "T2M,PRECTOTCORR,WS2M,RH2M",
        },
      });

      const power = res.data.power?.properties?.parameter || {};
      const nasaDate = date.replace(/-/g, "");
      const parsed = {};

      for (let param in power) {
        const val = power[param][nasaDate];
        parsed[param] =
          val === -999 || val === undefined ? "Data not available" : val;
      }

      setData({ requested: res.data.requested, parameters: parsed });
    } catch (err) {
      console.error(err);
      setError("Unable to fetch NASA POWER data. Check coordinates/date.");
    } finally {
      setLoading(false);
    }
  };

  // ☁️ Weather icon selector
  const getWeatherIcon = (params) => {
    if (!params) return <Cloud size={72} className="text-gray-300" />;
    if (params.PRECTOTCORR > 0)
      return <CloudRain size={72} className="text-blue-400 drop-shadow-lg" />;
    if (params.T2M > 30)
      return <Sun size={72} className="text-yellow-300 drop-shadow-lg" />;
    if (params.T2M < 5)
      return <CloudSnow size={72} className="text-cyan-200 drop-shadow-lg" />;
    if (params.WS2M > 7)
      return <Wind size={72} className="text-cyan-300 drop-shadow-lg" />;
    if (params.RH2M > 70)
      return <Droplet size={72} className="text-indigo-400 drop-shadow-lg" />;
    return (
      <CloudLightning size={72} className="text-purple-400 drop-shadow-lg" />
    );
  };

  // 🌠 Starfield animation
  useEffect(() => {
    const canvas = starfieldRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5,
      speed: 0.2 + Math.random() * 0.5,
      alpha: Math.random(),
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        ctx.fillStyle = `rgba(255,255,255,${0.2 + Math.random() * 0.6})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
        s.y += s.speed;
        if (s.y > canvas.height) s.y = 0;
      });
      requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e) => {
      stars.forEach((s) => {
        s.x += e.movementX * 0.02;
        s.y += e.movementY * 0.02;
      });
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-black via-indigo-950 to-black text-white overflow-hidden">
      {/* 🌌 Starfield */}
      <canvas
        ref={starfieldRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* 🌍 Orbiting planet glow */}
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="w-[480px] h-[480px] rounded-full bg-gradient-to-br from-indigo-800/10 to-cyan-400/5 blur-3xl"
        />
      </div>

      {/* 🌦 Weather animation */}
      {data && <WeatherEffect weather={data.parameters} />}

      {/* 🚀 Forecast Card */}
      <main className="flex-grow flex flex-col items-center px-6 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 w-full max-w-5xl p-10 rounded-3xl border border-cyan-400/40 bg-black/40 backdrop-blur-2xl shadow-2xl"
          style={{
            boxShadow:
              "0 0 30px rgba(0,255,255,0.4), 0 0 80px rgba(147,51,234,0.3)",
          }}
        >
          {/* 🌠 Header */}
          <div className="text-center">
            <motion.h2
              className="text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent drop-shadow-lg"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Cosmic Weather
            </motion.h2>
            <p className="text-indigo-200 text-sm mt-2 tracking-wide">
              NASA POWER • Space Edition
            </p>
          </div>

          {/* Inputs */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <input
              type="number"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="Latitude"
              className="flex-1 px-4 py-3 bg-black/50 text-white rounded-xl border border-white/30 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
            />
            <input
              type="number"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
              placeholder="Longitude"
              className="flex-1 px-4 py-3 bg-black/50 text-white rounded-xl border border-white/30 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
            />
            <input
              type="date"
              value={date}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDate(e.target.value)}
              className="px-4 py-3 bg-black/50 text-white rounded-xl border border-white/30 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
            />
          </div>

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchForecast}
            disabled={loading}
            className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-indigo-500 to-pink-600 text-white font-semibold rounded-xl shadow-lg"
          >
            {loading ? "Fetching Data..." : "Get Forecast"}
          </motion.button>

          {/* Error */}
          {error && (
            <div className="mt-4 p-4 text-red-400 bg-red-900/40 border border-red-500 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          {/* Forecast Results */}
          {data && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-10 p-8 bg-black/40 rounded-2xl shadow-2xl border border-white/10"
            >
              {/* Main Icon & Temp */}
              <div className="flex flex-col items-center text-center mb-10">
                {getWeatherIcon(data.parameters)}
                <h3 className="text-6xl font-extrabold bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-lg mt-4">
                  {data.parameters.T2M}°C
                </h3>
                <p className="text-indigo-200 mt-2">
                  {data.requested.lat}, {data.requested.lon} —{" "}
                  {data.requested.date}
                </p>
              </div>

              {/* Stat Cards */}
              <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                {[
                  {
                    icon: Sun,
                    label: "Temperature",
                    value: `${data.parameters.T2M} °C`,
                    color: "yellow",
                  },
                  {
                    icon: CloudRain,
                    label: "Rainfall",
                    value: `${data.parameters.PRECTOTCORR} mm`,
                    color: "blue",
                  },
                  {
                    icon: Wind,
                    label: "Wind Speed",
                    value: `${data.parameters.WS2M} m/s`,
                    color: "cyan",
                  },
                  {
                    icon: Droplet,
                    label: "Humidity",
                    value: `${data.parameters.RH2M} %`,
                    color: "purple",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className={`
                    relative flex flex-col items-center justify-center p-6 rounded-3xl 
                    bg-black/40 border border-${item.color}-400/50
                    shadow-[0_0_25px_rgba(0,255,255,0.3),0_0_50px_rgba(147,51,234,0.2)]
                    hover:scale-110 hover:shadow-[0_0_35px_rgba(0,255,255,0.6),0_0_70px_rgba(147,51,234,0.4)]
                    transition-all duration-300
                  `}
                  >
                    <div
                      className={`absolute -top-6 w-20 h-20 rounded-full bg-${item.color}-500/20 blur-2xl animate-pulse`}
                    />
                    <item.icon
                      className={`relative text-${item.color}-300`}
                      size={50}
                    />
                    <p className="mt-4 text-gray-200 uppercase tracking-wider font-semibold">
                      {item.label}
                    </p>
                    <p className="text-3xl font-extrabold text-white mt-1 drop-shadow-lg">
                      {item.value}
                    </p>
                    <div
                      className={`h-1 w-1/2 bg-${item.color}-400 mt-4 rounded-full animate-pulse`}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {/* Insights */}
              <div className="mt-10 p-6 bg-gray-900/50 rounded-2xl border border-purple-500/30 shadow-lg">
                <h4 className="text-xl font-bold text-purple-400 mb-4">
                  🌟 Insights
                </h4>
                <ul className="text-gray-300 space-y-2">
                  {data.parameters.T2M !== "Data not available" && (
                    <li>
                      🌡 Temperature: {data.parameters.T2M}°C —{" "}
                      {data.parameters.T2M > 30
                        ? "Hot day ahead!"
                        : data.parameters.T2M < 10
                        ? "Cold day ahead!"
                        : "Moderate temperature."}
                    </li>
                  )}
                  {data.parameters.PRECTOTCORR !== "Data not available" && (
                    <li>
                      ☔ Rainfall: {data.parameters.PRECTOTCORR} mm —{" "}
                      {data.parameters.PRECTOTCORR > 5
                        ? "Expect wet conditions."
                        : "Light or no rain expected."}
                    </li>
                  )}
                  {data.parameters.WS2M !== "Data not available" && (
                    <li>
                      🌬 Wind Speed: {data.parameters.WS2M} m/s —{" "}
                      {data.parameters.WS2M > 7
                        ? "Windy conditions, hold on tight!"
                        : "Calm winds."}
                    </li>
                  )}
                  {data.parameters.RH2M !== "Data not available" && (
                    <li>
                      💧 Humidity: {data.parameters.RH2M}% —{" "}
                      {data.parameters.RH2M > 70
                        ? "High humidity, could feel sticky."
                        : "Comfortable humidity."}
                    </li>
                  )}
                </ul>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <AppFooter />
    </div>
  );
}
