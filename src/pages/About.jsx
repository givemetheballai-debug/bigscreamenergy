export default function About({ onBack, onNavigate }) {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg"></div>
          <span className="font-semibold text-gray-900">Big Scream Energy</span>
        </div>
        <button 
          onClick={onBack}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back
        </button>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">About Big Scream Energy</h1>
        
        <div className="prose prose-lg">
          <p className="text-gray-700 mb-4">
            Sometimes you just need to scream into the void. No judgment, no storage, no consequences.
          </p>

          <p className="text-gray-700 mb-4">
            <strong>Big Scream Energy</strong> is a simple, safe space to let it all out. Type whatever's 
            on your mind, hit SCREAM, and watch the chaos unfold.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How it works</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Type your thoughts in the text box</li>
            <li>Click SCREAM</li>
            <li>Experience the chaos explosion</li>
            <li>Share your achievement (no text included)</li>
            <li>Do it again whenever you need</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Your privacy matters</h2>
          <p className="text-gray-700 mb-4">
            We never save, store, or transmit anything you type. Your text exists only in your 
            browser for a few seconds, then it's gone forever. We only track how many times you've 
            screamed (stored locally on your device).
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why we built this</h2>
          <p className="text-gray-700 mb-4">
            Because everyone needs a release valve. Because the internet doesn't have enough 
            places to just... let go. Because Lisa Frank vibes make everything better.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">About the creator</h2>
          <p className="text-gray-700 mb-4">
            Created by Jamie - Jamie Williams is a writer, product strategist, and AI builder making fun, playful tools and mini-games across astrology, culture, and women's sports. She blends vibes, strategy, data, and storytelling into intuitive products people actually want to use. She's building fast with AI — and sharing everything she learns at buildwithjamie.com.
          </p>

          <p className="text-gray-700 mt-8">
            Built with 💜 for anyone who's ever needed to scream.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 px-4 py-6 mt-12 text-center">
        <div className="flex justify-center gap-6 text-sm text-gray-600 mb-2">
          <button onClick={onBack} className="hover:text-gray-900">
            Home
          </button>
          <span className="text-gray-300">|</span>
          <button onClick={() => onNavigate('ranks')} className="hover:text-gray-900">
            Ranks
          </button>
          <span className="text-gray-300">|</span>
          <button onClick={() => onNavigate('privacy')} className="hover:text-gray-900">
            Privacy
          </button>
          <span className="text-gray-300">|</span>
          <button onClick={() => onNavigate('shop')} className="text-gray-400 hover:text-gray-600">
            Shop
          </button>
          <span className="text-gray-300">|</span>
          <button onClick={() => onNavigate('team')} className="text-gray-400 hover:text-gray-600">
            Team
          </button>
        </div>
      </footer>
    </div>
  );
}
