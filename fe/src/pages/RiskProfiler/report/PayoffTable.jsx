import { PAYOFF_PORTFOLIOS } from '../data';
import { fmtINR, pct } from '../scoring';

export default function PayoffTable({ amount, selectedLabel }) {
  return (
    <table className="payoff-table">
      <thead>
        <tr><th>Portfolio</th><th>Worst Case</th><th>Expected Value</th><th>Best Case</th></tr>
      </thead>
      <tbody>
        {PAYOFF_PORTFOLIOS.map((p) => {
          const isSel = p.label === selectedLabel;
          return (
            <tr className={isSel ? 'selected-row' : ''} key={p.label}>
              <td>{p.label}{isSel ? ' [Selected]' : ''}</td>
              <td className="neg">{fmtINR(amount * (1 + p.worst))} ({pct(p.worst * 100)})</td>
              <td className="pos">{fmtINR(amount * (1 + p.exp))} (+{pct(p.exp * 100)})</td>
              <td className="pos">{fmtINR(amount * (1 + p.best))} (+{pct(p.best * 100)})</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
