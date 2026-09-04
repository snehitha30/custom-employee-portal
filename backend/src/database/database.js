const Database = require("better-sqlite3");

const db = new Database("employee_portal.db");

db.pragma("foreign_keys = ON");

console.log("Database connected successfully");

module.exports = db;