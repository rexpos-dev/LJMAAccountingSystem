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
    
    // We want to find <Input, <Button, <Textarea, <SelectTrigger
    // and remove h-10, h-11, h-12, h-14, py-2, py-3, py-4 from them.
    // Since className can be multi-line in cn(), we will do a simpler approach:
    // Whenever we see an element tag, we grab its entire content up to >
    const regex = /<(Input|Button|Textarea|SelectTrigger)([^>]+)>/g;
    
    content = content.replace(regex, (match, tag, attrs) => {
        let newAttrs = attrs.replace(/\bh-1[0124]\b/g, '');
        newAttrs = newAttrs.replace(/\bpy-[234]\b/g, '');
        newAttrs = newAttrs.replace(/\bh-9\b/g, '');
        newAttrs = newAttrs.replace(/\bpy-1\.5\b/g, '');
        // Clean up multiple spaces left behind inside class names
        newAttrs = newAttrs.replace(/\s+/g, ' ');
        return '<' + tag + newAttrs + '>';
    });
    
    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated', file);
        count++;
    }
});
console.log('Total updated files:', count);
