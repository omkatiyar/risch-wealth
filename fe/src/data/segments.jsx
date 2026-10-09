// Client profiles, shared by the Who We Serve page and the home page.
// `icon` is the inner SVG markup for a 24x24 stroke icon.

export const SEGMENTS = [
  {
    icon: <path d="M3 21V9l9-6 9 6v12M9 21v-6h6v6" />,
    eyebrow: 'Enterprise wealth',
    title: 'Business Owners',
    body: 'Wealth concentrated in a single enterprise, and a need to diversify it outside the business without losing sight of succession.',
  },
  {
    icon: <><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" /></>,
    eyebrow: 'Liquidity events',
    title: 'Entrepreneurs & Founders',
    body: 'Liquidity events, ESOPs and irregular income, portfolios built around a career that doesn\'t look like a salaried one.',
  },
  {
    icon: <><circle cx="9" cy="8" r="3.2" /><path d="M2.5 20c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6" /><circle cx="17" cy="8.5" r="2.6" /><path d="M15 14.2c2.7.4 4.7 2.5 4.7 5.8" /></>,
    eyebrow: 'Across generations',
    title: 'Private Clients & Families',
    body: 'Multi-generational wealth, consolidated reporting, and succession structured so it survives a handover.',
  },
  {
    icon: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
    eyebrow: 'Cross-border',
    title: 'NRIs & Global Indians',
    body: 'Cross-border holdings and a home-market allocation that still needs a single point of accountability.',
  },
  {
    icon: <><path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" /></>,
    eyebrow: 'Career wealth',
    title: 'Senior Executives & Professionals',
    body: 'A demanding career leaves little time to manage money directly, a documented process stands in for that time.',
  },
  {
    icon: <><rect x="3" y="3" width="7" height="7" rx="1.2" /><rect x="14" y="3" width="7" height="7" rx="1.2" /><rect x="3" y="14" width="7" height="7" rx="1.2" /><rect x="14" y="14" width="7" height="7" rx="1.2" /></>,
    eyebrow: 'Second opinion',
    title: 'Family Offices',
    body: 'A second opinion and execution partner alongside an existing family office or advisory setup.',
  },
];
