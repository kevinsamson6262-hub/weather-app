import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMenu,
  FiX,
  FiSun,
  FiMoon,
  FiMap,
  FiTrendingUp,
  FiHome,
  FiCloud,
  FiCalendar,
} from "react-icons/fi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { name: "Home", to: "/", icon: <FiHome /> },
    { name: "Forecast", to: "/forecast", icon: <FiCloud /> },
    { name: "Map", to: "/map", icon: <FiMap /> },
    { name: "Trends", to: "/trends", icon: <FiTrendingUp /> },
    { name: "Weather Predictor", to: "/trip-planner", icon: <FiCalendar /> },
    { name: "Game", to: "/game", icon: null },
    { name: "About", to: "/about", icon: null },
  ];

  const linkVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05 } }),
  };

  return (
    <>
      <motion.nav
        initial={false} // prevent initial slide delay
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120 }}
        className={`w-full fixed top-0 left-0 z-50 backdrop-blur-md transition-all duration-500 ${
          scrolled ? "h-14 shadow-xl" : "h-16"
        } ${darkMode ? "bg-gray-900/90" : "bg-white/90"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-full">
          {/* Brand */}
          <motion.div
            initial={{ fontSize: "1.25rem" }} // start at a stable size
            animate={{
              fontSize: scrolled ? "1.25rem" : "1.5rem",
              color: darkMode ? "#fff" : "#2563eb",
            }}
            className="font-bold transition-all duration-300 cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            ☔ Will It Rain?
          </motion.div>


          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            {links.map((link) => (
              <NavLink key={link.name} to={link.to}>
                {({ isActive }) => (
                  <motion.div
                    className={`relative flex items-center space-x-2 cursor-pointer ${
                      darkMode ? "text-white" : "text-gray-700"
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {link.icon && <span>{link.icon}</span>}
                    <span className="relative inline-block">
                      {link.name}
                      {isActive && (
                        <motion.div
                          layoutId="underline"
                          className="absolute bottom-0 left-0 h-1 bg-blue-500 rounded"
                          style={{
                            width: link.name === "Home" ? "40px" : "100%",
                          }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                    </span>
                  </motion.div>
                )}
              </NavLink>
            ))}

            {/* Dark Mode Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleDarkMode}
              className="ml-4 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? (
                <FiSun className="text-yellow-400" />
              ) : (
                <FiMoon className="text-gray-700 dark:text-gray-200" />
              )}
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleDarkMode}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? (
                <FiSun className="text-yellow-400" />
              ) : (
                <FiMoon className="text-gray-700 dark:text-gray-200" />
              )}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleMenu}
              className="text-gray-700 dark:text-gray-200 focus:outline-none"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={`overflow-hidden md:hidden ${
                darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-700"
              }`}
            >
              <motion.div
                className="flex flex-col px-4 py-4 space-y-3"
                initial="hidden"
                animate="visible"
              >
                {links.map((link, i) => (
                  <motion.div
                    key={link.name}
                    custom={i}
                    variants={linkVariants}
                    whileTap={{ scale: 0.95 }}
                  >
                    <NavLink to={link.to} onClick={toggleMenu}>
                      {({ isActive }) => (
                        <span className="relative flex items-center space-x-2">
                          {link.icon && <span>{link.icon}</span>}
                          <span className="relative inline-block">
                            {link.name}
                            {isActive && (
                              <motion.div
                                layoutId="underline"
                                className="absolute bottom-0 left-0 h-1 bg-blue-500 rounded"
                                style={{
                                  width: link.name === "Home" ? "40px" : "100%",
                                }}
                                transition={{
                                  type: "spring",
                                  stiffness: 500,
                                  damping: 30,
                                }}
                              />
                            )}
                          </span>
                        </span>
                      )}
                    </NavLink>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer */}
      <div className={`${scrolled ? "h-14" : "h-16"}`}></div>
    </>
  );
}
