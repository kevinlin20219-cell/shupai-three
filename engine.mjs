function parseExact(raw) {
  let s=String(raw??'').trim().replace(/[０-９]/g,c=>String.fromCharCode(c.charCodeAt(0)-65248)).replace(/[－−]/g,'-').replace(/＋/g,'+').replace(/[／÷]/g,'/').replace(/．/g,'.').replace(/％/g,'%');
  if(!s||s.length>80) return null;
  let percent=false;
  if(s.endsWith('%')) { percent=true; s=s.slice(0,-1).trim(); }
  let n,d;
  const mixed=s.match(/^([+-]?\d+)(?:又|\s+)(\d+)\s*\/\s*(\d+)$/);
  const fraction=s.match(/^([+-]?\d+)\s*\/\s*([+-]?\d+)$/);
  if(mixed) { const [,whole,top,bottom]=mixed;d=BigInt(bottom);if(d===0n||BigInt(top)>=d)return null;n=(BigInt(whole.replace(/^[+-]/,''))*d+BigInt(top))*(whole.startsWith('-')?-1n:1n); }
  else if(fraction) { n=BigInt(fraction[1]);d=BigInt(fraction[2]);if(d===0n)return null; }
  else if(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(s)) {const sign=s.startsWith('-')?-1n:1n;const digits=s.replace(/^[+-]/,'');const decimal=digits.includes('.')?digits.split('.')[1].length:0;n=BigInt(digits.replace('.',''))*sign;d=10n**BigInt(decimal);}
  else return null;
  return [n,d*(percent?100n:1n)];
}
export function parseAnswer(raw){const pair=parseExact(raw);if(!pair)return null;const number=Number(pair[0])/Number(pair[1]);return Number.isFinite(number)?number:null;}
export function isCorrect(q,input) {
  const raw=String(input).trim();
  const normalize=s=>String(s).replace(/（/g,'(').replace(/）/g,')').replace(/，/g,',');
  if(q.options && q.options.map(String).includes(String(q.answer)) && parseAnswer(q.answer)===null) return normalize(raw)===normalize(q.answer);
  const cleaned=q.suffix==='%' ? raw.replace(/[%％]$/,'') : raw;
  const a=parseExact(cleaned), b=parseExact(q.answer);
  return a!==null && b!==null && a[0]*b[1]===b[0]*a[1];
}
export function makeRecord() { return {version:1,course:'renjiao-three-upper-current',skills:{},advancedSkills:{},review:[],rounds:[],days:{},settings:{theme:'festival',sound:true,volume:.85,audioVersion:2,motion:true,autoNext:true,count:10}}; }
export function recordAnswer(record,q,correct,assisted,day) {
  const progress=q.difficulty==='advanced'?(record.advancedSkills??={}):record.skills;
  const s=progress[q.skill]??={independent:0,assisted:0,errors:0};
  if(!correct) { s.errors++; if(!record.review.some(x=>x.id===q.id)) record.review.push({...q}); if(record.review.length>80) record.review.shift(); }
  else { s[assisted?'assisted':'independent']++; if(!assisted) record.review=record.review.filter(x=>x.id!==q.id);const now=new Date();const key=day||`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;record.days[key]=(record.days[key]||0)+1; }
}
export class Session {
  constructor(questions,now=Date.now()) { this.questions=questions; this.index=0; this.start=now; this.pausedAt=null; this.pausedTime=0; this.finishedAt=null; this.independent=0; this.assisted=0; this.mistakes=0; this.tries=0; this.helped=false; this.locked=false; this.done=false; this.results=[]; }
  get question(){return this.questions[this.index];}
  elapsed(now=Date.now()){return Math.max(0,(this.finishedAt??this.pausedAt??now)-this.start-this.pausedTime);}
  pause(now=Date.now()){if(this.pausedAt===null && !this.done) this.pausedAt=now;}
  resume(now=Date.now()){if(this.pausedAt!==null){this.pausedTime+=now-this.pausedAt;this.pausedAt=null;}}
  hint(){if(!this.locked && this.pausedAt===null) this.helped=true;}
  submit(input,now=Date.now()){
    if(this.pausedAt!==null) return {status:'paused'};
    if(this.locked || this.done) return {status:'locked'};
    if(String(input).trim()==='') return {status:'empty'};
    if(!this.question.options && parseAnswer(input)===null) return {status:'invalid'};
    if(isCorrect(this.question,input)) { const assisted=this.tries>0||this.helped; this[assisted?'assisted':'independent']++; this.locked=true; this.results.push({skill:this.question.skill,assisted}); return {status:'correct',assisted}; }
    this.tries++; this.mistakes++; return {status:'wrong'};
  }
  next(now=Date.now()) { if(!this.locked || this.pausedAt!==null) return false; this.index++; this.locked=false; this.tries=0; this.helped=false; if(this.index>=this.questions.length) {this.done=true;this.finishedAt=now;} return true; }
}
