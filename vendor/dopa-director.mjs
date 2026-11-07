// Adapted from burstKinds / celebrate in Dopa Drill main.js.
// Copyright (c) 2026 gear_machine. MIT; see LICENSE.dopa-drill.txt.
// Upstream e4da063f74c423b5e6eaad3faeb9631e741d821c.
// Actor-only calls and the original mascot particle are excluded.
export function burstKinds(E){
 const kinds=['confetti'];
 if(E>.18)kinds.push('star');
 if(E>.4)kinds.push('spark','spark');
 if(E>.58)kinds.push('coin');
 if(E>.72)kinds.push('heart');
 return kinds;
}
export function celebrateFX(fx,cx,cy,W,H,E){
 const n=Math.round(18+80*Math.min(1.2,E));
 fx.burst(cx,cy,{count:n,speed:500+500*E,kinds:burstKinds(E),up:250,life:.6});
 fx.ring(cx,cy,{color:'#ffd23f',radius:120+200*E,width:10});
 if(E>.25)fx.burst(cx,cy,{count:Math.round(100*Math.min(1.2,E)),speed:900+400*E,kinds:burstKinds(E),up:400});
 if(E>.3)fx.streamers(W,H,Math.round(2+6*E));
 if(E>.5)fx.fireworks(W,H,Math.round(2+6*E),.06,.3);
 if(E>.62)fx.rain(W,Math.round(20+30*E),{kinds:['confetti','confetti','coin']});
}
