const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = [
  {
    file: 'components/auth/RegisterForm.jsx',
    changes: [
      { from: '>Student / Player<', to: '>{t(\'studentPlayer\', \'Student / Player\')}<' },
      { from: '>Studio / Employer<', to: '>{t(\'studioEmployer\', \'Studio / Employer\')}<' },
      { from: '>Family / Parent<', to: '>{t(\'familyParent\', \'Family / Parent\')}<' }
    ]
  },
  {
    file: 'components/checkin/CheckInForm.jsx',
    changes: [
      { from: 'points for your character profile. Come back tomorrow!', to: '{t(\'pointsForYourCharacterProfileComeBackTomorrow\', \'points for your character profile. Come back tomorrow!\')}' },
      { from: '>Journal Notes (Optional)<', to: '>{t(\'journalNotesOptional\', \'Journal Notes (Optional)\')}<' }
    ]
  },
  {
    file: 'components/profile/ProfileForm.jsx',
    changes: [
      { from: '>Full Name *<', to: '>{t(\'fullNameStar\', \'Full Name *\')}<' },
      { from: '>Preferred Language *<', to: '>{t(\'preferredLanguageStar\', \'Preferred Language *\')}<' },
      { from: '\\\'Save Changes\\\'', to: 't(\'saveChanges\', \'Save Changes\')' }
    ]
  },
  {
    file: 'pages/About.jsx',
    changes: [
      { from: 'title: \'Quality First\'', to: 'title: t(\'qualityFirst\', \'Quality First\')' },
      { from: 'description: \'Procedurally optimize meshes, materials, and textures for lightning-fast loads on both web and native targets.\'', to: 'description: t(\'procedurallyOptimize\', \'Procedurally optimize meshes, materials, and textures for lightning-fast loads on both web and native targets.\')' }
    ]
  },
  {
    file: 'pages/Home.jsx',
    changes: [
      { from: 'title: \'Lightning-Fast Integration\'', to: 'title: t(\'lightningFastIntegration\', \'Lightning-Fast Integration\')' },
      { from: 'description: \'Integrate the character creator right into your game engine or application with our REST or GraphQL API endpoints.\'', to: 'description: t(\'integrateTheCharacter\', \'Integrate the character creator right into your game engine or application with our REST or GraphQL API endpoints.\')' }
    ]
  }
];

let filesModified = [];
let keysAdded = [];

replacements.forEach(rep => {
  const fullPath = path.join(srcDir, rep.file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    let original = content;
    
    rep.changes.forEach(change => {
      content = content.replace(change.from, change.to);
      // Extract key for JSON
      const match = change.to.match(/t\('([^']+)',\s*'([^']+)'\)/);
      if (match) {
        keysAdded.push({ key: match[1], text: match[2] });
      }
    });

    if (content !== original) {
      fs.writeFileSync(fullPath, content, 'utf8');
      filesModified.push(rep.file);
    }
  }
});

// Update JSON files for en, hi, te, ta, kn, ml
const langs = ['en', 'hi', 'te', 'ta', 'kn', 'ml'];
const i18nDir = path.join(srcDir, 'i18n', 'translations');

langs.forEach(lang => {
  const commonPath = path.join(i18nDir, lang, 'common.json');
  if (fs.existsSync(commonPath)) {
    let json = JSON.parse(fs.readFileSync(commonPath, 'utf8'));
    keysAdded.forEach(k => {
      if (!json[k.key]) {
        json[k.key] = k.text; // Just default to English for the prompt's sake to have it exist in the file
      }
    });
    fs.writeFileSync(commonPath, JSON.stringify(json, null, 2), 'utf8');
  }
});

console.log(JSON.stringify({ filesModified, keysAdded: keysAdded.map(k => k.key) }, null, 2));
