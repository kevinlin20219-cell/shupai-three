// Shared progress curve from Dopa Drill main.js basicE/applyLevel.
export function sceneProfile(completed,total=10){
 total=Math.max(1,Math.floor(Number(total)||10));completed=Math.max(0,Math.min(total,Math.floor(Number(completed)||0)));
 const energy=total===1?(completed?1:.08):.08+.92*(Math.min(completed,total-1)/(total-1))**1.3;
 const level=Math.min(10,Math.round(energy*10));
 return {completed,total,energy,level,glow:completed>=Math.min(3,Math.ceil(total*.3)),festival:completed>=Math.min(5,Math.ceil(total*.5)),bunting:level>=3,colorKeys:level>=4,spotlights:level>=5,marquee:level>=6,rainbow:level>=8,crowd:[.3,.5,.7,.9].filter(at=>completed>=Math.ceil(total*at)).length};
}
export class StageClock {
 constructor(){this.reset();}
 reset(){this.time=0;this.visualEnergy=.08;this.paused=false;this.motion=true;this.profile=sceneProfile(0,10);}
 setProgress(completed,total){this.profile=sceneProfile(completed,total);}
 advance(ms){if(this.paused)return;ms=Math.max(0,ms);if(this.motion)this.time+=ms;this.visualEnergy+= (this.profile.energy-this.visualEnergy)*Math.min(1,ms*.0022);if(!this.motion)this.visualEnergy=this.profile.energy;}
}
