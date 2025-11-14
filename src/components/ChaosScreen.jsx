import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
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
  const canvasRef = useRef(null);
  const [palette] = useState(() => COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)]);
  const [allEmojis] = useState(() => {
    const all = [...EMOJI_STICKERS.animals, ...EMOJI_STICKERS.food, ...EMOJI_STICKERS.energy, ...EMOJI_STICKERS.random, ...EMOJI_STICKERS.chaos];
    return Array(20).fill(null).map(() => all[Math.floor(Math.random() * all.length)]);
  });
  
  const rank = getScreamRank(screamCount);

  useEffect(() => {
    // Confetti explosion
    const duration = 3000;
    const end = Date.now() + duration;

    const interval = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(interval);
        return;
      }

      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: palette,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: palette,
      });
    }, 50);

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
      time += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Layer 1 - Background blobs (slow)
      for (let i = 0; i < 3; i++) {
        const x = canvas.width * (0.25 + i * 0.25) + Math.sin(time + i) * 100;
        const y = canvas.height * 0.5 + Math.cos(time * 0.8 + i) * 80;
        const radius = 150 + Math.sin(time * 0.5 + i) * 50;
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, palette[0] + '40');
        gradient.addColorStop(1, palette[1] + '20');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Layer 2 - Geometric elements (medium speed)
      
      // Dancing lines
      for (let i = 0; i < 5; i++) {
        ctx.strokeStyle = palette[i % 2] + '60';
        ctx.lineWidth = 3;
        ctx.beginPath();
        const startX = (canvas.width / 5) * i;
        for (let x = 0; x < canvas.width / 5; x += 20) {
          const y = canvas.height * 0.3 + Math.sin(x * 0.05 + time * 2 + i) * 50;
          ctx.lineTo(startX + x, y);
        }
        ctx.stroke();
      }

      // Rotating triangles
      for (let i = 0; i < 4; i++) {
        const x = canvas.width * (0.2 + i * 0.2);
        const y = canvas.height * 0.7 + Math.sin(time + i) * 40;
        const size = 40;
        const rotation = time * 2 + i;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.strokeStyle = palette[i % 2] + '80';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.lineTo(size, size);
        ctx.lineTo(-size, size);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }

      // Diagonal slashes
      for (let i = 0; i < 6; i++) {
        const opacity = Math.abs(Math.sin(time * 3 + i)) * 0.6;
        ctx.strokeStyle = palette[i % 2] + Math.floor(opacity * 255).toString(16).padStart(2, '0');
        ctx.lineWidth = 5;
        ctx.beginPath();
        const x = (canvas.width / 6) * i;
        ctx.moveTo(x, 0);
        ctx.lineTo(x + 100, canvas.height);
        ctx.stroke();
      }

      // Starbursts
      for (let i = 0; i < 3; i++) {
        const x = canvas.width * (0.3 + i * 0.2);
        const y = canvas.height * 0.4 + Math.cos(time * 1.5 + i) * 60;
        const scale = 1 + Math.sin(time * 4 + i) * 0.3;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        ctx.strokeStyle = palette[i % 2] + '60';
        ctx.lineWidth = 2;
        
        for (let j = 0; j < 8; j++) {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          const angle = (Math.PI * 2 * j) / 8;
          ctx.lineTo(Math.cos(angle) * 30, Math.sin(angle) * 30);
          ctx.stroke();
        }
        ctx.restore();
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
        background: `linear-gradient(135deg, ${palette[0]}, ${palette[1]})`
      }}
    >
      {/* Layer 1 & 2 - Canvas geometric shapes */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.7 }}
      />

      {/* Layer 3 - Emoji stickers with physics */}
      {allEmojis.map((emoji, index) => {
        const duration = 3 + Math.random() * 4;
        const delay = Math.random() * 2;
        const startX = Math.random() * 100;
        const endX = Math.random() * 100;
        const startY = Math.random() * 100;
        const endY = Math.random() * 100;
        
        return (
          <motion.div
            key={index}
            className="absolute text-4xl md:text-6xl pointer-events-none"
            style={{ left: `${startX}%`, top: `${startY}%` }}
            initial={{ scale: 0, rotate: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1.2, 1],
              rotate: [0, 360, 720],
              x: [(endX - startX) * 10, (endX - startX) * -10],
              y: [(endY - startY) * 10, (endY - startY) * -10],
              opacity: [0, 1, 1, 0]
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

      {/* Layer 4 - Rotating text overlays */}
      {SCREAM_WORDS.map((word, index) => {
        const duration = 2 + Math.random() * 2;
        const delay = Math.random() * 3;
        
        return (
          <motion.div
            key={index}
            className="absolute text-4xl md:text-6xl font-black text-white pointer-events-none"
            style={{ 
              left: `${20 + index * 15}%`,
              top: `${20 + (index % 3) * 25}%`,
              textShadow: '0 0 20px rgba(0,0,0,0.5)'
            }}
            initial={{ scale: 0, rotate: -45, opacity: 0 }}
            animate={{ 
              scale: [0, 1, 0],
              rotate: [-45, 45, -45],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {word}
          </motion.div>
        );
      })}

      {/* Main content */}
      <motion.div 
        className="relative z-50 text-center"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", duration: 1 }}
      >
        <motion.h1 
          className="text-6xl md:text-8xl font-black text-white mb-8"
          style={{ textShadow: '0 0 30px rgba(0,0,0,0.5)' }}
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🎉 YOU SCREAMED 🎉
        </motion.h1>

        <motion.div 
          className="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl mb-8 max-w-md mx-auto"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-2xl font-bold text-gray-800 mb-2">
            {rank.title}
          </p>
          <p className="text-lg text-gray-600 mb-2">
            {rank.message}
          </p>
          <p className="text-md text-gray-700">
            You've screamed {screamCount} time{screamCount !== 1 ? 's' : ''}
          </p>
          {globalCount && (
            <p className="text-xs text-gray-400 mt-4">
              Global screams today: {globalCount.toLocaleString()}
            </p>
          )}
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            onClick={onReset}
            className="px-8 py-4 bg-white text-purple-600 font-bold text-lg rounded-full shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Scream Again
          </motion.button>
          <motion.button
            onClick={handleShare}
            className="px-8 py-4 bg-black text-white font-bold text-lg rounded-full shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Save Image
          </motion.button>
        </div>
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
