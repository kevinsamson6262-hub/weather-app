import React from "react";
import { motion } from "framer-motion";
import { Twitter, Facebook, Instagram } from "lucide-react";
import { Link } from "react-router-dom"; // ✅ Import Link

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function AppFooter() {
  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeInUp}
      className="relative bg-black/80 text-white py-12 mt-12 border-t border-cyan-500/20"
    >
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-[2fr_1fr_2fr] gap-10 text-center md:text-left items-start">
        {/* About */}
        <div>
          <h3 className="text-xl font-bold mb-3">NASA Weather App</h3>
          <p className="text-gray-300">
            Your reliable source for weather, maps, and trip planning. Explore with confidence.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <Link
                to="/forecast"
                className="hover:underline hover:text-cyan-400 transition"
              >
                Forecast
              </Link>
            </li>
            <li>
              <Link
                to="/map"
                className="hover:underline hover:text-cyan-400 transition"
              >
                Map
              </Link>
            </li>
            <li>
              <Link
                to="/trip-planner"
                className="hover:underline hover:text-cyan-400 transition"
              >
                Plan a Trip
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Links */}
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
  );
}
