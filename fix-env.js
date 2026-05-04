import fs from 'fs';
import path from 'path';

const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  let lines = fs.readFileSync(envPath, 'utf8').split('\n');
  let updated = false;
  
  lines = lines.map(line => {
    if (line.trim().startsWith('DATABASE_URL')) {
      console.log('Found line starting with:', line.split(':')[0]);
      if (line.includes('mariadb:')) {
        updated = true;
        return line.replace('mariadb:', 'mysql:');
      }
    }
    return line;
  });

  if (updated) {
    fs.writeFileSync(envPath, lines.join('\n'));
    console.log('Successfully updated .env DATABASE_URL prefix.');
  } else {
    console.log('No update needed or DATABASE_URL not found with mariadb: prefix.');
  }
} else {
  console.log('.env file not found.');
}
