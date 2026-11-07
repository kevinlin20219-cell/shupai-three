import {completionTotals} from './storage.mjs?v=three9';
import {advancedScene} from './playful-ui.mjs?v=three9';
import {examSources,examVariants} from './exam-practice.mjs?v=three9';
export const unitChallenges={
 observe:['不同视图与立体的对应','展开后的相对面','哪些展开图可以折合'],
 'mixed-ops':['同级顺序与先乘除','小括号与情境列式','先找中间问题再计算'],
 length:['直尺起点不在0','单位换算与重叠长度','估测路程与位置可能'],
 weighing:['克千克吨与质量量感','等量替换与分批称量','净重与皮重的关系'],
 multiply:['进位与因数中的0','积的位数和估算方向','先求一份与乘加应用'],
 coding:['读懂各字段含义','固定宽度与前面补0','设计能区分的虚构编号'],
 'lines-angles':['线的端点与延伸','过点连线和距离','角的张口与图形辨析'],
 fraction:['平均分与由部分补整体','同分母计算与比较','物体整体的几分之几'],
 review:['数与运算的关联','常见量和图形思考','★ 方案比较与搭配拓展']
};
export function advancedContents(units,skills,record,icon,mascot){
 const progress=Object.values(record.advancedSkills||{}),solved=completionTotals(record).advanced,lit=progress.filter(s=>s.independent>=3).length;
 return `<main class="home-main advanced-main"><section class="advanced-hero"><span class="eyebrow">${icon('spark',17)} 人教版三上 · 进阶挑战</span><h1>把思考，再推进一拍<span>✦</span></h1><p>先找数量关系，再一步步求解。<br>观察推理、混合运算、单位换算与图形比较，等你来挑战。</p><div class="advanced-badges"><span>${skills.length} 个进阶知识点</span><span>${units.filter(u=>!u.activity).length}个单元＋${units.filter(u=>u.activity).length}个实践</span><span>可以随时看提示</span></div><button class="button advanced-button" data-action="start" data-scope="mixed" data-difficulty="advanced">开始进阶混合练习 ${icon('play',20)}</button><small>每轮 ${record.settings.count} 题 · 无需抢答 · 认真想，比做得快更重要</small>${advancedScene(mascot)}</section><section class="exam-collection"><span class="source-pill">试卷题型改编</span><h2>多一种题型，多一个思路。</h2><p>参考${examSources.length}份浙江地区公开试卷资料，新编${examVariants.length}类进阶题型。运算顺序、分数应用、编码规则、重叠长度与乘法推理，按这册教材逐项归类。</p><button class="text-button" data-action="exam-sources">查看题型与参考资料 ↗</button></section><div class="advanced-progress"><span><b>${solved}</b> 道进阶题已完成</span><span><b>${lit} / ${skills.length}</b> 进阶知识点已点亮</span></div><section class="units-section advanced-units"><div class="section-heading"><div><span class="section-kicker">CHOOSE YOUR CHALLENGE</span><h2>选一章，试试更深的思考</h2></div></div><div class="unit-grid">${units.map(u=>{const ss=skills.filter(s=>s.unit===u.id),done=ss.filter(s=>(record.advancedSkills?.[s.id]?.independent||0)>=3).length;return `<article class="unit-card advanced-unit ${u.color}"><div class="unit-card-top"><span class="unit-icon">${icon(u.icon,25)}</span><span class="unit-number">${u.activity?'综合实践':'CHAPTER '+u.number}</span><span class="advanced-tag">进阶</span></div><h3>${u.title}</h3><p class="textbook-pages">课本 ${u.pages} 页</p><ul class="challenge-list">${unitChallenges[u.id].map(t=>`<li>${t}</li>`).join('')}</ul><div class="unit-card-foot"><span>${done} / ${ss.length} 进阶知识点已点亮</span></div><button class="button advanced-button full" data-action="start" data-scope="${u.id}" data-difficulty="advanced" aria-label="${u.title}·进阶练习">开始本章进阶 ${icon('arrow',17)}</button></article>`;}).join('')}</div></section><p class="advanced-note">进阶与基础的掌握情况分别记录。提示或重试后完成会记为辅助完成，错题仍可在“我的记录”中继续复习。</p></main>`;
}
