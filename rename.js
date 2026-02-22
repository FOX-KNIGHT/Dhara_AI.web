const fs = require('fs');
const path = require('path');

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            /* Recurse into a subdirectory */
            if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('.next')) {
                results = results.concat(walkDir(file));
            }
        } else { 
            /* Is a file */
            if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.json') || file.endsWith('.md') || file.includes('package.json')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walkDir('./');
let changed = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.match(/DharaAI/ig)) {
    // Replace all variations respecting case somewhat, but DharaAI is the target
    // Also handle dharaai -> dharaai
    let newContent = content
        .replace(/DharaAI/g, 'DharaAI')
        .replace(/dharaai/g, 'dharaai')
        .replace(/DharaAI/g, 'DharaAI');
    
    if (newContent !== content) {
        fs.writeFileSync(file, newContent, 'utf8');
        changed++;
        console.log('Updated:', file);
    }
  }
}

console.log(`Replaced in ${changed} files.`);
