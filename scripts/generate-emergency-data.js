import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const scriptDir = fileURLToPath(new URL('.', import.meta.url))
const projectRoot = path.resolve(scriptDir, '..')
const outputDir = path.resolve(projectRoot, 'src/data/emergency')

const extracted = JSON.parse(
  fs.readFileSync(path.resolve(outputDir, 'extracted-cases.json'), 'utf8')
)

function pad(n) { return String(n).padStart(3, '0') }
function q(s) { return JSON.stringify(s ?? '') }
const LANG = ['ar','rw','sw','zh','fr','so','es','ja','ps','my','prs','fa','pt','ru','vi','de','bn','en']

// ── Title translations (all 9 languages) ─────────────────────────────────────
const titleTr = {
  'Overdose': ['جرعة زائدة','Kurasa','Kupindukia','用药过量','Surdose','Qadhaax','Sobredosis','薬物過量','زياد مصرف','ဆေးအလွန်အကျွံသောက်ခြင်း','مصرف زیاد','مصرف بیش از حد','Overdose','Передозировка','Quá liều','Überdosis','অতিরিক্ত মাত্রা','Overdose'],
  'Vomiting infant': ['رضيع يتقيأ','Ihana ruka','Mtoto anayetapika','呕吐的婴儿','Nourrisson vomissant','Dhallaanka matagga','Lactante que vomita','嘔吐する乳児','د شیدو ماشوم','နို့စို့ကလေး အန်ခြင်း','شیرخوار استفراغ','شیرخوار استفراغ','Lactente a vomitar','Младенец со рвотой','Trẻ sơ sinh nôn','Säugling erbricht','বমি করা শিশু','Vomiting infant'],
  'Altered mental status': ['تغير الحالة العقلية','Imiterere y\'ubwonko yahindutse','Hali ya akili iliyobadilika','精神状态改变','État mental altéré','Xaaladda maskaxeed oo isbeddelay','Estado mental alterado','意識変容','بدل شوی ذهني حالت','စိတ်အခြေအနေ ပြောင်းလဲခြင်း','وضعیت روانی تغییر یافته','وضعیت روانی تغییر یافته','Estado mental alterado','Измененное психическое состояние','Thay đổi trạng thái tinh thần','Veränderter Bewusstseinszustand','পরিবর্তিত মানসিক অবস্থা','Altered mental status'],
  'Chest trauma': ['صدمة صدرية','Igikomere cy\'igituza','Jeraha la kifua','胸部创伤','Traumatisme thoracique','Dhaawac laabta','Trauma torácico','胸部外傷','سینه زخم','ရင်ဘတ် ထိခိုက်ဒဏ်ရာ','ضربه قفسه سینه','ضربه قفسه سینه','Trauma torácico','Травма грудной клетки','Chấn thương ngực','Brusttrauma','বুকে আঘাত','Chest trauma'],
  'Abdominal Pain and vomiting': ['ألم بطني وتقيؤ','Ububabare bwo mu nda no kuruka','Maumivu ya tumbo na kutapika','腹痛和呕吐','Douleur abdominale et vomissements','Xanuun calool iyo matag','Dolor abdominal y vómitos','腹痛と嘔吐','نس او کېږدل او کانې','ဗိုက်နာခြင်းနှင့် အန်ခြင်း','درد شکم و استفراغ','درد شکم و استفراغ','Dor abdominal e vômito','Боль в животе и рвота','Đau bụng và nôn','Bauchschmerzen und Erbrechen','পেটে ব্যথা ও বমি','Abdominal Pain and vomiting'],
  'Weak infant': ['رضيع ضعيف','Ihana ruhante','Mtoto dhaifu','虚弱的婴儿','Nourrisson faible','Dhallaanka tabarta yar','Lactante débil','弱い乳児','ضعیف ماشوم','အားနည်းသော ကလေး','شیرخوار ضعیف','شیرخوار ضعیف','Lactente fraco','Слабый младенец','Trẻ sơ sinh yếu','Schwaches Kind','দুর্বল শিশু','Weak infant'],
  'Chest Pain': ['ألم في الصدر','Ububabare bw\'igituza','Maumivu ya kifua','胸痛','Douleur thoracique','Xanuun laabta','Dolor de pecho','胸痛','سینه دردی','ရင်ဘတ်အောင့်ခြင်း','درد قفسه سینه','درد قفسه سینه','Dor no peito','Боль в груди','Đau ngực','Brustschmerz','বুকে ব্যথা','Chest Pain'],
  'Back Pain': ['ألم في الظهر','Ububabare bw\'umugongo','Maumivu ya mgongo','背痛','Mal de dos','Xanuun dhabarka','Dolor de espalda','腰痛','شا دردی','ခါးနာခြင်း','کمر درد','کمر درد','Dor nas costas','Боль в спине','Đau lưng','Rückenschmerzen','পিঠে ব্যথা','Back Pain'],
  'Leg swelling': ['تورم في الساق','Kubyimba kw\'ukuguru','Kuvimba kwa mguu','腿部肿胀','Gonflement de la jambe','Barar lugta','Hinchazón de pierna','脚の腫れ','پړسوب پښې','ခြေထောက်ရောင်ခြင်း','ورم پا','ورم پا','Inchaço na perna','Отек ноги','Sưng chân','Beinschwellung','পা ফোলা','Leg swelling'],
  'Weakness': ['ضعف','Ubunebwe','Udhaifu','虚弱','Faiblesse','Tabaryar','Debilidad','脱力感','کمزوري','အားနည်းခြင်း','ضعف','ضعف','Fraqueza','Слабость','Yếu đuối','Schwäche','দুর্বলতা','Weakness'],
  'Eye Pain': ['ألم في العين','Ububabare bw\'ijisho','Maumivu ya jicho','眼痛','Douleur oculaire','Xanuun isha','Dolor ocular','眼痛','سترګو درد','မျက်လုံးနာခြင်း','درد چشم','درد چشم','Dor nos olhos','Боль в глазу','Đau mắt','Augenschmerzen','চোখে ব্যথা','Eye Pain'],
  'Abdominal Pain': ['ألم بطني','Ububabare bwo mu nda','Maumivu ya tumbo','腹痛','Douleur abdominale','Xanuun calool','Dolor abdominal','腹痛','نس درد','ဗိုက်နာခြင်း','درد شکم','درد شکم','Dor abdominal','Боль в животе','Đau bụng','Bauchschmerzen','পেটে ব্যথা','Abdominal Pain'],
  'Ringing in the Ears': ['رنين في الأذنين','Gushya mu matwi','Kulizia masikioni','耳鸣','Acouphènes','Dhawaq dhegaha','Zumbido en los oídos','耳鳴り','غږ په غوږونو کې','နားထဲမြည်ခြင်း','وز وز گوش','وز وز گوش','Zumbido nos ouvidos','Звон в ушах','Ù tai','Ohrensausen','কানে বাজা','Ringing in the Ears'],
  'Vomiting child': ['طفل يتقيأ','Umwana aruka','Mtoto anayetapika','呕吐的儿童','Enfant qui vomit','Ilmaha matagga','Niño que vomita','嘔吐する小児','کانې ماشوم','အန်သော ကလေး','کودک استفراغ','کودک استفراغ','Criança a vomitar','Ребенок со рвотой','Trẻ em nôn','Kind erbricht','বমি করা শিশু','Vomiting child'],
  'Snake Bite': ['لدغة أفعى','Kurumwa n\'inzoka','Kuumwa na nyoka','蛇咬伤','Morsure de serpent','Qaniinyo mas','Mordedura de serpiente','蛇咬傷','د مار چیچلو','မြွေကိုက်ခြင်း','مار گزیدگی','مار گزیدگی','Mordida de cobra','Укус змеи','Rắn cắn','Schlangenbiss','সাপের কামড়','Snake Bite'],
  'Visual impairment': ['ضعف البصر','Kubona nabi','Kutoona vizuri','视力障碍','Déficience visuelle','Aragti oo daciifday','Deterioro visual','視力障害','لید کمزوري','အမြင်အာရုံ ချို့ယွင်းခြင်း','اختلال بینایی','اختلال بینایی','Deficiência visual','Нарушение зрения','Suy giảm thị lực','Sehbehinderung','দৃষ্টি প্রতিবন্ধকতা','Visual impairment'],
  'Syncope': ['إغماء','Gusama','Kupoteza fahamu','晕厥','Syncope','Miir','Síncope','失神','سنکوپ','မေ့လဲခြင်း','سنکوپ','سنکوپ','Síncope','Обморок','Ngất','Synkope','অজ্ঞান হওয়া','Syncope'],
  'Sore throat': ['التهاب الحلق','Kubabara mu muhogo','Kuumwa koo','喉咙痛','Mal de gorge','Cunaha xanuun','Dolor de garganta','喉の痛み','د ستوني درد','လည်ချောင်းနာခြင်း','گلودرد','گلودرد','Dor de garganta','Боль в горле','Đau họng','Halsschmerzen','গলা ব্যথা','Sore throat'],
  'Knee Pain': ['ألم في الركبة','Ububabare bw\'ivi','Maumivu ya goti','膝盖疼痛','Douleur au genou','Xanuun jilibka','Dolor de rodilla','膝の痛み','زنګون درد','ဒူးနာခြင်း','درد زانو','درد زانو','Dor no joelho','Боль в колене','Đau đầu gối','Knieschmerzen','হাঁটু ব্যথা','Knee Pain'],
  'Cough': ['سعال','Gukorora','Kikohozi','咳嗽','Toux','Qufac','Tos','咳','د ټوخي','ချောင်းဆိုးခြင်း','سرفه','سرفه','Tosse','Кашель','Ho','Husten','কাশি','Cough'],
  'Flank Pain': ['ألم في الخاصرة','Ububabare mu ruhande','Maumivu ya kiuno','胁腹痛','Douleur au flanc','Xanuun dhinaca','Dolor en el flanco','側腹部痛','اړخ درد','နံရိုးအောင့်ခြင်း','درد پهلو','درد پهلو','Dor no flanco','Боль в боку','Đau hông sườn','Flankenschmerz','পার্শ্বে ব্যথা','Flank Pain'],
  'Assault to Face': ['إصابة في الوجه','Gukubitwa mu maso','Kupigwa usoni','面部袭击','Traumatisme facial','Weji dhaawac','Trauma facial','顔面外傷','مخ ته تاو','မျက်နှာကို ထိခိုက်ခြင်း','ضربه به صورت','ضربه به صورت','Agressão facial','Травма лица','Tấn công vào mặt','Gesichtsverletzung','মুখে আঘাত','Assault to Face'],
  'Burn': ['حروق','Gutwika','Kuchoma','烧伤','Brûlure','Gubasho','Quemadura','熱傷','سوځول','မီးလောင်ခြင်း','سوختگی','سوختگی','Queimadura','Ожог','Bỏng','Verbrennung','পোড়া','Burn'],
  'Vomiting Blood': ['تقيؤ دموي','Kuruka amaraso','Kutapika damu','呕血','Vomissement de sang','Dhiig matag','Vómito de sangre','吐血','د وینې کانې','သွေးအန်ခြင်း','استفراغ خون','استفراغ خون','Vômito de sangue','Рвота с кровью','Nôn ra máu','Bluterbrechen','রক্ত বমি','Vomiting Blood'],
  'Light-headedness': ['دوار خفيف','Umuzingizi','Kichwa kuzunguka','头晕','Étourdissement','Madax wareer','Mareo','ふらつき','سپک سر','ခေါင်းမူးခြင်း','سرگیجه','سرگیجه','Tontura','Головокружение','Chóng mặt','Benommenheit','মাথা ঘোরা','Light-headedness'],
  'Shortness of Breath': ['ضيق التنفس','Guhumeka nabi','Kupumua kwa shida','呼吸困难','Essoufflement','Neefsasho oo dhib badan','Dificultad para respirar','呼吸困難','د ساه لنډۍ','အသက်ရှူကျပ်ခြင်း','تنگی نفس','تنگی نفس','Falta de ar','Одышка','Khó thở','Kurzatmigkeit','শ্বাসকষ্ট','Shortness of Breath'],
  'Rash and Fever': ['طفح جلدي وحمى','Umuvi n\'umuriro','Upele na homa','皮疹和发烧','Éruption cutanée et fièvre','Fin iyo xumuro','Sarpullido y fiebre','発疹と発熱','خارش او تبه','အဖုနှင့် ဖျားခြင်း','بثور و تب','بثور و تب','Erupção e febre','Сыпь и лихорадка','Phát ban và sốt','Ausschlag und Fieber','ফুসকুড়ি ও জ্বর','Rash and Fever'],
  'Seizure': ['نوبة صرعية','Gufata','Kifafa','癫痫发作','Crise convulsive','Qallal','Convulsión','痙攣','نیول','တက်ခြင်း','تشنج','تشنج','Convulsão','Судороги','Co giật','Anfall','খিঁচুনি','Seizure'],
  'Throat swelling': ['تورم الحلق','Kubyimba mu muhogo','Kuvimba koo','喉咙肿胀','Gonflement de la gorge','Cunaha oo barara','Hinchazón de garganta','喉の腫れ','د ستوني پړسوب','လည်ချောင်းရောင်ခြင်း','ورم گلو','ورم گلو','Inchaço na garganta','Отек горла','Sưng họng','Halsschwellung','গলা ফোলা','Throat swelling'],
  'Agitation': ['هياج','Guhungabana','Msukumo','躁动','Agitation','Qallafsan','Agitación','興奮','هیجان','စိတ်လှုပ်ရှားခြင်း','هیجان','هیجان','Agitação','Возбуждение','Kích động','Erregung','উত্তেজনা','Agitation'],
  'Diarrhea': ['إسهال','Guhita','Kuhara','腹泻','Diarrhée','Shuban','Diarrea','下痢','اسهال','ဝမ်းလျှောခြင်း','اسهال','اسهال','Diarreia','Диарея','Tiêu chảy','Durchfall','ডায়রিয়া','Diarrhea'],
  'Toothache': ['ألم الأسنان','Kubabara mu nyinyo','Maumivu ya jino','牙痛','Mal de dents','Xanuun ilig','Dolor de muelas','歯痛','د غاښ درد','သွားနာခြင်း','دندان درد','درد دندان','Dor de dente','Зубная боль','Đau răng','Zahnschmerzen','দাঁত ব্যথা','Toothache'],
  'Penetrating chest trauma': ['صدمة صدرية نافذة','Igikomere cy\'igituza gicengeye','Jeraha la kifua lenye kupenya','穿透性胸部创伤','Traumatisme thoracique pénétrant','Dhaawac laabta oo gudaha gala','Trauma torácico penetrante','胸部貫通外傷','ننوڅ سینه زخم','ရင်ဘတ်ကို ထုတ်ချင်းချိုး ထိခိုက်ဒဏ်ရာ','ضربه نافذ قفسه سینه','ضربه نافذ قفسه سینه','Trauma torácico penetrante','Проникающая травма грудной клетки','Chấn thương ngực xuyên thấu','Penetrierendes Brusttrauma','বুকে বিদ্ধ আঘাত','Penetrating chest trauma'],
  'Animal Bite': ['عضة حيوان','Kurumwa n\'inyamaswa','Kuumwa na mnyama','动物咬伤','Morsure d\'animal','Qaniinyo xayawaan','Mordedura de animal','動物咬傷','د حیوان چیچلو','တိရစ္ဆာန်ကိုက်ခြင်း','حیوان گزیدگی','حیوان گزیدگی','Mordida de animal','Укус животного','Động vật cắn','Tierbiss','পশুর কামড়','Animal Bite'],
  'Headache': ['صداع','Kubabara mu mutwe','Maumivu ya kichwa','头痛','Céphalée','Madax xanuun','Dolor de cabeza','頭痛','خوږ درد','ခေါင်းကိုက်ခြင်း','سردرد','سردرد','Dor de cabeça','Головная боль','Đau đầu','Kopfschmerzen','মাথাব্যথা','Headache'],
  'Fever': ['حمى','Umuriro','Homa','发烧','Fièvre','Qandho','Fiebre','発熱','تبه','ဖျားခြင်း','تب','تب','Febre','Лихорадка','Sốt','Fieber','জ্বর','Fever'],
  'Cardiac arrest': ['سكتة قلبية','Guhagarara kw\'umutima','Kukamatika kwa moyo','心脏骤停','Arrêt cardiaque','Wadne joogsi','Paro cardíaco','心停止','زړه بندیدل','နှလုံးရပ်ခြင်း','ایست قلبی','ایست قلبی','Parada cardíaca','Остановка сердца','Ngừng tim','Herzstillstand','হৃদযন্ত্রের ক্রিয়া বন্ধ','Cardiac arrest'],
  'Rash': ['طفح جلدي','Umuvi','Upele','皮疹','Éruption cutanée','Fin','Sarpullido','発疹','خارش','အဖု','بثور','بثور','Erupção','Сыпь','Phát ban','Ausschlag','ফুসকুড়ি','Rash'],
  'Sickle-cell disease': ['مرض الخلايا المنجلية','Indwara y\'amasembabisi','Magonjwa ya seli ya mundu','镰状细胞病','Drépanocytose','Cudurka unugyada xabxabta','Enfermedad de células falciformes','鎌状赤血球症','د سکل سیل ناروغي','တံစဉ်ဆဲလ် ရောဂါ','بیماری سلول داسی شکل','بیماری سلول داسی شکل','Doença falciforme','Серповидно-клеточная болезнь','Bệnh hồng cầu hình liềm','Sichelzellanämie','সিকেল সেল রোগ','Sickle-cell disease'],
  'Palpitations': ['خفقان القلب','Gutera kw\'umutima','Kupiga moyo','心悸','Palpitations','Wadne garaac','Palpitaciones','動悸','زړه درزیدل','နှလုံးတုန်ခြင်း','تپش قلب','تپش قلب','Palpitações','Сердцебиение','Đánh trống ngực','Herzklopfen','ধড়ফড়','Palpitations'],
  'Drowning': ['غرق','Kurohama','Kuzama','溺水','Noyade','Mingis','Ahogamiento','溺水','سکون','ရေနစ်ခြင်း','غرق شدن','غرق شدن','Afogamento','Утопление','Đuối nước','Ertrinken','ডুবে যাওয়া','Drowning'],
  'Pedestrian struck': ['دهس مشاة','Kubitwa n\'imyotsi','Kugongwa na gari','行人被撞','Piéton percuté','Lugaynida dadka lugta','Atropello','歩行者衝突','پیاده وهل','လမ်းသွားသူကို တိုက်ခြင်း','عابر پیاده زده شده','عابر پیاده زده شده','Pedestre atingido','Сбит пешеход','Người đi bộ bị đâm','Fußgänger angefahren','পথচারী আহত','Pedestrian struck'],
  'Respiratory distress': ['ضيق تنفس حاد','Guhumeka nabi bikabije','Shida ya kupumua','呼吸窘迫','Détresse respiratoire','Neefsasho oo culeys leh','Dificultad respiratoria','呼吸窮迫','د تنفس ستړیا','အသက်ရှူရခက်ခြင်း','ناراحتی تنفسی','ناراحتی تنفسی','Dificuldade respiratória','Дыхательная недостаточность','Suy hô hấp','Atemnot','শ্বাসকষ্ট','Respiratory distress'],
  'Stab to chest': ['طعنة في الصدر','Gucibwa mu gituza','Kuchomwa kifuani','胸部刺伤','Coup de couteau à la poitrine','Mindhicil laabta','Puñalada en el pecho','胸部刺傷','سینه ته چاقو','ရင်ဘတ်ကို ဓားဖြင့်ထိုးခြင်း','چاقو به قفسه سینه','چاقو به قفسه سینه','Facada no peito','Ножевое ранение в грудь','Đâm vào ngực','Messerstich in die Brust','বুকে ছুরিকাঘাত','Stab to chest'],
  'Hematochezia': ['نزيف مستقيمي','Amaraso mu myanda','Damu kwenye haja','便血','Hématochézie','Dhiig xaaro','Hematopoyesis','血便','د وینې بهېدل','သွေးဝမ်းသွားခြင်း','خون در مدفوع','خون در مدفوع','Hematochezia','Гематохезия','Đi cầu ra máu','Hämatochezie','মলে রক্ত','Hematochezia'],
  'Cyanosis': ['زرقة','Ubururu bw\'uruhu','Kubadilika rangi ya ngozi','发绀','Cyanose','Ciyaan','Cianosis','チアノーゼ','سینوسیس','အရေပြားပြာခြင်း','سیانوز','سیانوز','Cianose','Цианоз','Tím tái','Zyanose','নীলাভ বর্ণ','Cyanosis'],
  'Foot Pain': ['ألم في القدم','Ububabare bw\'ikirenge','Maumivu ya mguu','足痛','Douleur au pied','Xanuun cagta','Dolor de pie','足の痛み','د پښې درد','ခြေထောက်နာခြင်း','درد پا','درد پا','Dor no pé','Боль в стопе','Đau chân','Fußschmerzen','পায়ে ব্যথা','Foot Pain'],
  'Neck Pain': ['ألم في الرقبة','Ububabare bw\'ijosi','Maumivu ya shingo','颈部疼痛','Douleur au cou','Xanuun qoorta','Dolor de cuello','首の痛み','د غاړې درد','လည်ပင်းနာခြင်း','درد گردن','درد گردن','Dor no pescoço','Боль в шее','Đau cổ','Nackenschmerzen','ঘাড়ে ব্যথা','Neck Pain'],
}

// ── Translation helpers ──────────────────────────────────────────────────────

const LANG_CODES = ['ar','rw','sw','zh','fr','so','es','ja','ps','my','prs','fa','pt','ru','vi','de','bn']

function translateText(en, lang, templates) {
  if (lang === 'en') return en
  if (templates[lang]) {
    const result = typeof templates[lang] === 'function' ? templates[lang]() : templates[lang]
    if (result) return result
  }
  return en
}

function translateQuestions(lang, tt) {
  const q1 = {
    ar: `متى بدأ ${tt}؟`, rw: `${tt} byatangiye ryari?`, sw: `${tt} ilianza lini?`,
    zh: `${tt}是什么时候开始的？`, fr: `Quand ${tt} a-t-il commencé ?`,
    so: `Goorma ayay ${tt} bilaabtay?`, es: `¿Cuándo comenzó ${tt}?`,
    ja: `${tt}はいつ始まりましたか？`,
    ps: `${tt} کله پیل شو؟`, my: `${tt} ဘယ်တော့စတာလဲ။`, prs: `${tt} از چه وقت شروع شد؟`,
    fa: `${tt} از چه زمانی شروع شد؟`, pt: `Quando ${tt} começou?`,
    ru: `${tt} началось когда?`, vi: `${tt} bắt đầu khi nào?`,
    de: `Wann begann ${tt}?`, bn: `${tt} কখন শুরু হয়েছিল?`,
  }
  return [
    q1[lang] || `When did the ${tt} start?`,
     { ar:'قيم أعراضك من 0 إلى 10.', rw:'Gereranya ibimenyetso byawe kuva 0 kugeza 10.', sw:'Tathmini dalili zako kutoka 0 hadi 10.', zh:'请给您的症状从0到10评分。', fr:'Évaluez vos symptômes de 0 à 10.', so:'Qiimee calaamadahaaga 0 ilaa 10.', es:'Evalúe sus síntomas de 0 a 10.', ja:'症状を0から10で評価してください。', ps:'نښې له ٠ څخه تر ۱۰ پورې ارزګورئ.', my:'လက္ခဏာများကို ၀ မှ ၁၀ အထိ အဆင့်သတ်မှတ်ပါ။', prs:'علائم خود را از ۰ تا ۱۰ ارزیابی کنید.', fa:'علائم خود را از ۰ تا ۱۰ ارزیابی کنید။', pt:'Avalie seus sintomas de 0 a 10.', ru:'Оцените симптомы от 0 до 10.', vi:'Đánh giá triệu chứng của bạn từ 0 đến 10.', de:'Bewerten Sie Ihre Symptome von 0 bis 10.', bn:'আপনার লক্ষণগুলি ০ থেকে ১০ পর্যন্ত মূল্যায়ন করুন।' }[lang] || `Rate your symptoms from 0 to 10.`,
     { ar:'هل حدث هذا من قبل؟', rw:'Ibi byigeze bibaho mbere?', sw:'Je, hii imewahi kutokea hapo awali?', zh:'这种情况以前发生过吗？', fr:'Est-ce déjà arrivé auparavant ?', so:'Tani hore ma u dhacday?', es:'¿Ha pasado esto antes?', ja:'これは以前にもありましたか？', ps:'آیا دا مخکې هم پیښ شوی؟', my:'ဒါမျိုး အရင်ကဖြစ်ဖူးလား။', prs:'آیا این قبلاً هم اتفاق افتاده است؟', fa:'آیا این قبلاً هم اتفاق افتاده است؟', pt:'Isso já aconteceu antes?', ru:'Было ли это раньше?', vi:'Điều này đã từng xảy ra trước đây chưa?', de:'Hatten Sie das schon einmal?', bn:'এটা কি আগেও হয়েছে?' }[lang] || `Have you had this before?`,
     { ar:'هل لديك أي أعراض أخرى؟', rw:'Ufite ibindi bimenyetso?', sw:'Una dalili nyingine zozote?', zh:'您还有其他症状吗？', fr:'Avez-vous d\'autres symptômes ?', so:'Ma leedahay calaamado kale?', es:'¿Tiene otros síntomas?', ja:'他の症状はありますか？', ps:'تاسو نورې نښې لرئ؟', my:'အခြားလက္ခဏာများ ရှိပါသလား။', prs:'آیا علائم دیگری دارید؟', fa:'آیا علائم دیگری دارید؟', pt:'Tem outros sintomas?', ru:'Есть ли другие симптомы?', vi:'Bạn có triệu chứng nào khác không?', de:'Haben Sie andere Symptome?', bn:'আপনার অন্য কোনো উপসর্গ আছে কি?' }[lang] || `Do you have any other symptoms?`,
     { ar:'ما هي الأدوية التي تتناولها؟', rw:'Ni imiti ki ufata?', sw:'Unatumia dawa gani?', zh:'您正在服用什么药物？', fr:'Quels médicaments prenez-vous ?', so:'Maxay yihiin daawooyinka aad qaadatay?', es:'¿Qué medicamentos toma?', ja:'どの薬を服用していますか？', ps:'تاسو کوم درمل اخلئ؟', my:'သင်ဘယ်ဆေးတွေ သောက်နေလဲ။', prs:'شما چه داروهایی مصرف می‌کنید؟', fa:'شما چه داروهایی مصرف می‌کنید؟', pt:'Que medicamentos você toma?', ru:'Какие лекарства вы принимаете?', vi:'Bạn đang dùng thuốc gì?', de:'Welche Medikamente nehmen Sie ein?', bn:'আপনি কী কী ওষুধ খান?' }[lang] || `What medications do you take?`,
  ]
}

function buildTranslation(titleEn, titleTrArr, condition, dx, lang) {
  const idx = LANG_CODES.indexOf(lang)
  const tt = titleTrArr ? titleTrArr[idx] : titleEn
  const lowerTt = tt.charAt(0).toLowerCase() + tt.slice(1)
  // Spanish: need gendered articles
  const isEs = lang === 'es'
  
  switch (lang) {
    case 'ar': {
      const art = ''
      return {
        title: tt,
        chiefComplaint: `المريض يعاني من ${lowerTt}.`,
        questions: translateQuestions(lang, lowerTt),
        explanations: [
          `لقد شخصنا حالتك بأنها ${dx || lowerTt}.`,
          'سنبدأ العلاج فوراً لمساعدتك على الشعور بالتحسن.',
        ],
        instructions: [
          `سنعطيك دواء لعلاج ${dx || lowerTt}.`,
          'يرجى الراحة وتجنب النشاط الشاق.',
          'سنراقب علاماتك الحيوية عن كثب.',
          'أخبرنا إذا تغيرت أعراضك.',
          'اشرب الكثير من السوائل وتناول طعاماً خفيفاً.',
        ],
        disposition: [
          'قد تحتاج إلى الدخول إلى المستشفى لمزيد من العلاج.',
          'سنرتب رعاية المتابعة قبل الخروج.',
          'يرجى اتباع جميع تعليمات الفريق الطبي.',
        ],
        followUp: sharedFU.ar,
        warningSigns: sharedWS.ar,
        diagnosis: dx ? `لقد تم تشخيصك بـ ${dx}.` : 'يتم تحديد التشخيص.',
      }
    }
    case 'rw': {
      return {
        title: tt,
        chiefComplaint: `Umunwarwayi yitwaye ${lowerTt}.`,
        questions: translateQuestions(lang, lowerTt),
        explanations: [
          `Tuguse beneguhuje ko ufite ${dx || lowerTt}.`,
          'Tuzatangira kuvura ako kanya kugirango wumve neza.',
        ],
        instructions: [
          `Tuzaguha imiti ya ${dx || lowerTt}.`,
          'Nyamuneka ruhuka kandi wirinde ibikorwa bikomeye.',
          'Tuzakurikirana ibimenyetso byawe by\'ubuzima.',
          'Tubwibe niba ibimenyetso byawe bihindutse.',
          'Nyira amazi menshi kandi urye ibiryo byoroshye.',
        ],
        disposition: [
          'Ushobora gukenera kwinjizwa mu bitaro kugirango ukomeze kuvurwa.',
          'Tuzategura ubuvuzi bwo gukurikirana mbere yo kugenda.',
          'Nyamuneka kurikiza amabwiriza yose y\'itsinda ry\'ubuvuzi.',
        ],
        followUp: sharedFU.rw,
        warningSigns: sharedWS.rw,
        diagnosis: dx ? `Wabonetse ufite ${dx}.` : 'Indwara iragenwa.',
      }
    }
    case 'sw': {
      return {
        title: tt,
        chiefComplaint: `Mgonjwa anawasilisha ${lowerTt}.`,
        questions: translateQuestions(lang, lowerTt),
        explanations: [
          `Tumekugundua una ${dx || lowerTt}.`,
          'Tutaanza matibabu mara moja kukusaidia kujisikia vizuri.',
        ],
        instructions: [
          `Tutakupa dawa kwa ${dx || lowerTt}.`,
          'Tafadhali pumzika na epuka shughuli nzito.',
          'Tutafuatilia ishara zako muhimu kwa karibu.',
          'Tujulishe ikiwa dalili zako zinabadilika.',
          'Kunywa maji mengi na kula chakula chepesi.',
        ],
        disposition: [
          'Unaweza kuhitaji kulazwa kwa matibabu zaidi.',
          'Tutapanga utunzaji wa ufuatiliaji kabla ya kutoka.',
          'Tafadhali fuata maagizo yote kutoka kwa timu ya matibabu.',
        ],
        followUp: sharedFU.sw,
        warningSigns: sharedWS.sw,
        diagnosis: dx ? `Umegundulika kuwa na ${dx}.` : 'Utambuzi bado unaendelea.',
      }
    }
    case 'zh': {
      return {
        title: tt,
        chiefComplaint: `患者出现${tt}的症状。`,
        questions: translateQuestions(lang, lowerTt),
        explanations: [
          `我们诊断您患有${dx || tt}。`,
          '我们将立即开始治疗以帮助您好转。',
        ],
        instructions: [
          `我们会给您用治疗${dx || tt}的药物。`,
          '请休息并避免剧烈活动。',
          '我们会密切监测您的生命体征。',
          '如果症状有变化请告诉我们。',
          '多喝水，吃清淡的食物。',
        ],
        disposition: [
          '您可能需要住院接受进一步治疗。',
          '出院前我们会安排后续护理。',
          '请遵守医疗团队的所有指示。',
        ],
        followUp: sharedFU.zh,
        warningSigns: sharedWS.zh,
        diagnosis: dx ? `您被诊断为${dx}。` : '诊断正在确定中。',
      }
    }
    case 'fr': {
      const gender = isFeminineFr(tt) ? 'e' : ''
      return {
        title: tt,
        chiefComplaint: `Le patient se présente avec ${lowerTt}.`,
        questions: translateQuestions(lang, lowerTt),
        explanations: [
          `Nous vous avons diagnostiqué${gender} avec ${dx || lowerTt}.`,
          'Nous allons commencer le traitement immédiatement pour vous aider à aller mieux.',
        ],
        instructions: [
          `Nous allons vous donner des médicaments pour votre ${dx || lowerTt}.`,
          'Veuillez vous reposer et éviter les activités intenses.',
          'Nous surveillerons vos signes vitaux de près.',
          'Dites-nous si vos symptômes changent.',
          'Buvez beaucoup de liquides et mangez léger.',
        ],
        disposition: [
          'Vous pourriez avoir besoin d\'être hospitalisé pour un traitement supplémentaire.',
          'Nous organiserons les soins de suivi avant votre sortie.',
          'Veuillez suivre toutes les instructions de l\'équipe médicale.',
        ],
        followUp: sharedFU.fr,
        warningSigns: sharedWS.fr,
        diagnosis: dx ? `Vous avez été diagnostiqué${gender} avec ${dx}.` : 'Votre diagnostic est en cours de détermination.',
      }
    }
    case 'so': {
      return {
        title: tt,
        chiefComplaint: `Bukaan-socdu wuxuu la yimid ${lowerTt}.`,
        questions: translateQuestions(lang, lowerTt),
        explanations: [
          `Waxaan ku ogaannay inaad qabtid ${dx || lowerTt}.`,
          'Waxaan bilaabeynaa daaweyn isla markiiba si aan kuu caawinno.',
        ],
        instructions: [
          `Waxaan ku siin doonnaa daawo ${dx || lowerTt}.`,
          'Fadlan naso oo iska ilaali hawsha culus.',
          'Waxaan si dhow ula socon doonnaa calaamadahaaga nolosha.',
          'Noo sheeg haddii calaamadahaagu isbeddelaan.',
          'Cab dareere badan oo cun cunto fudud.',
        ],
        disposition: [
          'Waxaa laga yaabaa inaad u baahato dhigista isbitaalka si aad u hesho daaweyn dheeri ah.',
          'Waxaan qabaneynaa daryeelka raadraaca ka hor intaadan bixin.',
          'Fadlan raac dhammaan tilmaamaha kooxda caafimaadka.',
        ],
        followUp: sharedFU.so,
        warningSigns: sharedWS.so,
        diagnosis: dx ? `Waxaa lagu ogaaday ${dx}.` : 'Cudurka waa la go\'minayaa.',
      }
    }
    case 'es': {
      return {
        title: tt,
        chiefComplaint: `El paciente se presenta con ${lowerTt}.`,
        questions: translateQuestions(lang, lowerTt),
        explanations: [
          `Le hemos diagnosticado ${dx || lowerTt}.`,
          'Comenzaremos el tratamiento de inmediato para ayudarle a sentirse mejor.',
        ],
        instructions: [
          `Le daremos medicamentos para su ${dx || lowerTt}.`,
          'Por favor descanse y evite actividades extenuantes.',
          'Monitorearemos sus signos vitales de cerca.',
          'Avísenos si sus síntomas cambian.',
          'Beba muchos líquidos y coma alimentos ligeros.',
        ],
        disposition: [
          'Es posible que necesite ser ingresado para recibir tratamiento adicional.',
          'Organizaremos el cuidado de seguimiento antes del alta.',
          'Por favor siga todas las instrucciones del equipo médico.',
        ],
        followUp: sharedFU.es,
        warningSigns: sharedWS.es,
        diagnosis: dx ? `Ha sido diagnosticado con ${dx}.` : 'Su diagnóstico está siendo determinado.',
      }
    }
    case 'ja': {
      return {
        title: tt,
        chiefComplaint: `患者は${tt}を呈しています。`,
        questions: translateQuestions(lang, lowerTt),
        explanations: [
          `${dx || tt}と診断されました。`,
          '気分が良くなるよう、すぐに治療を開始します。',
        ],
        instructions: [
          `${dx || tt}のためにお薬を投与します。`,
          '安静にして激しい活動を避けてください。',
          'バイタルサインを注意深く監視します。',
          '症状が変わったらお知らせください。',
          '水分をたくさん摂り、軽い食事を摂ってください。',
        ],
        disposition: [
          'さらなる治療のために入院が必要になる場合があります。',
          '退院前にフォローアップケアを手配します。',
          '医療チームの指示にすべて従ってください。',
        ],
        followUp: sharedFU.ja,
        warningSigns: sharedWS.ja,
        diagnosis: dx ? `${dx}と診断されました。` : '診断は現在確定中です。',
      }
    }
    case 'ps': {
      return {
        title: tt,
        chiefComplaint: `ناروغ د ${lowerTt} سره راځي.`,
        questions: translateQuestions(lang, lowerTt),
        explanations: [
          `موږ تاسو ته د ${dx || lowerTt} تشخیص درکړی دی.`,
          'موږ به سمدلاسه درملنه پیل کړو ترڅو تاسو ښه شئ.',
        ],
        instructions: [
          `موږ به تاسو ته د ${dx || lowerTt} لپاره درمل درکړو.`,
          'مهرباني وکړئ استراحت وکړئ او د سخت فعالیت څخه ډډه وکړئ.',
          'موږ به ستاسو حیاتي نښې له نږدې وڅارو.',
          'موږ ته خبر راکړئ که ستاسو نښې بدلې شي.',
          'ډیرې مایعات وڅښئ او سپک خواړه وخورئ.',
        ],
        disposition: [
          'تاسو ممکن د نورې درملنې لپاره داخلیدو ته اړتیا ولرئ.',
          'موږ به د رخصتیدو دمخه د تعقیب پاملرنې تنظیم کړو.',
          'مهرباني وکړئ د طبي ټیم ټولې لارښوونې تعقیب کړئ.',
        ],
        followUp: sharedFU.ps,
        warningSigns: sharedWS.ps,
        diagnosis: dx ? `تاسو ته د ${dx} تشخیص شوی دی.` : 'ستاسو تشخیص ټاکل کیږي.',
      }
    }
    case 'my': {
      return {
        title: tt,
        chiefComplaint: `လူနာသည် ${tt} ဖြင့် တင်ပြပါသည်။`,
        questions: translateQuestions(lang, lowerTt),
        explanations: [
          `သင့်တွင် ${dx || tt} ရှိကြောင်း စစ်ဆေးတွေ့ရှိပါသည်။`,
          'သင့်ကျန်းမာရေးကောင်းမွန်စေရန် ကျွန်ုပ်တို့ ချက်ချင်းကုသမှုစတင်ပါမည်။',
        ],
        instructions: [
          `သင့် ${dx || tt} အတွက် ဆေးဝါးများ ပေးပါမည်။`,
          'ကျေးဇူးပြု၍ အနားယူပြီး ပြင်းထန်သောလုပ်ဆောင်မှုများကို ရှောင်ကြဉ်ပါ။',
          'သင်၏ အရေးကြီးသော လက္ခဏာများကို အနီးကပ် စောင့်ကြည့်ပါမည်။',
          'သင့်လက္ခဏာများ ပြောင်းလဲပါက ကျွန်ုပ်တို့အား အသိပေးပါ။',
          'ရေများများသောက်ပြီး ပေါ့ပါးသော အစားအစာများ စားပါ။',
        ],
        disposition: [
          'နောက်ထပ်ကုသမှုအတွက် ဆေးရုံတက်ရန် လိုအပ်နိုင်ပါသည်။',
          'ဆေးရုံမဆင်းမီ နောက်ဆက်တွဲ စောင့်ရှောက်မှုကို စီစဉ်ပေးပါမည်။',
          'ကျေးဇူးပြု၍ ဆေးအဖွဲ့၏ ညွှန်ကြားချက်အားလုံးကို လိုက်နာပါ။',
        ],
        followUp: sharedFU.my,
        warningSigns: sharedWS.my,
        diagnosis: dx ? `သင့်တွင် ${dx} ရှိကြောင်း စစ်ဆေးတွေ့ရှိပါသည်။` : 'ရောဂါရှာဖွေခြင်း ဆက်လက်ဆောင်ရွက်နေပါသည်။',
      }
    }
    case 'prs': {
      return {
        title: tt,
        chiefComplaint: `بیمار با ${lowerTt} مراجعه می‌کند.`,
        questions: translateQuestions(lang, lowerTt),
        explanations: [
          `ما شما را با ${dx || lowerTt} تشخیص داده‌ایم.`,
          'ما درمان را فوراً شروع می‌کنیم تا به شما کمک کنیم بهتر شوید.',
        ],
        instructions: [
          `ما برای ${dx || lowerTt} به شما دارو می‌دهیم.`,
          'لطفاً استراحت کنید و از فعالیت شدید خودداری کنید.',
          'علائم حیاتی شما را از نزدیک زیر نظر داریم.',
          'اگر علائم شما تغییر کرد به ما اطلاع دهید.',
          'مایعات زیاد بنوشید و غذای سبک بخورید.',
        ],
        disposition: [
          'ممکن است برای درمان بیشتر نیاز به بستری شدن داشته باشید.',
          'ما مراقبت‌های بعدی را قبل از ترتیب مرخصی تنظیم می‌کنیم.',
          'لطفاً تمام دستورالعمل‌های تیم پزشکی را دنبال کنید.',
        ],
        followUp: sharedFU.prs,
        warningSigns: sharedWS.prs,
        diagnosis: dx ? `شما با ${dx} تشخیص داده شده‌اید.` : 'تشخیص شما در حال تعیین است.',
      }
    }
    case 'fa': {
      return {
        title: tt,
        chiefComplaint: `بیمار با ${lowerTt} مراجعه می‌کند.`,
        questions: translateQuestions(lang, lowerTt),
        explanations: [
          `ما شما را با ${dx || lowerTt} تشخیص داده‌ایم.`,
          'ما درمان را فوراً شروع می‌کنیم تا به شما کمک کنیم بهتر شوید.',
        ],
        instructions: [
          `ما برای ${dx || lowerTt} به شما دارو می‌دهیم.`,
          'لطفاً استراحت کنید و از فعالیت شدید خودداری کنید.',
          'علائم حیاتی شما را از نزدیک زیر نظر داریم.',
          'اگر علائم شما تغییر کرد به ما اطلاع دهید.',
          'مایعات زیاد بنوشید و غذای سبک بخورید.',
        ],
        disposition: [
          'ممکن است برای درمان بیشتر نیاز به بستری شدن داشته باشید.',
          'ما مراقبت‌های بعدی را قبل از ترخیص تنظیم می‌کنیم.',
          'لطفاً تمام دستورالعمل‌های تیم پزشکی را دنبال کنید.',
        ],
        followUp: sharedFU.fa,
        warningSigns: sharedWS.fa,
        diagnosis: dx ? `شما با ${dx} تشخیص داده شده‌اید.` : 'تشخیص شما در حال تعیین است.',
      }
    }
    case 'pt': {
      return {
        title: tt,
        chiefComplaint: `O paciente apresenta-se com ${lowerTt}.`,
        questions: translateQuestions(lang, lowerTt),
        explanations: [
          `Diagnosticamo-lo com ${dx || lowerTt}.`,
          'Começaremos o tratamento imediatamente para ajudá-lo a sentir-se melhor.',
        ],
        instructions: [
          `Daremos-lhe medicação para ${dx || lowerTt}.`,
          'Por favor descanse e evite atividades extenuantes.',
          'Monitorizaremos os seus sinais vitais de perto.',
          'Avise-nos se os seus sintomas mudarem.',
          'Beba muitos líquidos e coma alimentos leves.',
        ],
        disposition: [
          'Pode ser necessário ser internado para tratamento adicional.',
          'Organizaremos os cuidados de seguimento antes da alta.',
          'Por favor siga todas as instruções da equipa médica.',
        ],
        followUp: sharedFU.pt,
        warningSigns: sharedWS.pt,
        diagnosis: dx ? `Foi diagnosticado com ${dx}.` : 'O seu diagnóstico está a ser determinado.',
      }
    }
    case 'ru': {
      return {
        title: tt,
        chiefComplaint: `Пациент поступает с ${lowerTt}.`,
        questions: translateQuestions(lang, lowerTt),
        explanations: [
          `У вас диагностирован ${dx || lowerTt}.`,
          'Мы начнем лечение немедленно, чтобы помочь вам почувствовать себя лучше.',
        ],
        instructions: [
          `Мы дадим вам лекарство от ${dx || lowerTt}.`,
          'Пожалуйста, отдыхайте и избегайте интенсивных нагрузок.',
          'Мы будем внимательно следить за вашими жизненными показателями.',
          'Сообщите нам, если ваши симптомы изменятся.',
          'Пейте много жидкости и ешьте легкую пищу.',
        ],
        disposition: [
          'Возможно, вам потребуется госпитализация для дальнейшего лечения.',
          'Мы организуем последующее наблюдение перед выпиской.',
          'Пожалуйста, следуйте всем указаниям медицинской бригады.',
        ],
        followUp: sharedFU.ru,
        warningSigns: sharedWS.ru,
        diagnosis: dx ? `У вас диагностирован ${dx}.` : 'Ваш диагноз уточняется.',
      }
    }
    case 'vi': {
      return {
        title: tt,
        chiefComplaint: `Bệnh nhân đến với ${lowerTt}.`,
        questions: translateQuestions(lang, lowerTt),
        explanations: [
          `Chúng tôi đã chẩn đoán bạn bị ${dx || lowerTt}.`,
          'Chúng tôi sẽ bắt đầu điều trị ngay để giúp bạn cảm thấy tốt hơn.',
        ],
        instructions: [
          `Chúng tôi sẽ cho bạn thuốc điều trị ${dx || lowerTt}.`,
          'Vui lòng nghỉ ngơi và tránh hoạt động gắng sức.',
          'Chúng tôi sẽ theo dõi các dấu hiệu sinh tồn của bạn.',
          'Hãy cho chúng tôi biết nếu triệu chứng của bạn thay đổi.',
          'Uống nhiều nước và ăn thức ăn nhẹ.',
        ],
        disposition: [
          'Bạn có thể cần nhập viện để điều trị thêm.',
          'Chúng tôi sẽ sắp xếp chăm sóc theo dõi trước khi xuất viện.',
          'Vui lòng làm theo tất cả hướng dẫn của đội ngũ y tế.',
        ],
        followUp: sharedFU.vi,
        warningSigns: sharedWS.vi,
        diagnosis: dx ? `Bạn đã được chẩn đoán mắc ${dx}.` : 'Chẩn đoán của bạn đang được xác định.',
      }
    }
    case 'de': {
      return {
        title: tt,
        chiefComplaint: `Der Patient präsentiert sich mit ${lowerTt}.`,
        questions: translateQuestions(lang, lowerTt),
        explanations: [
          `Wir haben bei Ihnen ${dx || lowerTt} diagnostiziert.`,
          'Wir beginnen sofort mit der Behandlung, damit Sie sich besser fühlen.',
        ],
        instructions: [
          `Wir geben Ihnen Medikamente für Ihre ${dx || lowerTt}.`,
          'Bitte ruhen Sie sich aus und vermeiden Sie anstrengende Aktivitäten.',
          'Wir überwachen Ihre Vitalwerte genau.',
          'Informieren Sie uns, wenn sich Ihre Symptome ändern.',
          'Trinken Sie viel Flüssigkeit und essen Sie leichte Kost.',
        ],
        disposition: [
          'Möglicherweise müssen Sie zur weiteren Behandlung aufgenommen werden.',
          'Wir organisieren die Nachsorge vor der Entlassung.',
          'Bitte befolgen Sie alle Anweisungen des medizinischen Teams.',
        ],
        followUp: sharedFU.de,
        warningSigns: sharedWS.de,
        diagnosis: dx ? `Bei Ihnen wurde ${dx} diagnostiziert.` : 'Ihre Diagnose wird noch ermittelt.',
      }
    }
    case 'bn': {
      return {
        title: tt,
        chiefComplaint: `রোগী ${tt} নিয়ে উপস্থিত হয়েছেন।`,
        questions: translateQuestions(lang, lowerTt),
        explanations: [
          `আমরা আপনার ${dx || tt} শনাক্ত করেছি।`,
          'আপনাকে ভালো বোধ করতে আমরা এখনই চিকিৎসা শুরু করব।',
        ],
        instructions: [
          `আমরা আপনার ${dx || tt} এর জন্য ওষুধ দেব।`,
          'অনুগ্রহ করে বিশ্রাম নিন এবং কঠোর কার্যকলাপ এড়িয়ে চলুন।',
          'আমরা আপনার গুরুত্বপূর্ণ লক্ষণগুলি নিবিড়ভাবে পর্যবেক্ষণ করব।',
          'আপনার লক্ষণগুলি পরিবর্তন হলে আমাদের জানান।',
          'প্রচুর তরল পান করুন এবং হালকা খাবার খান।',
        ],
        disposition: [
          'আরও চিকিৎসার জন্য আপনাকে ভর্তি হতে পারে।',
          'আমরা ছাড়পত্রের আগে ফলো-আপ যত্নের ব্যবস্থা করব।',
          'অনুগ্রহ করে মেডিকেল টিমের সমস্ত নির্দেশনা অনুসরণ করুন।',
        ],
        followUp: sharedFU.bn,
        warningSigns: sharedWS.bn,
        diagnosis: dx ? `আপনার ${dx} শনাক্ত করা হয়েছে।` : 'আপনার রোগ নির্ণয় নির্ধারিত হচ্ছে।',
      }
    }
    default:
      return {}
  }
}

function isFeminineFr(word) {
  const feminine = ['ite','ion','tion','sie','rie','gie','nse','ue','ée','ade','ude','ure','esse']
  const lower = word.toLowerCase()
  for (const suffix of feminine) {
    if (lower.endsWith(suffix)) return true
  }
  return false
}

const DIAGNOSIS_MAP = {}
for (const c of extracted) {
  if (c.diagnosis) DIAGNOSIS_MAP[c.caseNumber] = c.diagnosis
}

const sharedFU = {
  ar: ['تابع مع طبيب الرعاية الأولية خلال أسبوع.','عد إلى قسم الطوارئ إذا عادت الأعراض.','تناول جميع الأدوية حسب التعليمات.','احتفظ بمواعيد المتابعة الخاصة بك.','اتصل بنا إذا كان لديك أي أسئلة.'],
  rw: ['Jya kubona muganga wawe mu cyumweru kimwe.','Garuka ku biro by\'impavu niba ibimenyetso byagarutse.','Fata imiti yose nk\'uko yategetswe.','Komeza amasezerano yo gukurikirana.','Naduha niba ufite ikibazo.'],
  sw: ['Fuata muuguzi wako wa msingi baada ya wiki 1.','Rudi kwenye idara ya dharura ikiwa dalili zinarudi.','Chukua dawa zote kama ulivyoagiziwa.','Weka miadi yako ya ufuatiliaji.','Tupigie ikiwa una maswali yoyote.'],
  zh: ['请在一周内随访您的家庭医生。','如果症状复发，请回急诊科。','请按处方服用所有药物。','请遵守随访预约。','如果您有任何问题，请给我们打电话。'],
  fr: ['Suivez avec votre médecin traitant dans 1 semaine.','Retournez aux urgences si les symptômes reviennent.','Prenez tous les médicaments comme prescrit.','Gardez vos rendez-vous de suivi.','Appelez-nous si vous avez des questions.'],
  so: ['La xiriir dhakhtarkaaga guud 1 usbuuc gudahood.','Ku qaybta degdega ah soo celi haddii calaamaduhu soo noqdaan.','Daawooyinka oo dhan u qaado sida laguu qoray.','Ballamahaaga la socodka ku hay.','Noo wac haddii aad qabtid su\'aalo.'],
  es: ['Siga con su médico de cabecera en 1 semana.','Regrese a la emergencia si los síntomas vuelven.','Tome todos los medicamentos según lo recetado.','Mantenga sus citas de seguimiento.','Llámenos si tiene alguna pregunta.'],
  ja: ['1週間以内に担当医のフォローアップを受けてください。','症状が再発した場合は救急外来に戻ってください。','処方された薬はすべて指示通りに服用してください。','フォローアップの予約を守ってください。','ご質問があればお電話ください。'],
  en: ['Follow up with your primary doctor in 1 week.','Return to the ED if symptoms return.','Take all medications as prescribed.','Keep your follow-up appointments.','Call us if you have any questions.'],
  ps: ['د لومړني ډاکټر سره په ۱ هفته کې تعقیب وکړئ.','بېړنۍ ته راستون شئ که نښې بیرته راشي.','ټول درمل د وړاندیز سره سم واخلئ.','د تعقیب ملاقاتونه خوندي کړئ.','موږ ته زنګ ووهئ که کومه پوښتنه لرئ.'],
  my: ['၁ ပတ်အတွင်း သင့်ဆရာဝန်ထံ နောက်ဆက်တွဲပြသပါ။','လက္ခဏာများ ပြန်ဖြစ်ပါက အရေးပေါ်ဌာနသို့ ပြန်လာပါ။','ဆေးအားလုံးကို ညွှန်ကြားသည့်အတိုင်း သောက်ပါ။','သင့်နောက်ဆက်တွဲ ချိန်းဆိုမှုများကို ထိန်းသိမ်းပါ။','မေးခွန်းများရှိပါက ကျွန်ုပ်တို့ကို ဖုန်းဆက်ပါ။'],
  prs: ['با پزشک معالج خود در ۱ هفته پیگیری کنید.','اگر علائم برگشت به اورژانس مراجعه کنید.','تمام داروها را طبق تجویز مصرف کنید.','قرارهای پیگیری خود را حفظ کنید.','اگر سوال دارید با ما تماس بگیرید.'],
  fa: ['با پزشک معالج خود در ۱ هفته پیگیری کنید.','اگر علائم برگشت به اورژانس مراجعه کنید.','تمام داروها را طبق تجویز مصرف کنید.','قرارهای پیگیری خود را حفظ کنید.','اگر سوال دارید با ما تماس بگیرید.'],
  pt: ['Siga com o seu médico de família em 1 semana.','Volte ao SU se os sintomas voltarem.','Tome todos os medicamentos conforme prescrito.','Mantenha as suas consultas de seguimento.','Ligue-nos se tiver alguma dúvida.'],
  ru: ['Проконсультируйтесь с вашим врачом через 1 неделю.','Вернитесь в отделение неотложной помощи, если симптомы вернутся.','Принимайте все лекарства по назначению.','Соблюдайте график последующих визитов.','Позвоните нам, если у вас есть вопросы.'],
  vi: ['Theo dõi với bác sĩ chính của bạn trong 1 tuần.','Quay lại phòng cấp cứu nếu triệu chứng tái phát.','Uống tất cả thuốc theo toa.','Giữ các cuộc hẹn tái khám của bạn.','Gọi cho chúng tôi nếu bạn có bất kỳ câu hỏi nào.'],
  de: ['Suchen Sie innerhalb einer Woche Ihren Hausarzt auf.','Kehren Sie in die Notaufnahme zurück, wenn die Symptome wiederkehren.','Nehmen Sie alle Medikamente wie verordnet ein.','Halten Sie Ihre Nachsorgetermine ein.','Rufen Sie uns an, wenn Sie Fragen haben.'],
  bn: ['১ সপ্তাহের মধ্যে আপনার প্রাথমিক ডাক্তারের সাথে ফলোআপ করুন।','লক্ষণগুলি ফিরে এলে জরুরি বিভাগে ফিরে আসুন।','নির্দেশ অনুযায়ী সমস্ত ওষুধ খান।','আপনার ফলো-আপ অ্যাপয়েন্টমেন্টগুলি রাখুন।','যদি কোনো প্রশ্ন থাকে তবে আমাদের কল করুন।'],
}

const sharedWS = {
  ar: ['عد إذا ساءت الأعراض.','اتصل بالإسعاف إذا كنت تعاني من ألم في الصدر أو صعوبة في التنفس.','اطلب الرعاية الفورية إذا أصبت بحمى.'],
  rw: ['Garuka niba ibimenyeso byikaze.','Hamagara 911 niba ugira ububabare mu gituza cyangwa guhumeka nabi.','Shaka ubuvuzi bwihutirwa niba ufite umuriro.'],
  sw: ['Rudi ikiwa dalili zako zinazidi kuwa mbaya.','Piga 911 ikiwa una maumivu ya kifua au shida ya kupumua.','Tafuta matibabu ya haraka ikiwa unapata homa.'],
  zh: ['如果症状加重请回急诊。','如果出现胸痛或呼吸困难，请拨打急救电话。','如果发烧请立即就医。'],
  fr: ['Revenez si vos symptômes s\'aggravent.','Appelez le 911 si vous avez des douleurs thoraciques ou des difficultés à respirer.','Consultez immédiatement si vous développez de la fièvre.'],
  so: ['Soo celi haddii calaamadahaagu sii daraan.','Wac 911 haddii aad qabtid xanuun laabta ah ama dhib neefsasho.','Raadso daryeel degdeg ah haddii aad qabtid qandho.'],
  es: ['Regrese si sus síntomas empeoran.','Llame al 911 si tiene dolor en el pecho o dificultad para respirar.','Busque atención inmediata si presenta fiebre.'],
  ja: ['症状が悪化したら戻ってください。','胸痛や呼吸困難がある場合は911に電話してください。','発熱した場合はすぐに医療機関を受診してください。'],
  en: ['Return if your symptoms get worse.','Call 911 if you have chest pain or trouble breathing.','Seek immediate care if you develop a fever.'],
  ps: ['که نښې خرابې شوې بیرته راشئ.','که د سینه درد یا د تنفس ستونزه لرئ ۹۱۱ ته زنګ ووهئ.','که تبه پیدا کړئ سمدلاسه پاملرنه وغواړئ.'],
  my: ['လက္ခဏာများ ပိုဆိုးလာပါက ပြန်လာပါ။','ရင်ဘတ်အောင့်ခြင်း သို့မဟုတ် အသက်ရှူရခက်ပါက ၉၁၁ သို့ ဖုန်းဆက်ပါ။','ဖျားလာပါက ချက်ချင်းဆေးကုသမှုခံယူပါ။'],
  prs: ['اگر علائم شما بدتر شد برگردید.','اگر درد قفسه سینه یا مشکل تنفس دارید با ۹۱۱ تماس بگیرید.','اگر تب کردید فوراً به پزشک مراجعه کنید.'],
  fa: ['اگر علائم شما بدتر شد برگردید.','اگر درد قفسه سینه یا مشکل تنفس دارید با ۹۱۱ تماس بگیرید.','اگر تب کردید فوراً به پزشک مراجعه کنید.'],
  pt: ['Volte se os seus sintomas piorarem.','Ligue para o 112 se tiver dores no peito ou dificuldade em respirar.','Procure atendimento imediato se tiver febre.'],
  ru: ['Вернитесь, если симптомы ухудшатся.','Позвоните 103, если у вас боль в груди или затруднение дыхания.','Немедленно обратитесь за помощью, если у вас поднялась температура.'],
  vi: ['Quay lại nếu triệu chứng của bạn trở nên tồi tệ hơn.','Gọi 115 nếu bạn bị đau ngực hoặc khó thở.','Tìm kiếm sự chăm sóc ngay lập tức nếu bạn bị sốt.'],
  de: ['Kommen Sie zurück, wenn sich Ihre Symptome verschlimmern.','Rufen Sie 112 an, wenn Sie Brustschmerzen oder Atembeschwerden haben.','Suchen Sie sofort einen Arzt auf, wenn Sie Fieber bekommen.'],
  bn: ['আপনার লক্ষণগুলি আরও খারাপ হলে ফিরে আসুন।','বুকে ব্যথা বা শ্বাস নিতে সমস্যা হলে ৯৯৯ এ কল করুন।','জ্বর হলে অবিলম্বে চিকিৎসা নিন।'],
}

const CATEGORY_FILES = {
  cardiac: 'cardiac', trauma: 'trauma', toxicology: 'toxicology',
  pediatric: 'pediatric', neurologic: 'neurologic', respiratory: 'respiratory',
  'gi-gu': 'gi_gu', general: 'general',
}
const CATEGORY_NAMES = {
  cardiac: 'cardiacCases', trauma: 'traumaCases', toxicology: 'toxicologyCases',
  pediatric: 'pediatricCases', neurologic: 'neurologicCases', respiratory: 'respiratoryCases',
  'gi-gu': 'giGuCases', general: 'generalCases',
}

function generateCase(c) {
  const id = `eg-${pad(c.caseNumber)}`
  const title = c.title
  const dx = (DIAGNOSIS_MAP[c.caseNumber] || '').replace(/\s*\([^)]*\)/g, '').trim()
  const cleanDx = dx

  const titleArr = titleTr[title]
  const lowerTitle = title.charAt(0).toLowerCase() + title.slice(1)

  const enQs = [
    `When did the ${lowerTitle} start?`,
    `Rate your symptoms from 0 to 10.`,
    `Have you had this before?`,
    `Do you have any other symptoms?`,
    `What medications do you take?`,
  ]

  const lines = ['  {',
    `    id: ${q(id)},`,
    `    caseNumber: ${c.caseNumber},`,
    `    category: ${q(c.category)},`,
    '    translations: {',
  ]

  for (const lang of LANG) {
    const isEn = lang === 'en'

    let trans
    if (isEn) {
      trans = {
        title,
        chiefComplaint: `Patient presents with ${lowerTitle}.`,
        questions: enQs,
        explanations: [
          `We have diagnosed you with ${cleanDx || lowerTitle}.`,
          'We will start treatment right away to help you feel better.',
        ],
        instructions: [
          `We will give you medication for your ${cleanDx || 'condition'}.`,
          'Please rest and avoid strenuous activity.',
          'We will monitor your vital signs closely.',
          'Let us know if your symptoms change.',
          'Drink plenty of fluids and eat a light diet.',
        ],
        disposition: [
          'You may need to be admitted for further treatment.',
          'We will arrange follow-up care before discharge.',
          'Please follow all instructions from the medical team.',
        ],
        followUp: sharedFU.en,
        warningSigns: sharedWS.en,
        diagnosis: cleanDx ? `You have been diagnosed with ${cleanDx}.` : 'Your diagnosis is being determined.',
      }
    } else {
      trans = buildTranslation(title, titleArr, lowerTitle, cleanDx, lang)
    }

    lines.push(`      ${lang}: {`)
    lines.push(`        title: ${q(trans.title)},`)
    lines.push(`        chiefComplaint: ${q(trans.chiefComplaint)},`)
    lines.push('        questions: [')
    for (const qq of trans.questions) lines.push(`          ${q(qq)},`)
    lines.push('        ],')
    lines.push('        explanations: [')
    for (const ex of trans.explanations) lines.push(`          ${q(ex)},`)
    lines.push('        ],')
    lines.push('        instructions: [')
    for (const inst of trans.instructions) lines.push(`          ${q(inst)},`)
    lines.push('        ],')
    lines.push('        disposition: [')
    for (const d of trans.disposition) lines.push(`          ${q(d)},`)
    lines.push('        ],')
    lines.push('        followUp: [')
    for (const f of trans.followUp) lines.push(`          ${q(f)},`)
    lines.push('        ],')
    lines.push('        warningSigns: [')
    for (const w of trans.warningSigns) lines.push(`          ${q(w)},`)
    lines.push('        ],')
    lines.push(`        diagnosis: ${q(trans.diagnosis)},`)
    lines.push('      },')
  }

  lines.push('    },')

  const cleanPearls = c.pearls ? c.pearls.replace(/\. +/g, '. ').trim() : ''
  lines.push(`    presentingComplaint: ${q(`Patient presents with ${lowerTitle}.`)},`)
  lines.push(`    vitalSigns: ${q('')},`)
  lines.push(`    examFindings: ${q('')},`)
  lines.push('    differential: [],')
  lines.push(`    workup: ${q('')},`)
  lines.push(`    diagnosis: ${q(cleanDx)},`)
  lines.push(`    criticalActions: ${JSON.stringify(c.criticalActions || [])},`)
  lines.push(`    clinicalPearls: ${q(cleanPearls)},`)
  lines.push('  },')

  return lines.join('\n')
}

const caseGroups = {}
for (const c of extracted) {
  if (!caseGroups[c.category]) caseGroups[c.category] = []
  caseGroups[c.category].push(c)
}

for (const [cat, cases] of Object.entries(caseGroups)) {
  const filename = `${CATEGORY_FILES[cat]}.ts`
  const varname = CATEGORY_NAMES[cat]
  cases.sort((a, b) => a.caseNumber - b.caseNumber)

  const body = cases.map(generateCase).join('\n\n')
  const content = `import type { EmergencyCase } from '../../types/emergency'\n\nexport const ${varname}: EmergencyCase[] = [\n${body}\n]\n`

  fs.writeFileSync(path.join(outputDir, filename), content)
  console.log(`  Wrote ${filename} (${cases.length} cases)`)
}
