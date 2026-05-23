const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('src');
let count = 0;
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    content = content.replace(/(<DialogTitle[^>]*className="[^"]*)text-[34]xl([^"]*")/g, '$1text-2xl$2');
    content = content.replace(/(<DialogHeader[^>]*className="[^"]*)py-(?:8|6|10)([^"]*")/g, '$1py-4$2');
    content = content.replace(/(<DialogHeader[^>]*className="[^"]*)pt-(?:8|6|10)([^"]*")/g, '$1pt-4$2');
    content = content.replace(/(<DialogHeader[^>]*className="[^"]*)pb-(?:8|6|10)([^"]*")/g, '$1pb-4$2');
    
    // Just in case, let's also normalize DialogHeader mb-4? The user might just want the explicit py-8 removed.
    
    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated', file);
        count++;
    }
});
console.log('Total updated files:', count);
