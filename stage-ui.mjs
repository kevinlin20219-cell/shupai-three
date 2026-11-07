import {collectibleArt} from './playful-ui.mjs?v=three9';
import {character} from './characters.mjs?v=three9';
export function stageDecoration(mascot){
 const colors=['#ee91bb','#b29bdc','#f4d576','#9cd3b0','#a6cde7'];
 const flags=Array.from({length:13},(_,i)=>{const x=12+i*36,y=8+Math.sin(i/12*Math.PI)*12;return `<path d="M${x} ${y}l12 14 12-11" fill="${colors[i%colors.length]}" stroke="#6c5c79" stroke-width="1.5"/>`;}).join('');
 const friends=['kuromi','cinnamoroll','keroppi','kitty'].map((type,i)=>`<div class="stage-friend friend-${i}" hidden data-character="${type}">${character(type,'friend-cat')}</div>`).join('');
 return `<svg class="stage-bunting" viewBox="0 0 480 46" aria-hidden="true"><path d="M0 3Q240 46 480 3" fill="none" stroke="#6c5c79" stroke-width="2"/>${flags}</svg><i class="stage-spot spot-left" aria-hidden="true"></i><i class="stage-spot spot-right" aria-hidden="true"></i><div class="stage-friends" aria-hidden="true">${friends}</div><svg class="stage-ground" viewBox="0 0 500 22" aria-hidden="true"><path d="M10 16Q250-3 490 16M24 18H478" fill="none" stroke="#6c5c79" stroke-width="1.5"/></svg>`;
}
export function clearRewardPanel(lastReward,record,icon){
 if(!lastReward)return '';
 return `<section class="clear-reward"><div class="reward-star-burst">✦</div><div class="clear-reward-copy"><span class="section-kicker">CLEAR REWARD</span><h2>过关奖励 <b>+${lastReward.stars} 节奏星</b></h2><p>${lastReward.stars===2?'全部独立答对，额外获得1颗星！':'认真完成这一轮，就值得一颗星！'} 现有 ${record.rewards.stars} 颗。</p></div>${lastReward.unlocked.length?`<div class="new-unlocks">${lastReward.unlocked.map(r=>`<div><span>新解锁 · <strong>${r.title}</strong></span><button class="text-button" data-action="equip" data-reward="${r.id}">立即装备 ${icon('check',14)}</button></div>`).join('')}</div>`:''}<button class="text-button reward-view-all" data-action="rewards">查看我的奖励 ${icon('arrow',15)}</button></section>`;
}
export function rewardContents(record,catalog){
 const reward=record.rewards,labels={background:'背景',music:'音乐',particle:'粒子'};
 return `<div class="reward-wallet"><span class="wallet-star">✦</span><div><strong>${reward.stars}<small> 节奏星</small></strong><p>已过关 ${reward.clears} 次</p></div></div><p class="modal-intro">每轮完成获得1颗星，全部独立答对再加1颗。累积星星自动解锁，装备不消耗星星。</p><div class="rewards-grid">${catalog.map(r=>{const unlocked=reward.stars>=r.at,equipped=reward.equipped[r.kind]===r.value;return `<article class="reward-item ${unlocked?'unlocked':'locked'}"><div class="reward-preview preview-${r.preview}" aria-hidden="true">${collectibleArt(r)}</div><div class="reward-item-info"><small>${labels[r.kind]} · ${r.at===0?'初始拥有':r.at+'星解锁'}</small><h3>${r.title}</h3><p>${r.description}</p><button class="reward-equip ${equipped?'equipped':''}" data-action="equip" data-reward="${r.id}" ${!unlocked||equipped?'disabled':''}>${equipped?'已装备 ✓':unlocked?'装备使用':'还差 '+(r.at-reward.stars)+' 颗星'}</button></div></article>`;}).join('')}</div><p class="fine-print">星星与装备保存在当前浏览器。背景在每轮第5题完成后展开；音乐和粒子从下次练习开始使用。挑选喜欢的舞台、旋律和庆祝特效，练出你的专属节奏。</p>`;
}
