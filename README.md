# Big Scream Energy - Deployment Guide

## 🚀 Quick Deploy

### 1. Push to GitHub
```bash
cd big-scream-energy
git init
git add .
git commit -m "Initial commit - Big Scream Energy"
git branch -M main
git remote add origin [your-repo-url]
git push -u origin main
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Import your GitHub repo
4. Framework preset: **Vite**
5. Click **Deploy**

### 3. Add Vercel KV (Optional - for global counter)
1. In Vercel dashboard → **Storage** tab
2. Create new **KV** database
3. Connect it to your project
4. Update `/api/scream-count.js` to use real KV:
```javascript
const { kv } = await import('@vercel/kv');
const count = await kv.incr('global-scream-count');
```

### 4. Point Your Domain
1. In Vercel → **Settings** → **Domains**
2. Add: `bigscreamenergy.com`
3. Follow DNS configuration instructions

## 🧪 Test Locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`

## 📁 Project Structure

```
big-scream-energy/
├── src/
│   ├── components/
│   │   ├── Landing.jsx          # Calm ChatGPT-style landing
│   │   └── ChaosScreen.jsx      # Lisa Frank explosion
│   ├── pages/
│   │   ├── About.jsx            # About page
│   │   └── Privacy.jsx          # Privacy policy
│   ├── lib/
│   │   └── ranks.js             # Scream achievement ranks
│   ├── App.jsx                  # Main app with routing
│   └── index.css                # Tailwind styles
├── api/
│   └── scream-count.js          # Global counter endpoint
└── vercel.json                  # Vercel config
```

## 🎨 Features

✅ Calm landing page (ChatGPT aesthetic)  
✅ Lisa Frank chaos explosion  
✅ Confetti animations  
✅ Achievement ranks  
✅ Local scream counter  
✅ Share as PNG  
✅ Global counter (needs Vercel KV)  
✅ Privacy-first (text never stored)  
✅ Mobile responsive  

## 🔐 Privacy & Safety

- User text is **never** rendered in the DOM
- Nothing is transmitted to servers
- localStorage only tracks scream count
- No personal data collected

## ⚡ Next Steps

1. Test the full flow end-to-end
2. Add Vercel KV for real global counter
3. Test mobile responsiveness
4. Share with friends to test viral mechanics
5. Monitor analytics

## 🛠 Built With

- React + Vite
- Tailwind CSS
- Framer Motion
- canvas-confetti
- html-to-image
- Vercel (hosting + serverless)

---

Built with the workflow: **align → mockup → build clean**  
No inline styles. Scalable from day one.
