import {FX} from './vendor/dopa-fx.mjs';
import {FestivalFX,launchCelebration} from './celebration.mjs?v=three9';

export class ShowTimeline {
 constructor(){this.jobs=[];this.paused=false;}
 add(duration,frame,done){this.jobs.push({duration,frame,done,age:0});}
 tick(ms){if(this.paused)return;for(const j of [...this.jobs]){if(!this.jobs.includes(j))continue;j.age+=Math.max(0,ms);j.frame(Math.min(1,j.age/j.duration));if(j.age>=j.duration){this.jobs=this.jobs.filter(x=>x!==j);j.done?.();}}}
 clear(){this.jobs=[];}
}
const center=el=>{const r=el?.getBoundingClientRect();return r?{x:r.left+r.width/2,y:r.top+r.height/2}:{x:innerWidth/2,y:innerHeight*.4};};
const ease=k=>k<.5?4*k*k*k:1-(-2*k+2)**3/2;
const curve=(a,c,b,t)=>({x:(1-t)**2*a.x+2*(1-t)*t*c.x+t*t*b.x,y:(1-t)**2*a.y+2*(1-t)*t*c.y+t*t*b.y});
export class AnswerEffects {
 constructor(){
  this.timeline=new ShowTimeline();this.celebration=new ShowTimeline();this.reduced=false;this.tokens=new Set();this.raf=null;this.last=0;
  this.canvas=document.createElement('canvas');this.canvas.className='fx-canvas';this.canvas.setAttribute('aria-hidden','true');document.body.appendChild(this.canvas);this.fx=new FX(this.canvas,innerWidth<650?300:460);
  this.backCanvas=document.createElement('canvas');this.backCanvas.className='fx-canvas fx-canvas-back';this.backCanvas.setAttribute('aria-hidden','true');document.body.appendChild(this.backCanvas);this.back=new FestivalFX(this.backCanvas,innerWidth<650?720:1100);
 }
 configure(motion){this.reduced=!motion||matchMedia('(prefers-reduced-motion: reduce)').matches;this.canvas.style.display=this.reduced?'none':'';this.backCanvas.style.display=this.reduced?'none':'';if(this.reduced){this.celebration.clear();this.fx.parts=[];this.back.parts=[];}this.fx.max=innerWidth<650?300:460;this.back.max=innerWidth<650?720:1100;for(const el of this.tokens)el.style.visibility=this.reduced?'hidden':'';}
 wake(){if(this.raf!==null||this.timeline.paused)return;this.last=performance.now();this.raf=requestAnimationFrame(t=>this.frame(t));}
 frame(t){this.raf=null;if(this.timeline.paused)return;const ms=Math.min(50,Math.max(0,t-this.last));this.last=t;this.timeline.tick(ms);this.celebration.tick(ms);this.back.update(ms/1000);this.back.draw();this.fx.update(ms/1000);this.fx.draw();if(this.timeline.jobs.length||this.celebration.jobs.length||this.fx.parts.length||this.back.parts.length)this.raf=requestAnimationFrame(n=>this.frame(n));}
 setPaused(paused){this.timeline.paused=paused;this.celebration.paused=paused;if(!paused)this.wake();}
 token(value,large=false){const el=document.createElement('div');el.className=`flying-number ${large?'answer-parcel':''}`;el.textContent=String(value).slice(0,14);el.setAttribute('aria-hidden','true');document.body.appendChild(el);this.tokens.add(el);return el;}
 remove(el){el?.remove();this.tokens.delete(el);}
 digit(value,from,to){if(this.reduced||!to)return;const a=center(from),b=center(to),control={x:(a.x+b.x)/2+34,y:Math.min(a.y,b.y)-45};const el=this.token(value);this.timeline.add(380,p=>{const k=ease(p),q=curve(a,control,b,k);el.style.transform=`translate(${q.x}px,${q.y}px) translate(-50%,-50%) rotate(${(1-k)*-18}deg) scale(${.7+Math.sin(p*Math.PI)*.45})`;el.style.opacity=p>.85?String((1-p)/.15):'1';},()=>this.remove(el));this.wake();}
 deliver(value,onLand){
  if(this.reduced){onLand();return;}
  const input=document.querySelector('#answer'),selected=document.querySelector('.answer-option.selected'),cat=document.querySelector('.playing-cat'),card=document.querySelector('.question-card');
  const a=center(selected||input),m=center(cat),r=card.getBoundingClientRect();m.x+=29;m.y+=34;
  const b={x:r.left+r.width/2,y:r.top+Math.min(92,r.height*.44)};
  const first={x:a.x-80,y:m.y-64},second={x:b.x+100,y:m.y-80};
  const el=this.token(value,true);cat?.classList.add('catching');
  const arm=document.createElementNS('http://www.w3.org/2000/svg','svg');arm.classList.add('carry-arm');arm.setAttribute('viewBox',`0 0 ${innerWidth} ${innerHeight}`);arm.innerHTML='<path class="arm-outline"/><path class="arm-fill"/><circle class="arm-paw" r="10"/>';document.body.appendChild(arm);this.tokens.add(arm);
  this.timeline.add(680,p=>{
   const q=p<.48?curve(a,first,m,ease(p/.48)):curve(m,second,b,ease((p-.48)/.52));
   el.style.transform=`translate(${q.x}px,${q.y}px) translate(-50%,-50%) rotate(${Math.sin(p*Math.PI*2)*15}deg) scale(${.85+Math.sin(p*Math.PI)*.4})`;
   const armPath=`M ${m.x} ${m.y} Q ${m.x+55} ${m.y+45} ${q.x} ${q.y}`;arm.querySelectorAll('path').forEach(path=>path.setAttribute('d',armPath));const paw=arm.querySelector('circle');paw.setAttribute('cx',q.x);paw.setAttribute('cy',q.y);
   this.fx.burst(q.x,q.y,{count:1,speed:50,up:5,kinds:['spark'],life:.35,size:.7,gravity:0});
  },()=>{this.remove(el);this.remove(arm);cat?.classList.remove('catching');this.fx.ring(b.x,b.y,{radius:70,color:'#f5a0c5',width:5});onLand();});this.wake();
 }
 correct(level=0){
  if(this.reduced)return;const card=document.querySelector('.question-card');const c=center(card);const cat=document.querySelector('.playing-cat');const head=center(cat);const energy=Math.min(1,Math.max(0,level));
  launchCelebration(this.fx,this.back,this.celebration,{energy,width:innerWidth,height:innerHeight,x:c.x,y:c.y});
  this.fx.ring(c.x,c.y,{radius:180+100*energy,width:4,color:'#ffffff',life:.85});
  const seal=document.createElement('div');seal.className='answer-seal';seal.setAttribute('aria-hidden','true');seal.style.left=c.x+'px';seal.style.top=c.y+'px';
  const petals=Array.from({length:100},(_,i)=>{const a=i/100*Math.PI*2,r=65+9*Math.sin(12*a);return (i?'L':'M')+(90+Math.cos(a)*r).toFixed(2)+' '+(90+Math.sin(a)*r).toFixed(2);}).join(' ')+' Z';
  seal.innerHTML=`<svg viewBox="0 0 180 180"><path class="seal-flower" d="${petals}"/><circle cx="90" cy="90" r="54"/><path class="seal-check" d="M52 88 78 115 131 57"/></svg>`;document.body.appendChild(seal);this.tokens.add(seal);
  this.timeline.add(1200,p=>{seal.style.opacity=p>.68?String((1-p)/.32):'1';seal.style.transform=`translate(-50%,-50%) rotate(-13deg) scale(${p<.2?.3+p/.2*.85:1+Math.sin(p*Math.PI)*.08})`;},()=>this.remove(seal));
  const label=document.createElement('div');label.className=`impact-words level-${Math.floor(energy*3)}`;label.textContent=energy>.75?'FEVER!':energy>.45?'GROOVE!':energy>.2?'NICE!':'好拍子！';label.style.left=`${head.x}px`;label.style.top=`${Math.max(120,head.y-32)}px`;document.body.appendChild(label);this.tokens.add(label);
  this.timeline.add(1150,p=>{const scale=p<.15?.3+p/.15*.85:p<.25?1.15-(p-.15)*1.5:1;label.style.transform=`translate(-50%,-50%) rotate(-9deg) scale(${scale})`;label.style.opacity=p>.72?String((1-p)/.28):'1';},()=>this.remove(label));
  card?.classList.add('impact');this.timeline.add(550,()=>{},()=>card?.classList.remove('impact'));this.wake();
 }
 retry(){if(this.reduced)return;const c=center(document.querySelector('#answer'));this.fx.puff(c.x,c.y,8);this.fx.text(c.x,c.y-20,'再来一拍',{color:'#f1ca8b',size:20,life:.7,vy:-70});this.wake();}
 victory(){this.clear();if(this.reduced)return;launchCelebration(this.fx,this.back,this.celebration,{energy:1,finale:true,width:innerWidth,height:innerHeight});this.wake();}
 clear(){this.timeline.clear();this.timeline.paused=false;this.celebration.clear();this.celebration.paused=false;for(const el of this.tokens)el.remove();this.tokens.clear();this.fx.parts=[];this.back.parts=[];if(this.raf!==null)cancelAnimationFrame(this.raf);this.raf=null;this.fx.draw();this.back.draw();}
}
