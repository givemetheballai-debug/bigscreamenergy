export default function Privacy({ onBack }) {
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
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        
        <div className="prose prose-lg">
          <p className="text-sm text-gray-500 mb-8">Last updated: November 2025</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What we collect</h2>
          <p className="text-gray-700 mb-4">
            Almost nothing. Specifically:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
            <li><strong>Your scream count</strong> - stored locally in your browser only</li>
            <li><strong>Basic analytics</strong> - page views, browser type (no personal data)</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What we DON'T collect</h2>
          <p className="text-gray-700 mb-4">
            The important part:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
            <li><strong>Your text</strong> - never stored, never transmitted, never seen by anyone</li>
            <li><strong>Personal information</strong> - no names, emails, or accounts required</li>
            <li><strong>Tracking data</strong> - no cross-site tracking or behavioral profiling</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How it works</h2>
          <p className="text-gray-700 mb-4">
            When you type in the text box and click SCREAM:
          </p>
          <ol className="list-decimal pl-6 text-gray-700 space-y-2 mb-6">
            <li>Your text exists only in your browser's memory</li>
            <li>We increment your scream counter (stored in localStorage)</li>
            <li>The chaos screen appears</li>
            <li>Your text is immediately discarded (it's never sent anywhere)</li>
          </ol>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Cookies & localStorage</h2>
          <p className="text-gray-700 mb-4">
            We use localStorage to remember your scream count. This data never leaves your device. 
            You can clear it anytime by clearing your browser data.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Third-party services</h2>
          <p className="text-gray-700 mb-4">
            We use basic analytics to understand how many people use the site. No personal data 
            is shared with third parties.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Your rights</h2>
          <p className="text-gray-700 mb-4">
            Since we don't collect personal data, there's nothing to request, delete, or export. 
            You're in complete control.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Changes to this policy</h2>
          <p className="text-gray-700 mb-4">
            If we make changes, we'll update this page. We'll never start collecting text or 
            personal data - that's our core promise.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact</h2>
          <p className="text-gray-700 mb-4">
            Questions? Concerns? Want to scream at us? We get it. 
            (Contact info would go here once we set it up)
          </p>

          <p className="text-gray-700 mt-8 text-sm italic">
            TL;DR: We don't see your screams. We don't want to see your screams. Scream freely.
          </p>
        </div>
      </main>
    </div>
  );
}
