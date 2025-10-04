import React, { useEffect, useRef } from "react";
import {
  Map,
  Sun,
  BarChart,
  Star,
  Twitter,
  Facebook,
  Instagram,
  CloudRain,
  ThermometerSun,
  Wind,
  Code,
  Globe,
  Activity,
} from "lucide-react";
import { motion } from "framer-motion";
import Starfield from "../components/Starfield";
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

function Home() {
  const starRef = useRef(null);

  useEffect(() => {
    const canvas = starRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let stars = Array.from({ length: 250 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5,
      speed: 0.2 + Math.random() * 0.5,
      dx: Math.random() * 0.2 - 0.1,
    }));

    let meteors = Array.from({ length: 5 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height / 2,
      length: 100 + Math.random() * 50,
      speed: 4 + Math.random() * 2,
      angle: Math.random() * Math.PI / 4,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      stars.forEach((s) => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
        s.y += s.speed;
        s.x += s.dx;
        if (s.y > canvas.height) s.y = 0;
        if (s.x > canvas.width) s.x = 0;
        if (s.x < 0) s.x = canvas.width;
      });

      // Draw meteors
      ctx.strokeStyle = "rgba(255,255,255,0.8)";
      ctx.lineWidth = 2;
      meteors.forEach((m) => {
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - m.length * Math.cos(m.angle), m.y + m.length * Math.sin(m.angle));
        ctx.stroke();
        m.x += m.speed;
        m.y += m.speed * Math.tan(m.angle);
        if (m.y > canvas.height || m.x > canvas.width) {
          m.x = Math.random() * canvas.width;
          m.y = -50;
        }
      });

      requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden text-white bg-gradient-to-br from-black via-indigo-950 to-blue-950">
      {/* 🌌 Starfield Background */}
      <Starfield starCount={250} />
      
      {/* Starfield Canvas */}
      <canvas ref={starRef} className="absolute inset-0 w-full h-full z-0" />

      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="relative flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto py-36 px-6 md:px-12 z-10"
      >
        {/* Left Content */}
        <div className="text-center md:text-left md:max-w-lg">
          <h1 className="text-6xl md:text-7xl font-extrabold mb-8 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 drop-shadow-xl animate-pulse">
            Explore the Cosmos of <span className="text-white">Weather 🌍</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-12">
            NASA-powered forecasts, interactive maps, and trip insights for any location on Earth.
          </p>
          <div className="flex justify-center md:justify-start gap-6 flex-wrap">
            <a href="/forecast" className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:scale-105 hover:shadow-2xl transition">
              Check Forecast
            </a>
            <a href="/map" className="px-8 py-4 bg-white text-blue-900 font-semibold rounded-xl shadow-lg hover:scale-105 hover:bg-gray-100 transition">
              Explore Map
            </a>
            <a href="/trip-planner" className="px-8 py-4 bg-green-500 text-white font-semibold rounded-xl shadow-lg hover:scale-105 hover:bg-green-600 transition">
              Trip Weather Checker
            </a>
            <a href="/game" className="px-8 py-4 bg-yellow-400 text-white font-semibold rounded-xl shadow-lg hover:scale-105 hover:bg-yellow-500 transition">
              Play Weather Game
            </a>
          </div>
        </div>

        {/* Right Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mt-10 md:mt-0 relative"
        >
          <img src={`${process.env.PUBLIC_URL}/weather-illustration-en.webp`} alt="Weather Illustration" className="w-98 md:w-[38rem] drop-shadow-2xl animate-float" />
          <div className="absolute -top-10 -left-10 w-24 h-24 bg-white/10 rounded-full blur-3xl animate-spin-slow" />
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="py-5 px-6 md:px-12 relative z-10"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center text-cyan-400 mb-16">
          What We Offer
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            {
              icon: <Sun className="w-14 h-14 text-yellow-400 mx-auto mb-6 animate-float" />,
              title: "Accurate Forecasts",
              text: "Precise weather predictions powered by NASA satellites and AI analysis.",
            },
            {
              icon: <Map className="w-14 h-14 text-cyan-400 mx-auto mb-6 animate-float" />,
              title: "Interactive Maps",
              text: "Visualize climate trends and weather patterns on intuitive maps.",
            },
            {
              icon: <BarChart className="w-14 h-14 text-green-400 mx-auto mb-6 animate-float" />,
              title: "Trends & Insights",
              text: "Deep insights into past, present, and future weather patterns.",
            },
          ].map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }} className="bg-white/10 backdrop-blur-lg p-10 rounded-3xl shadow-lg hover:shadow-2xl transition transform hover:scale-105 border border-cyan-500/20 text-center">
              {f.icon}
              <h3 className="text-2xl font-semibold text-cyan-400 mb-3">{f.title}</h3>
              <p className="text-gray-300">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="py-20 px-6 md:px-12 bg-black/50 backdrop-blur-xl rounded-3xl mx-6 md:mx-12 mt-12 shadow-lg border border-cyan-500/20 z-10"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center text-cyan-400 mb-16">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto text-center">
          {[
            { icon: <Globe className="w-12 h-12 mx-auto text-blue-500 mb-4" />, step: "1. Choose Location", desc: "Select your trip or event location. Pick your spot." },
            { icon: <Activity className="w-12 h-12 mx-auto text-green-500 mb-4" />, step: "2. Pick Date & Time", desc: "Set when you want the forecast. Choose the exact day and time." },
            { icon: <CloudRain className="w-12 h-12 mx-auto text-indigo-500 mb-4" />, step: "3. Get Forecast", desc: "NASA-powered insights for rain, wind, temp, etc." },
            { icon: <Star className="w-12 h-12 mx-auto text-yellow-500 mb-4" />, step: "4. Plan Smart", desc: "Make informed outdoor decisions. Stay updated." },
          ].map((item, idx) => (
            <div key={idx} className="bg-white/10 p-6 rounded-2xl shadow hover:shadow-lg transition hover:scale-105 border border-cyan-500/20">
              {item.icon}
              <h3 className="font-semibold text-cyan-400 mb-2">{item.step}</h3>
              <p className="text-gray-300 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Tech & Tools */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="py-20 px-6 md:px-12 bg-black/30 backdrop-blur-xl rounded-3xl mx-6 md:mx-12 mt-12 shadow-lg border border-cyan-500/20 z-10"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center text-cyan-400 mb-10">
          Tech & Tools Behind the App
        </h2>
        <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
          {[
            { icon: <Code className="w-10 h-10 text-blue-500" />, text: "React.js" },
            { icon: <BarChart className="w-10 h-10 text-green-500" />, text: "Data Visualization" },
            { icon: <Wind className="w-10 h-10 text-indigo-500" />, text: "Weather APIs" },
            { icon: <ThermometerSun className="w-10 h-10 text-red-500" />, text: "Climate Models" },
          ].map((t, i) => (
            <div key={i} className="flex flex-col items-center bg-white/10 px-6 py-6 rounded-xl shadow hover:shadow-md hover:scale-105 transition">
              {t.icon}
              <p className="mt-3 font-semibold text-gray-300">{t.text}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="py-20 px-6 md:px-12 text-center bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-3xl mx-6 md:mx-12 mt-12 shadow-xl border border-cyan-400 z-10"
      >
                <h2 className="text-4xl md:text-5xl font-extrabold mb-6 animate-pulse">
          Ready to Explore the Weather?
        </h2>
        <p className="mb-10 max-w-2xl mx-auto text-blue-100 text-lg">
          Dive into forecasts, interactive maps, and trip planning features curated from NASA data. Make informed decisions for your adventures anywhere on Earth.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <a
            href="/forecast"
            className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl shadow-lg hover:scale-105 hover:shadow-2xl hover:bg-gray-100 transition transform"
          >
            Get Forecast
          </a>
          <a
            href="/trip-planner"
            className="px-8 py-4 bg-green-500 text-white font-semibold rounded-xl shadow-lg hover:scale-105 hover:shadow-2xl hover:bg-green-600 transition transform"
          >
            Predict Weather
          </a>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="relative bg-black/80 text-white py-12 mt-12 border-t border-cyan-500/20"
      >
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-[2fr_1fr_2fr] gap-10 text-center md:text-left items-start">
          <div>
            <h3 className="text-xl font-bold mb-3">NASA Weather App</h3>
            <p className="text-gray-300">
              Your reliable source for weather, maps, and trip planning. Explore with confidence.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/forecast" className="hover:underline hover:text-cyan-400 transition">Forecast</a></li>
              <li><a href="/map" className="hover:underline hover:text-cyan-400 transition">Map</a></li>
              <li><a href="/trip" className="hover:underline hover:text-cyan-400 transition">Weather Predictor</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Connect</h4>
            <div className="flex justify-center md:justify-start gap-4 mt-2">
              <a href="#" aria-label="Twitter" className="hover:text-blue-400 transition">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" aria-label="Facebook" className="hover:text-blue-300 transition">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-pink-400 transition">
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        <p className="text-center text-gray-400 mt-10 text-sm">
          © {new Date().getFullYear()} NASA Weather App. All rights reserved.
        </p>
      </motion.footer>
    </div>
  );
}

export default Home;

