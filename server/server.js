// server.js

// const express = require('express');
// const mysql = require('mysql2');
// const fs = require('fs');
// const bodyParser = require('body-parser');

// const app = express(); // Initialize app before using cors
// const cors = require('cors');

// // Update the CORS settings to allow requests from localhost:3000
// app.use(cors({
//   origin: 'http://localhost:3000', // Allow requests from this origin
//   methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify the allowed HTTP methods
//   credentials: true, // Allow credentials like cookies or HTTP authentication headers
//   allowedHeaders: ['Content-Type', 'Authorization'] // Add headers that you may use
// }));
// // Use CORS to allow requests from other origins
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
//   res.header('Access-Control-Allow-Credentials', 'true');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   next();
// });

// app.options('*', cors());

// app.use(bodyParser.json());

// // Connect to MySQL database
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'nahid0088@',
//   database: 'pacific_db',
// });

// db.connect((err) => {
//   if (err) {
//     console.error('Database connection failed:', err);
//     return;
//   }
//   console.log('Connected to MySQL database');
// });

// // Create a table (Run this once, or run it in the MySQL client directly)
// const createTableQuery = `
//   CREATE TABLE IF NOT EXISTS orders (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     userDetails JSON,
//     cart JSON,
//     address JSON,
//     selectedDate VARCHAR(255),
//     selectedSlot VARCHAR(255),
//     bio TEXT,
//     createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//   )
// `;

// db.query(createTableQuery, (err, result) => {
//   if (err) {
//     console.error('Error creating table:', err);
//   } else {
//     console.log('Table created or already exists.');
//   }
// });

// // API endpoint to handle order submission
// app.post('/placeOrder', (req, res) => {
//   const { userDetails, cart, address, selectedDate, selectedSlot, bio } = req.body;

//   // Create the JSON file with order details
//   const orderData = { userDetails, cart, address, selectedDate, selectedSlot, bio };
//   const jsonString = JSON.stringify(orderData, null, 2);

//   fs.writeFileSync(`./orders/order_${Date.now()}.json`, jsonString, (err) => {
//     if (err) {
//       console.error('Error writing JSON file:', err);
//       res.status(500).json({ message: 'Failed to save order to file' });
//     }
//   });

//   // Insert into MySQL database
//   const insertOrderQuery = `INSERT INTO orders (userDetails, cart, address, selectedDate, selectedSlot, bio) VALUES (?, ?, ?, ?, ?, ?)`;
//   db.query(insertOrderQuery, [
//     JSON.stringify(userDetails),
//     JSON.stringify(cart),
//     JSON.stringify(address),
//     selectedDate,
//     selectedSlot,
//     bio,
//   ], (err, result) => {
//     if (err) {
//       console.error('Error inserting into MySQL:', err);
//       res.status(500).json({ message: 'Failed to save order to database' });
//     } else {
//       res.status(200).json({ message: 'Order saved successfully' });
//     }
//   });
// });

// // Start the server
// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const cors = require('cors');
const fs = require('fs');
const path = require('path'); // Add this line

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // MySQL username
  password: 'nahid0088@', // MySQL password
  database: 'pacific_db', // Your database name
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database.');
});

// Create a table (Run this once, or run it in the MySQL client directly)
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userDetails JSON,
    cart JSON,
    address JSON,
    selectedDate VARCHAR(255),
    selectedSlot VARCHAR(255),
    bio TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

db.query(createTableQuery, (err, result) => {
  if (err) {
    console.error('Error creating table:', err);
  } else {
    console.log('Table created or already exists.');
  }
});

// Ensure the 'orders' directory exists
const ordersDir = path.join(__dirname, 'orders');

if (!fs.existsSync(ordersDir)) {
  fs.mkdirSync(ordersDir);
  console.log('Created orders directory.');
}

// API to receive order data
app.post('/placeOrder', (req, res) => {
  const { userDetails, cart, address, selectedDate, selectedSlot, bio } = req.body;

  // // Create the JSON file with order details
  // const orderData = { userDetails, cart, address, selectedDate, selectedSlot, bio };
  // const jsonString = JSON.stringify(orderData, null, 2);

  // // Generate a unique filename
  // const filename = `order_${Date.now()}.json`;
  // const filepath = path.join(ordersDir, filename);

  // try {
  //   // Write the JSON file
  //   fs.writeFileSync(filepath, jsonString);
  //   console.log(`Order data saved to ${filepath}`);
  // } catch (err) {
  //   console.error('Error writing JSON file:', err);
  //   return res.status(500).json({ message: 'Failed to save order to file' });
  // }

  // Insert into MySQL database
  const insertOrderQuery = `
  INSERT INTO orders (userDetails, cart, address, selectedDate, selectedSlot, bio)
  VALUES (?, ?, ?, ?, ?, ?)
`;

db.query(insertOrderQuery, [
  JSON.stringify(userDetails),
  JSON.stringify(cart),
  JSON.stringify(address),
  selectedDate,
  selectedSlot,
  bio,
], (err, result) => {
  if (err) {
    console.error('Error inserting into MySQL:', err);
    return res.status(500).json({ message: 'Failed to save order to database' });
  } else {
    res.status(200).json({ message: 'Order saved successfully' });
  }
});
});
// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Fetch data user dashboard

app.get('/orders', (req, res) => {
  const { userId } = req.query; // Assume userId is passed as a query parameter
  
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  const query = 'SELECT * FROM orders WHERE JSON_UNQUOTE(userDetails->"$.id") = ?'; // Assuming userDetails contains an "id" field

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching orders:', err);
      return res.status(500).json({ message: 'Error fetching orders' });
    }

    res.status(200).json(results); // Send orders as response
  });
});


// CREATE TABLE orders (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   user_id VARCHAR(255),
//   cart JSON,
//   address JSON,
//   delivery_date DATE,
//   delivery_slot VARCHAR(255)
// );

// host: 'localhost',
  // user: 'root',
  // password: 'nahid0088@',
  // database: 'pacific'

  // ========== Vendor Self Registration ==========//

app.post('/api/vendor/register', upload.fields([
  { name: 'nidFront', maxCount: 1 },
  { name: 'nidBack', maxCount: 1 },
  { name: 'selfie', maxCount: 1 }
]), async (req, res) => {
  try {
    const { name, email, phone, dob, nid, password } = req.body;

    if (!name || !email || !phone || !dob || !nid || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check duplicate vendor by email or phone
    const [existingVendors] = await db.query(
      "SELECT id FROM vendors WHERE email = ? OR phone = ?",
      [email, phone]
    );
    if (existingVendors.length > 0) {
      return res.status(400).json({ success: false, message: "Vendor with this email or phone already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const nidFront = req.files['nidFront']?.[0]?.filename || null;
    const nidBack = req.files['nidBack']?.[0]?.filename || null;
    const selfie = req.files['selfie']?.[0]?.filename || null;

    await db.query(
      `INSERT INTO vendors 
      (name, email, phone, dob, nid, password, nidFront, nidBack, selfie, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, phone, dob, nid, hashedPassword, nidFront, nidBack, selfie, 'pending']
    );

    res.json({ success: true, message: "Vendor registered successfully. Please wait for admin approval." });
  } catch (err) {
    console.error("Vendor registration error:", err);
    res.status(500).json({ success: false, message: "Vendor registration failed" });
  }
});

// ========== Admin APIs for Vendor Management ==========

// Get all vendors with stats
app.get('/api/admin/vendors', verifyToken(['admin', 'superadmin']), async (req, res) => {
  try {
    const [vendors] = await db.query('SELECT * FROM vendors ORDER BY id DESC');

    const stats = {
      totalVendors: vendors.length,
      pendingApproval: vendors.filter(v => v.status === 'pending').length,
      activeVendors: vendors.filter(v => v.status === 'active').length,
      blockedVendors: vendors.filter(v => v.status === 'blocked').length,
      totalEarnings: vendors.reduce((sum, v) => sum + (v.totalEarnings || 0), 0),
      pendingPayments: vendors.reduce((sum, v) => sum + (v.pendingPayment || 0), 0),
    };

    res.json({ success: true, vendors, stats });
  } catch (err) {
    console.error("Fetch vendors error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch vendors" });
  }
});

// Approve vendor
app.put('/api/admin/vendors/:id/approve', verifyToken(['admin', 'superadmin']), async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('UPDATE vendors SET status = ? WHERE id = ?', ['active', id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }
    res.json({ success: true, message: 'Vendor approved successfully' });
  } catch (err) {
    console.error("Approve vendor error:", err);
    res.status(500).json({ success: false, message: 'Failed to approve vendor' });
  }
});

// Block vendor
app.put('/api/admin/vendors/:id/block', verifyToken(['admin', 'superadmin']), async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('UPDATE vendors SET status = ? WHERE id = ?', ['blocked', id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }
    res.json({ success: true, message: 'Vendor blocked successfully' });
  } catch (err) {
    console.error("Block vendor error:", err);
    res.status(500).json({ success: false, message: 'Failed to block vendor' });
  }
});

// Get single vendor details
app.get('/api/admin/vendors/:id', verifyToken(['admin', 'superadmin']), async (req, res) => {
  try {
    const { id } = req.params;
    const [vendorRows] = await db.query('SELECT * FROM vendors WHERE id = ?', [id]);
    if (vendorRows.length === 0) return res.status(404).json({ success: false, message: 'Vendor not found' });
    res.json({ success: true, vendor: vendorRows[0] });
  } catch (err) {
    console.error("Fetch vendor details error:", err);
    res.status(500).json({ success: false, message: 'Failed to fetch vendor details' });
  }
});

