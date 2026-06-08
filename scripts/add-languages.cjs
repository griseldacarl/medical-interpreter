#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');

const translations = {
  // ===== SKELETAL TERMS =====
  'bone': { ps:'استخونه', my:'အရိုး', prs:'استخوان', fa:'استخوان', pt:'osso', ru:'кость', vi:'xương', de:'Knochen', bn:'হাড়' },
  'skull': { ps:'جمجمه', my:'ဦးခေါင်း', prs:'جمجمه', fa:'جمجمه', pt:'crânio', ru:'череп', vi:'sọ', de:'Schädel', bn:'খুলি' },
  'cranium': { ps:'جمجمه', my:'ဦးခေါင်း', prs:'جمجمه', fa:'جمجمه', pt:'crânio', ru:'череп', vi:'sọ', de:'Schädel', bn:'খুলি' },
  'mandible': { ps:'فک', my:'下巴', prs:'فک پایین', fa:'فک پایین', pt:'mandíbula', ru:'нижняя челюсть', vi:'xương hàm', de:'Unterkiefer', bn:'ঠোঁটের হাড়' },
  'clavicle': { ps:'تړقوه', my:'ပခုံးရိုး', prs:'استخوان ترقوه', fa:'استخوان ترقوه', pt:'clavícula', ru:'ключица', vi:'xương đòn', de:'Schlüsselbein', bn:'ক্লাভিকল' },
  'scapula': { ps:'ږرګله', my:'肩胛骨', prs:'کتف', fa:'کتف', pt:'omóplato', ru:'лопатка', vi:'xương bả vai', de:'Schulterblatt', bn:'স্ক্যাপুলা' },
  'sternum': { ps:'سینه استخونه', my:'ရင်ညွှန်းရိုး', prs:'استخوان سینه', fa:'استخوان سینه', pt:'esterno', ru:'грудина', vi:'xương ức', de:'Brustbein', bn:'বুকের হাড়' },
  'rib': { ps:'دن', my:'ကျောကင်ရိုး', prs:'دنده', fa:'دنده', pt:'costela', ru:'ребро', vi:'xương sườn', de:'Rippe', bn:'পাঁজর' },
  'vertebra': { ps:'مهره', my:'ကျောရိုး', prs:'مهره', fa:'مهره', pt:'vértebra', ru:'позвонок', vi:'đốt sống', de:'Wirbel', bn:'মেরুদণ্ড' },
  'spine': { ps:'درید', my:'ကျောရိုးတန်း', prs:'ستون فقرات', fa:'ستون فقرات', pt:'coluna vertebral', ru:'позвоночник', vi:'cột sống', de:'Wirbelsäule', bn:'মেরুদণ্ড' },
  'pelvis': { ps:'لاشکر', my:'ခါးရိုး', prs:'لگن', fa:'لگن', pt:'pelve', ru:'таз', vi:'khung chậu', de:'Becken', bn:'পেলভিস' },
  'femur': { ps:'ران استخونه', my:'ပေါင်ရိုး', prs:'استخوان ران', fa:'استخوان ران', pt:'fêmur', ru:'бедренная кость', vi:'xương đùi', de:'Oberschenkelknochen', bn:'ফিমার' },
  'patella': { ps:'زانو استخونه', my:'ဒူးရိုး', prs:'کشکک', fa:'کشکک', pt:'rótula', ru:'надколенник', vi:'xương bánh chè', de:'Kniescheibe', bn:'পাটেলা' },
  'tibia': { ps:'ساق استخونه', my:'ခြေသလုံးရိုး', prs:'درشت‌نی', fa:'درشت‌نی', pt:'tíbia', ru:'большая берцовая кость', vi:'xương ống chân', de:'Schienbein', bn:'টিবিয়া' },
  'fibula': { ps:'نازک استخونه', my:'ခြေသလွှားရိုး', prs:'نازک‌نی', fa:'نازک‌نی', pt:'fíbula', ru:'малоберцовая кость', vi:'xương mác', de:'Wadenbein', bn:'ফিবুলা' },
  'humerus': { ps:'بازو استخونه', my:'လက်မောင်းရိုး', prs:'استخوان بازو', fa:'استخوان بازو', pt:'úmero', ru:'плечевая кость', vi:'xương cánh tay', de:'Oberarmknochen', bn:'হিউমেরাস' },
  'radius': { ps:'پړکښ', my:'လက်ကောက်ဝက်ရိုی', prs:'پرگاری', fa:'پرگاری', pt:'rádio', ru:'лучевая кость', vi:'xương quay', de:'Speiche', bn:'রেডিয়াস' },
  'ulna': { ps:'زند', my:'လက်ဖျံရိုး', prs:'زند', fa:'زند', pt:'cúbito', ru:'локтевая кость', vi:'xương trụ', de:'Elle', bn:'আলনা' },
  'carpals': { ps:'مچ استخونه', my:'လက်ကောက်ဝက်အရိုးများ', prs:'استخوان‌های مچ', fa:'استخوان‌های مچ', pt:'carpos', ru:'запястье', vi:'xương cổ tay', de:'Handwurzelknochen', bn:'কার্পাল' },
  'metacarpals': { ps:'مشت استخونه', my:'လက်ဖဝါးရိုးများ', prs:'استخوان‌های کف دست', fa:'استخوان‌های کف دست', pt:'metacarpos', ru:'пястье', vi:'xương bàn tay', de:'Mittelhandknochen', bn:'মেটাকার্পাল' },
  'phalanges': { ps:'انگشتان استخونه', my:'လက်ချောင်းရိုးများ', prs:'انگشتان', fa:'انگشتان', pt:'falanges', ru:'фаланги', vi:'xương ngón tay', de:'Fingerglieder', bn:'ফ্যালান্জ' },
  'tarsals': { ps:'پښتی استخونه', my:'ခြေကျင်ရိုးများ', prs:'استخوان‌های مچ پا', fa:'استخوان‌های مچ پا', pt:'tarsos', ru:' предплюсна', vi:'xương cổ chân', de:'Fußwurzelknochen', bn:'টার্সাল' },
  'metatarsals': { ps:'مشت پښتی استخونه', my:'ခြေဖဝါးရိုးများ', prs:'استخوان‌های کف پا', fa:'استخوان‌های کف پا', pt:'metatarsos', ru:'плюсна', vi:'xương bàn chân', de:'Mittelfußknochen', bn:'মেটাটার্সাল' },
  'coccyx': { ps:'دم استخونه', my:'အမြီးရိုး', prs:'دم‌نبش', fa:'دم‌نبش', pt:'cóccix', ru:'копчик', vi:'xương cụt', de:'Steißbein', bn:'কক্সিক্স' },
  'sacrum': { ps:'خرج استخونه', my:'ခါးရိုးအောက်ပိုင်း', prs:'خرسنگ', fa:'خرسنگ', pt:'sacro', ru:'крестец', vi:'xương cùng', de:'Kreuzbein', bn:'সেক্রাম' },
  'maxilla': { ps:'فک پور', my:'အပေါ် Jaw', prs:'فک بالا', fa:'فک بالا', pt:'maxila', ru:'верхняя челюсть', vi:'xương hàm trên', de:'Oberkiefer', bn:'ম্যাক্সিলা' },
  'zygomatic bone': { ps:'گونه استخونه', my:'ပါးရိုး', prs:'استخوان گونه', fa:'استخوان گونه', pt:'zigomático', ru:'скуловая кость', vi:'xương gò má', de:'Wangenbein', bn:'জাইগোমাটিক হাড়' },
  'temporal bone': { ps:'ځانګه استخونه', my:'ရစ်ရိုး', prs:'استخوان گیجگاهی', fa:'استخوان گیجگاهی', pt:'temporal', ru:'височная кость', vi:'xương thái dương', de:'Schläfenbein', bn:'টেম্পোরাল হাড়' },

  // ===== MUSCULAR TERMS =====
  'muscle': { ps:'عضله', my:'ကြွက်သား', prs:'عضله', fa:'عضله', pt:'músculo', ru:'мышца', vi:'cơ', de:'Muskel', bn:'পেশি' },
  'biceps': { ps:'دوسره عضله', my:'ဘိုက်ဆပ်', prs:'عضله دوسربازو', fa:'عضله دوسربازو', pt:'bíceps', ru:'бицепс', vi:'cơ tam đầu', de:'Bizeps', bn:'বাইসেপস' },
  'triceps': { ps:'درسره عضله', my:'ထရိဆပ်', prs:'عضله سه‌سر بازو', fa:'عضله سه‌سر بازو', pt:'tríceps', ru:'трицепс', vi:'cơ tam đầu', de:'Trizeps', bn:'ট্রাইসেপস' },
  'quadriceps': { ps:'څلورسره عضله', my:'ကွာဒ်ရိဆပ်', prs:'عضله چهارسر ران', fa:'عضله چهارسر ران', pt:'quadríceps', ru:'четырехглавая мышца', vi:'cơ tứ đầu', de:'Quadrizeps', bn:'কোয়াড্রাইসেপস' },
  'deltoid': { ps:'شانه عضله', my:'ဒယ်လ်တွိုက်', prs:'عضله مثلثی شانه', fa:'عضله مثلثی شانه', pt:'deltóide', ru:'дельтовидная мышца', vi:'cơ delta', de:'Deltamuskel', bn:'ডেলটয়েড' },
  'pectoralis major': { ps:'سینه عضله', my:'ရင်ဘက်ကြီးကြွက်သား', prs:'عضله سینه‌ای بزرگ', fa:'عضله سینه‌ای بزرگ', pt:'peitoral maior', ru:'большая грудная мышца', vi:'cơ ngực lớn', de:'Brustmuskel', bn:'পেক্টোরালিস মেজর' },
  'trapezius': { ps:'ټریپیزیس', my:'ထရပ်ဇီယပ်', prs:'ذوزنقه‌ای', fa:'ذوزنقه‌ای', pt:'trapézio', ru:'трапециевидная мышца', vi:'cơ thang', de:'Trapezmuskel', bn:'ট্র্যাপিজিয়াস' },
  'latissimus dorsi': { ps:'ورځ عضله', my:'ကျောကြွက်သားကြီး', prs:'عضله پشتی بزرگ', fa:'عضله پشتی بزرگ', pt:'grande dorsal', ru:'широчайшая мышца спины', vi:'cơ lưng rộng', de:'Breitmuskel', bn:'ল্যাটিসিমাস ডর্সাই' },
  'gluteus maximus': { ps:'کرکټ عضله', my:'စအိုကြွက်သားကြီး', prs:'عضله باسنی بزرگ', fa:'عضله باسنی بزرگ', pt:'glúteo maior', ru:'ягодичная мышца', vi:'cơ mông lớn', de:'Großer Gesäßmuskel', bn:'গ্লুটিয়াস ম্যাক্সিমাস' },
  'hamstrings': { ps:'ورځ عضله', my:'ဒူးခေါင်းကြွက်သား', prs:'عضلات همسترینگ', fa:'عضلات همسترینگ', pt:'isquiotibiais', ru:'задняя поверхность бедра', vi:'cơ hamstring', de:'Oberschenkelrückseite', bn:'হ্যামস্ট্রিং' },
  'gastrocnemius': { ps:'ساق عضله', my:'ခြေသလုံးကြွက်သား', prs:'عضله ساق پا', fa:'عضله ساق پا', pt:'gastrocnêmio', ru:'икроножная мышца', vi:'cơ bắp chân', de:'Wadenmuskel', bn:'গ্যাস্ট্রোকনেমিয়াস' },
  'soleus': { ps:'ساق عضله', my:'ဖနောင့်ကြွက်သား', prs:'عضله نعلی', fa:'عضله نعلی', pt:'sóleo', ru:'камбаловидная мышца', vi:'cơ soleus', de:'Sohlenmuskel', bn:'সোলিয়াস' },
  'rectus abdominis': { ps:'شکم عضله', my:'ဗိုက်ကြွက်သား', prs:'عضله شکمی مستقیم', fa:'عضله شکمی مستقیم', pt:'reto abdominal', ru:'прямая мышца живота', vi:'cơ thẳng bụng', de:'gerader Bauchmuskel', bn:'রেক্টাস অ্যাবডমিনিস' },
  'external oblique': { ps:'بیرونی مایل عضله', my:'အပြင်ဘက်စောင်းကြွက်သာی', prs:'عضله مایل خارجی', fa:'عضله مایل خارجی', pt:'obliquos externos', ru:'наружная косая мышца', vi:'cơ xiên ngoài', de:'Äußerer Schrägmuskel', bn:'এক্সটার্নাল অবলিক' },
  'diaphragm': { ps:'پردې', my:'အသက်ရှူကြွက်သား', prs:'حجاب حاجز', fa:'حجاب حاجز', pt:'diafragma', ru:'диафрагма', vi:'cơ hoành', de:'Zwerchfell', bn:'ডায়াф্রাম' },
  'masseter': { ps:'جوع عضله', my:' челွက်ကြီးကြွက်သား', prs:'عضله ماسژتر', fa:'عضله ماسژتر', pt:'masseter', ru:'жевательная мышца', vi:'cơ nhai', de:'Kauwulst', bn:'ম্যাসেটার' },
  'sternocleidomastoid': { ps:'سینه ترقویی عضله', my:'ရင်ညွှန်းပခုံးကြွက်သား', prs:'عضله استرنوکلیدوماستوئید', fa:'عضله استرنوکلیدوماستوئید', pt:'esternocleidomastoideo', ru:'грудино-ключично-сосцевидная мышца', vi:'cơ ức đòn chũm', de:'Brustmuskel-Schlüsselbein-Mastoid-Muskel', bn:'স্টারনোক্লিডোমাস্টয়েড' },
  'tibialis anterior': { ps:'مخکینی ساق عضله', my:'ရှေ့ခြေသလုံးကြွက်သား', prs:'عضله ساق پای قدامی', fa:'عضله ساق پای قدامی', pt:'tibial anterior', ru:'передняя большеберцовая мышца', vi:'cơ chày trước', de:'vorderer Schienbeinmuskel', bn:'টিবিয়ালিস অ্যান্টেরিয়র' },
  'extensor': { ps:'راوغونکی عضله', my:'ဆန့်ကျင်ကြွက်သား', prs:'عضله بازکننده', fa:'عضله بازکننده', pt:'extensor', ru:'разгибатель', vi:'cơ duỗi', de:'Strecker', bn:'এক্সটেন্সর' },
  'flexor': { ps:'غوتنکی عضله', my:'ကွေးကြွက်သား', prs:'عضله خم‌کننده', fa:'عضله خم‌کننده', pt:'flexor', ru:'сгибатель', vi:'cơ gấp', de:'Beuger', bn:'ফ্লেক্সর' },
  'sartorius': { ps:'خیاط عضله', my:'ခရုကြွက်သား', prs:'عضله خیاطی', fa:'عضله خیاطی', pt:'sartório', ru:' портняжняя мышца', vi:'cơ may', de:'Schneidermuskel', bn:'সার্টোরিয়াস' },
  'adductor longus': { ps:'دراز نژد عضله', my:'ရှည်ဆွဲကြွက်သား', prs:'عضله نزدیک‌کننده دراز', fa:'عضله نزدیک‌کننده دراز', pt:'adutor longo', ru:'длинная приводящая мышца', vi:'cơ khép dài', de:'langer Adduktor', bn:'অ্যাডাক্টর লংগাস' },
  'abductor': { ps:'لاړ نژد عضله', my:'ဖြန့်ကြွက်သား', prs:'عضله دورکننده', fa:'عضله دورکننده', pt:'abdutor', ru:'отводящая мышца', vi:'cơ dạng', de:'Abduktor', bn:'অ্যাবডাক্টর' },
  'sphincter': { ps:'حلقه عضله', my:'ဝိုင်းကြွက်သား', prs:'عضله اسفنکتر', fa:'عضله اسفنکتر', pt:'esfíncter', ru:'сфинктер', vi:'cơ vòng', de:'Schließmuskel', bn:'স্ফিঙ্কটার' },

  // ===== POSITION TERMS =====
  'anterior': { ps:'مخکینی', my:'ရှေ့', prs:'قدامی', fa:'قدامی', pt:'anterior', ru:'передний', vi:'phía trước', de:'vorne', bn:'সামনের' },
  'posterior': { ps:'شیانی', my:'နောက်', prs:'خلفی', fa:'خلفی', pt:'posterior', ru:'задний', vi:'phía sau', de:'hinten', bn:'পেছনের' },
  'superior': { ps:'پورتی', my:'အပေါ်', prs:'فوقانی', fa:'فوقانی', pt:'superior', ru:'верхний', vi:'phía trên', de:'oberhalb', bn:'উপরের' },
  'inferior': { ps:'تهتی', my:'အောက်', prs:'تحتانی', fa:'تحتانی', pt:'inferior', ru:'нижний', vi:'phía dưới', de:'unterhalb', bn:'নিচের' },
  'medial': { ps:'انسینی', my:'အတွင်းဘက်', prs:'داخلی', fa:'داخلی', pt:'medial', ru:'средний', vi:'mặt trong', de:'innenseitig', bn:'মধ্যবর্তী' },
  'lateral': { ps:'شهیدی', my:'အပြင်ဘက်', prs:'خارجی', fa:'خارجی', pt:'lateral', ru:'боковой', vi:'mặt ngoài', de:'außenseitig', bn:'পার্শ্বীয়' },
  'proximal': { ps:'د نزدیک', my:'အနီးဘက်', prs:'نزدیک', fa:'نزدیک', pt:'proximal', ru:'проксимальный', vi:'gần', de:'proximal', bn:'প্রক্সিমাল' },
  'distal': { ps:'د لرې', my:'အဝေးဘက်', prs:'دور', fa:'دور', pt:'distal', ru:'дистальный', vi:'xa', de:'distal', bn:'ডিস্টাল' },
  'superficial': { ps:'سطحی', my:'မျက်နှာပြင်', prs:'سطحی', fa:'سطحی', pt:'superficial', ru:'поверхностный', vi:'nông', de:'oberflächlich', bn:'পৃষ্ঠতলীয়' },
  'deep': { ps:'ژر', my:'နက်ရှိုင်း', prs:'عمیق', fa:'عمیق', pt:'profundo', ru:'глубокий', vi:'sâu', de:'tief', bn:'গভীর' },
  'central': { ps:'مرکزی', my:'ဗဟို', prs:'مرکزی', fa:'مرکزی', pt:'central', ru:'центральный', vi:'tâm', de:'zentral', bn:'কেন্দ্রীয়' },
  'peripheral': { ps:'حاشیوي', my:'ဘေးဘက်', prs:'محیطی', fa:'محیطی', pt:'periférico', ru:'периферический', vi:'ngoại vi', de:'peripher', bn:'পরিধীয়' },
  'dorsal': { ps:'زهري', my:'ကျောဘက်', prs:'پشتی', fa:'پشتی', pt:'dorsal', ru:'дорсальный', vi:'mặt lưng', de:'Rücken-', bn:'পৃষ্ঠীয়' },
  'ventral': { ps:'شکمی', my:'ဗိုက်ဘက်', prs:'شکمی', fa:'شکمی', pt:'ventral', ru:'вентральный', vi:'mặt bụng', de:'Bauch-', bn:'পেল্ভিক' },
  'cranial': { ps:'مغزی', my:'ဦးနှောက်ဘက်', prs:'جمجمه‌ای', fa:'جمجمه‌ای', pt:'cranial', ru:'черепной', vi:'sọ', de:'Schädel-', bn:'ক্রেনিয়াল' },
  'caudal': { ps:'دمی', my:'အမြီးဘက်', prs:'دمی', fa:'دمی', pt:'caudal', ru:'каудальный', vi:'đuôi', de:'schwanzwärts', bn:'কডাল' },
  'rostral': { ps:'خندید', my:'နှုတ်ခမ်းဘက်', prs:'منقاری', fa:'منقاری', pt:'rostral', ru:'ростральный', vi:'mỏ', de:'schnabelwärts', bn:'রোস্ট্রাল' },
  'sagittal': { ps:'سهمی', my:'မြားပုံစံ', prs:'سهمی', fa:'سهمی', pt:'sagital', ru:'сагиттальный', vi:'sagittal', de:'sagittal', bn:'সাজিটাল' },
  'coronal': { ps:'تاجی', my:'ထိပ်ဘက်', prs:'تاجی', fa:'تاجی', pt:'coronal', ru:'венечный', vi:'vương miện', de:'koronal', bn:'করোনাল' },
  'transverse': { ps:'عرضي', my:'အလျားလိုက်', prs:'عرضی', fa:'عرضی', pt:'transverso', ru:'поперечный', vi:'ngang', de:'quer', bn:'ট্রান্সভার্স' },
  'median': { ps:'ناصف', my:'အလယ်', prs:'میانی', fa:'میانی', pt:'medio', ru:'срединный', vi:'giữa', de:'Mittel-', bn:'মধ্য' },
  'prone': { ps:'د مخ په', my:'ဝမ်းလျားအိပ်', prs:'شکمی', fa:'شکمی', pt:'prono', ru:'на животе', vi:'nằm sấp', de:'bauchwärts', bn:'প্রোন' },
  'supine': { ps:'د پشت په', my:'ပက်လက်အိပ်', prs:'پشتی', fa:'پشتی', pt:'supino', ru:'на спине', vi:'nằm ngửa', de:'rückwärts', bn:'সুপাইন' },
  'ipsilateral': { ps:'د یوه لټه', my:'တစ်ဖက်တည်း', prs:'هم‌پهلو', fa:'هم‌پهلو', pt:'ipsilateral', ru:'односторонний', vi:'cùng bên', de:'gleichseitig', bn:'ইপসিল্যাটারাল' },
  'contralateral': { ps:'مخالف لټه', my:'ဆန့်ကျင်ဖက်', prs:'خلاف پهلو', fa:'خلاف پهلو', pt:'contralateral', ru:'противоположный', vi:'bên đối diện', de:'gegenüberliegend', bn:'কন্ট্রাল্যাটারাল' },
  'bilateral': { ps:'د دوو لټو', my:'နှစ်ဖက်စလုံး', prs:'دوطرفه', fa:'دوطرفه', pt:'bilateral', ru:'двусторонний', vi:'hai bên', de:'beidseitig', bn:'বাইল্যাটারাল' },
  'palmar': { ps:'لاسډی', my:'လက်ဖဝါး', prs:'کف دست', fa:'کف دست', pt:'palmar', ru:'ладонный', vi:'lòng bàn tay', de:'Handinnenfläche', bn:'পামার' },
  'plantar': { ps:'پښتۍ', my:'ဖနောင့်', prs:'کف پا', fa:'کف پا', pt:'plantar', ru:'подошвенный', vi:'lòng bàn chân', de:'Fußsohle', bn:'প্লান্টার' },

  // ===== CARDIOVASCULAR TERMS =====
  'heart': { ps:'زړه', my:'နှလုံး', prs:'قلب', fa:'قلب', pt:'coração', ru:'сердце', vi:'trái tim', de:'Herz', bn:'হৃদয়' },
  'artery': { ps:'شريان', my:'သွေးလှိုင်းကြီး', prs:'شریان', fa:'شریان', pt:'artéria', ru:'артерия', vi:'động mạch', de:'Arterie', bn:'ধমনি' },
  'vein': { ps:'ورید', my:'သွေးပြန်ကြော', prs:'ورید', fa:'ورید', pt:'veia', ru:'вена', vi:'tĩnh mạch', de:'Vene', bn:'শিরা' },
  'capillary': { ps:'چچک شريان', my:'သွေးကလေးပြန်ကြော', prs:'مویرگ', fa:'مویرگ', pt:'capilar', ru:'капилляр', vi:'mao mạch', de:'Kapillare', bn:'কৈশিক' },
  'aorta': { ps:'اوبه ر', my:'အောတာ', prs:'آئورتا', fa:'آئورتا', pt:'aorta', ru:'аорта', vi:'động mạch chủ', de:'Hauptschlagader', bn:'অর্টা' },
  'vena cava': { ps:'لوی ورید', my:'သွေးပြန်ကြောကြီး', prs:'ورید اجوف', fa:'ورید اجوف', pt:'veia cava', ru:'полая вена', vi:'tống tĩnh mạch', de:'Hohlvene', bn:'ভেনা কাভা' },
  'pulmonary artery': { ps:'ریښتی شريان', my:'အဆုတ်သွေးလှိုင်းကြီး', prs:'شریان ریوی', fa:'شریان ریوی', pt:'artéria pulmonar', ru:'легочная артерия', vi:'động mạch phổi', de:'Lungenarterie', bn:'পালমোনারি আর্টারি' },
  'pulmonary vein': { ps:'ریښتی ورید', my:'အဆုတ်သွေးပြန်ကြော', prs:'ورید ریوی', fa:'ورید ریوی', pt:'veia pulmonar', ru:'легочная вена', vi:'tĩnh mạch phổi', de:'Lungenvene', bn:'পালমোনারি শিরা' },
  'coronary artery': { ps:'تاجی شريان', my:'နှလုံးသွေးလှိုင်းကြီး', prs:'شریان تاجی', fa:'شریان تاجی', pt:'artéria coronária', ru:'венечная артерия', vi:'động mạch vành', de:'Herzkranzarterie', bn:'করোনারি আর্টারি' },
  'cardiac muscle': { ps:'زړه عضله', my:'နှလုံးကြွက်သား', prs:'عضله قلبی', fa:'عضله قلبی', pt:'músculo cardíaco', ru:'сердечная мышца', vi:'cơ tim', de:'Herzmuskel', bn:'কার্ডিয়াক পেশি' },
  'atrium': { ps:'اتريم', my:'နှလုံးခန်း', prs:'دهلیز', fa:'دهلیز', pt:'átrio', ru:'предсердие', vi:'tâm nhĩ', de:'Vorkammer', bn:'অ্যাট্রিয়াম' },
  'ventricle': { ps:'ونټریکل', my:'နှလုံးခန်း', prs:'بطن', fa:'بطن', pt:'ventrículo', ru:'желудочек', vi:'tâm thất', de:'Herzkammer', bn:'ভেন্ট্রিকল' },
  'cardiac valve': { ps:'زړه دریچه', my:'နှလုံးပွိုင့်', prs:'دریچه قلب', fa:'دریچه قلب', pt:'válvula cardíaca', ru:'сердечный клапан', vi:'van tim', de:'Herzklappe', bn:'কার্ডিয়াক ভালভ' },
  'blood': { ps:'ونه', my:'သွေး', prs:'خون', fa:'خون', pt:'sangue', ru:'кровь', vi:'máu', de:'Blut', bn:'রক্ত' },
  'plasma': { ps:'پلازما', my:'ပလာဇမာ', prs:'پلاسما', fa:'پلاسما', pt:'plasma', ru:'плазма', vi:'huyết tương', de:'Plasma', bn:'প্লাজমা' },
  'red blood cell': { ps:'سوره وونه', my:'အနီရောင်သွေးဆဲလ်', prs:'سلول خون قرمز', fa:'سلول خون قرمز', pt:'glóbulo vermelho', ru:'эритроцит', vi:'tế bào máu đỏ', de:'rotes Blutkörperchen', bn:'লাল রক্তকণিকা' },
  'white blood cell': { ps:'سفیده وونه', my:'အဖြူရောင်သွေးဆဲလ်', prs:'سلول خون سفید', fa:'سلول خون سفید', pt:'glóbulo branco', ru:'лейкоцит', vi:'tế bào máu trắng', de:'weißes Blutkörperchen', bn:'সাদা রক্তকণিকা' },
  'platelet': { ps:'پلیټلیټ', my:'သွေးပြား', prs:'پلاکت', fa:'پلاکت', pt:'plaqueta', ru:'тромбоцит', vi:'tiểu cầu', de:'Blutplättchen', bn:'প্লেটলেট' },
  'hemoglobin': { ps:'هموګلوګین', my:'ဟီမိုဂလိုဘင်', prs:'هموگلوبین', fa:'هموگلوبین', pt:'hemoglobina', ru:'гемоглобин', vi:'hemoglobin', de:'Hämoglobin', bn:'হিমোগ্লোবিন' },
  'pulse': { ps:'نبد', my:'ခုန်နှုန်း', prs:'نبض', fa:'نبض', pt:'pulso', ru:'пульс', vi:'mạch', de:'Puls', bn:'নাড়ি' },
  'blood pressure': { ps:'د ونه فشار', my:'သွေးဖိအား', prs:'فشار خون', fa:'فشار خون', pt:'pressão arterial', ru:'артериальное давление', vi:'huyết áp', de:'Blutdruck', bn:'রক্তচাপ' },
  'systolic': { ps:'انقباضی', my:'ဆစ်တောလစ်', prs:'سیستولیک', fa:'سیستولیک', pt:'sistólico', ru:'систолический', vi:'tâm thu', de:'systolisch', bn:'সিস্টলিক' },
  'diastolic': { ps:'انبساطی', my:'ဒိအ်စတောလစ်', prs:'دیاستولیک', fa:'دیاستولیک', pt:'diastólico', ru:'диастолический', vi:'tâm trương', de:'diastolisch', bn:'ডায়াস্টলিক' },
  'pericardium': { ps:'پریکاردیم', my:'နှလုံးအိတ်', prs:'پریکاردیوم', fa:'پریکاردیوم', pt:'pericárdio', ru:'перикард', vi:'màng tim', de:'Herzbeutel', bn:'পেরিকার্ডিয়াম' },
  'endocardium': { ps:'اندوكاردیم', my:'နှလုံးအတွင်းအမြှုပ်', prs:'اندوکاردیوم', fa:'اندوکاردیوم', pt:'endocárdio', ru:'эндокард', vi:'màng trong tim', de:'Herzinnenhaut', bn:'এন্ডোকার্ডিয়াম' },
  'septum': { ps:'حاجز', my:'ခြားနားပြတင်း', prs:'سپتوم', fa:'سپتوم', pt:'septum', ru:'перегородка', vi:'vách ngăn', de:'Septum', bn:'সেপ্টাম' },
  'sinoatrial node': { ps:'سینوایتریل نوډ', my:'ဆိုင်အိတ်ရီယယ် nodes', prs:'گره سینوسی دهلیزی', fa:'گره سینوسی دهلیزی', pt:'nó sinoatrial', ru:'синусный узел', vi:'nút xoang nhĩ', de:'Sinusknoten', bn:'সাইনোএট্রিয়াল নোড' },
  'chordae tendineae': { ps:'توری قلب', my:'နှလုံးကြိုး', prs:'تارهای پیوست', fa:'تارهای پیوست', pt:'cordas tendíneas', ru:'сухожильные хорды', vi:'gân chỉ', de:'Sehnenfäden', bn:'কর্ডে টেন্ডিনি' },

  // ===== NERVOUS TERMS =====
  'brain': { ps:'مغز', my:'ဦးနှောက်', prs:'مغز', fa:'مغز', pt:'cérebro', ru:'мозг', vi:'não', de:'Gehirn', bn:'মস্তিষ্ক' },
  'spinal cord': { ps:'سپاینل کوډ', my:'ကျောရိုးအာရုံကြော', prs:'نخاع شوکی', fa:'نخاع شوکی', pt:'medula espinhal', ru:'спинной мозг', vi:'tủy sống', de:'Rückenmark', bn:'মেরুদণ্ড' },
  'neuron': { ps:'نیورون', my:'အာရုံကြောဆဲလ်', prs:'نورون', fa:'نورون', pt:'neurônio', ru:'нейрон', vi:'nơ ron', de:'Nervenzelle', bn:'নিউরন' },
  'nerve': { ps:'عصب', my:'အာရုံကြော', prs:'عصب', fa:'عصب', pt:'nervo', ru:'нерв', vi:'dây thần kinh', de:'Nerv', bn:'স্নায়ু' },
  'axon': { ps:'اکسون', my:'အောက်ဆွန်', prs:'آکسون', fa:'آکسون', pt:'axônio', ru:'аксон', vi:'sợi trục', de:'Axon', bn:'অ্যাক্সন' },
  'dendrite': { ps:'ډینډرایټ', my:'ဒန်ဒရိုက်', prs:'دندریت', fa:'دندریت', pt:'dendrita', ru:'дендрит', vi:'sợi nhánh', de:'Dendrit', bn:'ডেন্ড্রাইট' },
  'synapse': { ps:'سیناپس', my:'ဆိုင်းပ်', prs:'سیناپس', fa:'سیناپس', pt:'sinapse', ru:'синапс', vi:'tổ hợp', de:'Synapse', bn:'সিনাপস' },
  'neurotransmitter': { ps:'نیورونټرانسمیټر', my:'အာရုံကြောပို့ဆောင်ရေး', prs:'نوروترنسمیتر', fa:'نوروترنسمیتر', pt:'neurotransmissor', ru:'нейромедиатор', vi:'chất dẫn truyền thần kinh', de:'Neurotransmitter', bn:'নিউরোট্রান্সমিটার' },
  'cerebrum': { ps:'مخ', my:'ဦးနှောက်ကြီး', prs:'مغز بزرگ', fa:'مغز بزرگ', pt:'cérebro', ru:'большой мозг', vi:'đại não', de:'Großhirn', bn:'সেরিব্রাম' },
  'cerebellum': { ps:'مخی', my:'ဦးနှောက်သေး', prs:'مخچه', fa:'مخچه', pt:'cerebelo', ru:'мозжечок', vi:'tiểu não', de:'Kleinhirn', bn:'সেরিবেলাম' },
  'brainstem': { ps:'مغز سټم', my:'ဦးနှောက်အမြစ်', prs:'ساقه مغز', fa:'ساقه مغز', pt:'tronco encefálico', ru:'ствол мозга', vi:'thân não', de:'Hirnstamm', bn:'মস্তিষ্ক কাণ্ড' },
  'hypothalamus': { ps:'هایپوتھلامس', my:'ဟိုက်ပိုသာလာမပ်', prs:'هیپوتالاموس', fa:'هیپوتالاموس', pt:'hipotálamo', ru:'гипоталамус', vi:'viền não dưới', de:'Hypothalamus', bn:'হাইপোথ্যালামাস' },
  'thalamus': { ps:'تھلامس', my:'သာလာမပ်', prs:'تالاموس', fa:'تالاموس', pt:'tálamo', ru:'таламус', vi:'đồi thị', de:'Thalamus', bn:'থ্যালামাস' },
  'hippocampus': { ps:'هیپوکمپس', my:'ဟီပိုကမ်ပပ်', prs:'هیپوکامپ', fa:'هیپوکامپ', pt:'hipocampo', ru:'гиппокамп', vi:'hippocampus', de:'Hippocampus', bn:'হিপ্পোক্যাম্পাস' },
  'amygdala': { ps:'ایمیګالا', my:'အမီဂ္ဂဒာလာ', prs:'آمیگدالا', fa:'آمیگدالا', pt:'amígdala', ru:'миндалевидное тело', vi:'hạch hạnh', de:'Mandelkern', bn:'অ্যামিগডালা' },
  'cerebral cortex': { ps:'مخی پوش', my:'ဦးနှောက်အပြင်ဘက်အရွက်', prs:'قشر مغز', fa:'قشر مغز', pt:'córtex cerebral', ru:'кора головного мозга', vi:'vỏ não', de:'Großhirnrinde', bn:'সেরিব্রাল কর্টেক্স' },
  'meninges': { ps:'میننګیس', my:'ဦးနှောက်အမြှုပ်', prs:'مننژ', fa:'مننژ', pt:'meninges', ru:'мозговые оболочки', vi:'màng não', de:'Hirnhäute', bn:'মেনিনজেস' },
  'cerebrospinal fluid': { ps:'مخی و شوکی مایع', my:'ဦးနှောက်နှင့်ကျောရိုးအရည်', prs:'مایع مغزی نخاعی', fa:'مایع مغزی نخاعی', pt:'líquido cefalorraquidiano', ru:'спинномозговая жидкость', vi:'dịch não tủy sống', de:'Hirn-Rückenmark-Flüssigkeit', bn:'সেরিব্রোস্পাইনাল তরল' },
  'reflex': { ps:'منعکس', my:'ရှေ့ပြေးတုံ့ပြမှု', prs:'بازتاب', fa:'بازتاب', pt:'reflexo', ru:'рефлекс', vi:'phản xạ', de:'Reflex', bn:'রিফ্লেক্স' },
  'ganglion': { ps:'ګینګلیون', my:'အာရုံကြောအဖု', prs:'گانگلیون', fa:'گانگلیون', pt:'ganglio', ru:'ганглий', vi:'hạch', de:'Ganglion', bn:'গ্যাঙ্গলিয়ন' },
  'motor neuron': { ps:'حرکتي نیورون', my:'လှုပ်ရှားမှုအာရုံကြောဆဲလ်', prs:'نورون حرکتی', fa:'نورون حرکتی', pt:'neurônio motor', ru:'двигательный нейрон', vi:'nơ ron vận động', de:'Motorische Nervenzelle', bn:'মোটর নিউরন' },
  'sensory neuron': { ps:'احساساتي نیورون', my:'အာရုံခံစားမှုအာရုံကြောဆဲလ်', prs:'نورون حسی', fa:'نورون حسی', pt:'neurônio sensorial', ru:'чувствительный нейрон', vi:'nơ ron cảm giác', de:'Sensorische Nervenzelle', bn:'সেন্সরি নিউরন' },
  'myelin sheath': { ps:'مایلین شیت', my:'မိုင်လင်အမြှုပ်', prs:'غلاف میلین', fa:'غلاف میلین', pt:'bainha de mielina', ru:'миелиновая оболочка', vi:'bào myelin', de:'Markscheide', bn:'মাইলিন শিথ' },
  'frontal lobe': { ps:'مخ کلپ', my:'ရှေ့ဦးနှောက်', prs:'لوب فرونتال', fa:'لوب فرونتال', pt:'lobo frontal', ru:'лобная доля', vi:'thùy trán', de:'Stirnlappen', bn:'ফ্রন্টাল লোব' },
  'occipital lobe': { ps:'د عقب مخ کلپ', my:'နောက်ဦးနှောက်', prs:'لوب اکسیپیتال', fa:'لوب اکسیپیتال', pt:'lobo occipital', ru:'затылочная доля', vi:'thùy chẩm', de:'Hinterhauptlappen', bn:'অক্সিপিটাল লোব' },

  // ===== RESPIRATORY TERMS =====
  'lung': { ps:'سپړکه', my:'အဆုတ်', prs:'ریه', fa:'ریه', pt:'pulmão', ru:'легкое', vi:'phổi', de:'Lunge', bn:'ফুসফুস' },
  'trachea': { ps:'کلاکل', my:'အသက်ပြွန်', prs:'نای', fa:'نای', pt:'traqueia', ru:'трахея', vi:'khí quản', de:'Luftröhre', bn:'ট্রেকিয়া' },
  'bronchus': { ps:'bronکس', my:'အဆုတ်ပြွန်ကြီး', prs:'برونش', fa:'برونش', pt:'brônquio', ru:'bronchus', vi:'phế quản', de:'Bronchus', bn:'ব্রঙ্কাস' },
  'bronchiole': { ps:'برونکیول', my:'အဆုတ်ပြွန်ငယ်', prs:'برونکیول', fa:'برونکیول', pt:'bronquíolo', ru:'бронхиола', vi:'tiểu phế quản', de:'Bronchiole', bn:'ব্রঙ্কিওল' },
  'alveolus': { ps:'الویولس', my:'အဆုတ်အိတ်ငယ်', prs:'آلوئول', fa:'آلوئول', pt:'alvéolo', ru:'альвеола', vi:'phế nang', de:'Lungenbläschen', bn:'অ্যালভিওলাস' },
  'pleura': { ps:'پلیورا', my:'အဆုတ်အမြှုပ်', prs:'پلورا', fa:'پلورا', pt:'pleura', ru:'pleura', vi:'màng phổi', de:'Rippenfell', bn:'প্লিউরা' },
  'pharynx': { ps:'حلق', my:'အစာပြွန်', prs:'حلق', fa:'حلق', pt:'faringe', ru:'глотка', vi:'họng', de:'Rachen', bn:'ফ্যারিনক্স' },
  'larynx': { ps:'حنجره', my:'အသံပေါက်', prs:'حنجره', fa:'حنجره', pt:'laringe', ru:'гортань', vi:'thanh quản', de:'Kehlkopf', bn:'ল্যারিনক্স' },
  'nasal cavity': { ps:'د پو بیټ', my:'နှာခေါင်းအတွင်း', prs:'حفره بینی', fa:'حفره بینی', pt:'cavidade nasal', ru:'носовая полость', vi:'túi mũi', de:'Nasenhöhle', bn:'নাকের গহ্বর' },
  'epiglottis': { ps:'ایپیګلوټیس', my:'အစာကာပြား', prs:'اپی‌گلوت', fa:'اپی‌گلوت', pt:'epiglote', ru:'надгортанник', vi:'nắp thanh quản', de:'Kehldeckel', bn:'এপিগ্লটিস' },
  'oxygen': { ps:'اکسیجن', my:'အောက်ဆီဂျင်', prs:'اکسیژن', fa:'اکسیژن', pt:'oxigênio', ru:'кислород', vi:'oxy', de:'Sauerstoff', bn:'অক্সিজেন' },
  'carbon dioxide': { ps:'کاربن ډای اکسایډ', my:'ကာဗွန်ဒိအောက်ဆိုက်', prs:'دی‌اکسید کربن', fa:'دی‌اکسید کربن', pt:'dióxido de carbono', ru:'углекислый газ', vi:'carbon dioxyde', de:'Kohlenstoffdioxid', bn:'কার্বন ডাই অক্সাইড' },
  'respiration': { ps:'تنفس', my:'အသက်ရှူမှု', prs:'تنفس', fa:'تنفس', pt:'respiração', ru:'дыхание', vi:'hô hấp', de:'Atmung', bn:'শ্বাসক্রিয়া' },
  'inhalation': { ps:'د تنفس', my:'အသက်ရှူဝင်မှု', prs:'دم', fa:'دم', pt:'inspiração', ru:'вдох', vi:'hít vào', de:'Einatmen', bn:'শ্বাসগ্রহণ' },
  'exhalation': { ps:'د تنفس', my:'အသက်ရှူထွက်မှု', prs:'بازدم', fa:'بازدم', pt:'expiração', ru:'выдох', vi:'thở ra', de:'Ausatmen', bn:'শ্বাসত্যাগ' },
  'pulmonary': { ps:'ریښتی', my:'အဆုတ်ဆိုင်ရာ', prs:'ریوی', fa:'ریوی', pt:'pulmonar', ru:'легочный', vi:'phổi', de:'Lungen-', bn:'পালমোনারি' },
  'thorax': { ps:'سینه', my:'ရင်ဘတ်', prs:'قفسه سینه', fa:'قفسه سینه', pt:'tórax', ru:'грудная клетка', vi:'lồng ngực', de:'Brustkorb', bn:'বুক' },
  'intercostal muscle': { ps:'دن عضله', my:'ကျောကင်ကြားကြွက်သား', prs:'عضله بین‌دنده‌ای', fa:'عضله بین‌دنده‌ای', pt:'músculo intercostal', ru:'межреберная мышца', vi:'cơ liên sườn', de:'Zwischenrippenmuskel', bn:'ইন্টারকস্টাল পেশি' },
  'surfactant': { ps:'سرفیکټنټ', my:'မျက်နှာပြင် ဖိအား', prs:'سورفاکتانت', fa:'سورفاکتانت', pt:'surfactante', ru:'сурфактант', vi:'chất hoạt động bề mặt', de:'Surfactant', bn:'সারফ্যাকট্যান্ট' },
  'hilum': { ps:'هایلم', my:'အဆုတ်ပေါက်', prs:'هیلوم', fa:'هیلوم', pt:'hilio', ru:'ворота', vi:'rốn phổi', de:'Lungenhilum', bn:'হিলাম' },

  // ===== DIGESTIVE TERMS =====
  'stomach': { ps:'معده', my:'ဝမ်းဗိုက်', prs:'معده', fa:'معده', pt:'estômago', ru:'желудок', vi:'dạ dày', de:'Magen', bn:'পাক' },
  'esophagus': { ps:'مری', my:'အစာပြွန်', prs:'مری', fa:'مری', pt:'esôfago', ru:'пищевод', vi:'thực quản', de:'Speiseröhre', bn:'গলবিল' },
  'small intestine': { ps:'لوړه امعاء', my:'အူသေး', prs:'روده کوچک', fa:'روده کوچک', pt:'intestino delgado', ru:'тонкий кишечник', vi:'ruột non', de:'Dünndarm', bn:'ক্ষুদ্রান্ত্র' },
  'large intestine': { ps:'لوی امعاء', my:'အူကြီး', prs:'روده بزرگ', fa:'روده بزرگ', pt:'intestino grosso', ru:'толстый кишечник', vi:'ruột già', de:'Dickdarm', bn:'স্থূলান্ত্র' },
  'liver': { ps:'جګر', my:'အသည်း', prs:'کبد', fa:'کبد', pt:'fígado', ru:'печень', vi:'gan', de:'Leber', bn:'যকৃত' },
  'pancreas': { ps:'لبلی', my:'ပန်ကရိယ', prs:'پانکراس', fa:'پانکراس', pt:'pâncreas', ru:'поджелудочная железа', vi:'tụy', de:'Bauchspeicheldrüse', bn:'অগ্ন্যাশয়' },
  'gallbladder': { ps:'منډه', my:'မူးတစ်', prs:'کیسه صفرا', fa:'کیسه صفرا', pt:'vesícula biliar', ru:'желчный пузырь', vi:'túi mật', de:'Gallenblase', bn:'পিত্তাশয়' },
  'spleen': { ps:'طحال', my:'ယားဖါး', prs:'طحال', fa:'طحال', pt:'baço', ru:'селезенка', vi:'lách', de:'Milz', bn:'প্লীহা' },
  'appendix': { ps:'ډړی', my:'အတွဲအပြင်', prs:'آپاندیس', fa:'آپاندیس', pt:'apêndice', ru:'appendix', vi:'ruột thừa', de:'Wurmfortsatz', bn:'অ্যাপেন্ডিক্স' },
  'colon': { ps:'قولون', my:'အူကြီး', prs:'کولون', fa:'کولون', pt:'colon', ru:'ободочная кишка', vi:'đại tràng', de:'Kolon', bn:'কোলন' },
  'rectum': { ps:'مستقیم', my:'ဖင်ဝ', prs:'رکتوم', fa:'رکتوم', pt:'reto', ru:'прямая кишка', vi:'trực tràng', de:'Mastdarm', bn:'মলাশয়' },
  'anus': { ps:'سوراخ', my:'ဖင်ဝ', prs:'مقعد', fa:'مقعد', pt:'ânus', ru:'анус', vi:'hậu môn', de:'After', bn:'পায়ু' },
  'salivary gland': { ps:'غدد لعابی', my:'တံတွေးဂလင်း', prs:'غدد بزاقی', fa:'غدد بزاقی', pt:'glândula salivar', ru:'слюнная железа', vi:'tuyến nước bọt', de:'Speicheldrüse', bn:'লালাগ্রন্থি' },
  'tongue': { ps:'زبان', my:'လျှာ', prs:'زبان', fa:'زبان', pt:'língua', ru:'язык', vi:'lưỡi', de:'Zunge', bn:'জিভ' },
  'tooth': { ps:'غات', my:'သွား', prs:'دندان', fa:'دندان', pt:'dente', ru:'зуб', vi:'răng', de:'Zahn', bn:'দাঁত' },
  'duodenum': { ps:'دوازده ګړود', my:'အူဆစ်', prs:'دوازده‌هانه', fa:'دوازده‌هانه', pt:'duodeno', ru:'двенадцатиперстная кишка', vi:'hành tá tràng', de:'Zwölffingerdarm', bn:'ডুয়োডেনাম' },
  'jejunum': { ps:'صائم', my:'အူလတ်', prs:'صائم', fa:'صائم', pt:'jejuno', ru:'тощая кишка', vi:'hành nhạt', de:'Dünndarm', bn:'জেজুনাম' },
  'ileum': { ps:'لفاف', my:'အူအောက်ပိုင်း', prs:'ایلئوم', fa:'ایلئوم', pt:'íleon', ru:'подвздошная кишка', vi:'hành tràng', de:'Ileum', bn:'ইলিয়াম' },
  'cecum': { ps:'اعور', my:'အူမကြီး', prs:'کور روده', fa:'کور روده', pt:'ceco', ru:'слепая кишка', vi:'manh tràng', de:'Blinddarm', bn:'সিকাম' },
  'sigmoid colon': { ps:'S شکل قولون', my:'S ပုံစံအူကြီး', prs:'کولون سیگموئید', fa:'کولون سیگموئید', pt:'colon sigmoide', ru:'сигмовидная кишка', vi:'hình chữ Sigma', de:'Sigma', bn:'সিগময়েড কোলন' },
  'hepatic flexure': { ps:'جګر خم', my:'အသည်းကွေး', prs:'خم کبدی', fa:'خم کبدی', pt:'flexura hepática', ru:'печеночный изгиб', vi:'gấp gan', de:'Leberbucht', bn:'হেপাটিক ফ্লেক্সার' },
  'splenic flexure': { ps:'طحال خم', my:'ယားဖါးကွေး', prs:'خم طحالی', fa:'خم طحالی', pt:'flexura esplênica', ru:'селезеночный изгиб', vi:'gấp lách', de:'Milzbucht', bn:'স্প্লেনিক ফ্লেক্সার' },
  'bile': { ps:'صفره', my:'မူးရည်', prs:'صفرا', fa:'صفرا', pt:'bile', ru:'желчь', vi:'mật', de:'Galle', bn:'পিত্তরস' },
  'enzyme': { ps:'انزیم', my:'အင်ဇိုင်း', prs:'آنزیم', fa:'آنزیم', pt:'enzima', ru:'фермент', vi:'enzyme', de:'Enzym', bn:'এনজাইম' },
  'peristalsis': { ps:'پریستالیس', my:'အူလှုပ်ရှားမှု', prs:'پریستالیس', fa:'پریستالیس', pt:'peristalse', ru:'перистальтика', vi:'co thắt ruột', de:'Peristaltik', bn:'পেরিস্টালসিস' },
  'villus': { ps:'ویلوس', my:'အူအမြှုပ်', prs:'ویلوس', fa:'ویلوس', pt:'vilus', ru:'ворсинка', vi:'nhung mao', de:'Darmzotte', bn:'ভিলাস' },
  'mesentery': { ps:'مسریق', my:'အူကြွယ်', prs:'مسنتری', fa:'مسنتری', pt:'mesentério', ru:' брыжейка', vi:'mạc treo', de:'Gekröse', bn:'মেসেন্টারি' },

  // ===== INTERVIEW SENTENCES =====
  'What exactly brings you in today?': { ps:'تاسو نن د کوم دلیل له ملاتړ راغله؟', my:'ယနေ့ဘာကြောင့် လာတာလဲ။', prs:'دقیقاً چه چیزی شما را امروز به اینجا آورده است؟', fa:'دقیقاً چه چیزی شما را امروز به اینجا آورده است؟', pt:'O que exatamente o traz aqui hoje?', ru:'Что именно привело вас сегодня?', vi:'Chính xác điều gì đưa bạn đến đây hôm nay?', de:'Was genau bringt Sie heute hierher?', bn:'আজ আপনাকে ঠিক কী এনেছে?' },
  'When did these symptoms start?': { ps:'دلته نه دا علامتونه پیل شوې؟', my:'ဒီလက္ခဏာတွေဘယ်တုန်းကစတာလဲ။', prs:'این علائم کی شروع شدند؟', fa:'این علائم کی شروع شدند؟', pt:'Quando esses sintomas começaram?', ru:'Когда появились эти симптомы?', vi:'Các triệu chứng này bắt đầu từ khi nào?', de:'Wann haben diese Symptome begonnen?', bn:'এই উপসর্গগুলো কখন শুরু হয়েছিল?' },
  'How long do they last when they occur?': { ps:'کله چې واقع شي دوی څومره نړۍ درڅه وي؟', my:'ဖြစ်တဲ့အခါဘယ်လောက်ကြာလဲ။', prs:'وقتی رخ می‌دهند چقدر طول می‌کشند؟', fa:'وقتی رخ می‌دهند چقدر طول می‌کشند؟', pt:'Quanto tempo eles duram quando ocorrem?', ru:'Сколько они длятся, когда появляются?', vi:'Chúng kéo dài bao lâu khi xuất hiện?', de:'Wie lange halten sie bei Auftreten an?', bn:'এগুলো হলে কতক্ষণ স্থায়ী হয়?' },
  'How severe is the pain or discomfort on a scale of 1 to 10?': { ps:'د ۱ له ۱۰ پوری تیر ته د درد یا بی زاری شدت څومره ده؟', my:'နာကျင်မှုသို့မဟုတ်အဆင်မပြေမှုက ၁ ကနေ ၁၀ အထိဘယ်လောက်ပြင်းလဲ။', prs:'درد یا ناراحتی در مقیاس ۱ تا ۱۰ چقدر شدید است؟', fa:'درد یا ناراحتی در مقیاس ۱ تا ۱۰ چقدر شدید است؟', pt:'Qual é a gravidade da dor ou desconforto em uma escala de 1 a 10?', ru:'Насколько сильна боль или дискомфорт по шкале от 1 до 10?', vi:'Cơn đau hoặc sự khó chịu nghiêm trọng mức nào trên thang điểm từ 1 đến 10?', de:'Wie stark ist der Schmerz oder das Unbehagen auf einer Skala von 1 bis 10?', bn:'১ থেকে ১০ স্কেলে ব্যথা বা অস্বস্তি কতটা তীব্র?' },
  'What makes the symptoms worse?': { ps:'د علامتونه څومره بدتر کوي؟', my:'ဘာကြောင့်လက္ခဏာတွေပိုဆိုးလဲ။', prs:'چه چیزی علائم را بدتر می‌کند؟', fa:'چه چیزی علائم را بدتر می‌کند؟', pt:'O que piora os sintomas?', ru:'Что делает симптомы хуже?', vi:'Điều gì làm triệu chứng tệ hơn?', de:'Was macht die Symptome schlimmer?', bn:'কী উপসর্গগুলো আরো খারাপ করে?' },
  'What makes the symptoms better?': { ps:'د علامتونه څومره ښه کوي؟', my:'ဘာကြောင့်လက္ခဏာတွေသက်သာလဲ။', prs:'چه چیزی علائم را بهتر می‌کند؟', fa:'چه چیزی علائم را بهتر می‌کند؟', pt:'O que melhora os sintomas?', ru:'Что делает симптомы лучше?', vi:'Điều gì làm triệu chứng tốt hơn?', de:'Was macht die Symptome besser?', bn:'কী উপসর্গগুলো ভালো করে?' },
  'Do the symptoms radiate or travel to other parts of your body?': { ps:'د علامتونه خپل جسم په نور ځایونو ته لري؟', my:'လက္ခဏာတွေကခန္ဓာကိုယ်ရဲ့အခြားနေရာတွေဆီပျံ့နှံ့နေလား။', prs:'آیا علائم به سایر قسمت‌های بدن شما منتشر می‌شوند یا حرکت می‌کنند؟', fa:'آیا علائم به سایر قسمت‌های بدن شما منتشر می‌شوند یا حرکت می‌کنند؟', pt:'Os sintomas irradiam ou viajam para outras partes do seu corpo?', ru:'Распространяются ли симптомы или переходят на другие части тела?', vi:'Các triệu chứng có lan rộng hoặc di chuyển sang các phần khác của cơ thể không?', de:'Strahlen die Symptome aus oder wandern sie in andere Körperteile?', bn:'উপসর্গগুলো কি আপনার শরীরের অন্যান্য অংশে ছড়িয়ে পড়ে বা যায়?' },
  'The pain is here, in this area.': { ps:'درد دلته، د دې سیمه کې ده.', my:'နာကျင်မှုကဒီနေရာမှာပါ။', prs:'درد اینجاست، در این ناحیه.', fa:'درد اینجاست، در این ناحیه.', pt:'A dor está aqui, nesta zona.', ru:'Боль здесь, в этой области.', vi:'Cơn đau ở đây, trong vùng này.', de:'Der Schmerz ist hier, in diesem Bereich.', bn:'ব্যথা এখানে, এই এলাকায়।' },
  'The pain is sharp and stabbing.': { ps:'درد تیز او ږګ لرونکی ده.', my:'နာကျင်မှုကထိုးဖောက်တဲ့ပုံစံမျိုးဖြစ်တယ်။', prs:'درد تیز و نافذ است.', fa:'درد تیز و نافذ است.', pt:'A dor é aguda e pontiaguda.', ru:'Боль острая и пронзающая.', vi:'Cơn đau nhọn và xuyên thấu.', de:'Der Schmerz ist scharf und stechend.', bn:'ব্যথা তীব্র এবং ছেদনমূলক।' },
  'The symptoms come and go; they are not constant.': { ps:'علانونه راتګ او وتګ دي؛ ثابت ندي.', my:'လက္ခဏာတွေလာပြီးသွားတယ်။ ဆက်တိုက်မရှိဘူး။', prs:'علائم می‌آیند و می‌روند؛ ثابت نیستند.', fa:'علائم می‌آیند و می‌روند؛ ثابت نیستند.', pt:'Os sintomas vão e vêm; não são constantes.', ru:'Симптомы появляются и исчезают; они не постоянные.', vi:'Triệu chứng đến rồi đi; chúng không liên tục.', de:'Die Symptome kommen und gehen; sie sind nicht konstant.', bn:'উপসর্গগুলো আসে এবং যায়; এগুলো স্থির নয়।' },
  'Have you had an unexplained fever, chills, or sweats?': { ps:'ایا تاسو بې سپین یې تود نه، یې لره، یا یې کېرنه مه لرئ؟', my:'ရှင်းမပြနိုင်တဲ့ဖျားနာမှု၊ အေးချမ်းမှု သို့မဟုတ်ချွေးထွက်မှုဖြစ်ဖူးလား။', prs:'آیا تب، لرز یا تعریق غیرقابل توضیحی داشته‌اید؟', fa:'آیا تب، لرز یا تعریق غیرقابل توضیحی داشته‌اید؟', pt:'Você teve febre inexplicável, calafrios ou suores?', ru:'У вас была необъяснимая лихорадка, озноб или потливость?', vi:'Bạn đã từng sốt, ớn lạnh hoặc đổ mồ hôi không rõ nguyên nhân chưa?', de:'Hatten Sie unerklärliches Fieber, Schüttelfrost oder Schwitzen?', bn:'আপনার কি অব্যাখ্যাত জ্বর, কাঁপুনি বা ঘাম হয়েছে?' },
  'Have you recently experienced unexplained weight loss or weight gain?': { ps:'ایا تاسو تر وړانگې بې سپین د غاړه کمیه یا زیاده شته؟', my:'ရှင်းမပြနိုင်တဲ့အလေးချိန်ကျခြင်းသို့မဟုတ်တိုးခြင်းဖြစ်ဖူးလား။', prs:'آیا اخیراً کاهش یا افزایش وزن غیرقابل توضیحی داشته‌اید؟', fa:'آیا اخیراً کاهش یا افزایش وزن غیرقابل توضیحی داشته‌اید؟', pt:'Você experimentou recentemente perda ou ganho de peso inexplicável?', ru:'Вы недавно теряли или набирали вес без объяснения?', vi:'Gần đây bạn có bị sút hoặc tăng cân không rõ nguyên nhân không?', de:'Haben Sie kürzlich unerklärlichen Gewichtsverlust oder -zunahme erfahren?', bn:'আপনার কি সম্প্রতি অব্যাখ্যাত ওজন হ্রাস বা বৃদ্ধি হয়েছে?' },
  'Are you feeling an abnormal amount of fatigue, weakness, or loss of energy?': { ps:'ایا تاسو یې غیرعادی درد، زوړه، یا انرژي ته تیر شوې پوهېږئ؟', my:'ပုံမှန်မဟုတ်တဲ့ပင်ပန်းနွမ်းနယ်မှု၊ အားနည်းမှု သို့မဟုတ်စွမ်းအင်ဆုံးရှုံးမှုခံစားနေရလား။', prs:'آیا احساس خستگی، ضعف یا از دست دادن انرژی غیرعادی می‌کنید؟', fa:'آیا احساس خستگی، ضعف یا از دست دادن انرژی غیرعادی می‌کنید؟', pt:'Você está sentindo uma quantidade anormal de fadiga, fraqueza ou perda de energia?', ru:'Вы чувствуете ненормальную усталость, слабость или потерю энергии?', vi:'Bạn có cảm thấy mệt mỏi, yếu đuối hoặc mất năng lượng bất thường không?', de:'Fühlen Sie eine abnormale Müdigkeit, Schwäche oder Energieverlust?', bn:'আপনি কি অস্বাভাবিক পরিমাণ ক্লান্তি, দুর্বলতা বা শক্তির অভাব অনুভব করছেন?' },
  'Have you lost your appetite?': { ps:'ایا تاسو خپل میل ورکړی؟', my:'အစာစားချင်စိတ်ပျက်နေလား။', prs:'آیا اشتهای خود را از دست داده‌اید؟', fa:'آیا اشتهای خود را از دست داده‌اید؟', pt:'Você perdeu o apetite?', ru:'Вы потеряли аппетит?', vi:'Bạn đã mất khẩu vị chưa?', de:'Haben Sie den Appetit verloren?', bn:'আপনার কি ক্ষুধা হ্রাস পেয়েছে?' },
  'I have been feeling feverish since yesterday.': { ps:'زه له سبا نه تود نه احساس کوم.', my:'မနေ့ကစပြီးဖျားနေတယ်။', prs:'دیروز احساس تب می‌کنم.', fa:'دیروز احساس تب می‌کنم.', pt:'Estou me sentindo com febre desde ontem.', ru:'С вчерашнего дня я чувствую жар.', vi:'Từ hôm qua tôi đã cảm thấy bị sốt.', de:'Ich fühle mich seit gestern fieberhaft.', bn:'আমি গতকাল থেকে জ্বর অনুভব করছি।' },
  'I feel tired all the time, even after resting.': { ps:'زه هر وخت ستړی معلوموم، څوک په ارام په دی.', my:'အနားယူပြီးတော့တောင်အမြဲပင်ပန်းနေတယ်။', prs:'همیشه احساس خستگی می‌کنم، حتی بعد از استراحت.', fa:'همیشه احساس خستگی می‌کنم، حتی بعد از استراحت.', pt:'Eu me sinto cansado todo o tempo, mesmo depois de descansar.', ru:'Я постоянно устаю, даже после отдыха.', vi:'Tôi cảm thấy mệt mỏi mọi lúc, ngay cả sau khi nghỉ ngơi.', de:'Ich fühle mich ständig müde, selbst nach der Ruhe.', bn:'আমি সবসময় ক্লান্ত বোধ করি, বিশ্রামের পরেও।' },
  'Are you experiencing any headaches or migraines?': { ps:'ایا تاسو سر درد یا مایګرین اخیستل کوي؟', my:'ခေါင်းကိုက်ခြင်းသို့မဟုတ် မိုက်ဂရိန်ဖြစ်နေလား။', prs:'آیا سردرد یا میگرن دارید؟', fa:'آیا سردرد یا میگرن دارید؟', pt:'Você está tendendo dores de cabeça ou enxaquecas?', ru:'У вас болит голова или мигрень?', vi:'Bạn có bị đau đầu hay migraine không?', de:'Haben Sie Kopfschmerzen oder Migräne?', bn:'আপনার কি মাথাব্যথা বা মাইগ্রেন হচ্ছে?' },
  'Have you had any blurry vision, double vision, or eye pain?': { ps:'ایا تاسو د لید تیاره، دوه لید، یا ستړم درد یې لرئ؟', my:'မျက်စိမှုတ်မြင်ခြင်း၊ နှစ်ထပ်မြင်ခြင်းသို့မဟုတ်မျက်စိနာခြင်းဖြစ်ဖူးလား။', prs:'آیا تاری دید، دید دوگانه یا درد چشم داشته‌اید؟', fa:'آیا تاری دید، دید دوگانه یا درد چشم داشته‌اید؟', pt:'Você teve visão embaçada, visão dupla ou dor nos olhos?', ru:'У вас было нечеткое зрение, двоение в глазах или боль в глазах?', vi:'Bạn đã từng bị mờ mắt, nhìn đôi hoặc đau mắt chưa?', de:'Hatten Sie verschwommenes Sehen, Doppelbilder oder Augenschmerzen?', bn:'আপনার কি ঝাপসা দৃষ্টি, দ্বৈত দৃষ্টি বা চোখে ব্যথা হয়েছে?' },
  'Are you having any ear pain, ringing in the ears, or hearing loss?': { ps:'ایا تاسو ږ درد، ږ ږیرنې، یا ږ ماتیدول یې لرئ؟', my:'နားနာခြင်း၊ နားမှာတီးခတ်သံဖြစ်ခြင်းသို့မဟုတ် နားကြားနေရခြင်းဖြစ်ဖူးလား။', prs:'آیا درد گوش، وزوز گوش یا از دست دادن شنوایی دارید؟', fa:'آیا درد گوش، وزوز گوش یا از دست دادن شنوایی دارید؟', pt:'Você tem dor no ouvido, zumbido ou perda auditiva?', ru:'У вас болит ухо, звон в ушах или потеря слуха?', vi:'Bạn có bị đau tai, ù tai hoặc mất thính lực không?', de:'Haben Sie Ohrenschmerzen, Ohrensausen oder Hörverlust?', bn:'আপনার কি কানে ব্যথা, কানে ঘণ্টা বাজা বা শ্রবণশক্তি হ্রাস হচ্ছে?' },
  'Do you have a stuffy or runny nose, or frequent nosebleeds?': { ps:'ایا تاسو پو یې بند دي، په پو کې یې اوبه ټوګي، یا اوبه تېرېدل یې لرئ؟', my:'နှာခေါင်းပိနေခြင်း၊ နှာရည်ကျခြင်းသို့မဟုတ် မကြာခဏနှာသွေးထွက်ခြင်းဖြစ်ဖူးလား။', prs:'آیا گرفتگی بینی، آبریزش بینی یا خونریزی مکرر بینی دارید؟', fa:'آیا گرفتگی بینی، آبریزش بینی یا خونریزی مکرر بینی دارید؟', pt:'Você tem nariz entupido ou escorrendo, ou sangramentos nasais frequentes?', ru:'У вас заложенный или насморк, или частые носовые кровотечения?', vi:'Bạn có bị nghẹt mũi, chảy nước mũi hoặc chảy máu mũi thường xuyên không?', de:'Haben Sie verstopfte oder laufende Nase oder häufige Nasenbluten?', bn:'আপনার কি নাক বন্ধ বা পানি পড়ে, বা ঘন ঘন নাক থেকে রক্ত পড়ে?' },
  'Have you had sinus pressure or pain in your face?': { ps:'ایا تاسو د سینس فشار یا د خپل مخ درد یې لرئ؟', my:'နှာခေါင်းထဲဖိအားရှိခြင်းသို့မဟုတ်မျက်နှာနာခြင်းဖြစ်ဖူးလား။', prs:'آیا فشار سینوس یا درد صورت داشته‌اید؟', fa:'آیا فشار سینوس یا درد صورت داشته‌اید؟', pt:'Você teve pressão sinusal ou dor no rosto?', ru:'У вас была синусовая боль или боль в лице?', vi:'Bạn đã từng bị áp lực xoang hoặc đau mặt chưa?', de:'Hatten Sie Sinusdruck oder Gesichtsschmerzen?', bn:'আপনার কি সাইনাসে চাপ বা মুখে ব্যথা হয়েছে?' },
  'Do you have a sore throat, hoarseness, or difficulty swallowing?': { ps:'ایا تاسو د خولق درد، غږ شاته شي، یا د ټاکل کې پریشانۍ یې لرئ؟', my:'အမြုံနာခြင်း၊ အသံပျက်ခြင်းသို့မဟုတ်မျိုချရခက်ခဲခြင်းဖြစ်နေလား။', prs:'آیا گلودرد، گرفتگی صدا یا مشکل در بلعیدن دارید؟', fa:'آیا گلودرد، گرفتگی صدا یا مشکل در بلعیدن دارید؟', pt:'Você tem dor de garganta, rouquidão ou dificuldade para engolir?', ru:'У вас болит горло, осиплость или трудности с глотанием?', vi:'Bạn có bị đau họng, khản tiếng hoặc khó nuốt không?', de:'Haben Sie Halsschmerzen, Heiserkeit oder Schluckbeschwerden?', bn:'আপনার কি গলা ব্যথা, গলা ভাঙা বা গিলতে কষ্ট হচ্ছে?' },
  'I have a bad headache, especially behind my eyes.': { ps:'زه د سر یې درد لرم، په مخکنی ځای ځانګه.', my:'အထူးသဖြင့်မျက်စိနောက်မှာ ခေါင်းအရမ်းကိုက်တယ်။', prs:'سردرد شدیدی دارم، مخصوصاً پشت چشم‌ها.', fa:'سردرد شدیدی دارم، مخصوصاً پشت چشم‌ها.', pt:'Tenho uma forte dor de cabeça, especialmente atrás dos olhos.', ru:'У меня сильная головная боль, особенно за глазами.', vi:'Tôi bị đau đầu dữ dội, đặc biệt sau mắt.', de:'Ich habe starke Kopfschmerzen, besonders hinter den Augen.', bn:'আমার মাথায় খুব ব্যথা, বিশেষত চোখের পেছনে।' },
  'My throat has been sore for three days.': { ps:'زه د دریو ورځو نه د خولق درد لرم.', my:'အမြုံကသုံးရက်ဆက်တိုက်နာနေတယ်။', prs:'گلویم سه روز است درد می‌کند.', fa:'گلویم سه روز است درد می‌کند.', pt:'Minha garganta está dolorida há três dias.', ru:'Мое горло болит уже три дня.', vi:'Cổ họng tôi đã đau ba ngày.', de:'Mein Hals tut seit drei Tagen weh.', bn:'আমার গলা তিন দিন ধরে ব্যথা করছে।' },
  'Do you have a cough? If so, are you coughing up any phlegm or blood?': { ps:'ایا تاسو یې کېرنه لرئ؟ هغه صورت کې، ایا تاسو یې لعاب یا ونه کېرنه کوي؟', my:'အရွှေ့ရှိလား။ ရှိရင် ဘာထွက်လဲ၊ တီးဖတ်လား။', prs:'سرفه دارید؟ اگر آره، خلط یا خون سرفه می‌کنید؟', fa:'سرفه دارید؟ اگر آره، خلط یا خون سرفه می‌کنید؟', pt:'Você tem tos? Se sim, está tossindo flema ou sangre?', ru:'У вас кашель? Если да, выделяется ли мокрота или кровь?', vi:'Bạn có ho không? Nếu có, có đờm hay máu không?', de:'Haben Sie Husten? Wenn ja, husten Sie Schleim oder Blut?', bn:'আপনার কি কাশি হচ্ছে? হ্যাঁ হলে, আপনি কি কফ বা রক্ত গিলছেন?' },
  'Are you experiencing shortness of breath?': { ps:'ایا تاسو د تنفس ته تیر شوې پوهېږئ؟', my:'အသက်ရှုရခက်နေလား။', prs:'آیا تنگی نفس دارید؟', fa:'آیا تنگی نفس دارید؟', pt:'Você está com dificuldade para respirar?', ru:'У вас одышка?', vi:'Bạn có bị khó thở không?', de:'Haben Sie Atemnot?', bn:'আপনার কি শ্বাসকষ্ট হচ্ছে?' },
  'Do you experience wheezing or tightness in your chest?': { ps:'ایا تاسو د سینه کې ښه یا کېرنه یې اخیستل کوي؟', my:'ရင်ဘတ်ထဲမှာအောင့်ခြင်းသို့မဟုတ်အသက်ရှုလျှင်အသံထွက်ခြင်းဖြစ်နေလား။', prs:'آیا خس‌خس سینه یا سفتی در سینه دارید؟', fa:'آیا خس‌خس سینه یا سفتی در سینه دارید؟', pt:'Você sente chiado ou aperto no peito?', ru:'У вас хрипы или стеснение в груди?', vi:'Bạn có bị khò khè hay ngực bị thắt không?', de:'Haben Sie Keuchen oder Engegefühl in der Brust?', bn:'আপনার কি বুকে ঘোঁত ঘোঁত শব্দ বা চাপ লাগে?' },
  'I have a dry cough that will not go away.': { ps:'زه یې خشکه کېرنه لرم چې نه ودریږي.', my:'အကြာကြီးမပျောက်တဲ့ခြောက်ကွက်အရွှေ့ရှိတယ်။', prs:'سرفه خشکی دارم که خوب نمی‌شود.', fa:'سرفه خشکی دارم که خوب نمی‌شود.', pt:'Tenho uma tosse seca que não vai embora.', ru:'У меня сухой кашель, который не проходит.', vi:'Tôi bị ho khan không đỡ.', de:'Ich habe trockenen Husten, der nicht weggeht.', bn:'আমার কাশি শুকনো, যা যাচ্ছে না।' },
  'I cannot catch my breath when I walk up stairs.': { ps:'کله چې په پورته لوړه ته ځم، زه خپل ساس نه ګټلی.', my:'လှေကားအတက်မှာအသက်ရှုရခက်တယ်။', prs:'وقتی از پله‌ها بالا می‌روم نفسم بند می‌آید.', fa:'وقتی از پله‌ها بالا می‌روم نفسم بند می‌آید.', pt:'Não consigo respirar quando subo escadas.', ru:'Я не могу отдышаться, когда поднимаюсь по лестнице.', vi:'Tôi không thở được khi đi lên cầu thang.', de:'Ich kann nicht atmen, wenn ich die Treppe hochgehe.', bn:'সিঁড়ি বেড়ালে আমার শ্বাস নেমে আসে।' },
  'Do you have any chest pain or discomfort?': { ps:'ایا تاسو د سینه کې درد یا بې زارۍ یې لرئ？', my:'ရင်ဘတ်ထဲမှာနာခြင်းသို့မဟုတ်အဆင်မပြေမှုရှိလား။', prs:'آیا درد یا ناراحتی سینه دارید؟', fa:'آیا درد یا ناراحتی سینه دارید؟', pt:'Você tem dor ou desconforto no peito?', ru:'У вас боль или дискомфорт в груди?', vi:'Bạn có bị đau hay khó chịu ở ngực không?', de:'Haben Sie Brustschmerzen oder Unbehagen?', bn:'আপনার কি বুকে ব্যথা বা অস্বস্তি আছে?' },
  'Does your heart ever feel like it is racing, skipping beats, or pounding?': { ps:'ایا تاسو د زړه درد یې اخیستل کوي، د بیت غوړ کوي، یا قوتي یې ږغ کوي؟', my:'နှလုံးက အရမ်းမြန်မြန်ခုန်ခြင်း၊ ခုန်နှုန်းကျော်ခြင်းသို့မဟုတ်တုန်ခါခြင်းခံစားဖူးလား။', prs:'آیا قلبتان هرگز احساس مسابقه، جا افتادن ضربان یا کوبیدن می‌کند؟', fa:'آیا قلبتان هرگز احساس مسابقه، جا افتادن ضربان یا کوبیدن می‌کند؟', pt:'Seu coração já sentiu como se estivesse disparando, pulando batidas ou batendo forte?', ru:'Ваше сердце когда-нибудь кажется, что ускоряется, пропускает удары или стучит?', vi:'Tim bạn có bao giờ cảm thấy như đang đua, bỏ nhịp hay đập mạnh không?', de:'Fühlt sich Ihr Herz manchmal an, als würde es rasen, Schläge überspringen oder pochen?', bn:'আপনার হৃদয় কি কখনো মনে হয়েছে যে এটি দ্রুত চলছে, বাদ পড়ছে বা শক্তিশালীভাবে ধকধক করছে?' },
  'Have you ever felt dizzy, lightheaded, or fainted?': { ps:'ایا تاسو یې مخ وینه، سر وینه، یا بې هوښیه شته؟', my:'မူးဝေခြင်း၊ ဦးနှောက်မှောက်ခြင်းသို့မဟုတ်သတိလစ်ခြင်းဖြစ်ဖူးလား။', prs:'آیا تا به حال سرگیجه، سبکی سر یا غش کرده‌اید؟', fa:'آیا تا به حال سرگیجه، سبکی سر یا غش کرده‌اید？', pt:'Você já sentiu tontura, tonteira ou desmaiou?', ru:'У вас когда-нибудь было головокружение, дурнота или обморок?', vi:'Bạn có bao giờ bị chóng mặt, hoa mắt hay ngất xỉu không?', de:'Waren Ihnen schon einmal schwindelig, hatte Ihnen schwindelig oder sind Sie ohnmächtig geworden?', bn:'আপনার কি কখনো মাথা ঘুরেছে, হালকা লাগেছে বা মূর্ছা গেছে?' },
  'Have you noticed any swelling in your legs, feet, or ankles?': { ps:'ایا تاسو خپل پښت کې، زوړ کې، یا خولک کې ورم یې لرئ؟', my:'ခြေထောက်၊ ခြေဖဝါးသို့မဟုတ်ခြေကျင်ရိုးတွေမှာရောင်ခြင်းတွေ့ဖူးလား။', prs:'آیا تورم در پاها، پاها یا مچ پا مشاهده کرده‌اید؟', fa:'آیا تورم در پاها، پاها یا مچ پا مشاهده کرده‌اید؟', pt:'Você notou inchaço nas pernas, pés ou tornozelos?', ru:'Вы замечали отеки на ногах, ступнях или лодыжках?', vi:'Bạn có nhận thấy sưng ở chân, bàn chân hoặc mắt cá chân không?', de:'Haben Sie Schwellungen an den Beinen, Füßen oder Knöcheln bemerkt?', bn:'আপনার কি পায়ে, পায়ের পাতা বা গোড়ালিতে ফুলে যাওয়া লক্ষ্য করেছে?' },
  'Do you get leg pain when you walk that stops when you rest?': { ps:'کله چې تاسو ځم کوي تاسو ته د ساق درد شي کله چې تاسو ارام کوي؟', my:'လမ်းလျှောက်တဲ့အခါခြေထောက်နာပြီး အနားယူရင်ပျောက်လား။', prs:'آیا موقع راه رفتن درد پا دارید که با استراحت متوقف می‌شود؟', fa:'آیا موقع راه رفتن درد پا دارید که با استراحت متوقف می‌شود؟', pt:'Você sente dor na perna ao caminhar que para quando descansa?', ru:'У вас боль в ноге при ходьбе, которая проходит при отдыхе?', vi:'Bạn có bị đau chân khi đi bộ và hết khi nghỉ không?', de:'Haben Sie Beinschmerzen beim Gehen, die nach Ruhe aufhören?', bn:'হাঁটলে কি পায়ে ব্যথা হয় যা বিশ্রামে থামে?' },
  'I feel a tightness in my chest when I exert myself.': { ps:'کله چې زه خپل زړه ښه کوم، زه په سینه کې بند اخیستل کوم.', my:'အားထုတ်လုပ်တဲ့အခါရင်ဘတ်ထဲမှာကျပ်နေတယ်။', prs:'وقتی فشار می‌آورم احساس فشار در سینه می‌کنم.', fa:'وقتی فشار می‌آورم احساس فشار در سینه می‌کنم.', pt:'Sinto uma aperto no pecho quando me esforço.', ru:'Я чувствую стеснение в груди при напряжении.', vi:'Tôi cảm thấy thắt ngực khi gắng sức.', de:'Ich spüre Enge in der Brust, wenn ich mich anstrenge.', bn:'আমি জোর লাগালে বুকে চাপ লাগে।' },
  'My heart sometimes feels like it is fluttering.': { ps:'زه د زړه درد یې اخیستل کوم.', my:'နှလုံးကတစ်ခါတစ်ရံလှုပ်ရှားနေသလိုခံစားရတယ်။', prs:'گاهی اوقات قلبم احساس می‌کند که تند می‌زند.', fa:'گاهی اوقات قلبم احساس می‌کند که تند می‌زند.', pt:'Meu coração às vezes parece estar palpitação.', ru:'Моё сердце иногда кажется, что трепещет.', vi:'Tim tôi đôi khi cảm thấy như đang rung.', de:'Mein Herz fühlt manchmal an, als würde es flattern.', bn:'আমার হৃদয় কখনো কখনো মনে হয় যে এটি নড়ছে।' },
  'Have you had any abdominal pain or cramping?': { ps:'ایا تاسو یې د شکم درد یا شپک یې لرئ؟', my:'ဝမ်းဗိုက်နာခြင်းသို့မဟုတ်တောင့်တင်ခြင်းဖြစ်ဖူးလား။', prs:'آیا درد شکم یا کرامپ داشته‌اید؟', fa:'آیا درد شکم یا کرامپ داشته‌اید؟', pt:'Você teve dor abdominal ou cólicas?', ru:'У вас была боль в животе или спазмы?', vi:'Bạn đã từng bị đau bụng hoặc chuột rút chưa?', de:'Hatten Sie Bauchschmerzen oder Krämpfe?', bn:'আপনার কি পেটে ব্যথা বা খিঁচুনি হয়েছে?' },
  'Are you experiencing nausea or vomiting?': { ps:'ایا تاسو یې ګېنه یا استفراغ یې اخیستل کوي؟', my:'အန်ချင်စိတ်ဖြစ်ခြင်းသို့မဟုတ်အန်ခြင်းဖြစ်နေလား။', prs:'آیا حالت تهوع یا استفراغ دارید؟', fa:'آیا حالت تهوع یا استفراغ دارید؟', pt:'Você está sentindo náusea ou vômito?', ru:'У вас тошнота или рвота?', vi:'Bạn có bị buồn nôn hay nôn mửa không?', de:'Haben Sie Übelkeit oder Erbrechen?', bn:'আপনার কি বমি বমি ভাব বা বমি হচ্ছে?' },
  'Have you had heartburn, acid reflux, or indigestion?': { ps:'ایا تاسو یې د زړه تاورو، اسید ریفلاکس، یا بې هضمۍ یې لرئ؟', my:'ရင်ဘတ်အောင့်ခြင်း၊ အက်စစ်ပြန်ခြင်းသို့မဟုတ်အစာမကြေခြင်းဖြစ်ဖူးလား။', prs:'آیا سوزش سر دل، رفلاکس اسید یا سوءهاضمه داشته‌اید؟', fa:'آیا سوزش سر دل، رفلاکس اسید یا سوءهاضمه داشته‌اید؟', pt:'Você teve azia, refluxo ácido ou indigestão?', ru:'У вас была изжога, кислотный рефлюкс или несварение?', vi:'Bạn đã từng bị ợ nóng, trào ngược axit hoặc khó tiêu chưa?', de:'Hatten Sie Sodbrennen, Säurereflux oder Verdauungsstörungen?', bn:'আপনার কি বুক জ্বালা, এসিড রিফ্লাক্স বা অপচয় হয়েছে?' },
};

function processFile(filename) {
  const filePath = path.join(DATA_DIR, filename);
  let content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const newLines = [];
  let insertions = 0;

  // Detect quote style from first 'en:' line
  const firstEnLine = lines.find(l => l.includes('en:'));
  const useDoubleQuotes = firstEnLine && firstEnLine.includes('en: "');
  const q = useDoubleQuotes ? '"' : "'";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Match lines like:       en: 'word', or       en: "sentence",
    const enMatch = line.match(/^(\s*)en:\s*(['"])(.*?)\2\s*,?\s*$/);
    if (enMatch) {
      const indent = enMatch[1];
      const englishText = enMatch[3];
      const trailingComma = line.endsWith(',') ? ',' : '';

      if (translations[englishText]) {
        const t = translations[englishText];
        // Insert new languages in order before 'en:'
        const newLangs = ['ps','my','prs','fa','pt','ru','vi','de','bn'];
        for (const lang of newLangs) {
          if (t[lang]) {
            // Escape single quotes in the translation
            const escaped = t[lang].replace(/'/g, "\\'");
            const escapedDouble = t[lang].replace(/"/g, '\\"');
            const value = q === "'" ? escaped : escapedDouble;
            newLines.push(`${indent}${lang}: ${q}${value}${q},`);
            insertions++;
          }
        }
      }
    }
    newLines.push(line);
  }

  fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
  return insertions;
}

// Process all data files
const files = [
  'skeletal.ts',
  'muscular.ts',
  'positions.ts',
  'cardiovascular.ts',
  'nervous.ts',
  'respiratory.ts',
  'digestive.ts',
  'interview.ts',
];

let total = 0;
for (const file of files) {
  const n = processFile(file);
  console.log(`${file}: ${n} insertions`);
  total += n;
}
console.log(`\nTotal: ${total} insertions`);
