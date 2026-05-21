// ═══════════════════════════════════════════════════════
// SUPABASE CONFIG
// ═══════════════════════════════════════════════════════
const SUPA_URL  = 'https://ahnbgcnydlquvondssoy.supabase.co';
const SUPA_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFobmJnY255ZGxxdXZvbmRzc295Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxODYxNDksImV4cCI6MjA5Mzc2MjE0OX0.G0jZjEFxgLBO_kJAG0IxVzpf5QnsV32Ja8p_ZHlMF-M';
const sb = supabase.createClient(SUPA_URL, SUPA_ANON);

// ═══════════════════════════════════════════════════════
// DEFAULT DATA
// ═══════════════════════════════════════════════════════
const DEF_CATS = [
  {id:'food',l:'อาหาร',c:'#f59e0b'},{id:'drink',l:'เครื่องดื่ม',c:'#3b82f6'},
  {id:'snack',l:'ขนม',c:'#f97316'},{id:'cat',l:'สัตว์เลี้ยง',c:'#fb923c'},
  {id:'shop',l:'ช้อปปิ้ง',c:'#ec4899'},{id:'act',l:'กิจกรรม',c:'#10b981'},
  {id:'trans',l:'การเดินทาง',c:'#8b5cf6'},{id:'place',l:'สถานที่',c:'#64748b'},
  {id:'inv',l:'การลงทุน',c:'#06b6d4'},{id:'health',l:'สุขภาพ',c:'#22d3ee'},
  {id:'bill',l:'บิล',c:'#6366f1'},{id:'edu',l:'การศึกษา',c:'#0ea5e9'},
  {id:'donate',l:'การบริจาค',c:'#14b8a6'},{id:'travel',l:'ท่องเที่ยว',c:'#f43f5e'},
  {id:'fam',l:'ให้ครอบครัว',c:'#a855f7'},{id:'other',l:'อื่นๆ',c:'#78716c'}
];
const DEF_PAYS = [
  {id:'cash',l:'เงินสด'},{id:'xfer',l:'โอนเงิน'}
];
const DEF_INCC = [
  {id:'sal',l:'เงินเดือน',c:'#22c98a'},{id:'bon',l:'โบนัส',c:'#f5a623'},
  {id:'free',l:'ฟรีแลนซ์',c:'#4d9ef5'},{id:'inv',l:'ลงทุน',c:'#7c6ef5'},
  {id:'oth',l:'อื่นๆ',c:'#6b7280'}
];
const DEF_INCH = [
  {id:'bank',l:'โอนเข้าบัญชี'},{id:'cash',l:'รับเงินสด'},{id:'prompt',l:'พร้อมเพย์'}
];
const BASE_CR = [
  {id:'ktc',n:'KTC',t:'revolving',ico:'KTC',rate:18},
  {id:'ktcm',n:'KTC Money',t:'revolving',ico:'KTC',rate:25},
  {id:'cardx',n:'CardX / SCB',t:'revolving',ico:'CX',rate:18},
  {id:'krungsri',n:'Krungsri',t:'revolving',ico:'KS',rate:18},
  {id:'ttb',n:'TTB',t:'revolving',ico:'TTB',rate:18},
  {id:'bbl',n:'BBL',t:'revolving',ico:'BBL',rate:18},
  {id:'uob',n:'UOB',t:'revolving',ico:'UOB',rate:18},
  {id:'gsb',n:'GSB',t:'revolving',ico:'GSB',rate:18},
  {id:'aeon',n:'AEON',t:'revolving',ico:'AE',rate:18},
  {id:'aeonm',n:'AEON Money',t:'revolving',ico:'AE',rate:25},
  {id:'kbank',n:'K-Bank',t:'revolving',ico:'KB',rate:18},
  {id:'kbankm',n:'K-Bank Money',t:'revolving',ico:'KB',rate:25},
  {id:'cardxm',n:'CardX Money',t:'revolving',ico:'CX',rate:25},
  {id:'ttbm',n:'TTB Money',t:'revolving',ico:'TTB',rate:25},
  {id:'umay',n:'Umay+',t:'revolving',ico:'UM',rate:25},
  {id:'kfirst',n:'K-First',t:'revolving',ico:'KF',rate:18},
  {id:'lazpay',n:'Laz Pay Later',t:'revolving',ico:'LP',rate:22},
  {id:'tiktokpay',n:'TikTok Pay Later',t:'revolving',ico:'TT',rate:22},
  {id:'shopee',n:'Shopee Pay Later',t:'revolving',ico:'SP',rate:22},
  {id:'shopeem',n:'Shopee Money',t:'revolving',ico:'SM',rate:22},
  {id:'true',n:'True Pay Later',t:'revolving',ico:'TR',rate:22},
  {id:'thisshop',n:'This Shop',t:'revolving',ico:'TS',rate:20},
  {id:'pawn_loan',n:'สินเชื่อจำนำ',t:'fixed',ico:'LN',rate:0},
  {id:'car_loan',n:'สินเชื่อรถยนต์',t:'fixed',ico:'CAR',rate:0},
  {id:'motorcycle_loan',n:'สินเชื่อรถจักรยานยนต์',t:'fixed',ico:'MC',rate:0},
  {id:'home_loan',n:'สินเชื่อที่อยู่อาศัย',t:'fixed',ico:'HM',rate:0},
  {id:'other_loan',n:'สินเชื่ออื่นๆ',t:'fixed',ico:'LN',rate:0},
  {id:'gold',n:'ทอง',t:'fixed',ico:'GLD',rate:0},
  {id:'car',n:'รถยนต์',t:'fixed',ico:'CAR',rate:0}
];
const PAY2CR = {
  'K-Bank':'kbank',
  'K-Bank Money':'kbankm',
  'KTC':'ktc',
  'KTC Money':'ktcm',
  'CardX / SCB':'cardx','Krungsri':'krungsri','TTB':'ttb','BBL':'bbl','UOB':'uob','GSB':'gsb',
  'CardX Money':'cardxm','TTB Money':'ttbm','Umay+':'umay','Laz Pay Later':'lazpay','TikTok Pay Later':'tiktokpay',
  'AEON':'aeon',
  'Aeon':'aeon',
  'AEON Money':'aeonm',
  'K-First':'kfirst',
  'Shopee Pay Later':'shopee',
  'Shopee Money':'shopeem',
  'True Pay Later':'true'
};

// ═══════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════
function readLS(key, fallback){
  try {
    var raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch(e) {
    return fallback;
  }
}
function mergeById(saved, defs){
  var out = Array.isArray(saved) ? saved.slice() : [];
  var idxMap = {};
  out.forEach(function(x,i){ if(x&&x.id) idxMap[x.id]=i; });
  defs.forEach(function(x){
    if(idxMap[x.id]!==undefined){
      // Update label and color from defaults (keeps renamed categories in sync)
      out[idxMap[x.id]].l = x.l;
      if(x.c) out[idxMap[x.id]].c = x.c;
    } else {
      out.push(x);
    }
  });
  return out;
}
var S = {
  user: null,
  profile: null,
  hasAccess: false,
  accessReason: '',
  familyMembers: [],
  avatarData: localStorage.getItem('setAvatar')||'',
  expenses: [],
  incomes: [],
  crInfo: readLS('crInfo',{}),
  crStatus: readLS('crStatus',{}),
  customCr: readLS('customCr',[]),
  cats: mergeById(readLS('cats',null), DEF_CATS),
  pays: DEF_PAYS.slice(),
  incc: mergeById(readLS('incc',null), DEF_INCC),
  inch: mergeById(readLS('inch',null), DEF_INCH),
  fc:{cat:'',pay:'',payer:''},
  fi:{cat:'',ch:'',rcv:''},
  hf:'all', df:'mo', crf:'overview',
  strategy:'avalanche', extraCash:1000,
  activeCr:'', activeInfo:''
};
var authMode='login';
var currentDashTimeFilter='this_month';
var currentDashUserFilter='joint';
var dashCategoryChart=null;

function sv(){
  localStorage.setItem('crInfo',JSON.stringify(S.crInfo));
  localStorage.setItem('crStatus',JSON.stringify(S.crStatus));
  localStorage.setItem('customCr',JSON.stringify(S.customCr));
  localStorage.setItem('cats',JSON.stringify(S.cats));
  localStorage.setItem('pays',JSON.stringify(S.pays));
  localStorage.setItem('incc',JSON.stringify(S.incc));
  localStorage.setItem('inch',JSON.stringify(S.inch));
}

// ═══════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════
function today(){
  var d = new Date();
  return d.getFullYear() + '-' +
    String(d.getMonth()+1).padStart(2,'0') + '-' +
    String(d.getDate()).padStart(2,'0');
}
function thisMo(){ return today().slice(0,7); }
function fmt(n){ return Number(n||0).toLocaleString('th-TH',{maximumFractionDigits:0}); }
function fmt2(n){ return Number(n||0).toLocaleString('th-TH',{minimumFractionDigits:2,maximumFractionDigits:2}); }
function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function cleanLabel(s){ return String(s||'').replace(/^[^\wก-๙]+/u,'').trim(); }
function validYMD(d){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(String(d||''))) return false;
  var p=String(d).split('-').map(Number);
  var x=new Date(p[0],p[1]-1,p[2]);
  return x.getFullYear()===p[0]&&x.getMonth()===p[1]-1&&x.getDate()===p[2];
}
function trimLimit(v,max,label){
  var s=String(v||'').trim();
  if(s.length>max){ toast(label+'ยาวเกิน '+max+' ตัวอักษร','err'); return null; }
  return s;
}
function validateTxnInput(row, opts){
  opts=opts||{};
  if(opts.requireDate!==false&&!validYMD(row.date)) return toast('วันที่ไม่ถูกต้อง','err'),false;
  if(opts.requireAmount!==false&&(!Number.isFinite(Number(row.amount))||Number(row.amount)<=0)) return toast('จำนวนเงินไม่ถูกต้อง','err'),false;
  var fields=[['detail',500,'รายละเอียด/Note '],['note',500,'Note '],['category',100,'หมวดหมู่ '],['payment',100,'ช่องทางชำระ '],['channel',100,'ช่องทางรับ '],['receiver',100,'ผู้รับ '],['paidBy',100,'ผู้จ่าย '],['paid_by',100,'ผู้จ่าย '],['credit_name',100,'ชื่อสินเชื่อ ']];
  for(var i=0;i<fields.length;i++){
    var f=fields[i];
    if(row[f[0]]!=null){
      var t=trimLimit(row[f[0]],f[1],f[2]);
      if(t==null) return false;
      row[f[0]]=t;
    }
  }
  return true;
}
function allCR(){ return BASE_CR.concat(S.customCr); }
function getMyCredits(){
  return allCR().filter(function(c){ return !!(S.crInfo&&S.crInfo[c.id]); });
}
function payIcon(label){
  if(label==='เงินสด') return 'payments';
  if(label==='โอนเงิน') return 'account_balance';
  var cr=allCR().find(function(c){ return c.n===label; });
  return cr?cr.ico||'credit_card':'credit_card';
}
function debtMaterialIcon(cr){
  var name=String((cr&&cr.n)||'');
  if(cr&&cr.t==='revolving') return 'credit_card';
  if(/รถจักรยานยนต์|motor/i.test(name)) return 'two_wheeler';
  if(/รถ|car/i.test(name)) return 'directions_car';
  if(/บ้าน|ที่อยู่อาศัย|home/i.test(name)) return 'home';
  if(/จำนำ|ทอง|pawn|gold/i.test(name)) return 'account_balance';
  if(cr&&cr.t==='fixed') return 'request_quote';
  return 'credit_card';
}
function thaiMo(mo){
  var TM=['','ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
  var p=mo.split('-'); return TM[parseInt(p[1])]+' '+p[0];
}
function calcMoLeft(remaining, minPay, rateYr){
  if(!remaining||remaining<=0||!minPay||minPay<=0) return null;
  var rt=(rateYr||0)/100/12, r=remaining, m=0;
  while(r>0&&m<600){ r=r*(1+rt)-minPay; m++; }
  return m<600?m:null;
}
function validCreatedTime(v){
  if(!v) return 0;
  var t=new Date(v).getTime();
  if(!Number.isFinite(t)) return 0;
  if(t>Date.now()+86400000) return 0;
  return t;
}
function creditExpenseUsage(crId,mo,baseAt){
  var payLabels=Object.keys(PAY2CR).filter(function(k){ return PAY2CR[k]===crId; });
  var baseTime=validCreatedTime(baseAt);
  return S.expenses.filter(function(e){
    if(!e.date||e.date.slice(0,7)!==mo||payLabels.indexOf(e.payment)<0) return false;
    if(!baseTime) return false;
    if(!e.createdAt) return false;
    return validCreatedTime(e.createdAt)>baseTime;
  }).reduce(function(s,e){ return s+Number(e.amount||0); },0);
}
function recomputeMatchedCreditBalances(){
  var mo=thisMo(),seen={};
  Object.keys(PAY2CR).forEach(function(payLabel){
    var crId=PAY2CR[payLabel];
    if(seen[crId]) return; seen[crId]=1;
    var cr=allCR().find(function(c){ return c.id===crId; });
    if(!cr||cr.t!=='revolving') return;
    var st=S.crStatus[crId]||{paid:false,amount:0,remaining:null,date:''};
    var info=S.crInfo[crId]||{};
    var base = st.baseRemaining!=null ? st.baseRemaining : (st.remaining!=null ? st.remaining : (info.limit||0));
    if(!validCreatedTime(st.baseAt)) st.baseAt=mo+'-01T00:00:00.000Z';
    var used=creditExpenseUsage(crId,mo,st.baseAt);
    st.baseRemaining = base;
    st.matchedUsed = used;
    st.remaining = base ? Math.max(0,base-used) : (st.remaining||0);
    S.crStatus[crId]=st;
  });
}
function toast(msg,type){
  var t=document.getElementById('toast');
  t.textContent=msg; t.className='toast on'+(type?' '+type:'');
  clearTimeout(t._t); t._t=setTimeout(function(){ t.classList.remove('on'); },2800);
}
function showSuccessModal(message,details,title){
  var modal=document.getElementById('success-modal');
  if(!modal) return toast(message||'บันทึกสำเร็จ','ok');
  var ttl=document.getElementById('success-modal-title');
  if(ttl) ttl.textContent=title||'บันทึกรายการสำเร็จ';
  var msg=document.getElementById('success-modal-message');
  if(msg) msg.textContent=message||'ข้อมูลของคุณถูกบันทึกเรียบร้อยแล้ว';
  var box=document.getElementById('success-modal-details');
  if(box){
    var rows=(details&&details.length)?details:[
      {icon:'verified',label:'สถานะ',value:'สำเร็จ'},
      {icon:'sync',label:'ระบบ',value:'BridgeX'}
    ];
    box.innerHTML=rows.map(function(r){
      return '<div><span class="material-symbols-outlined">'+esc(r.icon||'info')+'</span><span>'+esc(r.label||'-')+'</span><strong>'+esc(r.value||'-')+'</strong></div>';
    }).join('');
  }
  modal.classList.remove('hidden');
}
function hideSuccessModal(){
  var modal=document.getElementById('success-modal');
  if(modal) modal.classList.add('hidden');
}
function successModalBg(e){
  if(e.target===document.getElementById('success-modal')) hideSuccessModal();
}
function setDot(state,txt){
  var d=document.getElementById('sdot'),l=document.getElementById('slbl');
  d.className='sdot'+(state==='spin'?' spin':state==='off'?' off':'');
  l.textContent=txt;
}
function makeRowId(){
  return Date.now()*1000 + Math.floor(Math.random()*1000);
}
function makeUUID(){
  if(window.crypto&&crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){
    var r=Math.random()*16|0,v=c==='x'?r:(r&0x3|0x8);
    return v.toString(16);
  });
}
function daysLeft(dateStr){
  if(!dateStr) return 0;
  return Math.max(0,Math.ceil((new Date(dateStr).getTime()-Date.now())/86400000));
}
function tierLabel(){
  if(!S.profile) return 'ไม่พบโปรไฟล์';
  var tier=S.profile.sub_tier||'trial';
  if(tier==='trial') return 'Trial · เหลือ '+daysLeft(S.profile.trial_end)+' วัน';
  if(tier==='standard_59') return 'Standard 59฿';
  if(tier==='pro_109') return 'Pro 109฿';
  return tier;
}
function updateHeader(){
  var name=S.profile&&S.profile.full_name?S.profile.full_name:(S.user?S.user.email:'-');
  var hn=document.getElementById('hdr-name'),hs=document.getElementById('hdr-sub');
  if(hn) hn.textContent=name||'-';
  if(hs) hs.textContent=tierLabel();
}
async function ensureProfile(){
  if(!S.user) return null;
  if(S.profile&&S.profile.id===S.user.id) return S.profile;
  logStep('1. Fetching Profile...',S.user.id);
  async function fetchProfile(label){
    return withTimeout(sb.from('profiles').select('*').eq('id',S.user.id).maybeSingle(),6000,label);
  }
  var res;
  try{
    res=await fetchProfile('อ่านโปรไฟล์');
  }catch(e){
    console.warn('[BX Warn] profile fetch retry after failure:',e);
    try{
      res=await fetchProfile('อ่านโปรไฟล์อีกครั้ง');
    }catch(e2){
      console.warn('[BX Warn] profile fetch retry failed:',e2);
      throw new Error('โหลดโปรไฟล์ไม่สำเร็จ กรุณาลองอีกครั้ง');
    }
  }
  logStep('1. Profile fetch response',{hasData:!!res.data,status:res.status,error:res.error});
  if(res.error && res.error.code!=='PGRST116'){
    logSbError('profiles select',res);
    throw res.error;
  }
  if(!res.data){
    logStep('2. Profile missing, inserting...');
    var meta=S.user.user_metadata||{};
    var trialEnd=new Date(Date.now()+15*86400000).toISOString();
    var row={id:S.user.id,full_name:meta.full_name||meta.name||'',sub_tier:'trial',trial_end:trialEnd,updated_at:new Date().toISOString()};
    var ins=await withTimeout(sb.from('profiles').insert([row]).select('*').single(),8000,'สร้างโปรไฟล์');
    logStep('2. Profile insert response',{hasData:!!ins.data,status:ins.status,error:ins.error});
    if(ins.error){
      logSbError('profiles insert',ins);
      var duplicate=ins.status===409||ins.error.code==='23505'||String(ins.error.message||'').indexOf('duplicate key')>=0;
      if(!duplicate) throw ins.error;
      console.warn('profile already exists, selecting existing profile');
      var again=await withTimeout(sb.from('profiles').select('*').eq('id',S.user.id).single(),8000,'อ่านโปรไฟล์หลังชน 409');
      logStep('2b. Profile select after duplicate response',{hasData:!!again.data,status:again.status,error:again.error});
      throwSb('profiles select after duplicate',again);
      S.profile=again.data;
    }else{
      S.profile=ins.data;
    }
  } else {
    S.profile=res.data;
  }
  logStep('3. Profile Success',S.profile);
  return S.profile;
}
async function ensureFamily(){
  if(!S.profile) return;
  logStep('4. Checking Family...',S.profile.family_id||'(missing)');
  if(S.profile.family_id){ logStep('4. Family exists',S.profile.family_id); return; }
  var fid=makeUUID();
  logStep('5. Updating Family ID...',fid);
  var res=await withTimeout(sb.from('profiles').update({family_id:fid,updated_at:new Date().toISOString()}).eq('id',S.user.id).select('*').single(),8000,'บันทึก family_id');
  logStep('5. Family update response',{hasData:!!res.data,status:res.status,error:res.error});
  throwSb('profiles update family_id',res);
  S.profile=res.data;
  logStep('6. Family Success',S.profile.family_id);
}
async function saveOnboarding(){
  var name=document.getElementById('onboard-name').value.trim();
  if(!name) return toast('กรอกชื่อก่อนนะ','err');
  var res=await sb.from('profiles').update({full_name:name,updated_at:new Date().toISOString()}).eq('id',S.user.id).select('*').single();
  if(res.error) return toast(res.error.message,'err');
  S.profile=res.data;
  document.getElementById('onboard-modal').classList.remove('on');
  applyCurrentProfileToPayers();
  updateHeader();
  renderPersonFilters();
}
function checkAccess(){
  var p=S.profile||{},tier=p.sub_tier||'trial',now=Date.now();
  var pass=false;
  if(tier==='trial') pass=!!p.trial_end && new Date(p.trial_end).getTime()>now;
  if(tier==='standard_59'||tier==='pro_109') pass=!p.valid_until || new Date(p.valid_until).getTime()>now;
  S.hasAccess=pass;
  S.accessReason=pass?'ok':'blocked';
  var pw=document.getElementById('paywall');
  if(pw) pw.classList.toggle('on',!pass);
  return pass;
}
function applyCurrentProfileToPayers(){
  var nm=S.profile&&S.profile.full_name?S.profile.full_name:'ผู้ใช้';
  S.fc.payer=nm; S.fi.rcv=nm;
  var pj=document.getElementById('py-j'),pf=document.getElementById('py-f'),ij=document.getElementById('ip-j'),inf=document.getElementById('ip-f');
  if(pj){ pj.querySelector('.nm').textContent=nm; pj.querySelector('.rl').textContent='คุณ'; pj.classList.add('on','locked'); }
  if(pf) pf.style.display='none';
  if(ij){ ij.querySelector('.nm').textContent=nm; ij.querySelector('.rl').textContent='คุณ'; ij.classList.add('on','locked'); }
  if(inf) inf.style.display='none';
}
async function loadFamilyMembers(){
  if(!S.profile||!S.profile.family_id) return;
  logStep('7. Fetching Family Members...',S.profile.family_id);
  var res=await withTimeout(sb.from('profiles').select('id,full_name').eq('family_id',S.profile.family_id),30000,'โหลดสมาชิกครอบครัว');
  logStep('7. Family members response',{count:res.data&&res.data.length,status:res.status,error:res.error});
  throwSb('profiles family members select',res);
  S.familyMembers=res.data||[];
}
async function getFamilyMembers(){
  await loadFamilyMembers();
  return S.familyMembers;
}
function subscriptionBadge(){
  if(!S.profile) return '';
  var tier=S.profile.sub_tier||'trial';
  var cls=tier==='pro_109'?'pro':tier==='trial'?'warn':'ok';
  return '<span class="badge '+cls+'">'+tierLabel()+'</span>';
}
function withTimeout(promise, ms, label){
  var timer;
  var timeout=new Promise(function(_,reject){
    timer=setTimeout(function(){ reject(new Error((label||'งานนี้')+' ใช้เวลานานเกินไป')); },ms);
  });
  return Promise.race([promise,timeout]).finally(function(){ clearTimeout(timer); });
}
function stopLoading(){ document.getElementById('loading')?.classList.add('off'); }
function showBootstrapRetryError(msg){
  var auth=document.getElementById('auth-screen');
  if(auth&&!S.user) auth.classList.remove('off');
  if(auth&&S.user) auth.classList.add('off');
  toast(msg||'โหลดโปรไฟล์ไม่สำเร็จ กรุณาลองใหม่','err');
  var title=document.getElementById('legal-title');
  var body=document.getElementById('legal-body');
  if(S.user&&title&&body){
    title.textContent='โหลดโปรไฟล์ไม่สำเร็จ';
    body.innerHTML=esc(msg||'โหลดโปรไฟล์ไม่สำเร็จ กรุณาลองใหม่')+'<br><br><button type="button" onclick="retryBootstrap()" class="btn-go">ลองอีกครั้ง</button>';
    document.getElementById('legal-modal').classList.add('on');
    return;
  }
  var e=document.getElementById('auth-err');
  if(e){
    e.innerHTML=esc(msg||'โหลดข้อมูลไม่สำเร็จ')+' <button type="button" onclick="retryBootstrap()" style="margin-left:8px;border:1px solid currentColor;background:transparent;color:inherit;border-radius:8px;padding:4px 8px;font:inherit;cursor:pointer">ลองอีกครั้ง</button>';
    e.classList.add('show');
  }else{
    toast(msg||'โหลดข้อมูลไม่สำเร็จ','err');
  }
}
async function retryBootstrap(){
  var loading=document.getElementById('loading');
  if(loading) loading.classList.remove('off');
  try{
    var sess=await sb.auth.getSession();
    if(sess.data.session){
      S.user=sess.data.session.user;
      S.profile=null;
      bootstrappedUserId=null;
      await onLogin();
    }
  }catch(e){
    console.error('retry bootstrap failed:',e);
    showBootstrapRetryError('ยังโหลดข้อมูลไม่สำเร็จ: '+(e.message||e));
  }finally{
    stopLoading();
  }
}
function logStep(label,data){ console.log('[BX Debug]',label,data||''); }
function logSbError(label,res){
  if(res&&res.error){
    console.error('[BX Supabase Error] '+label,{
      message:res.error.message,
      details:res.error.details,
      hint:res.error.hint,
      code:res.error.code,
      status:res.status,
      raw:res.error
    });
  }
}
function throwSb(label,res){
  logSbError(label,res);
  if(res&&res.error) throw res.error;
}

// ═══════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════

// ── Bootstrap guards ─────────────────────────────────
var isBootstrapping = false;
var bootstrappedUserId = null;
var bootstrapPromise = null;
var _isBootstrapping = false;   // legacy alias
var _lastSessionUid  = null;    // legacy alias
// ─────────────────────────────────────────────────────

window.addEventListener('DOMContentLoaded', async function(){
  try{
    ['f-dt','i-dt','dr-dt'].forEach(function(id){ var e=document.getElementById(id); if(e) e.value=today(); });
    updateAuthButtons();
    sb.auth.onAuthStateChange(async function(event,session){
      try{
        if(session&&session.user){
          var uid=session.user.id;
          if(event==='TOKEN_REFRESHED'&&uid===bootstrappedUserId&&S.profile){
            console.log('[BX Auth] TOKEN_REFRESHED ignored — current user already loaded');
            return;
          }
          if(bootstrapPromise){
            console.log('[BX Auth] onAuthStateChange reused running bootstrap');
            await bootstrapPromise;
            return;
          }
          if(uid===bootstrappedUserId&&S.profile){
            console.log('[BX Auth] onAuthStateChange skipped — same user already loaded');
            return;
          }
          S.user=session.user;
          await onLogin();
        }
      }catch(e){
        console.error('auth state load failed:',e);
        toast('โหลด session ไม่สำเร็จ: '+(e.message||e),'err');
      }finally{
        stopLoading();
      }
    });
    var sess = await sb.auth.getSession();
    if(sess.data.session){
      S.user = sess.data.session.user;
      await onLogin();
    }
  }catch(e){
    console.error('init failed:',e);
    showAuthErr('โหลดแอปไม่สำเร็จ ลองรีเฟรชอีกครั้ง');
    alert('โหลดแอปไม่สำเร็จ: '+(e.message||e));
  }finally{
    stopLoading();
  }
});

async function doLogin(){
  var email=document.getElementById('auth-email').value.trim();
  var pw=document.getElementById('auth-pw').value;
  var btn=document.getElementById('login-btn');
  var loading=document.getElementById('loading');
  if(!email||!pw){ showAuthErr('กรุณากรอกอีเมลและรหัสผ่าน'); return; }
  if(authMode==='signup'&&!hasPdpaConsent()){ showAuthErr('กรุณายอมรับข้อตกลงและนโยบายความเป็นส่วนตัวก่อนสมัคร'); return; }
  btn.textContent=authMode==='signup'?'⏳ กำลังสมัคร...':'⏳ กำลังเข้าสู่ระบบ...'; btn.disabled=true;
  S._loginBusy=true;
  bootstrappedUserId=null; _lastSessionUid=null; // allow fresh onLogin for explicit sign-in
  if(loading) loading.classList.remove('off');
  try{
    var authPromise = authMode==='signup'
      ? sb.auth.signUp({email:email,password:pw})
      : sb.auth.signInWithPassword({email:email, password:pw});
    var res = await withTimeout(authPromise,20000,'เข้าสู่ระบบ Supabase');
    if(res.error){
      showAuthErr(authMode==='signup'?res.error.message:'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      btn.textContent=authMode==='signup'?'สมัครสมาชิก':'เข้าสู่ระบบ'; btn.disabled=false;
      return;
    }
    S.user = res.data.user;
    await onLogin();
  }catch(e){
    console.error('email auth failed:',e);
    showAuthErr((e.message||'เข้าสู่ระบบไม่สำเร็จ')+' — ถ้ายังเป็นซ้ำให้เช็ก Supabase Auth Email provider / network');
  }finally{
    btn.textContent=authMode==='signup'?'สมัครสมาชิก':'เข้าสู่ระบบ'; btn.disabled=false;
    S._loginBusy=false;
    if(loading) loading.classList.add('off');
  }
}
function toggleAuthMode(){
  authMode=authMode==='login'?'signup':'login';
  document.getElementById('login-btn').textContent=authMode==='signup'?'สมัครสมาชิก':'เข้าสู่ระบบ';
  document.getElementById('auth-toggle-btn').textContent=authMode==='signup'?'มีบัญชีแล้ว เข้าสู่ระบบ':'สมัครสมาชิกใหม่';
  updateAuthButtons();
}
async function loginWithGoogle(){
  if(!hasPdpaConsent()){ showAuthErr('กรุณายอมรับข้อตกลงและนโยบายความเป็นส่วนตัวก่อนใช้ Google'); return; }
  try{
    var res=await sb.auth.signInWithOAuth({provider:'google',options:{redirectTo:window.location.origin+window.location.pathname}});
    if(res.error) showAuthErr(res.error.message);
  }catch(e){
    console.error('google auth failed:',e);
    showAuthErr(e.message||'เข้าสู่ระบบด้วย Google ไม่สำเร็จ');
  }
}
function hasPdpaConsent(){ var c=document.getElementById('pdpa-consent'); return !!(c&&c.checked); }
function updateAuthButtons(){
  var signup=document.getElementById('login-btn'), google=document.getElementById('google-btn');
  var ok=hasPdpaConsent();
  if(signup) signup.disabled=(authMode==='signup'&&!ok);
  if(google) google.disabled=!ok;
}
function openLegalModal(type){
  var title=document.getElementById('legal-title'), body=document.getElementById('legal-body');
  if(type==='privacy'){
    title.textContent='นโยบายความเป็นส่วนตัว';
    body.textContent='Placeholder: จะเพิ่มรายละเอียดการเก็บ ใช้ และดูแลข้อมูลส่วนบุคคลตาม PDPA ในขั้นตอนถัดไป';
  }else{
    title.textContent='ข้อตกลงการใช้งาน';
    body.textContent='Placeholder: จะเพิ่มเงื่อนไขการใช้งาน บริการสมาชิก และข้อจำกัดความรับผิดชอบในขั้นตอนถัดไป';
  }
  document.getElementById('legal-modal').classList.add('on');
}
function showAuthErr(msg){
  var e=document.getElementById('auth-err'); e.textContent=msg; e.classList.add('show');
  setTimeout(function(){ e.classList.remove('show'); },3000);
}
async function onLogin(){
  if(!S.user) return Promise.resolve();
  if(bootstrapPromise){
    console.log('[BX Auth] onLogin() reused running bootstrap');
    return bootstrapPromise;
  }
  if(bootstrappedUserId===S.user.id&&S.profile){
    console.log('[BX Auth] onLogin() skipped — user already bootstrapped');
    stopLoading();
    return Promise.resolve();
  }
  bootstrapPromise=(async function(){
    isBootstrapping=true; _isBootstrapping=true;
    document.getElementById('auth-screen').classList.add('off');
    try{
      logStep('onLogin start');
      var profile=await ensureProfile();
      await ensureFamily();
      profile=S.profile||profile;
      logStep('onLogin checkAccess');
      checkAccess();
      if(!S.profile.full_name){
        document.getElementById('onboard-name').value=(S.user.user_metadata&&S.user.user_metadata.full_name)||'';
        document.getElementById('onboard-modal').classList.add('on');
      }
      applyCurrentProfileToPayers();
      updateHeader();
      renderPersonFilters();
      renderCats(); renderPays(); renderIncc(); renderInch();
      renderHist(); renderCR(); renderDash(); renderIncSum(); renderSetStats(); renderAddSummary();
      document.getElementById('set-user').textContent=S.user?S.user.email:'';
      await loadFromSupabase(profile);
      bootstrappedUserId=S.user.id; _lastSessionUid=S.user.id;
    }catch(e){
      console.error('profile bootstrap failed raw:',{
        message:e&&e.message,
        details:e&&e.details,
        hint:e&&e.hint,
        code:e&&e.code,
        status:e&&e.status,
        raw:e
      });
      showBootstrapRetryError('โหลดโปรไฟล์ไม่สำเร็จ กรุณาลองอีกครั้ง');
    }finally{
      stopLoading();
      isBootstrapping=false; _isBootstrapping=false;
      bootstrapPromise=null;
    }
  })();
  return bootstrapPromise;
}
async function doLogout(){
  if(!confirm('ออกจากระบบ?')) return;
  await sb.auth.signOut();
  S.user=null;
  // PATCH v4.1.2: reset boot guards so next login runs cleanly
  isBootstrapping=false; _isBootstrapping=false;
  bootstrappedUserId=null; _lastSessionUid=null;
  bootstrapPromise=null;
  document.getElementById('auth-screen').classList.remove('off');
  toast('ออกจากระบบแล้ว');
}

// ═══════════════════════════════════════════════════════
// SUPABASE DATA
// ═══════════════════════════════════════════════════════
async function loadFromSupabase(preloadedProfile){
  if(loadFromSupabase._running) return;
  loadFromSupabase._running = true;
  setDot('spin','โหลด...');
  try {
    logStep('8. loadFromSupabase start');
    // ── PATCH v4.1.2: use pre-fetched profile when available ──
    if(preloadedProfile && preloadedProfile.family_id){
      logStep('8. Using pre-fetched profile — skipping ensureProfile/ensureFamily');
      S.profile = preloadedProfile;
    } else {
      await ensureProfile();
      await ensureFamily();
    }
    // ─────────────────────────────────────────────────────────
    if(!checkAccess()){ setDot('off','Paywall'); return; }
    var fid=S.profile.family_id;
    logStep('9. Family ID for data load',fid);
    S.expenses=[]; S.incomes=[]; S.crStatus={}; S.crInfo={}; S.customCr=[];
    logStep('10. Fetching family data in parallel...');
    var loads=await Promise.allSettled([
      withTimeout(sb.from('expenses').select('*').eq('family_id',fid).order('date',{ascending:false}),6000,'โหลด expenses'),
      withTimeout(sb.from('incomes').select('*').eq('family_id',fid).order('date',{ascending:false}),6000,'โหลด incomes'),
      withTimeout(sb.from('credits').select('*').eq('family_id',fid).order('date',{ascending:false}),6000,'โหลด credits'),
      withTimeout(sb.from('credit_info').select('*').eq('family_id',fid),6000,'โหลด credit_info'),
      withTimeout(sb.from('profiles').select('id,full_name').eq('family_id',fid),6000,'โหลดสมาชิกครอบครัว')
    ]);
    function tableData(idx,label){
      var r=loads[idx];
      if(r.status==='rejected'){
        console.warn('[BX Warn] '+label+' load failed:',r.reason);
        return [];
      }
      logStep(label+' response',{count:r.value.data&&r.value.data.length,status:r.value.status,error:r.value.error});
      if(r.value.error){
        logSbError(label+' select',r.value);
        console.warn('[BX Warn] '+label+' fallback to []');
        return [];
      }
      return r.value.data||[];
    }
    var expRows=tableData(0,'expenses');
    var incRows=tableData(1,'incomes');
    var crRows=tableData(2,'credits');
    var ciRows=tableData(3,'credit_info');
    S.familyMembers=tableData(4,'profiles family members');
    expRows.forEach(function(r,i){
      S.expenses.push({
        id:r.id||('sb'+Date.now()+i), date:r.date||'',
        detail:r.detail||'-', category:cleanLabel(r.category)||'',
        catC:r.cat_color||'#7c6ef5', payment:cleanLabel(r.payment)||'',
        amount:Number(r.amount||0), paidBy:r.paid_by||'', user_id:r.user_id||'', createdAt:r.created_at||''
      });
    });
    S.expenses.sort(function(a,b){ return (b.date||'').localeCompare(a.date||''); });
    incRows.forEach(function(r,i){
      S.incomes.push({
        id:r.id||('si'+Date.now()+i), date:r.date||'',
        detail:r.detail||'-', category:cleanLabel(r.category)||'',
        channel:cleanLabel(r.channel)||'', amount:Number(r.amount||0), receiver:r.receiver||'', user_id:r.user_id||''
      });
    });
    S.incomes.sort(function(a,b){ return (b.date||'').localeCompare(a.date||''); });
    var mo=thisMo();
    crRows.forEach(function(r){
      var found=allCR().find(function(c){ return c.n===(r.credit_name||r.name||''); });
      if(!found) return;
      if((r.date||'').slice(0,7)===mo){
        var existing=S.crStatus[found.id]||{};
        var curKey=String(r.date||'')+'T'+String(r.created_at||'');
        var oldKey=String(existing.date||'')+'T'+String(existing.baseAt||'');
        if(!existing.date||curKey>=oldKey){
          S.crStatus[found.id]={paid:true,amount:Number(r.amount||0),baseRemaining:Number(r.remaining||0),baseAt:r.created_at||'',matchedUsed:0,remaining:Number(r.remaining||0),date:r.date||''};
        }
      }
    });
    ciRows.forEach(function(r){
      var found=allCR().find(function(c){ return c.n===(r.credit_name||r.name||''); });
      if(!found){
        found={id:'cr_'+String(r.credit_name||r.name||Date.now()).toLowerCase().replace(/\W+/g,'_'),n:r.credit_name||r.name||'Credit',t:r.type||'revolving',ico:'CR',rate:Number(r.rate||0)};
        S.customCr.push(found);
      } else {
        found.t=r.type||found.t;
      }
      if(!S.crInfo[found.id]||!S.crInfo[found.id].limit){
        S.crInfo[found.id]={
          limit:Number(r.credit_limit||r.limit||0), rate:Number(r.rate||found.rate||0),
          minPay:Number(r.min_pay||r.minPay||0),
          billCycle:r.bill_cycle||r.billCycle||'',
          dueDate:r.due_date||r.dueDate||''
        };
      }
    });
    loadCreditOptions();
    if(Object.keys(S.crInfo||{}).length>0) document.getElementById('credit-setup-modal').classList.remove('on');
    recomputeMatchedCreditBalances();
    renderPersonFilters();
    sv();
    renderHist(); renderCR(); renderDash(); renderIncSum(); renderSetStats(); renderAddSummary();
    setDot('ok','🔄 Synced');
  } catch(e){
    console.error('Supabase load error raw:',{
      message:e&&e.message,
      details:e&&e.details,
      hint:e&&e.hint,
      code:e&&e.code,
      raw:e
    });
    setDot('off','ออฟไลน์');
    toast('โหลดข้อมูลจาก Supabase ไม่สำเร็จ ใช้ข้อมูลในเครื่องไปก่อน','err');
  } finally {
    loadFromSupabase._running = false;
    document.getElementById('loading')?.classList.add('off');
  }
}
async function loadFamilyData(){ return loadFromSupabase(); }

async function syncNow(){
  toast('กำลัง sync...','info');
  await loadFromSupabase();
}

async function saveToSupabase(table, data){
  if(!S.user){ console.warn('saveToSupabase: no user session'); return; }
  if(!S.profile||!S.profile.family_id){ await ensureProfile(); await ensureFamily(); }
  if(!S.profile||!S.profile.family_id){
    console.error('[BX Error]',new Error('missing family_id before save'));
    return toast('ยังไม่พบ family_id กรุณาลองใหม่อีกครั้ง','err');
  }
  if(!checkAccess()) return toast('กรุณาสมัครสมาชิก 59฿','err');
  try {
    var row = Object.assign({user_id: S.user.id,family_id:S.profile.family_id}, data);
    if(table==='expenses'||table==='incomes'||table==='credits'){
      if(!validateTxnInput(row)) return;
    } else if(table==='credit_info'){
      if(!validateTxnInput(row,{requireDate:false,requireAmount:false})) return;
    }
    if(table!=='credit_info'&&!row.created_at) row.created_at = new Date().toISOString();
    var res;
    if(table==='credit_info'){
      var updateRow = Object.assign({}, row, {updated_at:new Date().toISOString()});
      delete updateRow.id;
      res = await sb.from(table)
        .update(updateRow)
        .eq('family_id',S.profile.family_id)
        .eq('credit_name',row.credit_name)
        .select('id');
      if(!res.error && (!res.data || !res.data.length)){
        if(!row.user_id) row.user_id = S.user.id;
        if(!row.family_id) row.family_id = S.profile.family_id;
        row.id = makeRowId();
        res = await sb.from(table).insert([row]);
      }
    } else {
      if(!row.id) row.id = makeRowId();
      res = await sb.from(table).insert([row]);
    }
    if(res.error){
      console.error('Supabase insert error ['+table+']:', res.error.message, res.error.details);
      toast('บันทึก DB ไม่สำเร็จ: '+res.error.message,'err');
    } else {
      console.log('Supabase saved to '+table);
    }
  } catch(e){
    console.error('Supabase save exception:', e&&e.message?e.message:String(e));
  }
}

// ═══════════════════════════════════════════════════════
// TABS
// ═══════════════════════════════════════════════════════
function goTab(id,btn){
  var titles={add:'Add Transaction',inc:'Income',hist:'History',dash:'Dashboard',cr:'Credits','debt-planner':'Debt Planner',set:'Settings'};
  var titleEl=document.getElementById('topbar-title');
  if(titleEl) titleEl.textContent=titles[id]||'BridgeX.Finance';
  document.querySelectorAll('.pg').forEach(function(p){ p.classList.remove('on'); });
  document.querySelectorAll('.tbtn').forEach(function(b){ b.classList.remove('on'); });
  document.getElementById('pg-'+id).classList.add('on');
  if(btn) btn.classList.add('on');
  toggleSidebar(false);
  if(id==='hist') renderHist();
  if(id==='dash') renderDash();
  if(id==='cr')   renderCR();
  if(id==='debt-planner') renderSmartDebt();
  if(id==='inc')  renderIncSum();
  if(id==='set')  renderSetStats();
  if(id==='add')  renderAddSummary();
}

function toggleSidebar(force){
  var open=typeof force==='boolean'?force:!document.body.classList.contains('sidebar-open');
  document.body.classList.toggle('sidebar-open',open);
}

// ═══════════════════════════════════════════════════════
// CHIPS
// ═══════════════════════════════════════════════════════
function mkChips(arr,selId,wrapId,onPick){
  var w=document.getElementById(wrapId); if(!w) return; w.innerHTML='';
  arr.forEach(function(c){
    var b=document.createElement('button'); b.className='chip'+(selId===c.id?' on':'');
    b.textContent=c.l; b.onclick=function(){ onPick(c.id); }; w.appendChild(b);
  });
}
function renderCats(){
  var w=document.getElementById('cat-chips'); if(!w) return; w.innerHTML='';
  var iconMap={food:'restaurant',drink:'local_cafe',snack:'bakery_dining',cat:'pets',shop:'shopping_bag',act:'sports_esports',trans:'directions_car',place:'home',inv:'trending_up',health:'medical_services',bill:'receipt_long',edu:'school',donate:'volunteer_activism',travel:'flight',fam:'family_restroom',other:'more_horiz'};
  S.cats.forEach(function(c){
    var b=document.createElement('button');
    b.className='chip'+(S.fc.cat===c.id?' on':'');
    b.dataset.icon=iconMap[c.id]||'•';
    b.textContent=String(c.l||'').replace(/^[^\wก-๙]+/,'').trim()||c.l;
    b.onclick=function(){ S.fc.cat=c.id; renderCats(); };
    w.appendChild(b);
  });
}
function renderPays(){
  var w=document.getElementById('pay-chips'); if(!w) return; w.innerHTML='';
  S.pays.forEach(function(p){
    var b=document.createElement('button'); b.className='chip'+(S.fc.pay===p.id?' on':'');
    var icon=p.id==='cash'?'payments':p.id==='xfer'?'account_balance':p.id.indexOf('crpay_')===0?'credit_card':'account_balance_wallet';
    b.dataset.icon=icon;
    b.textContent=p.l;
    b.onclick=function(){ S.fc.pay=p.id; renderPays(); };
    w.appendChild(b);
  });
}
function renderIncc(){
  var w=document.getElementById('incc-chips'); if(!w) return; w.innerHTML='';
  var iconMap={sal:'work',bon:'redeem',free:'business_center',inv:'trending_up',oth:'more_horiz'};
  S.incc.forEach(function(c){
    var b=document.createElement('button');
    b.className='chip'+(S.fi.cat===c.id?' on':'');
    b.dataset.icon=iconMap[c.id]||(String(c.l||'').indexOf('ลงทุน')>-1?'trending_up':String(c.l||'').indexOf('โบนัส')>-1?'redeem':String(c.l||'').indexOf('เงินเดือน')>-1?'work':'more_horiz');
    b.textContent=String(c.l||'').replace(/^[^\wก-๙]+/,'').trim()||c.l;
    b.onclick=function(){ S.fi.cat=c.id; renderIncc(); };
    w.appendChild(b);
  });
}
function renderInch(){
  var w=document.getElementById('inch-chips'); if(!w) return; w.innerHTML='';
  S.inch.forEach(function(c){
    var b=document.createElement('button');
    b.className='chip'+(S.fi.ch===c.id?' on':'');
    b.dataset.icon=c.id==='cash'?'payments':c.id==='prompt'?'qr_code_2':'account_balance_wallet';
    b.textContent=String(c.l||'').replace(/^[^\wก-๙]+/,'').trim()||c.l;
    b.onclick=function(){ S.fi.ch=c.id; renderInch(); };
    w.appendChild(b);
  });
}
function selP(n){ if(S.profile&&S.profile.full_name){ S.fc.payer=S.profile.full_name; return; } S.fc.payer=n; document.getElementById('py-j').classList.toggle('on',n==='เจ'); document.getElementById('py-f').classList.toggle('on',n==='แฟง'); }
function selIP(n){ if(S.profile&&S.profile.full_name){ S.fi.rcv=S.profile.full_name; return; } S.fi.rcv=n; document.getElementById('ip-j').classList.toggle('on',n==='เจ'); document.getElementById('ip-f').classList.toggle('on',n==='แฟง'); }
function addOpt(t){
  var labels={'cat':'ชื่อหมวดหมู่ใหม่:','pay':'ชื่อช่องทางใหม่:','inc-cat':'หมวดหมู่รายรับ:','inc-ch':'ช่องทางรับเงิน:'};
  var v=prompt(labels[t]||'ชื่อ:'); if(!v) return;
  var id='x'+Date.now();
  if(t==='cat'){ S.cats.push({id:id,l:v,c:'#7c6ef5'}); renderCats(); }
  else if(t==='pay'){ S.pays.push({id:id,l:v}); renderPays(); }
  else if(t==='inc-cat'){ S.incc.push({id:id,l:v,c:'#22c98a'}); renderIncc(); }
  else if(t==='inc-ch'){ S.inch.push({id:id,l:v}); renderInch(); }
  sv();
}
function loadCreditOptions(){
  var base=DEF_PAYS.slice();
  Object.keys(S.crInfo||{}).forEach(function(crId){
    var cr=allCR().find(function(c){ return c.id===crId; });
    if(!cr||cr.t!=='revolving') return;
    if(!base.some(function(p){ return p.l===cr.n; })) base.push({id:'crpay_'+cr.id,l:cr.n});
    PAY2CR[cr.n]=cr.id;
  });
  S.pays=base;
  if(S.fc.pay && !S.pays.some(function(p){ return p.id===S.fc.pay; })) S.fc.pay='';
  renderPays();
}
function renderPersonFilters(){
  var names={};
  (S.familyMembers||[]).forEach(function(p){ if(p.full_name) names[p.full_name]=1; });
  S.expenses.forEach(function(e){ if(e.paidBy) names[e.paidBy]=1; });
  function fill(wrapId,setter,current){
    var wrap=document.getElementById(wrapId); if(!wrap) return;
    Array.from(wrap.querySelectorAll('.person-chip')).forEach(function(el){ el.remove(); });
    Object.keys(names).sort().forEach(function(n){
      var b=document.createElement('div'); b.className='fchip person-chip'+(current==='person:'+n?' on':'');
      b.textContent=n;
      b.onclick=function(){ setter('person:'+n,b); };
      wrap.appendChild(b);
    });
  }
  fill('hist-filters',setHF,hf);
}

// ═══════════════════════════════════════════════════════
// SUBMIT EXPENSE
// ═══════════════════════════════════════════════════════
async function submitExp(){
  if(!checkAccess()) return toast('กรุณาสมัครสมาชิก 59฿','err');
  if(S.profile&&S.profile.full_name) S.fc.payer=S.profile.full_name;
  var amt=parseFloat(document.getElementById('f-amt').value);
  var det=document.getElementById('f-det').value.trim();
  var dt=document.getElementById('f-dt').value;
  if(!amt||amt<=0) return toast('ใส่จำนวนเงินด้วย','err');
  if(!S.fc.cat) return toast('เลือกหมวดหมู่ด้วย','err');
  if(!S.fc.pay) return toast('เลือกช่องทางชำระด้วย','err');
  if(!S.fc.payer) return toast('เลือกผู้จ่ายด้วย','err');
  if(!dt) return toast('เลือกวันที่ด้วย','err');
  var cat=S.cats.find(function(c){ return c.id===S.fc.cat; });
  var pay=S.pays.find(function(p){ return p.id===S.fc.pay; });
  var checkRow={date:dt,detail:det,category:cat&&cat.l,payment:pay&&pay.l,amount:amt,paidBy:S.fc.payer};
  if(!validateTxnInput(checkRow)) return;
  det=checkRow.detail;
  var rowId=makeRowId();
  var ex={id:rowId,date:dt,detail:det||'-',category:cat.l,catId:cat.id,catC:cat.c||'#7c6ef5',payment:pay.l,amount:amt,paidBy:S.fc.payer,user_id:S.user&&S.user.id||'',createdAt:new Date().toISOString()};
  S.expenses.unshift(ex);
  autoMatch(ex);
  // Reset form
  document.getElementById('f-amt').value='';
  document.getElementById('f-det').value='';
  document.getElementById('f-dt').value=today();
  S.fc={cat:'',pay:'',payer:''};
  if(S.profile&&S.profile.full_name) S.fc.payer=S.profile.full_name;
  renderCats(); renderPays();
  applyCurrentProfileToPayers();
  renderPersonFilters();
  renderHist();
  renderDash();
  renderAddSummary();
  showSuccessModal('฿ '+fmt2(amt),[
    {icon:'calendar_today',label:'วันที่',value:ex.date},
    {icon:'category',label:'หมวดหมู่',value:ex.category},
    {icon:'account_balance_wallet',label:'ช่องทางจ่ายเงิน',value:ex.payment},
    {icon:'notes',label:'Note',value:ex.detail}
  ]);
  checkBudgetWarning(ex);
  // Save to Supabase
  saveToSupabase('expenses',{id:rowId,date:ex.date,detail:ex.detail,category:ex.category,payment:ex.payment,amount:ex.amount,paid_by:ex.paidBy,created_at:ex.createdAt});
}

function resetExpenseForm(){
  document.getElementById('f-amt').value='';
  document.getElementById('f-det').value='';
  document.getElementById('f-dt').value=today();
  S.fc={cat:'',pay:'',payer:S.profile&&S.profile.full_name?S.profile.full_name:''};
  renderCats();
  renderPays();
  applyCurrentProfileToPayers();
}

function renderAddSummary(){
  var totalEl=document.getElementById('add-sum-today'),bar=document.getElementById('add-sum-bar'),budget=document.getElementById('add-sum-budget'),list=document.getElementById('add-recent-list');
  if(!totalEl||!bar||!budget||!list) return;
  var td=today();
  var todayItems=S.expenses.filter(function(e){ return e.date===td; });
  var total=todayItems.reduce(function(s,e){ return s+Number(e.amount||0); },0);
  var dailyBudget=2000;
  var pct=Math.min(100,Math.round(total/dailyBudget*100));
  totalEl.textContent='฿ '+fmt2(total);
  bar.style.width=pct+'%';
  budget.textContent=pct+'% of daily budget';
  var recent=S.expenses.slice().sort(function(a,b){ return String(b.date||'').localeCompare(String(a.date||'')); }).slice(0,3);
  if(!recent.length){
    list.innerHTML='<div style="font-size:13px;color:#c9c4d7;line-height:1.6">ยังไม่มีรายการล่าสุด</div>';
    return;
  }
  list.innerHTML=recent.map(function(e){
    var cat=String(e.category||'');
    var iconMap={'อาหาร':'restaurant','เครื่องดื่ม':'local_cafe','ขนม':'bakery_dining','สัตว์เลี้ยง':'pets','ช้อปปิ้ง':'shopping_bag','กิจกรรม':'sports_esports','การเดินทาง':'directions_car','สถานที่':'home','ลงทุน':'trending_up','สุขภาพ':'medical_services','บิล':'receipt_long','การศึกษา':'school','บริจาค':'volunteer_activism','ท่องเที่ยว':'flight','ครอบครัว':'family_restroom','อื่น':'more_horiz'};
    var key=Object.keys(iconMap).find(function(k){ return cat.indexOf(k)>-1; });
    var ico=key?iconMap[key]:'receipt_long';
    return '<div class="recent-item"><div class="recent-left"><div class="recent-ico" data-icon="'+ico+'"></div><div style="min-width:0"><div class="recent-name">'+esc(e.detail||'-')+'</div><div class="recent-meta">'+esc(e.category||'')+' • '+esc(e.payment||'')+'</div></div></div><div class="recent-amt">- ฿ '+fmt(e.amount)+'</div></div>';
  }).join('');
}

function autoMatch(ex){
  var crId=PAY2CR[ex.payment]||PAY2CR[ex.payment.replace(/^[^\s]+\s/,'')];
  if(!crId) return;
  if(!ex.date||ex.date.slice(0,7)!==thisMo()) return;
  var st=S.crStatus[crId]||{paid:false,amount:0,remaining:0,date:''};
  if(st.baseRemaining==null) st.baseRemaining = st.remaining||0;
  if(!st.baseAt) st.baseAt = new Date().toISOString();
  st.matchedUsed = (st.matchedUsed||0)+ex.amount;
  st.remaining=Math.max(0,(parseFloat(st.baseRemaining)||0)-st.matchedUsed);
  S.crStatus[crId]=st;
  recomputeMatchedCreditBalances();
  sv();
}

// ═══════════════════════════════════════════════════════
// HISTORY
// ═══════════════════════════════════════════════════════
var hf='all';
function setHF(f,el){ hf=f; document.querySelectorAll('#pg-hist .fchip').forEach(function(c){ c.classList.remove('on'); }); el.classList.add('on'); renderHist(); }
// Track which day-groups are open (default open)
var openDays = {};
var renderHistRaf=0;
function pruneOpenDays(visibleDays){
  var cutoff=Date.now()-60*86400000;
  Object.keys(openDays).forEach(function(d){
    if(visibleDays&&visibleDays[d]) return;
    var t=validCreatedTime(d+'T00:00:00');
    if(!t||t<cutoff) delete openDays[d];
  });
}
function renderHist(){
  if(renderHistRaf) cancelAnimationFrame(renderHistRaf);
  renderHistRaf=requestAnimationFrame(function(){ renderHistRaf=0; renderHistNow(); });
}
function renderHistNow(){
  var list=document.getElementById('hist-list'),kpis=document.getElementById('hist-kpis'); if(!list) return; list.innerHTML='';
  var visibleDays={};
  var mo=thisMo();
  var items=S.expenses.slice();
  if(hf==='mo') items=items.filter(function(e){ return e.date&&e.date.slice(0,7)===mo; });
  if(hf.indexOf('person:')===0){ var pn=hf.slice(7); items=items.filter(function(e){ return e.paidBy===pn; }); }
  var now=new Date(), weekAgo=new Date(now.getTime()-6*86400000);
  var weekItems=items.filter(function(e){ return e.date&&new Date(e.date+'T00:00:00')>=weekAgo; });
  var weekTot=weekItems.reduce(function(s,e){ return s+Number(e.amount||0); },0);
  var catTotals={};
  items.forEach(function(e){ var c=e.category||'ไม่ระบุ'; catTotals[c]=(catTotals[c]||0)+Number(e.amount||0); });
  var topCat=Object.keys(catTotals).sort(function(a,b){ return catTotals[b]-catTotals[a]; })[0]||'-';
  if(kpis){
    kpis.innerHTML='<div class="hist-kpi g"><div class="hist-kpi-top"><span>ใช้จ่ายสัปดาห์นี้</span><span class="material-symbols-outlined">trending_down</span></div><div class="hist-kpi-val">฿ '+fmt(weekTot)+'</div><div class="hist-kpi-sub">'+weekItems.length+' รายการใน 7 วันล่าสุด</div></div>'+
      '<div class="hist-kpi"><div class="hist-kpi-top"><span>รายการสูงสุด</span><span class="material-symbols-outlined">category</span></div><div class="hist-kpi-val">฿ '+fmt(catTotals[topCat]||0)+'</div><div class="hist-kpi-sub">'+esc(topCat)+'</div></div>'+
      '<div class="hist-kpi a"><div class="hist-kpi-top"><span>จำนวนธุรกรรม</span><span class="material-symbols-outlined">receipt_long</span></div><div class="hist-kpi-val">'+items.length+'</div><div class="hist-kpi-sub">รายการตามตัวกรองปัจจุบัน</div></div>';
  }
  if(!items.length){ pruneOpenDays(visibleDays); list.innerHTML='<div class="hist-empty"><p>ยังไม่มีรายการ</p></div>'; return; }
  var catIconMap={'อาหาร':'restaurant','เครื่องดื่ม':'local_cafe','ขนม':'bakery_dining','สัตว์เลี้ยง':'pets','ช้อปปิ้ง':'shopping_bag','กิจกรรม':'sports_esports','การเดินทาง':'directions_car','เดินทาง':'directions_car','สถานที่':'home','ลงทุน':'trending_up','สุขภาพ':'medical_services','บิล':'receipt_long','การศึกษา':'school','บริจาค':'volunteer_activism','ท่องเที่ยว':'flight','ครอบครัว':'family_restroom','อื่น':'more_horiz'};
  function catIcon(cat){
    cat=String(cat||'');
    var k=Object.keys(catIconMap).find(function(x){ return cat.indexOf(x)>-1; });
    return k?catIconMap[k]:'receipt_long';
  }
  function payMatIcon(pay){
    pay=String(pay||'');
    if(pay.indexOf('เงินสด')>-1) return 'payments';
    if(pay.indexOf('โอน')>-1||pay.indexOf('บัญชี')>-1) return 'account_balance';
    if(pay.indexOf('พร้อม')>-1) return 'qr_code_2';
    if(pay.indexOf('Credit')>-1||pay.indexOf('KTC')>-1||pay.indexOf('AEON')>-1||pay.indexOf('Bank')>-1) return 'credit_card';
    return 'account_balance_wallet';
  }
  function personInitial(name){ name=String(name||'?').trim(); return (name.charAt(0)||'?').toUpperCase(); }
  function dateLabel(d){
    if(!d) return '-';
    try{ return new Date(d+'T00:00:00').toLocaleDateString('th-TH',{day:'2-digit',month:'short',year:'numeric'}); }
    catch(e){ return d; }
  }
  // Group by month
  var monthGrps={};
  items.forEach(function(e){ var k=(e.date||'').slice(0,7); if(!monthGrps[k]) monthGrps[k]=[]; monthGrps[k].push(e); });
  Object.keys(monthGrps).sort(function(a,b){ return b.localeCompare(a); }).forEach(function(moKey){
    var moItems=monthGrps[moKey];
    var moTot=moItems.reduce(function(s,e){ return s+e.amount; },0);
    var moDiv=document.createElement('div'); moDiv.className='hist-month';
    var moHdr=document.createElement('div'); moHdr.className='hist-month-title';
    moHdr.textContent=thaiMo(moKey)+' · ฿ '+fmt(moTot)+' ('+moItems.length+' รายการ)';
    moDiv.appendChild(moHdr);
    // Group by day inside month
    var dayGrps={};
    moItems.forEach(function(e){ var k=e.date||'unknown'; if(!dayGrps[k]) dayGrps[k]=[]; dayGrps[k].push(e); });
    Object.keys(dayGrps).sort(function(a,b){ return b.localeCompare(a); }).forEach(function(dayKey){
      visibleDays[dayKey]=1;
      var dayItems=dayGrps[dayKey];
      var dayTot=dayItems.reduce(function(s,e){ return s+e.amount; },0);
      var isOpen=openDays[dayKey]!==false;
      var dFull=dayKey&&dayKey!=='unknown'?new Date(dayKey).toLocaleDateString('th-TH',{weekday:'short',day:'numeric',month:'short'}):'ไม่ระบุวัน';
      // Day header
      var dayHdr=document.createElement('div');
      dayHdr.className='hist-day-head';
      dayHdr.innerHTML='<div class="hist-day-left"><span class="hist-day-name">'+esc(dFull)+'</span><span class="hist-day-count">'+dayItems.length+' รายการ</span></div><div class="hist-day-right"><span class="hist-day-total">฿ '+fmt(dayTot)+'</span><span class="day-chev" style="transition:transform .25s;display:inline-block;transform:'+(isOpen?'rotate(180deg)':'rotate(0deg)')+'">▾</span></div>';
      // Day body
      var dayBody=document.createElement('div');
      dayBody.className='hist-table-wrap';
      dayBody.style.maxHeight=isOpen?'9999px':'0';
      var scroll=document.createElement('div'); scroll.className='hist-table-scroll';
      var table=document.createElement('table'); table.className='hist-table';
      table.innerHTML='<thead><tr><th>วันที่</th><th>รายละเอียด</th><th>หมวดหมู่</th><th>ช่องทางชำระ</th><th style="text-align:right">จำนวนเงิน</th><th style="text-align:center">ผู้จ่าย</th><th></th></tr></thead><tbody></tbody>';
      var tbody=table.querySelector('tbody');
      dayItems.forEach(function(e){
        var row=document.createElement('tr');
        row.style.setProperty('--hist-cat-color',e.catC||'#c7bfff');
        row.innerHTML='<td><div class="hist-date">'+esc(dateLabel(e.date))+'</div></td>'+
          '<td><div class="hist-detail-name">'+esc(e.detail||'-')+'</div><div class="hist-detail-sub">'+esc(e.payment||'')+'</div></td>'+
          '<td><div class="hist-cat"><span class="material-symbols-outlined">'+catIcon(e.category)+'</span><span>'+esc(e.category||'-')+'</span></div></td>'+
          '<td><div class="hist-pay"><span class="material-symbols-outlined">'+payMatIcon(e.payment)+'</span><span>'+esc(e.payment||'-')+'</span></div></td>'+
          '<td class="hist-amount">฿ '+fmt(e.amount)+'</td>'+
          '<td style="text-align:center"><span class="hist-person">'+esc(personInitial(e.paidBy))+'</span></td>'+
          '<td style="text-align:right"><button class="hist-del" onclick="delEx(this.dataset.id)" data-id="'+e.id+'">×</button></td>';
        tbody.appendChild(row);
      });
      scroll.appendChild(table);
      dayBody.appendChild(scroll);
      // Toggle
      (function(dk,hdr,body){
        hdr.onclick=function(){
          var wasOpen=(openDays[dk]!==false);
          openDays[dk]=!wasOpen;
          body.style.maxHeight=(!wasOpen)?'9999px':'0';
          var chev=hdr.querySelector('.day-chev');
          if(chev) chev.style.transform=(!wasOpen)?'rotate(180deg)':'rotate(0deg)';
        };
      })(dayKey,dayHdr,dayBody);
      moDiv.appendChild(dayHdr);
      moDiv.appendChild(dayBody);
    });
    list.appendChild(moDiv);
  });
  pruneOpenDays(visibleDays);
}
async function delEx(idOrEl){
  var id=typeof idOrEl==='object'?idOrEl.dataset.id:idOrEl;
  // Confirm dialog
  if(!confirm('ลบรายการนี้ออกจากฐานข้อมูล?\n\nการลบไม่สามารถย้อนกลับได้')) return;
  var backup = S.expenses.find(function(e){ return String(e.id)===String(id); });
  // Remove from local state immediately (optimistic)
  S.expenses=S.expenses.filter(function(e){ return String(e.id)!==String(id); });
  renderHist(); renderDash(); renderAddSummary();
  // Delete from Supabase
  if(S.user){
    try{
      var q=sb.from('expenses').delete().eq('id', String(id)).eq('user_id',S.user.id);
      if(S.profile&&S.profile.family_id) q=q.eq('family_id',S.profile.family_id);
      var res=await q;
      if(res.error){
        if(backup){
          S.expenses.unshift(backup);
          renderHist(); renderDash(); renderAddSummary();
        }
        toast('ลบไม่สำเร็จ กรุณาลองใหม่','err');
      } else {
        toast('ลบรายการแล้ว','ok');
      }
    }catch(e){ toast('เกิดข้อผิดพลาด: '+(e.message||e),'err'); }
  }
}

// ═══════════════════════════════════════════════════════
// CREDIT TAB
// ═══════════════════════════════════════════════════════
var crf='overview', activeCrId='', activeInfoId='';
function setCRF(f,el){ crf=f; document.querySelectorAll('#pg-cr .fchip').forEach(function(c){ c.classList.remove('on'); }); el.classList.add('on'); renderCR(); }
const FIXED_CREDIT_PROVIDERS = ['สินเชื่อจำนำ','สินเชื่อรถยนต์','สินเชื่อรถจักรยานยนต์','สินเชื่อที่อยู่อาศัย','สินเชื่ออื่นๆ'];
function updateCreditProviderOptions(){
  var typeEl=document.getElementById('cs-type'), providerEl=document.getElementById('cs-provider');
  if(!typeEl||!providerEl) return;
  var cur=providerEl.value;
  var opts=typeEl.value==='fixed'
    ? FIXED_CREDIT_PROVIDERS
    : BASE_CR.filter(function(c){ return c.t==='revolving'; }).map(function(c){ return c.n; });
  providerEl.innerHTML=opts.map(function(n){ return '<option value="'+esc(n)+'">'+esc(n)+'</option>'; }).join('');
  if(opts.indexOf(cur)>=0) providerEl.value=cur;
}
function crInitials(name){
  name=String(name||'CR').replace(/[^\wก-๙+\/ ]/g,'').trim();
  if(name.indexOf('K-Bank')>=0) return 'KB';
  if(name.indexOf('CardX')>=0) return 'CX';
  if(name.indexOf('Krungsri')>=0) return 'KS';
  if(name.indexOf('TikTok')>=0) return 'TT';
  return name.split(/\s+|\/|-/).filter(Boolean).map(function(p){ return p.charAt(0); }).join('').slice(0,3).toUpperCase()||'CR';
}
function renderCreditLine(cr){
  var mo=thisMo(),st=S.crStatus[cr.id]||{},info=S.crInfo[cr.id]||{};
  var isPaid=st.paid&&(st.date||'').slice(0,7)===mo;
  var bal=st.remaining!=null?Number(st.remaining||0):(info.minPay||0);
  var due=info.dueDate||'-';
  var rate=info.rate||cr.rate||0;
  var tone=cr.id.indexOf('kbank')===0||cr.id.indexOf('ttb')===0||cr.id==='gsb'?'green':cr.id.indexOf('aeon')===0||cr.id.indexOf('krungsri')===0?'amber':'';
  return '<div class="cr-line-card">'+
    '<div class="cr-line-main"><div class="cr-logo '+tone+'">'+esc(crInitials(cr.n))+'</div><div><div class="cr-line-name">'+esc(cr.n)+'</div><div class="cr-line-meta"><span>Due: '+esc(due)+'</span><span>Rate: '+esc(rate)+'%</span></div></div></div>'+
    '<div class="cr-line-balance"><div class="cr-line-amt '+(!isPaid&&bal>0?'due':'')+'">฿ '+fmt(bal)+'</div><div class="cr-line-label">Current Balance</div></div>'+
    '<div class="cr-line-actions"><button class="edit" onclick="openInfo(\''+cr.id+'\')">Edit Info</button><button class="pay" onclick="openPay(\''+cr.id+'\')" '+(bal<=0&&isPaid?'disabled':'')+'>Pay Bill</button></div>'+
    '</div>';
}
function renderBillCalendar(){
  var now=new Date(),yr=now.getFullYear(),mn=now.getMonth(),days=new Date(yr,mn+1,0).getDate(),first=(new Date(yr,mn,1).getDay()+6)%7;
  var names=['Mo','Tu','We','Th','Fr','Sa','Su'];
  var dueMap={},legend=[];
  getMyCredits().forEach(function(cr){
    var info=S.crInfo[cr.id]||{},d=parseInt(info.dueDate,10);
    if(!d||d<1||d>31) return;
    if(!dueMap[d]) dueMap[d]=[];
    dueMap[d].push(cr);
  });
  var cells=names.map(function(n){ return '<div class="cr-cal-dow">'+n+'</div>'; }).join('');
  for(var i=0;i<first;i++) cells+='<div class="cr-cal-day muted"></div>';
  for(var d=1;d<=days;d++){
    var cls=dueMap[d]?(d<=15?'due':'warn'):'';
    cells+='<div class="cr-cal-day '+cls+'">'+d+'</div>';
  }
  Object.keys(dueMap).sort(function(a,b){ return Number(a)-Number(b); }).slice(0,4).forEach(function(d,idx){
    dueMap[d].slice(0,2).forEach(function(cr){ legend.push('<div><span class="cr-cal-dot '+(idx%2?'warn':'')+'"></span>'+esc(cr.n)+' ('+d+')</div>'); });
  });
  return '<div class="cr-calendar"><div class="cr-calendar-head">Bill Calendar <span class="material-symbols-outlined">calendar_month</span></div><div class="cr-calendar-box"><div class="cr-cal-month"><span>‹</span><span>'+now.toLocaleDateString('en-US',{month:'long',year:'numeric'})+'</span><span>›</span></div><div class="cr-cal-grid">'+cells+'</div></div><div class="cr-cal-legend">'+(legend.join('')||'<div>ยังไม่มีวันครบกำหนด</div>')+'</div></div>';
}

function renderCR(){
  var overview=document.getElementById('debt-overview-card'),match=document.getElementById('match-summary-card');
  if(S.profile&&S.profile.family_id&&Object.keys(S.crInfo||{}).length===0){
    if(overview) overview.innerHTML='';
    if(match) match.innerHTML='';
    var list0=document.getElementById('cr-list'); if(list0) list0.innerHTML="<div class=\"cr-setup-empty\"><div class=\"ctitle\" style=\"justify-content:center\">Credit Setup</div><button class=\"btn-go\" onclick=\"openCreditSetupModal('revolving')\">เพิ่มสินเชื่อใบแรก</button></div>";
    return;
  }
  renderDebtOverview();
  renderMatchSummary();
  var list=document.getElementById('cr-list'); list.innerHTML='';
  if(crf==='plan'){ list.className=''; renderSmartDebt(); return; }
  var grp=getMyCredits().filter(function(c){ return crf==='overview'||crf==='all'||c.t===crf; });
  list.className='cr-lines';
  if(!grp.length){ list.innerHTML='<div class="cr-setup-empty">ไม่มีรายการตามตัวกรองนี้</div>'; return; }
  list.innerHTML=grp.map(renderCreditLine).join('');
}

function openCreditSetupModal(type){
  var t=(type==='fixed'||type==='secured')?'fixed':'revolving';
  var modal=document.getElementById('credit-setup-modal');
  var typeEl=document.getElementById('cs-type'), providerEl=document.getElementById('cs-provider');
  var limitEl=document.getElementById('cs-limit'), rateEl=document.getElementById('cs-rate'), minEl=document.getElementById('cs-min');
  var billEl=document.getElementById('cs-bill'), dueEl=document.getElementById('cs-due');
  if(!modal||!typeEl||!providerEl||!limitEl||!rateEl||!minEl||!billEl||!dueEl){
    console.error('credit setup modal is missing required fields');
    return toast('ฟอร์มเพิ่มสินเชื่อโหลดไม่ครบ ลองรีเฟรชหน้าอีกครั้ง','err');
  }
  typeEl.value=t;
  updateCreditProviderOptions();
  providerEl.value=providerEl.value||'KTC';
  limitEl.value=''; rateEl.value=''; minEl.value=''; billEl.value=''; dueEl.value='';
  var title=modal.querySelector('.modal-title');
  if(title) title.textContent=t==='revolving'?'เพิ่มสินเชื่อหมุนเวียน':'เพิ่มสินเชื่อหลักประกัน';
  modal.classList.add('on');
}
function addCR(t){ openCreditSetupModal(t); }
async function saveFirstCredit(){
  try{
    var provider=document.getElementById('cs-provider').value;
    var type=document.getElementById('cs-type').value;
    if(!provider) return toast('เลือกผู้ใช้บริการก่อน','err');
    var cr=allCR().find(function(c){ return c.n===provider; });
    if(!cr){
      cr={id:'cr_'+provider.toLowerCase().replace(/\W+/g,'_'),n:provider,t:type,ico:'CR',rate:0};
      S.customCr.push(cr);
    }
    cr.t=type;
    var info={
      limit:parseFloat(document.getElementById('cs-limit').value)||0,
      rate:parseFloat(document.getElementById('cs-rate').value)||0,
      minPay:parseFloat(document.getElementById('cs-min').value)||0,
      billCycle:document.getElementById('cs-bill').value,
      dueDate:document.getElementById('cs-due').value
    };
    if(!info.limit) return toast('กรอกวงเงิน/ยอดหนี้ก่อน','err');
    S.crInfo[cr.id]=info;
    sv();
    await saveToSupabase('credit_info',{credit_name:cr.n,type:cr.t,credit_limit:info.limit,rate:info.rate,min_pay:info.minPay,bill_cycle:info.billCycle,due_date:info.dueDate});
    closeD('credit-setup-modal');
    loadCreditOptions();
    renderCR();
    renderDash();
    renderSetStats();
    showSuccessModal('฿ '+fmt2(info.limit),[
      {icon:'calendar_today',label:'วันที่',value:today()},
      {icon:'credit_card',label:'สินเชื่อ',value:cr.n},
      {icon:'category',label:'ประเภท',value:cr.t==='fixed'?'สินเชื่อหลักประกัน':'สินเชื่อหมุนเวียน'},
      {icon:'payments',label:'จ่ายขั้นต่ำ',value:'฿ '+fmt(info.minPay)}
    ],'บันทึกสินเชื่อสำเร็จ');
  }catch(e){
    console.error('save credit setup failed:',e);
    toast('บันทึกสินเชื่อไม่สำเร็จ: '+(e.message||e),'err');
  }
}

// ── Debt Overview card ─────────────────────────────────
function renderDebtOverview(){
  var w=document.getElementById('debt-overview-card'); if(!w) return;
  if(crf==='plan'){ w.innerHTML=''; return; }
  var mo=thisMo(),totLimit=0,totUsed=0,totPaid=0,totUnpaid=0,paidCount=0,crCount=0;
  getMyCredits().filter(function(c){ return c.t==='revolving'; }).forEach(function(cr){
    var st=S.crStatus[cr.id]||{},info=S.crInfo[cr.id]||{};
    var isPaid=st.paid&&(st.date||'').slice(0,7)===mo;
    if(info.limit){ totLimit+=info.limit; totUsed+=(info.limit-(st.remaining!=null?st.remaining:info.limit)); }
    if(isPaid){ totPaid+=st.amount||0; paidCount++; }
    else if(info.minPay) totUnpaid+=info.minPay;
    crCount++;
  });
  var pct=totLimit>0?Math.min(100,Math.max(0,Math.round(totUsed/totLimit*100))):0;
  var avail=Math.max(0,totLimit-totUsed),availPct=totLimit>0?Math.max(0,Math.round(avail/totLimit*100)):0;
  w.innerHTML='<div class="cr-kpi-grid">'+
    '<div class="cr-kpi-card"><div class="cr-kpi-label">Total Approved Limit</div><div class="cr-kpi-val">฿ '+fmt(totLimit)+'</div><div class="cr-kpi-note"><span class="material-symbols-outlined">trending_up</span>'+paidCount+'/'+crCount+' paid this month</div></div>'+
    '<div class="cr-kpi-card cr-gauge-card"><div class="cr-kpi-label">Utilization Rate</div><div class="cr-gauge" style="--pct:'+pct+'%"><strong>'+pct+'%</strong></div><div class="cr-gauge-sub">'+(pct<=40?'Healthy Status':pct<=70?'Watch Status':'High Usage')+'</div></div>'+
    '<div class="cr-kpi-card"><div class="cr-kpi-label">Available Credit</div><div class="cr-kpi-val green">฿ '+fmt(avail)+'</div><div class="cr-kpi-progress"><span style="width:'+availPct+'%"></span></div><div class="cr-kpi-sub" style="text-align:right;margin-top:8px;color:#c9c4d7;font-family:var(--font-label);font-size:12px;font-weight:800">'+availPct+'% Available</div></div>'+
    '</div>';
}

// ── Match-up Summary ──────────────────────────────────
function renderMatchSummary(){
  var w=document.getElementById('match-summary-card'); if(!w) return;
  if(crf==='plan'){ w.innerHTML=''; return; }
  w.innerHTML=renderBillCalendar();
}

// ── Pay & Info drawers ────────────────────────────────
function openPay(id){
  activeCrId=id;
  var cr=allCR().find(function(c){ return c.id===id; }),st=S.crStatus[id]||{},info=S.crInfo[id]||{};
  document.getElementById('dr-title').textContent='ชำระ '+cr.n;
  document.getElementById('dr-sub').textContent='วงเงินคงเหลือ: ฿ '+fmt2(st.remaining||0)+(info.minPay?' · ขั้นต่ำ ฿ '+fmt(info.minPay):'');
  document.getElementById('dr-amt').value=''; document.getElementById('dr-rem').value=st.remaining||''; document.getElementById('dr-dt').value=today();
  document.getElementById('pay-drawer').classList.add('on');
}
async function submitCredit(){
  var amt=parseFloat(document.getElementById('dr-amt').value);
  var rem=parseFloat(document.getElementById('dr-rem').value)||0;
  var dt=document.getElementById('dr-dt').value;
  if(!amt||amt<=0) return toast('ใส่จำนวนเงินด้วย','err');
  var cr=allCR().find(function(c){ return c.id===activeCrId; });
  if(!validateTxnInput({date:dt,credit_name:cr&&cr.n,amount:amt})) return;
  var baseAt=new Date().toISOString();
  S.crStatus[activeCrId]={paid:true,amount:amt,baseRemaining:rem,baseAt:baseAt,matchedUsed:0,remaining:rem,date:dt};
  recomputeMatchedCreditBalances();
  sv(); closeD('pay-drawer'); renderCR(); renderDash();
  showSuccessModal('฿ '+fmt2(amt),[
    {icon:'calendar_today',label:'วันที่',value:dt},
    {icon:'credit_card',label:'สินเชื่อ',value:cr.n},
    {icon:'payments',label:'จำนวนเงิน',value:'฿ '+fmt2(amt)},
    {icon:'account_balance_wallet',label:'คงเหลือ',value:'฿ '+fmt2(rem)}
  ],'บันทึกชำระสินเชื่อสำเร็จ');
  saveToSupabase('credits',{date:dt,credit_name:cr.n,type:cr.t,amount:amt,remaining:rem,status:'จ่ายแล้ว',created_at:baseAt});
}
function openInfo(id){
  activeInfoId=id;
  var cr=allCR().find(function(c){ return c.id===id; }),info=S.crInfo[id]||{};
  document.getElementById('inf-title').textContent='ข้อมูล '+cr.n;
  document.getElementById('inf-credit_limit').value=info.limit||''; document.getElementById('inf-rate').value=info.rate||'';
  document.getElementById('inf-min').value=info.minPay||''; document.getElementById('inf-bill').value=info.billCycle||'';
  document.getElementById('inf-due').value=info.dueDate||'';
  document.getElementById('info-drawer').classList.add('on');
}
async function saveInfo(){
  var cr=allCR().find(function(c){ return c.id===activeInfoId; });
  var info={limit:parseFloat(document.getElementById('inf-credit_limit').value)||0,rate:parseFloat(document.getElementById('inf-rate').value)||0,minPay:parseFloat(document.getElementById('inf-min').value)||0,billCycle:document.getElementById('inf-bill').value,dueDate:document.getElementById('inf-due').value};
  S.crInfo[activeInfoId]=info; sv(); closeD('info-drawer'); renderCR();
  showSuccessModal('฿ '+fmt2(info.limit),[
    {icon:'calendar_today',label:'วันที่',value:today()},
    {icon:'credit_card',label:'สินเชื่อ',value:cr.n},
    {icon:'percent',label:'ดอกเบี้ย',value:String(info.rate||0)+'%'},
    {icon:'payments',label:'จ่ายขั้นต่ำ',value:'฿ '+fmt(info.minPay)}
  ],'บันทึกข้อมูลสินเชื่อสำเร็จ');
  saveToSupabase('credit_info',{credit_name:cr.n,type:cr.t,credit_limit:info.limit,rate:info.rate,min_pay:info.minPay,bill_cycle:info.billCycle,due_date:info.dueDate});
}
function closeD(id){ document.getElementById(id).classList.remove('on'); }
function closeDrBg(e,id){ if(e.target===document.getElementById(id)) closeD(id); }
function closeModalBg(e,id){ if(e.target===document.getElementById(id)) closeD(id); }

// ═══════════════════════════════════════════════════════
// SMART DEBT PLANNER (Q2: Snowball + Avalanche)
// ═══════════════════════════════════════════════════════
function renderSmartDebt(){
  var list=document.getElementById('debt-plan-list')||document.getElementById('cr-list');
  var controls=document.getElementById('debtp-controls');
  if(!list) return;
  list.innerHTML='';
  if(controls) controls.innerHTML='';
  var mo=thisMo();
  // Get credits with data — exclude 'expense' type
  var debtList=getMyCredits().filter(function(cr){
    if(cr.t==='expense') return false;
    var info=S.crInfo[cr.id]||{};
    var st=S.crStatus[cr.id]||{};
    var limit=Number(info.limit||0);
    var available=st.remaining!=null?Number(st.remaining||0):null;
    var outstanding=available!=null&&limit>0?Math.max(0,limit-available):limit;
    return outstanding>0||(info.minPay&&info.minPay>0);
  }).map(function(cr){
    var info=S.crInfo[cr.id]||{};
    var st=S.crStatus[cr.id]||{};
    var limit=Number(info.limit||0);
    var available=st.remaining!=null?Number(st.remaining||0):null;
    var outstanding=available!=null&&limit>0?Math.max(0,limit-available):limit;
    return {cr:cr,info:info,st:st,remaining:outstanding,rate:info.rate||cr.rate||0,minPay:info.minPay||0};
  }).filter(function(d){ return d.remaining>0; });

  if(!debtList.length){
    list.innerHTML='<div class="empty"><p>ไม่มีข้อมูลหนี้สำหรับวางแผน<br>กรอกข้อมูลสินเชื่อก่อนนะ</p></div>';
    return;
  }

  // Strategy toggle
  var strategyPanel=document.createElement('div'); strategyPanel.className=controls?'debtp-controls-panel':'';
  if(controls) strategyPanel.innerHTML='<div class="debtp-panel-title"><span class="material-symbols-outlined">model_training</span> กลยุทธ์ชำระหนี้</div>';
  var toggleDiv=document.createElement('div'); toggleDiv.className='strategy-toggle';
  var btnSnow=document.createElement('button'); btnSnow.className='strategy-btn'+(S.strategy==='snowball'?' on':'');
  btnSnow.innerHTML='<span class="material-symbols-outlined st-icon">filter_1</span>Snowball<br><span style="font-size:10px;opacity:.7">ก้อนเล็กก่อน</span>';
  btnSnow.onclick=function(){ S.strategy='snowball'; updateSmartResults(); };
  var btnAva=document.createElement('button'); btnAva.className='strategy-btn'+(S.strategy==='avalanche'?' on':'');
  btnAva.innerHTML='<span class="material-symbols-outlined st-icon">trending_down</span>Avalanche<br><span style="font-size:10px;opacity:.7">ดอกแพงก่อน</span>';
  btnAva.onclick=function(){ S.strategy='avalanche'; updateSmartResults(); };
  toggleDiv.appendChild(btnAva); toggleDiv.appendChild(btnSnow);
  strategyPanel.appendChild(toggleDiv);
  if(controls) controls.appendChild(strategyPanel); else list.appendChild(toggleDiv);

  // ── Extra cash input (rendered ONCE — never re-created to avoid focus loss) ──
  var extraPanel=document.createElement('div'); extraPanel.className=controls?'debtp-controls-panel':'';
  if(controls) extraPanel.className+=' debtp-topup-panel';
  if(controls) extraPanel.innerHTML='<div class="debtp-panel-title topup-title"><span class="material-symbols-outlined">add_card</span><span>เพิ่มเงินโปะต่อเดือน</span></div><p class="topup-sub">ใส่จำนวนเงินที่คุณสามารถจ่ายเพิ่มจากยอดขั้นต่ำได้</p>';
  var extraRow=document.createElement('div'); extraRow.className='extra-cash-row';
  var extraTop=document.createElement('div'); extraTop.className='topup-input-wrap';
  var extraCurrency=document.createElement('span'); extraCurrency.className='topup-currency'; extraCurrency.textContent='฿';
  var extraInp=document.createElement('input'); extraInp.className='extra-cash-inp'; extraInp.type='number';
  extraInp.id='smart-extra-inp';
  extraInp.placeholder='0'; extraInp.value=S.extraCash!=null?S.extraCash:0;
  extraInp.oninput=function(){ S.extraCash=parseFloat(this.value)||0; updateSmartResults(); };
  extraTop.appendChild(extraCurrency); extraTop.appendChild(extraInp);
  var extraHint=document.createElement('div'); extraHint.className='topup-result';
  extraHint.innerHTML='<div><span>ร่นระยะเวลาได้</span><strong id="smart-extra-saved">-</strong></div><span class="material-symbols-outlined">timelapse</span>';
  extraRow.appendChild(extraTop); extraRow.appendChild(extraHint);
  extraPanel.appendChild(extraRow);
  if(controls) controls.appendChild(extraPanel); else list.appendChild(extraRow);

  // ── Results container (updated in-place by updateSmartResults) ──
  var resultsWrap=document.createElement('div'); resultsWrap.id='smart-results';
  list.appendChild(resultsWrap);

  // Store debtList on closure for updateSmartResults
  list._debtList=debtList;
  updateSmartResults();
}

function updateSmartResults(){
  var list=document.getElementById('debt-plan-list')||document.getElementById('cr-list'); if(!list) return;
  var debtList=list._debtList; if(!debtList) return;
  var resultsWrap=document.getElementById('smart-results'); if(!resultsWrap) return;
  resultsWrap.innerHTML='';

  // Update strategy button states
  document.querySelectorAll('#debtp-controls .strategy-btn,#cr-list .strategy-btn').forEach(function(btn){
    var isSnow=btn.textContent.indexOf('Snowball')>=0;
    btn.classList.toggle('on',(isSnow&&S.strategy==='snowball')||(!isSnow&&S.strategy==='avalanche'));
  });

  var FIXED_PAY_IDS = ['shopee','shopeem','true','thisshop'];
  function isFixed(d){ return FIXED_PAY_IDS.indexOf(d.cr.id)>=0; }

  var sortable = debtList.filter(function(d){ return !isFixed(d); });
  var fixedPay = debtList.filter(function(d){ return isFixed(d); });
  sortable.sort(function(a,b){
    if(S.strategy==='snowball') return a.remaining-b.remaining;
    return b.rate-a.rate;
  });
  var sorted = sortable.concat(fixedPay);

  var extra=S.extraCash||0;
  var totalMinPay=sorted.reduce(function(s,d){ return s+d.minPay; },0);
  var totalRem=sorted.reduce(function(s,d){ return s+d.remaining; },0);

  // ── Simulate WITH extra ──
  function simMonths(extraAmt) {
  var sd = sorted.map(function(d) {
    return { remaining: d.remaining, minPay: d.minPay, rate: d.rate, fixed: isFixed(d) };
  });
  var mo = 0, totalInt = 0, prevRemaining = Infinity, growingStreak = 0;

  while (sd.some(function(d) { return d.remaining > 0; }) && mo < 600) {
    // 1) คิดดอกเบี้ยทุกหนี้ก่อน
    sd = sd.map(function(d) {
      if (d.remaining <= 0) return d;
      var interest = d.remaining * (d.rate / 100 / 12);
      totalInt += interest;
      return Object.assign({}, d, { remaining: d.remaining + interest });
    });

    // 2) จ่าย minPay ทุกหนี้ก่อน และเก็บส่วนเกินกลับ
    var freed = 0; // minPay ของหนี้ที่หมดแล้ว
    sd = sd.map(function(d) {
      if (d.remaining <= 0) {
        freed += d.minPay; // cascade minPay กลับมา
        return d;
      }
      var pay = Math.min(d.minPay, d.remaining);
      var overpaid = d.minPay - pay; // จ่ายเกินเพราะหนี้เหลือน้อย
      freed += overpaid;
      return Object.assign({}, d, { remaining: d.remaining - pay });
    });

    // 3) โปะเงินพิเศษ (extra + freed minPay) ไปหนี้เป้าหมายตามลำดับ
    var avail = extraAmt + freed;
    sd = sd.map(function(d) {
      if (d.remaining <= 0 || d.fixed || avail <= 0) return d;
      var add = Math.min(avail, d.remaining);
      avail -= add;
      return Object.assign({}, d, { remaining: d.remaining - add });
    });

    mo++;
    var totalRemaining=sd.reduce(function(s,d){ return s+Math.max(0,d.remaining||0); },0);
    if(totalRemaining>=prevRemaining) growingStreak++;
    else growingStreak=0;
    prevRemaining=totalRemaining;
    if(growingStreak>=3) return { months:null, interest:Math.round(totalInt), impossible:true };
  }

  return { months: mo < 600 ? mo : null, interest: Math.round(totalInt) };
  }

  var withExtra=simMonths(extra);
  var noExtra=simMonths(0);
  var isDebtPage=list.id==='debt-plan-list';
  if(isDebtPage){
    var savedInt=(withExtra.interest!=null&&noExtra.interest!=null)?Math.max(0,noExtra.interest-withExtra.interest):0;
    var savedMo=(withExtra.months!=null&&noExtra.months!=null)?Math.max(0,noExtra.months-withExtra.months):0;
    var savedEl=document.getElementById('smart-extra-saved');
    if(savedEl) savedEl.textContent=savedMo?Math.floor(savedMo/12)+' ปี '+(savedMo%12)+' เดือน':'0 เดือน';
    var saveEl=document.getElementById('debtp-save-amt');
    if(saveEl) saveEl.textContent='฿ '+fmt(savedInt);
    var impact=document.getElementById('debtp-impact');
    if(impact){
      impact.innerHTML='<div class="debtp-impact-grid">'+
        '<div class="debtp-impact-card"><div class="debtp-impact-label">จ่ายขั้นต่ำปกติ</div><div class="debtp-impact-time">'+(noExtra.months!=null?Math.floor(noExtra.months/12)+' ปี '+(noExtra.months%12)+' เดือน':'∞')+'</div><div class="debtp-impact-interest">ดอกเบี้ยรวม: ฿ '+fmt(noExtra.interest||0)+'</div></div>'+
        '<div class="debtp-impact-card smart"><div class="debtp-impact-label">แผน Smart</div><div class="debtp-impact-time">'+(withExtra.months!=null?Math.floor(withExtra.months/12)+' ปี '+(withExtra.months%12)+' เดือน':'∞')+'</div><div class="debtp-impact-interest">ดอกเบี้ยรวม: ฿ '+fmt(withExtra.interest||0)+'</div></div>'+
        '</div><div class="debtp-progress-row"><div class="debtp-progress-label"><span>ปัจจุบัน</span><span>อิสรภาพทางการเงิน</span></div><div class="debtp-progress"><span></span></div></div>';
    }
  }

  // ── What-If comparison card (only when extra > 0) ──
  if(!isDebtPage&&extra>0&&withExtra.months!=null&&noExtra.months!=null){
    var savedMo=noExtra.months-withExtra.months;
    var savedInt=noExtra.interest-withExtra.interest;
    var wiCard=document.createElement('div');
    wiCard.style.cssText='background:linear-gradient(135deg,rgba(34,201,138,.08),rgba(77,158,245,.08));border:1px solid rgba(34,201,138,.25);border-radius:var(--rds);padding:14px;margin-bottom:10px';
    wiCard.innerHTML=
      '<div style="font-size:11px;font-weight:700;color:var(--gl);text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px">What-If: โปะเพิ่ม ฿ '+fmt(extra)+'/เดือน</div>'+
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">'+
        '<div style="background:rgba(0,0,0,.15);border-radius:var(--rds);padding:11px;text-align:center">'+
          '<div style="font-size:10px;color:var(--mut);margin-bottom:4px;text-transform:uppercase;letter-spacing:.06em">จ่ายขั้นต่ำปกติ</div>'+
          '<div style="font-size:20px;font-weight:800;font-family:var(--mono);color:var(--rl)">~'+noExtra.months+'</div>'+
          '<div style="font-size:10px;color:var(--mut)">เดือน</div>'+
          '<div style="font-size:11px;color:var(--rl);margin-top:6px;font-family:var(--mono)">ดอก ฿ '+fmt(noExtra.interest)+'</div>'+
        '</div>'+
        '<div style="background:rgba(34,201,138,.1);border-radius:var(--rds);padding:11px;text-align:center;border:1px solid rgba(34,201,138,.2)">'+
          '<div style="font-size:10px;color:var(--gl);margin-bottom:4px;text-transform:uppercase;letter-spacing:.06em">โปะเพิ่ม ฿ '+fmt(extra)+'</div>'+
          '<div style="font-size:20px;font-weight:800;font-family:var(--mono);color:var(--gl)">~'+withExtra.months+'</div>'+
          '<div style="font-size:10px;color:var(--mut)">เดือน</div>'+
          '<div style="font-size:11px;color:var(--gl);margin-top:6px;font-family:var(--mono)">ดอก ฿ '+fmt(withExtra.interest)+'</div>'+
        '</div>'+
      '</div>'+
      '<div style="display:flex;gap:8px">'+
        (savedMo>0?'<div style="flex:1;background:var(--gbg);border-radius:var(--rds);padding:9px;text-align:center"><div style="font-size:10px;color:var(--gl);margin-bottom:3px">ประหยัดเวลา</div><div style="font-size:17px;font-weight:800;font-family:var(--mono);color:var(--gl)">'+savedMo+' เดือน</div></div>':'')+''+
        (savedInt>0?'<div style="flex:1;background:var(--gbg);border-radius:var(--rds);padding:9px;text-align:center"><div style="font-size:10px;color:var(--gl);margin-bottom:3px">ประหยัดดอกเบี้ย</div><div style="font-size:17px;font-weight:800;font-family:var(--mono);color:var(--gl)">฿ '+fmt(savedInt)+'</div></div>':'')+
      '</div>';
    resultsWrap.appendChild(wiCard);
  }

  // Summary bar
  var sumDiv=document.createElement('div'); sumDiv.className='plan-summary';
  sumDiv.innerHTML='<div class="plan-sum-title">'+(S.strategy==='snowball'?'Snowball — ปิดก้อนเล็กก่อน':'Avalanche — โปะดอกแพงก่อน')+'</div><div class="plan-sum-grid"><div class="plan-sum-box"><div class="plan-sum-val">฿ '+fmt(totalRem)+'</div><div class="plan-sum-lbl">หนี้รวม</div></div><div class="plan-sum-box"><div class="plan-sum-val">฿ '+fmt(totalMinPay+extra)+'</div><div class="plan-sum-lbl">จ่าย/เดือน</div></div><div class="plan-sum-box"><div class="plan-sum-val">'+(withExtra.months!=null?'~'+withExtra.months+' เดือน':'∞')+'</div><div class="plan-sum-lbl">ปลดหนี้</div></div></div>';
  if(!isDebtPage) resultsWrap.appendChild(sumDiv);

  // Debt rows
  var remExtra=extra;
  sorted.forEach(function(d,idx){
    var extraForThis=0;
    if(!isFixed(d)&&remExtra>0){
      var firstNonFixed=sorted.findIndex(function(x){ return !isFixed(x); });
      if(idx===firstNonFixed){ extraForThis=remExtra; remExtra=0; }
    }
    var moLeft=calcMoLeft(d.remaining,d.minPay+extraForThis,d.rate);
    var isTop=idx===0;
    var row=document.createElement('div'); row.className='debt-plan-row'+(isTop?' highlight':'');
    var rankDiv=document.createElement('div'); rankDiv.className='dp-rank'+(isTop?' top':''); rankDiv.textContent=idx+1;
    var body=document.createElement('div'); body.className='dp-body';
    var fixedBadge=isFixed(d)?'<span class="dp-fixed-badge">Fixed</span>':'';
    body.innerHTML='<div class="dp-name-row"><span class="material-symbols-outlined dp-icon">'+debtMaterialIcon(d.cr)+'</span><div><div class="dp-name">'+esc(d.cr.n)+fixedBadge+'</div><div class="dp-info">ดอก '+(d.rate||0)+'%/ปี · ขั้นต่ำ ฿ '+fmt(d.minPay)+(isFixed(d)?' · จ่ายตามกำหนด ไม่สามารถโปะได้':'')+'</div>'+(extraForThis>0?'<span class="dp-extra-badge">โปะเพิ่ม ฿ '+fmt(extraForThis)+'</span>':'')+'</div></div>';
    var right=document.createElement('div'); right.className='dp-right';
    right.innerHTML='<div class="dp-rem">฿ '+fmt2(d.remaining)+'</div><div class="dp-months">'+(moLeft!=null?'~'+moLeft+' เดือน':'ยังไม่ทราบ')+'</div>';
    row.appendChild(rankDiv); row.appendChild(body); row.appendChild(right);
    resultsWrap.appendChild(row);
  });
}

// ═══════════════════════════════════════════════════════
// INCOME
// ═══════════════════════════════════════════════════════
async function submitInc(){
  if(!checkAccess()) return toast('กรุณาสมัครสมาชิก 59฿','err');
  if(S.profile&&S.profile.full_name) S.fi.rcv=S.profile.full_name;
  var amt=parseFloat(document.getElementById('i-amt').value);
  var det=document.getElementById('i-det').value.trim();
  var dt=document.getElementById('i-dt').value;
  if(!amt||amt<=0) return toast('ใส่จำนวนเงินด้วย','err');
  if(!S.fi.cat) return toast('เลือกหมวดหมู่ด้วย','err');
  if(!S.fi.ch) return toast('เลือกช่องทางรับด้วย','err');
  if(!S.fi.rcv) return toast('เลือกผู้รับด้วย','err');
  if(!dt) return toast('เลือกวันที่ด้วย','err');
  var cat=S.incc.find(function(c){ return c.id===S.fi.cat; });
  var ch=S.inch.find(function(c){ return c.id===S.fi.ch; });
  var checkRow={date:dt,detail:det,category:cat&&cat.l,channel:ch&&ch.l,amount:amt,receiver:S.fi.rcv};
  if(!validateTxnInput(checkRow)) return;
  det=checkRow.detail;
  var inc={id:Date.now(),date:dt,detail:det||'-',category:cat.l,channel:ch.l,amount:amt,receiver:S.fi.rcv,user_id:S.user&&S.user.id||''};
  S.incomes.unshift(inc);
  document.getElementById('i-amt').value=''; document.getElementById('i-det').value=''; document.getElementById('i-dt').value=today();
  S.fi={cat:'',ch:'',rcv:''}; renderIncc(); renderInch();
  if(S.profile&&S.profile.full_name) S.fi.rcv=S.profile.full_name;
  applyCurrentProfileToPayers();
  showSuccessModal('฿ '+fmt2(amt),[
    {icon:'calendar_today',label:'วันที่',value:inc.date},
    {icon:'category',label:'หมวดหมู่',value:inc.category},
    {icon:'account_balance_wallet',label:'ช่องทางรับเงิน',value:inc.channel},
    {icon:'notes',label:'รายละเอียด',value:inc.detail}
  ]); renderIncSum();
  saveToSupabase('incomes',{date:inc.date,detail:inc.detail,category:inc.category,channel:inc.channel,amount:inc.amount,receiver:inc.receiver});
}
function renderIncSum(){
  var w=document.getElementById('inc-sum'); if(!w) return;
  var mo=thisMo();
  var moItems=S.incomes.filter(function(i){ return i.date&&i.date.slice(0,7)===mo; });
  var incTotal=moItems.reduce(function(s,i){ return s+i.amount; },0);
  var goal=Math.max(incTotal,15000);
  var pct=goal?Math.min(100,Math.round(incTotal/goal*100)):0;
  var remain=Math.max(goal-incTotal,0);
  var recent=S.incomes.slice().sort(function(a,b){ return (b.date||'').localeCompare(a.date||''); }).slice(0,4);
  var iconMap={'เงินเดือน':'work','โบนัส':'redeem','ฟรีแลนซ์':'business_center','ลงทุน':'trending_up','อื่นๆ':'more_horiz'};
  function iconFor(cat){
    cat=String(cat||'');
    var k=Object.keys(iconMap).find(function(x){ return cat.indexOf(x)>-1; });
    return k?iconMap[k]:'account_balance_wallet';
  }
  function dLabel(dt){
    if(!dt) return '-';
    try { return new Date(dt+'T00:00:00').toLocaleDateString('th-TH',{day:'2-digit',month:'short'}); }
    catch(e){ return dt; }
  }
  w.innerHTML=
    '<div class="inc-goal-card inc-glass">'+
      '<div class="inc-side-title">Monthly Income Goal <span class="material-symbols-outlined">flag</span></div>'+
      '<div class="inc-goal-amt">฿ '+fmt(incTotal)+' <span>/ ฿ '+fmt(goal)+'</span></div>'+
      '<div class="inc-progress"><div class="inc-progress-fill" style="width:'+pct+'%"></div></div>'+
      '<div class="inc-goal-foot"><span>'+pct+'% Achieved</span><span>฿ '+fmt(remain)+' Remaining</span></div>'+
    '</div>'+
    '<div class="inc-recent-card inc-glass">'+
      '<div class="inc-side-title inc-recent-head">Recent Inflows <span>View All</span></div>'+
      '<div class="inc-recent-list"></div>'+
    '</div>';
  var list=w.querySelector('.inc-recent-list');
  if(!recent.length){
    list.innerHTML='<div class="inc-empty">ยังไม่มีรายรับ</div>';
    return;
  }
  recent.forEach(function(i){
    var row=document.createElement('div');
    row.className='inc-recent-item';
    row.innerHTML='<div class="inc-recent-left">'+
      '<div class="inc-recent-ico" data-icon="'+iconFor(i.category)+'"></div>'+
      '<div><div class="inc-recent-name">'+esc(i.detail||i.receiver||'รายรับ')+'</div>'+
      '<div class="inc-recent-meta">'+esc(dLabel(i.date))+' • '+esc(i.category||'-')+'</div></div>'+
      '</div><div class="inc-recent-amt">+ ฿ '+fmt(i.amount)+'</div>';
    list.appendChild(row);
  });
}

// ═══════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════
var df='mo';
function setDF(f,el){ currentDashTimeFilter=f==='all'?'all_time':'this_month'; if(el) el.classList.add('on'); renderDash(); }
function dashMonthKey(add){
  var n=new Date();
  var d=new Date(n.getFullYear(),n.getMonth()+add,1);
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');
}
function setDashTimeFilter(f){ currentDashTimeFilter=f; renderDash(); }
function setDashUserFilter(f){ currentDashUserFilter=f; renderDash(); }
function dashEntityMembers(){
  var out=[], seen={};
  function add(id,name){
    if(!id||seen[id]) return;
    seen[id]=1; out.push({id:id,name:name||id});
  }
  if(S.user) add(S.user.id,(S.profile&&S.profile.full_name)||'ฉัน');
  (S.familyMembers||[]).forEach(function(m){ add(m.id,m.full_name||m.name||m.id); });
  S.expenses.forEach(function(e){ add(e.user_id,e.paidBy||e.user_id); });
  S.incomes.forEach(function(i){ add(i.user_id,i.receiver||i.user_id); });
  return out;
}
function renderDashFilters(){
  document.querySelectorAll('[data-dash-time]').forEach(function(b){ b.classList.toggle('on',b.dataset.dashTime===currentDashTimeFilter); });
  var wrap=document.getElementById('dash-entity-filters'); if(!wrap) return;
  var members=dashEntityMembers();
  var html='<span>มุมมอง</span><button type="button" data-dash-user="joint" onclick="setDashUserFilter(\'joint\')">รวมครอบครัว</button>';
  members.forEach(function(m){
    var val=(S.user&&m.id===S.user.id)?'me':m.id;
    var label=(S.user&&m.id===S.user.id)?'ฉัน':m.name;
    html+='<button type="button" data-dash-user="'+esc(val)+'" onclick="setDashUserFilter(\''+esc(val)+'\')">'+esc(label)+'</button>';
  });
  wrap.innerHTML=html;
  wrap.querySelectorAll('[data-dash-user]').forEach(function(b){ b.classList.toggle('on',b.dataset.dashUser===currentDashUserFilter); });
}
function filterDashRows(rows){
  var time=currentDashTimeFilter, user=currentDashUserFilter==='me'&&S.user?S.user.id:currentDashUserFilter;
  var mo=thisMo(), last=dashMonthKey(-1);
  return rows.filter(function(r){
    var okTime=time==='all_time'||(time==='this_month'&&r.date&&r.date.slice(0,7)===mo)||(time==='last_month'&&r.date&&r.date.slice(0,7)===last);
    var okUser=user==='joint'||String(r.user_id||'')===String(user);
    return okTime&&okUser;
  });
}
function renderDashCategoryChart(filteredExpenses){
  var canvas=document.getElementById('dash-category-chart');
  if(!canvas||!window.Chart) return;
  var totals={};
  filteredExpenses.forEach(function(e){ var k=e.category||'อื่นๆ'; totals[k]=(totals[k]||0)+Number(e.amount||0); });
  var labels=Object.keys(totals).sort(function(a,b){ return totals[b]-totals[a]; });
  var data=labels.map(function(k){ return totals[k]; });
  if(dashCategoryChart) dashCategoryChart.destroy();
  dashCategoryChart=new Chart(canvas,{
    type:'doughnut',
    data:{labels:labels.length?labels:['ไม่มีข้อมูล'],datasets:[{data:data.length?data:[1],backgroundColor:['#4c35c4','#10b981','#ffb95f','#ffb4ab','#c7bfff','#4edea3','#928ea0'],borderColor:'rgba(19,18,27,.9)',borderWidth:2}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{color:'#c9c4d7',boxWidth:10,font:{family:'Inter'}}}},cutout:'64%'}
  });
}
function categoryIdFromLabel(label){
  var found=(S.cats||DEF_CATS).find(function(c){ return c.id===label||c.l===label; });
  return found?found.id:String(label||'other');
}
function categoryLabelFromId(id){
  var found=(S.cats||DEF_CATS).find(function(c){ return c.id===id; });
  return found?found.l:String(id||'อื่นๆ');
}
function budgetProgressHtml(filteredExpenses){
  var budgets=(S.profile&&S.profile.monthly_budgets)||{};
  var mo=thisMo(), monthItems=filteredExpenses.filter(function(e){ return e.date&&e.date.slice(0,7)===mo; });
  var totals={};
  monthItems.forEach(function(e){ var k=e.catId||categoryIdFromLabel(e.category); totals[k]=(totals[k]||0)+Number(e.amount||0); });
  var cats=Object.keys(budgets).filter(function(k){ return Number(budgets[k]||0)>0; });
  if(!cats.length) return '<div class="budget-empty">ยังไม่ได้ตั้งค่างบประมาณรายเดือน</div>';
  return cats.map(function(k){
    var budget=Number(budgets[k]||0), used=Number(totals[k]||0), pct=budget?Math.round(used/budget*100):0;
    var tone=pct>=100?'danger':pct>=80?'warn':'ok';
    return '<div class="budget-row '+tone+'"><div><strong>'+esc(categoryLabelFromId(k))+'</strong><span>'+fmt(used)+' / '+fmt(budget)+' ฿</span></div><div class="budget-track"><i style="width:'+Math.min(100,pct)+'%"></i></div><em>'+pct+'%</em></div>';
  }).join('');
}
function checkBudgetWarning(ex){
  var budgets=(S.profile&&S.profile.monthly_budgets)||{};
  var catId=ex.catId||categoryIdFromLabel(ex.category);
  var budget=Number(budgets[catId]||0);
  if(!budget) return;
  var mo=(ex.date||'').slice(0,7);
  var used=S.expenses.filter(function(e){
    return e.date&&e.date.slice(0,7)===mo&&(e.catId||categoryIdFromLabel(e.category))===catId;
  }).reduce(function(s,e){ return s+Number(e.amount||0); },0);
  var pct=Math.round(used/budget*100);
  if(pct>=100) toast('ใช้งบ '+categoryLabelFromId(catId)+' เกินแล้ว ('+pct+'%)','err');
  else if(pct>=80) toast('ใช้งบ '+categoryLabelFromId(catId)+' ถึง '+pct+'% แล้ว','info');
}
function renderDash(){
  var w=document.getElementById('dash'); w.innerHTML='';
  renderDashFilters();
  var now=new Date(), mo=thisMo();
  var items=filterDashRows(S.expenses);
  var incomeItems=filterDashRows(S.incomes);
  var entityUser=currentDashUserFilter==='me'&&S.user?S.user.id:currentDashUserFilter;
  var entityExpenses=currentDashUserFilter==='joint'?S.expenses.slice():S.expenses.filter(function(e){ return String(e.user_id||'')===String(entityUser); });
  var entityIncomes=currentDashUserFilter==='joint'?S.incomes.slice():S.incomes.filter(function(i){ return String(i.user_id||'')===String(entityUser); });
  var tot=items.reduce(function(s,e){ return s+e.amount; },0);
  var personTotals={};
  (S.familyMembers||[]).forEach(function(m){
    var name=m&&m.full_name?m.full_name:(m&&m.name?m.name:'');
    if(name) personTotals[name]=personTotals[name]||0;
  });
  S.expenses.forEach(function(e){ if(e.paidBy) personTotals[e.paidBy]=(personTotals[e.paidBy]||0)+Number(e.amount||0); });
  var topPeople=Object.keys(personTotals).filter(function(name){ return personTotals[name]>0; }).sort(function(a,b){ return personTotals[b]-personTotals[a]; });
  var incMo=incomeItems.reduce(function(s,i){ return s+i.amount; },0);
  var net=incMo-tot;
  var avg=tot/Math.max(currentDashTimeFilter==='this_month'?now.getDate():30,1);
  var catM={};
  items.forEach(function(e){ if(!catM[e.category]) catM[e.category]={t:0,c:e.catC||'#7c6ef5'}; catM[e.category].t+=e.amount; });
  var cats=Object.keys(catM).map(function(k){ return [k,catM[k]]; }).sort(function(a,b){ return b[1].t-a[1].t; });
  var maxC=cats.length?cats[0][1].t:1;
  var payM={};
  items.forEach(function(e){ if(!payM[e.payment]) payM[e.payment]=0; payM[e.payment]+=e.amount; });
  var pays=Object.keys(payM).map(function(k){ return [k,payM[k]]; }).sort(function(a,b){ return b[1]-a[1]; });
  var maxP=pays.length?pays[0][1]:1;
  var myCredits=getMyCredits();
  var totPaid=0,totUnpaid=0;
  myCredits.forEach(function(cr){ var st=S.crStatus[cr.id]||{},info=S.crInfo[cr.id]||{},isPaid=st.paid&&(st.date||'').slice(0,7)===mo; if(isPaid) totPaid+=st.amount||0; else if(info.minPay) totUnpaid+=info.minPay; });

  var debtTotal=0, limitTotal=0;
  myCredits.forEach(function(cr){
    var st=S.crStatus[cr.id]||{}, info=S.crInfo[cr.id]||{}, limit=Number(info.limit||0);
    if(limit>0){
      limitTotal+=limit;
      debtTotal+=Math.max(0,limit-Number(st.remaining!=null?st.remaining:limit));
    }
  });
  var debtPct=limitTotal?Math.min(100,Math.round(debtTotal/limitTotal*100)):0;
  var projectedSave=Math.max(0,Math.round((totUnpaid+totPaid)*0.12));
  var catIconMap={'อาหาร':'restaurant','เครื่องดื่ม':'local_cafe','ขนม':'bakery_dining','สัตว์เลี้ยง':'pets','ช้อปปิ้ง':'shopping_bag','กิจกรรม':'sports_esports','การเดินทาง':'directions_car','เดินทาง':'directions_car','สถานที่':'home','ลงทุน':'trending_up','สุขภาพ':'medical_services','บิล':'receipt_long','การศึกษา':'school','บริจาค':'volunteer_activism','ท่องเที่ยว':'flight','ครอบครัว':'family_restroom','อื่น':'more_horiz'};
  function dashCatIcon(cat){ cat=String(cat||''); var k=Object.keys(catIconMap).find(function(x){ return cat.indexOf(x)>-1; }); return k?catIconMap[k]:'receipt_long'; }
  function dashDate(d){ try { return new Date(d+'T00:00:00').toLocaleDateString('th-TH',{day:'numeric',month:'short'}); } catch(e){ return d||'-'; } }
  function monthKey(add){
    var d=new Date(now.getFullYear(),now.getMonth()+add,1);
    return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');
  }
  var months=[-3,-2,-1,0].map(monthKey);
  var maxChart=1;
  var chart=months.map(function(m){
    var exp=entityExpenses.filter(function(e){ return e.date&&e.date.slice(0,7)===m; }).reduce(function(s,e){ return s+Number(e.amount||0); },0);
    var inc=entityIncomes.filter(function(i){ return i.date&&i.date.slice(0,7)===m; }).reduce(function(s,i){ return s+Number(i.amount||0); },0);
    maxChart=Math.max(maxChart,exp,inc);
    return {m:m,exp:exp,inc:inc};
  });
  var chartHtml=chart.map(function(x,idx){
    var label=thaiMo(x.m).split(' ')[0];
    var incH=Math.max(4,Math.round(x.inc/maxChart*100));
    var expH=Math.max(4,Math.round(x.exp/maxChart*100));
    return '<div class="dash-chart-col"><div class="dash-bars"><span class="income" style="height:'+incH+'%"></span><span class="expense" style="height:'+expH+'%"></span></div><div class="dash-chart-label '+(idx===chart.length-1?'on':'')+'">'+label+'</div></div>';
  }).join('');
  var calMo=mo, calItems=entityExpenses.filter(function(e){ return e.date&&e.date.slice(0,7)===calMo; }), dayTotals={};
  calItems.forEach(function(e){ dayTotals[e.date]=(dayTotals[e.date]||0)+Number(e.amount||0); });
  var yr=parseInt(calMo.split('-')[0]), mnth=parseInt(calMo.split('-')[1])-1, firstDay=new Date(yr,mnth,1).getDay(), daysInMonth=new Date(yr,mnth+1,0).getDate();
  var maxDay=Math.max(1,Object.keys(dayTotals).reduce(function(m,d){ return Math.max(m,dayTotals[d]); },0));
  var calHtml='';
  for(var ei=0;ei<firstDay;ei++) calHtml+='<span class="dash-cal-empty"></span>';
  for(var dd=1;dd<=daysInMonth;dd++){
    var ds=calMo+'-'+String(dd).padStart(2,'0'), v=dayTotals[ds]||0, lvl=v?Math.max(1,Math.ceil(v/maxDay*4)):0;
    calHtml+='<button type="button" class="dash-cal-cell l'+lvl+'" title="'+ds+' ฿ '+fmt(v)+'">'+dd+'</button>';
  }
  var recentExp=items.map(function(e){ return {type:'exp',date:e.date,detail:e.detail,cat:e.category,person:e.paidBy,amount:e.amount,icon:dashCatIcon(e.category)}; });
  var recentInc=incomeItems.map(function(i){ return {type:'inc',date:i.date,detail:i.detail||'รายรับ',cat:i.category||'Income',person:i.receiver||'SYS',amount:i.amount,icon:'payments'}; });
  var recent=recentExp.concat(recentInc).sort(function(a,b){ return String(b.date||'').localeCompare(String(a.date||'')); }).slice(0,5);
  var recentHtml=recent.length?recent.map(function(r){
    return '<tr><td><div class="dash-qitem"><span class="material-symbols-outlined">'+r.icon+'</span><div><strong>'+esc(r.detail||'-')+'</strong><small>'+dashDate(r.date)+'</small></div></div></td><td>'+esc(r.cat||'-')+'</td><td><span class="dash-person">'+esc((r.person||'SYS').slice(0,3))+'</span></td><td class="dash-amt '+(r.type==='inc'?'pos':'')+'">'+(r.type==='inc'?'+':'-')+' ฿ '+fmt2(r.amount)+'</td></tr>';
  }).join(''):'<tr><td colspan="4" class="dash-empty">ยังไม่มีรายการ</td></tr>';
  w.innerHTML='<div class="dash-v2">'+
    '<section class="dash-kpi main"><div><span>Monthly Net Balance</span><strong>฿ '+fmt2(net)+'</strong><small class="'+(net>=0?'pos':'neg')+'"><span class="material-symbols-outlined">trending_up</span> รายรับ ฿ '+fmt(incMo)+' · รายจ่าย ฿ '+fmt(tot)+'</small></div></section>'+
    '<section class="dash-kpi"><span>Total Debt</span><strong>฿ '+fmt(debtTotal)+'</strong><div class="dash-mini-track"><i style="width:'+debtPct+'%"></i></div><small>ใช้วงเงิน '+debtPct+'%</small></section>'+
    '<section class="dash-kpi"><span>Projected Interest Savings</span><strong class="green">฿ '+fmt(projectedSave)+'</strong><small class="pos"><span class="material-symbols-outlined">auto_awesome</span> ด้วยแผนชำระเร่งด่วน</small></section>'+
    '<section class="dash-panel chart"><div class="dash-panel-head"><h2>สุขภาพทางการเงินของคุณ</h2><button type="button" onclick="goTab(\'hist\',document.querySelector(\'.tbtn[onclick*=hist]\'))">ดูรายละเอียด</button></div><div class="dash-chart">'+chartHtml+'</div><div class="dash-legend"><span><i class="income"></i>รายได้</span><span><i class="expense"></i>รายจ่าย</span></div></section>'+
    '<section class="dash-panel category"><div class="dash-panel-head"><h2>Expenses by Category</h2><span>หมวดหมู่รายจ่าย</span></div><div class="dash-doughnut-wrap"><canvas id="dash-category-chart"></canvas></div></section>'+
    '<section class="dash-panel calendar"><div class="dash-panel-head"><h2>ปฏิทินรายจ่ายรายวัน</h2><span>'+thaiMo(calMo)+'</span></div><div class="dash-cal-dow"><span>อา</span><span>จ</span><span>อ</span><span>พ</span><span>พฤ</span><span>ศ</span><span>ส</span></div><div class="dash-cal-grid">'+calHtml+'</div><div class="dash-cal-legend"><span>น้อย</span><i class="l0"></i><i class="l1"></i><i class="l2"></i><i class="l3"></i><i class="l4"></i><span>มาก</span></div></section>'+
    '<section class="dash-panel history"><div class="dash-panel-head"><h2>Quick History</h2><button type="button" onclick="goTab(\'hist\',document.querySelector(\'.tbtn[onclick*=hist]\'))">ดูทั้งหมด <span class="material-symbols-outlined">arrow_forward</span></button></div><div class="dash-table-wrap"><table class="dash-table"><thead><tr><th>รายการ</th><th>หมวดหมู่</th><th>ผู้ทำรายการ</th><th>จำนวนเงิน</th></tr></thead><tbody>'+recentHtml+'</tbody></table></div></section>'+
    '<section class="dash-panel budget"><div class="dash-panel-head"><h2>Budget Progress</h2><span>งบประมาณเดือนนี้</span></div><div class="budget-progress">'+budgetProgressHtml(items)+'</div></section>'+
  '</div>';
  renderDashCategoryChart(items);
  return;

  function mkK(lbl,val,vc,sub,full,bc){ var c=document.createElement('div'); c.className='kcard'+(full?' full':''); if(bc) c.style.borderLeft='3px solid '+bc; c.innerHTML='<div class="kl">'+lbl+'</div><div class="kv" style="color:'+vc+'">'+val+'</div>'+(sub?'<div class="ks">'+sub+'</div>':''); return c; }
  var g=document.createElement('div'); g.className='kgrid';
  g.appendChild(mkK('รายจ่ายรวม','฿ '+fmt(tot),'var(--p)',items.length+' รายการ · เฉลี่ย ฿ '+fmt(avg)+'/วัน',true,'var(--p)'));
  topPeople.forEach(function(name,idx){
    var color=idx===0?'var(--p)':'var(--gl)';
    g.appendChild(mkK(name,'฿ '+fmt(personTotals[name]),color,Math.round(tot?personTotals[name]/tot*100:0)+'%',false,''));
  });
  if(incMo) g.appendChild(mkK(net>=0?'เหลือสุทธิ':'ขาดทุน','฿ '+fmt(Math.abs(net)),net>=0?'var(--gl)':'var(--rl)','รายรับ ฿ '+fmt(incMo),true,net>=0?'var(--gl)':'var(--rl)'));
  w.appendChild(g);

  // ── Daily Calendar Heatmap ─────────────────────────────
  if(df==='mo'||df==='all'){
    var calMo = mo; // always show current month calendar
    var calItems = S.expenses.filter(function(e){ return e.date&&e.date.slice(0,7)===calMo; });
    // Determine number of people for threshold
    var people=Math.max(1,Object.keys(calItems.reduce(function(m,e){ if(e.paidBy) m[e.paidBy]=1; return m; },{})).length);
    // Build day totals
    var dayTotals={};
    calItems.forEach(function(e){ var d=e.date||''; if(!dayTotals[d]) dayTotals[d]=0; dayTotals[d]+=e.amount; });
    // Calendar header
    var calDiv=document.createElement('div'); calDiv.className='card';
    calDiv.innerHTML='<div class="ctitle">ปฏิทินรายจ่าย <span style="font-size:9px;opacity:.5;font-weight:400">'+people+' คน · เขียว≤'+(500*people)+' · ส้ม≤'+(1500*people)+'</span></div>';
    // Day-of-week headers
    var DOW=['อา','จ','อ','พ','พฤ','ศ','ส'];
    var dowRow=document.createElement('div');
    dowRow.style.cssText='display:grid;grid-template-columns:repeat(7,1fr);gap:3px;margin-bottom:3px;text-align:center';
    DOW.forEach(function(d){ var cell=document.createElement('div'); cell.style.cssText='font-size:9px;font-weight:700;color:var(--mut);padding:2px 0'; cell.textContent=d; dowRow.appendChild(cell); });
    calDiv.appendChild(dowRow);
    // Calendar grid
    var grid=document.createElement('div');
    grid.style.cssText='display:grid;grid-template-columns:repeat(7,1fr);gap:3px';
    var yr=parseInt(calMo.split('-')[0]), mnth=parseInt(calMo.split('-')[1])-1;
    var firstDay=new Date(yr,mnth,1).getDay(); // 0=Sun
    var daysInMonth=new Date(yr,mnth+1,0).getDate();
    // Empty cells before first day
    for(var i=0;i<firstDay;i++){
      var empty=document.createElement('div'); empty.style.cssText='aspect-ratio:1;border-radius:5px'; grid.appendChild(empty);
    }
    var todayStr=today();
    for(var d=1;d<=daysInMonth;d++){
      var dateStr=calMo+'-'+String(d).padStart(2,'0');
      var amt=dayTotals[dateStr]||0;
      var cell=document.createElement('div');
      var green=500*people, orange=1500*people;
      var bg,color,bdr2;
      if(amt===0){ bg='var(--card2)'; color='var(--mut)'; bdr2='var(--bdr)'; }
      else if(amt<=green){ bg='rgba(34,201,138,.18)'; color='var(--gl)'; bdr2='rgba(34,201,138,.35)'; }
      else if(amt<=orange){ bg='rgba(245,166,35,.18)'; color='var(--a)'; bdr2='rgba(245,166,35,.35)'; }
      else { bg='rgba(240,82,79,.18)'; color='var(--rl)'; bdr2='rgba(240,82,79,.35)'; }
      var isToday=dateStr===todayStr;
      cell.style.cssText='aspect-ratio:1;border-radius:5px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:'+(amt>0?'pointer':'default')+';background:'+bg+';border:1px solid '+(isToday?'var(--p)':bdr2)+';transition:all .15s;position:relative'+(isToday?';box-shadow:0 0 0 2px var(--pbg)':'');
      var dayNum=document.createElement('div'); dayNum.style.cssText='font-size:11px;font-weight:'+(isToday?'800':'600')+';color:'+(isToday?'var(--pl)':amt>0?color:'var(--mut)');
      dayNum.textContent=d;
      cell.appendChild(dayNum);
      if(amt>0){
        var amtLabel=document.createElement('div'); amtLabel.style.cssText='font-size:8px;font-weight:700;color:'+color+';font-family:var(--mono);line-height:1;margin-top:1px';
        amtLabel.textContent=amt>=1000?Math.round(amt/100)/10+'k':Math.round(amt);
        cell.appendChild(amtLabel);
      }
      // Click to show tooltip / drill
      if(amt>0){
        (function(ds,dayAmt,dayItems2){
          cell.onclick=function(){
            var existing=calDiv.querySelector('.cal-popup');
            if(existing&&existing.dataset.date===ds){ existing.remove(); return; }
            if(existing) existing.remove();
            var pop=document.createElement('div'); pop.className='cal-popup'; pop.dataset.date=ds;
            pop.style.cssText='margin-top:8px;background:var(--bg2);border-radius:var(--rds);padding:12px;border:1px solid var(--bdr);animation:up .2s ease both';
            var dStr2=new Date(ds).toLocaleDateString('th-TH',{weekday:'short',day:'numeric',month:'short'});
            var hdr2=document.createElement('div'); hdr2.style.cssText='font-size:11px;font-weight:700;color:var(--p);margin-bottom:8px;display:flex;justify-content:space-between';
            hdr2.innerHTML='<span>'+dStr2+' ('+dayItems2.length+' รายการ)</span><span style="font-family:var(--mono)">฿ '+fmt(dayAmt)+'</span>';
            pop.appendChild(hdr2);
            dayItems2.slice(0,10).forEach(function(e){
              var dr=document.createElement('div'); dr.style.cssText='display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--bdr);font-size:12px';
              var l=document.createElement('div'); l.innerHTML='<span style="color:var(--tx);font-weight:500">'+esc(e.detail)+'</span><span style="font-size:10px;color:var(--mut);margin-left:5px">'+esc(e.payment||'')+'</span>';
              var r=document.createElement('div'); r.style.cssText='font-weight:700;font-family:var(--mono);color:var(--tx);flex-shrink:0;margin-left:8px'; r.textContent='฿ '+fmt(e.amount);
              dr.appendChild(l); dr.appendChild(r); pop.appendChild(dr);
            });
            if(dayItems2.length>10){ var m=document.createElement('div'); m.style.cssText='font-size:10px;color:var(--mut);text-align:center;padding-top:6px'; m.textContent='+ อีก '+(dayItems2.length-10)+' รายการ'; pop.appendChild(m); }
            calDiv.appendChild(pop);
          };
        })(dateStr, amt, calItems.filter(function(e){ return e.date===dateStr; }).sort(function(a,b){ return b.amount-a.amount; }));
      }
      grid.appendChild(cell);
    }
    calDiv.appendChild(grid);
    // Legend
    var leg=document.createElement('div'); leg.style.cssText='display:flex;gap:10px;margin-top:8px;flex-wrap:wrap';
    function mkLeg(col,txt){ var l=document.createElement('div'); l.style.cssText='display:flex;align-items:center;gap:4px;font-size:10px;color:var(--sub)'; l.innerHTML='<div style="width:10px;height:10px;border-radius:3px;background:'+col+';flex-shrink:0"></div>'+txt; return l; }
    leg.appendChild(mkLeg('var(--card2)','ไม่มีรายการ'));
    leg.appendChild(mkLeg('rgba(34,201,138,.4)','0–'+fmt(500*people)+' บาท'));
    leg.appendChild(mkLeg('rgba(245,166,35,.4)','501–'+fmt(1500*people)+' บาท'));
    leg.appendChild(mkLeg('rgba(240,82,79,.4)',fmt(1500*people+1)+'+ บาท'));
    calDiv.appendChild(leg);
    w.appendChild(calDiv);
  }
  if(cats.length){
    var cc=document.createElement('div'); cc.className='card';
    cc.innerHTML='<div class="ctitle">หมวดหมู่ <span style="font-size:9px;opacity:.5;font-weight:400">กดเพื่อดูรายการ</span></div>';
    // Drill-down container
    var drillWrap=document.createElement('div');
    drillWrap.id='cat-drill'; drillWrap.style.cssText='margin-top:10px;display:none;background:var(--bg2);border-radius:var(--rds);padding:12px;border:1px solid var(--bdr)';
    cats.slice(0,8).forEach(function(p){
      var row=document.createElement('div'); row.className='brow'; row.style.cursor='pointer';
      row.innerHTML='<div class="bnm">'+esc(p[0])+'</div><div class="btr"><div class="bfi" style="width:'+Math.round(p[1].t/maxC*100)+'%;background:'+p[1].c+'"></div></div><div class="bam">฿ '+fmt(p[1].t)+'</div>';
      // Click to drill-down
      (function(catName,catItems){
        row.onclick=function(){
          var drill=document.getElementById('cat-drill');
          var same=drill.dataset.cat===catName&&drill.style.display!=='none';
          if(same){ drill.style.display='none'; drill.dataset.cat=''; return; }
          drill.dataset.cat=catName;
          drill.style.display='block';
          var title=drill.querySelector('.drill-title');
          if(!title){ title=document.createElement('div'); title.className='drill-title'; title.style.cssText='font-size:11px;font-weight:700;color:var(--p);margin-bottom:8px;text-transform:uppercase;letter-spacing:.07em'; drill.insertBefore(title,drill.firstChild); }
          title.textContent=catName+' — '+catItems.length+' รายการ';
          // Remove old rows
          Array.from(drill.querySelectorAll('.drill-row')).forEach(function(r){ r.remove(); });
          catItems.slice(0,20).forEach(function(e){
            var dr=document.createElement('div'); dr.className='drill-row';
            dr.style.cssText='display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid var(--bdr);font-size:12.5px';
            var left=document.createElement('div');
            var dStr=e.date?new Date(e.date).toLocaleDateString('th-TH',{day:'numeric',month:'short'}):'';
            left.innerHTML='<div style="font-weight:600;color:var(--tx)">'+esc(e.detail)+'</div><div style="font-size:11px;color:var(--mut)">'+dStr+' · '+esc(e.paidBy||'')+'</div>';
            var right=document.createElement('div'); right.style.cssText='font-weight:700;font-family:var(--mono);color:var(--tx)'; right.textContent='฿ '+fmt(e.amount);
            dr.appendChild(left); dr.appendChild(right); drill.appendChild(dr);
          });
          if(catItems.length>20){ var more=document.createElement('div'); more.style.cssText='font-size:11px;color:var(--mut);text-align:center;padding-top:8px'; more.textContent='แสดง 20 รายการล่าสุด จาก '+catItems.length; drill.appendChild(more); }
        };
      })(p[0], items.filter(function(e){ return e.category===p[0]; }).sort(function(a,b){ return (b.date||'').localeCompare(a.date||''); }));
      cc.appendChild(row);
    });
    cc.appendChild(drillWrap);
    w.appendChild(cc);
  }
  // Payment chart — clickable drill-down (เหมือน Category)
  if(pays.length){
    var pc=document.createElement('div'); pc.className='card';
    pc.innerHTML='<div class="ctitle">ช่องทางชำระ <span style="font-size:9px;opacity:.5;font-weight:400">กดเพื่อดูรายการ</span></div>';
    var payDrillWrap=document.createElement('div');
    payDrillWrap.id='pay-drill'; payDrillWrap.style.cssText='margin-top:10px;display:none;background:var(--bg2);border-radius:var(--rds);padding:12px;border:1px solid var(--bdr)';
    pays.forEach(function(p){
      var row=document.createElement('div'); row.className='brow'; row.style.cursor='pointer';
      row.innerHTML='<div class="bnm">'+esc(p[0])+'</div><div class="btr"><div class="bfi" style="width:'+Math.round(p[1]/maxP*100)+'%;background:var(--p)"></div></div><div class="bam">฿ '+fmt(p[1])+'</div>';
      (function(payName, payItems){
        row.onclick=function(){
          var drill=document.getElementById('pay-drill');
          var same=drill.dataset.pay===payName&&drill.style.display!=='none';
          if(same){ drill.style.display='none'; drill.dataset.pay=''; return; }
          drill.dataset.pay=payName;
          drill.style.display='block';
          var title=drill.querySelector('.pay-drill-title');
          if(!title){ title=document.createElement('div'); title.className='pay-drill-title'; title.style.cssText='font-size:11px;font-weight:700;color:var(--p);margin-bottom:8px;text-transform:uppercase;letter-spacing:.07em'; drill.insertBefore(title,drill.firstChild); }
          title.textContent=payName+' — '+payItems.length+' รายการ';
          Array.from(drill.querySelectorAll('.pay-drill-row')).forEach(function(r){ r.remove(); });
          payItems.slice(0,20).forEach(function(e){
            var dr=document.createElement('div'); dr.className='pay-drill-row';
            dr.style.cssText='display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid var(--bdr);font-size:12.5px';
            var left=document.createElement('div');
            var dStr=e.date?new Date(e.date).toLocaleDateString('th-TH',{day:'numeric',month:'short'}):'';
            left.innerHTML='<div style="font-weight:600;color:var(--tx)">'+esc(e.detail)+'</div><div style="font-size:11px;color:var(--mut)">'+dStr+' · '+esc(e.category||'')+' · '+esc(e.paidBy||'')+'</div>';
            var right=document.createElement('div'); right.style.cssText='font-weight:700;font-family:var(--mono);color:var(--tx)'; right.textContent='฿ '+fmt(e.amount);
            dr.appendChild(left); dr.appendChild(right); drill.appendChild(dr);
          });
          if(payItems.length>20){ var more=document.createElement('div'); more.style.cssText='font-size:11px;color:var(--mut);text-align:center;padding-top:8px'; more.textContent='แสดง 20 รายการล่าสุด จาก '+payItems.length; drill.appendChild(more); }
        };
      })(p[0], items.filter(function(e){ return e.payment===p[0]; }).sort(function(a,b){ return (b.date||'').localeCompare(a.date||''); }));
      pc.appendChild(row);
    });
    pc.appendChild(payDrillWrap);
    w.appendChild(pc);
  }

  // Credit status collapsible
  var crOpen=w._crOpen!==false;
  var secDiv=document.createElement('div'); secDiv.className='dash-section'; secDiv.id='dash-cr-sec';
  var sHdr=document.createElement('div'); sHdr.className='dash-section-hdr';
  sHdr.innerHTML='<div class="dash-section-title">สถานะสินเชื่อเดือนนี้</div><div class="dash-section-meta"><span style="color:var(--gl);font-weight:700;font-size:11px;font-family:var(--mono)">ชำระ ฿ '+fmt(totPaid)+'</span><span style="color:var(--rl);font-weight:700;font-size:11px;font-family:var(--mono)">ค้าง ฿ '+fmt(totUnpaid)+'</span><span class="dash-chevron '+(crOpen?'open':'')+'">▾</span></div>';
  sHdr.onclick=function(){ var b=secDiv.querySelector('.dash-section-body'),ch=sHdr.querySelector('.dash-chevron'),open=b.classList.contains('open'); b.classList.toggle('open',!open); ch.classList.toggle('open',!open); w._crOpen=!open; };
  var sBody=document.createElement('div'); sBody.className='dash-section-body'+(crOpen?' open':'');
  var inner=document.createElement('div'); inner.className='dash-body-inner';
  var kg=document.createElement('div'); kg.className='kgrid'; kg.style.marginTop='8px';
  function mkKs(lbl,val,vc,bc){ var c=document.createElement('div'); c.className='kcard'; if(bc) c.style.borderLeft='3px solid '+bc; c.innerHTML='<div class="kl">'+lbl+'</div><div class="kv" style="font-size:18px;color:'+vc+'">'+val+'</div>'; return c; }
  kg.appendChild(mkKs('ชำระแล้ว','฿ '+fmt(totPaid),'var(--gl)','var(--gl)'));
  kg.appendChild(mkKs('ค้างชำระ','฿ '+fmt(totUnpaid),'var(--rl)','var(--rl)'));
  inner.appendChild(kg);
  // Each credit row
  var myCredits=getMyCredits();
  if(!myCredits.length){
    var emptyCr=document.createElement('div');
    emptyCr.className='empty';
    emptyCr.style.padding='22px 12px';
    emptyCr.innerHTML='<p>ยังไม่มีสินเชื่อที่ตั้งค่าไว้</p><button class="btn-go" onclick="openCreditSetupModal(\'revolving\')" style="margin-top:12px">เพิ่มสินเชื่อใบแรก</button>';
    inner.appendChild(emptyCr);
  }
  myCredits.forEach(function(cr){
    var st=S.crStatus[cr.id]||{},info=S.crInfo[cr.id]||{};
    var isPaid=st.paid&&(st.date||'').slice(0,7)===mo;
    var moLeft=calcMoLeft(st.remaining,info.minPay,info.rate||cr.rate||0);
    var pct=0;
    if(info.limit&&info.limit>0){ var used=info.limit-(st.remaining!=null?st.remaining:info.limit); pct=Math.min(100,Math.max(0,Math.round(used/info.limit*100))); }
    var card=document.createElement('div'); card.style.cssText='background:var(--card);border-radius:var(--rds);padding:13px 14px;box-shadow:var(--sh);margin-bottom:8px;border:1px solid var(--bdr);border-left:3px solid '+(isPaid?'var(--gl)':'var(--rl)');
    card.innerHTML='<div style="display:flex;align-items:center;gap:9px;width:100%"><div style="font-size:12px;font-weight:800;flex-shrink:0;color:var(--p);min-width:30px;text-align:center">'+esc(cr.ico||'CR')+'</div><div style="flex:1;min-width:0"><div style="font-size:13.5px;font-weight:700">'+esc(cr.n)+'</div><div style="font-size:11px;color:var(--mut);margin-top:2px">'+(isPaid?'จ่าย ฿ '+fmt(st.amount)+' · เหลือ ฿ '+fmt2(st.remaining||0)+(moLeft!=null?' · ~'+moLeft+' เดือน':''):info.minPay?'ขั้นต่ำ ฿ '+fmt(info.minPay):'ยังไม่มีข้อมูล')+'</div></div><div style="flex-shrink:0;text-align:right"><span class="cr-badge '+(isPaid?'paid':'unpaid')+'">'+(isPaid?'จ่ายแล้ว':'ยังไม่จ่าย')+'</span>'+(st.remaining!=null?'<div style="font-size:11px;color:var(--sub);margin-top:3px;font-family:var(--mono)">เหลือ ฿ '+fmt2(st.remaining||0)+'</div>':'')+'</div></div>'+(info.limit?'<div class="cr-progress-wrap"><div class="cr-progress-row"><div class="cr-progress-lbl">ใช้ '+pct+'%</div><div class="cr-progress-track"><div class="cr-progress-fill" style="width:'+pct+'%;background:'+(isPaid?'var(--gl)':'var(--a)')+'"></div></div><div class="cr-months">'+(moLeft!=null?'~'+moLeft+' เดือน':'')+'</div></div></div>':'');
    inner.appendChild(card);
  });
  sBody.appendChild(inner); secDiv.appendChild(sHdr); secDiv.appendChild(sBody); w.appendChild(secDiv);
}

// ═══════════════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════════════
function renderSetStats(){
  renderV4Settings();
  var w=document.getElementById('set-stats'); if(!w) return;
  var mo=thisMo();
  var expMo=S.expenses.filter(function(e){ return e.date&&e.date.slice(0,7)===mo; });
  var incMo=S.incomes.filter(function(i){ return i.date&&i.date.slice(0,7)===mo; });
  var crPaid=getMyCredits().filter(function(cr){ var st=S.crStatus[cr.id]||{}; return st.paid&&(st.date||'').slice(0,7)===mo; }).reduce(function(s,cr){ return s+(S.crStatus[cr.id].amount||0); },0);
  w.innerHTML='';
  var g=document.createElement('div'); g.className='stat-grid';
  function sb(n,nc,lbl){ var b=document.createElement('div'); b.className='stat-box'; b.innerHTML='<div class="stat-n '+(nc||'')+'">'+n+'</div><div class="stat-lbl">'+lbl+'</div>'; return b; }
  g.appendChild(sb(S.expenses.length,'','รายจ่ายทั้งหมด'));
  g.appendChild(sb(S.incomes.length,'g','รายรับทั้งหมด'));
  g.appendChild(sb('฿ '+fmt(expMo.reduce(function(s,e){ return s+e.amount; },0)),'','รายจ่ายเดือนนี้'));
  g.appendChild(sb('฿ '+fmt(incMo.reduce(function(s,i){ return s+i.amount; },0)),'g','รายรับเดือนนี้'));
  w.appendChild(g);
  var cBox=document.createElement('div'); cBox.style.cssText='padding:10px;background:var(--abg);border:1px solid rgba(245,166,35,.2);border-radius:var(--rds);text-align:center;margin-top:4px';
  cBox.innerHTML='<div style="font-size:13px;font-weight:700;color:var(--a)">ชำระสินเชื่อเดือนนี้ ฿ '+fmt(crPaid)+'</div>';
  w.appendChild(cBox);
}
function memberInitials(name){
  name=String(name||'').trim();
  if(!name) return 'BX';
  var parts=name.split(/\s+/).filter(Boolean);
  return parts.slice(0,2).map(function(p){ return p.charAt(0).toUpperCase(); }).join('');
}
function pickSettingsAvatar(){
  var f=document.getElementById('set-avatar-file');
  if(f) f.click();
}
function saveSettingsAvatar(input){
  var file=input&&input.files&&input.files[0];
  if(!file) return;
  var reader=new FileReader();
  reader.onload=function(){
    S.avatarData=String(reader.result||'');
    localStorage.setItem('setAvatar',S.avatarData);
    renderV4Settings();
    toast('อัปเดตรูปโปรไฟล์แล้ว','ok');
  };
  reader.onerror=function(){ toast('อ่านรูปภาพไม่สำเร็จ','err'); };
  reader.readAsDataURL(file);
}
function copyFamilyId(){
  var fid=(document.getElementById('family-id-view')||{}).value||'';
  if(!fid) return toast('ยังไม่มี Family ID','err');
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(fid).then(function(){ toast('คัดลอก Family ID แล้ว','ok'); }).catch(function(){ toast('คัดลอกไม่สำเร็จ','err'); });
  }else{
    toast('เบราว์เซอร์ไม่รองรับการคัดลอกอัตโนมัติ','err');
  }
}
function renderBudgetSettings(){
  var w=document.getElementById('budget-settings'); if(!w) return;
  var budgets=(S.profile&&S.profile.monthly_budgets)||{};
  var cats=(S.cats&&S.cats.length?S.cats:DEF_CATS);
  w.innerHTML=cats.map(function(c){
    return '<label class="budget-input-row"><span>'+esc(c.l)+'</span><input type="number" min="0" step="1" data-budget-cat="'+esc(c.id)+'" value="'+(Number(budgets[c.id]||0)||'')+'" placeholder="0"></label>';
  }).join('');
}
async function saveBudgets(){
  if(!S.user||!S.profile) return toast('ไม่พบโปรไฟล์','err');
  var budgets={};
  document.querySelectorAll('[data-budget-cat]').forEach(function(inp){
    var v=Number(inp.value||0);
    if(v>0) budgets[inp.dataset.budgetCat]=v;
  });
  S.profile.monthly_budgets=budgets;
  try{
    var res=await sb.from('profiles').update({monthly_budgets:budgets,updated_at:new Date().toISOString()}).eq('id',S.user.id);
    if(res.error) throw res.error;
    toast('บันทึกงบประมาณแล้ว','ok');
    renderDash();
  }catch(e){
    console.error('save budgets failed:',e);
    toast('บันทึกงบประมาณไม่สำเร็จ','err');
  }
}
function renderV4Settings(){
  updateHeader();
  renderBudgetSettings();
  var profileName=S.profile&&S.profile.full_name?S.profile.full_name:(S.user&&S.user.email?S.user.email:'BridgeX Member');
  var nameEl=document.getElementById('set-profile-name');
  if(nameEl) nameEl.textContent=profileName;
  var userEl=document.getElementById('set-user');
  if(userEl) userEl.textContent=S.user?S.user.email:'';
  var avatar=document.querySelector('.set-avatar');
  if(avatar){
    if(S.avatarData) avatar.innerHTML='<img alt="Profile" src="'+S.avatarData+'">';
    else avatar.textContent=memberInitials(profileName);
  }
  var sub=document.getElementById('set-subscription');
  if(sub) sub.innerHTML='<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">'+subscriptionBadge()+'</div><div>สถานะ: '+(S.hasAccess?'ใช้งานได้':'ถูกล็อก')+'</div><div>Trial หมดอายุ: '+(S.profile&&S.profile.trial_end?new Date(S.profile.trial_end).toLocaleDateString('th-TH'):'-')+'</div>';
  var fam=document.getElementById('family-id-view');
  if(fam) fam.value=(S.profile&&S.profile.family_id)||'';
  var membersEl=document.getElementById('set-members-list');
  if(membersEl){
    var members=(S.familyMembers||[]).slice();
    if(S.profile&&S.profile.full_name&&!members.some(function(m){ return m.id===S.profile.id||m.full_name===S.profile.full_name; })) members.unshift(S.profile);
    membersEl.innerHTML=members.length?members.map(function(m,idx){
      var name=m.full_name||m.name||m.email||m.id||'Member';
      return '<div class="set-member"><span>'+esc(memberInitials(name))+'</span><div><strong>'+esc(name)+'</strong><small>'+(idx===0?'Admin (Owner)':'Family Member')+'</small></div><em>Full Access</em></div>';
    }).join(''):'<div class="set-member"><span>BX</span><div><strong>ยังไม่มีสมาชิก</strong><small>เชื่อมครอบครัวเพื่อแสดงสมาชิก</small></div></div>';
  }
  var isPro=S.profile&&S.profile.sub_tier==='pro_109';
  ['export-expense','export-income','export-credit'].forEach(function(id){
    var b=document.getElementById(id);
    if(b) b.classList.toggle('locked',!isPro);
  });
  var topExport=document.querySelector('.set-export-top');
  if(topExport) topExport.classList.toggle('locked',!isPro);
}
async function joinFamily(){
  var fid=document.getElementById('join-family-id').value.trim();
  if(!fid) return toast('กรอก family_id ก่อน','err');
  if(!S.user) return toast('ไม่พบ session ผู้ใช้','err');
  try{
    toast('กำลังเชื่อมครอบครัว...','info');
    var exists=await withTimeout(
      sb.from('profiles').select('id,full_name,family_id').eq('family_id',fid).limit(1),
      8000,
      'ตรวจสอบ family_id'
    );
    if(exists.error) throw exists.error;
    if(!exists.data||!exists.data.length) return toast('ไม่พบ family_id นี้','err');

    var res=await withTimeout(
      sb.from('profiles').update({family_id:fid,updated_at:new Date().toISOString()}).eq('id',S.user.id).select('*').single(),
      10000,
      'บันทึก family_id'
    );
    if(res.error) throw res.error;
    S.profile=res.data;

    var tables=['expenses','incomes','credits','credit_info'];
    var moved=await Promise.allSettled(tables.map(function(t){
      return withTimeout(
        sb.from(t).update({family_id:fid}).eq('user_id',S.user.id),
        8000,
        'ย้ายข้อมูล '+t
      );
    }));
    for(var i=0;i<moved.length;i++){
      if(moved[i].status==='rejected') throw moved[i].reason;
      if(moved[i].value&&moved[i].value.error) throw moved[i].value.error;
    }

    localStorage.removeItem('crInfo');
    localStorage.removeItem('crStatus');
    localStorage.removeItem('customCr');
    S.crInfo={};
    S.crStatus={};
    S.customCr=[];

    await withTimeout(loadFromSupabase(S.profile),15000,'โหลดข้อมูลครอบครัว');
    updateHeader();
    var names=(S.familyMembers||[]).map(function(m){ return m.full_name||m.name||m.id||''; }).filter(Boolean);
    var title=document.getElementById('legal-title');
    var body=document.getElementById('legal-body');
    if(title) title.textContent='เชื่อมครอบครัวสำเร็จ';
    if(body) body.innerHTML=names.length
      ? 'สมาชิกครอบครัว:<br>'+names.map(esc).join('<br>')
      : 'เชื่อมต่อครอบครัวนี้เรียบร้อยแล้ว';
    var modal=document.getElementById('legal-modal');
    if(modal) modal.classList.add('on');
    var inp=document.getElementById('join-family-id');
    if(inp) inp.value='';
    toast('เชื่อมครอบครัวสำเร็จ','ok');
  }catch(e){
    console.error('[BX Error]',e);
    toast((e&&e.message)||'เชื่อมครอบครัวไม่สำเร็จ','err');
  }
}
function exportCSV(type){
  if(!(S.profile&&S.profile.sub_tier==='pro_109'&&S.hasAccess)) return toast('Export CSV ใช้ได้เฉพาะ Pro 109฿','err');
  var rows=[],hdr=[],name='';
  if(type==='expense'){ hdr=['วันที่','รายละเอียด','หมวดหมู่','ช่องทาง','จำนวน','ผู้จ่าย']; rows=S.expenses.map(function(e){ return [e.date,e.detail,e.category,e.payment,e.amount,e.paidBy]; }); name='รายจ่าย'; }
  else if(type==='income'){ hdr=['วันที่','รายละเอียด','หมวดหมู่','ช่องทางรับ','จำนวน','ผู้รับ']; rows=S.incomes.map(function(i){ return [i.date,i.detail,i.category,i.channel,i.amount,i.receiver]; }); name='รายรับ'; }
  else if(type==='credit'){ hdr=['สินเชื่อ','สถานะ','จำนวนที่จ่าย','คงเหลือ','วันที่จ่าย']; var mo=thisMo(); rows=getMyCredits().map(function(cr){ var st=S.crStatus[cr.id]||{},paid=st.paid&&(st.date||'').slice(0,7)===mo; return [cr.n,paid?'จ่ายแล้ว':'ยังไม่จ่าย',paid?st.amount:0,st.remaining||0,st.date||'']; }); name='สินเชื่อ'; }
  var lines=[hdr].concat(rows).map(function(r){ return r.map(function(v){ return '"'+String(v).replace(/"/g,'""')+'"'; }).join(','); });
  var a=document.createElement('a'); a.href=URL.createObjectURL(new Blob(['\uFEFF'+lines.join('\r\n')],{type:'text/csv;charset=utf-8;'})); a.download=name+'.csv'; a.click();
  toast('Export '+name+' แล้ว','ok');
}
async function deleteAccountAndData(){
  if(!S.user||!S.profile) return toast('ไม่พบ session ผู้ใช้','err');
  var confirmText=prompt('พิมพ์ DELETE เพื่อยืนยันการลบบัญชีและข้อมูลทั้งหมด');
  if(confirmText!=='DELETE') return toast('ยกเลิกการลบบัญชี');
  var fid=S.profile.family_id;
  try{
    toast('กำลังลบบัญชี...','info');
    var tables=['expenses','incomes','credits','credit_info'];
    for(var i=0;i<tables.length;i++){
      var q=sb.from(tables[i]).delete().eq('user_id',S.user.id);
      if(fid) q=q.eq('family_id',fid);
      var res=await q;
      if(res.error) console.warn('delete table failed ['+tables[i]+']:',res.error.message);
    }
    var prof=await sb.from('profiles').delete().eq('id',S.user.id);
    if(prof.error) console.warn('delete profile failed:',prof.error.message);
    await sb.auth.signOut();
    S.expenses=[]; S.incomes=[]; S.crStatus={}; S.crInfo={};
    localStorage.removeItem('crStatus');
    localStorage.removeItem('crInfo');
    S.user=null; S.profile=null;
    document.getElementById('auth-screen').classList.remove('off');
    toast('ลบข้อมูลผู้ใช้แล้ว หากต้องการลบ Auth user ให้ใช้ Edge Function/RPC ที่ปลอดภัย','ok');
  }catch(e){
    console.error('delete account failed:',e);
    toast('ลบบัญชีไม่สำเร็จ: '+(e.message||e),'err');
  }
}
function clearLocal(type){
  if(!confirm('ล้าง cache '+(type==='all'?'ทั้งหมด':'รายจ่าย')+'?\n(Supabase ยังเก็บข้อมูลไว้)')) return;
  if(type==='expense'||type==='all') S.expenses=[];
  if(type==='income'||type==='all') S.incomes=[];
  if(type==='all'){
    S.crStatus={}; localStorage.removeItem('crStatus');
    S.crInfo={}; localStorage.removeItem('crInfo');
    S.customCr=[]; localStorage.removeItem('customCr');
  }
  renderHist(); renderDash(); renderIncSum(); renderSetStats(); renderAddSummary();
  toast('ล้าง cache แล้ว');
}

// ─── Theme Toggle (Fix 3) ─────────────────────────────────
function toggleTheme(){
  var isLight=document.body.classList.contains('light');
  document.body.classList.toggle('light',!isLight);
  localStorage.setItem('theme',!isLight?'light':'dark');
  localStorage.setItem('themeManual','1');
  document.getElementById('theme-btn').textContent=!isLight?'☀️':'🌙';
}
function initTheme(){
  var saved=localStorage.getItem('themeManual')==='1'?(localStorage.getItem('theme')||'light'):'light';
  var isLight=saved==='light';
  document.body.classList.toggle('light',isLight);
  var btn=document.getElementById('theme-btn');
  if(btn) btn.textContent=isLight?'☀️':'🌙';
}
// Call initTheme early
(function(){ initTheme(); })();
