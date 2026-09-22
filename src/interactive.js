import * as THREE from 'three';
import { gsap } from 'gsap';

const boot = () => {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const stage = document.createElement('div');
  stage.className = 'car-stage';
  stage.innerHTML = `<div class="car-hint">DRAG TO ROTATE <span>•</span> SCROLL / PINCH TO ZOOM</div><div class="car-data data-a">DIAGNOSTICS<br><b>LIVE SCAN</b></div><div class="car-data data-b">ENGINE<br><b>HEALTH 98%</b></div><div class="car-data data-c">BRAKE SYSTEM<br><b>READY</b></div><div class="car-data data-d">CH AUTO<br><b>PRECISION CARE</b></div>`;
  hero.appendChild(stage);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
  camera.position.set(0, .35, 7.8);

  const renderer = new THREE.WebGLRenderer({ alpha:true, antialias:true, powerPreference:'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  stage.appendChild(renderer.domElement);

  const car = new THREE.Group();
  scene.add(car);

  const green = new THREE.MeshStandardMaterial({color:0x1f9d68, metalness:.7, roughness:.28});
  const dark = new THREE.MeshStandardMaterial({color:0x07110e, metalness:.85, roughness:.2});
  const glass = new THREE.MeshPhysicalMaterial({color:0x091c17, metalness:.25, roughness:.08, transmission:.35, transparent:true, opacity:.92});
  const gold = new THREE.MeshStandardMaterial({color:0xe5b84f, metalness:.8, roughness:.22});

  const body = new THREE.Mesh(new THREE.BoxGeometry(4.2,.65,1.65), green);
  body.position.y=.25; car.add(body);
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(2.35,.72,1.42), glass);
  cabin.position.set(.15,.88,0); cabin.rotation.z=-.025; car.add(cabin);
  const hood = new THREE.Mesh(new THREE.BoxGeometry(1.25,.22,1.52), green);
  hood.position.set(1.72,.63,0); car.add(hood);
  const rear = new THREE.Mesh(new THREE.BoxGeometry(.55,.38,1.55), dark);
  rear.position.set(-1.95,.55,0); car.add(rear);

  const wheelGeo = new THREE.CylinderGeometry(.43,.43,.22,32);
  const wheelMat = new THREE.MeshStandardMaterial({color:0x050807,metalness:.7,roughness:.3});
  const rimMat = new THREE.MeshStandardMaterial({color:0xe5b84f,metalness:.9,roughness:.2});
  [[1.25,.02,.86],[1.25,.02,-.86],[-1.35,.02,.86],[-1.35,.02,-.86]].forEach(([x,y,z])=>{
    const w=new THREE.Mesh(wheelGeo,wheelMat); w.rotation.x=Math.PI/2; w.position.set(x,y,z); car.add(w);
    const r=new THREE.Mesh(new THREE.CylinderGeometry(.22,.22,.235,24),rimMat); r.rotation.x=Math.PI/2; r.position.set(x,y,z); car.add(r);
  });
  const lightGeo=new THREE.BoxGeometry(.12,.14,.58);
  [[2.15,.55,.56],[2.15,.55,-.56]].forEach(([x,y,z])=>{const l=new THREE.Mesh(lightGeo,gold);l.position.set(x,y,z);car.add(l)});

  const ring = new THREE.Mesh(new THREE.TorusGeometry(2.7,.012,8,96), new THREE.MeshBasicMaterial({color:0xe5b84f,transparent:true,opacity:.35}));
  ring.rotation.x=Math.PI/2; ring.position.y=-.25; car.add(ring);

  const key = new THREE.DirectionalLight(0xffffff,2.2); key.position.set(4,6,6); scene.add(key);
  const fill = new THREE.PointLight(0x23a66d,3,12); fill.position.set(-3,2,3); scene.add(fill);
  const warm = new THREE.PointLight(0xe5b84f,2,10); warm.position.set(3,1,-4); scene.add(warm);

  let targetX=.25, targetY=.15, rotX=.15, rotY=.35, zoom=7.8, dragging=false, lastX=0, lastY=0;
  const setSize=()=>{const r=stage.getBoundingClientRect(); renderer.setSize(r.width,r.height,false); camera.aspect=r.width/r.height; camera.updateProjectionMatrix()};
  setSize(); window.addEventListener('resize',setSize);

  const pointerDown=e=>{dragging=true;lastX=e.clientX??e.touches?.[0]?.clientX;lastY=e.clientY??e.touches?.[0]?.clientY;stage.classList.add('dragging')};
  const pointerMove=e=>{if(!dragging)return;const x=e.clientX??e.touches?.[0]?.clientX,y=e.clientY??e.touches?.[0]?.clientY;rotY+=(x-lastX)*.009;rotX+=(y-lastY)*.004;rotX=Math.max(-.55,Math.min(.55,rotX));lastX=x;lastY=y};
  const pointerUp=()=>{dragging=false;stage.classList.remove('dragging')};
  stage.addEventListener('pointerdown',pointerDown); window.addEventListener('pointermove',pointerMove); window.addEventListener('pointerup',pointerUp);
  stage.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(5.2,Math.min(10.5,zoom+e.deltaY*.004))},{passive:false});

  const reveal=()=>{
    const near=zoom<6.2;
    stage.classList.toggle('zoomed',near);
    document.querySelectorAll('.car-data').forEach((el,i)=>el.classList.toggle('visible',near && ((Math.abs(rotY)>.7 && i===0)||(Math.abs(rotY)>1.5 && i===1)||(Math.abs(rotY)>2.3 && i===2)||(Math.abs(rotY)>3.1 && i===3))));
  };
  const clock=new THREE.Clock();
  const loop=()=>{const t=clock.getElapsedTime(); if(!dragging){targetX=Math.sin(t*.35)*.08;targetY=Math.cos(t*.28)*.05} car.rotation.y += (rotY-car.rotation.y)*.08; car.rotation.x += (rotX+targetX-car.rotation.x)*.08; car.position.y=-.05+Math.sin(t*1.2)*.025; camera.position.z += (zoom-camera.position.z)*.07; ring.rotation.z=t*.12; reveal(); renderer.render(scene,camera); requestAnimationFrame(loop)};
  gsap.from(stage,{opacity:0,scale:.88,duration:1.4,ease:'power3.out'}); loop();
};

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',boot); else boot();
