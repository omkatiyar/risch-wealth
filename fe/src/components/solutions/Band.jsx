import { useState } from 'react';

// A full-width photo band. The image sits under a soft overlay in the page
// background colour. If the file is missing, a photo band disappears (no empty
// block) and the closing band keeps a neutral ground.
// `children` (the closing call to action) sit on a readable gradient.
export default function Band({ src, alt = '', variant = 'photo', children }) {
  const [ok, setOk] = useState(true);
  // a plain photo band with no photo yet takes no room at all
  if (!ok && variant === 'photo') return null;
  return (
    <div className={`wp-band wp-band-${variant}`}>
      {ok && (
        <img
          src={src}
          alt={alt}
          width="2400"
          height="1200"
          loading="lazy"
          decoding="async"
          aria-hidden={alt ? undefined : 'true'}
          onError={() => setOk(false)}
        />
      )}
      <div className="wp-band-veil" aria-hidden="true" />
      {children}
    </div>
  );
}
