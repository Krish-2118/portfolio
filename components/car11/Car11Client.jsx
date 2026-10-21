'use client';

import Car11 from './Car11';

// Car11 renders purely from state, so it is server-rendered: the intro and every section ship in the HTML.
// The browser-only parts (WebGL, Web Audio, IndexedDB) start in componentDidMount, and three.js loads lazily there.
export default function Car11Client(props) {
  return <Car11 {...props} />;
}
