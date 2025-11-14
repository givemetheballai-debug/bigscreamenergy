import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { toPng } from 'html-to-image';
import { getScreamRank } from '../lib/ranks';

// Layer 3 - Emoji stickers with physics - INCLUDING ALL FROM LANDING PAGE
const EMOJI_STICKERS = {
  animals: ['🐱', '🐶', '🦄', '🐬', '🦋', '🐸', '🦖'],
  food: ['🍕', '🌮', '🍩', '🍦', '🧁'],
  energy: ['⭐', '✨', '💫', '🌈', '💖', '💫'], // Added extra 💫 from landing
  random: ['🚀', '🎸', '🎨', '🎭', '🎸'], // Added extra 🎸 from landing
  chaos: ['🔥', '💥', '💣', '🧨', '😤', '🤯', '🫠', '🌀', '💀', '🔥', '💣', '💥', '🧨', '😤', '🤯', '🫠', '🌀', '💀'] // ALL landing page emojis, duplicated for frequency
};

// Layer 4 - Rotating text overlays
const SCREAM_WORDS = ['AAAAHHHH!!', 'LET IT OUT!', 'YOU DID IT!', 'SCREAM!', 'YES!!!', 'FREEDOM!', 'FINALLY!!', 'WOOOOO!!', 'CHAOS!!!'];

// Small phrases that scatter around
const SMALL_PHRASES = [
  'BANG!', 'POW!', 'ZOOM!', 'WHOA!', 'YAY!', 'WOW!', 'ZAP!', 'BOOM!',
  'YES!', 'GO!', 'NOW!', 'FREE!', 'FLY!', 'WILD!', 'LOUD!', 'FIERCE!',
  'BOLD!', 'HUGE!', 'EPIC!', 'RAW!', 'REAL!', 'FIRE!', 'BLAZE!', 'SURGE!'
];

// Headlines that rotate
const HEADLINES = [
  '🎉 YOU SCREAMED 🎉',
  '💥 LEGENDARY SCREAM 💥',
  '⚡ CHAOS UNLEASHED ⚡',
  '🔥 YOU DID IT 🔥',
  '✨ SCREAM COMPLETE ✨',
  '🌟 AMAZING SCREAM 🌟',
  '💫 PURE CHAOS 💫'
];

// Color palettes for gradients - weighted toward darker
const DARK_PALETTES = [
  ['#1a0033', '#2d1b4e'], // deep purple to darker purple
  ['#0a1128', '#1c2541'], // navy to dark blue
  ['#2b0f3d', '#1a0520'], // dark magenta to almost black
  ['#1f1f1f', '#3d2f5c'], // charcoal to dark purple
  ['#0d1b2a', '#1b263b'], // dark navy
  ['#240046', '#3c096c'], // dark purple spectrum
  ['#10002b', '#240046'], // very dark purple
];

const BRIGHT_PALETTES = [
  ['#ffd60a', '#b5f8fe'], // gold to purple (original happy)
  ['#06ffa5', '#ff5edf'], // neon green to hot pink
  ['#04c8de', '#ffd60a'], // cyan to gold
];

const COLOR_PALETTES = [
  ...DARK_PALETTES,
  ...DARK_PALETTES, // Double the dark palettes for 70/30 split
  ...BRIGHT_PALETTES
];

export default function ChaosScreen({ screamCount, onReset, onNavigate }) {
  const [showShare, setShowShare] = useState(false);
  const [globalCount, setGlobalCount] = useState(null);
  const [expandedCounter, setExpandedCounter] = useState(false);
  const [currentWord, setCurrentWord] = useState(0);
  const [wordPosition, setWordPosition] = useState({ x: 0, y: 0 });
  const [wordSize, setWordSize] = useState('text-7xl'); // Random size per word
  const [explosionEmojis, setExplosionEmojis] = useState([]);
  const canvasRef = useRef(null);
  const [paletteData] = useState(() => {
    const selectedPalette = COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)];
    const isDark = DARK_PALETTES.some(p => p[0] === selectedPalette[0]);
    return { palette: selectedPalette, isDark };
  });
  const palette = paletteData.palette;
  const isDarkPalette = paletteData.isDark;
  const [headline] = useState(() => HEADLINES[Math.floor(Math.random() * HEADLINES.length)]);
  const [scatteredPhrases] = useState(() => {
    const sizes = [
      'text-base sm:text-lg md:text-2xl',
      'text-lg sm:text-xl md:text-3xl',
      'text-xl sm:text-2xl md:text-4xl',
      'text-2xl sm:text-3xl md:text-5xl'
    ];
    return Array(15).fill(null).map(() => ({
      text: SMALL_PHRASES[Math.floor(Math.random() * SMALL_PHRASES.length)],
      x: Math.random() * 90 + 5,
      y: Math.random() * 80 + 10,
      size: sizes[Math.floor(Math.random() * sizes.length)],
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 3,
      rotation: Math.random() * 360 - 180
    }));
  });
  const [allEmojis] = useState(() => {
    // More chaos/bomb emojis for dark backgrounds
    const baseStickers = [...EMOJI_STICKERS.animals, ...EMOJI_STICKERS.food, ...EMOJI_STICKERS.energy, ...EMOJI_STICKERS.random];
    const emojiPool = paletteData.isDark 
      ? [...baseStickers, ...EMOJI_STICKERS.chaos, ...EMOJI_STICKERS.chaos, ...EMOJI_STICKERS.chaos] // Triple chaos for dark
      : [...baseStickers, ...EMOJI_STICKERS.chaos];
    return Array(30).fill(null).map(() => emojiPool[Math.floor(Math.random() * emojiPool.length)]);
  });
  
  const rank = getScreamRank(screamCount);

  // Cycle through scream words with random positions AND sizes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % SCREAM_WORDS.length);
      // Random position offset between -50px and +50px
      setWordPosition({
        x: Math.random() * 100 - 50,
        y: Math.random() * 60 - 30
      });
      // Random size for variety
      const sizes = ['text-5xl sm:text-6xl md:text-8xl', 'text-6xl sm:text-7xl md:text-9xl', 'text-5xl sm:text-8xl md:text-9xl', 'text-6xl sm:text-8xl md:text-10xl'];
      setWordSize(sizes[Math.floor(Math.random() * sizes.length)]);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // BIGGER confetti explosion from canvas-confetti library
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

  // Generate falling confetti pieces
  const [fallingConfetti] = useState(() => {
    const colors = ['#ff006e', '#06ffa5', '#ffd60a', '#04c8de', '#ff5edf', '#b5f8fe', '#fff'];
    return Array(80).fill(null).map(() => ({
      left: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      width: Math.random() * 10 + 3, // 3-13px
      height: Math.random() * 15 + 5, // 5-20px
      duration: Math.random() * 4 + 2, // 2-6s
      delay: Math.random() * 6, // 0-6s delay
      isCircle: Math.random() > 0.5,
    }));
  });

  // Generate sparkles
  const [sparkles] = useState(() => {
    return Array(40).fill(null).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 1.5 + Math.random() * 1,
    }));
  });

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

  const handleEmojiClick = (x, y, clickedEmoji) => {
    // Spawn 5-8 random emojis exploding outward
    const numExplosions = Math.floor(Math.random() * 4) + 5;
    const newExplosions = [];
    
    const allEmojiTypes = [...EMOJI_STICKERS.animals, ...EMOJI_STICKERS.food, ...EMOJI_STICKERS.energy, ...EMOJI_STICKERS.random, ...EMOJI_STICKERS.chaos];
    
    for (let i = 0; i < numExplosions; i++) {
      newExplosions.push({
        id: Date.now() + Math.random(),
        emoji: allEmojiTypes[Math.floor(Math.random() * allEmojiTypes.length)],
        startX: x,
        startY: y,
        angle: (Math.PI * 2 * i) / numExplosions,
        distance: 50 + Math.random() * 100
      });
    }
    
    setExplosionEmojis(prev => [...prev, ...newExplosions]);
    
    // Remove after animation
    setTimeout(() => {
      setExplosionEmojis(prev => prev.filter(e => !newExplosions.find(ne => ne.id === e.id)));
    }, 1000);
  };

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

  const handleShareLink = async () => {
    const shareData = {
      title: 'I screamed into the void!',
      text: `I just screamed ${screamCount} time${screamCount !== 1 ? 's' : ''} at Big Scream Energy! 😤💫`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.log('Share failed:', err);
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes fall {
            to {
              transform: translateY(100vh) rotate(720deg);
              opacity: 0;
            }
          }
          .animate-fall {
            animation: fall linear infinite;
          }
          @keyframes sparkle {
            0%, 100% { 
              opacity: 0; 
              transform: scale(0);
            }
            50% { 
              opacity: 1; 
              transform: scale(1);
            }
          }
          .animate-sparkle {
            animation: sparkle ease-in-out infinite;
          }
          @keyframes gradientFloat {
            0%, 100% { 
              background-position: 0% 50%; 
            }
            50% { 
              background-position: 100% 50%; 
            }
          }
          #chaos-screen {
            cursor: auto !important;
          }
          #chaos-screen button {
            cursor: pointer !important;
          }
        `}
      </style>
      <div 
        id="chaos-screen"
        className="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden relative"
        style={{
          background: `linear-gradient(135deg, ${palette[0]}, ${palette[1]}, ${palette[0]})`,
          backgroundSize: '200% 200%',
          animation: 'gradientFloat 8s ease infinite'
        }}
      >
      {/* Small counter at top right - click to expand */}
      <motion.div
        className="absolute top-3 sm:top-5 right-3 sm:right-5 z-50 cursor-pointer"
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
              className="bg-black/70 backdrop-blur-md text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold"
            >
              You've screamed {screamCount} time{screamCount !== 1 ? 's' : ''}
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-2xl max-w-xs"
            >
              <p className="text-base sm:text-lg font-bold text-gray-800 mb-1">
                {rank.title}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 mb-2">
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

      {/* Falling confetti pieces - CSS animated */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {fallingConfetti.map((piece, index) => (
          <div
            key={`confetti-${index}`}
            className="absolute animate-fall"
            style={{
              left: `${piece.left}%`,
              top: '-20px',
              width: `${piece.width}px`,
              height: `${piece.height}px`,
              background: piece.color,
              animationDuration: `${piece.duration}s`,
              animationDelay: `${piece.delay}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
              borderRadius: piece.isCircle ? '50%' : '0',
            }}
          />
        ))}
      </div>

      {/* Sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {sparkles.map((sparkle, index) => (
          <div
            key={`sparkle-${index}`}
            className="absolute animate-sparkle"
            style={{
              left: `${sparkle.left}%`,
              top: `${sparkle.top}%`,
              width: '4px',
              height: '4px',
              background: '#fff',
              borderRadius: '50%',
              boxShadow: '0 0 10px #fff, 0 0 20px #fff',
              animationDuration: `${sparkle.duration}s`,
              animationDelay: `${sparkle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Layer 3 - Emoji stickers with physics - BIGGER & CLICKABLE */}
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
            className="absolute text-4xl sm:text-5xl md:text-7xl cursor-pointer"
            style={{ 
              left: `${startX}%`, 
              top: `${startY}%`,
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
              zIndex: 25
            }}
            onClick={(e) => {
              e.stopPropagation();
              const rect = e.currentTarget.getBoundingClientRect();
              handleEmojiClick(rect.left + rect.width / 2, rect.top + rect.height / 2, emoji);
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
            whileHover={{ scale: 1.5 }}
          >
            {emoji}
          </motion.div>
        );
      })}

      {/* Headline at top - randomized */}
      <motion.div
        className="absolute top-16 sm:top-20 left-0 right-0 z-40 px-4"
        initial={{ scale: 0, y: -50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.8 }}
      >
        <h1 
          className="text-3xl sm:text-4xl md:text-5xl font-black text-white text-center"
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
        >
          {headline}
        </h1>
      </motion.div>

      {/* Scattered small phrases - random sizes and positions */}
      {scatteredPhrases.map((phrase, index) => (
        <motion.div
          key={`phrase-${index}`}
          className={`absolute ${phrase.size} font-black text-white pointer-events-none`}
          style={{ 
            left: `${phrase.x}%`, 
            top: `${phrase.y}%`,
            textShadow: '2px 2px 4px rgba(0,0,0,0.4)',
            zIndex: 20
          }}
          initial={{ scale: 0, rotate: phrase.rotation, opacity: 0 }}
          animate={{ 
            scale: [0, 1.2, 1],
            rotate: [phrase.rotation, phrase.rotation + 360],
            opacity: [0, 1, 1, 0.7]
          }}
          transition={{
            duration: phrase.duration,
            delay: phrase.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {phrase.text}
        </motion.div>
      ))}

      {/* Explosion emojis from clicks */}
      {explosionEmojis.map((explosion) => (
        <motion.div
          key={explosion.id}
          className="absolute text-3xl md:text-5xl pointer-events-none"
          style={{
            left: explosion.startX,
            top: explosion.startY,
            zIndex: 50
          }}
          initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
          animate={{ 
            scale: [0, 1.5, 0],
            x: Math.cos(explosion.angle) * explosion.distance,
            y: Math.sin(explosion.angle) * explosion.distance,
            opacity: [1, 1, 0],
            rotate: [0, 360]
          }}
          transition={{
            duration: 1,
            ease: "easeOut"
          }}
        >
          {explosion.emoji}
        </motion.div>
      ))}

      {/* Layer 4 - BIG cycling scream word in center */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
        <motion.div
          key={currentWord}
          className="px-4"
          style={{
            transform: `translate(${wordPosition.x}px, ${wordPosition.y}px)`
          }}
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
            className={`${wordSize} font-black text-white text-center break-words`}
            style={{ 
              textShadow: `4px 4px 0 #ff006e, -4px -4px 0 #06ffa5`,
              letterSpacing: '2px',
              lineHeight: '1.1',
              maxWidth: '90vw'
            }}
          >
            {SCREAM_WORDS[currentWord]}
          </h2>
        </motion.div>
      </div>

      {/* Buttons at bottom - centered */}
      <motion.div 
        className="absolute bottom-20 sm:bottom-24 left-0 right-0 flex flex-wrap justify-center gap-2 sm:gap-3 px-4 z-50"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          onClick={onReset}
          className="px-6 sm:px-8 py-3 sm:py-4 bg-white/95 backdrop-blur-md text-black font-bold text-base sm:text-lg rounded-full shadow-xl"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          Scream Again
        </motion.button>
        <motion.button
          onClick={handleShare}
          className="px-6 sm:px-8 py-3 sm:py-4 bg-white/95 backdrop-blur-md text-black font-bold text-base sm:text-lg rounded-full shadow-xl"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          Save Image
        </motion.button>
        <motion.button
          onClick={handleShareLink}
          className="px-6 sm:px-8 py-3 sm:py-4 bg-white/95 backdrop-blur-md text-black font-bold text-base sm:text-lg rounded-full shadow-xl"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          Share 🔗
        </motion.button>
      </motion.div>

      {/* Footer links */}
      <motion.div
        className="absolute bottom-4 sm:bottom-6 left-0 right-0 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-white/80 font-medium px-4 flex-wrap">
          <button onClick={() => onNavigate('about')} className="hover:text-white transition">About</button>
          <button onClick={() => onNavigate('ranks')} className="hover:text-white transition">Ranks</button>
          <button onClick={() => onNavigate('privacy')} className="hover:text-white transition">Privacy</button>
          <button onClick={() => onNavigate('shop')} className="hover:text-white transition">Shop</button>
          <button onClick={() => onNavigate('team')} className="hover:text-white transition">Team</button>
        </div>
      </motion.div>

      {/* Share overlay */}
      {showShare && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg z-50">
          <p className="text-sm font-medium text-gray-800">Saving your scream...</p>
        </div>
      )}
    </div>
    </>
  );
}
