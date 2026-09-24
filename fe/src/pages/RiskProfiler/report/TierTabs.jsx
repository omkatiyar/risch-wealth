export default function TierTabs({ tiers, tierOrder, recommendedTier, activeTab, onSelect }) {
  return (
    <div className="tier-tabs screen-only">
      {tierOrder.map((t) => {
        const m = tiers[t];
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
