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
  "Let it all go"
];

// EMOJI STICKERS
const EMOJI_STICKERS = {
  animals: ['🐱', '🐶', '🦄', '🐬', '🦋', '🐸', '🦖'],
  food: ['🍕', '🌮', '🍩', '🍦', '🧁'],
  energy: ['⭐', '✨', '💫', '🌈', '💖'],
  magic: ['✨', '💫', '⭐', '🌟'], // Magic emojis boost fortune chance
  random: ['🚀', '🎸', '🎨', '🎭'],
  chaos: ['🔥', '💥', '💣', '🧨', '😤', '🤯', '🫠', '🌀', '💀']
};

// SCREAM WORDS
const SCREAM_WORDS = [
  'AAAAHHHH!!', 'LET IT OUT!', 'YOU DID IT!', 'SCREAM!', 'YES!!!', 
  'FREEDOM!', 'FINALLY!!', 'WOOOOO!!', 'CHAOS!!!', 'BOOM!!!',
  'EXPLODE!!', 'WILD!!!', 'FIERCE!!', 'RAGE!!!', 'UNLEASH!!',
  'ROAR!!!', 'POWER!!!', 'INTENSITY!!'
];

// SMALL PHRASES
const SMALL_PHRASES = [
  'BANG!', 'POW!', 'ZOOM!', 'WHOA!', 'YAY!', 'WOW!', 'ZAP!', 'BOOM!',
  'YES!', 'GO!', 'NOW!', 'FREE!', 'FLY!', 'WILD!', 'LOUD!', 'FIERCE!',
  'BOLD!', 'HUGE!', 'EPIC!', 'RAW!', 'REAL!', 'FIRE!', 'BLAZE!', 'SURGE!',
  'RAGE!', 'ROAR!', 'CRASH!', 'SMASH!', 'BLAST!', 'RUSH!', 'SPARK!', 'FLASH!'
];

// HEADLINES
const HEADLINES = [
  '🎉 YOU SCREAMED 🎉', '💥 LEGENDARY SCREAM 💥', '⚡ CHAOS UNLEASHED ⚡',
  '🔥 YOU DID IT 🔥', '✨ SCREAM COMPLETE ✨', '🌟 AMAZING SCREAM 🌟',
  '💫 PURE CHAOS 💫', '🎊 SCREAM ACHIEVED 🎊', '💣 BOOM DONE 💣',
  '🧨 EXPLOSIVE 🧨', '😤 LET IT OUT 😤', '🤯 MIND BLOWN 🤯',
  '💀 LEGENDARY 💀', '🌀 CHAOS MODE 🌀', '🎸 ROCKSTAR SCREAM 🎸'
];

// DISTINCT DARK THEMES WITH ACCENT COLORS (90%)
const DARK_THEMES = [
  // Cyberpunk
  { bg: ['#0a0015', '#1a0033'], accents: ['#00ffff', '#ff00ff', '#39ff14'] },
  // Aggressive fire
  { bg: ['#1a0000', '#330000'], accents: ['#ff4500', '#ffff00', '#ff1493'] },
  // Cosmic elegant
  { bg: ['#000033', '#001a4d'], accents: ['#ffd700', '#87ceeb', '#dda0dd'] },
  // Danger zone
  { bg: ['#330000', '#1a0000'], accents: ['#ff0000', '#ffff00', '#ff6600'] },
  // Toxic glow
  { bg: ['#1a1a1a', '#0d0d0d'], accents: ['#39ff14', '#00ff00', '#76ff03'] },
  // Deep ocean
  { bg: ['#001a33', '#000d1a'], accents: ['#00ffff', '#ff6b6b', '#ffd700'] },
  // Miami Vice night
  { bg: ['#0d1b2a', '#000510'], accents: ['#ff006e', '#00ffff', '#8338ec'] },
  // Purple haze
  { bg: ['#1a0033', '#0d001a'], accents: ['#bf00ff', '#ff00bf', '#00ffff'] },
  // Electric storm
  { bg: ['#000000', '#1a1a2e'], accents: ['#00d4ff', '#ff00ff', '#ffff00'] },
  // Neon jungle
  { bg: ['#0a1f0a', '#001a00'], accents: ['#39ff14', '#ff1493', '#00ffff'] }
];

// BRIGHT THEMES (10%)
const BRIGHT_THEMES = [
  { bg: ['#ffd60a', '#ffb703'], accents: ['#ff006e', '#8338ec', '#06ffa5'] },
  { bg: ['#06ffa5', '#00d4ff'], accents: ['#ff5edf', '#ffff00', '#ff1493'] },
  { bg: ['#ff6b9d', '#ffc6ff'], accents: ['#8338ec', '#06ffa5', '#ffd60a'] },
  { bg: ['#ffa500', '#ff8c00'], accents: ['#ff1493', '#00ffff', '#39ff14'] }
];

// ENERGY LEVELS
const ENERGY_LEVELS = {
  CHAOTIC: {
    rotationSpeed: [0, 1080], // 3 full spins
    duration: 2,
    scale: [0, 1.5, 1],
    movementRange: 30
  },
  SOOTHING: {
    rotationSpeed: [0, 180], // gentle turn
    duration: 8,
    scale: [0, 1.1, 1],
    movementRange: 10
  },
  PULSING: {
    rotationSpeed: [0, 360, 0], // pulse rotation
    duration: 4,
    scale: [0.8, 1.3, 0.8],
    movementRange: 15
  },
  FRANTIC: {
    rotationSpeed: [0, -720, 360], // jittery
    duration: 1.5,
    scale: [0, 1.4, 0.9, 1.2, 1],
    movementRange: 40
  }
};

// ANIMATION PATTERNS
const ANIMATION_PATTERNS = {
  EXPLOSION: 'explosion',
  DRIFT: 'drift',
  SPIRAL: 'spiral',
  BOUNCE: 'bounce',
  WAVE: 'wave'
};

// FONT FAMILIES
const FONTS = [
  'font-sans',
  'font-serif',
  'font-mono',
  'font-black',
  'font-bold'
];

// MAGIC EFFECTS
const MAGIC_EFFECTS = {
  FORTUNE: 'fortune',
  SHOOTING_STAR: 'shooting-star',
  GRAVITY_FLIP: 'gravity-flip',
  GLITCH: 'glitch',
  COLOR_EXPLOSION: 'color-explosion',
  WORD_SHATTER: 'word-shatter',
  TIME_SLOWMO: 'time-slowmo',
  SCREEN_SHAKE: 'screen-shake'
};

// Detect user input patterns
const detectInputPatterns = (userText) => {
  const hasAllCaps = userText === userText.toUpperCase() && userText.length > 3;
  const hasExclamation = (userText.match(/!/g) || []).length >= 3;
  const isLowercase = userText === userText.toLowerCase();
  const textLength = userText.length;
  
  // Count emojis
  const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu;
  const userEmojis = userText.match(emojiRegex) || [];
  const magicEmojis = userEmojis.filter(e => ['✨', '💫', '⭐', '🌟'].includes(e));
  
  // Determine energy level based on input
  let energyLevel;
  if (hasAllCaps || hasExclamation) {
    energyLevel = Math.random() > 0.5 ? 'CHAOTIC' : 'FRANTIC';
  } else if (isLowercase) {
    energyLevel = 'SOOTHING';
  } else {
    energyLevel = Math.random() > 0.5 ? 'PULSING' : 'DRIFT';
  }
  
  return { 
    hasAllCaps, 
    hasExclamation, 
    isLowercase, 
    textLength,
    userEmojis,
    magicEmojis,
    energyLevel
  };
};

export default function ChaosScreen({ screamCount, onReset, onNavigate, userText = "" }) {
  const [showShare, setShowShare] = useState(false);
  const [globalCount, setGlobalCount] = useState(null);
  const [expandedCounter, setExpandedCounter] = useState(false);
  const [currentWord, setCurrentWord] = useState(0);
  const [wordPosition, setWordPosition] = useState({ x: 0, y: 0 });
  const [explosionEmojis, setExplosionEmojis] = useState([]);
  const [magicEffects, setMagicEffects] = useState([]);
  const canvasRef = useRef(null);
  
  // Detect input patterns
  const inputPatterns = detectInputPatterns(userText);
  
  // Select theme (90% dark, 10% bright)
  const [themeData] = useState(() => {
    const isDark = Math.random() > 0.1;
    const themes = isDark ? DARK_THEMES : BRIGHT_THEMES;
    const theme = themes[Math.floor(Math.random() * themes.length)];
    
    // Select animation pattern
    const patternKeys = Object.keys(ANIMATION_PATTERNS);
    const pattern = ANIMATION_PATTERNS[patternKeys[Math.floor(Math.random() * patternKeys.length)]];
    
    // Select font
    const font = FONTS[Math.floor(Math.random() * FONTS.length)];
    
    // Select energy level (override with input if aggressive)
    const energyKeys = Object.keys(ENERGY_LEVELS);
    const baseEnergy = inputPatterns.energyLevel || energyKeys[Math.floor(Math.random() * energyKeys.length)];
    const energy = ENERGY_LEVELS[baseEnergy];
    
    // Randomly select magic effects (20% chance for each)
    const activeEffects = [];
    Object.values(MAGIC_EFFECTS).forEach(effect => {
      const baseProbability = 0.2;
      // Magic emojis boost fortune chance to 60%
      const probability = effect === MAGIC_EFFECTS.FORTUNE && inputPatterns.magicEmojis.length > 0
        ? 0.6
        : baseProbability;
      
      if (Math.random() < probability) {
        activeEffects.push(effect);
      }
    });
    
    return { 
      theme, 
      isDark, 
      pattern, 
      font, 
      energy, 
      energyName: baseEnergy,
      activeEffects
    };
  });
  
  const { theme, isDark, pattern, font, energy, energyName, activeEffects } = themeData;
  
  // Build emoji pool with user emojis emphasized
  const [allEmojis] = useState(() => {
    const baseStickers = [
      ...EMOJI_STICKERS.animals, 
      ...EMOJI_STICKERS.food, 
      ...EMOJI_STICKERS.energy, 
      ...EMOJI_STICKERS.random
    ];
    
    let emojiPool = isDark 
      ? [...baseStickers, ...EMOJI_STICKERS.chaos, ...EMOJI_STICKERS.chaos]
      : [...baseStickers, ...EMOJI_STICKERS.chaos];
    
    // Add user emojis (triple them for emphasis)
    if (inputPatterns.userEmojis.length > 0) {
      const userEmojiRepeats = [...inputPatterns.userEmojis, ...inputPatterns.userEmojis, ...inputPatterns.userEmojis];
      emojiPool = [...emojiPool, ...userEmojiRepeats];
    }
    
    const emojiSizes = [
      'text-3xl sm:text-4xl md:text-6xl',
      'text-4xl sm:text-5xl md:text-7xl',
      'text-5xl sm:text-6xl md:text-8xl'
    ];
    
    return Array(30).fill(null).map(() => ({
      emoji: emojiPool[Math.floor(Math.random() * emojiPool.length)],
      size: emojiSizes[Math.floor(Math.random() * emojiSizes.length)]
    }));
  });
  
  const [headline] = useState(() => HEADLINES[Math.floor(Math.random() * HEADLINES.length)]);
  
  const [scatteredPhrases] = useState(() => {
    const sizes = ['text-base sm:text-lg md:text-2xl', 'text-lg sm:text-xl md:text-3xl', 'text-xl sm:text-2xl md:text-4xl'];
    return Array(12).fill(null).map(() => ({
      text: SMALL_PHRASES[Math.floor(Math.random() * SMALL_PHRASES.length)],
      x: Math.random() * 90 + 5,
      y: Math.random() * 80 + 10,
      size: sizes[Math.floor(Math.random() * sizes.length)],
      delay: Math.random() * 2,
      duration: energy.duration + Math.random() * 2,
      rotation: Math.random() * 360 - 180
    }));
  });
  
  const rank = getScreamRank(screamCount);

  // Cycle through words
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % SCREAM_WORDS.length);
      setWordPosition({
        x: Math.random() * 100 - 50,
        y: Math.random() * 60 - 30
      });
    }, energy.duration * 1000);
    return () => clearInterval(interval);
  }, [energy.duration]);

  // Confetti
  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: theme.accents
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: theme.accents
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, [theme.accents]);

  // Canvas confetti
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array(50).fill(null).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 4 + 2,
      color: theme.accents[Math.floor(Math.random() * theme.accents.length)],
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4
    }));

    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });
      
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(animationId);
  }, [theme.accents]);

  // Fetch global count
  useEffect(() => {
    fetch('/api/count')
      .then(res => res.json())
      .then(data => setGlobalCount(data.count))
      .catch(err => console.error('Failed to fetch count:', err));
  }, []);

  // Magic effects timing
  useEffect(() => {
    const effectTimers = [];
    
    activeEffects.forEach((effect, index) => {
      const timer = setTimeout(() => {
        setMagicEffects(prev => [...prev, { type: effect, id: Date.now() + index }]);
        
        // Remove after animation
        setTimeout(() => {
          setMagicEffects(prev => prev.filter(e => e.id !== Date.now() + index));
        }, 5000);
      }, Math.random() * 3000 + 1000);
      
      effectTimers.push(timer);
    });
    
    return () => effectTimers.forEach(clearTimeout);
  }, [activeEffects]);

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
        backgroundColor: theme.bg[0]
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

  // Get animation properties based on pattern and energy
  const getAnimationProps = (startX, startY, endX, endY, index) => {
    const delay = Math.random() * 2;
    
    switch(pattern) {
      case ANIMATION_PATTERNS.EXPLOSION:
        return {
          initial: { scale: 0, x: 0, y: 0, opacity: 0 },
          animate: {
            scale: energy.scale,
            x: [(endX - startX) * energy.movementRange],
            y: [(endY - startY) * energy.movementRange],
            rotate: energy.rotationSpeed,
            opacity: [0, 1, 1, 0.8, 0]
          },
          transition: {
            duration: energy.duration,
            delay,
            repeat: Infinity,
            ease: "easeOut"
          }
        };
      
      case ANIMATION_PATTERNS.DRIFT:
        return {
          initial: { scale: 0, opacity: 0 },
          animate: {
            scale: energy.scale,
            x: [(endX - startX) * energy.movementRange, (startX - endX) * energy.movementRange],
            y: [(endY - startY) * energy.movementRange / 2],
            rotate: energy.rotationSpeed,
            opacity: [0, 1, 1, 0.8]
          },
          transition: {
            duration: energy.duration,
            delay,
            repeat: Infinity,
            ease: "easeInOut"
          }
        };
      
      case ANIMATION_PATTERNS.SPIRAL:
        const radius = 100;
        return {
          initial: { scale: 0, opacity: 0 },
          animate: {
            scale: energy.scale,
            x: Array(10).fill(null).map((_, i) => 
              Math.cos((i / 10) * Math.PI * 2) * radius * ((i % 2) ? 1 : -1)
            ),
            y: Array(10).fill(null).map((_, i) => 
              Math.sin((i / 10) * Math.PI * 2) * radius * ((i % 2) ? 1 : -1)
            ),
            rotate: energy.rotationSpeed,
            opacity: [0, 1, 1, 1, 0.7]
          },
          transition: {
            duration: energy.duration * 2,
            delay,
            repeat: Infinity,
            ease: "linear"
          }
        };
      
      case ANIMATION_PATTERNS.BOUNCE:
        return {
          initial: { scale: 0, y: -100, opacity: 0 },
          animate: {
            scale: energy.scale,
            y: [0, -50, 0, -30, 0],
            x: [(endX - startX) * energy.movementRange / 2],
            rotate: energy.rotationSpeed,
            opacity: [0, 1, 1, 1, 0.8]
          },
          transition: {
            duration: energy.duration,
            delay,
            repeat: Infinity,
            ease: "easeInOut"
          }
        };
      
      case ANIMATION_PATTERNS.WAVE:
        return {
          initial: { scale: 0, opacity: 0 },
          animate: {
            scale: energy.scale,
            x: Array(5).fill(null).map((_, i) => 
              Math.sin((i / 5) * Math.PI * 2) * energy.movementRange
            ),
            y: [(endY - startY) * energy.movementRange],
            rotate: energy.rotationSpeed,
            opacity: [0, 1, 1, 1, 0.8]
          },
          transition: {
            duration: energy.duration,
            delay,
            repeat: Infinity,
            ease: "easeInOut"
          }
        };
      
      default:
        return {
          initial: { scale: 0, opacity: 0 },
          animate: {
            scale: energy.scale,
            rotate: energy.rotationSpeed,
            opacity: [0, 1, 1, 0.8]
          },
          transition: {
            duration: energy.duration,
            delay,
            repeat: Infinity
          }
        };
    }
  };

  return (
    <>
    <div 
      id="chaos-screen"
      className="relative w-full h-screen overflow-hidden cursor-pointer"
      style={{
        background: `linear-gradient(135deg, ${theme.bg[0]} 0%, ${theme.bg[1]} 100%)`
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: theme.accents
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

      {/* Emojis with varied animations */}
      {allEmojis.map((emojiObj, index) => {
        const startX = Math.random() * 100;
        const endX = Math.random() * 100;
        const startY = Math.random() * 100;
        const endY = Math.random() * 100;
        
        const animProps = getAnimationProps(startX, startY, endX, endY, index);
        
        return (
          <motion.div
            key={index}
            className={`absolute ${emojiObj.size} ${font} cursor-pointer`}
            style={{ 
              left: `${startX}%`, 
              top: `${startY}%`,
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
              zIndex: 25
            }}
            onClick={(e) => {
              e.stopPropagation();
              const rect = e.currentTarget.getBoundingClientRect();
              handleEmojiClick(rect.left + rect.width / 2, rect.top + rect.height / 2, emojiObj.emoji);
            }}
            {...animProps}
            whileHover={{ scale: 1.5 }}
          >
            {emojiObj.emoji}
          </motion.div>
        );
      })}

      {/* Headline */}
      <motion.div
        className="absolute top-16 sm:top-20 left-0 right-0 z-40 px-4"
        initial={{ scale: 0, y: -50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.8 }}
      >
        <h1 
          className={`text-3xl sm:text-4xl md:text-5xl ${font} text-white text-center`}
          style={{ 
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            color: theme.accents[0]
          }}
        >
          {headline}
        </h1>
      </motion.div>

      {/* Scattered phrases */}
      {scatteredPhrases.map((phrase, index) => (
        <motion.div
          key={`phrase-${index}`}
          className={`absolute ${phrase.size} ${font} text-white pointer-events-none`}
          style={{ 
            left: `${phrase.x}%`, 
            top: `${phrase.y}%`,
            textShadow: `2px 2px 4px rgba(0,0,0,0.4)`,
            color: theme.accents[index % theme.accents.length],
            zIndex: 20
          }}
          initial={{ scale: 0, rotate: phrase.rotation, opacity: 0 }}
          animate={{ 
            scale: energy.scale,
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

      {/* Magic Effects */}
      {magicEffects.map((effect) => {
        if (effect.type === MAGIC_EFFECTS.FORTUNE) {
          const fortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
          return (
            <motion.div
              key={effect.id}
              className="absolute left-1/2 top-1/3 -translate-x-1/2 z-50 px-6 py-3 bg-white/90 backdrop-blur-md rounded-full"
              initial={{ scale: 0, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
            >
              <p className={`text-sm sm:text-base ${font} text-gray-800 text-center max-w-xs`}>
                ✨ {fortune} ✨
              </p>
            </motion.div>
          );
        }
        
        if (effect.type === MAGIC_EFFECTS.SHOOTING_STAR) {
          return (
            <motion.div
              key={effect.id}
              className="absolute text-4xl z-50"
              style={{ left: '-50px', top: '20%' }}
              initial={{ x: 0, opacity: 1 }}
              animate={{ x: window.innerWidth + 100, opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeIn" }}
            >
              ⭐
            </motion.div>
          );
        }
        
        return null;
      })}

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

      {/* Center word */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
        <motion.div
          key={currentWord}
          className="px-4"
          style={{
            transform: `translate(${wordPosition.x}px, ${wordPosition.y}px)`
          }}
          initial={{ scale: 0, rotate: -45, opacity: 0 }}
          animate={{ 
            scale: energy.scale,
            rotate: 0,
            opacity: 1
          }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 
            className={`text-6xl sm:text-7xl md:text-9xl ${font} text-white text-center break-words`}
            style={{ 
              textShadow: `4px 4px 0 ${theme.accents[0]}, -4px -4px 0 ${theme.accents[1]}`,
              letterSpacing: '2px',
              lineHeight: '1.1',
              maxWidth: '90vw'
            }}
          >
            {SCREAM_WORDS[currentWord]}
          </h2>
        </motion.div>
      </div>

      {/* Buttons */}
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
