import type { Metadata } from "next";
import "./globals.css";
import StructuredData from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "WinWin Law - Get Qualified Legal Cases, Not Junk Leads",
  description: "We turn messy client inquiries into structured, lawyer-ready case summaries — so you spend less time on intake and more time on billable work.",
  openGraph: {
    title: "WinWin Law - Get Qualified Legal Cases, Not Junk Leads",
    description: "We turn messy client inquiries into structured, lawyer-ready case summaries — so you spend less time on intake and more time on billable work.",
    url: "https://winwinlaw.com",
    siteName: "WinWin Law",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
