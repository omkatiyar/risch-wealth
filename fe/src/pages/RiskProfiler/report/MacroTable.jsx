import { fmtINR } from '../../../utils/format';

export default function MacroTable({ mandate, amount }) {
  const rows = [
    ['India Equity', mandate.india],
    ['International Equity', mandate.intl],
    ['India Fixed Income', mandate.debt],
    ['Cash & Cash Equivalents', mandate.cash],
  ];
  return (
    <table className="alloc-table">
      <thead><tr><th>Asset Category</th><th>Weight</th><th>Amount</th></tr></thead>
      <tbody>
        {rows.filter(([, v]) => v > 0).map(([label, v]) => (
          <tr key={label}><td>{label}</td><td>{v.toFixed(2)}%</td><td>{fmtINR((amount * v) / 100)}</td></tr>
        ))}
        <tr className="total-row"><td>Total Portfolio</td><td>100.00%</td><td>{fmtINR(amount)}</td></tr>
      </tbody>
    </table>
  );
}
