const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync('index.html', 'utf8');
const footerMatch = indexHtml.match(/<footer[\s\S]*?<\/footer>/);

if (!footerMatch) {
  console.error('Footer not found in index.html');
  process.exit(1);
}

const sourceFooter = footerMatch[0];

function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules') {
        results = results.concat(getHtmlFiles(filePath));
      }
    } else if (file.endsWith('.html') && filePath !== 'index.html' && filePath !== path.join('.', 'index.html')) {
      results.push(filePath);
    }
  });
  return results;
}

const files = getHtmlFiles('.');
let updatedCount = 0;

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('<footer')) {
    content = content.replace(/<footer[\s\S]*?<\/footer>/, sourceFooter);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated footer in:', filePath);
    updatedCount++;
  } else {
    console.warn('No <footer> tag found in:', filePath);
  }
});

console.log('Successfully synced footer to ' + updatedCount + ' HTML files!');
