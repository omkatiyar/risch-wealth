// A small three.js donut for the allocation section: six extruded segments
// that grow into place and glide between portfolios. The legend next to it is
// real text; this is decoration, so it carries no interaction beyond a gentle
// pointer tilt. Returns { setValues, dispose } or null without WebGL.

import {
  AmbientLight, Color, DirectionalLight, ExtrudeGeometry, Group, Mesh, MeshStandardMaterial,
  PerspectiveCamera, Raycaster, Scene, Shape, Vector2, WebGLRenderer,
} from 'three';

const TAU = Math.PI * 2;
const R_OUT = 1.5; const R_IN = 0.92; const DEPTH = 0.42;
const ease = (t) => { const c = Math.min(1, Math.max(0, t)); return c * c * (3 - 2 * c); };

function segment(a0, a1) {
  const s = new Shape();
  s.moveTo(Math.cos(a0) * R_IN, Math.sin(a0) * R_IN);
  s.absarc(0, 0, R_OUT, a0, a1, false);
  s.lineTo(Math.cos(a1) * R_IN, Math.sin(a1) * R_IN);
  s.absarc(0, 0, R_IN, a1, a0, true);
  s.closePath();
  return new ExtrudeGeometry(s, {
    depth: DEPTH, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 2,
    curveSegments: Math.max(3, Math.ceil(((a1 - a0) / TAU) * 64)),
  });
}

export function mountDonut(host, { colors, values, reduced, onHover }) {
  let renderer;
  try { renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' }); } catch { return null; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setClearColor(0x000000, 0);
  host.appendChild(renderer.domElement);
  const cv = renderer.domElement;
  cv.style.cssText = 'display:block;width:100%;height:100%';

  const scene = new Scene();
  const camera = new PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 0, 8.4);
  scene.add(new AmbientLight(0xffffff, 1.7));
  const key = new DirectionalLight(0xfff1de, 2.6); key.position.set(-3, 5, 7); scene.add(key);
  const group = new Group(); scene.add(group);
  const mats = colors.map((c) => new MeshStandardMaterial({ color: new Color(c), metalness: 0.35, roughness: 0.42 }));
  let meshes = [];
  let hover = -1; const lift = colors.map(() => 0); // 0..1 per segment
  const ray = new Raycaster(); const ndc = new Vector2();
  let from = values.slice(); let to = values.slice(); let cur = values.slice();
  let tween = 1; let intro = reduced ? 1 : 0;
  let needs = true;

  const build = (vals) => {
    meshes.forEach((m) => { group.remove(m); m.geometry.dispose(); });
    meshes = [];
    const total = vals.reduce((a, b) => a + b, 0) || 1;
    let a = -Math.PI / 2;
    const gap = 0.035;
    vals.forEach((v, i) => {
      const span = (v / total) * TAU;
      if (span > gap * 2) {
        const m = new Mesh(segment(a + gap / 2, a + span - gap / 2), mats[i]);
        m.position.z = -DEPTH / 2; m.userData.i = i;
        group.add(m); meshes.push(m);
      }
      a += span;
    });
  };
  build(cur);

  const resize = () => {
    const w = host.clientWidth || 1; const h = host.clientHeight || 1;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); needs = true;
  };
  const ro = new ResizeObserver(resize); ro.observe(host); resize();

  // hover: the segment under the pointer steps forward and grows a little
  const pick = (e) => {
    const r = cv.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(meshes, false)[0];
    const i = hit ? hit.object.userData.i : -1;
    if (i !== hover) { hover = i; onHover?.(i); cv.style.cursor = i >= 0 ? 'pointer' : 'default'; needs = true; }
  };
  const leave = () => { if (hover !== -1) { hover = -1; onHover?.(-1); needs = true; } };
  cv.addEventListener('pointermove', pick); cv.addEventListener('pointerleave', leave);

  const tiltGoal = { x: -0.5, y: 0 }; const tiltNow = { x: -0.5, y: 0 };
  const onMove = (e) => {
    if (reduced) return;
    const r = host.getBoundingClientRect();
    tiltGoal.y = (((e.clientX - r.left) / r.width) * 2 - 1) * 0.35;
    tiltGoal.x = -0.5 + (((e.clientY - r.top) / r.height) * 2 - 1) * 0.12;
  };
  window.addEventListener('pointermove', onMove, { passive: true });

  let last = performance.now(); let t = 0; let raf = 0; let visible = true;
  const frame = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt;
    if (intro < 1) { intro = Math.min(1, intro + dt / 1.4); needs = true; }
    if (tween < 1) {
      tween = Math.min(1, tween + dt / 0.9);
      const k = ease(tween);
      cur = to.map((v, i) => from[i] + (v - from[i]) * k);
      build(cur); needs = true;
    }
    lift.forEach((v, i) => {
      const goal = i === hover ? 1 : 0;
      lift[i] += (goal - v) * Math.min(1, dt * 10);
      if (Math.abs(goal - lift[i]) > 0.002) needs = true;
    });
    meshes.forEach((m) => {
      const k = lift[m.userData.i];
      m.position.z = -DEPTH / 2 + k * 0.5;
      m.scale.setScalar(1 + k * 0.05);
      mats[m.userData.i].emissive.setScalar(k * 0.18);
    });
    tiltNow.x += (tiltGoal.x - tiltNow.x) * 0.06; tiltNow.y += (tiltGoal.y - tiltNow.y) * 0.06;
    const sway = reduced ? 0 : Math.sin(t * 0.5) * 0.08;
    group.rotation.x = tiltNow.x; group.rotation.y = tiltNow.y + sway;
    group.rotation.z = (1 - ease(intro)) * -1.2;
    group.scale.setScalar(0.55 + 0.45 * ease(intro));
    renderer.render(scene, camera);
    if (reduced) needs = false;
  };
  const loop = (now) => { raf = requestAnimationFrame(loop); if (!reduced || needs) frame(now); };
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !visible) { last = performance.now(); raf = requestAnimationFrame(loop); }
    if (!e.isIntersecting && visible) cancelAnimationFrame(raf);
    visible = e.isIntersecting;
  }, { threshold: 0.01 });
  io.observe(host);
  raf = requestAnimationFrame(loop);

  return {
    setHover(i) { if (i !== hover) { hover = i; needs = true; } },
    setValues(vals) { from = cur.slice(); to = vals.slice(); tween = 0; needs = true; },
    dispose() {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
      window.removeEventListener('pointermove', onMove); cv.removeEventListener('pointermove', pick); cv.removeEventListener('pointerleave', leave);
      meshes.forEach((m) => m.geometry.dispose()); mats.forEach((m) => m.dispose());
      renderer.dispose(); cv.remove();
    },
  };
}
