import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

export const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

console.log("✅ Connected to MySQL database");
  

// await db.execute(`
//   CREATE TABLE users (
//     user_id INT AUTO_INCREMENT PRIMARY KEY,
//     name VARCHAR(60) NOT NULL CHECK (CHAR_LENGTH(name) BETWEEN 20 AND 60),
//     email VARCHAR(100) UNIQUE NOT NULL,
//     password VARCHAR(255) NOT NULL,
//     address VARCHAR(400),
//     role ENUM('system_admin', 'normal_user', 'store_owner') DEFAULT 'normal_user',
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//   );
// `);

// await db.execute(`
//   CREATE TABLE stores (
//     store_id INT AUTO_INCREMENT PRIMARY KEY,
//     owner_id INT,
//     name VARCHAR(100) NOT NULL,
//     email VARCHAR(100),
//     address VARCHAR(255) NOT NULL,
//     avg_rating DECIMAL(3,2) DEFAULT 0.00,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (owner_id) REFERENCES users(user_id) ON DELETE CASCADE
//   );
// `);

// await db.execute(`
//   CREATE TABLE ratings (
//     rating_id INT AUTO_INCREMENT PRIMARY KEY,
//     store_id INT,
//     user_id INT,
//     rating TINYINT CHECK (rating BETWEEN 1 AND 5),
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//     FOREIGN KEY (store_id) REFERENCES stores(store_id) ON DELETE CASCADE,
//     FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
//     UNIQUE KEY unique_rating (store_id, user_id)
//   );
// `);
