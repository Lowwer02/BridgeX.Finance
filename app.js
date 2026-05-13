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
  {id:'food',l:'🍜 อาหาร',c:'#f59e0b'},{id:'drink',l:'🧋 เครื่องดื่ม',c:'#3b82f6'},
  {id:'snack',l:'🍿 ขนม',c:'#f97316'},{id:'cat',l:'🐾 สัตว์เลี้ยง',c:'#fb923c'},
  {id:'shop',l:'🛍 ช้อปปิ้ง',c:'#ec4899'},{id:'act',l:'🎯 กิจกรรม',c:'#10b981'},
  {id:'trans',l:'✈️ การเดินทาง',c:'#8b5cf6'},{id:'place',l:'🏠 สถานที่',c:'#64748b'},
  {id:'inv',l:'💹 การลงทุน',c:'#06b6d4'},{id:'health',l:'🏥 สุขภาพ',c:'#22d3ee'},
  {id:'bill',l:'📄 บิล',c:'#6366f1'},{id:'edu',l:'📚 การศึกษา',c:'#0ea5e9'},
  {id:'donate',l:'🤝 การบริจาค',c:'#14b8a6'},{id:'travel',l:'🌍 ท่องเที่ยว',c:'#f43f5e'},
  {id:'fam',l:'👨‍👩‍👦 ให้ครอบครัว',c:'#a855f7'},{id:'other',l:'💼 อื่นๆ',c:'#78716c'}
];
const DEF_PAYS = [
  {id:'cash',l:'เงินสด'},{id:'xfer',l:'โอนเงิน'}
];
const DEF_INCC = [
  {id:'sal',l:'💼 เงินเดือน',c:'#22c98a'},{id:'bon',l:'🎁 โบนัส',c:'#f5a623'},
  {id:'free',l:'💻 ฟรีแลนซ์',c:'#4d9ef5'},{id:'inv',l:'📈 ลงทุน',c:'#7c6ef5'},
  {id:'oth',l:'💰 อื่นๆ',c:'#6b7280'}
];
const DEF_INCH = [
  {id:'bank',l:'🏦 โอนเข้าบัญชี'},{id:'cash',l:'💵 รับเงินสด'},{id:'prompt',l:'📱 พร้อมเพย์'}
];
const BASE_CR = [
  {id:'ktc',n:'KTC',t:'revolving',ico:'🔵',rate:18},
  {id:'ktcm',n:'KTC Money',t:'revolving',ico:'🔵',rate:25},
  {id:'aeon',n:'AEON',t:'revolving',ico:'🔴',rate:18},
  {id:'aeonm',n:'AEON Money',t:'revolving',ico:'🔴',rate:25},
  {id:'kbank',n:'K-Bank',t:'revolving',ico:'💚',rate:18},
  {id:'kbankm',n:'K-Bank Money',t:'revolving',ico:'💚',rate:25},
  {id:'kfirst',n:'K-First',t:'revolving',ico:'🟤',rate:18},
  {id:'shopee',n:'Shopee Pay Later',t:'revolving',ico:'🟠',rate:22},
  {id:'shopeem',n:'Shopee Money',t:'revolving',ico:'🟠',rate:22},
  {id:'true',n:'True Pay Later',t:'revolving',ico:'💜',rate:22},
  {id:'thisshop',n:'This Shop',t:'revolving',ico:'🛒',rate:20},
  {id:'gold',n:'ทอง',t:'fixed',ico:'🥇',rate:0},
  {id:'car',n:'รถยนต์',t:'fixed',ico:'🚗',rate:0}
];
const PAY2CR = {
  '💚 K-Bank':'kbank','K-Bank':'kbank',
  '🔵 KTC':'ktc','KTC':'ktc',
  '🔴 Aeon':'aeon','Aeon':'aeon',
  '🟤 K-First':'kfirst','K-First':'kfirst',
  '🟠 Shopee Pay Later':'shopee','Shopee Pay Later':'shopee',
  '🟠 Shopee Money':'shopeem','Shopee Money':'shopeem',
  '💜 True Pay Later':'true','True Pay Later':'true'
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
  strategy:'avalanche', extraCash:5000,
  activeCr:'', activeInfo:''
};
var authMode='login';

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
function today(){ return new Date().toISOString().slice(0,10); }
function thisMo(){ var n=new Date(); return n.getFullYear()+'-'+String(n.getMonth()+1).padStart(2,'0'); }
function fmt(n){ return Number(n||0).toLocaleString('th-TH',{maximumFractionDigits:0}); }
function fmt2(n){ return Number(n||0).toLocaleString('th-TH',{minimumFractionDigits:2,maximumFractionDigits:2}); }
function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function allCR(){ return BASE_CR.concat(S.customCr); }
function getMyCredits(){
  return allCR().filter(function(c){ return !!(S.crInfo&&S.crInfo[c.id]); });
}
function payIcon(label){
  if(label==='เงินสด') return '💵';
  if(label==='โอนเงิน') return '📲';
  var cr=allCR().find(function(c){ return c.n===label; });
  return cr?cr.ico||'💳':'💳';
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
  logStep('1. Fetching Profile...',S.user.id);
  var res=await withTimeout(sb.from('profiles').select('*').eq('id',S.user.id).maybeSingle(),30000,'อ่านโปรไฟล์');
  logStep('1. Profile fetch response',{hasData:!!res.data,status:res.status,error:res.error});
  if(res.error && res.error.code!=='PGRST116'){
    logSbError('profiles select',res);
    throw res.error;
  }
  if(!res.data){
    logStep('2. Profile missing, inserting...');
    var meta=S.user.user_metadata||{};
    var trialEnd=new Date(Date.now()+60*86400000).toISOString();
    var row={id:S.user.id,full_name:meta.full_name||meta.name||'',sub_tier:'trial',trial_end:trialEnd,updated_at:new Date().toISOString()};
    var ins=await withTimeout(sb.from('profiles').insert([row]).select('*').single(),30000,'สร้างโปรไฟล์');
    logStep('2. Profile insert response',{hasData:!!ins.data,status:ins.status,error:ins.error});
    if(ins.error){
      logSbError('profiles insert',ins);
      var duplicate=ins.status===409||ins.error.code==='23505'||String(ins.error.message||'').indexOf('duplicate key')>=0;
      if(!duplicate) throw ins.error;
      console.warn('profile already exists, selecting existing profile');
      var again=await withTimeout(sb.from('profiles').select('*').eq('id',S.user.id).single(),30000,'อ่านโปรไฟล์หลังชน 409');
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
  var res=await withTimeout(sb.from('profiles').update({family_id:fid,updated_at:new Date().toISOString()}).eq('id',S.user.id).select('*').single(),30000,'บันทึก family_id');
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

// ── PATCH v4.1.2: boot guards ────────────────────────
var _isBootstrapping = false;   // prevents onLogin() concurrency
var _lastSessionUid  = null;    // prevents re-trigger for same user
// ─────────────────────────────────────────────────────

window.addEventListener('DOMContentLoaded', async function(){
  try{
    ['f-dt','i-dt','dr-dt'].forEach(function(id){ var e=document.getElementById(id); if(e) e.value=today(); });
    updateAuthButtons();
    sb.auth.onAuthStateChange(async function(event,session){
      try{
        if(session&&session.user){
          var uid=session.user.id;
          // Skip if same user already bootstrapping or bootstrapped
          if(_isBootstrapping){ console.log('[BX Auth] onAuthStateChange skipped — already bootstrapping'); return; }
          if(uid===_lastSessionUid){ console.log('[BX Auth] onAuthStateChange skipped — same user already loaded'); return; }
          S.user=session.user;
          await onLogin();
        }
      }catch(e){
        console.error('auth state load failed:',e);
        toast('โหลด session ไม่สำเร็จ: '+(e.message||e),'err');
      }finally{
        document.getElementById('loading')?.classList.add('off');
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
    document.getElementById('loading')?.classList.add('off');
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
  _lastSessionUid=null; // PATCH v4.1.2: allow fresh onLogin for explicit sign-in
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
  // ── PATCH v4.1.2: prevent duplicate concurrent calls ──
  if(_isBootstrapping){
    console.log('[BX Auth] onLogin() skipped — already running');
    return;
  }
  _isBootstrapping = true;
  // ────────────────────────────────────────────────────
  document.getElementById('auth-screen').classList.add('off');
  try{
    logStep('onLogin start');
    // Fetch profile ONCE here; pass it forward so loadFromSupabase doesn't re-fetch
    await ensureProfile();
    await ensureFamily();
    logStep('onLogin checkAccess');
    checkAccess();
    if(!S.profile.full_name){
      document.getElementById('onboard-name').value=(S.user.user_metadata&&S.user.user_metadata.full_name)||'';
      document.getElementById('onboard-modal').classList.add('on');
    }
    await loadFamilyMembers();
    logStep('onLogin family members loaded');
    // Mark this user as fully bootstrapped — onAuthStateChange will skip future triggers
    _lastSessionUid = S.user.id;
  }catch(e){
    var isTimeout = e&&e.message&&e.message.indexOf('ใช้เวลานานเกินไป')>=0;
    console.error('profile bootstrap failed raw:',{
      message:e&&e.message,
      details:e&&e.details,
      hint:e&&e.hint,
      code:e&&e.code,
      raw:e
    });
    if(isTimeout){
      toast('เชื่อมต่อช้า — ลองรีเฟรชหน้าใหม่อีกครั้ง','err');
    } else {
      toast('โหลดโปรไฟล์ไม่สำเร็จ: '+(e.message||e),'err');
    }
  }finally{
    // Always release loading — never hang on profile error
    document.getElementById('loading')?.classList.add('off');
    _isBootstrapping = false;
  }
  applyCurrentProfileToPayers();
  updateHeader();
  renderPersonFilters();
  renderCats(); renderPays(); renderIncc(); renderInch();
  renderHist(); renderCR(); renderDash(); renderIncSum(); renderSetStats(); renderAddSummary();
  document.getElementById('set-user').textContent=S.user?S.user.email:'';
  // Pass the already-fetched profile so loadFromSupabase skips re-fetching it
  try{
    await loadFromSupabase(S.profile);
  }catch(e){
    console.error('onLogin load failed raw:',{
      message:e&&e.message,
      details:e&&e.details,
      hint:e&&e.hint,
      code:e&&e.code,
      raw:e
    });
    toast('โหลดข้อมูลไม่สำเร็จ: '+(e.message||e),'err');
  }finally{
    document.getElementById('loading')?.classList.add('off');
  }
}
async function doLogout(){
  if(!confirm('ออกจากระบบ?')) return;
  await sb.auth.signOut();
  S.user=null;
  // PATCH v4.1.2: reset boot guards so next login runs cleanly
  _isBootstrapping=false;
  _lastSessionUid=null;
  document.getElementById('auth-screen').classList.remove('off');
  toast('ออกจากระบบแล้ว');
}

// ═══════════════════════════════════════════════════════
// SUPABASE DATA
// ═══════════════════════════════════════════════════════
async function loadFromSupabase(preloadedProfile){
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
    S.expenses=[]; S.incomes=[]; S.crStatus={};
    // Load expenses
    logStep('10. Fetching expenses...');
    var expRes = await withTimeout(sb.from('expenses').select('*').eq('family_id',fid).order('date',{ascending:false}),30000,'โหลด expenses');
    logStep('10. Expenses response',{count:expRes.data&&expRes.data.length,status:expRes.status,error:expRes.error});
    throwSb('expenses select',expRes);
    if(expRes.data&&expRes.data.length){
      var exSet={};
      S.expenses.forEach(function(e){ exSet[e.date+'|'+e.amount+'|'+e.detail]=1; });
      expRes.data.forEach(function(r,i){
        var key=(r.date||'')+'|'+(r.amount||0)+'|'+(r.detail||'');
        if(!exSet[key]) S.expenses.push({
          id:r.id||('sb'+Date.now()+i), date:r.date||'',
          detail:r.detail||'-', category:r.category||'',
          catC:r.cat_color||'#7c6ef5', payment:r.payment||'',
          amount:Number(r.amount||0), paidBy:r.paid_by||'', createdAt:r.created_at||''
        });
      });
      S.expenses.sort(function(a,b){ return (b.date||'').localeCompare(a.date||''); });
    }
    // Load incomes
    logStep('11. Fetching incomes...');
    var incRes = await withTimeout(sb.from('incomes').select('*').eq('family_id',fid).order('date',{ascending:false}),30000,'โหลด incomes');
    logStep('11. Incomes response',{count:incRes.data&&incRes.data.length,status:incRes.status,error:incRes.error});
    throwSb('incomes select',incRes);
    if(incRes.data&&incRes.data.length){
      var incSet={};
      S.incomes.forEach(function(i){ incSet[i.date+'|'+i.amount+'|'+i.detail]=1; });
      incRes.data.forEach(function(r,i){
        var key=(r.date||'')+'|'+(r.amount||0)+'|'+(r.detail||'');
        if(!incSet[key]) S.incomes.push({
          id:r.id||('si'+Date.now()+i), date:r.date||'',
          detail:r.detail||'-', category:r.category||'',
          channel:r.channel||'', amount:Number(r.amount||0), receiver:r.receiver||''
        });
      });
      S.incomes.sort(function(a,b){ return (b.date||'').localeCompare(a.date||''); });
    }
    // Load credit payments
    logStep('12. Fetching credits...');
    var crRes = await withTimeout(sb.from('credits').select('*').eq('family_id',fid).order('date',{ascending:false}),30000,'โหลด credits');
    logStep('12. Credits response',{count:crRes.data&&crRes.data.length,status:crRes.status,error:crRes.error});
    throwSb('credits select',crRes);
    if(crRes.data){
      var mo=thisMo();
      crRes.data.forEach(function(r){
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
    }
    // Load credit info
    S.crInfo={};
    logStep('13. Fetching credit_info...');
    var ciRes = await withTimeout(sb.from('credit_info').select('*').eq('family_id',fid),30000,'โหลด credit_info');
    logStep('13. Credit info response',{count:ciRes.data&&ciRes.data.length,status:ciRes.status,error:ciRes.error});
    throwSb('credit_info select',ciRes);
    if(ciRes.data){
      ciRes.data.forEach(function(r){
        var found=allCR().find(function(c){ return c.n===(r.credit_name||r.name||''); });
        if(!found){
          found={id:'cr_'+String(r.credit_name||r.name||Date.now()).toLowerCase().replace(/\W+/g,'_'),n:r.credit_name||r.name||'Credit',t:r.type||'revolving',ico:'💳',rate:Number(r.rate||0)};
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
    }
    loadCreditOptions();
    if(Object.keys(S.crInfo||{}).length>0) document.getElementById('credit-setup-modal').classList.remove('on');
    recomputeMatchedCreditBalances();
    renderPersonFilters();
    sv();
    renderHist(); renderCR(); renderDash(); renderIncSum(); renderSetStats(); renderAddSummary();
    setDot('ok','Synced ✅');
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
    document.getElementById('loading')?.classList.add('off');
  }
}
async function loadFamilyData(){ return loadFromSupabase(); }

async function syncNow(){
  toast('🔄 กำลัง sync...','info');
  await loadFromSupabase();
}

async function saveToSupabase(table, data){
  if(!S.user){ console.warn('saveToSupabase: no user session'); return; }
  if(!S.profile||!S.profile.family_id){ await ensureProfile(); await ensureFamily(); }
  if(!checkAccess()) return toast('กรุณาสมัครสมาชิก 59฿','err');
  try {
    var row = Object.assign({user_id: S.user.id,family_id:S.profile.family_id}, data);
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
  document.querySelectorAll('.pg').forEach(function(p){ p.classList.remove('on'); });
  document.querySelectorAll('.tbtn').forEach(function(b){ b.classList.remove('on'); });
  document.getElementById('pg-'+id).classList.add('on');
  btn.classList.add('on');
  toggleSidebar(false);
  if(id==='hist') renderHist();
  if(id==='dash') renderDash();
  if(id==='cr')   renderCR();
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
      b.textContent='👤 '+n;
      b.onclick=function(){ setter('person:'+n,b); };
      wrap.appendChild(b);
    });
  }
  fill('hist-filters',setHF,hf);
  fill('dash-filters',setDF,df);
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
  var ex={id:Date.now(),date:dt,detail:det||'-',category:cat.l,catId:cat.id,catC:cat.c||'#7c6ef5',payment:pay.l,amount:amt,paidBy:S.fc.payer,createdAt:new Date().toISOString()};
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
  toast('✅ บันทึกแล้ว','ok');
  // Save to Supabase
  saveToSupabase('expenses',{date:ex.date,detail:ex.detail,category:ex.category,payment:ex.payment,amount:ex.amount,paid_by:ex.paidBy,created_at:ex.createdAt});
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
  totalEl.textContent='฿'+fmt2(total);
  bar.style.width=pct+'%';
  budget.textContent=pct+'% of daily budget';
  var recent=S.expenses.slice().sort(function(a,b){ return String(b.date||'').localeCompare(String(a.date||'')); }).slice(0,3);
  if(!recent.length){
    list.innerHTML='<div style="font-size:13px;color:#c9c4d7;line-height:1.6">ยังไม่มีรายการล่าสุด</div>';
    return;
  }
  list.innerHTML=recent.map(function(e){
    var ico=(e.category||'💸').split(' ')[0]||'💸';
    return '<div class="recent-item"><div class="recent-left"><div class="recent-ico">'+esc(ico)+'</div><div style="min-width:0"><div class="recent-name">'+esc(e.detail||'-')+'</div><div class="recent-meta">'+esc(e.category||'')+' • '+esc(e.payment||'')+'</div></div></div><div class="recent-amt">-฿'+fmt(e.amount)+'</div></div>';
  }).join('');
}

function autoMatch(ex){
  var crId=PAY2CR[ex.payment]||PAY2CR[ex.payment.replace(/^[^\s]+\s/,'')];
  if(!crId) return;
  var st=S.crStatus[crId]||{paid:false,amount:0,remaining:0,date:''};
  if(st.baseRemaining==null) st.baseRemaining = st.remaining||0;
  if(!st.baseAt) st.baseAt = new Date().toISOString();
  st.matchedUsed = (st.matchedUsed||0)+ex.amount;
  st.remaining=Math.max(0,(parseFloat(st.baseRemaining)||0)-st.matchedUsed);
  S.crStatus[crId]=st; sv();
}

// ═══════════════════════════════════════════════════════
// HISTORY
// ═══════════════════════════════════════════════════════
var hf='all';
function setHF(f,el){ hf=f; document.querySelectorAll('#pg-hist .fchip').forEach(function(c){ c.classList.remove('on'); }); el.classList.add('on'); renderHist(); }
// Track which day-groups are open (default open)
var openDays = {};
function renderHist(){
  var list=document.getElementById('hist-list'); list.innerHTML='';
  var mo=thisMo();
  var items=S.expenses.slice();
  if(hf==='mo') items=items.filter(function(e){ return e.date&&e.date.slice(0,7)===mo; });
  if(hf.indexOf('person:')===0){ var pn=hf.slice(7); items=items.filter(function(e){ return e.paidBy===pn; }); }
  if(!items.length){ list.innerHTML='<div class="empty"><div class="ei">📭</div><p>ยังไม่มีรายการ</p></div>'; return; }
  // Group by month
  var monthGrps={};
  items.forEach(function(e){ var k=(e.date||'').slice(0,7); if(!monthGrps[k]) monthGrps[k]=[]; monthGrps[k].push(e); });
  Object.keys(monthGrps).sort(function(a,b){ return b.localeCompare(a); }).forEach(function(moKey){
    var moItems=monthGrps[moKey];
    var moTot=moItems.reduce(function(s,e){ return s+e.amount; },0);
    var moDiv=document.createElement('div'); moDiv.style.marginBottom='16px';
    var moHdr=document.createElement('div'); moHdr.className='mhdr';
    moHdr.textContent=thaiMo(moKey)+' · ฿'+fmt(moTot)+' ('+moItems.length+' รายการ)';
    moDiv.appendChild(moHdr);
    // Group by day inside month
    var dayGrps={};
    moItems.forEach(function(e){ var k=e.date||'unknown'; if(!dayGrps[k]) dayGrps[k]=[]; dayGrps[k].push(e); });
    Object.keys(dayGrps).sort(function(a,b){ return b.localeCompare(a); }).forEach(function(dayKey){
      var dayItems=dayGrps[dayKey];
      var dayTot=dayItems.reduce(function(s,e){ return s+e.amount; },0);
      var isOpen=openDays[dayKey]!==false;
      var dFull=dayKey&&dayKey!=='unknown'?new Date(dayKey).toLocaleDateString('th-TH',{weekday:'short',day:'numeric',month:'short'}):'ไม่ระบุวัน';
      // Day header
      var dayHdr=document.createElement('div');
      dayHdr.style.cssText='display:flex;align-items:center;justify-content:space-between;padding:9px 12px;background:var(--card2);border-radius:var(--rds);margin-bottom:6px;cursor:pointer;border:1px solid var(--bdr)';
      dayHdr.innerHTML='<div style="display:flex;align-items:center;gap:8px"><span style="font-size:12.5px;font-weight:700;color:var(--tx)">'+dFull+'</span><span style="font-size:11px;color:var(--mut)">'+dayItems.length+' รายการ</span></div><div style="display:flex;align-items:center;gap:8px"><span style="font-size:13px;font-weight:700;font-family:var(--mono);color:var(--p)">฿'+fmt(dayTot)+'</span><span class="day-chev" style="font-size:12px;color:var(--mut);transition:transform .25s;display:inline-block;transform:'+(isOpen?'rotate(180deg)':'rotate(0deg)')+'">▾</span></div>';
      // Day body
      var dayBody=document.createElement('div');
      dayBody.style.cssText='overflow:hidden;max-height:'+(isOpen?'9999px':'0');
      dayBody.style.transition='max-height .3s ease';
      dayItems.forEach(function(e){
        var item=document.createElement('div'); item.className='exi';
        item.style.setProperty('--cat-c',e.catC||'#7c6ef5');
        var ico=(e.category||'').split(' ')[0]||'💸';
        item.innerHTML='<div class="exico">'+ico+'</div><div class="exbody"><div class="exname">'+esc(e.detail)+'</div><div class="exmeta">'+esc(e.category||'')+' · '+esc(e.payment||'')+'</div></div><div class="exr"><div class="examt">฿'+fmt(e.amount)+'</div><div class="expay">👤 '+esc(e.paidBy||'')+'</div></div><button class="delbtn" onclick="delEx(this.dataset.id)" data-id="'+e.id+'">×</button>';
        dayBody.appendChild(item);
      });
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
}
async function delEx(idOrEl){
  var id=typeof idOrEl==='object'?idOrEl.dataset.id:idOrEl;
  // Confirm dialog
  if(!confirm('⚠️ ลบรายการนี้ออกจากฐานข้อมูล?\n\nการลบไม่สามารถย้อนกลับได้')) return;
  // Remove from local state immediately (optimistic)
  S.expenses=S.expenses.filter(function(e){ return String(e.id)!==String(id); });
  renderHist(); renderDash(); renderAddSummary();
  // Delete from Supabase
  if(S.user){
    try{
      var numId=Number(id);
      var res=await sb.from('expenses').delete().eq('id', isNaN(numId)?id:numId).eq('family_id',S.profile.family_id);
      if(res.error){ toast('⚠️ ลบจาก DB ไม่สำเร็จ: '+res.error.message,'err'); }
      else{ toast('🗑 ลบรายการแล้ว','ok'); }
    }catch(e){ toast('⚠️ เกิดข้อผิดพลาด: '+(e.message||e),'err'); }
  }
}

// ═══════════════════════════════════════════════════════
// CREDIT TAB
// ═══════════════════════════════════════════════════════
var crf='overview', activeCrId='', activeInfoId='';
function setCRF(f,el){ crf=f; document.querySelectorAll('#pg-cr .fchip').forEach(function(c){ c.classList.remove('on'); }); el.classList.add('on'); renderCR(); }

function renderCR(){
  if(S.profile&&S.profile.family_id&&Object.keys(S.crInfo||{}).length===0){
    var list0=document.getElementById('cr-list'); if(list0) list0.innerHTML="<div class=\"card\" style=\"text-align:center\"><div class=\"ctitle\" style=\"justify-content:center\">Credit Setup</div><p style=\"font-size:13px;color:var(--sub);line-height:1.7;margin-bottom:12px\">ยังไม่มีสินเชื่อในครอบครัวนี้</p><button class=\"btn-go\" onclick=\"openCreditSetupModal('revolving')\">เพิ่มสินเชื่อใบแรก</button></div>";
    return;
  }
  renderDebtOverview();
  renderMatchSummary();
  var list=document.getElementById('cr-list'); list.innerHTML='';
  if(crf==='plan'){ renderSmartDebt(); return; }
  if(crf==='overview'){ return; } // overview only shows the two cards above
  var types=crf==='all'?['revolving','fixed']:[crf];
  var TL={revolving:'💳 สินเชื่อหมุนเวียน',fixed:'🏠 สินเชื่อหลักประกัน'};
  var TLC={revolving:'var(--p)',fixed:'var(--b)'};
  var mo=thisMo();
  types.forEach(function(t){
    var grp=getMyCredits().filter(function(c){ return c.t===t; });
    var paidCnt=grp.filter(function(cr){ var st=S.crStatus[cr.id]||{}; return st.paid&&(st.date||'').slice(0,7)===mo; }).length;
    var totAmt=grp.filter(function(cr){ var st=S.crStatus[cr.id]||{}; return st.paid&&(st.date||'').slice(0,7)===mo; }).reduce(function(s,cr){ return s+(S.crStatus[cr.id].amount||0); },0);
    // Collapsible section — same style as dashboard
    var secDiv=document.createElement('div'); secDiv.className='dash-section'; secDiv.dataset.type=t;
    var isOpen=S['crSec_'+t]!==false;
    var sHdr=document.createElement('div'); sHdr.className='dash-section-hdr';
    sHdr.innerHTML='<div class="dash-section-title" style="color:'+TLC[t]+'">'+TL[t]+'</div><div class="dash-section-meta"><span style="color:var(--mut);font-size:11px">'+paidCnt+'/'+grp.length+'</span>'+(totAmt?'<span style="color:var(--gl);font-weight:700;font-size:11px;font-family:var(--mono)">฿'+fmt(totAmt)+'</span>':'')+' <button class="btn-sm" onclick="event.stopPropagation();addCR(\''+t+'\')" style="width:auto;font-size:10px;padding:3px 9px;margin-left:4px">+ เพิ่ม</button><span class="dash-chevron '+(isOpen?'open':'')+'">▾</span></div>';
    (function(type,sd,sh){ sh.onclick=function(e){ if(e.target.tagName==='BUTTON') return; var b=sd.querySelector('.dash-section-body'),ch=sh.querySelector('.dash-chevron'),open=b.classList.contains('open'); b.classList.toggle('open',!open); ch.classList.toggle('open',!open); S['crSec_'+type]=!open; }; })(t,secDiv,sHdr);
    var sBody=document.createElement('div'); sBody.className='dash-section-body'+(isOpen?' open':'');
    var inner=document.createElement('div'); inner.className='dash-body-inner';
    grp.forEach(function(cr){
      var st=S.crStatus[cr.id]||{},info=S.crInfo[cr.id]||{};
      var isPaid=st.paid&&(st.date||'').slice(0,7)===mo;
      var pct=0;
      if(info.limit&&info.limit>0){ var used=info.limit-(st.remaining!=null?st.remaining:info.limit); pct=Math.min(100,Math.max(0,Math.round(used/info.limit*100))); }
      var moLeft=calcMoLeft(st.remaining,info.minPay,info.rate||cr.rate||0);
      var item=document.createElement('div'); item.className='cr-item '+(isPaid?'paid':'unpaid');
      var topHtml='<div style="font-size:19px;flex-shrink:0">'+esc(cr.ico||'💳')+'</div><div style="flex:1;min-width:0"><div class="cr-name">'+esc(cr.n)+'</div><div class="cr-sub">'+(isPaid?'จ่าย ฿'+fmt(st.amount)+' · เหลือ ฿'+fmt2(st.remaining||0):'ยังไม่ได้จ่าย'+(info.dueDate?' · ครบ '+info.dueDate:''))+'</div></div><div style="flex-shrink:0;text-align:right"><span class="cr-badge '+(isPaid?'paid':'unpaid')+'">'+(isPaid?'✅ จ่ายแล้ว':'⏳ ค้างชำระ')+'</span><div style="font-size:11px;color:var(--mut);margin-top:3px">'+(isPaid?'฿'+fmt(st.amount):info.minPay?'ขั้นต่ำ ฿'+fmt(info.minPay):'')+'</div></div><div style="display:flex;flex-direction:column;gap:4px;margin-left:6px"><button class="btn-sm" onclick="openPay(\''+cr.id+'\')" style="width:auto;font-size:11px;padding:4px 8px">💳 จ่าย</button><button class="btn-sm" onclick="openInfo(\''+cr.id+'\')" style="width:auto;font-size:11px;padding:4px 8px">ℹ️</button></div>';
      var barColor=isPaid?'var(--gl)':'var(--a)';
      var progressHtml=info.limit?'<div class="cr-progress-wrap"><div class="cr-progress-row"><div class="cr-progress-lbl">ใช้ '+pct+'%</div><div class="cr-progress-track"><div class="cr-progress-fill" style="width:'+pct+'%;background:'+barColor+'"></div></div><div class="cr-months">'+(moLeft!=null?'~'+moLeft+' เดือน':'ยังไม่ทราบ')+'</div></div></div>':'';
      item.innerHTML='<div style="display:flex;align-items:center;gap:9px;width:100%">'+topHtml+'</div>'+progressHtml;
      inner.appendChild(item);
    });
    sBody.appendChild(inner); secDiv.appendChild(sHdr); secDiv.appendChild(sBody);
    list.appendChild(secDiv);
  });
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
  providerEl.value=providerEl.value||'KTC';
  limitEl.value=''; rateEl.value=''; minEl.value=''; billEl.value=''; dueEl.value='';
  var title=modal.querySelector('.modal-title');
  if(title) title.textContent=t==='revolving'?'เพิ่มสินเชื่อหมุนเวียน':'เพิ่มสินเชื่อแบบผ่อน/มีหลักประกัน';
  modal.classList.add('on');
}
function addCR(t){ openCreditSetupModal(t); }
async function saveFirstCredit(){
  try{
    var provider=document.getElementById('cs-provider').value;
    var type=document.getElementById('cs-type').value;
    if(!provider) return toast('เลือก Provider ก่อน','err');
    var cr=allCR().find(function(c){ return c.n===provider; });
    if(!cr){
      cr={id:'cr_'+provider.toLowerCase().replace(/\W+/g,'_'),n:provider,t:type,ico:'💳',rate:0};
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
  }catch(e){
    console.error('save credit setup failed:',e);
    toast('บันทึกสินเชื่อไม่สำเร็จ: '+(e.message||e),'err');
  }
}

// ── Debt Overview card ─────────────────────────────────
function renderDebtOverview(){
  var w=document.getElementById('debt-overview-card'); if(!w) return;
  if(crf!=='overview'&&crf!=='plan'){ w.innerHTML=''; return; }
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
  w.innerHTML='<div class="debt-overview"><div class="debt-overview-title">📊 ภาพรวมสินเชื่อ — '+thaiMo(mo)+'</div><div class="debt-ov-grid"><div class="debt-ov-box"><div class="debt-ov-lbl">✅ ชำระแล้ว</div><div class="debt-ov-val green">฿'+fmt(totPaid)+'</div><div style="font-size:10px;opacity:.5;margin-top:2px">'+paidCount+'/'+crCount+' บัตร</div></div><div class="debt-ov-box"><div class="debt-ov-lbl">⏳ ค้างชำระ</div><div class="debt-ov-val red">฿'+fmt(totUnpaid)+'</div></div><div class="debt-ov-box" style="grid-column:1/-1"><div class="debt-ov-lbl">วงเงินหมุนเวียนที่ใช้ไป</div><div style="display:flex;align-items:center;gap:8px;margin-top:6px"><div style="flex:1;background:rgba(255,255,255,.1);border-radius:4px;height:8px;overflow:hidden"><div style="height:8px;border-radius:4px;background:var(--a);width:'+pct+'%;transition:width .6s"></div></div><div class="debt-ov-val amber" style="font-size:14px">'+pct+'%</div></div><div style="font-size:10px;opacity:.5;margin-top:4px">฿'+fmt(totUsed)+' / ฿'+fmt(totLimit)+'</div></div></div></div>';
}

// ── Match-up Summary ──────────────────────────────────
function renderMatchSummary(){
  var w=document.getElementById('match-summary-card'); if(!w) return;
  if(crf!=='overview'){ w.innerHTML=''; return; }
  var mo=thisMo();
  var seen={};
  var matched=[];
  Object.keys(PAY2CR).forEach(function(payLabel){
    var crId=PAY2CR[payLabel];
    if(seen[crId]) return; seen[crId]=1;
    var cr=allCR().find(function(c){ return c.id===crId; });
    if(!cr||!S.crInfo[cr.id]||cr.t!=='revolving') return;
    var st=S.crStatus[crId]||{};
    var info=S.crInfo[crId]||{};
    var usedInExp=creditExpenseUsage(crId,mo,st.baseAt);
    if(usedInExp>0||st.paid) matched.push({cr:cr,st:st,info:info,usedInExp:usedInExp});
  });
  if(!matched.length){
    w.innerHTML='<div class="match-summary" style="opacity:.72"><div class="match-sum-title">🔄 Match-up: วนใช้สินเชื่อเดือนนี้</div><div style="font-size:12px;color:var(--mut);text-align:center;padding:8px 0">ยังไม่มีรายจ่ายผ่านบัตรเครดิตเดือนนี้</div></div>';
    return;
  }
  var rows=matched.map(function(m){
    var rem=m.st.remaining!=null?m.st.remaining:(m.info.limit||0);
    var usedHtml=m.usedInExp>0?'<span class="match-used">-฿'+fmt(m.usedInExp)+'</span>':'<span style="color:var(--mut);font-size:12px">ไม่มีรายจ่ายเดือนนี้</span>';
    var remHtml=rem>0?'<span style="color:var(--mut);font-size:11px">เหลือ</span><span class="match-left">฿'+fmt2(rem)+'</span>':'';
    return '<div class="match-row"><div class="match-cr-name">'+esc(m.cr.ico)+' '+esc(m.cr.n)+'</div><div style="display:flex;gap:8px;align-items:center">'+usedHtml+remHtml+'</div></div>';
  }).join('');
  w.innerHTML='<div class="match-summary"><div class="match-sum-title">🔄 Match-up: วนใช้สินเชื่อเดือนนี้</div>'+rows+'<div style="font-size:10px;color:var(--mut);margin-top:8px">ยอดวนใช้หักจากวงเงินคงเหลืออัตโนมัติเมื่อบันทึกรายจ่าย</div></div>';
}

// ── Pay & Info drawers ────────────────────────────────
function openPay(id){
  activeCrId=id;
  var cr=allCR().find(function(c){ return c.id===id; }),st=S.crStatus[id]||{},info=S.crInfo[id]||{};
  document.getElementById('dr-title').textContent='ชำระ '+cr.n;
  document.getElementById('dr-sub').textContent='วงเงินคงเหลือ: ฿'+fmt2(st.remaining||0)+(info.minPay?' · ขั้นต่ำ ฿'+fmt(info.minPay):'');
  document.getElementById('dr-amt').value=''; document.getElementById('dr-rem').value=st.remaining||''; document.getElementById('dr-dt').value=today();
  document.getElementById('pay-drawer').classList.add('on');
}
async function submitCredit(){
  var amt=parseFloat(document.getElementById('dr-amt').value);
  var rem=parseFloat(document.getElementById('dr-rem').value)||0;
  var dt=document.getElementById('dr-dt').value;
  if(!amt||amt<=0) return toast('ใส่จำนวนเงินด้วย','err');
  var cr=allCR().find(function(c){ return c.id===activeCrId; });
  var baseAt=new Date().toISOString();
  S.crStatus[activeCrId]={paid:true,amount:amt,baseRemaining:rem,baseAt:baseAt,matchedUsed:0,remaining:rem,date:dt};
  recomputeMatchedCreditBalances();
  sv(); closeD('pay-drawer'); renderCR(); renderDash();
  toast('✅ บันทึกชำระ '+cr.n,'ok');
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
  toast('✅ บันทึกข้อมูล '+cr.n,'ok');
  saveToSupabase('credit_info',{credit_name:cr.n,type:cr.t,credit_limit:info.limit,rate:info.rate,min_pay:info.minPay,bill_cycle:info.billCycle,due_date:info.dueDate});
}
function closeD(id){ document.getElementById(id).classList.remove('on'); }
function closeDrBg(e,id){ if(e.target===document.getElementById(id)) closeD(id); }
function closeModalBg(e,id){ if(e.target===document.getElementById(id)) closeD(id); }

// ═══════════════════════════════════════════════════════
// SMART DEBT PLANNER (Q2: Snowball + Avalanche)
// ═══════════════════════════════════════════════════════
function renderSmartDebt(){
  var list=document.getElementById('cr-list'); list.innerHTML='';
  var mo=thisMo();
  // Get credits with data — exclude 'expense' type
  var debtList=getMyCredits().filter(function(cr){
    if(cr.t==='expense') return false;
    var info=S.crInfo[cr.id]||{};
    var st=S.crStatus[cr.id]||{};
    return (st.remaining!=null&&st.remaining>0)||(info.minPay&&info.minPay>0);
  }).map(function(cr){
    var info=S.crInfo[cr.id]||{};
    var st=S.crStatus[cr.id]||{};
    return {cr:cr,info:info,st:st,remaining:st.remaining!=null?st.remaining:(info.limit||0),rate:info.rate||cr.rate||0,minPay:info.minPay||0};
  }).filter(function(d){ return d.remaining>0; });

  if(!debtList.length){
    list.innerHTML='<div class="empty"><div class="ei">🎉</div><p>ไม่มีข้อมูลหนี้สำหรับวางแผน<br>กรอกข้อมูลสินเชื่อก่อนนะ</p></div>';
    return;
  }

  // Strategy toggle
  var toggleDiv=document.createElement('div'); toggleDiv.className='strategy-toggle';
  var btnSnow=document.createElement('button'); btnSnow.className='strategy-btn'+(S.strategy==='snowball'?' on':'');
  btnSnow.innerHTML='<span class="st-icon">⛄</span>Snowball<br><span style="font-size:10px;opacity:.7">ก้อนเล็กก่อน</span>';
  btnSnow.onclick=function(){ S.strategy='snowball'; updateSmartResults(); };
  var btnAva=document.createElement('button'); btnAva.className='strategy-btn'+(S.strategy==='avalanche'?' on':'');
  btnAva.innerHTML='<span class="st-icon">🏔</span>Avalanche<br><span style="font-size:10px;opacity:.7">ดอกแพงก่อน</span>';
  btnAva.onclick=function(){ S.strategy='avalanche'; updateSmartResults(); };
  toggleDiv.appendChild(btnSnow); toggleDiv.appendChild(btnAva);
  list.appendChild(toggleDiv);

  // ── Extra cash input (rendered ONCE — never re-created to avoid focus loss) ──
  var extraRow=document.createElement('div'); extraRow.className='extra-cash-row';
  extraRow.style.cssText='flex-direction:column;align-items:stretch;gap:6px';
  var extraTop=document.createElement('div'); extraTop.style.cssText='display:flex;align-items:center;justify-content:space-between;gap:10px';
  var extraLbl=document.createElement('label'); extraLbl.style.cssText='font-size:12px;font-weight:700;color:var(--sub);text-transform:uppercase;letter-spacing:.06em';
  extraLbl.textContent='เงินโปะพิเศษ/เดือน';
  var extraInp=document.createElement('input'); extraInp.className='extra-cash-inp'; extraInp.type='number';
  extraInp.id='smart-extra-inp';
  extraInp.placeholder='0'; extraInp.value=S.extraCash!=null?S.extraCash:0;
  extraInp.oninput=function(){ S.extraCash=parseFloat(this.value)||0; updateSmartResults(); };
  extraTop.appendChild(extraLbl); extraTop.appendChild(extraInp);
  var extraHint=document.createElement('div'); extraHint.style.cssText='font-size:11px;color:var(--mut);line-height:1.5;padding:0 2px';
  extraHint.textContent='💡 การโปะเพิ่มทุกเดือนช่วยลดดอกเบี้ยรวมและทำให้หมดหนี้ไวขึ้น';
  extraRow.appendChild(extraTop); extraRow.appendChild(extraHint);
  list.appendChild(extraRow);

  // ── Results container (updated in-place by updateSmartResults) ──
  var resultsWrap=document.createElement('div'); resultsWrap.id='smart-results';
  list.appendChild(resultsWrap);

  // Store debtList on closure for updateSmartResults
  list._debtList=debtList;
  updateSmartResults();
}

function updateSmartResults(){
  var list=document.getElementById('cr-list'); if(!list) return;
  var debtList=list._debtList; if(!debtList) return;
  var resultsWrap=document.getElementById('smart-results'); if(!resultsWrap) return;
  resultsWrap.innerHTML='';

  // Update strategy button states
  list.querySelectorAll('.strategy-btn').forEach(function(btn){
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
  function simMonths(extraAmt){
    var sd=sorted.map(function(d){ return {remaining:d.remaining,minPay:d.minPay,rate:d.rate,fixed:isFixed(d)}; });
    var mo=0, totalInt=0;
    while(sd.some(function(d){ return d.remaining>0; })&&mo<600){
      var avail=extraAmt;
      sd=sd.map(function(d){
        if(d.remaining<=0) return d;
        var interest=d.remaining*(d.rate/100/12);
        totalInt+=interest;
        var pay=d.minPay;
        if(avail>0&&!d.fixed){ var add=Math.min(avail,d.remaining); pay+=add; avail-=add; }
        return {remaining:Math.max(0,d.remaining+interest-pay),minPay:d.minPay,rate:d.rate,fixed:d.fixed};
      });
      mo++;
    }
    return {months:mo<600?mo:null, interest:Math.round(totalInt)};
  }

  var withExtra=simMonths(extra);
  var noExtra=simMonths(0);

  // ── What-If comparison card (only when extra > 0) ──
  if(extra>0&&withExtra.months!=null&&noExtra.months!=null){
    var savedMo=noExtra.months-withExtra.months;
    var savedInt=noExtra.interest-withExtra.interest;
    var wiCard=document.createElement('div');
    wiCard.style.cssText='background:linear-gradient(135deg,rgba(34,201,138,.08),rgba(77,158,245,.08));border:1px solid rgba(34,201,138,.25);border-radius:var(--rds);padding:14px;margin-bottom:10px';
    wiCard.innerHTML=
      '<div style="font-size:11px;font-weight:700;color:var(--gl);text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px">⚡ What-If: โปะเพิ่ม ฿'+fmt(extra)+'/เดือน</div>'+
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">'+
        '<div style="background:rgba(0,0,0,.15);border-radius:var(--rds);padding:11px;text-align:center">'+
          '<div style="font-size:10px;color:var(--mut);margin-bottom:4px;text-transform:uppercase;letter-spacing:.06em">จ่ายขั้นต่ำปกติ</div>'+
          '<div style="font-size:20px;font-weight:800;font-family:var(--mono);color:var(--rl)">~'+noExtra.months+'</div>'+
          '<div style="font-size:10px;color:var(--mut)">เดือน</div>'+
          '<div style="font-size:11px;color:var(--rl);margin-top:6px;font-family:var(--mono)">ดอก ฿'+fmt(noExtra.interest)+'</div>'+
        '</div>'+
        '<div style="background:rgba(34,201,138,.1);border-radius:var(--rds);padding:11px;text-align:center;border:1px solid rgba(34,201,138,.2)">'+
          '<div style="font-size:10px;color:var(--gl);margin-bottom:4px;text-transform:uppercase;letter-spacing:.06em">โปะเพิ่ม ฿'+fmt(extra)+'</div>'+
          '<div style="font-size:20px;font-weight:800;font-family:var(--mono);color:var(--gl)">~'+withExtra.months+'</div>'+
          '<div style="font-size:10px;color:var(--mut)">เดือน</div>'+
          '<div style="font-size:11px;color:var(--gl);margin-top:6px;font-family:var(--mono)">ดอก ฿'+fmt(withExtra.interest)+'</div>'+
        '</div>'+
      '</div>'+
      '<div style="display:flex;gap:8px">'+
        (savedMo>0?'<div style="flex:1;background:var(--gbg);border-radius:var(--rds);padding:9px;text-align:center"><div style="font-size:10px;color:var(--gl);margin-bottom:3px">⏱ ประหยัดเวลา</div><div style="font-size:17px;font-weight:800;font-family:var(--mono);color:var(--gl)">'+savedMo+' เดือน</div></div>':'')+''+
        (savedInt>0?'<div style="flex:1;background:var(--gbg);border-radius:var(--rds);padding:9px;text-align:center"><div style="font-size:10px;color:var(--gl);margin-bottom:3px">💰 ประหยัดดอกเบี้ย</div><div style="font-size:17px;font-weight:800;font-family:var(--mono);color:var(--gl)">฿'+fmt(savedInt)+'</div></div>':'')+
      '</div>';
    resultsWrap.appendChild(wiCard);
  }

  // Summary bar
  var sumDiv=document.createElement('div'); sumDiv.className='plan-summary';
  sumDiv.innerHTML='<div class="plan-sum-title">'+(S.strategy==='snowball'?'⛄ Snowball — ปิดก้อนเล็กก่อน':'🏔 Avalanche — โปะดอกแพงก่อน')+'</div><div class="plan-sum-grid"><div class="plan-sum-box"><div class="plan-sum-val">฿'+fmt(totalRem)+'</div><div class="plan-sum-lbl">หนี้รวม</div></div><div class="plan-sum-box"><div class="plan-sum-val">฿'+fmt(totalMinPay+extra)+'</div><div class="plan-sum-lbl">จ่าย/เดือน</div></div><div class="plan-sum-box"><div class="plan-sum-val">'+(withExtra.months!=null?'~'+withExtra.months+' เดือน':'∞')+'</div><div class="plan-sum-lbl">ปลดหนี้</div></div></div>';
  resultsWrap.appendChild(sumDiv);

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
    var fixedBadge=isFixed(d)?'<span style="font-size:10px;padding:2px 7px;border-radius:20px;background:rgba(77,158,245,.15);color:var(--b);border:1px solid rgba(77,158,245,.3);margin-left:6px">🔒 Fixed</span>':'';
    body.innerHTML='<div class="dp-name">'+esc(d.cr.ico||'💳')+' '+esc(d.cr.n)+fixedBadge+'</div><div class="dp-info">ดอก '+(d.rate||0)+'%/ปี · ขั้นต่ำ ฿'+fmt(d.minPay)+(isFixed(d)?' · จ่ายตามกำหนด ไม่สามารถโปะได้':'')+'</div>'+(extraForThis>0?'<span class="dp-extra-badge">⚡ โปะเพิ่ม ฿'+fmt(extraForThis)+'</span>':'');
    var right=document.createElement('div'); right.className='dp-right';
    right.innerHTML='<div class="dp-rem">฿'+fmt2(d.remaining)+'</div><div class="dp-months">'+(moLeft!=null?'~'+moLeft+' เดือน':'ยังไม่ทราบ')+'</div>';
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
  var cat=S.incc.find(function(c){ return c.id===S.fi.cat; });
  var ch=S.inch.find(function(c){ return c.id===S.fi.ch; });
  var inc={id:Date.now(),date:dt,detail:det||'-',category:cat.l,channel:ch.l,amount:amt,receiver:S.fi.rcv};
  S.incomes.unshift(inc);
  document.getElementById('i-amt').value=''; document.getElementById('i-det').value=''; document.getElementById('i-dt').value=today();
  S.fi={cat:'',ch:'',rcv:''}; renderIncc(); renderInch();
  if(S.profile&&S.profile.full_name) S.fi.rcv=S.profile.full_name;
  applyCurrentProfileToPayers();
  toast('✅ บันทึกรายรับแล้ว','ok'); renderIncSum();
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
      '<div class="inc-goal-amt">฿'+fmt(incTotal)+' <span>/ ฿'+fmt(goal)+'</span></div>'+
      '<div class="inc-progress"><div class="inc-progress-fill" style="width:'+pct+'%"></div></div>'+
      '<div class="inc-goal-foot"><span>'+pct+'% Achieved</span><span>฿'+fmt(remain)+' Remaining</span></div>'+
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
      '</div><div class="inc-recent-amt">+฿'+fmt(i.amount)+'</div>';
    list.appendChild(row);
  });
}

// ═══════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════
var df='mo';
function setDF(f,el){ df=f; document.querySelectorAll('#pg-dash .fchip').forEach(function(c){ c.classList.remove('on'); }); el.classList.add('on'); renderDash(); }
function renderDash(){
  var w=document.getElementById('dash'); w.innerHTML='';
  var now=new Date(), mo=thisMo();
  var items=S.expenses.slice();
  if(df==='mo') items=items.filter(function(e){ return e.date&&e.date.slice(0,7)===mo; });
  if(df.indexOf('person:')===0){
    var filterName=df.slice(7);
    items=items.filter(function(e){ return e.paidBy===filterName; });
  }
  var tot=items.reduce(function(s,e){ return s+e.amount; },0);
  var personTotals={};
  items.forEach(function(e){ if(e.paidBy) personTotals[e.paidBy]=(personTotals[e.paidBy]||0)+e.amount; });
  var topPeople=Object.keys(personTotals).sort(function(a,b){ return personTotals[b]-personTotals[a]; }).slice(0,2);
  var incMo=S.incomes.filter(function(i){ return i.date&&i.date.slice(0,7)===mo; }).reduce(function(s,i){ return s+i.amount; },0);
  var net=incMo-tot;
  var avg=tot/Math.max(df==='mo'?now.getDate():30,1);
  var catM={};
  items.forEach(function(e){ if(!catM[e.category]) catM[e.category]={t:0,c:e.catC||'#7c6ef5'}; catM[e.category].t+=e.amount; });
  var cats=Object.keys(catM).map(function(k){ return [k,catM[k]]; }).sort(function(a,b){ return b[1].t-a[1].t; });
  var maxC=cats.length?cats[0][1].t:1;
  var payM={};
  items.forEach(function(e){ if(!payM[e.payment]) payM[e.payment]=0; payM[e.payment]+=e.amount; });
  var pays=Object.keys(payM).map(function(k){ return [k,payM[k]]; }).sort(function(a,b){ return b[1]-a[1]; });
  var maxP=pays.length?pays[0][1]:1;
  var totPaid=0,totUnpaid=0;
  getMyCredits().forEach(function(cr){ var st=S.crStatus[cr.id]||{},info=S.crInfo[cr.id]||{},isPaid=st.paid&&(st.date||'').slice(0,7)===mo; if(isPaid) totPaid+=st.amount||0; else if(info.minPay) totUnpaid+=info.minPay; });

  function mkK(lbl,val,vc,sub,full,bc){ var c=document.createElement('div'); c.className='kcard'+(full?' full':''); if(bc) c.style.borderLeft='3px solid '+bc; c.innerHTML='<div class="kl">'+lbl+'</div><div class="kv" style="color:'+vc+'">'+val+'</div>'+(sub?'<div class="ks">'+sub+'</div>':''); return c; }
  var g=document.createElement('div'); g.className='kgrid';
  g.appendChild(mkK('💸 รายจ่ายรวม','฿'+fmt(tot),'var(--p)',items.length+' รายการ · เฉลี่ย ฿'+fmt(avg)+'/วัน',true,'var(--p)'));
  topPeople.forEach(function(name,idx){
    var color=idx===0?'var(--p)':'var(--gl)';
    g.appendChild(mkK('👤 '+name,'฿'+fmt(personTotals[name]),color,Math.round(tot?personTotals[name]/tot*100:0)+'%',false,''));
  });
  if(incMo) g.appendChild(mkK(net>=0?'✅ เหลือสุทธิ':'⚠️ ขาดทุน','฿'+fmt(Math.abs(net)),net>=0?'var(--gl)':'var(--rl)','รายรับ ฿'+fmt(incMo),true,net>=0?'var(--gl)':'var(--rl)'));
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
    calDiv.innerHTML='<div class="ctitle">📅 ปฏิทินรายจ่าย <span style="font-size:9px;opacity:.5;font-weight:400">'+people+' คน · เขียว≤'+(500*people)+' · ส้ม≤'+(1500*people)+'</span></div>';
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
            hdr2.innerHTML='<span>'+dStr2+' ('+dayItems2.length+' รายการ)</span><span style="font-family:var(--mono)">฿'+fmt(dayAmt)+'</span>';
            pop.appendChild(hdr2);
            dayItems2.slice(0,10).forEach(function(e){
              var dr=document.createElement('div'); dr.style.cssText='display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--bdr);font-size:12px';
              var ico=(e.category||'').split(' ')[0]||'💸';
              var l=document.createElement('div'); l.innerHTML='<span style="margin-right:5px">'+ico+'</span><span style="color:var(--tx);font-weight:500">'+esc(e.detail)+'</span><span style="font-size:10px;color:var(--mut);margin-left:5px">'+esc(e.payment||'')+'</span>';
              var r=document.createElement('div'); r.style.cssText='font-weight:700;font-family:var(--mono);color:var(--tx);flex-shrink:0;margin-left:8px'; r.textContent='฿'+fmt(e.amount);
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
      row.innerHTML='<div class="bnm">'+esc(p[0])+'</div><div class="btr"><div class="bfi" style="width:'+Math.round(p[1].t/maxC*100)+'%;background:'+p[1].c+'"></div></div><div class="bam">฿'+fmt(p[1].t)+'</div>';
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
            left.innerHTML='<div style="font-weight:600;color:var(--tx)">'+esc(e.detail)+'</div><div style="font-size:11px;color:var(--mut)">'+dStr+' · 👤 '+esc(e.paidBy||'')+'</div>';
            var right=document.createElement('div'); right.style.cssText='font-weight:700;font-family:var(--mono);color:var(--tx)'; right.textContent='฿'+fmt(e.amount);
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
      row.innerHTML='<div class="bnm">'+esc(p[0])+'</div><div class="btr"><div class="bfi" style="width:'+Math.round(p[1]/maxP*100)+'%;background:var(--p)"></div></div><div class="bam">฿'+fmt(p[1])+'</div>';
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
            left.innerHTML='<div style="font-weight:600;color:var(--tx)">'+esc(e.detail)+'</div><div style="font-size:11px;color:var(--mut)">'+dStr+' · '+esc(e.category||'')+' · 👤 '+esc(e.paidBy||'')+'</div>';
            var right=document.createElement('div'); right.style.cssText='font-weight:700;font-family:var(--mono);color:var(--tx)'; right.textContent='฿'+fmt(e.amount);
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
  sHdr.innerHTML='<div class="dash-section-title">💳 สถานะสินเชื่อเดือนนี้</div><div class="dash-section-meta"><span style="color:var(--gl);font-weight:700;font-size:11px;font-family:var(--mono)">✅ ฿'+fmt(totPaid)+'</span><span style="color:var(--rl);font-weight:700;font-size:11px;font-family:var(--mono)">⏳ ฿'+fmt(totUnpaid)+'</span><span class="dash-chevron '+(crOpen?'open':'')+'">▾</span></div>';
  sHdr.onclick=function(){ var b=secDiv.querySelector('.dash-section-body'),ch=sHdr.querySelector('.dash-chevron'),open=b.classList.contains('open'); b.classList.toggle('open',!open); ch.classList.toggle('open',!open); w._crOpen=!open; };
  var sBody=document.createElement('div'); sBody.className='dash-section-body'+(crOpen?' open':'');
  var inner=document.createElement('div'); inner.className='dash-body-inner';
  var kg=document.createElement('div'); kg.className='kgrid'; kg.style.marginTop='8px';
  function mkKs(lbl,val,vc,bc){ var c=document.createElement('div'); c.className='kcard'; if(bc) c.style.borderLeft='3px solid '+bc; c.innerHTML='<div class="kl">'+lbl+'</div><div class="kv" style="font-size:18px;color:'+vc+'">'+val+'</div>'; return c; }
  kg.appendChild(mkKs('✅ ชำระแล้ว','฿'+fmt(totPaid),'var(--gl)','var(--gl)'));
  kg.appendChild(mkKs('⏳ ค้างชำระ','฿'+fmt(totUnpaid),'var(--rl)','var(--rl)'));
  inner.appendChild(kg);
  // Each credit row
  var myCredits=getMyCredits();
  if(!myCredits.length){
    var emptyCr=document.createElement('div');
    emptyCr.className='empty';
    emptyCr.style.padding='22px 12px';
    emptyCr.innerHTML='<div class="ei">💳</div><p>ยังไม่มีสินเชื่อที่ตั้งค่าไว้</p><button class="btn-go" onclick="openCreditSetupModal(\'revolving\')" style="margin-top:12px">เพิ่มสินเชื่อใบแรก</button>';
    inner.appendChild(emptyCr);
  }
  myCredits.forEach(function(cr){
    var st=S.crStatus[cr.id]||{},info=S.crInfo[cr.id]||{};
    var isPaid=st.paid&&(st.date||'').slice(0,7)===mo;
    var moLeft=calcMoLeft(st.remaining,info.minPay,info.rate||cr.rate||0);
    var pct=0;
    if(info.limit&&info.limit>0){ var used=info.limit-(st.remaining!=null?st.remaining:info.limit); pct=Math.min(100,Math.max(0,Math.round(used/info.limit*100))); }
    var card=document.createElement('div'); card.style.cssText='background:var(--card);border-radius:var(--rds);padding:13px 14px;box-shadow:var(--sh);margin-bottom:8px;border:1px solid var(--bdr);border-left:3px solid '+(isPaid?'var(--gl)':'var(--rl)');
    card.innerHTML='<div style="display:flex;align-items:center;gap:9px;width:100%"><div style="font-size:19px;flex-shrink:0">'+esc(cr.ico||'💳')+'</div><div style="flex:1;min-width:0"><div style="font-size:13.5px;font-weight:700">'+esc(cr.n)+'</div><div style="font-size:11px;color:var(--mut);margin-top:2px">'+(isPaid?'จ่าย ฿'+fmt(st.amount)+' · เหลือ ฿'+fmt2(st.remaining||0)+(moLeft!=null?' · ~'+moLeft+' เดือน':''):info.minPay?'ขั้นต่ำ ฿'+fmt(info.minPay):'ยังไม่มีข้อมูล')+'</div></div><div style="flex-shrink:0;text-align:right"><span class="cr-badge '+(isPaid?'paid':'unpaid')+'">'+(isPaid?'✅ จ่ายแล้ว':'⏳ ยังไม่จ่าย')+'</span>'+(st.remaining!=null?'<div style="font-size:11px;color:var(--sub);margin-top:3px;font-family:var(--mono)">เหลือ ฿'+fmt2(st.remaining||0)+'</div>':'')+'</div></div>'+(info.limit?'<div class="cr-progress-wrap"><div class="cr-progress-row"><div class="cr-progress-lbl">ใช้ '+pct+'%</div><div class="cr-progress-track"><div class="cr-progress-fill" style="width:'+pct+'%;background:'+(isPaid?'var(--gl)':'var(--a)')+'"></div></div><div class="cr-months">'+(moLeft!=null?'~'+moLeft+' เดือน':'')+'</div></div></div>':'');
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
  g.appendChild(sb('฿'+fmt(expMo.reduce(function(s,e){ return s+e.amount; },0)),'','รายจ่ายเดือนนี้'));
  g.appendChild(sb('฿'+fmt(incMo.reduce(function(s,i){ return s+i.amount; },0)),'g','รายรับเดือนนี้'));
  w.appendChild(g);
  var cBox=document.createElement('div'); cBox.style.cssText='padding:10px;background:var(--abg);border:1px solid rgba(245,166,35,.2);border-radius:var(--rds);text-align:center;margin-top:4px';
  cBox.innerHTML='<div style="font-size:13px;font-weight:700;color:var(--a)">ชำระสินเชื่อเดือนนี้ ฿'+fmt(crPaid)+'</div>';
  w.appendChild(cBox);
}
function renderV4Settings(){
  updateHeader();
  var sub=document.getElementById('set-subscription');
  if(sub) sub.innerHTML='<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">'+subscriptionBadge()+'</div><div>สถานะ: '+(S.hasAccess?'ใช้งานได้':'ถูกล็อก')+'</div><div>Trial หมดอายุ: '+(S.profile&&S.profile.trial_end?new Date(S.profile.trial_end).toLocaleDateString('th-TH'):'-')+'</div>';
  var fam=document.getElementById('family-id-view');
  if(fam) fam.value=(S.profile&&S.profile.family_id)||'';
  var isPro=S.profile&&S.profile.sub_tier==='pro_109'&&S.hasAccess;
  ['export-expense','export-income','export-credit'].forEach(function(id){
    var b=document.getElementById(id);
    if(b) b.classList.toggle('locked',!isPro);
  });
}
async function joinFamily(){
  var fid=document.getElementById('join-family-id').value.trim();
  if(!fid) return toast('กรอก family_id ก่อน','err');
  var res=await sb.from('profiles').update({family_id:fid,updated_at:new Date().toISOString()}).eq('id',S.user.id).select('*').single();
  if(res.error) return toast(res.error.message,'err');
  S.profile=res.data;
  await loadFromSupabase();
  toast('เข้าร่วมครอบครัวแล้ว','ok');
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
      var q=sb.from(tables[i]).delete();
      if(fid) q=q.eq('family_id',fid);
      var res=await q;
      if(res.error) console.warn('delete table failed ['+tables[i]+']:',res.error.message);
    }
    var prof=await sb.from('profiles').delete().eq('id',S.user.id);
    if(prof.error) console.warn('delete profile failed:',prof.error.message);
    var serverErr=null;
    try{
      var fn=await sb.functions.invoke('delete-user',{body:{user_id:S.user.id}});
      if(fn.error) serverErr=fn.error;
    }catch(e1){
      serverErr=e1;
      try{
        var rpc=await sb.rpc('delete_current_user');
        if(rpc.error) serverErr=rpc.error; else serverErr=null;
      }catch(e2){ serverErr=e2; }
    }
    await sb.auth.signOut();
    S.expenses=[]; S.incomes=[]; S.crStatus={}; S.crInfo={};
    localStorage.removeItem('crStatus');
    localStorage.removeItem('crInfo');
    S.user=null; S.profile=null;
    document.getElementById('auth-screen').classList.remove('off');
    if(serverErr){
      console.warn('server-side auth delete not completed:',serverErr);
      toast('ลบข้อมูลแล้ว แต่ต้องตั้ง Edge Function/RPC เพื่อลบ Auth user ให้สมบูรณ์','err');
    }else{
      toast('ลบบัญชีเรียบร้อย','ok');
    }
  }catch(e){
    console.error('delete account failed:',e);
    toast('ลบบัญชีไม่สำเร็จ: '+(e.message||e),'err');
  }
}
function clearLocal(type){
  if(!confirm('ล้าง cache '+(type==='all'?'ทั้งหมด':'รายจ่าย')+'?\n(Supabase ยังเก็บข้อมูลไว้)')) return;
  if(type==='expense'||type==='all') S.expenses=[];
  if(type==='income'||type==='all') S.incomes=[];
  if(type==='all'){ S.crStatus={}; localStorage.removeItem('crStatus'); }
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
