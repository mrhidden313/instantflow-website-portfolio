const fs = require('fs');

let css = fs.readFileSync('styles.css', 'utf8');

// Basic minification
css = css.replace(/\/\*[\s\S]*?\*\//g, ''); // Remove comments
css = css.replace(/\s+/g, ' ');             // Replace multiple whitespace with single space
css = css.replace(/\s*([{}:;,>])\s*/g, '$1'); // Remove spaces around characters
css = css.replace(/;}/g, '}');              // Remove last semicolon in block

fs.writeFileSync('styles.min.css', css);
console.log('styles.css minified to styles.min.css');
