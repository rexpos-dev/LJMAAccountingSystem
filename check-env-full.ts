import "dotenv/config";
const url = process.env.DATABASE_URL || "";
console.log("Full URL Length:", url.length);
console.log("Scheme:", url.split(":")[0]);
console.log("First 15 chars:", url.substring(0, 15));
console.log("Last 5 chars:", url.substring(url.length - 5));
console.log("Contains spaces:", /\s/.test(url));
console.log("Contains quotes:", /["']/.test(url));
