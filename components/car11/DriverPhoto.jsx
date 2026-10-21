'use client';

import { useEffect, useRef, useState } from 'react';

// Stands in for the design's <image-slot>: shows /driver.jpg from public/, or an empty-state caption until that file exists.
export default function DriverPhoto({ src = '/driver.jpg', placeholder = 'Driver photo', style }) {
  const [failed, setFailed] = useState(false);
  const img = useRef(null);
  // the image is server-rendered, so it can fail before React hydrates and attaches onError
  useEffect(() => { const el = img.current; if (el && el.complete && !el.naturalWidth) setFailed(true); }, []);
  return (
    <div style={{ position: 'relative', overflow: 'hidden', background: 'rgba(127,127,127,.08)', ...style }}>
      {failed ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'rgba(238,240,242,.6)', font: '13px/1.3 var(--font-jbmono),monospace', letterSpacing: '.08em', textAlign: 'center' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.45 }}>
            <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-5-5L5 21" />
          </svg>
          {placeholder}
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- fills a fixed card slot; failure falls back to the placeholder
        <img ref={img} src={src} alt="Krish" loading="lazy" decoding="async" onError={() => setFailed(true)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      )}
    </div>
  );
}
