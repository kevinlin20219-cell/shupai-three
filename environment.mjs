import {Backdrop} from './vendor/dopa-bg.mjs';
import {StageClock} from './stage.mjs?v=three9';

export class GameEnvironment {
 constructor(){
  this.clock=new StageClock();this.active=false;this.raf=null;this.last=0;this.kick=0;this.centerDirty=true;
  this.root=document.createElement('div');this.root.className='game-environment';this.root.hidden=true;this.root.setAttribute('aria-hidden','true');
  this.fallback=document.createElement('div');this.fallback.className='environment-fallback';this.canvas=document.createElement('canvas');this.canvas.className='environment-canvas';this.root.append(this.fallback,this.canvas);document.body.prepend(this.root);
  this.backdrop=new Backdrop(this.canvas,this.fallback);this.backdrop.setTheme('classic');
  const mark=()=>{this.centerDirty=true;};window.addEventListener('resize',mark,{passive:true});window.addEventListener('scroll',mark,{passive:true});
 }
 setLook(name){this.backdrop.setTheme(name||'classic');this.centerDirty=true;if(this.active)this.wake();}
 configure(motion){this.clock.motion=Boolean(motion)&&!matchMedia('(prefers-reduced-motion: reduce)').matches;this.sync();if(this.active)this.wake();}
 setPulse(pulse){this.kick=pulse.kick;}
 show(completed,total){this.active=true;this.clock.setProgress(completed,total);this.centerDirty=true;this.sync();this.wake();}
 sync(){
  const p=this.clock.profile;this.root.hidden=!this.active||!p.glow;this.root.dataset.phase=p.festival?'festival':p.glow?'glow':'paper';this.root.style.opacity=p.festival?'1':'.28';
  const shell=document.querySelector('.play-shell');if(!shell)return;
  shell.dataset.completed=p.completed;shell.dataset.phase=this.root.dataset.phase;
  for(const name of ['glow','festival','bunting','colorKeys','spotlights','marquee','rainbow'])shell.classList.toggle('scene-'+name.replace(/[A-Z]/g,c=>'-'+c.toLowerCase()),p[name]);
  shell.querySelectorAll('.stage-friend').forEach((el,i)=>{el.hidden=i>=p.crowd;});
 }
 wake(){if(this.raf!==null||this.clock.paused||!this.active)return;this.last=performance.now();this.raf=requestAnimationFrame(t=>this.frame(t));}
 frame(t){
  this.raf=null;if(!this.active||this.clock.paused)return;const dt=Math.min(50,Math.max(0,t-this.last));this.last=t;this.clock.advance(dt);
  if(this.centerDirty){const stage=document.querySelector('.play-stage')||document.querySelector('.result-mascot');const r=stage?.getBoundingClientRect();this.center=r?{x:r.left+r.width/2,y:r.top+r.height*.55}:{x:innerWidth/2,y:innerHeight*.3};this.root.style.setProperty('--scene-cx',this.center.x+'px');this.root.style.setProperty('--scene-cy',this.center.y+'px');this.centerDirty=false;}
  const s=this.backdrop.state;s.E=this.clock.visualEnergy;s.kick=this.clock.motion?this.kick:0;s.hue+=this.clock.motion?dt*.00003*s.E:0;s.cx=this.center.x;s.cy=this.center.y;s.flash=0;s.reach=0;
  this.backdrop.render(this.clock.time);
  if(this.clock.motion&&this.clock.profile.glow)this.raf=requestAnimationFrame(next=>this.frame(next));
 }
 setPaused(value){this.clock.paused=value;if(value&&this.raf!==null){cancelAnimationFrame(this.raf);this.raf=null;}if(!value)this.wake();}
 clear(){this.active=false;if(this.raf!==null)cancelAnimationFrame(this.raf);this.raf=null;this.clock.reset();this.kick=0;this.root.hidden=true;}
}
