// ═══════════════════════════════════════════════════════
// SUPABASE CONFIG
// ═══════════════════════════════════════════════════════
window.SUPA_URL = 'https://ahnbgcnydlquvondssoy.supabase.co';
var SUPA_URL = window.SUPA_URL;

window.SUPA_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFobmJnY255ZGxxdXZvbmRzc295Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxODYxNDksImV4cCI6MjA5Mzc2MjE0OX0.G0jZjEFxgLBO_kJAG0IxVzpf5QnsV32Ja8p_ZHlMF-M';
var SUPA_ANON = window.SUPA_ANON;

window.sb = supabase.createClient(window.SUPA_URL, window.SUPA_ANON);
var sb = window.sb;

window.I18N = {
  th: {
    dashboard:'ภาพรวมการเงิน', debtPlanner:'แผนปลดหนี้', credit:'บัตรและสินเชื่อ',
    addTransaction:'จดรายจ่าย', income:'จดรายรับ', history:'ประวัติย้อนหลัง', settings:'ตั้งค่า',
    monthlyNetBalance:'เงินเหลือใช้เดือนนี้', totalDebt:'หนี้สินรวม', projectedInterestSavings:'ประหยัดดอกเบี้ยได้',
    recentTransactions:'รายการล่าสุด', amount:'จำนวนเงิน', category:'หมวดหมู่', paymentMethod:'จ่ายผ่าน',
    depositTo:'รับเงินเข้าบัญชี', note:'บันทึกช่วยจำ', saveTransaction:'บันทึกรายการ',
    saveIncome:'บันทึกรายรับ', incomeSource:'ที่มาของรายรับ', date:'วันที่', cancel:'ยกเลิก',
    totalApprovedLimit:'วงเงินทั้งหมด', utilizationRate:'ใช้งบวงเงินไปแล้ว', availableCredit:'วงเงินคงเหลือ',
    jointWealthMode:'แชร์บัญชีครอบครัว', syncNow:'อัปเดตข้อมูล', exportData:'ดาวน์โหลดข้อมูล',
    todaySummary:'สรุปรายการวันนี้', totalSpentToday:'ใช้จ่ายวันนี้', activeLines:'รายการสินเชื่อ',
    support:'ช่วยเหลือ', signOut:'ออกจากระบบ', settingsIntro:'จัดการบัญชี ความปลอดภัย และการแชร์ข้อมูลครอบครัว',
    familyHelp:'จัดการสมาชิกและข้อมูลการเงินที่แชร์ร่วมกัน', preferences:'การตั้งค่าทั่วไป',
    theme:'ธีม', appearance:'รูปแบบหน้าจอ', language:'ภาษา', selectCategory:'เลือกหมวดหมู่',
    selectPayment:'เลือกช่องทางจ่ายเงิน', paid:'จ่ายแล้ว', due:'ยังไม่จ่าย', currentBalance:'ยอดคงเหลือ',
    editInfo:'แก้ไขข้อมูล', payBill:'ชำระเงิน', paidThisMonth:'ชำระเดือนนี้',
    healthyStatus:'ใช้งานพอดี', watchStatus:'ใกล้เต็มวงเงิน', highUsage:'ใช้วงเงินสูง',
    budgetProgress:'ติดตามงบประมาณ', budgetThisMonth:'งบเดือนนี้', financialHealth:'สุขภาพทางการเงินของคุณ',
    viewDetails:'ดูรายละเอียด', expenseByCategory:'รายจ่ายตามหมวดหมู่', viewAll:'ดูทั้งหมด',
    monthlyIncomeGoal:'เป้ารายรับเดือนนี้', recentInflows:'รายรับล่าสุด', achieved:'สำเร็จแล้ว', remaining:'เหลืออีก',
    incomeLabel:'รายรับ', expenseLabel:'รายจ่าย', useLimit:'ใช้วงเงิน', dailyBudget:'ของงบวันนี้',
    dailyCalendar:'ปฏิทินรายจ่ายรายวัน', less:'น้อย', more:'มาก', member:'สมาชิกครอบครัว',
    fullAccess:'เข้าถึงได้ทั้งหมด', adminOwner:'ผู้ดูแลบัญชี', creditPaidMonth:'ชำระสินเชื่อเดือนนี้',
    selectIncomeCategory:'เลือกหมวดรายรับ', selectIncomeChannel:'เลือกรับเงินเข้าบัญชี',
    selectCreditType:'เลือกประเภทสินเชื่อ', selectProvider:'เลือกผู้ให้บริการ', selectPrimaryCard:'เลือกบัตรหลัก',
    dashboardHeading:'สรุปภาพรวมการเงิน', dashboardIntro:'ดูข้อมูลล่าสุดและติดตามสุขภาพการเงินของคุณได้ง่าย ๆ',
    currentPlan:'แพ็กเกจปัจจุบัน', managePlan:'จัดการแพ็กเกจ', primaryContact:'ข้อมูลติดต่อหลัก',
    connection:'การเชื่อมต่อ', addMember:'เพิ่มสมาชิก', realtimeSync:'อัปเดตข้อมูลทันที',
    transactionAlerts:'แจ้งเตือนรายการ', baseCurrency:'สกุลเงินหลัก', dataSecurity:'ความปลอดภัยของข้อมูล',
    period:'ช่วงเวลา', view:'มุมมอง', thisMonth:'เดือนนี้', lastMonth:'เดือนก่อน', all:'ทั้งหมด',
    joint:'รวม', jointFamily:'รวมครอบครัว', me:'ฉัน', overview:'ภาพรวม', revolving:'สินเชื่อหมุนเวียน', secured:'สินเชื่อหลักประกัน'
  },
  en: {
    dashboard:'Dashboard', debtPlanner:'Debt Planner', credit:'Credit', addTransaction:'Add Transaction',
    income:'Income', history:'History', settings:'Settings', monthlyNetBalance:'Monthly Net Balance',
    totalDebt:'Total Debt', projectedInterestSavings:'Projected Interest Savings', recentTransactions:'Recent Transactions',
    amount:'Amount', category:'Category', paymentMethod:'Payment Method', depositTo:'Deposit To', note:'Note',
    saveTransaction:'Save Transaction', saveIncome:'Save Income', incomeSource:'Income Source', date:'Date', cancel:'Cancel',
    totalApprovedLimit:'Total Approved Limit', utilizationRate:'Utilization Rate', availableCredit:'Available Credit',
    jointWealthMode:'Joint Wealth Mode', syncNow:'Sync Now', exportData:'Export Data', todaySummary:"Today's Summary",
    totalSpentToday:'Total Spent Today', activeLines:'Active Lines', support:'Support', signOut:'Sign Out',
    settingsIntro:'Manage your preferences, security, and joint wealth configurations.',
    familyHelp:'Manage shared portfolios and member access levels.', preferences:'Preferences', theme:'Theme',
    appearance:'Application appearance', language:'Language', selectCategory:'Select Category',
    selectPayment:'Select Payment Method', paid:'Paid', due:'Due', currentBalance:'Current Balance',
    editInfo:'Edit Info', payBill:'Pay Bill', paidThisMonth:'paid this month', healthyStatus:'Healthy Status',
    watchStatus:'Watch Status', highUsage:'High Usage', budgetProgress:'Budget Progress', budgetThisMonth:'Monthly Budget',
    financialHealth:'Your Financial Health', viewDetails:'View Details', expenseByCategory:'Expenses by Category',
    viewAll:'View All', monthlyIncomeGoal:'Monthly Income Goal', recentInflows:'Recent Inflows', achieved:'Achieved', remaining:'Remaining',
    incomeLabel:'Income', expenseLabel:'Expense', useLimit:'Credit used', dailyBudget:'of daily budget',
    dailyCalendar:'Daily Expense Calendar', less:'Less', more:'More', member:'Family Member',
    fullAccess:'Full Access', adminOwner:'Admin (Owner)', creditPaidMonth:'Credit paid this month',
    selectIncomeCategory:'Select Income Category', selectIncomeChannel:'Select Deposit Account',
    selectCreditType:'Select Credit Type', selectProvider:'Select Provider', selectPrimaryCard:'Select Primary Card',
    dashboardHeading:'Wealth Overview', dashboardIntro:'See your latest figures and track your financial health.',
    currentPlan:'Current Plan', managePlan:'Manage Subscription', primaryContact:'Primary Contact',
    connection:'Connection', addMember:'Add Member', realtimeSync:'Real-Time Sync',
    transactionAlerts:'Transaction Alerts', baseCurrency:'Base Currency', dataSecurity:'Security & Data',
    period:'Period', view:'View', thisMonth:'This Month', lastMonth:'Last Month', all:'All',
    joint:'Joint', jointFamily:'Family', me:'Me', overview:'Overview', revolving:'Revolving', secured:'Secured'
  }
};
var I18N = window.I18N;

// ═══════════════════════════════════════════════════════
// DEFAULT DATA
// ═══════════════════════════════════════════════════════
window.DEF_CATS = [
  {id:'food',l:'อาหาร',c:'#f59e0b'},{id:'drink',l:'เครื่องดื่ม',c:'#3b82f6'},
  {id:'snack',l:'ขนม',c:'#f97316'},{id:'buffet',l:'บุฟเฟ่ต์',c:'#fb923c'},
  {id:'cat',l:'สัตว์เลี้ยง',c:'#fb923c'},
  {id:'shop',l:'ช้อปปิ้ง',c:'#ec4899'},{id:'act',l:'กิจกรรม',c:'#10b981'},
  {id:'trans',l:'การเดินทาง',c:'#8b5cf6'},{id:'place',l:'สถานที่',c:'#64748b'},
  {id:'inv',l:'การลงทุน',c:'#06b6d4'},{id:'health',l:'สุขภาพ',c:'#22d3ee'},
  {id:'bill',l:'บิล',c:'#6366f1'},{id:'edu',l:'การศึกษา',c:'#0ea5e9'},
  {id:'donate',l:'การบริจาค',c:'#14b8a6'},{id:'travel',l:'ท่องเที่ยว',c:'#f43f5e'},
  {id:'fam',l:'ให้ครอบครัว',c:'#a855f7'},{id:'other',l:'อื่นๆ',c:'#78716c'}
];
var DEF_CATS = window.DEF_CATS;

window.DEF_PAYS = [
  {id:'cash',l:'เงินสด'},{id:'xfer',l:'โอนเงิน'}
];
var DEF_PAYS = window.DEF_PAYS;

window.DEF_INCC = [
  {id:'sal',l:'เงินเดือน',c:'#22c98a'},{id:'bon',l:'โบนัส',c:'#f5a623'},
  {id:'free',l:'ฟรีแลนซ์',c:'#4d9ef5'},{id:'inv',l:'ลงทุน',c:'#7c6ef5'},
  {id:'oth',l:'อื่นๆ',c:'#6b7280'}
];
var DEF_INCC = window.DEF_INCC;

window.DEF_INCH = [
  {id:'bank',l:'โอนเข้าบัญชี'},{id:'cash',l:'รับเงินสด'},{id:'prompt',l:'พร้อมเพย์'}
];
var DEF_INCH = window.DEF_INCH;

window.BASE_CR = [
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
var BASE_CR = window.BASE_CR;

window.BANK_BRANDS = {
  kbank:{code:'004',color:'#138f2d',nice_name:'Kasikorn Bank',label:'KB'},
  scb:{code:'014',color:'#4e2e7f',nice_name:'Siam Commercial Bank',label:'SCB'},
  bbl:{code:'002',color:'#1e4598',nice_name:'Bangkok Bank',label:'BBL'},
  ktb:{code:'006',color:'#1ba5e1',nice_name:'Krungthai Bank',label:'KTB'},
  bay:{code:'025',color:'#fec43b',nice_name:'Bank of Ayudhya (Krungsri)',label:'BAY'},
  gsb:{code:'030',color:'#eb198d',nice_name:'Government Savings Bank',label:'GSB'},
  ghb:{code:'033',color:'#f57d23',nice_name:'Government Housing Bank',label:'GHB'},
  baac:{code:'034',color:'#4b9b1d',nice_name:'Bank for Agriculture and Agricultural Cooperatives',label:'BAAC'},
  ttb:{code:'076',color:'#ecf0f1',nice_name:'TMBThanachart Bank',label:'TTB'},
  uob:{code:'024',color:'#0b3979',nice_name:'United Overseas Bank (Thai)',label:'UOB'},
  cimb:{code:'022',color:'#7e2f36',nice_name:'CIMB Thai Bank',label:'CIMB'},
  tisco:{code:'067',color:'#12549f',nice_name:'Tisco Bank',label:'TISCO'},
  kk:{code:'069',color:'#199cc5',nice_name:'Kiatnakin Bank',label:'KK'},
  lh:{code:'073',color:'#6d6e71',nice_name:'Land and Houses Bank',label:'LH'},
  ktc:{code:'006',color:'#1ba5e1',nice_name:'KTC',label:'KTC'},
  aeon:{code:'',color:'#7461CF',nice_name:'AEON',label:'AEON'},
  cardx:{code:'014',color:'#4e2e7f',nice_name:'CardX',label:'CX'},
  umay:{code:'',color:'#DE2B68',nice_name:'Umay+',label:'UM'},
  shopee:{code:'',color:'#FF6201',nice_name:'SPayLater',label:'SPay'},
  linebk:{code:'',color:'#00B900',nice_name:'LINE BK',label:'LINE'},
  firstchoice:{code:'025',color:'#fec43b',nice_name:'First Choice',label:'FC'},
  true:{code:'',color:'#EE252B',nice_name:'True Pay Later',label:'TRUE'},
  lazpay:{code:'',color:'#101F8C',nice_name:'Laz Pay Later',label:'Laz'},
  tiktokpay:{code:'',color:'#111111',nice_name:'TikTok Pay Later',label:'TT'}
};
var BANK_BRANDS = window.BANK_BRANDS;

window.PAY2CR = {
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
var PAY2CR = window.PAY2CR;

window.FIXED_CREDIT_PROVIDERS = ['สินเชื่อจำนำ','สินเชื่อรถยนต์','สินเชื่อรถจักรยานยนต์','สินเชื่อที่อยู่อาศัย','สินเชื่ออื่นๆ'];
var FIXED_CREDIT_PROVIDERS = window.FIXED_CREDIT_PROVIDERS;

// ═══════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════
function readConfigLS(key, fallback){
  try {
    var raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch(e) {
    return fallback;
  }
}
function mergeConfigById(saved, defs){
  var out = Array.isArray(saved) ? saved.slice() : [];
  var idxMap = {};
  out.forEach(function(x,i){ if(x&&x.id) idxMap[x.id]=i; });
  defs.forEach(function(x){
    if(idxMap[x.id]!==undefined){
      out[idxMap[x.id]].l = x.l;
      if(x.c) out[idxMap[x.id]].c = x.c;
    } else {
      out.push(x);
    }
  });
  return out;
}

window.S = {
  user: null,
  profile: null,
  hasAccess: false,
  accessReason: '',
  familyMembers: [],
  avatarData: localStorage.getItem('setAvatar')||'',
  expenses: [],
  incomes: [],
  credits: [],
  crInfo: readConfigLS('crInfo',{}),
  crStatus: readConfigLS('crStatus',{}),
  customCr: readConfigLS('customCr',[]),
  cats: mergeConfigById(readConfigLS('cats',null), window.DEF_CATS),
  pays: window.DEF_PAYS.slice(),
  incc: mergeConfigById(readConfigLS('incc',null), window.DEF_INCC),
  inch: mergeConfigById(readConfigLS('inch',null), window.DEF_INCH),
  fc:{cat:'',pay:'',payer:''},
  fi:{cat:'',ch:'',rcv:''},
  hf:'all', df:'mo', crf:'overview',
  strategy:'avalanche', extraCash:1000,
  activeCr:'', activeInfo:''
};
var S = window.S;
