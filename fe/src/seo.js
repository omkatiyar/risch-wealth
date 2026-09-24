// Per-page SEO metadata and structured data (schema.org JSON-LD).
//
// Used in two places, so the two always agree:
//   - scripts/prerender.mjs writes these into each page's static HTML at
//     build time (what search engines, social previews and LLM crawlers see)
//   - components/RouteHead.jsx updates them on client-side navigation
//
// Guidelines from the SEO audit: titles 50–60 characters, descriptions
// 120–160 characters. `npm run build` warns if a page falls outside that.

export const SITE_URL = 'https://rischwealth.com';
export const SITE_NAME = 'RISCH Wealth';
export const OG_IMAGE = `${SITE_URL}/og-image.png`;

export const PAGES = {
  '/': {
    title: 'RISCH Wealth | Independent Private Wealth Firm in Bengaluru',
    description: 'RISCH Wealth is an independent private wealth firm in Bengaluru, led by a career private banker. Your risk profile first, then a portfolio built around it.',
  },
  '/about': {
    title: 'About RISCH Wealth | Founder & CEO Rishiraj Maheshwari',
    description: 'Meet Rishiraj Maheshwari, founder of RISCH Wealth: 20+ years in private banking at Edelweiss and ICICI Securities, now leading an independent wealth firm.',
  },
  '/who-we-serve': {
    title: 'Who We Serve | Private Wealth for Families, NRIs & Founders',
    description: 'RISCH Wealth works with business owners, entrepreneurs, families, NRIs, senior executives and family offices, with a portfolio built around each balance sheet.',
  },
  '/solutions': {
    title: 'Private Wealth Solutions & Portfolio Construction | RISCH',
    description: 'Private wealth solutions, wealth coordination, portfolio construction and risk profiling across domestic equity, international equity, fixed income and cash.',
  },
  '/risk-profiler': {
    title: 'Risk Profiler | Find Your Investment Risk Profile | RISCH',
    description: 'Answer eight questions to get your investment risk profile and an instant portfolio proposal, with time horizon and risk preference scored independently.',
  },
  '/testimonials': {
    title: 'Client Testimonials | RISCH Wealth Private Wealth Firm',
    description: 'What clients say about working with RISCH Wealth, an independent, risk-first private wealth firm in Bengaluru led by career private banker Rishiraj Maheshwari.',
  },
  '/perspective': {
    title: 'Perspective | Notes on Risk and Portfolio Strategy | RISCH',
    description: 'Notes from RISCH Wealth on risk profiling, portfolio construction and wealth coordination: how a risk-first private wealth process works in practice.',
  },
  '/disclosure': {
    title: 'Disclosures & Disclaimers | RISCH Wealth Private Limited',
    description: 'Important disclosures, methodology notes and disclaimers for RISCH Wealth Private Limited and the RISCH risk profiler. Investments are subject to market risk.',
  },
  '/contact': {
    title: 'Contact RISCH Wealth | Private Wealth Firm in Bengaluru',
    description: 'Get in touch with RISCH Wealth in Bengaluru about private wealth solutions, portfolio construction or your risk profile. Email, call or send us a message.',
  },
  '/employee-login': {
    title: 'Employee Login | RISCH Wealth',
    description: 'Sign-in for the RISCH Wealth team.',
    noindex: true,
  },
  '/404': {
    title: 'Page Not Found | RISCH Wealth',
    description: "The page you're looking for doesn't exist.",
    noindex: true,
  },
};

export function getPage(pathname) {
  return PAGES[pathname] || PAGES['/404'];
}

export function canonicalUrl(pathname) {
  return pathname === '/' ? `${SITE_URL}/` : `${SITE_URL}${pathname}`;
}

// Shown on the home page and emitted as FAQPage schema. Every answer is
// drawn from what the site already says elsewhere; keep them in sync.
export const FAQS = [
  {
    q: 'What is RISCH Wealth?',
    a: 'RISCH Wealth Private Limited is an independent private wealth firm based in Bengaluru. It was founded in 2014 by Rishiraj Maheshwari, a career private banker with more than two decades of experience, including roles at Edelweiss Financial Services and ICICI Securities.',
  },
  {
    q: 'Who does RISCH Wealth work with?',
    a: 'RISCH works with a small number of clients directly. The profiles we see most often are business owners, entrepreneurs and founders, private clients and families, NRIs and global Indians, senior executives and professionals, and family offices looking for an independent second opinion.',
  },
  {
    q: 'What does a risk-first approach mean?',
    a: 'Most portfolios start with a return target. Ours start with what you can actually withstand. We measure your capacity for risk before your willingness, match the portfolio to your time horizon and risk preference, and show the best, expected and worst case before a rupee is invested.',
  },
  {
    q: 'How does the RISCH risk profiler work?',
    a: 'The risk profiler is an eight-question diagnostic that scores your time horizon and risk preference independently, then matches you to a recommended portfolio. You get an instant proposal with an allocation and hypothetical outcomes. It is a starting point for a conversation, not a substitute for one.',
  },
  {
    q: 'Which asset classes does RISCH allocate across?',
    a: 'Portfolios are built across domestic equity (large, mid and small cap), international equity (US, Europe and Asia ex-Japan), fixed income (short, medium and long duration), and cash and liquid equivalents, sized to the client rather than a model.',
  },
  {
    q: 'Does RISCH Wealth sell its own investment products?',
    a: 'No. RISCH has no proprietary fund, so recommendations align to the client, not a product shelf. Any deviation from the recommended portfolio is recorded, justified and signed by both parties.',
  },
  {
    q: 'How do I get started?',
    a: 'Take the risk profiler on this site to see a proposed portfolio in a few minutes, or contact RISCH Wealth directly by email at rischwealth@gmail.com or by phone on +91 94480 90998.',
  },
];

const ORG_ID = `${SITE_URL}/#organization`;
const FOUNDER_ID = `${SITE_URL}/#founder`;

const ORGANIZATION = {
  '@type': 'FinancialService',
  '@id': ORG_ID,
  name: 'RISCH Wealth',
  legalName: 'RISCH Wealth Private Limited',
  alternateName: 'RISCH Private Wealth',
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/logo.png`,
  image: OG_IMAGE,
  description: 'Independent private wealth firm in Bengaluru, led by a career private banker. Risk understood first, then a portfolio built around it.',
  foundingDate: '2014',
  founder: { '@id': FOUNDER_ID },
  email: 'rischwealth@gmail.com',
  telephone: '+91-94480-90998',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Bengaluru',
    addressRegion: 'Karnataka',
    addressCountry: 'IN',
  },
  areaServed: { '@type': 'Country', name: 'India' },
  knowsAbout: ['Private wealth management', 'Portfolio construction', 'Risk profiling', 'Wealth coordination', 'Succession planning'],
  // Company profiles only; the founder's personal LinkedIn is on FOUNDER.
  sameAs: ['https://www.instagram.com/rischwealth/'],
};

const FOUNDER = {
  '@type': 'Person',
  '@id': FOUNDER_ID,
  name: 'Rishiraj Maheshwari',
  jobTitle: 'Founder & CEO',
  worksFor: { '@id': ORG_ID },
  sameAs: ['https://www.linkedin.com/in/rishiraj-maheshwari-81240b5/'],
};

const WEBSITE = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: `${SITE_URL}/`,
  name: SITE_NAME,
  publisher: { '@id': ORG_ID },
  inLanguage: 'en-IN',
};

// The JSON-LD graph for a page. Organization + founder + website go on
// every page; the FAQ only on the home page, where it's visible.
export function getJsonLd(pathname) {
  const page = getPage(pathname);
  const graph = [ORGANIZATION, FOUNDER, WEBSITE];
  if (!page.noindex) {
    graph.push({
      '@type': pathname === '/about' ? 'AboutPage' : pathname === '/contact' ? 'ContactPage' : 'WebPage',
      '@id': `${canonicalUrl(pathname)}#webpage`,
      url: canonicalUrl(pathname),
      name: page.title,
      description: page.description,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': ORG_ID },
      inLanguage: 'en-IN',
    });
  }
  if (pathname === '/') {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/#faq`,
      mainEntity: FAQS.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}

// The <head> tags for a page, as plain data. The prerender script
// serialises these to HTML; RouteHead applies them to the live document.
export function getHeadTags(pathname) {
  const page = getPage(pathname);
  const url = canonicalUrl(pathname);
  const meta = [
    { name: 'description', content: page.description },
    { name: 'robots', content: page.noindex ? 'noindex, follow' : 'index, follow' },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:locale', content: 'en_IN' },
    { property: 'og:title', content: page.title },
    { property: 'og:description', content: page.description },
    { property: 'og:url', content: url },
    { property: 'og:image', content: OG_IMAGE },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: 'RISCH Wealth — Capital deserves a considered hand.' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: page.title },
    { name: 'twitter:description', content: page.description },
    { name: 'twitter:image', content: OG_IMAGE },
  ];
  return { title: page.title, canonical: page.noindex ? null : url, meta };
}
