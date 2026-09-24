import { fmtINR } from '../../../utils/format';

function Row({ label, p, amount }) {
  if (p <= 0) return null;
  return <tr><td>{label}</td><td>{p.toFixed(2)}%</td><td>{fmtINR((amount * p) / 100)}</td></tr>;
}

function Subhead({ label }) {
  return <tr className="subhead"><td colSpan={3}>{label}</td></tr>;
}

export default function GranularTable({ mandate, amount }) {
  const g = mandate.granular;
  return (
    <table className="alloc-table">
      <thead><tr><th>Underlying Asset Class</th><th>Weight</th><th>Amount</th></tr></thead>
      <tbody>
        <Subhead label={`Domestic Equity Sleeve (${mandate.india.toFixed(2)}%)`} />
        <Row label="India Large Cap Equity" p={g.large} amount={amount} />
        <Row label="India Mid Cap Equity" p={g.mid} amount={amount} />
        <Row label="India Small Cap Equity" p={g.small} amount={amount} />
        {mandate.intl > 0 && (
          <>
            <Subhead label={`Global & Offshore Equity Sleeve (${mandate.intl.toFixed(2)}%)`} />
            <Row label="Europe Equity" p={g.europe} amount={amount} />
            <Row label="US Equity (S&P 500 / Tech)" p={g.us} amount={amount} />
            <Row label="Asia ex-Japan Equity" p={g.asia} amount={amount} />
          </>
        )}
        <Subhead label={`Fixed Income & Liquidity Sleeve (${(mandate.debt + mandate.cash).toFixed(2)}%)`} />
        <Row label="India Medium Term Debt" p={g.medium} amount={amount} />
        <Row label="India Long Term Debt" p={g.long} amount={amount} />
        <Row label="India Short Term Debt / Liquid" p={g.short} amount={amount} />
        <Row label="Cash & Cash Equivalents" p={mandate.cash} amount={amount} />
        <tr className="total-row"><td>Consolidated Holdings</td><td>100.00%</td><td>{fmtINR(amount)}</td></tr>
      </tbody>
    </table>
  );
}
