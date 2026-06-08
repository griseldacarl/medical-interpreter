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
const LANG = ['ar', 'rw', 'sw', 'zh', 'fr', 'so', 'es', 'ja', 'en']

// ── Title translations (all 9 languages) ─────────────────────────────────────
const titleTr = {
  'Overdose': ['جرعة زائدة','Kurasa','Kupindukia','用药过量','Surdose','Qadhaax','Sobredosis','薬物過量','Overdose'],
  'Vomiting infant': ['رضيع يتقيأ','Ihana ruka','Mtoto anayetapika','呕吐的婴儿','Nourrisson vomissant','Dhallaanka matagga','Lactante que vomita','嘔吐する乳児','Vomiting infant'],
  'Altered mental status': ['تغير الحالة العقلية','Imiterere y\'ubwonko yahindutse','Hali ya akili iliyobadilika','精神状态改变','État mental altéré','Xaaladda maskaxeed oo isbeddelay','Estado mental alterado','意識変容','Altered mental status'],
  'Chest trauma': ['صدمة صدرية','Igikomere cy\'igituza','Jeraha la kifua','胸部创伤','Traumatisme thoracique','Dhaawac laabta','Trauma torácico','胸部外傷','Chest trauma'],
  'Abdominal Pain and vomiting': ['ألم بطني وتقيؤ','Ububabare bwo mu nda no kuruka','Maumivu ya tumbo na kutapika','腹痛和呕吐','Douleur abdominale et vomissements','Xanuun calool iyo matag','Dolor abdominal y vómitos','腹痛と嘔吐','Abdominal Pain and vomiting'],
  'Weak infant': ['رضيع ضعيف','Ihana ruhante','Mtoto dhaifu','虚弱的婴儿','Nourrisson faible','Dhallaanka tabarta yar','Lactante débil','弱い乳児','Weak infant'],
  'Chest Pain': ['ألم في الصدر','Ububabare bw\'igituza','Maumivu ya kifua','胸痛','Douleur thoracique','Xanuun laabta','Dolor de pecho','胸痛','Chest Pain'],
  'Back Pain': ['ألم في الظهر','Ububabare bw\'umugongo','Maumivu ya mgongo','背痛','Mal de dos','Xanuun dhabarka','Dolor de espalda','腰痛','Back Pain'],
  'Leg swelling': ['تورم في الساق','Kubyimba kw\'ukuguru','Kuvimba kwa mguu','腿部肿胀','Gonflement de la jambe','Barar lugta','Hinchazón de pierna','脚の腫れ','Leg swelling'],
  'Weakness': ['ضعف','Ubunebwe','Udhaifu','虚弱','Faiblesse','Tabaryar','Debilidad','脱力感','Weakness'],
  'Eye Pain': ['ألم في العين','Ububabare bw\'ijisho','Maumivu ya jicho','眼痛','Douleur oculaire','Xanuun isha','Dolor ocular','眼痛','Eye Pain'],
  'Abdominal Pain': ['ألم بطني','Ububabare bwo mu nda','Maumivu ya tumbo','腹痛','Douleur abdominale','Xanuun calool','Dolor abdominal','腹痛','Abdominal Pain'],
  'Ringing in the Ears': ['رنين في الأذنين','Gushya mu matwi','Kulizia masikioni','耳鸣','Acouphènes','Dhawaq dhegaha','Zumbido en los oídos','耳鳴り','Ringing in the Ears'],
  'Vomiting child': ['طفل يتقيأ','Umwana aruka','Mtoto anayetapika','呕吐的儿童','Enfant qui vomit','Ilmaha matagga','Niño que vomita','嘔吐する小児','Vomiting child'],
  'Snake Bite': ['لدغة أفعى','Kurumwa n\'inzoka','Kuumwa na nyoka','蛇咬伤','Morsure de serpent','Qaniinyo mas','Mordedura de serpiente','蛇咬傷','Snake Bite'],
  'Visual impairment': ['ضعف البصر','Kubona nabi','Kutoona vizuri','视力障碍','Déficience visuelle','Aragti oo daciifday','Deterioro visual','視力障害','Visual impairment'],
  'Syncope': ['إغماء','Gusama','Kupoteza fahamu','晕厥','Syncope','Miir','Síncope','失神','Syncope'],
  'Sore throat': ['التهاب الحلق','Kubabara mu muhogo','Kuumwa koo','喉咙痛','Mal de gorge','Cunaha xanuun','Dolor de garganta','喉の痛み','Sore throat'],
  'Knee Pain': ['ألم في الركبة','Ububabare bw\'ivi','Maumivu ya goti','膝盖疼痛','Douleur au genou','Xanuun jilibka','Dolor de rodilla','膝の痛み','Knee Pain'],
  'Cough': ['سعال','Gukorora','Kikohozi','咳嗽','Toux','Qufac','Tos','咳','Cough'],
  'Flank Pain': ['ألم في الخاصرة','Ububabare mu ruhande','Maumivu ya kiuno','胁腹痛','Douleur au flanc','Xanuun dhinaca','Dolor en el flanco','側腹部痛','Flank Pain'],
  'Assault to Face': ['إصابة في الوجه','Gukubitwa mu maso','Kupigwa usoni','面部袭击','Traumatisme facial','Weji dhaawac','Trauma facial','顔面外傷','Assault to Face'],
  'Burn': ['حروق','Gutwika','Kuchoma','烧伤','Brûlure','Gubasho','Quemadura','熱傷','Burn'],
  'Vomiting Blood': ['تقيؤ دموي','Kuruka amaraso','Kutapika damu','呕血','Vomissement de sang','Dhiig matag','Vómito de sangre','吐血','Vomiting Blood'],
  'Light-headedness': ['دوار خفيف','Umuzingizi','Kichwa kuzunguka','头晕','Étourdissement','Madax wareer','Mareo','ふらつき','Light-headedness'],
  'Shortness of Breath': ['ضيق التنفس','Guhumeka nabi','Kupumua kwa shida','呼吸困难','Essoufflement','Neefsasho oo dhib badan','Dificultad para respirar','呼吸困難','Shortness of Breath'],
  'Rash and Fever': ['طفح جلدي وحمى','Umuvi n\'umuriro','Upele na homa','皮疹和发烧','Éruption cutanée et fièvre','Fin iyo xumuro','Sarpullido y fiebre','発疹と発熱','Rash and Fever'],
  'Seizure': ['نوبة صرعية','Gufata','Kifafa','癫痫发作','Crise convulsive','Qallal','Convulsión','痙攣','Seizure'],
  'Throat swelling': ['تورم الحلق','Kubyimba mu muhogo','Kuvimba koo','喉咙肿胀','Gonflement de la gorge','Cunaha oo barara','Hinchazón de garganta','喉の腫れ','Throat swelling'],
  'Agitation': ['هياج','Guhungabana','Msukumo','躁动','Agitation','Qallafsan','Agitación','興奮','Agitation'],
  'Diarrhea': ['إسهال','Guhita','Kuhara','腹泻','Diarrhée','Shuban','Diarrea','下痢','Diarrhea'],
  'Toothache': ['ألم الأسنان','Kubabara mu nyinyo','Maumivu ya jino','牙痛','Mal de dents','Xanuun ilig','Dolor de muelas','歯痛','Toothache'],
  'Penetrating chest trauma': ['صدمة صدرية نافذة','Igikomere cy\'igituza gicengeye','Jeraha la kifua lenye kupenya','穿透性胸部创伤','Traumatisme thoracique pénétrant','Dhaawac laabta oo gudaha gala','Trauma torácico penetrante','胸部貫通外傷','Penetrating chest trauma'],
  'Animal Bite': ['عضة حيوان','Kurumwa n\'inyamaswa','Kuumwa na mnyama','动物咬伤','Morsure d\'animal','Qaniinyo xayawaan','Mordedura de animal','動物咬傷','Animal Bite'],
  'Headache': ['صداع','Kubabara mu mutwe','Maumivu ya kichwa','头痛','Céphalée','Madax xanuun','Dolor de cabeza','頭痛','Headache'],
  'Fever': ['حمى','Umuriro','Homa','发烧','Fièvre','Qandho','Fiebre','発熱','Fever'],
  'Cardiac arrest': ['سكتة قلبية','Guhagarara kw\'umutima','Kukamatika kwa moyo','心脏骤停','Arrêt cardiaque','Wadne joogsi','Paro cardíaco','心停止','Cardiac arrest'],
  'Rash': ['طفح جلدي','Umuvi','Upele','皮疹','Éruption cutanée','Fin','Sarpullido','発疹','Rash'],
  'Sickle-cell disease': ['مرض الخلايا المنجلية','Indwara y\'amasembabisi','Magonjwa ya seli ya mundu','镰状细胞病','Drépanocytose','Cudurka unugyada xabxabta','Enfermedad de células falciformes','鎌状赤血球症','Sickle-cell disease'],
  'Palpitations': ['خفقان القلب','Gutera kw\'umutima','Kupiga moyo','心悸','Palpitations','Wadne garaac','Palpitaciones','動悸','Palpitations'],
  'Drowning': ['غرق','Kurohama','Kuzama','溺水','Noyade','Mingis','Ahogamiento','溺水','Drowning'],
  'Pedestrian struck': ['دهس مشاة','Kubitwa n\'imyotsi','Kugongwa na gari','行人被撞','Piéton percuté','Lugaynida dadka lugta','Atropello','歩行者衝突','Pedestrian struck'],
  'Respiratory distress': ['ضيق تنفس حاد','Guhumeka nabi bikabije','Shida ya kupumua','呼吸窘迫','Détresse respiratoire','Neefsasho oo culeys leh','Dificultad respiratoria','呼吸窮迫','Respiratory distress'],
  'Stab to chest': ['طعنة في الصدر','Gucibwa mu gituza','Kuchomwa kifuani','胸部刺伤','Coup de couteau à la poitrine','Mindhicil laabta','Puñalada en el pecho','胸部刺傷','Stab to chest'],
  'Hematochezia': ['نزيف مستقيمي','Amaraso mu myanda','Damu kwenye haja','便血','Hématochézie','Dhiig xaaro','Hematopoyesis','血便','Hematochezia'],
  'Cyanosis': ['زرقة','Ubururu bw\'uruhu','Kubadilika rangi ya ngozi','发绀','Cyanose','Ciyaan','Cianosis','チアノーゼ','Cyanosis'],
  'Foot Pain': ['ألم في القدم','Ububabare bw\'ikirenge','Maumivu ya mguu','足痛','Douleur au pied','Xanuun cagta','Dolor de pie','足の痛み','Foot Pain'],
  'Neck Pain': ['ألم في الرقبة','Ububabare bw\'ijosi','Maumivu ya shingo','颈部疼痛','Douleur au cou','Xanuun qoorta','Dolor de cuello','首の痛み','Neck Pain'],
}

// ── Translation helpers ──────────────────────────────────────────────────────

const LANG_CODES = ['ar','rw','sw','zh','fr','so','es','ja']

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
  }
  return [
    q1[lang] || `When did the ${condition} start?`,
    { ar:'قيم أعراضك من 0 إلى 10.', rw:'Gereranya ibimenyetso byawe kuva 0 kugeza 10.', sw:'Tathmini dalili zako kutoka 0 hadi 10.', zh:'请给您的症状从0到10评分。', fr:'Évaluez vos symptômes de 0 à 10.', so:'Qiimee calaamadahaaga 0 ilaa 10.', es:'Evalúe sus síntomas de 0 a 10.', ja:'症状を0から10で評価してください。' }[lang] || `Rate your symptoms from 0 to 10.`,
    { ar:'هل حدث هذا من قبل؟', rw:'Ibi byigeze bibaho mbere?', sw:'Je, hii imewahi kutokea hapo awali?', zh:'这种情况以前发生过吗？', fr:'Est-ce déjà arrivé auparavant ?', so:'Tani hore ma u dhacday?', es:'¿Ha pasado esto antes?', ja:'これは以前にもありましたか？' }[lang] || `Have you had this before?`,
    { ar:'هل لديك أي أعراض أخرى؟', rw:'Ufite ibindi bimenyetso?', sw:'Una dalili nyingine zozote?', zh:'您还有其他症状吗？', fr:'Avez-vous d\'autres symptômes ?', so:'Ma leedahay calaamado kale?', es:'¿Tiene otros síntomas?', ja:'他の症状はありますか？' }[lang] || `Do you have any other symptoms?`,
    { ar:'ما هي الأدوية التي تتناولها؟', rw:'Ni imiti ki ufata?', sw:'Unatumia dawa gani?', zh:'您正在服用什么药物？', fr:'Quels médicaments prenez-vous ?', so:'Maxay yihiin daawooyinka aad qaadatay?', es:'¿Qué medicamentos toma?', ja:'どの薬を服用していますか？' }[lang] || `What medications do you take?`,
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
