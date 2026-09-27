// Firm facts shown across the site (home trust bar, footer, contact page,
// schema.org data). One place to keep them accurate.
//
// Anything set to null is simply not shown. Fill these in only with
// figures that are accurate, current, and cleared by compliance: the
// site deliberately doesn't display placeholder numbers.

export const FIRM = {
  name: 'RISCH Wealth',
  legalName: 'RISCH Wealth Private Limited',
  city: 'Bengaluru',
  region: 'Karnataka',
  country: 'India',
  // The only mailbox that currently receives mail. rischwealth.com has no
  // MX records yet, so contact@rischwealth.com would bounce. Switch this
  // once domain email is set up.
  email: 'rischwealth@gmail.com',
  phone: '+91 94480 90998',
  phoneHref: 'tel:+919448090998',
  // Optional second line. An older brochure listed +91 94830 03456 (also on
  // the Google Business Profile), but current materials only list the
  // number above, so it's off until confirmed. Shown wherever set.
  phoneAlt: null,
  phoneAltHref: null,
  // Office address, exactly as on the business card and letterhead.
  address: {
    lines: ['Brigade Exotica, Tower Azure', 'No 35 & 36/1, P', 'Old Madras Road', '(Before Budigere Cross)', 'Bengaluru 560049'],
    street: 'Brigade Exotica, Tower Azure, No 35 & 36/1, P, Old Madras Road (Before Budigere Cross)',
    postalCode: '560049',
  },
  clientLoginUrl: 'https://wealthelite.in/client-login',
  foundedYear: 2014,
  careerStartYear: 2006, // founder's first private-banking role (About timeline)

  // e.g. '100+'. Shown in the home trust bar as "Client families".
  clientCount: null,
  // e.g. { value: '₹250 Cr+', label: 'Assets under advice' }. Use the exact
  // term that matches the registration (AUM vs assets under advice, etc).
  assets: null,
  // e.g. '₹1 Cr'. Adds "For investors with ₹1 Cr+ in investable assets"
  // under the hero. Only if it's a real minimum you apply.
  minimumInvestable: null,

  // Regulatory standing, shown in the footer on every page, on the
  // Disclosure, About and Contact pages. Source: APMI acknowledgement and
  // EUIN confirmation emails (June 2025).
  registrationNote: 'Registered with APMI (Association of Portfolio Managers in India) as a Distributor of Portfolio Management Services.',
  registrations: [
    { label: 'APRN', id: 'APRN05916' },
    // Rishiraj Maheshwari's EUIN, valid 24/05/2025 – 23/05/2028. Renew before expiry.
    { label: 'EUIN', id: 'E11449' },
    // Add when available: { label: 'CIN', id: '…' }, { label: 'ARN', id: 'ARN-…' } (AMFI)
  ],
  // e.g. 'Grievance Officer: Name, grievance@…, +91 …'
  grievance: null,
};
