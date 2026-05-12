# Landing2 - WinWin Law Global Landing Page

A professional landing page featuring a rotatable half-globe and search functionality for lawyers and legal issues.

## 🎯 Features

### ✨ Hero Section
- **Half Globe Visualization**: Interactive 3D globe cut in half, rotatable by user
- **Prominent Search Bar**: Text-based search for lawyers and legal issues
- **Clear Messaging**: Focus on global litigation, mediation & arbitration

### 🔍 Search Functionality
- Two search boxes: one in hero, one in CTA section
- Placeholder ready for search implementation
- Form submission handling included

### 📄 Content Sections

1. **Services Section**
   - Global Litigation
   - Mediation Services  
   - International Arbitration
   
2. **Why Choose Us**
   - 150+ Countries Covered
   - 10,000+ Legal Professionals
   - 24/7 Global Support
   - 98% Success Rate

3. **Call-to-Action Section**
   - Secondary search form
   - Encourages user engagement

4. **Footer**
   - Simple, clean design
   - Copyright information

## 🎨 Design

**Inspired by**: https://winwindigitallaw.com/

**Typography**:
- Display: Playfair Display (elegant serif)
- Body: Inter (clean sans-serif)

**Color Scheme**:
- Primary: #0066cc (blue)
- Accent: #0099ff (light blue)
- Background: Light gray gradient
- Text: Dark gray/black

**Layout**:
- Hero: Split layout (content left, globe right)
- Responsive design for all screen sizes
- Mobile-first approach

## 🌍 Globe Features

**Half Globe**:
- Shows only hemisphere (cut in half)
- Auto-rotates slowly
- User can click and drag to rotate
- Uses Earth texture map
- Clean edge with blue ring

**Technical**:
- Three.js + React Three Fiber
- Sphere geometry with 0-π range (half sphere)
- Torus geometry for edge ring
- Realistic lighting

## 📱 Responsive Breakpoints

- **Desktop**: 968px+
  - Two-column hero layout
  - Full-size globe (600px height)
  
- **Tablet**: 641px - 967px
  - Single column layout
  - Medium globe (400px height)
  
- **Mobile**: < 640px
  - Stacked layout
  - Small globe (300px height)
  - Full-width search

## 🚀 Usage

Visit: `http://localhost:3000/landing2`

### Search Implementation

The search forms are ready for implementation:

```typescript
const handleSearch = (e: React.FormEvent) => {
  e.preventDefault()
  console.log('Searching for:', searchQuery)
  // TODO: Implement search functionality
  // - Could search lawyers by name, specialty, location
  // - Could search legal issues/case types
  // - Could integrate with search API
}
```

## 📂 File Structure

```
app/landing2/
├── page.tsx                  # Main landing page
├── styles.css                # Complete styling
├── components/
│   └── HalfGlobe.tsx        # 3D half globe component
└── README.md                 # This file
```

## 🔧 Customization

### Change Globe Size
Edit `HalfGlobe.tsx`:
```typescript
const globeRadius = 2.5  // Adjust this value
```

### Modify Statistics
Edit `page.tsx` in the "Why Choose Us" section:
```tsx
<div className="feature-number">150+</div>
<div className="feature-label">Countries Covered</div>
```

### Update Services
Edit the services cards in `page.tsx`:
```tsx
<div className="service-card">
  <div className="service-icon">⚖️</div>
  <h3 className="service-title">Your Service</h3>
  <p className="service-description">Description...</p>
</div>
```

## 🎭 No Authentication

As requested, this landing page has:
- ❌ No login button
- ❌ No sign-in functionality
- ❌ No user accounts
- ✅ Focus on search and content
- ✅ Call-to-action for search

## 🚦 Next Steps

### To Implement Search:
1. Create search API endpoint
2. Connect to lawyer/legal issues database
3. Add search results page
4. Implement filtering and sorting

### To Replace with AI Version:
When ready, this page can be replaced by:
- AI-powered search
- Personalized recommendations
- Chat interface
- Advanced filtering

## 📊 Performance

- **Fast Loading**: Dynamic imports for 3D globe
- **Optimized**: Lazy loading of heavy components
- **SEO Ready**: Semantic HTML structure
- **Accessible**: Proper heading hierarchy

## 🌟 Key Differences from Reference Site

This implementation:
- ✅ Modern React/Next.js (vs GoDaddy builder)
- ✅ Interactive 3D globe (vs static image)
- ✅ Cleaner, more professional design
- ✅ Better mobile experience
- ✅ Faster loading times
- ✅ Search-first approach

## 💡 Tips

1. **Globe Performance**: If slow, reduce sphere geometry segments in `HalfGlobe.tsx`
2. **Search UX**: Consider adding autocomplete/suggestions
3. **Content**: Update copy to match your specific services
4. **Images**: Add lawyer profiles or case study images later

---

**Ready for Launch!** 🚀

This is your MVP landing page before the full AI-powered version.
