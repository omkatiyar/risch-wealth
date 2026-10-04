import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav/Nav';
import Footer from '../components/Footer/Footer';
import CapitalOrbit from '../components/CapitalOrbit/CapitalOrbit';
import { TESTIMONIALS, TESTIMONIAL_GROUPS, TESTIMONIAL_GROUP_LABELS } from '../data/testimonials';

const ALL = 'All';
const LEAD = TESTIMONIALS.find((t) => t.lead) ?? TESTIMONIALS[0];
const PULL = TESTIMONIALS.find((t) => t.pull) ?? TESTIMONIALS[1];
// everything that is neither the featured story nor the navy pull quote
const STORIES = TESTIMONIALS.filter((t) => t !== LEAD && t !== PULL);
const FIRST_CHAPTER = 6;

const FILTERS = [ALL, ...TESTIMONIAL_GROUPS.filter((g) => TESTIMONIALS.some((t) => t.group === g))];
const labelOf = (g) => (g === ALL ? ALL : TESTIMONIAL_GROUP_LABELS[g] ?? g);

// "Sentence one. Sentence two. Sentence three." -> the first two carry the
// featured quote at display size, the rest follows quietly underneath.
function splitLead(text) {
  const parts = text.match(/[^.!?]+[.!?]+(?:\s|$)/g)?.map((s) => s.trim()) ?? [text];
  return { head: parts.slice(0, 2).join(' '), tail: parts.slice(2).join(' ') };
}

// **bold** inside a story paragraph becomes a bold phrase.
const rich = (text) => text.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part));

// Fades content up as it scrolls into view. Content is visible by default
// (prerendered page, no JS, anything already on screen); only elements that
// start below the fold are hidden, and only once the page is running.
function Reveal({ as: Tag = 'div', className = '', delay = 0, children, ...rest }) {
  const ref = useRef(null);
  const [state, setState] = useState('shown');
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return undefined;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return undefined;
    setState('armed');
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setState('in'); io.disconnect(); }
    }, { rootMargin: '0px 0px -8% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`${className} tx-reveal tx-reveal--${state}`} style={{ '--d': `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  );
}

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 7H13M13 7L7.5 1.5M13 7L7.5 12.5" stroke="currentColor" strokeWidth="1.3" /></svg>
);

function Who({ t, tone = '' }) {
  return (
    <div className={`tx-who ${tone}`}>
      <span className="tx-face" aria-hidden="true">
        <img src={t.photo} alt="" width="200" height="200" loading="lazy" decoding="async" />
      </span>
      <div className="tx-who-text">
        <span className="tx-cat">{labelOf(t.group)}</span>
        <span className="tx-sign">{t.name}</span>
        {t.credentials.map((line) => <span className="tx-cred" key={line}>{line}</span>)}
        <span className="tx-place">{t.place}</span>
      </div>
    </div>
  );
}

// The longer written account, folded away so the page stays about the quote.
function FullAccount({ t }) {
  return (
    <details className="tx-more">
      <summary>Read the full account</summary>
      <div className="tx-more-body">{t.story.map((para) => <p key={para.slice(0, 28)}>{rich(para)}</p>)}</div>
    </details>
  );
}

function Story({ t, size = 'sm', delay = 0 }) {
  return (
    <Reveal as="article" className={`tx-story tx-story--${size}`} delay={delay}>
      <span className="tx-hair" aria-hidden="true" />
      <blockquote><p>{t.quote}</p></blockquote>
      <Who t={t} />
      {size !== 'sm' && <FullAccount t={t} />}
    </Reveal>
  );
}

export default function Testimonials() {
  const [filter, setFilter] = useState(ALL);
  const filtered = filter !== ALL;

  const picked = useMemo(() => TESTIMONIALS.filter((t) => t.group === filter), [filter]);
  const lead = useMemo(() => splitLead(LEAD.quote), []);

  // the same editorial rhythm whether it holds 13 stories or 2
  const SCATTER = ['lg', 'sm', 'sm', 'lg', 'sm', 'sm'];
  const scatter = filtered ? picked : STORIES.slice(0, FIRST_CHAPTER);
  const rest = STORIES.slice(FIRST_CHAPTER);
  const [solo, ...columns] = rest;

  return (
    <>
      <Nav />

      <main className="tx">
        {/* 1 — hero */}
        <section className="tx-hero">
          <div className="tx-wrap tx-hero-grid">
            <header className="tx-hero-copy">
              <p className="tx-eyebrow">In our clients&rsquo; words</p>
              <h1 className="tx-title">Entrusted with<br /><span>a lifetime&rsquo;s work.</span></h1>
              <p className="tx-lede">
                Business owners, doctors, executives and families share what it is like to work
                with RISCH. Every situation is different. Our approach is the same: understand
                how much risk you are comfortable with first, then build the portfolio around it.
              </p>
            </header>
            <CapitalOrbit />
          </div>
        </section>

        {/* 2 — quiet filter navigation */}
        <div className="tx-filter">
          <div className="tx-wrap">
            <div className="tx-filter-rail" role="group" aria-label="Filter client stories by profile">
              {FILTERS.map((g) => (
                <button
                  key={g}
                  type="button"
                  className={'tx-tab' + (filter === g ? ' is-on' : '')}
                  aria-pressed={filter === g}
                  onClick={() => setFilter(g)}
                >
                  {labelOf(g)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {!filtered && (
          <>
            {/* 3 — the featured story, led entirely by type */}
            <section className="tx-featured">
              <div className="tx-wrap">
                <Reveal className="tx-featured-inner">
                  <p className="tx-kicker">01 / Featured client experience</p>
                  <figure>
                    <span className="tx-qmark" aria-hidden="true">&ldquo;</span>
                    <blockquote>
                      <p className="tx-featured-head">{lead.head}</p>
                      {lead.tail && <p className="tx-featured-tail">{lead.tail}</p>}
                    </blockquote>
                    <figcaption><Who t={LEAD} /></figcaption>
                  </figure>
                  <FullAccount t={LEAD} />
                </Reveal>
              </div>
            </section>
          </>
        )}

        {/* 4 — stories, scattered across the grid */}
        <section className="tx-stories tx-stories--cream" key={filter}>
          <div className="tx-wrap">
            <Reveal as="header" className="tx-chapter-head">
              <p className="tx-kicker">{filtered ? `Client stories / ${labelOf(filter)}` : '02 / Client stories'}</p>
            </Reveal>
            <div className="tx-scatter">
              {scatter.map((t, i) => <Story key={t.name} t={t} size={SCATTER[i % SCATTER.length]} />)}
            </div>
          </div>
        </section>

        {!filtered && (
          <>
            {/* 5 — one exceptional line, on the footer navy */}
            <section className="tx-pull">
              <div className="tx-wrap">
                <Reveal as="figure" className="tx-pull-inner">
                  <span className="tx-hair tx-hair--center" aria-hidden="true" />
                  <blockquote><p>{PULL.quote}</p></blockquote>
                  <figcaption><Who t={PULL} tone="tx-who--center" /></figcaption>
                </Reveal>
              </div>
            </section>

            {/* 6 — a different composition for the rest */}
            <section className="tx-stories tx-stories--light">
              <div className="tx-wrap">
                <Reveal as="header" className="tx-chapter-head">
                  <p className="tx-kicker">03 / More client stories</p>
                </Reveal>
                {solo && (
                  <Reveal as="article" className="tx-solo">
                    <blockquote><p>{solo.quote}</p></blockquote>
                    <Who t={solo} tone="tx-who--center" />
                    <FullAccount t={solo} />
                  </Reveal>
                )}
                <div className="tx-columns">
                  {columns.map((t, i) => (
                    <Reveal as="article" className="tx-col" key={t.name} delay={(i % 2) * 90}>
                      <blockquote><p>{t.quote}</p></blockquote>
                      <Who t={t} />
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {/* 7 — quiet disclosure */}
        <section className="tx-disclosure">
          <div className="tx-wrap">
            <p>
              Client statements reflect individual experiences and are not indicative of future
              results or a guarantee of any outcome. Names are shortened and are used only with
              the client&rsquo;s permission. See <Link to="/disclosure">Disclosures</Link>.
            </p>
          </div>
        </section>

        {/* 8 — the close */}
        <section className="tx-cta">
          <div className="tx-wrap tx-cta-grid">
            <Reveal className="tx-cta-copy">
              <span className="tx-hair" aria-hidden="true" />
              <h2>A considered second opinion can change how you see the whole portfolio.</h2>
            </Reveal>
            <Reveal className="tx-cta-actions" delay={120}>
              <Link to="/contact" className="btn btn-primary">Start a conversation <Arrow /></Link>
              <Link to="/risk-profiler" className="tx-link">Take the risk assessment</Link>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
