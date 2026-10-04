// "The Capital Orbit": a handful of very thin arcs hung in space like
// generations of a family's capital, with a few small nodes riding them and
// one orange point of focus travelling slowly along the longest. Deliberately
// quiet: hairline strokes, no bloom, no lighting, almost no pointer response.
//
// Colours come from CSS variables on the host (--orbit-line, --orbit-node,
// --orbit-accent), so the light and dark themes are handled in the stylesheet
// and the scene re-reads them when the theme flips.
//
// Loaded as its own chunk after the page has settled (see CapitalOrbit.jsx),
// and shares the three.js chunk the nav logo already pulls in.

import {
  BufferAttribute, BufferGeometry, DataTexture, Group, LinearFilter, MathUtils, Mesh, MeshBasicMaterial,
  PerspectiveCamera, Points, PointsMaterial, RGBAFormat, Scene, SphereGeometry, SRGBColorSpace, Sprite,
  SpriteMaterial, TorusGeometry, Color, WebGLRenderer,
} from 'three';

// radius, how much of the circle it covers (radians), tilt about x and y,
// spin speed, line weight, opacity
const ARCS = [
  { r: 2.5, arc: 5.0, tx: 1.15, ty: 0.15, spin: 0.045, w: 0.0105, o: 0.85 },
  { r: 1.95, arc: 4.1, tx: 0.55, ty: -0.7, spin: -0.06, w: 0.0085, o: 0.62 },
  { r: 3.05, arc: 3.6, tx: 1.45, ty: 0.55, spin: 0.03, w: 0.0075, o: 0.42 },
  { r: 1.45, arc: 5.6, tx: 0.2, ty: 0.9, spin: 0.08, w: 0.0075, o: 0.5 },
];
// which arc each node rides, where along it (0..1), and its size
const NODES = [
  { ring: 0, at: 0.18, size: 0.045 }, { ring: 0, at: 0.74, size: 0.032 },
  { ring: 1, at: 0.4, size: 0.04 }, { ring: 2, at: 0.62, size: 0.03 },
  { ring: 3, at: 0.22, size: 0.034 },
];
const DUST = 38;

// a soft round glow, written straight into a texture (a canvas would keep it
// premultiplied and fringe the faint edge)
function glowTexture() {
  const N = 96;
  const data = new Uint8Array(N * N * 4);
  for (let y = 0; y < N; y += 1) {
    for (let x = 0; x < N; x += 1) {
      const d = Math.hypot(x - N / 2 + 0.5, y - N / 2 + 0.5) / (N / 2);
      const i = (y * N + x) * 4;
      data[i] = 255; data[i + 1] = 255; data[i + 2] = 255;
      data[i + 3] = d >= 1 ? 0 : Math.round(Math.pow(1 - d, 2.4) * 255);
    }
  }
  const tex = new DataTexture(data, N, N, RGBAFormat);
  tex.colorSpace = SRGBColorSpace;
  tex.magFilter = LinearFilter;
  tex.minFilter = LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

// Returns null if WebGL isn't available, so the caller keeps the poster.
export function mountOrbitScene(host) {
  let renderer;
  try {
    renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  host.appendChild(renderer.domElement);

  const scene = new Scene();
  const camera = new PerspectiveCamera(32, 1, 0.1, 60);
  camera.position.set(0, 0, 11);

  const colors = { line: new Color(), node: new Color(), accent: new Color() };
  const readColors = () => {
    const cs = getComputedStyle(host);
    const get = (v, fallback) => (cs.getPropertyValue(v).trim() || fallback);
    colors.line.set(get('--orbit-line', '#0F1E33'));
    colors.node.set(get('--orbit-node', '#0F1E33'));
    colors.accent.set(get('--orbit-accent', '#EE7A1E'));
  };
  readColors();

  const geos = [];
  const mats = [];
  const rings = [];
  const root = new Group();
  scene.add(root);

  ARCS.forEach((a, i) => {
    const g = new TorusGeometry(a.r, a.w, 6, 220, a.arc);
    const m = new MeshBasicMaterial({ color: colors.line, transparent: true, opacity: a.o, depthWrite: false });
    geos.push(g); mats.push(m);
    const holder = new Group();           // tilt
    const spinner = new Group();          // spin about the tilted axis
    holder.rotation.set(a.tx, a.ty, 0);
    spinner.rotation.z = i * 1.3;
    spinner.add(new Mesh(g, m));
    holder.add(spinner);
    root.add(holder);
    rings.push({ spinner, a });
  });

  // small navy nodes riding the arcs
  const nodeMat = new MeshBasicMaterial({ color: colors.node, transparent: true, opacity: 0.9, depthWrite: false });
  mats.push(nodeMat);
  NODES.forEach((n) => {
    const g = new SphereGeometry(n.size, 20, 14);
    geos.push(g);
    const mesh = new Mesh(g, nodeMat);
    const ang = n.at * ARCS[n.ring].arc;
    mesh.position.set(ARCS[n.ring].r * Math.cos(ang), ARCS[n.ring].r * Math.sin(ang), 0);
    rings[n.ring].spinner.add(mesh);
  });

  // the one orange point: rides the longest arc, back and forth, slowly
  const focusGeo = new SphereGeometry(0.075, 28, 20);
  const focusMat = new MeshBasicMaterial({ color: colors.accent });
  geos.push(focusGeo); mats.push(focusMat);
  const focus = new Mesh(focusGeo, focusMat);
  const glowTex = glowTexture();
  const glow = new Sprite(new SpriteMaterial({ map: glowTex, color: colors.accent, transparent: true, opacity: 0.32, depthWrite: false }));
  glow.scale.setScalar(0.62);
  focus.add(glow);
  rings[0].spinner.add(focus);

  // very sparse dust
  const dustPos = new Float32Array(DUST * 3);
  for (let i = 0; i < DUST; i += 1) {
    const r = 2.2 + Math.random() * 2.6;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    dustPos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    dustPos[i * 3 + 1] = r * Math.cos(ph) * 0.8;
    dustPos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
  }
  const dustGeo = new BufferGeometry();
  dustGeo.setAttribute('position', new BufferAttribute(dustPos, 3));
  const dustMat = new PointsMaterial({ color: colors.node, size: 0.035, transparent: true, opacity: 0.4, depthWrite: false, sizeAttenuation: true });
  geos.push(dustGeo); mats.push(dustMat);
  const dust = new Points(dustGeo, dustMat);
  scene.add(dust);

  const recolor = () => {
    readColors();
    ARCS.forEach((a, i) => mats[i].color.copy(colors.line));
    nodeMat.color.copy(colors.node);
    dustMat.color.copy(colors.node);
    focusMat.color.copy(colors.accent);
    glow.material.color.copy(colors.accent);
  };
  const themeObserver = new MutationObserver(recolor);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  const resize = () => {
    const w = host.clientWidth;
    const h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // pull back until the outermost arc fits, with a little breathing room
    const half = Math.tan(MathUtils.degToRad(camera.fov / 2));
    camera.position.z = Math.max((3.4 * 1.1) / half, (3.4 * 1.1) / (half * camera.aspect));
    camera.updateProjectionMatrix();
  };
  resize();
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);

  // pointer response is deliberately almost imperceptible
  const target = { x: 0, y: 0 };
  const lean = { x: 0, y: 0 };
  const onMove = (e) => {
    target.x = (e.clientX / window.innerWidth) * 2 - 1;
    target.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener('pointermove', onMove, { passive: true });

  const FIXED = new URLSearchParams(window.location.search).has('pose'); // for taking a still
  let last = performance.now();
  let t = FIXED ? 9 : 0;
  const frame = (now) => {
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    if (!FIXED) t += dt;
    lean.x += (target.x - lean.x) * Math.min(1, dt * 1.4);
    lean.y += (target.y - lean.y) * Math.min(1, dt * 1.4);

    rings.forEach(({ spinner, a }, i) => { spinner.rotation.z = i * 1.3 + t * a.spin; });
    // ping-pong along the longest arc
    const u = 0.5 + 0.5 * Math.sin(t * 0.16 - 1.2);
    const ang = u * ARCS[0].arc;
    focus.position.set(ARCS[0].r * Math.cos(ang), ARCS[0].r * Math.sin(ang), 0);
    glow.material.opacity = 0.26 + 0.07 * Math.sin(t * 0.9);

    root.rotation.y = -0.32 + Math.sin(t * 0.07) * 0.1 + lean.x * 0.07;
    root.rotation.x = 0.12 + lean.y * 0.05;
    dust.rotation.y = t * 0.01;
    renderer.render(scene, camera);
  };

  frame(performance.now());       // first frame immediately, so the swap-in has pixels
  if (!FIXED) renderer.setAnimationLoop(frame);

  return {
    // paused while scrolled out of view, so an unseen scene costs nothing
    setActive(on) {
      if (FIXED) return;
      if (on) {
        last = performance.now();
        renderer.setAnimationLoop(frame);
      } else {
        renderer.setAnimationLoop(null);
      }
    },
    dispose() {
      renderer.setAnimationLoop(null);
      window.removeEventListener('pointermove', onMove);
      themeObserver.disconnect();
      resizeObserver.disconnect();
      geos.forEach((g) => g.dispose());
      mats.forEach((m) => m.dispose());
      glow.material.dispose();
      glowTex.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
