export function getScreamRank(count) {
  if (count === 1) {
    return {
      title: "Novice Screamer",
      message: "Welcome to the chaos! 🎉"
    };
  }
  
  if (count <= 5) {
    return {
      title: "Novice Screamer",
      message: "You're getting the hang of it!"
    };
  }
  
  if (count <= 15) {
    return {
      title: "Chaos Enthusiast",
      message: "The void hears you!"
    };
  }
  
  if (count <= 30) {
    return {
      title: "Certified Lunatic",
      message: "You've found your happy place!"
    };
  }
  
  if (count <= 50) {
    return {
      title: "Void Veteran",
      message: "The void whispers back!"
    };
  }
  
  if (count <= 99) {
    return {
      title: "Professional Screamer",
      message: "You are one with the chaos!"
    };
  }
  
  if (count <= 499) {
    return {
      title: "Chaos Overlord",
      message: "The void respects your dedication!"
    };
  }
  
  return {
    title: "The Void Itself",
    message: "You ARE the void! 🌌"
  };
}
