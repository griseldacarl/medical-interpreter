import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const langCodes = ['ar', 'rw', 'sw', 'zh', 'fr', 'so', 'es', 'ja', 'en']
const t = (...v) => Object.fromEntries(langCodes.map((c, i) => [c, v[i]]))

const scriptDir = fileURLToPath(new URL('.', import.meta.url))
const dataDir = path.resolve(scriptDir, '../src/data')

const jp = (kanji, hiragana, katakana, romaji) => ({ kanji, hiragana, katakana, romaji })

const phonetic = (ar, zh, ja) => ({ ar, zh, ja })

function makeEntry(id, system, trans, ph, jd, pos) {
  const e = { id, system, translations: trans }
  if (ph) e.phonetic = ph
  if (jd) e.japaneseDetail = jd
  if (pos) e.position = pos
  return e
}

function quote(s) {
  return s.includes("'") ? `"${s}"` : `'${s}'`
}

function serializeEntry(e) {
  const lines = ['  {']
  lines.push(`    id: '${e.id}',`)
  lines.push(`    system: '${e.system}',`)
  const tr = e.translations
  const trKeys = Object.keys(tr)
  lines.push(`    translations: {`)
  for (const k of trKeys) {
    lines.push(`      ${k}: ${quote(tr[k])},`)
  }
  lines.push(`    },`)
  if (e.phonetic) {
    lines.push(`    phonetic: {`)
    for (const [k, v] of Object.entries(e.phonetic)) {
      lines.push(`      ${k}: ${quote(v)},`)
    }
    lines.push(`    },`)
  }
  if (e.japaneseDetail) {
    const jd = e.japaneseDetail
    lines.push(`    japaneseDetail: {`)
    lines.push(`      kanji: ${quote(jd.kanji)},`)
    lines.push(`      hiragana: ${quote(jd.hiragana)},`)
    lines.push(`      katakana: ${quote(jd.katakana)},`)
    lines.push(`      romaji: ${quote(jd.romaji)},`)
    lines.push(`    },`)
  }
  if (e.position) {
    lines.push(`    position: ${quote(e.position)},`)
  }
  lines.push(`  },`)
  return lines.join('\n')
}

function writeSystemFile(filename, varName, entries) {
  const header = `import type { TranslationEntry } from '../types/flashcard'\n\nexport const ${varName}: TranslationEntry[] = [\n`
  const footer = `]\n`
  const body = entries.map(serializeEntry).join('\n')
  fs.writeFileSync(path.join(dataDir, filename), header + body + footer)
  console.log(`  Wrote ${filename} (${entries.length} entries)`)
}

// ── Skeletal (28) ─────────────────────────────────────────────────────────

const skeletalTerms = [
  makeEntry('sk-001', 'skeletal', t("عظم","iyagufa","mfupa","骨头","os","lafla","hueso","骨","bone"),
    phonetic("ʿaẓm","gǔtou","hone"), jp("骨","ほね","ボーン","hone")),
  makeEntry('sk-002', 'skeletal', t("جمجمة","agahanga","fuvu","头骨","crâne","dhakada","cráneo","頭蓋骨","skull"),
    phonetic("jumjuma","tóugǔ","zugaikotsu"), jp("頭蓋骨","ずがいこつ","スカル","zugaikotsu")),
  makeEntry('sk-003', 'skeletal', t("قحف","agahanga","fuvu la kichwa","颅骨","crâne","qalf","cráneo","頭蓋","cranium"),
    phonetic("qahf","lúgǔ","zutō"), jp("頭蓋","ずとう","クレニアム","zutō")),
  makeEntry('sk-004', 'skeletal', t("فك سفلي","umurwa w'inyuma","taya ya chini","下颌骨","mandibule","daanka hoose","mandíbula","下顎骨","mandible"),
    phonetic("fakk asfal","xiàhégǔ","kagakukotsu"), jp("下顎骨","かがくこつ","マンディブル","kagakukotsu")),
  makeEntry('sk-005', 'skeletal', t("ترقوة","agashari","mfupa wa bega","锁骨","clavicule","baariga","clavícula","鎖骨","clavicle"),
    phonetic("tarquwa","suǒgǔ","sakotsu"), jp("鎖骨","さこつ","クラビクル","sakotsu")),
  makeEntry('sk-006', 'skeletal', t("كتف","urwagasha","kigasha","肩胛骨","omoplate","bal","omóplato","肩甲骨","scapula"),
    phonetic("katif","jiānjiǎgǔ","kenkōkotsu"), jp("肩甲骨","けんこうこつ","スカプラ","kenkōkotsu")),
  makeEntry('sk-007', 'skeletal', t("قص","igikiriri","mfupa wa kifua","胸骨","sternum","xabadka","esternón","胸骨","sternum"),
    phonetic("qaṣṣ","xiōnggǔ","kyōkotsu"), jp("胸骨","きょうこつ","スターン","kyōkotsu")),
  makeEntry('sk-008', 'skeletal', t("ضلع","urubavu","ubavu","肋骨","côte","feero","costilla","肋骨","rib"),
    phonetic("ḍilʿ","lèigǔ","rokkotsu"), jp("肋骨","ろっこつ","リブ","rokkotsu")),
  makeEntry('sk-009', 'skeletal', t("فقرة","inkinga","utibao wa mgongo","椎骨","vertèbre","fakaro","vértebra","椎骨","vertebra"),
    phonetic("faqara","zhuīgǔ","tsuikotsu"), jp("椎骨","ついこつ","バーテブラ","tsuikotsu")),
  makeEntry('sk-010', 'skeletal', t("عمود فقري","uruti","mfupa wa mgongo","脊柱","colonne vertébrale","lafeedhab","columna vertebral","脊柱","spine"),
    phonetic("ʿamūd faqarī","jǐzhù","sekichū"), jp("脊柱","せきちゅう","スパイン","sekichū")),
  makeEntry('sk-011', 'skeletal', t("حوض","ikibuno","mfupa wa nyonga","骨盆","bassin","miska","pelvis","骨盤","pelvis"),
    phonetic("ḥawḍ","gǔpén","kotsuban"), jp("骨盤","こつばん","ペルビス","kotsuban")),
  makeEntry('sk-012', 'skeletal', t("عظم فخذ","urwagashya","fupa la paja","股骨","fémur","lafta","fémur","大腿骨","femur"),
    phonetic("ʿaẓm fakhdh","gǔgǔ","daitaikotsu"), jp("大腿骨","だいたいこつ","フィーマー","daitaikotsu")),
  makeEntry('sk-013', 'skeletal', t("رضفة","igisingo","mansingoni","髌骨","rotule","cadaanyo","rótula","膝蓋骨","patella"),
    phonetic("raḍafa","bìngǔ","shitsugaikotsu"), jp("膝蓋骨","しつがいこつ","パテラ","shitsugaikotsu")),
  makeEntry('sk-014', 'skeletal', t("ظنبوب","umurundi","mfupa wa mguu","胫骨","tibia","lool","tibia","脛骨","tibia"),
    phonetic("ẓanbūb","jìnggǔ","keikotsu"), jp("脛骨","けいこつ","ティビア","keikotsu")),
  makeEntry('sk-015', 'skeletal', t("شظية","agashye","mfupa wa ndama","腓骨","péroné","shashiyo","peroné","腓骨","fibula"),
    phonetic("shadhīya","féigǔ","hikotsu"), jp("腓骨","ひこつ","フィブラ","hikotsu")),
  makeEntry('sk-016', 'skeletal', t("عضد","ikiganza","mfupa wa mkono","肱骨","humérus","humerus","húmero","上腕骨","humerus"),
    phonetic("ʿaḍud","gōnggǔ","jōwankotsu"), jp("上腕骨","じょうわんこつ","ヒューマーラス","jōwankotsu")),
  makeEntry('sk-017', 'skeletal', t("كعبرة","akayunguruzo","mwenda","桡骨","radius","ka'bara","radio","橈骨","radius"),
    phonetic("kaʿbara","ráogǔ","tōkotsu"), jp("橈骨","とうこつ","レイディアス","tōkotsu")),
  makeEntry('sk-018', 'skeletal', t("زند","inkarakara","mkono","尺骨","cubitus","zand","cúbito","尺骨","ulna"),
    phonetic("zand","chǐgǔ","shakkotsu"), jp("尺骨","しゃっこつ","アルナ","shakkotsu")),
  makeEntry('sk-019', 'skeletal', t("عظام رسغ","amagufa y'ikiganza","mifupa ya kifundo","腕骨","carpiens","carpal","carpo","手根骨","carpals"),
    phonetic("ʿiẓām rusgh","wàngǔ","shukonkotsu"), jp("手根骨","しゅこんこつ","カーパル","shukonkotsu")),
  makeEntry('sk-020', 'skeletal', t("عظام مشط","amagufa y'urutoki","mifupa ya kiganja","掌骨","métacarpiens","metacarpal","metacarpo","中手骨","metacarpals"),
    phonetic("ʿiẓām masht","zhǎnggǔ","chūshukotsu"), jp("中手骨","ちゅうしゅこつ","メタカーパル","chūshukotsu")),
  makeEntry('sk-021', 'skeletal', t("سلاميات","inkingi z'urutoki","phalanges","指骨","phalanges","falanjo","falanges","指骨","phalanges"),
    phonetic("salāmiyāt","zhǐgǔ","shikotsu"), jp("指骨","しこつ","ファランクス","shikotsu")),
  makeEntry('sk-022', 'skeletal', t("عظام رصغ","amagufa y'ibirenge","mifupa ya kiwiko","跗骨","tarsiens","tarsal","tarso","足根骨","tarsals"),
    phonetic("ʿiẓām rasgh","fūgǔ","sokon'kotsu"), jp("足根骨","そくこんこつ","ターサル","sokon'kotsu")),
  makeEntry('sk-023', 'skeletal', t("عظام مشط القدم","amagufa y'ibirenge","mifupa ya mguu","跖骨","métatarsiens","metatarsal","metatarso","中足骨","metatarsals"),
    phonetic("ʿiẓām masht al-qadam","zhígǔ","chūsokukotsu"), jp("中足骨","ちゅうそくこつ","メタターサル","chūsokukotsu")),
  makeEntry('sk-024', 'skeletal', t("عصعص","umugongo","mkia","尾骨","coccyx","cuscis","cóccix","尾骨","coccyx"),
    phonetic("ʿuṣʿuṣ","wěigǔ","bikotsu"), jp("尾骨","びこつ","コクシックス","bikotsu")),
  makeEntry('sk-025', 'skeletal', t("عجز","umugongo","mfupa wa sakramu","骶骨","sacrum","sakram","sacro","仙骨","sacrum"),
    phonetic("ʿajz","dǐgǔ","senkotsu"), jp("仙骨","せんこつ","セイクラム","senkotsu")),
  makeEntry('sk-026', 'skeletal', t("فك علوي","umurwa w'imbere","taya ya juu","上颌骨","maxillaire","daanka sare","maxilar","上顎骨","maxilla"),
    phonetic("fakk ʿulwī","shànghégǔ","jōgakukotsu"), jp("上顎骨","じょうがくこつ","マキシラ","jōgakukotsu")),
  makeEntry('sk-027', 'skeletal', t("عظم وجني","urwagasha","mfupa wa kicheek","颧骨","zygomatique","wajni","cigomático","頬骨","zygomatic bone"),
    phonetic("ʿaẓm wajaniy","quángǔ","kyōkotsu"), jp("頬骨","きょうこつ","ザイゴマティック","kyōkotsu")),
  makeEntry('sk-028', 'skeletal', t("عظم صدغي","agahanga","mfupa wa hekalu","颞骨","temporal","timban","temporal","側頭骨","temporal bone"),
    phonetic("ʿaẓm ṣadghiy","niègǔ","sokutōkotsu"), jp("側頭骨","そくとうこつ","テンポラル","sokutōkotsu")),
]

// ── Muscular (24) ─────────────────────────────────────────────────────────

const muscularTerms = [
  makeEntry('mu-001', 'muscular', t("عضلة","imitsi","misuli","肌肉","muscle","murqo","músculo","筋肉","muscle"),
    phonetic("ʿaḍala","jīròu","kin'niku"), jp("筋肉","きんにく","マッスル","kin'niku")),
  makeEntry('mu-002', 'muscular', t("عضلة ذات رأسين","imitsi ebyiri","biceps","肱二头肌","biceps","biceps","bíceps","上腕二頭筋","biceps"),
    phonetic("ʿaḍala dhāt raʾsayn","gōng'èrtóujī","jōwan nitōkin"), jp("上腕二頭筋","じょうわんにとうきん","バイセップス","jōwan nitōkin")),
  makeEntry('mu-003', 'muscular', t("عضلة ثلاثية الرؤوس","imitsi ishatu","triceps","肱三头肌","triceps","triceps","tríceps","上腕三頭筋","triceps"),
    phonetic("ʿaḍala dhālāthat al-ruʾūs","gōngsāntóujī","jōwan santōkin"), jp("上腕三頭筋","じょうわんさんとうきん","トライセップス","jōwan santōkin")),
  makeEntry('mu-004', 'muscular', t("عضلة رباعية الرؤوس","imitsi enye","quadriceps","股四头肌","quadriceps","quadriceps","cuádriceps","大腿四頭筋","quadriceps"),
    phonetic("ʿaḍala rabāʿiyat al-ruʾūs","gǔsìtóujī","daitai shitōkin"), jp("大腿四頭筋","だいたいしとうきん","クワドリセップス","daitai shitōkin")),
  makeEntry('mu-005', 'muscular', t("عضلة دالية","imitsi y'igitugu","deltoid","三角肌","deltoïde","deltoid","deltoides","三角筋","deltoid"),
    phonetic("ʿaḍala dāliya","sānjiǎojī","sankakukin"), jp("三角筋","さんかくきん","デルトイド","sankakukin")),
  makeEntry('mu-006', 'muscular', t("عضلة صدرية كبيرة","imitsi y'agatuza","pectoralis major","胸大肌","grand pectoral","laab","pectoral mayor","大胸筋","pectoralis major"),
    phonetic("ʿaḍala ṣadrīya kabīra","xiōngdàijī","daikyōkin"), jp("大胸筋","だいきょうきん","ペクトラリス・メジャー","daikyōkin")),
  makeEntry('mu-007', 'muscular', t("عضلة شبه منحرفة","imitsi y'igikomere","trapezius","斜方肌","trapèze","trapezius","trapecio","僧帽筋","trapezius"),
    phonetic("ʿaḍala shibh munḥarifa","xiéfāngjī","sōbōkin"), jp("僧帽筋","そうぼうきん","トラペジウス","sōbōkin")),
  makeEntry('mu-008', 'muscular', t("عضلة ظهرية عريضة","imitsi y'umugongo","latissimus dorsi","背阔肌","grand dorsal","latissimus dorsi","dorsal ancho","広背筋","latissimus dorsi"),
    phonetic("ʿaḍala ẓahrīya ʿarīḍa","bèikuòjī","kōhaikin"), jp("広背筋","こうはいきん","ラティシムス・ドルシ","kōhaikin")),
  makeEntry('mu-009', 'muscular', t("عضلة ألوية كبرى","imitsi y'igikono","gluteus maximus","臀大肌","grand fessier","gluteus maximus","glúteo mayor","大殿筋","gluteus maximus"),
    phonetic("ʿaḍala ulwīya kubrā","túndàjī","daidenkin"), jp("大殿筋","だいでんきん","グルテウス・マキシマス","daidenkin")),
  makeEntry('mu-010', 'muscular', t("أوتار المأبض","imitsi y'ikibero","hamstring","腘绳肌","ischio-jambiers","hamstring","isquiotibiales","ハムストリング","hamstrings"),
    phonetic("awtār al-maʾbaḍ","guōshéngjī","hamusutoringu"), jp("ハムストリング","はむすとりんぐ","ハムストリングス","hamusutoringu")),
  makeEntry('mu-011', 'muscular', t("عضلة ساقية","imitsi y'umukara","gastrocnemius","腓肠肌","gastrocnémien","gastrocnemius","gemelo","腓腹筋","gastrocnemius"),
    phonetic("ʿaḍala sāqīya","féichángjī","hifukukin"), jp("腓腹筋","ひふくきん","ガストロクネミウス","hifukukin")),
  makeEntry('mu-012', 'muscular', t("عضلة نعلية","imitsi y'ikirenge","soleus","比目鱼肌","soléaire","soleus","sóleo","ヒラメ筋","soleus"),
    phonetic("ʿaḍala naʿliya","bǐmùyújī","hiramekin"), jp("ヒラメ筋","ひらめきん","ソレウス","hiramekin")),
  makeEntry('mu-013', 'muscular', t("عضلة مستقيمة بطنية","imitsi y'inda","rectus abdominis","腹直肌","grand droit","rectus abdominis","recto abdominal","腹直筋","rectus abdominis"),
    phonetic("ʿaḍala mustaqīma baṭnīya","fùzhíjī","fukuchokukin"), jp("腹直筋","ふくちょくきん","レクタス・アブドミニス","fukuchokukin")),
  makeEntry('mu-014', 'muscular', t("عضلة مائلة خارجية","imitsi y'uruhande","oblique externe","腹外斜肌","oblique externe","oblique","oblicuo externo","外腹斜筋","external oblique"),
    phonetic("ʿaḍala māʾila khārijīya","fùwàixiéjī","gaifukushakin"), jp("外腹斜筋","がいふくしゃきん","エクスターナル・オブリーク","gaifukushakin")),
  makeEntry('mu-015', 'muscular', t("حجاب حاجز","urugendo","diaphragm","膈肌","diaphragme","diaphragm","diafragma","横隔膜","diaphragm"),
    phonetic("ḥijāb ḥājiz","géjī","ōkakumaku"), jp("横隔膜","おうかくまく","ダイアフラム","ōkakumaku")),
  makeEntry('mu-016', 'muscular', t("عضلة ماضغة","imitsi y'inkama","masseter","咬肌","masséter","masseter","masetero","咬筋","masseter"),
    phonetic("ʿaḍala māḍigha","yǎojī","kōkin"), jp("咬筋","こうきん","マセッター","kōkin")),
  makeEntry('mu-017', 'muscular', t("عضلة قصية ترقوية خشائية","imitsi y'ijosi","sternocleidomastoid","胸锁乳突肌","sternocléidomastoïdien","sternocleidomastoid","esternocleidomastoideo","胸鎖乳突筋","sternocleidomastoid"),
    phonetic("ʿaḍala qaṣṣīya tarquwīya khashāʾīya","xiōngsuǒrǔtūjī","kyōsanyūtokukin"), jp("胸鎖乳突筋","きょうさにゅうとつきん","スターのクレイドマストイド","kyōsanyūtokukin")),
  makeEntry('mu-018', 'muscular', t("عضلة قصبة أمامية","imitsi y'umurundi","tibialis anterior","胫骨前肌","tibial antérieur","tibialis anterior","tibial anterior","前脛骨筋","tibialis anterior"),
    phonetic("ʿaḍala qaṣaba amāmīya","jìnggǔqiánjī","zenkeikotsukin"), jp("前脛骨筋","ぜんけいこつきん","ティビアリス・アンテリオール","zenkeikotsukin")),
  makeEntry('mu-019', 'muscular', t("عضلة باسطة","imitsi irambura","extensor","伸肌","extenseur","extensor","extensor","伸筋","extensor"),
    phonetic("ʿaḍala bāsiṭa","shēnjī","shinkin"), jp("伸筋","しんきん","エクステンサー","shinkin")),
  makeEntry('mu-020', 'muscular', t("عضلة مثنية","imitsi iyunisha","flexor","屈肌","fléchisseur","flexor","flexor","屈筋","flexor"),
    phonetic("ʿaḍala muthniya","qūjī","kukkin"), jp("屈筋","くっきん","フレクサー","kukkin")),
  makeEntry('mu-021', 'muscular', t("عضلة خياطية","imitsi y'ukubina","sartorius","缝匠肌","couturier","sartorius","sartorio","縫工筋","sartorius"),
    phonetic("ʿaḍala khayyāṭīya","féngjiàngjī","hōkōkin"), jp("縫工筋","ほうこうきん","サルトリウス","hōkōkin")),
  makeEntry('mu-022', 'muscular', t("عضلة مقربة طويلة","imitsi ihuza","adductor longus","长收肌","long adducteur","adductor longus","aductor largo","長内転筋","adductor longus"),
    phonetic("ʿaḍala muqarriba ṭawīla","chángshōujī","chōnaitenkin"), jp("長内転筋","ちょうないてんきん","アダクター・ロンガス","chōnaitenkin")),
  makeEntry('mu-023', 'muscular', t("عضلة مبعدة","imitsi itandukanya","abductor","外展肌","abducteur","abductor","abductor","外転筋","abductor"),
    phonetic("ʿaḍala mubʿida","wàizhǎnjī","gaitenkin"), jp("外転筋","がいてんきん","アブダクター","gaitenkin")),
  makeEntry('mu-024', 'muscular', t("عضلة عاصرة","imitsi ikinga","sphincter","括约肌","sphincter","sphincter","esfínter","括約筋","sphincter"),
    phonetic("ʿaḍala ʿāṣira","kuòyuējī","katsuyakukin"), jp("括約筋","かつやくきん","スフィンクター","katsuyakukin")),
]

// ── Cardiovascular (28) ───────────────────────────────────────────────────

const cardiovascularTerms = [
  makeEntry('cv-001', 'cardiovascular', t("قلب","umutima","moyo","心脏","cœur","wadnaha","corazón","心臓","heart"),
    phonetic("qalb","xīnzàng","shinzō"), jp("心臓","しんぞう","ハート","shinzō")),
  makeEntry('cv-002', 'cardiovascular', t("شريان","umuyaga","mshipa","动脉","artère","halbowl","arteria","動脈","artery"),
    phonetic("shiryān","dòngmài","dōmyaku"), jp("動脈","どうみゃく","アーテリー","dōmyaku")),
  makeEntry('cv-003', 'cardiovascular', t("وريد","umusemuzi","mshipa wa damu","静脉","veine","xidid","vena","静脈","vein"),
    phonetic("warīd","jìngmài","jōmyaku"), jp("静脈","じょうみゃく","ベイン","jōmyaku")),
  makeEntry('cv-004', 'cardiovascular', t("شعيرة دموية","umusemburo","kapilari","毛细血管","capillaire","dhiir","capilar","毛細血管","capillary"),
    phonetic("shuʿayra damawīya","máoxìxuèguǎn","mōsaikekkan"), jp("毛細血管","もうさいけっかん","キャピラリー","mōsaikekkan")),
  makeEntry('cv-005', 'cardiovascular', t("أبهر","umuyaga mukuru","aorta","主动脉","aorte","aorta","aorta","大動脈","aorta"),
    phonetic("abhar","zhǔdòngmài","daidōmyaku"), jp("大動脈","だいどうみゃく","エイオルタ","daidōmyaku")),
  makeEntry('cv-006', 'cardiovascular', t("وريد أجوف","umusemuzi mukuru","vena cava","腔静脉","veine cave","vena cava","vena cava","大静脈","vena cava"),
    phonetic("warīd ajwaf","qiāngjìngmài","daijōmyaku"), jp("大静脈","だいじょうみゃく","ベーナ・ケイバ","daijōmyaku")),
  makeEntry('cv-007', 'cardiovascular', t("شريان رئوي","umuyaga w'ibihaha","mshipa wa mapafu","肺动脉","artère pulmonaire","halbowl sambab","arteria pulmonar","肺動脈","pulmonary artery"),
    phonetic("shiryān riʾawī","fèidòngmài","haidōmyaku"), jp("肺動脈","はいどうみゃく","パルモナリー・アーテリー","haidōmyaku")),
  makeEntry('cv-008', 'cardiovascular', t("وريد رئوي","umusemuzi w'ibihaha","mshipa wa mapafu","肺静脉","veine pulmonaire","xidid sambab","vena pulmonar","肺静脈","pulmonary vein"),
    phonetic("warīd riʾawī","fèijìngmài","haijōmyaku"), jp("肺静脈","はいじょうみゃく","パルモナリー・ベイン","haijōmyaku")),
  makeEntry('cv-009', 'cardiovascular', t("شريان تاجي","umuyaga w'umutima","mshipa wa moyo","冠状动脉","artère coronaire","halbowl wadnaha","arteria coronaria","冠動脈","coronary artery"),
    phonetic("shiryān tājī","guānzhuàngdòngmài","kandōmyaku"), jp("冠動脈","かんどうみゃく","コロナリー・アーテリー","kandōmyaku")),
  makeEntry('cv-010', 'cardiovascular', t("عضلة قلبية","imitsi y'umutima","msuli wa moyo","心肌","muscle cardiaque","murqo wadnaha","músculo cardíaco","心筋","cardiac muscle"),
    phonetic("ʿaḍala qalbīya","xīnjī","shinkin"), jp("心筋","しんきん","カーディアク・マッスル","shinkin")),
  makeEntry('cv-011', 'cardiovascular', t("أذين","igice cy'umutima","atiria","心房","oreillette","atrium","aurícula","心房","atrium"),
    phonetic("udhayn","xīnfáng","shinbō"), jp("心房","しんぼう","エイトリアム","shinbō")),
  makeEntry('cv-012', 'cardiovascular', t("بطين","urugingo","ventricle","心室","ventricule","ventricle","ventrículo","心室","ventricle"),
    phonetic("buṭayn","xīnshì","shinshitsu"), jp("心室","しんしつ","ベントリクル","shinshitsu")),
  makeEntry('cv-013', 'cardiovascular', t("صمام قلبي","igikingi","valve ya moyo","心脏瓣膜","valvule cardiaque","valve","válvula cardíaca","心臓弁","cardiac valve"),
    phonetic("ṣimām qalbī","xīnzàngbànmó","shinzōben"), jp("心臓弁","しんぞうべん","カーディアク・バルブ","shinzōben")),
  makeEntry('cv-014', 'cardiovascular', t("دم","amaraso","damu","血液","sang","dhiig","sangre","血液","blood"),
    phonetic("dam","xuèyè","ketsueki"), jp("血液","けつえき","ブラッド","ketsueki")),
  makeEntry('cv-015', 'cardiovascular', t("بلازما","umubumbano","plasma","血浆","plasma","plasma","plasma","血漿","plasma"),
    phonetic("blāzmā","xuèjiāng","kesshō"), jp("血漿","けっしょう","プラズマ","kesshō")),
  makeEntry('cv-016', 'cardiovascular', t("خلية دم حمراء","umusemburo w'amaraso","seli nyekundu","红细胞","globule rouge","unug cad","glóbulo rojo","赤血球","red blood cell"),
    phonetic("khalīya dam ḥamrāʾ","hóngxìbāo","sekkekkyū"), jp("赤血球","せっけっきゅう","レッド・ブラッド・セル","sekkekkyū")),
  makeEntry('cv-017', 'cardiovascular', t("خلية دم بيضاء","umusemburo w'amaraso","seli nyeupe","白细胞","globule blanc","unug cad","glóbulo blanco","白血球","white blood cell"),
    phonetic("khalīya dam bayḍāʾ","báixìbāo","hakkekkyū"), jp("白血球","はっけっきゅう","ホワイト・ブラッド・セル","hakkekkyū")),
  makeEntry('cv-018', 'cardiovascular', t("صفيحة دموية","urupapuro","platelet","血小板","plaquette","platelet","plaqueta","血小板","platelet"),
    phonetic("ṣafīḥa damawīya","xuèxiǎobǎn","kesshōban"), jp("血小板","けっしょうばん","プレイトレット","kesshōban")),
  makeEntry('cv-019', 'cardiovascular', t("هيموغلوبين","hemoglobin","hemoglobini","血红蛋白","hémoglobine","hemoglobin","hemoglobina","ヘモグロビン","hemoglobin"),
    phonetic("hīmūghlūbīn","xuèhóngdànbái","hemogurobin"), jp("ヘモグロビン","へもぐろびん","ヘモグロビン","hemogurobin")),
  makeEntry('cv-020', 'cardiovascular', t("نبض","umuvuduko","pulse","脉搏","pouls","suul","pulso","脈拍","pulse"),
    phonetic("nabaḍ","màibó","myakuhaku"), jp("脈拍","みゃくはく","パルス","myakuhaku")),
  makeEntry('cv-021', 'cardiovascular', t("ضغط الدم","umuvuduko w'amaraso","shinikizo la damu","血压","tension artérielle","dhlig karka","presión arterial","血圧","blood pressure"),
    phonetic("ḍaghṭ al-dam","xuèyā","ketsuatsu"), jp("血圧","けつあつ","ブラッド・プレッシャー","ketsuatsu")),
  makeEntry('cv-022', 'cardiovascular', t("انقباض","umuvuduko","sistoliki","收缩压","systole","systolic","sistólico","収縮期","systolic"),
    phonetic("inqibāḍ","shōusuōyā","shūshukuki"), jp("収縮期","しゅうしゅくき","シストリック","shūshukuki")),
  makeEntry('cv-023', 'cardiovascular', t("انبساط","umuvuduko","diastoliki","舒张压","diastole","diastolic","diastólico","拡張期","diastolic"),
    phonetic("inbisāṭ","shūzhāngyā","kakuchōki"), jp("拡張期","かくちょうき","ダイアストリック","kakuchōki")),
  makeEntry('cv-024', 'cardiovascular', t("تامور","uruhushya","pericardiamu","心包","péricarde","pericardium","pericardio","心膜","pericardium"),
    phonetic("tāmūr","xīnbāo","shinmaku"), jp("心膜","しんまく","ペリカーディアム","shinmaku")),
  makeEntry('cv-025', 'cardiovascular', t("شغاف","uruhushya","endocardiamu","心内膜","endocarde","endocardium","endocardio","心内膜","endocardium"),
    phonetic("shighāf","xīn nèi mó","shinnaimaku"), jp("心内膜","しんないまく","エンドカーディアム","shinnaimaku")),
  makeEntry('cv-026', 'cardiovascular', t("حاجز","urugomero","septamu","室间隔","septum","septum","tabique","中隔","septum"),
    phonetic("ḥājiz","shìjiàngé","chūkaku"), jp("中隔","ちゅうかく","セプタム","chūkaku")),
  makeEntry('cv-027', 'cardiovascular', t("عقدة جيبية أذينية","urugingo","nodu la sinoatiria","窦房结","nœud sinusal","sinoatrial node","nódulo sinoauricular","洞房結節","sinoatrial node"),
    phonetic("ʿuqda jībīya udhaynīya","dòufángjié","dōbōkessetsu"), jp("洞房結節","どうぼうけっせつ","サイノアトリアル・ノード","dōbōkessetsu")),
  makeEntry('cv-028', 'cardiovascular', t("أوتار القلب","insinga","mishipa ya moyo","腱索","cordages tendineux","chordae tendineae","cuerdas tendinosas","腱索","chordae tendineae"),
    phonetic("awtār al-qalb","jiànsuǒ","kensaku"), jp("腱索","けんさく","コルダエ・テンディネアエ","kensaku")),
]

// ── Nervous (25) ──────────────────────────────────────────────────────────

const nervousTerms = [
  makeEntry('nv-001', 'nervous', t("دماغ","ubwonko","ubongo","大脑","cerveau","maskax","cerebro","脳","brain"),
    phonetic("dimāgh","dànǎo","nō"), jp("脳","のう","ブレイン","nō")),
  makeEntry('nv-002', 'nervous', t("نخاع شوكي","umurongo","utovu wa mgongo","脊髓","moelle épinière","xedh","médula espinal","脊髄","spinal cord"),
    phonetic("nukhāʿ shawkī","jǐsuǐ","sekizui"), jp("脊髄","せきずい","スパイナルコード","sekizui")),
  makeEntry('nv-003', 'nervous', t("عصبون","uron","niuroni","神经元","neurone","neuron","neurona","ニューロン","neuron"),
    phonetic("ʿuṣbūn","shénjīngyuán","nyūron"), jp("ニューロン","にゅーろん","ニューロン","nyūron")),
  makeEntry('nv-004', 'nervous', t("عصب","urwonko","neva","神经","nerf","nervis","nervio","神経","nerve"),
    phonetic("ʿaṣab","shénjīng","shinkei"), jp("神経","しんけい","ナーブ","shinkei")),
  makeEntry('nv-005', 'nervous', t("محور","akanyabugingo","aksoni","轴突","axone","axon","axón","軸索","axon"),
    phonetic("miḥwar","zhóutū","jikusaku"), jp("軸索","じくさく","アクソン","jikusaku")),
  makeEntry('nv-006', 'nervous', t("تغصن","urwagasha","dendriti","树突","dendrite","dendrite","dendrita","樹状突起","dendrite"),
    phonetic("taghaṣṣun","shùtū","jujōtokki"), jp("樹状突起","じゅじょうとっき","デンドライト","jujōtokki")),
  makeEntry('nv-007', 'nervous', t("تشابك عصبي","ahantu","sinapsi","突触","synapse","synapse","sinapsis","シナプス","synapse"),
    phonetic("tashābuk ʿaṣabī","tūchù","shinapusu"), jp("シナプス","しなぷす","シナプス","shinapusu")),
  makeEntry('nv-008', 'nervous', t("ناقل عصبي","umutware","neutransmita","神经递质","neurotransmetteur","neurotransmitter","neurotransmisor","神経伝達物質","neurotransmitter"),
    phonetic("nāqil ʿaṣabī","shénjīngdìzhì","shinkeidentatsu busshitsu"), jp("神経伝達物質","しんけいでんたつぶっしつ","ニューロトランスミッター","shinkeidentatsu busshitsu")),
  makeEntry('nv-009', 'nervous', t("مخ","ubwonko","serebrumu","大脑","cerveau","maskax","cerebro","大脳","cerebrum"),
    phonetic("mukhkh","dànǎo","dainō"), jp("大脳","だいのう","セレブラム","dainō")),
  makeEntry('nv-010', 'nervous', t("مخيخ","ubwonko buto","serebelamu","小脑","cervelet","serebellum","cerebelo","小脳","cerebellum"),
    phonetic("mukhayyakh","xiǎonǎo","shōnō"), jp("小脳","しょうのう","セレベラム","shōnō")),
  makeEntry('nv-011', 'nervous', t("جذع دماغي","uruti","shina la ubongo","脑干","tronc cérébral","jirid","tronco encefálico","脳幹","brainstem"),
    phonetic("jidhʿ dimāghī","nǎogàn","nōkan"), jp("脳幹","のうかん","ブレインステム","nōkan")),
  makeEntry('nv-012', 'nervous', t("تحت المهاد","munsi","hipothalamasi","下丘脑","hypothalamus","hypothalamus","hipotálamo","視床下部","hypothalamus"),
    phonetic("taḥta al-mihād","xiàqiūnǎo","shishōkabu"), jp("視床下部","ししょうかぶ","ハイポタラマス","shishōkabu")),
  makeEntry('nv-013', 'nervous', t("مهاد","muha","thalamasi","丘脑","thalamus","thalamus","tálamo","視床","thalamus"),
    phonetic("mihād","qiūnǎo","shishō"), jp("視床","ししょう","タラマス","shishō")),
  makeEntry('nv-014', 'nervous', t("حصين","ubutwari","hipokampasi","海马","hippocampe","hippocampus","hipocampo","海馬","hippocampus"),
    phonetic("ḥuṣayn","hǎimǎ","kaiba"), jp("海馬","かいば","ヒポカンパス","kaiba")),
  makeEntry('nv-015', 'nervous', t("لوزة","amigdala","amigdala","杏仁核","amygdale","amygdala","amígdala","扁桃体","amygdala"),
    phonetic("lawza","xìngrénhé","hentōtai"), jp("扁桃体","へんとうたい","アミグダラ","hentōtai")),
  makeEntry('nv-016', 'nervous', t("قشرة مخية","uruhushya","koteksi","大脑皮层","cortex cérébral","cortex","corteza cerebral","大脳皮質","cerebral cortex"),
    phonetic("qishrat mukhkhīya","dànǎopícéng","dainōhishitsu"), jp("大脳皮質","だいのうひしつ","セレブラル・コーテックス","dainōhishitsu")),
  makeEntry('nv-017', 'nervous', t("سحايا","uruhushya","meninjisi","脑膜","méninges","meninges","meninges","髄膜","meninges"),
    phonetic("saḥāyā","nǎomó","zuimaku"), jp("髄膜","ずいまく","メニンジーズ","zuimaku")),
  makeEntry('nv-018', 'nervous', t("سائل دماغي شوكي","amazi","maji ya uti","脑脊液","liquide cérébro-spinal","dheecaan","líquido cefalorraquídeo","脳脊髄液","cerebrospinal fluid"),
    phonetic("sāʾil dimāghī shawkī","nǎojǐyè","nōsekizuieki"), jp("脳脊髄液","のうせきずいえき","セレブロスピナル・フルイド","nōsekizuieki")),
  makeEntry('nv-019', 'nervous', t("منعكس","ubwitonze","refleksi","反射","réflexe","reflex","reflejo","反射","reflex"),
    phonetic("munʿakis","fǎnshè","hansha"), jp("反射","はんしゃ","リフレックス","hansha")),
  makeEntry('nv-020', 'nervous', t("عقدة عصبية","inkinga","ganglioni","神经节","ganglion","ganglion","ganglio","神経節","ganglion"),
    phonetic("ʿuqda ʿaṣabīya","shénjīngjié","shinkeitetsu"), jp("神経節","しんけいせつ","ガングリオン","shinkeitetsu")),
  makeEntry('nv-021', 'nervous', t("عصبون حركي","uron","niuroni ya mwendo","运动神经元","motoneurone","motor neuron","motoneurona","運動ニューロン","motor neuron"),
    phonetic("ʿuṣbūn ḥarakī","yùndòngshénjīngyuán","undō nyūron"), jp("運動ニューロン","うんどうにゅーろん","モーターニューロン","undō nyūron")),
  makeEntry('nv-022', 'nervous', t("عصبون حسي","uron wa hisia","niuroni ya hisia","感觉神经元","neurone sensoriel","sensory neuron","neurona sensorial","感覚ニューロン","sensory neuron"),
    phonetic("ʿuṣbūn ḥissī","gǎnjuéshénjīngyuán","kankaku nyūron"), jp("感覚ニューロン","かんかくにゅーろん","センサリー・ニューロン","kankaku nyūron")),
  makeEntry('nv-023', 'nervous', t("غمد مياليني","uruhushya","myelin","髓鞘","gaine de myéline","myelin","vaina de mielina","髄鞘","myelin sheath"),
    phonetic("ghimd mīyālīnī","suǐqiào","zuishō"), jp("髄鞘","ずいしょう","マイエリン・シース","zuishō")),
  makeEntry('nv-024', 'nervous', t("فص جبهي","imbere","tundu la mbele","额叶","lobe frontal","lobe frontal","lóbulo frontal","前頭葉","frontal lobe"),
    phonetic("faṣṣ jabhī","éyè","zentōyō"), jp("前頭葉","ぜんとうよう","フロンタル・ローブ","zentōyō")),
  makeEntry('nv-025', 'nervous', t("فص قذالي","inyuma","tundu la nyuma","枕叶","lobe occipital","lobe occipital","lóbulo occipital","後頭葉","occipital lobe"),
    phonetic("faṣṣ qadhdhālī","zhěnyè","kōtōyō"), jp("後頭葉","こうとうよう","オクシピタル・ローブ","kōtōyō")),
]

// ── Respiratory (20) ──────────────────────────────────────────────────────

const respiratoryTerms = [
  makeEntry('re-001', 'respiratory', t("رئة","ibihaha","pafu","肺","poumon","sambab","pulmón","肺","lung"),
    phonetic("riʾa","fèi","hai"), jp("肺","はい","ラング","hai")),
  makeEntry('re-002', 'respiratory', t("قصبة هوائية","umunyonga","bomba la pumzi","气管","trachée","hawo","tráquea","気管","trachea"),
    phonetic("qaṣaba hawāʾīya","qìguǎn","kikan"), jp("気管","きかん","トレーキア","kikan")),
  makeEntry('re-003', 'respiratory', t("شعبة هوائية","umunyonga","bronksi","支气管","bronche","bronchial","bronquio","気管支","bronchus"),
    phonetic("shuʿba hawāʾīya","zhīqìguǎn","kikanshi"), jp("気管支","きかんし","ブロンカス","kikanshi")),
  makeEntry('re-004', 'respiratory', t("قصيبة","akanyonga","bronkiol","细支气管","bronchiol","bronchiole","bronquiolo","細気管支","bronchiole"),
    phonetic("quṣayba","xìzhīqìguǎn","saikikanshi"), jp("細気管支","さいきかんし","ブロンキオール","saikikanshi")),
  makeEntry('re-005', 'respiratory', t("حويصل","uruhushya","alveoli","肺泡","alvéole","alveolus","alvéolo","肺胞","alveolus"),
    phonetic("ḥuwayṣil","fèipào","haihō"), jp("肺胞","はいほう","アルベオラス","haihō")),
  makeEntry('re-006', 'respiratory', t("غشاء جنبي","uruhushya","pleura","胸膜","plèvre","pleura","pleura","胸膜","pleura"),
    phonetic("ghishāʾ junabī","xiōngmó","kyōmaku"), jp("胸膜","きょうまく","プレウラ","kyōmaku")),
  makeEntry('re-007', 'respiratory', t("بلعوم","umuhogo","koromeo","咽","pharynx","cunqun","faringe","咽頭","pharynx"),
    phonetic("balʿūm","yān","intō"), jp("咽頭","いんとう","ファリンクス","intō")),
  makeEntry('re-008', 'respiratory', t("حنجرة","umunwa","zolio","喉","larynx","cunqun","laringe","喉頭","larynx"),
    phonetic("ḥanjara","hóu","kōtō"), jp("喉頭","こうとう","ラリンクス","kōtō")),
  makeEntry('re-009', 'respiratory', t("تجويف أنفي","umunwa","pua","鼻腔","cavité nasale","san","cavidad nasal","鼻腔","nasal cavity"),
    phonetic("tajwīf anfī","bíqiāng","bikō"), jp("鼻腔","びこう","ネイザル・キャビティ","bikō")),
  makeEntry('re-010', 'respiratory', t("لسان المزمار","ururimi","epiglotti","会厌","épiglotte","epiglottis","epiglotis","喉頭蓋","epiglottis"),
    phonetic("lisān al-mizmār","huìyàn","kōtōgai"), jp("喉頭蓋","こうとうがい","エピグロッティス","kōtōgai")),
  makeEntry('re-011', 'respiratory', t("أكسجين","ogisijeni","oksijeni","氧气","oxygène","oksajiin","oxígeno","酸素","oxygen"),
    phonetic("uksijīn","yǎngqì","sanso"), jp("酸素","さんそ","オキシゲン","sanso")),
  makeEntry('re-012', 'respiratory', t("ثاني أكسيد الكربون","kariboni","kaboni dioksidi","二氧化碳","dioxyde de carbone","kaarboon laba","dióxido de carbono","二酸化炭素","carbon dioxide"),
    phonetic("thānī uksīd al-karbūn","èryǎnghuàtàn","nisanka tanso"), jp("二酸化炭素","にさんかたんそ","カーボン・ダイオキシド","nisanka tanso")),
  makeEntry('re-013', 'respiratory', t("تنفس","guhumeka","kupumua","呼吸","respiration","neefsashada","respiración","呼吸","respiration"),
    phonetic("tanaffus","hūxī","kokyū"), jp("呼吸","こきゅう","レスピレーション","kokyū")),
  makeEntry('re-014', 'respiratory', t("شهيق","guhumeka","kuvuta pumzi","吸气","inspiration","neefsi","inspiración","吸気","inhalation"),
    phonetic("shahīq","xīqì","kyūki"), jp("吸気","きゅうき","インハレーション","kyūki")),
  makeEntry('re-015', 'respiratory', t("زفير","guhumeka","kutoa pumzi","呼气","expiration","neefso","espiración","呼気","exhalation"),
    phonetic("zafīr","hūqì","koki"), jp("呼気","こき","エクスハレーション","koki")),
  makeEntry('re-016', 'respiratory', t("رئوي","ibihaha","pulmonari","肺动脉的","pulmonaire","sambabeed","pulmonar","肺の","pulmonary"),
    phonetic("riʾawī","fèi","hai no"), jp("肺の","はいの","パルモナリー","hai no")),
  makeEntry('re-017', 'respiratory', t("صدر","igituza","kifua","胸","thorax","xabad","tórax","胸郭","thorax"),
    phonetic("ṣadr","xiōng","kyōkaku"), jp("胸郭","きょうかく","ソラックス","kyōkaku")),
  makeEntry('re-018', 'respiratory', t("عضلة بين ضلوعية","imitsi","msuli wa mbavu","肋间肌","muscle intercostal","murqo","músculo intercostal","肋間筋","intercostal muscle"),
    phonetic("ʿaḍala bayn ḍilūʿīya","lèijiānjī","rokkan'kin"), jp("肋間筋","ろっかんきん","インターコースタル・マッスル","rokkan'kin")),
  makeEntry('re-019', 'respiratory', t("مادة فعالة سطحية","uruhushya","sufractanti","表面活性剂","surfactant","surfactant","surfactante","肺サーファクタント","surfactant"),
    phonetic("mādda faʿʿāla saṭḥīya","biǎomiànhuóxìngjì","hai sāfakutanto"), jp("肺サーファクタント","はいさーふぁくたんと","サーファクタント","hai sāfakutanto")),
  makeEntry('re-020', 'respiratory', t("نقير رئوي","uruhushya","hilamu","肺门","hile","hilum","hilio","肺門","hilum"),
    phonetic("naqīr riʾawī","fèimén","haimon"), jp("肺門","はいもん","ハイラム","haimon")),
]

// ── Digestive (27) ────────────────────────────────────────────────────────

const digestiveTerms = [
  makeEntry('di-001', 'digestive', t("معدة","igifu","tumbo","胃","estomac","calool","estómago","胃","stomach"),
    phonetic("miʿda","wèi","i"), jp("胃","い","ストマック","i")),
  makeEntry('di-002', 'digestive', t("مريء","umuhogo","umio","食管","œsophage","dhuunta","esófago","食道","esophagus"),
    phonetic("marīʾ","shíguǎn","shokudō"), jp("食道","しょくどう","エソファガス","shokudō")),
  makeEntry('di-003', 'digestive', t("أمعاء دقيقة","amaraya","utumbo mdogo","小肠","intestin grêle","xiird","intestino delgado","小腸","small intestine"),
    phonetic("amʿāʾ daqīqa","xiǎocháng","shōchō"), jp("小腸","しょうちょう","スモール・インテスティン","shōchō")),
  makeEntry('di-004', 'digestive', t("أمعاء غليظة","amaraya","utumbo mpana","大肠","gros intestin","xiird","intestino grueso","大腸","large intestine"),
    phonetic("amʿāʾ ghalīẓa","dàcháng","daichō"), jp("大腸","だいちょう","ラージ・インテスティン","daichō")),
  makeEntry('di-005', 'digestive', t("كبد","umwijima","ini","肝脏","foie","beer","hígado","肝臓","liver"),
    phonetic("kabid","gānzàng","kanzō"), jp("肝臓","かんぞう","リバー","kanzō")),
  makeEntry('di-006', 'digestive', t("بنكرياس","nyongo","kongosho","胰腺","pancréas","gunbur","páncreas","膵臓","pancreas"),
    phonetic("bankriyās","yíxiàn","suizō"), jp("膵臓","すいぞう","パンクレアス","suizō")),
  makeEntry('di-007', 'digestive', t("مرارة","umuhaha","nyongo","胆囊","vésicule biliaire","xammeer","vesícula biliar","胆嚢","gallbladder"),
    phonetic("marāra","dǎnnáng","tannō"), jp("胆嚢","たんのう","ゴールブラダー","tannō")),
  makeEntry('di-008', 'digestive', t("طحال","ingororero","wengu","脾脏","rate","beer","bazo","脾臓","spleen"),
    phonetic("ṭiḥāl","pízàng","hizō"), jp("脾臓","ひぞう","スプリーン","hizō")),
  makeEntry('di-009', 'digestive', t("زائدة دودية","agategura","apendiksi","阑尾","appendice","xanuun","apéndice","虫垂","appendix"),
    phonetic("zāʾida dūdīya","lánwěi","chūsui"), jp("虫垂","ちゅうすい","アペンディックス","chūsui")),
  makeEntry('di-010', 'digestive', t("قولون","umura","koloni","结肠","côlon","xiird","colon","結腸","colon"),
    phonetic("qūlūn","jiécháng","ketchō"), jp("結腸","けっちょう","コロン","ketchō")),
  makeEntry('di-011', 'digestive', t("مستقيم","umura","rektamu","直肠","rectum","malaw","recto","直腸","rectum"),
    phonetic("mustaqīm","zhícháng","chokuchō"), jp("直腸","ちょくちょう","レクタム","chokuchō")),
  makeEntry('di-012', 'digestive', t("شرج","urwamo","mkundu","肛门","anus","dabaro","ano","肛門","anus"),
    phonetic("sharj","gāngmén","kōmon"), jp("肛門","こうもん","エイナス","kōmon")),
  makeEntry('di-013', 'digestive', t("غدة لعابية","uruti","tezi ya mdomo","唾液腺","glande salivaire","qanjid","glándula salival","唾液腺","salivary gland"),
    phonetic("ghudda luʿābīya","tuòyèxiàn","daekisen"), jp("唾液腺","だえきせん","サリバリー・グランド","daekisen")),
  makeEntry('di-014', 'digestive', t("لسان","ururimi","ulimi","舌头","langue","carrab","lengua","舌","tongue"),
    phonetic("lisān","shétou","shita"), jp("舌","した","タング","shita")),
  makeEntry('di-015', 'digestive', t("سن","iryo","jino","牙齿","dent","ilig","diente","歯","tooth"),
    phonetic("sinn","yáchǐ","ha"), jp("歯","は","トゥース","ha")),
  makeEntry('di-016', 'digestive', t("اثنا عشر","hagati","duodenamu","十二指肠","duodénum","duodenum","duodeno","十二指腸","duodenum"),
    phonetic("ithnā ʿashar","shí'èrzhǐcháng","jūnishichō"), jp("十二指腸","じゅうにしちょう","デュオデナム","jūnishichō")),
  makeEntry('di-017', 'digestive', t("صائم","hagati","jejunamu","空肠","jéjunum","jejunum","yeyuno","空腸","jejunum"),
    phonetic("ṣāʾim","kōngcháng","kūchō"), jp("空腸","くうちょう","ジェジュナム","kūchō")),
  makeEntry('di-018', 'digestive', t("لفائفي","hagati","ileamu","回肠","iléon","ileum","íleon","回腸","ileum"),
    phonetic("ilfāʾifī","huícháng","kaichō"), jp("回腸","かいちょう","イレアム","kaichō")),
  makeEntry('di-019', 'digestive', t("أعور","umura","seakamu","盲肠","cæcum","cecum","ciego","盲腸","cecum"),
    phonetic("aʿwar","mángcháng","mōchō"), jp("盲腸","もうちょう","シーカム","mōchō")),
  makeEntry('di-020', 'digestive', t("قولون سيني","umura","koloni ya sigmundi","乙状结肠","côlon sigmoïde","xiird","colon sigmoide","S状結腸","sigmoid colon"),
    phonetic("qūlūn sīnī","yǐzhuàngjiécháng","esu jō ketchō"), jp("S状結腸","エスじょうけっちょう","シグモイド・コロン","esu jō ketchō")),
  makeEntry('di-021', 'digestive', t("ثنية كبدية","umura","hepatic flexure","肝曲","angle hépatique","qamar","flexura hepática","肝弯曲部","hepatic flexure"),
    phonetic("thunīya kabidīya","gānqū","kanwankyokubu"), jp("肝弯曲部","かんわんきょくぶ","ヘパティック・フレクシャー","kanwankyokubu")),
  makeEntry('di-022', 'digestive', t("ثنية طحالية","umura","splenic flexure","脾曲","angle splénique","qamar","flexura esplénica","脾弯曲部","splenic flexure"),
    phonetic("thunīya ṭiḥālīya","píqū","hiwankyokubu"), jp("脾弯曲部","ひわんきょくぶ","スプレニック・フレクシャー","hiwankyokubu")),
  makeEntry('di-023', 'digestive', t("صفراء","imari","nyongo","胆汁","bile","xammeer","bilis","胆汁","bile"),
    phonetic("ṣafrāʾ","dǎnzhī","tanjū"), jp("胆汁","たんじゅう","バイル","tanjū")),
  makeEntry('di-024', 'digestive', t("إنزيم","uruti","enzimu","酶","enzyme","enzyme","enzima","酵素","enzyme"),
    phonetic("inzīm","méi","kōso"), jp("酵素","こうそ","エンザイム","kōso")),
  makeEntry('di-025', 'digestive', t("تمعج","guhinduka","peristalsis","蠕动","péristaltisme","peristalsis","peristalsis","蠕動","peristalsis"),
    phonetic("tamawwuj","rúdòng","zendō"), jp("蠕動","ぜんどう","ペリスタルシス","zendō")),
  makeEntry('di-026', 'digestive', t("زغبة","uruhushya","villus","绒毛","villosité","villus","vellosidad","絨毛","villus"),
    phonetic("zaghba","róngmáo","jūmō"), jp("絨毛","じゅうもう","ビラス","jūmō")),
  makeEntry('di-027', 'digestive', t("مساريق","uruhushya","mesenteri","肠系膜","mésentère","mesentery","mesenterio","腸間膜","mesentery"),
    phonetic("misārīq","chángjìmó","chōkanmaku"), jp("腸間膜","ちょうかんまく","メセンテリー","chōkanmaku")),
]

// ── Positions (28) ────────────────────────────────────────────────────────

const positionsTerms = [
  makeEntry('po-001', 'positions', t("أمامي","imbere","mbele","前","antérieur","hore","anterior","前","anterior"),
    phonetic("amāmī","qián","zen"), jp("前","まえ","アンテリオール","mae"), "anterior"),
  makeEntry('po-002', 'positions', t("خلفي","inyuma","nyuma","后","postérieur","dambe","posterior","後","posterior"),
    phonetic("khalafī","hòu","kō"), jp("後","うしろ","ポステリオール","ushiro"), "posterior"),
  makeEntry('po-003', 'positions', t("علوي","hejuru","juu","上","supérieur","sare","superior","上","superior"),
    phonetic("ʿulwī","shàng","jō"), jp("上","うえ","スペリオール","ue"), "superior"),
  makeEntry('po-004', 'positions', t("سفلي","hasi","chini","下","inférieur","hoose","inferior","下","inferior"),
    phonetic("suflī","xià","ka"), jp("下","した","インフェリオール","shita"), "inferior"),
  makeEntry('po-005', 'positions', t("إنسي","imbere","ndani","内侧","médial","dhexe","medial","内側","medial"),
    phonetic("insī","nèicè","naisoku"), jp("内側","うちがわ","メディアル","uchigawa"), "medial"),
  makeEntry('po-006', 'positions', t("وحشي","inyuma","nje","外侧","latéral","dhinac","lateral","外側","lateral"),
    phonetic("waḥshī","wàicè","gaisoku"), jp("外側","そとがわ","ラテラル","sotogawa"), "lateral"),
  makeEntry('po-007', 'positions', t("داني","hafi","karibu","近端","proximal","ku dhawa","proximal","近位","proximal"),
    phonetic("dānī","jìnduān","kin'i"), jp("近位","きんい","プロキシマル","kin'i"), "proximal"),
  makeEntry('po-008', 'positions', t("قصي","kure","mbali","远端","distal","fog","distal","遠位","distal"),
    phonetic("qaṣī","yuǎnduān","en'i"), jp("遠位","えんい","ディスタル","en'i"), "distal"),
  makeEntry('po-009', 'positions', t("سطحي","hejuru","juu juu","浅","superficiel","sare","superficial","表層","superficial"),
    phonetic("saṭḥī","qiǎn","hyōsō"), jp("表層","ひょうそう","スーパーフィシャル","hyōsō"), "superficial"),
  makeEntry('po-010', 'positions', t("عميق","imbere","ndani","深","profond","qoto","profundo","深層","deep"),
    phonetic("ʿamīq","shēn","shinsō"), jp("深層","しんそう","ディープ","shinsō"), "deep"),
  makeEntry('po-011', 'positions', t("مركزي","hagati","katikati","中央","central","dhexe","central","中心","central"),
    phonetic("markazī","zhōngyāng","chūshin"), jp("中心","ちゅうしん","セントラル","chūshin"), "central"),
  makeEntry('po-012', 'positions', t("محيطي","impande","pembeni","外周","périphérique","dhinac","periférico","末梢","peripheral"),
    phonetic("muḥīṭī","wàizhōu","masshō"), jp("末梢","まっしょう","ペリフェラル","masshō"), "peripheral"),
  makeEntry('po-013', 'positions', t("ظهري","inyuma","mgongo","背","dorsal","dhab","dorsal","背側","dorsal"),
    phonetic("ẓahrī","bèi","haisoku"), jp("背側","はいそく","ドーサル","haisoku"), "dorsal"),
  makeEntry('po-014', 'positions', t("بطني","imbere","tumbo","腹","ventral","calool","ventral","腹側","ventral"),
    phonetic("baṭnī","fù","fukusoku"), jp("腹側","ふくそく","ベントラル","fukusoku"), "ventral"),
  makeEntry('po-015', 'positions', t("قحفي","imbere","kichwa","头","crânien","dhakada","craneal","頭側","cranial"),
    phonetic("qaḥfī","tóu","tōsoku"), jp("頭側","とうそく","クレイニアル","tōsoku"), "cranial"),
  makeEntry('po-016', 'positions', t("ذنبي","inyuma","mkia","尾","caudal","dabo","caudal","尾側","caudal"),
    phonetic("dhanabī","wěi","bisoku"), jp("尾側","びそく","コーダル","bisoku"), "caudal"),
  makeEntry('po-017', 'positions', t("أنفي","imbere","pua","嘴侧","rostral","san","rostral","吻側","rostral"),
    phonetic("anfī","zuǐcè","funsoku"), jp("吻側","ふんそく","ロストラル","funsoku"), "rostral"),
  makeEntry('po-018', 'positions', t("سهمي","imbere","sagitali","矢状","sagittal","sagittal","sagital","矢状","sagittal"),
    phonetic("sahmī","shǐzhuàng","shijō"), jp("矢状","しじょう","サジタル","shijō"), "sagittal"),
  makeEntry('po-019', 'positions', t("إكليلي","impande","koronali","冠状","coronal","coronal","coronal","冠状","coronal"),
    phonetic("iklīlī","guànzhuàng","kanjō"), jp("冠状","かんじょう","コロナル","kanjō"), "coronal"),
  makeEntry('po-020', 'positions', t("مستعرض","impande","transvarsi","横断","transverse","transverse","transverso","横断","transverse"),
    phonetic("mustaʿriḍ","héngduàn","ōdan"), jp("横断","おうだん","トランスバース","ōdan"), "transverse"),
  makeEntry('po-021', 'positions', t("ناصف","hagati","kati","正中","médian","bartame","medio","正中","median"),
    phonetic("nāṣif","zhèngzhōng","seichū"), jp("正中","せいちゅう","ミディアン","seichū"), "median"),
  makeEntry('po-022', 'positions', t("منبطح","hasi","tumbo chini","俯卧","prone","dhac","prono","うつ伏せ","prone"),
    phonetic("munbaṭiḥ","fǔwò","utsubuse"), jp("うつ伏せ","うつぶせ","プローン","utsubuse"), "prone"),
  makeEntry('po-023', 'positions', t("مستلق","hejuru","mgongo chini","仰卧","couché sur le dos","xabxab","supino","仰向け","supine"),
    phonetic("mustalqin","yǎngwò","aomuke"), jp("仰向け","あおむけ","サパイン","aomuke"), "supine"),
  makeEntry('po-024', 'positions', t("نفس الجانب","uruhande","upande ule ule","同侧","ipsilatéral","isla","ipsilateral","同側","ipsilateral"),
    phonetic("nafs al-jānib","tóngcè","dōsoku"), jp("同側","どうそく","イプシラテラル","dōsoku"), "ipsilateral"),
  makeEntry('po-025', 'positions', t("مقابل","uruhande","upande mwingine","对侧","controlatéral","ka soo horjeed","contralateral","対側","contralateral"),
    phonetic("muqābil","duìcè","taisoku"), jp("対側","たいそく","コントララテラル","taisoku"), "contralateral"),
  makeEntry('po-026', 'positions', t("ثنائي الجانب","impande","pande mbili","双侧","bilatéral","labada","bilateral","両側","bilateral"),
    phonetic("thunāʾī al-jānib","shuāngcè","ryōsoku"), jp("両側","りょうそく","バイラテラル","ryōsoku"), "bilateral"),
  makeEntry('po-027', 'positions', t("راحي","ikiganza","kiganjani","掌","palmaire","gacan","palmar","掌側","palmar"),
    phonetic("rāḥī","zhǎng","shōsoku"), jp("掌側","しょうそく","パルマー","shōsoku"), "palmar"),
  makeEntry('po-028', 'positions', t("أخمصي","ibirenge","nyayoni","跖","plantaire","cag","plantar","足底","plantar"),
    phonetic("akhmaṣī","zhí","sokutei"), jp("足底","そくてい","プランター","sokutei"), "plantar"),
]

// ── Write files ───────────────────────────────────────────────────────────

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

writeSystemFile('skeletal.ts', 'skeletalTerms', skeletalTerms)
writeSystemFile('muscular.ts', 'muscularTerms', muscularTerms)
writeSystemFile('cardiovascular.ts', 'cardiovascularTerms', cardiovascularTerms)
writeSystemFile('nervous.ts', 'nervousTerms', nervousTerms)
writeSystemFile('respiratory.ts', 'respiratoryTerms', respiratoryTerms)
writeSystemFile('digestive.ts', 'digestiveTerms', digestiveTerms)
writeSystemFile('positions.ts', 'positionsTerms', positionsTerms)

const total = skeletalTerms.length + muscularTerms.length + cardiovascularTerms.length
  + nervousTerms.length + respiratoryTerms.length + digestiveTerms.length + positionsTerms.length

console.log(`\nDone — ${total} entries across 7 files.`)
