// All copy for the What We Provide page (/solutions) lives here.
// Lines marked COMPLIANCE are regulatory-sensitive: RISCH is an AMFI-registered
// mutual fund distributor (ARN-156886) and an APMI-registered distributor of
// PMS and AIFs (APRN-05916). Edit them here and nowhere else.

// ---- hero ---------------------------------------------------------------
export const HERO = {
  title: ['Risk first.', 'Portfolio second.'],
  body: 'A portfolio should begin with the person it is for, not with a shelf of products. We first learn how much risk you can carry, how long you can wait and what the capital must achieve. Only then do we choose what belongs in it.',
  secondary: 'See how we decide',
  orreryLabel: 'Interactive orrery of a RISCH portfolio. Drag to rotate, or use the arrow keys. Choose a name to see what it means.',
};

// The orrery: "You" at the core, two inner rings, one outer orbit of the main
// asset classes (domestic, international, fixed income).
export const ORRERY = [
  { id: 'risk', ring: 0, name: 'Risk Tolerance', line: 'How much loss you can bear, and how you are likely to behave when it arrives.' },
  { id: 'time', ring: 1, name: 'Time Horizon', line: 'How long the capital can stay invested before it is needed.' },
  { id: 'domestic', ring: 2, name: 'Domestic Equity', line: 'Long-term growth from the Indian economy.' },
  { id: 'international', ring: 2, name: 'International Equity', line: 'Exposure beyond one market, one currency and one economy.' },
  { id: 'fixed', ring: 2, name: 'Fixed Income', line: 'Stability and regular income.' },
];

// ---- 1. understand ---------------------------------------------------------
export const UNDERSTAND = {
  title: 'Before we choose a single fund, we understand you.',
  intro: 'Your risk profile is built before any product is discussed, so the answer is about you and nothing else. Two things shape it: how much risk you can tolerate and how long your capital can stay invested.',
  tolerance: {
    title: 'Risk Tolerance',
    body: 'A short psychometric questionnaire looks at how you think about money, loss and uncertainty, not only what you say you are comfortable with. It also helps us spot behavioural patterns, like the urge to sell in a fall or chase a rally, that quietly cost investors returns.',
    figure: '1.2%',
    figureText: 'a year lost by the average investor to the timing of their buying and selling. The funds returned 9.9% a year; their investors earned 8.7%.',
    // COMPLIANCE: third-party statistic. Verified against Morningstar's "Mind the
    // Gap" study (10 years to 31 Dec 2025, US open-end funds and ETFs).
    // source line removed from the page at the owner's request (Morningstar, Mind the Gap, US funds, 10 years to 31 Dec 2025)
    quote: 'The investor’s chief problem, and even his worst enemy, is likely to be himself.',
    quoteBy: 'Benjamin Graham, The Intelligent Investor',
  },
  horizon: {
    title: 'Time Horizon',
    body: 'The longer capital can wait, the more room the portfolio has to work.',
    note: 'Time horizon is one of two inputs. Your full risk profile sets the final fit.',
  },
};

// Boundaries: up to 5 years Conservative, over 5 to 7 Balanced, over 7 up to
// under 10 Moderate, 10 and beyond Aggressive. `at` is where a row puts the slider.
export const HORIZONS = [
  { id: 'conservative', name: 'Risch Conservative Portfolio', span: 'Up to 5 years', from: 0, to: 5, at: 3 },
  { id: 'balanced', name: 'Risch Balanced Portfolio', span: '5 to 7 years', from: 5, to: 7, at: 6 },
  { id: 'moderate', name: 'Risch Moderate Portfolio', span: '7 to 10 years', from: 7, to: 10, at: 8 },
  { id: 'aggressive', name: 'Risch Aggressive Portfolio', span: '10 years and beyond', from: 10, to: 15, at: 12 },
];
export const SLIDER_MIN = 1;
export const SLIDER_MAX = 15; // shown as "15+"
export const horizonForYears = (y) => (y <= 5 ? 'conservative' : y <= 7 ? 'balanced' : y < 10 ? 'moderate' : 'aggressive');

// ---- 2. asset allocation ------------------------------------------------------
export const ALLOCATION = {
  title: 'Asset allocation decides most of the journey.',
  intro: 'We do not start with a product shelf. We start with how your money is spread across asset classes, then keep that mix on track as markets move.',
  label: 'Illustrative',
  // COMPLIANCE
  disclaimer: 'Illustrative only. These mixes show how the four portfolios differ in character. They are not a recommendation, and your own allocation is set from your full risk profile.',
  points: [
    ['Set from your risk profile.', 'The mix follows who you are and what the capital is for, not what is popular this year.'],
    ['Rebalanced when markets pull it off target.', 'When one asset class runs ahead or falls behind, we bring the portfolio back to its intended shape.'],
    ['Reviewed when your life changes.', 'A new business, a sale, a child, a retirement date: the allocation is revisited when the facts change.'],
  ],
};
export const ASSET_CLASSES = [
  { id: 'domestic', name: 'Domestic Equity', color: '#B24A07' },
  { id: 'international', name: 'International Equity', color: '#E8935A' },
  { id: 'fixed', name: 'Fixed Income', color: '#4A443C' },
  { id: 'commodities', name: 'Commodities', color: '#C9BBA5' },
];
// TODO (owner to confirm): placeholder percentages for illustration only. Each
// row must total 100. Replace with the firm's own model mixes before launch.
export const ILLUSTRATIVE_ALLOCATIONS = {
  conservative: { domestic: 20, international: 5, fixed: 65, commodities: 10 },
  balanced: { domestic: 35, international: 15, fixed: 40, commodities: 10 },
  moderate: { domestic: 45, international: 20, fixed: 25, commodities: 10 },
  aggressive: { domestic: 55, international: 25, fixed: 10, commodities: 10 },
};
export const PORTFOLIO_SUITS = {
  conservative: 'For capital that may be needed within about five years, where steadiness matters more than growth.',
  balanced: 'For goals five to seven years away, with room for growth alongside a solid base of income.',
  moderate: 'For goals seven to ten years out, where equity can do more of the work and the journey can be uneven.',
  aggressive: 'For capital that can stay invested for ten years or more and can sit through deep, long falls.',
};

// ---- 3. philosophy -------------------------------------------------------------
export const PHILOSOPHY = {
  title: 'We build portfolios, not product lists.',
  quote: 'In a Test match, the balls you leave alone matter as much as the ones you play. We invest the same way.',
  quoteAlt: 'Nobody wins a Test match in the first session. Long innings are built on patience, discipline and knowing when not to play a shot.',
  morphTitle: 'Our investment principles',
  morphHint: 'Hover over a card, or tap it, to turn it over.',
};

// ---- 4. how it comes together ----------------------------------------------------
export const TOGETHER = {
  title: 'From one conversation to one coherent portfolio.',
  steps: [
    ['Understand', 'Goals, time horizon, liquidity needs and Risk Tolerance.'],
    ['Allocate', 'Choose the asset mix that fits your profile.'],
    ['Construct', 'Select funds and strategies for each role in the mix.'],
    ['Review', 'Monitor, rebalance and adapt as markets and your life change.'],
  ],
  blocksTitle: 'The building blocks',
  blocksIntro: 'There is no model portfolio. These are the blocks that may form part of one, and how much weight each carries is set with you, not in advance.',
  // COMPLIANCE: "held through" lines name product categories. PMS and AIF are
  // offered as a distributor and only to eligible investors.
  blocks: [
    { name: 'Domestic Equity', role: 'Long-term growth of the Indian economy.', through: 'Large, mid and small cap, thematic and sectoral funds.' },
    { name: 'International Equity', role: 'Exposure beyond one market, currency and economy.', through: 'US, Europe, Asia ex-Japan and Taiwan.' },
    { name: 'Fixed Income', role: 'Stability and income.', through: 'Short, medium and long duration debt funds.' },
    { name: 'Hybrid and Multi-Asset', role: 'Equity, debt and gold in one holding, for smoother rides.', through: 'Balanced advantage, multi-asset and arbitrage funds.' },
    { name: 'Commodities', role: 'Behave differently from shares and bonds.', through: 'Gold and silver.' },
    { name: 'Portfolio Management Services (PMS)', role: 'A dedicated, concentrated equity portfolio for larger investments.', through: 'PMS strategies, distributed by RISCH.' },
    { name: 'Alternative Investment Funds (AIF)', role: 'Strategies beyond listed markets, such as private credit and private equity, for eligible investors.', through: 'AIFs, distributed by RISCH.' },
  ],
  // COMPLIANCE: existing disclosure, keep verbatim.
  disclosure: 'Portfolio components shown here illustrate RISCH’s investment framework; they are not a recommendation. A suitable portfolio also depends on your wider net worth, liabilities, illiquid assets, taxes and liquidity needs, which we go through with you in conversation.',
  disciplinesTitle: 'Four disciplines. One coherent portfolio.',
  disciplines: [
    { t: 'Portfolio Construction', d: 'A portfolio built around your objectives, liquidity needs, time horizon and ability to withstand losses, sized to you and not to a model.' },
    { t: 'Fund & Strategy Selection', d: 'Mutual funds, PMS and AIFs from across the market, each chosen for the role it plays in your portfolio. Our research and risk assessment drive the selection.' },
    { t: 'Global Diversification', d: 'Access to opportunities beyond Indian markets (the US, Europe, Asia and Taiwan), held as part of one plan rather than as a separate bet.' },
    { t: 'Wealth Coordination', d: 'Investments, liquidity, succession and your legal and tax advisers brought into one view, with one point of contact and regular reviews.' },
  ],
};

export const CLOSING = {
  title: 'A portfolio built around your life.',
};
