import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GAME_SETTINGS = {
  width: 1200,
  height: 500,
  spawnIntervalMs: 1800,
  dataSpeed: 250,
  vanYMin: 40,
  vanYMax: 360,
  vanStep: 80,
  vanWidth: 192, // matches w-48
  vanHeight: 96, // approximate for van image
};

const WEATHER_TYPES = [
  { type: "rain", img: "/rain.png", speed: 200 },
  { type: "snow", img: "/snow.png", speed: 180 },
  { type: "lightning", img: "/lightning.png", speed: 240 },
  { type: "wind", img: "/wind.png", speed: 220 },
];

const DATA_TYPES = [
  { type: "data1", img: "/data1.png", score: 5 },
  { type: "data2", img: "/data2.png", score: 10 },
  { type: "data3", img: "/data3.png", score: 15 },
];

// Easier weather prediction questions
const SAMPLE_QUESTIONS = [
  {
    id: 1,
    q: "If the temperature is dropping quickly and the sky is cloudy, what weather is likely?",
    choices: ["Sunny day", "Snow or rain", "Heatwave", "Clear skies"],
    a: 1,
  },
  {
    id: 2,
    q: "A forecast says 35°C with no clouds. What should you expect?",
    choices: ["Cold day", "Snowfall", "Hot and sunny", "Heavy rain"],
    a: 2,
  },
  {
    id: 3,
    q: "When strong winds and dark clouds appear, what might follow?",
    choices: ["Calm weather", "Storm or rain", "Sunny skies", "Fog"],
    a: 1,
  },
  {
    id: 4,
    q: "If the temperature is below 0°C and it rains, what will likely happen?",
    choices: ["Snow or ice", "Thunderstorm", "Heatwave", "Foggy day"],
    a: 0,
  },
  {
    id: 5,
    q: "When the humidity is high and temperature is low, what might you see?",
    choices: ["Fog", "Lightning", "Sunny skies", "Windstorm"],
    a: 0,
  },
  {
    id: 6,
    q: "If wind speed increases and air pressure drops, what’s coming?",
    choices: ["Storm", "Clear sky", "Snowfall", "Drought"],
    a: 0,
  },
  {
    id: 7,
    q: "What kind of weather follows a clear night with falling temperature?",
    choices: ["Frost or dew", "Rainstorm", "Heatwave", "Thunderstorm"],
    a: 0,
  },
  {
    id: 8,
    q: "You see dark clouds but feel warm air—what’s likely next?",
    choices: ["Rain soon", "Snow", "Fog", "Sunny day"],
    a: 0,
  },
  {
    id: 9,
    q: "If the sky turns red at sunset, what does it usually mean for tomorrow?",
    choices: ["Good weather", "Rainy day", "Windstorm", "Snowfall"],
    a: 0,
  },
  {
    id: 10,
    q: "A sudden drop in barometric pressure means what?",
    choices: ["Storm approaching", "Sunny weather", "Snowfall ending", "Clear sky"],
    a: 0,
  },
  {
    id: 11,
    q: "When the air feels heavy and sticky, what is high?",
    choices: ["Humidity", "Wind speed", "Pressure", "Visibility"],
    a: 0,
  },
  {
    id: 12,
    q: "Which cloud type brings steady rain or drizzle?",
    choices: ["Stratus", "Cumulus", "Cirrus", "Nimbus"],
    a: 0,
  },
  {
    id: 13,
    q: "A sudden flash followed by thunder indicates what?",
    choices: ["Lightning storm", "Tornado", "Fog", "Snowfall"],
    a: 0,
  },
  {
    id: 14,
    q: "If air temperature is close to dew point, what may form?",
    choices: ["Fog or dew", "Rainstorm", "Snow", "Wind gusts"],
    a: 0,
  },
  {
    id: 15,
    q: "What usually follows a cold front passing through an area?",
    choices: ["Cooler air and clear skies", "Hotter weather", "Heavy fog", "No change"],
    a: 0,
  },
];


function aabbCollide(a, b) {
  return !(
    a.x + a.w < b.x ||
    a.x > b.x + b.w ||
    a.y + a.h < b.y ||
    a.y > b.y + b.h
  );
}

export default function WeatherChaserGame() {
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [entities, setEntities] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [vanY, setVanY] = useState(120);
  const [showMenu, setShowMenu] = useState(true);
  const [paused, setPaused] = useState(false);

  const spawnTimer = useRef(null);
  const lastTick = useRef(null);

  // Keyboard controls (fixed scroll issue)
  useEffect(() => {
    function onKey(e) {
      if (!running || paused) return;
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setVanY((y) => Math.max(GAME_SETTINGS.vanYMin, y - GAME_SETTINGS.vanStep));
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setVanY((y) => Math.min(GAME_SETTINGS.vanYMax, y + GAME_SETTINGS.vanStep));
      }
    }
    window.addEventListener("keydown", onKey, { passive: false });
    return () => window.removeEventListener("keydown", onKey);
  }, [running, paused]);

  // Spawn entities
  useEffect(() => {
    if (!running || gameOver || quiz || paused) return;
    spawnTimer.current = setInterval(() => spawnEntity(), GAME_SETTINGS.spawnIntervalMs);
    return () => clearInterval(spawnTimer.current);
  }, [running, gameOver, quiz, paused]);

  // Main game loop
  useEffect(() => {
    lastTick.current = performance.now();
    let raf = 0;

    function tick(now) {
      if (!running || paused) {
        raf = requestAnimationFrame(tick);
        return;
      }

      const dt = (now - lastTick.current) / 1000;
      lastTick.current = now;

      setEntities((prev) => {
        const next = prev
          .map((ent) => {
            const speed =
              ent.type === "data"
                ? GAME_SETTINGS.dataSpeed
                : WEATHER_TYPES.find((w) => w.type === ent.obstacleType)?.speed || 200;
            return { ...ent, x: ent.x - speed * dt };
          })
          .filter((ent) => ent.x > -120);

        const vanBox = {
          x: 60,
          y: vanY + 10,
          w: GAME_SETTINGS.vanWidth - 40,
          h: GAME_SETTINGS.vanHeight - 20,
        };

        next.forEach((ent) => {
          if (ent._handled) return;

          const entBox = { x: ent.x, y: ent.y, w: ent.w || 64, h: ent.h || 64 };

          if (aabbCollide(vanBox, entBox)) {
            ent._handled = true;

            if (ent.type === "obstacle") {
              setLives((L) => {
                const newL = Math.max(0, L - 1);
                if (newL <= 0) {
                  setGameOver(true);
                  setRunning(false);
                }
                return newL;
              });
            } else if (ent.type === "data") {
              setQuiz({ question: ent.payload, score: ent.score });
              setRunning(false);
            }
          }
        });

        return next;
      });

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [vanY, quiz, running, paused]);

  function spawnEntity() {
    const isData = Math.random() < 0.4;
    const laneYs = [40, 120, 200, 280, 360];
    const y = laneYs[Math.floor(Math.random() * laneYs.length)];
    const x = GAME_SETTINGS.width + 80;
    const id = Math.random().toString(36).slice(2, 9);

    let ent;
    if (isData) {
      const dataType = DATA_TYPES[Math.floor(Math.random() * DATA_TYPES.length)];
      ent = {
        id,
        type: "data",
        x,
        y,
        w: 64,
        h: 64,
        payload: pickRandomQuestion(),
        img: dataType.img,
        score: dataType.score,
      };
    } else {
      const obstacle = WEATHER_TYPES[Math.floor(Math.random() * WEATHER_TYPES.length)];
      ent = {
        id,
        type: "obstacle",
        obstacleType: obstacle.type,
        img: obstacle.img,
        x,
        y,
        w: 64,
        h: 64,
      };
    }
    setEntities((e) => [...e, ent]);
  }

  function pickRandomQuestion() {
    return SAMPLE_QUESTIONS[Math.floor(Math.random() * SAMPLE_QUESTIONS.length)];
  }

  function answerQuiz(choiceIdx) {
    if (!quiz) return;
    const correctIdx = quiz.question.a;
    if (choiceIdx === correctIdx) setScore((s) => s + (quiz.score || 10));
    else
      setLives((L) => {
        const nl = Math.max(0, L - 1);
        if (nl <= 0) setGameOver(true);
        return nl;
      });
    setQuiz(null);
    setRunning(true);
  }

  function restart() {
    setScore(0);
    setLives(3);
    setEntities([]);
    setVanY(120);
    setGameOver(false);
    setRunning(true);
    setPaused(false);
  }

  function startGame() {
    setShowMenu(false);
    setRunning(true);
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-black via-indigo-950 to-black text-white overflow-hidden">
      {/* Start Menu */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center text-gray-900/70 z-20"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-lg p-6 w-80 text-center"
            >
              <h1 className="text-3xl font-bold mb-4">Weather Chaser</h1>
              <button
                onClick={startGame}
                className="px-6 py-3 bg-sky-500 text-white rounded text-lg"
              >
                Start Game
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Area */}
      <div
        className="relative overflow-hidden rounded-lg border border-gray-600"
        style={{ width: GAME_SETTINGS.width, height: GAME_SETTINGS.height }}
      >
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/desert.webp')` }}
        />

        {/* Entities */}
        {entities.map((ent) => (
          <motion.img
            key={ent.id}
            src={ent.img}
            alt={ent.type}
            className="absolute w-16 h-16"
            style={{ left: ent.x, top: ent.y }}
          />
        ))}

        {/* Van */}
        <motion.img
          src="/van.png"
          alt="van"
          className="absolute left-6 w-48 h-auto"
          style={{ top: vanY }}
          animate={{ top: vanY }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />

        {/* HUD */}
        <div className="absolute top-3 left-3 text-white flex items-center gap-4 z-10">
          <div className="bg-black/50 px-3 py-1 rounded">Score: {score}</div>
          <div className="bg-black/50 px-3 py-1 rounded">Lives: {"❤️".repeat(lives)}</div>
        </div>

        {/* Pause Button */}
        {running && !gameOver && !quiz && (
          <button
            onClick={() => setPaused(!paused)}
            className="absolute top-3 right-3 bg-black/50 text-white px-3 py-1 rounded z-10"
          >
            {paused ? "Resume" : "Pause"}
          </button>
        )}

        {/* Quiz Modal */}
        <AnimatePresence>
          {quiz && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center text-gray-900/50 z-20"
            >
              <motion.div
                initial={{ y: 40, scale: 0.98 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className="bg-white rounded-lg p-5 w-80 shadow-2xl"
              >
                <h3 className="font-bold text-lg">Weather Quiz 🌤️</h3>
                <p className="mt-2 text-gray-900">{quiz.question.q}</p>
                <div className="mt-4 grid gap-2">
                  {quiz.question.choices.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => answerQuiz(i)}
                      className="bg-sky-50 hover:bg-sky-100 rounded px-3 py-2 text-left"
                    >
                      {String.fromCharCode(65 + i)}. {c}
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Over */}
        <AnimatePresence>
          {gameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center text-gray-900/60 z-20"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg p-6 w-64 text-center"
              >
                <h2 className="text-2xl font-bold">Game Over</h2>
                <p className="mt-2">Your score: {score}</p>
                <button
                  onClick={restart}
                  className="mt-4 px-4 py-2 bg-sky-500 text-white rounded"
                >
                  Play Again
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
