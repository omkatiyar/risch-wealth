import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav/Nav';
import Footer from '../components/Footer/Footer';
import TrustStage from '../components/TrustStage/TrustStage';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { TESTIMONIALS, TESTIMONIAL_GROUPS } from '../data/testimonials';

const ALL = 'All profiles';
const LEAD = TESTIMONIALS.find((t) => t.lead) ?? TESTIMONIALS[0];
const REST = TESTIMONIALS.filter((t) => t !== LEAD);

// Only offer a filter for profiles that actually have an account to show.
const FILTERS = [ALL, ...TESTIMONIAL_GROUPS.filter((g) => REST.some((t) => t.group === g))];
// Counted once here rather than per chip on every render.
const COUNTS = new Map(FILTERS.map((g) => [g, g === ALL ? REST.length : REST.filter((t) => t.group === g).length]));

const Portrait = ({ person }) => (
  <span className="ts-portrait" aria-hidden="true">
    <img src={person.photo} alt="" width="640" height="640" loading="lazy" decoding="async" />
  </span>
);

const Who = ({ person }) => (
  <span className="ts-who">
    <span className="ts-sign">{person.name}</span>
    {person.credentials.map((line) => <span className="ts-cred" key={line}>{line}</span>)}
    <span className="ts-place">{person.place}</span>
  </span>
);

export default function Testimonials() {
  const [filter, setFilter] = useState(ALL);
  const shown = useMemo(
    () => (filter === ALL ? REST : REST.filter((t) => t.group === filter)),
    [filter],
  );
  useScrollReveal();

  return (
    <>
      <Nav />

      <section className="ts">
        {/* the same faint arcs that ground the Get In Touch page */}
        <svg className="ts-lines" viewBox="0 0 620 520" aria-hidden="true" focusable="false">
          <path d="M-40 520 A 560 560 0 0 1 420 40" />
          <path d="M-40 520 A 500 500 0 0 1 380 90" />
          <path d="M-40 520 A 440 440 0 0 1 335 145" />
        </svg>

        <div className="ts-wrap">
          <header className="ts-head">
            <div className="ts-copy">
              <p className="eyebrow reveal in">Client stories</p>
              <h1 className="ts-title reveal in">Trusted with<br /><span>what matters most.</span></h1>
              <p className="lede ts-lede reveal in">
                Business owners, doctors, senior executives, families and Indians living abroad
                share what it is like to work with RISCH. Every situation is different. Our
                approach is the same: we first understand how much risk you are comfortable
                with, then build your portfolio around it.
              </p>
            </div>
            <TrustStage />
          </header>

          <figure className="ts-featured reveal in">
            <Portrait person={LEAD} />
            <div className="ts-featured-body">
              <span className="ts-mark" aria-hidden="true">&ldquo;</span>
              <blockquote>{LEAD.quote}</blockquote>
              <figcaption><Who person={LEAD} /></figcaption>
            </div>
          </figure>

          {/* never gated behind the scroll-reveal: it must always be usable */}
          <div className="ts-filter" role="group" aria-label="Filter accounts by client profile">
            {FILTERS.map((g) => (
              <button
                key={g}
                type="button"
                className={'ts-chip' + (filter === g ? ' is-on' : '')}
                aria-pressed={filter === g}
                onClick={() => setFilter(g)}
              >
                {g}
                <span className="ts-chip-n">{COUNTS.get(g)}</span>
              </button>
            ))}
          </div>

          {/* keyed on the filter so the cards animate in again on each change */}
          <div className="ts-grid" key={filter}>
            {shown.map((t) => (
              <figure className="ts-card" key={t.name}>
                <blockquote>{t.quote}</blockquote>
                <figcaption className="ts-by">
                  <Portrait person={t} />
                  <Who person={t} />
                </figcaption>
              </figure>
            ))}
          </div>

          <p className="ts-note">
            Testimonials reflect the experience of individual clients and are not indicative of
            future results or a guarantee of any outcome. Names are shortened and portraits are
            published only with the client&rsquo;s permission. See <Link to="/disclosure">Disclosures</Link>.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
