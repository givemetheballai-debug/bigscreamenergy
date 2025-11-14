import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { toPng } from 'html-to-image';
import { getScreamRank } from '../lib/ranks';

// HEALING FORTUNES
const FORTUNES = [
  "You needed that release",
  "Good things are coming",
  "You're doing better than you think",
  "Take a deep breath - you've got this",
  "The universe heard you",
  "Everything is temporary",
  "You're allowed to feel this way",
  "Release is healing",
  "You're stronger than you know",
  "This too shall pass",
  "Good vibes are flowing to you",
  "Your energy is shifting",
  "Peace is on its way",
  "You're exactly where you need to be",
  "Let it all go",
  "Tomorrow is a new day",
  "You're not alone in this",
  "It's okay to not be okay",
  "This feeling won't last forever",
  "You're making progress"
];

// SCREAM TYPES WITH EXPLANATIONS - matched to emotional states
const SCREAM_TYPES = {
  AGGRESSIVE: [
    { name: "VOLCANIC RELEASE", description: "When the pressure finally bursts and you need everyone to FEEL it" },
    { name: "THUNDER STORM", description: "Raw power breaking through the silence" },
    { name: "PRIMAL ROAR", description: "The ancient scream that demands to be heard" },
    { name: "FIRE SURGE", description: "Burning through everything that held you back" },
    { name: "ELECTRIC RAGE", description: "Pure voltage coursing through your voice" },
    { name: "SONIC BOOM", description: "Breaking the sound barrier of your patience" },
    { name: "CHAOS UNLEASHED", description: "When order is overrated and you embrace the mess" },
    { name: "WILD FURY", description: "Untamed energy that refuses to be contained" },
    { name: "BLAZING TRUTH", description: "Finally saying what needed to be said" },
    { name: "STORM CRASH", description: "The moment everything collides at once" }
  ],
  SOOTHING: [
    { name: "MIDNIGHT WHISPER", description: "The quiet scream only you can hear" },
    { name: "OCEAN WAVE", description: "Gentle release that washes everything away" },
    { name: "COSMIC SIGH", description: "Exhaling stardust into the universe" },
    { name: "SILK RELEASE", description: "Soft but powerful, like wind through trees" },
    { name: "GENTLE EXHALE", description: "Letting go without the drama" },
    { name: "VELVET ECHO", description: "Smooth and soothing, but still heard" },
    { name: "MOONLIT BREATH", description: "Quiet reflection meets vocal release" },
    { name: "CLOUD DRIFT", description: "Floating away from what weighed you down" },
    { name: "SERENE FLOW", description: "Calm on the surface, deep underneath" },
    { name: "PEACEFUL STORM", description: "Finding calm in the chaos" }
  ],
  PLAYFUL: [
    { name: "RAINBOW EXPLOSION", description: "Pure joy bursting in technicolor" },
    { name: "SPARKLE BURST", description: "Glitter cannon aimed at the void" },
    { name: "COSMIC GIGGLE", description: "The universe laughs with you" },
    { name: "NEON DREAM", description: "Electric fun that lights up the night" },
    { name: "STARBURST CHEER", description: "Celebrating with the entire galaxy" },
    { name: "FIZZY POP", description: "Bubbly energy that won't stay contained" },
    { name: "DISCO BALL SCREAM", description: "Turning your release into a party" },
    { name: "CONFETTI CANNON", description: "Making celebration out of chaos" },
    { name: "GLITTER BOMB", description: "Messy, shiny, and absolutely worth it" },
    { name: "PARTY MODE", description: "Who said screaming can't be fun?" }
  ],
  MYSTERIOUS: [
    { name: "SHADOW ECHO", description: "Something dark but not dangerous" },
    { name: "TWILIGHT CALL", description: "Between day and night, light and dark" },
    { name: "VOID WHISPER", description: "Screaming into darkness and it whispers back" },
    { name: "MYSTIC PULSE", description: "Energy that feels ancient and new" },
    { name: "COSMIC MYSTERY", description: "The universe has secrets, so do you" },
    { name: "ECLIPSE MOMENT", description: "When light and dark align perfectly" },
    { name: "NEBULA BREATH", description: "Creating something from cosmic dust" },
    { name: "ASTRAL RELEASE", description: "Letting go on a different plane" },
    { name: "ETHEREAL SCREAM", description: "Not quite here, not quite there" },
    { name: "PHANTOM ECHO", description: "The scream that lingers in memory" }
  ],
  INTENSE: [
    { name: "SUPERNOVA BURST", description: "Exploding with the force of a dying star" },
    { name: "TIDAL WAVE", description: "Massive, unstoppable, transformative" },
    { name: "EARTHQUAKE ROAR", description: "Shaking the foundation of everything" },
    { name: "LIGHTNING STRIKE", description: "Bright, fast, impossible to ignore" },
    { name: "AVALANCHE", description: "Starting small, becoming unstoppable" },
    { name: "METEOR CRASH", description: "Impact that leaves a crater" },
    { name: "HURRICANE FORCE", description: "Category 5 emotional release" },
    { name: "VOLCANIC ERUPTION", description: "Years of pressure exploding at once" },
    { name: "SONIC SHOCKWAVE", description: "Rippling outward with force" },
    { name: "COSMIC COLLISION", description: "When worlds crash together" }
  ],
  REFLECTIVE: [
    { name: "DEEP SIGH", description: "Finally letting go of what you carried" },
    { name: "SOUL RELEASE", description: "Getting to the core of what matters" },
    { name: "TRUTH MOMENT", description: "Honest with yourself, finally" },
    { name: "HEART ECHO", description: "What your heart has been trying to say" },
    { name: "INNER VOICE", description: "The part of you that needed to speak" },
    { name: "WISDOM SCREAM", description: "Understanding wrapped in sound" },
    { name: "CLARITY CALL", description: "Finding answers in the release" },
    { name: "MINDFUL ROAR", description: "Present and powerful at once" },
    { name: "SACRED EXHALE", description: "Spiritual release, no rules required" },
    { name: "TRANSFORMATION", description: "Becoming different through letting go" }
  ]
};

// Flatten for easy random selection
const ALL_SCREAM_TYPES = [
  ...SCREAM_TYPES.AGGRESSIVE,
  ...SCREAM_TYPES.SOOTHING,
  ...SCREAM_TYPES.PLAYFUL,
  ...SCREAM_TYPES.MYSTERIOUS,
  ...SCREAM_TYPES.INTENSE,
  ...SCREAM_TYPES.REFLECTIVE
];

// EMOJI STICKERS
const EMOJI_STICKERS = {
  animals: ['🐱', '🐶', '🦄', '🐬', '🦋', '🐸', '🦖'],
  food: ['🍕', '🌮', '🍩', '🍦', '🧁'],
  energy: ['⭐', '✨', '💫', '🌈', '💖'],
  magic: ['✨', '💫', '⭐', '🌟'],
  random: ['🚀', '🎸', '🎨', '🎭'],
  chaos: ['🔥', '💥', '💣', '🧨', '😤', '🤯', '🫠', '🌀', '💀']
};

// SCREAM WORDS - shuffled array
const BASE_WORDS = [
  'LET IT OUT!', 'YOU DID IT!', 'SCREAM!', 'YES!!!', 
  'FREEDOM!', 'FINALLY!!', 'WOOOOO!!', 'CHAOS!!!', 'BOOM!!!',
  'EXPLODE!!', 'WILD!!!', 'FIERCE!!', 'RAGE!!!', 'UNLEASH!!',
  'ROAR!!!', 'POWER!!!', 'INTENSITY!!', 'AAAAHHHH!!'
];

// SMALL PHRASES
const SMALL_PHRASES = [
  'BANG!', 'POW!', 'ZOOM!', 'WHOA!', 'YAY!', 'WOW!', 'ZAP!', 'BOOM!',
  'YES!', 'GO!', 'NOW!', 'FREE!', 'FLY!', 'WILD!', 'LOUD!', 'FIERCE!',
  'BOLD!', 'HUGE!', 'EPIC!', 'RAW!', 'REAL!', 'FIRE!', 'BLAZE!', 'SURGE!',
  'RAGE!', 'ROAR!', 'CRASH!', 'SMASH!', 'BLAST!', 'RUSH!', 'SPARK!', 'FLASH!'
];

// COLOR PALETTES - expanded with more variety
const COLOR_PALETTES = {
  HOT: [
    { bg: ['#1a0000', '#330000'], colors: ['#ff4500', '#ff0000', '#ffff00', '#ff6600', '#ff1493'] },
    { bg: ['#2d0a0a', '#1a0000'], colors: ['#ff69b4', '#ff1493', '#ff00ff', '#ff4500', '#ffd700'] },
    { bg: ['#330000', '#1a0a00'], colors: ['#ff6347', '#ff4500', '#ffa500', '#ff8c00', '#ff0000'] }
  ],
  COOL: [
    { bg: ['#000033', '#001a4d'], colors: ['#00ffff', '#4169e1', '#00bfff', '#1e90ff', '#87ceeb'] },
    { bg: ['#0a1f0a', '#001a00'], colors: ['#00ff00', '#39ff14', '#00fa9a', '#00ffff', '#76ff03'] },
    { bg: ['#0d1b2a', '#000510'], colors: ['#9370db', '#ba55d3', '#da70d6', '#ee82ee', '#dda0dd'] }
  ],
  NEON: [
    { bg: ['#0a0015', '#1a0033'], colors: ['#00ffff', '#ff00ff', '#39ff14', '#ffff00', '#ff1493'] },
    { bg: ['#000000', '#1a1a2e'], colors: ['#00d4ff', '#ff00ff', '#ffff00', '#00ff00', '#ff006e'] },
    { bg: ['#0d0d0d', '#1a1a1a'], colors: ['#39ff14', '#ff00bf', '#00ffff', '#ff6600', '#bf00ff'] }
  ],
  PASTEL: [
    { bg: ['#ffd60a', '#ffb703'], colors: ['#ffcbf2', '#f72585', '#b5179e', '#7209b7', '#560bad'] },
    { bg: ['#06ffa5', '#00d4ff'], colors: ['#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff'] },
    { bg: ['#ff6b9d', '#ffc6ff'], colors: ['#c7ceea', '#ffc8dd', '#ffafcc', '#bde0fe', '#a2d2ff'] }
  ],
  DEEP: [
    { bg: ['#1a0033', '#0d001a'], colors: ['#bf00ff', '#ff00bf', '#00ffff', '#8a2be2', '#9400d3'] },
    { bg: ['#001a33', '#000d1a'], colors: ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f7b731'] },
    { bg: ['#1a1a2e', '#16213e'], colors: ['#0abde3', '#ee5a6f', '#f368e0', '#00d2d3', '#feca57'] }
  ]
};

// Flatten all palettes
const ALL_PALETTES = [
  ...COLOR_PALETTES.HOT,
  ...COLOR_PALETTES.COOL,
  ...COLOR_PALETTES.NEON,
  ...COLOR_PALETTES.PASTEL,
  ...COLOR_PALETTES.DEEP
];

// GEOMETRIC SHAPE TYPES
const SHAPE_TYPES = {
  BLOBS: 'blobs',
  LINES: 'lines',
  TRIANGLES: 'triangles',
  CIRCLES: 'circles',
  STARBURSTS: 'starbursts',
  SLASHES: 'slashes'
};

// FONT FAMILIES
const FONTS = ['font-sans', 'font-serif', 'font-mono', 'font-black', 'font-bold'];

// DENSITY LEVELS
const DENSITY = {
  MINIMAL: { emojiCount: 15, phraseCount: 8, confettiCount: 40 },
  MEDIUM: { emojiCount: 25, phraseCount: 12, confettiCount: 60 },
  PACKED: { emojiCount: 35, phraseCount: 18, confettiCount: 100 }
};

export default function ChaosScreen({ screamCount, onReset, onNavigate, userText = "" }) {
  const [showShare, setShowShare] = useState(false);
  const [globalCount, setGlobalCount] = useState(null);
  const [expandedCounter, setExpandedCounter] = useState(false);
  const [explosionEmojis, setExplosionEmojis] = useState([]);
  const [showFortune, setShowFortune] = useState(false);
  const [fortuneFloated, setFortuneFloated] = useState(false);
  const canvasRef = useRef(null);
  
  // Select scream personality and visuals ONCE per scream
  const [screamData] = useState(() => {
    // Select scream type
    const screamType = ALL_SCREAM_TYPES[Math.floor(Math.random() * ALL_SCREAM_TYPES.length)];
    
    // Select fortune
    const fortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
    
    // Select palette
    const palette = ALL_PALETTES[Math.floor(Math.random() * ALL_PALETTES.length)];
    
    // Select 3-4 random shape types (not all)
    const shapeKeys = Object.values(SHAPE_TYPES);
    const numShapes = 3 + Math.floor(Math.random() * 2); // 3 or 4
    const selectedShapes = [];
    const availableShapes = [...shapeKeys];
    for (let i = 0; i < numShapes; i++) {
      const index = Math.floor(Math.random() * availableShapes.length);
      selectedShapes.push(availableShapes[index]);
      availableShapes.splice(index, 1);
    }
    
    // Select density
    const densityKeys = Object.keys(DENSITY);
    const densityLevel = DENSITY[densityKeys[Math.floor(Math.random() * densityKeys.length)]];
    
    // Select font
    const font = FONTS[Math.floor(Math.random() * FONTS.length)];
    
    // Shuffle words for this scream
    const shuffledWords = [...BASE_WORDS].sort(() => Math.random() - 0.5);
    const mainWord = shuffledWords[0]; // Use FIRST word from shuffled array
    
    // Random entrance delays for different elements
    const entranceDelays = {
      emojis: Math.random() * 0.3,
      phrases: Math.random() * 0.3,
      screamType: Math.random() * 0.3,
      centerWord: 0  // Instant - no delay
    };
    
    return {
      screamType,
      fortune,
      palette,
      selectedShapes,
      densityLevel,
      font,
      shuffledWords,
      mainWord,
      entranceDelays
    };
  });
  
  const { screamType, fortune, palette, selectedShapes, densityLevel, font, shuffledWords, mainWord, entranceDelays } = screamData;
  
  // Build emoji pool with exclusion zones
  const [allEmojis] = useState(() => {
    const baseStickers = [
      ...EMOJI_STICKERS.animals,
      ...EMOJI_STICKERS.food,
      ...EMOJI_STICKERS.energy,
      ...EMOJI_STICKERS.random,
      ...EMOJI_STICKERS.chaos
    ];
    
    const emojiSizes = [
      'text-3xl sm:text-4xl md:text-6xl',
      'text-4xl sm:text-5xl md:text-7xl',
      'text-5xl sm:text-6xl md:text-8xl'
    ];
    
    return Array(densityLevel.emojiCount).fill(null).map(() => {
      // Keep emojis away from top third where fortune/scream type appear
      const startX = Math.random() * 100;
      const startY = 35 + Math.random() * 65; // Only 35-100% vertical (avoid top 35%)
      
      return {
        emoji: baseStickers[Math.floor(Math.random() * baseStickers.length)],
        size: emojiSizes[Math.floor(Math.random() * emojiSizes.length)],
        color: palette.colors[Math.floor(Math.random() * palette.colors.length)],
        startX,
        startY
      };
    });
  });
  
  const [scatteredPhrases] = useState(() => {
    const sizes = ['text-base sm:text-lg md:text-2xl', 'text-lg sm:text-xl md:text-3xl', 'text-xl sm:text-2xl md:text-4xl'];
    return Array(densityLevel.phraseCount).fill(null).map(() => ({
      text: SMALL_PHRASES[Math.floor(Math.random() * SMALL_PHRASES.length)],
      x: Math.random() * 90 + 5,
      y: Math.random() * 80 + 10,
      size: sizes[Math.floor(Math.random() * sizes.length)],
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 3,
      rotation: Math.random() * 360 - 180,
      color: palette.colors[Math.floor(Math.random() * palette.colors.length)]
    }));
  });
  
  const [fallingConfetti] = useState(() => {
    return Array(densityLevel.confettiCount).fill(null).map(() => ({
      left: Math.random() * 100,
      color: palette.colors[Math.floor(Math.random() * palette.colors.length)],
      width: Math.random() * 10 + 3,
      height: Math.random() * 15 + 5,
      duration: Math.random() * 4 + 2,
      delay: Math.random() * 6,
      isCircle: Math.random() > 0.5,
    }));
  });
  
  const [sparkles] = useState(() => {
    return Array(40).fill(null).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 1.5 + Math.random() * 1,
      color: palette.colors[Math.floor(Math.random() * palette.colors.length)]
    }));
  });
  
  const rank = getScreamRank(screamCount);

  // Fortune appears faster and floats around, then settles
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFortune(true);
      setTimeout(() => {
        setFortuneFloated(true);
      }, 2000); // Reduced from 3000
    }, 800); // Reduced from 2000
    return () => clearTimeout(timer);
  }, []);

  // Confetti
  useEffect(() => {
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
        colors: palette.colors,
        startVelocity: 45,
        gravity: 0.8,
      });
      confetti({
        particleCount: 8,
        angle: 120,
        spread: 70,
        origin: { x: 1 },
        colors: palette.colors,
        startVelocity: 45,
        gravity: 0.8,
      });
    }, 40);

    return () => clearInterval(interval);
  }, [palette.colors]);

  // Canvas geometric animations with color zones
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

      // Determine which shapes to draw based on selectedShapes
      if (selectedShapes.includes(SHAPE_TYPES.BLOBS)) {
        // Background blobs with zone colors
        for (let i = 0; i < 4; i++) {
          const x = canvas.width * (0.2 + i * 0.2) + Math.sin(time + i) * 120;
          const y = canvas.height * 0.5 + Math.cos(time * 0.8 + i) * 100;
          const radius = 200 + Math.sin(time * 0.5 + i) * 80;
          
          // Pick color based on vertical zone
          const zoneColor = y < canvas.height / 3 ? palette.colors[0] :
                           y < 2 * canvas.height / 3 ? palette.colors[2] :
                           palette.colors[4] || palette.colors[1];
          
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
          gradient.addColorStop(0, zoneColor + '50');
          gradient.addColorStop(1, zoneColor + '30');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (selectedShapes.includes(SHAPE_TYPES.LINES)) {
        // Dancing lines
        for (let i = 0; i < 6; i++) {
          ctx.strokeStyle = palette.colors[i % palette.colors.length] + 'CC';
          ctx.lineWidth = 5;
          ctx.beginPath();
          const startX = (canvas.width / 6) * i;
          for (let x = 0; x < canvas.width / 6; x += 15) {
            const y = canvas.height * 0.3 + Math.sin(x * 0.04 + time * 3 + i) * 80;
            ctx.lineTo(startX + x, y);
          }
          ctx.stroke();
        }
      }

      if (selectedShapes.includes(SHAPE_TYPES.TRIANGLES)) {
        // Rotating triangles
        for (let i = 0; i < 5; i++) {
          const x = canvas.width * (0.15 + i * 0.17);
          const y = canvas.height * 0.7 + Math.sin(time + i) * 60;
          const size = 60;
          const rotation = time * 3 + i;
          
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(rotation);
          ctx.strokeStyle = palette.colors[(i * 2) % palette.colors.length] + 'DD';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(0, -size);
          ctx.lineTo(size, size);
          ctx.lineTo(-size, size);
          ctx.closePath();
          ctx.stroke();
          ctx.restore();
        }
      }

      if (selectedShapes.includes(SHAPE_TYPES.SLASHES)) {
        // Diagonal slashes
        for (let i = 0; i < 8; i++) {
          const opacity = Math.abs(Math.sin(time * 4 + i)) * 0.9;
          ctx.strokeStyle = palette.colors[i % palette.colors.length] + Math.floor(opacity * 255).toString(16).padStart(2, '0');
          ctx.lineWidth = 8;
          ctx.beginPath();
          const x = (canvas.width / 8) * i;
          ctx.moveTo(x, 0);
          ctx.lineTo(x + 150, canvas.height);
          ctx.stroke();
        }
      }

      if (selectedShapes.includes(SHAPE_TYPES.STARBURSTS)) {
        // Starbursts
        for (let i = 0; i < 4; i++) {
          const x = canvas.width * (0.25 + i * 0.2);
          const y = canvas.height * 0.4 + Math.cos(time * 2 + i) * 80;
          const scale = 1.5 + Math.sin(time * 5 + i) * 0.5;
          
          ctx.save();
          ctx.translate(x, y);
          ctx.scale(scale, scale);
          ctx.strokeStyle = palette.colors[(i * 3) % palette.colors.length] + 'AA';
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
      }

      if (selectedShapes.includes(SHAPE_TYPES.CIRCLES)) {
        // Expanding circles
        for (let i = 0; i < 3; i++) {
          const x = canvas.width * (0.3 + i * 0.2);
          const y = canvas.height * 0.6;
          const radius = 30 + Math.abs(Math.sin(time * 2 + i)) * 100;
          const opacity = 1 - (Math.abs(Math.sin(time * 2 + i)));
          
          ctx.strokeStyle = palette.colors[(i + 1) % palette.colors.length] + Math.floor(opacity * 255).toString(16).padStart(2, '0');
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [palette.colors, selectedShapes]);

  // Fetch global count
  useEffect(() => {
    fetch('/api/count')
      .then(res => res.json())
      .then(data => setGlobalCount(data.count))
      .catch(err => console.error('Failed to fetch count:', err));
  }, []);

  const handleEmojiClick = (x, y, emoji) => {
    const newExplosions = Array(8).fill(null).map((_, i) => ({
      id: Date.now() + i,
      emoji,
      startX: x,
      startY: y,
      angle: (Math.PI * 2 * i) / 8,
      distance: 150 + Math.random() * 100
    }));
    setExplosionEmojis(prev => [...prev, ...newExplosions]);
    setTimeout(() => {
      setExplosionEmojis(prev => 
        prev.filter(e => !newExplosions.some(ne => ne.id === e.id))
      );
    }, 1000);
  };

  const handleShare = async () => {
    setShowShare(true);
    try {
      const element = document.getElementById('chaos-screen');
      const dataUrl = await toPng(element, { 
        quality: 1,
        pixelRatio: 2,
        backgroundColor: palette.bg[0]
      });
      const link = document.createElement('a');
      link.download = `scream-${screamCount}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to save image:', err);
    }
    setTimeout(() => setShowShare(false), 2000);
  };

  const handleShareLink = () => {
    const url = window.location.origin;
    navigator.clipboard.writeText(url);
    alert('Link copied! Share Big Scream Energy 🔗');
  };

  return (
    <>
    <div 
      id="chaos-screen"
      className="relative w-full h-screen overflow-hidden cursor-pointer"
      style={{
        background: `linear-gradient(135deg, ${palette.bg[0]} 0%, ${palette.bg[1]} 100%)`
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: palette.colors
          });
        }
      }}
    >
      {/* Canvas layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 5 }}
      />
      
      {/* Falling confetti pieces */}
      {fallingConfetti.map((piece, index) => (
        <motion.div
          key={`confetti-${index}`}
          className="absolute pointer-events-none"
          style={{
            left: `${piece.left}%`,
            top: '-20px',
            width: `${piece.width}px`,
            height: `${piece.height}px`,
            backgroundColor: piece.color,
            borderRadius: piece.isCircle ? '50%' : '2px',
            zIndex: 10
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, Math.random() * 100 - 50],
            rotate: [0, Math.random() * 720 - 360]
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      ))}
      
      {/* Sparkles */}
      {sparkles.map((sparkle, index) => (
        <motion.div
          key={`sparkle-${index}`}
          className="absolute pointer-events-none text-2xl"
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            color: sparkle.color,
            zIndex: 15
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: sparkle.duration,
            delay: sparkle.delay,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          ✨
        </motion.div>
      ))}

      {/* Counter */}
      <motion.div
        className="absolute top-4 sm:top-6 right-4 sm:right-6 z-40"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.3 }}
      >
        <motion.button
          onClick={() => setExpandedCounter(!expandedCounter)}
          className="bg-white/20 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-full border-2 border-white/30 hover:bg-white/30 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex flex-col items-start">
              <span className="text-white/70 text-[10px] sm:text-xs font-medium">YOUR SCREAMS</span>
              <span className="text-white text-lg sm:text-2xl font-black">{screamCount}</span>
            </div>
            <div className="w-px h-8 sm:h-10 bg-white/30" />
            <div className="flex flex-col items-start">
              <span className="text-white/70 text-[10px] sm:text-xs font-medium">{rank.title.toUpperCase()}</span>
              <span className="text-white text-sm sm:text-base font-bold">{rank.emoji}</span>
            </div>
          </div>
        </motion.button>
        
        <AnimatePresence>
          {expandedCounter && globalCount && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 bg-white/20 backdrop-blur-md px-4 sm:px-6 py-3 rounded-2xl border-2 border-white/30"
            >
              <div className="text-center">
                <div className="text-white/70 text-[10px] sm:text-xs font-medium mb-1">GLOBAL SCREAMS</div>
                <div className="text-white text-2xl sm:text-4xl font-black">{globalCount.toLocaleString()}</div>
                <div className="text-white/60 text-[10px] sm:text-xs mt-1">Join the wave 🌊</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Emojis with mood ring colors - SMOOTH motion, avoiding top area */}
      {allEmojis.map((emojiObj, index) => {
        const duration = 4 + Math.random() * 4; // 4-8 seconds for smooth motion
        const delay = entranceDelays.emojis + (Math.random() * 0.5);
        
        // Use pre-calculated safe positions (avoiding top 35%)
        const startX = emojiObj.startX;
        const startY = emojiObj.startY;
        
        // Smooth continuous motion - constrained drift to stay in safe zone
        const endX = startX + (Math.random() * 30 - 15); // Drift ±15% from start
        const endY = Math.max(35, Math.min(100, startY + (Math.random() * 30 - 15))); // Stay below 35%
        
        return (
          <motion.div
            key={index}
            className={`absolute ${emojiObj.size} ${font} cursor-pointer`}
            style={{ 
              left: `${startX}%`, 
              top: `${startY}%`,
              filter: `drop-shadow(0 4px 12px ${emojiObj.color})`,
              zIndex: 25
            }}
            onClick={(e) => {
              e.stopPropagation();
              const rect = e.currentTarget.getBoundingClientRect();
              handleEmojiClick(rect.left + rect.width / 2, rect.top + rect.height / 2, emojiObj.emoji);
            }}
            initial={{ scale: 0, rotate: 0, opacity: 0 }}
            animate={{ 
              scale: 1,
              rotate: 360,
              x: [0, endX - startX, startX - endX, 0],
              y: [0, endY - startY, startY - endY, 0],
              opacity: 1
            }}
            transition={{
              scale: { duration: 0.5, delay },
              opacity: { duration: 0.5, delay },
              rotate: { duration, repeat: Infinity, ease: "linear" },
              x: { duration, repeat: Infinity, ease: "easeInOut" },
              y: { duration, repeat: Infinity, ease: "easeInOut" }
            }}
            whileHover={{ scale: 1.5 }}
          >
            {emojiObj.emoji}
          </motion.div>
        );
      })}

      {/* Scattered phrases with zone colors */}
      {scatteredPhrases.map((phrase, index) => (
        <motion.div
          key={`phrase-${index}`}
          className={`absolute ${phrase.size} ${font} text-white pointer-events-none`}
          style={{ 
            left: `${phrase.x}%`, 
            top: `${phrase.y}%`,
            textShadow: `2px 2px 8px ${phrase.color}`,
            color: phrase.color,
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
            delay: entranceDelays.phrases + phrase.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {phrase.text}
        </motion.div>
      ))}

      {/* Scream type with intro text (stays on screen for screenshot) */}
      {fortuneFloated && (
        <motion.div
          className="absolute top-16 sm:top-20 left-0 right-0 z-40 px-4"
          initial={{ scale: 0, y: -20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", delay: entranceDelays.screamType }}
        >
          <div className="text-center max-w-2xl mx-auto">
            <p 
              className={`text-xs sm:text-sm ${font} text-white/70 mb-1 uppercase tracking-wider`}
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
            >
              Your Big Scream Energy is...
            </p>
            <h1 
              className={`text-2xl sm:text-3xl md:text-4xl ${font} font-black text-white mb-2`}
              style={{ 
                textShadow: `2px 2px 8px ${palette.colors[0]}`,
                color: palette.colors[1]
              }}
            >
              {screamType.name}
            </h1>
            <p 
              className={`text-sm sm:text-base ${font} text-white/90`}
              style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.5)' }}
            >
              {screamType.description}
            </p>
          </div>
        </motion.div>
      )}
      
      {/* Floating fortune (bounces around then KEEPS drifting) - SPECIAL */}
      <AnimatePresence>
        {showFortune && (
          <motion.div
            className={`absolute ${fortuneFloated ? 'top-44 sm:top-52 left-1/2 -translate-x-1/2' : 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'} z-60 px-8 py-4 rounded-2xl border-2`}
            style={fortuneFloated ? {
              background: `linear-gradient(135deg, ${palette.colors[0]}F0, ${palette.colors[1]}F0)`,
              borderColor: palette.colors[2],
              backdropFilter: 'blur(20px)',
              boxShadow: `0 0 30px ${palette.colors[0]}80, 0 0 60px ${palette.colors[1]}60, inset 0 0 20px ${palette.colors[2]}40`
            } : {
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={fortuneFloated ? { 
              scale: [1, 1.02, 1],
              opacity: 1,
              x: ['-50%', 'calc(-50% + 15px)', 'calc(-50% - 15px)', 'calc(-50% + 10px)', 'calc(-50% - 10px)', '-50%'],
              y: [0, -8, 8, -5, 5, 0]
            } : { 
              scale: 1, 
              opacity: 1,
              x: [0, 60, -60, 40, -40, 20, -20, 0],
              y: [0, -40, 40, -30, 30, -20, 20, 0]
            }}
            transition={fortuneFloated ? { 
              scale: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              },
              x: {
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              },
              y: {
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              },
              opacity: { duration: 0.5 }
            } : { 
              duration: 6,
              ease: "easeInOut",
              repeat: 0
            }}
          >
            <motion.p 
              className={`text-sm sm:text-base ${font} text-center max-w-xs`}
              style={{ 
                color: fortuneFloated ? '#ffffff' : '#1f2937',
                textShadow: fortuneFloated ? `0 0 10px ${palette.colors[0]}, 0 0 20px ${palette.colors[1]}` : 'none',
                fontWeight: '700'
              }}
              animate={fortuneFloated ? {
                textShadow: [
                  `0 0 10px ${palette.colors[0]}, 0 0 20px ${palette.colors[1]}`,
                  `0 0 15px ${palette.colors[1]}, 0 0 30px ${palette.colors[2] || palette.colors[0]}`,
                  `0 0 10px ${palette.colors[0]}, 0 0 20px ${palette.colors[1]}`
                ]
              } : {}}
              transition={fortuneFloated ? {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              } : {}}
            >
              ✨ {fortune} ✨
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* Center word - ONE word that drifts around, appears INSTANTLY */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
        <motion.div
          className="px-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: [0.8, 1.2, 1, 1.1, 1],
            rotate: [0, 5, -5, 3, 0],
            x: [0, 30, -30, 20, -20, 0],
            y: [0, -20, 20, -15, 15, 0],
            opacity: 1
          }}
          transition={{ 
            scale: { duration: 0.3 },  // Fast scale-in
            opacity: { duration: 0.2 }, // Fast fade-in
            rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" },
            x: { duration: 8, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 8, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <h2 
            className={`text-6xl sm:text-7xl md:text-9xl ${font} font-black text-white text-center break-words`}
            style={{ 
              textShadow: `4px 4px 0 ${palette.colors[0]}, -4px -4px 0 ${palette.colors[2]}`,
              letterSpacing: '2px',
              lineHeight: '1.1',
              maxWidth: '90vw'
            }}
          >
            {mainWord}
          </h2>
        </motion.div>
      </div>

      {/* Buttons - styled to match palette */}
      <motion.div 
        className="absolute bottom-20 sm:bottom-24 left-0 right-0 flex flex-wrap justify-center gap-2 sm:gap-3 px-4 z-50"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          onClick={onReset}
          className="px-6 sm:px-8 py-3 sm:py-4 backdrop-blur-md text-white font-bold text-base sm:text-lg rounded-full shadow-xl border-2"
          style={{
            background: `linear-gradient(135deg, ${palette.colors[0]}DD, ${palette.colors[1]}DD)`,
            borderColor: `${palette.colors[2]}AA`
          }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          Scream Again
        </motion.button>
        <motion.button
          onClick={handleShare}
          className="px-6 sm:px-8 py-3 sm:py-4 backdrop-blur-md text-white font-bold text-base sm:text-lg rounded-full shadow-xl border-2"
          style={{
            background: `linear-gradient(135deg, ${palette.colors[2] || palette.colors[0]}DD, ${palette.colors[3] || palette.colors[1]}DD)`,
            borderColor: `${palette.colors[0]}AA`
          }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          Save Image
        </motion.button>
        <motion.button
          onClick={handleShareLink}
          className="px-6 sm:px-8 py-3 sm:py-4 backdrop-blur-md text-white font-bold text-base sm:text-lg rounded-full shadow-xl border-2"
          style={{
            background: `linear-gradient(135deg, ${palette.colors[1]}DD, ${palette.colors[2] || palette.colors[0]}DD)`,
            borderColor: `${palette.colors[1]}AA`
          }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          Share 🔗
        </motion.button>
      </motion.div>

      {/* Footer */}
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
