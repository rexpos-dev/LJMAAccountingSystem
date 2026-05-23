import fs from 'fs';
const content = fs.readFileSync('.env', 'utf8');
console.log("Length:", content.length);
for (let i = 0; i < content.length; i++) {
  const char = content[i];
  const code = content.charCodeAt(i);
  console.log(`[${i}] ${JSON.stringify(char)} code:${code}`);
}
