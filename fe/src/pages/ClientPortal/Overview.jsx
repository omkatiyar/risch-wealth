import { Link } from 'react-router-dom';
import headshot from '../../assets/founder-headshot.jpg';
import { FIRM } from '../../data/firm';
import {
  Arrow, Donut, RiskGauge, assetColor, fmtDate, inr, signedInr, signedPct, tone,
} from './ui';

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};

export default function Overview({ data, portfolio, recent }) {
  const { summary, allocation, holdings } = portfolio;
  const has = holdings.length > 0;
  return (
    <>
      <div className="cp-head">
        <div>
          <p className="cp-eyebrow">{greeting()},</p>
          <h1>{data.profile.fullName.split(' ')[0]}.</h1>
          <p>Here’s an overview of your wealth with RISCH.</p>
        </div>
        {has && summary.navDate && <p className="cp-asof">Values as of<br /><strong>{fmtDate(summary.navDate)}</strong></p>}
      </div>

      {has ? <SummaryCard summary={summary} /> : <EmptyPortfolio />}

      {has && (
        <div className="cp-grid cp-grid-2">
          <AllocationCard allocation={allocation} total={summary.currentValue} />
          <TopHoldings holdings={holdings} />
        </div>
      )}

      <div className="cp-grid cp-grid-3">
        <RecentActivity recent={recent} requests={data.requests} />
        <RiskCard risk={data.latestRiskProfile} />
        <TeamCard />
      </div>
    </>
  );
}

export function SummaryCard({ summary, cta = true }) {
  return (
    <section className="cp-card cp-summary" aria-label="Portfolio summary">
      <div className="cp-stat cp-stat-main">
        <span className="cp-stat-label">Current value</span>
        <strong className="cp-stat-big">{inr(summary.currentValue)}</strong>
        <span className={'cp-stat-sub ' + tone(summary.gain)}>{signedInr(summary.gain)} ({signedPct(summary.returnPct)})</span>
      </div>
      <div className="cp-stat">
        <span className="cp-stat-label">Amount invested</span>
        <strong>{inr(summary.invested)}</strong>
      </div>
      <div className="cp-stat">
        <span className="cp-stat-label">XIRR</span>
        {summary.xirr === null
          ? <><strong>—</strong><span className="cp-stat-sub">Shown after 30 days</span></>
          : <strong className={tone(summary.xirr)}>{signedPct(summary.xirr)}</strong>}
      </div>
      <div className="cp-stat">
        <span className="cp-stat-label">Absolute return</span>
        <strong className={tone(summary.returnPct)}>{signedPct(summary.returnPct)}</strong>
        <span className="cp-stat-sub">Since {fmtDate(summary.sinceDate)}</span>
      </div>
      {cta && <Link to="/client-portal/portfolio" className="btn cp-summary-cta">View portfolio <Arrow /></Link>}
    </section>
  );
}

function EmptyPortfolio() {
  return (
    <section className="cp-card cp-empty">
      <h2 className="cp-card-title">Your portfolio is being set up</h2>
      <p>Once our team has recorded your investments, your holdings, returns and asset allocation will appear here, valued daily at the NAV published by AMFI.</p>
      <Link to="/client-portal/messages" className="btn">Ask the RISCH team <Arrow /></Link>
    </section>
  );
}

export function AllocationCard({ allocation, total, title = 'Asset allocation', link = true }) {
  return (
    <section className="cp-card">
      <div className="cp-card-head">
        <h2 className="cp-card-title">{title}</h2>
        {link && <Link to="/client-portal/portfolio" className="cp-link">Details <Arrow /></Link>}
      </div>
      <div className="cp-alloc">
        <Donut items={allocation} total={total} />
        <ul className="cp-legend">
          {allocation.map((a) => (
            <li key={a.assetClass}>
              <span className="cp-swatch" style={{ background: assetColor(a.assetClass) }} />
              <span className="cp-legend-name">{a.assetClass}</span>
              <span className="cp-legend-pct">{a.pct.toFixed(1)}%</span>
              <span className="cp-legend-val">{inr(a.value)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function TopHoldings({ holdings }) {
  return (
    <section className="cp-card">
      <div className="cp-card-head">
        <h2 className="cp-card-title">Top holdings</h2>
        <Link to="/client-portal/portfolio" className="cp-link">All holdings <Arrow /></Link>
      </div>
      <ul className="cp-top-list">
        {holdings.slice(0, 5).map((h) => (
          <li key={h.schemeCode}>
            <span className="cp-swatch" style={{ background: assetColor(h.assetClass) }} />
            <span className="cp-top-name">{h.name}<small>{h.assetClass}</small></span>
            <span className="cp-top-val">{inr(h.currentValue)}<small className={tone(h.returnPct)}>{signedPct(h.returnPct)}</small></span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function RecentActivity({ recent, requests }) {
  const items = [
    ...(recent || []).map((t) => ({ key: `t${t.id}`, date: t.date, sort: t.date, title: 'Purchase', detail: t.fundName, amount: t.amount })),
    ...requests.map((r) => ({ key: `r${r.id}`, date: r.createdAt, sort: r.createdAt.slice(0, 10), title: 'Request sent', detail: r.topic })),
  ].sort((a, b) => (a.sort < b.sort ? 1 : -1)).slice(0, 5);
  return (
    <section className="cp-card">
      <div className="cp-card-head">
        <h2 className="cp-card-title">Recent activity</h2>
        <Link to="/client-portal/transactions" className="cp-link">View all <Arrow /></Link>
      </div>
      {items.length === 0 ? <p className="cp-muted">No activity yet.</p> : (
        <ul className="cp-activity">
          {items.map((i) => (
            <li key={i.key}>
              <span className="cp-act-date">{fmtDate(i.date)}</span>
              <span className="cp-act-body"><strong>{i.title}</strong><span>{i.detail}</span></span>
              {i.amount !== undefined && <span className="cp-act-amt">{inr(i.amount)}</span>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function RiskCard({ risk }) {
  return (
    <section className="cp-card">
      <div className="cp-card-head">
        <h2 className="cp-card-title">Your risk profile</h2>
        {risk && <Link to="/client-portal/risk-profile" className="cp-link">Details <Arrow /></Link>}
      </div>
      {risk ? (
        <div className="cp-risk-mini">
          <RiskGauge tier={risk.tier} />
          <strong>{risk.tierName}</strong>
          <span className="cp-muted">Assessed {fmtDate(risk.createdAt)}</span>
          <Link to="/risk-profiler" className="btn cp-btn-sm">Retake assessment <Arrow /></Link>
        </div>
      ) : (
        <>
          <p>Take the eight-question assessment while signed in; your result is saved here for us to discuss with you.</p>
          <Link to="/risk-profiler" className="btn cp-btn-sm">Take the assessment <Arrow /></Link>
        </>
      )}
    </section>
  );
}

export function TeamCard() {
  return (
    <section className="cp-card">
      <h2 className="cp-card-title">Your RISCH team</h2>
      <div className="cp-team">
        <img src={headshot} alt="" width="64" height="64" />
        <div>
          <strong>Rishiraj Maheshwari</strong>
          <span>Founder &amp; CEO</span>
        </div>
      </div>
      <ul className="cp-contact">
        <li><a href={FIRM.phoneHref}>{FIRM.phone}</a></li>
        <li><a href={`mailto:${FIRM.email}`}>{FIRM.email}</a></li>
        <li className="cp-muted">Monday to Saturday, 10am – 6pm IST</li>
      </ul>
      <Link to="/client-portal/messages" className="btn btn-primary cp-btn-sm">Message the team <Arrow /></Link>
    </section>
  );
}
