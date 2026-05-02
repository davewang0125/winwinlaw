# Deployment Guide for WinWin Law

## Quick Deploy to Vercel (Recommended)

### Prerequisites
- GitHub account
- Vercel account (free tier available)

### Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: WinWin Law website"
   git branch -M main
   git remote add origin https://github.com/yourusername/winwinlaw.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

3. **Configure Domain**
   - In Vercel dashboard, go to Settings > Domains
   - Add `winwinlaw.com`
   - Follow DNS configuration instructions

## Environment Variables

Add these in Vercel dashboard under Settings > Environment Variables:

```
DATABASE_URL=your_postgresql_connection_string
EMAIL_API_KEY=your_email_service_key
EMAIL_FROM=info@winwinlaw.com
EMAIL_TO=info@winwinlaw.com
NEXT_PUBLIC_SITE_URL=https://winwinlaw.com
```

## Database Setup (PostgreSQL)

### Option 1: Vercel Postgres (Easiest)
1. In Vercel dashboard, go to Storage tab
2. Create a new Postgres database
3. Connection string is automatically added to environment variables

### Option 2: External Provider (Neon, Supabase, etc.)
1. Create account with provider
2. Create new database
3. Copy connection string to `DATABASE_URL` in Vercel

### Database Schema

Create this table for lead storage:

```sql
CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  firm VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'new'
);

CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
```

## Email Integration

### Using Resend (Recommended)

1. **Install Resend**
   ```bash
   npm install resend
   ```

2. **Update API route** (`app/api/demo/route.ts`):
   ```typescript
   import { Resend } from 'resend';
   
   const resend = new Resend(process.env.EMAIL_API_KEY);
   
   // In the POST handler:
   await resend.emails.send({
     from: 'WinWin Law <onboarding@winwinlaw.com>',
     to: process.env.EMAIL_TO || 'info@winwinlaw.com',
     subject: `New Demo Request from ${name}`,
     html: `
       <h2>New Demo Request</h2>
       <p><strong>Name:</strong> ${name}</p>
       <p><strong>Email:</strong> ${email}</p>
       <p><strong>Firm:</strong> ${firm}</p>
       <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
       <p><strong>Message:</strong> ${message || 'None'}</p>
     `
   });
   ```

3. **Get API Key**
   - Sign up at [resend.com](https://resend.com)
   - Get API key from dashboard
   - Add to Vercel environment variables

## Custom Domain Setup

### DNS Configuration

Add these records to your domain registrar:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### SSL Certificate

Vercel automatically provisions SSL certificates via Let's Encrypt.

## Monitoring

### Vercel Analytics
- Automatically enabled on Vercel
- View in dashboard under Analytics tab

### Error Tracking (Optional)
Consider adding Sentry:

```bash
npm install @sentry/nextjs
```

## Performance Optimization

### Already Implemented
- Next.js Image optimization
- Automatic code splitting
- Static page generation
- CSS optimization via Tailwind

### Additional Recommendations
1. Enable Vercel Edge Network (automatic)
2. Use Vercel's Image optimization for any uploaded images
3. Monitor Core Web Vitals in Vercel Analytics

## Post-Deployment Checklist

- [ ] Site loads correctly at winwinlaw.com
- [ ] SSL certificate is active (https://)
- [ ] Contact form submits successfully
- [ ] Form submissions appear in database
- [ ] Email notifications are received
- [ ] Mobile responsiveness verified
- [ ] SEO meta tags are correct
- [ ] Google Analytics added (if needed)

## Troubleshooting

### Build Failures
Check Vercel build logs for specific errors. Common issues:
- Missing dependencies: Run `npm install` locally
- TypeScript errors: Run `npm run build` locally to debug

### Database Connection Issues
- Verify `DATABASE_URL` is set correctly
- Check database is accessible from Vercel's network
- Ensure IP allowlist includes Vercel IPs (for some providers)

### Email Not Sending
- Verify `EMAIL_API_KEY` is correct
- Check email service dashboard for errors
- Ensure sender email is verified

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Support

For deployment issues:
- Vercel: [vercel.com/support](https://vercel.com/support)
- Next.js: [nextjs.org/docs](https://nextjs.org/docs)
