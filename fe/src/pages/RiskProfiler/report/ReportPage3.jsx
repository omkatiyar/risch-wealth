import { TIER_ORDER, TIERS } from '../data';
import { PageHead, PageFoot } from './ReportChrome';
import TierTabs from './TierTabs';
import TierPanel from './TierPanel';

export default function ReportPage3({ meta, recommendedTier, amount, activeTab, onSelectTab }) {
  const recMandate = TIERS[recommendedTier];
  return (
    <div className="report-page">
      <PageHead dateStr={meta.dateStr} />

      <div className="r-section">
        <h3 className="r-title">Section: Strategic Asset Allocation &amp; Granular Breakdown</h3>
        <p className="r-sub">
          Client-specific recommended portfolio structure: <strong style={{ color: 'var(--ink-2)' }}>{recMandate.name}</strong>.{' '}
          <span className="screen-only" style={{ color: 'var(--muted)' }}>Use the tabs below to see how each of our four portfolios would be built.</span>
        </p>

        <TierTabs recommendedTier={recommendedTier} activeTab={activeTab} onSelect={onSelectTab} />

        {TIER_ORDER.map((t) => (
          <TierPanel
            key={t}
            tier={t}
            mandate={TIERS[t]}
            amount={amount}
            isRec={t === recommendedTier}
            isActiveTab={t === activeTab}
          />
        ))}
      </div>
      <PageFoot n={3} />
    </div>
  );
}
