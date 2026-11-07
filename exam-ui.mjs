import {units,skills} from './curriculum.mjs?v=three9';
import {examSources,examVariants,referenceFor} from './exam-practice.mjs?v=three9';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function questionSource(q){
 return referenceFor(q)?'<button class="question-source" data-action="exam-source">试卷题型改编 · 查看参考出处 ↗</button>':q?.difficulty==='advanced'?'<span class="question-source question-original">同步自编练习</span>':'';
}
export function sourceContents(q){
 const source=referenceFor(q);
 if(source)return `<div class="source-intro"><span class="source-pill">题型改编</span><h3>${esc(source.focus)}</h3><p>这道题参考了下面资料的解题结构，情境、数字和解析已重新编写。</p></div><article class="source-card"><span>${esc(source.region)} · ${esc(source.reading)}</span><h3>${esc(source.title)}</h3><p>参考位置：${esc(source.item)}</p><a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">查看公开参考资料 ↗</a></article><p class="fine-print">参考资料为第三方转载，未作为学校官方原卷核验；只选用符合这册教材范围的内容。</p><button class="button primary full" data-action="close">回到这道题</button>`;
 return `<p class="modal-intro">当前参考${examSources.length}份浙江地区公开试卷资料，整理出${examVariants.length}类改编题型，已混入各章节进阶练习。<br>保留解题结构，重新设计情境、数字与解析。</p><div class="source-grid">${examSources.map(s=>{const variants=examVariants.filter(v=>v.sourceId===s.id);return `<article class="source-card"><span>${esc(s.region)} · ${esc(s.reading)}</span><h3>${esc(s.title)}</h3><ul>${variants.map(v=>`<li>${esc(v.focus)}<small>${esc(units.find(u=>u.id===skills.find(k=>k.id===v.skill)?.unit)?.title||'')} · ${esc(skills.find(k=>k.id===v.skill)?.title||'')}<br>参考${esc(v.item)}</small></li>`).join('')}</ul><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">查看公开参考资料 ↗</a></article>`;}).join('')}</div><p class="fine-print">这些资料来自公开转载，未作为学校官方原卷核验。已按实拍目录及正文核对，移出周长、集合及独立时分秒专项；除法限表内口算。教材星号方案比较保留为拓展；发现的转载答案瑕疵没有直接沿用。收录杭州、宁波、温州、嘉兴、绍兴、金华、台州等浙江地区已核读的题文或明确标注的可读片段；不采用仅有标题、缺图或不可读的资料。</p><button class="button primary full" data-action="close">继续练习</button>`;
}
