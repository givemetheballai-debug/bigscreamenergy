import { useState, useEffect } from 'react';
import Landing from './components/Landing';
import ChaosScreen from './components/ChaosScreen';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Ranks from './pages/Ranks';
import ComingSoon from './pages/ComingSoon';
import { getScreamCount, incrementScreamCount } from './lib/storage';

function App() {
  const [view, setView] = useState('landing'); // 'landing', 'chaos', 'about', 'privacy', 'ranks', 'shop', 'team'
  const [screamCount, setScreamCount] = useState(() => getScreamCount());

  const handleScream = () => {
    const newCount = incrementScreamCount();
    setScreamCount(newCount);
    setView('chaos');
  };

  const handleReset = () => {
    setView('landing');
  };

  if (view === 'about') {
    return <About onBack={() => setView('landing')} />;
  }

  if (view === 'privacy') {
    return <Privacy onBack={() => setView('landing')} />;
  }

  if (view === 'ranks') {
    return <Ranks onBack={() => setView('landing')} onNavigate={setView} />;
  }

  if (view === 'shop' || view === 'team') {
    return <ComingSoon onBack={() => setView('landing')} title={view === 'shop' ? 'Shop Coming Soon' : 'Team Coming Soon'} />;
  }

  if (view === 'chaos') {
    return <ChaosScreen screamCount={screamCount} onReset={handleReset} onNavigate={setView} />;
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
