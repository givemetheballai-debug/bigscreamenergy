import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { toPng } from 'html-to-image';
import { getScreamRank } from '../lib/ranks';

// HEALING FORTUNES (advice/affirmations)
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

// COSMIC PREDICTIONS (actual fortunes)
const COSMIC_PREDICTIONS = [
  "A surprise connection will spark joy this week",
  "Someone from your past will reach out with good news",
  "You'll meet someone who becomes unexpectedly important",
  "A conversation you've been avoiding will go better than expected",
  "New friendship energy is heading your way",
  "Someone is thinking about you right now",
  "A text message will make you smile within 48 hours",
  "You'll reconnect with someone who truly gets you",
  "An opportunity you didn't see coming is about to appear",
  "Your next big idea will arrive in an unexpected moment",
  "Something you've been working on is about to click",
  "The universe is clearing a path for your next move",
  "A door you thought was closed is about to reopen",
  "Your timing is better than you think",
  "Someone will notice your talent soon",
  "A risk you're considering will pay off",
  "Unexpected money is flowing your way",
  "A financial worry will resolve itself this month",
  "Someone will offer you something valuable",
  "Your investment of time is about to pay dividends",
  "Abundance is coming from an unusual source",
  "A clarity breakthrough is coming in the next 72 hours",
  "You're about to understand something that's been confusing you",
  "The answer you need will appear in an unexpected place",
  "Trust your gut - it knows something you don't yet",
  "You're closer to a breakthrough than you realize",
  "Something ending is making room for something better",
  "You'll discover a hidden strength this week",
  "Something will make you laugh unexpectedly today",
  "A small moment will become a cherished memory",
  "You're about to have one of those perfect days",
  "Something you've been wanting is closer than you think",
  "A pleasant surprise is waiting around the corner",
  "Joy is coming from the most random source",
  "Someone sees your value more than you know",
  "You're about to get confirmation you're on the right path",
  "The thing you think no one notices? Someone does",
  "You're making a bigger impact than you realize",
  "Recognition is coming for something you almost gave up on",
  "Your energy is shifting everything around you"
];

// CONNECTOR PHRASES (tie scream type to cosmic forces)
const CONNECTOR_PHRASES = [
  "to ride this momentum wave",
  "to charge what's next",
  "to open your cosmic window",
  "to attract what's coming",
  "to unlock your alignment",
  "to harness this phase",
  "to shift your vibe forward",
  "to manifest your path",
  "to power your season",
  "to flow with what's rising"
];

// CALMING MESSAGES (appear during slow-down phase)
const CALMING_MESSAGES = [
  "Release and receive...",
  "A message from the universe is coming...",
  "Breathe... your fortune is manifesting...",
  "Let go... something beautiful awaits...",
  "The cosmos is listening..."
];

// SCREAM TYPES WITH EXPLANATIONS
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

const BASE_WORDS = [
  'LET IT OUT!', 'YOU DID IT!', 'SCREAM!', 'YES!!!', 
  'FREEDOM!', 'FINALLY!!', 'WOOOOO!!', 'CHAOS!!!', 'BOOM!!!',
  'EXPLODE!!', 'WILD!!!', 'FIERCE!!', 'RAGE!!!', 'UNLEASH!!',
  'ROAR!!!', 'POWER!!!', 'INTENSITY!!', 'AAAAHHHH!!'
];

const SMALL_PHRASES = [
  'BANG!', 'POW!', 'ZOOM!', 'WHOA!', 'YAY!', 'WOW!', 'ZAP!', 'BOOM!',
  'YES!', 'GO!', 'NOW!', 'FREE!', 'FLY!', 'WILD!', 'LOUD!', 'FIERCE!',
  'BOLD!', 'HUGE!', 'EPIC!', 'RAW!', 'REAL!', 'FIRE!', 'BLAZE!', 'SURGE!',
  'RAGE!', 'ROAR!', 'CRASH!', 'SMASH!', 'BLAST!', 'RUSH!', 'SPARK!', 'FLASH!'
];

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

const ALL_PALETTES = [
  ...COLOR_PALETTES.HOT,
  ...COLOR_PALETTES.COOL,
  ...COLOR_PALETTES.NEON,
  ...COLOR_PALETTES.PASTEL,
  ...COLOR_PALETTES.DEEP
];

const FONTS = [
  'font-sans',
  'font-serif', 
  'font-mono'
];

const GEOMETRIC_SHAPES = ['blobs', 'lines', 'triangles', 'circles', 'starbursts', 'slashes'];

function shuffle(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getContrastColor(bgColor1, bgColor2) {
  const avgBrightness = (parseInt(bgColor1.slice(1, 3), 16) + parseInt(bgColor2.slice(1, 3), 16)) / 2;
  return avgBrightness > 100 ? '#000000' : '#ffffff';
}

export default function ChaosScreen({ userText, onReset, onNavigate, globalCount }) {
  const [screamType, setScreamType] = useState(null);
  const [palette, setPalette] = useState(null);
  const [font, setFont] = useState('');
  const [mainWord, setMainWord] = useState('');
  const [emojis, setEmojis] = useState([]);
  const [smallPhrases, setSmallPhrases] = useState([]);
  const [fortune, setFortune] = useState('');
  const [cosmicPrediction, setCosmicPrediction] = useState('');
  const [connectorPhrase, setConnectorPhrase] = useState('');
  const [calmingMessage, setCalmingMessage] = useState('');
  const [fortuneFloated, setFortuneFloated] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [explosionEmojis, setExplosionEmojis] = useState([]);
  const [selectedShapes, setSelectedShapes] = useState([]);
  const [density, setDensity] = useState('medium');
  const [showCalmingMessage, setShowCalmingMessage] = useState(false);
  const [showBigWord, setShowBigWord] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState('fast');
  
  const screenshotRef = useRef(null);

  useEffect(() => {
    const chosenScreamType = randomChoice(ALL_SCREAM_TYPES);
    const chosenPalette = randomChoice(ALL_PALETTES);
    const chosenFont = randomChoice(FONTS);
    const chosenWord = randomChoice(BASE_WORDS);
    const chosenFortune = randomChoice(FORTUNES);
    const chosenPrediction = randomChoice(COSMIC_PREDICTIONS);
    const chosenConnector = randomChoice(CONNECTOR_PHRASES);
    const chosenCalming = randomChoice(CALMING_MESSAGES);
    
    setScreamType(chosenScreamType);
    setPalette(chosenPalette);
    setFont(chosenFont);
    setMainWord(chosenWord);
    setFortune(chosenFortune);
    setCosmicPrediction(chosenPrediction);
    setConnectorPhrase(chosenConnector);
    setCalmingMessage(chosenCalming);

    // Density
    const densityOptions = ['minimal', 'medium', 'packed'];
    const chosenDensity = randomChoice(densityOptions);
    setDensity(chosenDensity);

    // Shapes (3-4 of 6)
    const numShapes = randomInt(3, 4);
    const shapes = shuffle(GEOMETRIC_SHAPES).slice(0, numShapes);
    setSelectedShapes(shapes);

    // Emojis
    const allEmojis = [
      ...EMOJI_STICKERS.animals,
      ...EMOJI_STICKERS.food,
      ...EMOJI_STICKERS.energy,
      ...EMOJI_STICKERS.magic,
      ...EMOJI_STICKERS.random,
      ...EMOJI_STICKERS.chaos
    ];
    const shuffledEmojis = shuffle(allEmojis);
    
    let emojiCount;
    if (chosenDensity === 'minimal') emojiCount = randomInt(8, 12);
    else if (chosenDensity === 'medium') emojiCount = randomInt(20, 30);
    else emojiCount = randomInt(45, 55);

    const emojiElements = shuffledEmojis.slice(0, emojiCount).map((emoji, i) => ({
      id: i,
      emoji,
      x: Math.random() * 100,
      y: 35 + Math.random() * 65,
      size: randomChoice(['text-2xl', 'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl']),
      delay: Math.random() * 0.5,
      duration: 4,
      rotation: randomInt(-45, 45)
    }));
    setEmojis(emojiElements);

    // Small phrases
    let phraseCount;
    if (chosenDensity === 'minimal') phraseCount = randomInt(5, 8);
    else if (chosenDensity === 'medium') phraseCount = randomInt(10, 15);
    else phraseCount = randomInt(18, 25);

    const phrases = shuffle(SMALL_PHRASES).slice(0, phraseCount).map((phrase, i) => ({
      id: `phrase-${i}`,
      text: phrase,
      x: Math.random() * 100,
      y: 35 + Math.random() * 65,
      size: randomChoice(['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl']),
      delay: Math.random() * 0.5
    }));
    setSmallPhrases(phrases);

    // Confetti
    let confettiCount;
    if (chosenDensity === 'minimal') confettiCount = 30;
    else if (chosenDensity === 'medium') confettiCount = 60;
    else confettiCount = 100;

    confetti({
      particleCount: confettiCount,
      spread: 180,
      origin: { y: 0.6 },
      colors: chosenPalette.colors
    });

    // TIMING SEQUENCE
    // 2s mark: Start calming phase
    const calmingTimer = setTimeout(() => {
      setShowCalmingMessage(true);
      setShowBigWord(false); // Big word fades out
      setAnimationSpeed('slow'); // Slow down animations
    }, 2000);

    // 4s mark: Fortune appears
    const fortuneTimer = setTimeout(() => {
      setShowCalmingMessage(false);
      setFortuneFloated(true);
    }, 4000);

    return () => {
      clearTimeout(calmingTimer);
      clearTimeout(fortuneTimer);
    };
  }, []);

  const handleShare = async () => {
    if (!screenshotRef.current) return;
    
    setShowShare(true);
    
    try {
      const dataUrl = await toPng(screenshotRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: palette?.bg[0]
      });
      
      const link = document.createElement('a');
      link.download = `big-scream-energy-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      
      setTimeout(() => setShowShare(false), 2000);
    } catch (err) {
      console.error('Failed to save image:', err);
      setShowShare(false);
    }
  };

  const handleShareLink = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: 'Big Scream Energy',
        text: `I just released my ${screamType?.name}! Get your Big Scream Energy at`,
        url: url
      });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const handleEmojiClick = (emoji, x, y) => {
    const burstEmojis = [];
    const burstCount = randomInt(5, 8);
    
    for (let i = 0; i < burstCount; i++) {
      const angle = (Math.PI * 2 * i) / burstCount + (Math.random() - 0.5) * 0.5;
      const distance = randomInt(80, 150);
      
      burstEmojis.push({
        id: `explosion-${Date.now()}-${i}`,
        emoji: randomChoice([...EMOJI_STICKERS.animals, ...EMOJI_STICKERS.energy, ...EMOJI_STICKERS.magic]),
        startX: x,
        startY: y,
        angle,
        distance
      });
    }
    
    setExplosionEmojis(prev => [...prev, ...burstEmojis]);
    setTimeout(() => {
      setExplosionEmojis(prev => prev.filter(e => !burstEmojis.some(b => b.id === e.id)));
    }, 1000);
  };

  if (!screamType || !palette) return null;

  const bgGradient = `linear-gradient(135deg, ${palette.bg[0]} 0%, ${palette.bg[1]} 100%)`;
  const shapeColor = getContrastColor(palette.bg[0], palette.bg[1]);

  return (
    <>
    <div 
      ref={screenshotRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ background: bgGradient }}
    >
      {/* Geometric shapes */}
      {selectedShapes.includes('blobs') && (
        <>
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full opacity-20 blur-2xl" 
               style={{ backgroundColor: shapeColor }} />
          <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full opacity-20 blur-3xl" 
               style={{ backgroundColor: shapeColor }} />
        </>
      )}
      
      {selectedShapes.includes('lines') && (
        <>
          <div className="absolute top-0 left-1/4 w-1 h-full opacity-10" 
               style={{ backgroundColor: shapeColor }} />
          <div className="absolute top-0 right-1/3 w-1 h-full opacity-10" 
               style={{ backgroundColor: shapeColor }} />
        </>
      )}

      {selectedShapes.includes('triangles') && (
        <>
          <div className="absolute top-20 right-10 opacity-10"
               style={{ 
                 width: 0,
                 height: 0,
                 borderLeft: '60px solid transparent',
                 borderRight: '60px solid transparent',
                 borderBottom: `100px solid ${shapeColor}`
               }} />
        </>
      )}

      {selectedShapes.includes('circles') && (
        <>
          <div className="absolute top-1/3 left-10 w-20 h-20 rounded-full opacity-15" 
               style={{ backgroundColor: shapeColor }} />
          <div className="absolute bottom-1/4 right-10 w-16 h-16 rounded-full opacity-15" 
               style={{ backgroundColor: shapeColor }} />
        </>
      )}

      {selectedShapes.includes('starbursts') && (
        <div className="absolute top-1/2 right-1/4 opacity-10" 
             style={{ 
               fontSize: '100px',
               color: shapeColor
             }}>
          ✦
        </div>
      )}

      {selectedShapes.includes('slashes') && (
        <>
          <div className="absolute top-10 right-1/3 w-40 h-1 opacity-10 transform rotate-45" 
               style={{ backgroundColor: shapeColor }} />
          <div className="absolute bottom-20 left-1/4 w-32 h-1 opacity-10 transform -rotate-45" 
               style={{ backgroundColor: shapeColor }} />
        </>
      )}

      {/* Scream type - appears early with explosion */}
      <motion.div
        className="absolute top-8 sm:top-12 left-0 right-0 z-40 px-4"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="text-center">
          <p className={`text-xs sm:text-sm ${font} text-white/80 mb-1 tracking-widest`}>
            YOUR BIG SCREAM ENERGY IS...
          </p>
          <h1 
            className={`text-2xl sm:text-3xl md:text-4xl ${font} font-black text-white mb-2`}
            style={{ 
              textShadow: `2px 2px 0 ${palette.colors[0]}, -2px -2px 0 ${palette.colors[2] || palette.colors[1]}`,
              letterSpacing: '2px'
            }}
          >
            {screamType.name}
          </h1>
          <p className={`text-xs sm:text-sm ${font} text-white/90 max-w-md mx-auto italic`}>
            {screamType.description}
          </p>
        </div>
      </motion.div>

      {/* Calming message */}
      <AnimatePresence>
        {showCalmingMessage && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-60 pointer-events-none"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center px-4">
              <motion.p 
                className="text-xl sm:text-2xl md:text-3xl font-light text-white"
                style={{ 
                  textShadow: `0 0 20px ${palette.colors[0]}, 0 0 40px ${palette.colors[1]}`,
                  fontFamily: 'Inter, system-ui, sans-serif',
                  letterSpacing: '1px'
                }}
                animate={{
                  textShadow: [
                    `0 0 20px ${palette.colors[0]}, 0 0 40px ${palette.colors[1]}`,
                    `0 0 30px ${palette.colors[1]}, 0 0 60px ${palette.colors[2] || palette.colors[0]}`,
                    `0 0 20px ${palette.colors[0]}, 0 0 40px ${palette.colors[1]}`
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {calmingMessage}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emoji stickers - slow down during calm phase */}
      {emojis.map((item) => {
        const colorIndex = Math.floor(Math.random() * palette.colors.length);
        const glowColor = palette.colors[colorIndex];
        const currentDuration = animationSpeed === 'fast' ? item.duration : 8;

        return (
          <motion.div
            key={item.id}
            className={`absolute ${item.size} cursor-pointer z-25`}
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              filter: `drop-shadow(0 0 8px ${glowColor})`
            }}
            initial={{ 
              scale: 0,
              rotate: item.rotation,
              opacity: 0
            }}
            animate={{ 
              scale: [0, 1.2, 1],
              rotate: [item.rotation, item.rotation + 360],
              y: [0, -30, 0, 30, 0],
              x: [0, 20, -20, 0],
              opacity: 1
            }}
            transition={{
              scale: { delay: item.delay, duration: 0.4 },
              opacity: { delay: item.delay, duration: 0.3 },
              rotate: { 
                delay: item.delay,
                duration: currentDuration,
                repeat: Infinity,
                ease: "linear"
              },
              y: { 
                delay: item.delay,
                duration: currentDuration,
                repeat: Infinity,
                ease: "easeInOut"
              },
              x: { 
                delay: item.delay,
                duration: currentDuration,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            onClick={(e) => handleEmojiClick(item.emoji, e.clientX, e.clientY)}
          >
            {item.emoji}
          </motion.div>
        );
      })}

      {/* Small scattered phrases */}
      {smallPhrases.map((phrase) => (
        <motion.div
          key={phrase.id}
          className={`absolute ${phrase.size} ${font} font-bold text-white/40 z-20 pointer-events-none`}
          style={{
            left: `${phrase.x}%`,
            top: `${phrase.y}%`
          }}
          initial={{ scale: 0, rotate: -10, opacity: 0 }}
          animate={{ 
            scale: 1,
            rotate: [0, 5, -5, 0],
            opacity: 0.4
          }}
          transition={{
            delay: phrase.delay,
            scale: { duration: 0.3 },
            opacity: { duration: 0.3 },
            rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          {phrase.text}
        </motion.div>
      ))}

      {/* Fortune - appears during receiving phase with modern styling */}
      <AnimatePresence>
        {fortuneFloated && (
          <motion.div
            className="absolute left-1/2 z-70 pointer-events-none px-4"
            style={{ 
              top: '30%',
              transform: 'translateX(-50%)'
            }}
            initial={{ 
              scale: 0,
              opacity: 0,
              filter: 'blur(10px)'
            }}
            animate={{ 
              scale: [0, 1.1, 1],
              opacity: 1,
              filter: 'blur(0px)',
              y: [0, -5, 0]
            }}
            transition={{
              scale: { duration: 0.6 },
              opacity: { duration: 0.6 },
              filter: { duration: 0.6 },
              y: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          >
            <div 
              className="backdrop-blur-md rounded-2xl p-6 sm:p-8 max-w-lg"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: `2px solid ${palette.colors[0]}40`,
                boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.2), 0 0 40px ${palette.colors[0]}30`
              }}
            >
              {/* Modern typography layout */}
              <div className="space-y-4 text-center">
                {/* Fortune header */}
                <div>
                  <p 
                    className="text-sm font-light tracking-[0.3em] uppercase mb-1"
                    style={{ 
                      color: palette.colors[0],
                      fontFamily: 'Inter, system-ui, sans-serif'
                    }}
                  >
                    Fortune
                  </p>
                  <p 
                    className="text-xs text-white/70"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                  >
                    based on your unique big scream energy
                  </p>
                </div>

                {/* Divider */}
                <div 
                  className="w-16 h-px mx-auto"
                  style={{ background: `linear-gradient(90deg, transparent, ${palette.colors[0]}, transparent)` }}
                />

                {/* Advice/affirmation */}
                <motion.p 
                  className="text-base sm:text-lg font-medium text-white leading-relaxed"
                  style={{ 
                    fontFamily: 'Inter, system-ui, sans-serif',
                    textShadow: `0 0 10px ${palette.colors[0]}50`
                  }}
                  animate={{
                    textShadow: [
                      `0 0 10px ${palette.colors[0]}50`,
                      `0 0 20px ${palette.colors[1]}60`,
                      `0 0 10px ${palette.colors[0]}50`
                    ]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {fortune}
                </motion.p>

                {/* Connector with scream type */}
                <p 
                  className="text-sm text-white/80 leading-relaxed"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  Channel your <span className="font-semibold" style={{ color: palette.colors[1] }}>{screamType.name}</span> vibe {connectorPhrase}
                </p>

                {/* Divider */}
                <div 
                  className="w-24 h-px mx-auto"
                  style={{ background: `linear-gradient(90deg, transparent, ${palette.colors[1]}, transparent)` }}
                />

                {/* Prediction header */}
                <p 
                  className="text-xs font-light tracking-[0.2em] uppercase"
                  style={{ 
                    color: palette.colors[1],
                    fontFamily: 'Inter, system-ui, sans-serif'
                  }}
                >
                  Your prediction
                </p>

                {/* Cosmic prediction */}
                <motion.p 
                  className="text-base sm:text-lg font-medium text-white leading-relaxed"
                  style={{ 
                    fontFamily: 'Inter, system-ui, sans-serif',
                    textShadow: `0 0 10px ${palette.colors[1]}50`
                  }}
                  animate={{
                    textShadow: [
                      `0 0 10px ${palette.colors[1]}50`,
                      `0 0 20px ${palette.colors[2] || palette.colors[0]}60`,
                      `0 0 10px ${palette.colors[1]}50`
                    ]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {cosmicPrediction}
                </motion.p>
              </div>
            </div>
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

      {/* Center big word - FADES OUT during calming phase */}
      <AnimatePresence>
        {showBigWord && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30" style={{ paddingTop: '10vh' }}>
            <motion.div
              className="px-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: [0.8, 1.2, 1, 1.05, 1],
                rotate: [0, 3, -3, 2, 0],
                x: [0, 20, -20, 15, -15, 0],
                y: [0, -15, 15, -10, 10, 0],
                opacity: 1
              }}
              exit={{ 
                opacity: 0,
                scale: 0.8
              }}
              transition={{ 
                scale: { duration: 0.3 },
                opacity: { duration: 0.2 },
                rotate: { duration: 10, repeat: Infinity, ease: "easeInOut" },
                x: { duration: 10, repeat: Infinity, ease: "easeInOut" },
                y: { duration: 10, repeat: Infinity, ease: "easeInOut" },
                exit: { duration: 0.8 }
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
        )}
      </AnimatePresence>

      {/* Buttons */}
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
