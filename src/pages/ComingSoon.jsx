export default function ComingSoon({ onBack, title = "Coming Soon" }) {
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

      <main className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-8xl mb-8">🚧</div>
        
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          {title}
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          We're building something cool. Stay tuned.
        </p>

        <button
          onClick={onBack}
          className="px-8 py-3 bg-black text-white font-bold rounded-full hover:scale-105 transition-transform"
        >
          Back to Screaming
        </button>
      </main>
    </div>
  );
}
