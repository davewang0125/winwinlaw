# Legal Professional Profiles Scraper

⚠️ **LEGAL DISCLAIMER**: This tool is provided for educational and research purposes only. Always:
- Check the website's Terms of Service
- Respect robots.txt
- Obtain permission before scraping
- Comply with data privacy laws (GDPR, CCPA, etc.)
- Use APIs when available
- Rate limit your requests appropriately

## 📁 Structure

```
profiles/
├── scrapers/           # Individual site scrapers
│   ├── findlaw.ts     # FindLaw.com scraper
│   ├── justia.ts      # Justia.com scraper
│   └── base.ts        # Base scraper class
├── database/          # Database operations
│   ├── schema.sql     # Database schema
│   ├── client.ts      # Database client
│   └── operations.ts  # CRUD operations
├── cron/              # Scheduled jobs
│   └── daily-sync.ts  # Daily sync job
├── utils/             # Utilities
│   ├── robots.ts      # Robots.txt parser
│   ├── rate-limit.ts  # Rate limiting
│   └── logger.ts      # Logging utility
└── README.md          # This file
```

## 🎯 Features

- **Multi-source scraping**: FindLaw, Justia (extensible)
- **Daily sync**: Automated daily updates
- **CRUD operations**: Insert, Update, Delete profiles
- **Rate limiting**: Respects server resources
- **Robots.txt compliance**: Checks robots.txt before scraping
- **Error handling**: Robust error recovery
- **Logging**: Comprehensive logging
- **Deduplication**: Avoids duplicate profiles

## 🗄️ Database Schema

Profiles are stored with:
- Basic info: name, email, phone
- Location: address, city, state, country
- Practice areas: specializations
- Education: law school, year
- Bar admissions: states/countries
- Languages: spoken languages
- Ratings: if available
- Profile URL: source link
- Last updated: timestamp

## 🚀 Setup

### 1. Install Dependencies

```bash
npm install puppeteer cheerio axios robots-parser pg rate-limiter-flexible
npm install --save-dev @types/pg
```

### 2. Configure Database

Set environment variables in `.env`:
```
DATABASE_URL=postgresql://user:password@localhost:5432/winwinlaw
```

### 3. Initialize Database

```bash
npm run db:init
```

### 4. Run Scraper

```bash
# One-time run
npm run scrape

# Daily cron job
npm run cron:start
```

## ⚙️ Configuration

Edit `config.ts`:
```typescript
export const config = {
  rateLimit: {
    requests: 10,      // Max requests
    perMilliseconds: 60000  // Per minute
  },
  scraping: {
    maxRetries: 3,
    timeout: 30000,
    userAgent: 'WinWinLaw Bot/1.0 (Educational Purpose)'
  },
  cron: {
    schedule: '0 2 * * *'  // 2 AM daily
  }
}
```

## 📊 Usage

### Manual Scraping

```typescript
import { FindLawScraper } from './scrapers/findlaw'
import { saveProfile } from './database/operations'

const scraper = new FindLawScraper()
const profiles = await scraper.scrape()

for (const profile of profiles) {
  await saveProfile(profile)
}
```

### Daily Cron Job

```bash
# Start cron daemon
npm run cron:start

# Stop cron daemon
npm run cron:stop

# View logs
npm run logs
```

## 🔒 Privacy & Ethics

This scraper:
- ✅ Respects robots.txt
- ✅ Rate limits requests
- ✅ Identifies itself with User-Agent
- ✅ Stores only public information
- ✅ Provides opt-out mechanism
- ✅ Complies with GDPR (right to deletion)

**Lawyer Opt-Out**: Lawyers can request removal by contacting your support.

## 🚨 Warnings

**DO NOT**:
- ❌ Scrape without checking ToS
- ❌ Overwhelm servers with requests
- ❌ Scrape personal/private data
- ❌ Use data for spam/marketing without consent
- ❌ Violate copyright laws

**DO**:
- ✅ Start with small test runs
- ✅ Monitor error logs
- ✅ Provide attribution
- ✅ Consider using official APIs
- ✅ Get legal advice if unsure

## 🔄 Workflow

1. **Fetch**: Check robots.txt, rate limit, fetch page
2. **Parse**: Extract lawyer data using selectors
3. **Validate**: Clean and validate data
4. **Deduplicate**: Check if profile exists
5. **Store**: Insert or update database
6. **Log**: Record success/failure

## 📈 Monitoring

View scraping stats:
```bash
npm run stats
```

Output:
- Profiles scraped today
- Success rate
- Error count
- Last run time

## 🛠️ Development

### Add New Source

1. Create scraper in `scrapers/new-source.ts`
2. Extend `BaseScraper` class
3. Implement required methods
4. Add to cron job

### Test Scraper

```bash
npm run test:scraper -- --source=findlaw --limit=10
```

## 📝 Legal Alternatives

**Better Options**:

1. **State Bar APIs**: Most states offer public APIs
2. **Martindale-Hubbell API**: Paid but legal
3. **Avvo API**: Developer-friendly
4. **User Submissions**: Let lawyers add themselves
5. **Data Licensing**: Purchase from legal directories

## 🤝 Contributing

When adding scrapers:
1. Check website ToS
2. Respect robots.txt
3. Add rate limiting
4. Handle errors gracefully
5. Document selectors
6. Add tests

---

**Remember**: With great power comes great responsibility. Use ethically and legally! ⚖️
