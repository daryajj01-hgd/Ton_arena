export type Locale = "en" | "fa" | "ar" | "es" | "fr" | "de" | "tr" | "ru" | "zh" | "hi" | "pt";
export type Question = { prompt: string; answers: string[]; note: string };
type Copy = {
  beta: string; tagline: string; headline: string; headlineAccent: string; intro: string;
  featured: string; gameMeta: string; free: string; start: string; noBetting: string;
  questionsLabel: string; secondsEach: string; entryFee: string; complete: string;
  great: string; localScore: string; home: string; challenge: string; time: string;
  question: string; timeUp: string; correct: string; incorrect: string;
  results: string; next: string; exit: string; footer: string;
  questions: Question[];
  leaderboardTitle: string;
};
export const localeOptions: { code: Locale; label: string; dir: "ltr" | "rtl" }[] = [
  { code: "en", label: "English", dir: "ltr" },
  { code: "fa", label: "فارسی", dir: "rtl" },
  { code: "ar", label: "العربية", dir: "rtl" },
  { code: "es", label: "Español", dir: "ltr" },
  { code: "fr", label: "Français", dir: "ltr" },
  { code: "de", label: "Deutsch", dir: "ltr" },
  { code: "tr", label: "Türkçe", dir: "ltr" },
  { code: "ru", label: "Русский", dir: "ltr" },
  { code: "zh", label: "简体中文", dir: "ltr" },
  { code: "hi", label: "हिन्दी", dir: "ltr" },
  { code: "pt", label: "Português", dir: "ltr" }
];

const enQuestions: Question[] = [
  { prompt: "Which planet is known as the Red Planet?", answers: ["Venus", "Mars", "Jupiter", "Mercury"], note: "Iron oxide on the surface gives Mars its reddish appearance." },
  { prompt: "What is the largest ocean on Earth?", answers: ["Atlantic", "Indian", "Pacific", "Arctic"], note: "The Pacific is Earth's largest and deepest ocean." },
  { prompt: "What is 12 multiplied by 8?", answers: ["86", "92", "96", "108"], note: "12 × 8 = 96." },
  { prompt: "Which chemical element has the symbol O?", answers: ["Gold", "Oxygen", "Iron", "Silver"], note: "The symbol O stands for oxygen." },
  { prompt: "What is the capital of Japan?", answers: ["Kyoto", "Osaka", "Tokyo", "Hiroshima"], note: "Tokyo is the capital of Japan." },
  { prompt: "Which of these mammals lays eggs?", answers: ["Bat", "Platypus", "Dolphin", "Kangaroo"], note: "The platypus is one of the few egg-laying mammals." },
  { prompt: "How many meters are in one kilometer?", answers: ["100", "500", "1,000", "10,000"], note: "One kilometer is equal to 1,000 meters." },
  { prompt: "Which gas makes up most of Earth's atmosphere?", answers: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"], note: "About 78% of Earth's atmosphere is nitrogen." },
  { prompt: "Which continent has the largest population?", answers: ["Africa", "Europe", "Asia", "South America"], note: "Asia is the world's most populous continent." },
  { prompt: "About how long does sunlight take to reach Earth?", answers: ["2 minutes", "8 minutes", "20 minutes", "60 minutes"], note: "Sunlight takes about 8 minutes and 20 seconds to reach Earth." }
];
const faQuestions: Question[] = [
  {prompt:"کدام سیاره به سیاره سرخ معروف است؟",answers:["زهره","مریخ","مشتری","عطارد"],note:"اکسید آهن روی سطح مریخ رنگ سرخ آن را ایجاد می‌کند."},
  {prompt:"بزرگ‌ترین اقیانوس زمین کدام است؟",answers:["اطلس","هند","آرام","منجمد شمالی"],note:"اقیانوس آرام بزرگ‌ترین و عمیق‌ترین اقیانوس زمین است."},
  {prompt:"حاصل ۱۲ ضربدر ۸ چند است؟",answers:["۸۶","۹۲","۹۶","۱۰۸"],note:"۱۲ ضربدر ۸ برابر با ۹۶ است."},
  {prompt:"نماد شیمیایی O متعلق به کدام عنصر است؟",answers:["طلا","اکسیژن","آهن","نقره"],note:"نماد O برای عنصر اکسیژن به کار می‌رود."},
  {prompt:"پایتخت ژاپن کدام شهر است؟",answers:["کیوتو","اوساکا","توکیو","هیروشیما"],note:"توکیو پایتخت ژاپن است."},
  {prompt:"کدام‌یک از این پستانداران تخم می‌گذارد؟",answers:["خفاش","پلاتیپوس","دلفین","کانگورو"],note:"پلاتیپوس یکی از معدود پستانداران تخم‌گذار است."},
  {prompt:"هر کیلومتر چند متر است؟",answers:["۱۰۰","۵۰۰","۱٬۰۰۰","۱۰٬۰۰۰"],note:"هر کیلومتر برابر با هزار متر است."},
  {prompt:"کدام گاز بیشترین سهم را در جو زمین دارد؟",answers:["اکسیژن","دی‌اکسید کربن","نیتروژن","هیدروژن"],note:"حدود ۷۸ درصد جو زمین از نیتروژن تشکیل شده است."},
  {prompt:"کدام قاره بیشترین جمعیت را دارد؟",answers:["آفریقا","اروپا","آسیا","آمریکای جنوبی"],note:"آسیا پرجمعیت‌ترین قاره جهان است."},
  {prompt:"نور خورشید تقریباً چند دقیقه طول می‌کشد تا به زمین برسد؟",answers:["۲ دقیقه","۸ دقیقه","۲۰ دقیقه","۶۰ دقیقه"],note:"رسیدن نور خورشید به زمین حدود ۸ دقیقه و ۲۰ ثانیه طول می‌کشد."}
];
const arQuestions: Question[] = [
  {prompt:"أي كوكب يُعرف بالكوكب الأحمر؟",answers:["الزهرة","المريخ","المشتري","عطارد"],note:"أكسيد الحديد على سطح المريخ يمنحه لونه المحمر."},
  {prompt:"ما أكبر محيط على الأرض؟",answers:["الأطلسي","الهندي","الهادئ","المتجمد الشمالي"],note:"المحيط الهادئ هو أكبر محيطات الأرض وأعمقها."},
  {prompt:"كم يساوي ١٢ مضروباً في ٨؟",answers:["٨٦","٩٢","٩٦","١٠٨"],note:"١٢ × ٨ = ٩٦."},
  {prompt:"ما العنصر الكيميائي الذي رمزه O؟",answers:["الذهب","الأكسجين","الحديد","الفضة"],note:"الرمز O يشير إلى عنصر الأكسجين."},
  {prompt:"ما عاصمة اليابان؟",answers:["كيوتو","أوساكا","طوكيو","هيروشيما"],note:"طوكيو هي عاصمة اليابان."},
  {prompt:"أي من هذه الثدييات يضع البيض؟",answers:["الخفاش","خلد الماء","الدلفين","الكنغر"],note:"خلد الماء من الثدييات القليلة التي تضع البيض."},
  {prompt:"كم متراً في الكيلومتر الواحد؟",answers:["١٠٠","٥٠٠","١٬٠٠٠","١٠٬٠٠٠"],note:"الكيلومتر الواحد يساوي ألف متر."},
  {prompt:"أي غاز يشكل النسبة الأكبر من الغلاف الجوي للأرض؟",answers:["الأكسجين","ثاني أكسيد الكربون","النيتروجين","الهيدروجين"],note:"يشكل النيتروجين نحو ٧٨٪ من الغلاف الجوي."},
  {prompt:"أي قارة هي الأكبر من حيث عدد السكان؟",answers:["أفريقيا","أوروبا","آسيا","أمريكا الجنوبية"],note:"آسيا هي القارة الأكثر سكاناً في العالم."},
  {prompt:"كم دقيقة يستغرق ضوء الشمس تقريباً للوصول إلى الأرض؟",answers:["دقيقتان","٨ دقائق","٢٠ دقيقة","٦٠ دقيقة"],note:"يستغرق ضوء الشمس نحو ٨ دقائق و٢٠ ثانية للوصول إلى الأرض."}
];
const esQuestions: Question[] = [
  {prompt:"¿Qué planeta es conocido como el planeta rojo?",answers:["Venus","Marte","Júpiter","Mercurio"],note:"El óxido de hierro de su superficie le da a Marte su tono rojizo."},
  {prompt:"¿Cuál es el océano más grande de la Tierra?",answers:["Atlántico","Índico","Pacífico","Ártico"],note:"El Pacífico es el océano más grande y profundo."},
  {prompt:"¿Cuánto es 12 multiplicado por 8?",answers:["86","92","96","108"],note:"12 × 8 = 96."},
  {prompt:"¿Qué elemento químico tiene el símbolo O?",answers:["Oro","Oxígeno","Hierro","Plata"],note:"El símbolo O representa al oxígeno."},
  {prompt:"¿Cuál es la capital de Japón?",answers:["Kioto","Osaka","Tokio","Hiroshima"],note:"Tokio es la capital de Japón."},
  {prompt:"¿Cuál de estos mamíferos pone huevos?",answers:["Murciélago","Ornitorrinco","Delfín","Canguro"],note:"El ornitorrinco es uno de los pocos mamíferos que ponen huevos."},
  {prompt:"¿Cuántos metros hay en un kilómetro?",answers:["100","500","1.000","10.000"],note:"Un kilómetro equivale a mil metros."},
  {prompt:"¿Qué gas constituye la mayor parte de la atmósfera terrestre?",answers:["Oxígeno","Dióxido de carbono","Nitrógeno","Hidrógeno"],note:"Aproximadamente el 78 % de la atmósfera es nitrógeno."},
  {prompt:"¿Qué continente tiene la mayor población?",answers:["África","Europa","Asia","América del Sur"],note:"Asia es el continente más poblado del mundo."},
  {prompt:"¿Cuánto tarda aproximadamente la luz solar en llegar a la Tierra?",answers:["2 minutos","8 minutos","20 minutos","60 minutos"],note:"La luz solar tarda unos 8 minutos y 20 segundos en llegar a la Tierra."}
];
const frQuestions: Question[] = [
  {prompt:"Quelle planète est surnommée la planète rouge ?",answers:["Vénus","Mars","Jupiter","Mercure"],note:"L'oxyde de fer à sa surface donne à Mars sa couleur rougeâtre."},
  {prompt:"Quel est le plus grand océan de la Terre ?",answers:["Atlantique","Indien","Pacifique","Arctique"],note:"Le Pacifique est le plus vaste et le plus profond des océans."},
  {prompt:"Combien font 12 multiplié par 8 ?",answers:["86","92","96","108"],note:"12 × 8 = 96."},
  {prompt:"Quel élément chimique a pour symbole O ?",answers:["Or","Oxygène","Fer","Argent"],note:"Le symbole O désigne l'oxygène."},
  {prompt:"Quelle est la capitale du Japon ?",answers:["Kyoto","Osaka","Tokyo","Hiroshima"],note:"Tokyo est la capitale du Japon."},
  {prompt:"Lequel de ces mammifères pond des œufs ?",answers:["Chauve-souris","Ornithorynque","Dauphin","Kangourou"],note:"L'ornithorynque fait partie des rares mammifères qui pondent des œufs."},
  {prompt:"Combien de mètres y a-t-il dans un kilomètre ?",answers:["100","500","1 000","10 000"],note:"Un kilomètre équivaut à mille mètres."},
  {prompt:"Quel gaz compose la majeure partie de l'atmosphère terrestre ?",answers:["Oxygène","Dioxyde de carbone","Azote","Hydrogène"],note:"L'azote représente environ 78 % de l'atmosphère terrestre."},
  {prompt:"Quel continent compte le plus d'habitants ?",answers:["Afrique","Europe","Asie","Amérique du Sud"],note:"L'Asie est le continent le plus peuplé du monde."},
  {prompt:"Combien de temps la lumière du Soleil met-elle environ pour atteindre la Terre ?",answers:["2 minutes","8 minutes","20 minutes","60 minutes"],note:"La lumière du Soleil met environ 8 minutes et 20 secondes pour atteindre la Terre."}
];
const deQuestions: Question[] = [
  {prompt:"Welcher Planet wird als Roter Planet bezeichnet?",answers:["Venus","Mars","Jupiter","Merkur"],note:"Eisenoxid auf der Oberfläche verleiht dem Mars seine rötliche Farbe."},
  {prompt:"Welcher ist der größte Ozean der Erde?",answers:["Atlantik","Indischer Ozean","Pazifik","Arktischer Ozean"],note:"Der Pazifik ist der größte und tiefste Ozean der Erde."},
  {prompt:"Wie viel ist 12 mal 8?",answers:["86","92","96","108"],note:"12 × 8 = 96."},
  {prompt:"Welches chemische Element hat das Symbol O?",answers:["Gold","Sauerstoff","Eisen","Silber"],note:"Das Symbol O steht für Sauerstoff."},
  {prompt:"Was ist die Hauptstadt Japans?",answers:["Kyoto","Osaka","Tokio","Hiroshima"],note:"Tokio ist die Hauptstadt Japans."},
  {prompt:"Welches dieser Säugetiere legt Eier?",answers:["Fledermaus","Schnabeltier","Delfin","Känguru"],note:"Das Schnabeltier gehört zu den wenigen eierlegenden Säugetieren."},
  {prompt:"Wie viele Meter hat ein Kilometer?",answers:["100","500","1.000","10.000"],note:"Ein Kilometer entspricht tausend Metern."},
  {prompt:"Welches Gas macht den größten Teil der Erdatmosphäre aus?",answers:["Sauerstoff","Kohlendioxid","Stickstoff","Wasserstoff"],note:"Etwa 78 Prozent der Erdatmosphäre bestehen aus Stickstoff."},
  {prompt:"Welcher Kontinent hat die größte Bevölkerung?",answers:["Afrika","Europa","Asien","Südamerika"],note:"Asien ist der bevölkerungsreichste Kontinent der Welt."},
  {prompt:"Wie lange braucht Sonnenlicht ungefähr bis zur Erde?",answers:["2 Minuten","8 Minuten","20 Minuten","60 Minuten"],note:"Sonnenlicht benötigt etwa 8 Minuten und 20 Sekunden bis zur Erde."}
];
const trQuestions: Question[] = [
  {prompt:"Hangi gezegen Kızıl Gezegen olarak bilinir?",answers:["Venüs","Mars","Jüpiter","Merkür"],note:"Mars'ın yüzeyindeki demir oksit ona kırmızımsı rengini verir."},
  {prompt:"Dünya'nın en büyük okyanusu hangisidir?",answers:["Atlas","Hint","Pasifik","Arktik"],note:"Pasifik, Dünya'nın en büyük ve en derin okyanusudur."},
  {prompt:"12 çarpı 8 kaç eder?",answers:["86","92","96","108"],note:"12 × 8 = 96."},
  {prompt:"O kimyasal sembolü hangi elemente aittir?",answers:["Altın","Oksijen","Demir","Gümüş"],note:"O sembolü oksijeni ifade eder."},
  {prompt:"Japonya'nın başkenti neresidir?",answers:["Kyoto","Osaka","Tokyo","Hiroşima"],note:"Tokyo, Japonya'nın başkentidir."},
  {prompt:"Bu memelilerden hangisi yumurtlar?",answers:["Yarasa","Ornitorenk","Yunus","Kanguru"],note:"Ornitorenk, yumurtlayan az sayıdaki memelilerden biridir."},
  {prompt:"Bir kilometre kaç metredir?",answers:["100","500","1.000","10.000"],note:"Bir kilometre bin metreye eşittir."},
  {prompt:"Dünya atmosferinde en fazla bulunan gaz hangisidir?",answers:["Oksijen","Karbondioksit","Azot","Hidrojen"],note:"Dünya atmosferinin yaklaşık yüzde 78'i azottur."},
  {prompt:"En kalabalık nüfusa sahip kıta hangisidir?",answers:["Afrika","Avrupa","Asya","Güney Amerika"],note:"Asya, dünyanın nüfusu en fazla olan kıtasıdır."},
  {prompt:"Güneş ışığının Dünya'ya ulaşması yaklaşık kaç dakika sürer?",answers:["2 dakika","8 dakika","20 dakika","60 dakika"],note:"Güneş ışığı Dünya'ya yaklaşık 8 dakika 20 saniyede ulaşır."}
];
const ruQuestions: Question[] = [
  {prompt:"Какую планету называют Красной планетой?",answers:["Венера","Марс","Юпитер","Меркурий"],note:"Оксид железа на поверхности придаёт Марсу красноватый цвет."},
  {prompt:"Какой океан самый большой на Земле?",answers:["Атлантический","Индийский","Тихий","Северный Ледовитый"],note:"Тихий океан — самый большой и глубокий на Земле."},
  {prompt:"Чему равно 12 умножить на 8?",answers:["86","92","96","108"],note:"12 × 8 = 96."},
  {prompt:"Какой химический элемент обозначается символом O?",answers:["Золото","Кислород","Железо","Серебро"],note:"Символ O обозначает кислород."},
  {prompt:"Какой город является столицей Японии?",answers:["Киото","Осака","Токио","Хиросима"],note:"Токио — столица Японии."},
  {prompt:"Какое из этих млекопитающих откладывает яйца?",answers:["Летучая мышь","Утконос","Дельфин","Кенгуру"],note:"Утконос — одно из немногих яйцекладущих млекопитающих."},
  {prompt:"Сколько метров в одном километре?",answers:["100","500","1 000","10 000"],note:"Один километр равен тысяче метров."},
  {prompt:"Какой газ преобладает в атмосфере Земли?",answers:["Кислород","Углекислый газ","Азот","Водород"],note:"Около 78 процентов атмосферы Земли составляет азот."},
  {prompt:"На каком континенте живёт больше всего людей?",answers:["Африка","Европа","Азия","Южная Америка"],note:"Азия — самый населённый континент мира."},
  {prompt:"Сколько примерно минут солнечный свет идёт до Земли?",answers:["2 минуты","8 минут","20 минут","60 минут"],note:"Солнечный свет достигает Земли примерно за 8 минут 20 секунд."}
];
const zhQuestions: Question[] = [
  {prompt:"哪颗行星被称为红色星球？",answers:["金星","火星","木星","水星"],note:"火星表面的氧化铁使它呈现红色。"},
  {prompt:"地球上最大的海洋是什么？",answers:["大西洋","印度洋","太平洋","北冰洋"],note:"太平洋是地球上面积最大、最深的海洋。"},
  {prompt:"12乘以8等于多少？",answers:["86","92","96","108"],note:"12 × 8 = 96。"},
  {prompt:"化学符号O代表哪种元素？",answers:["金","氧","铁","银"],note:"符号O代表氧元素。"},
  {prompt:"日本的首都是哪里？",answers:["京都","大阪","东京","广岛"],note:"东京是日本的首都。"},
  {prompt:"以下哪种哺乳动物会产卵？",answers:["蝙蝠","鸭嘴兽","海豚","袋鼠"],note:"鸭嘴兽是少数会产卵的哺乳动物之一。"},
  {prompt:"一公里等于多少米？",answers:["100","500","1,000","10,000"],note:"一公里等于一千米。"},
  {prompt:"地球大气中含量最多的气体是什么？",answers:["氧气","二氧化碳","氮气","氢气"],note:"氮气约占地球大气的78%。"},
  {prompt:"哪个洲的人口最多？",answers:["非洲","欧洲","亚洲","南美洲"],note:"亚洲是世界上人口最多的大洲。"},
  {prompt:"阳光到达地球大约需要多少分钟？",answers:["2分钟","8分钟","20分钟","60分钟"],note:"阳光到达地球大约需要8分20秒。"}
];
const hiQuestions: Question[] = [
  {prompt:"किस ग्रह को लाल ग्रह कहा जाता है?",answers:["शुक्र","मंगल","बृहस्पति","बुध"],note:"मंगल की सतह पर आयरन ऑक्साइड उसे लाल रंग देता है।"},
  {prompt:"पृथ्वी का सबसे बड़ा महासागर कौन-सा है?",answers:["अटलांटिक","हिंद","प्रशांत","आर्कटिक"],note:"प्रशांत महासागर पृथ्वी का सबसे बड़ा और सबसे गहरा महासागर है।"},
  {prompt:"12 गुणा 8 कितना होता है?",answers:["86","92","96","108"],note:"12 × 8 = 96."},
  {prompt:"O किस रासायनिक तत्व का प्रतीक है?",answers:["सोना","ऑक्सीजन","लोहा","चाँदी"],note:"O ऑक्सीजन का रासायनिक प्रतीक है।"},
  {prompt:"जापान की राजधानी क्या है?",answers:["क्योटो","ओसाका","टोक्यो","हिरोशिमा"],note:"टोक्यो जापान की राजधानी है।"},
  {prompt:"इनमें से कौन-सा स्तनधारी अंडे देता है?",answers:["चमगादड़","प्लैटिपस","डॉल्फ़िन","कंगारू"],note:"प्लैटिपस अंडे देने वाले कुछ स्तनधारियों में से एक है।"},
  {prompt:"एक किलोमीटर में कितने मीटर होते हैं?",answers:["100","500","1,000","10,000"],note:"एक किलोमीटर में एक हज़ार मीटर होते हैं।"},
  {prompt:"पृथ्वी के वायुमंडल में सबसे अधिक कौन-सी गैस है?",answers:["ऑक्सीजन","कार्बन डाइऑक्साइड","नाइट्रोजन","हाइड्रोजन"],note:"पृथ्वी के वायुमंडल का लगभग 78 प्रतिशत नाइट्रोजन है।"},
  {prompt:"किस महाद्वीप की जनसंख्या सबसे अधिक है?",answers:["अफ्रीका","यूरोप","एशिया","दक्षिण अमेरिका"],note:"एशिया दुनिया का सबसे अधिक आबादी वाला महाद्वीप है।"},
  {prompt:"सूर्य के प्रकाश को पृथ्वी तक पहुँचने में लगभग कितने मिनट लगते हैं?",answers:["2 मिनट","8 मिनट","20 मिनट","60 मिनट"],note:"सूर्य का प्रकाश पृथ्वी तक लगभग 8 मिनट 20 सेकंड में पहुँचता है।"}
];
const ptQuestions: Question[] = [
  {prompt:"Qual planeta é conhecido como Planeta Vermelho?",answers:["Vênus","Marte","Júpiter","Mercúrio"],note:"O óxido de ferro na superfície dá a Marte sua cor avermelhada."},
  {prompt:"Qual é o maior oceano da Terra?",answers:["Atlântico","Índico","Pacífico","Ártico"],note:"O Pacífico é o maior e mais profundo oceano da Terra."},
  {prompt:"Quanto é 12 multiplicado por 8?",answers:["86","92","96","108"],note:"12 × 8 = 96."},
  {prompt:"Qual elemento químico tem o símbolo O?",answers:["Ouro","Oxigênio","Ferro","Prata"],note:"O símbolo O representa o oxigênio."},
  {prompt:"Qual é a capital do Japão?",answers:["Quioto","Osaka","Tóquio","Hiroshima"],note:"Tóquio é a capital do Japão."},
  {prompt:"Qual destes mamíferos põe ovos?",answers:["Morcego","Ornitorrinco","Golfinho","Canguru"],note:"O ornitorrinco é um dos poucos mamíferos que põem ovos."},
  {prompt:"Quantos metros há em um quilômetro?",answers:["100","500","1.000","10.000"],note:"Um quilômetro equivale a mil metros."},
  {prompt:"Qual gás compõe a maior parte da atmosfera terrestre?",answers:["Oxigênio","Dióxido de carbono","Nitrogênio","Hidrogênio"],note:"Cerca de 78% da atmosfera terrestre é nitrogênio."},
  {prompt:"Qual continente tem a maior população?",answers:["África","Europa","Ásia","América do Sul"],note:"A Ásia é o continente mais populoso do mundo."},
  {prompt:"Quanto tempo a luz solar leva aproximadamente para chegar à Terra?",answers:["2 minutos","8 minutos","20 minutos","60 minutos"],note:"A luz solar leva cerca de 8 minutos e 20 segundos para chegar à Terra."}
];

export const translations: Record<Locale, Copy> = {
  en: {beta:"BETA VERSION",tagline:"PLAY · LEARN · LEVEL UP",headline:"Competition starts",headlineAccent:"here.",intro:"Welcome to TON ARENA — a place to test your skills, learn something new, and enjoy friendly competition.",featured:"FEATURED GAME",gameMeta:"10 questions · 15 seconds per question",free:"FREE",start:"Start Challenge",noBetting:"No betting or entry fees — just skill and learning.",questionsLabel:"Questions",secondsEach:"Seconds each",entryFee:"Entry fee",complete:"CHALLENGE COMPLETE",great:"Great effort!",localScore:"Preview mode only. Sign in through Telegram to save a verified score.",home:"Back to Home",challenge:"General Knowledge Challenge",time:"Time remaining",question:"QUESTION",timeUp:"Time is up!",correct:"Correct answer!",incorrect:"Not quite!",results:"View Results",next:"Next Question",exit:"Exit Challenge",footer:"ONE ECOSYSTEM. THREE EXPERIENCES.",leaderboardTitle:"TOP PLAYERS",questions:enQuestions},
  fa: {beta:"نسخه آزمایشی",tagline:"بازی کن · یاد بگیر · پیشرفت کن",headline:"رقابت از",headlineAccent:"اینجا شروع می‌شود.",intro:"به TON ARENA خوش آمدید؛ جایی برای سنجش مهارت، یادگیری و رقابت دوستانه.",featured:"بازی منتخب",gameMeta:"۱۰ پرسش · ۱۵ ثانیه برای هر پرسش",free:"رایگان",start:"شروع چالش",noBetting:"بدون شرط‌بندی یا هزینه ورود؛ فقط مهارت و یادگیری.",questionsLabel:"پرسش",secondsEach:"ثانیه برای هر پرسش",entryFee:"هزینه ورود",complete:"چالش به پایان رسید",great:"تلاش خوبی بود!",localScore:"حالت پیش‌نمایش است؛ برای ثبت امتیاز معتبر از تلگرام وارد شوید.",home:"بازگشت به خانه",challenge:"چالش اطلاعات عمومی",time:"زمان باقی‌مانده",question:"پرسش",timeUp:"زمان تمام شد!",correct:"پاسخ درست است!",incorrect:"این پاسخ درست نبود.",results:"دیدن نتیجه",next:"پرسش بعدی",exit:"خروج از چالش",footer:"یک اکوسیستم، سه تجربه",leaderboardTitle:"بازیکنان برتر",questions:faQuestions},
  ar: {beta:"نسخة تجريبية",tagline:"العب · تعلّم · تطوّر",headline:"تبدأ المنافسة",headlineAccent:"من هنا.",intro:"مرحباً بك في TON ARENA — مكان لاختبار مهاراتك وتعلّم أشياء جديدة والاستمتاع بمنافسة ودية.",featured:"اللعبة المميزة",gameMeta:"١٠ أسئلة · ١٥ ثانية لكل سؤال",free:"مجاناً",start:"ابدأ التحدي",noBetting:"لا مراهنات ولا رسوم دخول — المهارة والتعلّم فقط.",questionsLabel:"أسئلة",secondsEach:"ثانية لكل سؤال",entryFee:"رسوم الدخول",complete:"اكتمل التحدي",great:"أحسنت المحاولة!",localScore:"وضع معاينة فقط. سجّل الدخول عبر تيليجرام لحفظ نتيجة موثوقة.",home:"العودة إلى الصفحة الرئيسية",challenge:"تحدي المعلومات العامة",time:"الوقت المتبقي",question:"السؤال",timeUp:"انتهى الوقت!",correct:"إجابة صحيحة!",incorrect:"ليست الإجابة الصحيحة.",results:"عرض النتيجة",next:"السؤال التالي",exit:"إنهاء التحدي",footer:"منظومة واحدة. ثلاث تجارب.",leaderboardTitle:"أفضل اللاعبين",questions:arQuestions},
  es: {beta:"VERSIÓN BETA",tagline:"JUEGA · APRENDE · SUBE DE NIVEL",headline:"La competencia empieza",headlineAccent:"aquí.",intro:"Te damos la bienvenida a TON ARENA: un lugar para poner a prueba tus habilidades, aprender y disfrutar de una competencia amistosa.",featured:"JUEGO DESTACADO",gameMeta:"10 preguntas · 15 segundos por pregunta",free:"GRATIS",start:"Comenzar desafío",noBetting:"Sin apuestas ni cuotas de entrada: solo habilidad y aprendizaje.",questionsLabel:"Preguntas",secondsEach:"Segundos cada una",entryFee:"Cuota de entrada",complete:"DESAFÍO COMPLETADO",great:"¡Buen trabajo!",localScore:"Modo de vista previa. Inicia sesión en Telegram para guardar una puntuación verificada.",home:"Volver al inicio",challenge:"Desafío de cultura general",time:"Tiempo restante",question:"PREGUNTA",timeUp:"¡Se acabó el tiempo!",correct:"¡Respuesta correcta!",incorrect:"¡No es correcto!",results:"Ver resultados",next:"Siguiente pregunta",exit:"Salir del desafío",footer:"UN ECOSISTEMA. TRES EXPERIENCIAS.",leaderboardTitle:"MEJORES JUGADORES",questions:esQuestions},
  fr: {beta:"VERSION BÊTA",tagline:"JOUEZ · APPRENEZ · PROGRESSEZ",headline:"La compétition commence",headlineAccent:"ici.",intro:"Bienvenue sur TON ARENA : un espace pour tester vos compétences, apprendre et profiter d'une compétition amicale.",featured:"JEU À LA UNE",gameMeta:"10 questions · 15 secondes par question",free:"GRATUIT",start:"Commencer le défi",noBetting:"Aucun pari ni frais d'inscription : seulement du talent et de l'apprentissage.",questionsLabel:"Questions",secondsEach:"Secondes chacune",entryFee:"Frais d'entrée",complete:"DÉFI TERMINÉ",great:"Bel effort !",localScore:"Mode aperçu. Connectez-vous via Telegram pour enregistrer un score vérifié.",home:"Retour à l'accueil",challenge:"Défi de culture générale",time:"Temps restant",question:"QUESTION",timeUp:"Temps écoulé !",correct:"Bonne réponse !",incorrect:"Pas tout à fait !",results:"Voir les résultats",next:"Question suivante",exit:"Quitter le défi",footer:"UN ÉCOSYSTÈME. TROIS EXPÉRIENCES.",leaderboardTitle:"MEILLEURS JOUEURS",questions:frQuestions},
  de: {beta:"BETA-VERSION",tagline:"SPIELEN · LERNEN · AUFSTEIGEN",headline:"Der Wettbewerb beginnt",headlineAccent:"hier.",intro:"Willkommen bei TON ARENA — hier kannst du deine Fähigkeiten testen, Neues lernen und fairen Wettbewerb erleben.",featured:"AUSGEWÄHLTES SPIEL",gameMeta:"10 Fragen · 15 Sekunden pro Frage",free:"KOSTENLOS",start:"Herausforderung starten",noBetting:"Keine Wetten und keine Teilnahmegebühr — nur Können und Lernen.",questionsLabel:"Fragen",secondsEach:"Sekunden pro Frage",entryFee:"Teilnahmegebühr",complete:"HERAUSFORDERUNG BEENDET",great:"Gut gemacht!",localScore:"Vorschaumodus. Melde dich über Telegram an, um einen bestätigten Punktestand zu speichern.",home:"Zurück zur Startseite",challenge:"Allgemeinwissen-Challenge",time:"Verbleibende Zeit",question:"FRAGE",timeUp:"Die Zeit ist abgelaufen!",correct:"Richtige Antwort!",incorrect:"Leider nicht richtig!",results:"Ergebnis ansehen",next:"Nächste Frage",exit:"Challenge verlassen",footer:"EIN ÖKOSYSTEM. DREI ERLEBNISSE.",leaderboardTitle:"TOP-SPIELER",questions:deQuestions},
  tr: {beta:"BETA SÜRÜMÜ",tagline:"OYNA · ÖĞREN · GELİŞ",headline:"Rekabet",headlineAccent:"burada başlar.",intro:"TON ARENA'ya hoş geldin — becerilerini sınayabileceğin, yeni şeyler öğrenebileceğin ve dostça rekabet edebileceğin yer.",featured:"ÖNE ÇIKAN OYUN",gameMeta:"10 soru · Her soru için 15 saniye",free:"ÜCRETSİZ",start:"Meydan okumayı başlat",noBetting:"Bahis veya giriş ücreti yok — sadece beceri ve öğrenme.",questionsLabel:"Soru",secondsEach:"Her soru için saniye",entryFee:"Giriş ücreti",complete:"MEYDAN OKUMA TAMAMLANDI",great:"Harika çaba!",localScore:"Önizleme modu. Doğrulanmış puanı kaydetmek için Telegram üzerinden giriş yap.",home:"Ana sayfaya dön",challenge:"Genel kültür meydan okuması",time:"Kalan süre",question:"SORU",timeUp:"Süre doldu!",correct:"Doğru cevap!",incorrect:"Tam olarak değil!",results:"Sonuçları gör",next:"Sonraki soru",exit:"Meydan okumadan çık",footer:"TEK EKOSİSTEM. ÜÇ DENEYİM.",leaderboardTitle:"EN İYİ OYUNCULAR",questions:trQuestions},
  ru: {beta:"БЕТА-ВЕРСИЯ",tagline:"ИГРАЙ · УЧИСЬ · РАЗВИВАЙСЯ",headline:"Соревнование начинается",headlineAccent:"здесь.",intro:"Добро пожаловать в TON ARENA — место, где можно проверить свои навыки, узнать новое и поучаствовать в дружеском соревновании.",featured:"РЕКОМЕНДУЕМАЯ ИГРА",gameMeta:"10 вопросов · 15 секунд на вопрос",free:"БЕСПЛАТНО",start:"Начать испытание",noBetting:"Без ставок и платы за вход — только навыки и обучение.",questionsLabel:"Вопросов",secondsEach:"Секунд на вопрос",entryFee:"Входная плата",complete:"ИСПЫТАНИЕ ЗАВЕРШЕНО",great:"Отличная попытка!",localScore:"Режим предварительного просмотра. Войдите через Telegram, чтобы сохранить подтверждённый результат.",home:"На главную",challenge:"Викторина на общие знания",time:"Осталось времени",question:"ВОПРОС",timeUp:"Время вышло!",correct:"Правильный ответ!",incorrect:"Не совсем верно!",results:"Посмотреть результат",next:"Следующий вопрос",exit:"Выйти из испытания",footer:"ОДНА ЭКОСИСТЕМА. ТРИ ВОЗМОЖНОСТИ.",leaderboardTitle:"ЛУЧШИЕ ИГРОКИ",questions:ruQuestions},
  zh: {beta:"测试版",tagline:"游戏 · 学习 · 成长",headline:"竞争从",headlineAccent:"这里开始。",intro:"欢迎来到 TON ARENA——在这里测试技能、学习新知识并享受友好竞赛。",featured:"精选游戏",gameMeta:"10道题 · 每题15秒",free:"免费",start:"开始挑战",noBetting:"没有下注或入场费，只有技能与学习。",questionsLabel:"题目",secondsEach:"每题秒数",entryFee:"入场费",complete:"挑战完成",great:"表现不错！",localScore:"预览模式。通过 Telegram 登录以保存经过验证的分数。",home:"返回首页",challenge:"常识挑战",time:"剩余时间",question:"题目",timeUp:"时间到！",correct:"回答正确！",incorrect:"不太正确！",results:"查看结果",next:"下一题",exit:"退出挑战",footer:"一个生态系统，三种体验。",leaderboardTitle:"排行榜",questions:zhQuestions},
  hi: {beta:"बीटा संस्करण",tagline:"खेलें · सीखें · आगे बढ़ें",headline:"प्रतिस्पर्धा",headlineAccent:"यहीं से शुरू होती है।",intro:"TON ARENA में आपका स्वागत है — अपनी क्षमता परखें, कुछ नया सीखें और मैत्रीपूर्ण प्रतियोगिता का आनंद लें।",featured:"विशेष गेम",gameMeta:"10 प्रश्न · हर प्रश्न के लिए 15 सेकंड",free:"मुफ़्त",start:"चुनौती शुरू करें",noBetting:"कोई दांव या प्रवेश शुल्क नहीं — केवल कौशल और सीखना।",questionsLabel:"प्रश्न",secondsEach:"हर प्रश्न के सेकंड",entryFee:"प्रवेश शुल्क",complete:"चुनौती पूरी हुई",great:"बहुत अच्छा प्रयास!",localScore:"यह प्रीव्यू मोड है। सत्यापित स्कोर सहेजने के लिए Telegram से साइन इन करें।",home:"होम पर वापस जाएँ",challenge:"सामान्य ज्ञान चुनौती",time:"बचा हुआ समय",question:"प्रश्न",timeUp:"समय समाप्त!",correct:"सही उत्तर!",incorrect:"सही नहीं है!",results:"परिणाम देखें",next:"अगला प्रश्न",exit:"चुनौती से बाहर निकलें",footer:"एक इकोसिस्टम। तीन अनुभव।",leaderboardTitle:"शीर्ष खिलाड़ी",questions:hiQuestions},
  pt: {beta:"VERSÃO BETA",tagline:"JOGUE · APRENDA · EVOLUA",headline:"A competição começa",headlineAccent:"aqui.",intro:"Boas-vindas ao TON ARENA — um lugar para testar suas habilidades, aprender algo novo e aproveitar uma competição amigável.",featured:"JOGO EM DESTAQUE",gameMeta:"10 perguntas · 15 segundos por pergunta",free:"GRÁTIS",start:"Começar desafio",noBetting:"Sem apostas ou taxas de entrada — apenas habilidade e aprendizado.",questionsLabel:"Perguntas",secondsEach:"Segundos cada",entryFee:"Taxa de entrada",complete:"DESAFIO CONCLUÍDO",great:"Muito bem!",localScore:"Modo de prévia. Entre pelo Telegram para salvar uma pontuação verificada.",home:"Voltar ao início",challenge:"Desafio de conhecimentos gerais",time:"Tempo restante",question:"PERGUNTA",timeUp:"O tempo acabou!",correct:"Resposta correta!",incorrect:"Não foi dessa vez!",results:"Ver resultados",next:"Próxima pergunta",exit:"Sair do desafio",footer:"UM ECOSSISTEMA. TRÊS EXPERIÊNCIAS.",leaderboardTitle:"MELHORES JOGADORES",questions:ptQuestions}
};
