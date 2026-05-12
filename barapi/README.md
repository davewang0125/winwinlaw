# State Bar API Integration

✅ **Legal & Ethical**: Using official State Bar APIs and public records databases.

## Overview

This system integrates with official State Bar Association APIs to collect verified attorney information. Unlike web scraping, this method:

- ✅ Is legally authorized
- ✅ Uses official, verified data
- ✅ Respects API rate limits
- ✅ Provides accurate, up-to-date information
- ✅ Includes bar numbers and admission dates
- ✅ Shows disciplinary history (if public)

## Supported States

### Implemented
- ✅ **California** - State Bar of California API

### Planned
- 🔄 **New York** - NYS Attorney Registration
- 🔄 **Texas** - State Bar of Texas
- 🔄 **Florida** - Florida Bar
- 🔄 **Illinois** - ARDC
- 🔄 **All 50 states** (work in progress)

## Features

- **Multi-state support**: Extensible architecture for all US states
- **Daily sync**: Automated updates
- **Smart caching**: Reduces API calls
- **Rate limiting**: Respects API quotas
- **Error handling**: Robust retry logic
- **Deduplication**: Avoids duplicate records
- **Database integration**: Same DB as profiles scraper

## Architecture

```
barapi/
├── clients/           # State-specific API clients
│   ├── base.ts       # Base API client
│   ├── california.ts # CA State Bar API
│   ├── newyork.ts    # NY Attorney Registration
│   └── ...           # Other states
├── database/          # Shared DB operations
│   └── operations.ts # CRUD using profiles DB
├── cron/              # Scheduled jobs
│   └── daily-sync.ts # Daily state sync
├── utils/             # Utilities
│   ├── cache.ts      # Caching layer
│   ├── rate-limit.ts # API rate limiting
│   └── logger.ts     # Logging
└── cache/             # Cache storage
```

## California State Bar API

### API Information

**Base URL**: https://apps.calbar.ca.gov/api/

**Endpoints**:
- `/members/search` - Search attorneys
- `/members/{barNumber}` - Get attorney details
- `/members/{barNumber}/status` - Get status & discipline

**Authentication**: Public API, no key required (rate limited)

**Rate Limits**: ~100 requests/minute (be conservative)

**Documentation**: https://apps.calbar.ca.gov/attorney/Licensee/

### Data Available

- Full name
- Bar number
- Admission date
- Status (Active, Inactive, etc.)
- Law firm/employer
- Address (primary)
- Email (if public)
- Practice areas
- Disciplinary actions
- Education (law school)

## Installation

```bash
cd barapi
npm install
```

## Configuration

Create `.env`:

```env
# Database (shared with profiles)
DATABASE_URL=postgresql://localhost:5432/winwinlaw

# API Settings
CA_BAR_API_KEY=      # If required
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_PER_MS=60000

# Caching
CACHE_ENABLED=true
CACHE_TTL=86400      # 24 hours

# Logging
LOG_LEVEL=info
```

## Usage

### Manual Fetch

```bash
# Fetch California lawyers by location
npm run fetch:california -- --city="Los Angeles" --limit=100

# Fetch by practice area
npm run fetch:california -- --practice="Criminal Defense"

# Fetch by bar number
npm run fetch:california -- --bar=123456
```

### Daily Sync

```bash
# Run all states
npm run sync

# Run specific state
npm run sync:california
```

### Scheduled Sync

```bash
# Start cron (runs daily at 3 AM)
npm run cron:start
```

## State Bar Resources

### California
- **Website**: https://www.calbar.ca.gov/
- **Attorney Search**: https://apps.calbar.ca.gov/attorney/Licensee/
- **API Docs**: Public endpoints available
- **Contact**: memberservices@calbar.ca.gov

### New York
- **Website**: https://ww2.nycourts.gov/attorneys/
- **Attorney Search**: https://iapps.courts.state.ny.us/attorney/
- **Registration**: Public database
- **Contact**: attorneysearch@courts.state.ny.us

### Texas
- **Website**: https://www.texasbar.com/
- **Attorney Search**: https://www.texasbar.com/AM/Template.cfm?Section=Find_A_Lawyer
- **Database**: Texas Bar Member Directory
- **Contact**: customerservice@texasbar.com

### Florida
- **Website**: https://www.floridabar.org/
- **Attorney Search**: https://www.floridabar.org/directories/find-mbr/
- **Database**: Florida Bar Member Directory
- **Contact**: lawyer@floridabar.org

## Adding New States

1. Research state bar API/database
2. Create client in `clients/{state}.ts`
3. Extend `BaseBarClient`
4. Implement required methods
5. Add to sync schedule
6. Test thoroughly

## Example: California Integration

```typescript
import { CaliforniaBarClient } from './clients/california'
import { upsertProfessional } from './database/operations'

const client = new CaliforniaBarClient()

// Search by location
const lawyers = await client.searchByLocation('Los Angeles')

// Save to database
for (const lawyer of lawyers) {
  await upsertProfessional(lawyer)
}
```

## Data Quality

State Bar data is:
- ✅ **Official**: Verified by state authorities
- ✅ **Current**: Updated by attorneys themselves
- ✅ **Accurate**: Bar numbers are unique identifiers
- ✅ **Comprehensive**: Includes disciplinary history
- ✅ **Public**: Legally accessible information

## Compliance

This system:
- ✅ Uses only public records
- ✅ Respects API rate limits
- ✅ Caches to minimize requests
- ✅ Provides attribution to source
- ✅ Allows opt-out (per bar rules)
- ✅ Complies with data privacy laws

## API vs Scraping

| Aspect | State Bar API | Web Scraping |
|--------|---------------|--------------|
| Legal | ✅ Authorized | ❌ Questionable |
| Data Quality | ✅ Official | ⚠️ Varies |
| Up-to-date | ✅ Real-time | ⚠️ Delayed |
| Complete | ✅ Full records | ⚠️ Partial |
| Rate limits | ✅ Clear | ❌ Unclear |
| Maintenance | ✅ Stable API | ❌ HTML changes |
| Ethics | ✅ Proper | ⚠️ Gray area |

**Recommendation**: Always use State Bar APIs when available!

## Statistics

Track API usage:

```bash
npm run stats
```

Shows:
- Total attorneys by state
- Daily API calls
- Cache hit rate
- Last sync time
- Data freshness

## Roadmap

- [ ] All 50 US states
- [ ] Canadian provinces
- [ ] UK Solicitors (Law Society)
- [ ] Australian states
- [ ] International bar associations
- [ ] Bulk import tools
- [ ] Incremental updates
- [ ] Webhook notifications

## Support

For questions about specific state bar APIs, contact their member services directly. Links provided in State Bar Resources section above.

---

**Built with official public records - the right way!** ✅
