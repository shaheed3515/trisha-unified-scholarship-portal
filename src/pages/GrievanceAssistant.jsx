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
  CheckCircle2,
  RotateCcw
} from 'lucide-react'
import { I18N } from '../data/scholarshipData'
import './GrievanceAssistant.css'

// Multilingual Knowledge Base for MoTA Tribal AI Sahayak (JAGO)
const KNOWLEDGE_BASE = {
  en: {
    welcome: (name) => `Johar / Namaste ${name}! I am the MoTA Tribal AI Sahayak (JAGO). I can assist you with all 5 scholarship schemes, application stage tracking, DigiLocker verification, DBT payments, and anti-duplication rules in English, Hindi, Santhali, Gondi, Ho, Bodo, or Kui.`,
    citation: 'MoTA Unified Guidelines 2026-27',
    inputPlaceholder: 'Ask a question in English, Hindi, Santhali, Gondi...',
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
    ],
    generalReply: (query) => `Regarding "${query}": The Ministry of Tribal Affairs guarantees all ST beneficiaries full digital transparency through DigiLocker e-KYC and direct bank transfer without intermediaries. If you need a formal grievance ticket, I can lodge one with the District Tribal Welfare Officer.`
  },
  hi: {
    welcome: (name) => `जोहार / नमस्ते ${name}! मैं जनजातीय कार्य मंत्रालय (MoTA) का 'जनजातीय एआई सहायक (JAGO)' हूँ। मैं सभी 5 छात्रवृत्ति योजनाओं, डीबीटी भुगतान स्थिति, डिजिलॉकर सत्यापन और योजना नियमों में आपकी पूरी सहायता कर सकता हूँ।`,
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
    ],
    conflictReply: 'नमस्ते! जनजातीय कार्य मंत्रालय (MoTA) के "एक सक्रिय छात्रवृत्ति" नियम (GFR 2017) के अनुसार आप एक साथ दो छात्रवृत्तियां नहीं ले सकते।\n\nहालाँकि, TRISHA पोर्टल में स्वचालित अनापत्ति प्रमाण पत्र (Automated NOC) की सुविधा है। यदि आपका चयन NFST फेलोशिप (₹37,000/माह) के लिए होता है, तो आपकी पुरानी पोस्ट-मैट्रिक छात्रवृत्ति सुरक्षित रूप से स्थानांतरित (Transition) हो जाएगी और कोई दोहरा लाभ जुर्माना नहीं लगेगा।',
    dbtReply: 'आपकी हालिया पोस्ट-मैट्रिक डीबीटी राशि ₹18,500 सफलतापूर्वक 12 सितंबर 2026 को आपके भारतीय स्टेट बैंक (SBI) खाते में जमा हो चुकी है (UTR: RBI2026091298412)। आप ट्रैकर टैब से आधिकारिक रसीद डाउनलोड कर सकते हैं।',
    generalReply: (query) => `"${query}" के संबंध में: जनजातीय कार्य मंत्रालय सभी एसटी छात्र-छात्राओं को डिजिलॉकर और प्रत्यक्ष बैंक अंतरण (DBT) के माध्यम से बिना किसी बिचौलिए के पारदर्शी सेवाएं प्रदान करता है। यदि आप शिकायत दर्ज करना चाहते हैं, तो मैं जिला जनजातीय कल्याण अधिकारी के पास टिकट दर्ज कर सकता हूँ।`
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
      },
      {
        q: 'ᱴᱚᱯ ᱠᱞᱟᱥ ᱟᱨᱡᱤ ᱨᱮ ᱪᱮᱫ ᱠᱷᱟᱹᱛᱤᱨ ᱠᱟᱹᱢᱤ ᱵᱟᱹᱠᱤ ᱢᱮᱱᱟᱜ-ᱟ?',
        a: 'ᱨᱟᱡᱽ ᱱᱳᱰᱟᱞ ᱚᱯᱷᱤᱥᱟᱨ ᱱᱟᱣᱟ ᱟᱨᱡᱟᱣ (Income) ᱥᱟᱠᱟᱢ ᱮ ᱠᱷᱚᱡ ᱟᱠᱟᱫ-ᱟ᱾ Tracker ᱥᱟᱦᱴᱟ ᱨᱮ ᱰᱤᱡᱤᱞᱚᱠᱟᱨ ᱛᱮ ᱱᱚᱣᱟ ᱴᱷᱤᱠ ᱜᱟᱱᱚᱜ-ᱟ᱾'
      }
    ],
    conflictReply: 'ᱡᱚᱦᱟᱨ! MoTA ᱨᱮᱱᱟᱜ ᱢᱤᱫ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱱᱤᱭᱟᱹᱢ ᱞᱮᱠᱟᱛᱮ ᱵᱟᱨᱭᱟ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱢᱤᱫ ᱫᱷᱟᱣ ᱨᱮ ᱵᱟᱝ ᱧᱟᱢᱚᱜ-ᱟ᱾ ᱢᱮᱱᱠᱷᱟᱱ TRISHA ᱨᱮ ᱟᱡ ᱛᱮᱜᱮ NOC ᱵᱮᱱᱟᱣ ᱠᱟᱛᱮ NFST ᱯᱷᱮᱞᱳᱥᱤᱯ (₹37,000/ᱪᱟᱸᱫᱚ) ᱨᱮ ᱵᱚᱫᱚᱞ ᱨᱮᱱᱟᱜ ᱥᱩᱵᱤᱫᱷᱟ ᱢᱮᱱᱟᱜ-ᱟ᱾',
    dbtReply: 'ᱟᱢᱟᱜ ₹18,500 ᱰᱤᱵᱤᱴᱤ ᱴᱟᱠᱟ 12 ᱥᱮᱯᱴᱮᱢᱵᱚᱨ 2026 ᱨᱮ SBI ᱵᱮᱸᱠ ᱮᱠᱟᱣᱩᱱᱴ ᱨᱮ ᱡᱚᱢᱟ ᱦᱩᱭ ᱟᱠᱟᱱᱟ (UTR: RBI2026091298412)᱾',
    generalReply: (query) => `"${query}" ᱵᱟᱵᱚᱛ: ᱡᱚᱱᱡᱟᱹᱛᱤᱭᱟᱹᱨᱤ ᱢᱚᱱᱛᱨᱟᱲᱚᱭ ᱥᱟᱱᱟᱢ ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱠᱚ ᱞᱟᱹᱜᱤᱫ ᱰᱤᱡᱤᱞᱚᱠᱟᱨ ᱟᱨ ᱥᱚᱡᱷᱮ ᱵᱮᱸᱠ ᱴᱨᱟᱱᱥᱯᱷᱟᱨ (DBT) ᱛᱮ ᱥᱩᱵᱤᱫᱷᱟᱭ ᱮᱢᱮᱫ-ᱟ᱾`
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
      },
      {
        q: 'टॉप क्लास अर्जी ते काम बोर बाकी मंता?',
        a: 'अफसर ना तरफ ते आय प्रमाण पत्र फेर जांच कीले कह्ता मंता। Tracker ते DigiLocker संगे ठीक कीम।'
      }
    ],
    conflictReply: 'सेवा जोहार! MoTA ना नियम मुतालिक एक बेर ते रोंड (2) छात्रवृत्ति मिले वयो। पण TRISHA ते ऑटोमैटिक NOC कीसी NFST फेलोशिप (₹37,000/महीना) ते जासे सुविधा मंता।',
    dbtReply: 'नीवा ₹18,500 DBT पैसा 12 सितंबर 2026 ते बैंक खाता ते जमा आता (UTR: RBI2026091298412)।',
    generalReply: (query) => `"${query}" बारोत: जनजातीय मंत्रालय सब्बों आदिवासी पोरा-पोरी काजे DBT ते सीधा बैंक पैसा पोहचाने कीतो मंता।`
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
      },
      {
        q: 'ᱯᱳᱥᱴ-ᱢᱮᱴᱨᱤᱠ ᱛᱟᱦᱮᱸᱱ ᱨᱮ NFST ᱯᱷᱮᱞᱳᱥᱤᱯ ᱧᱟᱢᱚᱜ-ᱟ?',
        a: 'MoTA ᱨᱮᱱᱟᱜ ᱢᱤᱫ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱱᱤᱭᱟᱹᱢ ᱞᱮᱠᱟᱛᱮ ᱵᱟᱨᱭᱟ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱢᱤᱫ ᱫᱷᱟᱣ ᱨᱮ ᱵᱟᱝ ᱧᱟᱢᱚᱜ-ᱟ᱾ ᱢᱮᱱᱠᱷᱟᱱ TRISHA ᱨᱮ ᱟᱡ ᱛᱮᱜᱮ NOC ᱵᱮᱱᱟᱣ ᱠᱟᱛᱮ NFST ᱨᱮ ᱵᱚᱫᱚᱞ ᱜᱟᱱᱚᱜ-ᱟ᱾'
      }
    ],
    conflictReply: 'ᱡᱚᱦᱟᱨ! MoTA ᱨᱮᱱᱟᱜ ᱱᱤᱭᱟᱹᱢ ᱞᱮᱠᱟᱛᱮ ᱵᱟᱨᱭᱟ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱢᱤᱫ ᱫᱷᱟᱣ ᱨᱮ ᱵᱟᱝ ᱧᱟᱢᱚᱜ-ᱟ᱾ ᱢᱮᱱᱠᱷᱟᱱ TRISHA ᱨᱮ NOC ᱵᱮᱱᱟᱣ ᱠᱟᱛᱮ NFST ᱨᱮ ᱵᱚᱫᱚᱞ ᱜᱟᱱᱚᱜ-ᱟ᱾',
    dbtReply: 'ᱟᱢᱟᱜ ₹18,500 DBT ᱴᱟᱠᱟ 12 ᱥᱮᱯᱴᱮᱢᱵᱚᱨ 2026 ᱨᱮ SBI ᱮᱠᱟᱣᱩᱱᱴ ᱨᱮ ᱡᱚᱢᱟ ᱦᱩᱭ ᱟᱠᱟᱱᱟ᱾',
    generalReply: (query) => `"${query}" ᱵᱟᱵᱚᱛ: ᱡᱚᱱᱡᱟᱹᱛᱤ ᱢᱚᱱᱛᱨᱤ ᱢᱟᱰᱮᱨ ᱥᱟᱱᱟᱢ ᱦᱳ ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱠᱚ ᱞᱟᱹᱜᱤᱫ ᱰᱤᱡᱤᱞᱚᱠᱟᱨ ᱟᱨ ᱥᱚᱡᱷᱮ ᱵᱮᱸᱠ ᱴᱨᱟᱱᱥᱯᱷᱟᱨ (DBT) ᱛᱮ ᱥᱩᱵᱤᱫᱷᱟᱭ ᱮᱢᱮᱫ-ᱟ᱾`
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
      },
      {
        q: 'पोस्ट-मेट्रिक थानाय समाव NFST फेलोशिप मोनगोन ना?',
        a: 'MoTA नि मोनसेल\' अनसुंथाइ नियम बादियै मोननै अनसुंथाइ लोगोसे मोननो हाया। नाथाय TRISHA आव गावनो गाव NOC बानायना NFST आव सोलायनो हायो।'
      }
    ],
    conflictReply: 'खुलुमबाय! MoTA नि नियम बादियै मोननै अनसुंथाइ लोगोसे मोननो हाया। नाथाय TRISHA आव गावनो गाव NOC बानायना NFST आव सोलायनो हायो।',
    dbtReply: 'नोंथांनि पोस्ट-मेट्रिक अनसुंथाइनि ₹18,500 रांआ SBI बैंक एकाउन्टआव 12 सेप्टेम्बर 2026 आव थांखाबाय।',
    generalReply: (query) => `"${query}" नि बागै: जनजातीय मन्त्रालया गासै बर\' आरो जनजातीय फरायसुफोरनो पारदर्शी DBT रां आरो डिजिलकरजों मदद खालामो।`
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
      },
      {
        q: 'ପୋଷ୍ଟ-ମେଟ୍ରିକ ସହ NFST ଫେଲୋସିପ ମିଳିପାରିବ କି?',
        a: 'MoTA ନିୟମ ଅନୁଯାୟୀ ଏକାଥରେ ଦୁଇଟି ବୃତ୍ତି ମିଳିପାରିବ ନାହିଁ। କିନ୍ତୁ TRISHA ରେ ସ୍ୱୟଂକ୍ରିୟ NOC ଜରିଆରେ ଆପଣ NFST କୁ ବଦଳାଇ ପାରିବେ।'
      }
    ],
    conflictReply: 'ଜୁହାର! MoTA ନିୟମ ଅନୁଯାୟୀ ଏକାଥରେ ଦୁଇଟି ବୃତ୍ତି ମିଳିପାରିବ ନାହିଁ। କିନ୍ତୁ TRISHA ରେ ସ୍ୱୟଂକ୍ରିୟ NOC ଜରିଆରେ ଆପଣ NFST କୁ ବଦଳାଇ ପାରିବେ।',
    dbtReply: 'ଆପଣଙ୍କ ₹୧୮,୫୦୦ DBT ଟଙ୍କା ୧୨ ସେପ୍ଟେମ୍ବର ୨୦୨୬ ରେ SBI ବ୍ୟାଙ୍କ ଖାତାରେ ଜମା ହୋଇସାରିଛି।',
    generalReply: (query) => `"${query}" ବିଷୟରେ: ଜନଜାତି କଲ୍ୟାଣ ମନ୍ତ୍ରଣାଳୟ ସବୁ ଆଦିବାସୀ ଛାତ୍ରଛାତ୍ରୀଙ୍କୁ DBT ମାଧ୍ୟମରେ ସିଧାସଳଖ ବ୍ୟାଙ୍କ ଖାତାକୁ ଟଙ୍କା ପଠାଉଛି।`
  }
}

// Smart language & script auto-detection
function detectLanguage(text, activeLang) {
  if (!text) return activeLang

  // 1. Devanagari script (Hindi, Gondi, Bodo)
  if (/[\u0900-\u097F]/.test(text)) {
    if (activeLang === 'gondi' || activeLang === 'bodo') return activeLang
    return 'hi'
  }

  // 2. Ol Chiki script (Santhali, Ho)
  if (/[\u1C50-\u1C7F]/.test(text)) {
    return 'santhali'
  }

  // 3. Odia script (Kui)
  if (/[\u0B00-\u0B7F]/.test(text)) {
    return 'kui'
  }

  const lower = text.toLowerCase()

  // 4. Explicit user request (e.g., "in Hindi", "hindi me")
  if (lower.includes('hindi') || lower.includes('in hindi') || lower.includes('हिंदी')) {
    return 'hi'
  }
  if (lower.includes('santhali') || lower.includes('santali') || lower.includes('ᱥᱟᱱᱛᱟᱲᱤ')) {
    return 'santhali'
  }
  if (lower.includes('gondi') || lower.includes('गोंडी')) {
    return 'gondi'
  }
  if (lower.includes('english') || lower.includes('angrezi')) {
    return 'en'
  }

  // 5. Romanized Hindi / Hinglish keywords
  const hinglishPatterns = [
    /\b(kya|main|mujhe|mera|meri|mere|milega|mil|rahi|raha|sakta|saktee|hai|hain|hoon|ho|aavedan|shuru|kaise|kab|kitna|paisa|paise|stithi|jaanch|chahiye|kyun|kyu|kaun|dono|pehle|karen|karo|batao|kisi|kisko|unhe)\b/i
  ]
  if (hinglishPatterns.some(regex => regex.test(lower))) {
    return 'hi'
  }

  return activeLang
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
  const chatBottomRef = useRef(null)

  // When language changes, update greeting in that language
  useEffect(() => {
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        text: kb.welcome(activeStudent?.name || 'Priya'),
        citation: kb.citation
      }
    ])
  }, [lang, activeStudent])

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = (textToSend) => {
    const query = textToSend || inputVal
    if (!query.trim()) return

    const userMsg = { id: Date.now(), sender: 'user', text: query }
    setMessages(prev => [...prev, userMsg])
    setInputVal('')

    // Auto-detect query language
    const detectedLang = detectLanguage(query, currentLang)
    const targetKb = KNOWLEDGE_BASE[detectedLang] || kb

    setTimeout(() => {
      let botResponse = ''
      let citation = targetKb.citation
      const lower = query.toLowerCase()

      // Match exact question first
      const matchedQ = targetKb.questions.find(sq => sq.q.toLowerCase() === lower)

      if (matchedQ) {
        botResponse = matchedQ.a
      }
      // 1. One-Active-Scholarship / Conflict Intent (NFST + Post-Matric)
      else if (
        (lower.includes('nfst') || lower.includes('fellowship') || lower.includes('top-class') || lower.includes('top class')) &&
        (lower.includes('post-matric') || lower.includes('pre-matric') || lower.includes('pehle') || lower.includes('already') || lower.includes('dono') || lower.includes('sakta') || lower.includes('milega') || lower.includes('apply') || lower.includes('mil rahi'))
      ) {
        if (detectedLang === 'hi') {
          botResponse = targetKb.conflictReply || 'जनजातीय कार्य मंत्रालय (MoTA) के "एक सक्रिय छात्रवृत्ति" नियम (GFR 2017) के अनुसार आप एक साथ दो छात्रवृत्तियां नहीं ले सकते।\n\nहालाँकि, TRISHA पोर्टल में स्वचालित अनापत्ति प्रमाण पत्र (NOC) की सुविधा है। यदि आपका चयन NFST फेलोशिप (₹37,000/माह) के लिए होता है, तो आपकी पुरानी पोस्ट-मैट्रिक छात्रवृत्ति सुरक्षित रूप से स्थानांतरित (Transition) हो जाएगी और कोई दोहरा लाभ जुर्माना नहीं लगेगा।'
        } else if (detectedLang === 'santhali') {
          botResponse = targetKb.conflictReply || 'MoTA ᱨᱮᱱᱟᱜ ᱢᱤᱫ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱱᱤᱭᱟᱹᱢ ᱞᱮᱠᱟᱛᱮ ᱵᱟᱨᱭᱟ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱢᱤᱫ ᱫᱷᱟᱣ ᱨᱮ ᱵᱟᱝ ᱧᱟᱢᱚᱜ-ᱟ᱾ ᱢᱮᱱᱠᱷᱟᱱ TRISHA ᱨᱮ ᱟᱡ ᱛᱮᱜᱮ NOC ᱵᱮᱱᱟᱣ ᱠᱟᱛᱮ NFST (₹37,000/ᱪᱟᱸᱫᱚ) ᱨᱮ ᱵᱚᱫᱚᱞ ᱜᱟᱱᱚᱜ-ᱟ᱾'
        } else if (detectedLang === 'gondi') {
          botResponse = targetKb.conflictReply || 'MoTA ना नियम मुतालिक एक बेर ते रोंड (2) छात्रवृत्ति मिले वयो। पण TRISHA ते ऑटोमैटिक NOC कीसी NFST फेलोशिप (₹37,000/महीना) ते जासे सुविधा मंता।'
        } else if (detectedLang === 'kui') {
          botResponse = targetKb.conflictReply
        } else {
          botResponse = 'Under MoTA regulations (Rule 11/GFR 2017), simultaneous availing of multiple scholarships is strictly barred. However, TRISHA provides an automated Scheme Transition / Relinquishment NOC feature. If selected for NFST (₹37,000/month), your Post-Matric allocation is safely transitioned without any double-dipping penalty.'
        }
      }
      // 2. DBT Payment / Money Status
      else if (lower.includes('dbt') || lower.includes('payment') || lower.includes('money') || lower.includes('paisa') || lower.includes('paise') || lower.includes('rupaye') || lower.includes('kab aayega') || lower.includes('ᱴᱟᱠᱟ')) {
        if (detectedLang === 'hi') {
          botResponse = targetKb.dbtReply || 'आपकी हालिया पोस्ट-मैट्रिक डीबीटी राशि ₹18,500 सफलतापूर्वक 12 सितंबर 2026 को आपके भारतीय स्टेट बैंक (SBI) खाते में जमा हो चुकी है (UTR: RBI2026091298412)।'
        } else if (detectedLang === 'santhali') {
          botResponse = targetKb.dbtReply || 'ᱟᱢᱟᱜ ₹18,500 ᱰᱤᱵᱤᱴᱤ ᱴᱟᱠᱟ 12 ᱥᱮᱯᱴᱮᱢᱵᱚᱨ 2026 ᱨᱮ SBI ᱮᱠᱟᱣᱩᱱᱴ ᱨᱮ ᱡᱚᱢᱟ ᱦᱩᱭ ᱟᱠᱟᱱᱟ᱾'
        } else if (detectedLang === 'gondi') {
          botResponse = targetKb.dbtReply
        } else if (detectedLang === 'kui') {
          botResponse = targetKb.dbtReply
        } else {
          botResponse = 'Your recent Post-Matric DBT credit of ₹18,500 was successfully remitted on 12 September 2026 to your SBI account (UTR: RBI2026091298412). Check your Tracker tab for the certified statement.'
        }
      }
      // 3. NFST Fellowship General Query
      else if (lower.includes('nfst') || lower.includes('fellowship') || lower.includes('phd')) {
        if (detectedLang === 'hi') {
          botResponse = 'NFST (राष्ट्रीय फेलोशिप) एम.फिल और पीएच.डी. करने वाले एसटी शोधार्थियों को केनरा बैंक SFMP के माध्यम से ₹37,000/माह (JRF) और ₹42,000/माह (SRF) प्रदान करती है। प्रतिवर्ष देश भर से 750 शोधार्थी चुने जाते हैं।'
        } else if (detectedLang === 'santhali') {
          botResponse = 'NFST ᱯᱷᱮᱞᱳᱥᱤᱯ ᱫᱚ M.Phil ᱟᱨ Ph.D ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱠᱚ ᱞᱟᱹᱜᱤᱫ ₹37,000/ᱪᱟᱸᱫᱚ (JRF) Canara Bank SFMP ᱛᱮ ᱮᱢᱚᱜ-ᱟ᱾'
        } else if (detectedLang === 'gondi') {
          botResponse = 'NFST फेलोशिप M.Phil अउर Ph.D पोरा काजे ₹37,000/महीना (JRF) Canara Bank SFMP ते देवे मंता।'
        } else {
          botResponse = 'NFST (National Fellowship for ST Students) offers ₹37,000/month (JRF) and ₹42,000/month (SRF) via Canara Bank SFMP for regular Ph.D scholars across 750 slots nationally.'
        }
      }
      // 4. General Reply
      else {
        botResponse = targetKb.generalReply(query)
      }

      setMessages(prev => [
        ...prev, 
        { id: Date.now() + 1, sender: 'bot', text: botResponse, citation }
      ])

      // If user typed in another language, update the dropdown dialect
      if (detectedLang !== currentLang && setLang) {
        setLang(detectedLang)
      }
    }, 500)
  }

  const toggleMic = () => {
    if (!listening) {
      setListening(true)
      const langNames = {
        en: 'English',
        hi: 'हिंदी (Hindi)',
        santhali: 'ᱥᱟᱱᱛᱟᱲᱤ (Santhali)',
        gondi: 'गोंडी (Gondi)',
        ho: 'ᱦᱳ (Ho)',
        bodo: 'बड़ो (Bodo)',
        kui: 'କୁଇ (Kui)'
      }
      onToast?.(`Listening for voice in ${langNames[lang] || 'Selected Dialect'}...`, 'info')
      
      setTimeout(() => {
        setListening(false)
        const sampleQuery = kb.questions[0]?.q || 'What is my scholarship status?'
        setInputVal(sampleQuery)
        onToast?.('Voice transcribed successfully!', 'success')
      }, 1800)
    } else {
      setListening(false)
    }
  }

  const handleSpeak = (text) => {
    onToast?.(kb.speakingToast, 'info')
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      if (lang === 'hi') utterance.lang = 'hi-IN'
      else utterance.lang = 'en-IN'
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="assistant-view fade-in">
      <div className="assistant-header gov-card">
        <div className="assistant-header-left">
          <div className="ai-avatar-circle">
            <Bot size={24} />
          </div>
          <div>
            <div className="assistant-badge-row">
              <span className="badge badge-primary">Multilingual Voice & NLP</span>
              <span className="badge badge-success">MoTA AI Sahayak (JAGO)</span>
            </div>
            <h1 className="assistant-title">Tribal Student Grievance & Guidance Assistant</h1>
          </div>
        </div>

        <div className="assistant-header-right">
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

      {/* Suggested Questions Grid in Current Selected Language */}
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
                <p className="bubble-text" style={{ whiteSpace: 'pre-line' }}>{msg.text}</p>
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
                      <Volume2 size={13} /> Listen
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <div className="chat-input-bar">
          <button 
            className={`mic-button ${listening ? 'mic-listening' : ''}`}
            onClick={toggleMic}
            title="Speak query in tribal dialect or Hindi"
          >
            {listening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          <input 
            type="text" 
            placeholder={listening ? "Listening to your voice..." : kb.inputPlaceholder}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="chat-text-input"
          />

          <button 
            className="btn btn-primary send-chat-btn"
            onClick={() => handleSend()}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
