const mysql = require('mysql2');
const bcrypt = require('bcrypt');
require('dotenv').config();

const db = mysql.createConnection({
    host: "localhost",
    user: "pacific",
    password: "Nahid0088@gmail.com",
    database: "auth_system",
}).promise();

async function createSuperAdmin() {
    try {
        const email = 'admin@pacific.com';
        const password = 'Pacific969090@';
        
        // Check if exists
        const [exists] = await db.query(
            'SELECT * FROM superadmins WHERE email = ?',
            [email]
        );
        
        if (exists.length > 0) {
            console.log('✅ Super Admin already exists!');
            console.log('📧 Email:', exists[0].email);
            console.log('📅 Created at:', exists[0].created_at);
            return;
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);
        console.log('🔒 Generated Hash:', hashedPassword);
        
        // Insert
        await db.query(
            'INSERT INTO superadmins (email, password, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
            [email, hashedPassword]
        );
        
        console.log('✅ Super Admin created successfully!');
        console.log('📧 Email:', email);
        console.log('🔑 Password:', password);
        console.log('🔒 Hash:', hashedPassword);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await db.end();
    }
}

createSuperAdmin();