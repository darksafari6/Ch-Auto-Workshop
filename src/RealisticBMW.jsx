import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { Rotate3D, ZoomIn } from 'lucide-react';
import './realistic-bmw.css';

const MODEL_URL = 'https://raw.githubusercontent.com/lukaizj/car-mod-saas/main/public/models/bmw-m4.web.glb';
const VIEWS = [
  ['FRONT', 'ENGINE & DIAGNOSTICS', 'Front-end inspection and precision scanning.'],
  ['RIGHT', 'SUSPENSION & WHEELS', 'Steering, suspension and wheel safety check.'],
  ['REAR', 'EXHAUST & PERFORMANCE', 'Exhaust, catalytic converter and road performance.'],
  ['LEFT', 'BRAKES & BODY', 'Brake, tyre and exterior condition inspection.'],
];

function normalizeAngle(value) {
  const two = Math.PI * 2;
  let a = value % two;
  if (a < 0) a += two;
  return a;
}

export default function RealisticBMW() {
  const mountRef = useRef(null);
  const groupRef = useRef(null);
  const frameRef = useRef(0);
  const stateRef = useRef({ angle: 0, targetAngle: 0, zoom: 6.1, targetZoom: 6.1, drag: false, x: 0 });
  const [activeView, setActiveView] = useState(0);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0.55, 6.1);

    const mobile = window.innerWidth <= 700;
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !mobile,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.15 : 1.6));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = !mobile;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xe9f5ed, 0x06120d, 2.4));
    const key = new THREE.DirectionalLight(0xfff5dd, 3.0);
    key.position.set(4, 6, 6);
    key.castShadow = !mobile;
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x8dffc8, 2.0);
    rim.position.set(-5, 3, -5);
    scene.add(rim);
    const front = new THREE.PointLight(0xffd36b, 22, 12);
    front.position.set(0, 1.4, 4);
    scene.add(front);

    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(3.0, mobile ? 32 : 64),
      new THREE.MeshBasicMaterial({ color: 0x071711, transparent: true, opacity: 0.48, depthWrite: false })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.02;
    scene.add(ground);

    const group = new THREE.Group();
    scene.add(group);
    groupRef.current = group;

    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load(
      MODEL_URL,
      (gltf) => {
        const model = gltf.scene;
        model.traverse((obj) => {
          if (!obj.isMesh) return;
          obj.castShadow = !mobile;
          obj.receiveShadow = !mobile;
          if (obj.material) obj.material.envMapIntensity = 1.15;
        });

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        model.position.sub(center);
        const longest = Math.max(size.x, size.y, size.z);
        model.scale.setScalar(4.15 / longest);
        model.position.y = -0.28;
        group.add(model);
        setLoading(false);
      },
      undefined,
      () => {
        setLoading(false);
        setFailed(true);
      }
    );

    const resize = () => {
      const w = Math.max(mount.clientWidth, 1);
      const h = Math.max(mount.clientHeight, 1);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    const animate = () => {
      const s = stateRef.current;
      s.angle += (s.targetAngle - s.angle) * 0.12;
      s.zoom += (s.targetZoom - s.zoom) * 0.12;
      group.rotation.y = s.angle;
      camera.position.z = s.zoom;
      camera.position.y = 0.55;
      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(animate);
    };
    animate();

    const onPointerDown = (e) => {
      stateRef.current.drag = true;
      stateRef.current.x = e.clientX;
      mount.setPointerCapture?.(e.pointerId);
    };
    const onPointerMove = (e) => {
      const s = stateRef.current;
      if (!s.drag) return;
      s.targetAngle += (e.clientX - s.x) * 0.014;
      s.x = e.clientX;
    };
    const onPointerUp = () => {
      stateRef.current.drag = false;
    };
    const onWheel = (e) => {
      e.preventDefault();
      stateRef.current.targetZoom = THREE.MathUtils.clamp(stateRef.current.targetZoom + e.deltaY * 0.0022, 4.7, 7.2);
    };
    const onTouchMove = (e) => {
      if (stateRef.current.drag && e.touches.length === 1) e.preventDefault();
    };

    mount.addEventListener('pointerdown', onPointerDown);
    mount.addEventListener('pointermove', onPointerMove);
    mount.addEventListener('pointerup', onPointerUp);
    mount.addEventListener('pointercancel', onPointerUp);
    mount.addEventListener('wheel', onWheel, { passive: false });
    mount.addEventListener('touchmove', onTouchMove, { passive: false });

    const viewTimer = window.setInterval(() => {
      const angle = normalizeAngle(stateRef.current.angle);
      const index = Math.round(angle / (Math.PI / 2)) % 4;
      setActiveView(index);
    }, 80);

    return () => {
      window.clearInterval(viewTimer);
      cancelAnimationFrame(frameRef.current);
      ro.disconnect();
      mount.removeEventListener('pointerdown', onPointerDown);
      mount.removeEventListener('pointermove', onPointerMove);
      mount.removeEventListener('pointerup', onPointerUp);
      mount.removeEventListener('pointercancel', onPointerUp);
      mount.removeEventListener('wheel', onWheel);
      mount.removeEventListener('touchmove', onTouchMove);
      renderer.dispose();
      renderer.forceContextLoss?.();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="bmw-experience" aria-label="Interactive BMW M4 360 degree showroom">
      <div className="bmw-orbit bmw-orbit-a"><span>BMW M4 • CH AUTO • SAHIWAL • PRECISION CARE •</span></div>
      <div className="bmw-orbit bmw-orbit-b"><span>360° • ENGINE • BRAKES • SUSPENSION • DIAGNOSTICS •</span></div>

      <div ref={mountRef} className="bmw-canvas" />

      {!loading && !failed && VIEWS.map((item, index) => {
        const distance = Math.min(Math.abs(index - activeView), 4 - Math.abs(index - activeView));
        const isActive = distance === 0;
        return (
          <div
            key={item[0]}
            className={`bmw-hotspot hotspot-${index} ${isActive ? 'is-active' : ''}`}
            aria-hidden={!isActive}
          >
            <span>{item[0]} VIEW</span>
            <strong>{item[1]}</strong>
            <small>{item[2]}</small>
          </div>
        );
      })}

      {loading && <div className="bmw-loading">LOADING 3D VEHICLE<span>Preparing the showroom</span></div>}
      {failed && <div className="bmw-loading">3D VIEW UNAVAILABLE<span>Please refresh to retry</span></div>}

      <div className="bmw-controls">
        <span><Rotate3D /> DRAG TO ROTATE 360°</span>
        <span><ZoomIn /> SCROLL TO ZOOM</span>
      </div>
    </div>
  );
}
