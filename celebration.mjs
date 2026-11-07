// Layering and repeated finales inspired by Dopa Drill main.js (MIT).
// Original curling ribbon renderer and 数派 choreography.
import {FX,COLORS} from './vendor/dopa-fx.mjs';
import {burstKinds} from './vendor/dopa-director.mjs';
const random=(a,b)=>a+Math.random()*(b-a);

export class FestivalFX extends FX {
 ribbons(W,H,count=16){
  for(let i=0;i<this.scale(count);i++)this.add({kind:'ribbon',x:random(-20,W+20),y:random(-H*.24,-20),vx:random(-38,38),vy:random(100,180),g:45,drag:.12,rot:random(-.4,.4),vr:random(-.4,.4),phase:random(0,Math.PI*2),color:COLORS[i%6],length:random(58,110),w:random(4,7),size:1,life:random(4.5,6)});
 }
 draw(){
  super.draw();const c=this.ctx,d=this.dpr;
  for(const p of this.parts){if(p.kind!=='ribbon')continue;
   const k=p.age/p.life,alpha=Math.min(1,p.age*5)*Math.min(1,(1-k)*5);
   c.setTransform(d*Math.cos(p.rot),d*Math.sin(p.rot),-d*Math.sin(p.rot),d*Math.cos(p.rot),p.x*d,p.y*d);
   c.globalAlpha=Math.max(0,alpha);c.lineCap='round';c.lineJoin='round';
   c.beginPath();for(let i=0;i<=20;i++){const t=i/20;const x=Math.sin(t*Math.PI*3+p.phase+p.age*3.2)*(8+9*t),y=-t*p.length;i?c.lineTo(x,y):c.moveTo(x,y);}
   c.strokeStyle='#37334f';c.lineWidth=p.w+2;c.stroke();c.strokeStyle=p.color;c.lineWidth=p.w;c.stroke();
   c.globalAlpha=Math.max(0,alpha*.6);c.strokeStyle='#fff9e9';
   c.lineWidth=1;c.stroke();
  }
  c.globalAlpha=1;
 }
}

// The same pausable clock as number delivery: no orphaned timeouts on exit.
export function launchCelebration(front,back,timeline,{energy=0,finale=false,width:W,height:H,x=W/2,y=H*.35}){
 timeline.clear();
 const E=Math.max(0,Math.min(1,energy)),phone=W<650,scale=phone?.72:1;
 const n=value=>Math.max(1,Math.round(value*scale));
 const stage=E>=.8?3:E>=.5?2:E>=.3?1:0;
 const kinds=[...burstKinds(E),...(stage>=1?['note']:[]),...(stage>=3?['candy']:[])];
 const cue=(at,fn)=>at?timeline.add(at,()=>{},fn):fn();
 const side=(amount)=>{for(const left of [true,false])back.burst(left?W*.03:W*.97,H*.7,{count:n(amount),speed:phone?540:790,up:130,angle:left?-Math.PI/3:-Math.PI*2/3,spread:.8,kinds:['confetti','note','star'],life:1.15});};
 front.burst(x,y,{count:n(finale?95:32+45*E),speed:500+320*E,up:180,kinds,life:.72});
 front.ring(x,y,{color:'#ffd865',radius:120+190*E,width:7,life:.65});
 back.burst(x,y,{count:n(finale?130:38+90*E),speed:phone?640:1050,up:270,kinds,life:1.2});
 front.streamers(W,H,n(finale?18:2+stage*4));
 if(finale){
  back.fireworks(W,H,n(7),.06,.4);back.ribbons(W,H,n(26));side(40);
  for(const [i,at] of [240,600,1050,1550,2200,2950,3800,4700,5600].entries())cue(at,()=>{
   back.rain(W,n(58),{kinds:['confetti','confetti','note','star','coin','candy']});
   if(i%2===0){back.ribbons(W,H,n(13));back.fireworks(W,H,n(4),.04,.46);}
   if(i===1||i===4||i===7){front.streamers(W,H,n(12));side(28);}
   if(i===3||i===6)front.burst(W*.5,H*.28,{count:n(24),speed:520,up:120,kinds:['star','note','confetti'],life:.8});
  });
 }else if(stage){
  back.burst(x,y,{count:n(stage*60),speed:phone?640:1000,up:260,kinds:['confetti'],life:1.3});
  back.ribbons(W,H,n(6+stage*5));side(12+stage*8);
  const times=stage===1?[260,660]:stage===2?[220,580,1050,1560]:[180,460,800,1200,1650,2200];
  if(stage>=2)back.fireworks(W,H,n(2+stage),.05,.33);
  times.forEach((at,i)=>cue(at,()=>{
   back.rain(W,n(14+stage*15),{kinds:['confetti','confetti','note',...(stage>=2?['star','coin']:[]),...(stage>=3?['heart','candy']:[])]});
   if(i%2===1)back.ribbons(W,H,n(4+stage*2));
   if(stage>=2&&i===2){back.fireworks(W,H,n(stage),.06,.35);front.streamers(W,H,n(4+stage*2));}
  }));
 }
}
