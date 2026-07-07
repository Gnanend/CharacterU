const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
const t = require('@babel/types');

const srcDir = path.join(__dirname, 'src');

function camelCase(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
    return index === 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').substring(0, 30);
}

const targetProps = ['title', 'subtitle', 'description', 'label', 'placeholder', 'trendLabel', 'alt', 'text', 'message'];
const languages = ['en', 'hi', 'te', 'ta', 'kn', 'ml'];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
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

const files = walk(srcDir);
let allAddedKeys = {};
let filesModifiedCount = 0;

files.forEach(file => {
  const code = fs.readFileSync(file, 'utf8');
  let ast;
  try {
    ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx']
    });
  } catch(e) {
    console.error('Error parsing', file, e.message);
    return;
  }

  let modified = false;
  let hasUseTranslationImport = false;
  let hasTDeclaration = false;

  traverse(ast, {
    ImportDeclaration(path) {
      if (path.node.source.value === 'react-i18next') {
        hasUseTranslationImport = true;
      }
    },
    VariableDeclarator(path) {
      if (path.node.id.type === 'ObjectPattern') {
        const hasT = path.node.id.properties.some(p => p.key && p.key.name === 't');
        if (hasT && path.node.init && path.node.init.callee && path.node.init.callee.name === 'useTranslation') {
          hasTDeclaration = true;
        }
      }
    },
    JSXText(path) {
      const text = path.node.value;
      if (text.trim().length > 1 && /[a-zA-Z]/.test(text)) {
        const str = text.trim();
        // Ignore lines that are just code or variables accidentally parsed as text
        if (str.includes('=>') || str.includes('&&')) return;
        const key = camelCase(str);
        if (!key) return;
        
        allAddedKeys[key] = str;
        
        const callExp = t.callExpression(t.identifier('t'), [
          t.stringLiteral(key),
          t.stringLiteral(str)
        ]);
        path.replaceWith(t.jsxExpressionContainer(callExp));
        modified = true;
      }
    },
    JSXAttribute(path) {
      const name = path.node.name.name;
      if (targetProps.includes(name)) {
        const valueNode = path.node.value;
        if (valueNode && valueNode.type === 'StringLiteral') {
          const str = valueNode.value;
          if (str.trim().length > 0 && /[a-zA-Z]/.test(str)) {
            const key = camelCase(str);
            if (!key) return;
            allAddedKeys[key] = str;
            
            const callExp = t.callExpression(t.identifier('t'), [
              t.stringLiteral(key),
              t.stringLiteral(str)
            ]);
            path.node.value = t.jsxExpressionContainer(callExp);
            modified = true;
          }
        }
      }
    }
  });

  if (modified) {
    if (!hasUseTranslationImport) {
      const importDecl = t.importDeclaration(
        [t.importSpecifier(t.identifier('useTranslation'), t.identifier('useTranslation'))],
        t.stringLiteral('react-i18next')
      );
      ast.program.body.unshift(importDecl);
    }
    
    // Attempting to inject `const { t } = useTranslation('common');` is tricky via AST if we don't know the component body.
    // For simplicity, we just output the modified JSX.
    const output = generator(ast, {}, code);
    
    let finalCode = output.code;
    
    // Quick regex to inject `useTranslation` if it's missing in the component body
    if (!hasTDeclaration) {
      finalCode = finalCode.replace(/(const [A-Z][a-zA-Z0-9]* = \(.*?\) => \{)/, "$1\n  const { t } = useTranslation('common');");
      finalCode = finalCode.replace(/(export default function [A-Z][a-zA-Z0-9]*\(.*?\) \{)/, "$1\n  const { t } = useTranslation('common');");
    }

    fs.writeFileSync(file, finalCode, 'utf8');
    filesModifiedCount++;
    console.log('Modified:', file);
  }
});

// Update JSON dictionaries
const i18nDir = path.join(srcDir, 'i18n', 'translations');
languages.forEach(lang => {
  const commonPath = path.join(i18nDir, lang, 'common.json');
  if (fs.existsSync(commonPath)) {
    let json = JSON.parse(fs.readFileSync(commonPath, 'utf8'));
    Object.keys(allAddedKeys).forEach(key => {
      if (!json[key]) {
        json[key] = allAddedKeys[key];
      }
    });
    fs.writeFileSync(commonPath, JSON.stringify(json, null, 2), 'utf8');
  }
});

console.log('Total files modified:', filesModifiedCount);
console.log('Total keys extracted:', Object.keys(allAddedKeys).length);
