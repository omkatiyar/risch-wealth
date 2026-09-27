// Three.js rendering of the logo ring: four flat segments in an
// orthographic scene, spinning about their common centre. Loaded as a
// separate chunk a few seconds after page load (see LogoRing.jsx), so it
// never delays first paint or interactivity.

import {
  Group, Mesh, MeshBasicMaterial, OrthographicCamera, Scene, Shape, ShapeGeometry, WebGLRenderer,
} from 'three';
import { INNER, SEGMENTS, outline } from './ringGeometry';

// One full, calm revolution. Must match the logoSpin duration in styles.css.
const PERIOD_SECONDS = 18;

// Returns null if WebGL isn't available, so the caller can fall back.
export function mountLogoRing(host, readStyle, startAngle = 0) {
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
  // A hair of margin so the anti-aliased outer edge isn't clipped.
  const camera = new OrthographicCamera(-1.02, 1.02, 1.02, -1.02, 0, 10);
  camera.position.z = 1;

  const ring = new Group();
  // Pick up exactly where the CSS spin had got to, so the hand-off is seamless.
  ring.rotation.z = -startAngle;
  scene.add(ring);

  const materials = [];
  const geometries = [];
  for (const seg of SEGMENTS) {
    const { a0o, a1o, a0i, a1i } = outline(seg);
    const shape = new Shape();
    shape.moveTo(Math.cos(a0o), Math.sin(a0o));
    shape.absarc(0, 0, 1, a0o, a1o, false);
    shape.lineTo(INNER * Math.cos(a1i), INNER * Math.sin(a1i));
    shape.absarc(0, 0, INNER, a1i, a0i, true);
    shape.closePath();

    const geometry = new ShapeGeometry(shape, 48);
    const material = new MeshBasicMaterial({ transparent: true, depthTest: false, depthWrite: false });
    material.userData.tone = seg.tone;
    geometries.push(geometry);
    materials.push(material);
    ring.add(new Mesh(geometry, material));
  }

  // Per-tone colour and opacity come from CSS variables, so the theme
  // (and any future palette change) lives in the stylesheet.
  const applyStyle = () => {
    const style = readStyle();
    for (const m of materials) {
      m.color.set(style[`${m.userData.tone}Color`]);
      m.opacity = style[m.userData.tone];
    }
  };
  applyStyle();

  const resize = () => {
    const size = host.clientWidth;
    if (size) renderer.setSize(size, size, false);
  };
  resize();
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);

  // Clockwise, time-based so speed is identical at 60 Hz or 120 Hz.
  // requestAnimationFrame pauses in background tabs, so an unseen ring
  // costs nothing.
  const speed = (2 * Math.PI) / PERIOD_SECONDS;
  let last = performance.now();
  renderer.setAnimationLoop((now) => {
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    ring.rotation.z -= speed * dt;
    renderer.render(scene, camera);
  });

  return {
    applyStyle,
    dispose() {
      renderer.setAnimationLoop(null);
      resizeObserver.disconnect();
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
