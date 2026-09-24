import Donut from './Donut';
import MacroTable from './MacroTable';
import StrategySummary from './StrategySummary';
import GranularTable from './GranularTable';
import { CHART } from './chartColors';
import { fmtINR } from '../../../utils/format';

export default function TierPanel({ tier, mandate, amount, isRec, isActiveTab }) {
  const macro = [
    { label: 'India Equity', value: mandate.india, color: CHART.macro.india },
    { label: 'International Equity', value: mandate.intl, color: CHART.macro.intl },
    { label: 'India Fixed Income', value: mandate.debt, color: CHART.macro.debt },
    { label: 'Cash & Equivalents', value: mandate.cash, color: CHART.macro.cash },
  ].filter((s) => s.value > 0);

  // mandate.granular is computed server-side (be/src/riskProfiler/scoring.js)
  // alongside the rest of the scoring result — never recomputed here.
  const g = mandate.granular;
  const granSegs = [
    { label: 'India Large Cap', value: g.large, color: CHART.granular.large },
    { label: 'India Mid Cap', value: g.mid, color: CHART.granular.mid },
    { label: 'India Small Cap', value: g.small, color: CHART.granular.small },
    mandate.intl > 0 && { label: 'Europe Equity', value: g.europe, color: CHART.granular.europe },
    mandate.intl > 0 && { label: 'US Equity', value: g.us, color: CHART.granular.us },
    mandate.intl > 0 && { label: 'Asia ex-Japan', value: g.asia, color: CHART.granular.asia },
    { label: 'Medium Term Debt', value: g.medium, color: CHART.granular.medium },
    { label: 'Long Term Debt', value: g.long, color: CHART.granular.long },
    { label: 'Short Term Debt', value: g.short, color: CHART.granular.short },
    { label: 'Cash Equivalents', value: mandate.cash, color: CHART.granular.cash },
  ].filter(Boolean);

  return (
    <div className={'tier-panel' + (isRec ? ' is-recommended' : '') + (isActiveTab ? ' active' : '')} data-tier={tier}>
      <div className="donut-row">
        <Donut title="Macro Asset Allocation" segments={macro} />
        <Donut title="Sub-Asset Class Breakdown" segments={granSegs} />
      </div>

      <div className="grid g-2" style={{ gridTemplateColumns: '1fr 1.15fr', gap: 24, alignItems: 'start' }}>
        <div>
          <p className="small-caps" style={{ color: 'var(--muted)', marginBottom: 8 }}>1. Macro Asset Allocation</p>
          <MacroTable mandate={mandate} amount={amount} />
          <p className="small-caps" style={{ color: 'var(--muted)', margin: '16px 0 6px' }}>Allocated Portfolio Summary</p>
          <StrategySummary mandate={mandate} isRec={isRec} />
        </div>
        <div>
          <p className="small-caps" style={{ color: 'var(--muted)', marginBottom: 8 }}>2. Granular Asset Class Breakdown</p>
          <GranularTable mandate={mandate} amount={amount} />
          <p className="alloc-note">*Amounts simulated on indicative investment base of {fmtINR(amount)} (scalable).</p>
          {mandate.note && <p className="alloc-note" style={{ marginTop: 4 }}><em>{mandate.note}</em></p>}
        </div>
      </div>
    </div>
  );
}
