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
    
    // Remove p-\d, py-\d, pt-\d, pb-\d from TableCell and TableHead
    content = content.replace(/(<(?:TableCell|TableHead)[^>]*className=")([^"]*)(")/g, (match, p1, p2, p3) => {
        let classes = p2.split(/\s+/);
        classes = classes.filter(c => !/^p[ybt]?-([1-9]|1[0-2])$/.test(c));
        return p1 + classes.join(' ') + p3;
    });
    
    // Also remove h-\d+ from TableRow so they shrink
    content = content.replace(/(<TableRow[^>]*className=")([^"]*)(")/g, (match, p1, p2, p3) => {
        let classes = p2.split(/\s+/);
        classes = classes.filter(c => !/^h-\d+$/.test(c));
        return p1 + classes.join(' ') + p3;
    });
    
    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated', file);
        count++;
    }
});
console.log('Total updated files:', count);
