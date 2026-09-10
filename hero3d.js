/**
 * ShopWave — 3D hero centerpiece
 *
 * A small orbiting network: a core node (ShopWave) connected to four
 * satellite nodes representing the four service categories (Web,
 * Python, IT/Linux, Cloud). Idle rotation + mouse parallax give it
 * depth without pulling focus from the page content.
 *
 * Fails gracefully: if Three.js can't load (offline, blocked CDN),
 * the static terminal panel already in the DOM is the fallback —
 * nothing breaks, the hero just loses the background scene.
 */
import * as THREE from 'three';

const canvas = document.getElementById('heroCanvas');
const stage = document.getElementById('heroVisual');

if (canvas && stage) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 7);

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // ---- Lighting: navy ambient + a cool blue key light for depth ----
  scene.add(new THREE.AmbientLight(0x1a2a55, 1.4));

  const keyLight = new THREE.PointLight(0x4c8bff, 3.2, 20);
  keyLight.position.set(3, 2.5, 4);
  scene.add(keyLight);

  const rimLight = new THREE.PointLight(0x2f6fed, 1.4, 20);
  rimLight.position.set(-4, -2, -3);
  scene.add(rimLight);

  // ---- Group everything so we can rotate/parallax as one unit ----
  const group = new THREE.Group();
  scene.add(group);

  // Core node — the "ShopWave" center
  const coreGeo = new THREE.IcosahedronGeometry(1, 1);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0x16234a,
    emissive: 0x2f6fed,
    emissiveIntensity: 0.35,
    roughness: 0.35,
    metalness: 0.2,
    flatShading: true
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  group.add(core);

  const coreWire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.28, 1),
    new THREE.MeshBasicMaterial({ color: 0x4c8bff, wireframe: true, transparent: true, opacity: 0.28 })
  );
  group.add(coreWire);

  // Satellite nodes — the four service categories
  const satelliteDefs = [
    { angle: 0.0, height: 0.6 },
    { angle: Math.PI / 2, height: -0.5 },
    { angle: Math.PI, height: 0.45 },
    { angle: (Math.PI * 3) / 2, height: -0.35 }
  ];
  const orbitRadius = 2.5;
  const satellites = [];
  const lineMat = new THREE.LineBasicMaterial({ color: 0x4c8bff, transparent: true, opacity: 0.35 });

  satelliteDefs.forEach(function (def) {
    const x = Math.cos(def.angle) * orbitRadius;
    const z = Math.sin(def.angle) * orbitRadius;
    const y = def.height;

    const satGeo = new THREE.IcosahedronGeometry(0.22, 0);
    const satMat = new THREE.MeshStandardMaterial({
      color: 0x2f6fed,
      emissive: 0x4c8bff,
      emissiveIntensity: 0.5,
      roughness: 0.4,
      flatShading: true
    });
    const satellite = new THREE.Mesh(satGeo, satMat);
    satellite.position.set(x, y, z);
    group.add(satellite);
    satellites.push({ mesh: satellite, baseAngle: def.angle, height: y, phase: Math.random() * Math.PI * 2 });

    const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, y, z)];
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    group.add(new THREE.Line(lineGeo, lineMat));
  });

  // Faint outer ring for scale/depth
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(orbitRadius, 0.008, 8, 96),
    new THREE.MeshBasicMaterial({ color: 0x4c8bff, transparent: true, opacity: 0.18 })
  );
  ring.rotation.x = Math.PI / 2.4;
  group.add(ring);

  group.rotation.x = 0.25;

  // ---- Sizing ----
  function resize() {
    const rect = stage.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height || width;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // ---- Mouse parallax (very small, tasteful tilt) ----
  let targetTiltX = 0;
  let targetTiltY = 0;
  let currentTiltX = 0;
  let currentTiltY = 0;

  if (!prefersReducedMotion) {
    window.addEventListener('mousemove', function (e) {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      targetTiltY = nx * 0.35;
      targetTiltX = ny * 0.2;
    });
  }

  // ---- Scroll-linked dolly on the hero stage only ----
  function applyScrollEffect() {
    const heroHeight = stage.closest('.hero') ? stage.closest('.hero').offsetHeight : 800;
    const progress = Math.min(Math.max(window.scrollY / heroHeight, 0), 1);
    stage.style.transform = 'translateY(' + (progress * 26) + 'px) scale(' + (1 - progress * 0.06) + ')';
    stage.style.opacity = String(1 - progress * 0.55);
  }
  window.addEventListener('scroll', applyScrollEffect, { passive: true });
  applyScrollEffect();

  // ---- Render loop ----
  const clock = new THREE.Clock();

  function renderStatic() {
    resize();
    renderer.render(scene, camera);
  }

  function animate() {
    const t = clock.getElapsedTime();

    group.rotation.y = t * 0.18;

    currentTiltX += (targetTiltX - currentTiltX) * 0.05;
    currentTiltY += (targetTiltY - currentTiltY) * 0.05;
    group.rotation.x = 0.25 + currentTiltX;
    camera.position.x = currentTiltY * 0.6;
    camera.lookAt(0, 0, 0);

    // gentle breathing on the core
    const breathe = 1 + Math.sin(t * 0.9) * 0.025;
    core.scale.setScalar(breathe);
    coreWire.scale.setScalar(breathe);

    // satellites drift slightly on their own axis for a "live" feel
    satellites.forEach(function (s) {
      s.mesh.rotation.x = t * 0.6 + s.phase;
      s.mesh.rotation.y = t * 0.4 + s.phase;
    });

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  if (prefersReducedMotion) {
    renderStatic();
  } else {
    requestAnimationFrame(animate);
  }
}
