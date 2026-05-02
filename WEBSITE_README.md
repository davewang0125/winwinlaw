# WinWin Law Website

A professional landing page for WinWin Law - converting messy legal inquiries into structured, qualified cases.

## Features

- **Clean, Professional Design** - Minimal design focused on clarity, perfect for lawyer audiences
- **Full Landing Page** - Includes all key sections:
  - Hero with clear value proposition
  - Problem statement (pain points)
  - Solution overview with 3-step process
  - Before/After case example demo
  - ROI metrics section
  - How it works walkthrough
  - Pricing (free trial)
  - Trust/compliance badges
  - Social proof
  - Multiple CTAs
- **Responsive Design** - Mobile-friendly layout using Tailwind CSS
- **Built with Next.js 14** - Modern React framework with App Router
- **TypeScript** - Type-safe code throughout

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Language**: TypeScript

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
winwin/
├── app/
│   ├── layout.tsx       # Root layout with metadata
│   ├── page.tsx         # Main landing page
│   └── globals.css      # Global styles
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

## Key Design Principles

Following the README.md guidelines:

1. **Clean & Minimal** - No excessive animations, clear hierarchy
2. **Checkmarks & Boxes** - Structured visual elements for easy scanning
3. **Real Examples** - Before/after case comparison shows actual value
4. **Lawyer-Focused Messaging** - Avoids AI hype, focuses on ROI
5. **Trust Signals** - Compliance, security, and professional positioning

## Customization

### Colors

The primary color scheme is defined in `tailwind.config.ts`. Current theme uses professional blues:

```typescript
primary: {
  50: '#f0f9ff',
  100: '#e0f2fe',
  600: '#0284c7',
  700: '#0369a1',
  800: '#075985',
  900: '#0c4a6e',
}
```

### Content

All content can be edited directly in `app/page.tsx`. The page is organized into clear sections with comments.

## Next Steps

### To Add Backend Functionality:

1. **Lead Form API**
   - Create `/app/api/leads/route.ts` for form submissions
   - Connect to PostgreSQL database
   - Send email notifications

2. **Database Setup**
   - Install PostgreSQL
   - Create leads table
   - Add ORM (Prisma recommended)

3. **Email Integration**
   - Install email service (Resend, SendGrid, etc.)
   - Set up notification templates

### Example Lead Form API

Create `app/api/leads/route.ts`:

```typescript
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json();
  
  // TODO: Save to database
  // TODO: Send notification email
  
  return NextResponse.json({ success: true });
}
```

## Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import project to Vercel
3. Deploy with one click

### Environment Variables

Add these when deploying:

```
DATABASE_URL=your_postgresql_url
EMAIL_API_KEY=your_email_service_key
```

## Support

For questions or issues, contact: info@winwinlaw.com
