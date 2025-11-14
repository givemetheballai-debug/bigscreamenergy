// This will work with Vercel KV (Redis)
// After deploying, add KV database in Vercel dashboard

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // For now, return a mock count
    // Once Vercel KV is set up, replace with:
    // const { kv } = await import('@vercel/kv');
    // const count = await kv.incr('global-scream-count');
    
    const mockCount = Math.floor(Math.random() * 10000) + 5000;
    
    return res.status(200).json({ 
      count: mockCount,
      message: 'Global scream counter (demo mode - add Vercel KV for real counter)'
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to get scream count' });
  }
}
