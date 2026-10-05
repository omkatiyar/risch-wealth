import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav/Nav';
import Footer from '../components/Footer/Footer';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { TESTIMONIALS, TESTIMONIAL_GROUPS } from '../data/testimonials';
import skyline from '../assets/testimonials-skyline.webp';
import skyline2x from '../assets/testimonials-skyline-2x.webp';

const ALL = 'All profiles';
const LEAD = TESTIMONIALS.find((t) => t.lead) ?? TESTIMONIALS[0];
const REST = TESTIMONIALS.filter((t) => t !== LEAD);

// Only offer a filter for profiles that actually have an account to show.
const PROFILES = TESTIMONIAL_GROUPS.filter((g) => REST.some((t) => t.group === g));
const FILTERS = [ALL, ...PROFILES];
// Counted once here rather than per chip on every render.
const COUNTS = new Map(FILTERS.map((g) => [g, g === ALL ? REST.length : REST.filter((t) => t.group === g).length]));

// A client's photograph when one has been supplied and cleared, otherwise
// their monogram. Both sit on the same accent disc, so the two mix cleanly.
const Portrait = ({ person }) => (
  <span className="ts-portrait" aria-hidden="true">
    {person.photo
      ? <img src={person.photo} alt="" loading="lazy" decoding="async" />
      : <span className="ts-monogram">{person.initial}</span>}
  </span>
);

const Attribution = ({ person }) => (
  <figcaption className="ts-by">
    <Portrait person={person} />
    <span className="ts-who">
      <span className="ts-sign">{person.name}</span>
      {(person.credentials ?? [person.role]).map((line) => (
        <span className="ts-cred" key={line}>{line}</span>
      ))}
      {person.place && <span className="ts-place">{person.place}</span>}
    </span>
  </figcaption>
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
        {/* skyline at dusk: the same curved panel as Get In Touch, but a
            global-city view whose warm sky sits with the ivory palette */}
        <div className="ts-photo" aria-hidden="true" style={{ '--ct-img': `url(${skyline})` }}>
          <img src={skyline} srcSet={`${skyline} 1x, ${skyline2x} 2x`} alt="" width="300" height="898" loading="lazy" />
        </div>

        <div className="ts-wrap">
          {/* copy and the lead account share the first screen, so neither
              column is left half empty the way two stacked blocks were */}
          <div className="ts-hero">
            <header className="ts-head">
              <p className="eyebrow reveal in">In our clients&rsquo; words</p>
              <h1 className="ts-title reveal in">Entrusted with<br /><span>a lifetime&rsquo;s work.</span></h1>
              <p className="lede ts-lede reveal in">
                Business owners, founders, CXOs, doctors, families, global Indians and family
                offices. Different balance sheets, one method — risk understood first, then a
                portfolio built around it.
              </p>
            </header>

            <figure className="ts-featured reveal in">
              <span className="ts-mark" aria-hidden="true">&ldquo;</span>
              <blockquote>{LEAD.quote}</blockquote>
              <Attribution person={LEAD} />
            </figure>
          </div>

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
                <Attribution person={t} />
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
