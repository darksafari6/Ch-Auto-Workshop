import { gsap } from 'gsap';

export function mountExperience(){
  const app=document.querySelector('#root');
  if(!app || document.querySelector('.experience-strip')) return;

  const section=document.createElement('section');
  section.className='experience-strip';
  section.innerHTML=`
    <div class="experience-orb orb-one"></div><div class="experience-orb orb-two"></div>
    <div class="experience-inner">
      <div class="experience-kicker">THE CH WORKSHOP EXPERIENCE</div>
      <h2>Not just a repair.<br><em>A better relationship with your car.</em></h2>
      <div class="experience-rail">
        <article class="experience-card"><span>01 / SCAN</span><b>See the hidden problem.</b><p>Modern diagnostic thinking turns warning lights into useful information.</p><i>↗</i></article>
        <article class="experience-card featured"><span>02 / SERVICE</span><b>Precision over guesswork.</b><p>Every service step is presented as part of a clear maintenance story.</p><i>↗</i></article>
        <article class="experience-card"><span>03 / ROAD</span><b>Leave with confidence.</b><p>From brakes to engine care, the goal is simple: safer, smoother driving.</p><i>↗</i></article>
      </div>
      <div class="process-line"><span>INSPECT</span><i></i><span>DIAGNOSE</span><i></i><span>REPAIR</span><i></i><span>DELIVER</span></div>
    </div>`;

  const contact=document.querySelector('#contact');
  app.insertBefore(section,contact||null);

  const story=document.createElement('section');
  story.className='story-panel';
  story.innerHTML=`<div class="story-number">CH / 360°</div><div><span class="eyebrow">ONE WORKSHOP. MANY DETAILS.</span><h2>Designed like a<br><em>machine dashboard.</em></h2><p>Explore the workshop through a visual system inspired by gauges, road lines, engineering diagrams and Pakistani craftsmanship.</p><div class="story-tags"><span>ENGINE</span><span>ELECTRICAL</span><span>BRAKES</span><span>DIAGNOSTICS</span><span>MAINTENANCE</span></div></div><div class="story-grid"><div>RPM <b>2.4</b></div><div>HEALTH <b>98%</b></div><div>CARE <b>24/7</b></div></div>`;
  app.insertBefore(story,contact||null);

  gsap.fromTo('.experience-card',{y:70,opacity:0,rotateX:8},{y:0,opacity:1,rotateX:0,duration:1,stagger:.13,ease:'power3.out',scrollTrigger:{trigger:section,start:'top 75%'}});
  gsap.fromTo('.story-panel > *',{y:50,opacity:0},{y:0,opacity:1,duration:.9,stagger:.12,ease:'power3.out',scrollTrigger:{trigger:story,start:'top 78%'}});
}
