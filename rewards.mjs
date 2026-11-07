export const rewardCatalog=[
 {id:'background:classic',kind:'background',value:'classic',at:0,title:'粉蓝庆典',description:'经典放射舞台',preview:'rays'},
 {id:'background:night',kind:'background',value:'night',at:1,title:'星光夜空',description:'闪烁星星与极光',preview:'night'},
 {id:'background:sea',kind:'background',value:'sea',at:3,title:'泡泡海洋',description:'水波与上升气泡',preview:'sea'},
 {id:'music:classic',kind:'music',value:'classic',at:0,title:'经典旋律',description:'木琴、鼓点与合唱',preview:'music'},
 {id:'music:chip',kind:'music',value:'chip',at:5,title:'像素节拍',description:'复古像素旋律',preview:'chip'},
 {id:'particle:classic',kind:'particle',value:'classic',at:0,title:'庆典彩纸',description:'星星、彩纸与金币',preview:'paper'},
 {id:'particle:note',kind:'particle',value:'note',at:8,title:'音符派对',description:'答对时音符飞扬',preview:'note'},
 {id:'background:space',kind:'background',value:'space',at:12,title:'星际漫游',description:'行星与星云隧道',preview:'space'},
 {id:'music:matsuri',kind:'music',value:'matsuri',at:15,title:'祭典鼓点',description:'太鼓、三味线与笛声',preview:'music'},
 {id:'background:festival',kind:'background',value:'festival',at:18,title:'灯笼庆典',description:'灯笼与旋转纸扇',preview:'festival'},
 {id:'particle:petal',kind:'particle',value:'petal',at:20,title:'花瓣飞舞',description:'轻柔飘落的彩色花瓣',preview:'petal'},
 {id:'music:brass',kind:'music',value:'brass',at:22,title:'小小乐队',description:'铜管与钟琴的合奏',preview:'music'},
 {id:'background:paper',kind:'background',value:'paper',at:24,title:'彩纸花园',description:'波浪纸带与纸花',preview:'paper'},
 {id:'music:electro',kind:'music',value:'electro',at:30,title:'电子律动',description:'电子贝斯与闪亮主旋律',preview:'electro'}
];
const defaults=()=>({background:'classic',music:'classic',particle:'classic'});
export function restoreRewards(value,rounds=[]){
 const historyStars=rounds.reduce((n,r)=>n+1+(r.independent===r.total?1:0),0);
 const stars=Number.isSafeInteger(value?.stars)&&value.stars>=0?value.stars:historyStars;
 const clears=Number.isSafeInteger(value?.clears)&&value.clears>=0?value.clears:rounds.length;
 const equipped=defaults();
 for(const kind of Object.keys(equipped)){const item=rewardCatalog.find(r=>r.kind===kind&&r.value===value?.equipped?.[kind]&&r.at<=stars);if(item)equipped[kind]=item.value;}
 const claimed=Array.isArray(value?.claimed)?value.claimed.filter(x=>typeof x==='string').slice(-200):rounds.map((r,i)=>r.id||`legacy:${i}:${r.date||''}`).slice(-200);
 return {stars,clears,claimed,equipped};
}
export function grantClearReward(record,round){
 if(!round?.id||!Number.isInteger(round.total)||round.total<1||!Number.isInteger(round.independent)||round.independent<0||round.independent>round.total)throw new Error('Invalid completed round');
 const reward=record.rewards=restoreRewards(record.rewards,record.rounds);
 if(reward.claimed.includes(round.id))return {stars:0,unlocked:[],alreadyClaimed:true};
 const before=reward.stars,stars=1+(round.independent===round.total?1:0);reward.stars+=stars;reward.clears++;reward.claimed.push(round.id);reward.claimed=reward.claimed.slice(-200);
 return {stars,unlocked:rewardCatalog.filter(r=>r.at>before&&r.at<=reward.stars),alreadyClaimed:false};
}
export function equipReward(record,id){const reward=record.rewards=restoreRewards(record.rewards,record.rounds);const item=rewardCatalog.find(r=>r.id===id&&r.at<=reward.stars);if(!item)return false;reward.equipped[item.kind]=item.value;return true;}

export function hasPerfectClear(record){const reward=restoreRewards(record.rewards,record.rounds);return reward.stars>reward.clears||record.rounds.some(r=>r.independent===r.total);}
