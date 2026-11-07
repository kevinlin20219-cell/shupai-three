// Original exercises aligned to the user's 2024-edition PEP textbook, printed pp.1–102.
import {examForSkill,examVariants,generateExamVariant} from './exam-practice.mjs?v=three9';
import {basicVariants,generateBasicVariant,basicForSkill} from './basic-practice.mjs?v=three9';
import {advancedVariants,generateAdvancedVariant,advancedForSkill} from './advanced-practice.mjs?v=three9';
export const units=[
 ['observe','观察物体','从不同方向看，再展开、折叠','mint','book','01','1–5'],
 ['mixed-ops','混合运算','运算顺序、小括号与两步应用','peach','multiply','02','6–19'],
 ['length','毫米、分米和千米','测量、换算与估测','blue','pin','03','20–30'],
 ['weighing','曹冲称象的故事','质量单位、读秤与等量替换','yellow','spark','','31–38'],
 ['multiply','多位数乘一位数','口算、笔算、估算与应用','peach','multiply','04','39–56'],
 ['coding','数字编码','读懂规则，设计虚构编号','purple','chart','','57–60'],
 ['lines-angles','线和角','线段、射线、直线与角','mint','book','05','61–72'],
 ['fraction','分数的初步认识','平均分、比较、计算与整体','purple','divide','06','73–91'],
 ['review','复习与关联','联系数、量、图形与生活','yellow','spark','07','92–102']
].map(([id,title,subtitle,color,icon,number,pages])=>({id,title,subtitle,color,icon,number,pages,activity:number===''}));
export const skills=[
 ['observe-view','observe','不同方向观察','1–2'],['observe-solid','observe','视图与立体对应','1–2、5'],['observe-net','observe','长方体展开与相对面','3–4'],['cube-net','observe','正方体展开判断','5'],
 ['mixed-same-level','mixed-ops','同级运算从左往右','6、9–11'],['mixed-order','mixed-ops','先乘除后加减','7、9–11'],['mixed-brackets','mixed-ops','小括号优先','8、10–11'],['mixed-expression','mixed-ops','分步算式与综合算式','6–19'],['mixed-story','mixed-ops','两步运算解决问题','12–19'],
 ['mm-dm','length','毫米、厘米、分米与米','20–23'],['kilometre','length','千米与米','25–27'],['ruler-length','length','读直尺与非零起点测量','20–23'],['length-estimate','length','合理单位与长度估测','23–27'],['length-story','length','路程、重叠与折叠','22–30'],
 ['mass-unit','weighing','选择质量单位','32–35'],['grams-kg','weighing','克与千克','32–36'],['tonne','weighing','吨与千克','33–35'],['scale-reading','weighing','读秤与比较轻重','32–36'],['weigh-plan','weighing','等量替换与分批称重','31、35–36'],
 ['mul-two-mental','multiply','整十整百整千数口算','40–42'],['mul-two-carry','multiply','两位数乘一位数','43–47'],['mul-three-basic','multiply','三位数乘一位数不进位','43、46'],['mul-three-carry','multiply','三位数乘一位数与进位','44–47'],['mul-zero','multiply','中间或末尾有0的乘法','49–50、52–53'],['multiply-estimate','multiply','乘法估算与够不够','45、47、51、53–56'],['multiply-story','multiply','多位数乘法两步应用','46–48、53–56'],
 ['digital-code','coding','设计唯一编号与补0','59–60'],['code-read','coding','按位读懂虚构编码','57–60'],
 ['line-types','lines-angles','线段、射线与直线','61–62'],['line-points','lines-angles','过点画线与两点间距离','62–65'],['angle-parts','lines-angles','角的顶点、边与符号','66'],['angle-types','lines-angles','锐角、直角与钝角','67–70'],['angle-compare','lines-angles','比较角的张口大小','66–71'],
 ['fraction-unit','fraction','平均分与几分之一','73–75'],['fraction-parts','fraction','几分之几、组成与补整体','75–80'],['fraction-compare','fraction','同分母与单位分数比较','77–80、91'],['fraction-addsub','fraction','同分母分数加减','81–84、90–91'],['fraction-set','fraction','一组物体的几分之几','85–89、91'],
 ['review-calc','review','联系运算与逆向思考','92、97–98'],['review-life','review','数量关系与综合应用','93、95、97–100'],['review-geometry','review','图形、视图与线角关联','94–95、98–99'],['review-quantities','review','常见量的整理与应用','94–97、99'],['combinations','review','数学广角：搭配问题','101–102']
].map(([id,unit,title,pages],i)=>({id,unit,title,pages,lesson:i+1,...(id==='combinations'?{extension:true}:{})}));
const hash=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return(h>>>0).toString(36);};
const randomValue=rng=>Math.max(0,Math.min(.999999999,Number(rng())||0));
export function tilePerimeter(cells){const keys=new Set(cells.map(c=>c.join(',')));return cells.reduce((p,[x,y])=>p+[[x-1,y],[x+1,y],[x,y-1],[x,y+1]].filter(c=>!keys.has(c.join(','))).length,0);}
export function generate(skillId,rng=Math.random,difficulty='basic',preferredVariant){
 const skill=skills.find(s=>s.id===skillId);if(!skill)throw new Error('Unknown skill '+skillId);
 const random=()=>randomValue(rng),hard=difficulty==='advanced';
 let body;
 const reflection=hard&&(preferredVariant==='reflection'||preferredVariant?.startsWith('reflection:'));
 if(reflection){
  const base=preferredVariant.startsWith('reflection:')?preferredVariant.slice(11):null;
  body=base?generateBasicVariant(base,random,'advanced'):basicForSkill(skillId,random,'advanced');body.reflection=true;
 }else if(hard){
  if(preferredVariant?.startsWith('exam:'))body=generateExamVariant(preferredVariant.slice(5),random);
  else if(!preferredVariant)body=examForSkill(skillId,random);
  if(!body)body=preferredVariant?generateAdvancedVariant(preferredVariant,random):advancedForSkill(skillId,random);
 }else body=preferredVariant?generateBasicVariant(preferredVariant,random):basicForSkill(skillId,random);
 if(body.skill!==skillId)throw new Error('Variant does not belong to skill '+skillId);
 const q={...body,skill:skillId,unit:skill.unit,title:skill.title,difficulty:hard?'advanced':'basic'};
 if(q.options){q.options=q.options.map(String);for(let i=q.options.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[q.options[i],q.options[j]]=[q.options[j],q.options[i]];}}
 const identity=[q.prompt,q.math,q.answer,q.diagram,q.basicVariant,q.examVariant];if(q.advancedVariant)identity.push(q.advancedVariant);if(q.reflection)identity.push('reflection');
 q.id=skillId+'-'+q.difficulty+'-'+hash(JSON.stringify(identity));return q;
}
const leastUsed=(items,usage,key,rng)=>{
 const low=Math.min(...items.map(item=>usage.get(key(item))||0)),choices=items.filter(item=>(usage.get(key(item))||0)===low);
 return choices[Math.floor(randomValue(rng)*choices.length)];
};
const retryRandom=(rng,slot,retry,salt)=>{
 if(retry<4)return rng;
 let seed=((slot+1)*2654435761+retry*1013904223+salt*1664525)>>>0;
 return ()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
};
const roundContentKey=q=>q.semanticKey||q.id;
function advancedRound(scope,count,rng,available,order){
 const reflectionAt=randomValue(rng)<.3?Math.floor(randomValue(rng)*count):-1;
 const out=[],seen=new Set(),skillsUsed=new Map(),formsUsed=new Map(),papersUsed=new Map(),exhaustedPapers=new Set();
 for(let slot=0;slot<count;slot++){
  const eligible=scope==='mixed'?available.filter(s=>s.unit===order[slot%order.length].id):available;
  let q;
  if(slot===reflectionAt){
   const skill=leastUsed(eligible,skillsUsed,s=>s.id,rng);q=generate(skill.id,rng,'advanced','reflection');
  }else{
   // Sample the available paper structures first; only finite/exhausted source pools require supplements.
   const papers=examVariants.filter(v=>eligible.some(s=>s.id===v.skill));
   while(!q){
    const remaining=papers.filter(v=>!exhaustedPapers.has(v.id));if(!remaining.length)break;
    const paper=leastUsed(remaining,papersUsed,v=>v.id,rng),salt=examVariants.indexOf(paper);
    for(let retry=0;retry<32;retry++){
     const sample=generate(paper.skill,retryRandom(rng,slot,retry,salt),'advanced','exam:'+paper.id);
     if(!seen.has(roundContentKey(sample))){q=sample;break;}
    }
    if(q)papersUsed.set(paper.id,(papersUsed.get(paper.id)||0)+1);else exhaustedPapers.add(paper.id);
   }
   if(!q){
    const skill=leastUsed(eligible,skillsUsed,s=>s.id,rng),variants=advancedVariants.filter(v=>v.skill===skill.id),first=leastUsed(variants,formsUsed,v=>v.id,rng);
    for(let retry=0;retry<256;retry++){
     const variant=retry<12?first:variants[(variants.indexOf(first)+Math.floor((retry-12)/4))%variants.length];
     const sample=generate(skill.id,retryRandom(rng,slot,retry,100+advancedVariants.indexOf(variant)),'advanced',variant.id);
     if(!seen.has(roundContentKey(sample))){q=sample;break;}
    }
   }
  }
  if(!q||seen.has(roundContentKey(q)))throw new Error('Not enough unique advanced questions');
  out.push(q);seen.add(roundContentKey(q));skillsUsed.set(q.skill,(skillsUsed.get(q.skill)||0)+1);
  if(q.advancedVariant)formsUsed.set(q.advancedVariant,(formsUsed.get(q.advancedVariant)||0)+1);
 }
 return out;
}
export function makeRound(scope='mixed',count=10,rng=Math.random,difficulty='basic'){
 count=Math.max(1,Math.min(15,Math.floor(Number(count)||10)));
 const exact=skills.find(s=>s.id===scope),available=exact?[exact]:scope==='mixed'?skills:skills.filter(s=>s.unit===scope);
 if(!available.length)throw new Error('Unknown practice scope');
 const order=[...units];for(let i=order.length-1;i>0;i--){const j=Math.floor(randomValue(rng)*(i+1));[order[i],order[j]]=[order[j],order[i]];}
 if(difficulty==='advanced')return advancedRound(scope,count,rng,available,order);
 const out=[],seen=new Set(),usage=new Map(),skillUsage=new Map();
 for(let i=0;i<count;i++){
  const choices=scope==='mixed'?available.filter(s=>s.unit===order[i%order.length].id):available,skill=leastUsed(choices,skillUsage,s=>s.id,rng);
  const variants=basicVariants.filter(v=>v.skill===skill.id),variant=leastUsed(variants,usage,v=>v.id,rng);let q;
  for(let retry=0;retry<256;retry++){q=generate(skill.id,retryRandom(rng,i,retry,0),'basic',variant.id);if(!seen.has(q.id))break;}
  if(seen.has(q.id))throw new Error('Not enough unique questions for '+skill.id);
  out.push(q);seen.add(q.id);skillUsage.set(skill.id,(skillUsage.get(skill.id)||0)+1);usage.set(q.basicVariant,(usage.get(q.basicVariant)||0)+1);
 }
 return out;
}
