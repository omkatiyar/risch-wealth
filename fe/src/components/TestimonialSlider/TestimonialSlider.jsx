import { useEffect, useRef, useState } from 'react';
import { TESTIMONIALS } from '../../data/testimonials';

export default function TestimonialSlider() {
  const [active, setActive] = useState(0);
  const timerRef = useRef(null);

  const goTo = (i) => setActive((i + TESTIMONIALS.length) % TESTIMONIALS.length);

  useEffect(() => {
    timerRef.current = setInterval(() => setActive((a) => (a + 1) % TESTIMONIALS.length), 6500);
    return () => clearInterval(timerRef.current);
  }, []);

  const pause = () => clearInterval(timerRef.current);
  const resume = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setActive((a) => (a + 1) % TESTIMONIALS.length), 6500);
  };

  return (
    <div className="testimonial-slider reveal" onMouseEnter={pause} onMouseLeave={resume}>
      <button className="testimonial-nav prev" aria-label="Previous testimonial" onClick={() => goTo(active - 1)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
      </button>
      <button className="testimonial-nav next" aria-label="Next testimonial" onClick={() => goTo(active + 1)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
      </button>

      {TESTIMONIALS.map((t, idx) => (
        <div className={'testimonial-slide' + (idx === active ? ' active' : '')} key={t.name}>
          <p className="testimonial-quote">{t.quote}</p>
          <div className="testimonial-avatar">{t.initial}</div>
          <div className="testimonial-name">{t.name}</div>
          <div className="testimonial-role">{t.role}</div>
        </div>
      ))}

      <div className="testimonial-dots">
        {TESTIMONIALS.map((t, idx) => (
          <button
            key={t.name}
            type="button"
            className={'testimonial-dot' + (idx === active ? ' active' : '')}
            aria-label={`Go to testimonial ${idx + 1}`}
            onClick={() => goTo(idx)}
          />
        ))}
      </div>
    </div>
  );
}
