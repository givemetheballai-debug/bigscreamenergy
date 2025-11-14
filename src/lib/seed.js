// Generate unique seed for each scream
export function generateSeed() {
  return Date.now() + Math.floor(Math.random() * 1000000);
}

// Seeded random number generator (for reproducible chaos)
export class SeededRandom {
  constructor(seed) {
    this.seed = seed;
  }

  // Park-Miller PRNG
  next() {
    this.seed = (this.seed * 16807) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }

  // Random integer between min and max (inclusive)
  nextInt(min, max) {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  // Random element from array
  pick(array) {
    return array[this.nextInt(0, array.length - 1)];
  }

  // Shuffle array
  shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

// Get seed from URL or generate new one
export function getSeedFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const seed = params.get('seed');
  return seed ? parseInt(seed) : null;
}

// Add seed to URL for sharing
export function addSeedToUrl(seed) {
  const url = new URL(window.location);
  url.searchParams.set('seed', seed);
  return url.toString();
}
