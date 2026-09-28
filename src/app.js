(function(){
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const WM='{{WM}}', ARC='{{ARC}}', PWR='{{PWR}}';
  const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

  /* ---------- language: English source, Arabic dictionary keyed by the English text ---------- */
  const AR=/*{{ARJSON}}*/{};
  const ARX=[
    [/^(\d+) colleagues shared this$/,'شاركها $1 من زملائك'],
    [/^Opening (.+) with the creative and caption$/,'جارٍ فتح $1 مع التصميم والنص'],
    [/^Add to (Apple|Google) Wallet$/,'أضف إلى $1 Wallet'],
    [/^Card added to (Apple|Google) Wallet$/,'أُضيفت البطاقة إلى $1 Wallet'],
    [/^Share on (.+)$/,'شارك على $1'],
    [/^(.+) signature selected$/,'تم اختيار توقيع $1'],
    [/^(.+) connected$/,'تم ربط $1'],
    [/^(.+) disconnected$/,'تم فصل $1'],
    [/^Post published to the WalaPlus page$/,'نُشر المنشور على صفحة WalaPlus'],
    [/^(.+) · 48,210 followers$/,'$1 · 48,210 متابع']
  ];
  let LANG='en';
  const norm=s=>s.trim().replace(/\s+/g,' ');
  function lookup(s){
    const k=norm(s);if(!k)return null;
    if(AR[k]!=null)return AR[k];
    for(const [r,x] of ARX)if(r.test(k))return k.replace(r,(m,a)=>x.replace('$1',AR[a]||a));
    return null;
  }
  const ATTRS=['placeholder','aria-label'];
  function trNode(n){
    if(n.nodeType===3){
      if(LANG==='ar'){if(n.__en===undefined){const v=lookup(n.data);if(v!=null){n.__en=n.data;n.data=n.data.replace(n.data.trim(),v);}}}
      else if(n.__en!==undefined){n.data=n.__en;n.__en=undefined;}
      return;
    }
    if(n.nodeType!==1||n.closest('[data-notr],script,style'))return;
    const w=document.createTreeWalker(n,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT,{acceptNode:x=>x.nodeType===1&&(x.hasAttribute('data-notr')||/^(SCRIPT|STYLE)$/.test(x.tagName))?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});
    let x=n;
    do{
      if(x.nodeType===3)trNode(x);
      else for(const a of ATTRS)if(x.hasAttribute(a)){
        const key='__en_'+a;
        if(LANG==='ar'){if(x[key]===undefined){const v=lookup(x.getAttribute(a));if(v!=null){x[key]=x.getAttribute(a);x.setAttribute(a,v);}}}
        else if(x[key]!==undefined){x.setAttribute(a,x[key]);x[key]=undefined;}
      }
    }while((x=w.nextNode()));
  }
  function setLang(l){
    LANG=l==='ar'?'ar':'en';
    const h=document.documentElement;h.lang=LANG;h.dir=LANG==='ar'?'rtl':'ltr';
    $$('[data-lang]').forEach(b=>b.textContent=LANG==='ar'?'English':'العربية');
    try{localStorage.setItem('reachn-lang',LANG);}catch(e){}
    trNode(document.body);
    liSync(true);
  }
  new MutationObserver(ms=>{if(LANG!=='ar')return;for(const m of ms)for(const n of m.addedNodes)trNode(n);}).observe(document.body,{childList:true,subtree:true});

  /* ---------- sample data ---------- */
  const S={name:'Ahmed Zahran',title:'Head of Marketing',company:'WalaPlus',email:'a.zahran@walaplus.com',phone:'+966 50 123 4567',linkedin:'linkedin.com/in/zahranppc',tagline:'Rewarding loyalty, every day.',photo:null,sig:'classic',cstyle:'t1'};
  const campaigns=[
    {id:3,title:'New brand launch',head:'Meet the new WalaPlus.',caption:'Same WalaPlus, new look. Proud of what our team has built. #WalaPlus #NewBrand',style:'t1',channels:['LinkedIn','X','WhatsApp'],shares:87,reach:'41.2K',date:'21 Sep'},
    {id:2,title:'We are hiring: Sales',head:'Join the team. 6 open roles.',caption:'We are growing the sales team in Riyadh. Know someone great? Send them my way. #Hiring',style:'t2',channels:['LinkedIn','WhatsApp'],shares:52,reach:'18.6K',date:'14 Sep'},
    {id:1,title:'National Day rewards',head:'National Day rewards are live.',caption:'Celebrating Saudi National Day with rewards for every member. #SaudiNationalDay',style:'t3',channels:['LinkedIn','X','WhatsApp'],shares:113,reach:'57.9K',date:'09 Sep'}
  ];
  const people=[['Ahmed Zahran','Head of Marketing',[1,1,1,1],'ok',1,'Shipped'],['Sara Al-Otaibi','HR Director',[1,1,1,1],'ok',1,'Shipped'],['Faisal Al-Harbi','Sales Manager',[1,1,1,0],'warn',1,'Ready'],['Nora Al-Qahtani','Partnerships Lead',[0,1,1,1],'warn',0,'Pending'],['Omar Siddiqui','Product Designer',[1,1,0,0],'warn',0,'Pending'],['Layla Hassan','Account Executive',[1,1,1,1],'ok',1,'Printing'],['Khalid Al-Dossari','Finance Manager',[0,1,1,0],'pend',0,'Pending']];
  const contacts=[
    {n:'Reem Al-Mutairi',co:'Najd Logistics',by:'Ahmed Zahran',src:'Badge scan',ev:'LEAP Riyadh',q:1,crm:1},
    {n:'Tariq Bahamdan',co:'Tuwaiq Foods',by:'Faisal Al-Harbi',src:'NFC tap',ev:'LEAP Riyadh',q:1,crm:1},
    {n:'Huda Al-Zahrani',co:'Red Sea Retail',by:'Layla Hassan',src:'QR scan',ev:'Seamless Saudi Arabia',q:0,crm:1},
    {n:'Majed Al-Anazi',co:'Hijaz Pharma',by:'Ahmed Zahran',src:'Paper card scan',ev:'HR Summit Riyadh',q:0,crm:1},
    {n:'Dana Khoury',co:'Diriyah Hotels',by:'Nora Al-Qahtani',src:'Lead form',ev:'No event',q:1,crm:0},
    {n:'Yousef Al-Shehri',co:'Asir Energy',by:'Ahmed Zahran',src:'Wallet pass',ev:'Seamless Saudi Arabia',q:0,crm:1}
  ];
  const pool=[['Lama Al-Saud','Qassim Dairy'],['Bader Al-Ghamdi','Tabuk Steel'],['Noura Fakeeh','Jeddah Freight'],['Sami Haddad','Gulf Payments'],['Abeer Al-Harthi','Madinah Medical']];
  let evFilter='All events';

  const LI={
    hire:{label:'New hire welcome',f:['Employee name','Title','Start date'],d:['Layla Hassan','Account Executive','1 October'],
      head:a=>({en:`Welcome, ${a[0]}.`,ar:`أهلاً ${a[0]}.`}),
      en:a=>`Please welcome ${a[0]}, who joins WalaPlus as ${a[1]}. First day: ${a[2]}.\n\nSay hello in the comments.\n\n#Welcome #WalaPlus #NewHire`,
      ar:a=>`نرحّب بانضمام ${a[0]} إلى فريق WalaPlus بمنصب ${a[1]}. أول يوم: ${a[2]}.\n\nرحّبوا معنا في التعليقات.\n\n#ترحيب #ولاء_بلس #انضمام_جديد`},
    job:{label:'New vacancy',f:['Job title','Location','Apply link'],d:['Senior Sales Executive','Riyadh','walaplus.com/careers'],
      head:a=>({en:`We are hiring: ${a[0]}.`,ar:`نوظّف الآن: ${a[0]}.`}),
      en:a=>`We are hiring a ${a[0]} in ${a[1]}.\n\nIf you know someone who fits, send them this post.\n\nApply: ${a[2]}\n\n#Hiring #Jobs #WalaPlus`,
      ar:a=>`نبحث عن ${a[0]} في ${a[1]}.\n\nإذا تعرف شخصاً مناسباً، أرسل له هذا المنشور.\n\nالتقديم: ${a[2]}\n\n#وظائف #توظيف #ولاء_بلس`},
    promo:{label:'Promotion',f:['Employee name','New title','Team'],d:['Faisal Al-Harbi','Head of Sales','Sales'],
      head:a=>({en:`Congratulations, ${a[0]}.`,ar:`مبروك ${a[0]}.`}),
      en:a=>`Congratulations to ${a[0]}, now ${a[1]} in our ${a[2]} team. Earned, not given.\n\n#Promotion #WalaPlus`,
      ar:a=>`مبروك لـ ${a[0]} الترقية إلى ${a[1]} في فريق ${a[2]}. ترقية مستحقة.\n\n#ترقية #ولاء_بلس`},
    anniv:{label:'Work anniversary',f:['Employee name','Years','Team'],d:['Nora Al-Qahtani','5','Partnerships'],
      head:a=>({en:`${a[1]} years with ${a[0]}.`,ar:`${a[1]} سنوات مع ${a[0]}.`}),
      en:a=>`${a[1]} years ago ${a[0]} joined our ${a[2]} team. Thank you for every one of them.\n\n#WorkAnniversary #WalaPlus`,
      ar:a=>`قبل ${a[1]} سنوات انضمت ${a[0]} إلى فريق ${a[2]}. شكراً على كل سنة منها.\n\n#ذكرى_الانضمام #ولاء_بلس`},
    news:{label:'Company news',f:['Headline','Summary','Link'],d:['WalaPlus has a new look','A new identity for the next stage of our growth.','walaplus.com/news'],
      head:a=>({en:a[0],ar:a[0]}),
      en:a=>`${a[0]}\n\n${a[1]}\n\nRead more: ${a[2]}\n\n#WalaPlus`,
      ar:a=>`${a[0]}\n\n${a[1]}\n\nالتفاصيل: ${a[2]}\n\n#ولاء_بلس`},
    event:{label:'Event',f:['Event name','Date and place','Registration link'],d:['LEAP Riyadh','9 February, Riyadh Exhibition Centre','walaplus.com/leap'],
      head:a=>({en:`Meet us at ${a[0]}.`,ar:`نلتقيكم في ${a[0]}.`}),
      en:a=>`We will be at ${a[0]}. ${a[1]}.\n\nCome and meet the team. Book a slot: ${a[2]}\n\n#Events #WalaPlus`,
      ar:a=>`سنكون في ${a[0]}. ${a[1]}.\n\nزورونا وتعرّفوا على الفريق. احجز موعدك: ${a[2]}\n\n#فعاليات #ولاء_بلس`}
  };
  let liType='hire', liDirty=false;
  const liPosts=[
    {type:'job',title:'We are hiring: Senior Sales Executive.',lang:'English',date:'24 Sep',re:214,st:'Published'},
    {type:'hire',title:'Welcome, Omar Siddiqui.',lang:'English',date:'18 Sep',re:156,st:'Published'},
    {type:'event',title:'Meet us at LEAP Riyadh.',lang:'Arabic',date:'2 Oct',re:0,st:'Scheduled'}
  ];
  const INTS=[
    ['CRM',[['Salesforce','Contacts and leads, matched by email',1],['HubSpot','Contacts with event and source fields',1],['Microsoft Dynamics 365','Leads and contacts',0],['Zoho CRM','Leads and contacts',0],['Pipedrive','People and deals',0]]],
    ['Directory and sign-on',[['Microsoft Entra ID','User sync and single sign-on',1],['Okta','User sync and single sign-on',0],['Active Directory','User sync',0],['SAML 2.0 SSO','Enforce single sign-on for every user',1],['SCIM','Create and deactivate cards automatically',1]]],
    ['Email and contacts',[['Google Workspace','Deploy signatures to every mailbox',1],['Microsoft 365','Deploy signatures to every mailbox',0],['Outlook Contacts','Captured contacts in the address book',0]]],
    ['Social and automation',[['LinkedIn company page','Publish posts from the LinkedIn publisher',1],['Zapier','Connect to thousands of other apps',0],['Webhooks','Send each new contact to your own system',0],['ReachN API','Bulk card creation and contact export',0]]]
  ];

  const slug=()=>S.name.trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'profile';
  const url=()=>'reachn.com/'+(S.company.toLowerCase().replace(/[^a-z0-9]+/g,'')||'company')+'/'+slug();
  const ini=n=>n.split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0].toUpperCase()).join('');
  const avHTML=()=>S.photo?'<img src="'+S.photo+'" alt="">':ini(S.name);
  const li=()=>esc(S.linkedin.replace(/^https?:\/\/(www\.)?/,''));
  const pill=(c,t)=>`<span class="pill ${c}">${t}</span>`;

  /* QR: real and scannable via qrcodejs; deterministic placeholder if the library is blocked */
  function qr(el,text,size){
    if(!el)return;el.innerHTML='';el.setAttribute('data-notr','');
    if(window.QRCode){new QRCode(el,{text:'https://'+text,width:size,height:size,correctLevel:QRCode.CorrectLevel.M});return;}
    const c=document.createElement('canvas');c.width=c.height=25;const g=c.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,25,25);g.fillStyle='#111';
    let h=7;for(const ch of text)h=(h*31+ch.charCodeAt(0))>>>0;
    for(let y=0;y<25;y++)for(let x=0;x<25;x++){h^=h<<13;h^=h>>>17;h^=h<<5;h>>>=0;if(h&1)g.fillRect(x,y,1,1);}
    [[0,0],[18,0],[0,18]].forEach(([x,y])=>{g.fillStyle='#111';g.fillRect(x,y,7,7);g.fillStyle='#fff';g.fillRect(x+1,y+1,5,5);g.fillStyle='#111';g.fillRect(x+2,y+2,3,3);});
    el.appendChild(c);
  }

  /* ---------- signatures ---------- */
  const SIGS={
    classic:['Classic','Photo and details',()=>`<div class="top"><span class="av">${avHTML()}</span><div><b class="n">${esc(S.name)}</b><span class="l">${esc(S.title)} · ${esc(S.company)}</span><span class="l"><u>${esc(S.phone)}</u> · <u>${esc(S.email)}</u></span><span class="l"><u>${li()}</u></span></div></div>${WM}`],
    compact:['Compact','Logo and one block',()=>`<div class="top">${WM}<span class="rule"></span><div><b class="n">${esc(S.name)}</b><span class="l">${esc(S.title)}, ${esc(S.company)}</span><span class="l"><u>${esc(S.phone)}</u> | <u>${esc(S.email)}</u> | <u>${li()}</u></span></div></div>`],
    banner:['Banner','Details and campaign line',()=>`<div><b class="n">${esc(S.name)}</b><span class="l">${esc(S.title)} · ${esc(S.company)}</span><span class="l"><u>${esc(S.phone)}</u> · <u>${esc(S.email)}</u> · <u>${li()}</u></span></div><div class="bn"><span>${esc(S.tagline)}</span>${WM}</div>`]
  };
  function renderSigs(){
    const box=$('[data-sigs]');box.removeAttribute('data-notr');
    box.innerHTML=Object.entries(SIGS).map(([k,[n,d,f]])=>`<button type="button" class="sigopt" data-sig="${k}" aria-pressed="${S.sig===k}"><span class="cap"><span><span>${n}</span> <span style="font-weight:400;opacity:.7">· <span>${d}</span></span></span>${S.sig===k?pill('ok','Selected'):pill('pend','Use this')}</span><span class="sig ${k}" data-notr>${f()}${PWR}</span></button>`).join('');
  }

  /* ---------- campaigns ---------- */
  const creative=c=>`<div class="crt ${c.style}" data-notr>${WM}<h5>${esc(c.head)}</h5><span class="arc">${ARC}</span>${PWR}</div>`;
  function renderCampaigns(){
    $$('[data-k="count"]').forEach(e=>e.textContent=campaigns.length);
    $$('[data-k="shares"]').forEach(e=>e.textContent=campaigns.reduce((a,c)=>a+c.shares,0));
    $('#camptable').innerHTML=campaigns.map(c=>`<tr><td><b>${esc(c.title)}</b></td><td data-notr>${c.channels.join(' · ')}</td><td>${c.date}</td><td>${c.shares}</td><td>${c.reach}</td><td>${pill('ok','Live')}</td></tr>`).join('');
    $('#feed').innerHTML=campaigns.map(c=>`<article class="camp">${creative(c)}<div class="body"><h3><span>${esc(c.title)}</span><span class="meta">${c.date}</span></h3><label class="f">Caption<textarea class="field" id="cap-${c.id}" data-cap="${c.id}" data-notr>${esc(c.caption)}</textarea></label><div class="sh-btns">${c.channels.map(ch=>`<button class="btn sm ${ch==='LinkedIn'?'pri':''}" type="button" data-post="${ch}" data-id="${c.id}">Share on ${ch}</button>`).join('')}<button class="btn ghost sm" type="button" data-copycap="${c.id}">Copy caption</button></div><span class="meta">${c.shares} colleagues shared this</span></div></article>`).join('');
  }
  const renderTiles=()=>{
    $$('[data-vcamp]').forEach(el=>el.innerHTML=creative(campaigns.find(c=>c.id===3)||campaigns[0]));
    $$('[data-vli]').forEach(el=>el.innerHTML=creative({style:'t2',head:'Welcome, Layla.'}));
  };
  const renderPreview=()=>$('[data-cpreview]').innerHTML=creative({style:S.cstyle,head:$('#c-head').value||'Your headline here.'});
  function post(ch,id){
    const c=campaigns.find(x=>x.id==id),t=encodeURIComponent(c.caption),u=encodeURIComponent('https://walaplus.com');
    const to={LinkedIn:`https://www.linkedin.com/sharing/share-offsite/?url=${u}`,X:`https://twitter.com/intent/tweet?text=${t}&url=${u}`,WhatsApp:`https://wa.me/?text=${t}%20${u}`}[ch];
    try{window.open(to,'_blank','noopener');}catch(e){}
    c.shares++;toast('Opening '+ch+' with the creative and caption');setTimeout(renderCampaigns,0);
  }

  /* ---------- LinkedIn publisher ---------- */
  const liVals=()=>[1,2,3].map(i=>$('#li-f'+i).value.trim()||LI[liType].d[i-1]);
  function liSync(langChanged){
    const T=LI[liType];
    if(langChanged&&!liDirty)$('#li-lang').value=LANG;
    $('#li-types').innerHTML=Object.entries(LI).map(([k,v])=>`<button type="button" data-litype="${k}" aria-pressed="${k===liType}">${v.label}</button>`).join('');
    [1,2,3].forEach(i=>{$('#li-l'+i).textContent=T.f[i-1];$('#li-f'+i).placeholder=T.d[i-1];});
    const l=$('#li-lang').value,a=liVals();
    if(!liDirty)$('#li-text').value=T[l](a);
    const rtl=l==='ar';
    $('[data-lipreview]').innerHTML=`<div class="hdr"><span class="lg">${ARC}</span><div><b data-notr>WalaPlus</b><small>WalaPlus · 48,210 followers</small></div></div><div class="txt" data-notr dir="${rtl?'rtl':'ltr'}">${esc($('#li-text').value)}</div><div class="crt t1" data-notr style="${rtl?'direction:rtl;text-align:right':''}">${WM}<h5 style="${rtl?'left:auto;right:6%;font-family:\'IBM Plex Sans Arabic\',sans-serif':''}">${esc(T.head(a)[l])}</h5><span class="arc">${ARC}</span>${PWR}</div><div class="acts"><span>Like</span><span>Comment</span><span>Repost</span><span>Send</span></div>`;
    $$('[data-k="liposts"]').forEach(e=>e.textContent=liPosts.filter(p=>p.st==='Published').length);
    $$('[data-k="lisched"]').forEach(e=>e.textContent=liPosts.filter(p=>p.st==='Scheduled').length);
    const stc={Published:'ok',Scheduled:'warn',Draft:'pend'};
    $('#litable').innerHTML=liPosts.map(p=>`<tr><td>${LI[p.type].label}</td><td data-notr>${esc(p.title)}</td><td>${p.lang}</td><td>${p.date}</td><td>${p.re||'·'}</td><td>${pill(stc[p.st],p.st)}</td></tr>`).join('');
  }
  function liSave(st){
    const T=LI[liType],l=$('#li-lang').value,a=liVals();
    liPosts.unshift({type:liType,title:T.head(a)[l],lang:l==='ar'?'Arabic':'English',date:st==='Scheduled'?'Sun 9:00':'Today',re:0,st});
    if(st==='Published'&&$('#li-camp').checked){
      campaigns.unshift({id:Date.now(),title:T.label,head:T.head(a)[l],caption:$('#li-text').value,style:'t1',channels:['LinkedIn','X','WhatsApp'],shares:0,reach:'0',date:'Today'});
      renderCampaigns();
    }
    liDirty=false;[1,2,3].forEach(i=>$('#li-f'+i).value='');liSync();
    toast(st==='Published'?'Post published to the WalaPlus page':st==='Scheduled'?'Post scheduled for Sunday 9:00':'Draft saved');
  }

  /* ---------- leads ---------- */
  const leadRow=(c,mine)=>`<tr><td><span class="av" data-notr>${ini(c.n)}</span><span data-notr>${esc(c.n)}</span></td><td data-notr>${esc(c.co)}</td>${mine?'':`<td data-notr>${esc(c.by)}</td>`}<td>${c.src}</td><td>${c.ev}</td><td>${c.q?pill('ok','Qualified'):pill('pend','New')}</td><td>${c.crm?pill('ok','Synced'):pill('warn','Waiting')}</td></tr>`;
  function renderLeads(){
    const evs=['All events',...new Set(contacts.map(c=>c.ev))];
    $('#lead-events').innerHTML=evs.map(e=>`<button type="button" data-evf="${esc(e)}" aria-pressed="${e===evFilter}">${e}</button>`).join('');
    $('#leadtable').innerHTML=contacts.filter(c=>evFilter==='All events'||c.ev===evFilter).map(c=>leadRow(c)).join('');
    $('#mycontacts').innerHTML=contacts.filter(c=>c.by===S.name||c.by==='Ahmed Zahran').map(c=>leadRow(c,1)).join('');
    $$('[data-k="leads"]').forEach(e=>e.textContent=(2209+contacts.length).toLocaleString('en'));
  }
  function addContact(n,co,src){
    contacts.unshift({n,co,by:'Ahmed Zahran',src,ev:$('#ev').value,q:0,crm:1});renderLeads();
  }

  /* ---------- integrations ---------- */
  function renderInts(){
    $('#ints').innerHTML=INTS.map(([g,items],gi)=>`<p class="grp">${g}</p><div class="ints">${items.map((x,i)=>`<div class="int"><div class="row"><b data-notr>${x[0]}</b>${x[2]?pill('ok','Connected'):pill('pend','Not connected')}</div><p>${x[1]}</p><button class="btn ${x[2]?'ghost':''} sm" type="button" data-int="${gi}.${i}">${x[2]?'Disconnect':'Connect'}</button></div>`).join('')}</div>`).join('');
  }

  /* ---------- profile-bound assets ---------- */
  function render(){
    $$('[data-bind]').forEach(el=>{const k=el.dataset.bind;el.textContent=k==='url'?url():S[k];});
    $$('[data-av]').forEach(el=>{el.setAttribute('data-notr','');el.innerHTML=avHTML();});
    $$('[data-nfc-front]').forEach(el=>{el.setAttribute('data-notr','');el.innerHTML=`${WM}<span class="chip"></span><span class="arc">${ARC}</span><div class="qr"></div><div class="who"><b>${esc(S.name)}</b><span>${esc(S.title)}</span></div><span class="nfcmark">NFC</span>`;qr($('.qr',el),url(),120);});
    $$('[data-nfc-back]').forEach(el=>{el.setAttribute('data-notr','');el.innerHTML=`<span class="arc">${ARC}</span>${WM}<span class="url">${esc(url())}</span>${PWR}`;});
    $$('[data-pp]').forEach(el=>el.innerHTML=`<div class="hd" data-notr><span class="arc">${ARC}</span>${WM}</div><div class="av" data-notr>${avHTML()}</div><div class="nm" data-notr><b>${esc(S.name)}</b><span>${esc(S.title)} · ${esc(S.company)}</span></div><div class="acts"><button class="btn pri" type="button" data-toast="Contact saved to phone">Save contact</button><button class="btn ghost" type="button" data-exchange>Exchange</button><button class="btn wallet" type="button" data-wallet="Apple">Add to Apple Wallet</button><button class="btn wallet" type="button" data-wallet="Google">Add to Google Wallet</button></div><div class="rows"><div><small>Email</small><span data-notr>${esc(S.email)}</span></div><div><small>Phone</small><span data-notr dir="ltr">${esc(S.phone)}</span></div><div><small data-notr>LinkedIn</small><span data-notr>${li()}</span></div></div><div class="ft" data-notr>${PWR}</div>`);
    $$('[data-badgeqr]').forEach(el=>qr(el,url(),96));
    $$('[data-vqr]').forEach(el=>qr(el,url(),160));
    $$('[data-vsig]').forEach(el=>{el.className='sig classic';el.setAttribute('data-notr','');el.innerHTML=SIGS.classic[2]()+PWR;});
    renderSigs();
  }
  function roster(q){
    q=(q||'').toLowerCase();
    const kit={ok:'Complete',warn:'Incomplete',pend:'Not started'},cardP={Shipped:'ok',Printing:'warn',Ready:'pend',Pending:'pend'};
    $('#roster').innerHTML=people.filter(p=>(p[0]+p[1]).toLowerCase().includes(q)).map(p=>`<tr><td><span class="av" data-notr>${ini(p[0])}</span><span data-notr>${p[0]}</span></td><td>${p[1]}</td><td><span class="checks" data-notr>${p[2].map(v=>`<i class="${v?'y':''}">${v?'✓':'·'}</i>`).join('')}</span></td><td>${pill(p[3],kit[p[3]])}</td><td>${p[4]?pill('ok','Added'):pill('pend','Not yet')}</td><td>${pill(cardP[p[5]],p[5])}</td><td><a class="btn ghost sm" href="#/app/me/profile">Open</a></td></tr>`).join('')||'<tr><td colspan="7" class="muted">No employee matches that search.</td></tr>';
  }

  /* ---------- modal, toast ---------- */
  function modal(title,body,note){$('#modal-title').textContent=title;$('[data-modal-body]').innerHTML=body;$('[data-modal-note]').textContent=note;$('[data-modal]').classList.add('on');$('[data-close]').focus();}
  const closeModal=()=>$('[data-modal]').classList.remove('on');
  function share(kind){
    modal(kind==='card'?'Share employee card':'Share contact card',
      `<div class="qrbig solo"></div><div class="link" style="margin-top:14px"><input class="field" id="share-link" readonly value="https://${esc(url())}"><button class="btn sm" type="button" data-copy>Copy</button></div><div style="margin-top:12px" data-notr>${PWR}</div>`,
      kind==='card'?'Sends the card as an image with this link, by WhatsApp, email or AirDrop.':'Same design as the NFC card. Anyone who scans it can save your contact.');
    qr($('.modal .qrbig'),url(),156);
  }
  function wallet(kind){
    modal('Add to '+kind+' Wallet',
      `<div class="pass" data-notr><span class="arc">${ARC}</span>${WM}<div><small>Name</small><b>${esc(S.name)}</b></div><div class="two"><div><small>Title</small>${esc(S.title)}</div><div><small>Company</small>${esc(S.company)}</div></div><div class="qrbig"></div><div class="tap">HOLD NEAR READER · NFC</div>${PWR}</div><button class="btn wallet" type="button" data-addpass="${kind}" style="margin-top:14px;width:100%">Add to ${kind} Wallet</button>`,
      'The pass shares your contact by NFC or QR and updates when your profile changes.');
    qr($('.modal .qrbig'),url(),116);
  }
  function exchange(){
    modal('Send your details',
      `<form id="xform" style="display:grid;gap:10px;text-align:start"><label class="f">Full name<input class="field" id="x-name" required></label><label class="f">Work email<input class="field" id="x-email" type="email" required></label><label class="f">Company<input class="field" id="x-co" required></label><label class="f">Phone<input class="field" id="x-phone" dir="ltr"></label><label class="tog" style="font-size:.82rem">I agree to share my details with WalaPlus<input type="checkbox" id="x-ok" required></label><button class="btn pri" type="submit">Send my details</button></form>`,
      'This is the lead form. The admin chooses its fields and when it appears.');
  }
  let tt;function toast(m){const el=$('[data-toast-el]');el.textContent=m;el.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>el.classList.remove('on'),2600);}

  /* ---------- router (links are intercepted so it also works where hash navigation is blocked) ---------- */
  const firstSub={admin:'employees',me:'profile'};
  let here=location.hash;
  function go(path){here=path;try{history.pushState(null,'',path);}catch(e){}route();}
  function route(){
    const p=here.replace(/^#\/?/,'').split('/').filter(Boolean);
    const page=p[0]||'home',app=page==='app';
    $('[data-site]').hidden=app;$('[data-app]').hidden=!app;
    if(app){
      const role=$('[data-role="'+p[1]+'"]')?p[1]:'login',r=$('[data-role="'+role+'"]');
      const sub=$('[data-sub="'+p[2]+'"]',r)?p[2]:firstSub[role];
      $$('[data-role]').forEach(x=>x.hidden=x.dataset.role!==role);
      $$('[data-rolenav]').forEach(a=>a.dataset.rolenav===role?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current'));
      $$('[data-sub]',r).forEach(s=>s.hidden=s.dataset.sub!==sub);
      $$('[data-subnav]',r).forEach(a=>a.dataset.subnav===sub?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current'));
    }else{
      const pg=$('main[data-page="'+page+'"]')?page:'home';
      $$('main[data-page]').forEach(m=>m.hidden=m.dataset.page!==pg);
      $$('[data-nav]').forEach(a=>a.dataset.nav===pg?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current'));
    }
    window.scrollTo(0,0);
  }

  /* ---------- events ---------- */
  [['f-name','name'],['f-phone','phone'],['f-linkedin','linkedin'],['company','company'],['tagline','tagline']].forEach(([id,k])=>{
    const el=document.getElementById(id);el.addEventListener('input',()=>{S[k]=el.value;if(k==='company')$('#f-company').value=el.value;render();});
  });
  $('#photo').addEventListener('change',e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{S.photo=r.result;render();};r.readAsDataURL(f);});
  $('#adm-search').addEventListener('input',e=>roster(e.target.value));
  $('#c-head').addEventListener('input',renderPreview);
  ['li-f1','li-f2','li-f3'].forEach(id=>$('#'+id).addEventListener('input',()=>{liDirty=false;liSync();}));
  $('#li-lang').addEventListener('change',()=>{liDirty=false;liSync();});
  $('#li-text').addEventListener('input',()=>{liDirty=true;liSync();});
  $('#loginform').addEventListener('submit',e=>e.preventDefault());
  $('#liform').addEventListener('submit',e=>{e.preventDefault();liSave('Published');});
  $('#demoform').addEventListener('submit',e=>{e.preventDefault();e.target.reset();toast('Request received. We reply within one business day.');});
  $('#campform').addEventListener('submit',e=>{
    e.preventDefault();
    const ch=$$('.chs input:checked').map(i=>i.value);
    if(!ch.length){toast('Select at least one channel');return;}
    campaigns.unshift({id:Date.now(),title:$('#c-title').value,head:$('#c-head').value,caption:$('#c-cap').value,style:S.cstyle,channels:ch,shares:0,reach:'0',date:'Today'});
    e.target.reset();$$('.chs input').forEach(i=>i.checked=true);renderCampaigns();renderPreview();toast('Campaign pushed to 184 employees');
  });
  document.addEventListener('submit',e=>{
    if(e.target.id!=='xform')return;e.preventDefault();
    addContact($('#x-name').value,$('#x-co').value,'Lead form');closeModal();toast('Details sent. The contact is now in the company contact book.');
  });
  document.addEventListener('input',e=>{const id=e.target.dataset&&e.target.dataset.cap;if(id){const c=campaigns.find(x=>x.id==id);if(c)c.caption=e.target.value;}});
  document.addEventListener('click',e=>{
    const a=e.target.closest('a[href^="#/"]');
    if(a&&!e.metaKey&&!e.ctrlKey){e.preventDefault();go(a.getAttribute('href'));return;}
    const t=e.target.closest('button,[data-cardwrap]');if(!t)return;const d=t.dataset;
    if('lang' in d)setLang(LANG==='ar'?'en':'ar');
    else if(d.toast)toast(d.toast);
    else if(d.share)share(d.share);
    else if(d.wallet)wallet(d.wallet);
    else if('exchange' in d)exchange();
    else if(d.addpass){closeModal();toast('Card added to '+d.addpass+' Wallet');}
    else if(d.sig){S.sig=d.sig;renderSigs();toast(SIGS[d.sig][0]+' signature selected');}
    else if(d.post)post(d.post,d.id);
    else if(d.copycap){const c=campaigns.find(x=>x.id==d.copycap);navigator.clipboard&&navigator.clipboard.writeText(c.caption).catch(()=>{});toast('Caption copied');}
    else if(d.tpl){$$('[data-tpl]').forEach(x=>x.setAttribute('aria-pressed',x===t));toast('Design applied to every card on the template');}
    else if(d.cstyle){S.cstyle=d.cstyle;$$('[data-cstyle]').forEach(x=>x.setAttribute('aria-pressed',x===t));renderPreview();}
    else if(d.litype){liType=d.litype;liDirty=false;[1,2,3].forEach(i=>$('#li-f'+i).value='');liSync();}
    else if(d.li)liSave(d.li);
    else if(d.evf){evFilter=d.evf;renderLeads();}
    else if(d.scan){const p=pool[contacts.length%pool.length];addContact(p[0],p[1],d.scan);toast('Contact captured, completed and sent to the CRM');}
    else if(d.int){const [g,i]=d.int.split('.').map(Number),x=INTS[g][1][i];x[2]=x[2]?0:1;renderInts();toast(x[0]+(x[2]?' connected':' disconnected'));}
    else if('flip' in d||'cardwrap' in d)$('[data-cardwrap]').classList.toggle('flipped');
    else if('copy' in d){navigator.clipboard&&navigator.clipboard.writeText('https://'+url()).catch(()=>{});toast('Link copied');}
    else if('close' in d)closeModal();
  });
  $('[data-modal]').addEventListener('click',e=>{if(e.target===e.currentTarget)closeModal();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});
  const sync=()=>{here=location.hash;route();};
  window.addEventListener('hashchange',sync);window.addEventListener('popstate',sync);

  roster();render();renderCampaigns();renderPreview();renderTiles();renderLeads();renderInts();liSync();route();
  let first='en';
  try{first=new URLSearchParams(location.search).get('lang')||localStorage.getItem('reachn-lang')||'en';}catch(e){}
  if(first==='ar')setLang('ar');
  window.__reachn={setLang,go,lookup};
})();
