import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MySQL Connection String
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123700",   // 👈 your MySQL password
  database: "ljma"      // 👈 your DB name
});

// ✅ Check connection
db.connect(err => {
  if (err) {
    console.error("❌ Database connection failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL database!");
});

// ✅ Example API route
app.get("/api/customers", (req, res) => {
  db.query("SELECT * FROM customers", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
