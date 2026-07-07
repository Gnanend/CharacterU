const fs = require('fs');
const path = require('path');

const mlTranslations = {
  "welcome": "സ്വാഗതം",
  "integrateTheCharacter": "ഞങ്ങളുടെ REST അല്ലെങ്കിൽ GraphQL API എൻഡ് പോയിൻ്റുകൾ ഉപയോഗിച്ച് നിങ്ങളുടെ ഗെയിം എഞ്ചിനിലേക്കോ ആപ്ലിക്കേഷനിലേക്കോ ക്യാരക്ടർ സ്രഷ്ടാവിനെ സംയോജിപ്പിക്കുക.",
  "youExampleCom": "you@example.com",
  "partnerCharacteruCom": "partner@characteru.com",
  "characterScore": "ക്യാരക്ടർ സ്കോർ",
  "vsLastWeek": "കഴിഞ്ഞ ആഴ്ചയെ അപേക്ഷിച്ച്",
  "currentStreak": "നിലവിലെ സ്ട്രീക്ക്",
  "pledgesActive": "സജീവമായ പ്രതിജ്ഞകൾ",
  "pendingReview": "അവലോകനത്തിനായി കാത്തിരിക്കുന്നു",
  "currentRank": "നിലവിലെ റാങ്ക്",
  "pts": "പോയിൻ്റുകൾ",
  "noRecentActivity": "സമീപകാല പ്രവർത്തനങ്ങളൊന്നുമില്ല",
  "completeYourDailyCheckInOrSubm": "നിങ്ങളുടെ ദൈനംദിന പരിശോധന പൂർത്തിയാക്കുകയോ പ്രതിജ്ഞ സമർപ്പിക്കുകയോ ചെയ്യുക.",
  "savingYourCheckIn": "നിങ്ങളുടെ ചെക്ക്-ഇൻ സംരക്ഷിക്കുന്നു...",
  "uploadingVideoSecure": "സുരക്ഷിത സംഭരണത്തിലേക്ക് വീഡിയോ അപ്‌ലോഡ് ചെയ്യുന്നു...",
  "submittingYourPledge": "നിങ്ങളുടെ പ്രതിജ്ഞ സമർപ്പിക്കുന്നു...",
  "errorSubmittingPledge": "നിങ്ങളുടെ പ്രതിജ്ഞ സമർപ്പിക്കുമ്പോൾ ഒരു പിശക് സംഭവിച്ചു.",
  "uploadingMedia": "മീഡിയ അപ്‌ലോഡ് ചെയ്യുന്നു...",
  "submittingPledgeStatus": "പ്രതിജ്ഞ സമർപ്പിക്കുന്നു...",
  "submitPledgeButton": "പ്രതിജ്ഞ സമർപ്പിക്കുക",
  "fullNameMinLength": "പൂർണ്ണനാമത്തിൽ കുറഞ്ഞത് 2 അക്ഷരങ്ങൾ ഉണ്ടായിരിക്കണം.",
  "fullNameMaxLength": "പൂർണ്ണനാമം 100 അക്ഷരങ്ങളിൽ കൂടരുത്.",
  "cityMaxLength": "നഗരം 100 അക്ഷരങ്ങളിൽ കൂടരുത്.",
  "countryMaxLength": "രാജ്യം 100 അക്ഷരങ്ങളിൽ കൂടരുത്.",
  "languageRequired": "ഭാഷ ആവശ്യമാണ്.",
  "failedToUpdateProfile": "പ്രൊഫൈൽ അപ്ഡേറ്റ് ചെയ്യുന്നതിൽ പരാജയപ്പെട്ടു",
  "saveChangesButton": "മാറ്റങ്ങൾ സംരക്ഷിക്കുക",
  "helpedSomeone": "ഒരാളെ സഹായിച്ചു",
  "avoidedConflict": "സംഘർഷം ഒഴിവാക്കി",
  "exercised": "വ്യായാമം ചെയ്തു",
  "learnedSomething": "എന്തെങ്കിലും പഠിച്ചു",
  "caredForFamily": "കുടുംബത്തെ പരിപാലിച്ചു",
  "plantedTree": "മരം നട്ടു",
  "avoidedHate": "വെറുപ്പ് ഒഴിവാക്കി",
  "donated": "സംഭാവന ചെയ്തു",
  "volunteered": "സന്നദ്ധസേവനം നടത്തി",
  "practicedHonesty": "സത്യസന്ധത പാലിച്ചു",
  "respectedOthers": "മറ്റുള്ളവരെ ബഹുമാനിച്ചു",
  "avoidedWaste": "മാലിന്യം ഒഴിവാക്കി",
  "title": "ശീർഷകം"
};

const mlDir = path.join(__dirname, 'src/i18n/translations', 'ml');
const files = fs.readdirSync(mlDir).filter(f => f.endsWith('.json'));

let translatedCount = 0;

files.forEach(file => {
  const filePath = path.join(mlDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let modified = false;

  Object.keys(data).forEach(key => {
    if (/[a-zA-Z]/.test(data[key])) {
      if (mlTranslations[key]) {
        data[key] = mlTranslations[key];
        modified = true;
        translatedCount++;
      } else if (mlTranslations[data[key]]) {
        data[key] = mlTranslations[data[key]];
        modified = true;
        translatedCount++;
      }
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  }
});

console.log('ML translated correctly: ' + translatedCount);
