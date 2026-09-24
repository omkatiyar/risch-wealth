import { fmtINR } from '../../../utils/format';
import { PageHead, PageMeta, PageFoot } from './ReportChrome';
import QBox from './QBox';
import PayoffTable from './PayoffTable';

export default function ReportPage1({ meta, amount, answers, questions }) {
  return (
    <div className="report-page">
      <PageHead dateStr={meta.dateStr} />
      <PageMeta meta={meta} />
      <div className="r-section">
        <h3 className="r-title">Section: Risk Tolerance Questionnaire (RTQ) Responses</h3>
        <p className="r-sub">Client self-reported diagnostic assessing time horizon capacity, financial goals, and volatility resilience.</p>

        <div className="q-grid">
          <QBox num={1} question={questions[0]} answer={answers.q1} />
          <QBox num={2} question={questions[1]} answer={answers.q2} />
        </div>
        <div className="q-grid full">
          <QBox num={3} question={questions[2]} answer={answers.q3} />
        </div>

        <div className="q-box" style={{ marginBottom: 12 }}>
          <div className="q-num">4. Portfolio Payoff Preference: 1-Year Range on Initial {fmtINR(amount)} Investment</div>
          <PayoffTable portfolios={questions[3].options} amount={amount} selectedLabel={answers.q4 ? answers.q4.label : null} />
        </div>

        <div className="q-grid">
          <QBox num={5} question={questions[4]} answer={answers.q5} />
          <QBox num={6} question={questions[5]} answer={answers.q6} />
        </div>
      </div>
      <PageFoot n={1} />
    </div>
  );
}
