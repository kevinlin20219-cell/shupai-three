import {AudioEngine} from './vendor/dopa-audio.mjs';

// Bridge the unmodified upstream engine to Shupai's question and pause lifecycle.
export class Rhythm {
 constructor({engine=new AudioEngine()}={}){this.engine=engine;this.timer=null;this.enabled=true;this.volume=.85;this.active=false;this.started=false;this.paused=false;this.energy=.08;this.combo=0;this.remaining=.06;}
 get ctx(){return this.engine.ctx;}
 init(){this.engine.unlock();if(this.suspendPending){const pending=this.suspendPending;this.suspendPending=null;pending.then(()=>{if(this.active)this.engine.unlock();});}}
 configure(settings){this.enabled=settings.sound;this.volume=Math.max(0,Math.min(1,settings.volume));this.engine.setVolume(this.volume);this.engine.setMuted(!this.enabled||!this.active);}
 setProgress(index,total){this.energy=total<=1?1:.08+.92*(index/(total-1))**1.3;this.engine.setLevel(Math.min(10,Math.round(this.energy*10)),112+16*Math.min(1,this.energy));}
 start(){
  this.init();this.active=true;this.engine.setVolume(this.volume);this.engine.setMuted(!this.enabled);
  if(this.paused&&this.started){this.engine.playing=true;this.engine.nextTime=this.engine.now()+this.remaining;}else this.engine.startMusic();
  this.started=true;this.paused=false;
  if(!this.timer){this.timer=setInterval(()=>this.update(),25);this.timer.unref?.();}this.update();
 }
 update(){if(!this.active||!this.engine.playing)return;this.engine.update();this.onPulse?.(this.engine.pulse());}
 pause({suspend=true}={}){this.remaining=Math.max(.02,this.engine.nextTime-this.engine.now());this.paused=this.active;this.active=false;clearInterval(this.timer);this.timer=null;this.engine.stopMusic();this.engine.setMuted(true);if(suspend&&this.ctx?.state==='running')this.suspendPending=this.ctx.suspend().catch(()=>{});}
 stop(){this.pause({suspend:false});this.started=false;this.paused=false;this.combo=0;this.engine.step=0;this.engine.beats=[];this.engine.kicks=[];}
 tap(){if(this.enabled&&this.active)this.engine.keyTap(this.combo++);}
 lift(){if(this.enabled&&this.active){this.engine.grab();this.engine.cutin();}}
 success(){if(this.enabled&&this.active){this.engine.place();this.engine.clear(this.energy);}}
 retry(){if(this.enabled&&this.active){this.engine.place();this.engine.wrong(this.energy);}this.combo=0;}
 erase(){if(this.enabled&&this.active)this.engine.erase();}
 finish(){this.init();this.active=true;this.engine.setVolume(this.volume);this.engine.setMuted(!this.enabled);if(this.enabled)this.engine.finale();}
}
