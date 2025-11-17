import { motion } from 'framer-motion';
import { getScreamRank } from '../lib/ranks';
import { useEffect, useState } from 'react';

const RANKS = [
  {
    title: 'Novice Screamer',
    range: '1-5 screams',
    icon: '🌱',
    description: 'Just getting started. The void hears you, but you\'re still warming up.'
  },
  {
    title: 'Chaos Enthusiast',
    range: '6-15 screams',
    icon: '🔥',
    description: 'You\'re getting the hang of this. The chaos is calling your name.'
  },
  {
    title: 'Certified Lunatic',
    range: '16-30 screams',
    icon: '🤪',
    description: 'Officially unhinged. You know what you\'re doing and you\'re loving it.'
  },
  {
    title: 'Void Veteran',
    range: '31-50 screams',
    icon: '💫',
    description: 'A seasoned screamer. The void is your second home.'
  },
  {
    title: 'Professional Screamer',
    range: '51-99 screams',
    icon: '🏆',
    description: 'This is your career now. You could teach a masterclass.'
  },
  {
    title: 'Chaos Overlord',
    range: '100-499 screams',
    icon: '👑',
    description: 'You rule the chaos. Lesser screamers bow before you.'
  },
  {
    title: 'The Void Itself',
    range: '500+ screams',
    icon: '🌌',
    description: 'You have become one with the void. You ARE the chaos.'
  }
];

export default function Ranks({ onBack, onNavigate, onNewScream }) {
  const [totalScreams, setTotalScreams] = useState(0);
  const [dailyScreams, setDailyScreams] = useState(0);
  const [currentRank, setCurrentRank] = useState('');

  useEffect(() => {
    // Get scream counts from localStorage
    const storedTotal = localStorage.getItem('bse_total_screams');
    const storedDaily = localStorage.getItem('bse_daily_screams');
    const total = parseInt(storedTotal || '0');
    const daily = parseInt(storedDaily || '0');
    
    setTotalScreams(total);
    setDailyScreams(daily);
    setCurrentRank(getScreamRank(total));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-cyan-400 p-6 sm:p-10">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
        >
          <h1 className="text-5xl sm:text-7xl font-black text-white mb-4" style={{ textShadow: '4px 4px 0 rgba(0,0,0,0.3)' }}>
            Scream Ranks
          </h1>
          <p className="text-lg sm:text-xl text-white/90 font-medium">
            Your journey from novice to void itself
          </p>
        </motion.div>

        {/* Stats Box */}
        <motion.div
          className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-2xl mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl sm:text-3xl font-black text-gray-800 mb-4 text-center">Your Scream Stats</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-gray-600 text-sm font-medium mb-1">Today</p>
              <p className="text-4xl font-black text-purple-600">{dailyScreams}</p>
              <p className="text-gray-500 text-xs">{dailyScreams === 1 ? 'scream' : 'screams'}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600 text-sm font-medium mb-1">All-time</p>
              <p className="text-4xl font-black text-pink-600">{totalScreams}</p>
              <p className="text-gray-500 text-xs">{totalScreams === 1 ? 'scream' : 'screams'}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600 text-sm font-medium mb-1">Your Rank</p>
              <p className="text-2xl sm:text-3xl font-black text-cyan-600">{currentRank}</p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mb-8 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={onBack}
            className="px-8 py-4 bg-white text-purple-600 font-bold text-lg rounded-full shadow-xl hover:scale-105 transition"
          >
            Back to My Scream
          </button>
          <button
            onClick={onNewScream}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-lg rounded-full shadow-xl hover:scale-105 transition"
          >
            New Scream
          </button>
        </motion.div>

        {/* Rank Cards */}
        <div className="space-y-4 mb-12">
          {RANKS.map((rank, index) => (
            <motion.div
              key={rank.title}
              className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-xl"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl sm:text-6xl">{rank.icon}</div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <h2 className="text-2xl sm:text-3xl font-black text-gray-800">
                      {rank.title}
                    </h2>
                    <span className="text-sm sm:text-base font-bold text-purple-600 mt-1 sm:mt-0">
                      {rank.range}
                    </span>
                  </div>
                  <p className="text-base sm:text-lg text-gray-600">
                    {rank.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* How It Works */}
        <motion.div
          className="bg-black/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 text-white mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
        >
          <h2 className="text-2xl sm:text-3xl font-black mb-4">How It Works</h2>
          <div className="space-y-3 text-base sm:text-lg text-white/90">
            <p>
              <strong className="text-white">Your Personal Counter:</strong> Every time you scream, your personal count increases. This number lives in your browser and never leaves your device.
            </p>
            <p>
              <strong className="text-white">Ranks Level Up:</strong> As you accumulate more screams, you'll progress through the ranks. Each rank comes with its own title and message.
            </p>
            <p>
              <strong className="text-white">Global Counter:</strong> We track total screams anonymously across all users. No personal data, just pure chaos statistics.
            </p>
            <p>
              <strong className="text-white">Privacy First:</strong> Your scream count is stored locally on your device. We don't know who you are, what you screamed, or when you screamed it.
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          <div className="flex justify-center gap-4 sm:gap-6 text-sm text-white/80 font-medium flex-wrap">
            <button onClick={() => onNavigate('landing')} className="hover:text-white transition">Home</button>
            <button onClick={() => onNavigate('about')} className="hover:text-white transition">About</button>
            <button onClick={() => onNavigate('privacy')} className="hover:text-white transition">Privacy</button>
            <button onClick={() => onNavigate('shop')} className="hover:text-white transition">Shop</button>
            <button onClick={() => onNavigate('team')} className="hover:text-white transition">Team</button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
