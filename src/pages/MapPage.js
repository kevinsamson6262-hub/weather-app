import React, { useRef, useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";
import { FaGlobeAmericas } from "react-icons/fa";
import L from "leaflet";
import AppFooter from "../components/AppFooter";
import Starfield from "../components/Starfield";

// Custom marker icon
const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  iconSize: [35, 35],
});

function ClickHandler({ setMarker, fetchForecast }) {
  useMapEvents({
    click(e) {
      setMarker([e.latlng.lat, e.latlng.lng]);
      fetchForecast(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MapPage() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [marker, setMarker] = useState(null);
  const [forecast, setForecast] = useState(null);
  const starRef = useRef(null);

  // Fetch weather forecast
  const fetchForecast = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      );
      const data = await res.json();
      setForecast(data.current_weather);
    } catch (err) {
      console.error("Forecast fetch error:", err);
    }
  };

  const modisLayer = `MODIS_Terra_CorrectedReflectance_TrueColor`;
  const baseTile = `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/${modisLayer}/default/${date}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`;

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-black via-indigo-950 to-blue-950 text-white">
      {/* 🌌 Starfield Background */}
      <canvas ref={starRef} className="absolute inset-0 w-full h-full z-0" />
      <Starfield starCount={200} />

      <main className="relative z-10 flex flex-col items-center justify-start px-6 py-12 flex-grow space-y-10 pb-32">
        {/* Header */}
        <motion.h2
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent drop-shadow-lg gap-4"
        >
          <FaGlobeAmericas className="text-white w-12 h-12" />
          NASA GIBS Satellite Map
        </motion.h2>

        {/* Date Selector */}
        <div className="bg-black/40 p-4 rounded-xl border border-cyan-400/40">
          <label className="text-gray-200">
            Select Date:{" "}
            <input
              type="date"
              value={date}
              max={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setDate(e.target.value)}
              className="border px-3 py-2 rounded-lg text-black"
            />
          </label>
        </div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="w-full max-w-6xl h-[70vh] rounded-2xl overflow-hidden shadow-2xl border border-purple-500/40"
        >
          <MapContainer
            center={[20, 78]}
            zoom={4}
            style={{ height: "100%", width: "100%" }}
          >
            <LayersControl position="topright">
              {/* Base MODIS True Color */}
              <LayersControl.BaseLayer checked name="MODIS True Color">
                <TileLayer url={baseTile} maxZoom={9} />
              </LayersControl.BaseLayer>

              {/* OpenStreetMap as alternative base */}
              <LayersControl.BaseLayer name="OpenStreetMap">
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="© OpenStreetMap contributors"
                />
              </LayersControl.BaseLayer>

              {/* Cloud Cover */}
              <LayersControl.Overlay name="Cloud Cover">
                <TileLayer
                  url={`https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_Cloud_Top_Pressure/default/${date}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png`}
                  maxZoom={9}
                  opacity={0.6}
                />
              </LayersControl.Overlay>

              {/* Precipitation (IMERG) */}
              <LayersControl.Overlay name="Precipitation (IMERG)">
                <TileLayer
                  url={`https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/GPM_3IMERGHH/default/${date}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png`}
                  maxZoom={9}
                  opacity={0.6}
                />
              </LayersControl.Overlay>

              {/* Aerosols */}
              <LayersControl.Overlay name="Aerosols / Dust">
                <TileLayer
                  url={`https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_Aerosol/default/${date}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png`}
                  maxZoom={9}
                  opacity={0.7}
                />
              </LayersControl.Overlay>

              {/* Sea Surface Temperature */}
              <LayersControl.Overlay name="Sea Surface Temperature">
                <TileLayer
                  url={`https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/AMSRE_Sea_Surface_Temperature/default/${date}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png`}
                  maxZoom={9}
                  opacity={0.7}
                />
              </LayersControl.Overlay>
            </LayersControl>

            {/* Handle Clicks */}
            <ClickHandler setMarker={setMarker} fetchForecast={fetchForecast} />

            {/* Marker with Forecast */}
            {marker && (
              <Marker position={marker} icon={markerIcon}>
                <Popup>
                  {forecast ? (
                    <div>
                      <h3 className="font-bold">Weather Forecast</h3>
                      <p>🌡️ Temp: {forecast.temperature}°C</p>
                      <p>💨 Wind: {forecast.windspeed} km/h</p>
                      <p>⌚ Time: {forecast.time}</p>
                    </div>
                  ) : (
                    "Loading forecast..."
                  )}
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </motion.div>

        <p className="text-gray-400 text-sm">
          💡 Tip: Use the checkboxes (top-right) to toggle NASA overlays. Click
          anywhere on the map to drop a marker and view live weather forecast.
        </p>
      </main>

      <AppFooter className="relative z-20 mt-auto" />
    </div>
  );
}
