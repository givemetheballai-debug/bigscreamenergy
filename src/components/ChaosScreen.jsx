import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { toPng } from 'html-to-image';
import { getScreamRank } from '../lib/ranks';

// Layer 3 - Emoji stickers with physics
const EMOJI_STICKERS = {
  animals: ['🐱', '🐶', '🦄', '🐬', '🦋', '🐸', '🦖'],
  food: ['🍕', '🌮', '🍩', '🍦', '🧁'],
  energy: ['⭐', '✨', '💫', '⚡', '🌈', '💖'],
  random: ['🚀', '🎸', '🎪', '🎨', '🎭'],
  chaos: ['🔥', '💥', '💣']
};

// Layer 4 - Rotating text overlays
const SCREAM_WORDS = ['AAAAHHHH!!', 'LET IT OUT!', 'YOU DID IT!', 'SCREAM!', 'YES!!!', 'FREEDOM!'];

// Color palettes for gradients
const COLOR_PALETTES = [
  ['#ff5edf', '#04c8de'], // hot pink to cyan
  ['#ffd60a', '#b5f8fe'], // gold to purple
  ['#06ffa5', '#ff5edf'], // neon green to hot pink
  ['#04c8de', '#ffd60a'], // cyan to gold
  ['#b5f8fe', '#06ffa5'], // purple to neon green
];

export default function ChaosScreen({ screamCount, onReset }) {
  const [showShare, setShowShare] = useState(false);
  const [globalCount, setGlobalCount] = useState(null);
  const [expandedCounter, setExpandedCounter] = useState(false);
  const [currentWord, setCurrentWord] = useState(0);
  const canvasRef = useRef(null);
  const [palette] = useState(() => COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)]);
  const [allEmojis] = useState(() => {
    const all = [...EMOJI_STICKERS.animals, ...EMOJI_STICKERS.food, ...EMOJI_STICKERS.energy, ...EMOJI_STICKERS.random, ...EMOJI_STICKERS.chaos];
    return Array(30).fill(null).map(() => all[Math.floor(Math.random() * all.length)]);
  });
  
  const rank = getScreamRank(screamCount);

  // Cycle through scream words
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % SCREAM_WORDS.length);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // BIGGER confetti explosion
    const duration = 5000;
    const end = Date.now() + duration;

    const interval = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(interval);
        return;
      }

      confetti({
        particleCount: 8,
        angle: 60,
        spread: 70,
        origin: { x: 0 },
        colors: [...palette, '#ffd60a', '#06ffa5', '#ff006e'],
        startVelocity: 45,
        gravity: 0.8,
      });
      confetti({
        particleCount: 8,
        angle: 120,
        spread: 70,
        origin: { x: 1 },
        colors: [...palette, '#ffd60a', '#06ffa5', '#ff006e'],
        startVelocity: 45,
        gravity: 0.8,
      });
    }, 40);

    // Fetch global counter
    setGlobalCount(Math.floor(Math.random() * 10000) + screamCount);

    return () => clearInterval(interval);
  }, [screamCount, palette]);

  // Layer 1 & 2 - Canvas geometric animations
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationId;
    let time = 0;

    const animate = () => {
      time += 0.02;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Layer 1 - Background blobs (slow) - BIGGER
      for (let i = 0; i < 4; i++) {
        const x = canvas.width * (0.2 + i * 0.2) + Math.sin(time + i) * 120;
        const y = canvas.height * 0.5 + Math.cos(time * 0.8 + i) * 100;
        const radius = 200 + Math.sin(time * 0.5 + i) * 80;
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, palette[0] + '50');
        gradient.addColorStop(1, palette[1] + '30');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Layer 2 - Geometric elements (medium speed) - MORE DRAMATIC
      
      // Dancing lines - BIGGER WAVES
      for (let i = 0; i < 6; i++) {
        ctx.strokeStyle = palette[i % 2] + '80';
        ctx.lineWidth = 5;
        ctx.beginPath();
        const startX = (canvas.width / 6) * i;
        for (let x = 0; x < canvas.width / 6; x += 15) {
          const y = canvas.height * 0.3 + Math.sin(x * 0.04 + time * 3 + i) * 80;
          ctx.lineTo(startX + x, y);
        }
        ctx.stroke();
      }

      // Rotating triangles - BIGGER
      for (let i = 0; i < 5; i++) {
        const x = canvas.width * (0.15 + i * 0.17);
        const y = canvas.height * 0.7 + Math.sin(time + i) * 60;
        const size = 60;
        const rotation = time * 3 + i;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.strokeStyle = palette[i % 2] + 'CC';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.lineTo(size, size);
        ctx.lineTo(-size, size);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }

      // Diagonal slashes - MORE VISIBLE
      for (let i = 0; i < 8; i++) {
        const opacity = Math.abs(Math.sin(time * 4 + i)) * 0.8;
        ctx.strokeStyle = palette[i % 2] + Math.floor(opacity * 255).toString(16).padStart(2, '0');
        ctx.lineWidth = 8;
        ctx.beginPath();
        const x = (canvas.width / 8) * i;
        ctx.moveTo(x, 0);
        ctx.lineTo(x + 150, canvas.height);
        ctx.stroke();
      }

      // Starbursts - BIGGER
      for (let i = 0; i < 4; i++) {
        const x = canvas.width * (0.25 + i * 0.2);
        const y = canvas.height * 0.4 + Math.cos(time * 2 + i) * 80;
        const scale = 1.5 + Math.sin(time * 5 + i) * 0.5;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        ctx.strokeStyle = palette[i % 2] + '90';
        ctx.lineWidth = 3;
        
        for (let j = 0; j < 12; j++) {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          const angle = (Math.PI * 2 * j) / 12;
          ctx.lineTo(Math.cos(angle) * 50, Math.sin(angle) * 50);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Circles expanding - NEW
      for (let i = 0; i < 3; i++) {
        const x = canvas.width * (0.3 + i * 0.2);
        const y = canvas.height * 0.6;
        const radius = 30 + Math.abs(Math.sin(time * 2 + i)) * 100;
        const opacity = 1 - (Math.abs(Math.sin(time * 2 + i)));
        
        ctx.strokeStyle = palette[i % 2] + Math.floor(opacity * 255).toString(16).padStart(2, '0');
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [palette]);

  const handleShare = async () => {
    setShowShare(true);
    setTimeout(async () => {
      const element = document.getElementById('chaos-screen');
      try {
        const dataUrl = await toPng(element);
        const link = document.createElement('a');
        link.download = 'my-scream.png';
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Failed to capture image:', err);
      }
      setShowShare(false);
    }, 100);
  };

  return (
    <div 
      id="chaos-screen"
      className="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden relative"
      style={{
        background: `linear-gradient(135deg, ${palette[0]}, ${palette[1]}, ${palette[0]})`
      }}
    >
      {/* Small counter at top right - click to expand */}
      <motion.div
        className="absolute top-5 right-5 z-50 cursor-pointer"
        onClick={() => setExpandedCounter(!expandedCounter)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {!expandedCounter ? (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold"
            >
              You've screamed {screamCount} time{screamCount !== 1 ? 's' : ''}
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl max-w-xs"
            >
              <p className="text-lg font-bold text-gray-800 mb-1">
                {rank.title}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                {rank.message}
              </p>
              <p className="text-xs text-gray-500">
                Personal: {screamCount} scream{screamCount !== 1 ? 's' : ''}
              </p>
              {globalCount && (
                <p className="text-xs text-gray-400 mt-1">
                  Global today: {globalCount.toLocaleString()}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Layer 1 & 2 - Canvas geometric shapes */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.8 }}
      />

      {/* Layer 3 - Emoji stickers with physics - BIGGER */}
      {allEmojis.map((emoji, index) => {
        const duration = 4 + Math.random() * 5;
        const delay = Math.random() * 2;
        const startX = Math.random() * 100;
        const endX = Math.random() * 100;
        const startY = Math.random() * 100;
        const endY = Math.random() * 100;
        
        return (
          <motion.div
            key={index}
            className="absolute text-5xl md:text-7xl pointer-events-none"
            style={{ 
              left: `${startX}%`, 
              top: `${startY}%`,
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
            }}
            initial={{ scale: 0, rotate: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1.3, 1],
              rotate: [0, 360, 720],
              x: [(endX - startX) * 15, (endX - startX) * -15],
              y: [(endY - startY) * 15, (endY - startY) * -15],
              opacity: [0, 1, 1, 0.8, 0]
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {emoji}
          </motion.div>
        );
      })}

      {/* Headline at top */}
      <motion.div
        className="absolute top-20 left-1/2 transform -translate-x-1/2 z-40"
        initial={{ scale: 0, y: -50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.8 }}
      >
        <h1 
          className="text-4xl md:text-5xl font-black text-white text-center"
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
        >
          🎉 YOU SCREAMED 🎉
        </h1>
      </motion.div>

      {/* Layer 4 - BIG cycling scream word in center */}
      <motion.div
        key={currentWord}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30"
        initial={{ scale: 0, rotate: -45, opacity: 0 }}
        animate={{ 
          scale: [0, 1.2, 1],
          rotate: 0,
          opacity: 1
        }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 
          className="text-6xl md:text-9xl font-black text-white text-center whitespace-nowrap"
          style={{ 
            textShadow: `4px 4px 0 #ff006e, -4px -4px 0 #06ffa5`,
            letterSpacing: '4px'
          }}
        >
          {SCREAM_WORDS[currentWord]}
        </h2>
      </motion.div>

      {/* Buttons at bottom */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col sm:flex-row gap-3 z-50"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          onClick={onReset}
          className="px-8 py-4 bg-white/95 backdrop-blur-md text-black font-bold text-lg rounded-full shadow-xl"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          Scream Again
        </motion.button>
        <motion.button
          onClick={handleShare}
          className="px-8 py-4 bg-white/95 backdrop-blur-md text-black font-bold text-lg rounded-full shadow-xl"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          Save Image
        </motion.button>
      </motion.div>

      {/* Share overlay */}
      {showShare && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg z-50">
          <p className="text-sm font-medium text-gray-800">Saving your scream...</p>
        </div>
      )}
    </div>
  );
}
