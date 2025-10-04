import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Forecast from "./pages/Forecast";
import MapPage from "./pages/MapPage";
import Trends from "./pages/Trends";
import About from "./pages/About";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WeatherGame from './pages/TripPlanner';
import Game from './pages/game';
import GoogleTranslate from "./components/GoogleTranslate";

export default function App() {
  return (
    <HashRouter>
      <div className="app-shell">
        <Navbar />
        <GoogleTranslate />
        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/forecast" element={<Forecast />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/trends" element={<Trends />} />
            <Route path="/trip-planner" element={<WeatherGame />} />
            <Route path="/about" element={<About />} />
            <Route path="/game" element={<Game />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
}
