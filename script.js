var SCRIPT_URL = "https://script.google.com/macros/s/AKfycby6Dkr06MlkO92kmaWqDRVyztXGAiUvXxxjETaUpEVlsFOFG2EapmWxWFFmZcxGrFAP-g/exec";
var WA = "96551772667";
var $ = function (i) { return document.getElementById(i); };

function sync() {
  var en = LANG === 'en';
  $('cn').textContent = $('k').value || '0';
  $('cp').textContent = $('p').value;
  $('cm').textContent = $('n').value || (en ? 'Player name' : 'اسم اللاعب');
  $('ca').textContent = $('a').value + ' · ' + (en ? 'Founding Class' : 'الدفعة المؤسسة');
}

['n', 'k', 'p', 'a'].forEach(function (i) {
  $(i).addEventListener('input', sync);
});

$('f').addEventListener('submit', function (e) {
  e.preventDefault();
  var en = LANG === 'en';
  var btn = $('subBtn');
  var P = $('p');
  var posText = P.options[P.selectedIndex].text;

  // تجهيز البيانات للإرسال إلى Google Sheets
  var payload = {
    playerName: $('n').value,
    shirtNumber: $('k').value,
    position: posText,
    ageGroup: $('a').value,
    parentName: $('g').value,
    phone: $('t').value,
    lang: en ? 'English' : 'العربية'
  };

  // تجهيز رسالة الواتساب
  var m = encodeURIComponent(
    (en ? "Founding Class registration request\nPlayer: " : "طلب تسجيل في الدفعة المؤسسة\nاللاعب: ") + payload.playerName +
    (en ? "\nShirt number: " : "\nرقم القميص: ") + payload.shirtNumber +
    (en ? "\nPosition: " : "\nالمركز: ") + payload.position +
    (en ? "\nAge group: " : "\nالفئة: ") + payload.ageGroup +
    (en ? "\nParent: " : "\nولي الأمر: ") + payload.parentName +
    (en ? "\nPhone: " : "\nالهاتف: ") + payload.phone
  );
  var waUrl = "https://wa.me/" + WA + "?text=" + m;

  if (btn) {
    btn.disabled = true;
    btn.textContent = en ? 'Sending...' : 'جاري التسجيل...';
  }

  fetch(SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(function () {
    if ($('msgText')) {
      $('msgText').textContent = en
        ? 'Registration received! Our team will contact you soon.'
        : 'تم استلام طلب تسجيلك بنجاح! سيتواصل معك فريق الأكاديمية قريباً.';
    }
    if ($('waRedirect')) {
      $('waRedirect').textContent = en ? 'Send via WhatsApp too' : 'إرسال نسخة عبر واتساب';
      $('waRedirect').href = waUrl;
    }
    if ($('msgBox')) {
      $('msgBox').hidden = false;
    }

    if (btn) {
      btn.disabled = false;
      btn.textContent = en ? 'Confirm Registration' : 'تأكيد التسجيل';
    }
    $('g').value = '';
    $('t').value = '';
  })
  .catch(function () {
    if (btn) {
      btn.disabled = false;
      btn.textContent = en ? 'Confirm Registration' : 'تأكيد التسجيل';
    }
    window.open(waUrl, "_blank");
  });
});

sync();

var LAUNCH = ""; /* تاريخ الافتتاح بصيغة 2026-09-01 لتشغيل العداد، واتركه فارغاً لإخفائه */
(function () {
  var el = $('cd'), d = new Date(LAUNCH + 'T00:00:00');
  if (!LAUNCH || isNaN(d)) return;
  function tick() {
    var s = Math.floor((d - new Date()) / 1000);
    if (s <= 0) { el.hidden = true; return; }
    var v = [Math.floor(s / 86400), Math.floor(s % 86400 / 3600), Math.floor(s % 3600 / 60)],
        l = ['يوم', 'ساعة', 'دقيقة'];
    el.innerHTML = v.map(function (n, i) { return '<div><b>' + n + '</b><small>' + l[i] + '</small></div>'; }).join('');
    el.hidden = false;
  }
  tick();
  setInterval(tick, 30000);
})();

var POS = {
  GK: ['حارس المرمى', 'آخر خط دفاع وأول من يبدأ الهجمة. نعمل على التمركز وسرعة ردة الفعل واللعب بالقدم وقيادة الدفاع بالصوت.'],
  DEF: ['المدافع', 'حماية المنطقة وبناء اللعب من الخلف. نعمل على التمركز والالتحام والتمرير الدقيق تحت الضغط.'],
  MID: ['لاعب الوسط', 'حلقة الوصل بين الدفاع والهجوم. نعمل على الرؤية والتمرير والجهد المستمر طوال المباراة.'],
  FWD: ['المهاجم', 'إنهاء الهجمات وصناعة الفارق. نعمل على التسديد والتحرك بدون كرة والهدوء أمام المرمى.']
};

var POSE = {
  GK: ['Goalkeeper', 'The last line of defence and the first to start an attack. We work on positioning, reflexes, playing with the feet and organising the defence by voice.'],
  DEF: ['Defender', 'Protecting the box and building play from the back. We work on positioning, tackling and accurate passing under pressure.'],
  MID: ['Midfielder', 'The link between defence and attack. We work on vision, passing and constant effort throughout the match.'],
  FWD: ['Forward', 'Finishing attacks and making the difference. We work on shooting, movement off the ball and composure in front of goal.']
};

var cur = 'GK';
function showPos(k) {
  cur = k;
  var Z = LANG === 'en' ? POSE : POS;
  $('pt2').textContent = Z[k][0];
  $('pd').textContent = Z[k][1];
  document.querySelectorAll('.dot').forEach(function (b) {
    b.classList.toggle('on', b.getAttribute('data-p') === k);
  });
}

document.querySelectorAll('.dot').forEach(function (b) {
  b.addEventListener('click', function () {
    showPos(b.getAttribute('data-p'));
  });
});

$('pick').addEventListener('click', function () {
  $('p').value = cur;
  sync();
  $('card').scrollIntoView({ behavior: 'smooth' });
});

showPos('GK');

var EN = {
  'التسجيل مفتوح للدفعة المؤسسة': 'Founding Class registration open',
  'الملعب جاهز.': 'The pitch is ready.',
  'ناقص بطلك.': 'Your hero is missing.',
  'أكاديمية بريمو إيرو لكرة القدم تفتح أبوابها في الكويت عام 2026. سجّل اسم ابنك الآن وكن ضمن الدفعة المؤسسة.': 'Primo Eroe Football Academy opens its doors in Kuwait in 2026. Register your child now and join the Founding Class.',
  'اصنع كارت البطل': 'Create your hero card',
  'الاسم هو الوعد': 'The name is the promise',
  'بريمو إيرو معناها "البطل الأول" بالإيطالية. أكاديمية تأسست في الكويت عام 2026 لتصنع بطلاً في كل لاعب: ثقة في النفس، التزام، وروح فريق قبل أي كأس.': 'Primo Eroe means “the first hero” in Italian. An academy founded in Kuwait in 2026 to build a hero in every player: confidence, commitment and team spirit before any trophy.',
  'اصنع كارت بطلك': 'Create your hero’s card',
  'اكتب بيانات اللاعب وشوف كارته يتكوّن قدامك، وبضغطة واحدة يوصلنا طلب التسجيل على واتساب.': 'Enter the player’s details, watch the card take shape, and send us the registration on WhatsApp in one tap.',
  'اسم اللاعب': 'Player name',
  'رقم القميص': 'Shirt number',
  'المركز': 'Position',
  'الفئة العمرية': 'Age group',
  'اسم ولي الأمر': 'Parent name',
  'رقم الهاتف': 'Phone number',
  'مهاجم': 'Forward',
  'وسط': 'Midfielder',
  'مدافع': 'Defender',
  'حارس مرمى': 'Goalkeeper',
  'تحت 6 سنوات': 'Under 6',
  '7 – 9 سنوات': 'Ages 7–9',
  '10 – 12 سنة': 'Ages 10–12',
  '13 – 16 سنة': 'Ages 13–16',
  'تأكيد التسجيل': 'Confirm Registration',
  'سجّل على واتساب': 'Register on WhatsApp',
  'الكارت للمعاينة فقط. التسجيل يتأكد مع إدارة الأكاديمية.': 'The card is a preview only. Registration is confirmed with the academy management.',
  'حمّل الكارت كصورة': 'Download the card as an image',
  'اعرف مركزك في الملعب': 'Find your position',
  'اضغط على أي مركز لتعرف دوره وكيف نبني اللاعب فيه.': 'Tap any position to see its role and how we develop players in it.',
  'اختر هذا المركز في الكارت': 'Use this position on the card',
  'رحلة اللاعب عبر الملعب': 'The player’s journey across the pitch',
  'من أول لمسة في منطقة الجزاء إلى المرمى الآخر. كل مرحلة عمرية لها هدفها.': 'From the first touch in the penalty area to the opposite goal. Every age stage has its purpose.',
  'اللعب والحب': 'Play & passion',
  'التعرف على الكرة بالألعاب والحركة، وبناء حب الرياضة.': 'Getting to know the ball through games and movement, and building a love of the sport.',
  'الأساسيات': 'Fundamentals',
  'التحكم والتمرير والتسديد، مع مباريات مصغرة.': 'Control, passing and shooting, with small-sided games.',
  'المهارة والفهم': 'Skill & understanding',
  'تطوير المهارة الفردية وفهم المراكز والعمل الجماعي.': 'Developing individual skill and understanding positions and teamwork.',
  'التكتيك والمنافسة': 'Tactics & competition',
  'تدريب تكتيكي ولياقة ومشاركة في مباريات ودية وبطولات.': 'Tactical training, fitness, and friendly matches and tournaments.',
  'المواعيد والأسعار': 'Schedule & fees',
  'اشتراك شهري موحد لجميع الفئات العمرية، مع زي رياضي صيفي للاعب.': 'One monthly fee for all age groups, with a summer sports kit for the player.',
  'الفئة': 'Age group',
  'أيام التدريب': 'Training days',
  'الوقت': 'Time',
  'الاشتراك الشهري': 'Monthly fee',
  'سبت – ثلاثاء': 'Sat – Tue',
  'أحد – أربعاء': 'Sun – Wed',
  'اثنين – خميس': 'Mon – Thu',
  '4:00 – 5:00 م': '4:00 – 5:00 PM',
  '4:00 – 5:30 م': '4:00 – 5:30 PM',
  '5:30 – 7:00 م': '5:30 – 7:00 PM',
  '50 د.ك': '50 KD',
  'د.ك': 'KD',
  'الزي الرياضي الصيفي': 'Summer sports kit',
  'الجهاز الفني': 'Coaching staff',
  'الكابتن عمرو': 'Amro',
  'الكابتن أحمد': 'Ahmed',
  'الكابتن إسلام': 'Eslam',
  'الكابتن سيد': 'Sayed',
  'أسئلة الأهالي': 'Parents’ questions',
  'كيف أسجل ابني؟': 'How do I register my child?',
  'املأ بيانات اللاعب في قسم "اصنع كارت بطلك" واضغط تسجيل، وسيصلنا طلبك على واتساب ونتواصل معك لتأكيد التفاصيل.': 'Fill in the player’s details in the “Create your hero’s card” section and tap register. Your request reaches us on WhatsApp and we will contact you to confirm the details.',
  'ما الفئات العمرية المتاحة؟': 'Which age groups are available?',
  'من تحت 6 سنوات حتى 16 سنة، في أربع فئات: تحت 6، ومن 7 إلى 9، ومن 10 إلى 12، ومن 13 إلى 16.': 'From under 6 up to 16 years old, in four groups: under 6, 7–9, 10–12 and 13–16.',
  'متى تبدأ التدريبات؟': 'When do training sessions start?',
  'الأكاديمية تحت الإنشاء حالياً، وسنعلن موعد انطلاق الدفعة المؤسسة لمن سجّل أولاً بأول.': 'The academy is currently being set up. We will announce the Founding Class start date to those who register, in order.',
  'كم تبلغ الرسوم؟': 'How much are the fees?',
  'الاشتراك الشهري 50 د.ك لجميع الفئات، والزي الرياضي الصيفي 10 د.ك.': 'The monthly fee is 50 KD for all age groups, and the summer sports kit is 10 KD.',
  'كيف أتواصل مع الإدارة؟': 'How do I reach the management?',
  'عبر واتساب الأكاديمية الموضح في قسم التواصل.': 'Via the academy’s WhatsApp listed in the Contact section.',
  'تواصل معنا': 'Contact us',
  'الهاتف / واتساب': 'Phone / WhatsApp',
  'الملعب': 'Venue',
  'ملعب ASAS، صباح السالم، الكويت': 'ASAS Stadium, Sabah Al-Salem, Kuwait',
  'انستجرام': 'Instagram',
  '© 2026 أكاديمية بريمو إيرو لكرة القدم، الكويت': '© 2026 Primo Eroe Football Academy, Kuwait',
  'تواصل واتساب': 'WhatsApp us'
};

var LANG = 'ar', ORIG = new Map(), DYN = ['cn', 'cp', 'cm', 'ca', 'pt2', 'pd'],
    TTL_AR = document.title, TTL_EN = 'Primo Eroe | Football Academy in Sabah Al-Salem, Kuwait';

function setLang(l) {
  LANG = l;
  var en = l === 'en', w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT), n, L = [];
  while (n = w.nextNode()) {
    var p = n.parentNode;
    if (p.nodeName === 'SCRIPT' || p.nodeName === 'STYLE' || DYN.indexOf(p.id) > -1) continue;
    L.push(n);
  }
  L.forEach(function (n) {
    if (!ORIG.has(n)) {
      if (!EN[n.nodeValue.trim()]) return;
      ORIG.set(n, n.nodeValue);
    }
    var o = ORIG.get(n);
    n.nodeValue = en ? o.replace(o.trim(), EN[o.trim()]) : o;
  });
  document.documentElement.lang = l;
  document.documentElement.dir = en ? 'ltr' : 'rtl';
  document.title = en ? TTL_EN : TTL_AR;
  $('n').placeholder = en ? 'e.g. Youssef' : 'مثال: يوسف';
  $('lg').textContent = en ? 'عربي' : 'EN';
  sync();
  showPos(cur);
}

$('lg').addEventListener('click', function () {
  setLang(LANG === 'ar' ? 'en' : 'ar');
});

// تحميل الكارت كصورة على المتصفح مباشرة
$('dl').addEventListener('click', async function () {
  try {
    await document.fonts.load('100px Anton');
    await document.fonts.load('800 60px Changa');
  } catch (e) {}

  var c = document.createElement('canvas');
  c.width = 900;
  c.height = 1290;
  var x = c.getContext('2d');

  var g = x.createLinearGradient(0, 0, 900, 1290);
  g.addColorStop(0, '#f0cf6b');
  g.addColorStop(.45, '#d4a528');
  g.addColorStop(1, '#8d6b12');
  x.fillStyle = g;
  x.beginPath();
  x.roundRect(0, 0, 900, 1290, 54);
  x.fill();

  var h = x.createRadialGradient(450, 0, 0, 450, 200, 950);
  h.addColorStop(0, '#1d3f8c');
  h.addColorStop(.7, '#0c2049');
  x.fillStyle = h;
  x.beginPath();
  x.roundRect(16, 16, 868, 1258, 42);
  x.fill();

  x.save();
  x.translate(340, 60);
  x.scale(1.1, 1.1);
  x.fillStyle = '#d4a528';
  x.fill(new Path2D('M100 8l5 12 13 .8-10 8 3.5 12.5L100 34l-11.5 7.3 3.5-12.5-10-8 13-.8z'));
  x.fill(new Path2D('M18 52L100 30l82 22v98c0 40-40 70-82 90C58 220 18 190 18 150z'));
  x.fillStyle = '#0c2049';
  x.fill(new Path2D('M30 62l70-19 70 19v88c0 32-32 56-70 74-38-18-70-42-70-74z'));
  x.fillStyle = '#fff';
  x.textAlign = 'center';
  x.font = '82px Anton,Impact,sans-serif';
  x.fillText('PE', 100, 140);
  x.fillStyle = '#d4a528';
  x.fillRect(56, 152, 88, 4);
  x.restore();

  x.textAlign = 'center';
  x.fillStyle = '#fff';
  x.font = '340px Anton,Impact,sans-serif';
  x.fillText($('cn').textContent, 450, 730);

  x.fillStyle = '#f0cf6b';
  x.font = '56px Anton,Impact,sans-serif';
  try { x.letterSpacing = '14px'; } catch (e) {}
  x.fillText($('cp').textContent, 450, 830);
  try { x.letterSpacing = '0px'; } catch (e) {}

  x.direction = 'rtl';
  x.fillStyle = '#fff';
  var nm = $('cm').textContent, s = 92;
  while (s > 40) {
    x.font = '800 ' + s + 'px Changa,sans-serif';
    if (x.measureText(nm).width < 780) break;
    s -= 4;
  }
  x.fillText(nm, 450, 1060);

  x.fillStyle = '#a9b4cf';
  x.font = '36px Almarai,sans-serif';
  x.fillText($('ca').textContent, 450, 1130);

  x.direction = 'ltr';
  x.fillStyle = '#d4a528';
  x.font = '30px Anton,Impact,sans-serif';
  try { x.letterSpacing = '8px'; } catch (e) {}
  x.fillText('PRIMO EROE', 450, 1210);

  var link = document.createElement('a');
  link.download = 'primo-eroe-card.png';
  link.href = c.toDataURL('image/png');
  link.click();
});