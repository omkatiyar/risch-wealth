// Three.js scene for the Testimonials hero: a polished gold shield with a
// check mark, inside a slowly turning copper ring, with gold dust drifting
// around it. A shield and a tick are the most widely understood marks of
// trust there are. It leans toward the cursor, so the metal catches the light
// as the visitor moves. Built from primitives, so there is no model file.
//
// Loaded as its own chunk after the page has settled (see TrustStage.jsx),
// and shares the three.js chunk the nav logo already pulls in.

import {
  ACESFilmicToneMapping, BufferAttribute, BufferGeometry, CanvasTexture, CapsuleGeometry, DirectionalLight,
  ExtrudeGeometry, Group, Mesh, MeshPhysicalMaterial, PerspectiveCamera, PMREMGenerator, Points, PointsMaterial,
  Scene, Shape, TorusGeometry, WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const DUST = 90;

// Heater-shield outline, about 2 units wide and 2.5 tall, centred on the origin.
function shieldShape(scale = 1) {
  const s = new Shape();
  const w = 1 * scale;
  s.moveTo(-w, 1.05 * scale);
  s.quadraticCurveTo(0, 1.32 * scale, w, 1.05 * scale);                  // gently arched top
  s.lineTo(w, 0.05 * scale);
  s.bezierCurveTo(w, -0.75 * scale, 0.5 * scale, -1.2 * scale, 0, -1.4 * scale);
  s.bezierCurveTo(-0.5 * scale, -1.2 * scale, -w, -0.75 * scale, -w, 0.05 * scale);
  s.closePath();
  return s;
}

// Soft round sprite for the dust, so the points aren't hard squares.
function dustSprite() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(222,150,48,1)');
  grad.addColorStop(0.35, 'rgba(222,150,48,.5)');
  grad.addColorStop(1, 'rgba(222,150,48,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return new CanvasTexture(c);
}

// Returns null if WebGL isn't available, so the caller keeps the poster.
export function mountTrustScene(host) {
  let renderer;
  try {
    renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  host.appendChild(renderer.domElement);

  const scene = new Scene();
  // Procedural studio lighting for the reflections: no image file needed.
  const pmrem = new PMREMGenerator(renderer);
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envRT.texture;

  const key = new DirectionalLight(0xfff0d8, 2.4);
  key.position.set(3, 4, 5);
  scene.add(key);

  const camera = new PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 0.1, 9.4);
  camera.lookAt(0, 0, 0);

  const gold = new MeshPhysicalMaterial({ color: 0xe3b560, metalness: 1, roughness: 0.2, clearcoat: 0.55, clearcoatRoughness: 0.16 });
  const copper = new MeshPhysicalMaterial({ color: 0xd8672a, metalness: 1, roughness: 0.28, clearcoat: 0.4, clearcoatRoughness: 0.22 });
  const ivory = new MeshPhysicalMaterial({ color: 0xfaf3e4, metalness: 0.15, roughness: 0.32, clearcoat: 0.6, clearcoatRoughness: 0.15 });

  const geos = [];
  const mesh = (geo, mat, parent) => {
    geos.push(geo);
    const m = new Mesh(geo, mat);
    parent.add(m);
    return m;
  };

  const emblem = new Group();

  // the shield: a bevelled gold plate, a copper inset, and a check on top
  mesh(new ExtrudeGeometry(shieldShape(1), {
    depth: 0.2, bevelEnabled: true, bevelThickness: 0.12, bevelSize: 0.1, bevelSegments: 10, curveSegments: 56,
  }), gold, emblem).position.z = -0.1;
  mesh(new ExtrudeGeometry(shieldShape(0.8), {
    depth: 0.06, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.04, bevelSegments: 6, curveSegments: 56,
  }), copper, emblem).position.set(0, 0.02, 0.18);

  // the check: a short arm and a long arm, each a rounded bar
  const check = new Group();
  const arm = (len, angle, x, y) => {
    const m = mesh(new CapsuleGeometry(0.1, len, 8, 20), ivory, check);
    m.rotation.z = angle;
    m.position.set(x, y, 0);
  };
  arm(0.32, Math.PI / 4, -0.23, -0.18);     // short stroke: down to the right
  arm(0.74, -0.656, 0.23, -0.01);           // long stroke: up to the right
  check.position.set(0, 0.0, 0.32);
  emblem.add(check);

  // the ring: a thin copper hoop, tilted, that circles the shield
  const ring = new Group();
  mesh(new TorusGeometry(2.05, 0.05, 36, 220), copper, ring);
  ring.rotation.x = 1.12;
  ring.rotation.y = 0.35;

  const pair = new Group();
  pair.add(emblem, ring);
  scene.add(pair);

  const dustPos = new Float32Array(DUST * 3);
  for (let i = 0; i < DUST; i += 1) {
    const r = 2.1 + Math.pow(Math.random(), 0.8) * 1.8;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    dustPos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    dustPos[i * 3 + 1] = r * Math.cos(ph) * 0.85;
    dustPos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
  }
  const dustGeo = new BufferGeometry();
  dustGeo.setAttribute('position', new BufferAttribute(dustPos, 3));
  const sprite = dustSprite();
  const dustMat = new PointsMaterial({ size: 0.12, map: sprite, transparent: true, opacity: 0.85, depthWrite: false });
  const dust = new Points(dustGeo, dustMat);
  scene.add(dust);

  const resize = () => {
    const w = host.clientWidth;
    const h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);

  // Pointer parallax: the whole piece leans gently toward the cursor.
  const target = { x: 0, y: 0 };
  const lean = { x: 0, y: 0 };
  const onMove = (e) => {
    target.x = (e.clientX / window.innerWidth) * 2 - 1;
    target.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener('pointermove', onMove, { passive: true });

  const FIXED = new URLSearchParams(window.location.search).has('pose'); // for taking the poster still
  let last = performance.now();
  let t = FIXED ? 1.4 : 0;
  const frame = (now) => {
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    if (!FIXED) t += dt;
    lean.x += (target.x - lean.x) * Math.min(1, dt * 2.2);
    lean.y += (target.y - lean.y) * Math.min(1, dt * 2.2);

    emblem.rotation.y = Math.sin(t * 0.55) * 0.42 + lean.x * 0.5;
    emblem.rotation.x = -0.06 + Math.sin(t * 0.4) * 0.06 + lean.y * 0.24;
    emblem.position.y = Math.sin(t * 0.9) * 0.08;
    ring.rotation.z = t * 0.28;
    ring.rotation.x = 1.12 + Math.sin(t * 0.3) * 0.06 + lean.y * 0.12;
    ring.rotation.y = 0.35 + lean.x * 0.2;
    dust.rotation.y = t * 0.035 + lean.x * 0.12;
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
      resizeObserver.disconnect();
      geos.forEach((g) => g.dispose());
      [gold, copper, ivory].forEach((m) => m.dispose());
      dustGeo.dispose();
      dustMat.dispose();
      sprite.dispose();
      envRT.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
