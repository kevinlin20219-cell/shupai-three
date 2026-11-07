import {advancedVariants} from './advanced-practice.mjs?v=three9';
import {referenceFor,examVariants} from './exam-practice.mjs?v=three9';
import {validDiagram} from './diagrams.mjs?v=three9';
import {makeRecord,isCorrect} from './engine.mjs?v=three9';
import {skills} from './curriculum.mjs?v=three9';
import {restoreRewards} from './rewards.mjs?v=three9';
import {cleanNotes,restoreDailySummaries} from './calendar.mjs';
const KEY='shupai-three-renjiao-current-v1',CLASSIC_KEY='shupai-three-renjiao-v1',LEGACY_KEY='shupai-three-zhejiang-v1';
const CURRENT='renjiao-three-upper-current';
const formerCompatible=new Set(['mul-two-mental','mul-two-carry','mul-three-basic','mul-three-carry','multiply-story','mm-dm','kilometre','tonne','rectangle-features','perimeter']);
const compatible=new Set(['mul-two-mental','mul-two-carry','mul-three-basic','mul-three-carry','mul-zero','multiply-estimate','multiply-story','mm-dm','kilometre','tonne','digital-code','fraction-unit','fraction-compare','fraction-addsub','fraction-set']);
const count=s=>['independent','assisted'].reduce((n,k)=>n+(Number.isFinite(s?.[k])&&s[k]>=0?s[k]:0),0);
const sum=stats=>Object.values(stats||{}).reduce((n,s)=>n+count(s),0);
export function completionTotals(record){
 const archived=key=>Object.entries(record.legacyCourse?.[key]||{}).filter(([id])=>!formerCompatible.has(id)).reduce((n,[,s])=>n+count(s),0);
 const legacy=record.course==='renjiao-three-upper';
 return {basic:sum(record.skills)+(record.course===CURRENT?(record.completionArchive?.basic||0):legacy?archived('skills'):0),advanced:sum(record.advancedSkills)+(record.course===CURRENT?(record.completionArchive?.advanced||0):legacy?archived('advancedSkills'):0)};
}
function migrateLegacy(data){
 const totals=completionTotals(data),snapshot=JSON.parse(JSON.stringify(data)),classic=data.course==='renjiao-three-upper';
 const mappedSkill=(id,difficulty='basic')=>compatible.has(id)?id:classic&&['review-calc','review-life'].includes(id)?id:classic&&id==='measure-story'&&difficulty==='basic'?'length-story':null;
 const migrateStats=(stats,difficulty)=>{
  const result={};
  for(const [id,s] of Object.entries(stats||{})){
   const target=mappedSkill(id,difficulty);if(!target||!s||!['independent','assisted','errors'].every(k=>Number.isFinite(s[k])&&s[k]>=0))continue;
   const entry=result[target]??={independent:0,assisted:0,errors:0};for(const k of ['independent','assisted','errors'])entry[k]+=s[k];
  }
  return result;
 };
 data.skills=migrateStats(data.skills,'basic');data.advancedSkills=migrateStats(data.advancedSkills,'advanced');
 data.completionArchive={basic:Math.max(0,totals.basic-sum(data.skills)),advanced:Math.max(0,totals.advanced-sum(data.advancedSkills))};
 data.legacyCourse=snapshot;data.course=CURRENT;
 data.review=data.review.map(q=>{
  if(!q||typeof q!=='object')return null;
  // Historical prototype metadata identifies its current skill even if its former skill was removed or changed.
  const target=q.examVariant?examVariants.find(v=>v.id===q.examVariant)?.skill:mappedSkill(q.skill,q.difficulty||'basic');
  const skill=skills.find(s=>s.id===target);if(!skill)return null;
  const mapped={...q,skill:skill.id,unit:skill.unit};return !mapped.examVariant||referenceFor(mapped)?mapped:null;
 }).filter(Boolean);
 return data;
}
export function restoreRecord(raw){
 let data=JSON.parse(raw);
 if(!data||![CURRENT,'renjiao-three-upper','zhejiang-three-upper'].includes(data.course)||data.version!==1||!data.skills||typeof data.skills!=='object'||Array.isArray(data.skills)||!Array.isArray(data.review)||!Array.isArray(data.rounds)||!data.days||typeof data.days!=='object'||Array.isArray(data.days))throw new Error('record');
 if(!Object.values(data.skills).every(s=>s&&['independent','assisted','errors'].every(k=>Number.isFinite(s[k])&&s[k]>=0)))throw new Error('skills');
 if(data.course!==CURRENT)data=migrateLegacy(data);
 data.completionArchive=Object.fromEntries(['basic','advanced'].map(k=>[k,Number.isFinite(data.completionArchive?.[k])&&data.completionArchive[k]>=0?data.completionArchive[k]:0]));
 data.skills=Object.fromEntries(Object.entries(data.skills).filter(([id])=>skills.some(s=>s.id===id)));
 data.advancedSkills=data.advancedSkills&&typeof data.advancedSkills==='object'&&!Array.isArray(data.advancedSkills)?Object.fromEntries(Object.entries(data.advancedSkills).filter(([id,s])=>skills.some(k=>k.id===id)&&s&&['independent','assisted','errors'].every(k=>Number.isFinite(s[k])&&s[k]>=0))):{};
 data.days=Object.fromEntries(Object.entries(data.days).filter(([k,v])=>/^\d{4}-\d{2}-\d{2}$/.test(k)&&Number.isFinite(v)&&v>=0));
 data.review=data.review.filter(q=>{
  if(q?.examVariant!==undefined&&!referenceFor(q))return false;
  if(q?.advancedVariant!==undefined&&!advancedVariants.some(v=>v.id===q.advancedVariant&&v.skill===q.skill))return false;
  if(q?.difficulty!==undefined&&!['basic','advanced'].includes(q.difficulty))return false;
  if(!q||typeof q.id!=='string'||!skills.some(s=>s.id===q.skill&&s.unit===q.unit)||typeof q.prompt!=='string'||typeof q.hint!=='string'||typeof q.explanation!=='string'||(q.math!==undefined&&typeof q.math!=='string')||(q.suffix!==undefined&&typeof q.suffix!=='string'))return false;
  if(q.options!==undefined&&(!Array.isArray(q.options)||q.options.length<2||q.options.length>4||!q.options.every(o=>typeof o==='string'||Number.isFinite(o))||!q.options.map(String).includes(String(q.answer))))return false;
  if(q.diagram&&!validDiagram(q.diagram))return false;
  return isCorrect(q,String(q.answer));
 }).slice(-80);
 data.rounds=data.rounds.filter(r=>r&&Number.isFinite(r.total)&&Number.isFinite(r.independent)&&Number.isFinite(r.assisted)&&Number.isFinite(r.time)&&typeof r.date==='string');
 data.dailySummaries=restoreDailySummaries(data.dailySummaries,data.rounds);data.rounds=data.rounds.slice(-100);
 data.notes=cleanNotes(data.notes);data.rewards=restoreRewards(data.rewards,data.rounds);const s=data.settings||{};data.settings={theme:s.theme==='light'?'light':'festival',audioVersion:2,sound:typeof s.sound==='boolean'?s.sound:true,motion:typeof s.motion==='boolean'?s.motion:!(typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches),autoNext:typeof s.autoNext==='boolean'?s.autoNext:true,volume:Number.isFinite(s.volume)?(s.audioVersion===2||s.volume===0?Math.max(0,Math.min(1,s.volume)):Math.max(.85,Math.min(1,s.volume))):.85,count:[5,10,15].includes(s.count)?s.count:10};return data;
}
export function loadRecord(){try{
 const raw=localStorage.getItem(KEY);if(raw)return {record:restoreRecord(raw)};
 for(const key of [CLASSIC_KEY,LEGACY_KEY]){const old=localStorage.getItem(key);if(old){const record=restoreRecord(old);saveRecord(record);return {record,migrated:true};}}
 return {record:makeRecord()};
}catch{return {record:makeRecord(),recovered:true};}}
export function saveRecord(record){try{localStorage.setItem(KEY,JSON.stringify(record));return true;}catch{return false;}}
