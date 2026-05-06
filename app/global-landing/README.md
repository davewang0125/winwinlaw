# Global Landing Page

An interactive 3D globe visualization showcasing legal professionals worldwide.

## Features

### 🌍 Interactive 3D Globe
- **Rotate**: Drag to rotate the globe in any direction
- **Zoom**: Scroll to zoom in/out
- **Auto-rotate**: Gentle automatic rotation when idle

### 📍 Country Markers
- Visual markers for 50+ countries
- Marker size scales based on professional count
- Hover effects with glow animations
- Click to select and view detailed information

### 💡 Hover Tooltips
- Real-time country information
- Display professional count
- Country code identification

### 📊 Selected Country Details
- Detailed card with statistics
- Percentage of global network
- Interactive close button
- Smooth animations

### 📈 Stats Bar
- Total legal professionals
- Number of countries
- Network activity percentage

## Technical Stack

- **React Three Fiber**: 3D rendering with React
- **Three.js**: WebGL 3D graphics library
- **@react-three/drei**: Useful helpers for R3F
- **Next.js**: React framework with App Router
- **TypeScript**: Type-safe development

## File Structure

```
app/global-landing/
├── page.tsx                      # Main landing page
├── styles.css                    # Comprehensive styling
├── components/
│   ├── InteractiveGlobe.tsx     # 3D globe component
│   └── countryData.ts           # Country data and utilities
└── README.md                     # This file
```

## Data Management

### Country Data Structure

```typescript
interface Country {
  name: string
  lat: number          // Latitude
  lng: number          // Longitude
  professionals: number // Count of legal professionals
  code: string         // ISO country code
}
```

### Updating Country Data

Edit `components/countryData.ts` to:
- Add new countries
- Update professional counts
- Modify coordinates

### Helper Functions

```typescript
getTotalProfessionals()           // Sum all professionals
getTopCountries(limit)            // Get top N countries
getCountryByCode(code)            // Find country by code
```

## Customization

### Colors & Theme

Edit CSS variables in `styles.css`:

```css
:root {
  --color-deep-space: #020817;
  --color-cosmic-teal: #00d4ff;
  --color-bright-cyan: #00ffff;
  /* ... */
}
```

### Globe Appearance

Modify globe materials in `InteractiveGlobe.tsx`:

```typescript
<meshStandardMaterial
  color="#0a1628"           // Base color
  emissive="#051020"        // Glow color
  metalness={0.3}           // Metallic effect
  roughness={0.7}           // Surface roughness
/>
```

### Marker Size & Appearance

Adjust marker calculation:

```typescript
const markerSize = useMemo(() => {
  const baseSize = 0.02
  const sizeMultiplier = Math.log(country.professionals + 1) / 10
  return baseSize + sizeMultiplier * 0.015
}, [country.professionals])
```

## Performance Optimization

- **Dynamic Import**: Globe loaded with `next/dynamic` for SSR optimization
- **Memoization**: Expensive calculations memoized with `useMemo`
- **Geometry Complexity**: Balanced sphere segments for performance
- **Animation**: Efficient `useFrame` for smooth 60fps rendering

## Browser Support

- Modern browsers with WebGL support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Accessibility

- Reduced motion support
- High contrast mode support
- Keyboard navigation friendly
- Screen reader considerations

## Future Enhancements

### Potential Features
- [ ] Search functionality for countries
- [ ] Filter by region
- [ ] Connection lines between countries
- [ ] Real-time data updates
- [ ] Export statistics
- [ ] Mobile touch gestures
- [ ] Country comparison mode
- [ ] Historical data visualization

### API Integration
Consider connecting to a backend API:

```typescript
// Example API integration
async function fetchCountryData() {
  const response = await fetch('/api/countries')
  return response.json()
}
```

## Usage

### Development

```bash
npm run dev
```

Navigate to: `http://localhost:3000/global-landing`

### Production

```bash
npm run build
npm start
```

## Dependencies

```json
{
  "three": "^0.x.x",
  "@types/three": "^0.x.x",
  "@react-three/fiber": "^9.x.x",
  "@react-three/drei": "^9.x.x"
}
```

## Design Philosophy

### Aesthetic Direction
- **Sophisticated dark theme** with cosmic/geospatial feel
- **Typography**: Modern geometric fonts (Outfit, Space Mono)
- **Color**: Deep space blues with bright cyan accents
- **Motion**: Smooth transitions and elegant animations
- **Spatial**: 3D depth with layered backgrounds

### Key Design Choices
- Avoided generic AI aesthetics (no Inter/Roboto, no purple gradients)
- Custom star field background for atmosphere
- Gradient orbs for depth
- Glowing effects for interactivity
- Professional, refined presentation

## Troubleshooting

### Globe Not Rendering
- Check WebGL support: Visit `get.webgl.org`
- Check browser console for errors
- Verify Three.js installation

### Performance Issues
- Reduce sphere geometry segments
- Decrease number of markers
- Disable auto-rotation
- Lower animation frame rate

### Type Errors
- Ensure TypeScript version compatibility
- Check `@types/three` installation
- Verify React Three Fiber types

## License

Part of the WinWin Law platform.
