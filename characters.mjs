// Transparent illustrated performers retain the existing stage animation hooks.
export const CAST=Object.freeze([
 {type:'melody',name:'美乐蒂 My Melody',label:'戴着紫色耳机、粉色兔帽的美乐蒂 My Melody'},
 {type:'kuromi',name:'库洛米 Kuromi',label:'戴着黑色尖耳帽、粉色骷髅的库洛米 Kuromi'},
 {type:'cinnamoroll',name:'玉桂狗 Cinnamoroll',label:'长长白耳朵、蓝眼睛的玉桂狗 Cinnamoroll'},
 {type:'keroppi',name:'大眼蛙 Keroppi',label:'穿红白条纹上衣的绿色大眼蛙 Keroppi'},
 {type:'kitty',name:'Hello Kitty',label:'戴红色蝴蝶结、穿背带装的 Hello Kitty 凯蒂猫'}
]);
const artBox={"melody":[29.14,8.28,247.85,247.85],"kuromi":[22.42,3.39,255.36,255.36],"cinnamoroll":[2.07,20.63,295.87,289.57],"keroppi":[17.41,-6.83,268.39,268.39],"kitty":[20.26,-1.95,262.41,262.41]};
export function character(type='melody',extra=''){
 const entry=CAST.find(c=>c.type===type)||CAST[0];
 const classes=String(extra).replace(/[^a-zA-Z0-9_ -]/g,'');
 const [x,y,width,height]=artBox[entry.type]||[0,-5,300,280];
 return `<div class="mascot character character-${entry.type} ${classes}" role="img" aria-label="${entry.label}"><svg viewBox="0 0 300 280" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><ellipse class="cat-shadow" cx="150" cy="254" rx="66" ry="7" fill="#8b6c95" opacity=".16"/><g class="cat-body character-illustration"><image href="./characters/${entry.type}-v2.png" x="${x}" y="${y}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet"/></g></svg></div>`;
}
