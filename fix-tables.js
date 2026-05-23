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
    
    // Process TableCell and TableHead tags
    // This regex looks for <TableCell or <TableHead then the className attribute
    content = content.replace(/(<(?:TableCell|TableHead)[^>]*className=")([^"]*)(")/g, (match, p1, p2, p3) => {
        let classes = p2.split(/\s+/);
        classes = classes.filter(c => !/^p[ybt]-(?:3|4|5|6|8|10|12)$/.test(c) && !/^p-(?:3|4|5|6|8|10|12)$/.test(c));
        return p1 + classes.join(' ') + p3;
    });
    
    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated', file);
        count++;
    }
});
console.log('Total updated files:', count);
