import "dotenv/config";
const url = process.env.DATABASE_URL || "";
console.log("URL Prefix:", url.split(":")[0]);
console.log("Is Empty:", url.length === 0);
