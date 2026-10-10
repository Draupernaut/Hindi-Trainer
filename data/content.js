export const course = {
  title: 'Hindi von Grund auf',
  subtitle: 'Deutsch ↔ Hindi · Grammatik zuerst',
  version: 1,
  lessons: [
    {
      id: 'L01',
      title: 'Namaste – erste Sätze',
      description: 'Begrüßen, sich vorstellen und verstehen, wie „sein“ im Hindi funktioniert und warum das Verb meist am Satzende steht.',
      grammar: [
        { heading: 'Personalpronomen', text: 'मैं (maĩ) bedeutet „ich“, आप (āp) ist das höfliche „Sie/du“, तुम (tum) ist ein vertrautes „du/ihr“. Für den Anfang nutzen wir meist आप.' },
        { heading: '„sein“: होना (honā)', text: 'Im Präsens richtet sich die Form nach der Person. Besonders häufig sind हूँ (hū̃) = „bin“, हैं (haĩ) = höfliches/plurales „sind“ und है (hai) = „ist“.' },
        { heading: 'Wortstellung', text: 'Hindi stellt das Verb typischerweise ans Satzende. „Ich Lehrerin bin“ entspricht also dem normalen Hindi-Muster.' }
      ],
      examples: [
        ['Hallo / Namaste.', 'नमस्ते।', 'namaste.', 'Universelle Begrüßung.'],
        ['Ich heiße Anika.', 'मेरा नाम अनिका है।', 'merā nām Anikā hai.', 'Wörtlich: „Mein Name Anika ist.“'],
        ['Ich bin aus Deutschland.', 'मैं जर्मनी से हूँ।', 'maĩ Jarmanī se hū̃.', 'से (se) kann Herkunft ausdrücken.'],
        ['Wie heißen Sie?', 'आपका नाम क्या है?', 'āpkā nām kyā hai?', 'क्या (kyā) = was.'],
        ['Mir geht es gut.', 'मैं ठीक हूँ।', 'maĩ ṭhīk hū̃.', 'ठीक (ṭhīk) = gut / in Ordnung.']
      ],
      dialog: [
        ['A', 'नमस्ते! आपका नाम क्या है?', 'namaste! āpkā nām kyā hai?', 'Hallo! Wie heißen Sie?'],
        ['B', 'मेरा नाम लीना है। और आपका?', 'merā nām Līnā hai. aur āpkā?', 'Ich heiße Lina. Und Sie?'],
        ['A', 'मेरा नाम राहुल है।', 'merā nām Rāhul hai.', 'Ich heiße Rahul.'],
        ['B', 'आप कैसे हैं?', 'āp kaise haĩ?', 'Wie geht es Ihnen?'],
        ['A', 'मैं ठीक हूँ, धन्यवाद।', 'maĩ ṭhīk hū̃, dhanyavād.', 'Mir geht es gut, danke.']
      ],
      quiz: [
        { q: 'Welche Form bedeutet „ich bin“?', options: ['है', 'हूँ', 'हैं'], answer: 1 },
        { q: 'Wie lautet die höfliche Frage „Wie heißen Sie?“', options: ['आपका नाम क्या है?', 'मैं ठीक हूँ।', 'आप कहाँ हैं?'], answer: 0 }
      ]
    },
    {
      id: 'L02',
      title: 'Genus & Adjektive',
      description: 'Maskulin und Feminin erkennen und einfache Eigenschaften korrekt anpassen.',
      grammar: [
        { heading: 'Zwei grammatische Geschlechter', text: 'Hindi unterscheidet maskuline und feminine Nomen. Das Geschlecht beeinflusst häufig Adjektive und Verbformen.' },
        { heading: 'Veränderliche Adjektive', text: 'Viele Adjektive auf -ा (-ā) werden bei femininen Bezugswörtern zu -ी (-ī): अच्छा (acchā) → अच्छी (acchī).' },
        { heading: 'Nicht jedes Adjektiv verändert sich', text: 'Einige Adjektive bleiben gleich. Deshalb lohnt es sich, neue Wörter immer mit einem Beispielsatz zu lernen.' }
      ],
      examples: [
        ['Der Tee ist gut.', 'चाय अच्छी है।', 'cāy acchī hai.', 'चाय ist feminin.'],
        ['Das Zimmer ist groß.', 'कमरा बड़ा है।', 'kamrā baṛā hai.', 'कमरा ist maskulin.'],
        ['Das Buch ist gut.', 'किताब अच्छी है।', 'kitāb acchī hai.', 'किताब ist feminin.'],
        ['Der Junge ist klein.', 'लड़का छोटा है।', 'laṛkā choṭā hai.', 'Maskuline Form छोटा.'],
        ['Das Mädchen ist klein.', 'लड़की छोटी है।', 'laṛkī choṭī hai.', 'Feminine Form छोटी.']
      ],
      dialog: [
        ['A', 'यह कमरा कैसा है?', 'yah kamrā kaisā hai?', 'Wie ist dieses Zimmer?'],
        ['B', 'यह बड़ा और अच्छा है।', 'yah baṛā aur acchā hai.', 'Es ist groß und gut.'],
        ['A', 'और चाय कैसी है?', 'aur cāy kaisī hai?', 'Und wie ist der Tee?'],
        ['B', 'चाय बहुत अच्छी है।', 'cāy bahut acchī hai.', 'Der Tee ist sehr gut.']
      ],
      quiz: [
        { q: 'Welche Form passt zu लड़की (Mädchen)?', options: ['अच्छा', 'अच्छी', 'अच्छे'], answer: 1 },
        { q: 'Was bedeutet बहुत?', options: ['sehr/viel', 'heute', 'klein'], answer: 0 }
      ]
    },
    {
      id: 'L03',
      title: 'Gewohnheiten & Präsens',
      description: 'Über Routinen sprechen: lernen, arbeiten, essen, trinken und gehen.',
      grammar: [
        { heading: 'Habituales Präsens', text: 'Für Gewohnheiten wird oft der Verbstamm + ता/ती/ते verwendet, zusammen mit einer Form von होना. Beispiel: मैं पढ़ती हूँ = „Ich lerne/lese (regelmäßig)“ für eine Sprecherin.' },
        { heading: 'Sprecher-Geschlecht', text: 'Bei vielen Formen zeigt -ता eine maskuline und -ती eine feminine Form. Die App kann Beispielsätze deshalb nach Sprecher-Geschlecht anzeigen.' },
        { heading: 'Infinitiv', text: 'Die Grundform endet häufig auf -ना: करना = machen, जाना = gehen, खाना = essen.' }
      ],
      examples: [
        ['Ich lerne Hindi.', 'मैं हिंदी सीखती हूँ।', 'maĩ hindī sīkhtī hū̃.', 'Feminine Sprecherform; maskulin: सीखता हूँ.'],
        ['Ich trinke morgens Tee.', 'मैं सुबह चाय पीती हूँ।', 'maĩ subah cāy pītī hū̃.', 'सुबह = morgens.'],
        ['Er arbeitet in Delhi.', 'वह दिल्ली में काम करता है।', 'vah Dillī mẽ kām kartā hai.', 'में = in.'],
        ['Sie liest jeden Tag.', 'वह हर दिन पढ़ती है।', 'vah har din paṛhtī hai.', 'हर दिन = jeden Tag.'],
        ['Wir essen zu Hause.', 'हम घर पर खाते हैं।', 'ham ghar par khāte haĩ.', 'पर = an/auf/bei.']
      ],
      dialog: [
        ['A', 'आप सुबह क्या करती हैं?', 'āp subah kyā kartī haĩ?', 'Was machen Sie morgens?'],
        ['B', 'मैं चाय पीती हूँ और हिंदी पढ़ती हूँ।', 'maĩ cāy pītī hū̃ aur hindī paṛhtī hū̃.', 'Ich trinke Tee und lerne Hindi.'],
        ['A', 'आप कहाँ काम करती हैं?', 'āp kahā̃ kām kartī haĩ?', 'Wo arbeiten Sie?'],
        ['B', 'मैं घर पर काम करती हूँ।', 'maĩ ghar par kām kartī hū̃.', 'Ich arbeite zu Hause.']
      ],
      quiz: [
        { q: 'Welche Endung ist in der Grundregel feminin Singular?', options: ['-ता', '-ती', '-ते'], answer: 1 },
        { q: 'Wie heißt „gehen“ im Infinitiv?', options: ['जाना', 'करना', 'पीना'], answer: 0 }
      ]
    },
    {
      id: 'L04',
      title: 'Fragen & Alltag',
      description: 'Wer, was, wo, wann und wie – mit alltagstauglichen Fragesätzen.',
      grammar: [
        { heading: 'Fragewörter', text: 'क्या = was, कौन = wer, कहाँ = wo, कब = wann, कैसे/कैसी = wie. Sie stehen meist dort, wo im Aussagesatz die gesuchte Information stehen würde.' },
        { heading: 'Ja/Nein-Fragen', text: 'क्या kann am Satzanfang auch eine Ja/Nein-Frage markieren: क्या आप हिंदी बोलते हैं? = Sprechen Sie Hindi?' },
        { heading: 'Höflichkeit', text: 'Mit आप verwendet man grammatisch plural/höfliche Formen, z. B. हैं oder बोलते/बोलती हैं.' }
      ],
      examples: [
        ['Wo wohnen Sie?', 'आप कहाँ रहते हैं?', 'āp kahā̃ rahte haĩ?', 'Maskuline Standardform; für eine Frau: रहती हैं.'],
        ['Was möchten Sie?', 'आप क्या चाहते हैं?', 'āp kyā cāhte haĩ?', 'Feminine Form: चाहती हैं.'],
        ['Wann kommen Sie?', 'आप कब आते हैं?', 'āp kab āte haĩ?', 'Feminine Form: आती हैं.'],
        ['Sprechen Sie Hindi?', 'क्या आप हिंदी बोलते हैं?', 'kyā āp hindī bolte haĩ?', 'क्या markiert hier eine Ja/Nein-Frage.'],
        ['Wer ist das?', 'यह कौन है?', 'yah kaun hai?', 'यह = dies/das hier.']
      ],
      dialog: [
        ['A', 'माफ़ कीजिए, स्टेशन कहाँ है?', 'māf kījie, sṭeśan kahā̃ hai?', 'Entschuldigung, wo ist der Bahnhof?'],
        ['B', 'स्टेशन यहाँ से पास है।', 'sṭeśan yahā̃ se pās hai.', 'Der Bahnhof ist von hier aus nah.'],
        ['A', 'मैं वहाँ कैसे जाऊँ?', 'maĩ vahā̃ kaise jāū̃?', 'Wie komme ich dorthin?'],
        ['B', 'आप सीधे जाइए।', 'āp sīdhe jāie.', 'Gehen Sie geradeaus.']
      ],
      quiz: [
        { q: 'Welches Wort bedeutet „wo“?', options: ['कब', 'कहाँ', 'कौन'], answer: 1 },
        { q: 'Was kann क्या am Satzanfang anzeigen?', options: ['Vergangenheit', 'Ja/Nein-Frage', 'Plural'], answer: 1 }
      ]
    },
    {
      id: 'L05',
      title: 'Postpositionen',
      description: 'In, auf, mit, von und für – Hindi denkt hier anders als Deutsch.',
      grammar: [
        { heading: 'Nach statt vor dem Nomen', text: 'Hindi verwendet Postpositionen. Sie stehen nach dem Nomen: घर में = „im Haus“, wörtlich „Haus in“.' },
        { heading: 'Wichtige Formen', text: 'में = in, पर = auf/an/bei, से = von/aus/mit, के लिए = für, के साथ = zusammen mit.' },
        { heading: 'Oblique Form', text: 'Vor Postpositionen verändern manche Nomen und Pronomen ihre Form. Das wird später systematisch vertieft; zunächst lernst du feste Wortgruppen.' }
      ],
      examples: [
        ['Ich bin im Hotel.', 'मैं होटल में हूँ।', 'maĩ hoṭal mẽ hū̃.', 'में = in.'],
        ['Das Handy liegt auf dem Tisch.', 'फ़ोन मेज़ पर है।', 'fon mez par hai.', 'पर = auf.'],
        ['Ich komme aus Deutschland.', 'मैं जर्मनी से आती हूँ।', 'maĩ Jarmanī se ātī hū̃.', 'Feminine Sprecherform; से = aus/von.'],
        ['Kaffee für mich.', 'मेरे लिए कॉफ़ी।', 'mere lie kŏfī.', 'मेरे लिए = für mich.'],
        ['Ich bin mit einer Freundin hier.', 'मैं एक दोस्त के साथ यहाँ हूँ।', 'maĩ ek dost ke sāth yahā̃ hū̃.', 'के साथ = mit/zusammen mit.']
      ],
      dialog: [
        ['A', 'आप कहाँ हैं?', 'āp kahā̃ haĩ?', 'Wo sind Sie?'],
        ['B', 'मैं होटल में हूँ।', 'maĩ hoṭal mẽ hū̃.', 'Ich bin im Hotel.'],
        ['A', 'आप किसके साथ हैं?', 'āp kiske sāth haĩ?', 'Mit wem sind Sie?'],
        ['B', 'मैं अपनी दोस्त के साथ हूँ।', 'maĩ apnī dost ke sāth hū̃.', 'Ich bin mit meiner Freundin hier.']
      ],
      quiz: [
        { q: 'Welche Form bedeutet „in“?', options: ['में', 'पर', 'से'], answer: 0 },
        { q: 'के साथ bedeutet …', options: ['für', 'mit', 'ohne'], answer: 1 }
      ]
    },
    {
      id: 'L06',
      title: 'Bestellen & Einkaufen',
      description: 'Wünsche ausdrücken, Preise verstehen und im Café oder Laden zurechtkommen.',
      grammar: [
        { heading: 'चाहिए (cāhie)', text: 'चाहिए ist extrem nützlich für „brauchen / möchten“. मुझे पानी चाहिए = „Ich brauche/möchte Wasser.“' },
        { heading: 'मुझे (mujhe)', text: 'मुझे bedeutet in vielen Konstruktionen „mir/mich“. Hindi formuliert Bedürfnisse oft als „mir ist X erforderlich“ statt mit einem direkten deutschen Verb.' },
        { heading: 'Zahlen & Preise', text: 'Für Alltagssituationen lohnt sich, Zahlen als feste Hörmuster zu trainieren. Die App startet mit den häufigsten kleinen Zahlen.' }
      ],
      examples: [
        ['Ich möchte einen Tee.', 'मुझे एक चाय चाहिए।', 'mujhe ek cāy cāhie.', 'Sehr gebräuchliche Wunschform.'],
        ['Wie viel kostet das?', 'यह कितने का है?', 'yah kitne kā hai?', 'Alltagssprachliche Preisfrage.'],
        ['Bitte etwas weniger scharf.', 'थोड़ा कम तीखा, कृपया।', 'thoṛā kam tīkhā, kṛpayā.', 'कम = weniger.'],
        ['Ich nehme das.', 'मैं यह लूँगी।', 'maĩ yah lū̃gī.', 'Feminine Sprecherform; maskulin: लूँगा.'],
        ['Haben Sie Wasser?', 'क्या आपके पास पानी है?', 'kyā āpke pās pānī hai?', 'के पास = bei jemandem / besitzen.']
      ],
      dialog: [
        ['A', 'नमस्ते, आपको क्या चाहिए?', 'namaste, āpko kyā cāhie?', 'Hallo, was möchten Sie?'],
        ['B', 'मुझे एक चाय और पानी चाहिए।', 'mujhe ek cāy aur pānī cāhie.', 'Ich möchte einen Tee und Wasser.'],
        ['A', 'और कुछ?', 'aur kuch?', 'Noch etwas?'],
        ['B', 'नहीं, धन्यवाद। यह कितने का है?', 'nahī̃, dhanyavād. yah kitne kā hai?', 'Nein, danke. Wie viel kostet das?']
      ],
      quiz: [
        { q: 'Wie sagt man „Ich möchte/brauche Wasser“?', options: ['मुझे पानी चाहिए।', 'मैं पानी हूँ।', 'पानी कहाँ है?'], answer: 0 },
        { q: 'कम bedeutet …', options: ['mehr', 'weniger', 'teuer'], answer: 1 }
      ]
    },
    {
      id: 'L07',
      title: 'Vergangenheit – erste Schritte',
      description: 'Über abgeschlossene Ereignisse sprechen und typische Perfektformen erkennen.',
      grammar: [
        { heading: 'Perfektive Formen', text: 'Abgeschlossene Handlungen werden häufig mit perfektiven Partizipien ausgedrückt. Formen können sich nach Genus und Numerus richten.' },
        { heading: 'Transitive Verben & ने', text: 'Bei vielen transitiven Verben erscheint im Perfekt beim Handelnden ने (ne): मैंने खाना खाया = „Ich habe Essen gegessen.“ Das System ist wichtiger als eine wörtliche deutsche Übersetzung.' },
        { heading: 'Erst Muster lernen', text: 'Die Ergativ-Konstruktion ist ein größeres Thema. Hier geht es zunächst darum, häufige Formen sicher zu erkennen und in festen Beispielen zu verwenden.' }
      ],
      examples: [
        ['Ich habe Tee getrunken.', 'मैंने चाय पी।', 'maĩne cāy pī.', 'चाय ist feminin; पी ist perfektiv.'],
        ['Ich habe gegessen.', 'मैंने खाना खाया।', 'maĩne khānā khāyā.', 'Häufige Alltagsform.'],
        ['Sie ist nach Delhi gegangen.', 'वह दिल्ली गई।', 'vah Dillī gaī.', 'Feminine Form गई; maskulin गया.'],
        ['Wir haben Hindi gelernt.', 'हमने हिंदी सीखी।', 'hamne hindī sīkhī.', 'हमने = wir + ने.'],
        ['Was haben Sie gemacht?', 'आपने क्या किया?', 'āpne kyā kiyā?', 'Sehr nützliche Frageform.']
      ],
      dialog: [
        ['A', 'कल आपने क्या किया?', 'kal āpne kyā kiyā?', 'Was haben Sie gestern gemacht?'],
        ['B', 'मैं बाज़ार गई और मैंने चाय पी।', 'maĩ bāzār gaī aur maĩne cāy pī.', 'Ich bin zum Markt gegangen und habe Tee getrunken.'],
        ['A', 'आपने हिंदी भी पढ़ी?', 'āpne hindī bhī paṛhī?', 'Haben Sie auch Hindi gelernt?'],
        ['B', 'हाँ, थोड़ी हिंदी पढ़ी।', 'hā̃, thoṛī hindī paṛhī.', 'Ja, ich habe ein bisschen Hindi gelernt.']
      ],
      quiz: [
        { q: 'Welche Form ist feminin „ging“?', options: ['गया', 'गई', 'गए'], answer: 1 },
        { q: 'Was signalisiert ने in vielen Perfektsätzen?', options: ['Ort', 'Handelnden bei transitiver Handlung', 'Frage'], answer: 1 }
      ]
    },
    {
      id: 'L08',
      title: 'Reise-Dialog: alles zusammen',
      description: 'Grammatik und Wortschatz aus den ersten Lektionen in einem längeren Alltagstext anwenden.',
      grammar: [
        { heading: 'Chunks statt Einzelwörter', text: 'Flüssigkeit entsteht schneller, wenn du häufige Wortgruppen als Einheit lernst: मुझे … चाहिए, … कहाँ है?, मेरे लिए …, आपके पास … है?' },
        { heading: 'Verstehen vor Produzieren', text: 'Lies den Dialog zuerst für die Bedeutung. Blende danach die Umschrift aus und höre einzelne Sätze per Vorlesefunktion.' },
        { heading: 'Aktives Wiedergeben', text: 'Versuche am Ende, denselben Dialog mit anderen Orten, Getränken oder Namen nachzubauen. Das überführt Grammatik in aktive Sprache.' }
      ],
      examples: [
        ['Ich habe eine Reservierung.', 'मेरी बुकिंग है।', 'merī buking hai.', 'Nützlicher Reise-Chunk.'],
        ['Wo ist mein Zimmer?', 'मेरा कमरा कहाँ है?', 'merā kamrā kahā̃ hai?', 'मेरा = mein (maskulin).'],
        ['Ich brauche Hilfe.', 'मुझे मदद चाहिए।', 'mujhe madad cāhie.', 'मदद = Hilfe.'],
        ['Morgen fahre ich nach Jaipur.', 'कल मैं जयपुर जाऊँगी।', 'kal maĩ Jaypur jāū̃gī.', 'Feminine Zukunftsform; maskulin: जाऊँगा.'],
        ['Vielen Dank.', 'बहुत धन्यवाद।', 'bahut dhanyavād.', 'बहुत = sehr/viel.']
      ],
      dialog: [
        ['Gast', 'नमस्ते। मेरी बुकिंग है।', 'namaste. merī buking hai.', 'Hallo. Ich habe eine Reservierung.'],
        ['Hotel', 'जी। आपका नाम क्या है?', 'jī. āpkā nām kyā hai?', 'Ja. Wie ist Ihr Name?'],
        ['Gast', 'मेरा नाम लीना है।', 'merā nām Līnā hai.', 'Ich heiße Lina.'],
        ['Hotel', 'आपका कमरा दूसरी मंज़िल पर है।', 'āpkā kamrā dūsrī manzil par hai.', 'Ihr Zimmer ist im zweiten Stock.'],
        ['Gast', 'धन्यवाद। पानी कहाँ है?', 'dhanyavād. pānī kahā̃ hai?', 'Danke. Wo ist Wasser?'],
        ['Hotel', 'कमरे में पानी है।', 'kamre mẽ pānī hai.', 'Im Zimmer ist Wasser.'],
        ['Gast', 'बहुत धन्यवाद।', 'bahut dhanyavād.', 'Vielen Dank.']
      ],
      quiz: [
        { q: 'Wie lautet der nützliche Chunk „Ich brauche Hilfe“?', options: ['मुझे मदद चाहिए।', 'मैं मदद है।', 'मदद कहाँ जाती है?'], answer: 0 },
        { q: 'Welche Strategie ist hier ausdrücklich empfohlen?', options: ['Nur isolierte Wörter lernen', 'Häufige Wortgruppen als Chunks lernen', 'Umschrift nie ausblenden'], answer: 1 }
      ]
    }
  ]
};

const rawCards = [
  ['L01','namaste','Hallo / Namaste','नमस्ते','namaste'],
  ['L01','name','Name','नाम','nām'],
  ['L01','my-name','Mein Name ist …','मेरा नाम … है।','merā nām … hai.'],
  ['L01','your-name','Wie heißen Sie?','आपका नाम क्या है?','āpkā nām kyā hai?'],
  ['L01','i','ich','मैं','maĩ'],
  ['L01','you-formal','Sie / höfliches du','आप','āp'],
  ['L01','what','was','क्या','kyā'],
  ['L01','good-ok','gut / in Ordnung','ठीक','ṭhīk'],
  ['L01','thank-you','Danke','धन्यवाद','dhanyavād'],
  ['L01','from','aus / von','से','se'],
  ['L02','good-m','gut (mask.)','अच्छा','acchā'],
  ['L02','good-f','gut (fem.)','अच्छी','acchī'],
  ['L02','big-m','groß (mask.)','बड़ा','baṛā'],
  ['L02','big-f','groß (fem.)','बड़ी','baṛī'],
  ['L02','small-m','klein (mask.)','छोटा','choṭā'],
  ['L02','small-f','klein (fem.)','छोटी','choṭī'],
  ['L02','room','Zimmer','कमरा','kamrā'],
  ['L02','book','Buch','किताब','kitāb'],
  ['L02','tea','Tee','चाय','cāy'],
  ['L02','very','sehr / viel','बहुत','bahut'],
  ['L03','go','gehen','जाना','jānā'],
  ['L03','do','machen / tun','करना','karnā'],
  ['L03','eat','essen','खाना','khānā'],
  ['L03','drink','trinken','पीना','pīnā'],
  ['L03','learn','lernen','सीखना','sīkhnā'],
  ['L03','work','arbeiten / Arbeit','काम करना','kām karnā'],
  ['L03','morning','Morgen / morgens','सुबह','subah'],
  ['L03','every-day','jeden Tag','हर दिन','har din'],
  ['L03','home','Haus / Zuhause','घर','ghar'],
  ['L03','hindi','Hindi','हिंदी','hindī'],
  ['L04','where','wo','कहाँ','kahā̃'],
  ['L04','when','wann','कब','kab'],
  ['L04','who','wer','कौन','kaun'],
  ['L04','how','wie','कैसे','kaise'],
  ['L04','speak','sprechen','बोलना','bolnā'],
  ['L04','live','wohnen / leben','रहना','rahnā'],
  ['L04','station','Bahnhof','स्टेशन','sṭeśan'],
  ['L04','here','hier','यहाँ','yahā̃'],
  ['L04','there','dort','वहाँ','vahā̃'],
  ['L04','straight','geradeaus','सीधे','sīdhe'],
  ['L05','in','in','में','mẽ'],
  ['L05','on-at','auf / an / bei','पर','par'],
  ['L05','with','mit / zusammen mit','के साथ','ke sāth'],
  ['L05','for','für','के लिए','ke lie'],
  ['L05','hotel','Hotel','होटल','hoṭal'],
  ['L05','table','Tisch','मेज़','mez'],
  ['L05','phone','Telefon / Handy','फ़ोन','fon'],
  ['L05','friend','Freund/in','दोस्त','dost'],
  ['L05','for-me','für mich','मेरे लिए','mere lie'],
  ['L05','with-me','mit mir','मेरे साथ','mere sāth'],
  ['L06','want-need','möchten / brauchen','चाहिए','cāhie'],
  ['L06','to-me','mir / mich','मुझे','mujhe'],
  ['L06','water','Wasser','पानी','pānī'],
  ['L06','how-much','wie viel','कितना','kitnā'],
  ['L06','less','weniger','कम','kam'],
  ['L06','little','ein wenig','थोड़ा','thoṛā'],
  ['L06','spicy','scharf','तीखा','tīkhā'],
  ['L06','please','bitte','कृपया','kṛpayā'],
  ['L06','more','mehr / noch','और','aur'],
  ['L06','nothing-no','nein / nicht','नहीं','nahī̃'],
  ['L07','yesterday-tomorrow','gestern / morgen (Kontext)','कल','kal'],
  ['L07','went-f','ging (fem.)','गई','gaī'],
  ['L07','went-m','ging (mask.)','गया','gayā'],
  ['L07','did','machte / getan','किया','kiyā'],
  ['L07','i-erg','ich + Ergativmarker','मैंने','maĩne'],
  ['L07','you-erg','Sie + Ergativmarker','आपने','āpne'],
  ['L07','we-erg','wir + Ergativmarker','हमने','hamne'],
  ['L07','also','auch','भी','bhī'],
  ['L07','market','Markt','बाज़ार','bāzār'],
  ['L07','yes','ja','हाँ','hā̃'],
  ['L08','booking','Reservierung / Buchung','बुकिंग','buking'],
  ['L08','help','Hilfe','मदद','madad'],
  ['L08','floor','Stockwerk','मंज़िल','manzil'],
  ['L08','second-f','zweite (fem.)','दूसरी','dūsrī'],
  ['L08','need-help','Ich brauche Hilfe.','मुझे मदद चाहिए।','mujhe madad cāhie.'],
  ['L08','where-room','Wo ist mein Zimmer?','मेरा कमरा कहाँ है?','merā kamrā kahā̃ hai?'],
  ['L08','reservation','Ich habe eine Reservierung.','मेरी बुकिंग है।','merī buking hai.'],
  ['L08','many-thanks','Vielen Dank.','बहुत धन्यवाद।','bahut dhanyavād.'],
  ['L08','tomorrow-jaipur','Morgen fahre ich nach Jaipur.','कल मैं जयपुर जाऊँगी।','kal maĩ Jaypur jāū̃gī.'],
  ['L08','my-room','mein Zimmer','मेरा कमरा','merā kamrā']
];

export const cards = rawCards.map(([lessonId, slug, german, hindi, transliteration], index) => ({
  id: `${lessonId}-${String(index + 1).padStart(3, '0')}-${slug}`,
  lessonId,
  german,
  hindi,
  transliteration
}));
