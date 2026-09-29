/* ===== DATA (edit here) ===== */
const EVENTS=[
 {d:"12",m:"Oct",t:"Autumn Book Swap",p:"Bring one, take one. Seminar Hall, 3:30 PM.",s:"up"},
 {d:"26",m:"Oct",t:"Open Mic Night",p:"Poems, stories and read-alouds. Auditorium, 4 PM.",s:"up"},
 {d:"09",m:"Nov",t:"Great Literary Quiz",p:"Teams of three. Registration opens on the group.",s:"up"},
 {d:"15",m:"Aug",t:"Freshers' Reading Meetup",p:"Welcome session and first book circle.",s:"past"},
 {d:"02",m:"Sep",t:"Author Talk: Writing Small Stories",p:"Guest session with a local writer.",s:"past"}];
const GAL=[["Book circle","#7a4e2d,#2e1c10"],["Open mic","#7a4e2d,#18011F"],["Book swap","#8a5a34,#241811"],["Author talk","#18011F,#7a4e2d"],["Reading challenge","#5b3a21,#a37046"],["Freshers' meetup","#7a4e2d,#BE4C00"]];
const GENRES=["Fiction","Poetry","Fantasy","Classics","Non-fiction","Mystery","Comics","Biography","Sci-fi","Essays"];


document.getElementById('floatLogo').onclick=()=>scrollTo({top:0,behavior:'smooth'});
const menu=document.getElementById('menu'),mb=document.getElementById('menuBtn');
mb.onclick=()=>{const o=menu.classList.toggle('open');mb.setAttribute('aria-expanded',o)};
menu.querySelectorAll('a').forEach(a=>a.onclick=()=>{menu.classList.remove('open');mb.setAttribute('aria-expanded',false)});

/* ===== MAGNET (interactive feature 1) ===== */
const mg=document.getElementById('magnet');
addEventListener('mousemove',e=>{
 const r=mg.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,pad=150;
 const near=Math.abs(cx-e.clientX)<r.width/2+pad&&Math.abs(cy-e.clientY)<r.height/2+pad;
 mg.classList.toggle('active',near);
 mg.style.transform=near?`translate3d(${(e.clientX-cx)/3}px,${(e.clientY-cy)/3}px,0)`:'translate3d(0,0,0)';
},{passive:true});

/* ===== MARQUEE + SCROLL EFFECTS ===== */
const r1=document.getElementById('r1'),r2=document.getElementById('r2');
[r1,r2].forEach((r,i)=>{const l=i?GENRES.slice().reverse():GENRES;r.innerHTML=[...l,...l,...l].map(g=>`<span>${g}</span>`).join('')});
const aboutTxt=document.getElementById('aboutTxt');
aboutTxt.innerHTML=aboutTxt.textContent.split(' ').map(w=>`<span>${w}</span>`).join(' ');
const words=aboutTxt.querySelectorAll('span'),cards=[...document.querySelectorAll('.acard')],marq=document.querySelector('.marq');
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
function onScroll(){
 const vh=innerHeight;
 if(!reduce){
  const off=(scrollY-(marq.offsetTop)+vh)*.3;
  r1.style.transform=`translateX(${off-600}px)`;r2.style.transform=`translateX(${-(off-200)-600}px)`;
 }
 const b=aboutTxt.getBoundingClientRect(),p=Math.min(1,Math.max(0,(vh*.8-b.top)/(b.height+vh*.6)));
 words.forEach((w,i)=>w.style.opacity=reduce?1:(p*words.length>i?1:.2));
 cards.forEach((c,i)=>{const nextTop=c.parentElement.nextElementSibling?.getBoundingClientRect().top??1e9;
  const k=Math.min(1,Math.max(0,1-(nextTop-90)/(vh*.7)));c.style.transform=`scale(${1-k*.05*(cards.length-1-i+1)/1})`});
}
addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);onScroll();

/* ===== EVENTS FILTER (interactive feature 2) ===== */
const list=document.getElementById('eventList');
function renderEvents(f){
 const items=EVENTS.filter(e=>f==='all'||e.s===f);
 list.innerHTML=items.length?items.map(e=>`<article class="ev"><div class="d grad">${e.d}<small>${e.m}</small></div><div><h3>${e.t}</h3><p>${e.p}</p></div><span class="badge ${e.s}">${e.s==='up'?'Upcoming':'Past'}</span></article>`).join(''):'<p>No events here yet.</p>';
}
document.querySelectorAll('.filters button').forEach(b=>b.onclick=()=>{
 document.querySelectorAll('.filters button').forEach(x=>x.classList.toggle('on',x===b));renderEvents(b.dataset.f)});
renderEvents('all');

/* ===== GALLERY + LIGHTBOX ===== */
const grid=document.getElementById('grid'),lb=document.getElementById('lb'),lbBox=document.getElementById('lbBox');
grid.innerHTML=GAL.map((g,i)=>`<button data-i="${i}" style="background:linear-gradient(135deg,${g[1]})">${g[0]}</button>`).join('');
grid.onclick=e=>{const b=e.target.closest('button');if(!b)return;const g=GAL[b.dataset.i];
 lbBox.style.background=`linear-gradient(135deg,${g[1]})`;document.getElementById('lbCap').textContent=g[0];lb.classList.add('open');document.getElementById('lbClose').focus()};
const closeLb=()=>lb.classList.remove('open');
document.getElementById('lbClose').onclick=closeLb;lb.onclick=e=>{if(e.target===lb)closeLb()};
addEventListener('keydown',e=>{if(e.key==='Escape')closeLb()});

/* ===== FORM VALIDATION ===== */
const form=document.getElementById('regForm');
const RULES={
 name:v=>/^[A-Za-z][A-Za-z .'-]{2,}$/.test(v.trim())||'Enter your full name (letters only, at least 3 characters).',
 email:v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)||'Enter a valid email address.',
 phone:v=>/^[6-9]\d{9}$/.test(v)||'Enter a 10-digit mobile number starting with 6-9.',
 admno:v=>v.trim().length>=4||'Enter your admission number.',
 branch:v=>!!v||'Choose your branch.',
 year:v=>!!v||'Choose your year.',
 why:v=>v.trim().length>=20||'Tell us a little more (at least 20 characters).'};
function check(el){const r=RULES[el.name](el.value),f=el.closest('.f');
 f.classList.toggle('bad',r!==true);f.querySelector('.msg').textContent=r===true?'':r;return r===true}
Object.keys(RULES).forEach(n=>{const el=form.elements[n];el.addEventListener('blur',()=>check(el));el.addEventListener('input',()=>{if(el.closest('.f').classList.contains('bad'))check(el)})});
form.addEventListener('submit',e=>{
 e.preventDefault();
 const bad=Object.keys(RULES).map(n=>form.elements[n]).filter(el=>!check(el));
 if(bad.length){bad[0].focus();return}
 const data=Object.fromEntries(new FormData(form));
 try{const all=JSON.parse(localStorage.getItem('prologue_apps')||'[]');all.push(data);localStorage.setItem('prologue_apps',JSON.stringify(all))}catch(_){}
 /* To send to a backend: fetch('/api/register',{method:'POST',body:JSON.stringify(data)}) */
 form.style.display='none';const ok=document.getElementById('ok');
 document.getElementById('okTxt').textContent=`Thanks, ${data.name.split(' ')[0]}. We'll email ${data.email} with your next steps.`;
 ok.style.display='block';ok.focus();
});
