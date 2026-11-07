// Direct reasoning exercises aligned to the verified seven units and two activities.
// This module deliberately has no curriculum dependency or source-paper attribution.
const forms=[];
const add=(skill,tag,focus,create)=>forms.push({id:`adv-${skill}-${tag}`,skill,focus,create});
const Q=(prompt,answer,hint,explanation,extra={})=>({prompt,answer,hint,explanation,challenge:'多步应用',...extra});
const choice=(prompt,answer,options,hint,explanation,extra={})=>Q(prompt,answer,hint,explanation,{options,...extra});
const fraction=(n,d)=>`${n}/${d}`;
const repeatedSum=(value,count)=>Array(count).fill(value).join('＋');
const symbols=[['星星','月亮','花朵'],['圆点','小鱼','树叶'],['苹果','小鸟','雨伞'],['太阳','房子','小船'],['爱心','云朵','风车'],['书本','小猫','蘑菇'],['蝴蝶','水滴','灯笼'],['雪花','铃铛','贝壳']];
const netDims=int=>[int(2,7),int(1,4),int(2,6)];
const numberedFaces=int=>{const start=int(1,20),orders=[[0,1,2,3,4,5],[4,0,3,2,5,1],[2,5,0,4,1,3],[3,1,5,0,2,4],[1,4,2,5,3,0],[5,2,4,1,0,3]];return orders[int(0,5)].map(i=>String(start+i));};
const cubeCells=[[1,0],[0,1],[1,1],[2,1],[1,2],[1,3]];
function transformCells(cells,turn,flip,dx,dy){
 const rotated=cells.map(([x,y])=>{if(flip)x=-x;for(let i=0;i<turn;i++)[x,y]=[-y,x];return [x,y];});
 const minX=Math.min(...rotated.map(c=>c[0])),minY=Math.min(...rotated.map(c=>c[1]));
 return rotated.map(([x,y])=>[x-minX+dx,y-minY+dy]);
}
const fan=(rays,int)=>({type:'ray-fan',rays,rotation:int(0,359)});

add('observe-view','a','结合两个观察方向辨认图案',({pick,int})=>{
 const sy=pick(symbols),pairs=[[0,2],[2,1],[1,0],[2,0],[0,1],[1,2]],pair=pick(pairs),dirs=['前面','右面','上面'],answer=pair.map(i=>dirs[i]).join('和');
 const options=[answer,pair.map(i=>dirs[(i+1)%3]).join('和'),pair.map(i=>dirs[(i+2)%3]).join('和')];
 return choice(`要依次看清盒子上的${sy[pair[0]]}和${sy[pair[1]]}，应分别正对哪两个面观察？`,answer,options,'分别确定两个图案所在的面，顺序也要对应。',`${sy[pair[0]]}在${dirs[pair[0]]}，${sy[pair[1]]}在${dirs[pair[1]]}，所以是${answer}。`,{challenge:'条件筛选',diagram:{type:'object-view',object:'box',direction:'front',mode:'scene',symbols:sy}});
});
add('observe-view','b','保持上下方向向左右两边旋转盒子',({pick})=>{
 const sy=pick(symbols),side=pick(['right','left']),sideName=side==='right'?'右':'左',answer=side==='right'?'左面':'右面';
 return choice(`保持${sy[2]}在上面，把盒子转到${sy[1]}正对自己。原来画${sy[0]}的一面现在朝自己的哪一侧？`,answer,['左面','右面','上面'],`让图中原来的${sideName}面转到前面，跟着想原来前面的移动方向。`,`原来${sy[1]}在${sideName}面。它朝前时，原来画${sy[0]}的前面就朝自己的${answer}。`,{challenge:'空间想象',diagram:{type:'object-view',object:'box',direction:'front',mode:'scene',symbols:sy,side}});
});
add('observe-solid','a','结合正面列高与上面一排还原数量',({int})=>{
 const a=int(1,3),b=int(2,4),c=int(1,3);
 return Q(`小方块紧挨着堆放。从前面看，三列分别高${a}、${b}、${c}块；从上面看只有一排3格，每列都堆满。共用了几块？`,a+b+c,'上面只有一排，说明没有藏在后排的方块。',`三列各有${a}、${b}、${c}块，共${a}＋${b}＋${c}＝${a+b+c}块。`,{challenge:'空间想象',suffix:'块'});
});
add('observe-solid','b','由总数和两列高度反推中间列视图',({int})=>{
 const a=int(1,3),b=int(2,4),c=int(1,3),depth=int(2,3),total=(a+b+c)*depth;
 return Q(`方块堆从上面看是3列、${depth}排。每列各排同高且堆满，共${total}块。前面看左右两列高${a}块、${c}块，中间列高几块？`,b,'先数左右两列各有几块，余下的平均分到中间列各排。',`左右共有${a}×${depth}＋${c}×${depth}＝${(a+c)*depth}块；中间有${total-(a+c)*depth}块，每排高${b}块。`,{challenge:'逆向推理',suffix:'块'});
});
add('observe-net','a','折叠后寻找相对面并合并编号',({int})=>{
 const labels=numberedFaces(int),answer=+labels[3]+ +labels[2];
 return Q(`图中数字是面编号。与${labels[0]}号面相对的面编号，加上${labels[2]}号面编号，和是多少？`,answer,'先沿共用边想象折盒子，找相对面，再求和。',`${labels[0]}号面与${labels[3]}号面相对，${labels[3]}＋${labels[2]}＝${answer}。`,{challenge:'空间想象',diagram:{type:'cuboid-net',dimensions:netDims(int),labels}});
});
add('observe-net','b','筛选三组相对面编号的最大和',({int})=>{
 const labels=numberedFaces(int),pairs=[[0,3],[1,2],[4,5]],sums=pairs.map(([a,b])=>+labels[a]+ +labels[b]);
 return Q('把相对的两个面组成一组。图中三组面编号的和，最大是多少？',Math.max(...sums),'先把六个面分成三组相对面，再比较每组的和。',`相对面编号的和分别是${sums.join('、')}，最大是${Math.max(...sums)}。`,{challenge:'条件筛选',diagram:{type:'cuboid-net',dimensions:netDims(int),labels}});
});
add('cube-net','a','同时满足可折叠与指定共边位置的补面',({int})=>{
 const turn=int(0,3),flip=int(0,1),dx=int(0,3),dy=int(0,3),all=transformCells([[0,1],[1,1],[2,1],[3,1],[1,2],[0,0],[2,0],[0,2]],turn,flip,dx,dy),offset=int(0,2),positions=[all[5],all[6],all[7]],candidates=positions.map((cell,i)=>({cell,label:'ABC'[(i+offset)%3]})),answer=candidates[0].label;
 return choice('只添一个虚线方格：它在纸面上要与2号方格共用一条边，且折起后能围成正方体。应添哪一格？',answer,candidates.map(c=>c.label),'有两个位置能折成正方体，还要检查新方格在纸面上是否与2号共边。',`添${candidates[0].label}或${candidates[1].label}都能折起，${candidates[0].label}与${candidates[2].label}都与2号共边；两项都满足的只有${answer}。`,{challenge:'条件筛选',diagram:{type:'cube-missing',cells:all.slice(0,5),labels:['2','1','3','4','5'],candidates}});
});
add('cube-net','b','追踪两个指定面的相对面',({int})=>{
 const labels=numberedFaces(int),cells=transformCells(cubeCells,int(0,3),int(0,1),int(0,3),int(0,3)),answer=+labels[4]+ +labels[3];
 return Q(`数字是面编号。折成正方体后，与${labels[0]}号、${labels[1]}号面相对的两个面，编号和是多少？`,answer,'分别找这两个面的相对面，不要把平面上的远近当作折后的相对。',`与${labels[0]}号面相对的是${labels[4]}号面，与${labels[1]}号面相对的是${labels[3]}号面，和为${answer}。`,{challenge:'空间想象',diagram:{type:'cube-net',cells,labels}});
});

add('mixed-same-level','a','从乘除结果倒推起始数',({int})=>{const a=int(2,5),b=int(3,6),n=int(2,9);return Q(`□÷${a}×${b}＝${n*b}，方框里填几？`,a*n,'同级运算从左往右，先倒推除法后的商。',`先求出商是${n}，原数为${a}×${n}＝${a*n}。`,{challenge:'逆向推理'});});
add('mixed-same-level','b','从连续减法反求缺失减数',({int})=>{const total=int(20,70),last=int(3,8),remain=int(2,9),missing=total-last-remain;return Q(`${total}−□−${last}＝${remain}，方框里填几？`,missing,'先把最后减去的数加回，得到第一次减法的结果。',`第一次减后有${remain+last}，所以方框是${total}−${remain+last}＝${missing}。`,{challenge:'逆向推理'});});
add('mixed-order','a','按乘法优先反求一份数',({int})=>{const a=int(2,9),b=int(2,9),n=int(3,9);return Q(`${a}×□＋${b}＝${a*n+b}，方框里填几？`,n,'先从最终结果中去掉加上的部分，再想乘法口诀。',`乘积是${a*n+b}−${b}＝${a*n}；${a}×${n}＝${a*n}，填${n}。`,{challenge:'逆向推理'});});
add('mixed-order','b','比较含乘除的两个式子',({int})=>{const a=int(2,9),b=int(2,8),c=int(2,b);return Q(`甲算式是${a*b}÷${a}＋${c}，乙算式是${a*b}÷${a}−${c}。甲的结果比乙大多少？`,c*2,'两个式子的商相同，从减去一份到加上一份相差两份。',`共同的商是${b}，甲加${c}，乙减${c}，相差${c}＋${c}＝${c*2}。`,{challenge:'多步应用'});});
add('mixed-brackets','a','由括号外乘积反求括号内数',({int})=>{const a=int(2,5),n=int(3,9-a),b=int(2,9);return Q(`（□＋${a}）×${b}＝${(n+a)*b}，方框里填几？`,n,'先想括号里合起来是多少，再去掉已知加数。',`括号中是${n+a}，所以方框填${n+a}−${a}＝${n}。`,{challenge:'逆向推理'});});
add('mixed-brackets','b','比较括号改变的数量关系',({int})=>{const a=int(2,9),b=int(2,9),c=int(3,9);return Q(`（${a}＋${b}）×${c}比${a}＋${b}×${c}多多少？`,a*(c-1),'把前式看成几组括号中的两个数；两式中第二个数的份数相同，只比较第一个数的份数。',`前式有${c}组${a}和${c}组${b}，后式有1个${a}和${c}组${b}。同样的${c}组${b}抵去，多了${c-1}个${a}，${a}×${c-1}＝${a*(c-1)}。`);});
add('mixed-expression','a','把合并再平均分的两步关系列成算式',({int})=>{const a=int(4,7),b=int(2,9-a),c=int(3,5),x=a*c,y=b*c,answer=`（${x}＋${y}）÷${c}`;return choice(`甲盒有${x}颗珠子，乙盒有${y}颗。合起来平均分给${c}人。哪一个综合算式求每人几颗？`,answer,[answer,`${x}＋${y}÷${c}`,`（${x}＋${y}）×${c}`],'两盒先合并，合并的总数都要平均分。',`先求${x}＋${y}，再除以${c}，所以选${answer}。`,{challenge:'条件筛选'});});
add('mixed-expression','b','由含乘除的综合算式逆推总量',({int})=>{const a=int(2,9),b=int(3,9),groups=int(2,9),each=int(3,9),total=a*b+groups*each;return Q(`一批图书先借给${a}组，每组${b}本；剩下的平均分给${groups}组，每组${each}本。综合算式是（□−${a}×${b}）÷${groups}＝${each}，原有多少本？`,total,'先还原剩下的总本数，再加回先借出的图书。',`剩下${groups}×${each}＝${groups*each}本，先借出${a*b}本，原有${groups*each}＋${a*b}＝${total}本。`,{challenge:'逆向推理',suffix:'本'});});
add('mixed-story','a','由平均分后的差倒推原来的另一部分',({int})=>{const each=int(4,9),groups=int(3,9),red=int(2,each*groups-1);return Q(`红珠${red}颗，与蓝珠混合后平均装${groups}袋，每袋${each}颗。蓝珠有多少颗？`,each*groups-red,'先由每袋和袋数还原总数，再去掉红珠。',`总数${groups}×${each}＝${groups*each}颗，蓝珠${groups*each}−${red}＝${groups*each-red}颗。`,{challenge:'逆向推理',suffix:'颗'});});
add('mixed-story','b','先求每组数量再按新条件分配',({int})=>{const per=int(3,8),groups=int(2,9),extra=int(1,per-1);return Q(`${groups}组平均分${per*groups}张纸。每组再交回${extra}张后，每组还留下多少张？`,per-extra,'先找每组原来分得多少，再减去交回的。',`每组原有${per*groups}÷${groups}＝${per}张，留下${per}−${extra}＝${per-extra}张。`,{suffix:'张'});});

add('mm-dm','a','统一不同长度单位后连接',({int})=>{const dm=int(1,8),cm=int(3,9);return Q(`一条彩带长${dm}分米，另一条长${cm}厘米。两条首尾相接且不重叠，总长多少毫米？`,dm*100+cm*10,'分米和厘米都换成毫米后相加。',`${dm}分米＝${dm*100}毫米，${cm}厘米＝${cm*10}毫米，共${dm*100+cm*10}毫米。`,{suffix:'毫米'});});
add('mm-dm','b','反推截去的复合单位长度',({int})=>{const dm=int(1,8),left=int(6,9),total=dm*100;return Q(`一根长${dm}分米的木条，截去一段后剩${left}厘米。截去多少毫米？`,total-left*10,'统一成毫米，再用原长减去剩长。',`原长${total}毫米，剩${left*10}毫米，截去${total-left*10}毫米。`,{challenge:'逆向推理',suffix:'毫米'});});
add('kilometre','a','路程往返并扣除已走路程',({int})=>{const km=int(1,6),m=int(1,8)*100,walked=int(15,19)*100,single=km*1000+m,total=single+single;return Q(`家到公园单程${km}千米${m}米。小林沿原路往返，已走${walked}米。离回到家还要走多少米？`,total-walked,'先统一成米，把去和回两个单程相加，再扣掉已走的。',`单程${single}米，往返是${single}＋${single}＝${total}米，还要走${total}−${walked}＝${total-walked}米。`,{suffix:'米'});});
add('kilometre','b','由总目标倒推第二段路程',({int})=>{const km=int(3,7),first=int(14,15)*100,last=int(14,km===3&&first===1500?14:15)*100;return Q(`三段路共${km}千米，第一段${first}米，第三段${last}米。第二段长多少米？`,km*1000-first-last,'总长统一成米，再去掉两段已知长度。',`${km*1000}−${first}−${last}＝${km*1000-first-last}米。`,{challenge:'逆向推理',suffix:'米'});});
add('ruler-length','a','读非零起点并比较复制后的长度',({int})=>{const start=int(2,15),length=int(15,40),shorter=int(4,9);return Q(`图中彩条的两端对齐毫米刻度。另一根比它的2倍短${shorter}毫米，另一根长多少毫米？`,length+length-shorter,'先用末端刻度减去起点，再把长度相加两次并扣去短的部分。',`图中长${start+length}−${start}＝${length}毫米；2倍长是${length}＋${length}＝${length+length}毫米，再减${shorter}毫米，得${length+length-shorter}毫米。`,{suffix:'毫米',diagram:{type:'ruler',start,end:start+length,max:60}});});
add('ruler-length','b','换尺起点改变但实物长度不变',({int,pick})=>{const old=int(2,8),len=int(4,9),fresh=pick([4,5,6,7,8,9].filter(n=>n!==old));return Q(`铅笔两端原对齐${old}厘米和${old+len}厘米刻度。把左端移到${fresh}厘米刻度，右端应对齐几厘米刻度？`,fresh+len,'先求铅笔实际长度，换位置后长度不变。',`笔长${old+len}−${old}＝${len}厘米，新右端是${fresh}＋${len}＝${fresh+len}厘米刻度。`,{challenge:'逆向推理'});});
add('length-estimate','a','用表内步长求单程再逐段累加往返',({int})=>{const step=int(4,6),steps=int(2,9),trips=int(1,3),single=step*steps,segments=trips+trips,total=single*segments;return Q(`一步约${step}分米。从门口到花坛约${steps}步，沿原路往返${trips}次，共走多少分米？`,total,'用乘法口诀求出一个单程；每次往返有两段单程，把这些单程依次相加。',`单程约${step}×${steps}＝${single}分米；往返${trips}次有${segments}段单程，${repeatedSum(single,segments)}＝${total}分米。`,{suffix:'分米'});});
add('length-estimate','b','用一叠样本反推单本厚度再估测新叠高度',({int,pick})=>{const thick=int(2,7),sample=int(2,4),count=pick([4,5,6,7,8,9].filter(n=>n!==sample));return Q(`${sample}本同样的练习本叠起来约厚${sample*thick}毫米。${count}本这样的本子叠起来，大约厚多少毫米？`,thick*count,'先从样本求出单本厚度，再估计新的一叠。',`每本约厚${sample*thick}÷${sample}＝${thick}毫米，${count}本约厚${thick}×${count}＝${thick*count}毫米。`,{suffix:'毫米'});});
add('length-story','a','从接好后的长度反推重叠',({int})=>{const a=int(12,35),b=int(15,40),over=int(3,9),joined=a+b-over;return Q(`两根纸条分别长${a}厘米、${b}厘米，重叠相接后总长${joined}厘米。重叠了多少厘米？`,over,'两根长度直接相加时，多算的正好是重叠部分。',`${a}＋${b}−${joined}＝${over}厘米。`,{challenge:'逆向推理',suffix:'厘米'});});
add('length-story','b','折叠后剪去多层端部再累加各层剩长',({int})=>{const folded=int(6,15),cut=int(1,3),folds=int(2,3),layers=2**folds,left=folded-cut,total=left*layers;return Q(`绳子连续对折${folds}次后每层长${folded}厘米。把对齐的开口端各层都剪去${cut}厘米，再展开，剩下各段总长多少厘米？`,total,'先数层数，每一层都少了同样长的一段；把各层剩长依次相加。',`对折后有${layers}层，每层剩${folded}−${cut}＝${left}厘米。各层相加：${repeatedSum(left,layers)}＝${total}厘米。`,{suffix:'厘米'});});

add('mass-unit','a','由每袋数字与整批质量的一致性选择单位',({int,pick})=>{
 const type=int(0,2);let object,value,count,total,totalUnit,answer,detail;
 if(type===0){[value,count,total]=pick([[200,5,1],[250,4,1],[500,2,1],[500,4,2],[500,6,3],[500,8,4],[400,5,2],[600,5,3],[800,5,4]]);object='盐';totalUnit='千克';answer='克';detail=`每袋${value}克，${count}袋相加：${repeatedSum(value,count)}＝${value*count}克，正好是${total}千克`;}
 else if(type===1){value=int(2,8);count=int(2,9);total=value*count;object='米';totalUnit='千克';answer='千克';detail=`每袋${value}千克，${count}袋合计${total}千克`;}
 else{value=int(1,5);count=int(2,8);total=value*count*1000;object='钢材';totalUnit='千克';answer='吨';detail=`每捆${value}吨，${count}捆合计${value*count}吨，即${total}千克`;}
 const pack=type===2?'捆':'袋';
 return choice(`每${pack}${object}的标签是${value}（ ）。${count}${pack}这样的${object}共${total}${totalUnit}，括号里应选什么质量单位？`,answer,['克','千克','吨'],'分别把三个单位代入，再检查与整批质量是否吻合。',`${detail}。选其他单位会使整批质量不符，所以应填${answer}。`,{challenge:'条件筛选'});
});
add('mass-unit','b','同时满足三类物体的合理质量量级',({pick})=>{
 const light=pick([['一枚回形针',1,'克'],['一个鸡蛋',50,'克'],['一本字典',500,'克'],['一块橡皮',20,'克'],['一支铅笔',10,'克']]),middle=pick([['一袋米',5,'千克'],['一名三年级学生',30,'千克'],['一桶水',10,'千克'],['一辆自行车',15,'千克'],['一只中型犬',12,'千克']]),heavy=pick([['一车钢材',8,'吨'],['一头大象',4,'吨'],['一辆小汽车',1,'吨'],['一车砂石',12,'吨']]);
 const order=pick([[0,1,2],[1,2,0],[2,0,1],[0,2,1],[2,1,0],[1,0,2]]),items=order.map(i=>[light,middle,heavy][i]),units=items.map(x=>x[2]),answer=units.join('、'),options=[answer,[units[1],units[2],units[0]].join('、'),[units[2],units[0],units[1]].join('、'),[...units].reverse().join('、')];
 return choice(`${items.map(([name,n])=>`${name}约${n}（ ）`).join('，')}。依次填哪组质量单位，三个估测才都合理？`,answer,options,'从很轻、可以搬动、很重三个量级逐项筛选，三个空都要符合实际。',items.map(([name,n,unit])=>`${name}约${n}${unit}`).join('；')+`，所以依次填${answer}。`,{challenge:'条件筛选'});
});
add('grams-kg','a','混合单位求净重并加第二袋',({int})=>{const kg=int(1,5),g=int(2,8)*100,tare=int(1,4)*100,other=int(3,9)*100;return Q(`袋和豆子共${kg}千克${g}克，空袋重${tare}克。再添入${other}克豆子，袋里豆子共多少克？`,kg*1000+g-tare+other,'先换成克，扣除空袋，再加新添的豆子。',`${kg*1000+g}−${tare}＋${other}＝${kg*1000+g-tare+other}克。`,{suffix:'克'});});
add('grams-kg','b','由增量求装满后的整千克质量',({int})=>{const full=int(3,8),missing=int(1,9)*100;return Q(`米袋里已有${full*1000-missing}克米，再装${missing}克就满。装满后米重多少千克？`,full,'先合并克数，再看看有几个1000克。',`装满共${full*1000-missing}＋${missing}＝${full*1000}克，是${full}千克。`,{challenge:'逆向推理',suffix:'千克'});});
add('tonne','a','车身货物都计入限重',({int})=>{const limit=int(3,8),own=int(1,3)*500,cargo=int(13,Math.min(19,limit*10-own/100))*100;return Q(`桥限重${limit}吨。空车重${own}千克，已装货${cargo}千克，最多还可装多少千克而不超过限重？`,limit*1000-own-cargo,'限重包含车身和全部货物，先统一成千克。',`${limit*1000}−${own}−${cargo}＝${limit*1000-own-cargo}千克。`,{suffix:'千克'});});
add('tonne','b','分两次运输达到整吨目标',({int})=>{const target=int(2,8),first=int(3,8)*100,second=target*1000-first;return Q(`第一批运${first}千克，第二批运${second}千克。这两批正好装满一辆车，车上货物共多少吨？`,target,'把两批千克数合起来，再按每1000千克换成吨。',`共${first+second}千克，即${target}吨。`,{suffix:'吨'});});
add('scale-reading','a','读秤后扣除两个相同容器',({int})=>{const each=int(1,3),net=int(2,4),gross=each*2+net;return Q(`秤上是两个同样的空桶和水的总质量。每个空桶重${each}千克，水共重多少千克？`,net,'读出总质量后，要减去两个空桶的质量。',`秤读数为${gross}千克，水重${gross}−${each}×2＝${net}千克。`,{suffix:'千克',diagram:{type:'scale',value:gross,step:1,max:10,unit:'kg'}});});
add('scale-reading','b','根据目标总重反推需要添加的质量',({int})=>{const now=int(2,6),add=int(2,4),tare=int(1,2),target=now+add-tare;return Q(`图中称的是筐和苹果。空筐重${tare}千克，要使筐里苹果达到${target}千克，还要添多少千克苹果？`,add,'先从秤的总读数去掉筐，再与目标比较。',`现有苹果${now}−${tare}＝${now-tare}千克，还需${target}−${now-tare}＝${add}千克。`,{suffix:'千克',diagram:{type:'scale',value:now,step:1,max:10,unit:'kg'}});});
add('weigh-plan','a','分批替换后补足剩余质量',({int})=>{const total=int(6,12)*100,a=int(1,2)*100,b=int(2,3)*100;return Q(`用石头替换重物后，石头共重${total}千克。已称两批为${a}千克、${b}千克，最后一批还没称。它重多少千克？`,total-a-b,'等量替换保持总质量，最后一批是总量扣除已称的两批。',`${total}−${a}−${b}＝${total-a-b}千克。`,{challenge:'逆向推理',suffix:'千克'});});
add('weigh-plan','b','用两次平衡关系逐次替换并连加',({int})=>{const a=int(2,4),b=int(2,4),g=int(1,5)*100,salt=b*g,total=a*salt;return Q(`1盒积木与${a}袋盐等重，1袋盐与${b}袋糖等重。每袋糖${g}克，1盒积木重多少克？`,total,'先用糖替换1袋盐，把糖的质量相加；再用几袋盐替换积木，把每袋盐的质量相加。',`1袋盐等于${b}袋糖：${repeatedSum(g,b)}＝${salt}克；1盒积木等于${a}袋盐：${repeatedSum(salt,a)}＝${total}克。`,{suffix:'克'});});

add('mul-two-mental','a','整十数分成两部分求数量差',({int})=>{const a=int(2,9)*10,b=int(3,9),remove=int(1,b-1);return Q(`每包${a}张纸，共${b}包。送走${remove}包后，留下多少张？`,a*(b-remove),'先算剩几包，再口算整十数的几份。',`剩${b-remove}包，共${a}×${b-remove}＝${a*(b-remove)}张。`,{suffix:'张'});});
add('mul-two-mental','b','由整百积和增加量反推乘数',({int})=>{const unit=int(2,8)*100,n=int(3,8),extra=int(1,9)*10;return Q(`若干箱每箱${unit}枚徽章，另外散装${extra}枚，共${unit*n+extra}枚。整箱的有几箱？`,n,'先去掉散装部分，再数有几个整百数。',`整箱共${unit*n}枚，${unit}×${n}＝${unit*n}，所以是${n}箱。`,{challenge:'逆向推理',suffix:'箱'});});
add('mul-two-carry','a','两位数乘法后追加单份数量',({int})=>{const a=int(14,38),b=int(3,8),extra=int(14,28);return Q(`${b}盒彩笔每盒${a}支，另有${extra}支散装。一共有多少支？`,a*b+extra,'先算整盒支数，再加散装。',`${a}×${b}＋${extra}＝${a*b+extra}支。`,{suffix:'支'});});
add('mul-two-carry','b','由两个积的差反推每份增加量',({int})=>{const a=int(12,45),b=int(3,8),gap=int(6,9);return Q(`甲每包${a}张纸，乙每包比甲多一些。各买${b}包，乙比甲共多${gap*b}张。乙每包比甲多几张？`,gap,'总共多的数量由同样多的几份组成。',`${b}份共多${gap*b}张，每份多${gap}张；可用${gap}×${b}＝${gap*b}核对。`,{challenge:'逆向推理',suffix:'张'});});
add('mul-three-basic','a','三位数不进位分组求两组总数',({int})=>{const a=int(1,3)*100+int(1,3)*10+int(1,3),b=int(2,3);return Q(`甲有${b}盒贴纸，乙也有${b}盒，每盒都是${a}张。两人共多少张？`,a*b*2,'先求一人的张数，两人同样多，再合并。',`一人${a}×${b}＝${a*b}张，两人共${a*b*2}张。`,{suffix:'张'});});
add('mul-three-basic','b','由不进位乘积补出缺失数位再求另一积',({int,pick})=>{const h=int(1,3),t=int(1,3),u=int(1,3),a=h*100+t*10+u,b=int(2,3),more=pick([1,2,3].filter(n=>n!==b));return Q(`${h}□${u}×${b}＝${a*b}，各数位相乘都不进位。补好方框后，把原三位数再乘${more}，积是多少？`,a*more,'按十位上的乘法口诀补出方框，不需要做三位数除法，再逐位计算新乘积。',`十位上${t}×${b}＝${t*b}，所以方框填${t}；原数是${a}，再算${a}×${more}＝${a*more}。`,{challenge:'逆向推理'});});
add('mul-three-carry','a','进位乘法结合用去的数量',({int})=>{const a=int(136,389),b=int(5,9),used=int(8,60);return Q(`仓库有${b}箱零件，每箱${a}个。用去${used}个后还剩多少个？`,a*b-used,'先算全部零件，再减去用去的。',`${a}×${b}−${used}＝${a*b-used}个。`,{suffix:'个'});});
add('mul-three-carry','b','逆推使乘积越过整百的最小个位',({int})=>{const h=int(1,5),t=int(2,8),b=int(3,8),digit=int(1,8),base=h*100+t*10,target=(base+digit)*b;return Q(`${h}${t}□×${b}的积至少是${target}，方框里最小填几？`,digit,'从0到9按顺序试，找第一个达到要求的个位。',`填${digit}时积为${target}；填${digit-1}时只有${target-b}，达不到要求，所以最小填${digit}。`,{challenge:'条件筛选'});});
add('mul-zero','a','中间有0的乘法后合并另一批',({int})=>{const a=int(1,7)*100+int(1,9),b=int(6,9),extra=int(0,20);return Q(`每箱有${a}枚纽扣，运来${b}箱和另${extra}枚散装，一共多少枚？`,a*b+extra,'中间的0仍要占位，先乘后加。',`${a}×${b}＋${extra}＝${a*b+extra}枚。`,{suffix:'枚'});});
add('mul-zero','b','尾零因数的缺失数位与条件筛选',({int})=>{const tens=int(2,8),digit=int(2,8),b=int(3,9),a=tens*100+digit*10;return Q(`${tens}□0×${b}＝${a*b}，方框里填几？`,digit,'先看末尾的0，再逐个试十位上的数字。',`填${digit}得到${a}，${a}×${b}＝${a*b}，所以填${digit}。`,{challenge:'逆向推理'});});
add('multiply-estimate','a','用数量上界反推最多购入份数',({int})=>{const price=int(11,19),count=int(6,9),budget=price*count+int(0,price-1);return Q(`每本书${price}元，有${budget}元。最多买几本？`,count,'逐个增加本数，找到总价不超钱数的最大本数。',`${count}本要${price*count}元，${count+1}本要${price*(count+1)}元，超过${budget}元，所以最多${count}本。`,{challenge:'条件筛选',suffix:'本'});});
add('multiply-estimate','b','先估大再扣回得到准确总价',({int})=>{const base=int(2,8)*100,gap=int(1,19),b=int(2,9),a=base-gap;return Q(`每张票${a}元，买${b}张。先按每张${base}元估算后，需要从估算总价中扣回多少元？`,gap*b,'每张多估的价钱要重复扣回几份。',`每张多估${base}−${a}＝${gap}元，${b}张多估${gap}×${b}＝${gap*b}元。`,{suffix:'元'});});
add('multiply-story','a','先归一再求新数量的总价',({int})=>{const per=int(3,9),old=int(2,9),fresh=int(12,35);return Q(`${old}本同样的本子共${old*per}元。再买${fresh}本，需要多少元？`,per*fresh,'先从原来的数量与总价求一份，再求新数量。',`每本${old*per}÷${old}＝${per}元，${fresh}本共${fresh*per}元。`,{suffix:'元'});});
add('multiply-story','b','按总价限制筛选能买的箱数',({int})=>{const each=int(12,59),count=int(4,9),left=int(1,each-1),budget=each*count+left;return Q(`每箱饮料${each}元，带${budget}元。买尽可能多的整箱后，能买几箱？`,count,'比较相邻两种箱数的总价，必须既够钱又最多。',`${count}箱要${each*count}元，${count+1}箱要${each*(count+1)}元，后者超过${budget}元，所以买${count}箱。`,{challenge:'条件筛选',suffix:'箱'});});

add('digital-code','a','按固定宽度读取并递增最后一段',({int})=>{const g=int(3,6),c=int(1,9),seat=int(1,34),prefix=`${g}${String(c).padStart(2,'0')}`,answer=prefix+String(seat+1).padStart(2,'0');return choice(`虚构学号由1位年级、2位班级、2位座号组成。${prefix+String(seat).padStart(2,'0')}的下一位同班同学座号增加1，学号应是什么？`,answer,[answer,prefix+String(seat).padStart(2,'0'),`${g}${String(c+1).padStart(2,'0')}${String(seat+1).padStart(2,'0')}`],'只改变座号字段，位数不够时在前面补0。',`年级班级保持${prefix}，座号从${String(seat).padStart(2,'0')}变成${String(seat+1).padStart(2,'0')}，得到${answer}。`,{challenge:'逆向推理'});});
add('digital-code','b','按字段限制统计可用虚构编号',({int})=>{const start=int(1,12),cabinets=int(2,5),serials=int(2,9),blocked=int(0,cabinets-1);return Q(`图书虚构编号：2位柜号＋2位序号，不足补0。柜号从${String(start).padStart(2,'0')}到${String(start+cabinets-1).padStart(2,'0')}，但${String(start+blocked).padStart(2,'0')}柜停用。各柜序号01到${String(serials).padStart(2,'0')}，共能编几个不同号？`,(cabinets-1)*serials,'先筛掉停用柜，再数每个可用柜里的序号。',`有${cabinets-1}个可用柜，每柜${serials}个号，共${(cabinets-1)*serials}个不同编号。`,{challenge:'条件筛选',suffix:'个'});});
add('code-read','a','按位读取后比较座号变化',({int})=>{const g=int(3,6),c=int(1,9),seat=int(1,30),gap=int(3,9),prefix=`${g}${String(c).padStart(2,'0')}`;return Q(`虚构学号的三段依次是1位年级、2位班级、2位座号。${prefix+String(seat).padStart(2,'0')}和${prefix+String(seat+gap).padStart(2,'0')}是同班同学，两人的座号相差几？`,gap,'只比较最后两位，前面的年级班级相同。',`座号分别是${seat}和${seat+gap}，相差${gap}。`,{challenge:'多步应用'});});
add('code-read','b','读取原编码再按转班条件改写指定字段',({int})=>{const g=int(3,6),c=int(1,7),seat=int(2,35),answer=`${g}${String(c+2).padStart(2,'0')}${String(seat).padStart(2,'0')}`,old=`${g}${String(c).padStart(2,'0')}${String(seat).padStart(2,'0')}`;return choice(`虚构学号用1位年级＋2位班级＋2位座号。${old}转到班号增加2的班，年级和座号不变，新编号是什么？`,answer,[answer,`${g}${String(c).padStart(2,'0')}${String(seat+2).padStart(2,'0')}`,`${g+1}${String(c).padStart(2,'0')}${String(seat).padStart(2,'0')}`],'先分清三个字段，只改中间的班级字段。',`年级${g}不变，班号${c}变为${c+2}，座号${seat}不变，编为${answer}。`,{challenge:'条件筛选'});});

add('line-types','a','按三类线的端点特征统计总量',({int})=>{const segments=int(2,5),rays=int(1,6),lines=int(1,5);return Q(`纸上分别画了${segments}条线段、${rays}条射线和${lines}条直线，彼此没有共用端点。它们一共有几个端点？`,segments*2+rays,'线段有2个端点，射线有1个，直线没有端点。',`线段有${segments*2}个端点，射线有${rays}个，直线没有，共${segments*2+rays}个。`,{suffix:'个'});});
add('line-types','b','由总端点数逆推射线数量',({int})=>{const segments=int(2,5),rays=int(2,8),lines=int(1,4);return Q(`若干条线彼此不共用端点，共有${segments*2+rays}个端点。其中有${segments}条线段、${lines}条直线，其余都是射线。射线有几条？`,rays,'先扣除线段的端点，直线不占端点，余下每个端点对应一条射线。',`线段占${segments*2}个端点，剩${rays}个，所以有${rays}条射线。`,{challenge:'逆向推理',suffix:'条'});});
add('line-points','a','枚举点对并去掉已经连好的线段',({int})=>{const n=int(3,5),done=int(0,n-1),points='ABCDE'.slice(0,n).split(''),pairs=points.flatMap((p,i)=>points.slice(i+1).map(q=>p+q));return Q(`有${n}个不同的点，任意3点不在同一直线上。每两点间只连1条线段，已经连好${done}条，还需连多少条才能全部连好？`,pairs.length-done,'按第一个点到其余点、第二个点到后面各点的顺序列举，避免重复。',`全部点对是${pairs.join('、')}，共${pairs.length}条；还需${pairs.length-done}条。`,{challenge:'条件筛选',suffix:'条'});});
add('line-points','b','利用两点间直路最短比较绕路与直达',({int})=>{const a=int(12,30),b=int(13,35),direct=int(Math.max(a,b),a+b-1);return Q(`从A到C的直线段长${direct}米，经B绕行要先走${a}米再走${b}米。改走直线段能少走多少米？`,a+b-direct,'绕路要把两段都算上，再与直达线段比较。',`绕行${a+b}米，直达${direct}米，少走${a+b-direct}米。`,{suffix:'米'});});
add('angle-parts','a','固定一条边枚举同顶点的不同角',({int})=>{const n=int(3,4),rays=n===3?[0,int(1,4)*15,int(7,10)*15]:[0,int(1,3)*15,90,int(7,10)*15];return Q('图中每两条射线可以组成一个角。以OB为一条边，以O为顶点的不同角共有几个？',n-1,'保留OB，分别与其他每一条射线配对。',`除OB外还有${n-1}条射线，每条都与OB组成一个不同的角，共${n-1}个。`,{challenge:'空间想象',suffix:'个',diagram:fan(rays,int)});});
add('angle-parts','b','枚举射线对数出包含组合角的全部角',({int})=>{const n=int(3,4),rays=n===3?[0,int(1,4)*15,int(7,10)*15]:[0,int(1,3)*15,90,int(7,10)*15],names='ABCD'.slice(0,n).split(''),angles=names.flatMap((a,i)=>names.slice(i+1).map(b=>`∠${a}O${b}`));return Q('图中以O为顶点，每两条不同射线组成一个角。一共有多少个角？',angles.length,'不仅数相邻的小角，还要数由几个小角拼成的角。',`依次列出${angles.join('、')}，共有${angles.length}个。`,{challenge:'空间想象',suffix:'个',diagram:fan(rays,int)});});
add('angle-types','a','辨认两个锐角拼成的直角',({int})=>{const a=int(1,5)*15;return choice('图中OB在∠AOC内部。两个相邻的小锐角拼成了哪个直角？','∠AOC',['∠AOC','∠AOB','∠BOC'],'沿最外面的两条边观察，把OB两侧的小角合起来。','∠AOB与∠BOC合起来是∠AOC，它与直角纸片的角一样大。',{challenge:'空间想象',diagram:fan([0,a,90],int)});});
add('angle-types','b','包含组合角时筛选全部锐角',({int})=>{const a=int(2,4)*15,b=int(7,10)*15,rays=[0,a,90,b],acute=rays.flatMap((v,i)=>rays.slice(i+1).map(w=>w-v)).filter(v=>v<90).length;return Q('图中每两条射线组成一个角。小于直角的角一共有几个？',acute,'逐对比较张口与直角，不要只看三个相邻小角。',`∠AOB、∠BOC、∠COD是锐角；${b-a<90?'∠BOD也小于直角。':'∠BOD不小于直角。'}∠AOC是直角，∠AOD比直角大，共${acute}个锐角。`,{challenge:'条件筛选',suffix:'个',diagram:fan(rays,int)});});
add('angle-compare','a','剔除公共角后比较剩余张口',({int,pick})=>{const a=int(2,4)*15,middle=int(1,2)*15,c=pick([15,30,45,60].filter(n=>n!==a)),answer=a>c?'∠AOB':'∠COD';return choice('比较∠AOC和∠BOD时，去掉它们共有的∠BOC。剩下的两个角，哪一个张口更大？',answer,['∠AOB','∠COD'],'找出两个大角各自去掉公共部分后留下的角，再看张口。',`剩下的是∠AOB和∠COD；图中${answer}的张口更大。`,{challenge:'空间想象',diagram:fan([0,a,a+middle,a+middle+c],int)});});
add('angle-compare','b','由目标张口逆向补上缺少的组合角',({int})=>{const a=int(2,3)*15,b=int(2,3)*15,c=int(2,3)*15;return choice('保持OA不动，把∠AOB扩大到∠AOD那么大。需要在OB的另一侧接上图中哪一个角？','∠BOD',['∠BOD','∠BOC','∠COD'],'从原来的OB边一路看到目标OD边，中间的小角都要包含。','需要从OB扩展到OD，因此要补上由∠BOC和∠COD合成的∠BOD。',{challenge:'逆向推理',diagram:fan([0,a,a+b,a+b+c],int)});});

add('fraction-unit','a','将涂色部分再次等分后回到整体单位分数',({int})=>{const d=int(4,15),a=int(2,d-1),answer=fraction(1,d);return choice(`把图中涂色部分平均分给${a}人，每人得到的部分占整张纸的几分之几？`,answer,[answer,fraction(2,d),fraction(3,d)],'涂色有几个同样大的小格，每人能分到几格？',`涂色${a}格分给${a}人，每人1格；整张纸有${d}格，所以每人占${answer}。`,{diagram:{type:'fraction',parts:d,shaded:a}});});
add('fraction-unit','b','由单位分数的数量反推完整的一组',({int})=>{const d=int(3,9),unit=int(2,9),have=int(0,d*unit-1);return Q(`把一组小棒平均分成${d}份，每份是这组的1/${d}，有${unit}根。盒里已有${have}根，还要放多少根才凑齐完整一组？`,d*unit-have,'由一份求出整组的根数，再扣去已有的。',`整组有${d}×${unit}＝${d*unit}根，还需${d*unit-have}根。`,{challenge:'逆向推理',suffix:'根'});});
add('fraction-parts','a','连续取走后补出剩余整体',({int})=>{const d=int(4,20),a=int(1,d-2),b=int(1,d-a-1),n=d-a-b,answer=fraction(n,d);return choice(`一张纸第一次用去${a}/${d}，第二次又用去整张纸的${b}/${d}。剩下整张纸的几分之几？`,answer,[answer,fraction(n+1,d),fraction(n-1,d)],'把整张纸看成同样大的若干份，连续减去两次用掉的份数。',`整张有${d}份，剩${d}−${a}−${b}＝${n}份，所以是${answer}。`);});
add('fraction-parts','b','结合整体份数与涂色未涂色的差倒推新增份数',({int})=>{const d=int(4,20),target=int(Math.floor(d/2)+1,d-1),have=int(1,target-1),difference=target*2-d;return Q(`纸平均分成${d}份，已涂色${have}份。还要涂几份，才能使涂色份数比未涂色多${difference}份？`,target-have,'尝试把全部份数分为涂色和未涂色两部分，既要合成整体，又要满足两者的差。',`若涂${target}份，未涂${d-target}份，正好多${difference}份；已涂${have}份，还要涂${target-have}份。`,{challenge:'逆向推理',suffix:'份'});});
add('fraction-compare','a','同一整体连续取用后再比较',({int})=>{const d=int(4,20),a=int(1,d-2),b=int(2,d-1),extra=int(0,d-a),final=a+extra,answer=final>b?'甲':final<b?'乙':'一样多';return choice(`同样大的两张纸，甲先涂${a}/${d}又涂整张的${extra}/${d}，乙涂${b}/${d}。现在谁涂得多？`,answer,['甲','乙','一样多'],'整体相同、每份同大，先合并甲涂的份数。',`甲共涂${final}份，乙涂${b}份，所以${answer==='一样多'?'一样多':answer+'涂得多'}。`,{challenge:'多步应用'});});
add('fraction-compare','b','用双重大小条件筛选单位分数',({int})=>{const d=int(2,17),answer=fraction(1,d+1);return choice(`同样大的纸，下面哪个分数比1/${d}小，又比1/${d+2}大？`,answer,[fraction(1,d),answer,fraction(1,d+2),fraction(1,d+3)],'分子都是1，平均分的份数越多，每份越小。',`${d+1}份比${d}份多、比${d+2}份少，因此1/${d+1}介于两个分数之间。`,{challenge:'条件筛选'});});
add('fraction-addsub','a','同分母两步算式反推缺失分子',({int})=>{const d=int(4,20),a=int(2,d-2),b=int(1,a-1),n=int(2,d-a),result=n+a-b;return Q(`□/${d}＋${a}/${d}−${b}/${d}＝${result}/${d}。方框里的分子填几？`,n,'相同分母表示份的大小不变，倒着还原加减的份数。',`倒推份数：${result}＋${b}−${a}＝${n}，所以方框填${n}。`,{challenge:'逆向推理'});});
add('fraction-addsub','b','先合并一方再求分数差',({int})=>{const d=int(4,20),a=int(1,d-2),b=int(1,d-a-1),answer=fraction(b,d);return choice(`同样大的两块饼，甲吃${a}/${d}后又吃整块的${b}/${d}，乙只吃${a}/${d}。甲比乙多吃整块的几分之几？`,answer,[answer,fraction(b+1,d),fraction(0,d)],'先把甲两次吃的份数合并，再减去乙的份数。',`甲吃${a+b}份，乙吃${a}份，多${b}份，是${answer}。`);});
add('fraction-set','a','对离散整体连续求两部分后剩余数量',({int})=>{const d=int(4,9),unit=int(2,9),a=int(1,d-2),b=int(1,d-a-1);return Q(`把${d*unit}颗珠子看作一个整体。先取走总数的${a}/${d}，再取走总数的${b}/${d}，还剩多少颗？`,(d-a-b)*unit,'两次分数都以最初的总数为整体，先求每份几颗。',`每份${d*unit}÷${d}＝${unit}颗，剩${d-a-b}份，共${(d-a-b)*unit}颗。`,{suffix:'颗'});});
add('fraction-set','b','从已知几份的数量反推另一部分',({int,pick})=>{const d=int(4,9),unit=int(3,9),known=int(2,Math.min(3,d-1)),target=pick(Array.from({length:d-1},(_,i)=>i+1).filter(n=>n!==known));return Q(`一组贴纸的${known}/${d}有${known*unit}张。这组贴纸的${target}/${d}有多少张？`,target*unit,'先由已知几份求一份的张数，再求需要的份数。',`每份${known*unit}÷${known}＝${unit}张，${target}份共有${target*unit}张。`,{challenge:'逆向推理',suffix:'张'});});

add('review-calc','a','含零数字卡组数后比较',({int})=>{const a=int(1,4),b=int(5,9),large=b*100+a*10,small=a*100+b;return Q(`用0、${a}、${b}各一次组成三位数。最大的三位数比最小的三位数大多少？`,large-small,'百位不能放0，分别把较大和较小的非零数字放到百位。',`最大是${large}，最小是${small}，差${large-small}。`,{challenge:'条件筛选'});});
add('review-calc','b','从多步数量关系倒推初始数',({int})=>{const n=int(3,9),mult=int(2,9),extra=int(4,25);return Q(`一个数先乘${mult}，再加${extra}，得到${n*mult+extra}。这个数是几？`,n,'先去掉后来加的数，再用乘法口诀还原。',`先得到乘积${n*mult}，因为${n}×${mult}＝${n*mult}，所以原数是${n}。`,{challenge:'逆向推理'});});
add('review-life','a','星号拓展逐一筛选恰好满座的方案',({int})=>{const people=int(6,20)*2,solutions=[];for(let a=0;a*6<=people;a++){const left=people-a*6;if(left%4===0)solutions.push(`${a}辆6座和${left/4}辆4座`);}return Q(`★拓展：${people}人租6座车和4座车，每辆恰好坐满，允许只租一种。一共有多少种不同租法？`,solutions.length,'从0辆6座车起逐次增加，剩余人数必须能坐满4座车。',`方案有${solutions.join('；')}，共${solutions.length}种。`,{challenge:'条件筛选',suffix:'种'});});
add('review-life','b','按恰好数量枚举整包与单买的最低费用',({int})=>{const single=int(8,12),bundle=int(25,35),need=int(3,8),costs=[];for(let b=0;b*3<=need;b++)costs.push({b,cost:b*bundle+(need-b*3)*single});const min=Math.min(...costs.map(c=>c.cost));return Q(`钢笔单买每支${single}元，3支装每包${bundle}元。恰好买${need}支，可以混合买，最少花多少元？`,min,'逐一试不买整包、买1包等情况，算上还需单买的支数。',`买整包数与费用依次是${costs.map(c=>`${c.b}包：${c.cost}元`).join('；')}，最少${min}元。`,{challenge:'条件筛选',suffix:'元'});});
add('review-geometry','a','直达与分段路线结合单位比较',({int})=>{const a=int(12,25),b=int(13,25),direct=int(15,Math.min(29,a+b-1));return Q(`A到C的直线段长${direct*10}毫米。绕道B要走${a}厘米再走${b}厘米。走直线段少走多少厘米？`,a+b-direct,'先把直线段长度换成厘米，再与两段绕路的总长比较。',`直达${direct}厘米，绕道${a+b}厘米，少走${a+b-direct}厘米。`,{suffix:'厘米'});});
add('review-geometry','b','等分图结合厘米毫米求部分长度',({int})=>{const d=int(2,9),unit=int(2,9),shade=int(1,d-1);return Q(`图中整条纸带长${d*unit}厘米，各小格同样长。涂色部分长多少毫米？`,shade*unit*10,'先求一格的厘米数，再求涂色总长并换单位。',`每格长${d*unit}÷${d}＝${unit}厘米，涂色${shade}格，长${shade*unit}厘米，即${shade*unit*10}毫米。`,{diagram:{type:'fraction',parts:d,shaded:shade},suffix:'毫米'});});
add('review-quantities','a','混合单位限重和净增加量',({int})=>{const limit=int(3,8),kg=int(1,2),g=int(8,9)*100;return Q(`背包内物品最多重${limit}千克。已放入${kg}千克图书和${g}克水，还能放多少克物品？`,limit*1000-kg*1000-g,'把所有质量都换成克，再从总限额中扣去两类物品。',`${limit*1000}−${kg*1000}−${g}＝${limit*1000-kg*1000-g}克。`,{suffix:'克'});});
add('review-quantities','b','一叠厚度与分米目标的差',({int})=>{const thick=int(5,6),count=int(20,30),dm=int(2,8);return Q(`每本书厚${thick}毫米，${count}本叠起来。书堆比${dm}分米还矮多少毫米？`,dm*100-thick*count,'先算书堆厚度，再把分米换成毫米求差。',`书堆厚${thick*count}毫米，${dm}分米是${dm*100}毫米，相差${dm*100-thick*count}毫米。`,{suffix:'毫米'});});
add('combinations','a','星号拓展排除一组不允许的搭配',({int})=>{const tops=int(2,5),bottoms=int(2,5),badTop=int(1,tops),badBottom=int(1,bottoms);return Q(`★拓展：${tops}件不同上衣、${bottoms}条不同裤子，每次各选一件搭配。第${badTop}件上衣不能配第${badBottom}条裤子，一共有多少种允许的搭配？`,tops*bottoms-1,'按上衣逐件列出可配的裤子，被禁止的那件少一种。',`第${badTop}件可配${bottoms-1}条裤子，其余每件各可配${bottoms}条，共${tops*bottoms-1}种。`,{challenge:'条件筛选',suffix:'种'});});
add('combinations','b','星号拓展比赛配对并去除已完成场次',({int})=>{const n=int(3,6),done=int(0,n-1),teams='ABCDEF'.slice(0,n).split(''),pairs=teams.flatMap((a,i)=>teams.slice(i+1).map(b=>a+b));return Q(`★拓展：${n}支队伍，每两队只比赛一场，交换先后仍算同一场。已有${done}场结束，还要比赛多少场？`,pairs.length-done,'按队伍依次列出对手，排除已经反向列过的同一场。',`全部配对是${pairs.join('、')}，共${pairs.length}场，扣除已结束的${done}场，还需${pairs.length-done}场。`,{suffix:'场'});});

export const advancedVariants=Object.freeze(forms.map(({id,skill,focus})=>Object.freeze({id,skill,focus})));
const byId=new Map(forms.map(f=>[f.id,f]));
function randomValue(rng){const n=Number(rng());return Number.isNaN(n)?0:Math.max(0,Math.min(.999999,n));}
export function generateAdvancedVariant(id,rng=Math.random){
 const form=byId.get(id);if(!form)throw new Error('Unknown advanced variant '+id);
 const random=()=>randomValue(rng),int=(lo,hi)=>lo+Math.floor(random()*(hi-lo+1)),pick=items=>items[int(0,items.length-1)];
 return {skill:form.skill,advancedVariant:id,...form.create({int,pick,random})};
}
export function advancedForSkill(skill,rng=Math.random){
 const options=forms.filter(f=>f.skill===skill);if(!options.length)throw new Error('Unknown advanced skill '+skill);
 const selected=options[Math.floor(randomValue(rng)*options.length)];return generateAdvancedVariant(selected.id,rng);
}
