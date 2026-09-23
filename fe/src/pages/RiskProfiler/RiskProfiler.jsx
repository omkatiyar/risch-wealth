import { useState } from 'react';
import Nav from '../../components/Nav/Nav';
import Footer from '../../components/Footer/Footer';
import { useDocumentHead } from '../../hooks/useDocumentHead';
import { QUESTIONS } from './data';
import { fmtINR, pct } from './scoring';
import ReportView from './report/ReportView';

const STEP_ORDER = ['intro', 'basics', ...QUESTIONS.map((q) => q.id), 'report'];

function stepLabel(key) {
  if (key === 'intro') return 'Introduction';
  if (key === 'basics') return 'Your details';
  if (key === 'report') return 'Your proposal';
  const q = QUESTIONS.find((q) => q.id === key);
  return `${q.group} — Question ${q.groupIndex} of ${q.groupTotal}`;
}

export default function RiskProfiler() {
  useDocumentHead(
    'Risk Profiler — RISCH Wealth',
    'Answer eight questions and receive an instant, personalised investment proposal — time horizon and risk preference scored independently, mapped to a recommended portfolio.'
  );

  const [stepIndex, setStepIndex] = useState(0);
  const [basics, setBasics] = useState({ name: '', email: '', phone: '', age: '', amount: 5000000 });
  const [answers, setAnswers] = useState({});

  const currentStepKey = STEP_ORDER[stepIndex];

  const goToStep = (index) => {
    const clamped = Math.max(0, Math.min(index, STEP_ORDER.length - 1));
    setStepIndex(clamped);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBasicsSubmit = (e) => {
    e.preventDefault();
    goToStep(stepIndex + 1);
  };

  const handleSelectOption = (questionId, opt) => {
    setAnswers((prev) => ({ ...prev, [questionId]: opt }));
  };

  const handleRestart = () => {
    setAnswers({});
    setStepIndex(0);
  };

  const total = STEP_ORDER.length;
  const progressPct = Math.max(4, Math.round((stepIndex / (total - 1)) * 100));
  const showFooter = currentStepKey === 'report';

  return (
    <>
      <Nav showMobileProfilerLink={false} />

      <div className="prog-rail">
        <div className="wrap prog-inner">
          <span className="mono prog-label">Step {stepIndex + 1} of {total} — {stepLabel(currentStepKey)}</span>
          <div className="prog-track"><div className="prog-fill" style={{ width: progressPct + '%' }}></div></div>
        </div>
      </div>

      <main className="wrap profiler-wrap">
        {currentStepKey === 'intro' && (
          <section className="p-step is-active" data-step="intro">
            <p className="eyebrow reveal in">Portfolio Suitability Questionnaire</p>
            <h1 className="display-xl reveal in" style={{ maxWidth: '14em' }}>Know your risk profile <span className="italic">before you invest.</span></h1>
            <p className="lede reveal in" style={{ maxWidth: '52ch', marginTop: 26 }}>This diagnostic follows a documented time-horizon and risk-preference methodology. It takes about three minutes. At the end, you'll receive a complete investment proposal — allocation, sub-asset breakdown and hypothetical outcomes — built around your answers.</p>
            <div className="intro-facts reveal in">
              <div><span className="mono">01</span> Basic details</div>
              <div><span className="mono">02</span> Time horizon — 2 questions</div>
              <div><span className="mono">03</span> Risk preference — 6 questions</div>
              <div><span className="mono">04</span> Your proposal, instantly</div>
            </div>
            <button className="btn btn-primary" style={{ marginTop: 40 }} onClick={() => goToStep(1)}>Begin
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7H13M13 7L7.5 1.5M13 7L7.5 12.5" stroke="currentColor" strokeWidth="1.3" /></svg>
            </button>
          </section>
        )}

        {currentStepKey === 'basics' && (
          <section className="p-step is-active" data-step="basics">
            <p className="q-eyebrow">Before We Begin</p>
            <h2 className="display-m" style={{ marginBottom: 36 }}>A little about you.</h2>
            <form onSubmit={handleBasicsSubmit}>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="bName">Full name</label>
                  <input type="text" id="bName" placeholder="Ananya Vodnala" value={basics.name} onChange={(e) => setBasics({ ...basics, name: e.target.value })} />
                </div>
                <div className="field">
                  <label htmlFor="bEmail">Email address</label>
                  <input type="email" id="bEmail" placeholder="you@email.com" value={basics.email} onChange={(e) => setBasics({ ...basics, email: e.target.value })} />
                </div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="bPhone">Mobile number</label>
                  <input type="tel" id="bPhone" placeholder="+91 98765 43210" value={basics.phone} onChange={(e) => setBasics({ ...basics, phone: e.target.value })} />
                </div>
                <div className="field">
                  <label htmlFor="bAge">Age</label>
                  <input type="number" id="bAge" min="18" max="100" placeholder="23" value={basics.age} onChange={(e) => setBasics({ ...basics, age: e.target.value })} />
                </div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="bAmount">Indicative investment amount (₹)</label>
                  <input type="number" id="bAmount" min="10000" step="10000" placeholder="5,000,000" value={basics.amount} onChange={(e) => setBasics({ ...basics, amount: e.target.value })} />
                </div>
                <div className="field"></div>
              </div>
              <div className="p-nav">
                <button type="button" className="btn btn-back" onClick={() => goToStep(stepIndex - 1)}>Back</button>
                <button type="submit" className="btn btn-primary">Continue
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7H13M13 7L7.5 1.5M13 7L7.5 12.5" stroke="currentColor" strokeWidth="1.3" /></svg>
                </button>
              </div>
            </form>
          </section>
        )}

        {QUESTIONS.some((q) => q.id === currentStepKey) && (
          <QuestionStep
            question={QUESTIONS.find((q) => q.id === currentStepKey)}
            amount={Number(basics.amount) || 5000000}
            answer={answers[currentStepKey]}
            onSelect={(opt) => handleSelectOption(currentStepKey, opt)}
            onBack={() => goToStep(stepIndex - 1)}
            onNext={() => goToStep(stepIndex + 1)}
          />
        )}

        {currentStepKey === 'report' && (
          <section className="p-step is-active" data-step="report">
            <ReportView basics={basics} answers={answers} onRestart={handleRestart} />
          </section>
        )}
      </main>

      {showFooter && <Footer extendedLegal contactEmail="contact@rischwealth.com" showPhone={false} showSocials={false} />}
    </>
  );
}

function QuestionStep({ question: q, amount, answer, onSelect, onBack, onNext }) {
  return (
    <section className="p-step is-active" data-step="question">
      <p className="q-eyebrow">{q.group} — Question {q.groupIndex} of {q.groupTotal}</p>
      <h2 className="display-m" style={{ marginBottom: q.sub ? 8 : 36, maxWidth: '26ch' }}>{q.prompt}</h2>
      {q.sub && <p className="body-s text-muted" style={{ marginBottom: 20 }}>{q.sub}</p>}
      <div className="opt-list">
        {q.options.map((opt) => {
          const isSelected = answer && answer.label === opt.label;
          return (
            <div
              key={opt.label}
              className={'opt' + (isSelected ? ' selected' : '')}
              role="radio"
              tabIndex={0}
              aria-checked={isSelected ? 'true' : 'false'}
              onClick={() => onSelect(opt)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelect(opt);
                }
              }}
            >
              <div className="radio"></div>
              {q.type === 'payoff' ? (
                <div style={{ flex: 1 }}>
                  <div className="opt-text">{opt.label}</div>
                  <table className="opt-table"><tbody><tr>
                    <td>Worst case</td><td className="v-neg">{fmtINR(amount * (1 + opt.worst))} ({pct(opt.worst * 100)})</td>
                    <td>Expected</td><td className="v-pos">{fmtINR(amount * (1 + opt.exp))} (+{pct(opt.exp * 100)})</td>
                    <td>Best case</td><td className="v-pos">{fmtINR(amount * (1 + opt.best))} (+{pct(opt.best * 100)})</td>
                  </tr></tbody></table>
                </div>
              ) : q.type === 'range' ? (
                <div style={{ flex: 1 }}>
                  <div className="opt-text">{opt.label}</div>
                  <div className="opt-sub mono">+{opt.best}% best case &nbsp;·&nbsp; {opt.worst}% worst case</div>
                </div>
              ) : (
                <div className="opt-text">{opt.label}</div>
              )}
            </div>
          );
        })}
      </div>
      <div className="p-nav">
        <button className="btn btn-back" onClick={onBack}>Back</button>
        <button className="btn btn-primary" disabled={!answer} onClick={onNext}>Continue
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7H13M13 7L7.5 1.5M13 7L7.5 12.5" stroke="currentColor" strokeWidth="1.3" /></svg>
        </button>
      </div>
    </section>
  );
}
