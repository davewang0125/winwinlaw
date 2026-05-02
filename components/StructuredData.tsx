export default function StructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "name": "WinWin Law",
    "description": "We turn messy client inquiries into structured, lawyer-ready case summaries",
    "url": "https://winwinlaw.com",
    "logo": "https://winwinlaw.com/logo.png",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "319 N Bernardo Ave",
      "addressLocality": "Mountain View",
      "addressRegion": "CA",
      "postalCode": "94043",
      "addressCountry": "US"
    },
    "email": "info@winwinlaw.com",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "info@winwinlaw.com",
      "contactType": "customer service"
    },
    "sameAs": []
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
