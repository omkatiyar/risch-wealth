import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { TIERS } from '../data';
import { computeScores, mapToTier } from '../scoring';
import ReportPage1 from './ReportPage1';
import ReportPage2 from './ReportPage2';
import ReportPage3 from './ReportPage3';
import ReportPage4 from './ReportPage4';

export default function ReportView({ basics, answers, onRestart }) {
  const { timeHorizonScore, riskPreferenceScore } = computeScores(answers);
  const { tier, ambiguous } = mapToTier(timeHorizonScore, riskPreferenceScore);
  const mandate = TIERS[tier];
  const amount = Number(basics.amount) || 5000000;

  const [activeTab, setActiveTab] = useState(tier);

  const dateStr = useMemo(
    () => new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
    []
  );

  const meta = {
    clientName: basics.name || 'Prospective Client',
    clientAge: basics.age ? `${basics.age} Years` : '—',
    clientEmail: basics.email || '—',
    clientPhone: basics.phone || '—',
    dateStr,
  };

  const handleDownload = () => {
    // Whichever tier the client is exploring on screen, the printed
    // proposal always reflects the recommended mandate only.
    setActiveTab(tier);
    window.print();
  };

  return (
    <>
      <div className="report-scroll">
        <ReportPage1 meta={meta} amount={amount} answers={answers} />
        <ReportPage2 meta={meta} ambiguous={ambiguous} mandate={mandate} answers={answers} />
        <ReportPage3 meta={meta} recommendedTier={tier} amount={amount} activeTab={activeTab} onSelectTab={setActiveTab} />
        <ReportPage4 meta={meta} />
      </div>

      <div className="report-actions">
        <button className="btn btn-primary" onClick={handleDownload}>
          Download / Print Proposal
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1V10M7 10L3.5 6.5M7 10L10.5 6.5M2 13H12" stroke="currentColor" strokeWidth="1.3" /></svg>
        </button>
        <button className="btn" onClick={onRestart}>Start over</button>
        <Link to="/contact" className="btn">Get in touch</Link>
      </div>
    </>
  );
}
