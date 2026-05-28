// ═══════════════════════════════════════════════════════
// SUPABASE CONFIG
// ═══════════════════════════════════════════════════════
function getLang(){
  var lang=localStorage.getItem('bxLanguage')||(S.profile&&(S.profile.language||S.profile.lang));
  return lang==='en'?'en':'th';
}
function t(key){ return (I18N[getLang()]&&I18N[getLang()][key])||I18N.th[key]||key; }
function applyLanguage(){
  document.documentElement.lang=getLang();
  document.querySelectorAll('[data-i18n]').forEach(function(el){
    var val=t(el.dataset.i18n);
    if(val) el.textContent=val;
  });
  var select=document.getElementById('language-select');
  if(select) select.value=getLang();
}
function setLanguage(lang){
  localStorage.setItem('bxLanguage',lang==='en'?'en':'th');
  applyLanguage();
  var active=document.querySelector('.pg.on');
  if(active&&active.id==='pg-dash') renderDash();
  if(active&&active.id==='pg-cr') renderCR();
  if(active&&active.id==='pg-inc') renderIncSum();
  renderMobilePickers();
  var btn=document.querySelector('.tbtn.on');
  var id=active&&active.id?active.id.replace('pg-',''):'add';
  var titleEl=document.getElementById('topbar-title');
  if(titleEl) titleEl.textContent=tabTitle(id);
}
function tabTitle(id){
  var titles={add:'addTransaction',inc:'income',hist:'history',dash:'dashboard',cr:'credit','debt-planner':'debtPlanner',set:'settings'};
  return t(titles[id]||'addTransaction');
}

// ═══════════════════════════════════════════════════════
// DEFAULT DATA
// ═══════════════════════════════════════════════════════
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
var authMode='login';
var currentDashTimeFilter='this_month';
var currentDashUserFilter='joint';
var currentHistTimeFilter='this_month';
var currentHistUserFilter='joint';
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
function allCR(){ return BASE_CR.concat(S.customCr); }
function getMyCredits(){
  return allCR().filter(function(c){
    var info=S.crInfo&&S.crInfo[c.id];
    if(!info||c._hidden) return false;
    return getLinkedCreditId(c.id)===c.id;
  });
}
function getBankBrandKey(itemOrName){
  var item=typeof itemOrName==='object'&&itemOrName?itemOrName:{};
  var id=String(item.id||'').toLowerCase();
  var name=String(typeof itemOrName==='string'?itemOrName:(item.n||item.credit_name||item.creditName||item.provider||item.name||'')).toLowerCase();
  var raw=(id+' '+name).replace(/[_-]+/g,' ');
  if(/\bcardx\b/.test(raw)) return 'cardx';
  if(/\bktc\b/.test(raw)) return 'ktc';
  if(/\baeon\b/.test(raw)) return 'aeon';
  if(/\bumay/.test(raw)) return 'umay';
  if(/shopee|spay/.test(raw)) return 'shopee';
  if(/true/.test(raw)) return 'true';
  if(/laz/.test(raw)) return 'lazpay';
  if(/tiktok/.test(raw)) return 'tiktokpay';
  if(/first\s*choice|k\s*first|kfirst/.test(raw)) return 'firstchoice';
  if(/line\s*bk|linebk/.test(raw)) return 'linebk';
  if(/k\s*bank|kbank|kasikorn/.test(raw)) return 'kbank';
  if(/\bscb\b|siam commercial/.test(raw)) return 'scb';
  if(/\bbbl\b|bangkok bank/.test(raw)) return 'bbl';
  if(/\bktb\b|krungthai|krung thai/.test(raw)) return 'ktb';
  if(/krungsri|\bbay\b|ayudhya/.test(raw)) return 'bay';
  if(/\bgsb\b|government savings/.test(raw)) return 'gsb';
  if(/\bghb\b|housing bank/.test(raw)) return 'ghb';
  if(/\bbaac\b|agricultur/.test(raw)) return 'baac';
  if(/\bttb\b|tmbthanachart/.test(raw)) return 'ttb';
  if(/\buob\b|united overseas/.test(raw)) return 'uob';
  if(/\bcimb\b/.test(raw)) return 'cimb';
  if(/\btisco\b/.test(raw)) return 'tisco';
  if(/\bkk\b|kiatnakin/.test(raw)) return 'kk';
  if(/\blh\b|\blhb\b|land and houses/.test(raw)) return 'lh';
  return '';
}
function getCreditLogoMeta(itemOrName){
  var key=getBankBrandKey(itemOrName), brand=BANK_BRANDS[key];
  if(brand) return {label:brand.label,color:brand.color};
  var item=typeof itemOrName==='object'&&itemOrName?itemOrName:{};
  var name=String(typeof itemOrName==='string'?itemOrName:(item.n||item.credit_name||item.creditName||item.provider||item.name||'CR'));
  var label=name.replace(/[^\wก-๙+ ]/g,' ').split(/\s+/).filter(Boolean).map(function(part){ return part.charAt(0); }).join('').slice(0,4).toUpperCase()||'CR';
  return {label:label,color:'#4C35C4'};
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
function calcMoLeft(remaining, minPay, rateYr){
  if(!remaining||remaining<=0||!minPay||minPay<=0) return null;
  var rt=(rateYr||0)/100/12, r=remaining, m=0;
  while(r>0&&m<600){ r=r*(1+rt)-minPay; m++; }
  return m<600?m:null;
}
function profileIdByName(name){
  name=String(name||'').trim();
  if(!name) return '';
  if(S.profile&&S.profile.full_name===name) return S.profile.id||S.user&&S.user.id||'';
  var p=(S.familyMembers||[]).find(function(m){ return m&&m.full_name===name; });
  return p&&p.id||'';
}
function creditNameById(crId){
  var cr=allCR().find(function(c){ return c.id===crId; });
  var info=S.crInfo&&S.crInfo[crId]||{};
  return (info.creditName||info.credit_name||(cr&&cr.n)||'');
}
function getLinkedCreditId(crId){
  var info=S.crInfo&&S.crInfo[crId]||{};
  var cardType=info.cardType||info.card_type;
  var linkedId=info.linkedCreditId||info.linked_credit_id;
  if(cardType==='secondary'&&linkedId){
    var linked=String(linkedId);
    var primary=Object.keys(S.crInfo||{}).find(function(id){
      var x=S.crInfo[id]||{};
      return String(id)===linked||String(x.rowId||'')===linked;
    });
    return primary||linked;
  }
  return crId;
}
function getLinkedCreditIds(primaryId){
  primaryId=getLinkedCreditId(primaryId);
  var ids=[primaryId];
  Object.keys(S.crInfo||{}).forEach(function(id){
    if(id!==primaryId&&getLinkedCreditId(id)===primaryId) ids.push(id);
  });
  return ids;
}
function resolveCreditIdForExpense(payment,paidBy){
  payment=String(payment||'');
  var baseId=PAY2CR[payment]||PAY2CR[payment.replace(/^[^\s]+\s/,'')];
  if(!baseId) return '';
  var holderId=profileIdByName(paidBy);
  var baseName=creditNameById(baseId)||payment;
  var candidates=Object.keys(S.crInfo||{}).filter(function(id){
    return id===baseId||creditNameById(id)===baseName;
  });
  if(holderId){
    var owned=candidates.find(function(id){
      return String((S.crInfo[id]||{}).cardHolderId||'')===String(holderId);
    });
    if(owned) return owned;
  }
  return baseId;
}
function creditExpenseUsage(crId,mo,baseAt){
  var primaryId=getLinkedCreditId(crId);
  var linkedIds=getLinkedCreditIds(primaryId);
  var linkedMap={};
  linkedIds.forEach(function(id){ linkedMap[id]=1; });
  var baseTime=validCreatedTime(baseAt);
  return S.expenses.filter(function(e){
    if(!e.date||e.date.slice(0,7)!==mo) return false;
    var expenseCrId=resolveCreditIdForExpense(e.payment,e.paidBy);
    if(!expenseCrId||!linkedMap[expenseCrId]&&getLinkedCreditId(expenseCrId)!==primaryId) return false;
    if(!baseTime) return false;
    if(!e.createdAt) return false;
    return validCreatedTime(e.createdAt)>baseTime;
  }).reduce(function(s,e){ return s+Number(e.amount||0); },0);
}
function recomputeMatchedCreditBalances(){
  var mo=thisMo(),seen={};
  Object.keys(S.crInfo||{}).concat(Object.keys(PAY2CR).map(function(k){ return PAY2CR[k]; })).forEach(function(crId){
    crId=getLinkedCreditId(crId);
    if(seen[crId]) return; seen[crId]=1;
    var cr=allCR().find(function(c){ return c.id===crId; });
    var info=S.crInfo[crId]||{};
    if(cr&&cr.t!=='revolving') return;
    var st=S.crStatus[crId]||{paid:false,amount:0,remaining:null,date:''};
    var base = st.baseRemaining!=null ? st.baseRemaining : (st.remaining!=null ? st.remaining : (info.limit||0));
    if(!validCreatedTime(st.baseAt)) st.baseAt=mo+'-01T00:00:00.000Z';
    var used=creditExpenseUsage(crId,mo,st.baseAt);
    st.baseRemaining = base;
    st.matchedUsed = used;
    st.remaining = base ? Math.max(0,base-used) : (st.remaining||0);
    S.crStatus[crId]=st;
  });
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
      return '<div class="grid grid-cols-[22px_1fr_auto] items-center gap-2 border-b border-white/10 py-2 last:border-b-0"><span class="material-symbols-outlined text-[17px] text-textMuted">'+esc(r.icon||'info')+'</span><span class="text-sm font-bold text-textMuted">'+esc(r.label||'-')+'</span><strong class="text-sm font-bold text-textMain">'+esc(r.value||'-')+'</strong></div>';
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
  var res=await withTimeout(sb.from('profiles').select('id,full_name,avatar_url').eq('family_id',S.profile.family_id),30000,'โหลดสมาชิกครอบครัว');
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
  var cls=tier==='pro_109'?'border-green/30 bg-green/15 text-green':tier==='trial'?'border-warning/30 bg-warning/15 text-warning':'border-primary/30 bg-primaryContainer/15 text-primary';
  return '<span class="inline-flex rounded-full border px-2.5 py-1 text-xs font-extrabold '+cls+'">'+tierLabel()+'</span>';
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
    applyLanguage();
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
    S.expenses=[]; S.incomes=[]; S.credits=[]; S.crStatus={}; S.crInfo={}; S.customCr=[];
    logStep('10. Fetching family data in parallel...');
    var loads=await Promise.allSettled([
      withTimeout(sb.from('expenses').select('*').eq('family_id',fid).order('date',{ascending:false}),6000,'โหลด expenses'),
      withTimeout(sb.from('incomes').select('*').eq('family_id',fid).order('date',{ascending:false}),6000,'โหลด incomes'),
      withTimeout(sb.from('credits').select('*').eq('family_id',fid).order('date',{ascending:false}),6000,'โหลด credits'),
      withTimeout(sb.from('credit_info').select('*').eq('family_id',fid),6000,'โหลด credit_info'),
      withTimeout(sb.from('profiles').select('id,full_name,avatar_url').eq('family_id',fid),6000,'โหลดสมาชิกครอบครัว')
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
      S.credits.push({
        id:r.id||('sc'+Date.now()+S.credits.length), date:r.date||'',
        credit_name:cleanLabel(r.credit_name||r.name||''), type:r.type||'revolving',
        amount:Number(r.amount||0), remaining:Number(r.remaining||0),
        status:r.status||'', user_id:r.user_id||'', createdAt:r.created_at||''
      });
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
      var rowId=String(r.id||'');
      var cardType=r.card_type||r.cardType||'primary';
      var infoId=(cardType==='secondary'&&rowId)?rowId:found.id;
      if(infoId!==found.id&&!allCR().some(function(c){ return c.id===infoId; })){
        S.customCr.push({id:infoId,n:found.n,t:found.t,ico:found.ico,rate:found.rate,_hidden:cardType==='secondary'});
      }
      if(!S.crInfo[infoId]||!S.crInfo[infoId].limit){
        S.crInfo[infoId]={
          limit:Number(r.credit_limit||r.limit||0), rate:Number(r.rate||found.rate||0),
          minPay:Number(r.min_pay||r.minPay||0),
          billCycle:r.bill_cycle||r.billCycle||'',
          dueDate:r.due_date||r.dueDate||'',
          creditName:r.credit_name||r.name||found.n,
          rowId:rowId,
          cardHolderId:r.card_holder_id||r.cardHolderId||'',
          cardType:cardType,
          linkedCreditId:r.linked_credit_id||r.linkedCreditId||''
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
  var requestedId=id;
  var titles={};
  titles['debt']='บัตรและสินเชื่อ';
  if(id==='cr') restoreDebtSourceContent('cr');
  if(id==='debt-planner') restoreDebtSourceContent('debt-planner');
  if(id==='inc'){
    var modeIncome=document.getElementById('mode-income');
    var incomeShell=modeIncome&&modeIncome.querySelector('.inc-shell');
    if(incomeShell) document.getElementById('pg-inc').appendChild(incomeShell);
  }
  if(id==='add') toggleAddMode('expense');
  var titleEl=document.getElementById('topbar-title');
  if(titleEl) titleEl.textContent=titles[requestedId]||tabTitle(id);
  document.querySelectorAll('.pg').forEach(function(p){ p.classList.remove('on'); });
  document.querySelectorAll('.tbtn').forEach(function(b){ b.classList.remove('on'); });
  document.querySelectorAll('.bn .tbtn').forEach(function(b){ b.classList.remove('active'); });
  var bottomId=(requestedId==='cr'||requestedId==='debt'||requestedId==='debt-planner')?'debt':
    (requestedId==='inc'||requestedId==='add')?'add':
    (requestedId==='hist'||requestedId==='set')?'set':requestedId;
  var bottomBtn=document.querySelector(".bn .tbtn[onclick*=\"goTab('"+bottomId+"'\"]");
  if(bottomBtn) bottomBtn.classList.add('active');
  document.getElementById('pg-'+id).classList.add('on');
  if(btn) btn.classList.add('on');
  toggleSidebar(false);
  if(id==='hist') renderHist();
  if(id==='dash') renderDash();
  if(id==='cr')   renderCR();
  if(id==='debt') toggleDebtMode(window.matchMedia('(max-width:768px)').matches?'plan':'credit');
  if(id==='debt-planner') renderSmartDebt();
  if(id==='inc')  renderIncSum();
  if(id==='set')  renderSetStats();
  if(id==='add')  renderAddSummary();
  applyLanguage();
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
    var b=document.createElement('button'); b.className='chip inline-flex items-center rounded-full border border-border bg-card2 px-3 py-2 font-inter text-xs font-semibold text-textMuted transition '+(selId===c.id?' on border-primaryContainer bg-primaryContainer/20 text-primary':'');
    b.textContent=c.l; b.onclick=function(){ onPick(c.id); }; w.appendChild(b);
  });
}
var addCatIconMap={food:'restaurant',buffet:'restaurant_menu',drink:'local_cafe',snack:'bakery_dining',cat:'pets',shop:'shopping_bag',act:'sports_esports',trans:'directions_car',place:'home',inv:'trending_up',health:'medical_services',bill:'receipt_long',edu:'school',donate:'volunteer_activism',travel:'flight',fam:'family_restroom',other:'more_horiz'};
function orderedExpenseCats(cats){
  var ordered=(cats||[]).slice();
  var buffetIndex=ordered.findIndex(function(c){ return c.id==='buffet'; });
  var snackIndex=ordered.findIndex(function(c){ return c.id==='snack'; });
  if(buffetIndex<0||snackIndex<0||buffetIndex===snackIndex+1) return ordered;
  var buffet=ordered.splice(buffetIndex,1)[0];
  snackIndex=ordered.findIndex(function(c){ return c.id==='snack'; });
  ordered.splice(snackIndex+1,0,buffet);
  return ordered;
}
function cleanAddLabel(v){ return String(v||'').replace(/^[^\wก-๙]+/,'').trim()||v; }
function addPayIcon(id){
  id=String(id||'');
  return id==='cash'?'payments':id==='xfer'?'account_balance':id.indexOf('crpay_')===0?'credit_card':'account_balance_wallet';
}
function renderCats(){
  var w=document.getElementById('cat-chips');
  renderMobilePickers();
  if(!w) return; w.innerHTML='';
  orderedExpenseCats(S.cats).forEach(function(c){
    var b=document.createElement('button');
    b.className='flex min-h-12 items-center gap-2 rounded-xl border border-border bg-card2 px-3 py-2 text-left font-inter text-xs font-bold text-textMuted transition '+(S.fc.cat===c.id?' on border-primaryContainer bg-primaryContainer/20 text-primary':'');
    b.dataset.icon=addCatIconMap[c.id]||'more_horiz';
    b.innerHTML='<span class="material-symbols-outlined text-lg">'+(addCatIconMap[c.id]||'more_horiz')+'</span><span class="min-w-0 truncate">'+esc(cleanAddLabel(c.l))+'</span>';
    b.onclick=function(){ S.fc.cat=c.id; renderCats(); };
    w.appendChild(b);
  });
}
function renderPays(){
  var w=document.getElementById('pay-chips');
  renderMobilePickers();
  if(!w) return; w.innerHTML='';
  S.pays.forEach(function(p){
    var b=document.createElement('button'); b.className='flex min-h-12 items-center gap-2 rounded-xl border border-border bg-card2 px-3 py-2 text-left font-inter text-xs font-bold text-textMuted transition '+(S.fc.pay===p.id?' on border-primaryContainer bg-primaryContainer/20 text-primary':'');
    b.dataset.icon=addPayIcon(p.id);
    b.innerHTML='<span class="material-symbols-outlined text-lg">'+addPayIcon(p.id)+'</span><span class="min-w-0 truncate">'+esc(p.l)+'</span>';
    b.onclick=function(){ S.fc.pay=p.id; renderPays(); };
    w.appendChild(b);
  });
}
function renderMobilePickers(){
  var cat=S.cats.find(function(c){ return c.id===S.fc.cat; });
  var pay=S.pays.find(function(p){ return p.id===S.fc.pay; });
  var incc=S.incc.find(function(c){ return c.id===S.fi.cat; });
  var inch=S.inch.find(function(c){ return c.id===S.fi.ch; });
  var catLabel=document.getElementById('mobile-cat-label');
  var payLabel=document.getElementById('mobile-pay-label');
  var inccLabel=document.getElementById('mobile-incc-label');
  var inchLabel=document.getElementById('mobile-inch-label');
  if(catLabel) catLabel.textContent=cat?cleanAddLabel(cat.l):t('selectCategory');
  if(payLabel) payLabel.textContent=pay?pay.l:t('selectPayment');
  if(inccLabel) inccLabel.textContent=incc?cleanAddLabel(incc.l):t('selectIncomeCategory');
  if(inchLabel) inchLabel.textContent=inch?cleanAddLabel(inch.l):t('selectIncomeChannel');
  var typeEl=document.getElementById('cs-type'), providerEl=document.getElementById('cs-provider'), linkedEl=document.getElementById('cs-linked-credit');
  var typeLabel=document.getElementById('mobile-cr-type-label'), providerLabel=document.getElementById('mobile-cr-provider-label'), linkedLabel=document.getElementById('mobile-cr-linked-label');
  if(typeLabel&&typeEl) typeLabel.textContent=typeEl.options[typeEl.selectedIndex]&&typeEl.options[typeEl.selectedIndex].text||t('selectCreditType');
  if(providerLabel&&providerEl) providerLabel.textContent=providerEl.value||t('selectProvider');
  if(linkedLabel&&linkedEl) linkedLabel.textContent=linkedEl.options[linkedEl.selectedIndex]&&linkedEl.value?linkedEl.options[linkedEl.selectedIndex].text:t('selectPrimaryCard');
}
function openMobilePicker(type){
  var modal=document.getElementById('mobile-picker-modal'), title=document.getElementById('mobile-picker-title'), list=document.getElementById('mobile-picker-list');
  if(!modal||!title||!list) return;
  var iconMap={sal:'work',bon:'redeem',free:'business_center',inv:'trending_up',oth:'more_horiz'};
  var arr=[], selectedId='', pickerTitle='';
  if(type==='cat'){ arr=orderedExpenseCats(S.cats); selectedId=S.fc.cat; pickerTitle=t('selectCategory'); }
  else if(type==='pay'){ arr=S.pays; selectedId=S.fc.pay; pickerTitle=t('selectPayment'); }
  else if(type==='inc-cat'){ arr=S.incc; selectedId=S.fi.cat; pickerTitle=t('selectIncomeCategory'); }
  else if(type==='inc-ch'){ arr=S.inch; selectedId=S.fi.ch; pickerTitle=t('selectIncomeChannel'); }
  else if(type==='cr-type'){
    var typeEl=document.getElementById('cs-type');
    arr=[{id:'revolving',l:'สินเชื่อหมุนเวียน'},{id:'fixed',l:'สินเชื่อหลักประกัน'}];
    selectedId=typeEl&&typeEl.value; pickerTitle=t('selectCreditType');
  }else if(type==='cr-provider'){
    var providerEl=document.getElementById('cs-provider');
    arr=providerEl?Array.from(providerEl.options).map(function(o){ return {id:o.value,l:o.text}; }):[];
    selectedId=providerEl&&providerEl.value; pickerTitle=t('selectProvider');
  }else if(type==='cr-linked'){
    var linkedEl=document.getElementById('cs-linked-credit');
    arr=linkedEl?Array.from(linkedEl.options).filter(function(o){ return !!o.value; }).map(function(o){ return {id:o.value,l:o.text}; }):[];
    selectedId=linkedEl&&linkedEl.value; pickerTitle=t('selectPrimaryCard');
  }
  title.textContent=pickerTitle;
  list.innerHTML='';
  arr.forEach(function(item){
    var selected=selectedId===item.id;
    var btn=document.createElement('button');
    btn.type='button';
    btn.className='mobile-picker-item flex min-w-0 flex-col items-center gap-2 rounded-2xl p-2 text-center transition '+(selected?' on bg-primaryContainer/20 text-primary':'text-textMain');
    btn.onclick=function(){ selectMobilePickerItem(type,item.id); };
    var icon=type==='cat'?(addCatIconMap[item.id]||'more_horiz'):
      type==='pay'?addPayIcon(item.id):
      type==='inc-cat'?(iconMap[item.id]||'more_horiz'):
      type==='inc-ch'?(item.id==='cash'?'payments':item.id==='prompt'?'qr_code_2':'account_balance_wallet'):
      type==='cr-type'?(item.id==='fixed'?'account_balance':'credit_card'):
      type==='cr-linked'?'link':'credit_card';
    btn.innerHTML='<span class="mobile-picker-icon material-symbols-outlined flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-card2 text-primary shadow-lg">'+icon+'</span><strong class="line-clamp-2 text-xs font-bold leading-snug">'+esc(cleanAddLabel(item.l))+'</strong>';
    list.appendChild(btn);
  });
  if(!arr.length) list.innerHTML='<div class="mobile-picker-empty">ยังไม่มีรายการให้เลือก</div>';
  modal.dataset.type=type;
  document.body.classList.add('mobile-picker-open');
  modal.classList.remove('hidden');
  requestAnimationFrame(function(){ modal.classList.add('on'); });
}
function closeMobilePicker(){
  var modal=document.getElementById('mobile-picker-modal');
  if(!modal) return;
  document.body.classList.remove('mobile-picker-open');
  modal.classList.remove('on');
  setTimeout(function(){ modal.classList.add('hidden'); },220);
}
function mobilePickerBg(e){
  if(e&&e.target&&e.target.id==='mobile-picker-modal') closeMobilePicker();
}
function selectMobilePickerItem(type,id){
  if(type==='cat'){ S.fc.cat=id; closeMobilePicker(); renderCats(); }
  else if(type==='pay'){ S.fc.pay=id; closeMobilePicker(); renderPays(); }
  else if(type==='inc-cat'){ S.fi.cat=id; closeMobilePicker(); renderIncc(); }
  else if(type==='inc-ch'){ S.fi.ch=id; closeMobilePicker(); renderInch(); }
  else if(type==='cr-type'){
    document.getElementById('cs-type').value=id;
    updateCreditProviderOptions();
    closeMobilePicker();
  }else if(type==='cr-provider'){
    document.getElementById('cs-provider').value=id;
    renderMobilePickers();
    closeMobilePicker();
  }else if(type==='cr-linked'){
    document.getElementById('cs-linked-credit').value=id;
    renderMobilePickers();
    closeMobilePicker();
  }
}
function renderIncc(){
  var w=document.getElementById('incc-chips'); if(!w) return; w.innerHTML='';
  var iconMap={sal:'work',bon:'redeem',free:'business_center',inv:'trending_up',oth:'more_horiz'};
  S.incc.forEach(function(c){
    var b=document.createElement('button');
    var icon=iconMap[c.id]||(String(c.l||'').indexOf('ลงทุน')>-1?'trending_up':String(c.l||'').indexOf('โบนัส')>-1?'redeem':String(c.l||'').indexOf('เงินเดือน')>-1?'work':'more_horiz');
    b.className='flex min-h-12 items-center gap-2 rounded-xl border border-border bg-card2 px-3 py-2 text-left font-inter text-xs font-bold text-textMuted transition '+(S.fi.cat===c.id?' on border-green bg-green/15 text-green':'');
    b.dataset.icon=icon;
    b.innerHTML='<span class="material-symbols-outlined text-lg">'+icon+'</span><span class="min-w-0 truncate">'+esc(String(c.l||'').replace(/^[^\wก-๙]+/,'').trim()||c.l)+'</span>';
    b.onclick=function(){ S.fi.cat=c.id; renderIncc(); };
    w.appendChild(b);
  });
  renderMobilePickers();
}
function renderInch(){
  var w=document.getElementById('inch-chips'); if(!w) return; w.innerHTML='';
  S.inch.forEach(function(c){
    var b=document.createElement('button');
    var icon=c.id==='cash'?'payments':c.id==='prompt'?'qr_code_2':'account_balance_wallet';
    b.className='flex min-h-12 items-center gap-2 rounded-xl border border-border bg-card2 px-3 py-2 text-left font-inter text-xs font-bold text-textMuted transition '+(S.fi.ch===c.id?' on border-green bg-green/15 text-green':'');
    b.dataset.icon=icon;
    b.innerHTML='<span class="material-symbols-outlined text-lg">'+icon+'</span><span class="min-w-0 truncate">'+esc(String(c.l||'').replace(/^[^\wก-๙]+/,'').trim()||c.l)+'</span>';
    b.onclick=function(){ S.fi.ch=c.id; renderInch(); };
    w.appendChild(b);
  });
  renderMobilePickers();
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
    if(!cr._hidden) PAY2CR[cr.n]=cr.id;
  });
  S.pays=base;
  if(S.fc.pay && !S.pays.some(function(p){ return p.id===S.fc.pay; })) S.fc.pay='';
  renderPays();
}
function renderPersonFilters(){
  renderHistFilters();
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

function toggleAddMode(mode){
  var expense=document.getElementById('mode-expense');
  var income=document.getElementById('mode-income');
  var incomePage=document.getElementById('pg-inc');
  if(!expense||!income||!incomePage) return;
  var isMobile=window.matchMedia('(max-width:900px)').matches;
  if(mode==='income'&&!isMobile){
    goTab('inc',document.querySelector('.app-sidebar .tbtn[onclick*="inc"]'));
    return;
  }
  document.getElementById('pg-add').classList.toggle('income-mode',mode==='income');
  var shell=income.querySelector('.inc-shell')||incomePage.querySelector('.inc-shell');
  if(mode==='income'&&shell&&!income.contains(shell)) income.appendChild(shell);
  if(mode==='expense'&&shell&&income.contains(shell)) incomePage.appendChild(shell);
  expense.style.display=mode==='expense'?'':'none';
  income.style.display=mode==='income'?'':'none';
  document.getElementById('tog-exp').classList.toggle('on',mode==='expense');
  document.getElementById('tog-inc').classList.toggle('on',mode==='income');
  ['tog-exp','tog-inc'].forEach(function(id){
    var btn=document.getElementById(id);
    if(!btn) return;
    var isOn=(id==='tog-exp'&&mode==='expense')||(id==='tog-inc'&&mode==='income');
    btn.classList.toggle('bg-card2',isOn);
    btn.classList.toggle('text-textMain',isOn);
    btn.classList.toggle('shadow-sm',isOn);
    btn.classList.toggle('text-textMuted',!isOn);
  });
}

function restoreDebtSourceContent(target){
  var creditMount=document.getElementById('debt-mode-credit');
  var planMount=document.getElementById('debt-mode-plan');
  var creditPage=document.getElementById('pg-cr');
  var planPage=document.getElementById('pg-debt-planner');
  if(target==='cr'&&creditMount&&creditPage){
    Array.from(creditMount.children).forEach(function(node){ creditPage.appendChild(node); });
  }
  if(target==='debt-planner'&&planMount&&planPage){
    Array.from(planMount.children).forEach(function(node){ planPage.appendChild(node); });
  }
}

function toggleDebtMode(mode){
  var credit=document.getElementById('debt-mode-credit');
  var plan=document.getElementById('debt-mode-plan');
  var creditPage=document.getElementById('pg-cr');
  var planPage=document.getElementById('pg-debt-planner');
  if(!credit||!plan||!creditPage||!planPage) return;
  if(mode==='credit'){
    ['.cr-shell','#pay-drawer','#info-drawer'].forEach(function(selector){
      var node=credit.querySelector(selector)||creditPage.querySelector(selector);
      if(node&&!credit.contains(node)) credit.appendChild(node);
    });
  }
  if(mode==='plan'){
    var shell=plan.querySelector('.debtp-shell')||planPage.querySelector('.debtp-shell');
    if(shell&&!plan.contains(shell)) plan.appendChild(shell);
  }
  credit.style.display=mode==='credit'?'':'none';
  plan.style.display=mode==='plan'?'':'none';
  document.getElementById('tog-cr').classList.toggle('on',mode==='credit');
  document.getElementById('tog-plan').classList.toggle('on',mode==='plan');
  if(mode==='credit') renderCR();
  if(mode==='plan') renderSmartDebt();
}

function updateMobileDebtBento(values){
  var ids={total:'mobile-debt-total',monthly:'mobile-debt-monthly',interest:'mobile-debt-interest',faster:'mobile-debt-faster'};
  Object.keys(values||{}).forEach(function(key){
    var el=document.getElementById(ids[key]);
    if(el) el.textContent=values[key];
  });
}

function openDebtOrderSheet(){
  var sheet=document.getElementById('debt-order-sheet');
  if(sheet){
    sheet.classList.add('on','flex');
    sheet.classList.remove('hidden');
  }
}

function closeDebtOrderSheet(e){
  var sheet=document.getElementById('debt-order-sheet');
  if(!sheet) return;
  if(!e||e.target===sheet){
    sheet.classList.remove('on','flex');
    sheet.classList.add('hidden');
  }
}

var slipScanCache={};
function slipFileKey(file){
  return [file&&file.name||'',file&&file.size||0,file&&file.lastModified||0].join('|');
}
function setPaymentToTransfer(){
  var transfer=(S.pays||[]).find(function(p){
    return p.id==='xfer'||String(p.l||p.label||'').indexOf('โอนเงิน')>-1;
  });
  if(!transfer) return false;
  S.fc.pay=transfer.id;
  renderPays();
  if(typeof renderMobilePickers==='function') renderMobilePickers();
  return true;
}
function fillScannedData(data,source){
  data=data||{};
  var hasAmount=data.amount!=null;
  var hasDate=!!data.date;
  if(!hasAmount&&!hasDate) return false;
  if(hasAmount) document.getElementById('f-amt').value=data.amount;
  if(hasDate) document.getElementById('f-dt').value=data.date;
  toast('เติมข้อมูลจากสลิปแล้ว','ok');
  return true;
}
function fileToBase64(file){
  return new Promise(function(resolve,reject){
    var reader=new FileReader();
    reader.onload=function(){
      resolve(String(reader.result||'').replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/,''));
    };
    reader.onerror=function(){ reject(reader.error||new Error('อ่านไฟล์ไม่สำเร็จ')); };
    reader.readAsDataURL(file);
  });
}
async function localOcrSlipAmount(file){
  if(typeof Tesseract==='undefined'||!Tesseract||typeof Tesseract.recognize!=='function') return null;
  var res=await Tesseract.recognize(file,'tha+eng');
  var text=res&&res.data&&res.data.text||'';
  console.log('[Slip OCR Text]',text);
  return parseSlipDataFromText(text);
}

async function scanSlipImage(file){
  var status=document.getElementById('slip-status');
  var input=document.getElementById('slip-upload');
  var key=slipFileKey(file);
  var detectedDate=null;
  try{
    if(slipScanCache[key]){
      var cached=slipScanCache[key];
      if(cached.amount!=null||cached.date) fillScannedData(cached,'ผลสแกนเดิม');
      else toast('ไฟล์นี้เคยสแกนแล้ว ไม่พบยอดเงิน กรุณากรอกเอง','err');
      return;
    }
    if(status) status.textContent='กำลังอ่าน QR...';
    var bmp=await createImageBitmap(file);
    var canvas=typeof OffscreenCanvas!=='undefined'?new OffscreenCanvas(bmp.width,bmp.height):document.createElement('canvas');
    canvas.width=bmp.width;
    canvas.height=bmp.height;
    var ctx=canvas.getContext('2d');
    ctx.drawImage(bmp,0,0);
    var imageData=ctx.getImageData(0,0,canvas.width,canvas.height);
    if(typeof jsQR==='function'){
      var result=jsQR(imageData.data,imageData.width,imageData.height);
      console.log('[Slip] QR found',!!result);
      if(result&&result.data){
        if(isBankSlipText(result.data)) setPaymentToTransfer();
        var qrAmount=parseEMVAmount(result.data);
        var qrDate=parseDateFromText(result.data);
        console.log('[Slip] QR amount',qrAmount);
        console.log('[Slip] QR date',qrDate);
        if(qrDate){
          detectedDate=qrDate;
          document.getElementById('f-dt').value=qrDate;
        }
        if(qrAmount!=null||qrDate){
          slipScanCache[key]={amount:qrAmount,date:qrDate};
          fillScannedData(slipScanCache[key],'QR');
          return;
        }
      }
    }else{
      console.log('[Slip] QR found',false);
    }
    if(status) status.textContent='กำลัง OCR...';
    var localData=await localOcrSlipAmount(file).catch(function(err){
      console.warn('local OCR failed:',err);
      return null;
    });
    console.log('[Slip] Tesseract amount',localData&&localData.amount);
    console.log('[Slip] Tesseract date',localData&&localData.date);
    if(localData&&isBankSlipText(localData.text)) setPaymentToTransfer();
    if(localData&&localData.date) detectedDate=localData.date;
    if(localData&&(localData.amount!=null||localData.date)){
      if(status) status.textContent='กำลังเติมข้อมูล...';
      slipScanCache[key]={amount:localData.amount,date:detectedDate};
      fillScannedData(slipScanCache[key],'OCR');
      return;
    }
    if(status) status.textContent='กำลัง OCR...';
    console.log('[Slip] Google Vision fallback');
    var base64=await fileToBase64(file);
    const { data, error } = await sb.functions.invoke('scan-vision',{ body:{ image: base64 } });
    if(error||!data||!data.success){
      slipScanCache[key]={amount:null};
      toast('ไม่พบยอดเงิน กรุณากรอกเอง','err');
      return;
    }
    if(data.text&&isBankSlipText(data.text)) setPaymentToTransfer();
    var visionData={amount:data.amount!=null?Number(data.amount):null,date:data.date||parseDateFromText(data.text||'')||detectedDate};
    if(visionData.amount==null&&!visionData.date){
      slipScanCache[key]={amount:null};
      toast('ไม่พบยอดเงิน กรุณากรอกเอง','err');
      return;
    }
    if(status) status.textContent='กำลังเติมข้อมูล...';
    slipScanCache[key]=visionData;
    fillScannedData(visionData,'OCR ออนไลน์');
  }finally{
    if(status) status.textContent='';
    if(input) input.value='';
  }
}

document.getElementById('slip-upload')
  ?.addEventListener('change', function(e){
    var f = e.target.files[0]; if(!f) return;
    document.getElementById('slip-status').textContent = 'กำลังวิเคราะห์...';
    setDot('spin','กำลังอ่านสลิป...');
    scanSlipImage(f)
      .catch(function(err){ toast('Error: '+err.message,'err'); })
      .finally(function(){ setDot('ok','Synced'); });
  });

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
  budget.textContent=pct+'% '+t('dailyBudget');
  var recent=S.expenses.slice().sort(function(a,b){ return String(b.date||'').localeCompare(String(a.date||'')); }).slice(0,3);
  if(!recent.length){
    list.innerHTML='<div class="rounded-xl border border-dashed border-border bg-card2/40 p-4 text-sm leading-6 text-textMuted">ยังไม่มีรายการล่าสุด</div>';
    return;
  }
  list.innerHTML=recent.map(function(e){
    var cat=String(e.category||'');
    var iconMap={'อาหาร':'restaurant','เครื่องดื่ม':'local_cafe','ขนม':'bakery_dining','สัตว์เลี้ยง':'pets','ช้อปปิ้ง':'shopping_bag','กิจกรรม':'sports_esports','การเดินทาง':'directions_car','สถานที่':'home','ลงทุน':'trending_up','สุขภาพ':'medical_services','บิล':'receipt_long','การศึกษา':'school','บริจาค':'volunteer_activism','ท่องเที่ยว':'flight','ครอบครัว':'family_restroom','อื่น':'more_horiz'};
    var key=Object.keys(iconMap).find(function(k){ return cat.indexOf(k)>-1; });
    var ico=key?iconMap[key]:'receipt_long';
    return '<div class="flex items-center justify-between gap-3 rounded-xl border border-border bg-card2/60 p-3">'+
      '<div class="flex min-w-0 items-center gap-3">'+
        '<span class="material-symbols-outlined flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primaryContainer/20 text-primary">'+ico+'</span>'+
        '<div class="min-w-0">'+
          '<div class="truncate font-notoThai text-sm font-bold text-textMain">'+esc(e.detail||'-')+'</div>'+
          '<div class="truncate text-xs font-semibold text-textMuted">'+esc(e.category||'')+' • '+esc(e.payment||'')+'</div>'+
        '</div>'+
      '</div>'+
      '<div class="shrink-0 font-spaceGrotesk text-sm font-bold text-danger">- ฿ '+fmt(e.amount)+'</div>'+
    '</div>';
  }).join('');
}

function autoMatch(ex){
  var crId=resolveCreditIdForExpense(ex.payment,ex.paidBy);
  if(!crId) return;
  if(!ex.date||ex.date.slice(0,7)!==thisMo()) return;
  crId=getLinkedCreditId(crId);
  var info=S.crInfo[crId]||{};
  var st=S.crStatus[crId]||{paid:false,amount:0,remaining:null,date:''};
  if(st.baseRemaining==null) st.baseRemaining = st.remaining!=null?st.remaining:(info.limit||0);
  if(!st.baseAt) st.baseAt = thisMo()+'-01T00:00:00.000Z';
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
function setHF(f,el){ hf=f; if(el) el.classList.add('on'); renderHist(); }
function setHistTimeFilter(f){ currentHistTimeFilter=f; renderHist(); }
function setHistUserFilter(f){ currentHistUserFilter=f; renderHist(); }
function renderHistFilters(){
  var timeWrap=document.getElementById('hist-time-filters'), userWrap=document.getElementById('hist-filters');
  function syncBtn(b,active){
    b.classList.toggle('on',active);
    b.classList.toggle('border-primaryContainer',active);
    b.classList.toggle('bg-primaryContainer/20',active);
    b.classList.toggle('text-primary',active);
    b.classList.toggle('text-textMuted',!active);
  }
  if(timeWrap) timeWrap.querySelectorAll('[data-hist-time]').forEach(function(b){ syncBtn(b,b.dataset.histTime===currentHistTimeFilter); });
  if(!userWrap) return;
  Array.from(userWrap.querySelectorAll('[data-hist-user].dyn')).forEach(function(el){ el.remove(); });
  (S.familyMembers||[]).forEach(function(m){
    if(!m||!m.id||String(m.id)===String(S.user&&S.user.id)) return;
    var b=document.createElement('button');
    b.type='button'; b.className='dyn rounded-full border border-border bg-card2 px-4 py-2 font-inter text-xs font-bold text-textMuted transition'; b.dataset.histUser=m.id;
    b.textContent=m.full_name||m.email||'สมาชิก';
    b.onclick=function(){ setHistUserFilter(m.id); };
    userWrap.appendChild(b);
  });
  userWrap.querySelectorAll('[data-hist-user]').forEach(function(b){
    var v=b.dataset.histUser==='me'&&S.user?S.user.id:b.dataset.histUser;
    var cur=currentHistUserFilter==='me'&&S.user?S.user.id:currentHistUserFilter;
    syncBtn(b,String(v)===String(cur));
  });
}
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
  renderHistFilters();
  var visibleDays={};
  var mo=thisMo(), last=dashMonthKey(-1);
  var rows=S.expenses.map(function(e){
    return {type:'expense',id:e.id,date:e.date,detail:e.detail||'-',category:e.category||'-',channel:e.payment||'-',amount:Number(e.amount||0),person:e.paidBy||'',user_id:e.user_id||'',catC:e.catC||'#c7bfff',raw:e};
  }).concat(S.incomes.map(function(i){
    return {type:'income',id:i.id,date:i.date,detail:i.detail||'รายรับ',category:i.category||'รายรับ',channel:i.channel||'-',amount:Number(i.amount||0),person:i.receiver||'',user_id:i.user_id||'',catC:'#4edea3',raw:i};
  })).concat((S.credits||[]).map(function(c){
    return {type:'credit',id:c.id,date:c.date,detail:c.credit_name||'ชำระสินเชื่อ',category:'Credit Payment',channel:c.status||'จ่ายแล้ว',amount:Number(c.amount||0),person:'',user_id:c.user_id||'',catC:'#ffb95f',raw:c};
  }));
  var entity=currentHistUserFilter==='me'&&S.user?S.user.id:currentHistUserFilter;
  var items=rows.filter(function(r){
    var okTime=currentHistTimeFilter==='all_time'||(currentHistTimeFilter==='this_month'&&r.date&&r.date.slice(0,7)===mo)||(currentHistTimeFilter==='last_month'&&r.date&&r.date.slice(0,7)===last);
    var okUser=entity==='joint'||String(r.user_id||'')===String(entity);
    return okTime&&okUser;
  }).sort(function(a,b){ return String(b.date||'').localeCompare(String(a.date||'')); });
  var now=new Date(), weekAgo=new Date(now.getTime()-6*86400000);
  var expenseItems=items.filter(function(e){ return e.type==='expense'; });
  var weekItems=expenseItems.filter(function(e){ return e.date&&new Date(e.date+'T00:00:00')>=weekAgo; });
  var weekTot=weekItems.reduce(function(s,e){ return s+Number(e.amount||0); },0);
  var catTotals={};
  expenseItems.forEach(function(e){ var c=e.category||'ไม่ระบุ'; catTotals[c]=(catTotals[c]||0)+Number(e.amount||0); });
  var topCat=Object.keys(catTotals).sort(function(a,b){ return catTotals[b]-catTotals[a]; })[0]||'-';
  if(kpis){
    kpis.innerHTML='<div class="rounded-2xl border border-white/10 bg-surfaceLow/80 p-5 shadow-xl backdrop-blur-xl"><div class="mb-3 flex items-center justify-between text-xs font-bold uppercase tracking-[.14em] text-textMuted"><span>ใช้จ่ายสัปดาห์นี้</span><span class="material-symbols-outlined text-danger">trending_down</span></div><div class="font-spaceGrotesk text-3xl font-bold text-textMain">฿ '+fmt(weekTot)+'</div><div class="mt-2 text-xs font-semibold text-textMuted">'+weekItems.length+' รายการใน 7 วันล่าสุด</div></div>'+
      '<div class="rounded-2xl border border-white/10 bg-surfaceLow/80 p-5 shadow-xl backdrop-blur-xl"><div class="mb-3 flex items-center justify-between text-xs font-bold uppercase tracking-[.14em] text-textMuted"><span>รายการสูงสุด</span><span class="material-symbols-outlined text-primary">category</span></div><div class="font-spaceGrotesk text-3xl font-bold text-textMain">฿ '+fmt(catTotals[topCat]||0)+'</div><div class="mt-2 text-xs font-semibold text-textMuted">'+esc(topCat)+'</div></div>'+
      '<div class="rounded-2xl border border-white/10 bg-surfaceLow/80 p-5 shadow-xl backdrop-blur-xl"><div class="mb-3 flex items-center justify-between text-xs font-bold uppercase tracking-[.14em] text-textMuted"><span>จำนวนธุรกรรม</span><span class="material-symbols-outlined text-green">receipt_long</span></div><div class="font-spaceGrotesk text-3xl font-bold text-textMain">'+items.length+'</div><div class="mt-2 text-xs font-semibold text-textMuted">รายการตามตัวกรองปัจจุบัน</div></div>';
  }
  if(!items.length){ pruneOpenDays(visibleDays); list.innerHTML='<div class="rounded-2xl border border-dashed border-border bg-card2/40 p-8 text-center text-sm text-textMuted"><p>ยังไม่มีรายการ</p></div>'; return; }
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
  function typeIcon(t){ return t==='income'?'payments':t==='credit'?'credit_score':'receipt_long'; }
  function typeLabel(t){ return t==='income'?'รายรับ':t==='credit'?'ชำระสินเชื่อ':'รายจ่าย'; }
  function signedAmount(r){ return r.type==='income'?Number(r.amount||0):-Number(r.amount||0); }
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
    var moTot=moItems.reduce(function(s,e){ return s+signedAmount(e); },0);
    var moDiv=document.createElement('div'); moDiv.className='space-y-3';
    var moHdr=document.createElement('div'); moHdr.className='font-inter text-xs font-extrabold uppercase tracking-[.14em] text-textMuted';
    moHdr.textContent=thaiMo(moKey)+' · ฿ '+fmt(moTot)+' ('+moItems.length+' รายการ)';
    moDiv.appendChild(moHdr);
    // Group by day inside month
    var dayGrps={};
    moItems.forEach(function(e){ var k=e.date||'unknown'; if(!dayGrps[k]) dayGrps[k]=[]; dayGrps[k].push(e); });
    Object.keys(dayGrps).sort(function(a,b){ return b.localeCompare(a); }).forEach(function(dayKey){
      visibleDays[dayKey]=1;
      var dayItems=dayGrps[dayKey];
      var dayTot=dayItems.reduce(function(s,e){ return s+signedAmount(e); },0);
      var latestDay=items[0]&&items[0].date;
      var isOpen=openDays.hasOwnProperty(dayKey)?openDays[dayKey]!==false:dayKey===latestDay;
      var dFull=dayKey&&dayKey!=='unknown'?new Date(dayKey).toLocaleDateString('th-TH',{weekday:'short',day:'numeric',month:'short'}):'ไม่ระบุวัน';
      // Day header
      var dayHdr=document.createElement('div');
      dayHdr.className='flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-border bg-card2/60 px-4 py-3 transition hover:border-primary/40';
      dayHdr.innerHTML='<div class="min-w-0"><span class="block truncate font-notoThai text-sm font-bold text-textMain">'+esc(dFull)+'</span><span class="text-xs font-semibold text-textMuted">'+dayItems.length+' รายการ</span></div><div class="flex shrink-0 items-center gap-3"><span class="font-spaceGrotesk text-sm font-bold '+(dayTot>=0?'text-green':'text-danger')+'">'+(dayTot>=0?'+ ':'- ')+'฿ '+fmt(Math.abs(dayTot))+'</span><span class="day-chev inline-block text-textMuted transition-transform" style="transform:'+(isOpen?'rotate(180deg)':'rotate(0deg)')+'">▾</span></div>';
      // Day body
      var dayBody=document.createElement('div');
      dayBody.className='overflow-hidden transition-[max-height] duration-300';
      dayBody.style.maxHeight=isOpen?'9999px':'0';
      var scroll=document.createElement('div'); scroll.className='overflow-x-auto rounded-2xl border border-white/10 bg-surfaceLow/70';
      var table=document.createElement('table'); table.className='w-full min-w-[760px] border-collapse text-left';
      table.innerHTML='<thead><tr class="border-b border-border text-xs font-bold text-textMuted"><th class="px-4 py-3">วันที่</th><th class="px-4 py-3">รายละเอียด</th><th class="px-4 py-3">ประเภท</th><th class="px-4 py-3">ช่องทาง</th><th class="px-4 py-3 text-right">จำนวนเงิน</th><th class="px-4 py-3 text-center">ผู้ทำรายการ</th><th class="px-4 py-3"></th></tr></thead><tbody></tbody>';
      var tbody=table.querySelector('tbody');
      dayItems.forEach(function(e){
        var row=document.createElement('tr');
        row.className='border-b border-white/10 last:border-0';
        var amtClass=e.type==='income'?'pos':'neg';
        var amtText=(e.type==='income'?'+ ':'- ')+'฿ '+fmt(e.amount);
        row.innerHTML='<td class="px-4 py-3 text-xs font-semibold text-textMuted">'+esc(dateLabel(e.date))+'</td>'+
          '<td class="px-4 py-3"><div class="max-w-[220px] truncate text-sm font-bold text-textMain">'+esc(e.detail||'-')+'</div><div class="max-w-[220px] truncate text-xs font-semibold text-textMuted">'+esc(e.channel||'')+'</div></td>'+
          '<td class="px-4 py-3"><div class="inline-flex items-center gap-2 rounded-full border border-border bg-card2 px-3 py-1 text-xs font-bold text-textMuted"><span class="material-symbols-outlined text-base '+(e.type==='income'?'text-green':e.type==='credit'?'text-warning':'text-primary')+'">'+(e.type==='expense'?catIcon(e.category):typeIcon(e.type))+'</span><span>'+esc(typeLabel(e.type))+'</span></div></td>'+
          '<td class="px-4 py-3"><div class="inline-flex items-center gap-2 text-xs font-bold text-textMuted"><span class="material-symbols-outlined text-base">'+payMatIcon(e.channel)+'</span><span class="max-w-[160px] truncate">'+esc(e.category||e.channel||'-')+'</span></div></td>'+
          '<td class="px-4 py-3 text-right font-spaceGrotesk text-sm font-bold '+(amtClass==='pos'?'text-green':'text-danger')+'">'+amtText+'</td>'+
          '<td class="px-4 py-3 text-center"><span class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card2 text-xs font-bold text-textMuted">'+esc(personInitial(e.person||typeLabel(e.type)))+'</span></td>'+
          '<td class="px-4 py-3 text-right">'+(e.type==='expense'?'<button class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-danger/30 bg-danger/10 text-lg font-bold text-danger" onclick="delEx(this.dataset.id)" data-id="'+e.id+'">×</button>':'')+'</td>';
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
function syncCreditFilterButtons(){
  document.querySelectorAll('#pg-cr [data-cr-filter]').forEach(function(btn){
    var active=btn.dataset.crFilter===crf;
    btn.classList.toggle('on',active);
    btn.classList.toggle('border-primaryContainer',active);
    btn.classList.toggle('bg-primaryContainer/20',active);
    btn.classList.toggle('text-primary',active);
    btn.classList.toggle('border-border',!active);
    btn.classList.toggle('bg-card2',!active);
    btn.classList.toggle('text-textMuted',!active);
  });
}
function setCRF(f,el){ crf=f; if(el) el.classList.add('on'); syncCreditFilterButtons(); renderCR(); }
function updateCreditProviderOptions(){
  var typeEl=document.getElementById('cs-type'), providerEl=document.getElementById('cs-provider');
  if(!typeEl||!providerEl) return;
  var cur=providerEl.value;
  var opts=typeEl.value==='fixed'
    ? FIXED_CREDIT_PROVIDERS
    : BASE_CR.filter(function(c){ return c.t==='revolving'; }).map(function(c){ return c.n; });
  providerEl.innerHTML=opts.map(function(n){ return '<option value="'+esc(n)+'">'+esc(n)+'</option>'; }).join('');
  if(opts.indexOf(cur)>=0) providerEl.value=cur;
  populateLinkedPrimaryCreditOptions();
  toggleLinkedPrimaryCredit();
  renderMobilePickers();
}
function primaryCreditOptionsForSetup(){
  return Object.keys(S.crInfo||{}).filter(function(id){
    var info=S.crInfo[id]||{};
    return getLinkedCreditId(id)===id&&(info.cardType||info.card_type||'primary')!=='secondary';
  }).map(function(id){
    var cr=allCR().find(function(c){ return c.id===id; })||{};
    return {id:id,name:creditNameById(id)||(cr&&cr.n)||id};
  });
}
function populateLinkedPrimaryCreditOptions(){
  var el=document.getElementById('cs-linked-credit'); if(!el) return;
  var cur=el.value;
  var opts=primaryCreditOptionsForSetup();
  el.innerHTML='<option value="">เลือก primary card</option>'+opts.map(function(o){ return '<option value="'+esc(o.id)+'">'+esc(o.name)+'</option>'; }).join('');
  if(opts.some(function(o){ return o.id===cur; })) el.value=cur;
  renderMobilePickers();
}
function toggleLinkedPrimaryCredit(){
  var typeEl=document.getElementById('cs-card-type'), wrap=document.getElementById('cs-linked-wrap');
  if(!typeEl||!wrap) return;
  var isSecondary=typeEl.value==='secondary';
  wrap.classList.toggle('on',isSecondary);
  if(isSecondary) populateLinkedPrimaryCreditOptions();
  renderMobilePickers();
}
function crInitials(name){
  name=String(name||'CR').replace(/[^\wก-๙+\/ ]/g,'').trim();
  if(name.indexOf('K-Bank')>=0) return 'KB';
  if(name.indexOf('CardX')>=0) return 'CX';
  if(name.indexOf('Krungsri')>=0) return 'KS';
  if(name.indexOf('TikTok')>=0) return 'TT';
  return name.split(/\s+|\/|-/).filter(Boolean).map(function(p){ return p.charAt(0); }).join('').slice(0,3).toUpperCase()||'CR';
}
function creditPaymentsThisMonth(cr){
  var mo=thisMo();
  return (S.credits||[]).filter(function(p){
    return p.date&&p.date.slice(0,7)===mo&&(p.credit_name===cr.n||p.credit_id===cr.id);
  });
}
function renderCreditLine(cr){
  var mo=thisMo(),st=S.crStatus[cr.id]||{},info=S.crInfo[cr.id]||{};
  var paidRows=creditPaymentsThisMonth(cr);
  var isPaid=paidRows.length>0||(st.paid&&(st.date||'').slice(0,7)===mo);
  var bal=st.remaining!=null?Number(st.remaining||0):(info.minPay||0);
  var due=info.dueDate||'-';
  var rate=info.rate||cr.rate||0;
  var logo=getCreditLogoMeta(cr);
  return '<div class="rounded-2xl border border-border bg-card2/60 p-4 shadow-lg">'+
    '<div class="flex flex-wrap items-start gap-3">'+
      '<div class="inline-flex h-[42px] w-[42px] min-w-[42px] items-center justify-center rounded-xl border border-white/15 text-xs font-black tracking-wide text-white shadow-lg" style="background-color:'+esc(logo.color)+'">'+esc(logo.label)+'</div>'+
      '<div class="min-w-0 flex-1"><div class="truncate font-notoThai text-base font-bold text-textMain">'+esc(cr.n)+'</div><div class="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold text-textMuted"><span>'+(getLang()==='th'?'ครบกำหนด: ':'Due: ')+esc(due)+'</span><span>'+(getLang()==='th'?'ดอกเบี้ย: ':'Rate: ')+esc(rate)+'%</span></div></div>'+
      '<div class="inline-flex max-w-max items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold '+(isPaid?'bg-green/15 text-green':'bg-warning/15 text-warning')+'"><span class="material-symbols-outlined text-base">'+(isPaid?'check_circle':'warning')+'</span><em class="not-italic">'+t(isPaid?'paid':'due')+'</em></div>'+
    '</div>'+
    '<div class="mt-4 grid gap-3 md:grid-cols-[1fr_auto] md:items-end">'+
      '<div><div class="font-spaceGrotesk text-3xl font-bold '+(!isPaid&&bal>0?'text-warning':'text-textMain')+'">฿ '+fmt(bal)+'</div><div class="text-xs font-bold text-textMuted">'+t('currentBalance')+'</div></div>'+
      '<div class="flex gap-2"><button class="rounded-xl border border-border bg-surfaceLow px-4 py-2 text-xs font-bold text-textMain" onclick="openInfo(\''+cr.id+'\')">'+t('editInfo')+'</button><button class="rounded-xl bg-primaryContainer px-4 py-2 text-xs font-bold text-white shadow-lg shadow-primaryContainer/25" onclick="openPay(\''+cr.id+'\')">'+t('payBill')+'</button></div>'+
    '</div>'+
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
  var cells=names.map(function(n){ return '<div class="text-center text-xs font-bold text-textMuted">'+n+'</div>'; }).join('');
  for(var i=0;i<first;i++) cells+='<div class="aspect-square rounded-xl"></div>';
  for(var d=1;d<=days;d++){
    var cls=dueMap[d]?(d<=15?'due':'warn'):'';
    var tone=cls==='due'?'bg-primaryContainer/35 text-primary':cls==='warn'?'bg-warning/20 text-warning':'bg-card2/70 text-textMuted';
    cells+='<div class="flex aspect-square items-center justify-center rounded-xl text-xs font-bold '+tone+'">'+d+'</div>';
  }
  Object.keys(dueMap).sort(function(a,b){ return Number(a)-Number(b); }).slice(0,4).forEach(function(d,idx){
    dueMap[d].slice(0,2).forEach(function(cr){ legend.push('<div class="flex items-center gap-2 text-xs font-semibold text-textMuted"><span class="h-2.5 w-2.5 rounded-full '+(idx%2?'bg-warning':'bg-primaryContainer')+'"></span>'+esc(cr.n)+' ('+d+')</div>'); });
  });
  return '<div class="rounded-2xl border border-white/10 bg-surfaceLow/80 p-5 shadow-xl backdrop-blur-xl"><div class="mb-4 flex items-center justify-between font-spaceGrotesk text-lg font-bold text-textMain">Bill Calendar <span class="material-symbols-outlined text-primary">calendar_month</span></div><div class="rounded-2xl border border-border bg-card2/60 p-4"><div class="mb-3 flex items-center justify-between text-sm font-bold text-textMuted"><span>‹</span><span>'+now.toLocaleDateString('en-US',{month:'long',year:'numeric'})+'</span><span>›</span></div><div class="grid grid-cols-7 gap-2">'+cells+'</div></div><div class="mt-4 flex flex-col gap-2">'+(legend.join('')||'<div class="text-sm text-textMuted">ยังไม่มีวันครบกำหนด</div>')+'</div></div>';
}

function renderCR(){
  var overview=document.getElementById('debt-overview-card'),match=document.getElementById('match-summary-card');
  syncCreditFilterButtons();
  if(S.profile&&S.profile.family_id&&Object.keys(S.crInfo||{}).length===0){
    if(overview) overview.innerHTML='';
    if(match) match.innerHTML='';
    var list0=document.getElementById('cr-list'); if(list0) list0.innerHTML="<div class=\"rounded-2xl border border-dashed border-border bg-card2/40 p-8 text-center\"><div class=\"mb-4 font-spaceGrotesk text-xl font-bold text-textMain\">Credit Setup</div><button class=\"rounded-xl bg-primaryContainer px-4 py-3 text-sm font-bold text-white\" onclick=\"openCreditSetupModal('revolving')\">เพิ่มสินเชื่อใบแรก</button></div>";
    return;
  }
  renderDebtOverview();
  renderMatchSummary();
  var list=document.getElementById('cr-list'); list.innerHTML='';
  if(crf==='plan'){ list.className=''; renderSmartDebt(); return; }
  var grp=getMyCredits().filter(function(c){ return crf==='overview'||crf==='all'||c.t===crf; });
  list.className='grid gap-3';
  if(!grp.length){ list.innerHTML='<div class="rounded-2xl border border-dashed border-border bg-card2/40 p-8 text-center text-sm text-textMuted">ไม่มีรายการตามตัวกรองนี้</div>'; return; }
  list.innerHTML=grp.map(renderCreditLine).join('');
  applyLanguage();
}

function openCreditSetupModal(type){
  var t=(type==='fixed'||type==='secured')?'fixed':'revolving';
  var modal=document.getElementById('credit-setup-modal');
  var typeEl=document.getElementById('cs-type'), providerEl=document.getElementById('cs-provider');
  var limitEl=document.getElementById('cs-limit'), rateEl=document.getElementById('cs-rate'), minEl=document.getElementById('cs-min');
  var billEl=document.getElementById('cs-bill'), dueEl=document.getElementById('cs-due');
  var cardTypeEl=document.getElementById('cs-card-type'), linkedEl=document.getElementById('cs-linked-credit');
  if(!modal||!typeEl||!providerEl||!limitEl||!rateEl||!minEl||!billEl||!dueEl){
    console.error('credit setup modal is missing required fields');
    return toast('ฟอร์มเพิ่มสินเชื่อโหลดไม่ครบ ลองรีเฟรชหน้าอีกครั้ง','err');
  }
  typeEl.value=t;
  updateCreditProviderOptions();
  providerEl.value=providerEl.value||'KTC';
  if(cardTypeEl) cardTypeEl.value='primary';
  if(linkedEl) linkedEl.value='';
  toggleLinkedPrimaryCredit();
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
    var cardType=(document.getElementById('cs-card-type')||{}).value||'primary';
    var linkedCreditId=(document.getElementById('cs-linked-credit')||{}).value||'';
    var cardHolderId=S.profile&&S.profile.id||S.user&&S.user.id||'';
    if(!provider) return toast('เลือกผู้ใช้บริการก่อน','err');
    if(cardType==='secondary'&&!linkedCreditId) return toast('เลือก primary card ก่อน','err');
    var cr=allCR().find(function(c){ return c.n===provider; });
    if(!cr){
      cr={id:'cr_'+provider.toLowerCase().replace(/\W+/g,'_'),n:provider,t:type,ico:'CR',rate:0};
      S.customCr.push(cr);
    }
    if(cardType==='secondary'){
      var localId='secondary_'+cr.id+'_'+(cardHolderId||Date.now());
      if(!allCR().some(function(c){ return c.id===localId; })){
        S.customCr.push({id:localId,n:cr.n,t:cr.t,ico:cr.ico,rate:cr.rate,_hidden:true});
      }
      cr=allCR().find(function(c){ return c.id===localId; })||cr;
    }
    cr.t=type;
    var info={
      limit:parseFloat(document.getElementById('cs-limit').value)||0,
      rate:parseFloat(document.getElementById('cs-rate').value)||0,
      minPay:parseFloat(document.getElementById('cs-min').value)||0,
      billCycle:document.getElementById('cs-bill').value,
      dueDate:document.getElementById('cs-due').value,
      cardType:cardType,
      cardHolderId:cardHolderId,
      linkedCreditId:linkedCreditId
    };
    if(!info.limit) return toast('กรอกวงเงิน/ยอดหนี้ก่อน','err');
    S.crInfo[cr.id]=info;
    sv();
    await saveToSupabase('credit_info',{credit_name:cr.n,type:cr.t,credit_limit:info.limit,rate:info.rate,min_pay:info.minPay,bill_cycle:info.billCycle,due_date:info.dueDate,card_type:cardType,card_holder_id:info.cardHolderId,linked_credit_id:linkedCreditId});
    closeD('credit-setup-modal');
    await loadFromSupabase(S.profile);
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
  var monthPaid=(S.credits||[]).filter(function(c){ return c.date&&c.date.slice(0,7)===mo; }).reduce(function(s,c){ return s+Number(c.amount||0); },0);
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
  updateMobileDebtBento({total:'฿ '+fmt(totUsed),monthly:'฿ '+fmt(monthPaid)});
  w.innerHTML='<div class="mb-5 rounded-2xl border border-white/10 bg-gradient-to-br from-primaryContainer/20 to-surfaceLow p-5 shadow-xl backdrop-blur-xl"><div class="mb-3 flex items-center gap-3"><span class="material-symbols-outlined flex h-10 w-10 items-center justify-center rounded-full bg-green/15 text-green">verified</span><p class="font-inter text-xs font-extrabold uppercase tracking-[.14em] text-textMuted">'+t('creditPaidMonth')+'</p></div><strong class="block font-spaceGrotesk text-4xl font-bold text-textMain">฿ '+fmt(monthPaid)+'</strong><small class="mt-2 block text-xs font-bold text-textMuted">'+thaiMo(mo)+'</small></div>'+
    '<div class="mb-5 grid gap-3 md:grid-cols-3">'+
    '<div class="rounded-2xl border border-white/10 bg-surfaceLow/80 p-5 shadow-xl backdrop-blur-xl"><div class="text-xs font-extrabold uppercase tracking-[.14em] text-textMuted">'+t('totalApprovedLimit')+'</div><div class="mt-3 font-spaceGrotesk text-3xl font-bold text-textMain">฿ '+fmt(totLimit)+'</div><div class="mt-4 flex items-center gap-2 text-xs font-bold text-primary"><span class="material-symbols-outlined text-base">trending_up</span>'+paidCount+'/'+crCount+' '+t('paidThisMonth')+'</div></div>'+
    '<div class="rounded-2xl border border-white/10 bg-surfaceLow/80 p-5 text-center shadow-xl backdrop-blur-xl"><div class="text-xs font-extrabold uppercase tracking-[.14em] text-textMuted">'+t('utilizationRate')+'</div><div class="mx-auto mt-4 flex h-28 w-28 items-center justify-center rounded-full border-8 border-primaryContainer/30 bg-card2"><strong class="font-spaceGrotesk text-2xl font-bold text-primary">'+pct+'%</strong></div><div class="mt-3 text-xs font-bold text-textMuted">'+t(pct<=40?'healthyStatus':pct<=70?'watchStatus':'highUsage')+'</div></div>'+
    '<div class="rounded-2xl border border-white/10 bg-surfaceLow/80 p-5 shadow-xl backdrop-blur-xl"><div class="text-xs font-extrabold uppercase tracking-[.14em] text-textMuted">'+t('availableCredit')+'</div><div class="mt-3 font-spaceGrotesk text-3xl font-bold text-green">฿ '+fmt(avail)+'</div><div class="mt-5 h-2 overflow-hidden rounded-full bg-card2"><span class="block h-full rounded-full bg-green" style="width:'+availPct+'%"></span></div><div class="mt-2 text-right text-xs font-extrabold text-textMuted">'+availPct+'% '+t('availableCredit')+'</div></div>'+
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
  var cr=allCR().find(function(c){ return c.id===activeCrId; });
  if(!cr||!S.crInfo[activeCrId]) return toast('ไม่พบข้อมูลสินเชื่อ กรุณาลองใหม่','err');
  if(!Number.isFinite(amt)||amt<=0) return toast('ใส่จำนวนเงินด้วย','err');
  if(!validateTxnInput({date:dt,credit_name:cr&&cr.n,amount:amt})) return;
  var baseAt=new Date().toISOString();
  S.crStatus[activeCrId]={paid:true,amount:amt,baseRemaining:rem,baseAt:baseAt,matchedUsed:0,remaining:rem,date:dt};
  S.credits.unshift({id:makeRowId(),date:dt,credit_name:cr.n,type:cr.t,amount:amt,remaining:rem,status:'จ่ายแล้ว',user_id:S.user&&S.user.id||'',createdAt:baseAt});
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
    updateMobileDebtBento({total:'-',monthly:'-',interest:'-',faster:'-'});
    list.innerHTML='<div class="rounded-2xl border border-dashed border-border bg-card2/40 p-8 text-center text-sm font-bold leading-7 text-textMuted"><p>ไม่มีข้อมูลหนี้สำหรับวางแผน<br>กรอกข้อมูลสินเชื่อก่อนนะ</p></div>';
    return;
  }

  // Strategy toggle
  var strategyPanel=document.createElement('div'); strategyPanel.className=controls?'p-5 md:p-6':'';
  if(controls) strategyPanel.innerHTML='<div class="mb-4 flex items-center gap-2 font-spaceGrotesk text-xl font-extrabold text-textMain"><span class="material-symbols-outlined text-primary">model_training</span> กลยุทธ์ชำระหนี้</div>';
  var toggleDiv=document.createElement('div'); toggleDiv.className='grid grid-cols-2 gap-3';
  var btnSnow=document.createElement('button'); btnSnow.className='strategy-btn rounded-xl border px-3 py-3 text-center text-xs font-bold leading-5 transition';
  btnSnow.innerHTML='<span class="material-symbols-outlined mb-1 block text-[22px] text-primary">filter_1</span>Snowball<br><span class="text-[10px] opacity-70">ก้อนเล็กก่อน</span>';
  btnSnow.onclick=function(){ S.strategy='snowball'; updateSmartResults(); };
  var btnAva=document.createElement('button'); btnAva.className='strategy-btn rounded-xl border px-3 py-3 text-center text-xs font-bold leading-5 transition';
  btnAva.innerHTML='<span class="material-symbols-outlined mb-1 block text-[22px] text-primary">trending_down</span>Avalanche<br><span class="text-[10px] opacity-70">ดอกแพงก่อน</span>';
  btnAva.onclick=function(){ S.strategy='avalanche'; updateSmartResults(); };
  toggleDiv.appendChild(btnAva); toggleDiv.appendChild(btnSnow);
  strategyPanel.appendChild(toggleDiv);
  if(controls) controls.appendChild(strategyPanel); else list.appendChild(toggleDiv);

  // ── Extra cash input (rendered ONCE — never re-created to avoid focus loss) ──
  var extraPanel=document.createElement('div'); extraPanel.className=controls?'border-t border-white/10 p-5 md:p-6':'';
  if(controls) extraPanel.innerHTML='<div class="mb-2 flex items-center gap-2 font-spaceGrotesk text-xl font-extrabold text-textMain"><span class="material-symbols-outlined text-primary">add_card</span><span>เพิ่มเงินโปะต่อเดือน</span></div><p class="mb-4 text-sm leading-6 text-textMuted">ใส่จำนวนเงินที่คุณสามารถจ่ายเพิ่มจากยอดขั้นต่ำได้</p>';
  var extraRow=document.createElement('div'); extraRow.className='grid gap-3';
  var extraTop=document.createElement('div'); extraTop.className='flex items-center gap-3 rounded-xl border border-border bg-card2 px-4 py-3';
  var extraCurrency=document.createElement('span'); extraCurrency.className='text-xl font-bold text-primary'; extraCurrency.textContent='฿';
  var extraInp=document.createElement('input'); extraInp.className='min-w-0 flex-1 bg-transparent text-2xl font-extrabold text-textMain outline-none placeholder:text-subtle'; extraInp.type='number';
  extraInp.id='smart-extra-inp';
  extraInp.placeholder='0'; extraInp.value=S.extraCash!=null?S.extraCash:0;
  extraInp.oninput=function(){ S.extraCash=parseFloat(this.value)||0; updateSmartResults(); };
  extraTop.appendChild(extraCurrency); extraTop.appendChild(extraInp);
  var extraHint=document.createElement('div'); extraHint.className='flex items-center justify-between rounded-xl border border-green/20 bg-green/10 p-4 text-green';
  extraHint.innerHTML='<div><span class="block text-xs font-bold text-textMuted">ร่นระยะเวลาได้</span><strong class="mt-1 block text-lg font-extrabold" id="smart-extra-saved">-</strong></div><span class="material-symbols-outlined text-3xl">timelapse</span>';
  extraRow.appendChild(extraTop); extraRow.appendChild(extraHint);
  extraPanel.appendChild(extraRow);
  if(controls) controls.appendChild(extraPanel); else list.appendChild(extraRow);

  // ── Results container (updated in-place by updateSmartResults) ──
  var resultsWrap=document.createElement('div'); resultsWrap.id='smart-results';
  resultsWrap.className='flex flex-col gap-3';
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
    var active=(isSnow&&S.strategy==='snowball')||(!isSnow&&S.strategy==='avalanche');
    btn.classList.toggle('on',active);
    btn.classList.toggle('border-primary',active);
    btn.classList.toggle('bg-primaryContainer/20',active);
    btn.classList.toggle('text-textMain',active);
    btn.classList.toggle('shadow-lg',active);
    btn.classList.toggle('shadow-primaryContainer/15',active);
    btn.classList.toggle('border-white/10',!active);
    btn.classList.toggle('bg-card2/80',!active);
    btn.classList.toggle('text-textMuted',!active);
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
  var mobileDebtView=isDebtPage&&window.matchMedia('(max-width:768px)').matches&&!!list.closest('#debt-mode-plan');
  var debtSheetList=document.getElementById('debt-order-sheet-list');
  if(mobileDebtView&&debtSheetList) debtSheetList.innerHTML='';
  if(isDebtPage){
    var savedInt=(withExtra.interest!=null&&noExtra.interest!=null)?Math.max(0,noExtra.interest-withExtra.interest):0;
    var savedMo=(withExtra.months!=null&&noExtra.months!=null)?Math.max(0,noExtra.months-withExtra.months):0;
    var savedEl=document.getElementById('smart-extra-saved');
    if(savedEl) savedEl.textContent=savedMo?Math.floor(savedMo/12)+' ปี '+(savedMo%12)+' เดือน':'0 เดือน';
    var saveEl=document.getElementById('debtp-save-amt');
    if(saveEl) saveEl.textContent='฿ '+fmt(savedInt);
    updateMobileDebtBento({
      total:'฿ '+fmt(totalRem),
      monthly:'฿ '+fmt(totalMinPay+extra),
      interest:'฿ '+fmt(savedInt),
      faster:savedMo?Math.floor(savedMo/12)+' ปี '+(savedMo%12)+' เดือน':'0 เดือน'
    });
    var impact=document.getElementById('debtp-impact');
    if(impact){
      impact.innerHTML='<div class="mt-5 grid gap-4 md:grid-cols-2">'+
        '<div class="rounded-xl border border-white/10 bg-card2/40 p-5"><div class="text-xs font-extrabold text-textMuted">จ่ายขั้นต่ำปกติ</div><div class="mt-2 font-spaceGrotesk text-3xl font-extrabold text-textMain">'+(noExtra.months!=null?Math.floor(noExtra.months/12)+' ปี '+(noExtra.months%12)+' เดือน':'∞')+'</div><div class="mt-2 text-sm font-bold text-danger">ดอกเบี้ยรวม: ฿ '+fmt(noExtra.interest||0)+'</div></div>'+
        '<div class="rounded-xl border border-primary/25 bg-primaryContainer/10 p-5"><div class="text-xs font-extrabold text-textMuted">แผน Smart</div><div class="mt-2 font-spaceGrotesk text-3xl font-extrabold text-green">'+(withExtra.months!=null?Math.floor(withExtra.months/12)+' ปี '+(withExtra.months%12)+' เดือน':'∞')+'</div><div class="mt-2 text-sm font-bold text-green">ดอกเบี้ยรวม: ฿ '+fmt(withExtra.interest||0)+'</div></div>'+
        '</div><div class="mt-5"><div class="mb-2 flex justify-between text-xs font-extrabold text-textMuted"><span>ปัจจุบัน</span><span>อิสรภาพทางการเงิน</span></div><div class="h-3 overflow-hidden rounded-full bg-card2"><span class="block h-full w-[45%] rounded-full bg-primary shadow-[0_0_14px_rgba(199,191,255,.45)]"></span></div></div>';
    }
  }

  // ── What-If comparison card (only when extra > 0) ──
  if(!isDebtPage&&extra>0&&withExtra.months!=null&&noExtra.months!=null){
    var savedMo=noExtra.months-withExtra.months;
    var savedInt=noExtra.interest-withExtra.interest;
    var wiCard=document.createElement('div');
    wiCard.className='rounded-2xl border border-green/25 bg-gradient-to-br from-green/10 to-primaryContainer/10 p-4';
    wiCard.innerHTML=
      '<div class="mb-3 text-xs font-extrabold uppercase tracking-[.12em] text-green">What-If: โปะเพิ่ม ฿ '+fmt(extra)+'/เดือน</div>'+
      '<div class="mb-3 grid grid-cols-2 gap-2">'+
        '<div class="rounded-xl bg-black/15 p-3 text-center">'+
          '<div class="mb-1 text-[10px] font-bold uppercase tracking-[.08em] text-textMuted">จ่ายขั้นต่ำปกติ</div>'+
          '<div class="font-spaceGrotesk text-xl font-extrabold text-danger">~'+noExtra.months+'</div>'+
          '<div class="text-[10px] text-textMuted">เดือน</div>'+
          '<div class="mt-2 text-xs font-bold text-danger">ดอก ฿ '+fmt(noExtra.interest)+'</div>'+
        '</div>'+
        '<div class="rounded-xl border border-green/20 bg-green/10 p-3 text-center">'+
          '<div class="mb-1 text-[10px] font-bold uppercase tracking-[.08em] text-green">โปะเพิ่ม ฿ '+fmt(extra)+'</div>'+
          '<div class="font-spaceGrotesk text-xl font-extrabold text-green">~'+withExtra.months+'</div>'+
          '<div class="text-[10px] text-textMuted">เดือน</div>'+
          '<div class="mt-2 text-xs font-bold text-green">ดอก ฿ '+fmt(withExtra.interest)+'</div>'+
        '</div>'+
      '</div>'+
      '<div class="flex gap-2">'+
        (savedMo>0?'<div class="flex-1 rounded-xl bg-green/10 p-3 text-center"><div class="mb-1 text-[10px] font-bold text-green">ประหยัดเวลา</div><div class="font-spaceGrotesk text-lg font-extrabold text-green">'+savedMo+' เดือน</div></div>':'')+''+
        (savedInt>0?'<div class="flex-1 rounded-xl bg-green/10 p-3 text-center"><div class="mb-1 text-[10px] font-bold text-green">ประหยัดดอกเบี้ย</div><div class="font-spaceGrotesk text-lg font-extrabold text-green">฿ '+fmt(savedInt)+'</div></div>':'')+
      '</div>';
    resultsWrap.appendChild(wiCard);
  }

  // Summary bar
  var sumDiv=document.createElement('div'); sumDiv.className='rounded-2xl border border-white/10 bg-surfaceLow/80 p-4 shadow-xl backdrop-blur-xl';
  sumDiv.innerHTML='<div class="mb-3 font-spaceGrotesk text-lg font-extrabold text-textMain">'+(S.strategy==='snowball'?'Snowball — ปิดก้อนเล็กก่อน':'Avalanche — โปะดอกแพงก่อน')+'</div><div class="grid gap-3 md:grid-cols-3"><div class="rounded-xl border border-border bg-card2/60 p-4"><div class="font-spaceGrotesk text-xl font-extrabold text-textMain">฿ '+fmt(totalRem)+'</div><div class="mt-1 text-xs font-bold text-textMuted">หนี้รวม</div></div><div class="rounded-xl border border-border bg-card2/60 p-4"><div class="font-spaceGrotesk text-xl font-extrabold text-textMain">฿ '+fmt(totalMinPay+extra)+'</div><div class="mt-1 text-xs font-bold text-textMuted">จ่าย/เดือน</div></div><div class="rounded-xl border border-border bg-card2/60 p-4"><div class="font-spaceGrotesk text-xl font-extrabold text-textMain">'+(withExtra.months!=null?'~'+withExtra.months+' เดือน':'∞')+'</div><div class="mt-1 text-xs font-bold text-textMuted">ปลดหนี้</div></div></div>';
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
    if(mobileDebtView&&debtSheetList){
      var monthPay=d.minPay+extraForThis;
      var debtLogo=getCreditLogoMeta(d.cr);
      if(isTop){
        var focus=document.createElement('section');
        focus.className='rounded-2xl border border-primary/25 bg-gradient-to-br from-primaryContainer/20 to-surfaceLow p-5 shadow-xl';
        focus.innerHTML='<div class="mb-3 inline-flex items-center gap-2 rounded-full bg-green/15 px-3 py-1 text-xs font-extrabold text-green"><span class="material-symbols-outlined text-base">bolt</span> แนะนำเดือนนี้</div>'+
          '<div class="font-spaceGrotesk text-xl font-extrabold text-textMain">หนี้ที่ควรเร่งโปะเดือนนี้</div>'+
          '<div class="mt-2 text-sm font-bold text-textMuted">'+esc(d.cr.n)+'</div>'+
          '<div class="mt-3 font-spaceGrotesk text-4xl font-extrabold text-primary">฿ '+fmt(monthPay)+'<small class="ml-1 text-sm text-textMuted">/ เดือน</small></div>'+
          '<button class="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primaryContainer px-4 py-3 text-sm font-bold text-white shadow-lg shadow-primaryContainer/25" type="button" onclick="openDebtOrderSheet()">ดูลำดับการชำระหนี้ทั้งหมด <span class="material-symbols-outlined text-base">arrow_forward</span></button>';
        resultsWrap.appendChild(focus);
      }
      var premiumRow=document.createElement('article');
      premiumRow.className='flex items-center gap-3 rounded-2xl border border-white/10 bg-surfaceLow/90 p-4 shadow-xl'+(isTop?' border-green/35 bg-green/10':'');
      premiumRow.innerHTML='<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-card2 font-spaceGrotesk text-sm font-extrabold text-textMain">'+(idx+1)+'</div>'+
        (d.cr.t==='revolving'?'<div class="inline-flex h-[42px] w-[42px] min-w-[42px] items-center justify-center rounded-xl border border-white/15 text-xs font-black tracking-wide text-white shadow-lg" style="background-color:'+esc(debtLogo.color)+'">'+esc(debtLogo.label)+'</div>':'<span class="material-symbols-outlined flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl border border-border bg-card2 text-primary">'+debtMaterialIcon(d.cr)+'</span>')+
        '<div class="min-w-0 flex-1"><strong class="block truncate text-sm font-extrabold text-textMain">'+esc(d.cr.n)+'</strong><small class="mt-1 block text-xs font-bold text-textMuted">'+(extraForThis>0?'จ่ายขั้นต่ำ + โปะพิเศษ':'จ่ายขั้นต่ำตามแผน')+'</small></div>'+
        '<div class="text-right"><strong class="block font-spaceGrotesk text-base font-extrabold text-primary">฿ '+fmt(monthPay)+'</strong><small class="text-xs text-textMuted">/ เดือน</small></div>'+
        '<span class="material-symbols-outlined text-green">'+(isTop?'verified':'schedule')+'</span>';
      debtSheetList.appendChild(premiumRow);
      return;
    }
    var row=document.createElement('div'); row.className='flex flex-wrap items-start gap-3 border-b border-white/10 p-5 last:border-b-0 md:p-7'+(isTop?' border-l-4 border-l-green bg-green/5':'');
    var rankDiv=document.createElement('div'); rankDiv.className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card2 font-spaceGrotesk text-sm font-extrabold text-textMain'; rankDiv.textContent=idx+1;
    var body=document.createElement('div'); body.className='min-w-0 flex-1';
    var fixedBadge=isFixed(d)?'<span class="ml-2 inline-flex rounded-full border border-primary/30 bg-primaryContainer/15 px-2 py-0.5 text-[10px] font-bold text-primary">Fixed</span>':'';
    body.innerHTML='<div class="flex min-w-0 items-center gap-3"><span class="material-symbols-outlined flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-card2 text-primary">'+debtMaterialIcon(d.cr)+'</span><div class="min-w-0"><div class="truncate text-base font-extrabold text-textMain">'+esc(d.cr.n)+fixedBadge+'</div><div class="mt-1 text-xs font-bold text-textMuted">ดอก '+(d.rate||0)+'%/ปี · ขั้นต่ำ ฿ '+fmt(d.minPay)+(isFixed(d)?' · จ่ายตามกำหนด ไม่สามารถโปะได้':'')+'</div>'+(extraForThis>0?'<span class="mt-2 inline-flex rounded-full bg-green/15 px-2 py-1 text-xs font-bold text-green">โปะเพิ่ม ฿ '+fmt(extraForThis)+'</span>':'')+'</div></div>';
    var right=document.createElement('div'); right.className='ml-auto text-right';
    right.innerHTML='<div class="font-spaceGrotesk text-xl font-extrabold text-textMain">฿ '+fmt2(d.remaining)+'</div><div class="mt-1 text-xs font-bold text-textMuted">'+(moLeft!=null?'~'+moLeft+' เดือน':'ยังไม่ทราบ')+'</div>';
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
    '<div class="mb-5 rounded-2xl border border-white/10 bg-surfaceLow/80 p-5 shadow-xl backdrop-blur-xl">'+
      '<div class="mb-4 flex items-center justify-between font-inter text-xs font-extrabold uppercase tracking-[.14em] text-textMuted">'+t('monthlyIncomeGoal')+' <span class="material-symbols-outlined text-green">flag</span></div>'+
      '<div class="mb-3 font-spaceGrotesk text-3xl font-bold text-green">฿ '+fmt(incTotal)+' <span class="text-base text-textMuted">/ ฿ '+fmt(goal)+'</span></div>'+
      '<div class="h-2 overflow-hidden rounded-full bg-card2"><div class="h-full rounded-full bg-green" style="width:'+pct+'%"></div></div>'+
      '<div class="mt-2 flex items-center justify-between gap-3 text-xs font-bold text-textMuted"><span>'+pct+'% '+t('achieved')+'</span><span>฿ '+fmt(remain)+' '+t('remaining')+'</span></div>'+
    '</div>'+
    '<div class="rounded-2xl border border-white/10 bg-surfaceLow/80 p-5 shadow-xl backdrop-blur-xl">'+
      '<div class="mb-4 flex items-center justify-between font-inter text-xs font-extrabold uppercase tracking-[.14em] text-textMuted">'+t('recentInflows')+' <span class="text-green">'+t('viewAll')+'</span></div>'+
      '<div class="flex flex-col gap-3" data-inc-recent-list></div>'+
    '</div>';
  var list=w.querySelector('[data-inc-recent-list]');
  if(!recent.length){
    list.innerHTML='<div class="rounded-xl border border-dashed border-border bg-card2/40 p-4 text-sm leading-6 text-textMuted">ยังไม่มีรายรับ</div>';
    return;
  }
  recent.forEach(function(i){
    var row=document.createElement('div');
    row.className='flex items-center justify-between gap-3 rounded-xl border border-border bg-card2/60 p-3';
    row.innerHTML='<div class="flex min-w-0 items-center gap-3">'+
      '<span class="material-symbols-outlined flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green/15 text-green">'+iconFor(i.category)+'</span>'+
      '<div class="min-w-0"><div class="truncate font-notoThai text-sm font-bold text-textMain">'+esc(i.detail||i.receiver||'รายรับ')+'</div>'+
      '<div class="truncate text-xs font-semibold text-textMuted">'+esc(dLabel(i.date))+' • '+esc(i.category||'-')+'</div></div>'+
      '</div><div class="shrink-0 font-spaceGrotesk text-sm font-bold text-green">+ ฿ '+fmt(i.amount)+'</div>';
    list.appendChild(row);
  });
  applyLanguage();
}

// ═══════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════
var df='mo';
var currentMobileDashView='summary';
function setDF(f,el){ currentDashTimeFilter=f==='all'?'all_time':'this_month'; if(el) el.classList.add('on'); renderDash(); }
function dashMonthKey(add){
  var n=new Date();
  var d=new Date(n.getFullYear(),n.getMonth()+add,1);
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');
}
function setDashTimeFilter(f){ currentDashTimeFilter=f; renderDash(); }
function setDashUserFilter(f){ currentDashUserFilter=f; renderDash(); }
function switchMobileDashView(view){
  currentMobileDashView=view||'summary';
  var pg=document.getElementById('pg-dash');
  if(pg) pg.dataset.mobileDashView=currentMobileDashView;
  document.querySelectorAll('[data-mobile-dash-tab]').forEach(function(btn){
    var active=btn.dataset.mobileDashTab===currentMobileDashView;
    btn.classList.toggle('on',active);
    btn.classList.toggle('bg-primaryContainer',active);
    btn.classList.toggle('text-white',active);
    btn.classList.toggle('shadow-sm',active);
    btn.classList.toggle('text-textMuted',!active);
  });
  document.querySelectorAll('#dash [data-mobile-views]').forEach(function(sec){
    var show=String(sec.dataset.mobileViews||'').split(/\s+/).indexOf(currentMobileDashView)>-1;
    if(window.matchMedia('(max-width:768px)').matches) sec.classList.toggle('hidden',!show);
    else sec.classList.remove('hidden');
  });
  if(currentMobileDashView==='analysis'&&dashCategoryChart&&typeof dashCategoryChart.resize==='function'){
    setTimeout(function(){ dashCategoryChart.resize(); },0);
  }
}
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
  document.querySelectorAll('[data-dash-time]').forEach(function(b){
    var active=b.dataset.dashTime===currentDashTimeFilter;
    b.classList.toggle('on',active);
    b.classList.toggle('border-primaryContainer',active);
    b.classList.toggle('bg-primaryContainer/20',active);
    b.classList.toggle('text-primary',active);
    b.classList.toggle('text-textMuted',!active);
  });
  var wrap=document.getElementById('dash-entity-filters'); if(!wrap) return;
  var members=dashEntityMembers();
  var baseBtn='rounded-full border border-border bg-card2 px-4 py-2 font-inter text-xs font-bold text-textMuted transition';
  var html='<span class="mr-2 font-inter text-xs font-extrabold uppercase tracking-[.14em] text-textMuted">'+t('view')+'</span><button class="'+baseBtn+'" type="button" data-dash-user="joint" onclick="setDashUserFilter(\'joint\')">'+t('jointFamily')+'</button>';
  var mobileUser=document.getElementById('mobile-dash-user-filter');
  var mobileHtml='<option value="joint">'+t('jointFamily')+'</option>';
  members.forEach(function(m){
    var val=(S.user&&m.id===S.user.id)?'me':m.id;
    var label=(S.user&&m.id===S.user.id)?t('me'):m.name;
    html+='<button class="'+baseBtn+'" type="button" data-dash-user="'+esc(val)+'" onclick="setDashUserFilter(\''+esc(val)+'\')">'+esc(label)+'</button>';
    mobileHtml+='<option value="'+esc(val)+'">'+esc(label)+'</option>';
  });
  wrap.innerHTML=html;
  wrap.querySelectorAll('[data-dash-user]').forEach(function(b){
    var active=b.dataset.dashUser===currentDashUserFilter;
    b.classList.toggle('on',active);
    b.classList.toggle('border-primaryContainer',active);
    b.classList.toggle('bg-primaryContainer/20',active);
    b.classList.toggle('text-primary',active);
    b.classList.toggle('text-textMuted',!active);
  });
  var mobileTime=document.getElementById('mobile-dash-time-filter');
  if(mobileTime) mobileTime.value=currentDashTimeFilter;
  if(mobileUser){
    mobileUser.innerHTML=mobileHtml;
    mobileUser.value=currentDashUserFilter;
  }
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
function updateMobileDashBento(values){
  var ids={net:'mobile-dash-net',income:'mobile-dash-income',outflow:'mobile-dash-outflow',debt:'mobile-dash-debt'};
  Object.keys(values||{}).forEach(function(key){
    var el=document.getElementById(ids[key]);
    if(el) el.textContent=values[key];
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
  if(!cats.length) return '<div class="rounded-xl border border-dashed border-border bg-card2/40 p-4 text-sm leading-6 text-textMuted">ยังไม่ได้ตั้งค่างบประมาณรายเดือน</div>';
  return cats.map(function(k){
    var budget=Number(budgets[k]||0), used=Number(totals[k]||0), pct=budget?Math.round(used/budget*100):0;
    var tone=pct>=100?'danger':pct>=80?'warn':'ok';
    var color=tone==='danger'?'bg-danger':tone==='warn'?'bg-warning':'bg-green';
    return '<div class="rounded-xl border border-border bg-card2/60 p-4">'+
      '<div class="mb-3 flex items-center justify-between gap-3"><div class="min-w-0"><strong class="block truncate text-sm font-bold text-textMain">'+esc(categoryLabelFromId(k))+'</strong><span class="text-xs font-semibold text-textMuted">'+fmt(used)+' / '+fmt(budget)+' ฿</span></div><em class="shrink-0 text-xs font-bold text-textMuted not-italic">'+pct+'%</em></div>'+
      '<div class="h-2 overflow-hidden rounded-full bg-surfaceHigh"><i class="block h-full rounded-full '+color+'" style="width:'+Math.min(100,pct)+'%"></i></div>'+
    '</div>';
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
  var creditPaymentItems=filterDashRows(S.credits||[]);
  var entityUser=currentDashUserFilter==='me'&&S.user?S.user.id:currentDashUserFilter;
  var entityExpenses=currentDashUserFilter==='joint'?S.expenses.slice():S.expenses.filter(function(e){ return String(e.user_id||'')===String(entityUser); });
  var entityIncomes=currentDashUserFilter==='joint'?S.incomes.slice():S.incomes.filter(function(i){ return String(i.user_id||'')===String(entityUser); });
  var entityCredits=currentDashUserFilter==='joint'?(S.credits||[]).slice():(S.credits||[]).filter(function(c){ return String(c.user_id||'')===String(entityUser); });
  var expenseTotal=items.reduce(function(s,e){ return s+Number(e.amount||0); },0);
  var creditPaymentTotal=creditPaymentItems.reduce(function(s,c){ return s+Number(c.amount||0); },0);
  var tot=expenseTotal+creditPaymentTotal;
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
  updateMobileDashBento({
    net:'฿ '+fmt2(net),
    income:'฿ '+fmt(incMo),
    outflow:'฿ '+fmt(tot),
    debt:'฿ '+fmt(debtTotal)
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
    exp+=entityCredits.filter(function(c){ return c.date&&c.date.slice(0,7)===m; }).reduce(function(s,c){ return s+Number(c.amount||0); },0);
    var inc=entityIncomes.filter(function(i){ return i.date&&i.date.slice(0,7)===m; }).reduce(function(s,i){ return s+Number(i.amount||0); },0);
    maxChart=Math.max(maxChart,exp,inc);
    return {m:m,exp:exp,inc:inc};
  });
  var chartHtml=chart.map(function(x,idx){
    var label=thaiMo(x.m).split(' ')[0];
    var incH=Math.max(4,Math.round(x.inc/maxChart*100));
    var expH=Math.max(4,Math.round(x.exp/maxChart*100));
    return '<div class="flex flex-1 flex-col items-center gap-2"><div class="flex h-56 items-end justify-center gap-1"><span class="w-8 rounded-t bg-primary/70 transition" style="height:'+incH+'%"></span><span class="w-8 rounded-t bg-danger/60 transition" style="height:'+expH+'%"></span></div><div class="text-xs font-bold '+(idx===chart.length-1?'text-primary':'text-textMuted')+'">'+label+'</div></div>';
  }).join('');
  var calMo=mo, calItems=entityExpenses.filter(function(e){ return e.date&&e.date.slice(0,7)===calMo; }), dayTotals={};
  calItems.forEach(function(e){ dayTotals[e.date]=(dayTotals[e.date]||0)+Number(e.amount||0); });
  var yr=parseInt(calMo.split('-')[0]), mnth=parseInt(calMo.split('-')[1])-1, firstDay=new Date(yr,mnth,1).getDay(), daysInMonth=new Date(yr,mnth+1,0).getDate();
  var maxDay=Math.max(1,Object.keys(dayTotals).reduce(function(m,d){ return Math.max(m,dayTotals[d]); },0));
  var calHtml='';
  for(var ei=0;ei<firstDay;ei++) calHtml+='<span class="aspect-square rounded-xl"></span>';
  for(var dd=1;dd<=daysInMonth;dd++){
    var ds=calMo+'-'+String(dd).padStart(2,'0'), v=dayTotals[ds]||0, lvl=v?Math.max(1,Math.ceil(v/maxDay*4)):0;
    var calTone=['bg-card2/70 text-textMuted','bg-primary/20 text-primary','bg-primary/35 text-primary','bg-primary/55 text-white','bg-primary/80 text-white'][lvl];
    calHtml+='<button type="button" class="aspect-square rounded-xl text-xs font-bold transition hover:ring-2 hover:ring-primary/40 '+calTone+'" title="'+ds+' ฿ '+fmt(v)+'">'+dd+'</button>';
  }
  var recentExp=items.map(function(e){ return {type:'exp',date:e.date,detail:e.detail,cat:e.category,person:e.paidBy,amount:e.amount,icon:dashCatIcon(e.category)}; });
  var recentInc=incomeItems.map(function(i){ return {type:'inc',date:i.date,detail:i.detail||'รายรับ',cat:i.category||'Income',person:i.receiver||'SYS',amount:i.amount,icon:'payments'}; });
  var recent=recentExp.concat(recentInc).sort(function(a,b){ return String(b.date||'').localeCompare(String(a.date||'')); }).slice(0,5);
  var recentHtml=recent.length?recent.map(function(r){
    return '<tr class="border-b border-white/10 last:border-0"><td class="py-3 pr-3"><div class="flex min-w-0 items-center gap-3"><span class="material-symbols-outlined flex h-10 w-10 shrink-0 items-center justify-center rounded-xl '+(r.type==='inc'?'bg-green/15 text-green':'bg-primaryContainer/20 text-primary')+'">'+r.icon+'</span><div class="min-w-0"><strong class="block truncate text-sm font-bold text-textMain">'+esc(r.detail||'-')+'</strong><small class="text-xs font-semibold text-textMuted">'+dashDate(r.date)+'</small></div></div></td><td class="py-3 pr-3 text-sm text-textMuted">'+esc(r.cat||'-')+'</td><td class="py-3 pr-3"><span class="inline-flex rounded-full border border-border bg-card2 px-2 py-1 text-xs font-bold text-textMuted">'+esc((r.person||'SYS').slice(0,3))+'</span></td><td class="py-3 text-right font-spaceGrotesk text-sm font-bold '+(r.type==='inc'?'text-green':'text-danger')+'">'+(r.type==='inc'?'+':'-')+' ฿ '+fmt2(r.amount)+'</td></tr>';
  }).join(''):'<tr><td colspan="4" class="py-8 text-center text-sm text-textMuted">ยังไม่มีรายการ</td></tr>';
  w.innerHTML='<div class="grid grid-cols-12 gap-5">'+
    '<section class="col-span-12 rounded-2xl border border-white/10 bg-gradient-to-br from-primaryContainer/20 to-surfaceLow p-5 shadow-xl backdrop-blur-xl lg:col-span-6" data-mobile-views="summary"><div><span class="font-inter text-xs font-extrabold uppercase tracking-[.16em] text-textMuted">'+t('monthlyNetBalance')+'</span><strong class="mt-3 block font-spaceGrotesk text-4xl font-bold text-textMain md:text-5xl">฿ '+fmt2(net)+'</strong><small class="mt-4 flex items-center gap-2 text-sm font-bold '+(net>=0?'text-green':'text-danger')+'"><span class="material-symbols-outlined text-lg">trending_up</span> '+t('incomeLabel')+' ฿ '+fmt(incMo)+' · '+t('expenseLabel')+' ฿ '+fmt(tot)+'</small></div></section>'+
    '<section class="col-span-12 rounded-2xl border border-white/10 bg-surfaceLow/80 p-5 shadow-xl backdrop-blur-xl sm:col-span-6 lg:col-span-3" data-mobile-views="summary"><span class="font-inter text-xs font-extrabold uppercase tracking-[.16em] text-textMuted">'+t('totalDebt')+'</span><strong class="mt-3 block font-spaceGrotesk text-3xl font-bold text-textMain">฿ '+fmt(debtTotal)+'</strong><div class="mt-5 h-2 overflow-hidden rounded-full bg-card2"><i class="block h-full rounded-full bg-warning" style="width:'+debtPct+'%"></i></div><small class="mt-2 block text-xs font-bold text-textMuted">'+t('useLimit')+' '+debtPct+'%</small></section>'+
    '<section class="col-span-12 rounded-2xl border border-white/10 bg-surfaceLow/80 p-5 shadow-xl backdrop-blur-xl sm:col-span-6 lg:col-span-3" data-mobile-views="summary"><span class="font-inter text-xs font-extrabold uppercase tracking-[.16em] text-textMuted">'+t('projectedInterestSavings')+'</span><strong class="mt-3 block font-spaceGrotesk text-3xl font-bold text-green">฿ '+fmt(projectedSave)+'</strong><small class="mt-5 flex items-center gap-2 text-sm font-bold text-green"><span class="material-symbols-outlined text-lg">auto_awesome</span> '+(getLang()==='th'?'ด้วยแผนชำระเร่งด่วน':'with an accelerated plan')+'</small></section>'+
    '<section class="col-span-12 rounded-2xl border border-white/10 bg-surfaceLow/80 p-5 shadow-xl backdrop-blur-xl" data-mobile-views="budget"><div class="mb-5 flex items-center justify-between gap-3"><h2 class="font-spaceGrotesk text-xl font-bold text-textMain">'+t('budgetProgress')+'</h2><span class="text-xs font-bold text-textMuted">'+t('budgetThisMonth')+'</span></div><div class="grid gap-3">'+budgetProgressHtml(items)+'</div></section>'+
    '<section class="col-span-12 rounded-2xl border border-white/10 bg-surfaceLow/80 p-5 shadow-xl backdrop-blur-xl lg:col-span-8" data-mobile-views="summary analysis"><div class="mb-5 flex items-center justify-between gap-3"><h2 class="font-spaceGrotesk text-xl font-bold text-textMain">'+t('financialHealth')+'</h2><button class="text-xs font-bold text-primary" type="button" onclick="goTab(\'hist\',document.querySelector(\'.tbtn[onclick*=hist]\'))">'+t('viewDetails')+'</button></div><div class="flex h-72 items-end gap-3 border-b border-border px-2">'+chartHtml+'</div><div class="mt-5 flex justify-center gap-6 text-xs font-bold text-textMuted"><span class="flex items-center gap-2"><i class="h-3 w-3 rounded-full bg-primary/70"></i>รายได้</span><span class="flex items-center gap-2"><i class="h-3 w-3 rounded-full bg-danger/60"></i>รายจ่าย</span></div></section>'+
    '<section class="col-span-12 rounded-2xl border border-white/10 bg-surfaceLow/80 p-5 shadow-xl backdrop-blur-xl lg:col-span-4" data-mobile-views="analysis"><div class="mb-5 flex items-center justify-between gap-3"><h2 class="font-spaceGrotesk text-xl font-bold text-textMain">'+t('expenseByCategory')+'</h2><span class="text-xs font-bold text-textMuted">'+t('category')+'</span></div><div class="relative h-72"><canvas id="dash-category-chart"></canvas></div></section>'+
    '<section class="col-span-12 rounded-2xl border border-white/10 bg-surfaceLow/80 p-5 shadow-xl backdrop-blur-xl lg:col-span-4" data-mobile-views="analysis"><div class="mb-5 flex items-center justify-between gap-3"><h2 class="font-spaceGrotesk text-xl font-bold text-textMain">'+t('dailyCalendar')+'</h2><span class="text-xs font-bold text-textMuted">'+thaiMo(calMo)+'</span></div><div class="mb-2 grid grid-cols-7 gap-2 text-center text-xs font-bold text-textMuted"><span>อา</span><span>จ</span><span>อ</span><span>พ</span><span>พฤ</span><span>ศ</span><span>ส</span></div><div class="grid grid-cols-7 gap-2">'+calHtml+'</div><div class="mt-5 flex items-center justify-center gap-2 text-xs font-bold text-textMuted"><span>'+t('less')+'</span><i class="h-3 w-3 rounded bg-card2/70"></i><i class="h-3 w-3 rounded bg-primary/20"></i><i class="h-3 w-3 rounded bg-primary/35"></i><i class="h-3 w-3 rounded bg-primary/55"></i><i class="h-3 w-3 rounded bg-primary/80"></i><span>'+t('more')+'</span></div></section>'+
    '<section class="col-span-12 rounded-2xl border border-white/10 bg-surfaceLow/80 p-5 shadow-xl backdrop-blur-xl" data-mobile-views="recent"><div class="mb-5 flex items-center justify-between gap-3"><h2 class="font-spaceGrotesk text-xl font-bold text-textMain">'+t('recentTransactions')+'</h2><button class="flex items-center gap-1 text-xs font-bold text-primary" type="button" onclick="goTab(\'hist\',document.querySelector(\'.tbtn[onclick*=hist]\'))">'+t('viewAll')+' <span class="material-symbols-outlined text-base">arrow_forward</span></button></div><div class="overflow-x-auto"><table class="w-full min-w-[640px] border-collapse text-left"><thead><tr class="border-b border-border text-xs font-bold text-textMuted"><th class="py-2 pr-3">รายการ</th><th class="py-2 pr-3">'+t('category')+'</th><th class="py-2 pr-3">ผู้ทำรายการ</th><th class="py-2 text-right">'+t('amount')+'</th></tr></thead><tbody>'+recentHtml+'</tbody></table></div></section>'+
  '</div>';
  applyLanguage();
  renderDashCategoryChart(items);
  switchMobileDashView(currentMobileDashView);

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
  var g=document.createElement('div'); g.className='mb-3 grid grid-cols-2 gap-2';
  function sb(n,nc,lbl){ var b=document.createElement('div'); b.className='rounded-xl border border-border bg-card2 p-3 text-center text-textMain'; b.innerHTML='<div class="font-spaceGrotesk text-lg font-extrabold '+(nc==='g'?'text-green':'text-textMain')+'">'+n+'</div><div class="mt-1 text-xs font-bold text-textMuted">'+lbl+'</div>'; return b; }
  g.appendChild(sb(S.expenses.length,'','รายจ่ายทั้งหมด'));
  g.appendChild(sb(S.incomes.length,'g','รายรับทั้งหมด'));
  g.appendChild(sb('฿ '+fmt(expMo.reduce(function(s,e){ return s+e.amount; },0)),'','รายจ่ายเดือนนี้'));
  g.appendChild(sb('฿ '+fmt(incMo.reduce(function(s,i){ return s+i.amount; },0)),'g','รายรับเดือนนี้'));
  w.appendChild(g);
  var cBox=document.createElement('div'); cBox.className='rounded-xl border border-warning/25 bg-warning/10 p-3 text-center';
  cBox.innerHTML='<div class="text-sm font-bold text-warning">ชำระสินเชื่อเดือนนี้ ฿ '+fmt(crPaid)+'</div>';
  w.appendChild(cBox);
}
function memberInitials(name){
  name=String(name||'').trim();
  if(!name) return 'BX';
  var parts=name.split(/\s+/).filter(Boolean);
  return parts.slice(0,2).map(function(p){ return p.charAt(0).toUpperCase(); }).join('');
}
function setTextIfExists(selectorOrEl,text){
  var el=typeof selectorOrEl==='string'?document.querySelector(selectorOrEl):selectorOrEl;
  if(el) el.textContent=text==null?'':String(text);
}
function setHTMLIfExists(selectorOrEl,html){
  var el=typeof selectorOrEl==='string'?document.querySelector(selectorOrEl):selectorOrEl;
  if(el) el.innerHTML=html==null?'':String(html);
}
function renderProfileAvatar(target,profile){
  var el=typeof target==='string'?document.querySelector(target):target;
  if(!el) return;
  var name=profile&&profile.full_name?profile.full_name:'';
  var avatarUrl=profile&&profile.avatar_url?profile.avatar_url:S.avatarData;
  if(avatarUrl){
    setHTMLIfExists(el,'<img class="h-full w-full rounded-[inherit] object-cover" alt="Profile" src="'+esc(avatarUrl)+'">');
  }else{
    setTextIfExists(el,name||memberInitials(name));
  }
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
async function uploadProfileAvatar(input){
  var file=input&&input.files&&input.files[0];
  if(!file) return;
  try{
    if(!S.user||!S.profile) return toast('ไม่พบโปรไฟล์','err');
    if(!/^image\//i.test(file.type||'')) return toast('กรุณาเลือกไฟล์รูปภาพ','err');
    if(file.size>2*1024*1024) return toast('รูปภาพต้องมีขนาดไม่เกิน 2MB','err');
    var extByType={'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/gif':'gif'};
    var ext=extByType[String(file.type||'').toLowerCase()];
    if(!ext) return toast('รองรับไฟล์ JPG, PNG, WEBP หรือ GIF เท่านั้น','err');
    var path=S.user.id+'/avatar-'+Date.now()+'.'+ext;
    var uploaded=await sb.storage.from('avatars').upload(path,file,{upsert:true,contentType:file.type});
    if(uploaded.error) throw uploaded.error;
    var publicRes=sb.storage.from('avatars').getPublicUrl(path);
    var publicUrl=publicRes&&publicRes.data&&publicRes.data.publicUrl;
    if(!publicUrl) throw new Error('missing avatar public URL');
    var saved=await sb.from('profiles').update({avatar_url:publicUrl,updated_at:new Date().toISOString()}).eq('id',S.user.id);
    if(saved.error) return toast('บันทึกรูปโปรไฟล์ไม่สำเร็จ','err');
    S.profile.avatar_url=publicUrl;
    renderV4Settings();
    updateHeader();
    toast('อัปเดตรูปโปรไฟล์แล้ว','ok');
  }catch(e){
    console.error('avatar upload failed:',e);
    toast('อัปโหลดรูปไม่สำเร็จ กรุณาตรวจสอบ Storage Bucket avatars','err');
  }finally{
    if(input) input.value='';
  }
}
function bindMobileAvatarUploader(){
  var input=document.getElementById('user-avatar-uploader');
  if(!input||input.dataset.bound==='1') return;
  input.dataset.bound='1';
  input.addEventListener('change',function(){ uploadProfileAvatar(input); });
}
function renderLineOaToggle(){
  var toggle=document.getElementById('line-oa-toggle');
  if(!toggle) return;
  var enabled=localStorage.getItem('lineOaEnabled')==='true';
  toggle.classList.toggle('on',enabled);
  toggle.setAttribute('aria-pressed',enabled?'true':'false');
}
function bindLineOaToggle(){
  var toggle=document.getElementById('line-oa-toggle');
  if(!toggle) return;
  renderLineOaToggle();
  if(toggle.dataset.bound==='1') return;
  toggle.dataset.bound='1';
  toggle.addEventListener('click',function(){
    var enabled=localStorage.getItem('lineOaEnabled')!=='true';
    localStorage.setItem('lineOaEnabled',enabled?'true':'false');
    renderLineOaToggle();
    toast(enabled?'เปิดการเชื่อมต่อ LINE OA แล้ว':'ปิดการเชื่อมต่อ LINE OA แล้ว','ok');
  });
}
function copyFamilyIdValue(value){
  var fid=String((S.profile&&S.profile.family_id)||value||((document.getElementById('family-id-view')||{}).value||'')).trim();
  if(!fid) return toast('ยังไม่มี Family ID','err');
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(fid).then(function(){ toast('คัดลอก Family ID แล้ว','ok'); }).catch(function(){ copyFamilyIdFallback(fid); });
  }else{
    copyFamilyIdFallback(fid);
  }
}
function copyFamilyId(){
  copyFamilyIdValue();
}
function copyFamilyIdFallback(fid){
  var input=document.getElementById('account-family-id-view')||document.getElementById('family-id-view');
  if(input&&typeof input.select==='function'){
    input.value=fid;
    input.focus();
    input.select();
    input.setSelectionRange(0,fid.length);
    try{
      if(document.execCommand&&document.execCommand('copy')) return toast('คัดลอก Family ID แล้ว','ok');
    }catch(e){}
  }
  toast('คัดลอกไม่สำเร็จ','err');
}
function renderFamilyMembersList(targetId){
  var el=document.getElementById(targetId);
  if(!el) return;
  var members=(S.familyMembers||[]).slice();
  if(!members.length&&S.profile) members=[S.profile];
  else if(S.profile&&S.profile.full_name&&!members.some(function(m){ return m.id===S.profile.id||m.full_name===S.profile.full_name; })) members.unshift(S.profile);
  setHTMLIfExists(el,members.length?members.map(function(m,idx){
    var name=m.full_name||m.name||m.email||m.id||'Member';
    var isCurrent=!!(S.user&&m.id===S.user.id);
    var avatarUrl=m.avatar_url||(isCurrent&&S.profile&&S.profile.avatar_url)||'';
    var avatar=avatarUrl?'<img class="h-full w-full rounded-[inherit] object-cover" alt="" src="'+esc(avatarUrl)+'">':esc(memberInitials(name));
    return '<div class="flex items-center gap-3.5 rounded-xl border border-white/10 bg-surfaceLow p-3.5"><span class="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primaryContainer text-xs font-black text-primary">'+avatar+'</span><div class="min-w-0 flex-1"><strong class="block truncate text-sm font-bold text-textMain">'+esc(name)+'</strong><small class="mt-0.5 block text-xs text-textMuted">'+t(isCurrent?'adminOwner':'member')+'</small></div><em class="rounded-lg bg-green/15 px-2 py-1 text-[11px] not-italic text-green">'+(isCurrent?'คุณ':t('fullAccess'))+'</em></div>';
  }).join(''):'<div class="flex items-center gap-3.5 rounded-xl border border-white/10 bg-surfaceLow p-3.5"><span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primaryContainer text-xs font-black text-primary">BX</span><div class="min-w-0 flex-1"><strong class="block text-sm font-bold text-textMain">ยังไม่มีสมาชิก</strong><small class="mt-0.5 block text-xs text-textMuted">เชื่อมครอบครัวเพื่อแสดงสมาชิก</small></div></div>');
}
function renderAccountFamilyMobile(){
  var root=document.getElementById('account-family-mobile');
  if(!root) return;
  bindLineOaToggle();
  var profileName=S.profile&&S.profile.full_name?S.profile.full_name:(S.user&&S.user.email?S.user.email:'BridgeX Member');
  setTextIfExists(root.querySelector('#account-family-name'),profileName);
  renderProfileAvatar(root.querySelector('#account-family-avatar'),S.profile);
  setTextIfExists(root.querySelector('#account-family-status'),tierLabel());
  var familyEl=root.querySelector('#account-family-id-view');
  if(familyEl){
    if('value' in familyEl) familyEl.value=(S.profile&&S.profile.family_id)||'';
    else setTextIfExists(familyEl,(S.profile&&S.profile.family_id)||'-');
  }
  renderFamilyMembersList('account-family-members-list');
}
async function joinFamilyMobile(){
  var mobileInput=document.getElementById('account-family-join-id');
  var desktopInput=document.getElementById('join-family-id');
  var fid=mobileInput?mobileInput.value.trim():'';
  if(!fid) return toast('กรอก family_id ก่อน','err');
  if(!desktopInput) return toast('ไม่พบช่องเชื่อมครอบครัว','err');
  desktopInput.value=fid;
  await joinFamily();
  if(!desktopInput.value) mobileInput.value='';
}
function renderBudgetSettings(){
  var w=document.getElementById('budget-settings'); if(!w) return;
  var budgets=(S.profile&&S.profile.monthly_budgets)||{};
  var cats=(S.cats&&S.cats.length?S.cats:DEF_CATS);
  w.innerHTML=cats.map(function(c){
    return '<label class="mb-2 grid grid-cols-[1fr_130px] items-center gap-2.5"><span class="text-sm font-extrabold text-textMain">'+esc(c.l)+'</span><input class="w-full rounded-xl border border-border bg-card2 px-3 py-2.5 font-mono text-sm text-textMain outline-none placeholder:text-subtle" type="number" min="0" step="1" data-budget-cat="'+esc(c.id)+'" value="'+(Number(budgets[c.id]||0)||'')+'" placeholder="0"></label>';
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
var activeMobileBudgetCat='';
function mobileBudgetCats(){
  return S.cats&&S.cats.length?S.cats:DEF_CATS;
}
function renderMobileBudgetManager(){
  var summary=document.getElementById('mobile-budget-summary');
  var grid=document.getElementById('mobile-budget-grid');
  if(!summary||!grid) return;
  var budgets=(S.profile&&S.profile.monthly_budgets)||{};
  var total=Object.keys(budgets).reduce(function(sum,key){ return sum+Number(budgets[key]||0); },0);
  var spent=(S.expenses||[]).filter(function(e){
    return e.date&&e.date.slice(0,7)===thisMo();
  }).reduce(function(sum,e){ return sum+Number(e.amount||0); },0);
  var remaining=Math.max(0,total-spent);
  var pct=total?Math.min(100,Math.round(spent/total*100)):0;
  var tone=pct>=100?'bg-danger':pct>=80?'bg-warning':'bg-green';
  summary.innerHTML='<span class="block text-xs font-extrabold uppercase tracking-[.12em] text-textMuted">งบประมาณรวมรายเดือน</span><strong class="mt-3 block font-spaceGrotesk text-4xl font-extrabold text-textMain">฿ '+fmt(total)+'</strong><small class="mt-2 block text-sm font-bold text-textMuted">ใช้ไป ฿ '+fmt(spent)+' · คงเหลือ ฿ '+fmt(remaining)+'</small><div class="mt-5 h-2.5 overflow-hidden rounded-full bg-card2"><i class="block h-full rounded-full '+tone+'" style="width:'+pct+'%"></i></div><em class="mt-2 block text-right text-xs not-italic font-extrabold text-textMuted">'+pct+'%</em>';
  grid.innerHTML=mobileBudgetCats().map(function(c){
    var icon=addCatIconMap[c.id]||'category';
    return '<button type="button" class="min-w-0 rounded-2xl border border-white/10 bg-surfaceLow/80 p-4 text-left shadow-lg" data-mobile-budget-cat="'+esc(c.id)+'"><span class="material-symbols-outlined mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primaryContainer/20 text-primary">'+icon+'</span><strong class="block truncate text-sm font-extrabold text-textMain">'+esc(c.l)+'</strong><small class="mt-1 block text-sm font-bold text-textMuted">฿ '+fmt(Number(budgets[c.id]||0))+'</small></button>';
  }).join('')+'<button type="button" class="min-w-0 rounded-2xl border border-dashed border-white/15 bg-surfaceLow/40 p-4 text-left opacity-60" disabled><span class="material-symbols-outlined mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-card2 text-textMuted">add</span><strong class="block truncate text-sm font-extrabold text-textMain">เพิ่มหมวดหมู่</strong><small class="mt-1 block text-sm font-bold text-textMuted">เร็ว ๆ นี้</small></button>';
  grid.querySelectorAll('[data-mobile-budget-cat]').forEach(function(btn){
    btn.onclick=function(){ openMobileBudgetEditor(btn.dataset.mobileBudgetCat); };
  });
}
function openBudgetManager(){
  if(!window.matchMedia('(max-width:768px)').matches) return;
  document.querySelectorAll('.pg').forEach(function(p){ p.classList.remove('on'); });
  var page=document.getElementById('pg-budget-mobile');
  if(page) page.classList.add('on');
  var title=document.getElementById('topbar-title');
  if(title) title.textContent='งบประมาณ';
  renderMobileBudgetManager();
}
function closeBudgetManager(){
  closeMobileBudgetEditor();
  goTab('set');
}
function openMobileBudgetEditor(catId){
  var cat=mobileBudgetCats().find(function(c){ return c.id===catId; });
  if(!cat) return;
  activeMobileBudgetCat=catId;
  var budgets=(S.profile&&S.profile.monthly_budgets)||{};
  document.getElementById('mobile-budget-edit-icon').textContent=addCatIconMap[catId]||'category';
  document.getElementById('mobile-budget-edit-name').textContent=cat.l;
  document.getElementById('mobile-budget-amount').value=Number(budgets[catId]||0)||'';
  var editor=document.getElementById('mobile-budget-editor');
  if(editor){
    editor.classList.add('on','flex');
    editor.classList.remove('hidden');
  }
}
function closeMobileBudgetEditor(){
  var editor=document.getElementById('mobile-budget-editor');
  if(editor){
    editor.classList.remove('on','flex');
    editor.classList.add('hidden');
  }
  activeMobileBudgetCat='';
}
function mobileBudgetEditorBg(e){
  if(e&&e.target&&e.target.id==='mobile-budget-editor') closeMobileBudgetEditor();
}
async function saveMobileBudget(){
  if(!activeMobileBudgetCat||!S.user||!S.profile) return toast('ไม่พบโปรไฟล์','err');
  var amount=Number(document.getElementById('mobile-budget-amount').value||0);
  if(!Number.isFinite(amount)||amount<0) return toast('กรอกงบประมาณให้ถูกต้อง','err');
  var budgets=Object.assign({},S.profile.monthly_budgets||{});
  if(amount>0) budgets[activeMobileBudgetCat]=amount;
  else delete budgets[activeMobileBudgetCat];
  try{
    var res=await sb.from('profiles').update({monthly_budgets:budgets,updated_at:new Date().toISOString()}).eq('id',S.user.id);
    if(res.error) throw res.error;
    S.profile.monthly_budgets=budgets;
    closeMobileBudgetEditor();
    renderMobileBudgetManager();
    renderBudgetSettings();
    toast('บันทึกงบประมาณแล้ว','ok');
  }catch(e){
    console.error('save mobile budgets failed:',e);
    toast('บันทึกงบประมาณไม่สำเร็จ','err');
  }
}
function renderV4Settings(){
  applyLanguage();
  updateHeader();
  bindMobileAvatarUploader();
  renderBudgetSettings();
  var profileName=S.profile&&S.profile.full_name?S.profile.full_name:(S.user&&S.user.email?S.user.email:'BridgeX Member');
  setTextIfExists(document.getElementById('set-profile-name'),profileName);
  setTextIfExists(document.getElementById('set-user'),S.user?S.user.email:'');
  renderProfileAvatar('#pg-set .set-grid .set-avatar',S.profile);
  renderProfileAvatar('#pg-set .set-hub .set-avatar',S.profile);
  setTextIfExists('#pg-set .set-hub .set-hub-name',profileName);
  var sub=document.getElementById('set-subscription');
  if(sub) sub.innerHTML='<div class="mb-2 flex items-center gap-2">'+subscriptionBadge()+'</div><div>สถานะ: '+(S.hasAccess?'ใช้งานได้':'ถูกล็อก')+'</div><div>Trial หมดอายุ: '+(S.profile&&S.profile.trial_end?new Date(S.profile.trial_end).toLocaleDateString('th-TH'):'-')+'</div>';
  var fam=document.getElementById('family-id-view');
  if(fam) fam.value=(S.profile&&S.profile.family_id)||'';
  renderFamilyMembersList('set-members-list');
  renderAccountFamilyMobile();
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
function applyTheme(theme){
  var isLight=theme==='light';
  document.body.classList.toggle('light',isLight);
  document.body.classList.toggle('theme-light',isLight);
  document.body.dataset.theme=isLight?'light':'dark';
  var btn=document.getElementById('theme-btn');
  if(btn) btn.textContent=isLight?'☀️':'🌙';
  document.querySelectorAll('[data-theme-choice]').forEach(function(choice){
    var active=choice.dataset.themeChoice===(isLight?'light':'dark');
    choice.classList.toggle('on',active);
    choice.classList.toggle('bg-primaryContainer',active);
    choice.classList.toggle('text-white',active);
    choice.classList.toggle('shadow-lg',active);
    choice.classList.toggle('shadow-primaryContainer/25',active);
    choice.classList.toggle('text-textMuted',!active);
  });
}
function setTheme(theme){
  theme=theme==='light'?'light':'dark';
  localStorage.setItem('theme',theme);
  localStorage.setItem('themeManual','1');
  applyTheme(theme);
}
function toggleTheme(){
  setTheme(document.body.classList.contains('theme-light')?'dark':'light');
}
function initTheme(){
  var saved=localStorage.getItem('themeManual')==='1'?(localStorage.getItem('theme')||'light'):'light';
  applyTheme(saved==='light'?'light':'dark');
}
// Call initTheme early
(function(){ initTheme(); })();
