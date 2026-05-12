# Setup Guide - Legal Profiles Scraper

## ⚠️ CRITICAL: Read This First

**LEGAL & ETHICAL REQUIREMENTS:**

1. **Permission Required**: Get explicit permission from website owners before scraping
2. **Check Terms of Service**: Many sites prohibit automated scraping
3. **Use Official APIs**: Prefer APIs over scraping when available
4. **Respect Robots.txt**: Always honor robots.txt directives
5. **Rate Limiting**: Don't overwhelm servers
6. **Data Privacy**: Comply with GDPR, CCPA, and other privacy laws
7. **Attribution**: Give credit to data sources
8. **Opt-Out**: Provide mechanism for lawyers to remove their profiles

**Recommended Legal Alternatives:**
- State Bar Association APIs (often free)
- Martindale-Hubbell API (paid, legal)
- Avvo API (developer-friendly)
- Direct partnerships with legal directories
- User-submitted profiles

---

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

## 🚀 Installation

### 1. Install Dependencies

```bash
cd profiles
npm install
```

### 2. Setup Database

Create PostgreSQL database:

```bash
createdb winwinlaw
```

Configure environment:

```bash
cp .env.example .env
# Edit .env with your database credentials
```

Initialize schema:

```bash
npm run db:init
```

This will:
- Create all tables
- Add indexes
- Pre-populate practice areas and languages
- Set up triggers

### 3. Verify Setup

```bash
psql winwinlaw -c "SELECT COUNT(*) FROM practice_areas;"
```

Should show ~28 practice areas.

---

## 🎯 Usage

### Test Scraping (Safe)

Test with limit of 5 profiles:

```bash
npm run scrape:test
```

### Manual Scraping

```bash
npm run scrape
```

### View Stats

```bash
npm run stats
```

### View Logs

```bash
npm run logs
```

---

## 📅 Daily Cron Job

### Option 1: Node-Cron (Simple)

Run daily at 2 AM:

```bash
npm run cron:schedule
```

Keep process running in background:

```bash
nohup npm run cron:schedule > cron.log 2>&1 &
```

### Option 2: System Cron (Recommended)

Edit crontab:

```bash
crontab -e
```

Add line:

```
0 2 * * * cd /path/to/winwin/profiles && npm run cron:start >> logs/cron.log 2>&1
```

### Option 3: PM2 (Production)

Install PM2:

```bash
npm install -g pm2
```

Start with PM2:

```bash
pm2 start npm --name "profiles-scraper" -- run cron:schedule
pm2 save
pm2 startup
```

View status:

```bash
pm2 status
pm2 logs profiles-scraper
```

---

## 🔧 Configuration

### Environment Variables

Edit `.env`:

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/winwinlaw
RATE_LIMIT_REQUESTS=10          # Max requests per minute
RESPECT_ROBOTS=true              # Honor robots.txt
DEBUG=false                      # Enable debug logging
USER_AGENT="Your Bot/1.0 (...)" # Identify yourself
```

### Add New Scraper

1. Create scraper file:

```typescript
// scrapers/mysource.ts
import { BaseScraper } from './base'

export class MySourceScraper extends BaseScraper {
  constructor() {
    super({
      source: 'mysource',
      baseUrl: 'https://example.com',
      // ... config
    })
  }

  getSearchUrl(query: string, page: number): string {
    // Build search URL
  }

  parseSearchResults(html: string): string[] {
    // Extract profile URLs
  }

  parseProfile(html: string, url: string): LegalProfessional | null {
    // Parse profile data
  }
}
```

2. Add to cron job:

```typescript
// cron/daily-sync.ts
import { MySourceScraper } from '../scrapers/mysource'

const SCRAPER_CONFIGS = [
  {
    name: 'MySource',
    scraper: new MySourceScraper(),
    queries: ['lawyer', 'attorney'],
    maxPages: 10,
    enabled: true,
  },
]
```

---

## 📊 Database Schema

### Main Tables

- **legal_professionals**: Core profile data
- **practice_areas**: Practice area taxonomy
- **professional_practice_areas**: Many-to-many link
- **education**: Law school degrees
- **bar_admissions**: Bar membership
- **languages**: Spoken languages
- **ratings**: Ratings from various sources
- **scrape_logs**: Scraping history

### Key Fields

```sql
legal_professionals:
  - id (UUID)
  - full_name, email, phone
  - city, state, country
  - law_firm, position
  - bio, profile_url
  - source, source_id
  - is_active, verified
  - created_at, updated_at, last_scraped_at
```

### Useful Queries

**Search by name:**
```sql
SELECT * FROM legal_professionals 
WHERE full_name ILIKE '%smith%' 
AND is_active = true;
```

**Get profiles with practice areas:**
```sql
SELECT * FROM active_professionals_with_practice_areas
WHERE practice_areas LIKE '%litigation%';
```

**Recent additions:**
```sql
SELECT full_name, city, state, created_at
FROM legal_professionals
WHERE created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
```

**Scraping stats:**
```sql
SELECT 
  source,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_active) as active,
  MAX(last_scraped_at) as last_scrape
FROM legal_professionals
GROUP BY source;
```

---

## 🔍 Search API Integration

### Create Search Endpoint

```typescript
// app/api/search/lawyers/route.ts
import { searchProfessionals } from '@/profiles/database/operations'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || ''
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = parseInt(searchParams.get('offset') || '0')

  const results = await searchProfessionals(query, limit, offset)

  return Response.json({ results, total: results.length })
}
```

### Use in Frontend

```typescript
// In landing2 search box
const handleSearch = async (e: React.FormEvent) => {
  e.preventDefault()
  const response = await fetch(`/api/search/lawyers?q=${searchQuery}`)
  const { results } = await response.json()
  // Display results
}
```

---

## 🛡️ Best Practices

### Rate Limiting

```typescript
// Use conservative limiter for new sites
import { conservativeLimiter } from './utils/rate-limit'

const scraper = new MyScraper({
  rateLimiter: conservativeLimiter, // 5 req/min
})
```

### Error Handling

```typescript
try {
  const profiles = await scraper.scrape()
} catch (error) {
  logger.error('Scraping failed', { error })
  // Notify admin
  // Retry later
}
```

### Monitoring

Check logs daily:

```bash
tail -100 profiles/logs/scraper-*.log
```

Watch for:
- High error rates
- Robots.txt blocks
- Slow response times
- Database errors

---

## 🚨 Troubleshooting

### Database Connection Failed

```bash
# Check PostgreSQL is running
pg_isready

# Check credentials in .env
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

### Scraper Blocked

If getting 403/429 errors:
1. Check robots.txt compliance
2. Increase delays between requests
3. Verify User-Agent is set
4. Consider using official API instead

### Duplicate Profiles

Database uses `UNIQUE(source, source_id)` and `UNIQUE(profile_url)` to prevent duplicates.

If duplicates appear:
```sql
-- Find duplicates
SELECT full_name, COUNT(*)
FROM legal_professionals
GROUP BY full_name
HAVING COUNT(*) > 1;

-- Merge manually or keep most recent
```

### Performance Issues

If scraping is slow:
- Reduce `maxPages`
- Increase `rateLimiter` (cautiously)
- Run scrapers in parallel (be careful!)
- Use database indexes

---

## 📈 Scaling

### Multiple Sources

Run scrapers in parallel:

```typescript
const scrapers = [scraper1, scraper2, scraper3]

await Promise.all(
  scrapers.map(scraper => scraper.scrape())
)
```

### Distributed Scraping

Use job queue (e.g., Bull, BullMQ):

```typescript
import Queue from 'bull'

const scrapeQueue = new Queue('scraping')

scrapeQueue.process(async (job) => {
  const { scraper, query } = job.data
  return await scraper.scrape(query)
})

// Add jobs
scrapeQueue.add({ scraper: 'findlaw', query: 'lawyer' })
```

### Caching

Cache search results:

```typescript
import NodeCache from 'node-cache'

const cache = new NodeCache({ stdTTL: 3600 })

// Check cache before DB query
const cached = cache.get(cacheKey)
if (cached) return cached

// Query DB and cache
const results = await searchProfessionals(query)
cache.set(cacheKey, results)
```

---

## ✅ Checklist Before Production

- [ ] Got permission from website owners
- [ ] Checked Terms of Service
- [ ] Using official APIs where available
- [ ] Robots.txt compliance verified
- [ ] Rate limiting configured (conservative)
- [ ] User-Agent identifies you & provides contact
- [ ] Error logging implemented
- [ ] Database backups configured
- [ ] Monitoring/alerting set up
- [ ] Opt-out mechanism in place
- [ ] Privacy policy updated
- [ ] GDPR compliance reviewed
- [ ] Legal counsel consulted

---

## 📞 Support

**Questions?** Check:
1. This guide
2. README.md
3. Inline code comments
4. Logs directory

**Issues?**
1. Check logs first
2. Verify database connection
3. Test robots.txt compliance
4. Review error messages

---

**Remember**: Use responsibly and ethically! ⚖️
