import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { Rotate3D, ZoomIn } from 'lucide-react';
import './realistic-bmw.css';

const MODEL_URL = 'https://raw.githubusercontent.com/lukaizj/car-mod-saas/main/public/models/bmw-m4.web.glb';
const VIEWS = [
  ['FRONT VIEW', 'Engine & diagnostics', 'Front-end inspection and precision scanning.'],
  ['RIGHT SIDE', 'Suspension & wheels', 'Steering, suspension and wheel safety check.'],
  ['REAR VIEW', 'Exhaust & performance', 'Exhaust, catalytic converter and road performance.'],
  ['LEFT SIDE', 'Brakes & body', 'Brake, tyre and exterior condition inspection.'],
];

function normalizeAngle(value) {
  const two = Math.PI * 2;
  let a = value % two;
  if (a < 0) a += two;
  return a;
}

export default function RealisticBMW() {
  const mountRef = useRef(null);
  const modelRef = useRef(null);
  const rendererRef = useRef(null);
  const frameRef = useRef(0);
  const stateRef = useRef({ angle: 0, targetAngle: 0, zoom: 5.2, targetZoom: 5.2, drag: false, x: 0 });
  const [view, setView] = useState(VIEWS[0]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 1.15, 5.2);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: window.innerWidth > 700, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 700 ? 1.25 : 1.6));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = window.innerWidth > 700;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    scene.add(new THREE.HemisphereLight(0xe9f5ed, 0x06120d, 2.1));
    const key = new THREE.DirectionalLight(0xfff5dd, 3.2);
    key.position.set(4, 6, 5); key.castShadow = true; scene.add(key);
    const rim = new THREE.DirectionalLight(0x9bffcf, 2.4);
    rim.position.set(-5, 3, -4); scene.add(rim);
    const front = new THREE.PointLight(0xffd36b, 35, 10);
    front.position.set(0, 1.5, 4); scene.add(front);

    const ground = new THREE.Mesh(new THREE.CircleGeometry(2.8, 64), new THREE.MeshBasicMaterial({ color: 0x071711, transparent: true, opacity: 0.55, depthWrite: false }));
    ground.rotation.x = -Math.PI / 2; ground.position.y = -0.65; scene.add(ground);
    const group = new THREE.Group(); scene.add(group); modelRef.current = group;

    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load(MODEL_URL, (gltf) => {
      const model = gltf.scene;
      model.traverse((obj) => {
        if (obj.isMesh) { obj.castShadow = true; obj.receiveShadow = true; if (obj.material) obj.material.envMapIntensity = 1.25; }
      });
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      model.position.sub(center);
      model.scale.setScalar(3.5 / Math.max(size.x, size.y, size.z));
      model.position.y = -0.55;
      group.add(model);
      setLoading(false);
    }, undefined, () => { setLoading(false); setFailed(true); });

    const resize = () => {
      const w = mount.clientWidth || 1, h = mount.clientHeight || 1;
      camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h, false);
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(mount);
    const animate = () => {
      const s = stateRef.current;
      s.angle += (s.targetAngle - s.angle) * 0.1;
      s.zoom += (s.targetZoom - s.zoom) * 0.1;
      group.rotation.y = s.angle;
      camera.position.z = s.zoom;
      camera.position.y = 1.15 + Math.sin(s.angle * 0.5) * 0.03;
      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(animate);
    };
    animate();

    const onPointerDown = (e) => { stateRef.current.drag = true; stateRef.current.x = e.clientX; mount.setPointerCapture?.(e.pointerId); };
    const onPointerMove = (e) => { const s = stateRef.current; if (!s.drag) return; s.targetAngle += (e.clientX - s.x) * 0.012; s.x = e.clientX; };
    const onPointerUp = () => { stateRef.current.drag = false; };
    const onWheel = (e) => { e.preventDefault(); stateRef.current.targetZoom = THREE.MathUtils.clamp(stateRef.current.targetZoom + e.deltaY * 0.002, 3.7, 7.0); };
    const onTouchMove = (e) => { if (stateRef.current.drag && e.touches.length === 1) e.preventDefault(); };
    mount.addEventListener('pointerdown', onPointerDown); mount.addEventListener('pointermove', onPointerMove); mount.addEventListener('pointerup', onPointerUp); mount.addEventListener('pointercancel', onPointerUp); mount.addEventListener('wheel', onWheel, { passive: false }); mount.addEventListener('touchmove', onTouchMove, { passive: false });

    const onScroll = () => {
      const rect = mount.getBoundingClientRect();
      const progress = THREE.MathUtils.clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height), 0, 1);
      if (!stateRef.current.drag) stateRef.current.targetAngle += (progress - 0.5) * 0.002;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frameRef.current); ro.disconnect(); window.removeEventListener('scroll', onScroll);
      mount.removeEventListener('pointerdown', onPointerDown); mount.removeEventListener('pointermove', onPointerMove); mount.removeEventListener('pointerup', onPointerUp); mount.removeEventListener('pointercancel', onPointerUp); mount.removeEventListener('wheel', onWheel); mount.removeEventListener('touchmove', onTouchMove);
      renderer.dispose(); if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const a = normalizeAngle(stateRef.current.angle);
      const index = Math.round(a / (Math.PI / 2)) % 4;
      setView(VIEWS[index]);
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return <div className="bmw-experience">
    <div className="bmw-orbit bmw-orbit-a"><span>BMW M4 • CH AUTO • SAHIWAL • PRECISION CARE •</span></div>
    <div className="bmw-orbit bmw-orbit-b"><span>360° • ENGINE • BRAKES • SUSPENSION • DIAGNOSTICS •</span></div>
    <div ref={mountRef} className="bmw-canvas" aria-label="Interactive BMW M4 360 degree viewer" />
    {loading && <div className="bmw-loading">LOADING 3D VEHICLE<span>Preparing the showroom</span></div>}
    {failed && <div className="bmw-loading">3D VIEW UNAVAILABLE<span>Please refresh to retry</span></div>}
    {!loading && !failed && <div className="bmw-view-card"><span>{view[0]}</span><strong>{view[1]}</strong><small>{view[2]}</small></div>}
    <div className="bmw-controls"><span><Rotate3D /> DRAG TO ROTATE 360°</span><span><ZoomIn /> SCROLL TO ZOOM</span></div>
  </div>;
}
