import { useState, useEffect } from 'react';
import Landing from './components/Landing';
import ChaosScreen from './components/ChaosScreen';
import About from './pages/About';
import Privacy from './pages/Privacy';
import ComingSoon from './pages/ComingSoon';
import { getScreamCount, incrementScreamCount } from './lib/storage';
import { generateSeed, getSeed } from './lib/seed';

function App() {
  const [view, setView] = useState('landing'); // 'landing', 'chaos', 'about', 'privacy', 'shop', 'team'
  const [screamCount, setScreamCount] = useState(() => getScreamCount());
  const [currentSeed, setCurrentSeed] = useState(null);

  useEffect(() => {
    // Check if there's a seed in URL (shared link)
    const urlSeed = getSeed();
    if (urlSeed) {
      setCurrentSeed(urlSeed);
      setView('chaos');
    }
  }, []);

  const handleScream = () => {
    const newCount = incrementScreamCount();
    setScreamCount(newCount);
    
    // Generate new seed for this scream
    const seed = generateSeed();
    setCurrentSeed(seed);
    
    setView('chaos');
  };

  const handleReset = () => {
    setView('landing');
    setCurrentSeed(null);
  };

  if (view === 'about') {
    return <About onBack={() => setView('landing')} />;
  }

  if (view === 'privacy') {
    return <Privacy onBack={() => setView('landing')} />;
  }

  if (view === 'shop') {
    return <ComingSoon onBack={() => setView('landing')} title="Shop Coming Soon" />;
  }

  if (view === 'team') {
    return <ComingSoon onBack={() => setView('landing')} title="Team Coming Soon" />;
  }

  if (view === 'chaos') {
    return <ChaosScreen screamCount={screamCount} seed={currentSeed} onReset={handleReset} />;
  }

  return (
    <Landing 
      onScream={handleScream} 
      screamCount={screamCount}
      onNavigate={setView}
    />
  );
}

export default App;
