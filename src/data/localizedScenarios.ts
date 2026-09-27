import { TrainingModule, Language, ARScenario } from '../types';
import { modulesData } from './mockData';

// Trilingual scenario localization dictionaries
const SCENARIO_TRANSLATIONS: Record<
  string,
  Partial<
    Record<
      Language,
      {
        title: string;
        subtitle: string;
        situation: string;
        question: string;
        options: { id: string; text: string; feedback: string }[];
        markers: { id: string; label: string; description: string; actionRequired?: string }[];
      }
    >
  >
> = {
  'fire-sc-1': {
    en: {
      title: 'Scenario 1: Active Fire Detected in Conveyor Shaft',
      subtitle: 'Critical First Response Protocol',
      situation: 'Dense smoke and open flames detected along the coal conveyor belt line 400m underground. Ventilation fan pressure is dropping.',
      question: 'A fire is detected along the coal conveyor. What must you do FIRST?',
      options: [
        {
          id: 'opt-a',
          text: 'A. Investigate the fire origin independently',
          feedback: 'Dangerous! Investigating alone in underground conditions can lead to rapid asphyxiation or secondary methane explosion.',
        },
        {
          id: 'opt-b',
          text: 'B. Raise the alarm and identify the emergency exit route',
          feedback: 'Correct Decision! Sounding the acoustic evacuation siren and confirming the fresh-air intake escapeway saves crew lives immediately.',
        },
        {
          id: 'opt-c',
          text: 'C. Continue working until shift supervisor arrives',
          feedback: 'Fatal error! Underground fire doubles in toxic intensity within 90 seconds. Immediate alarm is mandatory.',
        },
        {
          id: 'opt-d',
          text: 'D. Hide inside the nearest storage alcove',
          feedback: 'Never hide! Alcoves quickly trap dense carbon monoxide. You must proceed immediately to intake airway.',
        },
      ],
      markers: [
        {
          id: 'm1',
          label: 'ACTIVE FIRE HAZARD',
          description: 'Coal dust conveyor friction fire spreading westward.',
          actionRequired: 'Contain zone & evacuate',
        },
        {
          id: 'm2',
          label: 'DANGER ZONE (TOXIC GAS)',
          description: 'Carbon Monoxide rising past 50 ppm. Flammable methane pocket proximity.',
        },
        {
          id: 'm3',
          label: 'EMERGENCY ESCAPEWAY EXIT',
          description: 'Pressurized fresh air intake shaft corridor (Intake Heading 2).',
        },
        {
          id: 'm4',
          label: 'ABC FIRE EXTINGUISHER STATION',
          description: 'Dry chemical powder extinguisher rated for Class A, B & C fires.',
        },
      ],
    },
    hi: {
      title: 'परिदृश्य 1: कन्वेयर शाफ्ट में सक्रिय आग की पहचान',
      subtitle: 'गंभीर प्राथमिक आपातकालीन प्रतिक्रिया',
      situation: 'भूमिगत 400 मीटर कोयला कन्वेयर लाइन पर घना धुआं और खुली लपटें पाई गईं। वेंटिलेशन पंखे का दबाव तेजी से गिर रहा है।',
      question: 'कोयला कन्वेयर पर आग लगने पर आपको सबसे पहले क्या कदम उठाना चाहिए?',
      options: [
        {
          id: 'opt-a',
          text: 'क. अकेले आग के स्रोत की जांच करने जाएं',
          feedback: 'अत्यंत खतरनाक! भूमिगत खदान में अकेले जाना दम घुटने या मीथेन विस्फोट का कारण बन सकता है।',
        },
        {
          id: 'opt-b',
          text: 'ख. आपातकालीन सायरन बजाएं और सुरक्षित निकास मार्ग चुनें',
          feedback: 'बिल्कुल सही निर्णय! तुरंत आपातकालीन अलार्म बजाने और ताजी हवा इनटेक मार्ग चुनने से सभी कामगारों की जान बचती है।',
        },
        {
          id: 'opt-c',
          text: 'ग. सुपरवाइजर के आने तक खनन कार्य जारी रखें',
          feedback: 'घातक गलती! भूमिगत आग 90 सेकंड में जहरीली गैसों को दोगुना कर देती है। तत्काल अलार्म आवश्यक है।',
        },
        {
          id: 'opt-d',
          text: 'घ. पास के भंडारण कक्ष में छिप जाएं',
          feedback: 'कभी न छिपें! बंद कोठरियों में कार्बन मोनोऑक्साइड भर जाती है। तुरंत ताजी हवा मार्ग की ओर बढ़ें।',
        },
      ],
      markers: [
        {
          id: 'm1',
          label: 'सक्रिय आग का खतरा',
          description: 'कोयला कन्वेयर बेल्ट घर्षण आग पश्चिम की ओर फैल रही है।',
          actionRequired: 'क्षेत्र खाली करें एवं अलार्म दें',
        },
        {
          id: 'm2',
          label: 'खतरा क्षेत्र (जहरीली गैस)',
          description: 'कार्बन मोनोऑक्साइड 50 पीपीएम से अधिक। ज्वलनशील मीथेन उपस्थित।',
        },
        {
          id: 'm3',
          label: 'आपातकालीन निकास द्वार',
          description: 'सकारात्मक दबाव वाली ताजी हवा इनटेक सुरंग (इनटेक हेडिंग 2)।',
        },
        {
          id: 'm4',
          label: 'एबीसी अग्निशामक स्टेशन',
          description: 'क्लास ए, बी और सी हेतु बहुउद्देशीय शुष्क रासायनिक पाउडर।',
        },
      ],
    },
    sat: {
      title: 'ᱫᱟᱹᱭᱠᱟᱹ ᱑: ᱠᱚᱱᱵᱷᱮᱭᱟᱨ ᱥᱟᱯᱷᱴ ᱨᱮ ᱥᱮᱸᱜᱮᱞ ᱧᱟᱢ ᱮᱱᱟ',
      subtitle: 'ᱮᱛᱚᱦᱚᱵ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱜᱚᱴᱟ',
      situation: 'ᱠᱷᱟᱫᱟᱱ ᱵᱷᱤᱛᱨᱤ ᱔᱐᱐ ᱢᱤᱴᱟᱨ ᱠᱩᱭᱞᱟᱹ ᱠᱚᱱᱵᱷᱮᱭᱟᱨ ᱞᱟᱭᱤᱱ ᱨᱮ ᱫᱷᱩᱶᱟᱹ ᱟᱨ ᱥᱮᱸᱜᱮᱞ ᱧᱮᱞ ᱮᱱᱟ᱾ ᱦᱚᱭ ᱪᱟᱞᱟᱣ ᱠᱚᱢᱚᱜ ᱠᱟᱱᱟ᱾',
      question: 'ᱠᱚᱱᱵᱷᱮᱭᱟᱨ ᱨᱮ ᱥᱮᱸᱜᱮᱞ ᱧᱮᱞ ᱠᱟᱛᱮ ᱡᱚᱛᱚ ᱠᱷᱚᱱ ᱯᱩᱭᱞᱩ ᱪᱮᱫ ᱮᱢ ᱠᱟᱹᱢᱤᱭᱟ?',
      options: [
        {
          id: 'opt-a',
          text: 'A. ᱮᱠᱞᱟ ᱛᱮ ᱥᱮᱸᱜᱮᱞ ᱧᱮᱞ ᱪᱟᱞᱟᱜ ᱢᱮ',
          feedback: 'ᱵᱤᱯᱚᱫᱽ ᱜᱮᱭᱟ! ᱮᱠᱞᱟ ᱪᱟᱞᱟᱜ ᱠᱷᱟᱱ ᱵᱤᱥ ᱜᱮᱥ ᱛᱮ ᱥᱟᱦᱮᱫ ᱵᱚᱸᱫᱽ ᱫᱟᱲᱮᱭᱟᱜ-ᱟ᱾',
        },
        {
          id: 'opt-b',
          text: 'B. ᱥᱟᱭᱨᱮᱱ ᱚᱨ ᱢᱮ ᱟᱨ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱚᱰᱚᱠ ᱦᱚᱨ ᱪᱟᱞᱟᱜ ᱢᱮ',
          feedback: 'ᱴᱷᱤᱠ ᱜᱚᱴᱟ! ᱥᱟᱭᱨᱮᱱ ᱚᱨ ᱠᱟᱛᱮ ᱥᱟᱯᱷᱟ ᱦᱚᱭ ᱚᱰᱚᱠ ᱦᱚᱨ ᱪᱟᱞᱟᱜ ᱛᱮ ᱡᱤᱣᱤ ᱵᱟᱧᱪᱟᱣᱜ-ᱟ᱾',
        },
        {
          id: 'opt-c',
          text: 'C. ᱢᱟᱹᱞᱤᱠ ᱦᱤᱡᱩᱜ ᱦᱟᱹᱵᱤᱡ ᱠᱟᱹᱢᱤ ᱛᱚᱝᱜᱮ ᱫᱚᱦᱚᱭ ᱢᱮ',
          feedback: 'ᱵᱟᱹᱲᱤᱡ ᱠᱟᱹᱢᱤ! ᱙᱐ ᱥᱮᱠᱮᱱᱰ ᱨᱮ ᱵᱤᱥ ᱫᱷᱩᱶᱟᱹ ᱵᱟᱹᱲᱛᱤᱜ-ᱟ᱾ ᱞᱚᱜᱚᱱ ᱥᱟᱭᱨᱮᱱ ᱞᱟᱹᱠᱛᱤᱭᱟ᱾',
        },
        {
          id: 'opt-d',
          text: 'D. ᱦᱩᱰᱤᱧ ᱠᱷᱩᱸᱫᱽᱲᱤ ᱨᱮ ᱩᱠᱩᱜ ᱢᱮ',
          feedback: 'ᱛᱤᱥ ᱦᱚᱸ ᱟᱞᱚᱢ ᱩᱠᱩᱜ-ᱟ! ᱚᱸᱰᱮ ᱵᱤᱥ ᱜᱮᱥ ᱡᱟᱣᱨᱟᱜ-ᱟ᱾',
        },
      ],
      markers: [
        {
          id: 'm1',
          label: 'ᱥᱮᱸᱜᱮᱞ ᱵᱤᱯᱚᱫᱽ ᱡᱟᱭᱜᱟ',
          description: 'ᱠᱩᱭᱞᱟᱹ ᱠᱚᱱᱵᱷᱮᱭᱟᱨ ᱥᱮᱸᱜᱮᱞ ᱯᱟᱥᱱᱟᱣᱜ ᱠᱟᱱᱟ᱾',
          actionRequired: 'ᱡᱟᱭᱜᱟ ᱵᱟᱹᱜᱤ ᱢᱮ ᱟᱨ ᱥᱟᱭᱨᱮᱱ ᱚᱨ ᱢᱮ',
        },
        {
          id: 'm2',
          label: 'ᱵᱤᱯᱚᱫᱽ ᱡᱟᱭᱜᱟ (ᱵᱤᱥ ᱜᱮᱥ)',
          description: 'CO ᱜᱮᱥ ᱕᱐ PPM ᱠᱷᱚᱱ ᱵᱟᱹᱲᱛᱤ ᱮᱱᱟ᱾',
        },
        {
          id: 'm3',
          label: 'ᱨᱩᱠᱷᱤᱭᱟᱹ ᱚᱰᱚᱠ ᱦᱚᱨ',
          description: 'ᱥᱟᱯᱷᱟ ᱦᱚᱭ ᱪᱟᱞᱟᱣ ᱚᱰᱚᱠ ᱦᱚᱨ (Intake Heading 2)᱾',
        },
        {
          id: 'm4',
          label: 'ABC ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱥᱟᱢᱟᱱ',
          description: 'A, B ᱟᱨ C ᱡᱟᱹᱛᱤ ᱥᱮᱸᱜᱮᱞ ᱞᱟᱹᱜᱤᱫ ᱯᱟᱣᱰᱟᱨ᱾',
        },
      ],
    },
  },
  'fire-sc-2': {
    en: {
      title: 'Scenario 2: Extinguisher Selection & Fire Suppression',
      subtitle: 'Class A/B/C Identification in High-Dust Zones',
      situation: 'An electrical distribution panel adjacent to the coal feeder has sparked an early-stage Class C energized fire.',
      question: 'Which fire extinguisher must be chosen for an electrical and coal conveyor fire?',
      options: [
        {
          id: 'opt-ext-1',
          text: 'A. Pressurized Plain Water Extinguisher (Class A only)',
          feedback: 'Dangerous! Plain water conducts electricity and will deliver a fatal shock to the operator on energized equipment.',
        },
        {
          id: 'opt-ext-2',
          text: 'B. Multi-Purpose ABC Dry Chemical Powder Extinguisher',
          feedback: 'Correct Decision! ABC Dry Powder smothers flames without conducting electrical currents, breaking the chemical chain reaction.',
        },
        {
          id: 'opt-ext-3',
          text: 'C. Chemical Foam Unit (AFFF)',
          feedback: 'Incorrect! Aqueous film-forming foam contains water solutions that risk electrical conduction.',
        },
        {
          id: 'opt-ext-4',
          text: 'D. Wet Chemical Kitchen Agent (Class K)',
          feedback: 'Incorrect! Class K is solely for cooking oil fires, ineffective on high-velocity industrial dust fires.',
        },
      ],
      markers: [
        {
          id: 'm2-1',
          label: 'ELECTRICAL FEEDER SPARK',
          description: 'Live 440V transformer terminal emitting sparks.',
        },
        {
          id: 'm2-2',
          label: 'ABC DRY POWDER CYLINDER',
          description: 'Non-conductive monoammonium phosphate agent suitable for electrical & solid fires.',
        },
        {
          id: 'm2-3',
          label: 'WATER HOSE REEL',
          description: 'Conductive water stream! Severe electrocution hazard if used on live equipment.',
        },
      ],
    },
    hi: {
      title: 'परिदृश्य 2: अग्निशामक का चयन एवं आग नियंत्रण',
      subtitle: 'कोयला धूल एवं विद्युत क्षेत्रों में क्लास ए/बी/सी पहचान',
      situation: 'कोयला फीडर के पास विद्युत वितरण पैनल में 440V विद्युत चिंगारी से आग भड़क उठी है।',
      question: 'विद्युत एवं कोयला कन्वेयर आग हेतु किस अग्निशामक का चयन करना चाहिए?',
      options: [
        {
          id: 'opt-ext-1',
          text: 'क. साधारण दबावयुक्त जल अग्निशामक (केवल क्लास ए)',
          feedback: 'घातक! पानी बिजली का संवाहक है और 440V से बिजली का घातक झटका लग सकता है।',
        },
        {
          id: 'opt-ext-2',
          text: 'ख. बहुउद्देशीय एबीसी सूखा रासायनिक पाउडर अग्निशामक',
          feedback: 'सटीक निर्णय! एबीसी सूखा पाउडर बिना बिजली का संचालन किए लपटों को दबा देता है।',
        },
        {
          id: 'opt-ext-3',
          text: 'ग. रासायनिक झाग यूनिट (एएफएफएफ)',
          feedback: 'गलत! फोम में पानी मिला होता है जिससे करंट लगने का बड़ा जोखिम होता है।',
        },
        {
          id: 'opt-ext-4',
          text: 'घ. गीला रासायनिक किचन एजेंट (क्लास के)',
          feedback: 'गलत! क्लास के केवल खाना पकाने वाले तेल की आग हेतु होता है।',
        },
      ],
      markers: [
        {
          id: 'm2-1',
          label: 'विद्युत फीडर स्पार्क',
          description: 'सक्रिय 440V ट्रांसफार्मर से चिंगारियां निकल रही हैं।',
        },
        {
          id: 'm2-2',
          label: 'एबीसी ड्राई पाउडर सिलेंडर',
          description: 'अचालक मोनोअमोनियम फॉस्फेट जो विद्युत आग हेतु सुरक्षित है।',
        },
        {
          id: 'm2-3',
          label: 'पानी की नली रील',
          description: 'पानी बिजली का सुचालक है! चालू बिजली पर प्रयोग सख्त वर्जित।',
        },
      ],
    },
    sat: {
      title: 'ᱫᱟᱹᱭᱠᱟᱹ ᱒: ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱥᱟᱢᱟᱱ ᱵᱟᱪᱷᱟᱣ',
      subtitle: 'ᱠᱩᱭᱞᱟᱹ ᱫᱷᱩᱲᱤ ᱟᱨ ᱠᱟᱨᱮᱱᱴ ᱥᱮᱸᱜᱮᱞ ᱪᱤᱱᱦᱟᱹᱣ',
      situation: 'ᱠᱩᱭᱞᱟᱹ ᱯᱷᱤᱰᱟᱨ ᱥᱩᱨ ᱨᱮ ᱔᱔᱐V ᱠᱟᱨᱮᱱᱴ ᱵᱳᱨᱰ ᱠᱷᱚᱱ ᱥᱮᱸᱜᱮᱞ ᱦᱮᱡ ᱮᱱᱟ᱾',
      question: 'ᱠᱟᱨᱮᱱᱴ ᱟᱨ ᱠᱩᱭᱞᱟᱹ ᱥᱮᱸᱜᱮᱞ ᱞᱟᱹᱜᱤᱫ ᱚᱠᱟ ᱤᱬᱤᱡ ᱥᱟᱢᱟᱱ ᱮᱢ ᱵᱟᱪᱷᱟᱣᱟ?',
      options: [
        {
          id: 'opt-ext-1',
          text: 'A. ᱫᱟᱜ ᱤᱬᱤᱡ ᱥᱟᱢᱟᱱ (Class A)',
          feedback: 'ᱵᱤᱯᱚᱫᱽ! ᱫᱟᱜ ᱛᱮ ᱠᱟᱨᱮᱱᱴ ᱧᱟᱢᱚᱜ-ᱟ ᱟᱨ ᱡᱤᱣᱤ ᱪᱟᱞᱟᱜ-ᱟ᱾',
        },
        {
          id: 'opt-ext-2',
          text: 'B. ABC ᱨᱚᱦᱚᱲ ᱜᱩᱸᱰᱟᱹ (Dry Powder) ᱤᱬᱤᱡ ᱥᱟᱢᱟᱱ',
          feedback: 'ᱴᱷᱤᱠ ᱜᱚᱴᱟ! ABC ᱜᱩᱸᱰᱟᱹ ᱛᱮ ᱠᱟᱨᱮᱱᱴ ᱵᱟᱝ ᱧᱟᱢᱚᱜ-ᱟ ᱟᱨ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ-ᱟ᱾',
        },
        {
          id: 'opt-ext-3',
          text: 'C. ᱯᱷᱳᱢ (Foam) ᱤᱬᱤᱡ ᱥᱟᱢᱟᱱ',
          feedback: 'ᱵᱟᱹᱲᱤᱡ! ᱯᱷᱳᱢ ᱨᱮ ᱫᱟᱜ ᱛᱟᱦᱮᱸᱱᱟ ᱚᱱᱟᱛᱮ ᱠᱟᱨᱮᱱᱴ ᱞᱟᱜᱟᱣ ᱫᱟᱲᱮᱭᱟᱜ-ᱟ᱾',
        },
        {
          id: 'opt-ext-4',
          text: 'D. ᱠᱤᱪᱮᱱ ᱤᱬᱤᱡ ᱥᱟᱢᱟᱱ (Class K)',
          feedback: 'ᱵᱟᱹᱲᱤᱡ! ᱱᱚᱶᱟ ᱫᱚ ᱩᱛᱩ ᱥᱩᱱᱩᱢ ᱥᱮᱸᱜᱮᱞ ᱞᱟᱹᱜᱤᱫ ᱠᱟᱱᱟ᱾',
        },
      ],
      markers: [
        {
          id: 'm2-1',
          label: 'ᱠᱟᱨᱮᱱᱴ ᱥᱯᱟᱨᱠ',
          description: '᱔᱔᱐V ᱴᱨᱟᱱᱥᱯᱷᱚᱨᱢᱟᱨ ᱠᱷᱚᱱ ᱥᱮᱸᱜᱮᱞ ᱪᱷᱤᱴᱠᱟᱹᱣᱜ ᱠᱟᱱᱟ᱾',
        },
        {
          id: 'm2-2',
          label: 'ABC ᱨᱚᱦᱚᱲ ᱜᱩᱸᱰᱟᱹ ᱥᱤᱞᱤᱱᱰᱟᱨ',
          description: 'ᱠᱟᱨᱮᱱᱴ ᱟᱨ ᱠᱩᱭᱞᱟᱹ ᱥᱮᱸᱜᱮᱞ ᱞᱟᱹᱜᱤᱫ ᱡᱚᱛᱚ ᱠᱷᱚᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ᱾',
        },
        {
          id: 'm2-3',
          label: 'ᱫᱟᱜ ᱯᱟᱭᱤᱯ',
          description: 'ᱫᱟᱜ ᱛᱮ ᱠᱟᱨᱮᱱᱴ ᱞᱟᱜᱟᱣᱜ-ᱟ! ᱠᱟᱨᱮᱱᱴ ᱨᱮ ᱟᱞᱚᱢ ᱪᱷᱤᱴᱠᱟᱹᱣᱟ᱾',
        },
      ],
    },
  },
  'fire-sc-3': {
    en: {
      title: 'Scenario 3: Tactical Evacuation Route Planning',
      subtitle: 'Escapeway Navigation Under Low Visibility',
      situation: 'Heavy smoke is channeling through Return Airway 1. You must guide your crew toward the Intake Shaft escape door.',
      question: 'Identify the safest tactical evacuation route to reach the exit.',
      options: [
        {
          id: 'route-a',
          text: 'Direct Path through Central Haulage Road (Crosses Active Fire)',
          feedback: 'Blocked! Traversing through the flame wall will result in critical burns and structural roof collapse.',
        },
        {
          id: 'route-b',
          text: 'Bypass Route via Intake Airway 2 through Blast Relief Door',
          feedback: 'Correct Decision! Traveling upstream through the positive fresh air intake provides breathable air and safe clearance.',
        },
        {
          id: 'route-c',
          text: 'Return Airway exhaust duct',
          feedback: 'Fatal! Exhaust airway carries all fumes and toxic soot directly from the burning zone.',
        },
      ],
      markers: [
        {
          id: 'm3-worker',
          label: 'WORKER POSITION',
          description: 'Your current team location at Coal Face 3.',
        },
        {
          id: 'm3-fire',
          label: 'UNCONTROLLED FIRE',
          description: 'Active flame wall blocking Primary Central Haulage Road.',
        },
        {
          id: 'm3-danger',
          label: 'DANGER ZONE (HEAT & TOXIC CORRIDOR)',
          description: 'Return airway filled with suffocating CO gas.',
        },
        {
          id: 'm3-exit',
          label: 'EMERGENCY FRESH AIR ESCAPEWAY',
          description: 'Positive-pressure intake tunnel leading safely to Surface Lift Shaft.',
        },
      ],
    },
    hi: {
      title: 'परिदृश्य 3: सुरक्षित आपातकालीन निकास योजना',
      subtitle: 'कम दृश्यता में ताजी हवा मार्ग की ओर मार्गदर्शन',
      situation: 'रिटर्न एयरवे में भारी धुआं भर गया है। आपको अपने दल को सुरक्षित इनटेक शाफ्ट निकास द्वार की ओर ले जाना है।',
      question: 'सुरक्षित बाहर निकलने के लिए सबसे उपयुक्त निकास मार्ग कौन सा है?',
      options: [
        {
          id: 'route-a',
          text: 'केंद्रीय मुख्य मार्ग से सीधा रास्ता (सीधे आग के बीच से)',
          feedback: 'अवरुद्ध! आग की लपटों के बीच से जाना जलने और छत गिरने का कारण बनेगा।',
        },
        {
          id: 'route-b',
          text: 'ब्लास्ट डोर से होकर इनटेक एयरवे 2 का बाईपास मार्ग',
          feedback: 'सटीक निर्णय! ताजी हवा के इनटेक मार्ग से आगे बढ़ना सांस लेने योग्य हवा और सुरक्षित बचाव प्रदान करता है।',
        },
        {
          id: 'route-c',
          text: 'रिटर्न एयरवे निकास डक्ट की ओर जाना',
          feedback: 'घातक! निकास डक्ट आग की सभी जहरीली गैसों और कालिख को सीधे खींचती है।',
        },
      ],
      markers: [
        {
          id: 'm3-worker',
          label: 'कामगारों की स्थिति',
          description: 'कोयला फेस 3 पर आपके दल का वर्तमान स्थान।',
        },
        {
          id: 'm3-fire',
          label: 'अनियंत्रित लपटें',
          description: 'मुख्य केंद्रीय मार्ग को अवरुद्ध करने वाली आग।',
        },
        {
          id: 'm3-danger',
          label: 'खतरा क्षेत्र (जहरीला गलियारा)',
          description: 'रिटर्न मार्ग कार्बन मोनोऑक्साइड से भरा हुआ है।',
        },
        {
          id: 'm3-exit',
          label: 'आपातकालीन ताजी हवा निकास',
          description: 'सकारात्मक दबाव वाली ताजी हवा सुरंग जो सीधे सतह लिफ्ट तक ले जाती है।',
        },
      ],
    },
    sat: {
      title: 'ᱫᱟᱹᱭᱠᱟᱹ ᱓: ᱨᱩᱠᱷᱤᱭᱟᱹ ᱚᱰᱚᱠ ᱦᱚᱨ ᱯᱟᱱᱛᱷᱟ',
      subtitle: 'ᱧᱩᱛ ᱟᱨ ᱫᱷᱩᱶᱟᱹ ᱨᱮ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱚᱰᱚᱠ ᱦᱚᱨ',
      situation: 'ᱫᱷᱩᱶᱟᱹ ᱠᱷᱟᱫᱟᱱ ᱨᱮ ᱯᱮᱨᱮᱡ ᱮᱱᱟ᱾ ᱟᱢᱟᱜ ᱫᱚᱞ ᱥᱟᱯᱷᱟ ᱦᱚᱭ ᱚᱰᱚᱠ ᱫᱩᱣᱟᱹᱨ ᱥᱮᱫ ᱟᱹᱭᱩᱨ ᱠᱚ ᱢᱮ᱾',
      question: 'ᱵᱟᱦᱨᱮ ᱚᱰᱚᱠᱚᱜ ᱞᱟᱹᱜᱤᱫ ᱡᱚᱛᱚ ᱠᱷᱚᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱦᱚᱨ ᱚᱠᱟ ᱠᱟᱱᱟ?',
      options: [
        {
          id: 'route-a',
          text: 'ᱢᱩᱬᱩᱛ ᱥᱮᱸᱜᱮᱞ ᱛᱟᱞᱟ ᱛᱮ ᱥᱚᱡᱷᱮ ᱪᱟᱞᱟᱜ',
          feedback: 'ᱵᱚᱸᱫᱽ ᱜᱮᱭᱟ! ᱥᱮᱸᱜᱮᱞ ᱛᱟᱞᱟ ᱛᱮ ᱪᱟᱞᱟᱜ ᱠᱷᱟᱱ ᱞᱚᱜ-ᱟ ᱟᱨ ᱪᱷᱟᱛ ᱫᱷᱟᱹᱥᱩᱲᱚᱜ-ᱟ᱾',
        },
        {
          id: 'route-b',
          text: 'ᱵᱞᱟᱥᱴ ᱫᱩᱣᱟᱹᱨ ᱛᱮ ᱥᱟᱯᱷᱟ ᱦᱚᱭ ᱤᱱᱴᱮᱠ ᱦᱚᱨ',
          feedback: 'ᱴᱷᱤᱠ ᱜᱚᱴᱟ! ᱥᱟᱯᱷᱟ ᱦᱚᱭ ᱦᱚᱨ ᱛᱮ ᱪᱟᱞᱟᱜ ᱠᱷᱟᱱ ᱥᱟᱦᱮᱫ ᱦᱟᱛᱟᱣ ᱜᱟᱱᱚᱜ-ᱟ᱾',
        },
        {
          id: 'route-c',
          text: 'ᱫᱷᱩᱶᱟᱹ ᱚᱰᱚᱠ ᱦᱚᱨ (Return Airway)',
          feedback: 'ᱵᱤᱯᱚᱫᱽ! ᱚᱸᱰᱮ ᱡᱚᱛᱚ ᱵᱤᱥ ᱫᱷᱩᱶᱟᱹ ᱪᱟᱞᱟᱜ ᱠᱟᱱᱟ᱾',
        },
      ],
      markers: [
        {
          id: 'm3-worker',
          label: 'ᱠᱟᱹᱢᱤᱭᱟᱹ ᱠᱚᱣᱟᱜ ᱴᱷᱟᱶ',
          description: 'ᱠᱩᱭᱞᱟᱹ ᱯᱷᱮᱥ ᱓ ᱨᱮ ᱟᱢᱟᱜ ᱴᱤᱢ ᱢᱮᱱᱟᱜ ᱠᱚᱣᱟ᱾',
        },
        {
          id: 'm3-fire',
          label: 'ᱥᱮᱸᱜᱮᱞ ᱡᱩᱞᱩᱜ ᱠᱟᱱᱟ',
          description: 'ᱢᱩᱬᱩᱛ ᱦᱚᱨ ᱥᱮᱸᱜᱮᱞ ᱛᱮ ᱮᱥᱮᱫ ᱟᱠᱟᱱᱟ᱾',
        },
        {
          id: 'm3-danger',
          label: 'ᱵᱤᱯᱚᱫᱽ ᱡᱟᱭᱜᱟ (ᱵᱤᱥ ᱫᱷᱩᱶᱟᱹ)',
          description: 'CO ᱜᱮᱥ ᱛᱮ ᱯᱮᱨᱮᱡ ᱟᱠᱟᱱ ᱦᱚᱨ᱾',
        },
        {
          id: 'm3-exit',
          label: 'ᱥᱟᱯᱷᱟ ᱦᱚᱭ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱫᱩᱣᱟᱹᱨ',
          description: 'ᱥᱚᱡᱷᱮ ᱪᱮᱛᱟᱱ ᱞᱤᱯᱷᱴ ᱪᱟᱞᱟᱜ ᱥᱟᱯᱷᱟ ᱦᱚᱨ᱾',
        },
      ],
    },
  },
  'gas-sc-1': {
    en: {
      title: 'Scenario 1: Gas Hazard Area Recognition',
      subtitle: 'Toxic Pocket Identification',
      situation: 'Your multi-gas detector starts beeping rhythmically at the entrance of unventilated Heading 7.',
      question: 'Which sector presents the highest immediate threat to miner safety?',
      options: [
        {
          id: 'gas-opt-1',
          text: 'A. The Sump depression with Toxic Gas Pocket & O2 deficiency',
          feedback: 'Correct Decision! Unventilated depressions concentrate heavier-than-air toxic gases and suffocate entrants within breaths.',
        },
        {
          id: 'gas-opt-2',
          text: 'B. The fresh air crosscut with airflow breeze',
          feedback: 'Incorrect! The fresh air crosscut is the safe zone.',
        },
        {
          id: 'gas-opt-3',
          text: 'C. The well-lit main timber haulage track',
          feedback: 'Incorrect! Timber track has active ventilation.',
        },
      ],
      markers: [
        {
          id: 'm-gas-1',
          label: 'TOXIC GAS POCKET (H2S / CO)',
          description: 'Hydrogen Sulfide accumulation in low depression sump.',
          actionRequired: 'Mark as restricted zone',
        },
        {
          id: 'm-gas-2',
          label: 'HAZARD BOUNDARY ZONE',
          description: 'Oxygen level recorded at 16.4% (Critical deficiency).',
        },
        {
          id: 'm-gas-3',
          label: 'MANDATORY PPE CHECKPOINT',
          description: 'Positive pressure breathing pack and gas monitor required.',
        },
        {
          id: 'm-gas-4',
          label: 'BUDDY SYSTEM STANDBY POST',
          description: 'Safety spotter with radio transmitter connected to surface.',
        },
      ],
    },
    hi: {
      title: 'परिदृश्य 1: गैस खतरा क्षेत्र की पहचान',
      subtitle: 'जहरीली गैस पॉकेट की पहचान',
      situation: 'अहवादार हेडिंग 7 के प्रवेश द्वार पर आपका मल्टी-गैस डिटेक्टर चेतावनी ध्वनि बजाने लगता है।',
      question: 'खदान में कौन सा क्षेत्र कामगारों के लिए सर्वाधिक तात्कालिक खतरा प्रस्तुत करता है?',
      options: [
        {
          id: 'gas-opt-1',
          text: 'क. निचला नाला/गड्ढा जहां जहरीली गैस व ऑक्सीजन की कमी है',
          feedback: 'सटीक निर्णय! निचले गड्ढों में भारी जहरीली गैसें बैठ जाती हैं और कुछ ही सेकंड में दम घोंट देती हैं।',
        },
        {
          id: 'gas-opt-2',
          text: 'ख. ताजी हवा का क्रॉसकट जहां हवा का प्रवाह चालू है',
          feedback: 'गलत! ताजी हवा का क्रॉसकट सुरक्षित क्षेत्र है।',
        },
        {
          id: 'gas-opt-3',
          text: 'ग. प्रकाशयुक्त मुख्य टिंबर हॉलेज ट्रैक',
          feedback: 'गलत! मुख्य हॉलेज ट्रैक पर उचित वेंटिलेशन मौजूद है।',
        },
      ],
      markers: [
        {
          id: 'm-gas-1',
          label: 'जहरीली गैस पॉकेट (H2S / CO)',
          description: 'निचले गड्ढे में हाइड्रोजन सल्फाइड का जमाव।',
          actionRequired: 'निषिद्ध क्षेत्र घोषित करें',
        },
        {
          id: 'm-gas-2',
          label: 'खतरा सीमा क्षेत्र',
          description: 'ऑक्सीजन का स्तर 16.4% दर्ज (गंभीर कमी)।',
        },
        {
          id: 'm-gas-3',
          label: 'अनिवार्य पीपीई चेकपॉइंट',
          description: 'पॉजिटिव प्रेशर मास्क और गैस मॉनिटर अनिवार्य।',
        },
        {
          id: 'm-gas-4',
          label: 'बडी सिस्टम स्टैंडबाय पोस्ट',
          description: 'सुरक्षा साथी सतह से जुड़े रेडियो ट्रांसमीटर के साथ।',
        },
      ],
    },
    sat: {
      title: 'ᱫᱟᱹᱭᱠᱟᱹ ᱑: ᱵᱤᱥ ᱜᱮᱥ ᱡᱟᱭᱜᱟ ᱪᱤᱱᱦᱟᱹᱣ',
      subtitle: 'ᱵᱤᱥ ᱜᱮᱥ ᱯᱚᱠᱮᱴ ᱪᱤᱱᱦᱟᱹᱣ',
      situation: 'ᱵᱟᱝ ᱦᱚᱭ ᱪᱟᱞᱟᱜ ᱠᱟᱱ ᱠᱷᱟᱫᱟᱱ ᱦᱮᱰᱤᱝ ᱗ ᱨᱮ ᱜᱮᱥ ᱢᱤᱴᱟᱨ ᱥᱟᱰᱮ ᱮᱦᱚᱵ ᱮᱱᱟ᱾',
      question: 'ᱚᱠᱟ ᱡᱟᱭᱜᱟ ᱨᱮ ᱡᱚᱛᱚ ᱠᱷᱚᱱ ᱰᱷᱮᱨ ᱵᱤᱯᱚᱫᱽ ᱢᱮᱱᱟᱜ-ᱟ?',
      options: [
        {
          id: 'gas-opt-1',
          text: 'A. ᱞᱟᱛᱟᱨ ᱜᱟᱰᱷᱟ ᱡᱟᱦᱟᱸ ᱨᱮ ᱵᱤᱥ ᱜᱮᱥ ᱟᱨ ᱚᱠᱥᱤᱡᱮᱱ ᱠᱚᱢ ᱢᱮᱱᱟᱜ-ᱟ',
          feedback: 'ᱴᱷᱤᱠ ᱜᱚᱴᱟ! ᱞᱟᱛᱟᱨ ᱜᱟᱰᱷᱟ ᱨᱮ ᱵᱤᱥ ᱜᱮᱥ ᱡᱟᱣᱨᱟᱜ-ᱟ ᱟᱨ ᱥᱟᱦᱮᱫ ᱵᱚᱸᱫᱽ-ᱟ᱾',
        },
        {
          id: 'gas-opt-2',
          text: 'B. ᱥᱟᱯᱷᱟ ᱦᱚᱭ ᱪᱟᱞᱟᱜ ᱦᱚᱨ',
          feedback: 'ᱵᱟᱹᱲᱤᱡ! ᱥᱟᱯᱷᱟ ᱦᱚᱭ ᱦᱚᱨ ᱫᱚ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱡᱟᱭᱜᱟ ᱠᱟᱱᱟ᱾',
        },
        {
          id: 'gas-opt-3',
          text: 'C. ᱢᱟᱨᱥᱟᱞ ᱢᱩᱬᱩᱛ ᱨᱮᱞ ᱦᱚᱨ',
          feedback: 'ᱵᱟᱹᱲᱤᱡ! ᱚᱸᱰᱮ ᱦᱚᱭ ᱪᱟᱞᱟᱜ ᱠᱟᱱᱟ᱾',
        },
      ],
      markers: [
        {
          id: 'm-gas-1',
          label: 'ᱵᱤᱥ ᱜᱮᱥ ᱡᱟᱣᱨᱟ (H2S / CO)',
          description: 'ᱞᱟᱛᱟᱨ ᱜᱟᱰᱷᱟ ᱨᱮ ᱵᱤᱥ ᱜᱮᱥ ᱡᱟᱣᱨᱟ ᱟᱠᱟᱱᱟ᱾',
          actionRequired: 'ᱵᱚᱞᱚᱱ ᱢᱟᱱᱟ ᱜᱮᱭᱟ',
        },
        {
          id: 'm-gas-2',
          label: 'ᱵᱤᱯᱚᱫᱽ ᱥᱤᱢᱟᱹ',
          description: 'ᱚᱠᱥᱤᱡᱮᱱ ᱑᱖.᱔% ᱠᱚᱢ ᱟᱠᱟᱱᱟ᱾',
        },
        {
          id: 'm-gas-3',
          label: 'PPE ᱦᱚᱨᱚᱜ ᱴᱷᱟᱶ',
          description: 'ᱥᱟᱦᱮᱫ ᱢᱟᱥᱠ ᱟᱨ ᱜᱮᱥ ᱢᱤᱴᱟᱨ ᱞᱟᱹᱠᱛᱤᱭᱟ᱾',
        },
        {
          id: 'm-gas-4',
          label: 'ᱜᱟᱛᱮ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱴᱷᱟᱶ',
          description: 'ᱨᱮᱰᱤᱭᱳ ᱥᱟᱶ ᱜᱟᱛᱮ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱛᱤᱸᱜᱩ ᱢᱮᱱᱟᱭᱟ᱾',
        },
      ],
    },
  },
  'gas-sc-2': {
    en: {
      title: 'Scenario 2: Compulsory PPE Gear Donning',
      subtitle: 'Select Required Gear for Toxic Zone Entry',
      situation: 'You are preparing for an inspection near an isolated gas accumulation seal.',
      question: 'Select all MANDATORY PPE items required before approaching the hazard perimeter:',
      options: [
        {
          id: 'ppe-helmet',
          text: 'Mining Hard Hat with Cap Lamp',
          feedback: 'Mandatory: Head protection from falling coal roof strata.',
        },
        {
          id: 'ppe-shoes',
          text: 'Steel-Toe Antistatic Safety Boots',
          feedback: 'Mandatory: Protects from puncture and prevents electrostatic spark ignition.',
        },
        {
          id: 'ppe-respirator',
          text: 'Full-Face Continuous Positive Air Respirator (SCBA)',
          feedback: 'Mandatory: Isolates lungs from lethal methane and hydrogen sulfide.',
        },
        {
          id: 'ppe-gloves',
          text: 'Heavy Chemical & Abrasion Resistant Gloves',
          feedback: 'Mandatory: Hand safety against abrasive minerals and acid water.',
        },
        {
          id: 'ppe-sandals',
          text: 'Rubber Sandals / Open Footwear',
          feedback: 'STRICTLY PROHIBITED in mining environments! Extreme crush and slipping hazard.',
        },
      ],
      markers: [
        {
          id: 'm-ppe-1',
          label: 'COMPREHENSIVE PPE SUITE',
          description: 'Hard hat, steel-toe boots, SCBA respirator, anti-static gloves.',
        },
      ],
    },
    hi: {
      title: 'परिदृश्य 2: अनिवार्य पीपीई सुरक्षा उपकरण पहनना',
      subtitle: 'जहरीले क्षेत्र में प्रवेश पूर्व आवश्यक उपकरण चयन',
      situation: 'आप अलग-थलग गैस संचय सील के पास निरीक्षण की तैयारी कर रहे हैं।',
      question: 'खतरे के दायरे में जाने से पहले सभी अनिवार्य पीपीई उपकरणों का चयन करें:',
      options: [
        {
          id: 'ppe-helmet',
          text: 'कैप लैंप सहित माइनिंग हार्ड हैट (हेलमेट)',
          feedback: 'अनिवार्य: कोयला छत गिरने से सिर की पूर्ण सुरक्षा।',
        },
        {
          id: 'ppe-shoes',
          text: 'स्टील-टो एंटीस्टेटिक सुरक्षा जूते',
          feedback: 'अनिवार्य: पैरों की सुरक्षा एवं चिंगारी से बचाव।',
        },
        {
          id: 'ppe-respirator',
          text: 'फुल-फेस पॉजिटिव प्रेशर श्वसन उपकरण (एससीबीए)',
          feedback: 'अनिवार्य: जहरीली मीथेन व एच2एस से फेफड़ों का पूर्ण बचाव।',
        },
        {
          id: 'ppe-gloves',
          text: 'रासायनिक एवं घर्षण प्रतिरोधी सुरक्षा दस्ताने',
          feedback: 'अनिवार्य: एसिड पानी एवं खनिजों से हाथों का बचाव।',
        },
        {
          id: 'ppe-sandals',
          text: 'रबर चप्पल / खुले जूते',
          feedback: 'खदान में पूर्णतः निषिद्ध! फिसलने व चोट का भारी खतरा।',
        },
      ],
      markers: [
        {
          id: 'm-ppe-1',
          label: 'संपूर्ण पीपीई सूट',
          description: 'हेलमेट, स्टील-टो जूते, एससीबीए मास्क, दस्ताने।',
        },
      ],
    },
    sat: {
      title: 'ᱫᱟᱹᱭᱠᱟᱹ ᱒: ᱞᱟᱹᱠᱛᱤᱭᱟᱱ PPE ᱥᱟᱢᱟᱱ ᱦᱚᱨᱚᱜ',
      subtitle: 'ᱵᱤᱥ ᱡᱟᱭᱜᱟ ᱵᱚᱞᱚᱱ ᱞᱟᱹᱜᱤᱫ ᱥᱟᱢᱟᱱ ᱵᱟᱪᱷᱟᱣ',
      situation: 'ᱟᱢ ᱵᱤᱥ ᱜᱮᱥ ᱡᱟᱭᱜᱟ ᱨᱮ ᱵᱤᱰᱟᱹᱣ ᱞᱟᱹᱜᱤᱫ ᱥᱟᱯᱲᱟᱣᱜ ᱠᱟᱱᱟᱢ᱾',
      question: 'ᱵᱤᱯᱚᱫᱽ ᱡᱟᱭᱜᱟ ᱵᱚᱞᱚᱱ ᱢᱟᱬᱟᱝ ᱨᱮ ᱞᱟᱹᱠᱛᱤᱭᱟᱱ PPE ᱥᱟᱢᱟᱱ ᱵᱟᱪᱷᱟᱣ ᱢᱮ:',
      options: [
        {
          id: 'ppe-helmet',
          text: 'ᱴᱚᱨᱪ ᱞᱟᱜᱟᱣ ᱦᱟᱨᱰ ᱦᱮᱞᱢᱮᱴ',
          feedback: 'ᱞᱟᱹᱠᱛᱤᱭᱟ: ᱪᱮᱛᱟᱱ ᱠᱷᱚᱱ ᱫᱷᱤᱨᱤ-ᱠᱩᱭᱞᱟᱹ ᱧᱩᱨᱩᱜ ᱠᱷᱚᱱ ᱵᱚᱦᱚᱜ ᱨᱩᱠᱷᱤᱭᱟᱹ᱾',
        },
        {
          id: 'ppe-shoes',
          text: 'ᱢᱮᱬᱦᱮᱫ ᱴᱳ ᱥᱩᱨᱚᱠᱷᱭᱟ ᱡᱩᱛᱟᱹ',
          feedback: 'ᱞᱟᱹᱠᱛᱤᱭᱟ: ᱡᱟᱸᱜᱟ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱟᱨ ᱥᱯᱟᱨᱠ ᱵᱟᱝ ᱦᱩᱭᱩᱜ-ᱟ᱾',
        },
        {
          id: 'ppe-respirator',
          text: 'ᱥᱟᱦᱮᱫ ᱦᱟᱛᱟᱣ ᱢᱟᱥᱠ (SCBA)',
          feedback: 'ᱞᱟᱹᱠᱛᱤᱭᱟ: ᱵᱤᱥ ᱜᱮᱥ ᱠᱷᱚᱱ ᱥᱟᱦᱮᱫ ᱨᱩᱠᱷᱤᱭᱟᱹ᱾',
        },
        {
          id: 'ppe-gloves',
          text: 'ᱠᱮᱴᱮᱡ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱜᱞᱚᱵᱷᱥ',
          feedback: 'ᱞᱟᱹᱠᱛᱤᱭᱟ: ᱛᱤ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱫᱚᱦᱚᱭ ᱢᱮ᱾',
        },
        {
          id: 'ppe-sandals',
          text: 'ᱪᱚᱯᱚᱞ / ᱡᱷᱤᱡ ᱡᱩᱛᱟᱹ',
          feedback: 'ᱠᱷᱟᱫᱟᱱ ᱨᱮ ᱪᱚᱯᱚᱞ ᱦᱚᱨᱚᱜ ᱢᱟᱱᱟ ᱜᱮᱭᱟ! ᱵᱤᱯᱚᱫᱽ ᱦᱩᱭ ᱫᱟᱲᱮᱭᱟᱜ-ᱟ᱾',
        },
      ],
      markers: [
        {
          id: 'm-ppe-1',
          label: 'ᱡᱚᱛᱚ PPE ᱥᱟᱢᱟᱱ',
          description: 'ᱦᱮᱞᱢᱮᱴ, ᱡᱩᱛᱟᱹ, ᱢᱟᱥᱠ ᱟᱨ ᱜᱞᱚᱵᱷᱥ᱾',
        },
      ],
    },
  },
  'gas-sc-3': {
    en: {
      title: 'Scenario 3: Confined Space Protocol & Buddy System',
      subtitle: 'Pre-Entry Authorization in Underground Pits',
      situation: 'You must access a narrow 1.2-meter pump maintenance sump behind a ventilation curtain.',
      question: 'Under DGMS vocational safety guidelines, what must be in place before descending?',
      options: [
        {
          id: 'b-opt-1',
          text: 'A designated second miner outside with a lifeline harness and atmospheric radio link',
          feedback: 'Correct Decision! The buddy system ensures instant extraction and dispatch alert if toxic gases accumulate.',
        },
        {
          id: 'b-opt-2',
          text: 'Enter quickly without telling anyone to finish the task faster',
          feedback: 'Fatal error! Over 60% of confined space fatalities occur when workers enter unaccompanied without safety standby.',
        },
        {
          id: 'b-opt-3',
          text: 'Leave a wrench on the floor to signal your location',
          feedback: 'Incorrect! Physical tools provide zero life-safety communication during gas loss-of-consciousness.',
        },
      ],
      markers: [
        {
          id: 'm-buddy-1',
          label: 'TRAINED BUDDY SPOTTER',
          description: 'Secondary miner outside pit holding safety lifeline and atmospheric radio.',
        },
        {
          id: 'm-buddy-2',
          label: 'CONFINED CAVITY',
          description: 'Low-oxygen depression with zero natural air movement.',
        },
      ],
    },
    hi: {
      title: 'परिदृश्य 3: संकीर्ण स्थान एवं बडी सिस्टम प्रोटोकॉल',
      subtitle: 'भूमिगत गड्ढों में प्रवेश पूर्व वैधानिक अनुमति',
      situation: 'वेंटिलेशन पर्दे के पीछे 1.2 मीटर संकीर्ण नाले में पंप मरम्मत हेतु प्रवेश करना है।',
      question: 'डीजीएमएस सुरक्षा दिशानिर्देशों के अनुसार, गड्ढे में उतरने से पूर्व क्या अनिवार्य है?',
      options: [
        {
          id: 'b-opt-1',
          text: 'क. बाहर लाइफलाइन एवं रेडियो सहित तैनात प्रशिक्षित सुरक्षा साथी (बडी)',
          feedback: 'सटीक निर्णय! बडी सिस्टम यह सुनिश्चित करता है कि गैस का रिसाव होने पर तुरंत बाहर खींचा जा सके।',
        },
        {
          id: 'b-opt-2',
          text: 'ख. बिना किसी को बताए तेजी से काम पूरा करने चले जाएं',
          feedback: 'घातक गलती! अकेले संकीर्ण स्थान में प्रवेश करने पर 60% से अधिक मौतें बेहोशी के कारण होती हैं।',
        },
        {
          id: 'b-opt-3',
          text: 'ग. जमीन पर रिंच या औजार छोड़कर अंदर चले जाएं',
          feedback: 'गलत! औजार बेहोशी की स्थिति में कोई जीवन रक्षा या संचार प्रदान नहीं करते।',
        },
      ],
      markers: [
        {
          id: 'm-buddy-1',
          label: 'प्रशिक्षित बडी (सुरक्षा साथी)',
          description: 'बाहर लाइफलाइन पकड़े रेडियो से जुड़ा दूसरा कामगार।',
        },
        {
          id: 'm-buddy-2',
          label: 'संकीर्ण गुहा (गड्ढा)',
          description: 'कम ऑक्सीजन वाला गड्ढा जहां हवा का प्राकृतिक बहाव शून्य है।',
        },
      ],
    },
    sat: {
      title: 'ᱫᱟᱹᱭᱠᱟᱹ ᱓: ᱦᱩᱰᱤᱧ ᱡᱟᱭᱜᱟ ᱟᱨ ᱜᱟᱛᱮ (Buddy) ᱱᱤᱭᱚᱢ',
      subtitle: 'ᱠᱷᱟᱫᱟᱱ ᱜᱟᱰᱷᱟ ᱵᱚᱞᱚᱱ ᱢᱟᱬᱟᱝ ᱱᱤᱭᱚᱢ',
      situation: 'ᱟᱢ ᱑.᱒ ᱢᱤᱴᱟᱨ ᱦᱩᱰᱤᱧ ᱯᱟᱢᱯ ᱜᱟᱰᱷᱟ ᱨᱮ ᱠᱟᱹᱢᱤ ᱞᱟᱹᱜᱤᱫ ᱵᱚᱞᱚᱱ ᱞᱟᱹᱠᱛᱤ ᱠᱟᱱᱟ᱾',
      question: 'DGMS ᱱᱤᱭᱚᱢ ᱞᱮᱠᱟᱛᱮ ᱜᱟᱰᱷᱟ ᱵᱚᱞᱚᱱ ᱢᱟᱬᱟᱝ ᱪᱮᱫ ᱛᱟᱦᱮᱸᱱ ᱞᱟᱹᱠᱛᱤᱭᱟ?',
      options: [
        {
          id: 'b-opt-1',
          text: 'A. ᱵᱟᱦᱨᱮ ᱨᱮ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱫᱟᱣᱲᱟ ᱟᱨ ᱨᱮᱰᱤᱭᱳ ᱥᱟᱶ ᱜᱟᱛᱮ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱛᱤᱸᱜᱩ ᱛᱟᱦᱮᱸᱱ',
          feedback: 'ᱴᱷᱤᱠ ᱜᱚᱴᱟ! ᱵᱟᱦᱨᱮ ᱨᱮ ᱜᱟᱛᱮ ᱛᱟᱦᱮᱸᱱ ᱠᱷᱟᱱ ᱵᱤᱯᱚᱫᱽ ᱨᱮ ᱞᱚᱜᱚᱱ ᱚᱰᱚᱠ ᱜᱟᱱᱚᱜ-ᱟ᱾',
        },
        {
          id: 'b-opt-2',
          text: 'B. ᱚᱠᱚᱭ ᱦᱚᱸ ᱵᱟᱝ ᱞᱟᱹᱭ ᱠᱟᱛᱮ ᱮᱠᱞᱟ ᱵᱚᱞᱚᱱ ᱢᱮ',
          feedback: 'ᱵᱤᱯᱚᱫᱽ ᱜᱮᱭᱟ! ᱮᱠᱞᱟ ᱵᱚᱞᱚᱱ ᱠᱷᱟᱱ ᱵᱤᱥ ᱜᱮᱥ ᱛᱮ ᱡᱤᱣᱤ ᱪᱟᱞᱟᱜ-ᱟ᱾',
        },
        {
          id: 'b-opt-3',
          text: 'C. ᱞᱟᱛᱟᱨ ᱨᱮ ᱨᱮᱸᱪ (Wrench) ᱵᱟᱹᱜᱤ ᱠᱟᱛᱮ ᱵᱚᱞᱚᱱ ᱢᱮ',
          feedback: 'ᱵᱟᱹᱲᱤᱡ! ᱥᱟᱢᱟᱱ ᱫᱚ ᱵᱤᱯᱚᱫᱽ ᱨᱮ ᱡᱤᱣᱤ ᱵᱟᱭ ᱵᱟᱧᱪᱟᱣ ᱫᱟᱲᱮᱭᱟᱜ-ᱟ᱾',
        },
      ],
      markers: [
        {
          id: 'm-buddy-1',
          label: 'ᱜᱟᱛᱮ ᱠᱟᱹᱢᱤᱭᱟᱹ (Buddy)',
          description: 'ᱵᱟᱦᱨᱮ ᱨᱮ ᱫᱟᱣᱲᱟ ᱟᱨ ᱨᱮᱰᱤᱭᱳ ᱥᱟᱶ ᱛᱤᱸᱜᱩ ᱠᱟᱹᱢᱤᱭᱟᱹ᱾',
        },
        {
          id: 'm-buddy-2',
          label: 'ᱦᱩᱰᱤᱧ ᱜᱟᱰᱷᱟ',
          description: 'ᱚᱠᱥᱤᱡᱮᱱ ᱠᱚᱢ ᱡᱟᱭᱜᱟ ᱡᱟᱦᱟᱸ ᱨᱮ ᱦᱚᱭ ᱵᱟᱭ ᱪᱟᱞᱟᱜ ᱠᱟᱱᱟ᱾',
        },
      ],
    },
  },
};

const ASSESSMENT_TRANSLATIONS: Record<
  string,
  Partial<
    Record<
      Language,
      {
        category: string;
        question: string;
        options: string[];
        explanation: string;
      }
    >
  >
> = {
  'fire-q1': {
    en: {
      category: 'Fire Response',
      question: 'In an underground coal mine, what is the mandatory immediate action upon identifying an uncontained conveyor fire?',
      options: [
        'Raise the audible mine-wide evacuation alarm and isolate electrical power',
        'Attempt to extinguish 50-meter blaze alone with a small handheld dry powder can',
        'Retreat to an unventilated dead-end tunnel and await next shift change',
        'Wait for the shift engineer to certify the flame height',
      ],
      explanation: 'Raising the audible alarm ensures all underground teams don their self-rescuers and begin evacuation before airways become contaminated.',
    },
    hi: {
      category: 'अग्नि प्रतिक्रिया',
      question: 'भूमिगत कोयला खदान में कन्वेयर बेल्ट पर अनियंत्रित आग दिखने पर सबसे पहला अनिवार्य कदम क्या है?',
      options: [
        'खदान-व्यापी आपातकालीन सायरन बजाएं और विद्युत आपूर्ति तुरंत काटें',
        'अकेले छोटे अग्निशामक से 50 मीटर लंबी आग बुझाने का प्रयास करें',
        'असुरक्षित बंद सुरंग में जाकर अगली पाली का इंतजार करें',
        'इंजीनियर द्वारा लपटों की ऊंचाई जांचने की प्रतीक्षा करें',
      ],
      explanation: 'सायरन बजाने से सभी कामगार समय रहते सेल्फ-रेस्क्यूअर पहनकर ताजी हवा निकास मार्ग की ओर बढ़ सकते हैं।',
    },
    sat: {
      category: 'ᱥᱮᱸᱜᱮᱞ ᱠᱟᱹᱢᱤ',
      question: 'ᱠᱩᱭᱞᱟᱹ ᱠᱷᱟᱫᱟᱱ ᱨᱮ ᱥᱮᱸᱜᱮᱞ ᱧᱮᱞ ᱞᱮᱱᱠᱷᱟᱱ ᱡᱚᱛᱚ ᱠᱷᱚᱱ ᱯᱩᱭᱞᱩ ᱪᱮᱫ ᱠᱟᱹᱢᱤ ᱦᱩᱭᱩᱜ-ᱟ?',
      options: [
        'ᱠᱷᱟᱫᱟᱱ ᱥᱟᱭᱨᱚᱱ ᱵᱟᱡᱟᱣ ᱢᱮ ᱟᱨ ᱞᱟᱭᱤᱴ/ᱵᱤᱡᱽᱞᱤ ᱵᱚᱸᱫᱽ ᱢᱮ',
        'ᱮᱠᱞᱟ ᱜᱮ ᱢᱟᱨᱟᱝ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱨᱮᱱᱟᱜ ᱪᱮᱥᱴᱟᱭ ᱢᱮ',
        'ᱧᱩᱛ ᱠᱷᱟᱫᱟᱱ ᱠᱳᱬ ᱨᱮ ᱩᱠᱩ ᱠᱟᱛᱮ ᱛᱟᱺᱜᱤ ᱢᱮ',
        'ᱢᱮᱱᱮᱡᱚᱨ ᱦᱤᱡᱩᱜ ᱦᱟᱹᱵᱤᱡ ᱛᱤᱸᱜᱩ ᱠᱚᱜ ᱢᱮ',
      ],
      explanation: 'ᱥᱟᱭᱨᱚᱱ ᱵᱟᱡᱟᱣ ᱞᱮᱠᱷᱟᱱ ᱡᱚᱛᱚ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱚᱠᱥᱤᱡᱮᱱ ᱢᱟᱥᱠ ᱦᱚᱨᱚᱜ ᱠᱟᱛᱮ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱦᱚᱨ ᱛᱮᱠᱚ ᱚᱰᱚᱠ ᱫᱟᱲᱮᱭᱟᱜ-ᱟ᱾',
    },
  },
  'fire-q2': {
    en: {
      category: 'PPE Selection',
      question: 'Which portable breathing apparatus must an underground miner immediately don during smoke inundation?',
      options: [
        'Simple surgical paper mask',
        'Self-Contained Self-Rescuer (SCSR) oxygen unit',
        'Welding shield respirator',
        'Standard cloth handkerchief dipped in water',
      ],
      explanation: 'A Self-Contained Self-Rescuer (SCSR) provides chemical oxygen in a closed loop, essential when ambient air has zero oxygen or high CO.',
    },
    hi: {
      category: 'पीपीई उपकरण',
      question: 'धुआं भरने की स्थिति में भूमिगत खनिक को तुरंत कौन सा श्वसन सुरक्षा उपकरण पहनना चाहिए?',
      options: [
        'साधारण सर्जिकल पेपर मास्क',
        'सेल्फ-कंटेन्ड सेल्फ-रेस्क्यूअर (SCSR) ऑक्सीजन उपकरण',
        'वेल्डिंग शील्ड रेस्पिरेटर',
        'पानी में भीगा हुआ सूती रुमाल',
      ],
      explanation: 'एससीएसआर उपकरण बंद चक्र में रासायनिक ऑक्सीजन प्रदान करता है, जो जहरीली गैस और ऑक्सीजन की कमी में जीवन रक्षक है।',
    },
    sat: {
      category: 'PPE ᱥᱟᱢᱟᱱ',
      question: 'ᱠᱷᱟᱫᱟᱱ ᱨᱮ ᱫᱷᱩᱶᱟᱹ ᱵᱚᱞᱚᱱ ᱚᱠᱛᱚ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱫᱚ ᱪᱮᱫ ᱥᱟᱦᱮᱫ ᱥᱟᱢᱟᱱ ᱦᱚᱨᱚᱜ ᱞᱟᱹᱠᱛᱤᱭᱟ?',
      options: [
        'ᱠᱟᱜᱚᱡᱽ ᱢᱟᱥᱠ',
        'SCSR ᱚᱠᱥᱤᱡᱮᱱ ᱥᱮᱞᱯᱷ-ᱨᱮᱥᱠᱤᱭᱩᱣᱟᱨ',
        'ᱣᱮᱞᱰᱤᱝ ᱢᱟᱥᱠ',
        'ᱫᱟᱜ ᱨᱮ ᱞᱚᱦᱚᱫ ᱟᱠᱟᱱ ᱜᱟᱢᱪᱷᱟ',
      ],
      explanation: 'SCSR ᱫᱚ ᱵᱤᱥ ᱦᱚᱭ ᱨᱮᱦᱚᱸ ᱯᱩᱨᱟᱹ ᱚᱠᱥᱤᱡᱮᱱ ᱮᱢᱚᱜ-ᱟ ᱟᱨ ᱡᱤᱣᱤ ᱵᱟᱧᱪᱟᱣ-ᱟ᱾',
    },
  },
  'fire-q3': {
    en: {
      category: 'Hazard Recognition',
      question: 'Why is an ABC Dry Chemical Powder extinguisher strictly preferred over water for coal feeder fires with active cables?',
      options: [
        'It smells pleasant in confined mines',
        'It is lighter to carry than water bottles',
        'It does not conduct electricity and smothers coal dust flames',
        'It cools the ambient rock temperature permanently',
      ],
      explanation: 'ABC dry powder is electrically non-conductive, protecting the user from 440V/1100V lethal electrocution while stopping flash-fires.',
    },
    hi: {
      category: 'खतरा पहचान',
      question: 'सक्रिय विद्युत केबलों वाले कोयला फीडर की आग पर पानी के बजाय एबीसी ड्राई पाउडर क्यों अनिवार्य है?',
      options: [
        'यह खदान में अच्छी सुगंध देता है',
        'यह पानी से हल्का होता है',
        'यह विद्युत का कुचालक है और कोयला धूल की आग को तुरंत दबाता है',
        'यह चट्टानों का तापमान हमेशा के लिए ठंडा कर देता है',
      ],
      explanation: 'एबीसी ड्राई पाउडर विद्युत कुचालक होता है, जिससे 440V/1100V करंट का झटका नहीं लगता और आग बुझती है।',
    },
    sat: {
      category: 'ᱵᱤᱯᱚᱫᱽ ᱪᱤᱱᱦᱟᱹᱣ',
      question: 'ᱵᱤᱡᱽᱞᱤ ᱛᱟᱨ ᱟᱨ ᱠᱩᱭᱞᱟᱹ ᱥᱮᱸᱜᱮᱞ ᱨᱮ ᱫᱟᱜ ᱵᱟᱝ ᱫᱩᱞ ᱠᱟᱛᱮ ABC ᱯᱟᱣᱰᱟᱨ ᱪᱮᱫᱟᱜ ᱵᱮᱵᱷᱟᱨᱚᱜ-ᱟ?',
      options: [
        'ᱱᱚᱶᱟ ᱫᱚ ᱥᱚᱲᱚᱢ ᱥᱚ-ᱟ',
        'ᱱᱚᱶᱟ ᱫᱚ ᱨᱟᱣᱟᱞ ᱜᱮᱭᱟ',
        'ᱱᱚᱶᱟ ᱨᱮ ᱵᱤᱡᱽᱞᱤ ᱠᱟᱨᱮᱱᱴ ᱵᱟᱭ ᱞᱟᱜᱟᱣᱜ-ᱟ ᱟᱨ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡᱚᱜ-ᱟ',
        'ᱱᱚᱶᱟ ᱫᱚ ᱫᱷᱤᱨᱤ ᱨᱮᱭᱟᱲ ᱜᱮ ᱫᱚᱦᱚᱭᱟ',
      ],
      explanation: 'ABC ᱯᱟᱣᱰᱟᱨ ᱨᱮ ᱠᱟᱨᱮᱱᱴ ᱵᱟᱭ ᱞᱟᱜᱟᱣᱜ-ᱟ ᱟᱨ ᱡᱤᱣᱤ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱛᱟᱦᱮᱸᱱᱟ᱾',
    },
  },
  'fire-q4': {
    en: {
      category: 'Emergency Evacuation',
      question: 'When evacuating an underground mine gallery filled with smoke, which direction should miners navigate?',
      options: [
        'Toward the return airway where exhaust fans pull air',
        'Toward the intake airway along life-lines toward fresh air',
        'Into deep abandoned workings to wait for rescue teams',
        'Underneath heavy dumpers and conveyor hoppers',
      ],
      explanation: 'Miners follow marked reflective life-lines against ventilation flow into positive fresh-air intake escapeways.',
    },
    hi: {
      category: 'आपातकालीन निकासी',
      question: 'धुएं से भरी भूमिगत खदान गैलरी से बाहर निकलते समय खनिकों को किस दिशा में बढ़ना चाहिए?',
      options: [
        'रिटर्न एयरवे की ओर जहां पंखे जहरीली हवा खींचते हैं',
        'लाइफ-लाइन के सहारे ताजी हवा इनटेक एयरवे की दिशा में',
        'गहरी पुरानी बंद खदानों में जाकर बचाव दल की प्रतीक्षा करें',
        'भारी डंपर या कन्वेयर हॉपर के नीचे छिप जाएं',
      ],
      explanation: 'खनिकों को गाइड लाइफ-लाइन पकड़कर ताजी हवा आपूर्ति मार्ग (इंटेक एस्केपवे) की ओर बढ़ना चाहिए।',
    },
    sat: {
      category: 'ᱚᱰᱚᱠ ᱦᱚᱨ',
      question: 'ᱫᱷᱩᱶᱟᱹ ᱯᱮᱨᱮᱡ ᱠᱷᱟᱫᱟᱱ ᱠᱷᱚᱱ ᱚᱰᱚᱠᱚᱜ ᱚᱠᱛᱚ ᱚᱠᱟ ᱥᱮᱫ ᱪᱟᱞᱟᱜ ᱞᱟᱹᱠᱛᱤᱭᱟ?',
      options: [
        'ᱵᱤᱥ ᱦᱚᱭ ᱚᱰᱚᱠᱚᱜ ᱯᱷᱮᱱ ᱥᱮᱫ',
        'ᱞᱟᱭᱤᱯᱷ-ᱞᱟᱭᱤᱱ ᱫᱟᱣᱲᱟ ᱥᱟᱵ ᱠᱟᱛᱮ ᱥᱟᱯᱷᱟ ᱦᱚᱭ ᱦᱤᱡᱩᱜ ᱥᱮᱫ',
        'ᱵᱟᱹᱜᱤ ᱟᱠᱟᱱ ᱢᱟᱨᱮ ᱠᱷᱟᱫᱟᱱ ᱠᱷᱚᱸᱫᱚᱠ ᱥᱮᱫ',
        'ᱢᱟᱨᱟᱝ ᱜᱟᱹᱰᱤ ᱞᱟᱛᱟᱨ ᱨᱮ',
      ],
      explanation: 'ᱞᱟᱭᱤᱯᱷ-ᱞᱟᱭᱤᱱ ᱫᱟᱣᱲᱟ ᱥᱟᱵ ᱠᱟᱛᱮ ᱥᱟᱯᱷᱟ ᱦᱚᱭ ᱦᱤᱡᱩᱜ ᱫᱩᱣᱟᱹᱨ ᱥᱮᱫ ᱜᱮ ᱪᱟᱞᱟᱜ ᱞᱟᱹᱠᱛᱤᱭᱟ᱾',
    },
  },
  'fire-q5': {
    en: {
      category: 'Hazard Recognition',
      question: 'What is the dangerous threshold concentration of Carbon Monoxide (CO) in an underground coal mine that demands immediate evacuation?',
      options: [
        'Above 50 PPM (0.005%)',
        'Above 5000 PPM only',
        'Only when visibility drops below 2 meters',
        'Only when temperature exceeds 70 degrees Celsius',
      ],
      explanation: 'DGMS regulations set statutory alert limits at 50 PPM CO, as carbon monoxide binds with hemoglobin 200 times faster than oxygen.',
    },
    hi: {
      category: 'खतरा पहचान',
      question: 'भूमिगत कोयला खदान में कार्बन मोनोऑक्साइड (CO) का वह खतरनाक स्तर क्या है जिस पर तत्काल खदान खाली करने का नियम है?',
      options: [
        '50 पीपीएम (0.005%) से अधिक',
        'केवल 5000 पीपीएम से अधिक होने पर',
        'केवल तभी जब दृश्यता 2 मीटर से कम हो',
        'केवल तभी जब तापमान 70 डिग्री से अधिक हो',
      ],
      explanation: 'डीजीएमएस विनियमों के अनुसार 50 PPM CO चेतावनी सीमा है, क्योंकि यह ऑक्सीजन की तुलना में रक्त में 200 गुना तेजी से घुलती है।',
    },
    sat: {
      category: 'ᱵᱤᱯᱚᱫᱽ ᱪᱤᱱᱦᱟᱹᱣ',
      question: 'ᱠᱩᱭᱞᱟᱹ ᱠᱷᱟᱫᱟᱱ ᱨᱮ ᱠᱟᱨᱵᱚᱱ ᱢᱚᱱᱳᱠᱥᱟᱭᱤᱰ (CO) ᱛᱤᱱᱟᱹᱜ ᱵᱟᱹᱲᱛᱤ ᱞᱮᱱᱠᱷᱟᱱ ᱞᱚᱜᱚᱱ ᱚᱰᱚᱠᱚᱜ ᱦᱩᱭᱩᱜ-ᱟ?',
      options: [
        '50 PPM (0.005%) ᱠᱷᱚᱱ ᱵᱟᱹᱲᱛᱤ',
        '5000 PPM ᱠᱷᱚᱱ ᱵᱟᱹᱲᱛᱤ',
        '2 ᱢᱤᱴᱟᱨ ᱵᱟᱝ ᱧᱮᱞᱚᱜ ᱚᱠᱛᱚ',
        'ᱞᱚᱞᱚ 70 ᱰᱤᱜᱽᱨᱤ ᱯᱟᱨᱚᱢ ᱞᱮᱱᱠᱷᱟᱱ',
      ],
      explanation: 'DGMS ᱱᱤᱭᱚᱢ ᱞᱮᱠᱟᱛᱮ 50 PPM ᱜᱮ ᱵᱤᱯᱚᱫᱽ ᱥᱤᱢᱟᱹ ᱠᱟᱱᱟ, ᱱᱚᱶᱟ ᱦᱚᱭ ᱫᱚ ᱢᱟᱭᱟᱢ ᱨᱮ ᱞᱚᱜᱚᱱ ᱢᱮᱥᱟᱜ-ᱟ᱾',
    },
  },
  'gas-q1': {
    en: {
      category: 'Hazard Recognition',
      question: 'What is the explosive range of Methane (CH4) when mixed with air in an underground coal mine?',
      options: ['1% to 3%', '5% to 15%', '25% to 40%', 'Methane is never explosive in air'],
      explanation: 'Methane forms a violently explosive mixture ("Firedamp") between 5% (Lower Explosive Limit) and 15% (Upper Explosive Limit).',
    },
    hi: {
      category: 'खतरा पहचान',
      question: 'भूमिगत कोयला खदान में हवा के साथ मीथेन (CH4) का विस्फोटक मिश्रण प्रतिशत क्या होता है?',
      options: ['1% से 3%', '5% से 15%', '25% से 40%', 'मीथेन हवा में कभी नहीं फटती'],
      explanation: 'मीथेन हवा के साथ 5% से 15% की सांद्रता में अत्यंत घातक विस्फोटक मिश्रण (फायरडैम्प) बनाती है।',
    },
    sat: {
      category: 'ᱵᱤᱯᱚᱫᱽ ᱪᱤᱱᱦᱟᱹᱣ',
      question: 'ᱠᱷᱟᱫᱟᱱ ᱦᱚᱭ ᱨᱮ ᱢᱤᱛᱷᱮᱱ (CH4) ᱛᱤᱱᱟᱹᱜ % ᱛᱟᱦᱮᱸ ᱞᱮᱱᱠᱷᱟᱱ ᱵᱤᱥᱯᱷᱳᱴ (ᱯᱷᱟᱴᱟᱣ) ᱦᱩᱭᱩᱜ-ᱟ?',
      options: ['1% ᱠᱷᱚᱱ 3%', '5% ᱠᱷᱚᱱ 15%', '25% ᱠᱷᱚᱱ 40%', 'ᱢᱤᱛᱷᱮᱱ ᱛᱤᱥ ᱦᱚᱸ ᱵᱟᱭ ᱯᱷᱟᱴᱟᱜ-ᱟ'],
      explanation: '5% ᱠᱷᱚᱱ 15% ᱢᱤᱛᱷᱮᱱ ᱦᱚᱭ ᱨᱮ ᱢᱮᱥᱟ ᱞᱮᱱᱠᱷᱟᱱ ᱟᱹᱰᱤ ᱢᱟᱨᱟᱝ ᱵᱤᱥᱯᱷᱳᱴ ᱦᱩᱭ ᱫᱟᱲᱮᱭᱟᱜ-ᱟ᱾',
    },
  },
  'gas-q2': {
    en: {
      category: 'PPE Selection',
      question: 'Why are anti-static safety shoes mandatory in mines with methane risk?',
      options: [
        'To prevent static friction sparks that could ignite gas',
        'To make walking on wet mud smoother',
        'To keep the feet warm during winter shifts',
        'To absorb vibration from heavy dumpers',
      ],
      explanation: 'Standard footwear can build up static charge; anti-static soles safely dissipate electricity into the ground without sparking.',
    },
    hi: {
      category: 'पीपीई उपकरण',
      question: 'मीथेन जोखिम वाली खदानों में एंटी-स्टैटिक सुरक्षा जूते पहनना क्यों अनिवार्य है?',
      options: [
        'स्थिर घर्षण चिंगारी को रोकने हेतु जो गैस विस्फोट कर सकती है',
        'गीले कीचड़ में चलना आसान बनाने हेतु',
        'सर्दियों में पैरों को गर्म रखने हेतु',
        'भारी डंपर के कंपन को सोखने हेतु',
      ],
      explanation: 'सामान्य जूते स्थिर विद्युत आवेश बना सकते हैं; एंटी-स्टैटिक तलवे बिना चिंगारी पैदा किए बिजली को जमीन में सुरक्षित विसर्जित करते हैं।',
    },
    sat: {
      category: 'PPE ᱥᱟᱢᱟᱱ',
      question: 'ᱢᱤᱛᱷᱮᱱ ᱠᱷᱟᱫᱟᱱ ᱨᱮ ᱮᱱᱴᱤ-ᱥᱴᱮᱴᱤᱠ ᱥᱩᱨᱚᱠᱷᱭᱟ ᱡᱩᱛᱟᱹ ᱦᱚᱨᱚᱜ ᱪᱮᱫᱟᱜ ᱞᱟᱹᱠᱛᱤᱭᱟ?',
      options: [
        'ᱨᱚᱜᱚᱲ ᱠᱷᱚᱱ ᱪᱤᱱᱜᱟᱹᱨᱤ (ᱥᱮᱸᱜᱮᱞ) ᱟᱞᱚ ᱚᱰᱚᱠᱚᱜ ᱢᱟ ᱢᱮᱱᱛᱮ',
        'ᱞᱚᱥᱚᱫ ᱨᱮ ᱛᱟᱲᱟᱢ ᱞᱟᱹᱜᱤᱫ',
        'ᱨᱟᱵᱟᱝ ᱫᱤᱱ ᱡᱟᱸᱜᱟ ᱞᱚᱞᱚ ᱫᱚᱦᱚᱭ ᱞᱟᱹᱜᱤᱫ',
        'ᱜᱟᱹᱰᱤ ᱦᱤᱞᱟᱹᱣ ᱠᱷᱚᱱ ᱵᱟᱧᱪᱟᱣ ᱞᱟᱹᱜᱤᱫ',
      ],
      explanation: 'ᱮᱱᱴᱤ-ᱥᱴᱮᱴᱤᱠ ᱡᱩᱛᱟᱹ ᱫᱚ ᱪᱤᱱᱜᱟᱹᱨᱤ ᱵᱟᱭ ᱚᱰᱚᱠ ᱚᱪᱚᱭᱟ ᱟᱨ ᱜᱮᱥ ᱯᱷᱟᱴᱟᱣ ᱠᱷᱚᱱ ᱮ ᱨᱩᱠᱷᱤᱭᱟᱹᱭᱟ᱾',
    },
  },
  'gas-q3': {
    en: {
      category: 'Emergency Evacuation',
      question: 'What is the primary role of the Standby Buddy in confined space operations?',
      options: [
        'To enter the confined space simultaneously to share the workload',
        'To remain stationed outside, maintain visual/voice contact, and summon rescue if needed',
        'To leave the site to fetch spare tools',
        'To turn off the lighting to conserve battery power',
      ],
      explanation: 'The Standby Buddy stays outside the hazard zone at all times, monitoring the worker and operating retrieval equipment if an emergency occurs.',
    },
    hi: {
      category: 'आपातकालीन निकासी',
      question: 'संकीर्ण स्थानों में कार्य करते समय स्टैंडबाय बडी (साथी कामगार) की प्राथमिक भूमिका क्या है?',
      options: [
        'काम बांटने हेतु एक साथ संकीर्ण जगह में प्रवेश करना',
        'हमेशा बाहर तैनात रहना, लगातार संपर्क बनाए रखना और आपातकाल में बचाव दल को बुलाना',
        'अतिरिक्त औजार लाने हेतु कार्यस्थल छोड़कर चले जाना',
        'बैटरी बचाने हेतु बत्ती बंद कर देना',
      ],
      explanation: 'स्टैंडबाय साथी हर समय खतरे के क्षेत्र से बाहर रहता है और आपात स्थिति में कामगार को बाहर निकालने का दायित्व निभाता है।',
    },
    sat: {
      category: 'ᱚᱰᱚᱠ ᱦᱚᱨ',
      question: 'ᱦᱩᱰᱤᱧ ᱡᱟᱭᱜᱟ ᱨᱮ ᱠᱟᱹᱢᱤ ᱚᱠᱛᱚ ᱵᱟᱦᱨᱮ ᱨᱮ ᱛᱤᱸᱜᱩ ᱜᱟᱛᱮ (Buddy) ᱭᱟᱜ ᱢᱩᱬ ᱠᱟᱹᱢᱤ ᱪᱮᱫ?',
      options: [
        'ᱵᱟᱱᱟ ᱦᱚᱲ ᱢᱤᱫ ᱥᱟᱶᱛᱮ ᱵᱷᱤᱛᱨᱤ ᱵᱚᱞᱚᱱ',
        'ᱵᱟᱦᱨᱮ ᱨᱮ ᱛᱟᱦᱮᱸ ᱠᱟᱛᱮ ᱧᱮᱞ ᱫᱚᱦᱚᱭ ᱟᱨ ᱵᱤᱯᱚᱫᱽ ᱨᱮ ᱜᱚᱲᱚ ᱦᱚᱦᱚ',
        'ᱥᱟᱢᱟᱱ ᱟᱹᱜᱩᱭ ᱞᱟᱹᱜᱤᱫ ᱮᱴᱟᱜ ᱥᱮᱫ ᱪᱟᱞᱟᱜ',
        'ᱵᱮᱴᱨᱤ ᱵᱟᱧᱪᱟᱣ ᱞᱟᱹᱜᱤᱫ ᱞᱟᱭᱤᱴ ᱵᱚᱸᱫᱽ',
      ],
      explanation: 'ᱵᱟᱦᱨᱮ ᱛᱟᱦᱮᱸᱱ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱫᱚ ᱵᱷᱤᱛᱨᱤ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱧᱮᱞ ᱫᱚᱦᱚᱭᱟ ᱟᱨ ᱟᱯᱚᱛ ᱨᱮ ᱩᱱᱤ ᱚᱰᱚᱠ ᱨᱮ ᱜᱚᱲᱚᱣᱟᱭᱟ᱾',
    },
  },
  'gas-q4': {
    en: {
      category: 'Hazard Recognition',
      question: 'What distinctive odor is associated with low concentrations of Hydrogen Sulfide (H2S), and why is relying on smell dangerous?',
      options: [
        'Fruity aroma; safe at all concentrations',
        'Rotten eggs; at higher levels it paralyzes the olfactory nerve so you can no longer smell it',
        'Burning plastic; always smells stronger as it gets worse',
        'No odor at all under any circumstances',
      ],
      explanation: 'H2S smells of rotten eggs at low concentrations, but quickly deadens human sense of smell at lethal concentrations, making gas monitors indispensable.',
    },
    hi: {
      category: 'खतरा पहचान',
      question: 'हाइड्रोजन सल्फाइड (H2S) गैस की गंध कैसी होती है और केवल सूंघने पर निर्भर रहना खतरनाक क्यों है?',
      options: [
        'मीठे फलों जैसी खुशबू; सभी मात्राओं में सुरक्षित',
        'सड़े हुए अंडे जैसी; उच्च मात्रा में यह सूंघने की नस को सुन्न कर देती है जिससे गंध आनी बंद हो जाती है',
        'जलते हुए प्लास्टिक जैसी गंध',
        'किसी भी परिस्थिति में कोई गंध नहीं होती',
      ],
      explanation: 'H2S कम मात्रा में सड़े अंडे जैसी महकती है, लेकिन घातक स्तर पर सूंघने की क्षमता तुरंत खत्म कर देती है, इसलिए डिजिटल डिटेक्टर आवश्यक है।',
    },
    sat: {
      category: 'ᱵᱤᱯᱚᱫᱽ ᱪᱤᱱᱦᱟᱹᱣ',
      question: 'ᱦᱟᱭᱰᱨᱳᱡᱮᱱ ᱥᱟᱞᱯᱷᱟᱭᱤᱰ (H2S) ᱜᱮᱥ ᱨᱮᱱᱟᱜ ᱥᱚ ᱪᱮᱫ ᱞᱮᱠᱟ ᱟᱨ ᱥᱩᱢᱩᱝ ᱥᱚ ᱪᱮᱛᱟᱱ ᱯᱟᱹᱛᱤᱭᱟᱹᱣ ᱪᱮᱫᱟᱜ ᱵᱤᱯᱚᱫᱽ?',
      options: [
        'ᱥᱤᱵᱤᱞ ᱡᱚ ᱞᱮᱠᱟ; ᱪᱮᱫ ᱦᱚᱸ ᱵᱟᱭ ᱦᱩᱭᱩᱜ-ᱟ',
        'ᱥᱮᱭᱟ ᱵᱤᱞᱤ ᱞᱮᱠᱟ; ᱵᱟᱹᱲᱛᱤ ᱞᱮᱱᱠᱷᱟᱱ ᱢᱩᱸ ᱵᱚᱸᱫᱽ ᱜᱚᱫᱚᱜ-ᱟ ᱟᱨ ᱥᱚ ᱵᱟᱭ ᱵᱩᱡᱷᱟᱹᱣᱜ-ᱟ',
        'ᱡᱩᱞᱩᱜ ᱠᱟᱱ ᱯᱞᱟᱥᱴᱤᱠ ᱞᱮᱠᱟ',
        'ᱪᱮᱫ ᱦᱚᱸ ᱥᱚ ᱵᱟᱹᱱᱩᱜ-ᱟ',
      ],
      explanation: 'H2S ᱫᱚ ᱥᱮᱭᱟ ᱵᱤᱞᱤ ᱞᱮᱠᱟ ᱥᱚ-ᱟ, ᱢᱮᱱᱠᱷᱟᱱ ᱵᱟᱹᱲᱛᱤ ᱞᱮᱱᱠᱷᱟᱱ ᱢᱩᱸ ᱠᱟᱹᱢᱤ ᱵᱚᱸᱫᱽ ᱩᱛᱟᱹᱨᱚᱜ-ᱟ, ᱚᱱᱟᱛᱮ ᱢᱤᱴᱟᱨ ᱞᱟᱹᱠᱛᱤᱭᱟ᱾',
    },
  },
  'gas-q5': {
    en: {
      category: 'Fire Response',
      question: 'What is the statutory oxygen (O2) minimum required by DGMS before anyone may enter an unventilated mine cavity without SCBA?',
      options: ['19.5% O2 by volume', '12% O2 by volume', '8% O2 by volume', '25% O2 by volume'],
      explanation: 'Under 19.5% oxygen, cognitive impairment and hypoxia develop rapidly; self-contained breathing equipment is mandatory below this level.',
    },
    hi: {
      category: 'सुरक्षा अनुपालन',
      question: 'बिना श्वसन उपकरण (SCBA) के खदान के किसी भी हिस्से में प्रवेश हेतु डीजीएमएस द्वारा निर्धारित न्यूनतम ऑक्सीजन स्तर क्या है?',
      options: ['19.5% आयतन अनुसार', '12% आयतन अनुसार', '8% आयतन अनुसार', '25% आयतन अनुसार'],
      explanation: '19.5% से कम ऑक्सीजन होने पर हाइपोक्सिया (ऑक्सीजन की कमी) होती है और तुरंत बेहोशी आ सकती है; 19.5% से नीचे श्वसन उपकरण अनिवार्य है।',
    },
    sat: {
      category: 'ᱥᱩᱨᱚᱠᱷᱭᱟ ᱱᱤᱭᱚᱢ',
      question: 'ᱵᱤᱱᱟ ᱚᱠᱥᱤᱡᱮᱱ ᱢᱟᱥᱠ ᱛᱮ ᱠᱷᱟᱫᱟᱱ ᱵᱚᱞᱚᱱ ᱞᱟᱹᱜᱤᱫ DGMS ᱱᱤᱭᱚᱢ ᱞᱮᱠᱟᱛᱮ ᱠᱚᱢ ᱠᱷᱚᱱ ᱠᱚᱢ ᱛᱤᱱᱟᱹᱜ ᱚᱠᱥᱤᱡᱮᱱ (O2) ᱞᱟᱹᱠᱛᱤ?',
      options: ['19.5%', '12%', '8%', '25%'],
      explanation: '19.5% ᱠᱷᱚᱱ ᱠᱚᱢ ᱚᱠᱥᱤᱡᱮᱱ ᱨᱮ ᱢᱟᱹᱱᱢᱤ ᱵᱮᱦᱚᱸᱥᱚᱜ-ᱟ, ᱚᱱᱟᱛᱮ SCBA ᱵᱮᱵᱷᱟᱨ ᱜᱮ ᱦᱩᱭᱩᱜ-ᱟ᱾',
    },
  },
};

/**
 * Returns fully localized scenarios, titles, descriptions, and assessment questions
 * for a training module based on the active language.
 */
export function getLocalizedModule(module: TrainingModule, language: Language): TrainingModule {
  // Localize module title & description
  let modTitle = module.title;
  let modDesc = module.description;

  if (module.id === 'fire-safety') {
    if (language === 'hi') {
      modTitle = 'अग्नि एवं विस्फोट प्रतिक्रिया';
      modDesc = 'मीथेन प्रज्वलन नियंत्रण, कोयला धूल शमन, एबीसी अग्निशामक एवं सुरक्षित निकासी।';
    } else if (language === 'sat') {
      modTitle = 'ᱥᱮᱸᱜᱮᱞ ᱟᱨ ᱵᱤᱥᱯᱷᱳᱴ ᱨᱩᱠᱷᱤᱭᱟᱹ';
      modDesc = 'ᱢᱤᱛᱷᱮᱱ ᱥᱮᱸᱜᱮᱞ ᱵᱚᱸᱫᱽ, ᱠᱩᱭᱞᱟᱹ ᱫᱷᱩᱲᱤ ᱦᱟᱹᱯᱤᱫ, ABC ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱟᱨ ᱚᱰᱚᱠ ᱦᱚᱨ᱾';
    }
  } else if (module.id === 'gas-safety') {
    if (language === 'hi') {
      modTitle = 'गैस रिसाव एवं संकीर्ण स्थान';
      modDesc = 'जहरीली गैस पहचान, पीपीई सूट, बडी सिस्टम एवं संकीर्ण खदान पहुंच।';
    } else if (language === 'sat') {
      modTitle = 'ᱵᱤᱥ ᱜᱮᱥ ᱟᱨ ᱦᱩᱰᱤᱧ ᱡᱟᱭᱜᱟ';
      modDesc = 'ᱵᱤᱥ ᱜᱮᱥ ᱪᱤᱱᱦᱟᱹᱣ, PPE ᱦᱚᱨᱚᱜ, ᱜᱟᱛᱮ ᱥᱟᱶᱛᱮ ᱠᱟᱹᱢᱤ (Buddy System) ᱟᱨ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱦᱚᱨ᱾';
    }
  }

  const localizedScenarios: ARScenario[] = module.scenarios.map((sc) => {
    const translation =
      SCENARIO_TRANSLATIONS[sc.id]?.[language] ||
      SCENARIO_TRANSLATIONS[sc.id]?.['hi'] ||
      SCENARIO_TRANSLATIONS[sc.id]?.['en'];
    if (!translation) return sc;

    return {
      ...sc,
      title: translation.title,
      subtitle: translation.subtitle,
      situation: translation.situation,
      question: translation.question,
      options: sc.options.map((opt) => {
        const optTrans = translation.options.find((o) => o.id === opt.id);
        return {
          ...opt,
          text: optTrans ? optTrans.text : opt.text,
          feedback: optTrans ? optTrans.feedback : opt.feedback,
        };
      }),
      markers: sc.markers.map((m) => {
        const mTrans = translation.markers.find((tm) => tm.id === m.id);
        return {
          ...m,
          label: mTrans ? mTrans.label : m.label,
          description: mTrans ? mTrans.description : m.description,
          actionRequired: mTrans?.actionRequired || m.actionRequired,
        };
      }),
    };
  });

  const localizedQuestions = module.assessmentQuestions.map((q) => {
    const qTrans =
      ASSESSMENT_TRANSLATIONS[q.id]?.[language] ||
      ASSESSMENT_TRANSLATIONS[q.id]?.['hi'] ||
      ASSESSMENT_TRANSLATIONS[q.id]?.['en'];
    if (!qTrans) return q;

    return {
      ...q,
      category: qTrans.category,
      question: qTrans.question,
      options: qTrans.options,
      explanation: qTrans.explanation,
    };
  });

  return {
    ...module,
    title: modTitle,
    description: modDesc,
    scenarios: localizedScenarios,
    assessmentQuestions: localizedQuestions,
  };
}
