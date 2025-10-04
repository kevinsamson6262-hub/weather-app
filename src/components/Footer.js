import React from "react";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="mt-auto w-full">
      {/* Solid black background */}
      <div className="relative bg-black">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(40)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 0],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                delay: i * 0.2,
                repeat: Infinity,
                repeatType: "loop",
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Footer content */}
        <div className="relative z-10 text-center py-4 px-4 border-t border-white/20 bg-black/60 backdrop-blur-lg">
          <p className="text-sm md:text-base text-gray-300 tracking-wide">
            🚀 Powered by{" "}
            <span className="text-indigo-300 font-semibold hover:text-purple-300 transition-colors">
              NASA POWER
            </span>{" "}
            &{" "}
            <span className="text-indigo-300 font-semibold hover:text-purple-300 transition-colors">
              GIBS
            </span>{" "}
            • Cosmic Weather Demo ✨
          </p>
        </div>
      </div>
    </footer>
  );
}
