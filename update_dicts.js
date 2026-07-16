const fs = require('fs');
const path = require('path');

const translations = {
  en: {
    integrityTitle: "Integrity Foundation",
    integrityDescription: "Learn the core principles of integrity, honesty, and maintaining strong moral principles in daily life.",
    respectTitle: "The Power of Respect",
    respectDescription: "Understand how respect builds trust and fosters healthy relationships in personal and professional environments.",
    leadershipTitle: "Leadership Essentials",
    leadershipDescription: "Master the art of inspiring others, taking initiative, and leading by example.",
    responsibilityTitle: "Taking Responsibility",
    responsibilityDescription: "Discover the importance of owning your actions, decisions, and learning from mistakes.",
    empathyTitle: "Practicing Empathy",
    empathyDescription: "Develop your emotional intelligence and learn to understand and share the feelings of others.",
    disciplineTitle: "Discipline & Focus",
    disciplineDescription: "Build robust habits, overcome procrastination, and achieve your long-term goals through strict discipline."
  },
  hi: {
    integrityTitle: "सत्यनिष्ठा की नींव",
    integrityDescription: "सत्यनिष्ठा, ईमानदारी और दैनिक जीवन में मजबूत नैतिक सिद्धांतों को बनाए रखने के मूल सिद्धांत सीखें।",
    respectTitle: "सम्मान की शक्ति",
    respectDescription: "समझें कि कैसे सम्मान विश्वास बनाता है और व्यक्तिगत व व्यावसायिक वातावरण में स्वस्थ संबंधों को बढ़ावा देता है।",
    leadershipTitle: "नेतृत्व के मूल तत्व",
    leadershipDescription: "दूसरों को प्रेरित करने, पहल करने और उदाहरण द्वारा नेतृत्व करने की कला में महारत हासिल करें।",
    responsibilityTitle: "जिम्मेदारी लेना",
    responsibilityDescription: "अपने कार्यों, निर्णयों के प्रति जवाबदेह होने और गलतियों से सीखने के महत्व को जानें।",
    empathyTitle: "सहानुभूति का अभ्यास",
    empathyDescription: "अपनी भावनात्मक बुद्धिमत्ता विकसित करें और दूसरों की भावनाओं को समझना और साझा करना सीखें।",
    disciplineTitle: "अनुशासन और ध्यान",
    disciplineDescription: "मजबूत आदतें बनाएं, टालमटोल पर काबू पाएं और सख्त अनुशासन के माध्यम से अपने दीर्घकालिक लक्ष्य प्राप्त करें।"
  },
  te: {
    integrityTitle: "సమగ్రత ఫౌండేషన్",
    integrityDescription: "సమగ్రత, నిజాయితీ మరియు దైనందిన జీవితంలో బలమైన నైతిక సూత్రాలను నిర్వహించడం యొక్క ప్రధాన సూత్రాలను తెలుసుకోండి.",
    respectTitle: "గౌరవం యొక్క శక్తి",
    respectDescription: "గౌరవం విశ్వాసాన్ని ఎలా నిర్మిస్తుందో మరియు వ్యక్తిగత, వృత్తిపరమైన వాతావరణంలో ఆరోగ్యకరమైన సంబంధాలను ఎలా పెంపొందిస్తుందో అర్థం చేసుకోండి.",
    leadershipTitle: "నాయకత్వ అవసరాలు",
    leadershipDescription: "ఇతరులను ప్రేరేపించడం, చొరవ తీసుకోవడం మరియు ఆదర్శంగా నిలవడం అనే కళలో నైపుణ్యం సాధించండి.",
    responsibilityTitle: "బాధ్యత వహించడం",
    responsibilityDescription: "మీ చర్యలు, నిర్ణయాలను సొంతం చేసుకోవడం మరియు తప్పుల నుండి నేర్చుకోవడం యొక్క ప్రాముఖ్యతను కనుగొనండి.",
    empathyTitle: "సానుభూతిని సాధన చేయడం",
    empathyDescription: "మీ భావోద్వేగ మేధస్సును అభివృద్ధి చేసుకోండి మరియు ఇతరుల భావాలను అర్థం చేసుకోవడం మరియు పంచుకోవడం నేర్చుకోండి.",
    disciplineTitle: "క్రమశిక్షణ & ఏకాగ్రత",
    disciplineDescription: "బలమైన అలవాట్లను పెంచుకోండి, వాయిదా వేయడాన్ని అధిగమించండి మరియు కఠినమైన క్రమశిక్షణ ద్వారా మీ దీర్ఘకాలిక లక్ష్యాలను సాధించండి."
  },
  ta: {
    integrityTitle: "நேர்மை அறக்கட்டளை",
    integrityDescription: "நேர்மை, சத்தியம் மற்றும் அன்றாட வாழ்வில் வலுவான தார்மீக கொள்கைகளை பராமரிக்கும் அடிப்படை கொள்கைகளை கற்றுக்கொள்ளுங்கள்.",
    respectTitle: "மரியாதையின் சக்தி",
    respectDescription: "மரியாதை எவ்வாறு நம்பிக்கையை உருவாக்குகிறது மற்றும் தனிப்பட்ட மற்றும் தொழில்முறை சூழல்களில் ஆரோக்கியமான உறவுகளை வளர்க்கிறது என்பதை புரிந்து கொள்ளுங்கள்.",
    leadershipTitle: "தலைமைத்துவ அடிப்படைகள்",
    leadershipDescription: "மற்றவர்களை ஊக்குவித்தல், முன்முயற்சி எடுத்தல் மற்றும் உதாரணமாக வழிநடத்தும் கலையில் தேர்ச்சி பெறுங்கள்.",
    responsibilityTitle: "பொறுப்பு ஏற்பது",
    responsibilityDescription: "உங்கள் செயல்கள், முடிவுகளை ஏற்றுக்கொள்வது மற்றும் தவறுகளில் இருந்து கற்றுக்கொள்வதன் முக்கியத்துவத்தை கண்டறியவும்.",
    empathyTitle: "பச்சாதாபத்தை பயிற்சி செய்தல்",
    empathyDescription: "உங்கள் உணர்ச்சி நுண்ணறிவை வளர்த்துக் கொள்ளுங்கள் மற்றும் மற்றவர்களின் உணர்வுகளை புரிந்துகொள்ளவும் பகிர்ந்து கொள்ளவும் கற்றுக்கொள்ளுங்கள்.",
    disciplineTitle: "ஒழுக்கம் மற்றும் கவனம்",
    disciplineDescription: "வலுவான பழக்கங்களை உருவாக்குங்கள், தள்ளிப்போடுவதை சமாளியுங்கள் மற்றும் கடுமையான ஒழுக்கத்தின் மூலம் உங்கள் நீண்டகால இலக்குகளை அடையுங்கள்."
  },
  kn: {
    integrityTitle: "ಸಮಗ್ರತೆ ಫೌಂಡೇಶನ್",
    integrityDescription: "ಸಮಗ್ರತೆ, ಪ್ರಾಮಾಣಿಕತೆ ಮತ್ತು ದೈನಂದಿನ ಜೀವನದಲ್ಲಿ ಬಲವಾದ ನೈತಿಕ ತತ್ವಗಳನ್ನು ಕಾಪಾಡಿಕೊಳ್ಳುವ ಪ್ರಮುಖ ತತ್ವಗಳನ್ನು ಕಲಿಯಿರಿ.",
    respectTitle: "ಗೌರವದ ಶಕ್ತಿ",
    respectDescription: "ಗೌರವವು ನಂಬಿಕೆಯನ್ನು ಹೇಗೆ ಬೆಳೆಸುತ್ತದೆ ಮತ್ತು ವೈಯಕ್ತಿಕ ಹಾಗೂ ವೃತ್ತಿಪರ ಪರಿಸರಗಳಲ್ಲಿ ಆರೋಗ್ಯಕರ ಸಂಬಂಧಗಳನ್ನು ಹೇಗೆ ಪೋಷಿಸುತ್ತದೆ ಎಂಬುದನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ.",
    leadershipTitle: "ನಾಯಕತ್ವದ ಅಗತ್ಯತೆಗಳು",
    leadershipDescription: "ಇತರರನ್ನು ಪ್ರೇರೇಪಿಸುವ, ಉಪಕ್ರಮವನ್ನು ತೆಗೆದುಕೊಳ್ಳುವ ಮತ್ತು ಉದಾಹರಣೆಯ ಮೂಲಕ ಮುನ್ನಡೆಸುವ ಕಲೆಯನ್ನು ಕರಗತ ಮಾಡಿಕೊಳ್ಳಿ.",
    responsibilityTitle: "ಹೊಣೆಗಾರಿಕೆ ತೆಗೆದುಕೊಳ್ಳುವುದು",
    responsibilityDescription: "ನಿಮ್ಮ ಕ್ರಿಯೆಗಳು, ನಿರ್ಧಾರಗಳನ್ನು ಹೊಂದುವುದು ಮತ್ತು ತಪ್ಪುಗಳಿಂದ ಕಲಿಯುವ ಪ್ರಾಮುಖ್ಯತೆಯನ್ನು ಕಂಡುಕೊಳ್ಳಿ.",
    empathyTitle: "ಸಹಾನುಭೂತಿಯ ಅಭ್ಯಾಸ",
    empathyDescription: "ನಿಮ್ಮ ಭಾವನಾತ್ಮಕ ಬುದ್ಧಿವಂತಿಕೆಯನ್ನು ಬೆಳೆಸಿಕೊಳ್ಳಿ ಮತ್ತು ಇತರರ ಭಾವನೆಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಮತ್ತು ಹಂಚಿಕೊಳ್ಳಲು ಕಲಿಯಿರಿ.",
    disciplineTitle: "ಶಿಸ್ತು ಮತ್ತು ಏಕಾಗ್ರತೆ",
    disciplineDescription: "ಬಲವಾದ ಅಭ್ಯಾಸಗಳನ್ನು ಬೆಳೆಸಿಕೊಳ್ಳಿ, ಮುಂದೂಡುವುದನ್ನು ಜಯಿಸಿ ಮತ್ತು ಕಟ್ಟುನಿಟ್ಟಾದ ಶಿಸ್ತಿನ ಮೂಲಕ ನಿಮ್ಮ ದೀರ್ಘಕಾಲೀನ ಗುರಿಗಳನ್ನು ಸಾಧಿಸಿ."
  },
  ml: {
    integrityTitle: "സമഗ്രതാ അടിസ്ഥാനം",
    integrityDescription: "ദൈനംദിന ജീവിതത്തിൽ സമഗ്രത, സത്യസന്ധത, ശക്തമായ ധാർമ്മിക തത്വങ്ങൾ എന്നിവ കാത്തുസൂക്ഷിക്കുന്നതിൻ്റെ പ്രധാന തത്വങ്ങൾ പഠിക്കുക.",
    respectTitle: "ബഹുമാനത്തിൻ്റെ ശക്തി",
    respectDescription: "ബഹുമാനം എങ്ങനെ വിശ്വാസം വളർത്തുന്നുവെന്നും വ്യക്തിപരവും തൊഴിൽപരവുമായ ചുറ്റുപാടുകളിൽ ആരോഗ്യകരമായ ബന്ധങ്ങൾ വളർത്തുന്നുവെന്നും മനസ്സിലാക്കുക.",
    leadershipTitle: "നേതൃത്വത്തിൻ്റെ അവശ്യഘടകങ്ങൾ",
    leadershipDescription: "മറ്റുള്ളവരെ പ്രചോദിപ്പിക്കുക, മുൻകൈയെടുക്കുക, മാതൃകാപരമായി നയിക്കുക എന്നീ കലകളിൽ പ്രാവീണ്യം നേടുക.",
    responsibilityTitle: "ഉത്തരവാദിത്തം ഏറ്റെടുക്കുന്നു",
    responsibilityDescription: "നിങ്ങളുടെ പ്രവർത്തനങ്ങളുടെയും തീരുമാനങ്ങളുടെയും ഉത്തരവാദിത്തം ഏറ്റെടുക്കുന്നതിൻ്റെയും തെറ്റുകളിൽ നിന്ന് പഠിക്കുന്നതിൻ്റെയും പ്രാധാന്യം കണ്ടെത്തുക.",
    empathyTitle: "സഹാനുഭൂതി പരിശീലിക്കുന്നു",
    empathyDescription: "നിങ്ങളുടെ വൈകാരിക ബുദ്ധി വികസിപ്പിക്കുകയും മറ്റുള്ളവരുടെ വികാരങ്ങൾ മനസ്സിലാക്കാനും പങ്കിടാനും പഠിക്കുക.",
    disciplineTitle: "അച്ചടക്കവും ശ്രദ്ധയും",
    disciplineDescription: "ശക്തമായ ശീലങ്ങൾ കെട്ടിപ്പടുക്കുക, നീട്ടിവെക്കൽ ഒഴിവാക്കുക, കർശനമായ അച്ചടക്കത്തിലൂടെ നിങ്ങളുടെ ദീർഘകാല ലക്ഷ്യങ്ങൾ നേടുക."
  }
};

const baseDir = path.join(__dirname, 'frontend', 'src', 'i18n', 'translations');

Object.keys(translations).forEach(lang => {
  const filePath = path.join(baseDir, lang, 'learning.json');
  if (fs.existsSync(filePath)) {
    const existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const updated = { ...existing, ...translations[lang] };
    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), 'utf8');
  }
});

console.log('Dictionaries updated!');
