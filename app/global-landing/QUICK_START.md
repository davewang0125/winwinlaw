# Quick Start Guide - Global Landing Page

## 🚀 Get Started in 30 Seconds

### 1. View Your New Page

The development server is already running. Open your browser:

```
http://localhost:3001/global-landing
```

### 2. Try These Interactions

✋ **Drag** - Click and drag anywhere to rotate the globe  
🖱️ **Scroll** - Use mouse wheel to zoom in/out  
☝️ **Hover** - Move cursor over glowing markers  
👆 **Click** - Click any marker to see country details  

## 📍 Navigation

Added to main site navigation:
- Homepage → "Global Network" link in header
- Or visit directly: `/global-landing`

## 🎨 What You're Seeing

### Top Section
- **"Global Legal Network"** title with gradient effect
- **Subtitle** with total country count
- **Animated background** with stars and glowing orbs

### Center
- **3D Interactive Globe** with 50 country markers
- **Cyan glowing markers** (larger = more professionals)
- **Hover tooltips** with country data
- **Click cards** with detailed statistics

### Bottom Section
- **Interaction hints** (rotate, zoom, hover)
- **Stats bar** showing global totals

## 🔧 Quick Customization

### Change Colors

Edit `app/global-landing/styles.css`:

```css
:root {
  --color-cosmic-teal: #YOUR_COLOR;    /* Change teal accent */
  --color-bright-cyan: #YOUR_COLOR;    /* Change cyan glow */
}
```

### Update Data

Edit `app/global-landing/components/countryData.ts`:

```typescript
export const countryData: Country[] = [
  { 
    name: 'Your Country', 
    lat: 40.0, 
    lng: -100.0, 
    professionals: 5000, 
    code: 'YC' 
  },
  // Add more...
]
```

### Change Stats

Edit `app/global-landing/page.tsx`:

```tsx
<div className="stat-value">47,892</div>
<div className="stat-label">Your Label</div>
```

## 🎯 Common Tasks

### Add a New Country

1. Open `components/countryData.ts`
2. Add new entry to `countryData` array
3. Use coordinates from [LatLong.net](https://www.latlong.net/)
4. Save and refresh

### Change Globe Size

Edit `InteractiveGlobe.tsx`:

```typescript
const globeRadius = 2  // Change this number
```

### Adjust Auto-Rotation Speed

Edit `InteractiveGlobe.tsx`:

```typescript
globeRef.current.rotation.y += 0.001  // Slower = smaller number
```

### Enable/Disable Auto-Rotation

Edit `InteractiveGlobe.tsx`:

```tsx
<OrbitControls
  autoRotate={true}        // Set to true/false
  autoRotateSpeed={0.5}    // Adjust speed
/>
```

## 📱 Mobile View

The page automatically adapts to mobile devices:
- Vertical stats layout
- Touch-friendly controls
- Simplified interactions
- Optimized sizing

Test it:
1. Open browser dev tools (F12)
2. Click mobile device icon
3. Select a device
4. Refresh page

## 🐛 Troubleshooting

### Globe Not Showing

**Check 1**: WebGL Support
- Visit: https://get.webgl.org/
- Should say "Your browser supports WebGL"

**Check 2**: Browser Console
- Press F12
- Look for error messages
- Share errors if you need help

**Check 3**: Dependencies
```bash
npm install
```

### Performance Issues

**Solution 1**: Reduce Quality
Edit `InteractiveGlobe.tsx`:
```tsx
<Sphere args={[globeRadius, 32, 32]}>  // Lower numbers = faster
```

**Solution 2**: Disable Effects
Comment out the atmosphere glow in `InteractiveGlobe.tsx`

**Solution 3**: Fewer Markers
Remove some countries from `countryData.ts`

### TypeScript Errors

```bash
npm install --save-dev @types/three
```

## 📚 File Reference

```
app/global-landing/
├── page.tsx                    ← Main page component
├── styles.css                  ← All styling (colors, animations)
├── components/
│   ├── InteractiveGlobe.tsx   ← 3D globe logic
│   └── countryData.ts         ← Country data (EDIT THIS)
├── README.md                   ← Full documentation
├── FEATURES.md                 ← Feature details
└── QUICK_START.md             ← This file
```

## 🎓 Key Technologies

- **Three.js**: 3D graphics library
- **React Three Fiber**: React wrapper for Three.js
- **@react-three/drei**: Helpful 3D components
- **Next.js**: React framework
- **TypeScript**: Type safety

## 🔗 Useful Links

- Three.js Docs: https://threejs.org/docs/
- R3F Docs: https://docs.pmnd.rs/react-three-fiber/
- Drei Components: https://github.com/pmndrs/drei

## 💡 Pro Tips

1. **Performance**: Keep marker count under 100 for best performance
2. **Coordinates**: Use country center, not capital city
3. **Testing**: Test on multiple browsers (Chrome, Firefox, Safari)
4. **Mobile**: Touch gestures work but mouse is smoother
5. **Zoom**: Set limits in OrbitControls (minDistance/maxDistance)

## 🎨 Design Decisions

**Why Dark Theme?**
- Better for 3D visualization
- Glow effects work better
- Professional, modern look
- Reduces eye strain

**Why Cyan/Teal?**
- High contrast with dark background
- Tech/future aesthetic
- Stands out without being harsh
- Complements data visualization

**Why Space Theme?**
- Global = world = space
- Creates depth and atmosphere
- Differentiates from competitors
- Memorable visual identity

## 🚀 Next Steps

1. ✅ View the page (you're here!)
2. 🎯 Try all interactions
3. 📝 Update country data with real numbers
4. 🎨 Customize colors to match brand
5. 📱 Test on mobile devices
6. 🔗 Share with team
7. 🚀 Deploy to production

## 📧 Need Help?

Check these files:
- Technical details: `README.md`
- Feature list: `FEATURES.md`
- Code comments in each file

---

**Enjoy your interactive global network visualization!** 🌍✨
