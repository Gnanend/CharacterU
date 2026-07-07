const fs = require('fs');
const glob = require('glob');
const path = require('path');

const files = glob.sync('frontend/src/**/*.{js,jsx}');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Remove standalone 'import React from "react";'
  if (/^import React from ['"]react['"];?\s*$/m.test(content)) {
    content = content.replace(/^import React from ['"]react['"];?\s*$/m, '');
    changed = true;
  }

  // Replace 'import React, { ... } from "react";' with 'import { ... } from "react";'
  if (/^import React,\s*\{/m.test(content)) {
    content = content.replace(/^import React,\s*\{/gm, 'import {');
    changed = true;
  }

  // Fix unused 't' in Login.jsx
  if (file.endsWith('Login.jsx')) {
    content = content.replace(/const \{ t \} = useTranslation\(['"]auth['"]\);\s*/, '');
    content = content.replace(/import \{ useTranslation \} from ['"]react-i18next['"];?\s*/, '');
    changed = true;
  }

  // Fix unused 'Heart' in Profile.jsx
  if (file.endsWith('Profile.jsx')) {
    content = content.replace(/Heart,\s*/g, '');
    content = content.replace(/,\s*Heart/g, '');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
  }
});
console.log('Cleaned unused imports.');
