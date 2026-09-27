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

  // Regulatory registrations, shown in the footer on every page. e.g.
  // { label: 'AMFI-registered Mutual Fund Distributor', id: 'ARN-000000' }
  // or { label: 'SEBI Registered Portfolio Manager', id: 'INP000000000' }
  registrations: [],
  // e.g. 'Grievance Officer: Name, grievance@…, +91 …'
  grievance: null,
};
