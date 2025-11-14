import { useState, useEffect } from 'react';
import Landing from './components/Landing';
import ChaosScreen from './components/ChaosScreen';
import About from './pages/About';
import Privacy from './pages/Privacy';
import ComingSoon from './pages/ComingSoon';
import { getScreamCount, incrementScreamCount } from './lib/storage';

function App() {
  const [view, setView] = useState('landing'); // 'landing', 'chaos', 'about', 'privacy', 'shop', 'team'
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

  if (view === 'shop' || view === 'team') {
    return <ComingSoon onBack={() => setView('landing')} title={view === 'shop' ? 'Shop Coming Soon' : 'Team Coming Soon'} />;
  }

  if (view === 'chaos') {
    return <ChaosScreen screamCount={screamCount} onReset={handleReset} />;
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
