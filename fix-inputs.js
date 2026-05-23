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
    
    // Remove h-\d+, py-\d+, p-\d+ from Input, Button, Textarea
    content = content.replace(/(<(?:Input|Button|Textarea)[^>]*className=")([^"]*)(")/g, (match, p1, p2, p3) => {
        let classes = p2.split(/\s+/);
        // Exclude h-*, py-*, p-* but keep px-* if we want? Let's just remove height and vertical padding.
        classes = classes.filter(c => !/^h-\d+$/.test(c));
        classes = classes.filter(c => !/^h-\[\d+p?[a-z%]*\]$/.test(c));
        classes = classes.filter(c => !/^(py|p)-\d+$/.test(c));
        classes = classes.filter(c => !/^(py|p)-\[\d+p?[a-z%]*\]$/.test(c));
        return p1 + classes.join(' ') + p3;
    });
    
    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated', file);
        count++;
    }
});
console.log('Total updated files:', count);
