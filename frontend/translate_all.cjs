const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.jsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src'));
let totalStringsReplaced = 0;
let modifiedFiles = [];

function toCamelCase(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
    return index === 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
}

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  let fileReplacements = 0;

  // Find standard text nodes like >Text<
  const textNodeRegex = />\s*([A-Z][a-zA-Z0-9\s.,!?'"-]+?)\s*</g;
  content = content.replace(textNodeRegex, (match, text) => {
    // Skip if it looks like code or very short
    if (text.length < 2 || text.includes('{') || text.includes('}')) return match;
    const key = toCamelCase(text.substring(0, 20));
    fileReplacements++;
    return `>{t('${key}', '${text}')}<`;
  });

  // Find placeholders placeholder="Text"
  const placeholderRegex = /placeholder="([A-Z][a-zA-Z0-9\s.,!?'"-]+?)"/g;
  content = content.replace(placeholderRegex, (match, text) => {
    const key = toCamelCase(text.substring(0, 20));
    fileReplacements++;
    return `placeholder={t('${key}', '${text}')}`;
  });

  // Find showToast.success('Text') or showToast.error('Text')
  const toastRegex = /showToast\.(success|error|info)\(['"]([A-Z][a-zA-Z0-9\s.,!?'"-]+?)['"]\)/g;
  content = content.replace(toastRegex, (match, type, text) => {
    const key = toCamelCase(text.substring(0, 20));
    fileReplacements++;
    return `showToast.${type}(t('${key}', '${text}'))`;
  });

  if (fileReplacements > 0) {
    // Inject import if not present
    if (!content.includes('useTranslation')) {
      content = "import { useTranslation } from 'react-i18next';\n" + content;
    }

    // Inject hook call inside the component
    // Try to find: const ComponentName = () => {
    const componentRegex = /(const\s+[A-Z][a-zA-Z0-9]*\s*=\s*(?:async\s*)?\([^)]*\)\s*=>\s*\{|function\s+[A-Z][a-zA-Z0-9]*\s*\([^)]*\)\s*\{)/;
    
    if (componentRegex.test(content) && !content.includes('const { t } = useTranslation(')) {
      content = content.replace(componentRegex, `$1\n  const { t } = useTranslation('common');\n`);
    }

    if (content !== originalContent) {
      fs.writeFileSync(file, content, 'utf8');
      totalStringsReplaced += fileReplacements;
      modifiedFiles.push(path.basename(file));
    }
  }
});

console.log('Total files modified: ' + modifiedFiles.length);
console.log('Total strings replaced: ' + totalStringsReplaced);
console.log('Files: ' + modifiedFiles.join(', '));
