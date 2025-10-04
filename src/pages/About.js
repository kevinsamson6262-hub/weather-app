import React, { useRef, useEffect } from "react";
import Starfield from "../components/Starfield";
import AppFooter from "../components/AppFooter";
import { motion } from "framer-motion";

export default function About() {
  const starRef = useRef(null);

  // 🌌 Starfield effect
  useEffect(() => {
    const canvas = starRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5,
      speed: Math.random() * 0.2 + 0.05,
      alpha: Math.random(),
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        ctx.fillStyle = `rgba(255,255,255,${0.2 + Math.random() * 0.6})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
        s.y += s.speed; // downward movement
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
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-black via-indigo-950 to-blue-950 text-white overflow-hidden">
      {/* 🌌 Starfield Background */}
      <Starfield starCount={200} />
      <canvas ref={starRef} className="absolute inset-0 w-full h-full z-0" />

      {/* Main content */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center space-y-12 max-w-5xl mx-auto px-6 py-12">
        {/* Project Intro */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-3xl p-8 rounded-2xl border border-cyan-400/40 bg-black/40 backdrop-blur-2xl shadow-2xl text-center"
          style={{
            boxShadow:
              "0 0 30px rgba(0,255,255,0.4), 0 0 80px rgba(147,51,234,0.3)",
          }}
        >
          <h2 className="text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent mb-6">
            About This Project 🚀
          </h2>
          <p className="text-gray-300 text-lg mb-4">
            This app is built for the NASA Space Apps Challenge. It integrates
            NASA and weather APIs to help users plan events based on accurate
            space and Earth weather data.
          </p>
          <p className="text-gray-400">
            Explore forecasts, historical trends, and cosmic insights all in one
            interactive platform.
          </p>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-3xl p-8 rounded-2xl border border-purple-500/30 bg-black/30 backdrop-blur-md shadow-xl"
        >
          <h3 className="text-3xl font-bold text-purple-400 mb-4">🎯 Mission</h3>
          <p className="text-gray-300">
            Our mission is to provide accessible, reliable, and visually engaging
            weather and space data to help enthusiasts, researchers, and event
            planners make informed decisions anywhere in the world.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-3xl p-8 rounded-2xl border border-cyan-400/30 bg-black/30 backdrop-blur-md shadow-xl"
        >
          <h3 className="text-3xl font-bold text-cyan-400 mb-4">✨ Features</h3>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Real-time cosmic and terrestrial weather forecasts</li>
            <li>Historical climate trends visualization with charts</li>
            <li>Interactive space-themed UI with starfield and animations</li>
            <li>Insights and recommendations for outdoor events</li>
            <li>Mobile-responsive and fast performance</li>
          </ul>
        </motion.div>

        {/* Technologies */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-3xl p-8 rounded-2xl border border-pink-500/30 bg-black/30 backdrop-blur-md shadow-xl"
        >
          <h3 className="text-3xl font-bold text-pink-400 mb-4">
            💻 Technologies Used
          </h3>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>React.js with Tailwind CSS for UI</li>
            <li>Framer Motion for animations</li>
            <li>NASA POWER API for weather and solar data</li>
            <li>Chart.js for historical trends visualization</li>
            <li>Custom starfield and particle effects</li>
          </ul>
        </motion.div>

        {/* Acknowledgments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-3xl p-8 rounded-2xl border border-indigo-400/30 bg-black/30 backdrop-blur-md shadow-xl"
        >
          <h3 className="text-3xl font-bold text-indigo-400 mb-4">
            🙏 Acknowledgments
          </h3>
          <p className="text-gray-300">
            Special thanks to NASA Space Apps Challenge for inspiring this
            project. Thanks also to the developers and contributors of the APIs
            and libraries that make this interactive experience possible.
          </p>
        </motion.div>
      </main>

      {/* Footer */}
      <AppFooter className="mt-auto" />
    </div>
  );
}
