import { memo, useEffect, useRef, useState } from 'react';
import { HERO, ORRERY } from '../../content/solutions';
import {
  BASE_PITCH, CAM, PREC, RING_R, SPEED, START_ANGLE, TILT, VB,
} from './orreryLayout';

// The hero's interactive orrery, drawn as a live 3D projection onto an SVG
// (plain maths, no WebGL, so it works everywhere and is cheap on phones).
// "You" is the core; Risk Tolerance and Time Horizon ride two inner rings that
// lean and precess like gyroscopes, and the asset classes ride the outer
// orbit. Names are real buttons that swing round with their spheres, turned
// and scaled with depth like cards on a ring. Drag, or use the arrow keys, to
// turn it; choose a name to bring its sphere to the front.

const NS = 'http://www.w3.org/2000/svg';
const TAU = Math.PI * 2;
const DEPTH_PERSPECTIVE = 760;

// the still picture shown on the server and before the script runs
const StillOrrery = memo(function StillOrrery() {
  return (
    <>
      {RING_R.map((r, i) => (
        <ellipse key={r} cx={VB.cx} cy={VB.cy} rx={r * VB.unit} ry={r * VB.unit * 0.55} className={`or-ring or-ring-${i}`} />
      ))}
      <circle cx={VB.cx} cy={VB.cy} r="17" className="or-halo" />
      <circle cx={VB.cx} cy={VB.cy} r="8" className="or-core" />
    </>
  );
});

const el = (name, attrs) => {
  const n = document.createElementNS(NS, name);
  Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
  return n;
};

export default function Orrery() {
  const worldRef = useRef(null);
  const stageRef = useRef(null);
  const labelRefs = useRef({});
  const api = useRef({ select: () => {}, nudge: () => {} });
  const [selected, setSelected] = useState(null);
  const current = ORRERY.find((b) => b.id === selected);

  useEffect(() => {
    const world = worldRef.current;
    const stage = stageRef.current;
    if (!world || !stage) return undefined;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    world.replaceChildren();
    Object.values(labelRefs.current).forEach((n) => { n.style.left = '0'; n.style.top = '0'; });

    // --- scene objects, created once ----------------------------------
    const rings = RING_R.map((_, i) => world.appendChild(el('path', { class: `or-ring or-ring-${i}`, fill: 'none' })));
    const halo = world.appendChild(el('circle', { class: 'or-halo', r: 17, cx: VB.cx, cy: VB.cy }));
    const core = world.appendChild(el('circle', { class: 'or-core', r: 8, cx: VB.cx, cy: VB.cy }));
    const bodies = ORRERY.map((b) => {
      const g = el('g', { class: 'or-body' + (b.ring === 0 ? ' or-body-risk' : '') });
      const disc = g.appendChild(el('circle', { r: 1, class: 'or-disc' }));
      const shine = g.appendChild(el('circle', { r: 0.34, cx: -0.3, cy: -0.32, class: 'or-shine' }));
      const hit = g.appendChild(el('circle', { r: 2.4, class: 'or-hit' }));
      hit.addEventListener('click', () => { if (!moved) setSelectedBoth(b.id); });
      return { ...b, g, disc, shine, a: START_ANGLE[b.id], base: b.ring === 2 ? 7.5 : 6.5, k: 1, z: 0 };
    });

    // --- state --------------------------------------------------------
    let yaw = 0.35; let pitch = BASE_PITCH; let pitchGoal = BASE_PITCH;
    let vel = 0; let sel = null; let dragging = false; let moved = false;
    let precA = [0, 1.9, 3.8];
    let t = 0; let last = performance.now(); let needs = true; let visible = true; let raf = 0;
    let box = { w: stage.clientWidth || 1, h: stage.clientHeight || 1 };
    let widths = {};

    const setSelectedBoth = (id) => {
      const next = id === sel ? null : id;
      sel = next; needs = true; setSelected(next);
    };
    api.current = {
      select: setSelectedBoth,
      nudge(dy, dp = 0) { yaw += dy; pitchGoal = Math.min(0.95, Math.max(0.12, pitchGoal + dp)); needs = true; },
    };

    const measure = () => {
      box = { w: stage.clientWidth || 1, h: stage.clientHeight || 1 };
      widths = Object.fromEntries(Object.entries(labelRefs.current).map(([id, n]) => [id, n.offsetWidth + 24]));
      needs = true;
    };
    const ro = new ResizeObserver(measure); ro.observe(stage); measure();

    // --- the 3D maths -------------------------------------------------
    // ring-local point -> lean (about z) -> precession (about y) -> yaw (about y)
    const place = (ringIdx, x, z) => {
      const c = Math.cos(TILT[ringIdx]); const s = Math.sin(TILT[ringIdx]);
      let px = x * c; let py = x * s; let pz = z;
      const ph = precA[ringIdx] + yaw; const cp = Math.cos(ph); const sp = Math.sin(ph);
      const nx = px * cp + pz * sp; const nz = -px * sp + pz * cp; px = nx; pz = nz;
      return [px, py, pz];
    };
    const project = (p) => {
      // pitch about x, then perspective
      const cp = Math.cos(pitch); const sp = Math.sin(pitch);
      const y = p[1] * cp - p[2] * sp; const z = p[1] * sp + p[2] * cp;
      const k = CAM / (CAM - z);
      return { x: VB.cx + p[0] * k * VB.unit, y: VB.cy - y * k * VB.unit, k, z };
    };

    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (!still) {
        t += dt;
        if (!dragging && !sel) yaw += 0.11 * dt;
        if (!sel) precA = precA.map((a, i) => a + PREC[i] * dt);
      }
      if (!dragging && Math.abs(vel) > 0.001) { yaw += vel * dt; vel *= 0.92; needs = true; }
      const s = bodies.find((b) => b.id === sel);
      if (s) {
        // turn the system until the chosen sphere faces the viewer
        const p = place(s.ring, Math.cos(s.a) * RING_R[s.ring], Math.sin(s.a) * RING_R[s.ring]);
        const diff = -Math.atan2(p[0], p[2]);
        yaw += diff * Math.min(1, dt * 3.2);
        if (Math.abs(diff) > 0.002) needs = true;
      }
      pitch += (pitchGoal - pitch) * Math.min(1, dt * 4);
      if (Math.abs(pitchGoal - pitch) > 0.001) needs = true;

      // rings
      RING_R.forEach((r, i) => {
        let d = '';
        for (let n = 0; n <= 96; n += 1) {
          const a = (n / 96) * TAU;
          const q = project(place(i, Math.cos(a) * r, Math.sin(a) * r));
          d += (n ? 'L' : 'M') + q.x.toFixed(1) + ' ' + q.y.toFixed(1);
        }
        rings[i].setAttribute('d', d + 'Z');
      });
      const pulse = still ? 1 : 1 + Math.sin(t * 1.6) * 0.1;
      halo.setAttribute('r', (17 * pulse).toFixed(1));
      core.setAttribute('r', '8');

      // bodies, painted far to near
      bodies.forEach((b) => {
        if (!still && b.id !== sel) b.a += SPEED[b.ring] * dt;
        const q = project(place(b.ring, Math.cos(b.a) * RING_R[b.ring], Math.sin(b.a) * RING_R[b.ring]));
        b.q = q;
        const on = b.id === sel;
        b.k += ((on ? 1.75 : 1) - b.k) * Math.min(1, dt * 7);
        const r = b.base * b.k * q.k;
        const near = Math.min(1, Math.max(0, (q.z + 3) / 6));
        const dim = sel && !on ? 0.4 : 1;
        b.g.setAttribute('transform', `translate(${q.x.toFixed(1)} ${q.y.toFixed(1)}) scale(${r.toFixed(2)})`);
        b.g.setAttribute('opacity', ((0.45 + 0.55 * near) * dim).toFixed(2));
        b.g.classList.toggle('is-on', on);
      });
      [...bodies].sort((a, b) => a.q.z - b.q.z).forEach((b) => world.appendChild(b.g));

      // names: they swing round with their spheres, turned and scaled with depth
      bodies.forEach((b) => {
        const node = labelRefs.current[b.id]; if (!node) return;
        const q = b.q;
        const x = (q.x / VB.w) * box.w; const y = (q.y / VB.h) * box.h;
        const side = Math.max(-1, Math.min(1, (q.x - VB.cx) / (RING_R[2] * VB.unit)));
        const near = Math.min(1, Math.max(0, (q.z + 3) / 6));
        const left = x + 14 + (widths[b.id] || 150) > box.w - 4; // flip inward rather than run off the edge
        if (node.classList.contains('is-left') !== left) node.classList.toggle('is-left', left);
        const turn = (left ? 1 : -1) * Math.abs(side) * 34 * (left ? 1 : 1); // degrees
        const scale = 0.82 + 0.28 * near;
        node.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) perspective(${DEPTH_PERSPECTIVE}px) rotateY(${turn.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
        node.style.opacity = String(((sel && b.id !== sel ? 0.5 : 0.5 + 0.5 * near)).toFixed(2));
        node.style.zIndex = String(Math.round(near * 20));
      });
      needs = false;
    };

    const loop = (now) => { raf = requestAnimationFrame(loop); if (visible && (!still || needs)) frame(now); };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; last = performance.now(); }, { threshold: 0.01 });
    io.observe(stage);
    frame(performance.now());
    raf = requestAnimationFrame(loop);

    // --- drag to turn -------------------------------------------------
    let start = null;
    const down = (e) => {
      if (e.target.closest('.or-label')) return;
      dragging = true; moved = false; vel = 0; start = { x: e.clientX, y: e.clientY, lx: e.clientX, ly: e.clientY };
      try { stage.setPointerCapture(e.pointerId); } catch { /* ignore */ }
    };
    const move = (e) => {
      if (!dragging) return;
      if (Math.hypot(e.clientX - start.x, e.clientY - start.y) > 5) moved = true;
      const dx = e.clientX - start.lx; const dy = e.clientY - start.ly;
      start.lx = e.clientX; start.ly = e.clientY;
      yaw += dx * 0.006; vel = dx * 0.006 * 60;
      if (e.pointerType !== 'touch') pitchGoal = Math.min(0.95, Math.max(0.12, pitchGoal + dy * 0.004));
      needs = true;
    };
    const up = () => { dragging = false; window.setTimeout(() => { moved = false; }, 0); };
    stage.addEventListener('pointerdown', down); stage.addEventListener('pointermove', move);
    stage.addEventListener('pointerup', up); stage.addEventListener('pointercancel', up);

    return () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
      stage.removeEventListener('pointerdown', down); stage.removeEventListener('pointermove', move);
      stage.removeEventListener('pointerup', up); stage.removeEventListener('pointercancel', up);
    };
  }, []);

  const onKey = (e) => {
    if (e.target !== e.currentTarget) return;
    const k = { ArrowLeft: [-0.25, 0], ArrowRight: [0.25, 0], ArrowUp: [0, -0.08], ArrowDown: [0, 0.08] }[e.key];
    if (k) { e.preventDefault(); api.current.nudge(k[0], k[1]); }
    if (e.key === 'Escape' && selected) api.current.select(selected);
  };

  return (
    <div className="or">
      <div className="or-stage" ref={stageRef} role="group" aria-label={HERO.orreryLabel} tabIndex={0} onKeyDown={onKey}>
        <svg className="or-svg" viewBox={`0 0 ${VB.w} ${VB.h}`} focusable="false" aria-hidden="true">
          <g ref={worldRef}><StillOrrery /></g>
        </svg>
        <span className="or-you" aria-hidden="true">You</span>
        {ORRERY.map((b) => {
          const sx = START_ANGLE[b.id];
          const x = 50 + Math.cos(sx) * RING_R[b.ring] * 14; const y = 50 + Math.sin(sx) * RING_R[b.ring] * 7;
          return (
            <button
              key={b.id}
              type="button"
              ref={(n) => { if (n) labelRefs.current[b.id] = n; }}
              className={'or-label' + (b.ring < 2 ? ' or-label-in' : '') + (selected === b.id ? ' is-on' : '')}
              style={{ '--sx': `${x}%`, '--sy': `${y}%` }}
              aria-pressed={selected === b.id}
              aria-label={`${b.name}. ${b.line}`}
              onClick={() => api.current.select(b.id)}
            >
              <span>{b.name}</span>
            </button>
          );
        })}
      </div>
      {/* phones: the names also sit in a row of chips */}
      <div className="or-chips">
        {ORRERY.map((b) => (
          <button key={b.id} type="button" className={selected === b.id ? 'is-on' : ''} aria-pressed={selected === b.id} onClick={() => api.current.select(b.id)}>{b.name}</button>
        ))}
      </div>
      <div className={'or-panel' + (current ? '' : ' is-empty')} aria-live="polite">
        {current && (<><strong>{current.name}</strong><span>{current.line}</span></>)}
      </div>
    </div>
  );
}
