const mysql = require('mysql2');

/*
  Copy this file as db.js
  and add your database credentials in .env
*/

const pool = mysql.createPool({
  host: "localhost",
  user: "your_db_user",
  password: "your_db_password",
  database: "contact_book",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`;

pool.query(createTableQuery, (err) => {
  if (err) {
    console.error("Error creating table:", err);
  } else {
    console.log("Contacts table ready");
  }
});

module.exports = pool.promise();
