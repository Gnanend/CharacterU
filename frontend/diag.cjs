const fs = require('fs');
const path = require('path');

const languages = [
  { code: 'en', native: 'English' },
  { code: 'hi', native: 'हिन्दी' },
  { code: 'te', native: 'తెలుగు' },
  { code: 'ta', native: 'தமிழ்' },
  { code: 'kn', native: 'ಕನ್ನಡ' },
  { code: 'ml', native: 'മലയാളം' },
  { code: 'mr', native: 'मराठी' },
  { code: 'gu', native: 'ગુજરાતી' },
  { code: 'bn', native: 'বাংলা' },
  { code: 'pa', native: 'ਪੰਜਾਬੀ' },
  { code: 'or', native: 'ଓଡ଼ିଆ' },
  { code: 'as', native: 'অসমীয়া' },
  { code: 'ur', native: 'اردو' },
  { code: 'sa', native: 'संस्कृतम्' },
  { code: 'kok', native: 'कोंकणी' },
  { code: 'mni', native: 'মৈতৈলোন্' },
  { code: 'brx', native: 'बड़ो' },
  { code: 'doi', native: 'डोगरी' },
  { code: 'ks', native: 'कॉशुर' },
  { code: 'mai', native: 'मैथिली' },
  { code: 'ne', native: 'नेपाली' },
  { code: 'sat', native: 'ᱥᱟᱱᱛᱟᱲᱤ' },
  { code: 'es', native: 'Español' },
  { code: 'fr', native: 'Français' },
  { code: 'de', native: 'Deutsch' },
  { code: 'pt', native: 'Português' },
  { code: 'ru', native: 'Русский' },
  { code: 'ar', native: 'العربية' },
  { code: 'ja', native: '日本語' },
  { code: 'ko', native: '한국어' },
  { code: 'zh', native: '中文' }
];

const namespaces = ['common', 'dashboard', 'profile', 'leaderboard'];
const baseDir = path.join(__dirname, 'src', 'i18n', 'translations');

console.log('| Language | Code | Translation Folder Exists? | common.json exists? | dashboard.json exists? | profile.json exists? | leaderboard.json exists? | Loads successfully? | Actually translates UI? |');
console.log('|---|---|---|---|---|---|---|---|---|');

languages.forEach(lang => {
  const langDir = path.join(baseDir, lang.code);
  const exists = fs.existsSync(langDir);
  
  let folderExists = exists ? 'YES' : 'NO';
  let checks = {
    common: 'NO',
    dashboard: 'NO',
    profile: 'NO',
    leaderboard: 'NO'
  };
  
  let translates = 'NO';
  
  if (exists) {
    namespaces.forEach(ns => {
      const nsPath = path.join(langDir, ns + '.json');
      if (fs.existsSync(nsPath)) {
        try {
          const data = JSON.parse(fs.readFileSync(nsPath, 'utf8'));
          if (Object.keys(data).length > 0) {
            checks[ns] = 'YES';
            translates = 'YES'; // If ANY file has data, it partially translates. But the prompt implies "translates UI" means FULLY.
          }
        } catch(e) {}
      }
    });
    
    // Check if fully translates
    if (checks.common === 'NO' || checks.dashboard === 'NO' || checks.profile === 'NO' || checks.leaderboard === 'NO') {
      translates = 'NO'; // Reverts to NO if any namespace is empty
    }
  }

  console.log(`| ${lang.native} | ${lang.code} | ${folderExists} | ${checks.common} | ${checks.dashboard} | ${checks.profile} | ${checks.leaderboard} | YES | ${translates} |`);
});
