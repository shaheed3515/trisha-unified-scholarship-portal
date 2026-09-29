import { useState, useRef, useEffect } from 'react'
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Sparkles, 
  Languages, 
  ShieldCheck, 
  FileText, 
  HelpCircle,
  Volume2,
  VolumeX,
  CheckCircle2,
  AlertCircle,
  Key,
  X,
  ExternalLink
} from 'lucide-react'
import { I18N } from '../data/scholarshipData'
import { askGemini, getStoredApiKey, setStoredApiKey } from '../services/geminiService'
import './GrievanceAssistant.css'

// Multilingual Knowledge Base for MoTA Tribal AI Sahayak (JAGO)
const KNOWLEDGE_BASE = {
  en: {
    welcome: (name) => `Johar / Namaste ${name}! I am the MoTA Tribal AI Sahayak (JAGO). I can answer your questions on all 5 scholarship schemes, application stage tracking, DigiLocker verification, DBT payments, anti-duplication rules, and broad real-world knowledge in English, Hindi, Santhali, Gondi, Ho, Bodo, or Kui.`,
    citation: 'MoTA Unified Guidelines 2026-27',
    inputPlaceholder: 'Ask any question in English, Hindi, Santhali, Gondi...',
    speakingToast: 'Playing audio explanation in English...',
    questions: [
      {
        q: 'What is my scholarship & DBT payment status?',
        a: 'Your Post-Matric Scholarship allowance (₹18,500) has been fully verified and DBT funds were successfully credited to your State Bank of India account (UTR: RBI2026091298412 on 12 September 2026).'
      },
      {
        q: 'Can I apply for NFST fellowship if I already receive Post-Matric?',
        a: 'Under MoTA regulations (Rule 11/GFR 2017), simultaneous availing of multiple scholarships is strictly barred. However, TRISHA provides an automated Scheme Transition / Relinquishment NOC feature. If selected for NFST (₹37,000/mo), your Post-Matric allocation is safely transitioned without any double-dipping penalty.'
      },
      {
        q: 'Why is my Top Class application flagged with an action required?',
        a: 'The State Nodal Officer requested an updated FY 2025-26 Income Certificate with a clear digital seal. You can resolve this instantly with 1-click DigiLocker sync on your Application Tracker tab.'
      },
      {
        q: 'Which documents are auto-verified via DigiLocker?',
        a: 'Your Aadhaar Card, ST Caste Certificate (Jharkhand e-District), and Class 12 Marksheet are auto-verified with official digital signatures via DigiLocker and APAAR.'
      }
    ]
  },
  hi: {
    welcome: (name) => `जोहार / नमस्ते ${name}! मैं जनजातीय कार्य मंत्रालय (MoTA) का 'जनजातीय एआई सहायक (JAGO)' हूँ। मैं सभी 5 छात्रवृत्ति योजनाओं, डीबीटी भुगतान स्थिति, डिजिलॉकर सत्यापन, और शिक्षा एवं सामान्य ज्ञान से जुड़े किसी भी प्रश्न में आपकी पूरी सहायता कर सकता हूँ।`,
    citation: 'जनजातीय कार्य मंत्रालय दिशा-निर्देश 2026-27',
    inputPlaceholder: 'हिंदी, संथाली, गोंडी या अंग्रेजी में प्रश्न पूछें...',
    speakingToast: 'हिंदी में ध्वनि संदेश सुनाया जा रहा है...',
    questions: [
      {
        q: 'मेरी छात्रवृत्ति और डीबीटी भुगतान की स्थिति क्या है?',
        a: 'आपकी पोस्ट-मैट्रिक छात्रवृत्ति (₹18,500) पूरी तरह सत्यापित हो चुकी है और डीबीटी राशि 12 सितंबर 2026 को आपके भारतीय स्टेट बैंक (SBI) खाते में सफलतापूर्वक जमा हो चुकी है (UTR: RBI2026091298412)।'
      },
      {
        q: 'क्या पोस्ट-मैट्रिक के साथ NFST फेलोशिप भी मिल सकती है?',
        a: 'जनजातीय कार्य मंत्रालय के "एक सक्रिय छात्रवृत्ति" नियम (GFR 2017) के तहत आप एक साथ दो छात्रवृत्तियां नहीं ले सकते। हालांकि, TRISHA में स्वचालित अनापत्ति प्रमाण पत्र (NOC) की सुविधा है। यदि आपका चयन NFST फेलोशिप (₹37,000/माह) के लिए होता है, तो आपकी पोस्ट-मैट्रिक छात्रवृत्ति बिना किसी जुर्माने के सुरक्षित रूप से स्थानांतरित (Transition) हो जाएगी।'
      },
      {
        q: 'मेरे टॉप क्लास आवेदन पर कार्रवाई (Deficiency) क्यों दिखाई दे रही है?',
        a: 'राज्य नोडल अधिकारी द्वारा वर्ष 2025-26 के आय प्रमाण पत्र के पुनः सत्यापन का अनुरोध किया गया है। आप "ट्रैकर" टैब में जाकर डिजिलॉकर लाइव सिंक द्वारा इसे तुरंत ठीक कर सकते हैं।'
      },
      {
        q: 'डिजिलॉकर से कौन से दस्तावेज़ सत्यापित हैं?',
        a: 'आपका आधार कार्ड, एसटी जाति प्रमाण पत्र (ई-डिस्ट्रिक्ट) एवं कक्षा 12 की अंकतालिका डिजिलॉकर और APAAR के माध्यम से डिजिटल रूप से सत्यापित हैं।'
      }
    ]
  },
  santhali: {
    welcome: (name) => `ᱡᱚᱦᱟᱨ ${name}! ᱤᱧ ᱫᱚ ᱡᱚᱱᱡᱟᱹᱛᱤᱭᱟᱹᱨᱤ ᱢᱚᱱᱛᱨᱟᱲᱚᱭ (MoTA) ᱨᱤᱱᱤᱡ 'ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱮᱟᱭ ᱜᱚᱲᱚᱣᱟᱱ (JAGO)' ᱠᱟᱱᱟᱹᱧ᱾ ᱤᱧ ᱕ ᱜᱚᱴᱟᱝ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ, ᱰᱤᱵᱤᱴᱤ ᱴᱟᱠᱟ, ᱟᱨ ᱰᱤᱡᱤᱞᱚᱠᱟᱨ ᱡᱟᱸᱪ ᱵᱟᱵᱚᱛ ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ ᱜᱚᱲᱚ ᱮᱢ ᱫᱟᱲᱮᱭᱟᱜ-ᱟᱹᱧ᱾`,
    citation: 'MoTA ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱱᱤᱭᱟᱹᱢ ᱒᱐᱒᱖-᱒᱗',
    inputPlaceholder: 'ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ ᱠᱩᱞᱤ ᱢᱮ...',
    speakingToast: 'ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ ᱟᱲᱟᱝ ᱥᱟᱰᱮ ᱪᱟᱹᱞᱩ ᱟᱠᱟᱱᱟ...',
    questions: [
      {
        q: 'ᱤᱧᱟᱜ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱟᱨ ᱴᱟᱠᱟ ᱧᱟᱢ ᱨᱮᱱᱟᱜ ᱦᱟᱞᱚᱛ ᱪᱮᱫ ᱠᱟᱱᱟ?',
        a: 'ᱟᱢᱟᱜ ᱯᱳᱥᱴ-ᱢᱮᱴᱨᱤᱠ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ (₹18,500) ᱯᱩᱨᱟᱹ ᱡᱟᱸᱪ ᱦᱩᱭ ᱟᱠᱟᱱᱟ ᱟᱨ SBI ᱵᱮᱸᱠ ᱮᱠᱟᱣᱩᱱᱴ ᱨᱮ ᱴᱟᱠᱟ ᱥᱮᱴᱮᱨ ᱟᱠᱟᱱᱟ (UTR: RBI2026091298412)᱾'
      },
      {
        q: 'ᱯᱳᱥᱴ-ᱢᱮᱴᱨᱤᱠ ᱛᱟᱦᱮᱸᱱ ᱛᱩᱞᱩᱡ NFST ᱯᱷᱮᱞᱳᱥᱤᱯ ᱧᱟᱢᱚᱜ-ᱟ ᱥᱮ ᱵᱟᱝ?',
        a: 'MoTA ᱨᱮᱱᱟᱜ ᱢᱤᱫ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱱᱤᱭᱟᱹᱢ ᱞᱮᱠᱟᱛᱮ ᱵᱟᱨᱭᱟ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱢᱤᱫ ᱫᱷᱟᱣ ᱨᱮ ᱵᱟᱝ ᱧᱟᱢᱚᱜ-ᱟ᱾ ᱢᱮᱱᱠᱷᱟᱱ TRISHA ᱨᱮ ᱟᱡ ᱛᱮᱜᱮ NOC ᱵᱮᱱᱟᱣ ᱠᱟᱛᱮ NFST (₹37,000/ᱪᱟᱸᱫᱚ) ᱨᱮ ᱵᱚᱫᱚᱞ ᱜᱟᱱᱚᱜ-ᱟ᱾'
      }
    ]
  },
  gondi: {
    welcome: (name) => `सेवा जोहार / राम-राम ${name}! नन्ना जनजातीय मंत्रालय (MoTA) ना 'सहायी संगी (JAGO)' आन। नन्ना सब्बों 5 योजनांग, DBT पैसा, अउर DigiLocker जांच बारोत गोंडी ते मदद कीके मंतोन।`,
    citation: 'MoTA गोंडी सेवा नियम 2026-27',
    inputPlaceholder: 'गोंडी ते सवाल कीम...',
    speakingToast: 'गोंडी ते आवाज चालू मंता...',
    questions: [
      {
        q: 'मावा छात्रवृत्ति अउर DBT पैसा ना हाल बोर मंता?',
        a: 'नीवा पोस्ट-मैट्रिक छात्रवृत्ति (₹18,500) जांच पूरो आता अउर SBI बैंक खाता ते पैसा जमा आता (UTR: RBI2026091298412)।'
      },
      {
        q: 'पोस्ट-मैट्रिक कज्या NFST फेलोशिप मिलि की?',
        a: 'MoTA ना नियम मुतालिक एक बेर ते रोंड (2) छात्रवृत्ति मिले वयो। पण TRISHA ते ऑटोमैटिक NOC कीसी NFST (₹37,000/महीना) ते जासे सुविधा मंता।'
      }
    ]
  },
  ho: {
    welcome: (name) => `ᱡᱚᱦᱟᱨ ${name}! ᱤᱧ ᱫᱚ ᱢᱚᱱᱛᱨᱤ ᱢᱟᱰᱮᱨ (MoTA) ᱨᱤᱱᱤᱡ 'ᱦᱳ ᱮᱟᱭ ᱜᱚᱲᱚᱣᱟᱱ (JAGO)' ᱠᱟᱱᱟᱹᱧ᱾ ᱤᱧ ᱕ ᱜᱚᱴᱟᱝ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱟᱨ ᱴᱟᱠᱟ ᱵᱟᱵᱚᱛ ᱜᱚᱲᱚ ᱮᱢ ᱫᱟᱲᱮᱭᱟᱜ-ᱟᱹᱧ᱾`,
    citation: 'MoTA ᱦᱳ ᱫᱤᱥᱟᱹ-ᱩᱫᱩᱜ ᱒᱐᱒᱖-᱒᱗',
    inputPlaceholder: 'ᱦᱳ ᱛᱮ ᱠᱩᱞᱤ ᱢᱮ...',
    speakingToast: 'ᱦᱳ ᱛᱮ ᱟᱲᱟᱝ ᱥᱟᱰᱮ ᱪᱟᱹᱞᱩ ᱟᱠᱟᱱᱟ...',
    questions: [
      {
        q: 'ᱤᱧᱟᱜ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱟᱨ ᱴᱟᱠᱟ ᱦᱟᱞᱚᱛ ᱪᱮᱫ ᱢᱮᱱᱟᱜ-ᱟ?',
        a: 'ᱟᱢᱟᱜ ᱯᱳᱥᱴ-ᱢᱮᱴᱨᱤᱠ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ (₹18,500) ᱯᱩᱨᱟᱹ ᱡᱟᱸᱪ ᱦᱩᱭ ᱟᱠᱟᱱᱟ ᱟᱨ SBI ᱵᱮᱸᱠ ᱮᱠᱟᱣᱩᱱᱴ ᱨᱮ ᱴᱟᱠᱟ ᱵᱷᱮᱡᱟ ᱦᱩᱭ ᱟᱠᱟᱱᱟ (UTR: RBI2026091298412)᱾'
      }
    ]
  },
  bodo: {
    welcome: (name) => `खुलुमबाय ${name}! आं जनजातीय मन्त्रालय (MoTA) नि 'बर\' एआइ मददगिरि (JAGO)'। आं गासै 5 अनसुंथाइ, DBT रां आरो डिजिलकर लेखा आनजाद खालामनायाव मदद होनो हागोन।`,
    citation: 'MoTA बर\' बिथोन 2026-27',
    inputPlaceholder: 'बर\' रावजों सों...',
    speakingToast: 'बर\' रावजों खोनासं...',
    questions: [
      {
        q: 'आंनि अनसुंथाइ आरो DBT रां मोननायनि थासारिया मा?',
        a: 'नोंथांनि पोस्ट-मेट्रिक अनसुंथाइ (₹18,500) आनजाद जाबाय आरो SBI बैंक एकाउन्टआव 12 सेप्टेम्बर 2026 आव रां हरबाय (UTR: RBI2026091298412)।'
      }
    ]
  },
  kui: {
    welcome: (name) => `ଜୁହାର ${name}! ମୁଁ ଜନଜାତି କଲ୍ୟାଣ ମନ୍ତ୍ରଣାଳୟ (MoTA) ର 'କୁଇ ଏଆଇ ସହାୟକ (JAGO)'। ମୁଁ ସବୁ ୫ଟି ବୃତ୍ତି ଯୋଜନା, DBT ଟଙ୍କା ଓ ଡିଜିଲକର ଯାଞ୍ଚ ବିଷୟରେ ସାହାଯ୍ୟ କରିପାରିବି।`,
    citation: 'MoTA କୁଇ ନିୟମାବଳୀ ୨୦୨୬-୨୭',
    inputPlaceholder: 'କୁଇ ଭାଷାରେ ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ...',
    speakingToast: 'କୁଇ ଭାଷାରେ ଶୁଣାଯାଉଛି...',
    questions: [
      {
        q: 'ମୋର ବୃତ୍ତି ଓ DBT ଟଙ୍କାର ସ୍ଥିତି କ\'ଣ?',
        a: 'ଆପଣଙ୍କ ପୋଷ୍ଟ-ମେଟ୍ରିକ ବୃତ୍ତି (₹୧୮,୫୦୦) ଯାଞ୍ଚ ହୋଇସାରିଛି ଏବଂ SBI ବ୍ୟାଙ୍କ ଖାତାକୁ ଟଙ୍କା ପଠାଯାଇଛି (UTR: RBI2026091298412)।'
      }
    ]
  }
}

// Smart language & script auto-detection
function detectLanguage(text, activeLang) {
  if (!text) return activeLang

  if (/[\u0900-\u097F]/.test(text)) {
    if (activeLang === 'gondi' || activeLang === 'bodo') return activeLang
    return 'hi'
  }
  if (/[\u1C50-\u1C7F]/.test(text)) return 'santhali'
  if (/[\u0B00-\u0B7F]/.test(text)) return 'kui'

  const lower = text.toLowerCase()
  if (lower.includes('hindi') || lower.includes('in hindi') || lower.includes('हिंदी')) return 'hi'
  if (lower.includes('santhali') || lower.includes('santali') || lower.includes('ᱥᱟᱱᱛᱟᱲᱤ')) return 'santhali'
  if (lower.includes('gondi') || lower.includes('गोंडी')) return 'gondi'
  if (lower.includes('english') || lower.includes('angrezi')) return 'en'

  const hinglishPatterns = [
    /\b(kya|main|mujhe|mera|meri|mere|milega|mil|rahi|raha|sakta|saktee|hai|hain|hoon|ho|aavedan|shuru|kaise|kab|kitna|paisa|paise|stithi|jaanch|chahiye|kyun|kyu|kaun|dono|pehle|karen|karo|batao|kisi|kisko|unhe)\b/i
  ]
  if (hinglishPatterns.some(regex => regex.test(lower))) return 'hi'

  return activeLang
}

// Rich contextual fallbacks when live API is connecting or key needs configuration
function generateIntelligentFallback(query, detectedLang) {
  const q = query.toLowerCase()
  const isHi = detectedLang === 'hi'

  // General Questions: India, Specialties, Culture
  if (q.includes('india') || q.includes('bharat') || q.includes('special') || q.includes('good about') || q.includes('खासियत') || q.includes('भारत')) {
    return isHi
      ? `🇮🇳 भारत की कुछ प्रमुख विशेषताएं एवं गौरव:\n\n1. **विविधता में एकता (Unity in Diversity):** भारत में 700 से अधिक मान्यता प्राप्त जनजातियां (ST), 22 आधिकारिक भाषाएं और समृद्ध बहु-सांस्कृतिक विरासत है।\n2. **जनजातीय संस्कृति व पर्यावरण संरक्षण:** संताल, गोंड, भील, मुंडा, खासी जैसी समृद्ध जनजातियां प्रकृति की सुरक्षा एवं औषधीय ज्ञान की धरोहर हैं।\n3. **डिजिटल सार्वजनिक अवसंरचना (DPI):** UPI, डिजिलॉकर और DBT (प्रत्यक्ष लाभ अंतरण) के माध्यम से भारत विश्व में सबसे तेज डिजिटल समावेशन करने वाला देश है।\n4. **शिक्षा व अनुसंधान:** IITs, NITs, AIIMS और केंद्रीय विश्वविद्यालयों के माध्यम से छात्रों के लिए विश्वस्तरीय शैक्षणिक अवसर उपलब्ध हैं।\n\nजनजातीय कार्य मंत्रालय (MoTA) सभी एसटी छात्रों को देश-विदेश में शीर्ष शिक्षा प्राप्त करने के लिए छात्रवृत्तियां प्रदान करता है।`
      : `🇮🇳 Notable Highlights & Specialties of India:\n\n1. **Unity in Diversity:** India is home to over 700 distinct Scheduled Tribes (STs), 22 official languages, and thousands of vibrant regional cultures living in harmony.\n2. **Rich Indigenous & Tribal Heritage:** Communities like Santhal, Gond, Munda, Bhil, and Khasi maintain profound traditions in nature conservation, art (like Sohrai and Warli), and indigenous medicine.\n3. **Digital Public Infrastructure (DPI):** India leads the globe in transparent digital systems—including UPI, DigiLocker e-KYC, and direct-to-bank PFMS transfers.\n4. **Premier Higher Education:** Global hubs of excellence like IITs, IIMs, IISc, and AIIMS, strongly supported by government fellowships (such as NFST and Top Class ST).\n\nIf you have questions about exploring educational opportunities across India, feel free to ask!`
  }

  // Conflict / Multi-scheme queries
  if (q.includes('nfst') && (q.includes('post-matric') || q.includes('already') || q.includes('dono') || q.includes('both'))) {
    return isHi
      ? `जनजातीय कार्य मंत्रालय (MoTA) के "एक सक्रिय छात्रवृत्ति" नियम (GFR 2017 / Rule 11) के अनुसार, एक छात्र एक समय पर दो सरकारी छात्रवृत्तियां नहीं ले सकता।\n\nहालाँकि, TRISHA पोर्टल में स्वचालित अनापत्ति प्रमाण पत्र (Automated Relinquishment NOC) की सुविधा है। यदि आपका चयन NFST फेलोशिप (₹37,000/माह) के लिए होता है, तो आपकी पूर्ववर्ती पोस्ट-मैट्रिक छात्रवृत्ति सुरक्षित रूप से स्थानांतरित (Transition) हो जाएगी और कोई दोहरा लाभ जुर्माना नहीं लगेगा।`
      : `Under MoTA regulations (Rule 11 / GFR 2017), simultaneous availing of multiple government scholarships is strictly barred. However, TRISHA provides an automated Scheme Transition / Relinquishment NOC feature. If selected for NFST (₹37,000/month), your Post-Matric allocation is safely transitioned without any double-dipping penalty.`
  }

  // Payment / DBT queries
  if (q.includes('dbt') || q.includes('payment') || q.includes('paisa') || q.includes('status') || q.includes('status')) {
    return isHi
      ? `आपकी पोस्ट-मैट्रिक छात्रवृत्ति (₹18,500) पूरी तरह सत्यापित हो चुकी है और डीबीटी राशि 12 सितंबर 2026 को आपके भारतीय स्टेट बैंक (SBI) खाते में सफलतापूर्वक जमा हो चुकी है (UTR: RBI2026091298412)। आप 'ट्रैकर' टैब से आधिकारिक रसीद डाउनलोड कर सकते हैं।`
      : `Your Post-Matric Scholarship allowance (₹18,500) has been fully verified and DBT funds were successfully credited to your State Bank of India account (UTR: RBI2026091298412 on 12 September 2026). You can download your certified receipt from the Tracker tab.`
  }

  // Default helpful response
  return isHi
    ? `नमस्ते! जनजातीय कार्य मंत्रालय (MoTA) के 'जनजातीय एआई सहायक' के रूप में मैं आपके प्रश्न "${query}" पर आपकी पूरी सहायता करने के लिए तैयार हूँ।\n\nआप मुझसे 5 छात्रवृत्ति योजनाओं (Pre-Matric, Post-Matric, Top Class, NFST, NOS), डिजिलॉकर सत्यापन, डीबीटी भुगतान अथवा सामान्य शैक्षणिक व भारतीय विषयों पर कोई भी प्रश्न पूछ सकते हैं।`
    : `Johar / Namaste! As the MoTA Tribal AI Sahayak, I am here to help you with your question regarding "${query}".\n\nFeel free to ask about all 5 MoTA scholarship schemes, eligibility evaluation, DigiLocker verification, DBT disbursements, or broad questions about higher education and Indian specialties!`
}

export default function GrievanceAssistant({ activeStudent, lang = 'en', setLang, onToast }) {
  const currentLang = KNOWLEDGE_BASE[lang] ? lang : 'en'
  const kb = KNOWLEDGE_BASE[currentLang]

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: kb.welcome(activeStudent?.name || 'Priya'),
      citation: kb.citation
    }
  ])
  const [inputVal, setInputVal] = useState('')
  const [listening, setListening] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [showKeyModal, setShowKeyModal] = useState(false)
  const [apiKeyInput, setApiKeyInput] = useState('')
  const [currentKey, setCurrentKey] = useState('')
  const [keyStatus, setKeyStatus] = useState({ type: 'info', msg: '' })

  const chatBottomRef = useRef(null)
  const recognitionRef = useRef(null)

  useEffect(() => {
    const savedKey = getStoredApiKey()
    setCurrentKey(savedKey)
    setApiKeyInput(savedKey)
  }, [])

  // Auto-scroll on new message
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Speech Recognition Setup (Web Speech API)
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false

      recognition.onstart = () => {
        setListening(true)
        onToast?.('Listening to your voice...', 'info')
      }

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setListening(false)
        setInputVal(transcript)
        onToast?.('Voice captured: ' + transcript, 'success')
        handleSend(transcript)
      }

      recognition.onerror = (event) => {
        setListening(false)
        console.warn('Speech recognition error:', event.error)
        if (event.error === 'not-allowed') {
          onToast?.('Microphone access denied. Please allow microphone in browser.', 'warning')
        } else {
          onToast?.(`Voice recognition: ${event.error}`, 'warning')
        }
      }

      recognition.onend = () => {
        setListening(false)
      }

      recognitionRef.current = recognition
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [lang])

  const toggleMic = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      onToast?.('Speech recognition is not supported in this browser. Please use Chrome or Edge.', 'warning')
      return
    }

    if (listening) {
      recognitionRef.current?.stop()
      setListening(false)
    } else {
      try {
        if (recognitionRef.current) {
          recognitionRef.current.lang = lang === 'hi' ? 'hi-IN' : 'en-IN'
          recognitionRef.current.start()
        }
      } catch (err) {
        console.warn('Recognition start error:', err)
        recognitionRef.current?.abort()
        setTimeout(() => recognitionRef.current?.start(), 200)
      }
    }
  }

  // Speech Synthesis
  const handleSpeak = (text) => {
    if (!('speechSynthesis' in window)) {
      onToast?.('Text-to-speech is not supported in this browser.', 'warning')
      return
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    window.speechSynthesis.cancel()
    const cleanText = text.replace(/[*_#`]/g, '')
    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN'
    utterance.rate = 0.95

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
    onToast?.(kb.speakingToast, 'info')
  }

  // Handle Query Submission
  const handleSend = async (textToSend) => {
    const query = (textToSend || inputVal).trim()
    if (!query || loading) return

    const userMsg = { id: Date.now(), sender: 'user', text: query }
    setMessages(prev => [...prev, userMsg])
    setInputVal('')
    setLoading(true)

    // Detect language
    const detectedLang = detectLanguage(query, currentLang)
    if (detectedLang !== currentLang && setLang) {
      setLang(detectedLang)
    }

    try {
      // 1. Call Gemini AI via geminiService
      const aiResult = await askGemini({
        query,
        lang: detectedLang,
        activeStudent,
        customApiKey: currentKey
      })

      if (aiResult.success && aiResult.reply) {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'bot',
            text: aiResult.reply,
            citation: aiResult.citation || 'MoTA Central Guidelines & Google Gemini 3.8 Flash',
            model: aiResult.model
          }
        ])
      } else {
        // Handle API key issue or key leaked error with intelligent contextual fallback
        const intelligentReply = generateIntelligentFallback(query, detectedLang)
        let noticeText = intelligentReply

        if (aiResult.error === 'KEY_LEAKED') {
          noticeText += `\n\n⚠️ *Notice: Your configured Gemini API key was reported as leaked by Google. Click "API Key" at top to add a fresh key from Google AI Studio.*`
        } else if (aiResult.error === 'NO_API_KEY' && !currentKey) {
          // Subtle hint to enable full live mode
          noticeText += `\n\n💡 *Tip: Add your Gemini API key (top-right button) to unlock unrestricted live AI responses.*`
        }

        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'bot',
            text: noticeText,
            citation: 'MoTA Knowledge Base & AI Synthesis'
          }
        ])
      }
    } catch (err) {
      console.error('Chat error:', err)
      const fallback = generateIntelligentFallback(query, detectedLang)
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: fallback,
          citation: 'MoTA Guidelines'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSaveApiKey = () => {
    const trimmed = apiKeyInput.trim()
    setStoredApiKey(trimmed)
    setCurrentKey(trimmed)
    if (trimmed) {
      setKeyStatus({ type: 'success', msg: 'Key saved successfully! Live Gemini queries activated.' })
      onToast?.('Gemini API key updated!', 'success')
      setTimeout(() => setShowKeyModal(false), 1200)
    } else {
      setKeyStatus({ type: 'info', msg: 'Key removed. Running on intelligent domain fallback.' })
      onToast?.('API key cleared', 'info')
    }
  }

  return (
    <div className="assistant-view fade-in">
      {/* Top Header Card */}
      <div className="assistant-header gov-card">
        <div className="assistant-header-left">
          <div className="ai-avatar-circle">
            <Bot size={24} />
          </div>
          <div>
            <div className="assistant-badge-row">
              <span className="badge badge-primary">Multilingual Voice & NLP</span>
              <span className="badge badge-success">MoTA AI Sahayak (JAGO)</span>
              <span className="badge badge-info">Gemini 3.8 Flash Powered</span>
            </div>
            <h1 className="assistant-title">Tribal Student Grievance & Guidance Assistant</h1>
          </div>
        </div>

        <div className="assistant-header-right">
          {/* API Key Config Button */}
          <button 
            className="api-key-header-btn"
            onClick={() => {
              setShowKeyModal(true)
              setApiKeyInput(currentKey)
              setKeyStatus({ type: 'info', msg: '' })
            }}
            title="Configure Google Gemini API Key"
          >
            <span className={`status-dot ${currentKey ? 'active' : 'warning'}`} />
            <Key size={14} />
            <span>{currentKey ? 'Gemini Live' : 'Set Gemini Key'}</span>
          </button>

          <Languages size={16} className="lang-icon-header" />
          <span className="lang-label">Dialect:</span>
          <select 
            value={lang} 
            onChange={(e) => {
              setLang?.(e.target.value)
              onToast?.(`Switched JAGO Assistant to ${e.target.options[e.target.selectedIndex].text}`, 'info')
            }}
            className="assistant-lang-select"
          >
            <option value="en">English (Official)</option>
            <option value="hi">हिंदी (Hindi / Northern ST)</option>
            <option value="santhali">ᱥᱟᱱᱛᱟᱲᱤ (Santhali / Ol Chiki)</option>
            <option value="gondi">गोंडी (Gondi / Central)</option>
            <option value="ho">ᱦᱳ (Ho / Kolhan)</option>
            <option value="bodo">बड़ो (Bodo / Northeast)</option>
            <option value="kui">କୁଇ (Kui / Kandha)</option>
          </select>
        </div>
      </div>

      {/* Suggested Questions Strip */}
      <div className="suggested-queries-strip">
        {kb.questions.map((sq, idx) => (
          <button 
            key={idx} 
            className="suggested-pill-btn"
            onClick={() => handleSend(sq.q)}
          >
            <Sparkles size={13} className="sparkle-icon" />
            <span>{sq.q}</span>
          </button>
        ))}
        <button 
          className="suggested-pill-btn"
          onClick={() => handleSend(lang === 'hi' ? 'भारत की संस्कृति और प्रमुख विशेषताएं क्या हैं?' : 'Tell me about the culture and specialties of India')}
        >
          <Sparkles size={13} className="sparkle-icon" />
          <span>{lang === 'hi' ? '🇮🇳 भारत की विशेषताएं' : '🇮🇳 Specialties of India'}</span>
        </button>
      </div>

      {/* Chat Messages Feed */}
      <div className="gov-card chat-box-card">
        <div className="chat-messages-container">
          {messages.map(msg => (
            <div 
              key={msg.id} 
              className={`chat-bubble-row ${msg.sender === 'user' ? 'user-row' : 'bot-row'}`}
            >
              {msg.sender === 'bot' && (
                <div className="bubble-avatar bot-avatar">
                  <Bot size={16} />
                </div>
              )}

              <div className={`chat-bubble ${msg.sender === 'user' ? 'user-bubble' : 'bot-bubble'}`}>
                <p className="bubble-text">{msg.text}</p>
                <div className="bubble-footer-row">
                  {msg.citation && (
                    <div className="bubble-citation">
                      <ShieldCheck size={12} />
                      <span>{msg.citation}</span>
                    </div>
                  )}
                  {msg.sender === 'bot' && (
                    <button 
                      className="speak-btn" 
                      onClick={() => handleSpeak(msg.text)}
                      title="Listen with Text-to-Speech"
                    >
                      {isSpeaking ? <VolumeX size={13} /> : <Volume2 size={13} />}
                      {isSpeaking ? 'Stop' : 'Listen'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Real Typing Indicator */}
          {loading && (
            <div className="chat-bubble-row bot-row">
              <div className="bubble-avatar bot-avatar">
                <Bot size={16} />
              </div>
              <div className="typing-indicator">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <div className="chat-input-bar">
          <button 
            className={`mic-button ${listening ? 'mic-listening' : ''}`}
            onClick={toggleMic}
            title={listening ? "Listening... click to stop" : "Speak query in your voice"}
          >
            {listening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          <input 
            type="text" 
            placeholder={listening ? "Listening... speak now..." : kb.inputPlaceholder}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={loading}
            className="chat-text-input"
          />

          <button 
            className="btn btn-primary send-chat-btn"
            onClick={() => handleSend()}
            disabled={loading || !inputVal.trim()}
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* Gemini API Key Configuration Modal */}
      {showKeyModal && (
        <div className="key-modal-overlay fade-in" onClick={() => setShowKeyModal(false)}>
          <div className="key-modal-card" onClick={e => e.stopPropagation()}>
            <div className="key-modal-header">
              <div className="key-modal-title">
                <Key size={18} color="var(--primary-700)" />
                <span>Google Gemini API Configuration</span>
              </div>
              <button className="close-btn" onClick={() => setShowKeyModal(false)}>
                <X size={18} />
              </button>
            </div>

            <p className="key-modal-desc">
              Connect a Google Gemini API key to activate unrestricted, live multi-model responses (powered by <code>gemini-3.8-flash</code> and <code>gemini-3.5-flash</code>). Your key is stored safely in your browser session.
            </p>

            <div className="key-input-group">
              <label className="key-input-label">Gemini API Key (AI Studio):</label>
              <input 
                type="password"
                placeholder="AIzaSy..."
                value={apiKeyInput}
                onChange={e => setApiKeyInput(e.target.value)}
                className="key-text-input"
              />
              {keyStatus.msg && (
                <div className={`key-status-msg ${keyStatus.type}`}>
                  {keyStatus.msg}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noreferrer"
                style={{ fontSize: '12px', color: 'var(--primary-700)', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontWeight: 600 }}
              >
                <span>Get a free Gemini API key from Google AI Studio</span>
                <ExternalLink size={12} />
              </a>
            </div>

            <div className="key-modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowKeyModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSaveApiKey}>
                Save & Connect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
