/* ===== CONFIG — edit these two lines ===== */
const CONFIG={
  WEB3FORMS_KEY:'YOUR_WEB3FORMS_ACCESS_KEY', // free key from https://web3forms.com (safe to keep in frontend)
  CHAT_API:'/api/chat'                       // serverless function in /api/chat.js (keeps your AI key secret)
};

document.addEventListener('DOMContentLoaded',()=>{
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
/* garment illustrations: dress form + garment by type */
const form=(id)=>`<defs><linearGradient id="st${id}" x1="0" x2="1"><stop offset="0" stop-color="#3a2230"/><stop offset=".5" stop-color="#6d4f60"/><stop offset="1" stop-color="#3a2230"/></linearGradient></defs>
<path d="M200 0v30" stroke="#22101c" stroke-width="3"/><ellipse cx="200" cy="34" rx="16" ry="6" fill="#22101c"/>
<path d="M200 560v58M150 626h100" stroke="url(#st${id})" stroke-width="7" stroke-linecap="round"/>`;
const fab=(id,a,b)=>`<defs><linearGradient id="f${id}" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset=".55" stop-color="${b}"/><stop offset="1" stop-color="${a}"/></linearGradient>
<linearGradient id="sh${id}" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".28"/><stop offset=".45" stop-color="#fff" stop-opacity=".14"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></linearGradient></defs>`;
const folds=(xs,y1,y2)=>xs.map(([x,dx])=>`<path d="M${x} ${y1}Q${x+dx/2} ${(y1+y2)/2} ${x+dx} ${y2}" stroke="#000" stroke-opacity=".16" stroke-width="2.5" fill="none"/>`).join('');
const bodice=(id)=>`<path d="M150 70q50 22 100 0l12 40q-10 60-18 110h-88q-8-50-18-110z" fill="url(#f${id})"/><path d="M150 70q50 22 100 0l12 40q-10 60-18 110h-88q-8-50-18-110z" fill="url(#sh${id})"/>`;
const shapes={
gown:(id,a,b,d)=>bodice(id)+`<g class="${d}"><path d="M156 220h88q60 180 120 340H36q60-160 120-340z" fill="url(#f${id})"/><path d="M156 220h88q60 180 120 340H36q60-160 120-340z" fill="url(#sh${id})"/>${folds([[170,-80],[190,-30],[210,25],[230,80]],230,555)}</g>
<path d="M152 220h96" stroke="#e9b949" stroke-width="6"/>${[0,1,2,3,4,5,6,7].map(i=>`<circle cx="${70+i*37}" cy="${530-Math.abs(i-3.5)*4}" r="4" fill="#e9b949"/>`).join('')}`,
mini:(id,a,b,d)=>bodice(id)+`<g class="${d}"><path d="M156 220h88l50 150H106z" fill="url(#f${id})"/><path d="M156 220h88l50 150H106z" fill="url(#sh${id})"/>${folds([[180,-30],[200,0],[220,30]],230,365)}</g>
<path d="M200 370v190" stroke="#3a2230" stroke-width="5"/>`,
suit:(id,a,b,d)=>`<path d="M130 70q70 30 140 0l20 60-10 220H120l-10-220z" fill="url(#f${id})"/><path d="M130 70q70 30 140 0l20 60-10 220H120l-10-220z" fill="url(#sh${id})"/>
<path d="M200 90l-30 120 30 40 30-40z" fill="#fff8f9" opacity=".9"/><path d="M168 76l32 60 32-60" stroke="#000" stroke-opacity=".25" stroke-width="3" fill="none"/>
<circle cx="200" cy="270" r="5" fill="#e9b949"/><circle cx="200" cy="300" r="5" fill="#e9b949"/>
<g class="${d}"><path d="M126 350h148l10 210h-62l-22-170-22 170h-62z" fill="url(#f${id})"/><path d="M126 350h148l10 210h-62l-22-170-22 170h-62z" fill="url(#sh${id})"/></g>`,
coat:(id,a,b,d)=>`<g class="${d}"><path d="M136 66q64 30 128 0l30 60 26 420H80l26-420z" fill="url(#f${id})"/><path d="M136 66q64 30 128 0l30 60 26 420H80l26-420z" fill="url(#sh${id})"/>
<path d="M200 96v450" stroke="#000" stroke-opacity=".25" stroke-width="3"/>${folds([[130,-30],[270,30]],260,540)}</g>
<path d="M136 66l64 90 64-90 10 40-74 70-74-70z" fill="#000" opacity=".18"/><path d="M110 250h180" stroke="#22101c" stroke-width="12"/><rect x="186" y="242" width="28" height="16" rx="3" fill="#e9b949"/>`,
saree:(id,a,b,d)=>bodice(id)+`<g class="${d}"><path d="M156 220h88q40 170 64 340H92q24-170 64-340z" fill="url(#f${id})"/><path d="M156 220h88q40 170 64 340H92q24-170 64-340z" fill="url(#sh${id})"/>${folds([[180,-20],[195,-8],[210,8],[225,20]],300,555)}</g>
<path d="M250 72q-60 80-120 160 40 40 30 330h-30q10-280-24-320z" fill="${b}" opacity=".85"/><path d="M250 72q-60 80-120 160" stroke="#e9b949" stroke-width="7" fill="none"/>
<path d="M92 545h216" stroke="#e9b949" stroke-width="8"/>`
};
const art=(id,type,a,b,d='')=>fab(id,a,b)+form(id)+shapes[type](id,a,b,d);

// if any photo fails, swap in the drawn illustration
window.__imgFail=img=>{const d=img.dataset;img.outerHTML=`<svg viewBox="0 0 400 640" aria-hidden="true">${art('e'+Math.random().toString(36).slice(2),d.t||'gown',d.a||'#c8195f',d.b||'#f8dbe4')}</svg>`};
document.getElementById('heroArt').innerHTML=art('h','saree','#c8195f','#fbe3ea','sway');
const photo=(src,alt,l,eager)=>`<img src="${src}" alt="${esc(alt)}" ${eager?'fetchpriority="high"':'loading="lazy"'} decoding="async" data-t="${l.t}" data-a="${l.a}" data-b="${l.b}" onerror="__imgFail(this)">`;

/* Photos: free Pexels images (pexels.com/license). Replace with your client's photos,
   e.g. img:'images/look1.jpg'. If a photo fails to load, the drawn illustration shows instead. */
const px=id=>`https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=900`;
const looks=[
 {n:'Rani Bridal Lehenga',c:'Bridal',img:px(12411105),t:'gown',a:'#7a0f3a',b:'#c8195f',s:'Bridal 2026',f:'Raw silk, zardozi & dabka',d:'A heirloom-red lehenga with a hand-embroidered zardozi border and a sheer dupatta — made to be passed down.'},
 {n:'Gulabi Drape',c:'Couture',img:px(13679117),t:'saree',a:'#b4123f',b:'#f2b6c6',s:'SS 2026',f:'Banarasi silk, gota patti',d:'A rose-pink drape for brides-to-be and festive evenings — the pallu falls in one fluid line from the shoulder.'},
 {n:'Noir Evening Gown',c:'Couture',img:px(16894090),t:'gown',a:'#2b1724',b:'#6d3a58',s:'AW 2026',f:'Silk crepe, hand-beaded bodice',d:'A sculpted black gown with a hand-beaded bodice and a skirt cut on the bias, so it moves like water.'},
 {n:'Emerald Satin',c:'Couture',img:px(18457831),t:'gown',a:'#0f5132',b:'#3aa17e',s:'AW 2026',f:'Duchess satin',d:'Off-shoulder satin in deep emerald with a high slit — red-carpet drama with a clean, modern line.'},
 {n:'Scarlet Suit',c:'Ready-to-wear',img:px(15345386),t:'suit',a:'#9b1b1b',b:'#e14b4b',s:'AW 2026',f:'Wool-silk blend',d:'Sharp tailoring in scarlet: a softly padded shoulder, wide trousers and brass buttons cast in Moradabad.'},
 {n:'Ivory Tailoring',c:'Ready-to-wear',img:px(12311949),t:'suit',a:'#cfc6b8',b:'#fff8ef',s:'SS 2026',f:'Handloom cotton-linen',d:'A breathable ivory suit in handloom cotton-linen — boardroom by day, cocktail hour by night.'},
 {n:'Heirloom Lehenga',c:'Bridal',img:px(13022612),t:'gown',a:'#b4123f',b:'#f2b6c6',s:'Bridal 2026',f:'Velvet, mukaish & pearls',d:'Rich velvet hand-dotted with mukaish and seed pearls, paired with a scalloped dupatta for the pheras.'}
];
const cats=['All',...new Set(looks.map(l=>l.c))];
const strip=document.getElementById('strip'),filters=document.getElementById('filters');
let cur='All';
const esc0=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const renderLooks=()=>{
 filters.innerHTML=cats.map(c=>`<button class="chip" aria-pressed="${c===cur}" data-c="${esc(c)}">${esc(c)}</button>`).join('');
 strip.innerHTML=looks.map((l,i)=>({l,i})).filter(o=>cur==='All'||o.l.c===cur).map(({l,i})=>`<button class="look" data-i="${i}" aria-label="Open ${esc(l.n)}">
  <div class="art" style="background:linear-gradient(170deg,${l.b}33,${l.a}22)">${photo(l.img,l.n+' — '+l.f,l)}</div>
  <div class="meta"><h3>${esc(l.n)}</h3><small>${esc(l.c)}</small></div></button>`).join('');
 strip.scrollTo({left:0});
};
renderLooks();
filters.addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;cur=b.dataset.c;renderLooks()});
const step=dir=>{const card=strip.querySelector('.look');const w=card?card.offsetWidth+20:300;strip.scrollBy({left:dir*w,behavior:'smooth'})};
document.getElementById('prev').onclick=()=>step(-1);document.getElementById('next').onclick=()=>step(1);
strip.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();step(1)}if(e.key==='ArrowLeft'){e.preventDefault();step(-1)}});

/* lightbox */
const lbx=document.getElementById('lbx');let lastFocus=null;
strip.addEventListener('click',e=>{const b=e.target.closest('.look');if(!b)return;const i=+b.dataset.i,l=looks[i];lastFocus=b;
 document.getElementById('lbpic').style.background=`linear-gradient(170deg,${l.b}44,${l.a}33)`;
 document.getElementById('lbpic').innerHTML=photo(l.img,l.n,l,true);
 document.getElementById('lbtxt').innerHTML=`<span class="kicker">${esc(l.c)}</span><h2 id="lbt" style="font-size:clamp(30px,4vw,42px)">${esc(l.n)}</h2><p style="margin-top:16px">${esc(l.d)}</p><dl><dt>Season</dt><dd style="margin:0">${esc(l.s)}</dd><dt>Fabric</dt><dd style="margin:0">${esc(l.f)}</dd><dt>Made</dt><dd style="margin:0">To order, 6–10 weeks</dd></dl><a class="btn" href="#contact" id="lbbook" style="margin-top:24px;background:var(--fu);color:#fff;border-color:var(--fu)">Enquire about this look</a>`;
 lbx.classList.add('on');document.getElementById('lbclose').focus();
 document.getElementById('lbbook').onclick=()=>{closeLb();document.getElementById('fmsg').value=`I'd love to know more about the ${l.n}.`};
});
const closeLb=()=>{lbx.classList.remove('on');lastFocus&&lastFocus.focus()};
document.getElementById('lbclose').onclick=closeLb;
lbx.addEventListener('click',e=>{if(e.target===lbx)closeLb()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&lbx.classList.contains('on'))closeLb()});

/* services & steps */
const ic={
 needle:'<path d="M5 19L19 5M15 5h4v4" /><circle cx="7" cy="17" r="1.5"/>',
 ring:'<circle cx="12" cy="14" r="6"/><path d="M9 4h6l-3 4z"/>',
 hanger:'<path d="M12 7a2 2 0 112-2M12 7v2L3 16h18l-9-7"/>',
 star:'<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.5 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/>'
};
const svc=[
 ['needle','Bespoke couture','One-of-a-kind evening and occasion wear, drafted to your measurements over three to four fittings.'],
 ['ring','Bridal','Wedding, sangeet and reception looks designed as a cohesive trousseau — with pieces you can rewear.'],
 ['hanger','Ready-to-wear','Seasonal capsule collections in handloom fabrics, sized XS–XXL and available to order online.'],
 ['star','Styling & collaborations','Personal styling sessions, costume design for shoots, and limited-edition brand collaborations.']
];
document.getElementById('svc').innerHTML=svc.map(([i,t,d])=>`<article class="rv"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ic[i]}</svg><h3>${t}</h3><p>${d}</p></article>`).join('');
const steps=[
 ['Consultation','We talk through your occasion, references, colours and budget — in studio or on video.'],
 ['Sketch & swatch','Aanya sketches two or three directions and pairs each with fabric and embroidery swatches.'],
 ['Fittings','A toile in muslin first, then two fittings in the final fabric until the fit is exact.'],
 ['Hand finishing','Embroidery, hems and final pressing by our artisans, then delivered in a keepsake garment bag.']
];
document.getElementById('steps').innerHTML=steps.map(([t,d])=>`<div class="rv"><h3>${t}</h3><p>${d}</p></div>`).join('');

/* marquee */
const words=['Couture','<b>✦</b>','Bridal','<b>✦</b>','Handloom','<b>✦</b>','Ready-to-wear','<b>✦</b>','Made in Mumbai','<b>✦</b>'];
const once=words.map(w=>`<span>${w}</span>`).join('');document.getElementById('mq').innerHTML=once+once+once+once;

/* nav */
const nav=document.getElementById('nav'),menu=document.getElementById('menu');
const onScroll=()=>nav.classList.toggle('solid',scrollY>40||nav.classList.contains('open'));
addEventListener('scroll',onScroll,{passive:true});onScroll();
menu.onclick=()=>{const o=nav.classList.toggle('open');menu.setAttribute('aria-expanded',o);onScroll()};
document.getElementById('links').addEventListener('click',e=>{if(e.target.closest('a')){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');onScroll()}});

/* reveal on scroll */
const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}}),{threshold:.12});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));

/* form */
const f=document.getElementById('form'),ok=document.getElementById('ok');
const sendBtn=f.querySelector('button[type=submit]');
const show=(msg,type)=>{ok.style.display='block';ok.className='ok '+(type||'');ok.textContent=msg};
f.addEventListener('submit',async e=>{e.preventDefault();
 const n=document.getElementById('fname'),m=document.getElementById('femail');
 if(f.querySelector('#botcheck').checked)return; // spam honeypot
 if(!n.value.trim()||!m.value||!m.validity.valid){show('Please add your name and a valid email.','err');(n.value.trim()?m:n).focus();return}
 if(CONFIG.WEB3FORMS_KEY.startsWith('YOUR_')){show('Form not connected yet: add your Web3Forms access key in script.js.','err');return}
 sendBtn.disabled=true;sendBtn.textContent='Sending…';show('Sending your request…');
 try{
  const res=await fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},
   body:JSON.stringify({access_key:CONFIG.WEB3FORMS_KEY,subject:`New appointment request — ${document.getElementById('focc').value}`,from_name:'Atelier website',
    name:n.value.trim(),email:m.value.trim(),occasion:document.getElementById('focc').value,event_date:document.getElementById('fdate').value||'Not set',message:document.getElementById('fmsg').value.trim()||'—'})});
  const data=await res.json();
  if(!res.ok||!data.success)throw new Error(data.message||'Request failed');
  show(`Thank you, ${n.value.trim()}! Your request has been sent — we'll reply within two working days.`,'good');f.reset();
 }catch(err){show('Sorry, something went wrong sending your request. Please try again or email hello@aanyarao.studio.','err')}
 finally{sendBtn.disabled=false;sendBtn.textContent='Request appointment'}
});

/* ===== AI style assistant ===== */
const chatFab=document.getElementById('chatFab'),panel=document.getElementById('chat'),log=document.getElementById('chatLog'),
      cform=document.getElementById('chatForm'),cin=document.getElementById('chatIn'),sugg=document.getElementById('chatSugg');
const chatHistory=[];
const addMsg=(role,text)=>{const d=document.createElement('div');d.className='msg '+role;d.textContent=text;log.appendChild(d);log.scrollTop=log.scrollHeight;return d};
const openChat=o=>{panel.classList.toggle('on',o);chatFab.setAttribute('aria-expanded',o);chatFab.classList.toggle('x',o);if(o){if(!log.children.length)addMsg('bot',"Hi! I'm the atelier's style assistant ✨ Ask me about bridal, fittings, timelines, fabrics or what to wear for your occasion.");setTimeout(()=>cin.focus(),200)}};
chatFab.onclick=()=>openChat(!panel.classList.contains('on'));
document.getElementById('chatClose').onclick=()=>{openChat(false);chatFab.focus()};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&panel.classList.contains('on'))openChat(false)});
// offline fallback answers if the API isn't deployed yet
const faq=[
 [/price|cost|budget|charge/i,'Bespoke couture starts from around ₹85,000 and bridal from ₹1,50,000, depending on fabric and embroidery. Book a consultation for an exact quote.'],
 [/time|long|weeks|deliver|ready/i,'Made-to-order pieces take 6–10 weeks; bridal 12–16 weeks. Rush orders are sometimes possible — just ask in the booking form.'],
 [/bridal|wedding|bride|lehenga|sangeet/i,'For bridal we design a full trousseau — wedding, sangeet and reception — over a consultation, sketches and 3–4 fittings.'],
 [/fit|appoint|book|visit|meet/i,'Fittings are at the Bandra studio, Tue–Sat 11am–7pm, or by video call worldwide. Use the appointment form and we’ll confirm a slot.'],
 [/fabric|silk|cotton|material|sustain/i,'We work with handwoven Banarasi, Chanderi and handloom cotton, natural dyes and hand embroidery from 40+ artisan partners.'],
];
const localReply=q=>(faq.find(([r])=>r.test(q))||[,'I can help with pricing, timelines, bridal, fabrics and fittings. For anything specific, the appointment form below goes straight to the studio.'])[1];
const ask=async q=>{
 q=q.trim();if(!q)return;sugg.hidden=true;addMsg('user',q);chatHistory.push({role:'user',content:q});
 const t=addMsg('bot typing','…');cin.value='';cin.disabled=true;
 let reply;
 try{
  const res=await fetch(CONFIG.CHAT_API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:chatHistory.slice(-10)})});
  if(!res.ok)throw 0;const data=await res.json();reply=data.reply;if(!reply)throw 0;
 }catch{reply=localReply(q)}
 t.classList.remove('typing');t.textContent=reply;chatHistory.push({role:'assistant',content:reply});
 cin.disabled=false;cin.focus();log.scrollTop=log.scrollHeight;
};
cform.addEventListener('submit',e=>{e.preventDefault();ask(cin.value)});
sugg.addEventListener('click',e=>{const b=e.target.closest('button');if(b)ask(b.textContent)});
});
