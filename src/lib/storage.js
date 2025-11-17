// localStorage helpers for Big Scream Energy

// Scream count - tracks both daily and total, resets daily at midnight
export function getScreamCount() {
  // Check if we need to reset daily count
  const today = new Date().toDateString();
  const lastScreamDate = localStorage.getItem('bse_last_scream_date');
  
  if (lastScreamDate !== today) {
    // New day - reset daily count
    localStorage.setItem('bse_daily_screams', '0');
    localStorage.setItem('bse_last_scream_date', today);
  }
  
  const daily = localStorage.getItem('bse_daily_screams');
  const total = localStorage.getItem('bse_total_screams');
  
  return {
    daily: daily ? parseInt(daily) : 0,
    total: total ? parseInt(total) : 0
  };
}

export function incrementScreamCount() {
  const today = new Date().toDateString();
  const lastScreamDate = localStorage.getItem('bse_last_scream_date');
  
  // Reset daily if it's a new day
  if (lastScreamDate !== today) {
    localStorage.setItem('bse_daily_screams', '0');
    localStorage.setItem('bse_last_scream_date', today);
  }
  
  // Increment both counters
  const currentDaily = parseInt(localStorage.getItem('bse_daily_screams') || '0');
  const currentTotal = parseInt(localStorage.getItem('bse_total_screams') || '0');
  
  const newDaily = currentDaily + 1;
  const newTotal = currentTotal + 1;
  
  localStorage.setItem('bse_daily_screams', String(newDaily));
  localStorage.setItem('bse_total_screams', String(newTotal));
  localStorage.setItem('bse_last_scream_date', today);
  
  return {
    daily: newDaily,
    total: newTotal
  };
}

export function resetScreamCount() {
  localStorage.setItem('bse_daily_screams', '0');
  localStorage.setItem('bse_total_screams', '0');
  localStorage.setItem('bse_last_scream_date', new Date().toDateString());
  return {
    daily: 0,
    total: 0
  };
}

// Emoji usage tracking
export function getEmojiCounts() {
  const saved = localStorage.getItem('emojiCounts');
  return saved ? JSON.parse(saved) : {};
}

export function incrementEmojiCount(emoji) {
  const counts = getEmojiCounts();
  counts[emoji] = (counts[emoji] || 0) + 1;
  localStorage.setItem('emojiCounts', JSON.stringify(counts));
  return counts[emoji];
}

export function getTopEmojis(limit = 3) {
  const counts = getEmojiCounts();
  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([emoji]) => emoji);
}

// Email capture (optional)
export function saveEmail(email) {
  localStorage.setItem('userEmail', email);
}

export function getEmail() {
  return localStorage.getItem('userEmail');
}

// Clear all data
export function clearAllData() {
  localStorage.removeItem('screamCount');
  localStorage.removeItem('emojiCounts');
  localStorage.removeItem('userEmail');
}
