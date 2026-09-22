import * as THREE from 'three';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import './interactive.css';
gsap.registerPlugin(ScrollTrigger);

const boot=()=>{
  const hero=document.querySelector('.hero');
  if(!hero||document.querySelector('.car-stage'))return;
  const stage=document.createElement('div');
  stage.className='car-stage';
  stage.innerHTML=`<div class="car-hint">DRAG TO ROTATE <span>•</span> SCROLL / PINCH TO ZOOM</div><div class="orbit orbit-one"><span>PRECISION • DIAGNOSTICS • PERFORMANCE • </span></div><div class="orbit orbit-two"><span>CH AUTO • SAHIWAL • WORKSHOP • </span></div><div class="orbit orbit-three"><span>ENGINE • BRAKES • SUSPENSION • </span></div><div class="car-data data-a">DIAGNOSTICS<br/><b>LIVE SCAN</b></div><div class="car-data data-b">ENGINE<br/><b>HEALTH 98%</b></div><div class="car-data data-c">BRAKE SYSTEM<br/><b>READY</b></div><div class="car-data data-d">CH AUTO<br/><b>PRECISION CARE</b></div>`;
  hero.appendChild(stage);

  const mobile=matchMedia('(max-width:760px)').matches;
  let renderer;
  try{
    renderer=new THREE.WebGLRenderer({alpha:true,antialias:!mobile,powerPreference:'low-power',failIfMajorPerformanceCaveat:false});
  }catch(e){
    stage.classList.add('webgl-fallback');
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,mobile?1:1.35));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.setClearColor(0,0);
  stage.appendChild(renderer.domElement);

  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.1,100);
  camera.position.set(0,.35,8.2);
  const car=new THREE.Group();scene.add(car);
  const green=new THREE.MeshStandardMaterial({color:0x187a54,metalness:.78,roughness:.26}),green2=new THREE.MeshStandardMaterial({color:0x25b878,metalness:.68,roughness:.22}),dark=new THREE.MeshStandardMaterial({color:0x050908,metalness:.82,roughness:.2}),glass=new THREE.MeshStandardMaterial({color:0x071b16,metalness:.35,roughness:.12,transparent:true,opacity:.9}),gold=new THREE.MeshStandardMaterial({color:0xe5b84f,metalness:.82,roughness:.22}),red=new THREE.MeshStandardMaterial({color:0x8d1515,metalness:.4,roughness:.28});
  const add=(geo,mat,p=[0,0,0],r=[0,0,0],s=[1,1,1])=>{const m=new THREE.Mesh(geo,mat);m.position.set(...p);m.rotation.set(...r);m.scale.set(...s);car.add(m);return m};
  add(new THREE.BoxGeometry(4.5,.52,1.62),green,[0,.28,0]);add(new THREE.BoxGeometry(3.65,.34,1.5),green2,[.05,.61,0]);add(new THREE.BoxGeometry(2.28,.72,1.38),glass,[.05,1.02,0],[0,0,-.03]);add(new THREE.BoxGeometry(1.05,.2,1.48),green2,[1.65,.66,0]);add(new THREE.BoxGeometry(.58,.34,1.52),dark,[-1.95,.62,0]);add(new THREE.BoxGeometry(4,.1,1.72),dark,[0,.05,0]);add(new THREE.BoxGeometry(3.65,.09,.12),gold,[.15,.56,.82]);add(new THREE.BoxGeometry(3.65,.09,.12),gold,[.15,.56,-.82]);add(new THREE.BoxGeometry(.08,.34,.95),dark,[2.23,.31,0]);add(new THREE.BoxGeometry(.18,.07,1.55),dark,[2.28,.08,0]);add(new THREE.BoxGeometry(.12,.14,.48),gold,[2.27,.55,.56]);add(new THREE.BoxGeometry(.12,.14,.48),gold,[2.27,.55,-.56]);add(new THREE.BoxGeometry(.1,.13,.48),red,[-2.26,.57,.56]);add(new THREE.BoxGeometry(.1,.13,.48),red,[-2.26,.57,-.56]);
  const tyreGeo=new THREE.CylinderGeometry(.48,.48,.24,mobile?20:28),rimGeo=new THREE.CylinderGeometry(.27,.27,.255,mobile?14:20);[[1.35,.08,.84],[1.35,.08,-.84],[-1.35,.08,.84],[-1.35,.08,-.84]].forEach(p=>{add(tyreGeo,dark,p,[Math.PI/2,0,0]);add(rimGeo,gold,p,[Math.PI/2,0,0])});
  const underGlow=add(new THREE.BoxGeometry(3.7,.025,1.2),new THREE.MeshBasicMaterial({color:0x23a66d,transparent:true,opacity:.14}),[0,-.24,0]);
  const floor=add(new THREE.TorusGeometry(2.75,.012,6,mobile?48:72),new THREE.MeshBasicMaterial({color:0xe5b84f,transparent:true,opacity:.3}),[0,-.32,0],[Math.PI/2,0,0]);
  scene.add(new THREE.HemisphereLight(0xdfffee,0x07100c,mobile?1.7:2.1));
  const key=new THREE.DirectionalLight(0xffffff,mobile?1.5:2.2);key.position.set(4,6,7);scene.add(key);
  const fill=new THREE.PointLight(0x23a66d,mobile?1.6:2.8,12);fill.position.set(-4,2,4);scene.add(fill);
  const warm=new THREE.PointLight(0xe5b84f,mobile?1.2:1.8,10);warm.position.set(4,1,-4);scene.add(warm);

  let rotX=.1,rotY=.35,zoom=8.2,dragging=false,lastX=0,lastY=0;
  const setSize=()=>{const r=stage.getBoundingClientRect();if(!r.width||!r.height)return;renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix()};
  setSize();
  const resizeObserver=new ResizeObserver(setSize);resizeObserver.observe(stage);
  const onResize=()=>setSize();window.addEventListener('resize',onResize,{passive:true});
  stage.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;lastY=e.clientY;stage.classList.add('dragging');stage.setPointerCapture?.(e.pointerId)});
  stage.addEventListener('pointermove',e=>{if(!dragging)return;rotY+=(e.clientX-lastX)*.008;rotX+=(e.clientY-lastY)*.0035;rotX=Math.max(-.5,Math.min(.5,rotX));lastX=e.clientX;lastY=e.clientY});
  const stop=e=>{dragging=false;stage.classList.remove('dragging');if(e?.pointerId!=null)try{stage.releasePointerCapture?.(e.pointerId)}catch{}};
  stage.addEventListener('pointerup',stop);stage.addEventListener('pointercancel',stop);stage.addEventListener('pointerleave',e=>{if(!e.buttons)stop(e)});
  stage.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(5.3,Math.min(10.5,zoom+e.deltaY*.004))},{passive:false});
  let lastTouchDistance=null;
  stage.addEventListener('touchmove',e=>{if(e.touches.length!==2)return;const a=e.touches[0],b=e.touches[1],d=Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);if(lastTouchDistance!=null)zoom=Math.max(5.3,Math.min(10.5,zoom-(d-lastTouchDistance)*.012));lastTouchDistance=d},{passive:true});
  stage.addEventListener('touchend',()=>{lastTouchDistance=null},{passive:true});
  const updateData=()=>{const near=zoom<6.35;stage.classList.toggle('zoomed',near);const angle=Math.abs(rotY%(Math.PI*2)),states=[angle>.65,angle>1.5,angle>2.35,angle>3.05];stage.querySelectorAll('.car-data').forEach((el,i)=>el.classList.toggle('visible',near&&states[i]))};
  if(!mobile){ScrollTrigger.create({trigger:hero,start:'top top',end:'bottom top',scrub:1.2,onUpdate:self=>{const p=self.progress;camera.position.x=gsap.utils.interpolate(0,.8,p);camera.position.y=gsap.utils.interpolate(.35,1.05,p);camera.position.z=gsap.utils.interpolate(8.2,6.1,p);car.position.y=gsap.utils.interpolate(0,-.55,p);car.rotation.z=gsap.utils.interpolate(0,-.07,p);stage.style.setProperty('--scroll-progress',p.toFixed(3))}})}
  let frame=0,lastTime=0;
  const loop=t=>{frame=requestAnimationFrame(loop);if(t-lastTime<(mobile?33:20))return;lastTime=t;car.rotation.y+=(rotY-car.rotation.y)*.08;car.rotation.x+=(rotX-car.rotation.x)*.08;camera.position.z+=(zoom-camera.position.z)*.07;floor.rotation.z+=mobile?.003:.006;underGlow.material.opacity=.11+Math.sin(t*.002)*.02;updateData();renderer.render(scene,camera)};
  gsap.from(stage,{opacity:0,scale:.86,duration:1.25,ease:'power4.out'});frame=requestAnimationFrame(loop);
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
