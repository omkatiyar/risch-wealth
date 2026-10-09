import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav/Nav';
import Footer from '../components/Footer/Footer';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useRiskProfile } from '../hooks/useRiskProfile';
import Orrery from '../components/solutions/Orrery';
import HorizonSelector from '../components/solutions/HorizonSelector';
import AllocationPanel from '../components/solutions/AllocationPanel';
import ProcessTimeline from '../components/solutions/ProcessTimeline';
import BuildingBlocks from '../components/solutions/BuildingBlocks';
import RingSlider from '../components/solutions/RingSlider';
import PrinciplesMorph, { PrinciplesGrid } from '../components/solutions/PrinciplesMorph';
import { PRINCIPLES } from '../data/principles';
import { ALLOCATION, CLOSING, HERO, PHILOSOPHY, TOGETHER, UNDERSTAND, horizonForYears } from '../content/solutions';

// What We Provide: risk first, portfolio second. Hero orrery, then the four
// parts of the page in order: Understand, Asset Allocation, Investment
// Philosophy, How it comes together. All copy lives in content/solutions.js.

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 7H13M13 7L7.5 1.5M13 7L7.5 12.5" stroke="currentColor" strokeWidth="1.3" /></svg>
);

const Down = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M7 1V13M7 13L1.5 7.5M7 13L12.5 7.5" stroke="currentColor" strokeWidth="1.3" /></svg>
);

// a thin copper line drawing of a pitch and its creases, used as a divider
const Crease = () => (
  <svg className="wp-crease" viewBox="0 0 600 40" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true" focusable="false">
    <path d="M0 20H236M364 20H600" />
    <rect x="236" y="8" width="128" height="24" rx="1" />
    <path d="M262 8V32M300 8V32M338 8V32" strokeDasharray="1 3" />
  </svg>
);

export default function Solutions() {
  useScrollReveal();
  const { status, profile } = useRiskProfile();
  const complete = status === 'complete';
  const reviewHref = '/client-portal/risk-profile';

  // the scroll-morph needs room and motion; phones and reduced-motion get a plain grid
  const [morph, setMorph] = useState(false);
  useEffect(() => {
    setMorph(window.matchMedia('(min-width: 820px)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const [ring, setRing] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 760px)');
    const set = () => setRing(mq.matches);
    set();
    mq.addEventListener('change', set);
    return () => mq.removeEventListener('change', set);
  }, []);
  const discCards = TOGETHER.disciplines.map((d) => ({
    key: d.t,
    content: (
      <div className="wp-dcard">
        <h4>{d.t}</h4>
        <p>{d.d}</p>
        <Link to={`/contact?topic=${encodeURIComponent(d.t)}`} className="wp-link">Discuss this <Arrow /></Link>
      </div>
    ),
  }));

  const [years, setYears] = useState(6);
  const [portfolio, setPortfolio] = useState('balanced');
  const onYears = (y) => { setYears(y); setPortfolio(horizonForYears(y)); };
  const goUnderstand = () => document.getElementById('understand')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const U = UNDERSTAND;
  const philTop = (
    <div className="wrap wp-phil-top">
      <div>
        <h2 className="wp-h2" id="phil-h">{PHILOSOPHY.title}</h2>
        <Crease />
      </div>
      <blockquote className="wp-lead"><p>{PHILOSOPHY.quote}</p></blockquote>
    </div>
  );
  return (
    <>
      <Nav />

      <header className="wp-hero wp-ground">
        <svg className="wp-arcs" viewBox="0 0 620 520" aria-hidden="true" focusable="false">
          <path d="M-40 520 A 560 560 0 0 1 420 40" />
          <path d="M-40 520 A 500 500 0 0 1 380 90" />
          <path d="M-40 520 A 440 440 0 0 1 335 145" />
        </svg>
        <div className="wrap wp-hero-grid">
          <div className="wp-hero-copy">
            <h1 className="wp-h1 reveal in">{HERO.title[0]}<br /><em>{HERO.title[1]}</em></h1>
            <p className="wp-lede reveal in">{HERO.body}</p>
            <div className="wp-actions reveal in">
              <button type="button" className="btn wp-see" onClick={goUnderstand}>{HERO.secondary} <Down /></button>
            </div>
          </div>
          <Orrery />
        </div>
      </header>

      {/* 1 · UNDERSTAND */}
      <section className="wp-und" id="understand" aria-labelledby="und-h">
        <div className="wrap">
          <div className="wp-head reveal">
            <h2 className="wp-h2" id="und-h">{U.title}</h2>
            <p className="wp-body">{U.intro}</p>
            {complete && <p className="wp-saved">Your saved profile: <strong>{profile.tierName}</strong>. <Link to={reviewHref} className="wp-link">Review it <Arrow /></Link></p>}
          </div>

          <div className="wp-und-grid">
            <article className="wp-block reveal" aria-labelledby="tol-h">
              <h3 id="tol-h">{U.tolerance.title}</h3>
              <p className="wp-body">{U.tolerance.body}</p>
              <figure className="wp-fig">
                <p className="wp-fig-n" aria-label={`${U.tolerance.figure} ${U.tolerance.figureText}`}><span aria-hidden="true">{U.tolerance.figure}</span></p>
                <figcaption>
                  <span>{U.tolerance.figureText}</span>
                </figcaption>
              </figure>
              <blockquote className="wp-quote">
                <p>{U.tolerance.quote}</p>
                <cite>{U.tolerance.quoteBy}</cite>
              </blockquote>
            </article>

            <article className="wp-block reveal" aria-labelledby="hz-h">
              <h3 id="hz-h">{U.horizon.title}</h3>
              <p className="wp-body">{U.horizon.body}</p>
              <HorizonSelector years={years} onYears={onYears} />
              <p className="wp-note">{U.horizon.note}</p>
            </article>
          </div>
        </div>
      </section>

      {/* 2 · ASSET ALLOCATION */}
      <section className="wp-alloc" aria-labelledby="alloc-h">
        <div className="wrap">
          <div className="wp-head reveal">
            <h2 className="wp-h2" id="alloc-h">{ALLOCATION.title}</h2>
            <p className="wp-body">{ALLOCATION.intro}</p>
          </div>
          <div className="reveal">
            <AllocationPanel portfolio={portfolio} onPortfolio={setPortfolio} />
          </div>
          <p className="wp-disclosure reveal">{ALLOCATION.disclaimer}</p>
          <div className="wp-means reveal-stagger">
            {ALLOCATION.points.map(([t, d]) => (
              <p key={t}><strong>{t}</strong> {d}</p>
            ))}
          </div>
        </div>
      </section>

      {/* 3 · INVESTMENT PHILOSOPHY */}
      <section className="wp-phil" aria-labelledby="phil-h">
        {morph ? (
          <PrinciplesMorph principles={PRINCIPLES} hint={PHILOSOPHY.morphHint} top={philTop} />
        ) : (
          <>
            {philTop}
            <div className="wrap"><PrinciplesGrid principles={PRINCIPLES} title={PHILOSOPHY.morphTitle} /></div>
          </>
        )}
      </section>

      {/* 4 · HOW IT COMES TOGETHER */}
      <section className="wp-tog" id="together" aria-labelledby="tog-h">
        <div className="wrap">
          <div className="wp-head reveal">
            <h2 className="wp-h2" id="tog-h">{TOGETHER.title}</h2>
          </div>
          <ProcessTimeline />

          <div className="wp-blocks">
            <div className="wp-head reveal">
              <h3 className="wp-h3">{TOGETHER.blocksTitle}</h3>
              <p className="wp-body">{TOGETHER.blocksIntro}</p>
            </div>
            <BuildingBlocks />
            <p className="wp-disclosure reveal">{TOGETHER.disclosure}</p>
          </div>

          <div className="wp-discs reveal">
            <div className="wp-discs-head">
              <h3 className="wp-h3">{TOGETHER.disciplinesTitle}</h3>
              <p className="wp-closing">{CLOSING.title}</p>
            </div>
            {ring ? <RingSlider items={discCards} label={TOGETHER.disciplinesTitle} /> : <ul className="wp-disc">{discCards.map((c) => <li key={c.key}>{c.content}</li>)}</ul>}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
