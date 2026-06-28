// const mysql = require('mysql2');
// const bcrypt = require('bcrypt');
// require('dotenv').config();

// const db = mysql.createConnection({
//     host: "localhost",
//     user: "pacific",
//     password: "Nahid0088@gmail.com",
//     database: "auth_system",
// }).promise();

// async function createSuperAdmin() {
//     try {
//         const email = 'admin@pacific.com';
//         const password = 'Pacific969090@';
        
//         // Check if exists
//         const [exists] = await db.query(
//             'SELECT * FROM superadmins WHERE email = ?',
//             [email]
//         );
        
//         if (exists.length > 0) {
//             console.log('✅ Super Admin already exists!');
//             console.log('📧 Email:', exists[0].email);
//             console.log('📅 Created at:', exists[0].created_at);
//             return;
//         }
        
//         // Hash password
//         const hashedPassword = await bcrypt.hash(password, 12);
//         console.log('🔒 Generated Hash:', hashedPassword);
        
//         // Insert
//         await db.query(
//             'INSERT INTO superadmins (email, password, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
//             [email, hashedPassword]
//         );
        
//         console.log('✅ Super Admin created successfully!');
//         console.log('📧 Email:', email);
//         console.log('🔑 Password:', password);
//         console.log('🔒 Hash:', hashedPassword);
        
//     } catch (error) {
//         console.error('❌ Error:', error.message);
//     } finally {
//         await db.end();
//     }
// }

// createSuperAdmin();

require("dotenv").config();

const bcrypt = require("bcrypt");
const mysql = require("mysql2/promise");

(async () => {
  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl:
        process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: false }
          : undefined,
    });

    const email = "admin@pacific.com";
    const password = "Pacific969090@"; // পরে পরিবর্তন করবে

    const [exists] = await db.query(
      "SELECT id FROM superadmins LIMIT 1"
    );

    if (exists.length > 0) {
      console.log("❌ Super Admin already exists.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await db.query(
      "INSERT INTO superadmins (email, password) VALUES (?, ?)",
      [email, hashedPassword]
    );

    console.log("✅ Super Admin created successfully!");
    console.log("Email:", email);
    console.log("Password:", password);

    await db.end();
    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();