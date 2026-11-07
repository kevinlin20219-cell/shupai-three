const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function optionMarkup(value){const m=/^(\d+)\/(\d+)$/.exec(String(value));return m?`<span class="fraction"><span>${m[1]}</span><span>${m[2]}</span></span>`:esc(value);}
export function safeMath(html){return esc(html).replace(/&lt;span class=&quot;fraction&quot;&gt;/g,'<span class="fraction">').replace(/&lt;span&gt;/g,'<span>').replace(/&lt;\/span&gt;/g,'</span>').replace(/&lt;i&gt;/g,'<i>').replace(/&lt;\/i&gt;/g,'</i>');}
export function mathMarkup(q){return safeMath(q.math)+(['given','equation'].includes(q.mathKind)?'':' <i>=</i> <span class="math-question">?</span>');}
export function keyIntent(e,locked){if(e.key==='Escape')return 'pause';if(['BUTTON','A','SELECT','TEXTAREA'].includes(e.tagName))return 'native';if(e.code==='Space')return e.tagName==='INPUT'?'native':'pause';if(e.key==='Enter')return locked?'next':'submit';return 'native';}
