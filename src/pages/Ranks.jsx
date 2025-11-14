import { motion } from 'framer-motion';

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

export default function Ranks({ onBack, onNavigate }) {
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
          className="text-center mb-12"
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

        {/* Rank Cards */}
        <div className="space-y-4 mb-12">
          {RANKS.map((rank, index) => (
            <motion.div
              key={rank.title}
              className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-xl"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
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
          transition={{ delay: 0.8 }}
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

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <button
            onClick={onBack}
            className="inline-block px-8 py-4 bg-white text-purple-600 font-bold text-lg rounded-full shadow-xl hover:scale-105 transition"
          >
            Start Screaming 🔊
          </button>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="flex justify-center gap-4 sm:gap-6 text-sm text-white/80 font-medium flex-wrap">
            <button onClick={onBack} className="hover:text-white transition">Home</button>
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
