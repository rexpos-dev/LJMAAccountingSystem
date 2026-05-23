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
    
    // Remove p-\d, py-\d, pt-\d, pb-\d from TableCell, TableHead, td, th
    content = content.replace(/(<(?:TableCell|TableHead|td|th)[^>]*className=")([^"]*)(")/g, (match, p1, p2, p3) => {
        let classes = p2.split(/\s+/);
        // exclude any string starting with p-, py-, pt-, pb- followed by digits or [
        classes = classes.filter(c => !/^(p|py|pt|pb)-\d+$/.test(c));
        classes = classes.filter(c => !/^(p|py|pt|pb)-\[\d+p?[a-z%]*\]$/.test(c));
        return p1 + classes.join(' ') + p3;
    });
    
    // Also remove h-\d+ from TableRow and tr so they shrink
    content = content.replace(/(<(?:TableRow|tr)[^>]*className=")([^"]*)(")/g, (match, p1, p2, p3) => {
        let classes = p2.split(/\s+/);
        classes = classes.filter(c => !/^h-\d+$/.test(c));
        classes = classes.filter(c => !/^h-\[\d+p?[a-z%]*\]$/.test(c));
        return p1 + classes.join(' ') + p3;
    });
    
    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated', file);
        count++;
    }
});
console.log('Total updated files:', count);
