import fs from 'fs';
import path from 'path';
import { translate } from '@vitalets/google-translate-api';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const langs = ['ml'];
const i18nDir = path.join(__dirname, 'src', 'i18n', 'translations');

async function processTranslations() {
  let stats = { ml: 0 };

  for (const lang of langs) {
    const langDir = path.join(i18nDir, lang);
    if (!fs.existsSync(langDir)) continue;

    const files = fs.readdirSync(langDir).filter(f => f.endsWith('.json'));
    
    for (const file of files) {
      const filePath = path.join(langDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const keys = Object.keys(data);
      
      let modified = false;

      for (const key of keys) {
        const val = data[key];
        // If the value contains english letters, translate it
        if (/[a-zA-Z]/.test(val)) {
          try {
            await new Promise(r => setTimeout(r, 1200)); // larger delay to prevent IP ban
            const res = await translate(val, { to: lang });
            data[key] = res.text;
            stats[lang]++;
            modified = true;
            console.log(`Translated [${lang}] ${key}: ${val} -> ${res.text}`);
          } catch (e) {
            console.error(`Failed to translate ${val} to ${lang}:`, e.message);
          }
        }
      }

      if (modified) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      }
    }
  }

  console.log('\n--- TRANSLATION REPORT ---');
  console.log('ml: ' + stats.ml + ' values translated');
}

processTranslations();
