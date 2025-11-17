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

const GEOMETRIC_SHAPES = ['blobs', 'circles', 'triangles', 'squares', 'hexagons', 'stars', 'spirals', 'crescents', 'diamonds', 'plus', 'squiggles', 'starbursts', 'slashes'];

const GRADIENT_TYPES = ['diagonal', 'radial', 'vertical', 'horizontal'];
const SHAPE_ANIMATIONS = ['pulse', 'rotate', 'drift', 'static'];
const EMOJI_MOTIONS = ['spiral', 'bounce', 'smooth', 'jitter'];

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
  const [gradientType, setGradientType] = useState('diagonal');
  const [shapeAnimation, setShapeAnimation] = useState('pulse');
  const [emojiMotion, setEmojiMotion] = useState('smooth');
  const [shapeOpacity, setShapeOpacity] = useState(0.2);
  const [lineConfigs, setLineConfigs] = useState([]);
  const [shapePositions, setShapePositions] = useState({});
  const [confettiConfig, setConfettiConfig] = useState({});
  const [emojiIntensity, setEmojiIntensity] = useState('medium');
  const [screamCount, setScreamCount] = useState(0);
  const [dailyCount, setDailyCount] = useState(0);
  
  const screenshotRef = useRef(null);

  // Initialize scream counts from localStorage
  useEffect(() => {
    const storedTotal = localStorage.getItem('bse_total_screams');
    const storedDaily = localStorage.getItem('bse_daily_screams');
    const storedDate = localStorage.getItem('bse_last_scream_date');
    const today = new Date().toDateString();

    if (storedDate !== today) {
      // New day, reset daily count
      localStorage.setItem('bse_daily_screams', '1');
      localStorage.setItem('bse_last_scream_date', today);
      setDailyCount(1);
    } else {
      setDailyCount(parseInt(storedDaily || '0') + 1);
      localStorage.setItem('bse_daily_screams', String((parseInt(storedDaily || '0') + 1)));
    }

    const newTotal = parseInt(storedTotal || '0') + 1;
    setScreamCount(newTotal);
    localStorage.setItem('bse_total_screams', String(newTotal));
  }, []);

  useEffect(() => {
    const chosenScreamType = randomChoice(ALL_SCREAM_TYPES);
    const chosenPalette = randomChoice(ALL_PALETTES);
    const chosenFont = randomChoice(FONTS);
    const chosenWord = randomChoice(BASE_WORDS);
    const chosenFortune = randomChoice(FORTUNES);
    const chosenPrediction = randomChoice(COSMIC_PREDICTIONS);
    const chosenConnector = randomChoice(CONNECTOR_PHRASES);
    const chosenCalming = randomChoice(CALMING_MESSAGES);
    const chosenGradient = randomChoice(GRADIENT_TYPES);
    const chosenShapeAnim = randomChoice(SHAPE_ANIMATIONS);
    const chosenEmojiMotion = randomChoice(EMOJI_MOTIONS);
    const chosenShapeOpacity = Math.random() * 0.15 + 0.1; // 0.1-0.25
    
    setScreamType(chosenScreamType);
    setPalette(chosenPalette);
    setFont(chosenFont);
    setMainWord(chosenWord);
    setFortune(chosenFortune);
    setCosmicPrediction(chosenPrediction);
    setConnectorPhrase(chosenConnector);
    setCalmingMessage(chosenCalming);
    setGradientType(chosenGradient);
    setShapeAnimation(chosenShapeAnim);
    setEmojiMotion(chosenEmojiMotion);
    setShapeOpacity(chosenShapeOpacity);

    // Density
    const densityOptions = ['minimal', 'medium', 'packed'];
    const chosenDensity = randomChoice(densityOptions);
    setDensity(chosenDensity);

    // Pick 1-3 dominant shape types for this scream
    const numShapeTypes = randomInt(1, 3);
    const dominantShapes = shuffle(GEOMETRIC_SHAPES).slice(0, numShapeTypes);
    setSelectedShapes(dominantShapes);

    // Generate positions for each shape type (3-12 instances per type)
    const allShapeInstances = {};
    dominantShapes.forEach(shapeType => {
      const instanceCount = randomInt(3, 12);
      allShapeInstances[shapeType] = Array.from({ length: instanceCount }, () => ({
        id: Math.random(),
        top: `${randomInt(5, 70)}%`,
        left: `${randomInt(5, 95)}%`,
        size: randomInt(40, 150),
        rotation: randomInt(0, 360)
      }));
    });
    setShapePositions(allShapeInstances);

    // Confetti variations
    const confettiParams = {
      count: randomInt(30, 150),
      spread: randomInt(60, 180),
      origin: { 
        x: Math.random() * 0.4 + 0.3, // 0.3-0.7
        y: Math.random() * 0.4 + 0.4  // 0.4-0.8
      },
      velocity: randomInt(30, 70)
    };
    setConfettiConfig(confettiParams);

    // Emoji motion intensity
    const intensities = ['gentle', 'medium', 'intense'];
    setEmojiIntensity(randomChoice(intensities));

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

    const emojiElements = shuffledEmojis.slice(0, emojiCount).map((emoji, i) => {
      let x, y;
      // Exclusion zone: avoid center 40% width and 30-70% height (where fortune appears)
      do {
        x = Math.random() * 100;
        y = 35 + Math.random() * 65;
      } while (x > 30 && x < 70 && y > 30 && y < 70);

      // Vary duration based on intensity
      let baseDuration;
      if (emojiIntensity === 'gentle') baseDuration = randomInt(6, 10);
      else if (emojiIntensity === 'medium') baseDuration = randomInt(4, 6);
      else baseDuration = randomInt(2, 4); // intense

      return {
        id: i,
        emoji,
        x,
        y,
        size: randomChoice(['text-2xl', 'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl']),
        delay: Math.random() * 0.5,
        duration: baseDuration,
        rotation: randomInt(-45, 45),
        opacity: Math.random() * 0.4 + 0.6 // 0.6-1.0
      };
    });
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

    // Confetti with variations
    confetti({
      particleCount: confettiParams.count,
      spread: confettiParams.spread,
      origin: confettiParams.origin,
      startVelocity: confettiParams.velocity,
      colors: chosenPalette.colors
    });

    // TIMING SEQUENCE
    // 3s mark: Start calming phase (slower)
    const calmingTimer = setTimeout(() => {
      setShowCalmingMessage(true);
      setShowBigWord(false); // Big word fades out
      setAnimationSpeed('slow'); // Slow down animations
    }, 3000);

    // 5s mark: Fortune appears (more time to read calming message)
    const fortuneTimer = setTimeout(() => {
      setShowCalmingMessage(false);
      setFortuneFloated(true);
    }, 5000);

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

  let bgGradient;
  if (gradientType === 'radial') {
    bgGradient = `radial-gradient(circle at ${randomInt(30, 70)}% ${randomInt(30, 70)}%, ${palette.bg[0]} 0%, ${palette.bg[1]} 100%)`;
  } else if (gradientType === 'vertical') {
    bgGradient = `linear-gradient(180deg, ${palette.bg[0]} 0%, ${palette.bg[1]} 100%)`;
  } else if (gradientType === 'horizontal') {
    bgGradient = `linear-gradient(90deg, ${palette.bg[0]} 0%, ${palette.bg[1]} 100%)`;
  } else {
    // diagonal with random angle
    const angle = randomInt(90, 180);
    bgGradient = `linear-gradient(${angle}deg, ${palette.bg[0]} 0%, ${palette.bg[1]} 100%)`;
  }
  
  const shapeColor = getContrastColor(palette.bg[0], palette.bg[1]);

  return (
    <>
    <div 
      ref={screenshotRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ background: bgGradient }}
    >
      {/* Geometric shapes - animated during explosion, calm during fortune, fade in center */}
      {selectedShapes.includes('blobs') && shapePositions.blobs && (
        <>
          {shapePositions.blobs.map((blob) => {
            // Check if blob is in fortune center zone
            const blobX = parseFloat(blob.left);
            const blobY = parseFloat(blob.top);
            const inFortuneZone = blobX > 20 && blobX < 80 && blobY > 15 && blobY < 50;
            const blobOpacity = fortuneFloated && inFortuneZone ? shapeOpacity * 0.2 : shapeOpacity;

            return (
              <motion.div
                key={blob.id}
                className="absolute rounded-full blur-2xl" 
                style={{ 
                  backgroundColor: shapeColor,
                  top: blob.top,
                  left: blob.left,
                  width: `${blob.size}px`,
                  height: `${blob.size}px`
                }}
                initial={{ opacity: 0 }}
                animate={animationSpeed === 'fast' ? {
                  opacity: [0, blobOpacity, blobOpacity],
                  scale: shapeAnimation === 'pulse' ? [1, 2, 1] : 1,
                  x: shapeAnimation === 'drift' ? [0, randomInt(-80, 80), 0] : 0,
                  y: shapeAnimation === 'drift' ? [0, randomInt(-50, 50), 0] : 0
                } : {
                  opacity: blobOpacity * 0.5,
                  scale: 1
                }}
                transition={animationSpeed === 'fast' ? {
                  opacity: { duration: 0.5 },
                  scale: { duration: randomInt(12, 20) / 10, repeat: Infinity, ease: "easeInOut" },
                  x: { duration: randomInt(30, 50) / 10, repeat: Infinity, ease: "easeInOut" },
                  y: { duration: randomInt(30, 50) / 10, repeat: Infinity, ease: "easeInOut" }
                } : {
                  duration: 1
                }}
              />
            );
          })}
        </>
      )}
      
      {selectedShapes.includes('lines') && lineConfigs.map((line) => (
        <motion.div 
          key={line.id}
          className="absolute origin-center"
          style={{ 
            backgroundColor: shapeColor,
            left: line.left,
            top: line.top,
            width: `${line.thickness}px`,
            height: `${line.length}vh`,
            transform: `rotate(${line.angle}deg)`
          }}
          initial={{ opacity: 0 }}
          animate={animationSpeed === 'fast' ? {
            opacity: [0, shapeOpacity, shapeOpacity],
            scaleY: shapeAnimation === 'pulse' ? [1, 1.5, 1] : 1,
            scaleX: shapeAnimation === 'pulse' ? [1, 3, 1] : 1,
            x: shapeAnimation === 'drift' ? [0, randomInt(-100, 100), 0] : 0,
            y: shapeAnimation === 'drift' ? [0, randomInt(-80, 80), 0] : 0
          } : {
            opacity: shapeOpacity * 0.5
          }}
          transition={animationSpeed === 'fast' ? {
            opacity: { duration: 0.5 },
            scaleY: { duration: randomInt(15, 25) / 10, repeat: Infinity, ease: "easeInOut" },
            scaleX: { duration: randomInt(15, 25) / 10, repeat: Infinity, ease: "easeInOut" },
            x: { duration: randomInt(30, 50) / 10, repeat: Infinity, ease: "easeInOut" },
            y: { duration: randomInt(30, 50) / 10, repeat: Infinity, ease: "easeInOut" }
          } : {
            duration: 1
          }}
        />
      ))}

      {selectedShapes.includes('triangles') && shapePositions.triangle && (
        <motion.div 
          className="absolute"
          style={{ 
            top: shapePositions.triangle.top,
            right: shapePositions.triangle.right,
            width: 0,
            height: 0,
            borderLeft: `${shapePositions.triangle.size * 0.6}px solid transparent`,
            borderRight: `${shapePositions.triangle.size * 0.6}px solid transparent`,
            borderBottom: `${shapePositions.triangle.size}px solid ${shapeColor}`
          }}
          initial={{ opacity: 0 }}
          animate={animationSpeed === 'fast' ? {
            opacity: [0, shapeOpacity, shapeOpacity],
            rotate: shapeAnimation === 'rotate' ? [0, 360] : 0,
            scale: shapeAnimation === 'pulse' ? [1, 2, 1] : 1
          } : {
            opacity: shapeOpacity * 0.5,
            rotate: 0,
            scale: 1
          }}
          transition={animationSpeed === 'fast' ? {
            opacity: { duration: 0.5 },
            rotate: { duration: 6, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
          } : {
            duration: 1
          }}
        />
      )}

      {selectedShapes.includes('circles') && shapePositions.circle1 && (
        <>
          <motion.div 
            className="absolute rounded-full" 
            style={{ 
              backgroundColor: shapeColor,
              top: shapePositions.circle1.top,
              left: shapePositions.circle1.left,
              width: `${shapePositions.circle1.size}px`,
              height: `${shapePositions.circle1.size}px`
            }}
            initial={{ opacity: 0 }}
            animate={animationSpeed === 'fast' ? {
              opacity: [0, shapeOpacity, shapeOpacity],
              scale: shapeAnimation === 'pulse' ? [1, 1.8, 1] : 1,
              x: shapeAnimation === 'drift' ? [0, 60, 0] : 0,
              y: shapeAnimation === 'drift' ? [0, -40, 0] : 0
            } : {
              opacity: shapeOpacity * 0.5
            }}
            transition={animationSpeed === 'fast' ? {
              opacity: { duration: 0.5 },
              scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
              x: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            } : {
              duration: 1
            }}
          />
          <motion.div 
            className="absolute rounded-full" 
            style={{ 
              backgroundColor: shapeColor,
              bottom: shapePositions.circle2.bottom,
              right: shapePositions.circle2.right,
              width: `${shapePositions.circle2.size}px`,
              height: `${shapePositions.circle2.size}px`
            }}
            initial={{ opacity: 0 }}
            animate={animationSpeed === 'fast' ? {
              opacity: [0, shapeOpacity, shapeOpacity],
              scale: shapeAnimation === 'pulse' ? [1, 2, 1] : 1,
              y: shapeAnimation === 'drift' ? [0, -50, 0] : 0,
              x: shapeAnimation === 'drift' ? [0, -40, 0] : 0
            } : {
              opacity: shapeOpacity * 0.5
            }}
            transition={animationSpeed === 'fast' ? {
              opacity: { duration: 0.5 },
              scale: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
              x: { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
            } : {
              duration: 1
            }}
          />
        </>
      )}

      {selectedShapes.includes('starbursts') && shapePositions.starburst && (
        <motion.div 
          className="absolute" 
          style={{ 
            top: shapePositions.starburst.top,
            right: shapePositions.starburst.right,
            fontSize: `${shapePositions.starburst.size}px`,
            color: shapeColor
          }}
          initial={{ opacity: 0 }}
          animate={animationSpeed === 'fast' ? {
            opacity: [0, shapeOpacity, shapeOpacity],
            rotate: shapeAnimation === 'rotate' ? [0, 360] : 0,
            scale: shapeAnimation === 'pulse' ? [1, 2, 1] : 1
          } : {
            opacity: shapeOpacity * 0.5
          }}
          transition={animationSpeed === 'fast' ? {
            opacity: { duration: 0.5 },
            rotate: { duration: 6, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
          } : {
            duration: 1
          }}
        >
          ✦
        </motion.div>
      )}

      {selectedShapes.includes('slashes') && shapePositions.slash1 && (
        <>
          <motion.div 
            className="absolute h-1 transform rotate-45" 
            style={{ 
              backgroundColor: shapeColor,
              top: shapePositions.slash1.top,
              right: shapePositions.slash1.right,
              width: `${shapePositions.slash1.length}px`
            }}
            initial={{ opacity: 0 }}
            animate={animationSpeed === 'fast' ? {
              opacity: [0, shapeOpacity, shapeOpacity],
              scaleX: shapeAnimation === 'pulse' ? [1, 2, 1] : 1,
              scaleY: shapeAnimation === 'pulse' ? [1, 3, 1] : 1
            } : {
              opacity: shapeOpacity * 0.5
            }}
            transition={animationSpeed === 'fast' ? {
              opacity: { duration: 0.5 },
              scaleX: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
              scaleY: { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
            } : {
              duration: 1
            }}
          />
          <motion.div 
            className="absolute h-1 transform -rotate-45" 
            style={{ 
              backgroundColor: shapeColor,
              bottom: shapePositions.slash2.bottom,
              left: shapePositions.slash2.left,
              width: `${shapePositions.slash2.length}px`
            }}
            initial={{ opacity: 0 }}
            animate={animationSpeed === 'fast' ? {
              opacity: [0, shapeOpacity, shapeOpacity],
              scaleX: shapeAnimation === 'pulse' ? [1, 2.2, 1] : 1,
              scaleY: shapeAnimation === 'pulse' ? [1, 3.5, 1] : 1
            } : {
              opacity: shapeOpacity * 0.5
            }}
            transition={animationSpeed === 'fast' ? {
              opacity: { duration: 0.5 },
              scaleX: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              scaleY: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            } : {
              duration: 1
            }}
          />
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

      {/* Calming message - no box, strong glow for magic feel */}
      <AnimatePresence>
        {showCalmingMessage && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-60 pointer-events-none px-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6 }}
          >
            <motion.p 
              className="text-2xl sm:text-3xl md:text-4xl font-light text-white text-center"
              style={{ 
                textShadow: `
                  0 0 40px ${palette.colors[0]}, 
                  0 0 80px ${palette.colors[1]},
                  0 0 120px ${palette.colors[0]},
                  0 4px 8px rgba(0,0,0,0.8),
                  0 8px 16px rgba(0,0,0,0.6)
                `,
                fontFamily: 'Inter, system-ui, sans-serif',
                letterSpacing: '2px',
                fontWeight: '300'
              }}
              animate={{
                textShadow: [
                  `0 0 40px ${palette.colors[0]}, 0 0 80px ${palette.colors[1]}, 0 0 120px ${palette.colors[0]}, 0 4px 8px rgba(0,0,0,0.8)`,
                  `0 0 60px ${palette.colors[1]}, 0 0 120px ${palette.colors[2] || palette.colors[0]}, 0 0 160px ${palette.colors[1]}, 0 4px 8px rgba(0,0,0,0.8)`,
                  `0 0 40px ${palette.colors[0]}, 0 0 80px ${palette.colors[1]}, 0 0 120px ${palette.colors[0]}, 0 4px 8px rgba(0,0,0,0.8)`
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emoji stickers - NO glow at start, glow during calm, fade in fortune center */}
      {emojis.map((item) => {
        const colorIndex = Math.floor(Math.random() * palette.colors.length);
        const glowColor = palette.colors[colorIndex];
        const currentDuration = animationSpeed === 'fast' ? item.duration : 8;

        // Check if emoji is in fortune center zone
        const inFortuneZone = item.x > 20 && item.x < 80 && item.y > 15 && item.y < 50;
        const fortuneOpacity = (fortuneFloated && inFortuneZone) ? 0.15 : item.opacity;

        // No glow during explosion, glow during calm
        const currentFilter = animationSpeed === 'fast' 
          ? 'none' 
          : `drop-shadow(0 0 8px ${glowColor})`;

        // Different motion patterns based on emojiMotion
        let motionPattern = {};
        if (emojiMotion === 'spiral') {
          motionPattern = {
            rotate: [item.rotation, item.rotation + 720],
            x: [0, 30, -30, 0],
            y: [0, -40, 40, 0]
          };
        } else if (emojiMotion === 'bounce') {
          motionPattern = {
            rotate: [item.rotation, item.rotation + 360],
            y: [0, -50, 0, -30, 0],
            x: [0, 10, -10, 0]
          };
        } else if (emojiMotion === 'jitter') {
          motionPattern = {
            rotate: [item.rotation, item.rotation + 180, item.rotation - 180, item.rotation],
            y: [0, -15, 15, -10, 10, 0],
            x: [0, -15, 15, -10, 10, 0]
          };
        } else {
          // smooth (default)
          motionPattern = {
            rotate: [item.rotation, item.rotation + 360],
            y: [0, -30, 0, 30, 0],
            x: [0, 20, -20, 0]
          };
        }

        return (
          <motion.div
            key={item.id}
            className={`absolute ${item.size} cursor-pointer z-25`}
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              filter: currentFilter
            }}
            initial={{ 
              scale: 0,
              rotate: item.rotation,
              opacity: 0
            }}
            animate={{ 
              scale: [0, 1.2, 1],
              ...motionPattern,
              opacity: animationSpeed === 'fast' ? fortuneOpacity : fortuneOpacity * 0.6,
              filter: animationSpeed === 'fast' ? 'none' : `drop-shadow(0 0 8px ${glowColor})`
            }}
            transition={{
              scale: { delay: item.delay, duration: 0.4 },
              opacity: { delay: item.delay, duration: animationSpeed === 'fast' ? 0.3 : 1 },
              filter: { duration: 1 },
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

      {/* Small scattered phrases - VISIBLE during explosion, fade during calm AND in fortune zone */}
      {smallPhrases.map((phrase) => {
        // Check if phrase is in fortune center zone
        const inFortuneZone = phrase.x > 20 && phrase.x < 80 && phrase.y > 15 && phrase.y < 50;
        const phraseOpacity = fortuneFloated && inFortuneZone 
          ? 0.1 
          : (animationSpeed === 'fast' ? 0.95 : 0.2);

        return (
          <motion.div
            key={phrase.id}
            className={`absolute ${phrase.size} ${font} font-bold text-white z-20 pointer-events-none`}
            style={{
              left: `${phrase.x}%`,
              top: `${phrase.y}%`
            }}
            initial={{ scale: 0, rotate: -10, opacity: 0 }}
            animate={{ 
              scale: 1,
              rotate: [0, 5, -5, 0],
              opacity: phraseOpacity
            }}
            transition={{
              delay: phrase.delay,
              scale: { duration: 0.3 },
              opacity: { duration: animationSpeed === 'fast' ? 0.3 : 1 },
              rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            {phrase.text}
          </motion.div>
        );
      })}

      {/* Fortune - positioned at 25%, emojis/shapes fade in center */}
      <AnimatePresence>
        {fortuneFloated && (
          <motion.div
            className="absolute z-70 pointer-events-none w-full px-4 flex items-center justify-center"
            style={{ 
              left: 0,
              right: 0,
              top: '25%',
              transform: 'translateY(-50%)'
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
              className="backdrop-blur-xl rounded-3xl p-6 sm:p-8 w-full max-w-xl"
              style={{
                background: 'rgba(0, 0, 0, 0.65)',
                border: `2px solid ${palette.colors[0]}60`,
                boxShadow: `0 12px 48px 0 rgba(0, 0, 0, 0.5), 0 0 80px ${palette.colors[0]}40`
              }}
            >
              {/* Modern typography layout */}
              <div className="space-y-4 text-center">
                {/* Fortune header */}
                <div>
                  <p 
                    className="text-base sm:text-lg font-light tracking-[0.3em] uppercase mb-2"
                    style={{ 
                      color: palette.colors[0],
                      fontFamily: 'Inter, system-ui, sans-serif'
                    }}
                  >
                    Fortune
                  </p>
                  <p 
                    className="text-sm sm:text-base text-white/80"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                  >
                    based on your unique big scream energy
                  </p>
                </div>

                {/* Divider */}
                <div 
                  className="w-20 h-px mx-auto"
                  style={{ background: `linear-gradient(90deg, transparent, ${palette.colors[0]}, transparent)` }}
                />

                {/* Advice/affirmation - slightly smaller */}
                <motion.p 
                  className="text-lg sm:text-xl md:text-2xl font-medium text-white leading-relaxed px-4"
                  style={{ 
                    fontFamily: 'Inter, system-ui, sans-serif',
                    textShadow: `0 0 15px ${palette.colors[0]}80, 0 2px 4px rgba(0,0,0,0.5)`
                  }}
                  animate={{
                    textShadow: [
                      `0 0 15px ${palette.colors[0]}80, 0 2px 4px rgba(0,0,0,0.5)`,
                      `0 0 25px ${palette.colors[1]}90, 0 2px 4px rgba(0,0,0,0.5)`,
                      `0 0 15px ${palette.colors[0]}80, 0 2px 4px rgba(0,0,0,0.5)`
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
                  className="text-sm sm:text-base text-white/90 leading-relaxed px-4"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  Channel your <span className="font-semibold" style={{ color: palette.colors[1] }}>{screamType.name}</span> vibe {connectorPhrase}
                </p>

                {/* Divider */}
                <div 
                  className="w-28 h-px mx-auto"
                  style={{ background: `linear-gradient(90deg, transparent, ${palette.colors[1]}, transparent)` }}
                />

                {/* Prediction header */}
                <p 
                  className="text-sm sm:text-base font-light tracking-[0.2em] uppercase"
                  style={{ 
                    color: palette.colors[1],
                    fontFamily: 'Inter, system-ui, sans-serif'
                  }}
                >
                  Your prediction
                </p>

                {/* Cosmic prediction - slightly smaller */}
                <motion.p 
                  className="text-base sm:text-lg md:text-xl font-medium text-white leading-relaxed px-4"
                  style={{ 
                    fontFamily: 'Inter, system-ui, sans-serif',
                    textShadow: `0 0 15px ${palette.colors[1]}80, 0 2px 4px rgba(0,0,0,0.5)`
                  }}
                  animate={{
                    textShadow: [
                      `0 0 15px ${palette.colors[1]}80, 0 2px 4px rgba(0,0,0,0.5)`,
                      `0 0 25px ${palette.colors[2] || palette.colors[0]}90, 0 2px 4px rgba(0,0,0,0.5)`,
                      `0 0 15px ${palette.colors[1]}80, 0 2px 4px rgba(0,0,0,0.5)`
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
                exit: { duration: 1.2 }
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

      {/* Scream Counter - between fortune and buttons */}
      <AnimatePresence>
        {fortuneFloated && (
          <motion.div
            className="absolute bottom-32 sm:bottom-36 left-0 right-0 z-60 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <motion.button
              onClick={() => onNavigate('ranks')}
              className="backdrop-blur-md px-4 py-2 rounded-full text-white/90 text-xs sm:text-sm font-medium"
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                border: `1px solid ${palette.colors[0]}40`
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {dailyCount} {dailyCount === 1 ? 'scream' : 'screams'} today / {screamCount} total
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Buttons - smaller to give fortune more room */}
      <motion.div 
        className="absolute bottom-20 sm:bottom-24 left-0 right-0 flex flex-wrap justify-center gap-2 px-4 z-50"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          onClick={onReset}
          className="px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-md text-white font-bold text-sm sm:text-base rounded-full shadow-xl border-2"
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
          className="px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-md text-white font-bold text-sm sm:text-base rounded-full shadow-xl border-2"
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
          className="px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-md text-white font-bold text-sm sm:text-base rounded-full shadow-xl border-2"
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
