# Contact Information

## Company Details

**Name**: WinWin Law  
**Address**: 319 N Bernardo Ave, Mountain View, CA 94043  
**Email**: info@winwinlaw.com  
**Website**: https://winwinlaw.com

## Where Contact Info Appears

### 1. Footer (Both Pages)
- **Homepage** (`/`)
- **Demo Page** (`/demo`)

Both pages display:
- Full street address
- City, State, ZIP
- Clickable email link

### 2. Structured Data (SEO)
Located in `components/StructuredData.tsx`

Schema.org markup includes:
```json
{
  "@type": "LegalService",
  "name": "WinWin Law",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "319 N Bernardo Ave",
    "addressLocality": "Mountain View",
    "addressRegion": "CA",
    "postalCode": "94043",
    "addressCountry": "US"
  },
  "email": "info@winwinlaw.com"
}
```

This helps with:
- Local SEO
- Google Business Profile integration
- Rich search results
- Map integration

### 3. Environment Variables
Template in `.env.example`:
```
COMPANY_ADDRESS="319 N Bernardo Ave, Mountain View, CA 94043"
COMPANY_EMAIL="info@winwinlaw.com"
```

### 4. Metadata
Open Graph tags in `app/layout.tsx` for social sharing

## Email Configuration

The contact email `info@winwinlaw.com` is used for:

1. **Public display** (footer, contact sections)
2. **Demo form notifications** (`app/api/demo/route.ts`)
3. **mailto links** (clickable email in footer)

## Updating Contact Information

### To Change Address:

1. **Footer on Homepage** (`app/page.tsx` line ~339)
2. **Footer on Demo Page** (`app/demo/page.tsx` line ~73)
3. **Structured Data** (`components/StructuredData.tsx` line ~10)
4. **Environment Template** (`.env.example`)

### To Change Email:

1. **Footer links** (both pages)
2. **API notification email** (`app/api/demo/route.ts` line ~31)
3. **Structured Data** (`components/StructuredData.tsx` line ~20)
4. **Environment variables** (`.env` and `.env.example`)

## Google Business Profile Integration

To connect this address with Google Business:

1. Claim your business at [google.com/business](https://www.google.com/business)
2. Verify ownership of 319 N Bernardo Ave
3. Match the NAP (Name, Address, Phone) exactly:
   - Name: WinWin Law
   - Address: 319 N Bernardo Ave, Mountain View, CA 94043
   - Email: info@winwinlaw.com
4. Link to winwinlaw.com as your website

## Local SEO Benefits

With proper address implementation:

✅ Appears in local search results  
✅ Shows on Google Maps  
✅ Displays in "near me" searches  
✅ Eligible for local business schema  
✅ Can show business hours, photos, etc.

## Privacy Considerations

The address is:
- Public on website footer
- In structured data (visible to search engines)
- In sitemap/robots.txt

If you need to:
- Use a different mailing address
- Keep physical address private
- Use a virtual office address

Update the relevant files listed above.

## Next Steps

### Optional Enhancements:

1. **Add Phone Number**
   - Add to footer
   - Add to structured data
   - Make clickable (tel: link)

2. **Add Map Integration**
   - Embed Google Maps on contact page
   - Show office location
   - Provide directions link

3. **Add Business Hours**
   - Display in footer or contact page
   - Add to structured data
   - Enable appointment booking

4. **Add Social Media Links**
   - LinkedIn, Twitter, etc.
   - Add to footer
   - Add to structured data (sameAs property)

## Files Modified

- `app/page.tsx` - Footer contact section
- `app/demo/page.tsx` - Footer contact section  
- `app/layout.tsx` - Added structured data component
- `components/StructuredData.tsx` - NEW - Schema.org markup
- `.env.example` - Added company info variables

---

**Last Updated**: May 2, 2026  
**Verified**: All pages displaying correct information
