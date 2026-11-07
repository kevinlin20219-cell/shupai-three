// Math helpers adapted from Dopa Drill core.js, copyright (c) 2026 gear_machine. MIT; see LICENSE.dopa-drill.txt.
export const rand=(a=0,b=1)=>a+Math.random()*(b-a);
export const pick=list=>list[Math.floor(Math.random()*list.length)];
export const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
