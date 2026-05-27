// ═══════════════════════════════════════════════════════
// PURE HELPERS
// ═══════════════════════════════════════════════════════
function today(){
  var d = new Date();
  return d.getFullYear() + '-' +
    String(d.getMonth()+1).padStart(2,'0') + '-' +
    String(d.getDate()).padStart(2,'0');
}
window.today = today;

function thisMo(){ return today().slice(0,7); }
window.thisMo = thisMo;

function fmt(n){ return Number(n||0).toLocaleString('th-TH',{maximumFractionDigits:0}); }
window.fmt = fmt;

function fmt2(n){ return Number(n||0).toLocaleString('th-TH',{minimumFractionDigits:2,maximumFractionDigits:2}); }
window.fmt2 = fmt2;

function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
window.esc = esc;

function cleanLabel(s){ return String(s||'').replace(/^[^\wก-๙]+/u,'').trim(); }
window.cleanLabel = cleanLabel;

function validYMD(d){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(String(d||''))) return false;
  var p=String(d).split('-').map(Number);
  var x=new Date(p[0],p[1]-1,p[2]);
  return x.getFullYear()===p[0]&&x.getMonth()===p[1]-1&&x.getDate()===p[2];
}
window.validYMD = validYMD;

function thaiMo(mo){
  var TM=['','ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
  var p=mo.split('-'); return TM[parseInt(p[1])]+' '+p[0];
}
window.thaiMo = thaiMo;

function validCreatedTime(v){
  if(!v) return 0;
  var t=new Date(v).getTime();
  if(!Number.isFinite(t)) return 0;
  if(t>Date.now()+86400000) return 0;
  return t;
}
window.validCreatedTime = validCreatedTime;

function makeRowId(){
  return Date.now()*1000 + Math.floor(Math.random()*1000);
}
window.makeRowId = makeRowId;

function makeUUID(){
  if(window.crypto&&crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){
    var r=Math.random()*16|0,v=c==='x'?r:(r&0x3|0x8);
    return v.toString(16);
  });
}
window.makeUUID = makeUUID;

function daysLeft(dateStr){
  if(!dateStr) return 0;
  return Math.max(0,Math.ceil((new Date(dateStr).getTime()-Date.now())/86400000));
}
window.daysLeft = daysLeft;

function parseEMVAmount(qrText){
  qrText=String(qrText||'');
  var m=qrText.match(/5403(\d+\.?\d*)/);
  if(m&&m[1]){
    var a=parseFloat(m[1]);
    return Number.isFinite(a)?a:null;
  }
  m=qrText.match(/54(\d{2})(\d[\d.]*)/);
  if(m&&m[1]&&m[2]){
    var len=parseInt(m[1],10);
    var raw=m[2].slice(0,len);
    var amt=parseFloat(raw);
    return Number.isFinite(amt)?amt:null;
  }
  return null;
}
window.parseEMVAmount = parseEMVAmount;

function normalizeSlipText(text){
  var thaiDigits={'๐':'0','๑':'1','๒':'2','๓':'3','๔':'4','๕':'5','๖':'6','๗':'7','๘':'8','๙':'9'};
  return String(text||'').replace(/[๐-๙]/g,function(d){ return thaiDigits[d]||d; }).replace(/\s+/g,' ').trim();
}
window.normalizeSlipText = normalizeSlipText;

function parseAmountFromText(text){
  text=normalizeSlipText(text);
  var patterns=[
    /(?:จำนวนเงิน|จํานวนเงิน|ยอดเงิน|ยอดโอน|ยอดสุทธิ|ยอดรวม|รวมทั้งสิ้น)[^\d]*(\d[\d,]*\.?\d{0,2})/i,
    /(?:total|net amount|amount due|amount)[^\d]*(\d[\d,]*\.?\d{0,2})/i,
    /(?:฿|THB|บาท)[^\d]*(\d[\d,]*\.?\d{0,2})/i,
    /(\d{1,6}\.\d{2})/
  ];
  for(var i=0;i<patterns.length;i++){
    var m=text.match(patterns[i]);
    if(m&&m[1]){
      var amt=parseFloat(String(m[1]).replace(/,/g,''));
      if(Number.isFinite(amt)&&amt>0) return amt;
    }
  }
  return null;
}
window.parseAmountFromText = parseAmountFromText;

function parseDateFromText(text){
  text=normalizeSlipText(text);
  var monthMap={
    'ม.ค.':1,'มค':1,'มกราคม':1,
    'ก.พ.':2,'กพ':2,'กุมภาพันธ์':2,
    'มี.ค.':3,'มีค':3,'มีนาคม':3,
    'เม.ย.':4,'เมย':4,'เมษายน':4,
    'พ.ค.':5,'พค':5,'พฤษภาคม':5,
    'มิ.ย.':6,'มิย':6,'มิถุนายน':6,
    'ก.ค.':7,'กค':7,'กรกฎาคม':7,
    'ส.ค.':8,'สค':8,'สิงหาคม':8,
    'ก.ย.':9,'กย':9,'กันยายน':9,
    'ต.ค.':10,'ตค':10,'ตุลาคม':10,
    'พ.ย.':11,'พย':11,'พฤศจิกายน':11,
    'ธ.ค.':12,'ธค':12,'ธันวาคม':12
  };
  function cleanMonth(s){ return String(s||'').replace(/\s+/g,'').replace(/\.?$/,''); }
  function toDate(y,m,d){
    y=Number(y); m=Number(m); d=Number(d);
    if(y>2400) y-=543;
    if(y<100) y+=2000;
    var dt=new Date(y,m-1,d);
    if(dt.getFullYear()!==y||dt.getMonth()!==m-1||dt.getDate()!==d) return null;
    return y+'-'+String(m).padStart(2,'0')+'-'+String(d).padStart(2,'0');
  }
  var labels=['วันที่ทำรายการ','โอนเงินสำเร็จ','วันเวลา','วันที่'];
  var scopes=[text];
  labels.forEach(function(label){
    var idx=text.indexOf(label);
    if(idx>=0) scopes.unshift(text.slice(idx,idx+90));
  });
  var monthPattern='(ม\\.ค\\.|มกราคม|ก\\.พ\\.|กุมภาพันธ์|มี\\.ค\\.|มีนาคม|เม\\.ย\\.|เมษายน|พ\\.ค\\.|พฤษภาคม|มิ\\.ย\\.|มิถุนายน|ก\\.ค\\.|กรกฎาคม|ส\\.ค\\.|สิงหาคม|ก\\.ย\\.|กันยายน|ต\\.ค\\.|ตุลาคม|พ\\.ย\\.|พฤศจิกายน|ธ\\.ค\\.|ธันวาคม|มค|กพ|มีค|เมย|พค|มิย|กค|สค|กย|ตค|พย|ธค)';
  for(var i=0;i<scopes.length;i++){
    var s=scopes[i];
    var m=s.match(new RegExp('(\\d{1,2})\\s*'+monthPattern+'\\s*(\\d{4})','i'));
    if(m){
      var mo=monthMap[m[2]]||monthMap[cleanMonth(m[2])]||monthMap[cleanMonth(m[2]).replace(/\./g,'')];
      var out=toDate(m[3],mo,m[1]);
      if(out) return out;
    }
    m=s.match(/(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})/);
    if(m){
      var out2=toDate(m[3],m[2],m[1]);
      if(out2) return out2;
    }
  }
  return null;
}
window.parseDateFromText = parseDateFromText;

function parseSlipTextAmount(text){ return parseAmountFromText(text); }
window.parseSlipTextAmount = parseSlipTextAmount;

function parseSlipDataFromText(text){
  return {amount:parseAmountFromText(text),date:parseDateFromText(text),text:text};
}
window.parseSlipDataFromText = parseSlipDataFromText;

function isBankSlipText(text){
  text=normalizeSlipText(text);
  return /ธนาคาร|โอนเงิน|โอนสำเร็จ|รายการสำเร็จ|เลขที่รายการ|พร้อมเพย์|SCB|KBank|K\s*PLUS|Krungthai|KTB|BBL|Bangkok\s*Bank|Krungsri|GSB|ttb|CIMB|UOB|BAAC/i.test(text);
}
window.isBankSlipText = isBankSlipText;

// ═══════════════════════════════════════════════════════
// SMALL UI HELPERS
// ═══════════════════════════════════════════════════════
function toast(msg,type){
  var t=document.getElementById('toast');
  if(!t) return;
  t.textContent=msg; t.className='toast on'+(type?' '+type:'');
  clearTimeout(t._t); t._t=setTimeout(function(){ t.classList.remove('on'); },2800);
}
window.toast = toast;

function setDot(state,txt){
  var d=document.getElementById('sdot'),l=document.getElementById('slbl');
  if(!d||!l) return;
  d.className='sdot'+(state==='spin'?' spin':state==='off'?' off':'');
  l.textContent=txt;
}
window.setDot = setDot;

function trimLimit(v,max,label){
  var s=String(v||'').trim();
  if(s.length>max){ toast(label+'ยาวเกิน '+max+' ตัวอักษร','err'); return null; }
  return s;
}
window.trimLimit = trimLimit;

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
window.validateTxnInput = validateTxnInput;
