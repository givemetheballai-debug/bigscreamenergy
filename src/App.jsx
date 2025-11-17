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
  const [userText, setUserText] = useState(''); // Store user's scream text
  const [screamId, setScreamId] = useState(0); // Unique ID for each scream to prevent re-randomization

  const handleScream = (text) => {
    setUserText(text); // Capture the text
    setScreamId(prev => prev + 1); // Increment ID for new scream
    const newCount = incrementScreamCount();
    setScreamCount(newCount);
    setView('chaos');
  };

  const handleReset = () => {
    setUserText(''); // Clear text for next scream
    setView('landing');
  };

  const handleNewScream = () => {
    setUserText(''); // Clear text
    setView('landing');
  };

  if (view === 'about') {
    return <About onBack={() => setView('landing')} onNavigate={setView} />;
  }

  if (view === 'privacy') {
    return <Privacy onBack={() => setView('landing')} />;
  }

  if (view === 'ranks') {
    return <Ranks onNavigate={setView} onNewScream={handleNewScream} />;
  }

  if (view === 'shop' || view === 'team') {
    return <ComingSoon onBack={() => setView('landing')} title={view === 'shop' ? 'Shop Coming Soon' : 'Team Coming Soon'} />;
  }

  if (view === 'chaos') {
    return <ChaosScreen userText={userText} onReset={handleReset} onNavigate={setView} globalCount={screamId} screamCount={screamCount} />;
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
