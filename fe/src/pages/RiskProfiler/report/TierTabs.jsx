import { TIER_ORDER, TIERS } from '../data';

export default function TierTabs({ recommendedTier, activeTab, onSelect }) {
  return (
    <div className="tier-tabs screen-only">
      {TIER_ORDER.map((t) => {
        const m = TIERS[t];
        const isRec = t === recommendedTier;
        return (
          <button
            key={t}
            type="button"
            className={'tier-tab' + (t === activeTab ? ' active' : '')}
            onClick={() => onSelect(t)}
          >
            {m.short}{isRec && <span className="rec-badge">Recommended</span>}
          </button>
        );
      })}
    </div>
  );
}
