/* Boost and Gears: interactive engine guide */
new MutationObserver(()=>{for(const c of document.querySelectorAll('.stack td:not([data-l])')){let i=0,p=c;while(p=p.previousElementSibling)i+=p.colSpan;const h=c.closest('table').rows[0].cells[i];if(!h)continue;const s=[...h.children].find(x=>getComputedStyle(x).display!=='none');c.dataset.l=(s||h).textContent}}).observe(document,{childList:true,subtree:true});
{
const $=id=>document.getElementById(id);
const NS='http://www.w3.org/2000/svg';
let L='en';
try{const s=localStorage.getItem('bg-lang');if(s==='ar'||s==='en')L=s;}catch(e){}
const T=o=>o==null?'':(typeof o==='string'?o:o[L]);
const nf=n=>Math.round(n).toLocaleString('en-US');
const mk=(p,t,a)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);p.appendChild(e);return e;};
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
let playing=!reduce;
const mixC=(a,b,t)=>'rgb('+a.map((v,i)=>Math.round(v+(b[i]-v)*Math.max(0,Math.min(1,t)))).join(',')+')';

/* ---------- hero engine ---------- */
const cx=[270,350,430,510],ph=[0,Math.PI,Math.PI,0];
const gas=[],pis=[],rod=[],pin=[];
cx.forEach(x=>{mk($('hcyl'),'rect',{x:x-25,y:232,width:50,height:110,rx:3,fill:'none',stroke:'#fff','stroke-opacity':.85});gas.push(mk($('hcyl'),'rect',{x:x-24,y:233,width:48,height:20,fill:'#41e0c8','fill-opacity':.3}));});
cx.forEach(x=>{rod.push(mk($('hmov'),'line',{stroke:'#9fb0d6','stroke-width':4,'stroke-linecap':'round'}));pis.push(mk($('hmov'),'rect',{x:x-22,width:44,height:22,rx:3,fill:'#c8d2ec'}));pin.push(mk($('hmov'),'circle',{r:4,fill:'#4a5b8c'}));});
let hType='roots',th=0,fo={},B=0,byp=false;
function heroModel(){
  const r=+$('hRpm').value,f=r/6500,t=$('hThr').value/100;
  $('hRpmV').textContent=nf(r);$('hThrV').textContent=$('hThr').value+'%';
  const base=hType==='roots'?.75+.25*f:hType==='twin'?.8+.2*f:f*f;
  byp=t<.35;
  B=byp?.04:base*(.3+.7*t);
  const eff=hType==='roots'?1.25:hType==='twin'?1:.85;
  const hp=byp?1+2*f:(3+38*f*B)*eff;
  const bar=B*.7;
  $('hB').textContent=bar.toFixed(2)+' bar';
  $('hV').textContent=byp?T({en:'Open',ar:'مفتوح'}):T({en:'Closed',ar:'مغلق'});
  $('hP').textContent=nf(hp)+' hp';
  $('hA').textContent=nf(100*(1.013+bar)/1.013)+'%';
  $('fByp').setAttribute('opacity',byp?1:0);
  $('hbv').setAttribute('fill',byp?'#ff7a45':'#9fb0d6');$('hbv').setAttribute('stroke',byp?'#ff7a45':'#9fb0d6');
  $('fHot').setAttribute('stroke-width',(1.5+2.5*B).toFixed(1));
  $('fCool').setAttribute('stroke-width',(1.5+3.5*B).toFixed(1));
  $('fRun').setAttribute('stroke-width',(1.5+3*B).toFixed(1));
  $('htb').setAttribute('transform','rotate('+(90*t)+' 590 140)');
}
function heroDraw(){
  cx.forEach((x,i)=>{const c=Math.cos(th+ph[i]),s=Math.sin(th+ph[i]);const y=277-23*c;
    pis[i].setAttribute('y',y.toFixed(1));gas[i].setAttribute('height',Math.max(1,y-233).toFixed(1));gas[i].setAttribute('fill-opacity',(.12+.6*B).toFixed(2));
    const px=x+23*s,py=372-23*c;pin[i].setAttribute('cx',px.toFixed(1));pin[i].setAttribute('cy',py.toFixed(1));
    rod[i].setAttribute('x1',x);rod[i].setAttribute('y1',(y+20).toFixed(1));rod[i].setAttribute('x2',px.toFixed(1));rod[i].setAttribute('y2',py.toFixed(1));});
  const d=th*180/Math.PI;
  $('hcp').setAttribute('transform','rotate('+d+')');
  $('hsp').setAttribute('transform','rotate('+(d*1.7)+')');
  $('hbelt').setAttribute('stroke-dashoffset',(-th*24).toFixed(1));
  $('hrl').setAttribute('transform','rotate('+(-d*1.7)+')');$('hrr').setAttribute('transform','rotate('+(d*1.7)+')');
  $('hs1').setAttribute('stroke-dashoffset',(-th*12).toFixed(1));$('hs2').setAttribute('stroke-dashoffset',(th*12).toFixed(1));
  $('hci').setAttribute('transform','rotate('+(d*5)+')');
  ['fIn','fHot','fByp','fCool','fRun','fEx'].forEach(k=>$(k).setAttribute('stroke-dashoffset',(fo[k]||0).toFixed(1)));
}
function heroStep(dt){
  const r=+$('hRpm').value,f=r/6500,sp=40+160*f;
  th=(th+dt*r/60*2*Math.PI*.018)%(Math.PI*2000);
  const fw=(k,v)=>{fo[k]=((fo[k]||0)-dt*v)%1400;};
  fw('fIn',sp*(byp?.5:1));fw('fHot',sp*(.4+B));fw('fByp',sp);fw('fCool',sp*(byp?.3:.4+B));fw('fRun',sp*(byp?.3:.4+B));fw('fEx',sp*.9);
  heroDraw();
}
document.querySelectorAll('#hType button').forEach(b=>b.addEventListener('click',()=>{
  hType=b.dataset.t;document.querySelectorAll('#hType button').forEach(x=>x.classList.toggle('on',x===b));
  $('tRoots').setAttribute('display',hType==='roots'?'inline':'none');$('tTwin').setAttribute('display',hType==='twin'?'inline':'none');$('tCent').setAttribute('display',hType==='cent'?'inline':'none');
  heroModel();}));
$('hRpm').addEventListener('input',heroModel);$('hThr').addEventListener('input',heroModel);

/* ---------- supercharger type cards ---------- */
for(let x=-10;x<=300;x+=24){
  [[x,113,x+22,69],[x,121,x+22,165]].forEach(c=>mk($('stripes'),'line',{x1:c[0],y1:c[1],x2:c[2],y2:c[3],stroke:'#4b5563','stroke-width':3,'stroke-opacity':.55}));
}
const pockets=[];for(let i=0;i<4;i++)pockets.push(mk($('pk'),'circle',{cy:117,'fill-opacity':.85}));
let ta=0,td=0,ts=0,tp=0,ti=0,tc=0;
function typesModel(){
  const f=$('tRpm').value/6500;$('tRpmV').textContent=nf($('tRpm').value);
  $('tb1').style.width=Math.round(100*(.75+.25*f))+'%';$('tb2').style.width=Math.round(100*(.8+.2*f))+'%';$('tb3').style.width=Math.max(3,Math.round(100*f*f))+'%';
}
function typesDraw(){
  $('rotL').setAttribute('transform','rotate('+(-ta)+')');$('rotR').setAttribute('transform','rotate('+ta+')');
  $('ra1').setAttribute('stroke-dashoffset',td.toFixed(1));$('ra2').setAttribute('stroke-dashoffset',td.toFixed(1));
  $('stripes').setAttribute('transform','translate('+(ts%24).toFixed(1)+',0)');
  pockets.forEach((c,i)=>{const t=(tp+i/4)%1;c.setAttribute('cx',(70+t*185).toFixed(1));c.setAttribute('r',(15-8*t).toFixed(1));c.setAttribute('fill',mixC([91,141,239],[232,80,30],t));});
  $('imp').setAttribute('transform','rotate('+ti+')');$('cf').setAttribute('stroke-dashoffset',tc.toFixed(1));
}
function typesStep(dt){
  const f=$('tRpm').value/6500;
  ta=(ta+dt*(60+420*f))%360;td=(td-dt*(40+160*f))%1400;ts+=dt*(20+120*f);tp=(tp+dt*(.12+.6*f))%1;ti=(ti+dt*(200+1500*f))%360;tc=(tc-dt*(15+320*f*f))%1400;
  typesDraw();
}
$('tRpm').addEventListener('input',typesModel);

/* ---------- breathing calculator ---------- */
let ic=true,seed=7;const rnd=()=>(seed=seed*16807%2147483647)/2147483647;
const pts=[];for(let i=0;i<90;i++)pts.push([rnd(),rnd()]);
let calc={};
function calcModel(){
  const b=+$('cBoost').value,amb=+$('cAmb').value;
  $('cBoostV').textContent=b.toFixed(2).replace(/0$/,'')+' bar';$('cAmbV').textContent=amb+'°C';
  const T1=amb+273.15,PR=(1.013+b)/1.013;
  const T2=T1*(1+(Math.pow(PR,.2857)-1)/.72);
  const T3=ic?T2-.7*(T2-T1):T2;
  const ratio=PR*T1/T3;
  const base=100*(298/T1);
  const hp=base*(b>0?ratio*.95:1);
  calc={ratio,T2:T2-273.15,T3:T3-273.15};
  $('cRatio').textContent=(ratio>=1?'+':'')+nf((ratio-1)*100)+'%';
  $('cT2').textContent=nf(T2-273.15)+'°C';$('cT3').textContent=nf(T3-273.15)+'°C';$('cHp').textContent=nf(hp)+' hp';
  const k=$('cKnock');const hot=T3-273.15;
  k.innerHTML=hot>75?'<span class="pill-bad">'+T({en:'Knock risk high: the engine pulls ignition timing and power drops.',ar:'خطر الطرق عالٍ: يؤخّر المحرك الإشعال فتقل القوة.'})+'</span>':hot>55?'<span style="font-weight:600">'+T({en:'Warm charge: fine with 95-octane fuel.',ar:'هواء دافئ: لا مشكلة مع بنزين 95.'})+'</span>':'<span class="pill-ok">'+T({en:'Cool, dense charge: safe and strong.',ar:'هواء بارد وكثيف: آمن وقوي.'})+'</span>';
  const btn=$('cIc');btn.classList.toggle('on',ic);btn.setAttribute('aria-pressed',ic);
  btn.innerHTML=ic?'<span class="en">Intercooler on</span><span class="ar">الإنتركولر يعمل</span>':'<span class="en">Intercooler off</span><span class="ar">الإنتركولر متوقف</span>';
  drawCyl();
}
function drawCyl(){
  const s=$('cylSvg'),W=s.clientWidth,H=s.clientHeight;if(!W||!H)return;
  const cw=Math.min(150,(W-60)/2),top=46,bot=H-14,ch=bot-top;
  const xs=[W*.27-cw/2,W*.73-cw/2];
  const n0=30,n1=Math.round(30*(calc.ratio||1));
  const hotC=mixC([29,71,201],[232,80,30],((calc.T3||30)-30)/80);
  let h='';
  [[n0,'#7aa0ff',T({en:'No boost',ar:'بدون شحن'})+' · \u2066100%\u2069'],[n1,hotC,T({en:'Boosted',ar:'مع الشحن'})+' · \u2066'+nf(100*(calc.ratio||1))+'%\u2069']].forEach((c,j)=>{
    const x=xs[j];
    h+='<text x="'+(x+cw/2)+'" y="22" text-anchor="middle" direction="'+(L==='ar'?'rtl':'ltr')+'" font-size="15" font-weight="600" fill="var(--ink)">'+c[2]+'</text>';
    h+='<rect x="'+x+'" y="'+top+'" width="'+cw+'" height="'+ch+'" rx="6" fill="none" stroke="var(--ink)" stroke-width="2"/>';
    h+='<rect x="'+(x+4)+'" y="'+(bot-26)+'" width="'+(cw-8)+'" height="22" rx="3" fill="#b4bcc8"/>';
    for(let i=0;i<Math.min(c[0],90);i++){const p=pts[i];h+='<circle cx="'+(x+10+p[0]*(cw-20)).toFixed(1)+'" cy="'+(top+10+p[1]*(ch-46)).toFixed(1)+'" r="4.5" fill="'+c[1]+'"/>';}
  });
  s.innerHTML=h;
}
const roCyl=new ResizeObserver(drawCyl);roCyl.observe($('cylSvg'));
$('cBoost').addEventListener('input',calcModel);$('cAmb').addEventListener('input',calcModel);
$('cIc').addEventListener('click',()=>{ic=!ic;calcModel();});

/* ---------- lag race ---------- */
const lagF=()=>($('lagRpm').value-1000)/4000;
const turbo=(t,f,big)=>{const d=.12+.5*(1-f),tau=.2+.9*(1-f),tg=.9*Math.min(1,(big?.6:.55)+.6*f);return t<d?.02:.02+(tg-.02)*(1-Math.exp(-(t-d)/tau));};
const series=[
  {k:'na',c:'var(--steel)',n:{en:'No turbo (NA)',ar:'بدون شحن'},fn:()=>0},
  {k:'sc',c:'var(--heat)',n:{en:'Supercharger',ar:'سوبرتشارجر'},fn:(t,f)=>(.5+.1*f)*(1-Math.exp(-t/.08))},
  {k:'tu',c:'var(--blue)',n:{en:'Turbo',ar:'تيربو'},fn:(t,f)=>turbo(t,f,false)},
  {k:'tw',c:'#9b5de5',n:{en:'Twincharger',ar:'شحن مزدوج'},fn:(t,f)=>Math.max(.55*(1-Math.exp(-t/.08)),turbo(t,f,true))},
  {k:'et',c:'var(--ok)',n:{en:'Electric turbo',ar:'تيربو كهربائي'},fn:(t,f)=>{const tg=.9*Math.min(1,.85+.3*f);return t<.02?0:tg*(1-Math.exp(-(t-.02)/.15));}}
];
const vis={na:true,sc:true,tu:true,tw:false,et:true};
let lagP=1,lagStart=null;
function drawLag(){
  const s=$('lagSvg'),W=s.clientWidth,H=s.clientHeight;if(!W||!H)return;
  const ml=W<520?40:52,mr=14,mt=14,mb=34,pw=W-ml-mr,phh=H-mt-mb,f=lagF();
  const X=t=>ml+t/3*pw,Y=b=>mt+phh-b/1*phh;
  let h='';
  [0,.25,.5,.75,1].forEach((b,i)=>{if(W<520&&i%2)return;h+='<line x1="'+ml+'" x2="'+(W-mr)+'" y1="'+Y(b)+'" y2="'+Y(b)+'" stroke="var(--rule)"/><text x="'+(ml-6)+'" y="'+(Y(b)+5)+'" text-anchor="end" font-size="13" fill="var(--mute)">'+b+'</text>';});
  [0,.5,1,1.5,2,2.5,3].forEach((t,i)=>{if(W<520&&i%2)return;h+='<text x="'+X(t)+'" y="'+(H-12)+'" text-anchor="middle" font-size="13" fill="var(--mute)">'+t+' s</text>';});
  h+='<text x="'+(ml+4)+'" y="'+(mt+12)+'" font-size="13" fill="var(--mute)">bar</text>';
  h+='<line x1="'+ml+'" x2="'+(W-mr)+'" y1="'+Y(.5)+'" y2="'+Y(.5)+'" stroke="var(--mute)" stroke-dasharray="4 4"/>';
  series.forEach(se=>{if(!vis[se.k])return;let d='';const N=150;for(let i=0;i<=N;i++){const t=3*lagP*i/N;d+=(i?'L':'M')+X(t).toFixed(1)+' '+Y(se.fn(t,f)).toFixed(1);}
    h+='<path d="'+d+'" fill="none" stroke="'+se.c+'" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>';});
  if(lagP<1)h+='<line x1="'+X(3*lagP)+'" x2="'+X(3*lagP)+'" y1="'+mt+'" y2="'+(mt+phh)+'" stroke="var(--ink)" stroke-opacity=".4"/>';
  s.innerHTML=h;
}
function lagStats(){
  const f=lagF();$('lagRpmV').textContent=nf($('lagRpm').value);
  $('lagStats').innerHTML=series.filter(s=>vis[s.k]&&s.k!=='na').map(se=>{let tt=null;for(let t=0;t<=3;t+=.005){if(se.fn(t,f)>=.5){tt=t;break;}}
    return '<div class="m"><b>'+T(se.n)+'</b><span style="color:'+se.c+'">'+(tt===null?'&gt; 3 s':tt.toFixed(2)+' s')+'</span></div>';}).join('')+
    '<p class="small" style="grid-column:1/-1;margin:0">'+T({en:'Time to reach 0.5 bar, where you feel the push.',ar:'الزمن حتى 0.5 بار، حيث تشعر بالدفعة.'})+'</p>';
}
function lagButtons(){
  $('lagSeries').innerHTML=series.map(se=>'<button data-k="'+se.k+'" aria-pressed="'+vis[se.k]+'" style="border-color:'+se.c+(vis[se.k]?';background:color-mix(in srgb,'+se.c+' 16%,transparent)':'')+'"><span style="display:inline-block;width:14px;height:4px;border-radius:2px;background:'+se.c+';vertical-align:middle;margin-inline-end:8px"></span>'+T(se.n)+'</button>').join('');
}
$('lagSeries').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;vis[b.dataset.k]=!vis[b.dataset.k];lagButtons();lagStats();drawLag();});
$('lagRpm').addEventListener('input',()=>{lagStats();drawLag();});
$('lagGo').addEventListener('click',()=>{if(reduce){lagP=1;drawLag();return;}lagP=0;lagStart=null;});
const roLag=new ResizeObserver(drawLag);roLag.observe($('lagSvg'));

/* ---------- big players ---------- */
const STATUS={now:{en:'In use',ar:'مستخدمة'},fade:{en:'Fading out',ar:'في طريقها للتوقف'},gone:{en:'Retired',ar:'متوقفة'}};
const CATS=[
 {id:'boost',c:'#d9480f',n:{en:'Turbos and superchargers',ar:'التيربو والسوبرتشارجر'},intro:{en:'Four families: downsized turbo engines, twincharging (supercharger plus turbo), variable-geometry turbos, and electric boosting that kills lag.',ar:'أربع عائلات: محركات تيربو مصغّرة، والشحن المزدوج (سوبرتشارجر مع تيربو)، وتيربو بهندسة متغيرة، والشحن الكهربائي الذي يلغي التأخير.'}},
 {id:'eff',c:'#1d47c9',n:{en:'Engine efficiency',ar:'كفاءة المحرك'},intro:{en:'Ways to waste less fuel: change valve lift, timing or duration, change the compression ratio, burn leaner, or switch cylinders off.',ar:'طرق لإهدار وقود أقل: تغيير رفع الصمامات أو توقيتها أو مدة فتحها، أو تغيير نسبة الانضغاط، أو الحرق بخليط فقير، أو إيقاف أسطوانات.'}},
 {id:'gear',c:'#18794e',n:{en:'Gearboxes',ar:'نواقل الحركة'},intro:{en:'Four ways to change ratios. Torque-converter automatics are the friendliest type for heavy traffic and heat.',ar:'أربع طرق لتغيير النسب. الأوتوماتيك بمحوّل عزم هو الأنسب للزحام والحرارة.'},
  table:{h:[{en:'Manual',ar:'مانيوال'},{en:'Torque-converter auto',ar:'أوتوماتيك بمحوّل عزم'},{en:'Dual-clutch (DCT)',ar:'ثنائي الكلتش'},{en:'CVT',ar:'CVT متغير باستمرار'}],r:[
   [{en:'How it works',ar:'طريقة العمل'},{en:'You work the clutch and pick gears',ar:'أنت تدوس الكلتش وتختار الترس'},{en:'Fluid coupling plus planetary gears',ar:'وصلة زيتية مع تروس كوكبية'},{en:'Two computer-run clutches, next gear ready',ar:'كلتشان يتحكم بهما الكمبيوتر والترس التالي جاهز'},{en:'A belt between pulleys that change size',ar:'سير بين بكرتين يتغير قطرهما'}],
   [{en:'Feel',ar:'الإحساس'},{en:'Engaging',ar:'ممتع ومشارك'},{en:'Smooth',ar:'ناعم'},{en:'Very fast; can judder at a crawl',ar:'سريع جدًا؛ قد يرتعش في السير البطيء'},{en:'Seamless; rubber-band feel',ar:'سلس؛ إحساس المطاط'}],
   [{en:'Cairo traffic and heat',ar:'زحام القاهرة والحرارة'},{en:'Tiring',ar:'متعب'},{en:'Best',ar:'الأفضل'},{en:'Dry-clutch types may overheat',ar:'الأنواع ذات الكلتش الجاف قد تسخن'},{en:'Fine if the fluid is changed on time',ar:'جيد إذا تغيّر الزيت في موعده'}],
   [{en:'Examples',ar:'أمثلة'},{en:'Entry-level budget cars',ar:'السيارات الاقتصادية الأساسية'},{en:'SEAT Ibiza, Leon, Cupra Leon (Egypt), BMW, Mercedes',ar:'سيات إبيزا وليون وكوبرا ليون (مصر)، بي إم دبليو، مرسيدس'},{en:'VW DSG, Porsche PDK, many Hyundai and Kia turbos',ar:'DSG فولكس فاجن، PDK بورش، وكثير من هيونداي وكيا تيربو'},{en:'Nissan Sunny, Toyota Corolla',ar:'نيسان صني، تويوتا كورولا'}]]}},
 {id:'hyb',c:'#9b5de5',n:{en:'Hybrid systems',ar:'أنظمة الهايبرد'},intro:{en:'From a small 48V helper to cars that drive mostly on electricity. The key questions: can it drive on electricity alone, and do you need to plug it in?',ar:'من مساعد صغير 48 فولت إلى سيارات تسير غالبًا بالكهرباء. السؤالان المهمان: هل تسير بالكهرباء وحدها؟ وهل تحتاج للشحن من الكهرباء؟'},
  table:{h:[{en:'Mild (48V)',ar:'خفيف (48 فولت)'},{en:'Full hybrid',ar:'هايبرد كامل'},{en:'Plug-in',ar:'قابل للشحن'},{en:'Series (e-POWER)',ar:'متسلسل (e-POWER)'}],r:[
   [{en:'Electric-only driving',ar:'السير بالكهرباء فقط'},{en:'No',ar:'لا'},{en:'Short distances',ar:'مسافات قصيرة'},{en:'Yes, often 50 to 100+ km',ar:'نعم، غالبًا 50 إلى أكثر من 100 كم'},{en:'Wheels always driven by the motor',ar:'الموتور يحرّك العجلات دائمًا'}],
   [{en:'Fuel saving',ar:'توفير الوقود'},{en:'Small',ar:'قليل'},{en:'Large in town',ar:'كبير في المدينة'},{en:'Largest if you charge',ar:'الأكبر إذا شحنت'},{en:'Large in town',ar:'كبير في المدينة'}],
   [{en:'Needs plugging in',ar:'يحتاج شحنًا من الكهرباء'},{en:'No',ar:'لا'},{en:'No',ar:'لا'},{en:'Yes, to get the benefit',ar:'نعم لتحصل على الفائدة'},{en:'No',ar:'لا'}],
   [{en:'Examples',ar:'أمثلة'},{en:'VW eTSI, Mercedes EQ Boost',ar:'فولكس فاجن eTSI، مرسيدس EQ Boost'},{en:'Toyota HSD, Honda e:HEV',ar:'تويوتا HSD، هوندا e:HEV'},{en:'BYD DM-i, Cupra eHybrid',ar:'BYD DM-i، كوبرا eHybrid'},{en:'Nissan e-POWER',ar:'نيسان e-POWER'}]]}}
];
const TECH=[
 {id:'komp',cat:'boost',y:1995,st:'gone',b:'Mercedes-Benz',n:{en:'Kompressor',ar:'كومبريسور'},h:{en:'Belt-driven Eaton Roots supercharger on 4-cylinder C, E, CLK and SLK models; older units had a clutch to switch the blower off. AMG 55 V8s used twin-screw units. The badge dates back to 1920s racing.',ar:'سوبرتشارجر روتس من إيتون يدور بالسير في موديلات C وE وCLK وSLK رباعية الأسطوانات؛ النسخ الأقدم بها كلتش يفصل الشاحن. ومحركات AMG 55 V8 استخدمت شاحنًا لولبيًا مزدوجًا. ويعود الاسم إلى سباقات العشرينيات.'},p:{en:'Smooth, lag-free pull like a bigger engine',ar:'سحب ناعم بلا تأخير كأنه محرك أكبر'},m:{en:'Uses engine power to run; thirstier than turbos',ar:'يستهلك من قوة المحرك؛ أكثر استهلاكًا للوقود من التيربو'},now:{en:'Replaced by turbos around 2008 to 2011.',ar:'حلّ محله التيربو بين 2008 و2011 تقريبًا.'}},
 {id:'twin',cat:'boost',y:2005,st:'gone',b:'Volkswagen',n:{en:'TSI Twincharger',ar:'TSI بالشحن المزدوج'},h:{en:'A 1.4 with both a supercharger and a turbo: the supercharger fills the low-rpm gap, the turbo takes over higher up, and a clutch disengages the supercharger.',ar:'محرك 1.4 بسوبرتشارجر وتيربو معًا: السوبرتشارجر يسد ضعف اللفّات المنخفضة، ثم يتولى التيربو في اللفّات الأعلى، وكلتش يفصل السوبرتشارجر.'},p:{en:'Strong from idle with small-engine economy',ar:'قوي من أول اللفّات مع اقتصاد محرك صغير'},m:{en:'Complex and costly to build and repair',ar:'معقّد ومكلف في التصنيع والإصلاح'},now:{en:'Dropped in the mid-2010s for simpler single-turbo TSI engines.',ar:'توقف في منتصف العقد الماضي لصالح محركات TSI بتيربو واحد أبسط.'}},
 {id:'vtg',cat:'boost',y:2006,st:'now',b:'Porsche',n:{en:'Variable turbine geometry (VTG)',ar:'تيربو بهندسة متغيرة (VTG)'},h:{en:'Movable vanes around the turbine change how exhaust hits it: narrow at low rpm for quick spool, wide at high rpm for power. First on a petrol car in the 997 911 Turbo.',ar:'ريش متحركة حول التوربين تغيّر طريقة اصطدام العادم به: ضيقة على اللفّات المنخفضة ليدور بسرعة، وواسعة على العالية للقوة. أول مرة في سيارة بنزين كانت 911 تيربو (997).'},p:{en:'Small-turbo response with big-turbo power',ar:'استجابة تيربو صغير وقوة تيربو كبير'},m:{en:'Petrol exhaust is very hot, so it needs costly materials',ar:'عادم البنزين شديد الحرارة فيحتاج مواد غالية'},now:{en:'In the 911 Turbo and VW\'s 1.5 TSI evo engines.',ar:'في 911 تيربو وفي محركات فولكس فاجن 1.5 TSI evo.'}},
 {id:'eco',cat:'boost',y:2009,st:'now',b:'Ford',n:{en:'EcoBoost',ar:'إيكوبوست'},h:{en:'Downsizing: turbo plus direct injection and variable cam timing let a small engine replace a bigger one, like the award-winning 1.0 three-cylinder.',ar:'تصغير المحرك: تيربو مع حقن مباشر وتوقيت كامات متغير يجعلان محركًا صغيرًا يحل محل محرك أكبر، مثل محرك 1.0 ثلاثي الأسطوانات الحائز على جوائز.'},p:{en:'Big-engine torque, low official fuel figures',ar:'عزم محرك كبير وأرقام استهلاك رسمية منخفضة'},m:{en:'Real-world economy drops when driven hard',ar:'الاستهلاك الفعلي يرتفع مع القيادة العنيفة'},now:{en:'Across Ford\'s range, from small cars to F-150 V6s.',ar:'في معظم موديلات فورد، من السيارات الصغيرة حتى F-150 بمحرك V6.'}},
 {id:'bmw',cat:'boost',y:2009,st:'now',b:'BMW',n:{en:'TwinPower Turbo',ar:'TwinPower Turbo'},h:{en:'Not two turbos: the name means a turbo (often one twin-scroll unit) plus Valvetronic variable valve lift, Double-VANOS timing and direct injection.',ar:'لا تعني تيربو مزدوجًا: الاسم يعني تيربو (غالبًا واحد بمدخلين twin-scroll) مع رفع صمامات متغير Valvetronic وتوقيت Double-VANOS وحقن مباشر.'},p:{en:'Quick response, smooth power',ar:'استجابة سريعة وقوة ناعمة'},m:{en:'Many systems to maintain; costly out of warranty',ar:'أنظمة كثيرة تحتاج صيانة؛ مكلفة بعد الضمان'},now:{en:'On nearly every BMW petrol engine.',ar:'في معظم محركات بي إم دبليو البنزين.'}},
 {id:'volvo',cat:'boost',y:2014,st:'gone',b:'Volvo',n:{en:'Drive-E T6 twincharger',ar:'Drive-E T6 بالشحن المزدوج'},h:{en:'A 2.0 four-cylinder with a clutch-operated Roots supercharger and a turbo; the supercharger worked below about 3,500 rpm. B6 versions later swapped it for a 48V electric supercharger.',ar:'محرك 2.0 رباعي بسوبرتشارجر روتس بكلتش وتيربو؛ السوبرتشارجر يعمل تحت 3,500 لفة تقريبًا. ثم استبدلته نسخ B6 بسوبرتشارجر كهربائي 48 فولت.'},p:{en:'Big-engine pull from a 2.0',ar:'سحب محرك كبير من 2.0 لتر'},m:{en:'Very complex for a four-cylinder',ar:'معقّد جدًا لمحرك رباعي'},now:{en:'Mechanical version retired; electric help took over.',ar:'النسخة الميكانيكية توقفت وحلّت المساعدة الكهربائية محلها.'}},
 {id:'epc',cat:'boost',y:2016,st:'fade',b:'Audi',n:{en:'Electric powered compressor',ar:'ضاغط كهربائي'},h:{en:'A 48V motor spins an extra compressor in a fraction of a second, before the exhaust turbos wake up. First in the SQ7 TDI.',ar:'موتور 48 فولت يدوّر ضاغطًا إضافيًا في جزء من الثانية قبل أن تستيقظ تيربوهات العادم. ظهر أولًا في SQ7 TDI.'},p:{en:'Kills lag without belt losses',ar:'يلغي التأخير بدون فقد السير'},m:{en:'Needs a 48V system; adds weight and cost',ar:'يحتاج نظام 48 فولت؛ يزيد الوزن والتكلفة'},now:{en:'Used in a few high-end diesels and Mercedes 53 models; niche.',ar:'استُخدم في بعض محركات الديزل الفاخرة وموديلات مرسيدس 53؛ انتشار محدود.'}},
 {id:'eturbo',cat:'boost',y:2022,st:'now',b:'Mercedes-AMG',n:{en:'Electric exhaust-gas turbo',ar:'تيربو عادم كهربائي'},h:{en:'A thin electric motor on the turbo shaft spins it up before the exhaust arrives: Formula 1 technology built with Garrett. First in the SL 43, then C 43 and C 63.',ar:'موتور كهربائي رفيع على عمود التيربو يدوّره قبل وصول العادم: تقنية من الفورمولا 1 طُوّرت مع جاريت. ظهر أولًا في SL 43 ثم C 43 وC 63.'},p:{en:'Big-turbo power with almost no lag',ar:'قوة تيربو كبير بلا تأخير تقريبًا'},m:{en:'Needs 48V or hybrid electrics; expensive',ar:'يحتاج كهرباء 48 فولت أو هايبرد؛ غالي'},now:{en:'In AMG\'s 2.0 four-cylinder.',ar:'في محرك AMG 2.0 الرباعي.'}},
 {id:'vtec',cat:'eff',y:1989,st:'now',b:'Honda',n:{en:'VTEC',ar:'VTEC'},h:{en:'Two cam profiles per cylinder: a mild one for economy and, at high rpm, oil pressure locks in a wild one for power. i-VTEC later added variable timing.',ar:'بروفيلان للكامة لكل أسطوانة: هادئ للاقتصاد، وعلى اللفّات العالية يثبّت ضغط الزيت البروفيل الحاد للقوة. ثم أضاف i-VTEC توقيتًا متغيرًا.'},p:{en:'Economy and high-rev power in one engine',ar:'اقتصاد وقوة على اللفّات العالية في محرك واحد'},m:{en:'Older non-turbo versions needed revs to shine',ar:'النسخ القديمة بدون تيربو تحتاج لفّات عالية لتظهر قوتها'},now:{en:'Still in Honda engines, now mostly with turbos or hybrids.',ar:'ما زال في محركات هوندا، غالبًا مع تيربو أو هايبرد.'}},
 {id:'act',cat:'eff',y:2012,st:'now',b:'Volkswagen',n:{en:'Active Cylinder Technology (ACT)',ar:'تقنية الأسطوانات النشطة (ACT)'},h:{en:'At light load the engine shuts two of its four cylinders by closing their valves and cutting fuel, then wakes them in milliseconds.',ar:'عند الحمل الخفيف يوقف المحرك أسطوانتين من الأربع بغلق صماماتهما وقطع الوقود عنهما، ثم يعيدهما في أجزاء من الثانية.'},p:{en:'Saves fuel when cruising',ar:'يوفر الوقود أثناء السير الهادئ'},m:{en:'Small gain in stop-go traffic',ar:'مكسب صغير في الزحام'},now:{en:'In many VW Group 1.4 and 1.5 TSI engines.',ar:'في كثير من محركات TSI 1.4 و1.5 من مجموعة فولكس فاجن.'}},
 {id:'dyn',cat:'eff',y:2017,st:'now',b:'Toyota',n:{en:'Dynamic Force',ar:'Dynamic Force'},h:{en:'Long stroke, very high compression and both port and direct injection (D-4S) for fast, complete burning: about 40% thermal efficiency, 41% in hybrids.',ar:'شوط طويل وضغط عالٍ جدًا وحقن مزدوج في البوابة ومباشر (D-4S) لاحتراق سريع وكامل: كفاءة حرارية نحو 40%، و41% في الهايبرد.'},p:{en:'Excellent economy without a turbo',ar:'اقتصاد ممتاز بدون تيربو'},m:{en:'Less punch than a similar-size turbo',ar:'دفعة أقل من محرك تيربو بنفس الحجم'},now:{en:'In Camry, RAV4, Corolla Cross and Toyota hybrids.',ar:'في كامري وراف 4 وكورولا كروس وهايبرد تويوتا.'}},
 {id:'multi',cat:'eff',y:2009,st:null,b:'Fiat',n:{en:'MultiAir',ar:'MultiAir'},h:{en:'Instead of the cam pushing the intake valve directly, a chamber of oil sits between them, controlled by a solenoid, so valve lift and timing can change every stroke.',ar:'بدل أن تدفع الكامة صمام السحب مباشرة، توجد غرفة زيت بينهما يتحكم فيها ملف كهربائي، فيتغير رفع الصمام وتوقيته في كل شوط.'},p:{en:'Less pumping loss, better low-rpm torque',ar:'فقد ضخ أقل وعزم أفضل على اللفّات المنخفضة'},m:{en:'Sensitive to oil quality and change intervals',ar:'حساس لنوعية الزيت ومواعيد تغييره'},now:{en:'Used in Fiat, Alfa Romeo and Jeep engines since 2009.',ar:'مستخدم في محركات فيات وألفا روميو وجيب منذ 2009.'}},
 {id:'vc',cat:'eff',y:2018,st:'now',b:'Nissan',n:{en:'VC-Turbo',ar:'VC-Turbo'},h:{en:'A linkage changes how far the piston travels, varying compression from 8:1 for boosted power to 14:1 for economy while you drive.',ar:'وصلة تغيّر مدى حركة المكبس، فتتغير نسبة الانضغاط من 8:1 للقوة مع الشحن إلى 14:1 للاقتصاد أثناء القيادة.'},p:{en:'Power and efficiency from one engine',ar:'قوة وكفاءة من محرك واحد'},m:{en:'Many extra moving parts',ar:'أجزاء متحركة إضافية كثيرة'},now:{en:'Started in the Infiniti QX50; a 1.5 version runs the generator in e-POWER X-Trail and Qashqai.',ar:'بدأ في إنفينيتي QX50؛ ونسخة 1.5 تشغّل المولد في إكس تريل وقشقاي e-POWER.'}},
 {id:'skyx',cat:'eff',y:2019,st:'fade',b:'Mazda',n:{en:'Skyactiv-X (SPCCI)',ar:'Skyactiv-X (SPCCI)'},h:{en:'Burns a very lean petrol mix by compression, like a diesel, with the spark plug triggering it. Runs 16.3:1 compression and a small supercharger for extra air.',ar:'يحرق خليط بنزين فقيرًا جدًا بالضغط مثل الديزل، وشمعة الإشعال تطلق الاحتراق. نسبة انضغاط 16.3:1 وسوبرتشارجر صغير لهواء إضافي.'},p:{en:'Diesel-like efficiency from petrol',ar:'كفاءة تقارب الديزل من البنزين'},m:{en:'Costly; real-world gains were modest',ar:'غالي؛ والمكسب الفعلي كان متواضعًا'},now:{en:'Being phased out: the Mazda3 drops it in Europe for 2027, and SPCCI moves to the coming Skyactiv-Z.',ar:'في طريقه للتوقف: مازدا 3 تتخلى عنه في أوروبا لموديل 2027، وتنتقل تقنية SPCCI إلى Skyactiv-Z القادم.'}},
 {id:'cvvd',cat:'eff',y:2019,st:'now',b:'Hyundai',n:{en:'CVVD',ar:'CVVD'},h:{en:'Continuously variable valve duration: changes how long the intake valve stays open, not just when it opens or how far.',ar:'مدة فتح متغيرة باستمرار: تغيّر طول مدة بقاء صمام السحب مفتوحًا، وليس فقط توقيت فتحه أو مقدار رفعه.'},p:{en:'Better economy and low-end torque together',ar:'اقتصاد أفضل وعزم منخفض أقوى معًا'},m:{en:'Newer, shorter long-term track record',ar:'أحدث، وسجلها طويل الأمد أقصر'},now:{en:'In Hyundai and Kia Smartstream 1.6 turbo engines.',ar:'في محركات هيونداي وكيا Smartstream 1.6 تيربو.'}},
 {id:'dsg',cat:'gear',y:2003,st:'now',b:'Volkswagen',n:{en:'DSG dual-clutch',ar:'DSG ثنائي الكلتش'},h:{en:'Two clutches: one for odd gears, one for even. The next gear is pre-selected, so shifts take milliseconds. 6-speed wet-clutch first; the 7-speed dry-clutch DQ200 followed for small engines.',ar:'كلتشان: واحد للتروس الفردية والآخر للزوجية. الترس التالي مُعدّ مسبقًا فيتم النقل في أجزاء من الثانية. البداية بست سرعات وكلتش مغمور بالزيت، ثم DQ200 بسبع سرعات وكلتش جاف للمحركات الصغيرة.'},p:{en:'Fast shifts, efficient like a manual',ar:'نقل سريع وكفاءة مثل المانيوال'},m:{en:'Dry-clutch versions can overheat and judder in heavy stop-go traffic',ar:'النسخ ذات الكلتش الجاف قد تسخن وترتعش في الزحام الشديد'},now:{en:'Across VW, Skoda, SEAT and Cupra worldwide; Egypt\'s Ibiza and Leon use torque converters instead.',ar:'في فولكس فاجن وسكودا وسيات وكوبرا عالميًا؛ أما إبيزا وليون في مصر فبناقل بمحوّل عزم.'}},
 {id:'cvtN',cat:'gear',y:2003,st:'now',b:'Nissan (Jatco)',n:{en:'Xtronic CVT',ar:'Xtronic CVT'},h:{en:'No fixed gears: a steel belt runs between two pulleys that change width, giving endless ratios.',ar:'بدون تروس ثابتة: سير معدني يعمل بين بكرتين يتغير عرضهما فيعطي عددًا لا نهائيًا من النسب.'},p:{en:'Smooth, economical in town',ar:'ناعم واقتصادي في المدينة'},m:{en:'Rubber-band feel; sensitive to heat and fluid changes',ar:'إحساس المطاط؛ حساس للحرارة ومواعيد تغيير الزيت'},now:{en:'In Nissan Sunny, Sentra, Qashqai and many other cars.',ar:'في نيسان صني وسنترا وقشقاي وسيارات أخرى كثيرة.'}},
 {id:'pdk',cat:'gear',y:2008,st:'now',b:'Porsche',n:{en:'PDK',ar:'PDK'},h:{en:'Porsche\'s dual-clutch, built by ZF, with roots in 1980s Porsche race cars. Wet clutches handle high torque.',ar:'ناقل بورش ثنائي الكلتش من تصنيع ZF، وجذوره في سيارات سباق بورش في الثمانينيات. كلتشات مغمورة بالزيت تتحمل عزمًا عاليًا.'},p:{en:'Lightning shifts, durable',ar:'نقل خاطف ومتين'},m:{en:'Expensive to repair',ar:'إصلاحه مكلف'},now:{en:'Standard on most Porsches.',ar:'قياسي في معظم سيارات بورش.'}},
 {id:'zf',cat:'gear',y:2009,st:'now',b:'ZF',n:{en:'8HP automatic',ar:'أوتوماتيك 8HP'},h:{en:'A torque-converter automatic with 8 speeds from only 4 planetary gearsets and 5 shift elements. Debuted in the BMW 7 Series.',ar:'أوتوماتيك بمحوّل عزم وثماني سرعات من 4 مجموعات تروس كوكبية و5 عناصر نقل فقط. ظهر أولًا في بي إم دبليو الفئة السابعة.'},p:{en:'Smooth, quick and very durable',ar:'ناعم وسريع ومتين جدًا'},m:{en:'Heavier than a dual-clutch',ar:'أثقل من ثنائي الكلتش'},now:{en:'Used by BMW, Audi, Jaguar Land Rover, Jeep, Ram and more.',ar:'تستخدمه بي إم دبليو وأودي وجاكوار لاندروفر وجيب ورام وغيرها.'}},
 {id:'9g',cat:'gear',y:2013,st:'now',b:'Mercedes-Benz',n:{en:'9G-TRONIC',ar:'9G-TRONIC'},h:{en:'A 9-speed torque-converter automatic: more ratios keep the engine at its most efficient rpm.',ar:'أوتوماتيك بمحوّل عزم وتسع سرعات: سرعات أكثر تُبقي المحرك على أكفأ لفّاته.'},p:{en:'Relaxed, quiet cruising',ar:'سير هادئ ومريح'},m:{en:'Can feel busy, shifting often in town',ar:'قد يكثر من تبديل السرعات في المدينة'},now:{en:'In most Mercedes models with combustion engines.',ar:'في معظم موديلات مرسيدس ذات محركات الاحتراق.'}},
 {id:'dcvt',cat:'gear',y:2018,st:'now',b:'Toyota',n:{en:'Direct Shift-CVT',ar:'Direct Shift-CVT'},h:{en:'A CVT with a real first gear for pulling away, so the belt only works at higher speeds where it is most efficient.',ar:'ناقل CVT بترس أول حقيقي للانطلاق، فلا يعمل السير إلا على السرعات الأعلى حيث يكون أكفأ.'},p:{en:'Crisp take-off, less belt wear',ar:'انطلاق حاد وتآكل أقل للسير'},m:{en:'Still feels like a CVT under hard acceleration',ar:'ما زال يشعرك بالـCVT عند التسارع القوي'},now:{en:'In the Corolla and other Toyotas with 2.0 engines.',ar:'في كورولا وموديلات تويوتا أخرى بمحرك 2.0.'}},
 {id:'hsd',cat:'hyb',y:1997,st:'now',b:'Toyota',n:{en:'Hybrid Synergy Drive',ar:'Hybrid Synergy Drive'},h:{en:'A planetary power-split gearset blends an efficient Atkinson-cycle engine with two motor-generators, acting like a seamless CVT.',ar:'مجموعة تروس كوكبية لتقسيم القوة تمزج محرك أتكنسون عالي الكفاءة مع موتورين/مولدين، فتعمل كناقل CVT سلس.'},p:{en:'Proven reliability, great city economy',ar:'اعتمادية مثبتة واقتصاد ممتاز في المدينة'},m:{en:'Engine drones under hard acceleration',ar:'صوت المحرك يعلو عند التسارع القوي'},now:{en:'First in the Prius; now in Corolla, C-HR, RAV4 and more.',ar:'بدأ في بريوس؛ والآن في كورولا وC-HR وراف 4 وغيرها.'}},
 {id:'ehev',cat:'hyb',y:2013,st:'now',b:'Honda',n:{en:'e:HEV',ar:'e:HEV'},h:{en:'Drives mostly with its electric motor while the engine makes electricity; at steady highway speed a clutch connects the engine straight to the wheels.',ar:'يسير غالبًا بالموتور الكهربائي بينما يولّد المحرك الكهرباء؛ وعلى سرعة طريق سريع ثابتة يربط كلتش المحرك بالعجلات مباشرة.'},p:{en:'EV-like in town, efficient on highways',ar:'إحساس السيارة الكهربائية في المدينة وكفاءة على الطريق السريع'},m:{en:'Small battery, short electric-only range',ar:'بطارية صغيرة ومسافة كهربائية قصيرة'},now:{en:'In Civic, CR-V, HR-V and Accord hybrids (first as i-MMD in the 2013 Accord).',ar:'في هايبرد سيفيك وCR-V وHR-V وأكورد (بدأ باسم i-MMD في أكورد 2013).'}},
 {id:'epow',cat:'hyb',y:2016,st:'now',b:'Nissan',n:{en:'e-POWER',ar:'e-POWER'},h:{en:'A series hybrid: the petrol engine never drives the wheels. It only runs a generator, and the electric motor always does the driving.',ar:'هايبرد متسلسل: محرك البنزين لا يحرّك العجلات أبدًا، بل يشغّل مولدًا فقط، والموتور الكهربائي هو الذي يحرّك السيارة دائمًا.'},p:{en:'Smooth, instant torque with no plug',ar:'عزم فوري ناعم بدون شحن خارجي'},m:{en:'Less efficient at high steady speeds',ar:'أقل كفاءة على السرعات العالية الثابتة'},now:{en:'Started in the Note; now in Qashqai and X-Trail with a VC-Turbo generator engine.',ar:'بدأ في نوت؛ والآن في قشقاي وإكس تريل بمحرك VC-Turbo للمولّد.'}},
 {id:'mhev',cat:'hyb',y:2018,st:'now',b:'Mercedes-Benz, Volkswagen and others',n:{en:'48V mild hybrid',ar:'هايبرد خفيف 48 فولت'},h:{en:'A starter-generator and a small 48V battery restart the engine smoothly, let it switch off while coasting, and add a short electric push.',ar:'مولد/مارش وبطارية صغيرة 48 فولت يعيدان تشغيل المحرك بنعومة، ويسمحان بإطفائه أثناء الانسياب، ويضيفان دفعة كهربائية قصيرة.'},p:{en:'Cheap fuel saving, smoother start-stop',ar:'توفير وقود بتكلفة قليلة، وإيقاف وتشغيل أنعم'},m:{en:'Cannot drive on electricity alone',ar:'لا تسير بالكهرباء وحدها'},now:{en:'Common in Europe (Cupra Leon 1.5 eTSI there); Egypt\'s Leon keeps the plain 1.4 TSI.',ar:'منتشر في أوروبا (كوبرا ليون 1.5 eTSI هناك)؛ أما ليون في مصر فبمحرك 1.4 TSI العادي.'}},
 {id:'dmi',cat:'hyb',y:2021,st:'now',b:'BYD',n:{en:'DM-i plug-in hybrid',ar:'DM-i هايبرد قابل للشحن'},h:{en:'A plug-in that drives mostly as an EV; a very efficient 1.5 engine mainly charges the battery and joins in at high speed.',ar:'هايبرد قابل للشحن يسير غالبًا ككهربائي؛ ومحرك 1.5 عالي الكفاءة يشحن البطارية غالبًا ويشارك على السرعات العالية.'},p:{en:'Daily driving on electricity, long total range',ar:'قيادة يومية بالكهرباء ومدى إجمالي طويل'},m:{en:'Needs regular charging to pay off',ar:'يحتاج شحنًا منتظمًا لتظهر فائدته'},now:{en:'One of the world\'s best-selling plug-in systems.',ar:'من أكثر أنظمة الهايبرد القابلة للشحن مبيعًا في العالم.'}}
];
let cat='boost',selTech=null;
const Y0=1987,Y1=2027;
function renderTimeline(){
  const pct=y=>((y-Y0)/(Y1-Y0)*100);
  let h='<div dir="ltr">';
  CATS.forEach(c=>{
    const items=TECH.filter(t=>t.cat===c.id).sort((a,b)=>a.y-b.y);const lanes=[];
    items.forEach(t=>{let l=0;while(lanes[l]!=null&&t.y-lanes[l]<1.8)l++;lanes[l]=t.y;t.lane=l;});
    const n=Math.max(1,lanes.length),hh=n*26+10;
    h+='<div class="tlrow"><b>'+T(c.n)+'</b><div class="trk" style="height:'+hh+'px">';
    items.forEach(t=>{h+='<button class="dot'+(selTech===t.id?' sel':'')+'" data-id="'+t.id+'" aria-label="'+t.b+' '+T(t.n)+', '+t.y+'" title="'+t.b+': '+T(t.n)+' ('+t.y+')" style="left:'+pct(t.y)+'%;top:'+(18+t.lane*26)+'px;background:'+c.c+'"></button>';});
    h+='</div></div>';
  });
  h+='<div class="axis">';for(let y=1990;y<=2025;y+=5)h+='<span style="left:'+pct(y)+'%">'+y+'</span>';h+='</div></div>';
  const sel=TECH.find(t=>t.id===selTech);
  h+='<div id="tlCap">'+(sel?'<b>'+sel.y+'</b> · '+sel.b+': '+T(sel.n):T({en:'Tap a dot to jump to that technology.',ar:'اضغط على نقطة للانتقال إلى التقنية.'}))+'</div>';
  $('tl').innerHTML=h;
}
function renderCat(){
  $('catTabs').innerHTML=CATS.map(c=>'<button role="tab" aria-selected="'+(c.id===cat)+'" class="'+(c.id===cat?'on':'')+'" data-c="'+c.id+'">'+T(c.n)+'</button>').join('');
  const c=CATS.find(x=>x.id===cat);
  let h='<p style="max-width:75ch">'+T(c.intro)+'</p>';
  if(c.table){h+='<div class="scroll"><table class="stack ttab" style="background:var(--bg);border-radius:12px"><thead><tr><th></th>'+c.table.h.map(x=>'<th>'+T(x)+'</th>').join('')+'</tr></thead><tbody>'+c.table.r.map(r=>'<tr><td><b>'+T(r[0])+'</b></td>'+r.slice(1).map(x=>'<td>'+T(x)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';}
  $('catIntro').innerHTML=h;
  $('catCards').innerHTML=TECH.filter(t=>t.cat===cat).sort((a,b)=>a.y-b.y).map(t=>'<article class="card'+(t.id===selTech?' hl':'')+'" id="tech-'+t.id+'"><span class="small">'+t.b+'</span><h3>'+T(t.n)+'</h3><div style="display:flex;gap:6px;flex-wrap:wrap"><span class="tag">'+t.y+'</span>'+(t.st?'<span class="tag '+t.st+'">'+T(STATUS[t.st])+'</span>':'')+'</div><p style="margin:4px 0 0">'+T(t.h)+'</p><span class="pc"><b>'+T({en:'Plus:',ar:'مميزات:'})+'</b> '+T(t.p)+'</span><span class="pc"><b>'+T({en:'Minus:',ar:'عيوب:'})+'</b> '+T(t.m)+'</span><p class="small" style="margin:auto 0 0;padding-top:6px"><b>'+T({en:'Today:',ar:'اليوم:'})+'</b> '+T(t.now)+'</p></article>').join('');
}
$('catTabs').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;cat=b.dataset.c;selTech=null;renderCat();renderTimeline();});
$('tl').addEventListener('click',e=>{const b=e.target.closest('.dot');if(!b)return;const t=TECH.find(x=>x.id===b.dataset.id);selTech=t.id;cat=t.cat;renderCat();renderTimeline();const el=$('tech-'+t.id);if(el)el.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'});});

/* ---------- glossary ---------- */
const GL=[
 [{en:'Aspiration',ar:'طريقة السحب'},{en:'How an engine gets its air: naturally, or forced in by a pump.',ar:'كيف يحصل المحرك على الهواء: طبيعيًا أو بدفعه بمضخة.'}],
 [{en:'Naturally aspirated (NA)',ar:'سحب طبيعي'},{en:'No turbo or supercharger; air enters at normal atmospheric pressure.',ar:'بدون تيربو أو سوبرتشارجر؛ يدخل الهواء بالضغط الجوي العادي.'}],
 [{en:'Boost',ar:'ضغط الشحن'},{en:'Extra intake pressure above the atmosphere, usually in bar or psi (1 bar ≈ 14.5 psi).',ar:'ضغط إضافي في السحب فوق الضغط الجوي، غالبًا بالبار أو PSI (1 بار ≈ 14.5 PSI).'}],
 [{en:'Turbo lag',ar:'تأخر التيربو'},{en:'The delay before a turbo spins fast enough to make boost.',ar:'التأخير قبل أن يدور التيربو بسرعة كافية لإعطاء ضغط الشحن.'}],
 [{en:'Wastegate',ar:'صمام الويست جيت'},{en:'A valve that lets exhaust bypass the turbine to cap boost.',ar:'صمام يسمح للعادم بتجاوز التوربين للحد من ضغط الشحن.'}],
 [{en:'Bypass or blow-off valve',ar:'صمام التحويل أو التنفيس'},{en:'Releases or recirculates boost when the throttle closes or at light load.',ar:'يطلق ضغط الشحن أو يعيده للمدخل عند غلق الثروتل أو في الحمل الخفيف.'}],
 [{en:'Intercooler',ar:'الإنتركولر'},{en:'A radiator for compressed intake air; cooler air is denser and safer from knock.',ar:'مبرّد لهواء السحب المضغوط؛ الهواء الأبرد أكثف وأبعد عن الطرق.'}],
 [{en:'Knock',ar:'الطرق (البنج)'},{en:'Fuel igniting too early from heat and pressure; it can damage pistons.',ar:'اشتعال الوقود مبكرًا بسبب الحرارة والضغط؛ قد يتلف المكابس.'}],
 [{en:'Octane',ar:'رقم الأوكتان'},{en:'A fuel\'s resistance to knock: 95 resists better than 92.',ar:'مقاومة الوقود للطرق: بنزين 95 يقاوم أفضل من 92.'}],
 [{en:'Compression ratio',ar:'نسبة الانضغاط'},{en:'How much the piston squeezes the mixture; higher is more efficient but more knock-prone.',ar:'مقدار ضغط المكبس للخليط؛ الأعلى أكفأ لكنه أكثر عرضة للطرق.'}],
 [{en:'Torque',ar:'العزم'},{en:'Turning force, felt as pull from low speed. Measured in Nm.',ar:'قوة الدوران، تشعر بها كسحب من السرعات المنخفضة. تقاس بالنيوتن متر.'}],
 [{en:'Horsepower',ar:'القوة الحصانية'},{en:'How fast the engine can do work; sets top speed and high-rpm pace.',ar:'سرعة إنجاز المحرك للشغل؛ تحدد السرعة القصوى والأداء على اللفّات العالية.'}],
 [{en:'Direct injection',ar:'الحقن المباشر'},{en:'Fuel sprayed straight into the cylinder, cooling it and allowing more boost.',ar:'رش الوقود مباشرة داخل الأسطوانة، فيبردها ويسمح بشحن أعلى.'}],
 [{en:'Torque converter',ar:'محوّل العزم'},{en:'A fluid coupling between engine and automatic gearbox; smooth and tough in traffic.',ar:'وصلة زيتية بين المحرك والناقل الأوتوماتيك؛ ناعمة وتتحمل الزحام.'}],
 [{en:'Dual-clutch (DCT, DSG)',ar:'ثنائي الكلتش'},{en:'An automated manual with two clutches for near-instant shifts.',ar:'مانيوال مؤتمت بكلتشين لنقل شبه فوري.'}],
 [{en:'CVT',ar:'CVT'},{en:'A belt-and-pulley gearbox with endless ratios instead of fixed gears.',ar:'ناقل بسير وبكرات بنسب لا نهائية بدل التروس الثابتة.'}],
 [{en:'Mild hybrid (MHEV)',ar:'هايبرد خفيف'},{en:'A 48V starter-generator that assists the engine but can\'t drive the car alone.',ar:'مولد/مارش 48 فولت يساعد المحرك لكنه لا يحرّك السيارة وحده.'}]
];
function renderGl(){
  const q=($('gq').value||'').trim().toLowerCase();
  const items=GL.filter(g=>!q||(g[0].en+g[0].ar+g[1].en+g[1].ar).toLowerCase().includes(q));
  $('gl').innerHTML=items.length?items.map(g=>'<dt>'+T(g[0])+(L==='ar'?' <span class="small">('+g[0].en+')</span>':'')+'</dt><dd>'+T(g[1])+'</dd>').join(''):'<dd>'+T({en:'No matching term. Try "turbo" or "clutch".',ar:'لا توجد نتائج. جرّب "تيربو" أو "كلتش".'})+'</dd>';
  $('gq').placeholder=T({en:'intercooler',ar:'إنتركولر'});
}
$('gq').addEventListener('input',renderGl);

/* ---------- quiz ---------- */
const QZ=[
 {q:{en:'What spins a turbocharger?',ar:'ما الذي يدوّر التيربو؟'},o:[{en:'Exhaust gas',ar:'غاز العادم'},{en:'A belt from the crankshaft',ar:'سير من عمود الكرنك'},{en:'The gearbox',ar:'ناقل الحركة'}],a:0,w:{en:'Exhaust gas spins the turbine, which drives the compressor on the same shaft.',ar:'غاز العادم يدوّر التوربين الذي يدير الضاغط على نفس العمود.'}},
 {q:{en:'Why add an intercooler?',ar:'لماذا تُضاف الإنتركولر؟'},o:[{en:'To cool the engine oil',ar:'لتبريد زيت المحرك'},{en:'To cool compressed air so it is denser',ar:'لتبريد الهواء المضغوط فيصبح أكثف'},{en:'To quiet the exhaust',ar:'لتهدئة صوت العادم'}],a:1,w:{en:'Compressing air heats it. Cooling it packs in more oxygen and lowers knock risk.',ar:'ضغط الهواء يسخّنه. وتبريده يزيد الأكسجين ويقلل خطر الطرق.'}},
 {q:{en:'Which supercharger gives little boost at low rpm?',ar:'أي سوبرتشارجر يعطي شحنًا قليلًا على اللفّات المنخفضة؟'},o:[{en:'Roots',ar:'روتس'},{en:'Twin-screw',ar:'لولبي مزدوج'},{en:'Centrifugal',ar:'طارد مركزي'}],a:2,w:{en:'A centrifugal impeller works like a fan: its boost grows with speed.',ar:'مروحة الطارد المركزي تعمل كالمروحة: يزيد شحنها مع السرعة.'}},
 {q:{en:'Which gearbox copes best with heavy stop-go traffic and heat?',ar:'أي ناقل حركة يتحمل الزحام الشديد والحرارة أفضل؟'},o:[{en:'Dry-clutch DCT',ar:'ثنائي كلتش جاف'},{en:'Torque-converter automatic',ar:'أوتوماتيك بمحوّل عزم'},{en:'Manual',ar:'مانيوال'}],a:1,w:{en:'The fluid coupling takes the slipping, so nothing overheats when creeping.',ar:'الوصلة الزيتية تتحمل الانزلاق، فلا شيء يسخن أثناء الزحف.'}},
 {q:{en:'What does BMW "TwinPower Turbo" mean?',ar:'ماذا يعني TwinPower Turbo من بي إم دبليو؟'},o:[{en:'Always two turbos',ar:'دائمًا تيربو مزدوج'},{en:'A turbo plus variable valve technology',ar:'تيربو مع تقنية صمامات متغيرة'},{en:'A turbo and a supercharger',ar:'تيربو وسوبرتشارجر'}],a:1,w:{en:'Often a single twin-scroll turbo, with Valvetronic, Double-VANOS and direct injection.',ar:'غالبًا تيربو واحد بمدخلين، مع Valvetronic وDouble-VANOS وحقن مباشر.'}}
];
const ans=QZ.map(()=>null);
function renderQuiz(){
  const sc=ans.filter((a,i)=>a===QZ[i].a).length,done=ans.filter(a=>a!==null).length;
  let h='<p style="font-weight:600">'+T({en:'Score',ar:'النتيجة'})+': '+sc+' / '+QZ.length+(done===QZ.length?' · '+(sc===QZ.length?T({en:'Perfect.',ar:'ممتاز.'}):T({en:'Nice work.',ar:'أحسنت.'})):'')+'</p>';
  QZ.forEach((q,i)=>{h+='<div class="q"><p>'+(i+1)+'. '+T(q.q)+'</p><div class="seg">'+q.o.map((o,j)=>{let c='';if(ans[i]!==null){if(j===q.a)c='right';else if(j===ans[i])c='wrong';}return '<button data-q="'+i+'" data-o="'+j+'" class="'+c+'">'+T(o)+'</button>';}).join('')+'</div>'+(ans[i]!==null?'<p class="why">'+(ans[i]===q.a?T({en:'Correct. ',ar:'صحيح. '}):T({en:'Not quite. ',ar:'ليس تمامًا. '}))+T(q.w)+'</p>':'')+'</div>';});
  h+='<button id="qReset">'+T({en:'Start over',ar:'ابدأ من جديد'})+'</button>';
  $('quiz').innerHTML=h;
}
$('quiz').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.id==='qReset'){ans.fill(null);renderQuiz();return;}const i=+b.dataset.q;if(ans[i]!==null)return;ans[i]=+b.dataset.o;renderQuiz();});

/* ---------- language, pause, loop ---------- */
function relabel(){document.querySelectorAll('.stack td').forEach(c=>{let i=0,p=c;while(p=p.previousElementSibling)i+=p.colSpan;const h=c.closest('table').rows[0].cells[i];if(!h)return;const s=[...h.children].find(x=>getComputedStyle(x).display!=='none');c.dataset.l=(s||h).textContent;});}
function renderAll(){heroModel();calcModel();lagButtons();lagStats();drawLag();renderTimeline();renderCat();renderGl();renderQuiz();setPause();relabel();}
function setPause(){const b=$('pauseAll');b.innerHTML=playing?'<span class="en">Pause animations</span><span class="ar">إيقاف الحركة</span>':'<span class="en">Play animations</span><span class="ar">تشغيل الحركة</span>';}
function applyLang(){document.documentElement.lang=L;document.documentElement.dir=L==='ar'?'rtl':'ltr';try{localStorage.setItem('bg-lang',L);}catch(e){}renderAll();}
$('langBtn').addEventListener('click',()=>{L=L==='en'?'ar':'en';applyLang();});
$('pauseAll').addEventListener('click',()=>{playing=!playing;setPause();});
const visib={engine:true,types:false};
const io=new IntersectionObserver(es=>es.forEach(en=>{visib[en.target.id]=en.isIntersecting;}));
io.observe($('engine'));io.observe($('types'));
let last=null;
function loop(ts){
  if(last===null)last=ts;const dt=Math.min((ts-last)/1000,.05);last=ts;
  if(playing){if(visib.engine)heroStep(dt);if(visib.types)typesStep(dt);}
  if(lagP<1){if(lagStart===null)lagStart=ts;lagP=Math.min(1,(ts-lagStart)/3000);drawLag();}
  requestAnimationFrame(loop);
}
typesModel();applyLang();heroDraw();typesDraw();requestAnimationFrame(loop);
}
