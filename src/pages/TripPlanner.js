import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Starfield from "../components/Starfield";
export default function TripPlanner() {
  const [cityInput, setCityInput] = useState("");
  const [cityOptions, setCityOptions] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [dayOffset, setDayOffset] = useState(0);
  const [forecast, setForecast] = useState(null);
  const [message, setMessage] = useState("Enter a city to start planning.");
  const [loading, setLoading] = useState(false);

  // ========== Helper functions ==========
  function formatDate(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}${mm}${dd}`;
  }

  async function searchCity(name) {
    setLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          name
        )}`
      );
      const data = await res.json();
      if (!data || data.length === 0) {
        setCityOptions([]);
        setMessage("No cities found. Try another name.");
        return;
      }
      const options = data.slice(0, 5).map((c) => ({
        name: c.display_name,
        lat: parseFloat(c.lat),
        lon: parseFloat(c.lon),
      }));
      setCityOptions(options);
      setMessage("Select your city:");
    } catch (err) {
      console.error(err);
      setMessage("Error searching for city.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchPredictedForecast(lat, lon, offset) {
    setLoading(true);
    try {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + offset);
      const month = targetDate.getMonth() + 1;
      const day = targetDate.getDate();

      const currentYear = targetDate.getFullYear();
      const yearsToCheck = 5;
      let temps = [];
      let rains = [];
      let winds = [];

      for (let i = 1; i <= yearsToCheck; i++) {
        const year = currentYear - i;
        const dateStr = `${year}${String(month).padStart(2, "0")}${String(
          day
        ).padStart(2, "0")}`;
        const url = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M,PRECTOTCORR,WS2M&community=AG&longitude=${lon}&latitude=${lat}&start=${dateStr}&end=${dateStr}&format=JSON`;

        try {
          const res = await fetch(url);
          const data = await res.json();
          if (data?.properties?.parameter) {
            const T2M = data.properties.parameter.T2M?.[dateStr];
            const PRECTOT = data.properties.parameter.PRECTOTCORR?.[dateStr];
            const WIND = data.properties.parameter.WS2M?.[dateStr];
            if (
              [T2M, PRECTOT, WIND].every(
                (v) => v !== undefined && v !== -999 && v !== -9999
              )
            ) {
              temps.push(T2M);
              rains.push(PRECTOT);
              winds.push(WIND * 3.6);
            }
          }
        } catch {
          console.warn("Year fetch failed", year);
        }
      }

      if (temps.length === 0) {
        const climUrl = `https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M,PRECTOT,WS2M&community=AG&longitude=${lon}&latitude=${lat}&format=JSON`;
        const climRes = await fetch(climUrl);
        const climData = await climRes.json();
        temps.push(climData.properties.parameter.T2M?.[month] ?? 25);
        rains.push(climData.properties.parameter.PRECTOT?.[month] ?? 5);
        winds.push((climData.properties.parameter.WS2M?.[month] ?? 3) * 3.6);
      }

      const avg = (arr) =>
        arr.reduce((a, b) => a + b, 0) / (arr.length || 1);

      return {
        temp: Math.round(avg(temps)),
        rain: Math.round(avg(rains)),
        wind: Math.round(avg(winds)),
        source: "Predicted from NASA historical data",
      };
    } catch (err) {
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }

  function getPrecautions(f) {
    if (!f) return [];
    const precautions = [];
    if (f.rain > 20)
      precautions.push(
        "🌧 Heavy rain — carry an umbrella or adjust travel plans."
      );
    else if (f.rain > 5)
      precautions.push("🌦 Light rain possible — carry an umbrella.");
    if (f.wind > 50)
      precautions.push("💨 Strong winds — avoid outdoor risky activities.");
    else if (f.wind > 30)
      precautions.push("🌬 Windy — take care while traveling.");
    if (f.temp > 32)
      precautions.push("🔥 Hot — stay hydrated & avoid direct sunlight.");
    if (f.temp < 15)
      precautions.push("🧥 Cool — carry warm clothing.");
    if (precautions.length === 0)
      precautions.push("✅ Pleasant weather — enjoy your trip!");
    return precautions;
  }

  // ========== UI Handlers ==========
  async function handleSearchCity() {
    if (!cityInput) return setMessage("Please enter a city name.");
    setForecast(null);
    setSelectedCity(null);
    await searchCity(cityInput);
  }

  async function handleSelectCity(city) {
    setSelectedCity(city);
    setCityOptions([]);
    const f = await fetchPredictedForecast(city.lat, city.lon, dayOffset);
    if (f) setForecast(f);
    setMessage(`Precautions for ${city.name}:`);
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 py-12 overflow-hidden text-white bg-black">
      {/* 🌌 Animated Star Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(30,60,114,0.5),transparent_80%)]">
        <motion.div
          className="absolute inset-0"
          animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{
            backgroundImage:
              "url('https://www.transparenttextures.com/patterns/stardust.png')",
            opacity: 0.4,
          }}
        />
      </div>
      <Starfield starCount={200} />
      {/* Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 w-full max-w-3xl p-10 rounded-3xl border border-cyan-400/30 bg-black/40 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,255,255,0.3)]"
      >
        {/* Title */}
        <motion.h1
          className="text-5xl font-extrabold text-center bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent drop-shadow-lg"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          🚀 NASA Weather Predictor
        </motion.h1>
        <p className="text-center text-indigo-200 mt-2 mb-8">
          Predict weather using NASA POWER API & take smart precautions.
        </p>

        {/* Input */}
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Enter city name"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border border-white/20 bg-black/40 text-white focus:ring-2 focus:ring-cyan-400 outline-none"
          />
          <button
            onClick={handleSearchCity}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-pink-600 rounded-xl font-semibold shadow-lg hover:shadow-[0_0_20px_rgba(255,0,150,0.6)] transition"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {/* City Options */}
        <AnimatePresence>
          {cityOptions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-4 border border-white/20 rounded-xl bg-black/40 p-3 space-y-2"
            >
              {cityOptions.map((c, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectCity(c)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-cyan-500/20 transition"
                >
                  {c.name}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Day Selection */}
        {selectedCity && (
          <div className="mt-6">
            <label className="text-sm text-indigo-300">Select day:</label>
            <select
              value={dayOffset}
              onChange={async (e) => {
                const offset = parseInt(e.target.value);
                setDayOffset(offset);
                const f = await fetchPredictedForecast(
                  selectedCity.lat,
                  selectedCity.lon,
                  offset
                );
                if (f) setForecast(f);
              }}
              className="w-full px-4 py-3 rounded-xl border border-white/20 bg-black/40 text-white focus:ring-2 focus:ring-cyan-400 outline-none"
            >
              <option value={0}>Today</option>
              <option value={1}>Tomorrow</option>
              <option value={2}>Day after tomorrow</option>
              <option value={3}>+3 Days</option>
              <option value={4}>+4 Days</option>
              <option value={5}>+5 Days</option>
              <option value={6}>+6 Days</option>
            </select>
          </div>
        )}

        {/* Forecast Results */}
        <AnimatePresence>
          {forecast && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 p-6 rounded-2xl border border-white/10 bg-black/50 backdrop-blur-md shadow-lg space-y-3"
            >
              <div className="font-semibold text-xl text-cyan-300">
                {selectedCity.name} — {forecast.source}
              </div>
              <div className="text-sm text-indigo-200">
                🌡 Temp: {forecast.temp}°C · 🌧 Rain: {forecast.rain} mm/day · 💨
                Wind: {forecast.wind} km/h
              </div>
              <div className="font-semibold text-cyan-400 mt-3">
                Precautions:
              </div>
              <ul className="list-disc pl-5 text-sm text-indigo-100 space-y-1">
                {getPrecautions(forecast).map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="text-xs text-indigo-400 mt-6 text-center italic">
          Powered by NASA POWER API 🌍 | Space Apps Challenge
        </div>
      </motion.div>
    </div>
  );
}
