'use client';

// Cinematic loaders for Car 21: each renders from the loader state Car11 already drives (phase + lit);
// the beats after lights out are timed in intro.css.
import './intro.css';

const SYSTEMS = ['POWER UNIT', 'ENERGY', 'AERO', 'TELEMETRY', 'DRIVER'];

const Skip = ({ onSkip }) => (
  <button type="button" className="ci-skip" onClick={onSkip}>Skip intro</button>
);

// Speed lines behind the number, laid out from a fixed hash so they stay put across renders.
const LINES = Array.from({ length: 30 }, (_, i) => {
  const r = n => { const x = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453; return x - Math.floor(x); };
  return { top: (r(1) * 100).toFixed(2) + '%', width: (8 + r(2) * 26).toFixed(1) + 'vw', animationDuration: (0.45 + r(3) * 0.9).toFixed(2) + 's', animationDelay: (-r(4) * 1.4).toFixed(2) + 's', hot: r(5) > 0.82 };
});

// Broadcast-style driver number: the 21 is cut into five slices that fly in one per system check,
// glints once everything is green, and at lights out the slices tear off into the wipe.
function Number21({ lit, onSkip }) {
  return (
    <>
      <div className="ci-n-bg">
        <div className="ci-n-lines" aria-hidden="true">
          {LINES.map(({ hot, ...st }, i) => <i key={i} className={hot ? 'hot' : undefined} style={st} />)}
        </div>
      </div>
      <div className="ci-n-edge ci-n-edge-r" />
      <div className="ci-n-edge" />
      <div className="ci-n-stage">
        <div className="ci-n-num" aria-hidden="true">
          <span className="ci-n-ghost">21</span>
          {[0, 1, 2, 3, 4].map(i => <span key={i} className={'ci-n-slice' + (4 - i < lit ? ' on' : '')} style={{ '--i': i, '--d': i % 2 ? -1 : 1 }}>21</span>)}
          <span className="ci-n-glint">21</span>
        </div>
      </div>
      <div className="ci-n-slash" aria-hidden="true"><i /><i /></div>
      <div className="ci-n-prog" aria-hidden="true">{[0, 1, 2, 3, 4].map(i => <i key={i} className={i < lit ? 'on' : undefined} />)}</div>
      <div className="ci-n-skip"><Skip onSkip={onSkip} /></div>
    </>
  );
}

// A roller garage gate: hood with the drum, side guide rails, slatted curtain with vision
// slots that glow as the garage lights warm up behind it, and a floor with the light leak.
function Shutter({ lit, onSkip }) {
  return (
    <>
      <div className="ci-sh-door">
        <div className="ci-sh-curtain">
          <div className="ci-sh-slats" />
          <div className="ci-sh-paint" aria-hidden="true">
            <span className="ci-sh-num">21</span>
            <span className="ci-sh-word">KRISH · RACING</span>
          </div>
          <div className="ci-sh-seams" />
          <div className="ci-sh-vents" aria-hidden="true">
            {[0, 1].map(r => <div key={r}>{Array.from({ length: 14 }, (_, i) => <span key={i} />)}</div>)}
          </div>
          <div className="ci-sh-torch" />
          <div className="ci-sh-bottom"><span className="ci-sh-handle" /><span className="ci-sh-lock"><i /></span></div>
          <div className="ci-sh-flood" />
        </div>
      </div>
      <div className="ci-sh-floor"><div className="ci-sh-leak" /></div>
      <div className="ci-sh-rail ci-sh-rail-l" />
      <div className="ci-sh-rail ci-sh-rail-r" />
      <div className="ci-sh-hood">
        <span className="ci-y ci-sh-hood-l">PIT BUILDING · BAY 21</span>
        <span className="ci-sh-plate">21</span>
      </div>
      <div className="ci-sh-panel">
        <div className="ci-sh-panel-head"><span className="ci-y">DOOR CONTROL</span><span className="ci-dim">BAY 21</span></div>
        {SYSTEMS.map((n, i) => (
          <div key={i} className={'ci-sh-row' + (i < lit ? ' on' : '')}>
            <span className="ci-dim">0{i + 1}</span>
            <span>{n}</span>
            <i />
          </div>
        ))}
        <div className="ci-sh-ctl">
          <span className="ci-sh-up">UP</span>
          <span className="ci-sh-state">{lit < 5 ? 'INTERLOCKS ' + lit + ' / 5' : 'READY'}</span>
        </div>
      </div>
      <div className="ci-sh-skip"><Skip onSkip={onSkip} /></div>
    </>
  );
}

// Per variant: when the 3D scene starts behind the overlay, and when the overlay unmounts (ms after lights out).
// The number starts the scene as its wipe crosses the frame; the shutter only once the gate has fully cleared it.
export const INTRO_TIMING = { number: { scene: 700, end: 1500 }, shutter: { scene: 2100, end: 2100 } };

export default function IntroOverlay({ variant = 'number', phase, lit, onSkip }) {
  const shutter = variant === 'shutter', V = shutter ? Shutter : Number21;
  // Car11 resets lit to 0 at lights out; keep every check green while the overlay clears
  const shown = phase === 'loading' ? lit : 5;
  return (
    <div className="ci" data-v={shutter ? 'shutter' : 'number'} data-stage={phase === 'loading' ? 'load' : 'out'} data-lit={shown} style={{ '--lit': shown }} role="status" aria-label={phase === 'loading' ? 'Loading the garage' : 'Opening the garage'}>
      <V lit={shown} onSkip={onSkip} />
    </div>
  );
}
