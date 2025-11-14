// localStorage helpers for Big Scream Energy

// Scream count
export function getScreamCount() {
  const saved = localStorage.getItem('screamCount');
  return saved ? parseInt(saved) : 0;
}

export function incrementScreamCount() {
  const current = getScreamCount();
  const newCount = current + 1;
  localStorage.setItem('screamCount', newCount);
  return newCount;
}

export function resetScreamCount() {
  localStorage.setItem('screamCount', '0');
  return 0;
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
