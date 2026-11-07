const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function validDiagram(d){
 if(!d||typeof d!=='object')return false;
 if(d.type==='fraction')return Number.isInteger(d.parts)&&d.parts>=2&&d.parts<=20&&Number.isInteger(d.shaded)&&d.shaded>=0&&d.shaded<=d.parts;
 if(d.type==='cuboid-net')return Array.isArray(d.dimensions)&&d.dimensions.length===3&&d.dimensions.every(v=>Number.isInteger(v)&&v>=1&&v<=20)&&Array.isArray(d.labels)&&d.labels.length===6&&d.labels.every(l=>typeof l==='string'&&l.length>=1&&l.length<=8)&&new Set(d.labels).size===6;
 if(d.type==='cube-missing'){
  const cell=c=>Array.isArray(c)&&c.length===2&&c.every(v=>Number.isInteger(v)&&v>=0&&v<=7);
  return Array.isArray(d.cells)&&d.cells.length===5&&d.cells.every(cell)&&Array.isArray(d.candidates)&&d.candidates.length===3&&d.candidates.every(c=>c&&cell(c.cell)&&typeof c.label==='string'&&c.label.length>=1&&c.label.length<=8)&&new Set([...d.cells,...d.candidates.map(c=>c.cell)].map(c=>c.join(','))).size===8&&new Set(d.candidates.map(c=>c.label)).size===3&&(d.labels===undefined||Array.isArray(d.labels)&&d.labels.length===5&&d.labels.every(s=>typeof s==='string'&&s.length>=1&&s.length<=8)&&new Set(d.labels).size===5);
 }
 if(d.type==='cube-net')return Array.isArray(d.cells)&&d.cells.length===6&&d.cells.every(c=>Array.isArray(c)&&c.length===2&&c.every(v=>Number.isInteger(v)&&v>=0&&v<=7))&&new Set(d.cells.map(c=>c.join(','))).size===6&&(d.labels===undefined||Array.isArray(d.labels)&&d.labels.length===6&&d.labels.every(s=>typeof s==='string'&&s.length>=1&&s.length<=8)&&new Set(d.labels).size===6);
 if(d.type==='ruler')return [d.start,d.end,d.max].every(Number.isInteger)&&d.max>=10&&d.max<=100&&d.start>=0&&d.end>d.start&&d.end<=d.max;
 if(d.type==='scale')return [d.value,d.max,d.step].every(Number.isFinite)&&d.step>0&&d.max>0&&d.max<=100&&d.max/d.step<=20&&Number.isInteger(d.max/d.step)&&d.value>=0&&d.value<=d.max&&Number.isInteger(d.value/d.step)&&['g','kg'].includes(d.unit);
 if(d.type==='points')return [1,2].includes(d.count)&&Number.isInteger(d.spread)&&d.spread>=30&&d.spread<=90&&Number.isInteger(d.tilt)&&Math.abs(d.tilt)<=25;
 if(d.type==='line')return ['segment','ray','line'].includes(d.kind)&&(d.rotation===undefined||Number.isInteger(d.rotation)&&d.rotation>=0&&d.rotation<360);
 if(d.type==='object-view')return ['box','cylinder','sphere'].includes(d.object)&&['front','back','left','right','top'].includes(d.direction)&&(d.mode===undefined||['scene','solid'].includes(d.mode))&&(d.side===undefined||['left','right'].includes(d.side))&&(d.variant===undefined||Number.isInteger(d.variant)&&d.variant>=0&&d.variant<=8)&&(d.symbols===undefined||Array.isArray(d.symbols)&&d.symbols.length===3&&d.symbols.every(s=>typeof s==='string'&&s.length<=12));
 if(d.type==='clock')return Number.isInteger(d.hour)&&d.hour>=1&&d.hour<=12&&Number.isInteger(d.minute)&&d.minute>=0&&d.minute<60;
 if(d.type==='sets')return [d.a,d.b,d.both].every(v=>Number.isInteger(v)&&v>=0&&v<=100)&&d.both<=Math.min(d.a,d.b);
 if(d.type==='tiles')return Array.isArray(d.cells)&&d.cells.length>=1&&d.cells.length<=36&&d.cells.every(c=>Array.isArray(c)&&c.length===2&&c.every(v=>Number.isInteger(v)&&v>=0&&v<=7))&&new Set(d.cells.map(c=>c.join(','))).size===d.cells.length&&(d.removed===undefined||Number.isInteger(d.removed)&&d.removed>=0&&d.removed<d.cells.length)&&(d.side===undefined||d.side===null||Number.isFinite(d.side)&&d.side>0&&d.side<=10);
 if(d.type==='angle')return Number.isFinite(d.degrees)&&d.degrees>=10&&d.degrees<=170&&(d.other===undefined||Number.isFinite(d.other)&&d.other>=10&&d.other<=170)&&Number.isFinite(d.rotation)&&d.rotation>=0&&d.rotation<360;
 // Coarse sixths of a right angle are both readable without a protractor and
 // describable using the fractions taught in this book.
 if(d.type==='ray-fan')return Array.isArray(d.rays)&&d.rays.length>=3&&d.rays.length<=4&&d.rays.every((v,i)=>Number.isInteger(v)&&v>=0&&v<170&&v%15===0&&(i===0||v>d.rays[i-1]))&&d.rays.at(-1)-d.rays[0]<170&&Number.isInteger(d.rotation)&&d.rotation>=0&&d.rotation<360;
 if(d.type==='polygon')return [3,4].includes(d.sides)&&Number.isInteger(d.variant)&&d.variant>=0&&d.variant<=80&&(d.split===undefined||typeof d.split==='boolean');
 if(d.type==='rectangle')return [d.a,d.b].every(v=>Number.isFinite(v)&&v>0&&v<=100);
 if(d.type==='route')return [d.a,d.b].every(v=>Number.isFinite(v)&&v>0&&v<=1000);
 return d.type==='compass';
}
const text=(x,y,s,attrs='')=>`<text x="${x}" y="${y}" text-anchor="middle" ${attrs}>${esc(s)}</text>`;
function angle(cx,cy,degrees,rotation,len,label){const r=rotation*Math.PI/180,a=(rotation-degrees)*Math.PI/180;const point=(v,l)=>`${(cx+Math.cos(v)*l).toFixed(2)} ${(cy+Math.sin(v)*l).toFixed(2)}`;return `<path d="M${point(r,len)}L${cx} ${cy}L${point(a,len)}" fill="none" stroke="#684785" stroke-width="4" stroke-linecap="round"/><path d="M${point(r,19)}A19 19 0 0 0 ${point(a,19)}" fill="none" stroke="#dd7fa9" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="3" fill="#684785"/>${text(cx,147,label)}`;}
export function diagramMarkup(q){const d=q.diagram;if(!d||!validDiagram(d))return '';let contents='',label='数学示意图',height=155;
 if(d.type==='cuboid-net'){
  const [a,b,c]=d.dimensions,rects=[[b,b,a,c],[0,b,b,c],[b+a,b,b,c],[a+2*b,b,a,c],[b,0,a,b],[b,b+c,a,b]],scale=Math.min(230/(2*a+2*b),126/(c+2*b)),offset=(260-(2*a+2*b)*scale)/2;
  contents=rects.map(([x,y,w,h],i)=>`<rect x="${offset+x*scale}" y="${8+y*scale}" width="${w*scale}" height="${h*scale}" fill="${['#e8d9ef','#cce9e3','#ffe5be'][i%3]}" stroke="#695583" stroke-width="1.5"/>${text(offset+(x+w/2)*scale,12+(y+h/2)*scale,d.labels[i],'font-size="12"')}`).join('')+text(130,149,'沿共用边折起，字母在盒子外侧','font-size="11"');
  label='长方体展开图，中间一排从左到右的面为'+[1,0,2,3].map(i=>d.labels[i]).join('、')+'；'+d.labels[4]+'连在'+d.labels[0]+'的上边，'+d.labels[5]+'连在'+d.labels[0]+'的下边';
 }else if(d.type==='cube-missing'){
  const all=[...d.cells,...d.candidates.map(c=>c.cell)],cols=1+Math.max(...all.map(c=>c[0])),rows=1+Math.max(...all.map(c=>c[1])),size=Math.min(29,118/rows,220/cols),left=(260-cols*size)/2;
  contents=d.cells.map(([x,y],i)=>`<rect x="${left+x*size}" y="${8+y*size}" width="${size}" height="${size}" fill="#d8eee5" stroke="#62567b" stroke-width="1.8"/>${d.labels?text(left+(x+.5)*size,12+(y+.5)*size,d.labels[i],'font-size="12"'):''}`).join('');
  contents+=d.candidates.map(({cell:[x,y],label})=>`<rect x="${left+x*size}" y="${8+y*size}" width="${size}" height="${size}" fill="#fff6e5" stroke="#9b6b89" stroke-width="1.5" stroke-dasharray="4 3"/>${text(left+(x+.5)*size,12+(y+.5)*size,label,'font-size="12"')}`).join('')+text(130,149,'只从虚线位置中添上一个方格','font-size="11"');
  label='正方体补面图。实线方格坐标：'+d.cells.map((c,i)=>(d.labels?d.labels[i]+'号在':'')+c.join(',')).join('；')+'。虚线候选：'+d.candidates.map(c=>c.label+'在'+c.cell.join(',')).join('；')+'。坐标向右、向下增加，每相邻坐标间距是一个方格边长。';
 }else if(d.type==='cube-net'){
  const cols=1+Math.max(...d.cells.map(c=>c[0])),rows=1+Math.max(...d.cells.map(c=>c[1])),size=Math.min(30,120/rows),left=(260-cols*size)/2;
  contents=d.cells.map(([x,y],i)=>`<rect x="${left+x*size}" y="${8+y*size}" width="${size}" height="${size}" fill="#d8eee5" stroke="#62567b" stroke-width="2"/>${d.labels?text(left+(x+.5)*size,12+(y+.5)*size,d.labels[i],'font-size="12"'):''}`).join('');label='六个共用边相连的正方形，尝试沿共用边折起'+(d.labels?'。各方格编号和坐标：'+d.labels.map((s,i)=>s+'在'+d.cells[i].join(',')).join('；'):'');
 }else if(d.type==='ruler'){
  const unit=220/d.max;
  contents=`<rect x="20" y="60" width="220" height="50" rx="3" fill="#fff4cf" stroke="#856941"/><path d="M${20+d.start*unit} 43H${20+d.end*unit}" stroke="#b65b9b" stroke-width="12"/>`;
  contents+=Array.from({length:d.max+1},(_,i)=>`<path d="M${20+i*unit} 61v${i%10===0?23:i%5===0?16:8}" stroke="#665739"/>${i%10===0?text(20+i*unit,103,i):''}`).join('')+text(130,141,'刻度单位：毫米');label=`毫米直尺，最大刻度${d.max}。彩条左端对齐${d.start}毫米刻度，右端对齐${d.end}毫米刻度。`;
 }else if(d.type==='scale'){
  const point=(v,r)=>{const a=(135+v/d.max*270)*Math.PI/180;return[130+Math.cos(a)*r,75+Math.sin(a)*r];};
  contents='<circle cx="130" cy="75" r="63" fill="#fff6de" stroke="#6e5878" stroke-width="3"/>';
  for(let i=0;i<=d.max/d.step;i++){const value=i*d.step,p=point(value,49),p2=point(value,56),t=point(value,40);contents+=`<path d="M${p.join(' ')}L${p2.join(' ')}" stroke="#6e5878"/>`+text(t[0],t[1]+4,value,'font-size="10"');}
  const p=point(d.value,48);contents+=`<path d="M130 75L${p.join(' ')}" stroke="#bc598e" stroke-width="3"/><circle cx="130" cy="75" r="4" fill="#6e5878"/>`+text(130,97,d.unit)+text(130,151,'指针秤');label=`指针秤，每大格${d.step}${d.unit}，量程${d.max}${d.unit}；指针从0刻度起沿数值递增方向指向第${d.value/d.step}大格。`;
 }else if(d.type==='points'){
  const positions=d.count===1?[[d.spread+50,75+d.tilt]]:[[130-d.spread,75-d.tilt],[130+d.spread,75+d.tilt]];
  contents=positions.map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="4" fill="#76538d"/>${text(x,y-12,d.count===1?'一个点':i===0?'第一个点':'第二个点')}`).join('');label=d.count===1?'一个位置确定的点':'两个位置不同的点';
 }else if(d.type==='line'){
  const left=d.kind==='line',right=d.kind!=='segment';
  const line=`<path d="M35 75H225" stroke="#675082" stroke-width="3"/>${left?'<path d="m47 67-12 8 12 8" fill="none" stroke="#675082" stroke-width="3"/>':'<circle cx="35" cy="75" r="4" fill="#675082"/>'}${right?'<path d="m213 67 12 8-12 8" fill="none" stroke="#675082" stroke-width="3"/>':'<circle cx="225" cy="75" r="4" fill="#675082"/>'}`;
  // Only a small tilt keeps both ends in the viewBox, while retaining the archived API.
  contents=`<g transform="rotate(${(d.rotation||0)%35-17} 130 75)">${line}</g>`+text(130,145,'箭头表示可以无限延伸');label='观察端点与箭头的线的示意图';
 }else if(d.type==='object-view'){
  if(d.object==='sphere')contents='<circle cx="130" cy="73" r="49" fill="#c1dfed" stroke="#5a6e91" stroke-width="3"/><path d="M88 49Q135 17 168 59" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/>';
  else if(d.object==='cylinder')contents='<path d="M86 43V105C86 128 174 128 174 105V43" fill="#d3c5ef" stroke="#705a91" stroke-width="3"/><ellipse cx="130" cy="43" rx="44" ry="17" fill="#eee5ff" stroke="#705a91" stroke-width="3"/>';
  else {contents='<path d="M62 55L119 25L199 47L145 80Z" fill="#fff1bb" stroke="#695583" stroke-width="2"/><path d="M62 55L145 80V128L62 102Z" fill="#e1d4f1" stroke="#695583" stroke-width="2"/><path d="M145 80L199 47V96L145 128Z" fill="#bce6d8" stroke="#695583" stroke-width="2"/>';
   if(d.side==='left')contents=`<g transform="translate(260 0) scale(-1 1)">${contents}</g>`;
   if(d.mode==='scene'){const sy=d.symbols||['星星','月亮','花朵'];contents+=text(130,53,sy[2])+text(d.side==='left'?156:104,96,sy[0])+text(d.side==='left'?86:174,91,sy[1]);}
  }
  if(d.variant!==undefined)contents=`<g transform="translate(130 75) scale(${.78+d.variant*.025} ${.82+d.variant*.02}) translate(-130 -75)">${contents}</g>`;
  if(d.mode==='scene')contents+=text(d.side==='left'?215:45,130,'前面')+text(d.side==='left'?42:218,110,d.side==='left'?'左面':'右面')+text(130,17,'上面');
  else contents+=text(130,149,d.direction==='top'?'从正上方观察':d.direction==='front'?'观察立体物体':'按题目方向观察');
  if(d.mode==='scene'&&d.object==='box'){const sy=d.symbols||['星星','月亮','花朵'];label=`盒子原始位置：前面画${sy[0]}，${d.side==='left'?'左':'右'}面画${sy[1]}，上面画${sy[2]}。`;}
  else label=`原创立体物体示意图：${{box:'长方体',cylinder:'竖直圆柱',sphere:'球'}[d.object]}，观察方向按题干确定。`;
 }else if(d.type==='fraction'){
  const width=224/d.parts;contents=Array.from({length:d.parts},(_,i)=>`<rect x="${18+i*width}" y="36" width="${width}" height="65" fill="${i<d.shaded?'#f29bc4':'#fff8fc'}" stroke="#65416e" stroke-width="2"/>`).join('')+text(130,135,'观察相同大小的格子和涂色部分');label='长方形被分成同样大的格子。从左到右的格子颜色：'+Array.from({length:d.parts},(_,i)=>i<d.shaded?'粉色':'未涂色').join('、')+'。';
 }else if(d.type==='clock'){
  const point=(deg,len)=>{const r=(deg-90)*Math.PI/180;return [130+Math.cos(r)*len,73+Math.sin(r)*len];},minute=point(d.minute*6,43),hour=point((d.hour%12)*30+d.minute/2,28);
  contents='<circle cx="130" cy="73" r="57" fill="#fff9e6" stroke="#65416e" stroke-width="3"/>'+Array.from({length:12},(_,i)=>{const [x,y]=point((i+1)*30,47);return text(x,y+5,i+1);}).join('')+`<path d="M130 73L${hour.join(' ')}M130 73L${minute.join(' ')}" stroke="#65416e" stroke-width="4" stroke-linecap="round"/><circle cx="130" cy="73" r="4" fill="#ed82b4"/>`+text(130,148,`${d.hour}时${d.minute}分`);label=`钟面显示${d.hour}时${d.minute}分`;
 }else if(d.type==='sets'){
  contents='<ellipse cx="97" cy="78" rx="70" ry="48" fill="#b3e7ea" fill-opacity=".7" stroke="#5671a0" stroke-width="2"/><ellipse cx="163" cy="78" rx="70" ry="48" fill="#f4b2d3" fill-opacity=".65" stroke="#a35c89" stroke-width="2"/>'+text(65,21,'第一组 '+d.a+'人')+text(195,21,'第二组 '+d.b+'人')+text(62,83,d.a-d.both)+text(130,83,d.both)+text(198,83,d.b-d.both)+text(130,148,'中间是两项都参加的人');label=`两组重叠图：第一组独有${d.a-d.both}人，同时参加${d.both}人，第二组独有${d.b-d.both}人`;
 }else if(d.type==='tiles'){
  const cols=1+Math.max(...d.cells.map(c=>c[0])),rows=1+Math.max(...d.cells.map(c=>c[1]));const cell=Math.min(28,116/rows,226/cols),left=(260-cols*cell)/2,top=7;
  contents=d.cells.map(([x,y],i)=>`<rect x="${left+x*cell}" y="${top+y*cell}" width="${cell}" height="${cell}" fill="${i>=d.cells.length-(d.removed||0)?'#f7aacb':'#a4e6d2'}" stroke="#62567b" stroke-width="1.6" ${i>=d.cells.length-(d.removed||0)?'stroke-dasharray="3 2"':''}/>`).join('');
  contents+=text(130,145,d.removed?'粉色格是要剪去的部分':d.side?`每条小格边长${d.side}厘米`:'每个方格代表一个小正方形');label='由同样大小的小正方形拼成的格图';
 }else if(d.type==='ray-fan'){
  const point=(a,r)=>[130+Math.cos((d.rotation-a)*Math.PI/180)*r,75+Math.sin((d.rotation-a)*Math.PI/180)*r];
  const vertexLabel=point((d.rays[0]+d.rays.at(-1))/2+180,19);
  contents=d.rays.map((a,i)=>{const end=point(a,49),t=point(a,64),wing1=point(a-5,41),wing2=point(a+5,41);return `<path d="M130 75L${end.join(' ')}M${wing1.join(' ')}L${end.join(' ')}L${wing2.join(' ')}" fill="none" stroke="#684785" stroke-width="2.5" stroke-linejoin="round"/>`+text(t[0],t[1]+5,'ABCD'[i],'font-size="17"');}).join('')+'<circle cx="130" cy="75" r="3" fill="#684785"/>'+text(vertexLabel[0],vertexLabel[1]+5,'O','font-size="17"');
  // A small square, rather than a printed degree, marks actual right angles.
  for(let i=0;i<d.rays.length;i++)for(let j=i+1;j<d.rays.length;j++)if(d.rays[j]-d.rays[i]===90){const a=point(d.rays[i],10),b=point(d.rays[j],10),corner=[a[0]+b[0]-130,a[1]+b[1]-75];contents+=`<path d="M${a.join(' ')}L${corner.join(' ')}L${b.join(' ')}" fill="none" stroke="#bc6d95" stroke-width="1.5"/>`;}
  label='以O为共同端点的'+d.rays.length+'条不同射线，按同一扇形内的顺序依次为'+d.rays.map((_,i)=>'O'+'ABCD'[i]).join('、')+'。把直角平均分成6份，每份作为1小份；相邻射线的原始张口依次为：'+d.rays.slice(1).map((v,i)=>`∠${'ABCD'[i]}O${'ABCD'[i+1]}占${(v-d.rays[i])/15}小份`).join('，')+'。图中小方框表示直角。';
 }else if(d.type==='angle'){contents=d.other!==undefined?angle(68,75,d.degrees,d.rotation,54,'甲')+angle(192,75,d.other,d.rotation,40,'乙'):angle(130,75,d.degrees,d.rotation,57,'比较张开的大小');label=d.other!==undefined?'甲乙两个角的比较图':'一个角的示意图';}
 else if(d.type==='polygon'){const dx=d.variant%9*3,dy=Math.floor(d.variant/9)*2;const points=d.sides===3?`32,112 ${100+dx},${20+dy} 220,110`:`25,115 ${40+dx},${25+dy} ${195-dy},30 227,112`;contents=`<polygon points="${points}" fill="#e7d8f6" stroke="#62517d" stroke-width="3"/>${d.split?`<path d="M25 115L${195-dy} 30" stroke="#b896cc" stroke-width="2" stroke-dasharray="5 4"/>`:''}`;label='用于数边的封闭图形';}
 else if(d.type==='rectangle'){contents=`<rect x="48" y="37" width="166" height="78" rx="1" fill="#e3f4ef" stroke="#62517d" stroke-width="3"/>${text(130,27,d.a+'厘米')}${text(23,82,d.b+'厘米')}${text(130,145,'示意图，不按比例绘制')}`;label='标有上边和左边长度的长方形';}
 else if(d.type==='route'){contents=`<path d="M42 112H204V36" fill="none" stroke="#8c69bf" stroke-width="5" stroke-linecap="round"/><path d="m194 46 10-10 10 10" fill="none" stroke="#8c69bf" stroke-width="4"/><circle cx="42" cy="112" r="5" fill="#e77faa"/>${text(42,138,'起点')}${text(204,23,'终点')}${text(122,103,d.a+'米')}${text(232,80,d.b+'米')}${text(35,30,'北 ↑')}`;label='先向东再向北的两段路线图';}
 else{contents=`<path d="M130 23V127M78 75H182" stroke="#a494bf" stroke-width="2"/><path d="m122 38 8-15 8 15" fill="none" stroke="#725087" stroke-width="3"/>${text(130,16,'北')}${text(130,148,'南')}${text(202,81,'东')}${text(58,81,'西')}<circle cx="130" cy="75" r="5" fill="#e48caf"/>`;label='上北下南左西右东的方向标';}
 return `<svg class="question-diagram grade3-diagram" data-type="${d.type}" viewBox="0 0 260 ${height}" role="img" aria-label="${esc(label)}">${contents}</svg>`;
}

// Fold each square using an orthonormal face frame (right, down, outward normal).
// A valid connected hexomino occupies the six distinct cube normals without conflicts.
export function isCubeNet(cells){
 if(!Array.isArray(cells)||cells.length!==6||!cells.every(c=>Array.isArray(c)&&c.length===2&&c.every(v=>Number.isInteger(v)&&Math.abs(v)<=100)))return false;
 const keys=new Set(cells.map(c=>c.join(',')));if(keys.size!==6)return false;
 const neg=v=>v.map(x=>-x),frames=new Map([[cells[0].join(','),[[1,0,0],[0,1,0],[0,0,1]]]]),queue=[cells[0]];
 for(let i=0;i<queue.length;i++){
  const [x,y]=queue[i],[u,v,n]=frames.get([x,y].join(','));
  const neighbours=[[x+1,y,[neg(n),v,u]],[x-1,y,[n,v,neg(u)]],[x,y+1,[u,neg(n),v]],[x,y-1,[u,n,neg(v)]]];
  for(const [nx,ny,frame] of neighbours){const key=[nx,ny].join(',');if(!keys.has(key))continue;const known=frames.get(key);if(known){if(JSON.stringify(known)!==JSON.stringify(frame))return false;}else{frames.set(key,frame);queue.push([nx,ny]);}}
 }
 return frames.size===6&&new Set([...frames.values()].map(f=>f[2].join(','))).size===6;
}
