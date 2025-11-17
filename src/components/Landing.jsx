import { useState } from 'react';
import { getEmojiCounts, incrementEmojiCount } from '../lib/storage';

const EMOJI_STRIP = ['🔥', '💣', '😤', '🤯', '💥', '🫠', '🌀', '💫', '💀', '🎸', '🧨'];

export default function Landing({ onScream, screamCount, onNavigate }) {
  const [text, setText] = useState('');
  const [emojiCounts] = useState(() => getEmojiCounts());

  const handleEmojiClick = (emoji) => {
    setText(text + emoji);
    incrementEmojiCount(emoji);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header - just logo, no nav */}
      <header className="border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-center sm:justify-start">
          <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 pb-1">
            Big Scream Energy
          </h1>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 pb-4">
        <div className="w-full max-w-3xl">
          {/* Intro text */}
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Sometimes you just need to scream
            </h2>
            <p className="text-gray-600 text-lg mb-4">
              Type whatever's on your mind. We won't save it, store it, or judge it.
            </p>
            <p className="text-gray-500 text-base">
              A safe, private space to let it all out. No storage, no judgment, just pure release.
            </p>
          </div>

          {/* Text input */}
          <div className="mb-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type nonsense. Smash keys. Let it out."
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
            />
          </div>

          {/* Emoji strip */}
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            {EMOJI_STRIP.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleEmojiClick(emoji)}
                className="text-3xl hover:scale-125 transition-transform active:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-lg p-2"
                title="Click to add emoji"
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Scream button */}
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={() => onScream(text)}
              disabled={!text.trim()}
              className="px-12 py-4 bg-black text-white font-bold text-xl rounded-full hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
            >
              SCREAM
            </button>
            
            {screamCount.daily > 0 && (
              <p className="text-sm text-gray-500">
                You've screamed {screamCount.daily} time{screamCount.daily !== 1 ? 's' : ''} today
              </p>
            )}
          </div>
        </div>
      </main>

      {/* Footer - fixed to bottom with better spacing */}
      <footer className="border-t border-gray-200 px-4 py-6 text-center mt-auto">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-6 text-sm text-gray-600 mb-2">
          <button onClick={() => onNavigate('about')} className="hover:text-gray-900">
            About
          </button>
          <span className="hidden sm:inline text-gray-300">|</span>
          <button onClick={() => onNavigate('ranks')} className="hover:text-gray-900">
            Ranks
          </button>
          <span className="hidden sm:inline text-gray-300">|</span>
          <button onClick={() => onNavigate('privacy')} className="hover:text-gray-900">
            Privacy
          </button>
          <span className="hidden sm:inline text-gray-300">|</span>
          <button onClick={() => onNavigate('shop')} className="text-gray-400 hover:text-gray-600">
            Shop (Coming Soon)
          </button>
          <span className="hidden sm:inline text-gray-300">|</span>
          <button onClick={() => onNavigate('team')} className="text-gray-400 hover:text-gray-600">
            Team (Coming Soon)
          </button>
        </div>
        <p className="text-xs text-gray-500">We don't save your screams. Promise.</p>
      </footer>
    </div>
  );
}
