export function getScreamRank(count) {
  if (count >= 500) return "The Void Itself";
  if (count >= 100) return "Chaos Overlord";
  if (count >= 51) return "Professional Screamer";
  if (count >= 31) return "Void Veteran";
  if (count >= 16) return "Certified Lunatic";
  if (count >= 6) return "Chaos Enthusiast";
  return "Novice Screamer";
}

export function getRankDescription(rank) {
  const descriptions = {
    "The Void Itself": "You've transcended screaming. The void screams through you.",
    "Chaos Overlord": "You command the chaos. Others scream. You orchestrate.",
    "Professional Screamer": "This is no longer a hobby. This is who you are.",
    "Void Veteran": "You've stared into the void long enough to know its secrets.",
    "Certified Lunatic": "Officially unhinged. Wear it with pride.",
    "Chaos Enthusiast": "You're getting the hang of this chaos thing.",
    "Novice Screamer": "Welcome to the void. Your journey begins."
  };
  return descriptions[rank] || "";
}

export function getRankProgress(count) {
  const thresholds = [
    { min: 0, max: 5, name: "Novice Screamer" },
    { min: 6, max: 15, name: "Chaos Enthusiast" },
    { min: 16, max: 30, name: "Certified Lunatic" },
    { min: 31, max: 50, name: "Void Veteran" },
    { min: 51, max: 99, name: "Professional Screamer" },
    { min: 100, max: 499, name: "Chaos Overlord" },
    { min: 500, max: Infinity, name: "The Void Itself" }
  ];

  const currentTier = thresholds.find(t => count >= t.min && count <= t.max);
  if (!currentTier) return { current: count, next: 6, remaining: 6 };

  const nextThreshold = currentTier.max === Infinity ? null : currentTier.max + 1;
  const remaining = nextThreshold ? nextThreshold - count : 0;

  return {
    current: count,
    next: nextThreshold,
    remaining: remaining,
    percentage: nextThreshold ? ((count - currentTier.min) / (currentTier.max - currentTier.min + 1)) * 100 : 100
  };
}
