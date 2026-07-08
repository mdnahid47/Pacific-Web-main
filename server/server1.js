// const express = require("express");
// const mysql = require("mysql2");
// const bcrypt = require("bcrypt");
// const cors = require("cors");
// const jwt = require("jsonwebtoken");
// require("dotenv").config();
// const path = require('path');
// const fs = require('fs');
// const multer = require('multer');
// const nodemailer = require("nodemailer");
// const cookieParser = require("cookie-parser");
// const rateLimit = require('express-rate-limit');
// const crypto = require('crypto');
// const validator = require('validator');

// // CORS configuration for both React (3000) and Flutter Web (58770)
// const corsOptions = {
//   origin: function (origin, callback) {
//     // Allow all localhost origins for development
//     const allowedOrigins = [
//       'http://localhost:3000',
//       'http://localhost:60174',
//       'http://localhost',
//       'http://192.168.0.4:3000',
//       'http://192.168.0.4:60174',
//       'http://192.168.0.4'
//     ];

//     // Allow requests with no origin (like mobile apps or curl)
//     if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//   allowedHeaders: [
//     'Content-Type',
//     'Authorization',
//     'Origin',
//     'Accept',
//     'X-Requested-With',
//     'X-App-Source',
//     'X-App-Version',
//     'X-Request-ID'
//   ],
//   credentials: true,
//   optionsSuccessStatus: 200
// };

// function createUploadDirectories() {
//   const directories = [
//     path.join(__dirname, 'uploads'),
//     path.join(__dirname, 'uploads/profiles'),
//     path.join(__dirname, 'uploads/nids'),
//     path.join(__dirname, 'uploads/services'),
//     path.join(__dirname, 'uploads/cvs'),
//     path.join(__dirname, 'uploads/licenses')
//   ];

//   directories.forEach(dir => {
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir, { recursive: true });
//       console.log(`📁 Created directory: ${dir}`);
//     }
//   });
// }

// // Call it after CORS setup
// createUploadDirectories();

// const app = express();
// const port = 5001;

// // Middleware setup
// app.use(cors(corsOptions));
// app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.options('*', cors(corsOptions)); // Preflight requests
// app.use(cookieParser());
// app.use(express.urlencoded({ extended: true }));

// // Additional CORS middleware for dynamic ports
// app.use((req, res, next) => {
//   const origin = req.headers.origin;

//   // Allow any localhost port for development
//   if (origin && origin.startsWith('http://localhost:')) {
//     res.header('Access-Control-Allow-Origin', origin);
//   }

//   // Allow your network IP with any port
//   if (origin && origin.startsWith('http://192.168.0.5:')) {
//     res.header('Access-Control-Allow-Origin', origin);
//   }

//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, Accept, X-Requested-With');
//   res.header('Access-Control-Allow-Credentials', 'true');
//   res.header('Access-Control-Max-Age', '86400'); // 24 hours cache

//   // Handle preflight
//   if (req.method === 'OPTIONS') {
//     return res.status(200).end();
//   }

//   next();
// });

// // Database connection configuration
// const db = mysql.createConnection({
//   host: "localhost",
//   user: "pacific",
//   password: "Nahid0088@gmail.com",
//   database: "auth_system",
// }).promise();


// // Database initialization function
// const initializeDatabase = async () => {
//   try {
//     console.log("🔧 Initializing database tables...");

//     // ========== NEW: Schedule Change Related Tables ==========

//     // 1. Order টেবিলে schedule related columns যোগ করুন
//     const orderScheduleColumns = [
//       { name: 'schedule_changed', type: 'BOOLEAN DEFAULT FALSE' },
//       { name: 'schedule_changed_date', type: 'DATETIME' }
//     ];

//     for (const column of orderScheduleColumns) {
//       try {
//         await db.query(`ALTER TABLE orders ADD COLUMN ${column.name} ${column.type}`);
//         console.log(`✅ Added ${column.name} column to orders table`);
//       } catch (err) {
//         if (err.code === 'ER_DUP_FIELDNAME') {
//           console.log(`ℹ️ ${column.name} column already exists`);
//         } else {
//           console.error(`Error adding ${column.name}:`, err.message);
//         }
//       }
//     }

//     // 2. schedule_changes table তৈরি করুন
//     try {
//       await db.query(`
//         CREATE TABLE IF NOT EXISTS schedule_changes (
//           id INT AUTO_INCREMENT PRIMARY KEY,
//           order_id VARCHAR(50) NOT NULL,
//           user_id VARCHAR(50) NOT NULL,
//           previous_date DATE NOT NULL,
//           previous_time_slot VARCHAR(50) NOT NULL,
//           new_date DATE NOT NULL,
//           new_time_slot VARCHAR(50) NOT NULL,
//           changed_by VARCHAR(50) NOT NULL,
//           reason TEXT,
//           change_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//           FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
//           INDEX idx_order_id (order_id),
//           INDEX idx_user_id (user_id)
//         )
//       `);
//       console.log("✅ schedule_changes table checked/created");
//     } catch (err) {
//       console.log("ℹ️ schedule_changes table already exists or error:", err.message);
//     }

//     // 3. notifications table তৈরি করুন (যদি না থাকে)
//     try {
//       await db.query(`
//         CREATE TABLE IF NOT EXISTS notifications (
//           id INT AUTO_INCREMENT PRIMARY KEY,
//           user_id VARCHAR(50) NOT NULL,
//           user_type ENUM('user', 'vendor', 'admin') NOT NULL,
//           title VARCHAR(255) NOT NULL,
//           message TEXT NOT NULL,
//           type VARCHAR(50),
//           related_id VARCHAR(50),
//           is_read BOOLEAN DEFAULT FALSE,
//           read_at TIMESTAMP NULL,
//           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//           INDEX idx_user (user_id, user_type),
//           INDEX idx_unread (user_id, user_type, is_read)
//         )
//       `);
//       console.log("✅ notifications table checked/created");
//     } catch (err) {
//       console.log("ℹ️ notifications table already exists or error:", err.message);
//     }

//     // ========== END: Schedule Change Related Tables ==========

//     // 1. order review check 
//     try {
//       await db.query(`
//         CREATE TABLE IF NOT EXISTS order_reviews (
//           id INT AUTO_INCREMENT PRIMARY KEY,
//           order_id VARCHAR(50) NOT NULL,
//           user_id VARCHAR(50) NOT NULL,
//           service_expert_rating INT NOT NULL DEFAULT 5,
//           website_service_rating INT NOT NULL DEFAULT 5,
//           comments TEXT,
//           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//           FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
//           INDEX idx_order_id (order_id),
//           INDEX idx_user_id (user_id)
//         )
//       `);
//       console.log("✅ order_reviews table checked");
//     } catch (err) {
//       console.log("ℹ️ order_reviews table already exists");
//     }

//     // 2. Orders table columns add
//     const ordersColumns = [
//       { name: 'service_expert', type: 'TEXT' },
//       { name: 'reviews', type: 'TEXT' },
//       { name: 'assigned_date', type: 'DATETIME' },
//       { name: 'in_progress_date', type: 'DATETIME' },
//       { name: 'completed_date', type: 'DATETIME' },
//       { name: 'confirmed_date', type: 'DATETIME' },
//       { name: 'vendor_id', type: 'INT' }
//     ];

//     for (const column of ordersColumns) {
//       try {
//         await db.query(`ALTER TABLE orders ADD COLUMN ${column.name} ${column.type}`);
//         console.log(`✅ Added ${column.name} column to orders table`);
//       } catch (err) {
//         // if column already exists, skip
//         if (err.code === 'ER_DUP_FIELDNAME') {
//           console.log(`ℹ️ ${column.name} column already exists`);
//         } else {
//           console.error(`Error adding ${column.name}:`, err.message);
//         }
//       }
//     }

//     // 3. Foreign key add
//     try {
//       await db.query(`
//         ALTER TABLE orders 
//         ADD FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE SET NULL
//       `);
//       console.log("✅ Added vendor_id foreign key");
//     } catch (err) {
//       if (err.code === 'ER_DUP_KEY' || err.code === 'ER_CANT_CREATE_TABLE') {
//         console.log("ℹ️ Foreign key already exists");
//       } else {
//         console.error("Error adding foreign key:", err.message);
//       }
//     }

//     // 4. Indexes add
//     try {
//       await db.query('CREATE INDEX idx_status ON orders(status)');
//       console.log("✅ Created idx_status index");
//     } catch (err) {
//       if (err.code === 'ER_DUP_KEYNAME') {
//         console.log("ℹ️ idx_status index already exists");
//       }
//     }

//     try {
//       await db.query('CREATE INDEX idx_vendor_id ON orders(vendor_id)');
//       console.log("✅ Created idx_vendor_id index");
//     } catch (err) {
//       if (err.code === 'ER_DUP_KEYNAME') {
//         console.log("ℹ️ idx_vendor_id index already exists");
//       }
//     }

//     // 5. Users table reset token columns add
//     try {
//       await db.query(`
//         ALTER TABLE users
//         ADD COLUMN reset_token VARCHAR(255),
//         ADD COLUMN reset_token_expiry DATETIME
//       `);
//       console.log("✅ Added reset token columns to users table");
//     } catch (err) {
//       if (err.code === 'ER_DUP_FIELDNAME') {
//         console.log("ℹ️ Reset token columns already exist in users table");
//       }
//     }

//     // 6. Vendors table columns add
//     const vendorColumns = [
//       { name: 'total_orders', type: 'INT DEFAULT 0' },
//       { name: 'completed_orders', type: 'INT DEFAULT 0' },
//       { name: 'pending_orders', type: 'INT DEFAULT 0' },
//       { name: 'canceled_orders', type: 'INT DEFAULT 0' },
//       { name: 'average_rating', type: 'DECIMAL(3,2) DEFAULT 0.0' },
//       { name: 'reset_token', type: 'VARCHAR(255)' },
//       { name: 'reset_token_expiry', type: 'DATETIME' }
//     ];

//     for (const column of vendorColumns) {
//       try {
//         await db.query(`ALTER TABLE vendors ADD COLUMN ${column.name} ${column.type}`);
//         console.log(`✅ Added ${column.name} column to vendors table`);
//       } catch (err) {
//         if (err.code === 'ER_DUP_FIELDNAME') {
//           console.log(`ℹ️ ${column.name} column already exists in vendors table`);
//         }
//       }
//     }

//     // 7. Vendors table indexes add
//     try {
//       await db.query('CREATE INDEX idx_vendor_status ON vendors(status)');
//       console.log("✅ Created idx_vendor_status index");
//     } catch (err) {
//       if (err.code === 'ER_DUP_KEYNAME') {
//         console.log("ℹ️ idx_vendor_status index already exists");
//       }
//     }

//     console.log("🎉 Database initialization completed successfully!");

//   } catch (error) {
//     console.error("❌ Database initialization error:", error);
//   }
// };

// // Database connection
// db.connect(async (err) => {
//   if (err) {
//     console.error("Database connection error:", err);
//   } else {
//     console.log("Connected to MySQL database");
//     //database initialize
//     await initializeDatabase();
//   }
// });

// const profileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = path.join(__dirname, 'uploads/profiles');
//     fs.mkdirSync(dir, { recursive: true });
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     cb(null, `profile-${Date.now()}${ext}`);
//   }
// });

// // Service Image Storage
// const serviceStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = path.join(__dirname, 'uploads/services');
//     fs.mkdirSync(dir, { recursive: true });
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     cb(null, `service-${Date.now()}${ext}`);
//   }
// });

// // File Filter
// const imageFileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png|gif/;
//   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = allowedTypes.test(file.mimetype);

//   if (mimetype && extname) {
//     cb(null, true);
//   } else {
//     cb(new Error('শুধুমাত্র ইমেজ ফাইল (JPEG, JPG, PNG, GIF) অনুমোদিত'), false);
//   }
// };

// // Upload Middleware
// const uploadProfile = multer({
//   storage: profileStorage,
//   limits: { fileSize: 5 * 1024 * 1024 },
//   fileFilter: imageFileFilter
// });

// const uploadService = multer({
//   storage: serviceStorage,
//   limits: { fileSize: 10 * 1024 * 1024 },
//   fileFilter: imageFileFilter
// });
// const vendorStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     let dir;
//     switch (file.fieldname) {
//       case 'profile_image':
//         dir = path.join(__dirname, 'uploads/profiles');
//         break;
//       case 'nid_front':
//       case 'nid_back':
//         dir = path.join(__dirname, 'uploads/nids');
//         break;
//       case 'cv':
//         dir = path.join(__dirname, 'uploads/cvs');
//         break;
//       case 'trade_license':
//         dir = path.join(__dirname, 'uploads/licenses');
//         break;
//       default:
//         dir = path.join(__dirname, 'uploads/others');
//     }
//     fs.mkdirSync(dir, { recursive: true });
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const timestamp = Date.now();
//     cb(null, `${file.fieldname}-${timestamp}${ext}`);
//   }
// });

// const uploadVendorDocs = multer({
//   storage: vendorStorage,
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10MB for files
//   fileFilter: (req, file, cb) => {
//     // Allow all file types for now
//     cb(null, true);
//   }
// });


// // JWT Authentication Middleware
// const authenticateJWT = (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   if (!authHeader) {
//     return res.status(401).json({ success: false, message: "Authorization header missing" });
//   }

//   const token = authHeader.split(" ")[1];
//   if (!token) {
//     return res.status(401).json({ success: false, message: "Token missing" });
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(403).json({ success: false, message: "Invalid token" });
//     }
//     req.user = decoded;
//     next();
//   });
// };

// //  JWT Middleware with multi-role support
// const verifyToken = (roles = []) => (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

//   if (!token) {
//     return res.status(401).json({ success: false, message: "Authorization token missing" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     //  Allow superadmin to access all routes
//     if (decoded.role === 'superadmin') {
//       req.user = decoded;
//       return next();
//     }

//     // Otherwise check for allowed roles
//     if (roles.length > 0 && !roles.includes(decoded.role)) {
//       return res.status(403).json({
//         success: false,
//         message: `Requires one of these roles: ${roles.join(', ')}`
//       });
//     }

//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(403).json({
//       success: false,
//       message: "Invalid or expired token",
//       error: err.message
//     });
//   }
// };

// // Admin Authentication Middleware
// const authenticateAdmin = (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({
//         success: false,
//         message: 'No token provided'
//       });
//     }

//     const token = authHeader.split(' ')[1];

//     // Verify token
//     jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, decoded) => {
//       if (err) {
//         console.error('Token verification error:', err);
//         return res.status(403).json({
//           success: false,
//           message: 'Invalid or expired token'
//         });
//       }

//       // Check if user has admin role
//       const allowedRoles = ['admin', 'superadmin'];
//       if (!allowedRoles.includes(decoded.role)) {
//         return res.status(403).json({
//           success: false,
//           message: 'Access denied. Admin privileges required.'
//         });
//       }

//       // Add user info to request
//       req.user = decoded;
//       next();
//     });
//   } catch (error) {
//     console.error('Admin auth error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Authentication failed'
//     });
//   }
// };

// // Updated authenticateVendor middleware
// const authenticateVendor = async (req, res, next) => {
//   try {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];

//     console.log('🔑 Auth Header:', authHeader ? 'Present' : 'Missing');
//     console.log('🔑 Token:', token ? `${token.substring(0, 20)}...` : 'Missing');

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Access token required"
//       });
//     }

//     // Verify JWT token
//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//       if (err) {
//         console.log('❌ Token verification failed:', err.message);
//         return res.status(403).json({
//           success: false,
//           message: "Invalid or expired token"
//         });
//       }

//       console.log('✅ Token decoded:', JSON.stringify(decoded, null, 2));

//       // Check if token has vendor role
//       if (decoded.role !== 'vendor') {
//         return res.status(403).json({
//           success: false,
//           message: "Access denied. Vendor role required."
//         });
//       }

//       // Extract vendor ID - check multiple possible fields
//       let vendorId = decoded.userId || decoded.id || decoded.vendorId || decoded.user_id;

//       if (!vendorId && decoded.user && decoded.user.id) {
//         vendorId = decoded.user.id;
//       }

//       console.log('🔍 Extracted vendorId:', vendorId);
//       console.log('🔍 Available fields in token:', Object.keys(decoded));

//       if (!vendorId) {
//         // If no vendorId, try to get from email
//         console.log('⚠️ No vendorId found, trying email lookup');
//         req.vendor = {
//           email: decoded.email || decoded.userEmail,
//           role: decoded.role,
//           // We'll handle vendorId lookup in the route
//         };
//       } else {
//         req.vendor = {
//           vendorId: vendorId,
//           email: decoded.email || decoded.userEmail,
//           role: decoded.role
//         };
//       }

//       console.log('✅ Vendor object created:', req.vendor);
//       next();
//     });
//   } catch (error) {
//     console.error("❌ Authentication error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Authentication failed"
//     });
//   }
// };

// // =============================== NEW ENDPOINTS ===============================

// // 1. vendor order assginment endpoint
// app.patch('/orders/:orderId/assign', verifyToken(['admin', 'superadmin']), async (req, res) => {
//   // URL প্যারামিটার ডিকোড করুন
//   const orderId = decodeURIComponent(req.params.orderId);
//   const { vendor_id, status } = req.body;

//   try {
//     // প্রথমে অর্ডারটি চেক করুন
//     const [orderRows] = await db.query(
//       'SELECT * FROM orders WHERE order_id = ?',
//       [orderId]
//     );

//     if (orderRows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found',
//         debug: {
//           orderId: orderId
//         }
//       });
//     }

//     const order = orderRows[0];

//     // ভেন্ডর চেক করুন
//     let vendorData = null;
//     if (vendor_id) {
//       const [vendorRows] = await db.query(
//         'SELECT * FROM vendors WHERE id = ? AND status = ?',
//         [vendor_id, 'active']
//       );

//       if (vendorRows.length === 0) {
//         return res.status(404).json({
//           success: false,
//           message: 'Vendor not found or not active'
//         });
//       }
//       vendorData = vendorRows[0];
//     }

//     // অর্ডার আপডেট করুন - ভেন্ডর অ্যাসাইন হলে Active স্ট্যাটাস সেট করুন
//     const updateData = {
//       vendor_id: vendor_id || null,
//       status: vendor_id ? 'Active' : (status || 'Pending'), // ভেন্ডর থাকলে Active
//       assigned_date: vendor_id ? new Date() : null,
//       confirmed_date: vendor_id ? new Date() : null // Active স্ট্যাটাসের জন্য confirmed_date
//     };

//     // যদি ভেন্ডর রিমুভ করা হয় (vendor_id null)
//     if (!vendor_id && order.vendor_id) {
//       // আগের ভেন্ডরের স্ট্যাটিস্টিক্স আপডেট করুন
//       await db.query(
//         `UPDATE vendors 
//          SET pending_orders = GREATEST(0, pending_orders - 1),
//              updated_at = NOW()
//          WHERE id = ?`,
//         [order.vendor_id]
//       );

//       updateData.status = 'Pending'; // ভেন্ডর রিমুভ হলে Pending
//     }

//     await db.query(
//       'UPDATE orders SET ? WHERE order_id = ?',
//       [updateData, orderId]
//     );

//     // নতুন ভেন্ডরের স্ট্যাটিস্টিক্স আপডেট করুন
//     if (vendor_id) {
//       await db.query(
//         `UPDATE vendors 
//          SET total_orders = total_orders + 1,
//              pending_orders = pending_orders + 1,
//              updated_at = NOW()
//          WHERE id = ?`,
//         [vendor_id]
//       );
//     }

//     // অর্ডার ইতিহাস লগ করুন
//     await db.query(
//       `INSERT INTO order_history 
//        (order_id, status, action_by, action_type, details) 
//        VALUES (?, ?, ?, ?, ?)`,
//       [
//         orderId,
//         updateData.status,
//         req.user.id,
//         vendor_id ? 'vendor_assigned' : 'vendor_removed',
//         vendor_id
//           ? `Vendor ${vendorData?.name} assigned - Order set to Active`
//           : 'Vendor removed - Order set to Pending'
//       ]
//     );

//     res.json({
//       success: true,
//       message: vendor_id
//         ? 'Order assigned to vendor and set to Active'
//         : 'Vendor removed from order',
//       order: {
//         order_id: orderId,
//         status: updateData.status,
//         vendor_id: vendor_id,
//         vendor_data: vendorData,
//         assigned_date: updateData.assigned_date,
//         confirmed_date: updateData.confirmed_date
//       }
//     });

//   } catch (error) {
//     console.error('Order assignment error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to assign order',
//       error: error.message
//     });
//   }
// });

// // 2. order completion endpoint
// app.patch('/orders/:orderId/complete', verifyToken(['admin', 'vendor', 'superadmin']), async (req, res) => {
//   const { orderId } = req.params;
//   const userRole = req.user.role;

//   try {
//     // First, check the order
//     const [orderRows] = await db.query(
//       'SELECT * FROM orders WHERE order_id = ?',
//       [orderId]
//     );

//     if (orderRows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     const order = orderRows[0];

//     // Check if vendor is trying to complete their own order
//     if (userRole === 'vendor' && order.vendor_id !== req.user.vendorId) {
//       return res.status(403).json({
//         success: false,
//         message: 'You can only complete your assigned orders'
//       });
//     }

//     // Update order
//     await db.query(
//       `UPDATE orders 
//        SET status = 'Completed',
//            completed_date = NOW()
//        WHERE order_id = ?`,
//       [orderId]
//     );

//     // Update vendor statistics
//     if (order.vendor_id) {
//       await db.query(
//         `UPDATE vendors 
//          SET completed_orders = completed_orders + 1,
//              pending_orders = pending_orders - 1,
//              updated_at = NOW()
//          WHERE id = ?`,
//         [order.vendor_id]
//       );
//     }

//     res.json({
//       success: true,
//       message: 'Order marked as completed',
//       order: {
//         order_id: orderId,
//         status: 'Completed',
//         completed_date: new Date()
//       }
//     });
//   } catch (error) {
//     console.error('Order completion error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to complete order'
//     });
//   }
// });

// // 3. vendor's own orders viewing endpoint
// app.get('/api/vendor/orders', authenticateVendor, async (req, res) => {
//   try {
//     const vendorId = req.vendor.vendorId;

//     const [orders] = await db.query(
//       `SELECT 
//         o.order_id,
//         o.user_id,
//         o.order_date,
//         o.time_slot,
//         o.notes,
//         o.address_type,
//         o.home_address,
//         o.office_address,
//         o.temp_address,
//         o.recipient_name,
//         o.recipient_phone,
//         o.cart_items,
//         o.status,
//         o.cancel_reason,
//         o.service_expert,
//         o.assigned_date,
//         o.completed_date,
//         u.name AS customer_name,
//         u.email AS customer_email,
//         u.phone_number AS customer_phone
//       FROM orders o
//       LEFT JOIN users u ON o.user_id = u.custom_id
//       WHERE o.vendor_id = ?
//       ORDER BY o.order_date DESC`,
//       [vendorId]
//     );

//     // Parse JSON fields
//     const parsedOrders = orders.map(order => {
//       let parsedCart = [];
//       let parsedServiceExpert = null;
//       let parsedAddress = {};

//       try {
//         parsedCart = typeof order.cart_items === 'string'
//           ? JSON.parse(order.cart_items)
//           : order.cart_items;
//       } catch (e) {
//         console.error("Cart parse error:", order.cart_items);
//       }

//       try {
//         if (order.service_expert) {
//           parsedServiceExpert = typeof order.service_expert === 'string'
//             ? JSON.parse(order.service_expert)
//             : order.service_expert;
//         }
//       } catch (e) {
//         console.error("Service expert parse error:", order.service_expert);
//       }

//       // Address parse (choose based on address_type)
//       let addressField = null;
//       if (order.address_type === 'home' && order.home_address) {
//         addressField = order.home_address;
//       } else if (order.address_type === 'office' && order.office_address) {
//         addressField = order.office_address;
//       } else if (order.address_type === 'another' && order.temp_address) {
//         addressField = order.temp_address;
//       }

//       try {
//         if (addressField) {
//           parsedAddress = typeof addressField === 'string'
//             ? JSON.parse(addressField)
//             : addressField;
//         }
//       } catch (e) {
//         console.error("Address parse error:", addressField);
//       }

//       // Calculate total
//       const total = parsedCart.reduce((sum, item) =>
//         sum + (item.price * item.quantity), 0
//       );

//       return {
//         ...order,
//         cart_items: parsedCart,
//         service_expert: parsedServiceExpert,
//         address: parsedAddress,
//         total: total.toFixed(2)
//       };
//     });

//     res.json({
//       success: true,
//       orders: parsedOrders
//     });
//   } catch (error) {
//     console.error('Vendor orders error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch orders'
//     });
//   }
// });

// // 4. order review submission endpoint
// app.post('/orders/:orderId/review', authenticateJWT, async (req, res) => {
//   const { orderId } = req.params;
//   const { serviceExpert, websiteService, comments } = req.body;
//   const userId = req.user.userId;

//   try {
//     // First, check the order
//     const [orderRows] = await db.query(
//       `SELECT * FROM orders 
//        WHERE order_id = ? AND user_id = ? AND status = 'Completed'`,
//       [orderId, userId]
//     );

//     if (orderRows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found or not completed'
//       });
//     }

//     const order = orderRows[0];

//     // Check if a review has already been submitted
//     const [existingReview] = await db.query(
//       'SELECT id FROM order_reviews WHERE order_id = ?',
//       [orderId]
//     );

//     if (existingReview.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Review already submitted for this order'
//       });
//     }

//     // Prepare review data
//     const reviewData = {
//       order_id: orderId,
//       user_id: userId,
//       service_expert_rating: serviceExpert || 5,
//       website_service_rating: websiteService || 5,
//       comments: comments || '',
//       created_at: new Date()
//     };

//     // Save review to database
//     await db.query(
//       `INSERT INTO order_reviews 
//        (order_id, user_id, service_expert_rating, website_service_rating, comments, created_at) 
//        VALUES (?, ?, ?, ?, ?, ?)`,
//       [
//         reviewData.order_id,
//         reviewData.user_id,
//         reviewData.service_expert_rating,
//         reviewData.website_service_rating,
//         reviewData.comments,
//         reviewData.created_at
//       ]
//     );

//     // Update review information in order
//     const reviewSummary = {
//       serviceExpert: reviewData.service_expert_rating,
//       websiteService: reviewData.website_service_rating,
//       comments: reviewData.comments,
//       reviewedAt: reviewData.created_at
//     };

//     await db.query(
//       'UPDATE orders SET reviews = ? WHERE order_id = ?',
//       [JSON.stringify(reviewSummary), orderId]
//     );

//     res.json({
//       success: true,
//       message: 'Review submitted successfully',
//       review: reviewData
//     });
//   } catch (error) {
//     console.error('Review submission error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to submit review'
//     });
//   }
// });

// // 5. order review viewing endpoint
// app.get('/orders/:orderId/reviews', async (req, res) => {
//   const { orderId } = req.params;

//   try {
//     const [reviews] = await db.query(
//       `SELECT 
//         r.*,
//         u.name as user_name,
//         u.photo as user_photo
//        FROM order_reviews r
//        LEFT JOIN users u ON r.user_id = u.custom_id
//        WHERE r.order_id = ?
//        ORDER BY r.created_at DESC`,
//       [orderId]
//     );

//     if (reviews.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'No reviews found for this order'
//       });
//     }

//     res.json({
//       success: true,
//       reviews: reviews.map(review => ({
//         id: review.id,
//         order_id: review.order_id,
//         user_name: review.user_name,
//         user_photo: review.user_photo,
//         service_expert_rating: review.service_expert_rating,
//         website_service_rating: review.website_service_rating,
//         comments: review.comments,
//         created_at: review.created_at
//       }))
//     });
//   } catch (error) {
//     console.error('Get reviews error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch reviews'
//     });
//   }
// });

// // 6. order tracking information
// app.get('/orders/:orderId/tracking', authenticateJWT, async (req, res) => {
//   const { orderId } = req.params;
//   const userId = req.user.userId;

//   try {
//     const [orderRows] = await db.query(
//       `SELECT 
//         o.*,
//         u.name as customer_name,
//         u.email as customer_email,
//         u.phone_number as customer_phone,
//         v.name as vendor_name,
//         v.email as vendor_email,
//         v.phone_number as vendor_phone,
//         v.vendor_photo as vendor_photo
//        FROM orders o
//        LEFT JOIN users u ON o.user_id = u.custom_id
//        LEFT JOIN vendors v ON o.vendor_id = v.id
//        WHERE o.order_id = ? AND o.user_id = ?`,
//       [orderId, userId]
//     );

//     if (orderRows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     const order = orderRows[0];

//     // Parse JSON fields
//     let parsedCart = [];
//     let parsedServiceExpert = null;
//     let parsedAddress = {};
//     let parsedReviews = null;

//     try {
//       parsedCart = typeof order.cart_items === 'string'
//         ? JSON.parse(order.cart_items)
//         : order.cart_items;
//     } catch (e) {
//       console.error("Cart parse error:", e);
//     }

//     try {
//       if (order.service_expert) {
//         parsedServiceExpert = typeof order.service_expert === 'string'
//           ? JSON.parse(order.service_expert)
//           : order.service_expert;
//       }
//     } catch (e) {
//       console.error("Service expert parse error:", e);
//     }

//     try {
//       if (order.reviews) {
//         parsedReviews = typeof order.reviews === 'string'
//           ? JSON.parse(order.reviews)
//           : order.reviews;
//       }
//     } catch (e) {
//       console.error("Reviews parse error:", e);
//     }

//     // Address parse
//     let addressField = null;
//     if (order.address_type === 'home' && order.home_address) {
//       addressField = order.home_address;
//     } else if (order.address_type === 'office' && order.office_address) {
//       addressField = order.office_address;
//     } else if (order.address_type === 'another' && order.temp_address) {
//       addressField = order.temp_address;
//     }

//     try {
//       if (addressField) {
//         parsedAddress = typeof addressField === 'string'
//           ? JSON.parse(addressField)
//           : addressField;
//       }
//     } catch (e) {
//       console.error("Address parse error:", e);
//     }

//     // Calculate total
//     const total = parsedCart.reduce((sum, item) =>
//       sum + (item.price * item.quantity), 0
//     );

//     // Create tracking timeline
//     const timeline = [
//       {
//         status: 'Order Placed',
//         time: order.order_date,
//         description: 'Order has been placed successfully',
//         completed: true
//       },
//       {
//         status: 'Order Confirmed',
//         time: order.confirmed_date || null,
//         description: 'Order has been confirmed',
//         completed: !!order.confirmed_date
//       },
//       {
//         status: 'Vendor Assigned',
//         time: order.assigned_date || null,
//         description: order.vendor_name ? `Assigned to ${order.vendor_name}` : 'Waiting for vendor assignment',
//         completed: !!order.assigned_date
//       },
//       {
//         status: 'Service In Progress',
//         time: order.in_progress_date || null,
//         description: 'Service expert is on the way',
//         completed: order.status === 'Active' || order.status === 'Completed'
//       },
//       {
//         status: 'Completed',
//         time: order.completed_date || null,
//         description: 'Service has been completed',
//         completed: order.status === 'Completed'
//       }
//     ];

//     // Response data
//     const responseData = {
//       success: true,
//       order: {
//         order_id: order.order_id,
//         status: order.status,
//         timeline: timeline,
//         customer: {
//           name: order.customer_name,
//           email: order.customer_email,
//           phone: order.customer_phone
//         },
//         vendor: order.vendor_id ? {
//           name: order.vendor_name,
//           email: order.vendor_email,
//           phone: order.vendor_phone,
//           photo: order.vendor_photo
//         } : null,
//         service_expert: parsedServiceExpert,
//         address: parsedAddress,
//         cart_items: parsedCart,
//         total: total.toFixed(2),
//         reviews: parsedReviews,
//         time_slot: order.time_slot,
//         notes: order.notes || '',
//         cancel_reason: order.cancel_reason || null
//       }
//     };

//     res.json(responseData);
//   } catch (error) {
//     console.error('Tracking error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch tracking information'
//     });
//   }
// });

// // 7. password reset verification
// app.post('/api/verify-reset-token', async (req, res) => {
//   const { token, email } = req.body;

//   if (!token || !email) {
//     return res.status(400).json({
//       success: false,
//       message: 'Token and email are required'
//     });
//   }

//   try {
//     // Check in users table
//     const [users] = await db.query(
//       "SELECT email FROM users WHERE reset_token = ? AND email = ? AND reset_token_expiry > NOW()",
//       [token, email]
//     );

//     // Check in vendors table
//     const [vendors] = await db.query(
//       "SELECT email FROM vendors WHERE reset_token = ? AND email = ? AND reset_token_expiry > NOW()",
//       [token, email]
//     );

//     const isValid = users.length > 0 || vendors.length > 0;

//     if (!isValid) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid or expired token'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Token is valid'
//     });
//   } catch (error) {
//     console.error('Token verification error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Token verification failed'
//     });
//   }
// });

// // 8. password reset
// app.post('/api/reset-password', async (req, res) => {
//   const { token, email, newPassword } = req.body;

//   if (!token || !email || !newPassword) {
//     return res.status(400).json({
//       success: false,
//       message: 'All fields are required'
//     });
//   }

//   // Validate password strength
//   if (newPassword.length < 6) {
//     return res.status(400).json({
//       success: false,
//       message: 'Password must be at least 6 characters'
//     });
//   }

//   try {
//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     // Reset token verification
//     const [users] = await db.query(
//       "SELECT * FROM users WHERE reset_token = ? AND email = ? AND reset_token_expiry > NOW()",
//       [token, email]
//     );

//     const [vendors] = await db.query(
//       "SELECT * FROM vendors WHERE reset_token = ? AND email = ? AND reset_token_expiry > NOW()",
//       [token, email]
//     );

//     let userType = null;
//     let userId = null;

//     if (users.length > 0) {
//       userType = 'user';
//       userId = users[0].custom_id;
//     } else if (vendors.length > 0) {
//       userType = 'vendor';
//       userId = vendors[0].id;
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid or expired token'
//       });
//     }

//     // Update password based on user type
//     if (userType === 'user') {
//       await db.query(
//         "UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE email = ?",
//         [hashedPassword, email]
//       );
//     } else if (userType === 'vendor') {
//       await db.query(
//         "UPDATE vendors SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE email = ?",
//         [hashedPassword, email]
//       );
//     }

//     res.json({
//       success: true,
//       message: 'Password reset successfully'
//     });
//   } catch (error) {
//     console.error('Password reset error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Password reset failed'
//     });
//   }
// });

// // 9. get orders based on filters
// app.get('/orders/filter', authenticateJWT, async (req, res) => {
//   const userId = req.user.userId;
//   const { status, dateFrom, dateTo, search } = req.query;

//   try {
//     let query = `
//       SELECT * FROM orders 
//       WHERE user_id = ?
//     `;
//     const params = [userId];

//     // status filter
//     if (status && status !== 'all') {
//       if (status === 'active') {
//         query += ` AND status NOT IN ('Pending', 'Cancelled', 'Completed')`;
//       } else {
//         query += ` AND status = ?`;
//         params.push(status);
//       }
//     }

//     // date filter
//     if (dateFrom) {
//       query += ` AND order_date >= ?`;
//       params.push(dateFrom);
//     }
//     if (dateTo) {
//       query += ` AND order_date <= ?`;
//       params.push(dateTo);
//     }

//     // search filter
//     if (search) {
//       query += ` AND (order_id LIKE ? OR status LIKE ? OR notes LIKE ?)`;
//       const searchParam = `%${search}%`;
//       params.push(searchParam, searchParam, searchParam);
//     }

//     query += ` ORDER BY order_date DESC`;

//     const [orders] = await db.query(query, params);

//     // Parse JSON fields
//     const parsedOrders = orders.map(order => {
//       let parsedCart = [];
//       let parsedServiceExpert = null;
//       let parsedAddress = {};

//       try {
//         parsedCart = typeof order.cart_items === 'string'
//           ? JSON.parse(order.cart_items)
//           : order.cart_items;
//       } catch (e) {
//         console.error("Cart parse error:", e);
//       }

//       try {
//         if (order.service_expert) {
//           parsedServiceExpert = typeof order.service_expert === 'string'
//             ? JSON.parse(order.service_expert)
//             : order.service_expert;
//         }
//       } catch (e) {
//         console.error("Service expert parse error:", e);
//       }

//       // Address parse
//       let addressField = null;
//       if (order.address_type === 'home' && order.home_address) {
//         addressField = order.home_address;
//       } else if (order.address_type === 'office' && order.office_address) {
//         addressField = order.office_address;
//       } else if (order.address_type === 'another' && order.temp_address) {
//         addressField = order.temp_address;
//       }

//       try {
//         if (addressField) {
//           parsedAddress = typeof addressField === 'string'
//             ? JSON.parse(addressField)
//             : addressField;
//         }
//       } catch (e) {
//         console.error("Address parse error:", e);
//       }

//       // Calculate total
//       const total = parsedCart.reduce((sum, item) =>
//         sum + (item.price * item.quantity), 0
//       );

//       return {
//         ...order,
//         cart_items: parsedCart,
//         service_expert: parsedServiceExpert,
//         address: parsedAddress,
//         total: total.toFixed(2)
//       };
//     });

//     res.json({
//       success: true,
//       orders: parsedOrders,
//       count: parsedOrders.length
//     });
//   } catch (error) {
//     console.error('Filter orders error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to filter orders'
//     });
//   }
// });

// // 10. order confirmation endpoint (Pending to Active)
// app.patch('/orders/:orderId/confirm', verifyToken(['admin', 'superadmin']), async (req, res) => {
//   const { orderId } = req.params;

//   try {
//     const [orderRows] = await db.query(
//       'SELECT * FROM orders WHERE order_id = ?',
//       [orderId]
//     );

//     if (orderRows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     const order = orderRows[0];

//     if (order.status !== 'Pending') {
//       return res.status(400).json({
//         success: false,
//         message: 'Order is not in Pending status'
//       });
//     }

//     await db.query(
//       `UPDATE orders 
//        SET status = 'Active',
//            confirmed_date = NOW()
//        WHERE order_id = ?`,
//       [orderId]
//     );

//     res.json({
//       success: true,
//       message: 'Order confirmed successfully',
//       order: {
//         order_id: orderId,
//         status: 'Active',
//         confirmed_date: new Date()
//       }
//     });
//   } catch (error) {
//     console.error('Order confirmation error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to confirm order'
//     });
//   }
// });

// // vendor details fetching endpoint

// // ভেন্ডর ডিটেইলস ফেচ করার API (ডাইনামিক কলাম চেক)
// app.get('/api/vendors/:vendorId', verifyToken(['admin', 'superadmin', 'user']), async (req, res) => {
//   const vendorId = req.params.vendorId;

//   try {
//     // প্রথমে বিদ্যমান কলামগুলো খুঁজে বের করি
//     const [columns] = await db.query(`
//       SELECT COLUMN_NAME 
//       FROM INFORMATION_SCHEMA.COLUMNS 
//       WHERE TABLE_NAME = 'vendors' 
//       AND TABLE_SCHEMA = DATABASE()
//     `);

//     const availableColumns = columns.map(col => col.COLUMN_NAME);
//     console.log('Available columns:', availableColumns);

//     // আমাদের প্রয়োজনীয় কলামগুলোর লিস্ট
//     const desiredColumns = [
//       'id', 'name', 'email', 'phone_number', 'password', // password কলাম চেক করি
//       'dob', 'nid_number', 'company_name', 'permanent_address',
//       'present_address', 'business_address', 'technician_quantity',
//       'profileImage', 'nidFront', 'nidBack', 'cv', 'tradeLicense',
//       'service_areas', 'servicesArray', 'rating', 'completed_orders',
//       'pending_orders', 'canceled_orders', 'specialization', 'vehicle_type',
//       'working_hours', 'location', 'service_radius', 'verified', 'status', 'created_at'
//       , 'vendor_photo' // location হিসাব করার জন্য
//     ];

//     // শুধুমাত্র বিদ্যমান কলামগুলো select করি
//     const columnsToSelect = desiredColumns.filter(col => availableColumns.includes(col));

//     // যদি কোন কলাম না থাকে তবে মিনিমাম কলাম select করি
//     if (columnsToSelect.length === 0) {
//       columnsToSelect.push('id', 'name', 'email', 'phone', 'rating', 'created_at');
//     }

//     const selectQuery = `
//       SELECT ${columnsToSelect.join(', ')}
//       FROM vendors 
//       WHERE id = ?
//     `;

//     console.log('Executing query:', selectQuery);

//     const [vendorRows] = await db.query(selectQuery, [vendorId]);

//     if (vendorRows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Vendor not found'
//       });
//     }

//     const vendor = vendorRows[0];

//     // Parse JSON strings if they exist
//     try {
//       if (vendor.serviceAreasArray && typeof vendor.serviceAreasArray === 'string') {
//         vendor.serviceAreasArray = JSON.parse(vendor.serviceAreasArray);
//       }
//       if (vendor.servicesArray && typeof vendor.servicesArray === 'string') {
//         vendor.servicesArray = JSON.parse(vendor.servicesArray);
//       }
//     } catch (parseError) {
//       console.error('Error parsing JSON fields:', parseError);
//       vendor.serviceAreasArray = [];
//       vendor.servicesArray = [];
//     }

//     // Success rate গণনা
//     const completed = vendor.completed_orders || 0;
//     const canceled = vendor.canceled_orders || 0;

//     if (completed > 0) {
//       const totalOrders = completed + canceled;
//       vendor.success_rate = Math.round((completed / totalOrders) * 100);
//     } else {
//       vendor.success_rate = 0;
//     }

//     // Average rating
//     vendor.avg_rating = vendor.rating || 4.5;

//     // Experience years
//     if (vendor.dob) {
//       const dobDate = new Date(vendor.dob);
//       const currentDate = new Date();
//       let yearsDiff = currentDate.getFullYear() - dobDate.getFullYear();

//       const monthDiff = currentDate.getMonth() - dobDate.getMonth();
//       if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < dobDate.getDate())) {
//         yearsDiff--;
//       }

//       vendor.experience_years = Math.max(1, yearsDiff - 18);
//     } else {
//       const createdDate = new Date(vendor.created_at);
//       const currentDate = new Date();
//       const yearsDiff = currentDate.getFullYear() - createdDate.getFullYear();
//       vendor.experience_years = Math.max(1, yearsDiff);
//     }

//     // Total reviews
//     vendor.total_reviews = Math.floor(vendor.completed_orders * 0.7) || 25;

//     // Specialization
//     if (!vendor.specialization) {
//       if (vendor.servicesArray && vendor.servicesArray.length > 0) {
//         vendor.specialization = vendor.servicesArray[0];
//       } else {
//         vendor.specialization = 'General Services';
//       }
//     }

//     // Default values
//     if (!vendor.vehicle_type) vendor.vehicle_type = 'Motorcycle';
//     if (!vendor.working_hours) vendor.working_hours = '9:00 AM - 6:00 PM';
//     if (!vendor.location) {
//       if (vendor.service_areas) {
//         vendor.location = vendor.service_areas;
//       } else if (vendor.permanent_address) {
//         vendor.location = vendor.permanent_address;
//       } else {
//         vendor.location = 'Location not specified';
//       }
//     }
//     if (!vendor.service_radius) vendor.service_radius = 10;
//     if (vendor.verified === undefined || vendor.verified === null) vendor.verified = true;

//     // photo field mapping
//     vendor.photo = vendor.vendor_photo || null;

//     // Sensitive fields remove করি
//     delete vendor.password; // hashedPassword এর পরিবর্তে password
//     delete vendor.nidFront;
//     delete vendor.nidBack;
//     delete vendor.cv;
//     delete vendor.tradeLicense;
//     if (vendor.hashedPassword) delete vendor.hashedPassword;

//     res.json({
//       success: true,
//       vendor: vendor
//     });

//   } catch (error) {
//     console.error('Fetch vendor error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch vendor details',
//       error: error.message
//     });
//   }
// });

// // Report issue API
// app.post('/orders/:orderId/report', verifyToken(['user', 'admin']), async (req, res) => {
//   const orderId = decodeURIComponent(req.params.orderId);
//   const userId = req.user.id;

//   try {
//     // Check if order exists
//     const [orderRows] = await db.query(
//       'SELECT * FROM orders WHERE order_id = ?',
//       [orderId]
//     );

//     if (orderRows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     const order = orderRows[0];

//     // Check if user owns this order
//     if (order.user_id !== userId && req.user.role !== 'admin' && req.user.role !== 'superadmin') {
//       return res.status(403).json({
//         success: false,
//         message: 'You can only report issues for your own orders'
//       });
//     }

//     // Handle file upload
//     let fileUrl = null;
//     if (req.files && req.files.file) {
//       const file = req.files.file;
//       const fileName = `${Date.now()}_${file.name}`;
//       const uploadPath = path.join(__dirname, 'uploads', 'reports', fileName);

//       // Create directory if it doesn't exist
//       const dirPath = path.join(__dirname, 'uploads', 'reports');
//       if (!fs.existsSync(dirPath)) {
//         fs.mkdirSync(dirPath, { recursive: true });
//       }

//       await file.mv(uploadPath);
//       fileUrl = `/uploads/reports/${fileName}`;
//     }

//     // Save report to database
//     const [result] = await db.query(
//       `INSERT INTO order_reports 
//        (order_id, user_id, description, file_url, status, created_at) 
//        VALUES (?, ?, ?, ?, ?, NOW())`,
//       [orderId, userId, req.body.description, fileUrl, 'pending']
//     );

//     // Update order notes
//     await db.query(
//       `UPDATE orders 
//        SET notes = CONCAT(IFNULL(notes, ''), '\n[${new Date().toLocaleString()}]: Issue reported - ${req.body.description}')
//        WHERE order_id = ?`,
//       [orderId]
//     );

//     res.json({
//       success: true,
//       message: 'Issue reported successfully',
//       reportId: result.insertId
//     });

//   } catch (error) {
//     console.error('Report error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to submit report'
//     });
//   }
// });
// // =============================== EXISTING ENDPOINTS ===============================

// app.put(
//   "/api/user-profile",
//   authenticateJWT,
//   uploadProfile.single("photo"),
//   async (req, res) => {
//     const userId = req.user.userId;

//     try {
//       const { name, phone_number } = req.body;

//       // Validate required fields
//       if (!name || name.trim() === '') {
//         return res.status(400).json({
//           success: false,
//           message: "Name is required"
//         });
//       }

//       let home_address = {};
//       let office_address = {};

//       try {
//         home_address =
//           typeof req.body.home_address === "string"
//             ? JSON.parse(req.body.home_address)
//             : req.body.home_address || {};

//         office_address =
//           typeof req.body.office_address === "string"
//             ? JSON.parse(req.body.office_address)
//             : req.body.office_address || {};
//       } catch (parseError) {
//         console.error("Address parsing error:", parseError);
//       }

//       // Build update fields dynamically to avoid setting undefined values
//       const updateFields = {
//         name: name.trim(), // Ensure name is trimmed and always has a value
//         phone_number: phone_number || null, // Allow phone_number to be null if not provided
//         home_address: JSON.stringify(home_address),
//         office_address: JSON.stringify(office_address),
//       };

//       if (req.file) {
//         const photoPath = `/uploads/profiles/${req.file.filename}`;
//         updateFields.photo = photoPath;
//       }

//       // Remove any undefined values from updateFields
//       Object.keys(updateFields).forEach(key => {
//         if (updateFields[key] === undefined) {
//           delete updateFields[key];
//         }
//       });

//       await db.query("UPDATE users SET ? WHERE custom_id = ?", [
//         updateFields,
//         userId,
//       ]);

//       const [updated] = await db.query(
//         "SELECT * FROM users WHERE custom_id = ?",
//         [userId]
//       );

//       if (!updated || updated.length === 0) {
//         return res.status(404).json({
//           success: false,
//           message: "User not found",
//         });
//       }

//       const updatedUser = updated[0];

//       const responseUser = {
//         ...updatedUser,
//         home_address:
//           typeof updatedUser.home_address === "string"
//             ? JSON.parse(updatedUser.home_address)
//             : updatedUser.home_address || {},
//         office_address:
//           typeof updatedUser.office_address === "string"
//             ? JSON.parse(updatedUser.office_address)
//             : updatedUser.office_address || {},
//       };

//       res.json({
//         success: true,
//         user: responseUser,
//       });
//     } catch (err) {
//       console.error("Profile update error:", err);
//       res.status(500).json({
//         success: false,
//         message: "Error updating profile",
//         error:
//           process.env.NODE_ENV === "development" ? err.message : undefined,
//       });
//     }
//   }
// );

// // User Registration
// app.post("/api/register", async (req, res) => {
//   const { firstName, email, phoneNumber, password } = req.body;

//   // Input validation
//   if (!firstName || !email || !phoneNumber || !password) {
//     return res.status(400).json({ success: false, message: "All fields are required" });
//   }

//   try {
//     // Check for duplicate email or phone
//     const [duplicateCheck] = await db.query(
//       "SELECT * FROM users WHERE email = ? OR phone_number = ?",
//       [email, phoneNumber]
//     );

//     if (duplicateCheck.length > 0) {
//       return res.status(400).json({ success: false, message: "Email or phone number already registered" });
//     }

//     // Generate custom user ID
//     const currentDate = new Date();
//     const year = currentDate.getFullYear().toString().slice(-2);
//     const month = currentDate.getMonth() + 1;
//     const day = currentDate.getDate();
//     const datePrefix = `${year}${month}${day}`;

//     const [maxIdResult] = await db.query(
//       "SELECT MAX(CAST(SUBSTRING(custom_id, 6) AS UNSIGNED)) as maxSerial FROM users"
//     );
//     const nextSerial = (maxIdResult[0].maxSerial || 0) + 1;
//     const customId = `${datePrefix}${nextSerial}`;

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create new user
//     await db.query(
//       "INSERT INTO users (custom_id, name, email, phone_number, password, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
//       [customId, firstName, email, phoneNumber, hashedPassword]
//     );

//     res.status(200).json({ success: true, message: "Registration successful!", customId });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Registration error" });
//   }
// });

// // // universal login endpoint for all user types
// // app.post("/api/login", async (req, res) => {
// //   const { email, password } = req.body;

// //   // 🔐 Check Super Admin
// //   const [superRows] = await db.query("SELECT * FROM superadmins WHERE email = ?", [email]);
// //   const superUser = superRows[0];
// //   if (superUser && await bcrypt.compare(password, superUser.password)) {
// //     const token = jwt.sign({ id: superUser.id, role: "superadmin" }, process.env.JWT_SECRET, { expiresIn: "1h" });
// //     return res.cookie("token", token, { httpOnly: true, secure: true }).json({
// //       success: true,
// //       role: "superadmin",
// //       token,
// //       user: {
// //         email: superUser.email,
// //         name: "Super Admin"
// //       }
// //     });
// //   }

// //   // 🔐 Check Admin
// //   const [adminRows] = await db.query("SELECT * FROM admins WHERE email = ? AND verified = 1", [email]);
// //   const admin = adminRows[0];
// //   if (admin && await bcrypt.compare(password, admin.password)) {
// //     const token = jwt.sign({ id: admin.id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });
// //     return res.cookie("token", token, { httpOnly: true, secure: true }).json({
// //       success: true,
// //       role: "admin",
// //       token,
// //       user: {
// //         email: admin.email,
// //         name: "Admin"
// //       }
// //     });
// //   }

// //   // 🔐 Check Regular User
// //   const [userRows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
// //   const user = userRows[0];
// //   if (user && await bcrypt.compare(password, user.password)) {
// //     const token = jwt.sign({ userId: user.custom_id, role: "user" }, process.env.JWT_SECRET, { expiresIn: "1h" });

// //     // Fetch fresh user data to return
// //     const [freshUserRows] = await db.query("SELECT * FROM users WHERE custom_id = ?", [user.custom_id]);
// //     const freshUser = freshUserRows[0];

// //     return res.cookie("token", token, { httpOnly: true, secure: true }).json({
// //       success: true,
// //       role: "user",
// //       token,
// //       user: {
// //         email: freshUser.email,
// //         name: freshUser.name,
// //         photo: freshUser.photo,
// //       }
// //     });
// //   }


// //   return res.status(401).json({ success: false, message: "Invalid credentials" });
// // });

// // universal login endpoint for all user types
// app.post("/api/login", async (req, res) => {
//   const { email, password } = req.body;

//   console.log(`🔐 Login attempt for: ${email}`);

//   try {
//     // 🔐 1. Check Super Admin
//     const [superRows] = await db.query("SELECT * FROM superadmins WHERE email = ?", [email]);
//     const superUser = superRows[0];
//     if (superUser && await bcrypt.compare(password, superUser.password)) {
//       const token = jwt.sign({ id: superUser.id, role: "superadmin" }, process.env.JWT_SECRET, { expiresIn: "8h" });
//       return res.json({
//         success: true,
//         role: "superadmin",
//         token,
//         user: {
//           id: superUser.id,
//           email: superUser.email,
//           name: "Super Admin"
//         }
//       });
//     }

//     // 🔐 2. Check Admin
//     const [adminRows] = await db.query("SELECT * FROM admins WHERE email = ? AND verified = 1", [email]);
//     const admin = adminRows[0];
//     if (admin && await bcrypt.compare(password, admin.password)) {
//       const token = jwt.sign({ id: admin.id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "8h" });
//       return res.json({
//         success: true,
//         role: "admin",
//         token,
//         user: {
//           id: admin.id,
//           email: admin.email,
//           name: "Admin"
//         }
//       });
//     }

//     // 🔐 3. Check Regular User
//     const [userRows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
//     const user = userRows[0];
//     if (user && await bcrypt.compare(password, user.password)) {
//       const token = jwt.sign({ userId: user.custom_id, role: "user" }, process.env.JWT_SECRET, { expiresIn: "8h" });

//       return res.json({
//         success: true,
//         role: "user",
//         token,
//         user: {
//           id: user.custom_id,
//           email: user.email,
//           name: user.name,
//           photo: user.photo,
//         }
//       });
//     }

//     // 🔐 4. Check Vendor (New Addition)
//     const [vendorRows] = await db.query("SELECT * FROM vendors WHERE email = ?", [email]);
//     const vendor = vendorRows[0];
//     if (vendor && await bcrypt.compare(password, vendor.password)) {
//       if (vendor.status !== 'active') {
//         return res.status(403).json({
//           success: false,
//           message: "Your vendor account is pending approval"
//         });
//       }

//       const token = jwt.sign({
//         id: vendor.id,
//         role: "vendor",
//         email: vendor.email
//       }, process.env.JWT_SECRET, { expiresIn: "8h" });

//       return res.json({
//         success: true,
//         role: "vendor",
//         token,
//         user: {
//           id: vendor.id,
//           name: vendor.name,
//           email: vendor.email,
//           phone: vendor.phone_number,
//           profileImage: vendor.vendor_photo,
//           status: vendor.status
//         }
//       });
//     }

//     // 🔐 5. Check Technician (New Addition)
//     const [technicianRows] = await db.query("SELECT * FROM technicians WHERE email = ?", [email]);
//     const technician = technicianRows[0];
//     if (technician && await bcrypt.compare(password, technician.password)) {
//       if (technician.status !== 'active') {
//         return res.status(403).json({
//           success: false,
//           message: "Your technician account is pending approval"
//         });
//       }

//       const token = jwt.sign({
//         id: technician.id,
//         role: "technician",
//         email: technician.email
//       }, process.env.JWT_SECRET, { expiresIn: "8h" });

//       return res.json({
//         success: true,
//         role: "technician",
//         token,
//         user: {
//           id: technician.id,
//           name: technician.name,
//           email: technician.email,
//           phone: technician.phone_number,
//           profileImage: technician.photo,
//           status: technician.status,
//           vendor_id: technician.vendor_id
//         }
//       });
//     }

//     console.log(`❌ No user found with email: ${email}`);
//     return res.status(401).json({
//       success: false,
//       message: "Invalid email or password"
//     });

//   } catch (error) {
//     console.error("Login error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Login failed. Please try again later."
//     });
//   }
// });

// //  verify JWT token
// app.post("/api/auth/verify", authenticateJWT, async (req, res) => {
//   const userId = req.user.userId;
//   try {
//     const [result] = await db.query("SELECT name, email FROM users WHERE custom_id = ?", [userId]);
//     if (result.length === 0) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }
//     res.status(200).json({ success: true, user: result[0] });
//   } catch (err) {
//     console.error("Auth verify error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });


// // // Get User Profile
// app.get("/api/user-profile", authenticateJWT, async (req, res) => {
//   const userId = req.user.userId;
//   console.log("Authenticated userId:", userId);

//   try {
//     const [rows] = await db.query("SELECT * FROM users WHERE custom_id = ?", [userId]);
//     if (rows.length === 0) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     const user = rows[0];
//     const parsedUser = {
//       ...user,
//       home_address: typeof user.home_address === "string" ? JSON.parse(user.home_address) : {},
//       office_address: typeof user.office_address === "string" ? JSON.parse(user.office_address) : {},
//     };

//     res.json({ success: true, user: parsedUser });
//   } catch (err) {
//     console.error("Fetch profile error:", err);
//     res.status(500).json({ success: false, message: "Failed to fetch profile" });
//   }
// });


// // Place Order
// app.post("/api/place-order", authenticateJWT, async (req, res) => {
//   const userId = req.user.userId;
//   const {
//     category,
//     cart,
//     selectedDate,
//     selectedSlot,
//     notes,
//     addressType,
//     address,
//     home_address,
//     office_address,
//     temp_address,
//     recipientName,
//     recipientPhone
//   } = req.body;

//   // main address field or fallback to type-specific fields
//   let finalAddress = address;

//   if (!finalAddress) {
//     if (addressType === 'home' && home_address) finalAddress = home_address;
//     else if (addressType === 'office' && office_address) finalAddress = office_address;
//     else if (addressType === 'another' && temp_address) finalAddress = temp_address;
//   }

//   if (!category || !cart || cart.length === 0 || !addressType || !finalAddress) {
//     return res.status(400).json({ success: false, message: "Required fields missing" });
//   }

//   try {
//     const generateRandomNumber = () => Math.floor(1000 + Math.random() * 9000);
//     const orderId = `#${category}${generateRandomNumber()}`;

//     let homeAddress = null;
//     let officeAddress = null;
//     let tempAddress = null;

//     // Parse the address based on type
//     if (addressType === 'home') homeAddress = typeof finalAddress === 'string' ? JSON.parse(finalAddress) : finalAddress;
//     if (addressType === 'office') officeAddress = typeof finalAddress === 'string' ? JSON.parse(finalAddress) : finalAddress;
//     if (addressType === 'another') tempAddress = typeof finalAddress === 'string' ? JSON.parse(finalAddress) : finalAddress;

//     await db.query(
//       `INSERT INTO orders 
//         (order_id, user_id, order_date, time_slot, notes, 
//          address_type, home_address, office_address, temp_address, 
//          recipient_name, recipient_phone, 
//          cart_items, status) 
//        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`,
//       [
//         orderId,
//         userId,
//         selectedDate,
//         selectedSlot,
//         notes || "",
//         addressType,
//         JSON.stringify(homeAddress),
//         JSON.stringify(officeAddress),
//         JSON.stringify(tempAddress),
//         recipientName || null,
//         recipientPhone || null,
//         JSON.stringify(cart),
//       ]
//     );

//     res.status(200).json({ success: true, message: "Order placed successfully", orderId });
//   } catch (error) {
//     console.error("Order error:", error);
//     res.status(500).json({ success: false, message: "Failed to place order" });
//   }
// });


// // // Cancel Order
// // app.patch('/orders/:orderId/cancel', authenticateJWT, async (req, res) => {
// //   const { orderId } = req.params;
// //   const { reason } = req.body;
// //   const userId = req.user.userId;

// //   try {
// //     const [result] = await db.query(
// //       `UPDATE orders SET status = 'Cancelled', cancel_reason = ?, cancelled_at = NOW() WHERE order_id = ? AND user_id = ?`,
// //       [reason, orderId, userId]
// //     );

// //     if (result.affectedRows === 0) {
// //       return res.status(404).json({ success: false, message: "Order not found" });
// //     }

// //     // if vendor_id exists, update vendor stats
// //     const [order] = await db.query('SELECT vendor_id FROM orders WHERE order_id = ?', [orderId]);
// //     if (order[0] && order[0].vendor_id) {
// //       await db.query(
// //         'UPDATE vendors SET canceled_orders = canceled_orders + 1, pending_orders = pending_orders - 1 WHERE id = ?',
// //         [order[0].vendor_id]
// //       );
// //     }

// //     res.status(200).json({ success: true, message: "Order cancelled successfully" });
// //   } catch (err) {
// //     console.error("Order cancellation error:", err);
// //     res.status(500).json({ success: false, message: "Failed to cancel order" });
// //   }
// // });

// // Get All Orders of the Logged-in User
// app.get("/orders", authenticateJWT, async (req, res) => {
//   const userId = req.user.userId;

//   try {
//     const [orders] = await db.query(
//       "SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC",
//       [userId]
//     );

//     // Parse JSON fields for response
//     const parsedOrders = orders.map(order => {
//       // Parse cart items
//       let parsedCart = [];
//       try {
//         parsedCart = typeof order.cart_items === 'string'
//           ? JSON.parse(order.cart_items)
//           : order.cart_items;
//       } catch (e) {
//         console.error("Cart parse error:", e);
//       }

//       // Parse service expert
//       let parsedServiceExpert = null;
//       try {
//         if (order.service_expert) {
//           parsedServiceExpert = typeof order.service_expert === 'string'
//             ? JSON.parse(order.service_expert)
//             : order.service_expert;
//         }
//       } catch (e) {
//         console.error("Service expert parse error:", e);
//       }

//       // Parse reviews
//       let parsedReviews = null;
//       try {
//         if (order.reviews) {
//           parsedReviews = typeof order.reviews === 'string'
//             ? JSON.parse(order.reviews)
//             : order.reviews;
//         }
//       } catch (e) {
//         console.error("Reviews parse error:", e);
//       }

//       // Parse addresses and construct full address
//       let homeAddress = null;
//       let officeAddress = null;
//       let tempAddress = null;

//       try {
//         if (order.home_address && order.home_address !== "null") {
//           homeAddress = typeof order.home_address === 'string'
//             ? JSON.parse(order.home_address)
//             : order.home_address;
//         }
//         if (order.office_address && order.office_address !== "null") {
//           officeAddress = typeof order.office_address === 'string'
//             ? JSON.parse(order.office_address)
//             : order.office_address;
//         }
//         if (order.temp_address && order.temp_address !== "null") {
//           tempAddress = typeof order.temp_address === 'string'
//             ? JSON.parse(order.temp_address)
//             : order.temp_address;
//         }
//       } catch (e) {
//         console.error("Address parse error:", e);
//       }

//       // Determine primary address based on address_type
//       let primaryAddress = null;
//       let addressType = order.address_type || 'home';

//       if (addressType === 'home' && homeAddress) primaryAddress = homeAddress;
//       else if (addressType === 'office' && officeAddress) primaryAddress = officeAddress;
//       else if (addressType === 'another' && tempAddress) primaryAddress = tempAddress;

//       // Construct full address string
//       let fullAddress = "";
//       if (primaryAddress) {
//         const parts = [];
//         if (primaryAddress.addressLine1) parts.push(primaryAddress.addressLine1);
//         if (primaryAddress.addressLine2) parts.push(primaryAddress.addressLine2);
//         if (primaryAddress.areaName) parts.push(primaryAddress.areaName);
//         if (primaryAddress.city) parts.push(primaryAddress.city);
//         if (primaryAddress.landmark) parts.push(`Near ${primaryAddress.landmark}`);
//         fullAddress = parts.join(", ");
//       }

//       return {
//         ...order,
//         cart_items: parsedCart,
//         service_expert: parsedServiceExpert,
//         reviews: parsedReviews,
//         home_address: homeAddress,
//         office_address: officeAddress,
//         temp_address: tempAddress,
//         address: primaryAddress,
//         full_address: fullAddress
//       };
//     });

//     res.status(200).json({ success: true, orders: parsedOrders });
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     res.status(500).json({ success: false, message: "Failed to fetch orders" });
//   }
// });

// // verify role endpoint for multi-role support
// app.get('/api/auth/verify-role', verifyToken(), (req, res) => {
//   const requiredRoles = req.query.requiredRole?.split(",") || [];
//   const userRole = req.user.role;

//   if (userRole === 'superadmin') {
//     return res.json({
//       success: true,
//       isValid: true,
//       user: req.user
//     });
//   }

//   // Normal role check for multi-role support
//   if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
//     return res.status(403).json({
//       success: false,
//       isValid: false,
//       message: `Requires one of these roles: ${requiredRoles.join(', ')}`
//     });
//   }

//   res.json({
//     success: true,
//     isValid: true,
//     user: req.user
//   });

// });

// //  Super Admin Registration with security checks
// app.post("/api/superadmin/register", async (req, res) => {
//   const { email, password } = req.body;

//   // Input validation
//   if (!email || !password) {
//     return res.status(400).json({
//       success: false,
//       message: "Email and password are required"
//     });
//   }

//   // Validate email format
//   if (!validator.isEmail(email)) {
//     return res.status(400).json({
//       success: false,
//       message: "Invalid email format"
//     });
//   }

//   // Password strength check
//   if (!validator.isStrongPassword(password)) {
//     return res.status(400).json({
//       success: false,
//       message: "Password must be at least 8 chars with uppercase, lowercase, number and symbol"
//     });
//   }

//   try {
//     const hashed = await bcrypt.hash(password, 12);
//     const [exists] = await db.query(
//       "SELECT id FROM superadmins LIMIT 1"
//     );

//     if (exists.length) {
//       return res.status(403).json({
//         success: false,
//         message: "Super Admin already exists"
//       });
//     }

//     await db.query(
//       "INSERT INTO superadmins (email, password) VALUES (?, ?)",
//       [email, hashed]
//     );

//     res.json({
//       success: true,
//       message: "Super Admin registered successfully",
//       // No sensitive data in response
//     });
//   } catch (error) {
//     console.error("Registration Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Registration failed",
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// //  Super Admin Login with rate limiting
// const loginLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 5, // limit each IP to 5 login attempts
//   message: "Too many login attempts, please try again later"
// });

// app.post("/api/superadmin/login", loginLimiter, async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const [rows] = await db.query(
//       "SELECT * FROM superadmins WHERE email = ?",
//       [email]
//     );
//     const user = rows[0];

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid credentials"
//       });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid credentials"
//       });
//     }

//     const token = jwt.sign(
//       {
//         id: user.id,
//         role: "superadmin",
//         email: user.email
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "8h" } // Longer expiration for superadmin
//     );

//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'strict',
//       maxAge: 8 * 60 * 60 * 1000 // 8 hours
//     }).json({
//       success: true,
//       user: {
//         id: user.id,
//         email: user.email,
//         role: "superadmin"
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Login failed"
//     });
//   }
// });

// // Enhanced Admin Creation with validation
// app.post("/api/admin/create",
//   verifyToken(["superadmin"]),
//   async (req, res) => {
//     const { email, password } = req.body;

//     try {
//       // Check for existing admin
//       const [exists] = await db.query(
//         "SELECT id FROM admins WHERE email = ?",
//         [email]
//       );

//       if (exists.length) {
//         return res.status(409).json({
//           success: false,
//           message: "Admin already exists"
//         });
//       }

//       const hashed = await bcrypt.hash(password, 12);
//       await db.query(
//         "INSERT INTO admins (email, password, created_by) VALUES (?, ?, ?)",
//         [email, hashed, req.user.id]
//       );

//       res.json({
//         success: true,
//         message: "Admin created successfully",
//         admin: { email } // Don't return sensitive data
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: "Admin creation failed"
//       });
//     }
//   }
// );

// app.get("/api/admin/all-orders", verifyToken(["admin", "superadmin"]), async (req, res) => {
//   try {
//     const [orders] = await db.query(`
//       SELECT 
//   o.order_id,
//   o.user_id,
//   o.order_date,
//   o.time_slot,
//   o.notes,
//   o.address_type,
//   o.home_address,
//   o.office_address,
//   o.temp_address,
//   o.recipient_name,
//   o.recipient_phone,
//   o.cart_items,
//   o.status,
//   o.cancel_reason,
//   o.cancelled_at,
//   o.vendor_id,
//   o.service_expert,
//   o.reviews,
//   o.assigned_date,
//   o.completed_date,
//   o.confirmed_date,
//   u.name AS customer_name,
//   u.email AS customer_email,
//   u.phone_number AS customer_phone,
//   v.name AS vendor_name,
//   v.email AS vendor_email
// FROM orders o
// LEFT JOIN users u ON o.user_id = u.custom_id
// LEFT JOIN vendors v ON o.vendor_id = v.id
// ORDER BY o.order_date DESC

//     `);

//     // Parse cart_items, address, and calculate total price
//     const ordersWithDetails = orders.map(order => {
//       let total = 0;
//       let parsedCart = [];
//       let parsedAddress = {};
//       let parsedServiceExpert = null;
//       let parsedReviews = null;

//       try {
//         parsedCart = typeof order.cart_items === 'string'
//           ? JSON.parse(order.cart_items)
//           : order.cart_items;

//         total = parsedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//       } catch (e) {
//         console.error("Cart parse error:", order.cart_items);
//       }

//       try {
//         parsedAddress = typeof order.address === 'string'
//           ? JSON.parse(order.address)
//           : order.address;
//       } catch (e) {
//         console.error("Address parse error:", order.address);
//       }

//       try {
//         if (order.service_expert) {
//           parsedServiceExpert = typeof order.service_expert === 'string'
//             ? JSON.parse(order.service_expert)
//             : order.service_expert;
//         }
//       } catch (e) {
//         console.error("Service expert parse error:", e);
//       }

//       try {
//         if (order.reviews) {
//           parsedReviews = typeof order.reviews === 'string'
//             ? JSON.parse(order.reviews)
//             : order.reviews;
//         }
//       } catch (e) {
//         console.error("Reviews parse error:", e);
//       }


//       return {
//         ...order,
//         cart_items: parsedCart,
//         address: parsedAddress,
//         service_expert: parsedServiceExpert,
//         reviews: parsedReviews,
//         total: total.toFixed(2)
//       };
//     });

//     res.json({ success: true, orders: ordersWithDetails });
//   } catch (error) {
//     console.error("Error fetching all orders:", error);
//     res.status(500).json({ success: false, message: "Failed to fetch all order details" });
//   }
// });


// // DASHBOARD API for Admins
// // This endpoint provides basic stats and recent activity for the admin dashboard

// app.get('/api/admin/dashboard', verifyToken(['admin', 'superadmin']), async (req, res) => {
//   try {
//     // Basic stats
//     const [users] = await db.query("SELECT COUNT(*) as count FROM users");
//     const [orders] = await db.query("SELECT COUNT(*) as count FROM orders");
//     const [pending] = await db.query("SELECT COUNT(*) as count FROM orders WHERE status = 'Pending'");
//     const [active] = await db.query("SELECT COUNT(*) as count FROM orders WHERE status = 'Active'");
//     const [completed] = await db.query("SELECT COUNT(*) as count FROM orders WHERE status = 'Completed'");
//     const [cancelled] = await db.query("SELECT COUNT(*) as count FROM orders WHERE status = 'Cancelled'");
//     const [vendors] = await db.query("SELECT COUNT(*) as count FROM vendors WHERE status = 'active'");

//     const totalOrders = orders[0].count;
//     const completionRate = totalOrders > 0
//       ? ((completed[0].count / totalOrders) * 100).toFixed(2)
//       : "0.00";

//     // Stats object
//     const stats = {
//       totalOrders,
//       pendingOrders: pending[0].count,
//       activeOrders: active[0].count,
//       completedOrders: completed[0].count,
//       canceledOrders: cancelled[0].count,
//       activeVendors: vendors[0].count,
//       totalUsers: users[0].count,
//       completionRate
//     };

//     // Recent activity
//     const [activity] = await db.query(`
//       SELECT order_id, status, updated_at, order_date
//       FROM orders
//       ORDER BY updated_at DESC
//       LIMIT 10
//     `);

//     const formattedRecentActivities = activity.map(act => ({
//       orderId: act.order_id,
//       status: act.status,
//       time: act.updated_at,
//       orderDate: act.order_date
//     }));

//     // Single valid response
//     res.json({
//       success: true,
//       stats,
//       recentActivity: formattedRecentActivities
//     });

//   } catch (error) {
//     console.error('Dashboard Error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to load dashboard data',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// // USER MANAGEMENT API for Admins

// // Get all users


// app.get("/api/admin/all-users", verifyToken(["admin", "superadmin"]), async (req, res) => {
//   try {
//     const [users] = await db.query(`
//       SELECT 
//         u.custom_id as id,
//         u.custom_id,
//         u.name,
//         u.email,
//         u.phone_number as phone,
//         u.photo as profileImage,
//         u.home_address,
//         u.office_address,
//         u.is_active as isActive,
//         u.created_at as createdAt
//       FROM users u
//       ORDER BY u.created_at DESC
//     `);

//     // json parse
//     const parsedUsers = users.map(user => ({
//       ...user,
//       home_address: user.home_address ? JSON.parse(user.home_address) : {},
//       office_address: user.office_address ? JSON.parse(user.office_address) : {}
//     }));

//     res.json({ success: true, users: parsedUsers });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// // Helper function to safely parse JSON
// function safeParseJSON(jsonString) {
//   try {
//     return jsonString ? JSON.parse(jsonString) : null;
//   } catch (e) {
//     console.error("JSON parse error:", jsonString);
//     return null;
//   }
// }
// app.get("/api/admin/user-orders/:userId", verifyToken(["admin", "superadmin"]), async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const [orders] = await db.query(`
//       SELECT 
//         order_id,
//         order_date,
//         time_slot,
//         status,
//         cart_items,
//         cancel_reason,
//         cancelled_at
//       FROM orders
//       WHERE user_id = ?
//       ORDER BY order_date DESC
//       LIMIT 10
//     `, [userId]);

//     const parsedOrders = orders.map(order => {
//       let parsedCart = [];
//       let total = 0;

//       try {
//         parsedCart = typeof order.cart_items === "string"
//           ? JSON.parse(order.cart_items)
//           : order.cart_items;

//         total = parsedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//       } catch (err) {
//         console.error("Cart parse error:", order.cart_items);
//       }

//       return {
//         ...order,
//         cart_items: parsedCart,
//         total: total.toFixed(2)
//       };
//     });

//     res.json({ success: true, orders: parsedOrders });
//   } catch (error) {
//     console.error("Error fetching user orders:", error);
//     res.status(500).json({ success: false, message: "Failed to fetch orders" });
//   }
// });

// app.get("/api/admin/user-stats", verifyToken(["admin", "superadmin"]), async (req, res) => {
//   try {
//     const [total] = await db.query("SELECT COUNT(*) as count FROM users");
//     const [newUsers] = await db.query(`
//       SELECT COUNT(*) as count FROM users 
//       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
//     `);
//     const [active] = await db.query("SELECT COUNT(*) as count FROM users WHERE is_active = 1");
//     const [last30] = await db.query(`
//       SELECT COUNT(*) as count FROM users 
//       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
//     `);

//     res.json({
//       totalUsers: total[0].count,
//       newUsers: newUsers[0].count,
//       activeUsers: active[0].count,
//       last30Days: last30[0].count
//     });
//   } catch (error) {
//     console.error("Error fetching stats:", error);
//     res.status(500).json({ success: false, message: "Error fetching stats" });
//   }
// });
// // API endpoint to update user with address handling
// app.put("/api/admin/user/:id", verifyToken(["admin", "superadmin"]), async (req, res) => {
//   const { id } = req.params;
//   const { name, email, phone, isActive, homeAddress, officeAddress } = req.body;

//   try {
//     await db.query(`
//       UPDATE users 
//       SET name = ?, 
//           email = ?, 
//           phone_number = ?, 
//           is_active = ?,
//           home_address = ?,
//           office_address = ?
//       WHERE custom_id = ?
//     `, [
//       name,
//       email,
//       phone,
//       isActive,
//       homeAddress ? JSON.stringify(homeAddress) : null,
//       officeAddress ? JSON.stringify(officeAddress) : null,
//       id
//     ]);

//     res.json({ success: true, message: "User updated successfully" });
//   } catch (error) {
//     console.error("Error updating user:", error);
//     res.status(500).json({ success: false, message: "Failed to update user" });
//   }
// });

// // Delete user
// app.delete("/api/admin/user/:id", verifyToken(["admin", "superadmin"]), async (req, res) => {
//   const { id } = req.params;

//   try {
//     await db.query("DELETE FROM users WHERE custom_id = ?", [id]);
//     res.json({ success: true, message: "User deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting user:", error);
//     res.status(500).json({ success: false, message: "Failed to delete user" });
//   }
// });
// // =============================Service Setup============================= //
// // All services
// app.get('/api/services', async (req, res) => {
//   try {
//     const [results] = await db.query('SELECT * FROM services');

//     const services = results.map(service => {
//       let imagePath = service.image;

//       if (imagePath.startsWith('/images/')) {
//         return {
//           ...service,
//           image: `http://localhost:5001${imagePath}`
//         };
//       }

//       imagePath = imagePath.replace(/^\/?uploads\//, '');
//       return {
//         ...service,
//         image: `http://localhost:5001/uploads/${imagePath}`
//       };
//     });

//     res.json(services);
//   } catch (error) {
//     console.error('Database error:', error);
//     res.status(500).json({ error: 'Database error' });
//   }
// });

// // Category-wise services
// app.get('/api/services/:category', async (req, res) => {
//   const category = req.params.category.trim();

//   try {
//     const [rows] = await db.query('SELECT * FROM services WHERE category = ?', [category]);

//     const services = rows.map(service => {
//       let imagePath = service.image;

//       if (imagePath.startsWith('/images/')) {
//         return {
//           ...service,
//           image: `http://localhost:5001${imagePath}`
//         };
//       }

//       imagePath = imagePath.replace(/^\/?uploads\//, '');
//       return {
//         ...service,
//         image: `http://localhost:5001/uploads/${imagePath}`
//       };
//     });

//     res.status(200).json(services);
//   } catch (err) {
//     console.error("DB Error:", err.message);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// // Add new service
// app.post('/api/services', uploadService.single('image'), async (req, res) => {
//   const { _id, name, price, category } = req.body;
//   const image = req.file ? `/uploads/services/${req.file.filename}` : null;

//   if (!_id || !name || !price || !category || !image) {
//     return res.status(400).json({ success: false, message: 'Missing fields' });
//   }

//   const sql = `INSERT INTO services (_id, name, price, category, image) VALUES (?, ?, ?, ?, ?)`;

//   try {
//     await db.query(sql, [_id, name, price, category, image]);
//     res.json({ success: true, message: 'Service added successfully!' });
//   } catch (err) {
//     console.error('DB error:', err);
//     res.status(500).json({ success: false, message: 'Database error' });
//   }
// });

// // update an existing service
// app.put('/api/services/:_id', uploadService.single('image'), async (req, res) => {
//   const { _id } = req.params;
//   const { name, price, category } = req.body;
//   let image = req.file ? `/uploads/services/${req.file.filename}` : null;

//   try {
//     const updates = [];
//     const values = [];

//     if (name) {
//       updates.push('name=?');
//       values.push(name);
//     }
//     if (price) {
//       updates.push('price=?');
//       values.push(price);
//     }
//     if (category) {
//       updates.push('category=?');
//       values.push(category);
//     }
//     if (image) {
//       updates.push('image=?');
//       values.push(image);
//     }

//     if (updates.length === 0) {
//       return res.status(400).json({ success: false, message: 'No fields to update' });
//     }

//     const sql = `UPDATE services SET ${updates.join(', ')} WHERE _id=?`;
//     values.push(_id);

//     const [result] = await db.query(sql, values);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ success: false, message: 'Service not found' });
//     }

//     res.json({ success: true, message: 'Service updated successfully' });
//   } catch (err) {
//     console.error('Update error:', err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });


// // Fix: Use _id instead of id
// app.delete("/api/services/:_id", (req, res) => {
//   const { _id } = req.params;
//   db.query("DELETE FROM services WHERE _id = ?", [_id], (err) => {
//     if (err) {
//       console.error("Delete error:", err);
//       return res.status(500).json({ success: false, error: err.message });
//     }
//     res.json({ success: true, message: "Service deleted successfully" });
//   });
// });

// // ================================Vendor =================================================
// // Update the vendor registration endpoint to handle all fields
// app.post("/api/vendor/register", uploadVendorDocs.fields([
//   { name: 'profile_image', maxCount: 1 },
//   { name: 'nid_front', maxCount: 1 },
//   { name: 'nid_back', maxCount: 1 },
//   { name: 'cv', maxCount: 1 },
//   { name: 'trade_license', maxCount: 1 }
// ]), async (req, res) => {
//   const {
//     name,
//     email,
//     phone,
//     dob,
//     password,
//     confirmPassword,
//     nid_number,
//     company_name,        // New field
//     permanent_address,
//     present_address,
//     business_address,    // New field
//     service_areas,
//     services,
//     technician_quantity,
//     registration_timestamp, // New field
//     app_version,         // New field
//     device_type         // New field
//   } = req.body;

//   // Input validation - update to include new fields
//   const requiredFields = ['name', 'email', 'phone', 'dob', 'password', 'nid_number'];
//   for (const field of requiredFields) {
//     if (!req.body[field]) {
//       return res.status(400).json({
//         success: false,
//         message: `${field.replace('_', ' ')} is required`
//       });
//     }
//   }

//   // Log all received data for debugging
//   console.log('📋 Received vendor registration data:');
//   console.log('- Name:', name);
//   console.log('- Email:', email);
//   console.log('- Phone:', phone);
//   console.log('- Company:', company_name);
//   console.log('- NID:', nid_number);
//   console.log('- Service Areas:', service_areas);
//   console.log('- Services:', services);
//   console.log('- Files:', req.files ? Object.keys(req.files) : 'No files');

//   try {
//     // Check for duplicate email or phone
//     const [duplicateCheck] = await db.query(
//       "SELECT * FROM vendors WHERE email = ? OR phone_number = ?",
//       [email, phone]
//     );

//     if (duplicateCheck.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Email or phone number already registered"
//       });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Handle file uploads with null checks
//     const getFileUrl = (fieldName, subfolder) => {
//       return req.files[fieldName] && req.files[fieldName][0]
//         ? `/uploads/${subfolder}/${req.files[fieldName][0].filename}`
//         : null;
//     };

//     const nidFront = getFileUrl('nid_front', 'nids');
//     const nidBack = getFileUrl('nid_back', 'nids');
//     const profileImage = getFileUrl('profile_image', 'profiles');
//     const cv = getFileUrl('cv', 'cvs');
//     const tradeLicense = getFileUrl('trade_license', 'licenses');

//     // Parse service areas and services
//     let serviceAreasArray = [];
//     let servicesArray = [];

//     try {
//       if (service_areas) {
//         serviceAreasArray = JSON.parse(service_areas);
//       }
//     } catch (e) {
//       console.error('Service areas parse error:', e);
//       serviceAreasArray = [];
//     }

//     try {
//       if (services) {
//         servicesArray = JSON.parse(services);
//       }
//     } catch (e) {
//       console.error('Services parse error:', e);
//       servicesArray = [];
//     }

//     // Create new vendor with updated fields
//     const [result] = await db.query(
//       `INSERT INTO vendors 
//         (name, email, phone_number, password, dob, nid_number, 
//          company_name, permanent_address, present_address, business_address,
//          technician_quantity, vendor_photo, nid_front, nid_back, cv, trade_license,
//          service_areas, services, status, created_at, updated_at) 
//        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW(), NOW())`,
//       [
//         name,
//         email,
//         phone,
//         hashedPassword,
//         dob,
//         nid_number,
//         company_name || null,
//         permanent_address || '',
//         present_address || '',
//         business_address || null,
//         technician_quantity || 0,
//         profileImage,
//         nidFront,
//         nidBack,
//         cv,
//         tradeLicense,
//         JSON.stringify(serviceAreasArray),
//         JSON.stringify(servicesArray)
//       ]
//     );

//     console.log(`✅ Vendor registered successfully: ${name} (ID: ${result.insertId})`);

//     res.status(200).json({
//       success: true,
//       message: "Registration successful! Your account is pending approval.",
//       vendorId: result.insertId
//     });

//   } catch (error) {
//     console.error("❌ Registration error:", error);

//     // Clean up uploaded files if registration fails
//     try {
//       if (req.files) {
//         Object.values(req.files).forEach(fileArray => {
//           if (fileArray && fileArray[0] && fs.existsSync(fileArray[0].path)) {
//             fs.unlinkSync(fileArray[0].path);
//           }
//         });
//       }
//     } catch (cleanupError) {
//       console.error("Error cleaning up files:", cleanupError);
//     }

//     res.status(500).json({
//       success: false,
//       message: "Registration failed. Please try again.",
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });


// // register technician

// app.post("/api/technician/register", uploadVendorDocs.fields([
//   { name: 'profile_image', maxCount: 1 },
//   { name: 'nid_front', maxCount: 1 },
//   { name: 'nid_back', maxCount: 1 },
//   { name: 'cv', maxCount: 1 }
// ]), async (req, res) => {
//   const {
//     name,
//     email,
//     phone,
//     dob,
//     password,
//     confirmPassword,
//     nid_number,
//     permanent_address,
//     present_address,
//     skills,
//     experience,
//     vendor_id, // Which vendor they're working for
//     service_areas,
//     hourly_rate
//   } = req.body;

//   // Similar registration logic for technicians
// });

// // // ✅ Universal Login for both Vendor and Technician
// // app.post("/api/login", async (req, res) => {
// //   const { email, password } = req.body;

// //   try {
// //     // 1. Check Vendor
// //     const [vendorRows] = await db.query(
// //       "SELECT * FROM vendors WHERE email = ?",
// //       [email]
// //     );

// //     if (vendorRows.length > 0) {
// //       const vendor = vendorRows[0];
// //       if (await bcrypt.compare(password, vendor.password)) {
// //         if (vendor.status !== 'active') {
// //           return res.status(403).json({
// //             success: false,
// //             message: "Your account is pending approval"
// //           });
// //         }

// //         const token = jwt.sign(
// //           {
// //             id: vendor.id,
// //             role: "vendor",
// //             email: vendor.email
// //           },
// //           process.env.JWT_SECRET,
// //           { expiresIn: "8h" }
// //         );

// //         return res.json({
// //           success: true,
// //           token,
// //           role: "vendor",
// //           user: {
// //             id: vendor.id,
// //             name: vendor.name,
// //             email: vendor.email,
// //             phone: vendor.phone_number,
// //             profileImage: vendor.vendor_photo,
// //             status: vendor.status
// //           }
// //         });
// //       }
// //     }

// //     // 2. Check Technician
// //     const [technicianRows] = await db.query(
// //       "SELECT * FROM technicians WHERE email = ?",
// //       [email]
// //     );

// //     if (technicianRows.length > 0) {
// //       const technician = technicianRows[0];
// //       if (await bcrypt.compare(password, technician.password)) {
// //         if (technician.status !== 'active') {
// //           return res.status(403).json({
// //             success: false,
// //             message: "Your account is pending approval"
// //           });
// //         }

// //         const token = jwt.sign(
// //           {
// //             id: technician.id,
// //             role: "technician",
// //             email: technician.email
// //           },
// //           process.env.JWT_SECRET,
// //           { expiresIn: "8h" }
// //         );

// //         return res.json({
// //           success: true,
// //           token,
// //           role: "technician",
// //           user: {
// //             id: technician.id,
// //             name: technician.name,
// //             email: technician.email,
// //             phone: technician.phone_number,
// //             profileImage: technician.photo,
// //             status: technician.status,
// //             vendor_id: technician.vendor_id
// //           }
// //         });
// //       }
// //     }

// //     return res.status(401).json({
// //       success: false,
// //       message: "Invalid credentials"
// //     });

// //   } catch (error) {
// //     console.error("Login error:", error);
// //     res.status(500).json({
// //       success: false,
// //       message: "Login failed"
// //     });
// //   }
// // });

// app.get("/api/vendor/profile", authenticateVendor, async (req, res) => {
//   try {
//     console.log('📱 Vendor Profile Request - Vendor ID:', req.vendor?.vendorId);
//     console.log('📱 Vendor Email:', req.vendor?.email);

//     if (!req.vendor || !req.vendor.vendorId) {
//       return res.status(401).json({
//         success: false,
//         message: "Vendor ID not found in token"
//       });
//     }

//     // Query vendor data
//     const [rows] = await db.query(
//       `SELECT 
//         id, name, email, phone_number, 
//         dob, nid_number, company_name, 
//         permanent_address, present_address, business_address,
//         technician_quantity, vendor_photo, nid_front, nid_back, 
//         cv, trade_license, service_areas, services, status, 
//         created_at, updated_at
//        FROM vendors WHERE id = ?`,
//       [req.vendor.vendorId]
//     );

//     console.log('📊 Database query result - Row count:', rows.length);

//     if (rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Vendor not found in database",
//         vendorId: req.vendor.vendorId
//       });
//     }

//     const vendor = rows[0];
//     console.log('✅ Vendor found - Name:', vendor.name);
//     console.log('🔍 Raw service_areas:', vendor.service_areas);
//     console.log('🔍 Raw services:', vendor.services);

//     // Parse JSON fields with better error handling
//     let serviceAreas = [];
//     let services = [];

//     try {
//       if (vendor.service_areas) {
//         const areasStr = vendor.service_areas.toString().trim();

//         // Check if it's already a JSON array
//         if (areasStr.startsWith('[') && areasStr.endsWith(']')) {
//           serviceAreas = JSON.parse(areasStr);
//         } else {
//           // If it's comma-separated string, convert to array
//           if (areasStr.includes(',')) {
//             serviceAreas = areasStr.split(',').map(item => item.trim()).filter(item => item);
//           } else if (areasStr.length > 0) {
//             serviceAreas = [areasStr];
//           }
//         }
//         console.log('✅ Parsed serviceAreas:', serviceAreas);
//       }
//     } catch (e) {
//       console.error('❌ Error parsing service areas:', e.message);
//       console.error('❌ Raw value:', vendor.service_areas);
//       // Return empty array on error
//       serviceAreas = [];
//     }

//     try {
//       if (vendor.services) {
//         const servicesStr = vendor.services.toString().trim();

//         // Check if it's already a JSON array
//         if (servicesStr.startsWith('[') && servicesStr.endsWith(']')) {
//           services = JSON.parse(servicesStr);
//         } else {
//           // If it's comma-separated string, convert to array
//           if (servicesStr.includes(',')) {
//             services = servicesStr.split(',').map(item => item.trim()).filter(item => item);
//           } else if (servicesStr.length > 0) {
//             services = [servicesStr];
//           }
//         }
//         console.log('✅ Parsed services:', services);
//       }
//     } catch (e) {
//       console.error('❌ Error parsing services:', e.message);
//       console.error('❌ Raw value:', vendor.services);
//       // Return empty array on error
//       services = [];
//     }

//     console.log('✅ Vendor profile retrieved successfully');

//     // Format response
//     const responseData = {
//       success: true,
//       vendor: {
//         id: vendor.id,
//         name: vendor.name,
//         email: vendor.email,
//         phone: vendor.phone_number,
//         dob: vendor.dob,
//         nidNumber: vendor.nid_number,
//         companyName: vendor.company_name,
//         permanentAddress: vendor.permanent_address,
//         presentAddress: vendor.present_address,
//         businessAddress: vendor.business_address,
//         technicianQuantity: vendor.technician_quantity,
//         profileImage: vendor.vendor_photo,
//         nidFront: vendor.nid_front,
//         nidBack: vendor.nid_back,
//         cv: vendor.cv,
//         tradeLicense: vendor.trade_license,
//         serviceAreas: serviceAreas,
//         services: services,
//         status: vendor.status,
//         createdAt: vendor.created_at,
//         updatedAt: vendor.updated_at
//       }
//     };

//     console.log('📤 Sending response:', JSON.stringify(responseData, null, 2).substring(0, 500) + '...');

//     res.json(responseData);

//   } catch (error) {
//     console.error("❌ Profile error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch profile",
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });
// // Add update profile endpoint
// app.put("/api/vendor/profile", authenticateVendor, uploadVendorDocs.fields([
//   { name: 'profile_image', maxCount: 1 },
//   { name: 'nid_front', maxCount: 1 },
//   { name: 'nid_back', maxCount: 1 },
//   { name: 'cv', maxCount: 1 },
//   { name: 'trade_license', maxCount: 1 }
// ]), async (req, res) => {
//   try {
//     const {
//       name,
//       phone,
//       dob,
//       company_name,
//       permanent_address,
//       present_address,
//       business_address,
//       service_areas,
//       services,
//       technician_quantity,
//       profile_image_base64,
//       profile_image_name
//     } = req.body;

//     const vendorId = req.vendor.vendorId;

//     // Build update query dynamically
//     let updateFields = [];
//     let updateValues = [];

//     if (name) {
//       updateFields.push("name = ?");
//       updateValues.push(name);
//     }

//     if (phone) {
//       updateFields.push("phone_number = ?");
//       updateValues.push(phone);
//     }

//     if (dob) {
//       updateFields.push("dob = ?");
//       updateValues.push(dob);
//     }

//     if (company_name !== undefined) {
//       updateFields.push("company_name = ?");
//       updateValues.push(company_name);
//     }

//     if (permanent_address !== undefined) {
//       updateFields.push("permanent_address = ?");
//       updateValues.push(permanent_address);
//     }

//     if (present_address !== undefined) {
//       updateFields.push("present_address = ?");
//       updateValues.push(present_address);
//     }

//     if (business_address !== undefined) {
//       updateFields.push("business_address = ?");
//       updateValues.push(business_address);
//     }

//     if (service_areas) {
//       updateFields.push("service_areas = ?");
//       updateValues.push(service_areas);
//     }

//     if (services) {
//       updateFields.push("services = ?");
//       updateValues.push(services);
//     }

//     if (technician_quantity !== undefined) {
//       updateFields.push("technician_quantity = ?");
//       updateValues.push(technician_quantity);
//     }

//     // Handle file uploads (for mobile/desktop)
//     const getFileUrl = (fieldName, subfolder) => {
//       return req.files[fieldName] && req.files[fieldName][0]
//         ? `/uploads/${subfolder}/${req.files[fieldName][0].filename}`
//         : null;
//     };

//     if (req.files['profile_image']) {
//       updateFields.push("vendor_photo = ?");
//       updateValues.push(getFileUrl('profile_image', 'profiles'));
//     }

//     // Handle base64 image (for web)
//     else if (profile_image_base64 && profile_image_name) {
//       try {
//         const uploadsDir = path.join(__dirname, '../uploads/profiles');
//         if (!fs.existsSync(uploadsDir)) {
//           fs.mkdirSync(uploadsDir, { recursive: true });
//         }

//         const fileName = `${vendorId}_${Date.now()}_${profile_image_name}`;
//         const filePath = path.join(uploadsDir, fileName);

//         // Remove data URL prefix if present
//         let base64Data = profile_image_base64;
//         if (profile_image_base64.includes(',')) {
//           base64Data = profile_image_base64.split(',')[1];
//         }

//         const buffer = Buffer.from(base64Data, 'base64');
//         fs.writeFileSync(filePath, buffer);

//         updateFields.push("vendor_photo = ?");
//         updateValues.push(`/uploads/profiles/${fileName}`);

//         console.log('✅ Base64 image saved:', fileName);
//       } catch (fileError) {
//         console.error('❌ Error saving base64 image:', fileError);
//       }
//     }

//     if (req.files['nid_front']) {
//       updateFields.push("nid_front = ?");
//       updateValues.push(getFileUrl('nid_front', 'nids'));
//     }

//     if (req.files['nid_back']) {
//       updateFields.push("nid_back = ?");
//       updateValues.push(getFileUrl('nid_back', 'nids'));
//     }

//     if (req.files['cv']) {
//       updateFields.push("cv = ?");
//       updateValues.push(getFileUrl('cv', 'cvs'));
//     }

//     if (req.files['trade_license']) {
//       updateFields.push("trade_license = ?");
//       updateValues.push(getFileUrl('trade_license', 'licenses'));
//     }

//     if (updateFields.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "No fields to update"
//       });
//     }

//     updateFields.push("updated_at = NOW()");
//     updateValues.push(vendorId);

//     const [result] = await db.query(
//       `UPDATE vendors SET ${updateFields.join(", ")} WHERE id = ?`,
//       updateValues
//     );

//     if (result.affectedRows === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Vendor not found"
//       });
//     }

//     res.json({
//       success: true,
//       message: "Profile updated successfully"
//     });

//   } catch (error) {
//     console.error("Update profile error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to update profile"
//     });
//   }
// });
// // Forgot Password Routes 
// app.post("/api/forgot-password", async (req, res) => {
//   console.log("Forgot password request received:", req.body);

//   const { email } = req.body;

//   if (!email) {
//     return res.status(400).json({
//       success: false,
//       message: "Email is required"
//     });
//   }

//   try {
//     // Check if user exists in users table
//     const [users] = await db.query(
//       "SELECT custom_id, name, email FROM users WHERE email = ?",
//       [email]
//     );

//     // Check if vendor exists
//     const [vendors] = await db.query(
//       "SELECT id, name, email FROM vendors WHERE email = ?",
//       [email]
//     );

//     const user = users[0] || vendors[0];

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "No account found with this email address"
//       });
//     }

//     // Generate reset token
//     const resetToken = crypto.randomBytes(32).toString('hex');
//     const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

//     console.log("Generated token for:", email);

//     // Store token in database based on user type
//     if (users[0]) {
//       await db.query(
//         "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
//         [resetToken, resetTokenExpiry, email]
//       );
//     } else {
//       await db.query(
//         "UPDATE vendors SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
//         [resetToken, resetTokenExpiry, email]
//       );
//     }

//     // Create reset link
//     const resetLink = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

//     console.log("Reset link generated:", resetLink);

//     // all time try to send email
//     try {
//       await sendResetEmail(email, resetLink, user.name);
//       console.log("✅ Reset email sent successfully to:", email);

//       res.json({
//         success: true,
//         message: "Password reset link has been sent to your email"
//       });

//     } catch (emailError) {
//       console.error("❌ Email sending failed:", emailError);

//       // If email fails, respond like development mode
//       res.json({
//         success: true,
//         message: "Reset token generated but email failed. Use the link below.",
//         resetLink: resetLink,
//         debug: "Email error: " + emailError.message
//       });
//     }

//   } catch (error) {
//     console.error("Forgot password error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to process reset request"
//     });
//   }
// });

// //  Nodemailer Function 
// const sendResetEmail = async (email, resetLink, userName) => {
//   try {
//     console.log("🔄 Attempting to send email...");

//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_APP_PASSWORD,
//       },
//       // Additional settings to improve delivery
//       tls: {
//         rejectUnauthorized: false
//       },
//       logger: true,
//       debug: true
//     });

//     const mailOptions = {
//       from: {
//         name: 'Pacific Support', // ✅ Name clearly defined
//         address: process.env.EMAIL_USER
//       },
//       to: email,
//       subject: 'Password Reset Request - Pacific Support',
//       html: `
//     <!DOCTYPE html>
//     <html>
//     <head>
//         <meta charset="utf-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Password Reset - Pacific Support</title>
//         <style>
//             * {
//                 margin: 0;
//                 padding: 0;
//                 box-sizing: border-box;
//             }
//             body { 
//                 font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
//                 line-height: 1.6; 
//                 color: #333; 
//                 margin: 0; 
//                 padding: 0; 
//                 background: #f8fafc;
//             }
//             .container { 
//                 max-width: 600px; 
//                 margin: 0 auto; 
//                 background: #ffffff;
//                 border-radius: 12px;
//                 overflow: hidden;
//                 box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
//             }
//             .header { 
//                 background: linear-gradient(135deg, #3c8ce7 0%, #00c6ff 100%); 
//                 padding: 40px 30px; 
//                 text-align: center; 
//                 color: white; 
//             }
//             .header h1 {
//                 font-size: 28px;
//                 font-weight: 700;
//                 margin-bottom: 8px;
//             }
//             .header p {
//                 font-size: 16px;
//                 opacity: 0.9;
//                 font-weight: 400;
//             }
//             .content { 
//                 padding: 40px 30px; 
//                 background: #ffffff; 
//             }
//             .content h2 {
//                 color: #1e293b;
//                 font-size: 24px;
//                 font-weight: 600;
//                 margin-bottom: 16px;
//             }
//             .content p {
//                 color: #475569;
//                 font-size: 16px;
//                 margin-bottom: 20px;
//             }
//             .button { 
//                 background: #3c8ce7; 
//                 color: white; 
//                 padding: 16px 36px; 
//                 text-decoration: none; 
//                 border-radius: 8px; 
//                 display: inline-block; 
//                 font-size: 16px; 
//                 font-weight: 600;
//                 transition: all 0.3s ease;
//                 box-shadow: 0 4px 6px -1px rgba(60, 140, 231, 0.3);
//             }
//             .button:hover {
//                 background: #2b7cd9;
//                 transform: translateY(-2px);
//                 box-shadow: 0 6px 8px -1px rgba(60, 140, 231, 0.4);
//             }
//             .footer { 
//                 text-align: center; 
//                 padding: 30px; 
//                 color: #64748b; 
//                 font-size: 14px; 
//                 background: #f8fafc;
//                 border-top: 1px solid #e2e8f0;
//             }
//             .link-box { 
//                 background: #f1f5f9; 
//                 padding: 16px; 
//                 border-radius: 8px; 
//                 word-break: break-all; 
//                 font-size: 14px; 
//                 margin: 24px 0; 
//                 border: 1px solid #e2e8f0;
//                 color: #475569;
//             }
//             .warning {
//                 background: #fef2f2;
//                 border: 1px solid #fecaca;
//                 color: #dc2626;
//                 padding: 16px;
//                 border-radius: 8px;
//                 margin: 20px 0;
//                 font-weight: 600;
//             }
//             .logo {
//                 font-size: 24px;
//                 font-weight: 700;
//                 margin-bottom: 8px;
//             }
//             .support-text {
//                 background: #f0f9ff;
//                 border: 1px solid #bae6fd;
//                 padding: 16px;
//                 border-radius: 8px;
//                 margin: 20px 0;
//                 color: #0369a1;
//             }
//         </style>
//     </head>
//     <body>
//         <div class="container">
//             <div class="header">
//                 <div class="logo">🌊 Pacific Support</div>
//                 <p>Password Reset Request</p>
//             </div>
//             <div class="content">
//                 <h2>Hello ${userName},</h2>
//                 <p>We received a request to reset your password for your Pacific Support account. Click the button below to create a new secure password:</p>

//                 <div style="text-align: center; margin: 35px 0;">
//                     <a href="${resetLink}" class="button">Reset Your Password</a>
//                 </div>

//                 <p>If the button doesn't work, copy and paste the following link into your web browser:</p>
//                 <div class="link-box">${resetLink}</div>

//                 <div class="warning">
//                     ⚠️ This password reset link will expire in 1 hour for security reasons.
//                 </div>

//                 <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged and your account secure.</p>

//                 <div class="support-text">
//                     <strong>Need help?</strong> Our support team is here to assist you with any questions or concerns.
//                 </div>
//             </div>
//             <div class="footer">
//                 <p style="margin-bottom: 8px;">&copy; 2024 Pacific Support. All rights reserved.</p>
//                 <p style="font-size: 13px; opacity: 0.8;">This is an automated message, please do not reply to this email.</p>
//                 <p style="font-size: 12px; opacity: 0.6; margin-top: 12px;">Securely delivered by Pacific Support System</p>
//             </div>
//         </div>
//     </body>
//     </html>
//   `,
//       // Text version for email clients that don't support HTML
//       text: `
// Password Reset Request - Pacific Support

// Hello ${userName},

// We received a request to reset your password for your Pacific Support account.

// Reset your password here: ${resetLink}

// This password reset link will expire in 1 hour for security reasons.

// If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.

// Need help? Contact our support team.

// © 2024 Pacific Support. All rights reserved.

// This is an automated message, please do not reply to this email.
//   `
//     };

//     console.log("📤 Sending email...");
//     const info = await transporter.sendMail(mailOptions);
//     console.log("✅ Email sent successfully!");
//     console.log("📨 Message ID:", info.messageId);
//     console.log("👤 To:", email);

//     return info;

//   } catch (error) {
//     console.error("❌ Email sending failed:", error.message);
//     throw new Error(`Failed to send reset email: ${error.message}`);
//   }
// };

// // 11.vendors list for admin
// app.get('/api/admin/vendors', verifyToken(['admin', 'superadmin']), async (req, res) => {
//   try {
//     const [vendors] = await db.query(`
//       SELECT 
//         id,
//         name,
//         email,
//         phone_number as phone,
//         address,
//         vendor_photo as photo,
//         nid_number,
//         technician_quantity,
//         status,
//         total_orders,
//         completed_orders,
//         pending_orders,
//         canceled_orders,
//         average_rating,
//         join_date,
//         created_at
//       FROM vendors
//       ORDER BY created_at DESC
//     `);

//     res.json({
//       success: true,
//       vendors
//     });
//   } catch (error) {
//     console.error('Get vendors error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch vendors'
//     });
//   }
// });

// // 12. vendor status update (approve/reject)
// app.patch('/api/admin/vendors/:id/status', verifyToken(['admin', 'superadmin']), async (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;

//   if (!['active', 'pending', 'rejected', 'suspended'].includes(status)) {
//     return res.status(400).json({
//       success: false,
//       message: 'Invalid status'
//     });
//   }

//   try {
//     await db.query(
//       'UPDATE vendors SET status = ?, updated_at = NOW() WHERE id = ?',
//       [status, id]
//     );

//     res.json({
//       success: true,
//       message: `Vendor status updated to ${status}`
//     });
//   } catch (error) {
//     console.error('Update vendor status error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to update vendor status'
//     });
//   }
// });

// // 13. generic endpoint for updating order status
// // order stats update
// app.patch('/orders/:orderId/status', verifyToken(['admin', 'vendor', 'superadmin']), async (req, res) => {
//   // URL perameter 
//   const orderId = decodeURIComponent(req.params.orderId);
//   const { status, notes } = req.body;
//   const userRole = req.user.role;

//   try {
//     const [orderRows] = await db.query(
//       'SELECT * FROM orders WHERE order_id = ?',
//       [orderId]
//     );

//     if (orderRows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     const order = orderRows[0];

//     // vendor check
//     if (userRole === 'vendor' && order.vendor_id !== req.user.vendorId) {
//       return res.status(403).json({
//         success: false,
//         message: 'You can only update your assigned orders'
//       });
//     }

//     // sTats validation
//     const validStatuses = ['Pending', 'Active', 'Completed', 'Cancelled', 'Processing', 'Started'];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid status'
//       });
//     }

//     // update data object
//     const updateData = {
//       status: status
//     };

//     // taimline updates
//     if (status === 'Active' && order.status === 'Pending') {
//       updateData.confirmed_date = new Date();
//     }
//     if (status === 'Completed') {
//       updateData.completed_date = new Date();
//       // vendor statistics update
//       if (order.vendor_id) {
//         await db.query(
//           `UPDATE vendors 
//            SET completed_orders = completed_orders + 1,
//                pending_orders = pending_orders - 1,
//                updated_at = NOW()
//            WHERE id = ?`,
//           [order.vendor_id]
//         );
//       }
//     }
//     if (status === 'Cancelled') {
//       updateData.cancelled_at = new Date();
//       // vendor statistics update
//       if (order.vendor_id) {
//         await db.query(
//           `UPDATE vendors 
//            SET canceled_orders = canceled_orders + 1,
//                pending_orders = pending_orders - 1,
//                updated_at = NOW()
//            WHERE id = ?`,
//           [order.vendor_id]
//         );
//       }
//     }

//     if (notes) {
//       updateData.notes = order.notes ? `${order.notes}\n[${new Date().toLocaleString()}]: ${notes}` : notes;
//     }

//     // order update query
//     await db.query(
//       'UPDATE orders SET ? WHERE order_id = ?',
//       [updateData, orderId]
//     );

//     res.json({
//       success: true,
//       message: `Order status updated to ${status}`,
//       order: {
//         order_id: orderId,
//         status: status,
//         updated_at: new Date()
//       }
//     });
//   } catch (error) {
//     console.error('Update order status error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to update order status'
//     });
//   }
// });


// // 14. service expert rating update
// app.post('/api/service-expert/:id/rate', authenticateJWT, async (req, res) => {
//   const { id } = req.params;
//   const { rating, orderId } = req.body;
//   const userId = req.user.userId;

//   try {
//     // First, check if the order belongs to the user
//     const [orderRows] = await db.query(
//       'SELECT * FROM orders WHERE order_id = ? AND user_id = ?',
//       [orderId, userId]
//     );

//     if (orderRows.length === 0) {
//       return res.status(403).json({
//         success: false,
//         message: 'You can only rate service experts for your own orders'
//       });
//     }

//     // Add logic to update service expert rating here
//     // Adjust according to your database structure

//     res.json({
//       success: true,
//       message: 'Rating submitted successfully'
//     });
//   } catch (error) {
//     console.error('Rating error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to submit rating'
//     });
//   }
// });

// // Order Management Routes
// // app.patch('/api/order/:orderId/assign-vendor', authenticateAdmin, async (req, res) => {
// //   try {
// //     const { orderId } = req.params;
// //     const { vendor_id, status } = req.body;

// //     // Check if order exists
// //     const [orderRows] = await db.query(
// //       'SELECT * FROM orders WHERE order_id = ?',
// //       [orderId]
// //     );

// //     if (orderRows.length === 0) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'Order not found'
// //       });
// //     }

// //     // Check if vendor exists
// //     if (vendor_id) {
// //       const [vendorRows] = await db.query(
// //         'SELECT * FROM vendors WHERE id = ? AND status = ?',
// //         [vendor_id, 'active']
// //       );

// //       if (vendorRows.length === 0) {
// //         return res.status(404).json({
// //           success: false,
// //           message: 'Vendor not found or not active'
// //         });
// //       }
// //     }

// //     // Update order with vendor assignment
// //     await db.query(
// //       `UPDATE orders 
// //        SET vendor_id = ?, 
// //            status = ?,
// //            updated_at = NOW()
// //        WHERE order_id = ?`,
// //       [vendor_id || null, status || 'Assigned to Vendor', orderId]
// //     );

// //     res.json({
// //       success: true,
// //       message: 'Order assigned to vendor successfully'
// //     });

// //   } catch (error) {
// //     console.error('Assign vendor error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to assign vendor'
// //     });
// //   }
// // });

// // Order cancel API - FIXED for user/admin separation
// app.patch('/orders/:orderId/cancel', authenticateJWT, async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { reason, penaltyFee = 0, accept_fee = false } = req.body;
//     const userId = req.user.userId || req.user.id;
//     const userRole = req.user.role || 'user';

//     console.log(`🔄 Cancellation request by ${userRole} for order ${orderId}`);

//     // Check if order exists
//     const [orderRows] = await db.query(
//       `SELECT o.*, 
//               u.name as user_name,
//               v.name as vendor_name,
//               CASE 
//                 WHEN o.vendor_id IS NOT NULL THEN 'Active'
//                 ELSE o.status 
//               END as display_status
//        FROM orders o
//        LEFT JOIN users u ON o.user_id = u.id
//        LEFT JOIN vendors v ON o.vendor_id = v.id
//        WHERE o.order_id = ?`,
//       [orderId]
//     );

//     if (orderRows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     const order = orderRows[0];

//     // Check authorization
//     if (userRole === 'user' || userRole === 'customer') {
//       if (order.user_id !== userId) {
//         return res.status(403).json({
//           success: false,
//           message: 'Unauthorized: You can only cancel your own orders'
//         });
//       }
//     } else if (userRole === 'vendor') {
//       if (order.vendor_id !== userId) {
//         return res.status(403).json({
//           success: false,
//           message: 'Unauthorized: This order is not assigned to you'
//         });
//       }
//     }

//     // Check if order can be cancelled
//     const currentStatus = order.display_status;
//     if (currentStatus === 'Completed' || currentStatus === 'Cancelled') {
//       return res.status(400).json({
//         success: false,
//         message: `Order is already ${currentStatus.toLowerCase()}`
//       });
//     }

//     // Check if service has started
//     const hasServiceStarted = () => {
//       try {
//         if (order.service_started_date) return true;
//         if (order.time_slot && order.order_date) {
//           const orderDate = new Date(order.order_date);
//           const [startTimeStr] = order.time_slot.split('-');
//           const [hours, minutes] = startTimeStr.split(':').map(Number);
//           const serviceStartTime = new Date(orderDate);
//           serviceStartTime.setHours(hours, minutes, 0, 0);
//           return new Date() >= serviceStartTime;
//         }
//         return false;
//       } catch (error) {
//         return false;
//       }
//     };

//     const serviceStarted = hasServiceStarted();
//     const isVendorAssigned = order.vendor_id ? true : false;

//     // USER CANCELLATION LOGIC
//     if (userRole === 'user' || userRole === 'customer') {
//       console.log('👤 User initiated cancellation');

//       // Validate penalty fee for user cancellation
//       if (serviceStarted && penaltyFee !== 500 && isVendorAssigned) {
//         return res.status(400).json({
//           success: false,
//           message: 'Cancellation requires ৳500 penalty fee as service has started'
//         });
//       }

//       if (!serviceStarted && penaltyFee > 0) {
//         return res.status(400).json({
//           success: false,
//           message: 'No penalty fee required for cancellation before service starts'
//         });
//       }

//       await db.query('START TRANSACTION');

//       try {
//         // Update order as user cancelled
//         await db.query(
//           `UPDATE orders 
//            SET status = 'Cancelled',
//                cancel_reason = ?,
//                cancelled_by = 'user',
//                cancelled_date = NOW(),
//                penalty_fee = ?,
//                updated_at = NOW()
//            WHERE order_id = ?`,
//           [reason || 'Customer requested cancellation', penaltyFee, orderId]
//         );

//         // If vendor was assigned
//         if (isVendorAssigned) {
//           if (serviceStarted && penaltyFee > 0) {
//             // Calculate penalty distribution (VENDOR & ADMIN ONLY CAN SEE)
//             const vendorAmount = Math.round(penaltyFee * 0.70); // 70% to vendor
//             const adminAmount = penaltyFee - vendorAmount; // 30% to admin

//             // Record cancellation with distribution (hidden from user)
//             await db.query(
//               `INSERT INTO vendor_cancellations 
//                (vendor_id, order_id, user_id, penalty_amount, reason, 
//                 cancelled_by, vendor_amount, admin_amount, 
//                 cancellation_type, cancelled_at)
//                VALUES (?, ?, ?, ?, ?, 'user', ?, ?, 'user_cancelled_with_charge', NOW())`,
//               [order.vendor_id, orderId, userId, penaltyFee, reason || 'User cancellation',
//                 vendorAmount, adminAmount]
//             );

//             // Update vendor's wallet
//             await db.query(
//               `UPDATE vendors 
//                SET wallet_balance = wallet_balance + ?,
//                    cancelled_orders = cancelled_orders + 1,
//                    updated_at = NOW()
//                WHERE id = ?`,
//               [vendorAmount, order.vendor_id]
//             );

//             // Record vendor transaction (ADMIN/VENDOR ONLY)
//             await db.query(
//               `INSERT INTO vendor_transactions 
//                (vendor_id, order_id, amount, transaction_type, 
//                 description, created_at)
//                VALUES (?, ?, ?, 'penalty_fee_user_cancellation',
//                        'Penalty fee from user cancellation (Vendor: ৳${vendorAmount}, Admin: ৳${adminAmount})', NOW())`,
//               [order.vendor_id, orderId, vendorAmount]
//             );

//           } else {
//             // No penalty - service not started
//             await db.query(
//               `INSERT INTO vendor_cancellations 
//                (vendor_id, order_id, user_id, reason, 
//                 cancelled_by, cancellation_type, cancelled_at)
//                VALUES (?, ?, ?, ?, 'user', 'user_cancelled_no_charge', NOW())`,
//               [order.vendor_id, orderId, userId, reason || 'User cancellation before service']
//             );

//             await db.query(
//               `UPDATE vendors 
//                SET pending_orders = GREATEST(0, pending_orders - 1),
//                    cancelled_orders = cancelled_orders + 1,
//                    updated_at = NOW()
//                WHERE id = ?`,
//               [order.vendor_id]
//             );
//           }

//           // Notify vendor
//           await db.query(
//             `INSERT INTO notifications 
//              (user_id, user_type, title, message, type, related_id, created_at)
//              VALUES (?, 'vendor', 'Order Cancelled by Customer', 
//                      'Order ${orderId} was cancelled by customer. ${penaltyFee > 0 ? 'Penalty fee applied.' : 'No penalty fee.'}', 
//                      'order_cancelled', ?, NOW())`,
//             [order.vendor_id, orderId]
//           );
//         }

//         // Notify user (SHOW ONLY TOTAL PENALTY, NOT DISTRIBUTION)
//         await db.query(
//           `INSERT INTO notifications 
//            (user_id, user_type, title, message, type, related_id, created_at)
//            VALUES (?, 'user', 'Order Cancelled', 
//                    'Your order ${orderId} has been cancelled. ${penaltyFee > 0 ? `Penalty fee of ৳${penaltyFee} has been charged.` : ''}', 
//                    'order_cancelled', ?, NOW())`,
//           [userId, orderId]
//         );

//         await db.query('COMMIT');

//         // Return response based on user role
//         const responseData = {
//           orderId,
//           status: 'Cancelled',
//           cancelled_by: 'user',
//           penaltyFee,
//           serviceStarted,
//           cancelReason: reason
//         };

//         // For user, don't show distribution details
//         if (userRole === 'user' || userRole === 'customer') {
//           responseData.message = penaltyFee > 0
//             ? `Order cancelled successfully with ৳${penaltyFee} penalty fee`
//             : 'Order cancelled successfully';
//         }

//         res.json({
//           success: true,
//           ...responseData
//         });

//       } catch (error) {
//         await db.query('ROLLBACK');
//         throw error;
//       }
//     }
//     // ADMIN CANCELLATION LOGIC
//     else if (userRole === 'admin') {
//       console.log('👑 Admin initiated cancellation');

//       await db.query('START TRANSACTION');

//       try {
//         await db.query(
//           `UPDATE orders 
//            SET status = 'Cancelled',
//                cancel_reason = ?,
//                cancelled_by = 'admin',
//                cancelled_date = NOW(),
//                penalty_fee = ?,
//                updated_at = NOW()
//            WHERE order_id = ?`,
//           [reason || 'Admin cancelled', penaltyFee, orderId]
//         );

//         // Notify user
//         await db.query(
//           `INSERT INTO notifications 
//            (user_id, user_type, title, message, type, related_id, created_at)
//            VALUES (?, 'user', 'Order Cancelled by Admin', 
//                    'Your order ${orderId} has been cancelled by admin. ${penaltyFee > 0 ? `Penalty fee of ৳${penaltyFee} was refunded.` : ''}', 
//                    'order_cancelled', ?, NOW())`,
//           [order.user_id, orderId]
//         );

//         await db.query('COMMIT');

//         res.json({
//           success: true,
//           message: 'Order cancelled by admin',
//           data: {
//             orderId,
//             status: 'Cancelled',
//             cancelled_by: 'admin',
//             penaltyFee
//           }
//         });

//       } catch (error) {
//         await db.query('ROLLBACK');
//         throw error;
//       }
//     }

//   } catch (error) {
//     console.error('Cancel order error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to cancel order'
//     });
//   }
// });

// // Get cancellation details - WITH ROLE-BASED ACCESS
// app.get('/orders/:orderId/cancellation-details', authenticateJWT, async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const userId = req.user.userId || req.user.id;
//     const userRole = req.user.role || 'user';

//     const [orderRows] = await db.query(
//       `SELECT o.*, 
//               u.name as user_name,
//               v.name as vendor_name,
//               vc.*
//        FROM orders o
//        LEFT JOIN users u ON o.user_id = u.id
//        LEFT JOIN vendors v ON o.vendor_id = v.id
//        LEFT JOIN vendor_cancellations vc ON o.order_id = vc.order_id
//        WHERE o.order_id = ?`,
//       [orderId]
//     );

//     if (orderRows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     const order = orderRows[0];

//     // Check authorization
//     let isAuthorized = false;
//     if (userRole === 'admin') {
//       isAuthorized = true;
//     } else if (userRole === 'vendor') {
//       isAuthorized = order.vendor_id === userId;
//     } else if (userRole === 'user') {
//       isAuthorized = order.user_id === userId;
//     }

//     if (!isAuthorized) {
//       return res.status(403).json({
//         success: false,
//         message: 'Unauthorized access to cancellation details'
//       });
//     }

//     // Prepare response based on role
//     const responseData = {
//       order_id: order.order_id,
//       status: order.status,
//       cancelled_by: order.cancelled_by,
//       cancel_reason: order.cancel_reason,
//       penalty_fee: order.penalty_fee || 0,
//       service_started_date: order.service_started_date,
//       cancelled_date: order.cancelled_date,
//       vendor_name: order.vendor_name,
//       user_name: order.user_name
//     };

//     // Only show distribution details to admin and vendor
//     if (userRole === 'admin' || userRole === 'vendor') {
//       responseData.vendor_amount = order.vendor_amount || 0;
//       responseData.admin_amount = order.admin_amount || 0;
//       responseData.cancellation_type = order.cancellation_type;
//       responseData.distribution = order.penalty_fee > 0 ? {
//         vendor_percentage: 70,
//         admin_percentage: 30,
//         vendor_amount: order.vendor_amount || Math.round(order.penalty_fee * 0.70),
//         admin_amount: order.admin_amount || (order.penalty_fee - Math.round(order.penalty_fee * 0.70))
//       } : null;
//     }

//     res.json({
//       success: true,
//       data: responseData
//     });
//   } catch (error) {
//     console.error('Get cancellation details error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch cancellation details'
//     });
//   }
// });

// // Get user's cancellation summary (user can only see their own)
// app.get('/api/cancellations/user-summary', authenticateJWT, async (req, res) => {
//   try {
//     const userId = req.user.userId || req.user.id;
//     const userRole = req.user.role || 'user';

//     if (userRole !== 'user' && userRole !== 'customer') {
//       return res.status(403).json({
//         success: false,
//         message: 'This endpoint is for users only'
//       });
//     }

//     const [summary] = await db.query(
//       `SELECT 
//         COUNT(*) as total_cancelled,
//         SUM(CASE WHEN penalty_fee > 0 THEN 1 ELSE 0 END) as penalty_cancellations,
//         SUM(penalty_fee) as total_penalty_paid
//        FROM orders 
//        WHERE user_id = ? AND status = 'Cancelled' AND cancelled_by = 'user'`,
//       [userId]
//     );

//     res.json({
//       success: true,
//       data: {
//         total_cancelled: summary[0].total_cancelled || 0,
//         penalty_cancellations: summary[0].penalty_cancellations || 0,
//         total_penalty_paid: summary[0].total_penalty_paid || 0
//       }
//     });
//   } catch (error) {
//     console.error('Get user cancellation summary error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch cancellation summary'
//     });
//   }
// });



// // Vendor cancellation compensation API (for admin)
// app.get('/api/vendor-cancellations', authenticateAdmin, async (req, res) => {
//   try {
//     const { vendor_id, start_date, end_date } = req.query;

//     let query = `
//       SELECT vc.*, 
//              o.order_id, 
//              o.total_amount,
//              v.name as vendor_name,
//              v.email as vendor_email,
//              v.phone as vendor_phone,
//              c.name as customer_name,
//              c.email as customer_email
//       FROM vendor_cancellations vc
//       LEFT JOIN orders o ON vc.order_id = o.order_id
//       LEFT JOIN vendors v ON vc.vendor_id = v.id
//       LEFT JOIN users c ON vc.customer_id = c.id
//       WHERE 1=1
//     `;

//     const params = [];

//     if (vendor_id) {
//       query += ' AND vc.vendor_id = ?';
//       params.push(vendor_id);
//     }

//     if (start_date) {
//       query += ' AND vc.cancelled_at >= ?';
//       params.push(start_date);
//     }

//     if (end_date) {
//       query += ' AND vc.cancelled_at <= ?';
//       params.push(end_date);
//     }

//     query += ' ORDER BY vc.cancelled_at DESC';

//     const [cancellations] = await db.query(query, params);

//     const totalPenalty = cancellations.reduce((sum, item) => sum + (item.penalty_amount || 0), 0);

//     res.json({
//       success: true,
//       data: {
//         cancellations,
//         summary: {
//           totalCount: cancellations.length,
//           totalPenalty,
//           averagePenalty: cancellations.length > 0 ? totalPenalty / cancellinations.length : 0
//         }
//       }
//     });

//   } catch (error) {
//     console.error('Vendor cancellations error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch vendor cancellations'
//     });
//   }
// });


// // vendor accept penalty fee

// // Vendor accept penalty fee
// app.post('/orders/:orderId/vendor-accept-penalty', authenticateJWT, async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const userId = req.user.userId || req.user.id;
//     const userRole = req.user.role || 'user';

//     if (userRole !== 'vendor') {
//       return res.status(403).json({
//         success: false,
//         message: 'Only vendors can accept penalty fees'
//       });
//     }

//     // Check if order exists and vendor is assigned
//     const [orderRows] = await db.query(
//       `SELECT o.*, vc.*
//        FROM orders o
//        LEFT JOIN vendor_cancellations vc ON o.order_id = vc.order_id
//        WHERE o.order_id = ? AND o.vendor_id = ?`,
//       [orderId, userId]
//     );

//     if (orderRows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found or not assigned to you'
//       });
//     }

//     const order = orderRows[0];

//     // Check if order is cancelled by user with penalty
//     if (order.status !== 'Cancelled' || order.cancelled_by !== 'user') {
//       return res.status(400).json({
//         success: false,
//         message: 'This order was not cancelled by user with penalty'
//       });
//     }

//     // Check if vendor has already accepted
//     if (order.accepted_by_vendor) {
//       return res.status(400).json({
//         success: false,
//         message: 'Penalty fee already accepted'
//       });
//     }

//     // Update vendor_cancellations to mark as accepted
//     await db.query(
//       `UPDATE vendor_cancellations 
//        SET accepted_by_vendor = TRUE,
//            vendor_accepted_at = NOW()
//        WHERE order_id = ? AND vendor_id = ?`,
//       [orderId, userId]
//     );

//     // Update vendor's wallet (if not already updated)
//     if (order.penalty_amount > 0) {
//       await db.query(
//         `UPDATE vendors 
//          SET wallet_balance = COALESCE(wallet_balance, 0) + ?
//          WHERE id = ?`,
//         [order.vendor_amount || Math.round(order.penalty_amount * 0.70), userId]
//       );
//     }

//     // Notify user
//     await db.query(
//       `INSERT INTO notifications 
//        (user_id, user_type, title, message, type, related_id, created_at)
//        VALUES (?, 'user', 'Penalty Fee Accepted', 
//                'Service expert has accepted the penalty fee for order ${orderId}.', 
//                'payment', ?, NOW())`,
//       [order.user_id, orderId]
//     );

//     res.json({
//       success: true,
//       message: 'Penalty fee accepted successfully',
//       data: {
//         orderId,
//         penalty_amount: order.penalty_amount,
//         vendor_amount: order.vendor_amount
//       }
//     });

//   } catch (error) {
//     console.error('Vendor accept penalty error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to accept penalty fee'
//     });
//   }
// });



// // Get vendor cancellation details with acceptance status
// app.get('/api/vendor/cancellations/:orderId', authenticateJWT, async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const userId = req.user.userId || req.user.id;
//     const userRole = req.user.role || 'user';

//     if (userRole !== 'vendor') {
//       return res.status(403).json({
//         success: false,
//         message: 'Only vendors can access this'
//       });
//     }

//     const [cancellationRows] = await db.query(
//       `SELECT vc.*, o.*, u.name as user_name
//        FROM vendor_cancellations vc
//        JOIN orders o ON vc.order_id = o.order_id
//        JOIN users u ON o.user_id = u.id
//        WHERE vc.order_id = ? AND vc.vendor_id = ?`,
//       [orderId, userId]
//     );

//     if (cancellationRows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Cancellation record not found'
//       });
//     }

//     const cancellation = cancellationRows[0];

//     res.json({
//       success: true,
//       data: {
//         order_id: cancellation.order_id,
//         user_name: cancellation.user_name,
//         penalty_amount: cancellation.penalty_amount,
//         vendor_amount: cancellation.vendor_amount,
//         admin_amount: cancellation.admin_amount,
//         cancellation_type: cancellation.cancellation_type,
//         cancelled_by: cancellation.cancelled_by,
//         reason: cancellation.reason,
//         cancelled_at: cancellation.cancelled_at,
//         accepted_by_vendor: cancellation.accepted_by_vendor,
//         vendor_accepted_at: cancellation.vendor_accepted_at
//       }
//     });

//   } catch (error) {
//     console.error('Get vendor cancellation error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch cancellation details'
//     });
//   }
// });


// // Update your existing status update endpoint to handle service started
// app.patch('/orders/:orderId/status', authenticateAdmin, async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { status, service_started } = req.body;

//     const validStatuses = ['Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled', 'Started', 'Assigned to Vendor', 'Active'];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid order status'
//       });
//     }

//     const [orderRows] = await db.query(
//       'SELECT * FROM orders WHERE order_id = ?',
//       [orderId]
//     );

//     if (orderRows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     const order = orderRows[0];

//     // Prepare update query
//     let updateQuery = `UPDATE orders SET status = ?, updated_at = NOW()`;
//     const params = [status];

//     // Handle service started timestamp
//     if (service_started === true && !order.service_started_date) {
//       updateQuery += `, service_started_date = NOW()`;
//     }

//     // Handle cancelled status
//     if (status === 'Cancelled') {
//       updateQuery += `, cancelled_date = NOW()`;

//       // If vendor was assigned, update vendor stats
//       if (order.vendor_id) {
//         await db.query(
//           `UPDATE vendors 
//            SET pending_orders = GREATEST(0, pending_orders - 1),
//                cancelled_orders = cancelled_orders + 1,
//                updated_at = NOW()
//            WHERE id = ?`,
//           [order.vendor_id]
//         );
//       }
//     }

//     // Handle assigned to vendor status
//     if (status === 'Assigned to Vendor') {
//       updateQuery += `, assigned_date = NOW()`;
//     }

//     // Handle started status
//     if (status === 'Started' && !order.service_started_date) {
//       updateQuery += `, service_started_date = NOW()`;
//     }

//     // Handle completed status
//     if (status === 'Completed' && !order.completed_date) {
//       updateQuery += `, completed_date = NOW()`;
//     }

//     updateQuery += ` WHERE order_id = ?`;
//     params.push(orderId);

//     await db.query(updateQuery, params);

//     res.json({
//       success: true,
//       message: 'Order status updated successfully'
//     });

//   } catch (error) {
//     console.error('Status update error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to update order status'
//     });
//   }
// });

// app.put('/api/order/:orderId', authenticateAdmin, async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { status, notes, vendor_id } = req.body;

//     // Check if order exists
//     const [orderRows] = await db.query(
//       'SELECT * FROM orders WHERE order_id = ?',
//       [orderId]
//     );

//     if (orderRows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     // Check if vendor exists (if vendor_id is provided)
//     if (vendor_id) {
//       const [vendorRows] = await db.query(
//         'SELECT * FROM vendors WHERE id = ?',
//         [vendor_id]
//       );

//       if (vendorRows.length === 0) {
//         return res.status(404).json({
//           success: false,
//           message: 'Vendor not found'
//         });
//       }
//     }

//     // Update order
//     await db.query(
//       `UPDATE orders 
//        SET status = ?,
//            vendor_id = ?,
//            admin_notes = ?,
//            updated_at = NOW()
//        WHERE order_id = ?`,
//       [status, vendor_id || null, notes || null, orderId]
//     );

//     res.json({
//       success: true,
//       message: 'Order updated successfully'
//     });

//   } catch (error) {
//     console.error('Update order error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to update order'
//     });
//   }
// });

// // order hold api
// app.patch('/orders/:orderId/hold', authenticateJWT, async (req, res) => {
//   const { orderId } = req.params;
//   const { reason, checkoutCharge } = req.body;
//   const userId = req.user.userId;

//   try {
//     // order check
//     const [orderRows] = await db.query(
//       'SELECT * FROM orders WHERE order_id = ? AND user_id = ?',
//       [orderId, userId]
//     );

//     if (orderRows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     const order = orderRows[0];

//     // order active or started check
//     if (order.status !== 'Active' || !hasServiceStarted(order)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Only active orders with service started can be put on hold'
//       });
//     }

//     // order hold update
//     await db.query(
//       `UPDATE orders 
//        SET status = 'Hold',
//            hold_reason = ?,
//            checkout_charge = ?,
//            hold_date = NOW()
//        WHERE order_id = ?`,
//       [reason, checkoutCharge, orderId]
//     );

//     // vendor stats update
//     if (order.vendor_id) {
//       await db.query(
//         `UPDATE vendors 
//          SET pending_orders = pending_orders - 1,
//              hold_orders = hold_orders + 1,
//              updated_at = NOW()
//          WHERE id = ?`,
//         [order.vendor_id]
//       );
//     }

//     res.json({
//       success: true,
//       message: 'Order put on hold successfully',
//       order: {
//         order_id: orderId,
//         status: 'Hold',
//         checkout_charge: checkoutCharge
//       }
//     });

//   } catch (error) {
//     console.error('Hold order error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to put order on hold'
//     });
//   }
// });


// // =============================== HEALTH CHECK ===============================     
// app.get('/api/vendor/health', (req, res) => {
//   res.json({
//     success: true,
//     status: 'Server is running',
//     timestamp: new Date().toISOString(),
//     port: port
//   });
// });

// // Add a general health check endpoint too
// app.get('/api/health', (req, res) => {
//   res.json({
//     success: true,
//     status: 'Server is healthy',
//     timestamp: new Date().toISOString(),
//     port: port
//   });
// });



// // ======================================================Notification====================================

// // Get user notifications
// app.get('/api/notifications', authenticateJWT, async (req, res) => {
//   try {
//     const userId = req.user.userId || req.user.id;
//     const userType = req.user.role === 'vendor' ? 'vendor' : 'user'; // Assuming role field

//     const [notifications] = await db.query(
//       `SELECT id, title, message, type, related_id, is_read, 
//               created_at, read_at
//        FROM notifications 
//        WHERE user_id = ? AND user_type = ?
//        ORDER BY created_at DESC
//        LIMIT 50`,
//       [userId, userType]
//     );

//     // Count unread notifications
//     const [unreadCount] = await db.query(
//       `SELECT COUNT(*) as count 
//        FROM notifications 
//        WHERE user_id = ? AND user_type = ? AND is_read = FALSE`,
//       [userId, userType]
//     );

//     res.json({
//       success: true,
//       notifications,
//       unreadCount: unreadCount[0].count
//     });
//   } catch (error) {
//     console.error('Get notifications error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch notifications'
//     });
//   }
// });

// // Mark notification as read
// app.patch('/api/notifications/:id/read', authenticateJWT, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user.userId || req.user.id;
//     const userType = req.user.role === 'vendor' ? 'vendor' : 'user';

//     const [result] = await db.query(
//       `UPDATE notifications 
//        SET is_read = TRUE, read_at = NOW()
//        WHERE id = ? AND user_id = ? AND user_type = ?`,
//       [id, userId, userType]
//     );

//     if (result.affectedRows === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Notification not found'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Notification marked as read'
//     });
//   } catch (error) {
//     console.error('Mark as read error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to mark notification as read'
//     });
//   }
// });

// // Mark all notifications as read
// app.patch('/api/notifications/mark-all-read', authenticateJWT, async (req, res) => {
//   try {
//     const userId = req.user.userId || req.user.id;
//     const userType = req.user.role === 'vendor' ? 'vendor' : 'user';

//     await db.query(
//       `UPDATE notifications 
//        SET is_read = TRUE, read_at = NOW()
//        WHERE user_id = ? AND user_type = ? AND is_read = FALSE`,
//       [userId, userType]
//     );

//     res.json({
//       success: true,
//       message: 'All notifications marked as read'
//     });
//   } catch (error) {
//     console.error('Mark all as read error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to mark notifications as read'
//     });
//   }
// });

// // Delete notification
// app.delete('/api/notifications/:id', authenticateJWT, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user.userId || req.user.id;
//     const userType = req.user.role === 'vendor' ? 'vendor' : 'user';

//     const [result] = await db.query(
//       `DELETE FROM notifications 
//        WHERE id = ? AND user_id = ? AND user_type = ?`,
//       [id, userId, userType]
//     );

//     if (result.affectedRows === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Notification not found'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Notification deleted'
//     });
//   } catch (error) {
//     console.error('Delete notification error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to delete notification'
//     });
//   }
// });

// // Get unread notification count API
// app.get('/api/notifications/unread-count', authenticateJWT, async (req, res) => {
//   try {
//     const userId = req.user.userId || req.user.id;
//     const userType = req.user.role === 'vendor' ? 'vendor' : 'user';

//     // Try to get count from notifications table
//     try {
//       const [result] = await db.query(
//         `SELECT COUNT(*) as count 
//          FROM notifications 
//          WHERE user_id = ? AND user_type = ? AND is_read = FALSE`,
//         [userId, userType]
//       );

//       return res.json({
//         success: true,
//         count: result[0].count || 0
//       });
//     } catch (tableError) {
//       // If notifications table doesn't exist, return 0
//       console.log('⚠️ Notifications table not found, returning default count');
//       return res.json({
//         success: true,
//         count: 0
//       });
//     }

//   } catch (error) {
//     console.error('Get unread count error:', error);
//     res.json({
//       success: false,
//       count: 0,
//       message: 'Error fetching unread count'
//     });
//   }
// });


// // ======================== SCHEDULE CHANGE API ========================

// // Schedule Change API
// app.patch('/orders/:orderId/schedule', authenticateJWT, async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { newDate, newTimeSlot, reason } = req.body;
//     const userId = req.user.userId || req.user.id;
//     const userRole = req.user.role || 'user';

//     console.log(`🔄 Schedule change request for order: ${orderId}`);
//     console.log(`📅 New Date: ${newDate}`);
//     console.log(`⏰ New Time: ${newTimeSlot}`);
//     console.log(`👤 Requested by: ${userRole} (${userId})`);

//     // First, check the order
//     const [orderRows] = await db.query(
//       `SELECT * FROM orders 
//        WHERE order_id = ?`,
//       [orderId]
//     );

//     if (orderRows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     const order = orderRows[0];

//     // Check authorization
//     if (userRole === 'user' || userRole === 'customer') {
//       if (order.user_id !== userId) {
//         return res.status(403).json({
//           success: false,
//           message: 'You can only change schedule for your own orders'
//         });
//       }
//     }

//     // Check if order is in Pending or Processing status
//     if (!['Pending', 'Processing'].includes(order.status)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Cannot change schedule for this order status'
//       });
//     }

//     // Check if vendor has been assigned
//     if (order.vendor_id || order.service_expert) {
//       return res.status(400).json({
//         success: false,
//         message: 'Cannot change schedule after expert assignment'
//       });
//     }

//     // Check if service has started
//     const hasServiceStarted = () => {
//       try {
//         if (order.service_started_date) return true;
//         if (order.time_slot && order.order_date) {
//           const orderDate = new Date(order.order_date);
//           const [startTimeStr] = order.time_slot.split('-');
//           const [hours, minutes] = startTimeStr.split(':').map(Number);
//           const serviceStartTime = new Date(orderDate);
//           serviceStartTime.setHours(hours, minutes, 0, 0);
//           return new Date() >= serviceStartTime;
//         }
//         return false;
//       } catch (error) {
//         return false;
//       }
//     };

//     if (hasServiceStarted()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Cannot change schedule after service has started'
//       });
//     }

//     // Validate new date is in future
//     const newDateObj = new Date(newDate);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     if (newDateObj < today) {
//       return res.status(400).json({
//         success: false,
//         message: 'New date must be in the future'
//       });
//     }

//     // Validate time slot format
//     if (!newTimeSlot || !newTimeSlot.includes('-')) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid time slot format'
//       });
//     }

//     // Start transaction
//     await db.query('START TRANSACTION');

//     try {
//       // 1. Schedule change history টেবিলে record তৈরি করুন (যদি না থাকে)
//       try {
//         await db.query(`
//           CREATE TABLE IF NOT EXISTS schedule_changes (
//             id INT AUTO_INCREMENT PRIMARY KEY,
//             order_id VARCHAR(50) NOT NULL,
//             user_id VARCHAR(50) NOT NULL,
//             previous_date DATE NOT NULL,
//             previous_time_slot VARCHAR(50) NOT NULL,
//             new_date DATE NOT NULL,
//             new_time_slot VARCHAR(50) NOT NULL,
//             changed_by VARCHAR(50) NOT NULL,
//             reason TEXT,
//             change_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//             INDEX idx_order_id (order_id),
//             INDEX idx_user_id (user_id)
//           )
//         `);
//         console.log("✅ schedule_changes table checked/created");
//       } catch (err) {
//         console.log("ℹ️ schedule_changes table already exists");
//       }

//       // 2. Schedule change history save করুন
//       await db.query(
//         `INSERT INTO schedule_changes 
//          (order_id, user_id, previous_date, previous_time_slot, 
//           new_date, new_time_slot, changed_by, reason) 
//          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//         [
//           orderId,
//           userId,
//           order.order_date,
//           order.time_slot,
//           newDate,
//           newTimeSlot,
//           userRole,
//           reason || 'Customer requested schedule change'
//         ]
//       );

//       // 3. Order টেবিলে সরাসরি আপডেট করুন
//       await db.query(
//         `UPDATE orders 
//          SET order_date = ?,
//              time_slot = ?,
//              schedule_changed = TRUE,
//              schedule_changed_date = NOW(),
//              updated_at = NOW()
//          WHERE order_id = ?`,
//         [newDate, newTimeSlot, orderId]
//       );

//       // 4. Notification টেবিলে record তৈরি করুন (যদি না থাকে)
//       try {
//         await db.query(`
//           CREATE TABLE IF NOT EXISTS notifications (
//             id INT AUTO_INCREMENT PRIMARY KEY,
//             user_id VARCHAR(50) NOT NULL,
//             user_type ENUM('user', 'vendor', 'admin') NOT NULL,
//             title VARCHAR(255) NOT NULL,
//             message TEXT NOT NULL,
//             type VARCHAR(50),
//             related_id VARCHAR(50),
//             is_read BOOLEAN DEFAULT FALSE,
//             read_at TIMESTAMP NULL,
//             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//             INDEX idx_user (user_id, user_type),
//             INDEX idx_unread (user_id, user_type, is_read)
//           )
//         `);
//         console.log("✅ notifications table checked/created");
//       } catch (err) {
//         console.log("ℹ️ notifications table already exists");
//       }

//       // 5. User কে notification দিন
//       await db.query(
//         `INSERT INTO notifications 
//          (user_id, user_type, title, message, type, related_id, created_at) 
//          VALUES (?, 'user', 'Schedule Updated', 
//                  'Your order ${orderId} schedule has been changed to ${new Date(newDate).toLocaleDateString()} at ${newTimeSlot}', 
//                  'schedule_change', ?, NOW())`,
//         [userId, orderId]
//       );

//       // 6. Admin কে notification দিন (যদি admin থাকে)
//       try {
//         const [adminRows] = await db.query(
//           "SELECT id FROM admins WHERE verified = 1"
//         );

//         if (adminRows.length > 0) {
//           for (const admin of adminRows) {
//             await db.query(
//               `INSERT INTO notifications 
//                (user_id, user_type, title, message, type, related_id, created_at) 
//                VALUES (?, 'admin', 'Order Schedule Changed', 
//                        'Order ${orderId} schedule changed by customer. New schedule: ${new Date(newDate).toLocaleDateString()} at ${newTimeSlot}', 
//                        'schedule_change', ?, NOW())`,
//               [admin.id, orderId]
//             );
//           }
//         }
//       } catch (adminError) {
//         console.log("ℹ️ No admin found for notification");
//       }

//       await db.query('COMMIT');

//       console.log(`✅ Schedule changed successfully for order ${orderId}`);

//       res.json({
//         success: true,
//         message: 'Schedule updated successfully',
//         data: {
//           order_id: orderId,
//           previous_date: order.order_date,
//           previous_time_slot: order.time_slot,
//           new_date: newDate,
//           new_time_slot: newTimeSlot,
//           changed_by: userRole,
//           change_date: new Date()
//         }
//       });

//     } catch (error) {
//       await db.query('ROLLBACK');
//       throw error;
//     }

//   } catch (error) {
//     console.error('Schedule change error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to update schedule',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// // Get schedule change history for an order
// app.get('/orders/:orderId/schedule-history', authenticateJWT, async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const userId = req.user.userId || req.user.id;
//     const userRole = req.user.role || 'user';

//     // Check if user has access to this order
//     const [orderRows] = await db.query(
//       `SELECT * FROM orders 
//        WHERE order_id = ? AND user_id = ?`,
//       [orderId, userId]
//     );

//     if (orderRows.length === 0 && userRole !== 'admin' && userRole !== 'superadmin') {
//       return res.status(403).json({
//         success: false,
//         message: 'Access denied to order history'
//       });
//     }

//     // Get schedule change history
//     const [history] = await db.query(
//       `SELECT sc.*, 
//               u.name as user_name,
//               u.email as user_email
//        FROM schedule_changes sc
//        LEFT JOIN users u ON sc.user_id = u.custom_id
//        WHERE sc.order_id = ?
//        ORDER BY sc.change_date DESC`,
//       [orderId]
//     );

//     res.json({
//       success: true,
//       history: history.map(record => ({
//         id: record.id,
//         order_id: record.order_id,
//         user_name: record.user_name,
//         previous_date: record.previous_date,
//         previous_time_slot: record.previous_time_slot,
//         new_date: record.new_date,
//         new_time_slot: record.new_time_slot,
//         changed_by: record.changed_by,
//         reason: record.reason,
//         change_date: record.change_date
//       }))
//     });

//   } catch (error) {
//     console.error('Get schedule history error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch schedule history'
//     });
//   }
// });

// // Check if schedule can be changed for an order
// app.get('/orders/:orderId/can-change-schedule', authenticateJWT, async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const userId = req.user.userId || req.user.id;
//     const userRole = req.user.role || 'user';

//     // Get order details
//     const [orderRows] = await db.query(
//       `SELECT * FROM orders 
//        WHERE order_id = ?`,
//       [orderId]
//     );

//     if (orderRows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         can_change: false,
//         message: 'Order not found'
//       });
//     }

//     const order = orderRows[0];

//     // Check authorization
//     if (userRole === 'user' && order.user_id !== userId) {
//       return res.status(403).json({
//         success: false,
//         can_change: false,
//         message: 'Access denied'
//       });
//     }

//     // Check conditions for schedule change
//     const canChangeSchedule = () => {
//       // 1. Check status
//       if (!['Pending', 'Processing'].includes(order.status)) {
//         return {
//           can_change: false,
//           reason: `Order status is ${order.status}`
//         };
//       }

//       // 2. Check if vendor assigned
//       if (order.vendor_id || order.service_expert) {
//         return {
//           can_change: false,
//           reason: 'Service expert already assigned'
//         };
//       }

//       // 3. Check if service started
//       const hasServiceStarted = () => {
//         try {
//           if (order.service_started_date) return true;
//           if (order.time_slot && order.order_date) {
//             const orderDate = new Date(order.order_date);
//             const [startTimeStr] = order.time_slot.split('-');
//             const [hours, minutes] = startTimeStr.split(':').map(Number);
//             const serviceStartTime = new Date(orderDate);
//             serviceStartTime.setHours(hours, minutes, 0, 0);
//             return new Date() >= serviceStartTime;
//           }
//           return false;
//         } catch (error) {
//           return false;
//         }
//       };

//       if (hasServiceStarted()) {
//         return {
//           can_change: false,
//           reason: 'Service has already started'
//         };
//       }

//       // 4. Check if already changed before (optional limit)
//       if (order.schedule_changed) {
//         // You can limit to 1 change per order
//         return {
//           can_change: false,
//           reason: 'Schedule already changed once'
//         };
//       }

//       return {
//         can_change: true,
//         reason: 'Schedule can be changed'
//       };
//     };

//     const result = canChangeSchedule();

//     res.json({
//       success: true,
//       order_id: orderId,
//       current_date: order.order_date,
//       current_time_slot: order.time_slot,
//       ...result,
//       conditions: {
//         valid_status: ['Pending', 'Processing'].includes(order.status),
//         no_vendor_assigned: !(order.vendor_id || order.service_expert),
//         service_not_started: !hasServiceStarted(),
//         not_changed_before: !order.schedule_changed
//       }
//     });

//   } catch (error) {
//     console.error('Check schedule change error:', error);
//     res.status(500).json({
//       success: false,
//       can_change: false,
//       message: 'Failed to check schedule change status'
//     });
//   }
// });

// // Start server
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });


// const express = require("express");
// const mysql = require("mysql2");
// const bcrypt = require("bcrypt");
// const cors = require("cors");
// const jwt = require("jsonwebtoken");
// require("dotenv").config();
// const path = require('path');
// const fs = require('fs');
// const multer = require('multer');
// const nodemailer = require("nodemailer");
// const cookieParser = require("cookie-parser");
// const rateLimit = require('express-rate-limit');
// const crypto = require('crypto');
// const validator = require('validator');

// // ============================================================
// // CORS CONFIGURATION
// // ============================================================
// const corsOptions = {
//   origin: function (origin, callback) {
//     const allowedOrigins = [
//       'http://localhost:3000',
//       'http://localhost:60174',
//       'http://localhost',
//       'http://192.168.0.4:3000',
//       'http://192.168.0.4:60174',
//       'http://192.168.0.4'
//     ];

//     if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//   allowedHeaders: [
//     'Content-Type',
//     'Authorization',
//     'Origin',
//     'Accept',
//     'X-Requested-With',
//     'X-App-Source',
//     'X-App-Version',
//     'X-Request-ID'
//   ],
//   credentials: true,
//   optionsSuccessStatus: 200
// };

// // ============================================================
// // CREATE UPLOAD DIRECTORIES
// // ============================================================
// function createUploadDirectories() {
//   const directories = [
//     path.join(__dirname, 'uploads'),
//     path.join(__dirname, 'uploads/profiles'),
//     path.join(__dirname, 'uploads/nids'),
//     path.join(__dirname, 'uploads/services'),
//     path.join(__dirname, 'uploads/cvs'),
//     path.join(__dirname, 'uploads/licenses'),
//     path.join(__dirname, 'uploads/reports')
//   ];

//   directories.forEach(dir => {
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir, { recursive: true });
//       console.log(`📁 Created directory: ${dir}`);
//     }
//   });
// }

// // ============================================================
// // APP SETUP
// // ============================================================
// const app = express();
// const port = 5001;

// // Middleware setup
// app.use(cors(corsOptions));
// app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.options('*', cors(corsOptions));
// app.use(cookieParser());
// app.use(express.urlencoded({ extended: true }));

// // Additional CORS middleware
// app.use((req, res, next) => {
//   const origin = req.headers.origin;

//   if (origin && origin.startsWith('http://localhost:')) {
//     res.header('Access-Control-Allow-Origin', origin);
//   }
//   if (origin && origin.startsWith('http://192.168.0.5:')) {
//     res.header('Access-Control-Allow-Origin', origin);
//   }

//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, Accept, X-Requested-With');
//   res.header('Access-Control-Allow-Credentials', 'true');
//   res.header('Access-Control-Max-Age', '86400');

//   if (req.method === 'OPTIONS') {
//     return res.status(200).end();
//   }

//   next();
// });

// createUploadDirectories();

// // ============================================================
// // DATABASE CONNECTION
// // ============================================================
// const db = mysql.createConnection({
//   host: "localhost",
//   user: "pacific",
//   password: "Nahid0088@gmail.com",
//   database: "auth_system",
// }).promise();

// // ============================================================
// // DATABASE INITIALIZATION
// // ============================================================
// const initializeDatabase = async () => {
//   try {
//     console.log("🔧 Initializing database tables...");

//     // Order schedule columns
//     const orderScheduleColumns = [
//       { name: 'schedule_changed', type: 'BOOLEAN DEFAULT FALSE' },
//       { name: 'schedule_changed_date', type: 'DATETIME' }
//     ];

//     for (const column of orderScheduleColumns) {
//       try {
//         await db.query(`ALTER TABLE orders ADD COLUMN ${column.name} ${column.type}`);
//         console.log(`✅ Added ${column.name} column to orders table`);
//       } catch (err) {
//         if (err.code === 'ER_DUP_FIELDNAME') {
//           console.log(`ℹ️ ${column.name} column already exists`);
//         } else {
//           console.error(`Error adding ${column.name}:`, err.message);
//         }
//       }
//     }

//     // schedule_changes table
//     try {
//       await db.query(`
//         CREATE TABLE IF NOT EXISTS schedule_changes (
//           id INT AUTO_INCREMENT PRIMARY KEY,
//           order_id VARCHAR(50) NOT NULL,
//           user_id VARCHAR(50) NOT NULL,
//           previous_date DATE NOT NULL,
//           previous_time_slot VARCHAR(50) NOT NULL,
//           new_date DATE NOT NULL,
//           new_time_slot VARCHAR(50) NOT NULL,
//           changed_by VARCHAR(50) NOT NULL,
//           reason TEXT,
//           change_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//           FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
//           INDEX idx_order_id (order_id),
//           INDEX idx_user_id (user_id)
//         )
//       `);
//       console.log("✅ schedule_changes table checked/created");
//     } catch (err) {
//       console.log("ℹ️ schedule_changes table already exists or error:", err.message);
//     }

//     // notifications table
//     try {
//       await db.query(`
//         CREATE TABLE IF NOT EXISTS notifications (
//           id INT AUTO_INCREMENT PRIMARY KEY,
//           user_id VARCHAR(50) NOT NULL,
//           user_type ENUM('user', 'vendor', 'admin') NOT NULL,
//           title VARCHAR(255) NOT NULL,
//           message TEXT NOT NULL,
//           type VARCHAR(50),
//           related_id VARCHAR(50),
//           is_read BOOLEAN DEFAULT FALSE,
//           read_at TIMESTAMP NULL,
//           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//           INDEX idx_user (user_id, user_type),
//           INDEX idx_unread (user_id, user_type, is_read)
//         )
//       `);
//       console.log("✅ notifications table checked/created");
//     } catch (err) {
//       console.log("ℹ️ notifications table already exists or error:", err.message);
//     }

//     // order_reviews table
//     try {
//       await db.query(`
//         CREATE TABLE IF NOT EXISTS order_reviews (
//           id INT AUTO_INCREMENT PRIMARY KEY,
//           order_id VARCHAR(50) NOT NULL,
//           user_id VARCHAR(50) NOT NULL,
//           service_expert_rating INT NOT NULL DEFAULT 5,
//           website_service_rating INT NOT NULL DEFAULT 5,
//           comments TEXT,
//           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//           FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
//           INDEX idx_order_id (order_id),
//           INDEX idx_user_id (user_id)
//         )
//       `);
//       console.log("✅ order_reviews table checked");
//     } catch (err) {
//       console.log("ℹ️ order_reviews table already exists");
//     }

//     // Orders table columns
//     const ordersColumns = [
//       { name: 'service_expert', type: 'TEXT' },
//       { name: 'reviews', type: 'TEXT' },
//       { name: 'assigned_date', type: 'DATETIME' },
//       { name: 'in_progress_date', type: 'DATETIME' },
//       { name: 'completed_date', type: 'DATETIME' },
//       { name: 'confirmed_date', type: 'DATETIME' },
//       { name: 'vendor_id', type: 'INT' }
//     ];

//     for (const column of ordersColumns) {
//       try {
//         await db.query(`ALTER TABLE orders ADD COLUMN ${column.name} ${column.type}`);
//         console.log(`✅ Added ${column.name} column to orders table`);
//       } catch (err) {
//         if (err.code === 'ER_DUP_FIELDNAME') {
//           console.log(`ℹ️ ${column.name} column already exists`);
//         } else {
//           console.error(`Error adding ${column.name}:`, err.message);
//         }
//       }
//     }

//     // Foreign key
//     try {
//       await db.query(`
//         ALTER TABLE orders 
//         ADD FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE SET NULL
//       `);
//       console.log("✅ Added vendor_id foreign key");
//     } catch (err) {
//       if (err.code === 'ER_DUP_KEY' || err.code === 'ER_CANT_CREATE_TABLE') {
//         console.log("ℹ️ Foreign key already exists");
//       } else {
//         console.error("Error adding foreign key:", err.message);
//       }
//     }

//     // Indexes
//     try {
//       await db.query('CREATE INDEX idx_status ON orders(status)');
//       console.log("✅ Created idx_status index");
//     } catch (err) {
//       if (err.code === 'ER_DUP_KEYNAME') {
//         console.log("ℹ️ idx_status index already exists");
//       }
//     }

//     try {
//       await db.query('CREATE INDEX idx_vendor_id ON orders(vendor_id)');
//       console.log("✅ Created idx_vendor_id index");
//     } catch (err) {
//       if (err.code === 'ER_DUP_KEYNAME') {
//         console.log("ℹ️ idx_vendor_id index already exists");
//       }
//     }

//     // Users table reset token columns
//     try {
//       await db.query(`
//         ALTER TABLE users
//         ADD COLUMN reset_token VARCHAR(255),
//         ADD COLUMN reset_token_expiry DATETIME
//       `);
//       console.log("✅ Added reset token columns to users table");
//     } catch (err) {
//       if (err.code === 'ER_DUP_FIELDNAME') {
//         console.log("ℹ️ Reset token columns already exist in users table");
//       }
//     }

//     // Vendors table columns
//     const vendorColumns = [
//       { name: 'total_orders', type: 'INT DEFAULT 0' },
//       { name: 'completed_orders', type: 'INT DEFAULT 0' },
//       { name: 'pending_orders', type: 'INT DEFAULT 0' },
//       { name: 'canceled_orders', type: 'INT DEFAULT 0' },
//       { name: 'active_orders', type: 'INT DEFAULT 0' },
//       { name: 'hold_orders', type: 'INT DEFAULT 0' },
//       { name: 'success_rate', type: 'INT DEFAULT 0' },
//       { name: 'average_rating', type: 'DECIMAL(3,2) DEFAULT 0.0' },
//       { name: 'wallet_balance', type: 'DECIMAL(10,2) DEFAULT 0.0' },
//       { name: 'reset_token', type: 'VARCHAR(255)' },
//       { name: 'reset_token_expiry', type: 'DATETIME' }
//     ];

//     for (const column of vendorColumns) {
//       try {
//         await db.query(`ALTER TABLE vendors ADD COLUMN ${column.name} ${column.type}`);
//         console.log(`✅ Added ${column.name} column to vendors table`);
//       } catch (err) {
//         if (err.code === 'ER_DUP_FIELDNAME') {
//           console.log(`ℹ️ ${column.name} column already exists in vendors table`);
//         }
//       }
//     }

//     // Vendors table indexes
//     try {
//       await db.query('CREATE INDEX idx_vendor_status ON vendors(status)');
//       console.log("✅ Created idx_vendor_status index");
//     } catch (err) {
//       if (err.code === 'ER_DUP_KEYNAME') {
//         console.log("ℹ️ idx_vendor_status index already exists");
//       }
//     }

//     console.log("🎉 Database initialization completed successfully!");

//   } catch (error) {
//     console.error("❌ Database initialization error:", error);
//   }
// };

// // Database connection
// db.connect(async (err) => {
//   if (err) {
//     console.error("Database connection error:", err);
//   } else {
//     console.log("Connected to MySQL database");
//     await initializeDatabase();
//   }
// });

// // ============================================================
// // MULTER CONFIGURATION
// // ============================================================
// const profileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = path.join(__dirname, 'uploads/profiles');
//     fs.mkdirSync(dir, { recursive: true });
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     cb(null, `profile-${Date.now()}${ext}`);
//   }
// });

// const serviceStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = path.join(__dirname, 'uploads/services');
//     fs.mkdirSync(dir, { recursive: true });
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     cb(null, `service-${Date.now()}${ext}`);
//   }
// });

// const vendorStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     let dir;
//     switch (file.fieldname) {
//       case 'profile_image':
//         dir = path.join(__dirname, 'uploads/profiles');
//         break;
//       case 'nid_front':
//       case 'nid_back':
//         dir = path.join(__dirname, 'uploads/nids');
//         break;
//       case 'cv':
//         dir = path.join(__dirname, 'uploads/cvs');
//         break;
//       case 'trade_license':
//         dir = path.join(__dirname, 'uploads/licenses');
//         break;
//       default:
//         dir = path.join(__dirname, 'uploads/others');
//     }
//     fs.mkdirSync(dir, { recursive: true });
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const timestamp = Date.now();
//     cb(null, `${file.fieldname}-${timestamp}${ext}`);
//   }
// });

// const imageFileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png|gif/;
//   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = allowedTypes.test(file.mimetype);

//   if (mimetype && extname) {
//     cb(null, true);
//   } else {
//     cb(new Error('শুধুমাত্র ইমেজ ফাইল (JPEG, JPG, PNG, GIF) অনুমোদিত'), false);
//   }
// };

// const uploadProfile = multer({
//   storage: profileStorage,
//   limits: { fileSize: 5 * 1024 * 1024 },
//   fileFilter: imageFileFilter
// });

// const uploadService = multer({
//   storage: serviceStorage,
//   limits: { fileSize: 10 * 1024 * 1024 },
//   fileFilter: imageFileFilter
// });

// const uploadVendorDocs = multer({
//   storage: vendorStorage,
//   limits: { fileSize: 10 * 1024 * 1024 },
//   fileFilter: (req, file, cb) => {
//     cb(null, true);
//   }
// });

// // ============================================================
// // AUTHENTICATION MIDDLEWARE
// // ============================================================
// const authenticateJWT = (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   if (!authHeader) {
//     return res.status(401).json({ success: false, message: "Authorization header missing" });
//   }

//   const token = authHeader.split(" ")[1];
//   if (!token) {
//     return res.status(401).json({ success: false, message: "Token missing" });
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(403).json({ success: false, message: "Invalid token" });
//     }
//     req.user = decoded;
//     next();
//   });
// };

// const verifyToken = (roles = []) => (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

//   if (!token) {
//     return res.status(401).json({ success: false, message: "Authorization token missing" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     if (decoded.role === 'superadmin') {
//       req.user = decoded;
//       return next();
//     }

//     if (roles.length > 0 && !roles.includes(decoded.role)) {
//       return res.status(403).json({
//         success: false,
//         message: `Requires one of these roles: ${roles.join(', ')}`
//       });
//     }

//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(403).json({
//       success: false,
//       message: "Invalid or expired token",
//       error: err.message
//     });
//   }
// };

// const authenticateAdmin = (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({
//         success: false,
//         message: 'No token provided'
//       });
//     }

//     const token = authHeader.split(' ')[1];

//     jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, decoded) => {
//       if (err) {
//         console.error('Token verification error:', err);
//         return res.status(403).json({
//           success: false,
//           message: 'Invalid or expired token'
//         });
//       }

//       const allowedRoles = ['admin', 'superadmin'];
//       if (!allowedRoles.includes(decoded.role)) {
//         return res.status(403).json({
//           success: false,
//           message: 'Access denied. Admin privileges required.'
//         });
//       }

//       req.user = decoded;
//       next();
//     });
//   } catch (error) {
//     console.error('Admin auth error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Authentication failed'
//     });
//   }
// };

// const authenticateVendor = async (req, res, next) => {
//   try {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Access token required"
//       });
//     }

//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//       if (err) {
//         console.log('❌ Token verification failed:', err.message);
//         return res.status(403).json({
//           success: false,
//           message: "Invalid or expired token"
//         });
//       }

//       if (decoded.role !== 'vendor') {
//         return res.status(403).json({
//           success: false,
//           message: "Access denied. Vendor role required."
//         });
//       }

//       let vendorId = decoded.userId || decoded.id || decoded.vendorId || decoded.user_id;

//       if (!vendorId && decoded.user && decoded.user.id) {
//         vendorId = decoded.user.id;
//       }

//       if (!vendorId) {
//         req.vendor = {
//           email: decoded.email || decoded.userEmail,
//           role: decoded.role,
//         };
//       } else {
//         req.vendor = {
//           vendorId: vendorId,
//           email: decoded.email || decoded.userEmail,
//           role: decoded.role
//         };
//       }

//       next();
//     });
//   } catch (error) {
//     console.error("❌ Authentication error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Authentication failed"
//     });
//   }
// };

// // ============================================================
// // HELPER FUNCTIONS
// // ============================================================

// async function updateVendorStats(orderId, oldStatus, newStatus, vendorId, serviceExpert = null) {
//   if (!vendorId || oldStatus === newStatus) return;

//   try {
//     await db.query('START TRANSACTION');

//     console.log(`📊 Updating vendor stats: ${oldStatus} → ${newStatus}`);

//     const decrementMap = {
//       'Pending': 'pending_orders',
//       'Active': 'active_orders',
//       'Processing': 'active_orders',
//       'Started': 'active_orders',
//       'Completed': 'completed_orders',
//       'Cancelled': 'canceled_orders',
//       'Hold': 'hold_orders'
//     };

//     if (decrementMap[oldStatus]) {
//       await db.query(
//         `UPDATE vendors SET ${decrementMap[oldStatus]} = GREATEST(0, ${decrementMap[oldStatus]} - 1) WHERE id = ?`,
//         [vendorId]
//       );
//       console.log(`   ✅ Decremented ${decrementMap[oldStatus]}`);
//     }

//     const incrementMap = {
//       'Pending': 'pending_orders',
//       'Active': 'active_orders',
//       'Processing': 'active_orders',
//       'Started': 'active_orders',
//       'Completed': 'completed_orders',
//       'Cancelled': 'canceled_orders',
//       'Hold': 'hold_orders'
//     };

//     if (incrementMap[newStatus]) {
//       await db.query(
//         `UPDATE vendors SET ${incrementMap[newStatus]} = ${incrementMap[newStatus]} + 1 WHERE id = ?`,
//         [vendorId]
//       );
//       console.log(`   ✅ Incremented ${incrementMap[newStatus]}`);
//     }

//     if (newStatus === 'Completed') {
//       await db.query(
//         'UPDATE vendors SET total_orders = total_orders + 1 WHERE id = ?',
//         [vendorId]
//       );
//       console.log(`   ✅ Incremented total_orders`);

//       if (serviceExpert) {
//         try {
//           const expertData = typeof serviceExpert === 'string' 
//             ? JSON.parse(serviceExpert) 
//             : serviceExpert;
          
//           if (expertData && expertData.rating) {
//             await db.query(
//               `UPDATE vendors v
//                SET v.average_rating = (
//                  SELECT COALESCE(AVG(
//                    CASE 
//                      WHEN JSON_EXTRACT(o.service_expert, '$.rating') IS NOT NULL 
//                      THEN JSON_EXTRACT(o.service_expert, '$.rating')
//                      ELSE 0 
//                    END
//                  ), 0)
//                  FROM orders o
//                  WHERE o.vendor_id = v.id 
//                  AND o.status = 'Completed'
//                  AND o.service_expert IS NOT NULL
//                )
//                WHERE v.id = ?`,
//               [vendorId]
//             );
//             console.log(`   ✅ Updated average_rating`);
//           }
//         } catch (e) {
//           console.error('   ⚠️ Rating update error:', e.message);
//         }
//       }
//     }

//     await db.query(
//       `UPDATE vendors v
//        SET v.success_rate = (
//          SELECT CASE 
//            WHEN (completed_orders + canceled_orders) > 0 
//            THEN ROUND((completed_orders / (completed_orders + canceled_orders)) * 100)
//            ELSE 0 
//          END
//          FROM vendors v2
//          WHERE v2.id = v.id
//        )
//        WHERE v.id = ?`,
//       [vendorId]
//     );
//     console.log(`   ✅ Updated success_rate`);

//     await db.query('COMMIT');
//     console.log(`✅ Vendor ${vendorId} stats updated successfully`);

//   } catch (error) {
//     await db.query('ROLLBACK');
//     console.error('❌ Vendor stats update error:', error);
//     throw error;
//   }
// }

// function hasServiceStarted(order) {
//   try {
//     if (order.service_started_date) return true;
//     if (order.time_slot && order.order_date) {
//       const orderDate = new Date(order.order_date);
//       const [startTimeStr] = order.time_slot.split('-');
//       const [hours, minutes] = startTimeStr.split(':').map(Number);
//       const serviceStartTime = new Date(orderDate);
//       serviceStartTime.setHours(hours, minutes, 0, 0);
//       return new Date() >= serviceStartTime;
//     }
//     return false;
//   } catch (error) {
//     return false;
//   }
// }

// // ============================================================
// // API ENDPOINTS
// // ============================================================

// // ---------- VENDOR ORDER ASSIGNMENT ----------
// app.patch('/orders/:orderId/assign', verifyToken(['admin', 'superadmin']), async (req, res) => {
//   const orderId = decodeURIComponent(req.params.orderId);
//   const { vendor_id, status } = req.body;

//   try {
//     const [orderRows] = await db.query(
//       'SELECT * FROM orders WHERE order_id = ?',
//       [orderId]
//     );

//     if (orderRows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found',
//         debug: { orderId: orderId }
//       });
//     }

//     const order = orderRows[0];
//     let vendorData = null;

//     if (vendor_id) {
//       const [vendorRows] = await db.query(
//         'SELECT * FROM vendors WHERE id = ? AND status = ?',
//         [vendor_id, 'active']
//       );

//       if (vendorRows.length === 0) {
//         return res.status(404).json({
//           success: false,
//           message: 'Vendor not found or not active'
//         });
//       }
//       vendorData = vendorRows[0];
//     }

//     const updateData = {
//       vendor_id: vendor_id || null,
//       status: vendor_id ? 'Active' : (status || 'Pending'),
//       assigned_date: vendor_id ? new Date() : null,
//       confirmed_date: vendor_id ? new Date() : null
//     };

//     if (!vendor_id && order.vendor_id) {
//       await db.query(
//         `UPDATE vendors 
//          SET pending_orders = GREATEST(0, pending_orders - 1),
//              updated_at = NOW()
//          WHERE id = ?`,
//         [order.vendor_id]
//       );
//       updateData.status = 'Pending';
//     }

//     await db.query(
//       'UPDATE orders SET ? WHERE order_id = ?',
//       [updateData, orderId]
//     );

//     if (vendor_id) {
//       await db.query(
//         `UPDATE vendors 
//          SET total_orders = total_orders + 1,
//              pending_orders = pending_orders + 1,
//              updated_at = NOW()
//          WHERE id = ?`,
//         [vendor_id]
//       );
//     }

//     await db.query(
//       `INSERT INTO order_history 
//        (order_id, status, action_by, action_type, details) 
//        VALUES (?, ?, ?, ?, ?)`,
//       [
//         orderId,
//         updateData.status,
//         req.user.id,
//         vendor_id ? 'vendor_assigned' : 'vendor_removed',
//         vendor_id
//           ? `Vendor ${vendorData?.name} assigned - Order set to Active`
//           : 'Vendor removed - Order set to Pending'
//       ]
//     );

//     res.json({
//       success: true,
//       message: vendor_id
//         ? 'Order assigned to vendor and set to Active'
//         : 'Vendor removed from order',
//       order: {
//         order_id: orderId,
//         status: updateData.status,
//         vendor_id: vendor_id,
//         vendor_data: vendorData,
//         assigned_date: updateData.assigned_date,
//         confirmed_date: updateData.confirmed_date
//       }
//     });

//   } catch (error) {
//     console.error('Order assignment error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to assign order',
//       error: error.message
//     });
//   }
// });

// // ---------- ORDER COMPLETION ----------
// app.patch('/orders/:orderId/complete', verifyToken(['admin', 'vendor', 'superadmin']), async (req, res) => {
//   const { orderId } = req.params;
//   const userRole = req.user.role;

//   try {
//     const [orderRows] = await db.query(
//       'SELECT * FROM orders WHERE order_id = ?',
//       [orderId]
//     );

//     if (orderRows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     const order = orderRows[0];

//     if (userRole === 'vendor' && order.vendor_id !== req.user.vendorId) {
//       return res.status(403).json({
//         success: false,
//         message: 'You can only complete your assigned orders'
//       });
//     }

//     await db.query(
//       `UPDATE orders 
//        SET status = 'Completed',
//            completed_date = NOW()
//        WHERE order_id = ?`,
//       [orderId]
//     );

//     if (order.vendor_id) {
//       await db.query(
//         `UPDATE vendors 
//          SET completed_orders = completed_orders + 1,
//              pending_orders = pending_orders - 1,
//              updated_at = NOW()
//          WHERE id = ?`,
//         [order.vendor_id]
//       );
//     }

//     res.json({
//       success: true,
//       message: 'Order marked as completed',
//       order: {
//         order_id: orderId,
//         status: 'Completed',
//         completed_date: new Date()
//       }
//     });
//   } catch (error) {
//     console.error('Order completion error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to complete order'
//     });
//   }
// });

// // ---------- VENDOR ORDERS ----------
// app.get('/api/vendor/orders', authenticateVendor, async (req, res) => {
//   try {
//     const vendorId = req.vendor.vendorId;

//     const [orders] = await db.query(
//       `SELECT 
//         o.order_id,
//         o.user_id,
//         o.order_date,
//         o.time_slot,
//         o.notes,
//         o.address_type,
//         o.home_address,
//         o.office_address,
//         o.temp_address,
//         o.recipient_name,
//         o.recipient_phone,
//         o.cart_items,
//         o.status,
//         o.cancel_reason,
//         o.service_expert,
//         o.assigned_date,
//         o.completed_date,
//         u.name AS customer_name,
//         u.email AS customer_email,
//         u.phone_number AS customer_phone
//       FROM orders o
//       LEFT JOIN users u ON o.user_id = u.custom_id
//       WHERE o.vendor_id = ?
//       ORDER BY o.order_date DESC`,
//       [vendorId]
//     );

//     const parsedOrders = orders.map(order => {
//       let parsedCart = [];
//       let parsedServiceExpert = null;
//       let parsedAddress = {};

//       try {
//         parsedCart = typeof order.cart_items === 'string'
//           ? JSON.parse(order.cart_items)
//           : order.cart_items;
//       } catch (e) {
//         console.error("Cart parse error:", order.cart_items);
//       }

//       try {
//         if (order.service_expert) {
//           parsedServiceExpert = typeof order.service_expert === 'string'
//             ? JSON.parse(order.service_expert)
//             : order.service_expert;
//         }
//       } catch (e) {
//         console.error("Service expert parse error:", order.service_expert);
//       }

//       let addressField = null;
//       if (order.address_type === 'home' && order.home_address) {
//         addressField = order.home_address;
//       } else if (order.address_type === 'office' && order.office_address) {
//         addressField = order.office_address;
//       } else if (order.address_type === 'another' && order.temp_address) {
//         addressField = order.temp_address;
//       }

//       try {
//         if (addressField) {
//           parsedAddress = typeof addressField === 'string'
//             ? JSON.parse(addressField)
//             : addressField;
//         }
//       } catch (e) {
//         console.error("Address parse error:", addressField);
//       }

//       const total = parsedCart.reduce((sum, item) =>
//         sum + (item.price * item.quantity), 0
//       );

//       return {
//         ...order,
//         cart_items: parsedCart,
//         service_expert: parsedServiceExpert,
//         address: parsedAddress,
//         total: total.toFixed(2)
//       };
//     });

//     res.json({
//       success: true,
//       orders: parsedOrders
//     });
//   } catch (error) {
//     console.error('Vendor orders error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch orders'
//     });
//   }
// });

// // ---------- ORDER REVIEW SUBMISSION ----------
// app.post('/orders/:orderId/review', authenticateJWT, async (req, res) => {
//   const { orderId } = req.params;
//   const { serviceExpert, websiteService, comments } = req.body;
//   const userId = req.user.userId;

//   try {
//     const [orderRows] = await db.query(
//       `SELECT * FROM orders 
//        WHERE order_id = ? AND user_id = ? AND status = 'Completed'`,
//       [orderId, userId]
//     );

//     if (orderRows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found or not completed'
//       });
//     }

//     const [existingReview] = await db.query(
//       'SELECT id FROM order_reviews WHERE order_id = ?',
//       [orderId]
//     );

//     if (existingReview.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Review already submitted for this order'
//       });
//     }

//     const reviewData = {
//       order_id: orderId,
//       user_id: userId,
//       service_expert_rating: serviceExpert || 5,
//       website_service_rating: websiteService || 5,
//       comments: comments || '',
//       created_at: new Date()
//     };

//     await db.query(
//       `INSERT INTO order_reviews 
//        (order_id, user_id, service_expert_rating, website_service_rating, comments, created_at) 
//        VALUES (?, ?, ?, ?, ?, ?)`,
//       [
//         reviewData.order_id,
//         reviewData.user_id,
//         reviewData.service_expert_rating,
//         reviewData.website_service_rating,
//         reviewData.comments,
//         reviewData.created_at
//       ]
//     );

//     const reviewSummary = {
//       serviceExpert: reviewData.service_expert_rating,
//       websiteService: reviewData.website_service_rating,
//       comments: reviewData.comments,
//       reviewedAt: reviewData.created_at
//     };

//     await db.query(
//       'UPDATE orders SET reviews = ? WHERE order_id = ?',
//       [JSON.stringify(reviewSummary), orderId]
//     );

//     res.json({
//       success: true,
//       message: 'Review submitted successfully',
//       review: reviewData
//     });
//   } catch (error) {
//     console.error('Review submission error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to submit review'
//     });
//   }
// });

// // ---------- GET ORDER REVIEWS ----------
// app.get('/orders/:orderId/reviews', async (req, res) => {
//   const { orderId } = req.params;

//   try {
//     const [reviews] = await db.query(
//       `SELECT 
//         r.*,
//         u.name as user_name,
//         u.photo as user_photo
//        FROM order_reviews r
//        LEFT JOIN users u ON r.user_id = u.custom_id
//        WHERE r.order_id = ?
//        ORDER BY r.created_at DESC`,
//       [orderId]
//     );

//     if (reviews.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'No reviews found for this order'
//       });
//     }

//     res.json({
//       success: true,
//       reviews: reviews.map(review => ({
//         id: review.id,
//         order_id: review.order_id,
//         user_name: review.user_name,
//         user_photo: review.user_photo,
//         service_expert_rating: review.service_expert_rating,
//         website_service_rating: review.website_service_rating,
//         comments: review.comments,
//         created_at: review.created_at
//       }))
//     });
//   } catch (error) {
//     console.error('Get reviews error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch reviews'
//     });
//   }
// });

// // ---------- ORDER TRACKING ----------
// app.get('/orders/:orderId/tracking', authenticateJWT, async (req, res) => {
//   const { orderId } = req.params;
//   const userId = req.user.userId;

//   try {
//     const [orderRows] = await db.query(
//       `SELECT 
//         o.*,
//         u.name as customer_name,
//         u.email as customer_email,
//         u.phone_number as customer_phone,
//         v.name as vendor_name,
//         v.email as vendor_email,
//         v.phone_number as vendor_phone,
//         v.vendor_photo as vendor_photo
//        FROM orders o
//        LEFT JOIN users u ON o.user_id = u.custom_id
//        LEFT JOIN vendors v ON o.vendor_id = v.id
//        WHERE o.order_id = ? AND o.user_id = ?`,
//       [orderId, userId]
//     );

//     if (orderRows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     const order = orderRows[0];

//     let parsedCart = [];
//     let parsedServiceExpert = null;
//     let parsedAddress = {};
//     let parsedReviews = null;

//     try {
//       parsedCart = typeof order.cart_items === 'string'
//         ? JSON.parse(order.cart_items)
//         : order.cart_items;
//     } catch (e) {
//       console.error("Cart parse error:", e);
//     }

//     try {
//       if (order.service_expert) {
//         parsedServiceExpert = typeof order.service_expert === 'string'
//           ? JSON.parse(order.service_expert)
//           : order.service_expert;
//       }
//     } catch (e) {
//       console.error("Service expert parse error:", e);
//     }

//     try {
//       if (order.reviews) {
//         parsedReviews = typeof order.reviews === 'string'
//           ? JSON.parse(order.reviews)
//           : order.reviews;
//       }
//     } catch (e) {
//       console.error("Reviews parse error:", e);
//     }

//     let addressField = null;
//     if (order.address_type === 'home' && order.home_address) {
//       addressField = order.home_address;
//     } else if (order.address_type === 'office' && order.office_address) {
//       addressField = order.office_address;
//     } else if (order.address_type === 'another' && order.temp_address) {
//       addressField = order.temp_address;
//     }

//     try {
//       if (addressField) {
//         parsedAddress = typeof addressField === 'string'
//           ? JSON.parse(addressField)
//           : addressField;
//       }
//     } catch (e) {
//       console.error("Address parse error:", e);
//     }

//     const total = parsedCart.reduce((sum, item) =>
//       sum + (item.price * item.quantity), 0
//     );

//     const timeline = [
//       {
//         status: 'Order Placed',
//         time: order.order_date,
//         description: 'Order has been placed successfully',
//         completed: true
//       },
//       {
//         status: 'Order Confirmed',
//         time: order.confirmed_date || null,
//         description: 'Order has been confirmed',
//         completed: !!order.confirmed_date
//       },
//       {
//         status: 'Vendor Assigned',
//         time: order.assigned_date || null,
//         description: order.vendor_name ? `Assigned to ${order.vendor_name}` : 'Waiting for vendor assignment',
//         completed: !!order.assigned_date
//       },
//       {
//         status: 'Service In Progress',
//         time: order.in_progress_date || null,
//         description: 'Service expert is on the way',
//         completed: order.status === 'Active' || order.status === 'Completed'
//       },
//       {
//         status: 'Completed',
//         time: order.completed_date || null,
//         description: 'Service has been completed',
//         completed: order.status === 'Completed'
//       }
//     ];

//     res.json({
//       success: true,
//       order: {
//         order_id: order.order_id,
//         status: order.status,
//         timeline: timeline,
//         customer: {
//           name: order.customer_name,
//           email: order.customer_email,
//           phone: order.customer_phone
//         },
//         vendor: order.vendor_id ? {
//           name: order.vendor_name,
//           email: order.vendor_email,
//           phone: order.vendor_phone,
//           photo: order.vendor_photo
//         } : null,
//         service_expert: parsedServiceExpert,
//         address: parsedAddress,
//         cart_items: parsedCart,
//         total: total.toFixed(2),
//         reviews: parsedReviews,
//         time_slot: order.time_slot,
//         notes: order.notes || '',
//         cancel_reason: order.cancel_reason || null
//       }
//     });
//   } catch (error) {
//     console.error('Tracking error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch tracking information'
//     });
//   }
// });

// // ---------- VERIFY RESET TOKEN ----------
// app.post('/api/verify-reset-token', async (req, res) => {
//   const { token, email } = req.body;

//   if (!token || !email) {
//     return res.status(400).json({
//       success: false,
//       message: 'Token and email are required'
//     });
//   }

//   try {
//     const [users] = await db.query(
//       "SELECT email FROM users WHERE reset_token = ? AND email = ? AND reset_token_expiry > NOW()",
//       [token, email]
//     );

//     const [vendors] = await db.query(
//       "SELECT email FROM vendors WHERE reset_token = ? AND email = ? AND reset_token_expiry > NOW()",
//       [token, email]
//     );

//     const isValid = users.length > 0 || vendors.length > 0;

//     if (!isValid) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid or expired token'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Token is valid'
//     });
//   } catch (error) {
//     console.error('Token verification error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Token verification failed'
//     });
//   }
// });

// // ---------- RESET PASSWORD ----------
// app.post('/api/reset-password', async (req, res) => {
//   const { token, email, newPassword } = req.body;

//   if (!token || !email || !newPassword) {
//     return res.status(400).json({
//       success: false,
//       message: 'All fields are required'
//     });
//   }

//   if (newPassword.length < 6) {
//     return res.status(400).json({
//       success: false,
//       message: 'Password must be at least 6 characters'
//     });
//   }

//   try {
//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     const [users] = await db.query(
//       "SELECT * FROM users WHERE reset_token = ? AND email = ? AND reset_token_expiry > NOW()",
//       [token, email]
//     );

//     const [vendors] = await db.query(
//       "SELECT * FROM vendors WHERE reset_token = ? AND email = ? AND reset_token_expiry > NOW()",
//       [token, email]
//     );

//     let userType = null;

//     if (users.length > 0) {
//       userType = 'user';
//     } else if (vendors.length > 0) {
//       userType = 'vendor';
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid or expired token'
//       });
//     }

//     if (userType === 'user') {
//       await db.query(
//         "UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE email = ?",
//         [hashedPassword, email]
//       );
//     } else if (userType === 'vendor') {
//       await db.query(
//         "UPDATE vendors SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE email = ?",
//         [hashedPassword, email]
//       );
//     }

//     res.json({
//       success: true,
//       message: 'Password reset successfully'
//     });
//   } catch (error) {
//     console.error('Password reset error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Password reset failed'
//     });
//   }
// });

// // ---------- FILTER ORDERS ----------
// app.get('/orders/filter', authenticateJWT, async (req, res) => {
//   const userId = req.user.userId;
//   const { status, dateFrom, dateTo, search } = req.query;

//   try {
//     let query = `
//       SELECT * FROM orders 
//       WHERE user_id = ?
//     `;
//     const params = [userId];

//     if (status && status !== 'all') {
//       if (status === 'active') {
//         query += ` AND status NOT IN ('Pending', 'Cancelled', 'Completed')`;
//       } else {
//         query += ` AND status = ?`;
//         params.push(status);
//       }
//     }

//     if (dateFrom) {
//       query += ` AND order_date >= ?`;
//       params.push(dateFrom);
//     }
//     if (dateTo) {
//       query += ` AND order_date <= ?`;
//       params.push(dateTo);
//     }

//     if (search) {
//       query += ` AND (order_id LIKE ? OR status LIKE ? OR notes LIKE ?)`;
//       const searchParam = `%${search}%`;
//       params.push(searchParam, searchParam, searchParam);
//     }

//     query += ` ORDER BY order_date DESC`;

//     const [orders] = await db.query(query, params);

//     const parsedOrders = orders.map(order => {
//       let parsedCart = [];
//       let parsedServiceExpert = null;
//       let parsedAddress = {};

//       try {
//         parsedCart = typeof order.cart_items === 'string'
//           ? JSON.parse(order.cart_items)
//           : order.cart_items;
//       } catch (e) {
//         console.error("Cart parse error:", e);
//       }

//       try {
//         if (order.service_expert) {
//           parsedServiceExpert = typeof order.service_expert === 'string'
//             ? JSON.parse(order.service_expert)
//             : order.service_expert;
//         }
//       } catch (e) {
//         console.error("Service expert parse error:", e);
//       }

//       let addressField = null;
//       if (order.address_type === 'home' && order.home_address) {
//         addressField = order.home_address;
//       } else if (order.address_type === 'office' && order.office_address) {
//         addressField = order.office_address;
//       } else if (order.address_type === 'another' && order.temp_address) {
//         addressField = order.temp_address;
//       }

//       try {
//         if (addressField) {
//           parsedAddress = typeof addressField === 'string'
//             ? JSON.parse(addressField)
//             : addressField;
//         }
//       } catch (e) {
//         console.error("Address parse error:", e);
//       }

//       const total = parsedCart.reduce((sum, item) =>
//         sum + (item.price * item.quantity), 0
//       );

//       return {
//         ...order,
//         cart_items: parsedCart,
//         service_expert: parsedServiceExpert,
//         address: parsedAddress,
//         total: total.toFixed(2)
//       };
//     });

//     res.json({
//       success: true,
//       orders: parsedOrders,
//       count: parsedOrders.length
//     });
//   } catch (error) {
//     console.error('Filter orders error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to filter orders'
//     });
//   }
// });

// // ---------- ORDER CONFIRMATION ----------
// app.patch('/orders/:orderId/confirm', verifyToken(['admin', 'superadmin']), async (req, res) => {
//   const { orderId } = req.params;

//   try {
//     const [orderRows] = await db.query(
//       'SELECT * FROM orders WHERE order_id = ?',
//       [orderId]
//     );

//     if (orderRows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     const order = orderRows[0];

//     if (order.status !== 'Pending') {
//       return res.status(400).json({
//         success: false,
//         message: 'Order is not in Pending status'
//       });
//     }

//     await db.query(
//       `UPDATE orders 
//        SET status = 'Active',
//            confirmed_date = NOW()
//        WHERE order_id = ?`,
//       [orderId]
//     );

//     res.json({
//       success: true,
//       message: 'Order confirmed successfully',
//       order: {
//         order_id: orderId,
//         status: 'Active',
//         confirmed_date: new Date()
//       }
//     });
//   } catch (error) {
//     console.error('Order confirmation error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to confirm order'
//     });
//   }
// });

// // ---------- GET VENDOR DETAILS ----------
// app.get('/api/vendors/:vendorId', verifyToken(['admin', 'superadmin', 'user']), async (req, res) => {
//   const vendorId = req.params.vendorId;

//   try {
//     const [columns] = await db.query(`
//       SELECT COLUMN_NAME 
//       FROM INFORMATION_SCHEMA.COLUMNS 
//       WHERE TABLE_NAME = 'vendors' 
//       AND TABLE_SCHEMA = DATABASE()
//     `);

//     const availableColumns = columns.map(col => col.COLUMN_NAME);
//     console.log('Available columns:', availableColumns);

//     const desiredColumns = [
//       'id', 'name', 'email', 'phone_number',
//       'dob', 'nid_number', 'company_name', 'permanent_address',
//       'present_address', 'business_address', 'technician_quantity',
//       'vendor_photo', 'service_areas', 'services', 'rating', 
//       'completed_orders', 'pending_orders', 'canceled_orders',
//       'specialization', 'vehicle_type', 'working_hours', 'location',
//       'service_radius', 'verified', 'status', 'created_at',
//       'total_orders', 'active_orders', 'hold_orders', 'success_rate',
//       'average_rating', 'wallet_balance'
//     ];

//     const columnsToSelect = desiredColumns.filter(col => availableColumns.includes(col));

//     if (columnsToSelect.length === 0) {
//       columnsToSelect.push('id', 'name', 'email', 'phone_number', 'rating', 'created_at');
//     }

//     const selectQuery = `
//       SELECT ${columnsToSelect.join(', ')}
//       FROM vendors 
//       WHERE id = ?
//     `;

//     const [vendorRows] = await db.query(selectQuery, [vendorId]);

//     if (vendorRows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Vendor not found'
//       });
//     }

//     const vendor = vendorRows[0];

//     try {
//       if (vendor.service_areas && typeof vendor.service_areas === 'string') {
//         vendor.service_areas = JSON.parse(vendor.service_areas);
//       }
//       if (vendor.services && typeof vendor.services === 'string') {
//         vendor.services = JSON.parse(vendor.services);
//       }
//     } catch (parseError) {
//       console.error('Error parsing JSON fields:', parseError);
//       vendor.service_areas = [];
//       vendor.services = [];
//     }

//     const completed = vendor.completed_orders || 0;
//     const canceled = vendor.canceled_orders || 0;

//     if (completed > 0) {
//       const totalOrders = completed + canceled;
//       vendor.success_rate = Math.round((completed / totalOrders) * 100);
//     } else {
//       vendor.success_rate = 0;
//     }

//     vendor.avg_rating = vendor.rating || 4.5;

//     if (vendor.dob) {
//       const dobDate = new Date(vendor.dob);
//       const currentDate = new Date();
//       let yearsDiff = currentDate.getFullYear() - dobDate.getFullYear();

//       const monthDiff = currentDate.getMonth() - dobDate.getMonth();
//       if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < dobDate.getDate())) {
//         yearsDiff--;
//       }

//       vendor.experience_years = Math.max(1, yearsDiff - 18);
//     } else {
//       const createdDate = new Date(vendor.created_at);
//       const currentDate = new Date();
//       const yearsDiff = currentDate.getFullYear() - createdDate.getFullYear();
//       vendor.experience_years = Math.max(1, yearsDiff);
//     }

//     vendor.total_reviews = Math.floor(vendor.completed_orders * 0.7) || 25;

//     if (!vendor.specialization) {
//       if (vendor.services && vendor.services.length > 0) {
//         vendor.specialization = vendor.services[0];
//       } else {
//         vendor.specialization = 'General Services';
//       }
//     }

//     if (!vendor.vehicle_type) vendor.vehicle_type = 'Motorcycle';
//     if (!vendor.working_hours) vendor.working_hours = '9:00 AM - 6:00 PM';
//     if (!vendor.location) {
//       if (vendor.service_areas) {
//         vendor.location = vendor.service_areas;
//       } else if (vendor.permanent_address) {
//         vendor.location = vendor.permanent_address;
//       } else {
//         vendor.location = 'Location not specified';
//       }
//     }
//     if (!vendor.service_radius) vendor.service_radius = 10;
//     if (vendor.verified === undefined || vendor.verified === null) vendor.verified = true;

//     vendor.photo = vendor.vendor_photo || null;

//     delete vendor.password;
//     if (vendor.hashedPassword) delete vendor.hashedPassword;

//     res.json({
//       success: true,
//       vendor: vendor
//     });

//   } catch (error) {
//     console.error('Fetch vendor error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch vendor details',
//       error: error.message
//     });
//   }
// });

// // ---------- REPORT ISSUE ----------
// app.post('/orders/:orderId/report', verifyToken(['user', 'admin']), async (req, res) => {
//   const orderId = decodeURIComponent(req.params.orderId);
//   const userId = req.user.id;

//   try {
//     const [orderRows] = await db.query(
//       'SELECT * FROM orders WHERE order_id = ?',
//       [orderId]
//     );

//     if (orderRows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     const order = orderRows[0];

//     if (order.user_id !== userId && req.user.role !== 'admin' && req.user.role !== 'superadmin') {
//       return res.status(403).json({
//         success: false,
//         message: 'You can only report issues for your own orders'
//       });
//     }

//     let fileUrl = null;
//     if (req.files && req.files.file) {
//       const file = req.files.file;
//       const fileName = `${Date.now()}_${file.name}`;
//       const uploadPath = path.join(__dirname, 'uploads', 'reports', fileName);

//       const dirPath = path.join(__dirname, 'uploads', 'reports');
//       if (!fs.existsSync(dirPath)) {
//         fs.mkdirSync(dirPath, { recursive: true });
//       }

//       await file.mv(uploadPath);
//       fileUrl = `/uploads/reports/${fileName}`;
//     }

//     const [result] = await db.query(
//       `INSERT INTO order_reports 
//        (order_id, user_id, description, file_url, status, created_at) 
//        VALUES (?, ?, ?, ?, ?, NOW())`,
//       [orderId, userId, req.body.description, fileUrl, 'pending']
//     );

//     await db.query(
//       `UPDATE orders 
//        SET notes = CONCAT(IFNULL(notes, ''), '\n[${new Date().toLocaleString()}]: Issue reported - ${req.body.description}')
//        WHERE order_id = ?`,
//       [orderId]
//     );

//     res.json({
//       success: true,
//       message: 'Issue reported successfully',
//       reportId: result.insertId
//     });

//   } catch (error) {
//     console.error('Report error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to submit report'
//     });
//   }
// });

// // ---------- USER PROFILE UPDATE ----------
// app.put(
//   "/api/user-profile",
//   authenticateJWT,
//   uploadProfile.single("photo"),
//   async (req, res) => {
//     const userId = req.user.userId;

//     try {
//       const { name, phone_number } = req.body;

//       if (!name || name.trim() === '') {
//         return res.status(400).json({
//           success: false,
//           message: "Name is required"
//         });
//       }

//       let home_address = {};
//       let office_address = {};

//       try {
//         home_address =
//           typeof req.body.home_address === "string"
//             ? JSON.parse(req.body.home_address)
//             : req.body.home_address || {};

//         office_address =
//           typeof req.body.office_address === "string"
//             ? JSON.parse(req.body.office_address)
//             : req.body.office_address || {};
//       } catch (parseError) {
//         console.error("Address parsing error:", parseError);
//       }

//       const updateFields = {
//         name: name.trim(),
//         phone_number: phone_number || null,
//         home_address: JSON.stringify(home_address),
//         office_address: JSON.stringify(office_address),
//       };

//       if (req.file) {
//         const photoPath = `/uploads/profiles/${req.file.filename}`;
//         updateFields.photo = photoPath;
//       }

//       Object.keys(updateFields).forEach(key => {
//         if (updateFields[key] === undefined) {
//           delete updateFields[key];
//         }
//       });

//       await db.query("UPDATE users SET ? WHERE custom_id = ?", [
//         updateFields,
//         userId,
//       ]);

//       const [updated] = await db.query(
//         "SELECT * FROM users WHERE custom_id = ?",
//         [userId]
//       );

//       if (!updated || updated.length === 0) {
//         return res.status(404).json({
//           success: false,
//           message: "User not found",
//         });
//       }

//       const updatedUser = updated[0];

//       const responseUser = {
//         ...updatedUser,
//         home_address:
//           typeof updatedUser.home_address === "string"
//             ? JSON.parse(updatedUser.home_address)
//             : updatedUser.home_address || {},
//         office_address:
//           typeof updatedUser.office_address === "string"
//             ? JSON.parse(updatedUser.office_address)
//             : updatedUser.office_address || {},
//       };

//       res.json({
//         success: true,
//         user: responseUser,
//       });
//     } catch (err) {
//       console.error("Profile update error:", err);
//       res.status(500).json({
//         success: false,
//         message: "Error updating profile",
//         error:
//           process.env.NODE_ENV === "development" ? err.message : undefined,
//       });
//     }
//   }
// );

// // ---------- USER REGISTRATION ----------
// app.post("/api/register", async (req, res) => {
//   const { firstName, email, phoneNumber, password } = req.body;

//   if (!firstName || !email || !phoneNumber || !password) {
//     return res.status(400).json({ success: false, message: "All fields are required" });
//   }

//   try {
//     const [duplicateCheck] = await db.query(
//       "SELECT * FROM users WHERE email = ? OR phone_number = ?",
//       [email, phoneNumber]
//     );

//     if (duplicateCheck.length > 0) {
//       return res.status(400).json({ success: false, message: "Email or phone number already registered" });
//     }

//     const currentDate = new Date();
//     const year = currentDate.getFullYear().toString().slice(-2);
//     const month = currentDate.getMonth() + 1;
//     const day = currentDate.getDate();
//     const datePrefix = `${year}${month}${day}`;

//     const [maxIdResult] = await db.query(
//       "SELECT MAX(CAST(SUBSTRING(custom_id, 6) AS UNSIGNED)) as maxSerial FROM users"
//     );
//     const nextSerial = (maxIdResult[0].maxSerial || 0) + 1;
//     const customId = `${datePrefix}${nextSerial}`;

//     const hashedPassword = await bcrypt.hash(password, 10);

//     await db.query(
//       "INSERT INTO users (custom_id, name, email, phone_number, password, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
//       [customId, firstName, email, phoneNumber, hashedPassword]
//     );

//     res.status(200).json({ success: true, message: "Registration successful!", customId });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Registration error" });
//   }
// });

// // ---------- LOGIN ----------
// app.post("/api/login", async (req, res) => {
//   const { email, password } = req.body;

//   console.log(`🔐 Login attempt for: ${email}`);

//   try {
//     const [superRows] = await db.query("SELECT * FROM superadmins WHERE email = ?", [email]);
//     const superUser = superRows[0];
//     if (superUser && await bcrypt.compare(password, superUser.password)) {
//       const token = jwt.sign({ id: superUser.id, role: "superadmin" }, process.env.JWT_SECRET, { expiresIn: "8h" });
//       return res.json({
//         success: true,
//         role: "superadmin",
//         token,
//         user: {
//           id: superUser.id,
//           email: superUser.email,
//           name: "Super Admin"
//         }
//       });
//     }

//     const [adminRows] = await db.query("SELECT * FROM admins WHERE email = ? AND verified = 1", [email]);
//     const admin = adminRows[0];
//     if (admin && await bcrypt.compare(password, admin.password)) {
//       const token = jwt.sign({ id: admin.id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "8h" });
//       return res.json({
//         success: true,
//         role: "admin",
//         token,
//         user: {
//           id: admin.id,
//           email: admin.email,
//           name: "Admin"
//         }
//       });
//     }

//     const [userRows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
//     const user = userRows[0];
//     if (user && await bcrypt.compare(password, user.password)) {
//       const token = jwt.sign({ userId: user.custom_id, role: "user" }, process.env.JWT_SECRET, { expiresIn: "8h" });

//       return res.json({
//         success: true,
//         role: "user",
//         token,
//         user: {
//           id: user.custom_id,
//           email: user.email,
//           name: user.name,
//           photo: user.photo,
//         }
//       });
//     }

//     const [vendorRows] = await db.query("SELECT * FROM vendors WHERE email = ?", [email]);
//     const vendor = vendorRows[0];
//     if (vendor && await bcrypt.compare(password, vendor.password)) {
//       if (vendor.status !== 'active') {
//         return res.status(403).json({
//           success: false,
//           message: "Your vendor account is pending approval"
//         });
//       }

//       const token = jwt.sign({
//         id: vendor.id,
//         role: "vendor",
//         email: vendor.email
//       }, process.env.JWT_SECRET, { expiresIn: "8h" });

//       return res.json({
//         success: true,
//         role: "vendor",
//         token,
//         user: {
//           id: vendor.id,
//           name: vendor.name,
//           email: vendor.email,
//           phone: vendor.phone_number,
//           profileImage: vendor.vendor_photo,
//           status: vendor.status
//         }
//       });
//     }

//     const [technicianRows] = await db.query("SELECT * FROM technicians WHERE email = ?", [email]);
//     const technician = technicianRows[0];
//     if (technician && await bcrypt.compare(password, technician.password)) {
//       if (technician.status !== 'active') {
//         return res.status(403).json({
//           success: false,
//           message: "Your technician account is pending approval"
//         });
//       }

//       const token = jwt.sign({
//         id: technician.id,
//         role: "technician",
//         email: technician.email
//       }, process.env.JWT_SECRET, { expiresIn: "8h" });

//       return res.json({
//         success: true,
//         role: "technician",
//         token,
//         user: {
//           id: technician.id,
//           name: technician.name,
//           email: technician.email,
//           phone: technician.phone_number,
//           profileImage: technician.photo,
//           status: technician.status,
//           vendor_id: technician.vendor_id
//         }
//       });
//     }

//     console.log(`❌ No user found with email: ${email}`);
//     return res.status(401).json({
//       success: false,
//       message: "Invalid email or password"
//     });

//   } catch (error) {
//     console.error("Login error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Login failed. Please try again later."
//     });
//   }
// });

// // ---------- VERIFY JWT TOKEN ----------
// app.post("/api/auth/verify", authenticateJWT, async (req, res) => {
//   const userId = req.user.userId;
//   try {
//     const [result] = await db.query("SELECT name, email FROM users WHERE custom_id = ?", [userId]);
//     if (result.length === 0) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }
//     res.status(200).json({ success: true, user: result[0] });
//   } catch (err) {
//     console.error("Auth verify error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// // ---------- GET USER PROFILE ----------
// app.get("/api/user-profile", authenticateJWT, async (req, res) => {
//   const userId = req.user.userId;
//   console.log("Authenticated userId:", userId);

//   try {
//     const [rows] = await db.query("SELECT * FROM users WHERE custom_id = ?", [userId]);
//     if (rows.length === 0) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     const user = rows[0];
//     const parsedUser = {
//       ...user,
//       home_address: typeof user.home_address === "string" ? JSON.parse(user.home_address) : {},
//       office_address: typeof user.office_address === "string" ? JSON.parse(user.office_address) : {},
//     };

//     res.json({ success: true, user: parsedUser });
//   } catch (err) {
//     console.error("Fetch profile error:", err);
//     res.status(500).json({ success: false, message: "Failed to fetch profile" });
//   }
// });

// // ---------- PLACE ORDER ----------
// app.post("/api/place-order", authenticateJWT, async (req, res) => {
//   const userId = req.user.userId;
//   const {
//     category,
//     cart,
//     selectedDate,
//     selectedSlot,
//     notes,
//     addressType,
//     address,
//     home_address,
//     office_address,
//     temp_address,
//     recipientName,
//     recipientPhone
//   } = req.body;

//   let finalAddress = address;

//   if (!finalAddress) {
//     if (addressType === 'home' && home_address) finalAddress = home_address;
//     else if (addressType === 'office' && office_address) finalAddress = office_address;
//     else if (addressType === 'another' && temp_address) finalAddress = temp_address;
//   }

//   if (!category || !cart || cart.length === 0 || !addressType || !finalAddress) {
//     return res.status(400).json({ success: false, message: "Required fields missing" });
//   }

//   try {
//     const generateRandomNumber = () => Math.floor(1000 + Math.random() * 9000);
//     const orderId = `#${category}${generateRandomNumber()}`;

//     let homeAddress = null;
//     let officeAddress = null;
//     let tempAddress = null;

//     if (addressType === 'home') homeAddress = typeof finalAddress === 'string' ? JSON.parse(finalAddress) : finalAddress;
//     if (addressType === 'office') officeAddress = typeof finalAddress === 'string' ? JSON.parse(finalAddress) : finalAddress;
//     if (addressType === 'another') tempAddress = typeof finalAddress === 'string' ? JSON.parse(finalAddress) : finalAddress;

//     await db.query(
//       `INSERT INTO orders 
//         (order_id, user_id, order_date, time_slot, notes, 
//          address_type, home_address, office_address, temp_address, 
//          recipient_name, recipient_phone, 
//          cart_items, status) 
//        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`,
//       [
//         orderId,
//         userId,
//         selectedDate,
//         selectedSlot,
//         notes || "",
//         addressType,
//         JSON.stringify(homeAddress),
//         JSON.stringify(officeAddress),
//         JSON.stringify(tempAddress),
//         recipientName || null,
//         recipientPhone || null,
//         JSON.stringify(cart),
//       ]
//     );

//     res.status(200).json({ success: true, message: "Order placed successfully", orderId });
//   } catch (error) {
//     console.error("Order error:", error);
//     res.status(500).json({ success: false, message: "Failed to place order" });
//   }
// });

// // ---------- GET USER ORDERS ----------
// app.get("/orders", authenticateJWT, async (req, res) => {
//   const userId = req.user.userId;

//   try {
//     const [orders] = await db.query(
//       "SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC",
//       [userId]
//     );

//     const parsedOrders = orders.map(order => {
//       let parsedCart = [];
//       try {
//         parsedCart = typeof order.cart_items === 'string'
//           ? JSON.parse(order.cart_items)
//           : order.cart_items;
//       } catch (e) {
//         console.error("Cart parse error:", e);
//       }

//       let parsedServiceExpert = null;
//       try {
//         if (order.service_expert) {
//           parsedServiceExpert = typeof order.service_expert === 'string'
//             ? JSON.parse(order.service_expert)
//             : order.service_expert;
//         }
//       } catch (e) {
//         console.error("Service expert parse error:", e);
//       }

//       let parsedReviews = null;
//       try {
//         if (order.reviews) {
//           parsedReviews = typeof order.reviews === 'string'
//             ? JSON.parse(order.reviews)
//             : order.reviews;
//         }
//       } catch (e) {
//         console.error("Reviews parse error:", e);
//       }

//       let homeAddress = null;
//       let officeAddress = null;
//       let tempAddress = null;

//       try {
//         if (order.home_address && order.home_address !== "null") {
//           homeAddress = typeof order.home_address === 'string'
//             ? JSON.parse(order.home_address)
//             : order.home_address;
//         }
//         if (order.office_address && order.office_address !== "null") {
//           officeAddress = typeof order.office_address === 'string'
//             ? JSON.parse(order.office_address)
//             : order.office_address;
//         }
//         if (order.temp_address && order.temp_address !== "null") {
//           tempAddress = typeof order.temp_address === 'string'
//             ? JSON.parse(order.temp_address)
//             : order.temp_address;
//         }
//       } catch (e) {
//         console.error("Address parse error:", e);
//       }

//       let primaryAddress = null;
//       let addressType = order.address_type || 'home';

//       if (addressType === 'home' && homeAddress) primaryAddress = homeAddress;
//       else if (addressType === 'office' && officeAddress) primaryAddress = officeAddress;
//       else if (addressType === 'another' && tempAddress) primaryAddress = tempAddress;

//       let fullAddress = "";
//       if (primaryAddress) {
//         const parts = [];
//         if (primaryAddress.addressLine1) parts.push(primaryAddress.addressLine1);
//         if (primaryAddress.addressLine2) parts.push(primaryAddress.addressLine2);
//         if (primaryAddress.areaName) parts.push(primaryAddress.areaName);
//         if (primaryAddress.city) parts.push(primaryAddress.city);
//         if (primaryAddress.landmark) parts.push(`Near ${primaryAddress.landmark}`);
//         fullAddress = parts.join(", ");
//       }

//       return {
//         ...order,
//         cart_items: parsedCart,
//         service_expert: parsedServiceExpert,
//         reviews: parsedReviews,
//         home_address: homeAddress,
//         office_address: officeAddress,
//         temp_address: tempAddress,
//         address: primaryAddress,
//         full_address: fullAddress
//       };
//     });

//     res.status(200).json({ success: true, orders: parsedOrders });
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     res.status(500).json({ success: false, message: "Failed to fetch orders" });
//   }
// });

// // ---------- VERIFY ROLE ----------
// app.get('/api/auth/verify-role', verifyToken(), (req, res) => {
//   const requiredRoles = req.query.requiredRole?.split(",") || [];
//   const userRole = req.user.role;

//   if (userRole === 'superadmin') {
//     return res.json({
//       success: true,
//       isValid: true,
//       user: req.user
//     });
//   }

//   if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
//     return res.status(403).json({
//       success: false,
//       isValid: false,
//       message: `Requires one of these roles: ${requiredRoles.join(', ')}`
//     });
//   }

//   res.json({
//     success: true,
//     isValid: true,
//     user: req.user
//   });
// });

// // ---------- SUPER ADMIN REGISTRATION ----------
// app.post("/api/superadmin/register", async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({
//       success: false,
//       message: "Email and password are required"
//     });
//   }

//   if (!validator.isEmail(email)) {
//     return res.status(400).json({
//       success: false,
//       message: "Invalid email format"
//     });
//   }

//   if (!validator.isStrongPassword(password)) {
//     return res.status(400).json({
//       success: false,
//       message: "Password must be at least 8 chars with uppercase, lowercase, number and symbol"
//     });
//   }

//   try {
//     const hashed = await bcrypt.hash(password, 12);
//     const [exists] = await db.query(
//       "SELECT id FROM superadmins LIMIT 1"
//     );

//     if (exists.length) {
//       return res.status(403).json({
//         success: false,
//         message: "Super Admin already exists"
//       });
//     }

//     await db.query(
//       "INSERT INTO superadmins (email, password) VALUES (?, ?)",
//       [email, hashed]
//     );

//     res.json({
//       success: true,
//       message: "Super Admin registered successfully",
//     });
//   } catch (error) {
//     console.error("Registration Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Registration failed",
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// // ---------- SUPER ADMIN LOGIN ----------
// const loginLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 5,
//   message: "Too many login attempts, please try again later"
// });

// app.post("/api/superadmin/login", loginLimiter, async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const [rows] = await db.query(
//       "SELECT * FROM superadmins WHERE email = ?",
//       [email]
//     );
//     const user = rows[0];

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid credentials"
//       });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid credentials"
//       });
//     }

//     const token = jwt.sign(
//       {
//         id: user.id,
//         role: "superadmin",
//         email: user.email
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "8h" }
//     );

//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'strict',
//       maxAge: 8 * 60 * 60 * 1000
//     }).json({
//       success: true,
//       user: {
//         id: user.id,
//         email: user.email,
//         role: "superadmin"
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Login failed"
//     });
//   }
// });

// // ---------- ADMIN CREATION ----------
// app.post("/api/admin/create",
//   verifyToken(["superadmin"]),
//   async (req, res) => {
//     const { email, password } = req.body;

//     try {
//       const [exists] = await db.query(
//         "SELECT id FROM admins WHERE email = ?",
//         [email]
//       );

//       if (exists.length) {
//         return res.status(409).json({
//           success: false,
//           message: "Admin already exists"
//         });
//       }

//       const hashed = await bcrypt.hash(password, 12);
//       await db.query(
//         "INSERT INTO admins (email, password, created_by) VALUES (?, ?, ?)",
//         [email, hashed, req.user.id]
//       );

//       res.json({
//         success: true,
//         message: "Admin created successfully",
//         admin: { email }
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: "Admin creation failed"
//       });
//     }
//   }
// );

// // ---------- ADMIN ALL ORDERS ----------
// app.get("/api/admin/all-orders", verifyToken(["admin", "superadmin"]), async (req, res) => {
//   try {
//     const [orders] = await db.query(`
//       SELECT 
//         o.order_id,
//         o.user_id,
//         o.order_date,
//         o.time_slot,
//         o.notes,
//         o.address_type,
//         o.home_address,
//         o.office_address,
//         o.temp_address,
//         o.recipient_name,
//         o.recipient_phone,
//         o.cart_items,
//         o.status,
//         o.cancel_reason,
//         o.cancelled_at,
//         o.vendor_id,
//         o.service_expert,
//         o.reviews,
//         o.assigned_date,
//         o.completed_date,
//         o.confirmed_date,
//         u.name AS customer_name,
//         u.email AS customer_email,
//         u.phone_number AS customer_phone,
//         v.name AS vendor_name,
//         v.email AS vendor_email
//       FROM orders o
//       LEFT JOIN users u ON o.user_id = u.custom_id
//       LEFT JOIN vendors v ON o.vendor_id = v.id
//       ORDER BY o.order_date DESC
//     `);

//     const ordersWithDetails = orders.map(order => {
//       let total = 0;
//       let parsedCart = [];
//       let parsedAddress = {};
//       let parsedServiceExpert = null;
//       let parsedReviews = null;

//       try {
//         parsedCart = typeof order.cart_items === 'string'
//           ? JSON.parse(order.cart_items)
//           : order.cart_items;

//         total = parsedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//       } catch (e) {
//         console.error("Cart parse error:", order.cart_items);
//       }

//       try {
//         parsedAddress = typeof order.address === 'string'
//           ? JSON.parse(order.address)
//           : order.address;
//       } catch (e) {
//         console.error("Address parse error:", order.address);
//       }

//       try {
//         if (order.service_expert) {
//           parsedServiceExpert = typeof order.service_expert === 'string'
//             ? JSON.parse(order.service_expert)
//             : order.service_expert;
//         }
//       } catch (e) {
//         console.error("Service expert parse error:", e);
//       }

//       try {
//         if (order.reviews) {
//           parsedReviews = typeof order.reviews === 'string'
//             ? JSON.parse(order.reviews)
//             : order.reviews;
//         }
//       } catch (e) {
//         console.error("Reviews parse error:", e);
//       }

//       return {
//         ...order,
//         cart_items: parsedCart,
//         address: parsedAddress,
//         service_expert: parsedServiceExpert,
//         reviews: parsedReviews,
//         total: total.toFixed(2)
//       };
//     });

//     res.json({ success: true, orders: ordersWithDetails });
//   } catch (error) {
//     console.error("Error fetching all orders:", error);
//     res.status(500).json({ success: false, message: "Failed to fetch all order details" });
//   }
// });

// // ---------- ADMIN DASHBOARD ----------
// app.get('/api/admin/dashboard', verifyToken(['admin', 'superadmin']), async (req, res) => {
//   try {
//     const [users] = await db.query("SELECT COUNT(*) as count FROM users");
//     const [orders] = await db.query("SELECT COUNT(*) as count FROM orders");
//     const [pending] = await db.query("SELECT COUNT(*) as count FROM orders WHERE status = 'Pending'");
//     const [active] = await db.query("SELECT COUNT(*) as count FROM orders WHERE status = 'Active'");
//     const [completed] = await db.query("SELECT COUNT(*) as count FROM orders WHERE status = 'Completed'");
//     const [cancelled] = await db.query("SELECT COUNT(*) as count FROM orders WHERE status = 'Cancelled'");
//     const [vendors] = await db.query("SELECT COUNT(*) as count FROM vendors WHERE status = 'active'");

//     const totalOrders = orders[0].count;
//     const completionRate = totalOrders > 0
//       ? ((completed[0].count / totalOrders) * 100).toFixed(2)
//       : "0.00";

//     const stats = {
//       totalOrders,
//       pendingOrders: pending[0].count,
//       activeOrders: active[0].count,
//       completedOrders: completed[0].count,
//       canceledOrders: cancelled[0].count,
//       activeVendors: vendors[0].count,
//       totalUsers: users[0].count,
//       completionRate
//     };

//     const [activity] = await db.query(`
//       SELECT order_id, status, updated_at, order_date
//       FROM orders
//       ORDER BY updated_at DESC
//       LIMIT 10
//     `);

//     const formattedRecentActivities = activity.map(act => ({
//       orderId: act.order_id,
//       status: act.status,
//       time: act.updated_at,
//       orderDate: act.order_date
//     }));

//     res.json({
//       success: true,
//       stats,
//       recentActivity: formattedRecentActivities
//     });

//   } catch (error) {
//     console.error('Dashboard Error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to load dashboard data',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// // ---------- ADMIN ALL USERS ----------
// app.get("/api/admin/all-users", verifyToken(["admin", "superadmin"]), async (req, res) => {
//   try {
//     const [users] = await db.query(`
//       SELECT 
//         u.custom_id as id,
//         u.custom_id,
//         u.name,
//         u.email,
//         u.phone_number as phone,
//         u.photo as profileImage,
//         u.home_address,
//         u.office_address,
//         u.is_active as isActive,
//         u.created_at as createdAt
//       FROM users u
//       ORDER BY u.created_at DESC
//     `);

//     const parsedUsers = users.map(user => ({
//       ...user,
//       home_address: user.home_address ? JSON.parse(user.home_address) : {},
//       office_address: user.office_address ? JSON.parse(user.office_address) : {}
//     }));

//     res.json({ success: true, users: parsedUsers });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// // ---------- ADMIN USER ORDERS ----------
// app.get("/api/admin/user-orders/:userId", verifyToken(["admin", "superadmin"]), async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const [orders] = await db.query(`
//       SELECT 
//         order_id,
//         order_date,
//         time_slot,
//         status,
//         cart_items,
//         cancel_reason,
//         cancelled_at
//       FROM orders
//       WHERE user_id = ?
//       ORDER BY order_date DESC
//       LIMIT 10
//     `, [userId]);

//     const parsedOrders = orders.map(order => {
//       let parsedCart = [];
//       let total = 0;

//       try {
//         parsedCart = typeof order.cart_items === "string"
//           ? JSON.parse(order.cart_items)
//           : order.cart_items;

//         total = parsedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//       } catch (err) {
//         console.error("Cart parse error:", order.cart_items);
//       }

//       return {
//         ...order,
//         cart_items: parsedCart,
//         total: total.toFixed(2)
//       };
//     });

//     res.json({ success: true, orders: parsedOrders });
//   } catch (error) {
//     console.error("Error fetching user orders:", error);
//     res.status(500).json({ success: false, message: "Failed to fetch orders" });
//   }
// });

// // ---------- ADMIN USER STATS ----------
// app.get("/api/admin/user-stats", verifyToken(["admin", "superadmin"]), async (req, res) => {
//   try {
//     const [total] = await db.query("SELECT COUNT(*) as count FROM users");
//     const [newUsers] = await db.query(`
//       SELECT COUNT(*) as count FROM users 
//       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
//     `);
//     const [active] = await db.query("SELECT COUNT(*) as count FROM users WHERE is_active = 1");
//     const [last30] = await db.query(`
//       SELECT COUNT(*) as count FROM users 
//       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
//     `);

//     res.json({
//       totalUsers: total[0].count,
//       newUsers: newUsers[0].count,
//       activeUsers: active[0].count,
//       last30Days: last30[0].count
//     });
//   } catch (error) {
//     console.error("Error fetching stats:", error);
//     res.status(500).json({ success: false, message: "Error fetching stats" });
//   }
// });

// // ---------- ADMIN UPDATE USER ----------
// app.put("/api/admin/user/:id", verifyToken(["admin", "superadmin"]), async (req, res) => {
//   const { id } = req.params;
//   const { name, email, phone, isActive, homeAddress, officeAddress } = req.body;

//   try {
//     await db.query(`
//       UPDATE users 
//       SET name = ?, 
//           email = ?, 
//           phone_number = ?, 
//           is_active = ?,
//           home_address = ?,
//           office_address = ?
//       WHERE custom_id = ?
//     `, [
//       name,
//       email,
//       phone,
//       isActive,
//       homeAddress ? JSON.stringify(homeAddress) : null,
//       officeAddress ? JSON.stringify(officeAddress) : null,
//       id
//     ]);

//     res.json({ success: true, message: "User updated successfully" });
//   } catch (error) {
//     console.error("Error updating user:", error);
//     res.status(500).json({ success: false, message: "Failed to update user" });
//   }
// });

// // ---------- ADMIN DELETE USER ----------
// app.delete("/api/admin/user/:id", verifyToken(["admin", "superadmin"]), async (req, res) => {
//   const { id } = req.params;

//   try {
//     await db.query("DELETE FROM users WHERE custom_id = ?", [id]);
//     res.json({ success: true, message: "User deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting user:", error);
//     res.status(500).json({ success: false, message: "Failed to delete user" });
//   }
// });

// // ---------- SERVICES ----------
// app.get('/api/services', async (req, res) => {
//   try {
//     const [results] = await db.query('SELECT * FROM services');

//     const services = results.map(service => {
//       let imagePath = service.image;

//       if (imagePath && imagePath.startsWith('/images/')) {
//         return {
//           ...service,
//           image: `http://localhost:5001${imagePath}`
//         };
//       }

//       if (imagePath) {
//         imagePath = imagePath.replace(/^\/?uploads\//, '');
//         return {
//           ...service,
//           image: `http://localhost:5001/uploads/${imagePath}`
//         };
//       }

//       return service;
//     });

//     res.json(services);
//   } catch (error) {
//     console.error('Database error:', error);
//     res.status(500).json({ error: 'Database error' });
//   }
// });

// app.get('/api/services/:category', async (req, res) => {
//   const category = req.params.category.trim();

//   try {
//     const [rows] = await db.query('SELECT * FROM services WHERE category = ?', [category]);

//     const services = rows.map(service => {
//       let imagePath = service.image;

//       if (imagePath && imagePath.startsWith('/images/')) {
//         return {
//           ...service,
//           image: `http://localhost:5001${imagePath}`
//         };
//       }

//       if (imagePath) {
//         imagePath = imagePath.replace(/^\/?uploads\//, '');
//         return {
//           ...service,
//           image: `http://localhost:5001/uploads/${imagePath}`
//         };
//       }

//       return service;
//     });

//     res.status(200).json(services);
//   } catch (err) {
//     console.error("DB Error:", err.message);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// app.post('/api/services', uploadService.single('image'), async (req, res) => {
//   const { _id, name, price, category } = req.body;
//   const image = req.file ? `/uploads/services/${req.file.filename}` : null;

//   if (!_id || !name || !price || !category || !image) {
//     return res.status(400).json({ success: false, message: 'Missing fields' });
//   }

//   const sql = `INSERT INTO services (_id, name, price, category, image) VALUES (?, ?, ?, ?, ?)`;

//   try {
//     await db.query(sql, [_id, name, price, category, image]);
//     res.json({ success: true, message: 'Service added successfully!' });
//   } catch (err) {
//     console.error('DB error:', err);
//     res.status(500).json({ success: false, message: 'Database error' });
//   }
// });

// app.put('/api/services/:_id', uploadService.single('image'), async (req, res) => {
//   const { _id } = req.params;
//   const { name, price, category } = req.body;
//   let image = req.file ? `/uploads/services/${req.file.filename}` : null;

//   try {
//     const updates = [];
//     const values = [];

//     if (name) {
//       updates.push('name=?');
//       values.push(name);
//     }
//     if (price) {
//       updates.push('price=?');
//       values.push(price);
//     }
//     if (category) {
//       updates.push('category=?');
//       values.push(category);
//     }
//     if (image) {
//       updates.push('image=?');
//       values.push(image);
//     }

//     if (updates.length === 0) {
//       return res.status(400).json({ success: false, message: 'No fields to update' });
//     }

//     const sql = `UPDATE services SET ${updates.join(', ')} WHERE _id=?`;
//     values.push(_id);

//     const [result] = await db.query(sql, values);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ success: false, message: 'Service not found' });
//     }

//     res.json({ success: true, message: 'Service updated successfully' });
//   } catch (err) {
//     console.error('Update error:', err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// app.delete("/api/services/:_id", async (req, res) => {
//   const { _id } = req.params;
//   try {
//     await db.query("DELETE FROM services WHERE _id = ?", [_id]);
//     res.json({ success: true, message: "Service deleted successfully" });
//   } catch (err) {
//     console.error("Delete error:", err);
//     return res.status(500).json({ success: false, error: err.message });
//   }
// });

// // ---------- VENDOR REGISTRATION ----------
// app.post("/api/vendor/register", uploadVendorDocs.fields([
//   { name: 'profile_image', maxCount: 1 },
//   { name: 'nid_front', maxCount: 1 },
//   { name: 'nid_back', maxCount: 1 },
//   { name: 'cv', maxCount: 1 },
//   { name: 'trade_license', maxCount: 1 }
// ]), async (req, res) => {
//   const {
//     name,
//     email,
//     phone,
//     dob,
//     password,
//     nid_number,
//     company_name,
//     permanent_address,
//     present_address,
//     business_address,
//     service_areas,
//     services,
//     technician_quantity
//   } = req.body;

//   const requiredFields = ['name', 'email', 'phone', 'dob', 'password', 'nid_number'];
//   for (const field of requiredFields) {
//     if (!req.body[field]) {
//       return res.status(400).json({
//         success: false,
//         message: `${field.replace('_', ' ')} is required`
//       });
//     }
//   }

//   console.log('📋 Received vendor registration data:');
//   console.log('- Name:', name);
//   console.log('- Email:', email);
//   console.log('- Phone:', phone);

//   try {
//     const [duplicateCheck] = await db.query(
//       "SELECT * FROM vendors WHERE email = ? OR phone_number = ?",
//       [email, phone]
//     );

//     if (duplicateCheck.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Email or phone number already registered"
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const getFileUrl = (fieldName, subfolder) => {
//       return req.files[fieldName] && req.files[fieldName][0]
//         ? `/uploads/${subfolder}/${req.files[fieldName][0].filename}`
//         : null;
//     };

//     const nidFront = getFileUrl('nid_front', 'nids');
//     const nidBack = getFileUrl('nid_back', 'nids');
//     const profileImage = getFileUrl('profile_image', 'profiles');
//     const cv = getFileUrl('cv', 'cvs');
//     const tradeLicense = getFileUrl('trade_license', 'licenses');

//     let serviceAreasArray = [];
//     let servicesArray = [];

//     try {
//       if (service_areas) {
//         serviceAreasArray = JSON.parse(service_areas);
//       }
//     } catch (e) {
//       console.error('Service areas parse error:', e);
//       serviceAreasArray = [];
//     }

//     try {
//       if (services) {
//         servicesArray = JSON.parse(services);
//       }
//     } catch (e) {
//       console.error('Services parse error:', e);
//       servicesArray = [];
//     }

//     const [result] = await db.query(
//       `INSERT INTO vendors 
//         (name, email, phone_number, password, dob, nid_number, 
//          company_name, permanent_address, present_address, business_address,
//          technician_quantity, vendor_photo, nid_front, nid_back, cv, trade_license,
//          service_areas, services, status, created_at, updated_at) 
//        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW(), NOW())`,
//       [
//         name,
//         email,
//         phone,
//         hashedPassword,
//         dob,
//         nid_number,
//         company_name || null,
//         permanent_address || '',
//         present_address || '',
//         business_address || null,
//         technician_quantity || 0,
//         profileImage,
//         nidFront,
//         nidBack,
//         cv,
//         tradeLicense,
//         JSON.stringify(serviceAreasArray),
//         JSON.stringify(servicesArray)
//       ]
//     );

//     console.log(`✅ Vendor registered successfully: ${name} (ID: ${result.insertId})`);

//     res.status(200).json({
//       success: true,
//       message: "Registration successful! Your account is pending approval.",
//       vendorId: result.insertId
//     });

//   } catch (error) {
//     console.error("❌ Registration error:", error);

//     try {
//       if (req.files) {
//         Object.values(req.files).forEach(fileArray => {
//           if (fileArray && fileArray[0] && fs.existsSync(fileArray[0].path)) {
//             fs.unlinkSync(fileArray[0].path);
//           }
//         });
//       }
//     } catch (cleanupError) {
//       console.error("Error cleaning up files:", cleanupError);
//     }

//     res.status(500).json({
//       success: false,
//       message: "Registration failed. Please try again.",
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// // ---------- TECHNICIAN REGISTRATION ----------
// app.post("/api/technician/register", uploadVendorDocs.fields([
//   { name: 'profile_image', maxCount: 1 },
//   { name: 'nid_front', maxCount: 1 },
//   { name: 'nid_back', maxCount: 1 },
//   { name: 'cv', maxCount: 1 }
// ]), async (req, res) => {
//   const {
//     name,
//     email,
//     phone,
//     dob,
//     password,
//     nid_number,
//     permanent_address,
//     present_address,
//     skills,
//     experience,
//     vendor_id,
//     service_areas,
//     hourly_rate
//   } = req.body;

//   if (!name || !email || !phone || !password || !vendor_id) {
//     return res.status(400).json({
//       success: false,
//       message: 'Required fields missing: name, email, phone, password, vendor_id'
//     });
//   }

//   try {
//     const [vendorCheck] = await db.query(
//       'SELECT id FROM vendors WHERE id = ? AND status = ?',
//       [vendor_id, 'active']
//     );

//     if (vendorCheck.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Vendor not found or not active'
//       });
//     }

//     const [duplicate] = await db.query(
//       'SELECT id FROM technicians WHERE email = ? OR phone_number = ?',
//       [email, phone]
//     );

//     if (duplicate.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Email or phone already registered'
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const getFileUrl = (fieldName, subfolder) => {
//       return req.files[fieldName] && req.files[fieldName][0]
//         ? `/uploads/${subfolder}/${req.files[fieldName][0].filename}`
//         : null;
//     };

//     const profileImage = getFileUrl('profile_image', 'profiles');
//     const nidFront = getFileUrl('nid_front', 'nids');
//     const nidBack = getFileUrl('nid_back', 'nids');
//     const cv = getFileUrl('cv', 'cvs');

//     let skillsArray = [];
//     let serviceAreasArray = [];

//     try {
//       if (skills) {
//         skillsArray = typeof skills === 'string' ? JSON.parse(skills) : skills;
//       }
//     } catch (e) {
//       console.error('Skills parse error:', e);
//       skillsArray = [];
//     }

//     try {
//       if (service_areas) {
//         serviceAreasArray = typeof service_areas === 'string' ? JSON.parse(service_areas) : service_areas;
//       }
//     } catch (e) {
//       console.error('Service areas parse error:', e);
//       serviceAreasArray = [];
//     }

//     const [result] = await db.query(
//       `INSERT INTO technicians 
//        (vendor_id, name, email, phone_number, password, dob, 
//         nid_number, photo, nid_front, nid_back, cv,
//         permanent_address, present_address, skills, experience,
//         service_areas, hourly_rate, status, created_at, updated_at)
//        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW(), NOW())`,
//       [
//         vendor_id, name, email, phone, hashedPassword, dob || null,
//         nid_number || null, profileImage, nidFront, nidBack, cv,
//         permanent_address || null, present_address || null, 
//         JSON.stringify(skillsArray), experience || 0,
//         JSON.stringify(serviceAreasArray), hourly_rate || 0
//       ]
//     );

//     res.json({
//       success: true,
//       message: 'Technician registered successfully',
//       technicianId: result.insertId
//     });

//   } catch (error) {
//     console.error('❌ Technician registration error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Registration failed',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// // ---------- VENDOR PROFILE ----------
// app.get("/api/vendor/profile", authenticateVendor, async (req, res) => {
//   try {
//     console.log('📱 Vendor Profile Request - Vendor ID:', req.vendor?.vendorId);

//     if (!req.vendor || !req.vendor.vendorId) {
//       return res.status(401).json({
//         success: false,
//         message: "Vendor ID not found in token"
//       });
//     }

//     const [rows] = await db.query(
//       `SELECT 
//         id, name, email, phone_number, 
//         dob, nid_number, company_name, 
//         permanent_address, present_address, business_address,
//         technician_quantity, vendor_photo, nid_front, nid_back, 
//         cv, trade_license, service_areas, services, status, 
//         created_at, updated_at, total_orders, completed_orders,
//         pending_orders, canceled_orders, active_orders, hold_orders,
//         average_rating, success_rate, wallet_balance
//        FROM vendors WHERE id = ?`,
//       [req.vendor.vendorId]
//     );

//     if (rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Vendor not found in database",
//         vendorId: req.vendor.vendorId
//       });
//     }

//     const vendor = rows[0];

//     let serviceAreas = [];
//     let services = [];

//     try {
//       if (vendor.service_areas) {
//         const areasStr = vendor.service_areas.toString().trim();
//         if (areasStr.startsWith('[') && areasStr.endsWith(']')) {
//           serviceAreas = JSON.parse(areasStr);
//         } else if (areasStr.includes(',')) {
//           serviceAreas = areasStr.split(',').map(item => item.trim()).filter(item => item);
//         } else if (areasStr.length > 0) {
//           serviceAreas = [areasStr];
//         }
//       }
//     } catch (e) {
//       console.error('❌ Error parsing service areas:', e.message);
//       serviceAreas = [];
//     }

//     try {
//       if (vendor.services) {
//         const servicesStr = vendor.services.toString().trim();
//         if (servicesStr.startsWith('[') && servicesStr.endsWith(']')) {
//           services = JSON.parse(servicesStr);
//         } else if (servicesStr.includes(',')) {
//           services = servicesStr.split(',').map(item => item.trim()).filter(item => item);
//         } else if (servicesStr.length > 0) {
//           services = [servicesStr];
//         }
//       }
//     } catch (e) {
//       console.error('❌ Error parsing services:', e.message);
//       services = [];
//     }

//     const responseData = {
//       success: true,
//       vendor: {
//         id: vendor.id,
//         name: vendor.name,
//         email: vendor.email,
//         phone: vendor.phone_number,
//         dob: vendor.dob,
//         nidNumber: vendor.nid_number,
//         companyName: vendor.company_name,
//         permanentAddress: vendor.permanent_address,
//         presentAddress: vendor.present_address,
//         businessAddress: vendor.business_address,
//         technicianQuantity: vendor.technician_quantity,
//         profileImage: vendor.vendor_photo,
//         nidFront: vendor.nid_front,
//         nidBack: vendor.nid_back,
//         cv: vendor.cv,
//         tradeLicense: vendor.trade_license,
//         serviceAreas: serviceAreas,
//         services: services,
//         status: vendor.status,
//         stats: {
//           total_orders: vendor.total_orders || 0,
//           completed_orders: vendor.completed_orders || 0,
//           pending_orders: vendor.pending_orders || 0,
//           canceled_orders: vendor.canceled_orders || 0,
//           active_orders: vendor.active_orders || 0,
//           hold_orders: vendor.hold_orders || 0,
//           average_rating: vendor.average_rating || 0,
//           success_rate: vendor.success_rate || 0,
//           wallet_balance: vendor.wallet_balance || 0
//         },
//         createdAt: vendor.created_at,
//         updatedAt: vendor.updated_at
//       }
//     };

//     res.json(responseData);

//   } catch (error) {
//     console.error("❌ Profile error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch profile",
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// // ---------- VENDOR PROFILE UPDATE ----------
// app.put("/api/vendor/profile", authenticateVendor, uploadVendorDocs.fields([
//   { name: 'profile_image', maxCount: 1 },
//   { name: 'nid_front', maxCount: 1 },
//   { name: 'nid_back', maxCount: 1 },
//   { name: 'cv', maxCount: 1 },
//   { name: 'trade_license', maxCount: 1 }
// ]), async (req, res) => {
//   try {
//     const {
//       name,
//       phone,
//       dob,
//       company_name,
//       permanent_address,
//       present_address,
//       business_address,
//       service_areas,
//       services,
//       technician_quantity,
//       profile_image_base64,
//       profile_image_name
//     } = req.body;

//     const vendorId = req.vendor.vendorId;

//     let updateFields = [];
//     let updateValues = [];

//     if (name) {
//       updateFields.push("name = ?");
//       updateValues.push(name);
//     }

//     if (phone) {
//       updateFields.push("phone_number = ?");
//       updateValues.push(phone);
//     }

//     if (dob) {
//       updateFields.push("dob = ?");
//       updateValues.push(dob);
//     }

//     if (company_name !== undefined) {
//       updateFields.push("company_name = ?");
//       updateValues.push(company_name);
//     }

//     if (permanent_address !== undefined) {
//       updateFields.push("permanent_address = ?");
//       updateValues.push(permanent_address);
//     }

//     if (present_address !== undefined) {
//       updateFields.push("present_address = ?");
//       updateValues.push(present_address);
//     }

//     if (business_address !== undefined) {
//       updateFields.push("business_address = ?");
//       updateValues.push(business_address);
//     }

//     if (service_areas) {
//       updateFields.push("service_areas = ?");
//       updateValues.push(service_areas);
//     }

//     if (services) {
//       updateFields.push("services = ?");
//       updateValues.push(services);
//     }

//     if (technician_quantity !== undefined) {
//       updateFields.push("technician_quantity = ?");
//       updateValues.push(technician_quantity);
//     }

//     const getFileUrl = (fieldName, subfolder) => {
//       return req.files[fieldName] && req.files[fieldName][0]
//         ? `/uploads/${subfolder}/${req.files[fieldName][0].filename}`
//         : null;
//     };

//     if (req.files['profile_image']) {
//       updateFields.push("vendor_photo = ?");
//       updateValues.push(getFileUrl('profile_image', 'profiles'));
//     } else if (profile_image_base64 && profile_image_name) {
//       try {
//         const uploadsDir = path.join(__dirname, 'uploads/profiles');
//         if (!fs.existsSync(uploadsDir)) {
//           fs.mkdirSync(uploadsDir, { recursive: true });
//         }

//         const fileName = `${vendorId}_${Date.now()}_${profile_image_name}`;
//         const filePath = path.join(uploadsDir, fileName);

//         let base64Data = profile_image_base64;
//         if (profile_image_base64.includes(',')) {
//           base64Data = profile_image_base64.split(',')[1];
//         }

//         const buffer = Buffer.from(base64Data, 'base64');
//         fs.writeFileSync(filePath, buffer);

//         updateFields.push("vendor_photo = ?");
//         updateValues.push(`/uploads/profiles/${fileName}`);

//         console.log('✅ Base64 image saved:', fileName);
//       } catch (fileError) {
//         console.error('❌ Error saving base64 image:', fileError);
//       }
//     }

//     if (req.files['nid_front']) {
//       updateFields.push("nid_front = ?");
//       updateValues.push(getFileUrl('nid_front', 'nids'));
//     }

//     if (req.files['nid_back']) {
//       updateFields.push("nid_back = ?");
//       updateValues.push(getFileUrl('nid_back', 'nids'));
//     }

//     if (req.files['cv']) {
//       updateFields.push("cv = ?");
//       updateValues.push(getFileUrl('cv', 'cvs'));
//     }

//     if (req.files['trade_license']) {
//       updateFields.push("trade_license = ?");
//       updateValues.push(getFileUrl('trade_license', 'licenses'));
//     }

//     if (updateFields.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "No fields to update"
//       });
//     }

//     updateFields.push("updated_at = NOW()");
//     updateValues.push(vendorId);

//     const [result] = await db.query(
//       `UPDATE vendors SET ${updateFields.join(", ")} WHERE id = ?`,
//       updateValues    );

//     if (result.affectedRows === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Vendor not found"
//       });
//     }

//     res.json({
//       success: true,
//       message: "Profile updated successfully"
//     });

//   } catch (error) {
//     console.error("Update profile error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to update profile"
//     });
//   }
// });

// // ---------- FORGOT PASSWORD ----------
// app.post("/api/forgot-password", async (req, res) => {
//   console.log("Forgot password request received:", req.body);

//   const { email } = req.body;

//   if (!email) {
//     return res.status(400).json({
//       success: false,
//       message: "Email is required"
//     });
//   }

//   try {
//     const [users] = await db.query(
//       "SELECT custom_id, name, email FROM users WHERE email = ?",
//       [email]
//     );

//     const [vendors] = await db.query(
//       "SELECT id, name, email FROM vendors WHERE email = ?",
//       [email]
//     );

//     const user = users[0] || vendors[0];

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "No account found with this email address"
//       });
//     }

//     const resetToken = crypto.randomBytes(32).toString('hex');
//     const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

//     console.log("Generated token for:", email);

//     if (users[0]) {
//       await db.query(
//         "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
//         [resetToken, resetTokenExpiry, email]
//       );
//     } else {
//       await db.query(
//         "UPDATE vendors SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
//         [resetToken, resetTokenExpiry, email]
//       );
//     }

//     const resetLink = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

//     console.log("Reset link generated:", resetLink);

//     try {
//       await sendResetEmail(email, resetLink, user.name);
//       console.log("✅ Reset email sent successfully to:", email);

//       res.json({
//         success: true,
//         message: "Password reset link has been sent to your email"
//       });

//     } catch (emailError) {
//       console.error("❌ Email sending failed:", emailError);

//       res.json({
//         success: true,
//         message: "Reset token generated but email failed. Use the link below.",
//         resetLink: resetLink,
//         debug: "Email error: " + emailError.message
//       });
//     }

//   } catch (error) {
//     console.error("Forgot password error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to process reset request"
//     });
//   }
// });

// // ---------- SEND RESET EMAIL ----------
// const sendResetEmail = async (email, resetLink, userName) => {
//   try {
//     console.log("🔄 Attempting to send email...");

//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_APP_PASSWORD,
//       },
//       tls: {
//         rejectUnauthorized: false
//       },
//       logger: true,
//       debug: true
//     });

//     const mailOptions = {
//       from: {
//         name: 'Pacific Support',
//         address: process.env.EMAIL_USER
//       },
//       to: email,
//       subject: 'Password Reset Request - Pacific Support',
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//             <meta charset="utf-8">
//             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//             <title>Password Reset - Pacific Support</title>
//             <style>
//                 * { margin: 0; padding: 0; box-sizing: border-box; }
//                 body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: #f8fafc; }
//                 .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
//                 .header { background: linear-gradient(135deg, #3c8ce7 0%, #00c6ff 100%); padding: 40px 30px; text-align: center; color: white; }
//                 .header h1 { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
//                 .content { padding: 40px 30px; background: #ffffff; }
//                 .content h2 { color: #1e293b; font-size: 24px; font-weight: 600; margin-bottom: 16px; }
//                 .content p { color: #475569; font-size: 16px; margin-bottom: 20px; }
//                 .button { background: #3c8ce7; color: white; padding: 16px 36px; text-decoration: none; border-radius: 8px; display: inline-block; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px -1px rgba(60,140,231,0.3); }
//                 .button:hover { background: #2b7cd9; transform: translateY(-2px); }
//                 .footer { text-align: center; padding: 30px; color: #64748b; font-size: 14px; background: #f8fafc; border-top: 1px solid #e2e8f0; }
//                 .link-box { background: #f1f5f9; padding: 16px; border-radius: 8px; word-break: break-all; font-size: 14px; margin: 24px 0; border: 1px solid #e2e8f0; color: #475569; }
//                 .warning { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 16px; border-radius: 8px; margin: 20px 0; font-weight: 600; }
//                 .logo { font-size: 24px; font-weight: 700; margin-bottom: 8px; }
//             </style>
//         </head>
//         <body>
//             <div class="container">
//                 <div class="header">
//                     <div class="logo">🌊 Pacific Support</div>
//                     <p>Password Reset Request</p>
//                 </div>
//                 <div class="content">
//                     <h2>Hello ${userName},</h2>
//                     <p>We received a request to reset your password for your Pacific Support account. Click the button below to create a new secure password:</p>
//                     <div style="text-align: center; margin: 35px 0;">
//                         <a href="${resetLink}" class="button">Reset Your Password</a>
//                     </div>
//                     <p>If the button doesn't work, copy and paste the following link into your web browser:</p>
//                     <div class="link-box">${resetLink}</div>
//                     <div class="warning">⚠️ This password reset link will expire in 1 hour for security reasons.</div>
//                     <p>If you didn't request a password reset, you can safely ignore this email.</p>
//                 </div>
//                 <div class="footer">
//                     <p>&copy; 2024 Pacific Support. All rights reserved.</p>
//                     <p style="font-size: 13px; opacity: 0.8;">This is an automated message, please do not reply to this email.</p>
//                 </div>
//             </div>
//         </body>
//         </html>
//       `,
//       text: `
// Password Reset Request - Pacific Support

// Hello ${userName},

// We received a request to reset your password for your Pacific Support account.

// Reset your password here: ${resetLink}

// This password reset link will expire in 1 hour for security reasons.

// If you didn't request this password reset, you can safely ignore this email.

// © 2024 Pacific Support. All rights reserved.
//       `
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log("✅ Email sent successfully!");
//     console.log("📨 Message ID:", info.messageId);

//     return info;

//   } catch (error) {
//     console.error("❌ Email sending failed:", error.message);
//     throw new Error(`Failed to send reset email: ${error.message}`);
//   }
// };

// // ---------- ADMIN VENDORS LIST ----------
// app.get('/api/admin/vendors', verifyToken(['admin', 'superadmin']), async (req, res) => {
//   try {
//     const [vendors] = await db.query(`
//       SELECT 
//         id,
//         name,
//         email,
//         phone_number as phone,
//         vendor_photo as photo,
//         nid_number,
//         technician_quantity,
//         status,
//         total_orders,
//         completed_orders,
//         pending_orders,
//         canceled_orders,
//         active_orders,
//         hold_orders,
//         average_rating,
//         success_rate,
//         wallet_balance,
//         created_at
//       FROM vendors
//       ORDER BY created_at DESC
//     `);

//     res.json({
//       success: true,
//       vendors
//     });
//   } catch (error) {
//     console.error('Get vendors error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch vendors'
//     });
//   }
// });

// // ---------- ADMIN VENDOR STATUS UPDATE ----------
// app.patch('/api/admin/vendors/:id/status', verifyToken(['admin', 'superadmin']), async (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;

//   if (!['active', 'pending', 'rejected', 'suspended'].includes(status)) {
//     return res.status(400).json({
//       success: false,
//       message: 'Invalid status'
//     });
//   }

//   try {
//     await db.query(
//       'UPDATE vendors SET status = ?, updated_at = NOW() WHERE id = ?',
//       [status, id]
//     );

//     res.json({
//       success: true,
//       message: `Vendor status updated to ${status}`
//     });
//   } catch (error) {
//     console.error('Update vendor status error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to update vendor status'
//     });
//   }
// });

// // ---------- ORDER STATUS UPDATE (COMPLETE) ----------
// app.patch('/orders/:orderId/status', authenticateJWT, async (req, res) => {
//   const { orderId } = req.params;
//   const { status, notes, service_started } = req.body;
//   const userId = req.user.userId || req.user.id;
//   const userRole = req.user.role || 'user';

//   console.log(`🔄 Order status update request: ${orderId}`);
//   console.log(`📋 New status: ${status}`);
//   console.log(`👤 User: ${userId} (${userRole})`);

//   const validStatuses = ['Pending', 'Processing', 'Active', 'Completed', 'Cancelled', 'Hold', 'Assigned to Vendor', 'Started'];
//   if (!validStatuses.includes(status)) {
//     return res.status(400).json({
//       success: false,
//       message: `Invalid status. Valid statuses: ${validStatuses.join(', ')}`
//     });
//   }

//   try {
//     const [orderRows] = await db.query(
//       'SELECT * FROM orders WHERE order_id = ?',
//       [orderId]
//     );

//     if (orderRows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     const order = orderRows[0];
//     const oldStatus = order.status;
//     const vendorId = order.vendor_id;

//     console.log(`📋 Current status: ${oldStatus}, Vendor: ${vendorId || 'Not assigned'}`);

//     if (userRole === 'vendor') {
//       if (!vendorId || order.vendor_id !== parseInt(userId)) {
//         return res.status(403).json({
//           success: false,
//           message: 'You can only update your assigned orders'
//         });
//       }
//     }

//     if (oldStatus === 'Completed' || oldStatus === 'Cancelled') {
//       return res.status(400).json({
//         success: false,
//         message: `Cannot change status of ${oldStatus.toLowerCase()} order`
//       });
//     }

//     await db.query('START TRANSACTION');

//     let updateQuery = `UPDATE orders SET status = ?, updated_by = ?, updated_at = NOW()`;
//     const updateParams = [status, userId || 'system'];

//     if (service_started === true && !order.service_started_date) {
//       updateQuery += `, service_started_date = NOW()`;
//     }

//     if (notes) {
//       updateQuery += `, notes = CONCAT(IFNULL(notes, ''), '\n[${new Date().toLocaleString()}]: ${notes}')`;
//     }

//     if (status === 'Completed' && !order.completed_date) {
//       updateQuery += `, completed_date = NOW()`;
//     }

//     if (status === 'Cancelled') {
//       updateQuery += `, cancelled_date = NOW()`;
//       if (!order.cancel_reason) {
//         updateQuery += `, cancel_reason = ?`;
//         updateParams.push(notes || 'Order cancelled');
//       }
//     }

//     updateQuery += ` WHERE order_id = ?`;
//     updateParams.push(orderId);

//     await db.query(updateQuery, updateParams);

//     if (vendorId) {
//       await updateVendorStats(orderId, oldStatus, status, vendorId, order.service_expert);
//     }

//     await db.query(
//       `INSERT INTO order_history 
//        (order_id, status, action_by, action_type, details, created_at) 
//        VALUES (?, ?, ?, 'status_change', ?, NOW())`,
//       [orderId, status, userId || 'system', `Status changed from ${oldStatus} to ${status}`]
//     );

//     await db.query('COMMIT');

//     const [updatedOrder] = await db.query(
//       'SELECT * FROM orders WHERE order_id = ?',
//       [orderId]
//     );

//     console.log(`✅ Order ${orderId} status updated successfully`);

//     res.json({
//       success: true,
//       message: `Order status updated to ${status}`,
//       order: {
//         order_id: orderId,
//         status: status,
//         old_status: oldStatus,
//         vendor_id: vendorId,
//         updated_at: new Date(),
//         updated_by: userId || 'system'
//       }
//     });

//   } catch (error) {
//     await db.query('ROLLBACK');
//     console.error('❌ Update order status error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to update order status',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// // ---------- ORDER CANCELLATION (COMPLETE) ----------
// app.patch('/orders/:orderId/cancel', authenticateJWT, async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { reason, penaltyFee = 0 } = req.body;
//     const userId = req.user.userId || req.user.id;
//     const userRole = req.user.role || 'user';

//     console.log(`🔄 Cancellation request by ${userRole} for order ${orderId}`);

//     const [orderRows] = await db.query(
//       `SELECT o.*, 
//               u.name as user_name,
//               v.name as vendor_name
//        FROM orders o
//        LEFT JOIN users u ON o.user_id = u.custom_id
//        LEFT JOIN vendors v ON o.vendor_id = v.id
//        WHERE o.order_id = ?`,
//       [orderId]
//     );

//     if (orderRows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     const order = orderRows[0];

//     if (userRole === 'user' || userRole === 'customer') {
//       if (order.user_id !== userId) {
//         return res.status(403).json({
//           success: false,
//           message: 'Unauthorized: You can only cancel your own orders'
//         });
//       }
//     } else if (userRole === 'vendor') {
//       if (order.vendor_id !== userId) {
//         return res.status(403).json({
//           success: false,
//           message: 'Unauthorized: This order is not assigned to you'
//         });
//       }
//     }

//     const currentStatus = order.status;
//     if (currentStatus === 'Completed' || currentStatus === 'Cancelled') {
//       return res.status(400).json({
//         success: false,
//         message: `Order is already ${currentStatus.toLowerCase()}`
//       });
//     }

//     const serviceStarted = hasServiceStarted(order);
//     const isVendorAssigned = order.vendor_id ? true : false;

//     if (userRole === 'user' || userRole === 'customer') {
//       console.log('👤 User initiated cancellation');

//       if (serviceStarted && penaltyFee !== 500 && isVendorAssigned) {
//         return res.status(400).json({
//           success: false,
//           message: 'Cancellation requires ৳500 penalty fee as service has started'
//         });
//       }

//       if (!serviceStarted && penaltyFee > 0) {
//         return res.status(400).json({
//           success: false,
//           message: 'No penalty fee required for cancellation before service starts'
//         });
//       }

//       await db.query('START TRANSACTION');

//       try {
//         await db.query(
//           `UPDATE orders 
//            SET status = 'Cancelled',
//                cancel_reason = ?,
//                cancelled_by = 'user',
//                cancelled_date = NOW(),
//                penalty_fee = ?,
//                updated_at = NOW()
//            WHERE order_id = ?`,
//           [reason || 'Customer requested cancellation', penaltyFee, orderId]
//         );

//         if (isVendorAssigned) {
//           if (serviceStarted && penaltyFee > 0) {
//             const vendorAmount = Math.round(penaltyFee * 0.70);
//             const adminAmount = penaltyFee - vendorAmount;

//             await db.query(
//               `INSERT INTO vendor_cancellations 
//                (vendor_id, order_id, user_id, penalty_amount, reason, 
//                 cancelled_by, vendor_amount, admin_amount, 
//                 cancellation_type, cancelled_at)
//                VALUES (?, ?, ?, ?, ?, 'user', ?, ?, 'user_cancelled_with_charge', NOW())`,
//               [order.vendor_id, orderId, userId, penaltyFee, reason || 'User cancellation',
//                vendorAmount, adminAmount]
//             );

//             await db.query(
//               `UPDATE vendors 
//                SET wallet_balance = COALESCE(wallet_balance, 0) + ?,
//                    canceled_orders = canceled_orders + 1,
//                    updated_at = NOW()
//                WHERE id = ?`,
//               [vendorAmount, order.vendor_id]
//             );

//             await db.query(
//               `INSERT INTO vendor_transactions 
//                (vendor_id, order_id, amount, transaction_type, description, created_at)
//                VALUES (?, ?, ?, 'penalty_fee_user_cancellation',
//                        'Penalty fee from user cancellation (Vendor: ৳${vendorAmount})', NOW())`,
//               [order.vendor_id, orderId, vendorAmount]
//             );

//           } else {
//             await db.query(
//               `INSERT INTO vendor_cancellations 
//                (vendor_id, order_id, user_id, reason, 
//                 cancelled_by, cancellation_type, cancelled_at)
//                VALUES (?, ?, ?, ?, 'user', 'user_cancelled_no_charge', NOW())`,
//               [order.vendor_id, orderId, userId, reason || 'User cancellation before service']
//             );

//             await db.query(
//               `UPDATE vendors 
//                SET pending_orders = GREATEST(0, pending_orders - 1),
//                    canceled_orders = canceled_orders + 1,
//                    updated_at = NOW()
//                WHERE id = ?`,
//               [order.vendor_id]
//             );
//           }

//           await db.query(
//             `INSERT INTO notifications 
//              (user_id, user_type, title, message, type, related_id, created_at)
//              VALUES (?, 'vendor', 'Order Cancelled by Customer', 
//                      'Order ${orderId} was cancelled by customer. ${penaltyFee > 0 ? 'Penalty fee applied.' : 'No penalty fee.'}', 
//                      'order_cancelled', ?, NOW())`,
//             [order.vendor_id, orderId]
//           );
//         }

//         await db.query(
//           `INSERT INTO notifications 
//            (user_id, user_type, title, message, type, related_id, created_at)
//            VALUES (?, 'user', 'Order Cancelled', 
//                    'Your order ${orderId} has been cancelled. ${penaltyFee > 0 ? `Penalty fee of ৳${penaltyFee} has been charged.` : ''}', 
//                    'order_cancelled', ?, NOW())`,
//           [userId, orderId]
//         );

//         await db.query('COMMIT');

//         res.json({
//           success: true,
//           message: penaltyFee > 0 
//             ? `Order cancelled successfully with ৳${penaltyFee} penalty fee`
//             : 'Order cancelled successfully',
//           orderId,
//           status: 'Cancelled',
//           cancelled_by: 'user',
//           penaltyFee,
//           serviceStarted,
//           cancelReason: reason
//         });

//       } catch (error) {
//         await db.query('ROLLBACK');
//         throw error;
//       }
//     } else if (userRole === 'admin' || userRole === 'superadmin') {
//       console.log('👑 Admin initiated cancellation');

//       await db.query('START TRANSACTION');

//       try {
//         await db.query(
//           `UPDATE orders 
//            SET status = 'Cancelled',
//                cancel_reason = ?,
//                cancelled_by = 'admin',
//                cancelled_date = NOW(),
//                penalty_fee = ?,
//                updated_at = NOW()
//            WHERE order_id = ?`,
//           [reason || 'Admin cancelled', penaltyFee, orderId]
//         );

//         if (order.vendor_id) {
//           await db.query(
//             `UPDATE vendors 
//              SET pending_orders = GREATEST(0, pending_orders - 1),
//                  canceled_orders = canceled_orders + 1,
//                  updated_at = NOW()
//              WHERE id = ?`,
//             [order.vendor_id]
//           );
//         }

//         await db.query(
//           `INSERT INTO notifications 
//            (user_id, user_type, title, message, type, related_id, created_at)
//            VALUES (?, 'user', 'Order Cancelled by Admin', 
//                    'Your order ${orderId} has been cancelled by admin. ${penaltyFee > 0 ? `Penalty fee of ৳${penaltyFee} was refunded.` : ''}', 
//                    'order_cancelled', ?, NOW())`,
//           [order.user_id, orderId]
//         );

//         await db.query('COMMIT');

//         res.json({
//           success: true,
//           message: 'Order cancelled by admin',
//           data: {
//             orderId,
//             status: 'Cancelled',
//             cancelled_by: 'admin',
//             penaltyFee
//           }
//         });

//       } catch (error) {
//         await db.query('ROLLBACK');
//         throw error;
//       }
//     }

//   } catch (error) {
//     console.error('❌ Cancel order error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to cancel order',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// // ---------- SERVICE EXPERT RATING ----------
// app.post('/api/service-expert/:id/rate', authenticateJWT, async (req, res) => {
//   const { id } = req.params;
//   const { rating, orderId } = req.body;
//   const userId = req.user.userId;

//   try {
//     const [orderRows] = await db.query(
//       'SELECT * FROM orders WHERE order_id = ? AND user_id = ?',
//       [orderId, userId]
//     );

//     if (orderRows.length === 0) {
//       return res.status(403).json({
//         success: false,
//         message: 'You can only rate service experts for your own orders'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Rating submitted successfully'
//     });
//   } catch (error) {
//     console.error('Rating error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to submit rating'
//     });
//   }
// });

// // ---------- ORDER HOLD ----------
// app.patch('/orders/:orderId/hold', authenticateJWT, async (req, res) => {
//   const { orderId } = req.params;
//   const { reason, checkoutCharge } = req.body;
//   const userId = req.user.userId;

//   try {
//     const [orderRows] = await db.query(
//       'SELECT * FROM orders WHERE order_id = ? AND user_id = ?',
//       [orderId, userId]
//     );

//     if (orderRows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     const order = orderRows[0];

//     if (order.status !== 'Active' || !hasServiceStarted(order)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Only active orders with service started can be put on hold'
//       });
//     }

//     await db.query(
//       `UPDATE orders 
//        SET status = 'Hold',
//            hold_reason = ?,
//            checkout_charge = ?,
//            hold_date = NOW()
//        WHERE order_id = ?`,
//       [reason, checkoutCharge, orderId]
//     );

//     if (order.vendor_id) {
//       await db.query(
//         `UPDATE vendors 
//          SET pending_orders = pending_orders - 1,
//              hold_orders = hold_orders + 1,
//              updated_at = NOW()
//          WHERE id = ?`,
//         [order.vendor_id]
//       );
//     }

//     res.json({
//       success: true,
//       message: 'Order put on hold successfully',
//       order: {
//         order_id: orderId,
//         status: 'Hold',
//         checkout_charge: checkoutCharge
//       }
//     });

//   } catch (error) {
//     console.error('Hold order error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to put order on hold'
//     });
//   }
// });

// // ---------- NOTIFICATIONS ----------
// app.get('/api/notifications', authenticateJWT, async (req, res) => {
//   try {
//     const userId = req.user.userId || req.user.id;
//     const userType = req.user.role === 'vendor' ? 'vendor' : 'user';

//     const [notifications] = await db.query(
//       `SELECT id, title, message, type, related_id, is_read, 
//               created_at, read_at
//        FROM notifications 
//        WHERE user_id = ? AND user_type = ?
//        ORDER BY created_at DESC
//        LIMIT 50`,
//       [userId, userType]
//     );

//     const [unreadCount] = await db.query(
//       `SELECT COUNT(*) as count 
//        FROM notifications 
//        WHERE user_id = ? AND user_type = ? AND is_read = FALSE`,
//       [userId, userType]
//     );

//     res.json({
//       success: true,
//       notifications,
//       unreadCount: unreadCount[0].count
//     });
//   } catch (error) {
//     console.error('Get notifications error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch notifications'
//     });
//   }
// });

// app.patch('/api/notifications/:id/read', authenticateJWT, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user.userId || req.user.id;
//     const userType = req.user.role === 'vendor' ? 'vendor' : 'user';

//     const [result] = await db.query(
//       `UPDATE notifications 
//        SET is_read = TRUE, read_at = NOW()
//        WHERE id = ? AND user_id = ? AND user_type = ?`,
//       [id, userId, userType]
//     );

//     if (result.affectedRows === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Notification not found'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Notification marked as read'
//     });
//   } catch (error) {
//     console.error('Mark as read error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to mark notification as read'
//     });
//   }
// });

// app.patch('/api/notifications/mark-all-read', authenticateJWT, async (req, res) => {
//   try {
//     const userId = req.user.userId || req.user.id;
//     const userType = req.user.role === 'vendor' ? 'vendor' : 'user';

//     await db.query(
//       `UPDATE notifications 
//        SET is_read = TRUE, read_at = NOW()
//        WHERE user_id = ? AND user_type = ? AND is_read = FALSE`,
//       [userId, userType]
//     );

//     res.json({
//       success: true,
//       message: 'All notifications marked as read'
//     });
//   } catch (error) {
//     console.error('Mark all as read error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to mark notifications as read'
//     });
//   }
// });

// app.delete('/api/notifications/:id', authenticateJWT, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user.userId || req.user.id;
//     const userType = req.user.role === 'vendor' ? 'vendor' : 'user';

//     const [result] = await db.query(
//       `DELETE FROM notifications 
//        WHERE id = ? AND user_id = ? AND user_type = ?`,
//       [id, userId, userType]
//     );

//     if (result.affectedRows === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Notification not found'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Notification deleted'
//     });
//   } catch (error) {
//     console.error('Delete notification error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to delete notification'
//     });
//   }
// });

// app.get('/api/notifications/unread-count', authenticateJWT, async (req, res) => {
//   try {
//     const userId = req.user.userId || req.user.id;
//     const userType = req.user.role === 'vendor' ? 'vendor' : 'user';

//     try {
//       const [result] = await db.query(
//         `SELECT COUNT(*) as count 
//          FROM notifications 
//          WHERE user_id = ? AND user_type = ? AND is_read = FALSE`,
//         [userId, userType]
//       );

//       return res.json({
//         success: true,
//         count: result[0].count || 0
//       });
//     } catch (tableError) {
//       console.log('⚠️ Notifications table not found, returning default count');
//       return res.json({
//         success: true,
//         count: 0
//       });
//     }

//   } catch (error) {
//     console.error('Get unread count error:', error);
//     res.json({
//       success: false,
//       count: 0,
//       message: 'Error fetching unread count'
//     });
//   }
// });

// // ---------- SCHEDULE CHANGE ----------
// app.patch('/orders/:orderId/schedule', authenticateJWT, async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { newDate, newTimeSlot, reason } = req.body;
//     const userId = req.user.userId || req.user.id;
//     const userRole = req.user.role || 'user';

//     console.log(`🔄 Schedule change request for order: ${orderId}`);
//     console.log(`📅 New Date: ${newDate}`);
//     console.log(`⏰ New Time: ${newTimeSlot}`);

//     const [orderRows] = await db.query(
//       `SELECT * FROM orders WHERE order_id = ?`,
//       [orderId]
//     );

//     if (orderRows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     const order = orderRows[0];

//     if (userRole === 'user' || userRole === 'customer') {
//       if (order.user_id !== userId) {
//         return res.status(403).json({
//           success: false,
//           message: 'You can only change schedule for your own orders'
//         });
//       }
//     }

//     if (!['Pending', 'Processing'].includes(order.status)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Cannot change schedule for this order status'
//       });
//     }

//     if (order.vendor_id || order.service_expert) {
//       return res.status(400).json({
//         success: false,
//         message: 'Cannot change schedule after expert assignment'
//       });
//     }

//     if (hasServiceStarted(order)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Cannot change schedule after service has started'
//       });
//     }

//     const newDateObj = new Date(newDate);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     if (newDateObj < today) {
//       return res.status(400).json({
//         success: false,
//         message: 'New date must be in the future'
//       });
//     }

//     if (!newTimeSlot || !newTimeSlot.includes('-')) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid time slot format'
//       });
//     }

//     await db.query('START TRANSACTION');

//     try {
//       await db.query(
//         `INSERT INTO schedule_changes 
//          (order_id, user_id, previous_date, previous_time_slot, 
//           new_date, new_time_slot, changed_by, reason) 
//          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//         [
//           orderId,
//           userId,
//           order.order_date,
//           order.time_slot,
//           newDate,
//           newTimeSlot,
//           userRole,
//           reason || 'Customer requested schedule change'
//         ]
//       );

//       await db.query(
//         `UPDATE orders 
//          SET order_date = ?,
//              time_slot = ?,
//              schedule_changed = TRUE,
//              schedule_changed_date = NOW(),
//              updated_at = NOW()
//          WHERE order_id = ?`,
//         [newDate, newTimeSlot, orderId]
//       );

//       await db.query(
//         `INSERT INTO notifications 
//          (user_id, user_type, title, message, type, related_id, created_at) 
//          VALUES (?, 'user', 'Schedule Updated', 
//                  'Your order ${orderId} schedule has been changed to ${new Date(newDate).toLocaleDateString()} at ${newTimeSlot}', 
//                  'schedule_change', ?, NOW())`,
//         [userId, orderId]
//       );

//       await db.query('COMMIT');

//       console.log(`✅ Schedule changed successfully for order ${orderId}`);

//       res.json({
//         success: true,
//         message: 'Schedule updated successfully',
//         data: {
//           order_id: orderId,
//           previous_date: order.order_date,
//           previous_time_slot: order.time_slot,
//           new_date: newDate,
//           new_time_slot: newTimeSlot,
//           changed_by: userRole,
//           change_date: new Date()
//         }
//       });

//     } catch (error) {
//       await db.query('ROLLBACK');
//       throw error;
//     }

//   } catch (error) {
//     console.error('Schedule change error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to update schedule',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// // ---------- SCHEDULE HISTORY ----------
// app.get('/orders/:orderId/schedule-history', authenticateJWT, async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const userId = req.user.userId || req.user.id;
//     const userRole = req.user.role || 'user';

//     const [orderRows] = await db.query(
//       `SELECT * FROM orders 
//        WHERE order_id = ? AND user_id = ?`,
//       [orderId, userId]
//     );

//     if (orderRows.length === 0 && userRole !== 'admin' && userRole !== 'superadmin') {
//       return res.status(403).json({
//         success: false,
//         message: 'Access denied to order history'
//       });
//     }

//     const [history] = await db.query(
//       `SELECT sc.*, 
//               u.name as user_name,
//               u.email as user_email
//        FROM schedule_changes sc
//        LEFT JOIN users u ON sc.user_id = u.custom_id
//        WHERE sc.order_id = ?
//        ORDER BY sc.change_date DESC`,
//       [orderId]
//     );

//     res.json({
//       success: true,
//       history: history.map(record => ({
//         id: record.id,
//         order_id: record.order_id,
//         user_name: record.user_name,
//         previous_date: record.previous_date,
//         previous_time_slot: record.previous_time_slot,
//         new_date: record.new_date,
//         new_time_slot: record.new_time_slot,
//         changed_by: record.changed_by,
//         reason: record.reason,
//         change_date: record.change_date
//       }))
//     });

//   } catch (error) {
//     console.error('Get schedule history error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch schedule history'
//     });
//   }
// });

// // ---------- CAN CHANGE SCHEDULE ----------
// app.get('/orders/:orderId/can-change-schedule', authenticateJWT, async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const userId = req.user.userId || req.user.id;
//     const userRole = req.user.role || 'user';

//     const [orderRows] = await db.query(
//       `SELECT * FROM orders WHERE order_id = ?`,
//       [orderId]
//     );

//     if (orderRows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         can_change: false,
//         message: 'Order not found'
//       });
//     }

//     const order = orderRows[0];

//     if (userRole === 'user' && order.user_id !== userId) {
//       return res.status(403).json({
//         success: false,
//         can_change: false,
//         message: 'Access denied'
//       });
//     }

//     const canChangeSchedule = () => {
//       if (!['Pending', 'Processing'].includes(order.status)) {
//         return {
//           can_change: false,
//           reason: `Order status is ${order.status}`
//         };
//       }

//       if (order.vendor_id || order.service_expert) {
//         return {
//           can_change: false,
//           reason: 'Service expert already assigned'
//         };
//       }

//       if (hasServiceStarted(order)) {
//         return {
//           can_change: false,
//           reason: 'Service has already started'
//         };
//       }

//       if (order.schedule_changed) {
//         return {
//           can_change: false,
//           reason: 'Schedule already changed once'
//         };
//       }

//       return {
//         can_change: true,
//         reason: 'Schedule can be changed'
//       };
//     };

//     const result = canChangeSchedule();

//     res.json({
//       success: true,
//       order_id: orderId,
//       current_date: order.order_date,
//       current_time_slot: order.time_slot,
//       ...result,
//       conditions: {
//         valid_status: ['Pending', 'Processing'].includes(order.status),
//         no_vendor_assigned: !(order.vendor_id || order.service_expert),
//         service_not_started: !hasServiceStarted(order),
//         not_changed_before: !order.schedule_changed
//       }
//     });

//   } catch (error) {
//     console.error('Check schedule change error:', error);
//     res.status(500).json({
//       success: false,
//       can_change: false,
//       message: 'Failed to check schedule change status'
//     });
//   }
// });

// // ---------- VENDOR DASHBOARD ----------
// app.get('/api/vendor/dashboard', authenticateVendor, async (req, res) => {
//   try {
//     const vendorId = req.vendor.vendorId;

//     if (!vendorId) {
//       return res.status(401).json({
//         success: false,
//         message: 'Vendor ID not found'
//       });
//     }

//     const [stats] = await db.query(
//       `SELECT 
//         id,
//         name,
//         email,
//         phone_number,
//         vendor_photo,
//         status,
//         total_orders,
//         completed_orders,
//         pending_orders,
//         canceled_orders,
//         hold_orders,
//         active_orders,
//         average_rating,
//         success_rate,
//         wallet_balance,
//         created_at
//        FROM vendors 
//        WHERE id = ?`,
//       [vendorId]
//     );

//     if (stats.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Vendor not found'
//       });
//     }

//     const [recentOrders] = await db.query(
//       `SELECT 
//         order_id,
//         order_date,
//         time_slot,
//         status,
//         created_at,
//         (SELECT COUNT(*) FROM order_reviews WHERE order_id = orders.order_id) as review_count
//        FROM orders 
//        WHERE vendor_id = ?
//        ORDER BY created_at DESC 
//        LIMIT 10`,
//       [vendorId]
//     );

//     const [monthlyStats] = await db.query(
//       `SELECT 
//         DATE_FORMAT(created_at, '%Y-%m') as month,
//         COUNT(*) as total,
//         SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed,
//         SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END) as cancelled
//        FROM orders 
//        WHERE vendor_id = ?
//        AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
//        GROUP BY DATE_FORMAT(created_at, '%Y-%m')
//        ORDER BY month DESC`,
//       [vendorId]
//     );

//     res.json({
//       success: true,
//       dashboard: {
//         stats: stats[0],
//         recent_orders: recentOrders,
//         monthly_stats: monthlyStats
//       }
//     });

//   } catch (error) {
//     console.error('❌ Vendor dashboard error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch dashboard data'
//     });
//   }
// });

// // ---------- VENDOR ORDER DETAILS ----------
// app.get('/api/vendor/orders/:orderId', authenticateVendor, async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const vendorId = req.vendor.vendorId;

//     const [orders] = await db.query(
//       `SELECT 
//         o.*,
//         u.name as customer_name,
//         u.email as customer_email,
//         u.phone_number as customer_phone,
//         u.photo as customer_photo
//        FROM orders o
//        LEFT JOIN users u ON o.user_id = u.custom_id
//        WHERE o.order_id = ? AND o.vendor_id = ?`,
//       [orderId, vendorId]
//     );

//     if (orders.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found or not assigned to you'
//       });
//     }

//     const order = orders[0];

//     let parsedCart = [];
//     let parsedServiceExpert = null;
//     let parsedAddress = {};
//     let parsedReviews = null;

//     try {
//       parsedCart = typeof order.cart_items === 'string' 
//         ? JSON.parse(order.cart_items) 
//         : order.cart_items;
//     } catch (e) {
//       console.error('Cart parse error:', e);
//     }

//     try {
//       if (order.service_expert) {
//         parsedServiceExpert = typeof order.service_expert === 'string'
//           ? JSON.parse(order.service_expert)
//           : order.service_expert;
//       }
//     } catch (e) {
//       console.error('Service expert parse error:', e);
//     }

//     try {
//       if (order.reviews) {
//         parsedReviews = typeof order.reviews === 'string'
//           ? JSON.parse(order.reviews)
//           : order.reviews;
//       }
//     } catch (e) {
//       console.error('Reviews parse error:', e);
//     }

//     let addressField = null;
//     if (order.address_type === 'home' && order.home_address) {
//       addressField = order.home_address;
//     } else if (order.address_type === 'office' && order.office_address) {
//       addressField = order.office_address;
//     } else if (order.address_type === 'another' && order.temp_address) {
//       addressField = order.temp_address;
//     }

//     try {
//       if (addressField) {
//         parsedAddress = typeof addressField === 'string'
//           ? JSON.parse(addressField)
//           : addressField;
//       }
//     } catch (e) {
//       console.error('Address parse error:', e);
//     }

//     const total = parsedCart.reduce((sum, item) => 
//       sum + (item.price * item.quantity), 0
//     );

//     res.json({
//       success: true,
//       order: {
//         ...order,
//         cart_items: parsedCart,
//         service_expert: parsedServiceExpert,
//         address: parsedAddress,
//         reviews: parsedReviews,
//         total: total.toFixed(2)
//       }
//     });

//   } catch (error) {
//     console.error('❌ Get vendor order error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch order details'
//     });
//   }
// });

// // ---------- VENDOR REVIEWS ----------
// app.get('/api/vendor/reviews', authenticateVendor, async (req, res) => {
//   try {
//     const vendorId = req.vendor.vendorId;
//     const { limit = 20, offset = 0 } = req.query;

//     const [reviews] = await db.query(
//       `SELECT 
//         r.*,
//         u.name as customer_name,
//         u.photo as customer_photo,
//         o.order_id,
//         o.order_date
//        FROM order_reviews r
//        JOIN orders o ON r.order_id = o.order_id
//        JOIN users u ON r.user_id = u.custom_id
//        WHERE o.vendor_id = ?
//        ORDER BY r.created_at DESC
//        LIMIT ? OFFSET ?`,
//       [vendorId, parseInt(limit), parseInt(offset)]
//     );

//     const [total] = await db.query(
//       `SELECT COUNT(*) as count
//        FROM order_reviews r
//        JOIN orders o ON r.order_id = o.order_id
//        WHERE o.vendor_id = ?`,
//       [vendorId]
//     );

//     const [avgRatings] = await db.query(
//       `SELECT 
//         AVG(service_expert_rating) as avg_service_rating,
//         AVG(website_service_rating) as avg_website_rating
//        FROM order_reviews r
//        JOIN orders o ON r.order_id = o.order_id
//        WHERE o.vendor_id = ?`,
//       [vendorId]
//     );

//     res.json({
//       success: true,
//       reviews: reviews,
//       pagination: {
//         total: total[0].count,
//         limit: parseInt(limit),
//         offset: parseInt(offset)
//       },
//       averages: {
//         service_rating: Math.round(avgRatings[0].avg_service_rating || 0),
//         website_rating: Math.round(avgRatings[0].avg_website_rating || 0)
//       }
//     });

//   } catch (error) {
//     console.error('❌ Get vendor reviews error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch reviews'
//     });
//   }
// });

// // ---------- VENDOR TECHNICIANS ----------
// app.get('/api/vendor/technicians', authenticateVendor, async (req, res) => {
//   try {
//     const vendorId = req.vendor.vendorId;

//     const [technicians] = await db.query(
//       `SELECT 
//         id, name, email, phone_number, photo, 
//         skills, experience, hourly_rate, status,
//         rating, total_orders, completed_orders,
//         created_at
//        FROM technicians 
//        WHERE vendor_id = ?
//        ORDER BY created_at DESC`,
//       [vendorId]
//     );

//     const parsedTechnicians = technicians.map(tech => {
//       let skills = [];
//       try {
//         skills = typeof tech.skills === 'string' ? JSON.parse(tech.skills) : tech.skills;
//       } catch (e) {
//         skills = [];
//       }
//       return { ...tech, skills };
//     });

//     res.json({
//       success: true,
//       technicians: parsedTechnicians
//     });

//   } catch (error) {
//     console.error('❌ Get technicians error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch technicians'
//     });
//   }
// });

// // ---------- ADMIN TECHNICIANS ----------
// app.get('/api/admin/technicians', verifyToken(['admin', 'superadmin']), async (req, res) => {
//   try {
//     const [technicians] = await db.query(
//       `SELECT 
//         t.*,
//         v.name as vendor_name,
//         v.company_name as vendor_company
//        FROM technicians t
//        LEFT JOIN vendors v ON t.vendor_id = v.id
//        ORDER BY t.created_at DESC`
//     );

//     const parsedTechnicians = technicians.map(tech => {
//       let skills = [];
//       let serviceAreas = [];
//       try {
//         skills = typeof tech.skills === 'string' ? JSON.parse(tech.skills) : tech.skills;
//       } catch (e) { skills = []; }
//       try {
//         serviceAreas = typeof tech.service_areas === 'string' ? JSON.parse(tech.service_areas) : tech.service_areas;
//       } catch (e) { serviceAreas = []; }
//       return { ...tech, skills, service_areas: serviceAreas };
//     });

//     res.json({
//       success: true,
//       technicians: parsedTechnicians
//     });

//   } catch (error) {
//     console.error('❌ Get technicians error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch technicians'
//     });
//   }
// });

// // ---------- ADMIN TECHNICIAN STATUS UPDATE ----------
// app.patch('/api/admin/technicians/:id/status', verifyToken(['admin', 'superadmin']), async (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;

//   if (!['pending', 'active', 'inactive', 'suspended'].includes(status)) {
//     return res.status(400).json({
//       success: false,
//       message: 'Invalid status'
//     });
//   }

//   try {
//     await db.query(
//       'UPDATE technicians SET status = ?, updated_at = NOW() WHERE id = ?',
//       [status, id]
//     );

//     res.json({
//       success: true,
//       message: `Technician status updated to ${status}`
//     });

//   } catch (error) {
//     console.error('❌ Update technician status error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to update technician status'
//     });
//   }
// });

// // ---------- HEALTH CHECK ----------
// app.get('/api/health', (req, res) => {
//   res.json({
//     success: true,
//     status: 'Server is healthy',
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime(),
//     memory: process.memoryUsage(),
//     port: port
//   });
// });

// app.get('/api/vendor/health', (req, res) => {
//   res.json({
//     success: true,
//     status: 'Server is running',
//     timestamp: new Date().toISOString(),
//     port: port
//   });
// });

// // ---------- ERROR HANDLING MIDDLEWARE ----------
// app.use((err, req, res, next) => {
//   console.error('❌ Server Error:', err);

//   if (err instanceof multer.MulterError) {
//     if (err.code === 'FILE_TOO_LARGE') {
//       return res.status(413).json({
//         success: false,
//         message: 'File too large. Maximum size is 10MB.'
//       });
//     }
//     return res.status(400).json({
//       success: false,
//       message: err.message
//     });
//   }

//   res.status(500).json({
//     success: false,
//     message: 'Internal server error',
//     error: process.env.NODE_ENV === 'development' ? err.message : undefined
//   });
// });

// // ---------- 404 NOT FOUND ----------
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: `Route ${req.originalUrl} not found`
//   });
// });

// // ---------- START SERVER ----------
// app.listen(port, () => {
//   console.log(`🚀 Server running on port ${port}`);
//   console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
//   console.log(`📅 Started at: ${new Date().toLocaleString()}`);
// });


// const express = require("express");
// const mysql = require("mysql2");
// const bcrypt = require("bcrypt");
// const cors = require("cors");
// const jwt = require("jsonwebtoken");
// require("dotenv").config();
// const path = require('path');
// const fs = require('fs');
// const multer = require('multer');
// const nodemailer = require("nodemailer");
// const cookieParser = require("cookie-parser");
// const rateLimit = require('express-rate-limit');
// const crypto = require('crypto');
// const validator = require('validator');

// // ============================================================
// // SAFE JSON PARSER HELPER
// // ============================================================
// function safeParseJSON(data, defaultValue = null) {
//   // If data is null or undefined, return default value
//   if (data === null || data === undefined) {
//     return defaultValue;
//   }
  
//   // If data is already an object or array, return it as-is
//   if (typeof data === 'object') {
//     return data;
//   }
  
//   // If data is a string, try to parse it
//   if (typeof data === 'string') {
//     // Check if it's a valid JSON string
//     if (data === '' || data === 'null' || data === 'undefined') {
//       return defaultValue;
//     }
    
//     try {
//       return JSON.parse(data);
//     } catch (e) {
//       console.error('❌ JSON Parse Error:', e.message);
//       console.error('📝 Data:', data.substring(0, 200) + (data.length > 200 ? '...' : ''));
//       return defaultValue;
//     }
//   }
  
//   // For any other type, return the data as-is
//   return data;
// }

// // ============================================================
// // CORS CONFIGURATION
// // ============================================================
// const corsOptions = {
//   origin: function (origin, callback) {
//     const allowedOrigins = [
//       'http://localhost:3000',
//       'http://localhost:60174',
//       'http://localhost',
//       'http://192.168.0.4:3000',
//       'http://192.168.0.4:60174',
//       'http://192.168.0.4'
//     ];

//     if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//   allowedHeaders: [
//     'Content-Type',
//     'Authorization',
//     'Origin',
//     'Accept',
//     'X-Requested-With',
//     'X-App-Source',
//     'X-App-Version',
//     'X-Request-ID'
//   ],
//   credentials: true,
//   optionsSuccessStatus: 200
// };

// // ============================================================
// // CREATE UPLOAD DIRECTORIES
// // ============================================================
// function createUploadDirectories() {
//   const directories = [
//     path.join(__dirname, 'uploads'),
//     path.join(__dirname, 'uploads/profiles'),
//     path.join(__dirname, 'uploads/nids'),
//     path.join(__dirname, 'uploads/services'),
//     path.join(__dirname, 'uploads/cvs'),
//     path.join(__dirname, 'uploads/licenses'),
//     path.join(__dirname, 'uploads/reports')
//   ];

//   directories.forEach(dir => {
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir, { recursive: true });
//       console.log(`📁 Created directory: ${dir}`);
//     }
//   });
// }

// // ============================================================
// // APP SETUP
// // ============================================================
// const app = express();
// const port = 5001;

// // Middleware setup
// app.use(cors(corsOptions));
// app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.options('*', cors(corsOptions));
// app.use(cookieParser());
// app.use(express.urlencoded({ extended: true }));

// // Additional CORS middleware
// app.use((req, res, next) => {
//   const origin = req.headers.origin;

//   if (origin && origin.startsWith('http://localhost:')) {
//     res.header('Access-Control-Allow-Origin', origin);
//   }
//   if (origin && origin.startsWith('http://192.168.0.5:')) {
//     res.header('Access-Control-Allow-Origin', origin);
//   }

//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, Accept, X-Requested-With');
//   res.header('Access-Control-Allow-Credentials', 'true');
//   res.header('Access-Control-Max-Age', '86400');

//   if (req.method === 'OPTIONS') {
//     return res.status(200).end();
//   }

//   next();
// });

// createUploadDirectories();

// // ============================================================
// // DATABASE CONNECTION
// // ============================================================
// const db = mysql.createConnection({
//   host: "localhost",
//   user: "pacific",
//   password: "Nahid0088@gmail.com",
//   database: "auth_system",
// }).promise();

// // ============================================================
// // DATABASE INITIALIZATION
// // ============================================================
// const initializeDatabase = async () => {
//   try {
//     console.log("🔧 Initializing database tables...");

//     // Order schedule columns
//     const orderScheduleColumns = [
//       { name: 'schedule_changed', type: 'BOOLEAN DEFAULT FALSE' },
//       { name: 'schedule_changed_date', type: 'DATETIME' }
//     ];

//     for (const column of orderScheduleColumns) {
//       try {
//         await db.query(`ALTER TABLE orders ADD COLUMN ${column.name} ${column.type}`);
//         console.log(`✅ Added ${column.name} column to orders table`);
//       } catch (err) {
//         if (err.code === 'ER_DUP_FIELDNAME') {
//           console.log(`ℹ️ ${column.name} column already exists`);
//         } else {
//           console.error(`Error adding ${column.name}:`, err.message);
//         }
//       }
//     }

//     // schedule_changes table
//     try {
//       await db.query(`
//         CREATE TABLE IF NOT EXISTS schedule_changes (
//           id INT AUTO_INCREMENT PRIMARY KEY,
//           order_id VARCHAR(50) NOT NULL,
//           user_id VARCHAR(50) NOT NULL,
//           previous_date DATE NOT NULL,
//           previous_time_slot VARCHAR(50) NOT NULL,
//           new_date DATE NOT NULL,
//           new_time_slot VARCHAR(50) NOT NULL,
//           changed_by VARCHAR(50) NOT NULL,
//           reason TEXT,
//           change_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//           FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
//           INDEX idx_order_id (order_id),
//           INDEX idx_user_id (user_id)
//         )
//       `);
//       console.log("✅ schedule_changes table checked/created");
//     } catch (err) {
//       console.log("ℹ️ schedule_changes table already exists or error:", err.message);
//     }

//     // notifications table
//     try {
//       await db.query(`
//         CREATE TABLE IF NOT EXISTS notifications (
//           id INT AUTO_INCREMENT PRIMARY KEY,
//           user_id VARCHAR(50) NOT NULL,
//           user_type ENUM('user', 'vendor', 'admin') NOT NULL,
//           title VARCHAR(255) NOT NULL,
//           message TEXT NOT NULL,
//           type VARCHAR(50),
//           related_id VARCHAR(50),
//           is_read BOOLEAN DEFAULT FALSE,
//           read_at TIMESTAMP NULL,
//           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//           INDEX idx_user (user_id, user_type),
//           INDEX idx_unread (user_id, user_type, is_read)
//         )
//       `);
//       console.log("✅ notifications table checked/created");
//     } catch (err) {
//       console.log("ℹ️ notifications table already exists or error:", err.message);
//     }

//     // order_reviews table
//     try {
//       await db.query(`
//         CREATE TABLE IF NOT EXISTS order_reviews (
//           id INT AUTO_INCREMENT PRIMARY KEY,
//           order_id VARCHAR(50) NOT NULL,
//           user_id VARCHAR(50) NOT NULL,
//           service_expert_rating INT NOT NULL DEFAULT 5,
//           website_service_rating INT NOT NULL DEFAULT 5,
//           comments TEXT,
//           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//           FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
//           INDEX idx_order_id (order_id),
//           INDEX idx_user_id (user_id)
//         )
//       `);
//       console.log("✅ order_reviews table checked");
//     } catch (err) {
//       console.log("ℹ️ order_reviews table already exists");
//     }

//     // Orders table columns
//     const ordersColumns = [
//       { name: 'service_expert', type: 'TEXT' },
//       { name: 'reviews', type: 'TEXT' },
//       { name: 'assigned_date', type: 'DATETIME' },
//       { name: 'in_progress_date', type: 'DATETIME' },
//       { name: 'completed_date', type: 'DATETIME' },
//       { name: 'confirmed_date', type: 'DATETIME' },
//       { name: 'vendor_id', type: 'INT' },
//       { name: 'service_started_date', type: 'DATETIME' },
//       { name: 'cancelled_by', type: 'VARCHAR(50)' },
//       { name: 'cancelled_date', type: 'DATETIME' },
//       { name: 'penalty_fee', type: 'DECIMAL(10,2) DEFAULT 0.00' },
//       { name: 'hold_reason', type: 'TEXT' },
//       { name: 'checkout_charge', type: 'DECIMAL(10,2) DEFAULT 0.00' },
//       { name: 'hold_date', type: 'DATETIME' },
//       { name: 'updated_by', type: 'VARCHAR(50)' }
//     ];

//     for (const column of ordersColumns) {
//       try {
//         await db.query(`ALTER TABLE orders ADD COLUMN ${column.name} ${column.type}`);
//         console.log(`✅ Added ${column.name} column to orders table`);
//       } catch (err) {
//         if (err.code === 'ER_DUP_FIELDNAME') {
//           console.log(`ℹ️ ${column.name} column already exists`);
//         } else {
//           console.error(`Error adding ${column.name}:`, err.message);
//         }
//       }
//     }

//     // Foreign key
//     try {
//       await db.query(`
//         ALTER TABLE orders 
//         ADD FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE SET NULL
//       `);
//       console.log("✅ Added vendor_id foreign key");
//     } catch (err) {
//       if (err.code === 'ER_DUP_KEY' || err.code === 'ER_CANT_CREATE_TABLE') {
//         console.log("ℹ️ Foreign key already exists");
//       } else {
//         console.error("Error adding foreign key:", err.message);
//       }
//     }

//     // Indexes
//     try {
//       await db.query('CREATE INDEX idx_status ON orders(status)');
//       console.log("✅ Created idx_status index");
//     } catch (err) {
//       if (err.code === 'ER_DUP_KEYNAME') {
//         console.log("ℹ️ idx_status index already exists");
//       }
//     }

//     try {
//       await db.query('CREATE INDEX idx_vendor_id ON orders(vendor_id)');
//       console.log("✅ Created idx_vendor_id index");
//     } catch (err) {
//       if (err.code === 'ER_DUP_KEYNAME') {
//         console.log("ℹ️ idx_vendor_id index already exists");
//       }
//     }

//     // Users table reset token columns
//     try {
//       await db.query(`
//         ALTER TABLE users
//         ADD COLUMN reset_token VARCHAR(255),
//         ADD COLUMN reset_token_expiry DATETIME
//       `);
//       console.log("✅ Added reset token columns to users table");
//     } catch (err) {
//       if (err.code === 'ER_DUP_FIELDNAME') {
//         console.log("ℹ️ Reset token columns already exist in users table");
//       }
//     }

//     // Vendors table columns
//     const vendorColumns = [
//       { name: 'total_orders', type: 'INT DEFAULT 0' },
//       { name: 'completed_orders', type: 'INT DEFAULT 0' },
//       { name: 'pending_orders', type: 'INT DEFAULT 0' },
//       { name: 'canceled_orders', type: 'INT DEFAULT 0' },
//       { name: 'active_orders', type: 'INT DEFAULT 0' },
//       { name: 'hold_orders', type: 'INT DEFAULT 0' },
//       { name: 'success_rate', type: 'INT DEFAULT 0' },
//       { name: 'average_rating', type: 'DECIMAL(3,2) DEFAULT 0.0' },
//       { name: 'wallet_balance', type: 'DECIMAL(10,2) DEFAULT 0.0' },
//       { name: 'reset_token', type: 'VARCHAR(255)' },
//       { name: 'reset_token_expiry', type: 'DATETIME' }
//     ];

//     for (const column of vendorColumns) {
//       try {
//         await db.query(`ALTER TABLE vendors ADD COLUMN ${column.name} ${column.type}`);
//         console.log(`✅ Added ${column.name} column to vendors table`);
//       } catch (err) {
//         if (err.code === 'ER_DUP_FIELDNAME') {
//           console.log(`ℹ️ ${column.name} column already exists in vendors table`);
//         }
//       }
//     }

//     // Vendors table indexes
//     try {
//       await db.query('CREATE INDEX idx_vendor_status ON vendors(status)');
//       console.log("✅ Created idx_vendor_status index");
//     } catch (err) {
//       if (err.code === 'ER_DUP_KEYNAME') {
//         console.log("ℹ️ idx_vendor_status index already exists");
//       }
//     }

//     // vendor_cancellations table
//     try {
//       await db.query(`
//         CREATE TABLE IF NOT EXISTS vendor_cancellations (
//           id INT AUTO_INCREMENT PRIMARY KEY,
//           vendor_id INT NOT NULL,
//           order_id VARCHAR(50) NOT NULL,
//           user_id VARCHAR(50) NOT NULL,
//           penalty_amount DECIMAL(10,2) DEFAULT 0.00,
//           reason TEXT,
//           cancelled_by VARCHAR(50) NOT NULL,
//           vendor_amount DECIMAL(10,2) DEFAULT 0.00,
//           admin_amount DECIMAL(10,2) DEFAULT 0.00,
//           cancellation_type VARCHAR(50),
//           accepted_by_vendor BOOLEAN DEFAULT FALSE,
//           vendor_accepted_at TIMESTAMP NULL,
//           cancelled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//           FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
//           FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
//           INDEX idx_vendor_id (vendor_id),
//           INDEX idx_order_id (order_id)
//         )
//       `);
//       console.log("✅ vendor_cancellations table checked/created");
//     } catch (err) {
//       console.log("ℹ️ vendor_cancellations table already exists or error:", err.message);
//     }

//     // vendor_transactions table
//     try {
//       await db.query(`
//         CREATE TABLE IF NOT EXISTS vendor_transactions (
//           id INT AUTO_INCREMENT PRIMARY KEY,
//           vendor_id INT NOT NULL,
//           order_id VARCHAR(50),
//           amount DECIMAL(10,2) NOT NULL,
//           transaction_type VARCHAR(50) NOT NULL,
//           description TEXT,
//           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//           FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
//           INDEX idx_vendor_id (vendor_id)
//         )
//       `);
//       console.log("✅ vendor_transactions table checked/created");
//     } catch (err) {
//       console.log("ℹ️ vendor_transactions table already exists or error:", err.message);
//     }

//     // order_history table
//     try {
//       await db.query(`
//         CREATE TABLE IF NOT EXISTS order_history (
//           id INT AUTO_INCREMENT PRIMARY KEY,
//           order_id VARCHAR(50) NOT NULL,
//           status VARCHAR(50),
//           action_by VARCHAR(50),
//           action_type VARCHAR(50),
//           details TEXT,
//           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//           INDEX idx_order_id (order_id)
//         )
//       `);
//       console.log("✅ order_history table checked/created");
//     } catch (err) {
//       console.log("ℹ️ order_history table already exists or error:", err.message);
//     }

//     console.log("🎉 Database initialization completed successfully!");

//   } catch (error) {
//     console.error("❌ Database initialization error:", error);
//   }
// };

// // Database connection
// db.connect(async (err) => {
//   if (err) {
//     console.error("Database connection error:", err);
//   } else {
//     console.log("Connected to MySQL database");
//     await initializeDatabase();
//   }
// });

// // ============================================================
// // MULTER CONFIGURATION
// // ============================================================
// const profileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = path.join(__dirname, 'uploads/profiles');
//     fs.mkdirSync(dir, { recursive: true });
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     cb(null, `profile-${Date.now()}${ext}`);
//   }
// });

// const serviceStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = path.join(__dirname, 'uploads/services');
//     fs.mkdirSync(dir, { recursive: true });
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     cb(null, `service-${Date.now()}${ext}`);
//   }
// });

// const vendorStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     let dir;
//     switch (file.fieldname) {
//       case 'profile_image':
//         dir = path.join(__dirname, 'uploads/profiles');
//         break;
//       case 'nid_front':
//       case 'nid_back':
//         dir = path.join(__dirname, 'uploads/nids');
//         break;
//       case 'cv':
//         dir = path.join(__dirname, 'uploads/cvs');
//         break;
//       case 'trade_license':
//         dir = path.join(__dirname, 'uploads/licenses');
//         break;
//       default:
//         dir = path.join(__dirname, 'uploads/others');
//     }
//     fs.mkdirSync(dir, { recursive: true });
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const timestamp = Date.now();
//     cb(null, `${file.fieldname}-${timestamp}${ext}`);
//   }
// });

// const imageFileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png|gif/;
//   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = allowedTypes.test(file.mimetype);

//   if (mimetype && extname) {
//     cb(null, true);
//   } else {
//     cb(new Error('শুধুমাত্র ইমেজ ফাইল (JPEG, JPG, PNG, GIF) অনুমোদিত'), false);
//   }
// };

// const uploadProfile = multer({
//   storage: profileStorage,
//   limits: { fileSize: 5 * 1024 * 1024 },
//   fileFilter: imageFileFilter
// });

// const uploadService = multer({
//   storage: serviceStorage,
//   limits: { fileSize: 10 * 1024 * 1024 },
//   fileFilter: imageFileFilter
// });

// const uploadVendorDocs = multer({
//   storage: vendorStorage,
//   limits: { fileSize: 10 * 1024 * 1024 },
//   fileFilter: (req, file, cb) => {
//     cb(null, true);
//   }
// });

// // ============================================================
// // AUTHENTICATION MIDDLEWARE
// // ============================================================
// const authenticateJWT = (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   if (!authHeader) {
//     return res.status(401).json({ success: false, message: "Authorization header missing" });
//   }

//   const token = authHeader.split(" ")[1];
//   if (!token) {
//     return res.status(401).json({ success: false, message: "Token missing" });
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(403).json({ success: false, message: "Invalid token" });
//     }
//     req.user = decoded;
//     next();
//   });
// };

// const verifyToken = (roles = []) => (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

//   if (!token) {
//     return res.status(401).json({ success: false, message: "Authorization token missing" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     if (decoded.role === 'superadmin') {
//       req.user = decoded;
//       return next();
//     }

//     if (roles.length > 0 && !roles.includes(decoded.role)) {
//       return res.status(403).json({
//         success: false,
//         message: `Requires one of these roles: ${roles.join(', ')}`
//       });
//     }

//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(403).json({
//       success: false,
//       message: "Invalid or expired token",
//       error: err.message
//     });
//   }
// };

// const authenticateAdmin = (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({
//         success: false,
//         message: 'No token provided'
//       });
//     }

//     const token = authHeader.split(' ')[1];

//     jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, decoded) => {
//       if (err) {
//         console.error('Token verification error:', err);
//         return res.status(403).json({
//           success: false,
//           message: 'Invalid or expired token'
//         });
//       }

//       const allowedRoles = ['admin', 'superadmin'];
//       if (!allowedRoles.includes(decoded.role)) {
//         return res.status(403).json({
//           success: false,
//           message: 'Access denied. Admin privileges required.'
//         });
//       }

//       req.user = decoded;
//       next();
//     });
//   } catch (error) {
//     console.error('Admin auth error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Authentication failed'
//     });
//   }
// };

// const authenticateVendor = async (req, res, next) => {
//   try {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Access token required"
//       });
//     }

//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//       if (err) {
//         console.log('❌ Token verification failed:', err.message);
//         return res.status(403).json({
//           success: false,
//           message: "Invalid or expired token"
//         });
//       }

//       if (decoded.role !== 'vendor') {
//         return res.status(403).json({
//           success: false,
//           message: "Access denied. Vendor role required."
//         });
//       }

//       let vendorId = decoded.userId || decoded.id || decoded.vendorId || decoded.user_id;

//       if (!vendorId && decoded.user && decoded.user.id) {
//         vendorId = decoded.user.id;
//       }

//       if (!vendorId) {
//         req.vendor = {
//           email: decoded.email || decoded.userEmail,
//           role: decoded.role,
//         };
//       } else {
//         req.vendor = {
//           vendorId: vendorId,
//           email: decoded.email || decoded.userEmail,
//           role: decoded.role
//         };
//       }

//       next();
//     });
//   } catch (error) {
//     console.error("❌ Authentication error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Authentication failed"
//     });
//   }
// };

// // ============================================================
// // HELPER FUNCTIONS
// // ============================================================

// async function updateVendorStats(orderId, oldStatus, newStatus, vendorId, serviceExpert = null) {
//   if (!vendorId || oldStatus === newStatus) return;

//   try {
//     await db.query('START TRANSACTION');

//     console.log(`📊 Updating vendor stats: ${oldStatus} → ${newStatus}`);

//     const decrementMap = {
//       'Pending': 'pending_orders',
//       'Active': 'active_orders',
//       'Processing': 'active_orders',
//       'Started': 'active_orders',
//       'Completed': 'completed_orders',
//       'Cancelled': 'canceled_orders',
//       'Hold': 'hold_orders'
//     };

//     if (decrementMap[oldStatus]) {
//       await db.query(
//         `UPDATE vendors SET ${decrementMap[oldStatus]} = GREATEST(0, ${decrementMap[oldStatus]} - 1) WHERE id = ?`,
//         [vendorId]
//       );
//       console.log(`   ✅ Decremented ${decrementMap[oldStatus]}`);
//     }

//     const incrementMap = {
//       'Pending': 'pending_orders',
//       'Active': 'active_orders',
//       'Processing': 'active_orders',
//       'Started': 'active_orders',
//       'Completed': 'completed_orders',
//       'Cancelled': 'canceled_orders',
//       'Hold': 'hold_orders'
//     };

//     if (incrementMap[newStatus]) {
//       await db.query(
//         `UPDATE vendors SET ${incrementMap[newStatus]} = ${incrementMap[newStatus]} + 1 WHERE id = ?`,
//         [vendorId]
//       );
//       console.log(`   ✅ Incremented ${incrementMap[newStatus]}`);
//     }

//     if (newStatus === 'Completed') {
//       await db.query(
//         'UPDATE vendors SET total_orders = total_orders + 1 WHERE id = ?',
//         [vendorId]
//       );
//       console.log(`   ✅ Incremented total_orders`);

//       if (serviceExpert) {
//         try {
//           const expertData = safeParseJSON(serviceExpert, null);
          
//           if (expertData && expertData.rating) {
//             await db.query(
//               `UPDATE vendors v
//                SET v.average_rating = (
//                  SELECT COALESCE(AVG(
//                    CASE 
//                      WHEN JSON_EXTRACT(o.service_expert, '$.rating') IS NOT NULL 
//                      THEN JSON_EXTRACT(o.service_expert, '$.rating')
//                      ELSE 0 
//                    END
//                  ), 0)
//                  FROM orders o
//                  WHERE o.vendor_id = v.id 
//                  AND o.status = 'Completed'
//                  AND o.service_expert IS NOT NULL
//                )
//                WHERE v.id = ?`,
//               [vendorId]
//             );
//             console.log(`   ✅ Updated average_rating`);
//           }
//         } catch (e) {
//           console.error('   ⚠️ Rating update error:', e.message);
//         }
//       }
//     }

//     await db.query(
//       `UPDATE vendors v
//        SET v.success_rate = (
//          SELECT CASE 
//            WHEN (completed_orders + canceled_orders) > 0 
//            THEN ROUND((completed_orders / (completed_orders + canceled_orders)) * 100)
//            ELSE 0 
//          END
//          FROM vendors v2
//          WHERE v2.id = v.id
//        )
//        WHERE v.id = ?`,
//       [vendorId]
//     );
//     console.log(`   ✅ Updated success_rate`);

//     await db.query('COMMIT');
//     console.log(`✅ Vendor ${vendorId} stats updated successfully`);

//   } catch (error) {
//     await db.query('ROLLBACK');
//     console.error('❌ Vendor stats update error:', error);
//     throw error;
//   }
// }

// function hasServiceStarted(order) {
//   try {
//     if (order.service_started_date) return true;
//     if (order.time_slot && order.order_date) {
//       const orderDate = new Date(order.order_date);
//       const [startTimeStr] = order.time_slot.split('-');
//       const [hours, minutes] = startTimeStr.split(':').map(Number);
//       const serviceStartTime = new Date(orderDate);
//       serviceStartTime.setHours(hours, minutes, 0, 0);
//       return new Date() >= serviceStartTime;
//     }
//     return false;
//   } catch (error) {
//     return false;
//   }
// }

// // ============================================================
// // API ENDPOINTS
// // ============================================================

// // ---------- VENDOR ORDER ASSIGNMENT ----------
// app.patch('/orders/:orderId/assign', verifyToken(['admin', 'superadmin']), async (req, res) => {
//   const orderId = decodeURIComponent(req.params.orderId);
//   const { vendor_id, status } = req.body;

//   try {
//     const [orderRows] = await db.query(
//       'SELECT * FROM orders WHERE order_id = ?',
//       [orderId]
//     );

//     if (orderRows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found',
//         debug: { orderId: orderId }
//       });
//     }

//     const order = orderRows[0];
//     let vendorData = null;

//     if (vendor_id) {
//       const [vendorRows] = await db.query(
//         'SELECT * FROM vendors WHERE id = ? AND status = ?',
//         [vendor_id, 'active']
//       );

//       if (vendorRows.length === 0) {
//         return res.status(404).json({
//           success: false,
//           message: 'Vendor not found or not active'
//         });
//       }
//       vendorData = vendorRows[0];
//     }

//     const updateData = {
//       vendor_id: vendor_id || null,
//       status: vendor_id ? 'Active' : (status || 'Pending'),
//       assigned_date: vendor_id ? new Date() : null,
//       confirmed_date: vendor_id ? new Date() : null
//     };

//     if (!vendor_id && order.vendor_id) {
//       await db.query(
//         `UPDATE vendors 
//          SET pending_orders = GREATEST(0, pending_orders - 1),
//              updated_at = NOW()
//          WHERE id = ?`,
//         [order.vendor_id]
//       );
//       updateData.status = 'Pending';
//     }

//     await db.query(
//       'UPDATE orders SET ? WHERE order_id = ?',
//       [updateData, orderId]
//     );

//     if (vendor_id) {
//       await db.query(
//         `UPDATE vendors 
//          SET total_orders = total_orders + 1,
//              pending_orders = pending_orders + 1,
//              updated_at = NOW()
//          WHERE id = ?`,
//         [vendor_id]
//       );
//     }

//     await db.query(
//       `INSERT INTO order_history 
//        (order_id, status, action_by, action_type, details) 
//        VALUES (?, ?, ?, ?, ?)`,
//       [
//         orderId,
//         updateData.status,
//         req.user.id,
//         vendor_id ? 'vendor_assigned' : 'vendor_removed',
//         vendor_id
//           ? `Vendor ${vendorData?.name} assigned - Order set to Active`
//           : 'Vendor removed - Order set to Pending'
//       ]
//     );

//     res.json({
//       success: true,
//       message: vendor_id
//         ? 'Order assigned to vendor and set to Active'
//         : 'Vendor removed from order',
//       order: {
//         order_id: orderId,
//         status: updateData.status,
//         vendor_id: vendor_id,
//         vendor_data: vendorData,
//         assigned_date: updateData.assigned_date,
//         confirmed_date: updateData.confirmed_date
//       }
//     });

//   } catch (error) {
//     console.error('Order assignment error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to assign order',
//       error: error.message
//     });
//   }
// });

// // ---------- ORDER COMPLETION ----------
// app.patch('/orders/:orderId/complete', verifyToken(['admin', 'vendor', 'superadmin']), async (req, res) => {
//   const { orderId } = req.params;
//   const userRole = req.user.role;

//   try {
//     const [orderRows] = await db.query(
//       'SELECT * FROM orders WHERE order_id = ?',
//       [orderId]
//     );

//     if (orderRows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     const order = orderRows[0];

//     if (userRole === 'vendor' && order.vendor_id !== req.user.vendorId) {
//       return res.status(403).json({
//         success: false,
//         message: 'You can only complete your assigned orders'
//       });
//     }

//     await db.query(
//       `UPDATE orders 
//        SET status = 'Completed',
//            completed_date = NOW()
//        WHERE order_id = ?`,
//       [orderId]
//     );

//     if (order.vendor_id) {
//       await db.query(
//         `UPDATE vendors 
//          SET completed_orders = completed_orders + 1,
//              pending_orders = pending_orders - 1,
//              updated_at = NOW()
//          WHERE id = ?`,
//         [order.vendor_id]
//       );
//     }

//     res.json({
//       success: true,
//       message: 'Order marked as completed',
//       order: {
//         order_id: orderId,
//         status: 'Completed',
//         completed_date: new Date()
//       }
//     });
//   } catch (error) {
//     console.error('Order completion error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to complete order'
//     });
//   }
// });

// // ---------- VENDOR ORDERS ----------
// app.get('/api/vendor/orders', authenticateVendor, async (req, res) => {
//   try {
//     const vendorId = req.vendor.vendorId;

//     const [orders] = await db.query(
//       `SELECT 
//         o.order_id,
//         o.user_id,
//         o.order_date,
//         o.time_slot,
//         o.notes,
//         o.address_type,
//         o.home_address,
//         o.office_address,
//         o.temp_address,
//         o.recipient_name,
//         o.recipient_phone,
//         o.cart_items,
//         o.status,
//         o.cancel_reason,
//         o.service_expert,
//         o.assigned_date,
//         o.completed_date,
//         u.name AS customer_name,
//         u.email AS customer_email,
//         u.phone_number AS customer_phone
//       FROM orders o
//       LEFT JOIN users u ON o.user_id = u.custom_id
//       WHERE o.vendor_id = ?
//       ORDER BY o.order_date DESC`,
//       [vendorId]
//     );

//     const parsedOrders = orders.map(order => {
//       // Use safe parser for all JSON fields
//       const parsedCart = safeParseJSON(order.cart_items, []);
//       const parsedServiceExpert = safeParseJSON(order.service_expert, null);
      
//       let addressField = null;
//       if (order.address_type === 'home' && order.home_address) {
//         addressField = order.home_address;
//       } else if (order.address_type === 'office' && order.office_address) {
//         addressField = order.office_address;
//       } else if (order.address_type === 'another' && order.temp_address) {
//         addressField = order.temp_address;
//       }
      
//       const parsedAddress = safeParseJSON(addressField, {});

//       // Ensure parsedCart is an array
//       const cartItems = Array.isArray(parsedCart) ? parsedCart : [];
//       const total = cartItems.reduce((sum, item) =>
//         sum + ((item?.price || 0) * (item?.quantity || 0)), 0
//       );

//       return {
//         ...order,
//         cart_items: cartItems,
//         service_expert: parsedServiceExpert,
//         address: parsedAddress,
//         total: total.toFixed(2)
//       };
//     });

//     res.json({
//       success: true,
//       orders: parsedOrders
//     });
//   } catch (error) {
//     console.error('Vendor orders error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch orders'
//     });
//   }
// });

// // ---------- ORDER REVIEW SUBMISSION ----------
// app.post('/orders/:orderId/review', authenticateJWT, async (req, res) => {
//   const { orderId } = req.params;
//   const { serviceExpert, websiteService, comments } = req.body;
//   const userId = req.user.userId;

//   try {
//     const [orderRows] = await db.query(
//       `SELECT * FROM orders 
//        WHERE order_id = ? AND user_id = ? AND status = 'Completed'`,
//       [orderId, userId]
//     );

//     if (orderRows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found or not completed'
//       });
//     }

//     const [existingReview] = await db.query(
//       'SELECT id FROM order_reviews WHERE order_id = ?',
//       [orderId]
//     );

//     if (existingReview.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Review already submitted for this order'
//       });
//     }

//     const reviewData = {
//       order_id: orderId,
//       user_id: userId,
//       service_expert_rating: serviceExpert || 5,
//       website_service_rating: websiteService || 5,
//       comments: comments || '',
//       created_at: new Date()
//     };

//     await db.query(
//       `INSERT INTO order_reviews 
//        (order_id, user_id, service_expert_rating, website_service_rating, comments, created_at) 
//        VALUES (?, ?, ?, ?, ?, ?)`,
//       [
//         reviewData.order_id,
//         reviewData.user_id,
//         reviewData.service_expert_rating,
//         reviewData.website_service_rating,
//         reviewData.comments,
//         reviewData.created_at
//       ]
//     );

//     const reviewSummary = {
//       serviceExpert: reviewData.service_expert_rating,
//       websiteService: reviewData.website_service_rating,
//       comments: reviewData.comments,
//       reviewedAt: reviewData.created_at
//     };

//     await db.query(
//       'UPDATE orders SET reviews = ? WHERE order_id = ?',
//       [JSON.stringify(reviewSummary), orderId]
//     );

//     res.json({
//       success: true,
//       message: 'Review submitted successfully',
//       review: reviewData
//     });
//   } catch (error) {
//     console.error('Review submission error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to submit review'
//     });
//   }
// });

// // ---------- GET ORDER REVIEWS ----------
// app.get('/orders/:orderId/reviews', async (req, res) => {
//   const { orderId } = req.params;

//   try {
//     const [reviews] = await db.query(
//       `SELECT 
//         r.*,
//         u.name as user_name,
//         u.photo as user_photo
//        FROM order_reviews r
//        LEFT JOIN users u ON r.user_id = u.custom_id
//        WHERE r.order_id = ?
//        ORDER BY r.created_at DESC`,
//       [orderId]
//     );

//     if (reviews.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'No reviews found for this order'
//       });
//     }

//     res.json({
//       success: true,
//       reviews: reviews.map(review => ({
//         id: review.id,
//         order_id: review.order_id,
//         user_name: review.user_name,
//         user_photo: review.user_photo,
//         service_expert_rating: review.service_expert_rating,
//         website_service_rating: review.website_service_rating,
//         comments: review.comments,
//         created_at: review.created_at
//       }))
//     });
//   } catch (error) {
//     console.error('Get reviews error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch reviews'
//     });
//   }
// });

// // ---------- ORDER TRACKING ----------
// app.get('/orders/:orderId/tracking', authenticateJWT, async (req, res) => {
//   const { orderId } = req.params;
//   const userId = req.user.userId;

//   try {
//     const [orderRows] = await db.query(
//       `SELECT 
//         o.*,
//         u.name as customer_name,
//         u.email as customer_email,
//         u.phone_number as customer_phone,
//         v.name as vendor_name,
//         v.email as vendor_email,
//         v.phone_number as vendor_phone,
//         v.vendor_photo as vendor_photo
//        FROM orders o
//        LEFT JOIN users u ON o.user_id = u.custom_id
//        LEFT JOIN vendors v ON o.vendor_id = v.id
//        WHERE o.order_id = ? AND o.user_id = ?`,
//       [orderId, userId]
//     );

//     if (orderRows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     const order = orderRows[0];

//     const parsedCart = safeParseJSON(order.cart_items, []);
//     const parsedServiceExpert = safeParseJSON(order.service_expert, null);
//     const parsedReviews = safeParseJSON(order.reviews, null);

//     let addressField = null;
//     if (order.address_type === 'home' && order.home_address) {
//       addressField = order.home_address;
//     } else if (order.address_type === 'office' && order.office_address) {
//       addressField = order.office_address;
//     } else if (order.address_type === 'another' && order.temp_address) {
//       addressField = order.temp_address;
//     }

//     const parsedAddress = safeParseJSON(addressField, {});
//     const cartItems = Array.isArray(parsedCart) ? parsedCart : [];
//     const total = cartItems.reduce((sum, item) =>
//       sum + ((item?.price || 0) * (item?.quantity || 0)), 0
//     );

//     const timeline = [
//       {
//         status: 'Order Placed',
//         time: order.order_date,
//         description: 'Order has been placed successfully',
//         completed: true
//       },
//       {
//         status: 'Order Confirmed',
//         time: order.confirmed_date || null,
//         description: 'Order has been confirmed',
//         completed: !!order.confirmed_date
//       },
//       {
//         status: 'Vendor Assigned',
//         time: order.assigned_date || null,
//         description: order.vendor_name ? `Assigned to ${order.vendor_name}` : 'Waiting for vendor assignment',
//         completed: !!order.assigned_date
//       },
//       {
//         status: 'Service In Progress',
//         time: order.in_progress_date || null,
//         description: 'Service expert is on the way',
//         completed: order.status === 'Active' || order.status === 'Completed'
//       },
//       {
//         status: 'Completed',
//         time: order.completed_date || null,
//         description: 'Service has been completed',
//         completed: order.status === 'Completed'
//       }
//     ];

//     res.json({
//       success: true,
//       order: {
//         order_id: order.order_id,
//         status: order.status,
//         timeline: timeline,
//         customer: {
//           name: order.customer_name,
//           email: order.customer_email,
//           phone: order.customer_phone
//         },
//         vendor: order.vendor_id ? {
//           name: order.vendor_name,
//           email: order.vendor_email,
//           phone: order.vendor_phone,
//           photo: order.vendor_photo
//         } : null,
//         service_expert: parsedServiceExpert,
//         address: parsedAddress,
//         cart_items: cartItems,
//         total: total.toFixed(2),
//         reviews: parsedReviews,
//         time_slot: order.time_slot,
//         notes: order.notes || '',
//         cancel_reason: order.cancel_reason || null
//       }
//     });
//   } catch (error) {
//     console.error('Tracking error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch tracking information'
//     });
//   }
// });

// // ---------- VERIFY RESET TOKEN ----------
// app.post('/api/verify-reset-token', async (req, res) => {
//   const { token, email } = req.body;

//   if (!token || !email) {
//     return res.status(400).json({
//       success: false,
//       message: 'Token and email are required'
//     });
//   }

//   try {
//     const [users] = await db.query(
//       "SELECT email FROM users WHERE reset_token = ? AND email = ? AND reset_token_expiry > NOW()",
//       [token, email]
//     );

//     const [vendors] = await db.query(
//       "SELECT email FROM vendors WHERE reset_token = ? AND email = ? AND reset_token_expiry > NOW()",
//       [token, email]
//     );

//     const isValid = users.length > 0 || vendors.length > 0;

//     if (!isValid) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid or expired token'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Token is valid'
//     });
//   } catch (error) {
//     console.error('Token verification error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Token verification failed'
//     });
//   }
// });

// // ---------- RESET PASSWORD ----------
// app.post('/api/reset-password', async (req, res) => {
//   const { token, email, newPassword } = req.body;

//   if (!token || !email || !newPassword) {
//     return res.status(400).json({
//       success: false,
//       message: 'All fields are required'
//     });
//   }

//   if (newPassword.length < 6) {
//     return res.status(400).json({
//       success: false,
//       message: 'Password must be at least 6 characters'
//     });
//   }

//   try {
//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     const [users] = await db.query(
//       "SELECT * FROM users WHERE reset_token = ? AND email = ? AND reset_token_expiry > NOW()",
//       [token, email]
//     );

//     const [vendors] = await db.query(
//       "SELECT * FROM vendors WHERE reset_token = ? AND email = ? AND reset_token_expiry > NOW()",
//       [token, email]
//     );

//     let userType = null;

//     if (users.length > 0) {
//       userType = 'user';
//     } else if (vendors.length > 0) {
//       userType = 'vendor';
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid or expired token'
//       });
//     }

//     if (userType === 'user') {
//       await db.query(
//         "UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE email = ?",
//         [hashedPassword, email]
//       );
//     } else if (userType === 'vendor') {
//       await db.query(
//         "UPDATE vendors SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE email = ?",
//         [hashedPassword, email]
//       );
//     }

//     res.json({
//       success: true,
//       message: 'Password reset successfully'
//     });
//   } catch (error) {
//     console.error('Password reset error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Password reset failed'
//     });
//   }
// });

// // ---------- FILTER ORDERS ----------
// app.get('/orders/filter', authenticateJWT, async (req, res) => {
//   const userId = req.user.userId;
//   const { status, dateFrom, dateTo, search } = req.query;

//   try {
//     let query = `
//       SELECT * FROM orders 
//       WHERE user_id = ?
//     `;
//     const params = [userId];

//     if (status && status !== 'all') {
//       if (status === 'active') {
//         query += ` AND status NOT IN ('Pending', 'Cancelled', 'Completed')`;
//       } else {
//         query += ` AND status = ?`;
//         params.push(status);
//       }
//     }

//     if (dateFrom) {
//       query += ` AND order_date >= ?`;
//       params.push(dateFrom);
//     }
//     if (dateTo) {
//       query += ` AND order_date <= ?`;
//       params.push(dateTo);
//     }

//     if (search) {
//       query += ` AND (order_id LIKE ? OR status LIKE ? OR notes LIKE ?)`;
//       const searchParam = `%${search}%`;
//       params.push(searchParam, searchParam, searchParam);
//     }

//     query += ` ORDER BY order_date DESC`;

//     const [orders] = await db.query(query, params);

//     const parsedOrders = orders.map(order => {
//       const parsedCart = safeParseJSON(order.cart_items, []);
//       const parsedServiceExpert = safeParseJSON(order.service_expert, null);

//       let addressField = null;
//       if (order.address_type === 'home' && order.home_address) {
//         addressField = order.home_address;
//       } else if (order.address_type === 'office' && order.office_address) {
//         addressField = order.office_address;
//       } else if (order.address_type === 'another' && order.temp_address) {
//         addressField = order.temp_address;
//       }

//       const parsedAddress = safeParseJSON(addressField, {});
//       const cartItems = Array.isArray(parsedCart) ? parsedCart : [];
//       const total = cartItems.reduce((sum, item) =>
//         sum + ((item?.price || 0) * (item?.quantity || 0)), 0
//       );

//       return {
//         ...order,
//         cart_items: cartItems,
//         service_expert: parsedServiceExpert,
//         address: parsedAddress,
//         total: total.toFixed(2)
//       };
//     });

//     res.json({
//       success: true,
//       orders: parsedOrders,
//       count: parsedOrders.length
//     });
//   } catch (error) {
//     console.error('Filter orders error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to filter orders'
//     });
//   }
// });

// // ---------- ORDER CONFIRMATION ----------
// app.patch('/orders/:orderId/confirm', verifyToken(['admin', 'superadmin']), async (req, res) => {
//   const { orderId } = req.params;

//   try {
//     const [orderRows] = await db.query(
//       'SELECT * FROM orders WHERE order_id = ?',
//       [orderId]
//     );

//     if (orderRows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     const order = orderRows[0];

//     if (order.status !== 'Pending') {
//       return res.status(400).json({
//         success: false,
//         message: 'Order is not in Pending status'
//       });
//     }

//     await db.query(
//       `UPDATE orders 
//        SET status = 'Active',
//            confirmed_date = NOW()
//        WHERE order_id = ?`,
//       [orderId]
//     );

//     res.json({
//       success: true,
//       message: 'Order confirmed successfully',
//       order: {
//         order_id: orderId,
//         status: 'Active',
//         confirmed_date: new Date()
//       }
//     });
//   } catch (error) {
//     console.error('Order confirmation error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to confirm order'
//     });
//   }
// });

// // ---------- GET VENDOR DETAILS ----------
// app.get('/api/vendors/:vendorId', verifyToken(['admin', 'superadmin', 'user']), async (req, res) => {
//   const vendorId = req.params.vendorId;

//   try {
//     const [columns] = await db.query(`
//       SELECT COLUMN_NAME 
//       FROM INFORMATION_SCHEMA.COLUMNS 
//       WHERE TABLE_NAME = 'vendors' 
//       AND TABLE_SCHEMA = DATABASE()
//     `);

//     const availableColumns = columns.map(col => col.COLUMN_NAME);
//     console.log('Available columns:', availableColumns);

//     const desiredColumns = [
//       'id', 'name', 'email', 'phone_number',
//       'dob', 'nid_number', 'company_name', 'permanent_address',
//       'present_address', 'business_address', 'technician_quantity',
//       'vendor_photo', 'service_areas', 'services', 'rating', 
//       'completed_orders', 'pending_orders', 'canceled_orders',
//       'specialization', 'vehicle_type', 'working_hours', 'location',
//       'service_radius', 'verified', 'status', 'created_at',
//       'total_orders', 'active_orders', 'hold_orders', 'success_rate',
//       'average_rating', 'wallet_balance'
//     ];

//     const columnsToSelect = desiredColumns.filter(col => availableColumns.includes(col));

//     if (columnsToSelect.length === 0) {
//       columnsToSelect.push('id', 'name', 'email', 'phone_number', 'rating', 'created_at');
//     }

//     const selectQuery = `
//       SELECT ${columnsToSelect.join(', ')}
//       FROM vendors 
//       WHERE id = ?
//     `;

//     const [vendorRows] = await db.query(selectQuery, [vendorId]);

//     if (vendorRows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Vendor not found'
//       });
//     }

//     const vendor = vendorRows[0];

//     vendor.service_areas = safeParseJSON(vendor.service_areas, []);
//     vendor.services = safeParseJSON(vendor.services, []);

//     const completed = vendor.completed_orders || 0;
//     const canceled = vendor.canceled_orders || 0;

//     if (completed > 0) {
//       const totalOrders = completed + canceled;
//       vendor.success_rate = Math.round((completed / totalOrders) * 100);
//     } else {
//       vendor.success_rate = 0;
//     }

//     vendor.avg_rating = vendor.rating || 4.5;

//     if (vendor.dob) {
//       const dobDate = new Date(vendor.dob);
//       const currentDate = new Date();
//       let yearsDiff = currentDate.getFullYear() - dobDate.getFullYear();

//       const monthDiff = currentDate.getMonth() - dobDate.getMonth();
//       if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < dobDate.getDate())) {
//         yearsDiff--;
//       }

//       vendor.experience_years = Math.max(1, yearsDiff - 18);
//     } else {
//       const createdDate = new Date(vendor.created_at);
//       const currentDate = new Date();
//       const yearsDiff = currentDate.getFullYear() - createdDate.getFullYear();
//       vendor.experience_years = Math.max(1, yearsDiff);
//     }

//     vendor.total_reviews = Math.floor(vendor.completed_orders * 0.7) || 25;

//     if (!vendor.specialization) {
//       if (vendor.services && vendor.services.length > 0) {
//         vendor.specialization = vendor.services[0];
//       } else {
//         vendor.specialization = 'General Services';
//       }
//     }

//     if (!vendor.vehicle_type) vendor.vehicle_type = 'Motorcycle';
//     if (!vendor.working_hours) vendor.working_hours = '9:00 AM - 6:00 PM';
//     if (!vendor.location) {
//       if (vendor.service_areas && vendor.service_areas.length > 0) {
//         vendor.location = vendor.service_areas[0];
//       } else if (vendor.permanent_address) {
//         vendor.location = vendor.permanent_address;
//       } else {
//         vendor.location = 'Location not specified';
//       }
//     }
//     if (!vendor.service_radius) vendor.service_radius = 10;
//     if (vendor.verified === undefined || vendor.verified === null) vendor.verified = true;

//     vendor.photo = vendor.vendor_photo || null;

//     delete vendor.password;
//     if (vendor.hashedPassword) delete vendor.hashedPassword;

//     res.json({
//       success: true,
//       vendor: vendor
//     });

//   } catch (error) {
//     console.error('Fetch vendor error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch vendor details',
//       error: error.message
//     });
//   }
// });

// // ---------- REPORT ISSUE ----------
// app.post('/orders/:orderId/report', verifyToken(['user', 'admin']), async (req, res) => {
//   const orderId = decodeURIComponent(req.params.orderId);
//   const userId = req.user.id;

//   try {
//     const [orderRows] = await db.query(
//       'SELECT * FROM orders WHERE order_id = ?',
//       [orderId]
//     );

//     if (orderRows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     const order = orderRows[0];

//     if (order.user_id !== userId && req.user.role !== 'admin' && req.user.role !== 'superadmin') {
//       return res.status(403).json({
//         success: false,
//         message: 'You can only report issues for your own orders'
//       });
//     }

//     let fileUrl = null;
//     if (req.files && req.files.file) {
//       const file = req.files.file;
//       const fileName = `${Date.now()}_${file.name}`;
//       const uploadPath = path.join(__dirname, 'uploads', 'reports', fileName);

//       const dirPath = path.join(__dirname, 'uploads', 'reports');
//       if (!fs.existsSync(dirPath)) {
//         fs.mkdirSync(dirPath, { recursive: true });
//       }

//       await file.mv(uploadPath);
//       fileUrl = `/uploads/reports/${fileName}`;
//     }

//     const [result] = await db.query(
//       `INSERT INTO order_reports 
//        (order_id, user_id, description, file_url, status, created_at) 
//        VALUES (?, ?, ?, ?, ?, NOW())`,
//       [orderId, userId, req.body.description, fileUrl, 'pending']
//     );

//     await db.query(
//       `UPDATE orders 
//        SET notes = CONCAT(IFNULL(notes, ''), '\n[${new Date().toLocaleString()}]: Issue reported - ${req.body.description}')
//        WHERE order_id = ?`,
//       [orderId]
//     );

//     res.json({
//       success: true,
//       message: 'Issue reported successfully',
//       reportId: result.insertId
//     });

//   } catch (error) {
//     console.error('Report error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to submit report'
//     });
//   }
// });

// // ---------- USER PROFILE UPDATE ----------
// app.put(
//   "/api/user-profile",
//   authenticateJWT,
//   uploadProfile.single("photo"),
//   async (req, res) => {
//     const userId = req.user.userId;

//     try {
//       const { name, phone_number } = req.body;

//       if (!name || name.trim() === '') {
//         return res.status(400).json({
//           success: false,
//           message: "Name is required"
//         });
//       }

//       let home_address = {};
//       let office_address = {};

//       try {
//         home_address = safeParseJSON(req.body.home_address, {});
//         office_address = safeParseJSON(req.body.office_address, {});
//       } catch (parseError) {
//         console.error("Address parsing error:", parseError);
//       }

//       const updateFields = {
//         name: name.trim(),
//         phone_number: phone_number || null,
//         home_address: JSON.stringify(home_address),
//         office_address: JSON.stringify(office_address),
//       };

//       if (req.file) {
//         const photoPath = `/uploads/profiles/${req.file.filename}`;
//         updateFields.photo = photoPath;
//       }

//       Object.keys(updateFields).forEach(key => {
//         if (updateFields[key] === undefined) {
//           delete updateFields[key];
//         }
//       });

//       await db.query("UPDATE users SET ? WHERE custom_id = ?", [
//         updateFields,
//         userId,
//       ]);

//       const [updated] = await db.query(
//         "SELECT * FROM users WHERE custom_id = ?",
//         [userId]
//       );

//       if (!updated || updated.length === 0) {
//         return res.status(404).json({
//           success: false,
//           message: "User not found",
//         });
//       }

//       const updatedUser = updated[0];

//       const responseUser = {
//         ...updatedUser,
//         home_address: safeParseJSON(updatedUser.home_address, {}),
//         office_address: safeParseJSON(updatedUser.office_address, {}),
//       };

//       res.json({
//         success: true,
//         user: responseUser,
//       });
//     } catch (err) {
//       console.error("Profile update error:", err);
//       res.status(500).json({
//         success: false,
//         message: "Error updating profile",
//         error:
//           process.env.NODE_ENV === "development" ? err.message : undefined,
//       });
//     }
//   }
// );

// // ---------- USER REGISTRATION ----------
// app.post("/api/register", async (req, res) => {
//   const { firstName, email, phoneNumber, password } = req.body;

//   if (!firstName || !email || !phoneNumber || !password) {
//     return res.status(400).json({ success: false, message: "All fields are required" });
//   }

//   try {
//     const [duplicateCheck] = await db.query(
//       "SELECT * FROM users WHERE email = ? OR phone_number = ?",
//       [email, phoneNumber]
//     );

//     if (duplicateCheck.length > 0) {
//       return res.status(400).json({ success: false, message: "Email or phone number already registered" });
//     }

//     const currentDate = new Date();
//     const year = currentDate.getFullYear().toString().slice(-2);
//     const month = currentDate.getMonth() + 1;
//     const day = currentDate.getDate();
//     const datePrefix = `${year}${month}${day}`;

//     const [maxIdResult] = await db.query(
//       "SELECT MAX(CAST(SUBSTRING(custom_id, 6) AS UNSIGNED)) as maxSerial FROM users"
//     );
//     const nextSerial = (maxIdResult[0].maxSerial || 0) + 1;
//     const customId = `${datePrefix}${nextSerial}`;

//     const hashedPassword = await bcrypt.hash(password, 10);

//     await db.query(
//       "INSERT INTO users (custom_id, name, email, phone_number, password, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
//       [customId, firstName, email, phoneNumber, hashedPassword]
//     );

//     res.status(200).json({ success: true, message: "Registration successful!", customId });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Registration error" });
//   }
// });

// // ---------- LOGIN ----------
// app.post("/api/login", async (req, res) => {
//   const { email, password } = req.body;

//   console.log(`🔐 Login attempt for: ${email}`);

//   try {
//     const [superRows] = await db.query("SELECT * FROM superadmins WHERE email = ?", [email]);
//     const superUser = superRows[0];
//     if (superUser && await bcrypt.compare(password, superUser.password)) {
//       const token = jwt.sign({ id: superUser.id, role: "superadmin" }, process.env.JWT_SECRET, { expiresIn: "8h" });
//       return res.json({
//         success: true,
//         role: "superadmin",
//         token,
//         user: {
//           id: superUser.id,
//           email: superUser.email,
//           name: "Super Admin"
//         }
//       });
//     }

//     const [adminRows] = await db.query("SELECT * FROM admins WHERE email = ? AND verified = 1", [email]);
//     const admin = adminRows[0];
//     if (admin && await bcrypt.compare(password, admin.password)) {
//       const token = jwt.sign({ id: admin.id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "8h" });
//       return res.json({
//         success: true,
//         role: "admin",
//         token,
//         user: {
//           id: admin.id,
//           email: admin.email,
//           name: "Admin"
//         }
//       });
//     }

//     const [userRows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
//     const user = userRows[0];
//     if (user && await bcrypt.compare(password, user.password)) {
//       const token = jwt.sign({ userId: user.custom_id, role: "user" }, process.env.JWT_SECRET, { expiresIn: "8h" });

//       return res.json({
//         success: true,
//         role: "user",
//         token,
//         user: {
//           id: user.custom_id,
//           email: user.email,
//           name: user.name,
//           photo: user.photo,
//         }
//       });
//     }

//     const [vendorRows] = await db.query("SELECT * FROM vendors WHERE email = ?", [email]);
//     const vendor = vendorRows[0];
//     if (vendor && await bcrypt.compare(password, vendor.password)) {
//       if (vendor.status !== 'active') {
//         return res.status(403).json({
//           success: false,
//           message: "Your vendor account is pending approval"
//         });
//       }

//       const token = jwt.sign({
//         id: vendor.id,
//         role: "vendor",
//         email: vendor.email
//       }, process.env.JWT_SECRET, { expiresIn: "8h" });

//       return res.json({
//         success: true,
//         role: "vendor",
//         token,
//         user: {
//           id: vendor.id,
//           name: vendor.name,
//           email: vendor.email,
//           phone: vendor.phone_number,
//           profileImage: vendor.vendor_photo,
//           status: vendor.status
//         }
//       });
//     }

//     const [technicianRows] = await db.query("SELECT * FROM technicians WHERE email = ?", [email]);
//     const technician = technicianRows[0];
//     if (technician && await bcrypt.compare(password, technician.password)) {
//       if (technician.status !== 'active') {
//         return res.status(403).json({
//           success: false,
//           message: "Your technician account is pending approval"
//         });
//       }

//       const token = jwt.sign({
//         id: technician.id,
//         role: "technician",
//         email: technician.email
//       }, process.env.JWT_SECRET, { expiresIn: "8h" });

//       return res.json({
//         success: true,
//         role: "technician",
//         token,
//         user: {
//           id: technician.id,
//           name: technician.name,
//           email: technician.email,
//           phone: technician.phone_number,
//           profileImage: technician.photo,
//           status: technician.status,
//           vendor_id: technician.vendor_id
//         }
//       });
//     }

//     console.log(`❌ No user found with email: ${email}`);
//     return res.status(401).json({
//       success: false,
//       message: "Invalid email or password"
//     });

//   } catch (error) {
//     console.error("Login error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Login failed. Please try again later."
//     });
//   }
// });

// // ---------- VERIFY JWT TOKEN ----------
// app.post("/api/auth/verify", authenticateJWT, async (req, res) => {
//   const userId = req.user.userId;
//   try {
//     const [result] = await db.query("SELECT name, email FROM users WHERE custom_id = ?", [userId]);
//     if (result.length === 0) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }
//     res.status(200).json({ success: true, user: result[0] });
//   } catch (err) {
//     console.error("Auth verify error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// // ---------- GET USER PROFILE ----------
// app.get("/api/user-profile", authenticateJWT, async (req, res) => {
//   const userId = req.user.userId;
//   console.log("Authenticated userId:", userId);

//   try {
//     const [rows] = await db.query("SELECT * FROM users WHERE custom_id = ?", [userId]);
//     if (rows.length === 0) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     const user = rows[0];
//     const parsedUser = {
//       ...user,
//       home_address: safeParseJSON(user.home_address, {}),
//       office_address: safeParseJSON(user.office_address, {}),
//     };

//     res.json({ success: true, user: parsedUser });
//   } catch (err) {
//     console.error("Fetch profile error:", err);
//     res.status(500).json({ success: false, message: "Failed to fetch profile" });
//   }
// });

// // ---------- PLACE ORDER ----------
// app.post("/api/place-order", authenticateJWT, async (req, res) => {
//   const userId = req.user.userId;
//   const {
//     category,
//     cart,
//     selectedDate,
//     selectedSlot,
//     notes,
//     addressType,
//     address,
//     home_address,
//     office_address,
//     temp_address,
//     recipientName,
//     recipientPhone
//   } = req.body;

//   let finalAddress = address;

//   if (!finalAddress) {
//     if (addressType === 'home' && home_address) finalAddress = home_address;
//     else if (addressType === 'office' && office_address) finalAddress = office_address;
//     else if (addressType === 'another' && temp_address) finalAddress = temp_address;
//   }

//   if (!category || !cart || cart.length === 0 || !addressType || !finalAddress) {
//     return res.status(400).json({ success: false, message: "Required fields missing" });
//   }

//   try {
//     const generateRandomNumber = () => Math.floor(1000 + Math.random() * 9000);
//     const orderId = `#${category}${generateRandomNumber()}`;

//     let homeAddress = null;
//     let officeAddress = null;
//     let tempAddress = null;

//     if (addressType === 'home') homeAddress = safeParseJSON(finalAddress, {});
//     if (addressType === 'office') officeAddress = safeParseJSON(finalAddress, {});
//     if (addressType === 'another') tempAddress = safeParseJSON(finalAddress, {});

//     await db.query(
//       `INSERT INTO orders 
//         (order_id, user_id, order_date, time_slot, notes, 
//          address_type, home_address, office_address, temp_address, 
//          recipient_name, recipient_phone, 
//          cart_items, status) 
//        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`,
//       [
//         orderId,
//         userId,
//         selectedDate,
//         selectedSlot,
//         notes || "",
//         addressType,
//         JSON.stringify(homeAddress),
//         JSON.stringify(officeAddress),
//         JSON.stringify(tempAddress),
//         recipientName || null,
//         recipientPhone || null,
//         JSON.stringify(cart),
//       ]
//     );

//     res.status(200).json({ success: true, message: "Order placed successfully", orderId });
//   } catch (error) {
//     console.error("Order error:", error);
//     res.status(500).json({ success: false, message: "Failed to place order" });
//   }
// });

// // ---------- GET USER ORDERS ----------
// app.get("/orders", authenticateJWT, async (req, res) => {
//   const userId = req.user.userId;

//   try {
//     const [orders] = await db.query(
//       "SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC",
//       [userId]
//     );

//     const parsedOrders = orders.map(order => {
//       const parsedCart = safeParseJSON(order.cart_items, []);
//       const parsedServiceExpert = safeParseJSON(order.service_expert, null);
//       const parsedReviews = safeParseJSON(order.reviews, null);
      
//       const homeAddress = safeParseJSON(order.home_address, null);
//       const officeAddress = safeParseJSON(order.office_address, null);
//       const tempAddress = safeParseJSON(order.temp_address, null);

//       let primaryAddress = null;
//       let addressType = order.address_type || 'home';

//       if (addressType === 'home' && homeAddress) primaryAddress = homeAddress;
//       else if (addressType === 'office' && officeAddress) primaryAddress = officeAddress;
//       else if (addressType === 'another' && tempAddress) primaryAddress = tempAddress;

//       let fullAddress = "";
//       if (primaryAddress) {
//         const parts = [];
//         if (primaryAddress.addressLine1) parts.push(primaryAddress.addressLine1);
//         if (primaryAddress.addressLine2) parts.push(primaryAddress.addressLine2);
//         if (primaryAddress.areaName) parts.push(primaryAddress.areaName);
//         if (primaryAddress.city) parts.push(primaryAddress.city);
//         if (primaryAddress.landmark) parts.push(`Near ${primaryAddress.landmark}`);
//         fullAddress = parts.join(", ");
//       }

//       const cartItems = Array.isArray(parsedCart) ? parsedCart : [];
//       const total = cartItems.reduce((sum, item) =>
//         sum + ((item?.price || 0) * (item?.quantity || 0)), 0
//       );

//       return {
//         ...order,
//         cart_items: cartItems,
//         service_expert: parsedServiceExpert,
//         reviews: parsedReviews,
//         home_address: homeAddress,
//         office_address: officeAddress,
//         temp_address: tempAddress,
//         address: primaryAddress,
//         full_address: fullAddress,
//         total: total.toFixed(2)
//       };
//     });

//     res.status(200).json({ success: true, orders: parsedOrders });
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     res.status(500).json({ success: false, message: "Failed to fetch orders" });
//   }
// });

// // ---------- VERIFY ROLE ----------
// app.get('/api/auth/verify-role', verifyToken(), (req, res) => {
//   const requiredRoles = req.query.requiredRole?.split(",") || [];
//   const userRole = req.user.role;

//   if (userRole === 'superadmin') {
//     return res.json({
//       success: true,
//       isValid: true,
//       user: req.user
//     });
//   }

//   if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
//     return res.status(403).json({
//       success: false,
//       isValid: false,
//       message: `Requires one of these roles: ${requiredRoles.join(', ')}`
//     });
//   }

//   res.json({
//     success: true,
//     isValid: true,
//     user: req.user
//   });
// });

// // ---------- SUPER ADMIN REGISTRATION ----------
// app.post("/api/superadmin/register", async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({
//       success: false,
//       message: "Email and password are required"
//     });
//   }

//   if (!validator.isEmail(email)) {
//     return res.status(400).json({
//       success: false,
//       message: "Invalid email format"
//     });
//   }

//   if (!validator.isStrongPassword(password)) {
//     return res.status(400).json({
//       success: false,
//       message: "Password must be at least 8 chars with uppercase, lowercase, number and symbol"
//     });
//   }

//   try {
//     const hashed = await bcrypt.hash(password, 12);
//     const [exists] = await db.query(
//       "SELECT id FROM superadmins LIMIT 1"
//     );

//     if (exists.length) {
//       return res.status(403).json({
//         success: false,
//         message: "Super Admin already exists"
//       });
//     }

//     await db.query(
//       "INSERT INTO superadmins (email, password) VALUES (?, ?)",
//       [email, hashed]
//     );

//     res.json({
//       success: true,
//       message: "Super Admin registered successfully",
//     });
//   } catch (error) {
//     console.error("Registration Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Registration failed",
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// // ---------- SUPER ADMIN LOGIN ----------
// const loginLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 5,
//   message: "Too many login attempts, please try again later"
// });

// app.post("/api/superadmin/login", loginLimiter, async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const [rows] = await db.query(
//       "SELECT * FROM superadmins WHERE email = ?",
//       [email]
//     );
//     const user = rows[0];

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid credentials"
//       });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid credentials"
//       });
//     }

//     const token = jwt.sign(
//       {
//         id: user.id,
//         role: "superadmin",
//         email: user.email
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "8h" }
//     );

//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'strict',
//       maxAge: 8 * 60 * 60 * 1000
//     }).json({
//       success: true,
//       user: {
//         id: user.id,
//         email: user.email,
//         role: "superadmin"
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Login failed"
//     });
//   }
// });

// // ---------- ADMIN CREATION ----------
// app.post("/api/admin/create",
//   verifyToken(["superadmin"]),
//   async (req, res) => {
//     const { email, password } = req.body;

//     try {
//       const [exists] = await db.query(
//         "SELECT id FROM admins WHERE email = ?",
//         [email]
//       );

//       if (exists.length) {
//         return res.status(409).json({
//           success: false,
//           message: "Admin already exists"
//         });
//       }

//       const hashed = await bcrypt.hash(password, 12);
//       await db.query(
//         "INSERT INTO admins (email, password, created_by) VALUES (?, ?, ?)",
//         [email, hashed, req.user.id]
//       );

//       res.json({
//         success: true,
//         message: "Admin created successfully",
//         admin: { email }
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: "Admin creation failed"
//       });
//     }
//   }
// );

// // ---------- ADMIN ALL ORDERS ----------
// app.get("/api/admin/all-orders", verifyToken(["admin", "superadmin"]), async (req, res) => {
//   try {
//     const [orders] = await db.query(`
//       SELECT 
//         o.order_id,
//         o.user_id,
//         o.order_date,
//         o.time_slot,
//         o.notes,
//         o.address_type,
//         o.home_address,
//         o.office_address,
//         o.temp_address,
//         o.recipient_name,
//         o.recipient_phone,
//         o.cart_items,
//         o.status,
//         o.cancel_reason,
//         o.cancelled_at,
//         o.vendor_id,
//         o.service_expert,
//         o.reviews,
//         o.assigned_date,
//         o.completed_date,
//         o.confirmed_date,
//         u.name AS customer_name,
//         u.email AS customer_email,
//         u.phone_number AS customer_phone,
//         v.name AS vendor_name,
//         v.email AS vendor_email
//       FROM orders o
//       LEFT JOIN users u ON o.user_id = u.custom_id
//       LEFT JOIN vendors v ON o.vendor_id = v.id
//       ORDER BY o.order_date DESC
//     `);

//     const ordersWithDetails = orders.map(order => {
//       const parsedCart = safeParseJSON(order.cart_items, []);
//       const parsedAddress = safeParseJSON(order.address, {});
//       const parsedServiceExpert = safeParseJSON(order.service_expert, null);
//       const parsedReviews = safeParseJSON(order.reviews, null);

//       const cartItems = Array.isArray(parsedCart) ? parsedCart : [];
//       const total = cartItems.reduce((sum, item) => 
//         sum + ((item?.price || 0) * (item?.quantity || 0)), 0
//       );

//       return {
//         ...order,
//         cart_items: cartItems,
//         address: parsedAddress,
//         service_expert: parsedServiceExpert,
//         reviews: parsedReviews,
//         total: total.toFixed(2)
//       };
//     });

//     res.json({ success: true, orders: ordersWithDetails });
//   } catch (error) {
//     console.error("Error fetching all orders:", error);
//     res.status(500).json({ success: false, message: "Failed to fetch all order details" });
//   }
// });

// // ---------- ADMIN DASHBOARD ----------
// app.get('/api/admin/dashboard', verifyToken(['admin', 'superadmin']), async (req, res) => {
//   try {
//     const [users] = await db.query("SELECT COUNT(*) as count FROM users");
//     const [orders] = await db.query("SELECT COUNT(*) as count FROM orders");
//     const [pending] = await db.query("SELECT COUNT(*) as count FROM orders WHERE status = 'Pending'");
//     const [active] = await db.query("SELECT COUNT(*) as count FROM orders WHERE status = 'Active'");
//     const [completed] = await db.query("SELECT COUNT(*) as count FROM orders WHERE status = 'Completed'");
//     const [cancelled] = await db.query("SELECT COUNT(*) as count FROM orders WHERE status = 'Cancelled'");
//     const [vendors] = await db.query("SELECT COUNT(*) as count FROM vendors WHERE status = 'active'");

//     const totalOrders = orders[0].count;
//     const completionRate = totalOrders > 0
//       ? ((completed[0].count / totalOrders) * 100).toFixed(2)
//       : "0.00";

//     const stats = {
//       totalOrders,
//       pendingOrders: pending[0].count,
//       activeOrders: active[0].count,
//       completedOrders: completed[0].count,
//       canceledOrders: cancelled[0].count,
//       activeVendors: vendors[0].count,
//       totalUsers: users[0].count,
//       completionRate
//     };

//     const [activity] = await db.query(`
//       SELECT order_id, status, updated_at, order_date
//       FROM orders
//       ORDER BY updated_at DESC
//       LIMIT 10
//     `);

//     const formattedRecentActivities = activity.map(act => ({
//       orderId: act.order_id,
//       status: act.status,
//       time: act.updated_at,
//       orderDate: act.order_date
//     }));

//     res.json({
//       success: true,
//       stats,
//       recentActivity: formattedRecentActivities
//     });

//   } catch (error) {
//     console.error('Dashboard Error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to load dashboard data',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// // ---------- ADMIN ALL USERS ----------
// app.get("/api/admin/all-users", verifyToken(["admin", "superadmin"]), async (req, res) => {
//   try {
//     const [users] = await db.query(`
//       SELECT 
//         u.custom_id as id,
//         u.custom_id,
//         u.name,
//         u.email,
//         u.phone_number as phone,
//         u.photo as profileImage,
//         u.home_address,
//         u.office_address,
//         u.is_active as isActive,
//         u.created_at as createdAt
//       FROM users u
//       ORDER BY u.created_at DESC
//     `);

//     const parsedUsers = users.map(user => ({
//       ...user,
//       home_address: safeParseJSON(user.home_address, {}),
//       office_address: safeParseJSON(user.office_address, {})
//     }));

//     res.json({ success: true, users: parsedUsers });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// // ---------- ADMIN USER ORDERS ----------
// app.get("/api/admin/user-orders/:userId", verifyToken(["admin", "superadmin"]), async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const [orders] = await db.query(`
//       SELECT 
//         order_id,
//         order_date,
//         time_slot,
//         status,
//         cart_items,
//         cancel_reason,
//         cancelled_at
//       FROM orders
//       WHERE user_id = ?
//       ORDER BY order_date DESC
//       LIMIT 10
//     `, [userId]);

//     const parsedOrders = orders.map(order => {
//       const parsedCart = safeParseJSON(order.cart_items, []);
//       const cartItems = Array.isArray(parsedCart) ? parsedCart : [];
//       const total = cartItems.reduce((sum, item) => 
//         sum + ((item?.price || 0) * (item?.quantity || 0)), 0
//       );

//       return {
//         ...order,
//         cart_items: cartItems,
//         total: total.toFixed(2)
//       };
//     });

//     res.json({ success: true, orders: parsedOrders });
//   } catch (error) {
//     console.error("Error fetching user orders:", error);
//     res.status(500).json({ success: false, message: "Failed to fetch orders" });
//   }
// });

// // ---------- ADMIN USER STATS ----------
// app.get("/api/admin/user-stats", verifyToken(["admin", "superadmin"]), async (req, res) => {
//   try {
//     const [total] = await db.query("SELECT COUNT(*) as count FROM users");
//     const [newUsers] = await db.query(`
//       SELECT COUNT(*) as count FROM users 
//       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
//     `);
//     const [active] = await db.query("SELECT COUNT(*) as count FROM users WHERE is_active = 1");
//     const [last30] = await db.query(`
//       SELECT COUNT(*) as count FROM users 
//       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
//     `);

//     res.json({
//       totalUsers: total[0].count,
//       newUsers: newUsers[0].count,
//       activeUsers: active[0].count,
//       last30Days: last30[0].count
//     });
//   } catch (error) {
//     console.error("Error fetching stats:", error);
//     res.status(500).json({ success: false, message: "Error fetching stats" });
//   }
// });

// // ---------- ADMIN UPDATE USER ----------
// app.put("/api/admin/user/:id", verifyToken(["admin", "superadmin"]), async (req, res) => {
//   const { id } = req.params;
//   const { name, email, phone, isActive, homeAddress, officeAddress } = req.body;

//   try {
//     await db.query(`
//       UPDATE users 
//       SET name = ?, 
//           email = ?, 
//           phone_number = ?, 
//           is_active = ?,
//           home_address = ?,
//           office_address = ?
//       WHERE custom_id = ?
//     `, [
//       name,
//       email,
//       phone,
//       isActive,
//       homeAddress ? JSON.stringify(homeAddress) : null,
//       officeAddress ? JSON.stringify(officeAddress) : null,
//       id
//     ]);

//     res.json({ success: true, message: "User updated successfully" });
//   } catch (error) {
//     console.error("Error updating user:", error);
//     res.status(500).json({ success: false, message: "Failed to update user" });
//   }
// });

// // ---------- ADMIN DELETE USER ----------
// app.delete("/api/admin/user/:id", verifyToken(["admin", "superadmin"]), async (req, res) => {
//   const { id } = req.params;

//   try {
//     await db.query("DELETE FROM users WHERE custom_id = ?", [id]);
//     res.json({ success: true, message: "User deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting user:", error);
//     res.status(500).json({ success: false, message: "Failed to delete user" });
//   }
// });

// // ---------- SERVICES ----------
// app.get('/api/services', async (req, res) => {
//   try {
//     const [results] = await db.query('SELECT * FROM services');

//     const services = results.map(service => {
//       let imagePath = service.image;

//       if (imagePath && imagePath.startsWith('/images/')) {
//         return {
//           ...service,
//           image: `http://localhost:5001${imagePath}`
//         };
//       }

//       if (imagePath) {
//         imagePath = imagePath.replace(/^\/?uploads\//, '');
//         return {
//           ...service,
//           image: `http://localhost:5001/uploads/${imagePath}`
//         };
//       }

//       return service;
//     });

//     res.json(services);
//   } catch (error) {
//     console.error('Database error:', error);
//     res.status(500).json({ error: 'Database error' });
//   }
// });

// app.get('/api/services/:category', async (req, res) => {
//   const category = req.params.category.trim();

//   try {
//     const [rows] = await db.query('SELECT * FROM services WHERE category = ?', [category]);

//     const services = rows.map(service => {
//       let imagePath = service.image;

//       if (imagePath && imagePath.startsWith('/images/')) {
//         return {
//           ...service,
//           image: `http://localhost:5001${imagePath}`
//         };
//       }

//       if (imagePath) {
//         imagePath = imagePath.replace(/^\/?uploads\//, '');
//         return {
//           ...service,
//           image: `http://localhost:5001/uploads/${imagePath}`
//         };
//       }

//       return service;
//     });

//     res.status(200).json(services);
//   } catch (err) {
//     console.error("DB Error:", err.message);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// app.post('/api/services', uploadService.single('image'), async (req, res) => {
//   const { _id, name, price, category } = req.body;
//   const image = req.file ? `/uploads/services/${req.file.filename}` : null;

//   if (!_id || !name || !price || !category || !image) {
//     return res.status(400).json({ success: false, message: 'Missing fields' });
//   }

//   const sql = `INSERT INTO services (_id, name, price, category, image) VALUES (?, ?, ?, ?, ?)`;

//   try {
//     await db.query(sql, [_id, name, price, category, image]);
//     res.json({ success: true, message: 'Service added successfully!' });
//   } catch (err) {
//     console.error('DB error:', err);
//     res.status(500).json({ success: false, message: 'Database error' });
//   }
// });

// app.put('/api/services/:_id', uploadService.single('image'), async (req, res) => {
//   const { _id } = req.params;
//   const { name, price, category } = req.body;
//   let image = req.file ? `/uploads/services/${req.file.filename}` : null;

//   try {
//     const updates = [];
//     const values = [];

//     if (name) {
//       updates.push('name=?');
//       values.push(name);
//     }
//     if (price) {
//       updates.push('price=?');
//       values.push(price);
//     }
//     if (category) {
//       updates.push('category=?');
//       values.push(category);
//     }
//     if (image) {
//       updates.push('image=?');
//       values.push(image);
//     }

//     if (updates.length === 0) {
//       return res.status(400).json({ success: false, message: 'No fields to update' });
//     }

//     const sql = `UPDATE services SET ${updates.join(', ')} WHERE _id=?`;
//     values.push(_id);

//     const [result] = await db.query(sql, values);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ success: false, message: 'Service not found' });
//     }

//     res.json({ success: true, message: 'Service updated successfully' });
//   } catch (err) {
//     console.error('Update error:', err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// app.delete("/api/services/:_id", async (req, res) => {
//   const { _id } = req.params;
//   try {
//     await db.query("DELETE FROM services WHERE _id = ?", [_id]);
//     res.json({ success: true, message: "Service deleted successfully" });
//   } catch (err) {
//     console.error("Delete error:", err);
//     return res.status(500).json({ success: false, error: err.message });
//   }
// });

// // ---------- VENDOR REGISTRATION ----------
// app.post("/api/vendor/register", uploadVendorDocs.fields([
//   { name: 'profile_image', maxCount: 1 },
//   { name: 'nid_front', maxCount: 1 },
//   { name: 'nid_back', maxCount: 1 },
//   { name: 'cv', maxCount: 1 },
//   { name: 'trade_license', maxCount: 1 }
// ]), async (req, res) => {
//   const {
//     name,
//     email,
//     phone,
//     dob,
//     password,
//     nid_number,
//     company_name,
//     permanent_address,
//     present_address,
//     business_address,
//     service_areas,
//     services,
//     technician_quantity
//   } = req.body;

//   const requiredFields = ['name', 'email', 'phone', 'dob', 'password', 'nid_number'];
//   for (const field of requiredFields) {
//     if (!req.body[field]) {
//       return res.status(400).json({
//         success: false,
//         message: `${field.replace('_', ' ')} is required`
//       });
//     }
//   }

//   console.log('📋 Received vendor registration data:');
//   console.log('- Name:', name);
//   console.log('- Email:', email);
//   console.log('- Phone:', phone);

//   try {
//     const [duplicateCheck] = await db.query(
//       "SELECT * FROM vendors WHERE email = ? OR phone_number = ?",
//       [email, phone]
//     );

//     if (duplicateCheck.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Email or phone number already registered"
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const getFileUrl = (fieldName, subfolder) => {
//       return req.files[fieldName] && req.files[fieldName][0]
//         ? `/uploads/${subfolder}/${req.files[fieldName][0].filename}`
//         : null;
//     };

//     const nidFront = getFileUrl('nid_front', 'nids');
//     const nidBack = getFileUrl('nid_back', 'nids');
//     const profileImage = getFileUrl('profile_image', 'profiles');
//     const cv = getFileUrl('cv', 'cvs');
//     const tradeLicense = getFileUrl('trade_license', 'licenses');

//     let serviceAreasArray = safeParseJSON(service_areas, []);
//     let servicesArray = safeParseJSON(services, []);

//     const [result] = await db.query(
//       `INSERT INTO vendors 
//         (name, email, phone_number, password, dob, nid_number, 
//          company_name, permanent_address, present_address, business_address,
//          technician_quantity, vendor_photo, nid_front, nid_back, cv, trade_license,
//          service_areas, services, status, created_at, updated_at) 
//        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW(), NOW())`,
//       [
//         name,
//         email,
//         phone,
//         hashedPassword,
//         dob,
//         nid_number,
//         company_name || null,
//         permanent_address || '',
//         present_address || '',
//         business_address || null,
//         technician_quantity || 0,
//         profileImage,
//         nidFront,
//         nidBack,
//         cv,
//         tradeLicense,
//         JSON.stringify(serviceAreasArray),
//         JSON.stringify(servicesArray)
//       ]
//     );

//     console.log(`✅ Vendor registered successfully: ${name} (ID: ${result.insertId})`);

//     res.status(200).json({
//       success: true,
//       message: "Registration successful! Your account is pending approval.",
//       vendorId: result.insertId
//     });

//   } catch (error) {
//     console.error("❌ Registration error:", error);

//     try {
//       if (req.files) {
//         Object.values(req.files).forEach(fileArray => {
//           if (fileArray && fileArray[0] && fs.existsSync(fileArray[0].path)) {
//             fs.unlinkSync(fileArray[0].path);
//           }
//         });
//       }
//     } catch (cleanupError) {
//       console.error("Error cleaning up files:", cleanupError);
//     }

//     res.status(500).json({
//       success: false,
//       message: "Registration failed. Please try again.",
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// // ---------- TECHNICIAN REGISTRATION ----------
// app.post("/api/technician/register", uploadVendorDocs.fields([
//   { name: 'profile_image', maxCount: 1 },
//   { name: 'nid_front', maxCount: 1 },
//   { name: 'nid_back', maxCount: 1 },
//   { name: 'cv', maxCount: 1 }
// ]), async (req, res) => {
//   const {
//     name,
//     email,
//     phone,
//     dob,
//     password,
//     nid_number,
//     permanent_address,
//     present_address,
//     skills,
//     experience,
//     vendor_id,
//     service_areas,
//     hourly_rate
//   } = req.body;

//   if (!name || !email || !phone || !password || !vendor_id) {
//     return res.status(400).json({
//       success: false,
//       message: 'Required fields missing: name, email, phone, password, vendor_id'
//     });
//   }

//   try {
//     const [vendorCheck] = await db.query(
//       'SELECT id FROM vendors WHERE id = ? AND status = ?',
//       [vendor_id, 'active']
//     );

//     if (vendorCheck.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Vendor not found or not active'
//       });
//     }

//     const [duplicate] = await db.query(
//       'SELECT id FROM technicians WHERE email = ? OR phone_number = ?',
//       [email, phone]
//     );

//     if (duplicate.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Email or phone already registered'
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const getFileUrl = (fieldName, subfolder) => {
//       return req.files[fieldName] && req.files[fieldName][0]
//         ? `/uploads/${subfolder}/${req.files[fieldName][0].filename}`
//         : null;
//     };

//     const profileImage = getFileUrl('profile_image', 'profiles');
//     const nidFront = getFileUrl('nid_front', 'nids');
//     const nidBack = getFileUrl('nid_back', 'nids');
//     const cv = getFileUrl('cv', 'cvs');

//     const skillsArray = safeParseJSON(skills, []);
//     const serviceAreasArray = safeParseJSON(service_areas, []);

//     const [result] = await db.query(
//       `INSERT INTO technicians 
//        (vendor_id, name, email, phone_number, password, dob, 
//         nid_number, photo, nid_front, nid_back, cv,
//         permanent_address, present_address, skills, experience,
//         service_areas, hourly_rate, status, created_at, updated_at)
//        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW(), NOW())`,
//       [
//         vendor_id, name, email, phone, hashedPassword, dob || null,
//         nid_number || null, profileImage, nidFront, nidBack, cv,
//         permanent_address || null, present_address || null, 
//         JSON.stringify(skillsArray), experience || 0,
//         JSON.stringify(serviceAreasArray), hourly_rate || 0
//       ]
//     );

//     res.json({
//       success: true,
//       message: 'Technician registered successfully',
//       technicianId: result.insertId
//     });

//   } catch (error) {
//     console.error('❌ Technician registration error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Registration failed',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// // ---------- VENDOR PROFILE ----------
// app.get("/api/vendor/profile", authenticateVendor, async (req, res) => {
//   try {
//     console.log('📱 Vendor Profile Request - Vendor ID:', req.vendor?.vendorId);

//     if (!req.vendor || !req.vendor.vendorId) {
//       return res.status(401).json({
//         success: false,
//         message: "Vendor ID not found in token"
//       });
//     }

//     const [rows] = await db.query(
//       `SELECT 
//         id, name, email, phone_number, 
//         dob, nid_number, company_name, 
//         permanent_address, present_address, business_address,
//         technician_quantity, vendor_photo, nid_front, nid_back, 
//         cv, trade_license, service_areas, services, status, 
//         created_at, updated_at, total_orders, completed_orders,
//         pending_orders, canceled_orders, active_orders, hold_orders,
//         average_rating, success_rate, wallet_balance
//        FROM vendors WHERE id = ?`,
//       [req.vendor.vendorId]
//     );

//     if (rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Vendor not found in database",
//         vendorId: req.vendor.vendorId
//       });
//     }

//     const vendor = rows[0];

//     const serviceAreas = safeParseJSON(vendor.service_areas, []);
//     const services = safeParseJSON(vendor.services, []);

//     const responseData = {
//       success: true,
//       vendor: {
//         id: vendor.id,
//         name: vendor.name,
//         email: vendor.email,
//         phone: vendor.phone_number,
//         dob: vendor.dob,
//         nidNumber: vendor.nid_number,
//         companyName: vendor.company_name,
//         permanentAddress: vendor.permanent_address,
//         presentAddress: vendor.present_address,
//         businessAddress: vendor.business_address,
//         technicianQuantity: vendor.technician_quantity,
//         profileImage: vendor.vendor_photo,
//         nidFront: vendor.nid_front,
//         nidBack: vendor.nid_back,
//         cv: vendor.cv,
//         tradeLicense: vendor.trade_license,
//         serviceAreas: serviceAreas,
//         services: services,
//         status: vendor.status,
//         stats: {
//           total_orders: vendor.total_orders || 0,
//           completed_orders: vendor.completed_orders || 0,
//           pending_orders: vendor.pending_orders || 0,
//           canceled_orders: vendor.canceled_orders || 0,
//           active_orders: vendor.active_orders || 0,
//           hold_orders: vendor.hold_orders || 0,
//           average_rating: vendor.average_rating || 0,
//           success_rate: vendor.success_rate || 0,
//           wallet_balance: vendor.wallet_balance || 0
//         },
//         createdAt: vendor.created_at,
//         updatedAt: vendor.updated_at
//       }
//     };

//     res.json(responseData);

//   } catch (error) {
//     console.error("❌ Profile error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch profile",
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// // ---------- VENDOR PROFILE UPDATE ----------
// app.put("/api/vendor/profile", authenticateVendor, uploadVendorDocs.fields([
//   { name: 'profile_image', maxCount: 1 },
//   { name: 'nid_front', maxCount: 1 },
//   { name: 'nid_back', maxCount: 1 },
//   { name: 'cv', maxCount: 1 },
//   { name: 'trade_license', maxCount: 1 }
// ]), async (req, res) => {
//   try {
//     const {
//       name,
//       phone,
//       dob,
//       company_name,
//       permanent_address,
//       present_address,
//       business_address,
//       service_areas,
//       services,
//       technician_quantity,
//       profile_image_base64,
//       profile_image_name
//     } = req.body;

//     const vendorId = req.vendor.vendorId;

//     let updateFields = [];
//     let updateValues = [];

//     if (name) {
//       updateFields.push("name = ?");
//       updateValues.push(name);
//     }

//     if (phone) {
//       updateFields.push("phone_number = ?");
//       updateValues.push(phone);
//     }

//     if (dob) {
//       updateFields.push("dob = ?");
//       updateValues.push(dob);
//     }

//     if (company_name !== undefined) {
//       updateFields.push("company_name = ?");
//       updateValues.push(company_name);
//     }

//     if (permanent_address !== undefined) {
//       updateFields.push("permanent_address = ?");
//       updateValues.push(permanent_address);
//     }

//     if (present_address !== undefined) {
//       updateFields.push("present_address = ?");
//       updateValues.push(present_address);
//     }

//     if (business_address !== undefined) {
//       updateFields.push("business_address = ?");
//       updateValues.push(business_address);
//     }

//     if (service_areas) {
//       updateFields.push("service_areas = ?");
//       updateValues.push(service_areas);
//     }

//     if (services) {
//       updateFields.push("services = ?");
//       updateValues.push(services);
//     }

//     if (technician_quantity !== undefined) {
//       updateFields.push("technician_quantity = ?");
//       updateValues.push(technician_quantity);
//     }

//     const getFileUrl = (fieldName, subfolder) => {
//       return req.files[fieldName] && req.files[fieldName][0]
//         ? `/uploads/${subfolder}/${req.files[fieldName][0].filename}`
//         : null;
//     };

//     if (req.files['profile_image']) {
//       updateFields.push("vendor_photo = ?");
//       updateValues.push(getFileUrl('profile_image', 'profiles'));
//     } else if (profile_image_base64 && profile_image_name) {
//       try {
//         const uploadsDir = path.join(__dirname, 'uploads/profiles');
//         if (!fs.existsSync(uploadsDir)) {
//           fs.mkdirSync(uploadsDir, { recursive: true });
//         }

//         const fileName = `${vendorId}_${Date.now()}_${profile_image_name}`;
//         const filePath = path.join(uploadsDir, fileName);

//         let base64Data = profile_image_base64;
//         if (profile_image_base64.includes(',')) {
//           base64Data = profile_image_base64.split(',')[1];
//         }

//         const buffer = Buffer.from(base64Data, 'base64');
//         fs.writeFileSync(filePath, buffer);

//         updateFields.push("vendor_photo = ?");
//         updateValues.push(`/uploads/profiles/${fileName}`);

//         console.log('✅ Base64 image saved:', fileName);
//       } catch (fileError) {
//         console.error('❌ Error saving base64 image:', fileError);
//       }
//     }

//     if (req.files['nid_front']) {
//       updateFields.push("nid_front = ?");
//       updateValues.push(getFileUrl('nid_front', 'nids'));
//     }

//     if (req.files['nid_back']) {
//       updateFields.push("nid_back = ?");
//       updateValues.push(getFileUrl('nid_back', 'nids'));
//     }

//     if (req.files['cv']) {
//       updateFields.push("cv = ?");
//       updateValues.push(getFileUrl('cv', 'cvs'));
//     }

//     if (req.files['trade_license']) {
//       updateFields.push("trade_license = ?");
//       updateValues.push(getFileUrl('trade_license', 'licenses'));
//     }

//     if (updateFields.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "No fields to update"
//       });
//     }

//     updateFields.push("updated_at = NOW()");
//     updateValues.push(vendorId);

//     const [result] = await db.query(
//       `UPDATE vendors SET ${updateFields.join(", ")} WHERE id = ?`,
//       updateValues
//     );

//     if (result.affectedRows === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Vendor not found"
//       });
//     }

//     res.json({
//       success: true,
//       message: "Profile updated successfully"
//     });

//   } catch (error) {
//     console.error("Update profile error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to update profile"
//     });
//   }
// });

// // ---------- FORGOT PASSWORD ----------
// app.post("/api/forgot-password", async (req, res) => {
//   console.log("Forgot password request received:", req.body);

//   const { email } = req.body;

//   if (!email) {
//     return res.status(400).json({
//       success: false,
//       message: "Email is required"
//     });
//   }

//   try {
//     const [users] = await db.query(
//       "SELECT custom_id, name, email FROM users WHERE email = ?",
//       [email]
//     );

//     const [vendors] = await db.query(
//       "SELECT id, name, email FROM vendors WHERE email = ?",
//       [email]
//     );

//     const user = users[0] || vendors[0];

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "No account found with this email address"
//       });
//     }

//     const resetToken = crypto.randomBytes(32).toString('hex');
//     const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

//     console.log("Generated token for:", email);

//     if (users[0]) {
//       await db.query(
//         "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
//         [resetToken, resetTokenExpiry, email]
//       );
//     } else {
//       await db.query(
//         "UPDATE vendors SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
//         [resetToken, resetTokenExpiry, email]
//       );
//     }

//     const resetLink = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

//     console.log("Reset link generated:", resetLink);

//     try {
//       await sendResetEmail(email, resetLink, user.name);
//       console.log("✅ Reset email sent successfully to:", email);

//       res.json({
//         success: true,
//         message: "Password reset link has been sent to your email"
//       });

//     } catch (emailError) {
//       console.error("❌ Email sending failed:", emailError);

//       res.json({
//         success: true,
//         message: "Reset token generated but email failed. Use the link below.",
//         resetLink: resetLink,
//         debug: "Email error: " + emailError.message
//       });
//     }

//   } catch (error) {
//     console.error("Forgot password error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to process reset request"
//     });
//   }
// });

// // ---------- SEND RESET EMAIL ----------
// const sendResetEmail = async (email, resetLink, userName) => {
//   try {
//     console.log("🔄 Attempting to send email...");

//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_APP_PASSWORD,
//       },
//       tls: {
//         rejectUnauthorized: false
//       },
//       logger: true,
//       debug: true
//     });

//     const mailOptions = {
//       from: {
//         name: 'Pacific Support',
//         address: process.env.EMAIL_USER
//       },
//       to: email,
//       subject: 'Password Reset Request - Pacific Support',
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//             <meta charset="utf-8">
//             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//             <title>Password Reset - Pacific Support</title>
//             <style>
//                 * { margin: 0; padding: 0; box-sizing: border-box; }
//                 body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: #f8fafc; }
//                 .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
//                 .header { background: linear-gradient(135deg, #3c8ce7 0%, #00c6ff 100%); padding: 40px 30px; text-align: center; color: white; }
//                 .header h1 { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
//                 .content { padding: 40px 30px; background: #ffffff; }
//                 .content h2 { color: #1e293b; font-size: 24px; font-weight: 600; margin-bottom: 16px; }
//                 .content p { color: #475569; font-size: 16px; margin-bottom: 20px; }
//                 .button { background: #3c8ce7; color: white; padding: 16px 36px; text-decoration: none; border-radius: 8px; display: inline-block; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px -1px rgba(60,140,231,0.3); }
//                 .button:hover { background: #2b7cd9; transform: translateY(-2px); }
//                 .footer { text-align: center; padding: 30px; color: #64748b; font-size: 14px; background: #f8fafc; border-top: 1px solid #e2e8f0; }
//                 .link-box { background: #f1f5f9; padding: 16px; border-radius: 8px; word-break: break-all; font-size: 14px; margin: 24px 0; border: 1px solid #e2e8f0; color: #475569; }
//                 .warning { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 16px; border-radius: 8px; margin: 20px 0; font-weight: 600; }
//                 .logo { font-size: 24px; font-weight: 700; margin-bottom: 8px; }
//             </style>
//         </head>
//         <body>
//             <div class="container">
//                 <div class="header">
//                     <div class="logo">🌊 Pacific Support</div>
//                     <p>Password Reset Request</p>
//                 </div>
//                 <div class="content">
//                     <h2>Hello ${userName},</h2>
//                     <p>We received a request to reset your password for your Pacific Support account. Click the button below to create a new secure password:</p>
//                     <div style="text-align: center; margin: 35px 0;">
//                         <a href="${resetLink}" class="button">Reset Your Password</a>
//                     </div>
//                     <p>If the button doesn't work, copy and paste the following link into your web browser:</p>
//                     <div class="link-box">${resetLink}</div>
//                     <div class="warning">⚠️ This password reset link will expire in 1 hour for security reasons.</div>
//                     <p>If you didn't request a password reset, you can safely ignore this email.</p>
//                 </div>
//                 <div class="footer">
//                     <p>&copy; 2024 Pacific Support. All rights reserved.</p>
//                     <p style="font-size: 13px; opacity: 0.8;">This is an automated message, please do not reply to this email.</p>
//                 </div>
//             </div>
//         </body>
//         </html>
//       `,
//       text: `
// Password Reset Request - Pacific Support

// Hello ${userName},

// We received a request to reset your password for your Pacific Support account.

// Reset your password here: ${resetLink}

// This password reset link will expire in 1 hour for security reasons.

// If you didn't request this password reset, you can safely ignore this email.

// © 2024 Pacific Support. All rights reserved.
//       `
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log("✅ Email sent successfully!");
//     console.log("📨 Message ID:", info.messageId);

//     return info;

//   } catch (error) {
//     console.error("❌ Email sending failed:", error.message);
//     throw new Error(`Failed to send reset email: ${error.message}`);
//   }
// };

// // ---------- ADMIN VENDORS LIST ----------
// app.get('/api/admin/vendors', verifyToken(['admin', 'superadmin']), async (req, res) => {
//   try {
//     const [vendors] = await db.query(`
//       SELECT 
//         id,
//         name,
//         email,
//         phone_number as phone,
//         vendor_photo as photo,
//         nid_number,
//         technician_quantity,
//         status,
//         total_orders,
//         completed_orders,
//         pending_orders,
//         canceled_orders,
//         active_orders,
//         hold_orders,
//         average_rating,
//         success_rate,
//         wallet_balance,
//         created_at
//       FROM vendors
//       ORDER BY created_at DESC
//     `);

//     res.json({
//       success: true,
//       vendors
//     });
//   } catch (error) {
//     console.error('Get vendors error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch vendors'
//     });
//   }
// });

// // ---------- ADMIN VENDOR STATUS UPDATE ----------
// app.patch('/api/admin/vendors/:id/status', verifyToken(['admin', 'superadmin']), async (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;

//   if (!['active', 'pending', 'rejected', 'suspended'].includes(status)) {
//     return res.status(400).json({
//       success: false,
//       message: 'Invalid status'
//     });
//   }

//   try {
//     await db.query(
//       'UPDATE vendors SET status = ?, updated_at = NOW() WHERE id = ?',
//       [status, id]
//     );

//     res.json({
//       success: true,
//       message: `Vendor status updated to ${status}`
//     });
//   } catch (error) {
//     console.error('Update vendor status error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to update vendor status'
//     });
//   }
// });

// // ---------- ORDER STATUS UPDATE (COMPLETE) ----------
// app.patch('/orders/:orderId/status', authenticateJWT, async (req, res) => {
//   const { orderId } = req.params;
//   const { status, notes, service_started } = req.body;
//   const userId = req.user.userId || req.user.id;
//   const userRole = req.user.role || 'user';

//   console.log(`🔄 Order status update request: ${orderId}`);
//   console.log(`📋 New status: ${status}`);
//   console.log(`👤 User: ${userId} (${userRole})`);

//   const validStatuses = ['Pending', 'Processing', 'Active', 'Completed', 'Cancelled', 'Hold', 'Assigned to Vendor', 'Started'];
//   if (!validStatuses.includes(status)) {
//     return res.status(400).json({
//       success: false,
//       message: `Invalid status. Valid statuses: ${validStatuses.join(', ')}`
//     });
//   }

//   try {
//     const [orderRows] = await db.query(
//       'SELECT * FROM orders WHERE order_id = ?',
//       [orderId]
//     );

//     if (orderRows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     const order = orderRows[0];
//     const oldStatus = order.status;
//     const vendorId = order.vendor_id;

//     console.log(`📋 Current status: ${oldStatus}, Vendor: ${vendorId || 'Not assigned'}`);

//     if (userRole === 'vendor') {
//       if (!vendorId || order.vendor_id !== parseInt(userId)) {
//         return res.status(403).json({
//           success: false,
//           message: 'You can only update your assigned orders'
//         });
//       }
//     }

//     if (oldStatus === 'Completed' || oldStatus === 'Cancelled') {
//       return res.status(400).json({
//         success: false,
//         message: `Cannot change status of ${oldStatus.toLowerCase()} order`
//       });
//     }

//     await db.query('START TRANSACTION');

//     let updateQuery = `UPDATE orders SET status = ?, updated_by = ?, updated_at = NOW()`;
//     const updateParams = [status, userId || 'system'];

//     if (service_started === true && !order.service_started_date) {
//       updateQuery += `, service_started_date = NOW()`;
//     }

//     if (notes) {
//       updateQuery += `, notes = CONCAT(IFNULL(notes, ''), '\n[${new Date().toLocaleString()}]: ${notes}')`;
//     }

//     if (status === 'Completed' && !order.completed_date) {
//       updateQuery += `, completed_date = NOW()`;
//     }

//     if (status === 'Cancelled') {
//       updateQuery += `, cancelled_date = NOW()`;
//       if (!order.cancel_reason) {
//         updateQuery += `, cancel_reason = ?`;
//         updateParams.push(notes || 'Order cancelled');
//       }
//     }

//     updateQuery += ` WHERE order_id = ?`;
//     updateParams.push(orderId);

//     await db.query(updateQuery, updateParams);

//     if (vendorId) {
//       await updateVendorStats(orderId, oldStatus, status, vendorId, order.service_expert);
//     }

//     await db.query(
//       `INSERT INTO order_history 
//        (order_id, status, action_by, action_type, details, created_at) 
//        VALUES (?, ?, ?, 'status_change', ?, NOW())`,
//       [orderId, status, userId || 'system', `Status changed from ${oldStatus} to ${status}`]
//     );

//     await db.query('COMMIT');

//     const [updatedOrder] = await db.query(
//       'SELECT * FROM orders WHERE order_id = ?',
//       [orderId]
//     );

//     console.log(`✅ Order ${orderId} status updated successfully`);

//     res.json({
//       success: true,
//       message: `Order status updated to ${status}`,
//       order: {
//         order_id: orderId,
//         status: status,
//         old_status: oldStatus,
//         vendor_id: vendorId,
//         updated_at: new Date(),
//         updated_by: userId || 'system'
//       }
//     });

//   } catch (error) {
//     await db.query('ROLLBACK');
//     console.error('❌ Update order status error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to update order status',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// // ---------- ORDER CANCELLATION (COMPLETE) ----------
// app.patch('/orders/:orderId/cancel', authenticateJWT, async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { reason, penaltyFee = 0 } = req.body;
//     const userId = req.user.userId || req.user.id;
//     const userRole = req.user.role || 'user';

//     console.log(`🔄 Cancellation request by ${userRole} for order ${orderId}`);

//     const [orderRows] = await db.query(
//       `SELECT o.*, 
//               u.name as user_name,
//               v.name as vendor_name
//        FROM orders o
//        LEFT JOIN users u ON o.user_id = u.custom_id
//        LEFT JOIN vendors v ON o.vendor_id = v.id
//        WHERE o.order_id = ?`,
//       [orderId]
//     );

//     if (orderRows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     const order = orderRows[0];

//     if (userRole === 'user' || userRole === 'customer') {
//       if (order.user_id !== userId) {
//         return res.status(403).json({
//           success: false,
//           message: 'Unauthorized: You can only cancel your own orders'
//         });
//       }
//     } else if (userRole === 'vendor') {
//       if (order.vendor_id !== userId) {
//         return res.status(403).json({
//           success: false,
//           message: 'Unauthorized: This order is not assigned to you'
//         });
//       }
//     }

//     const currentStatus = order.status;
//     if (currentStatus === 'Completed' || currentStatus === 'Cancelled') {
//       return res.status(400).json({
//         success: false,
//         message: `Order is already ${currentStatus.toLowerCase()}`
//       });
//     }

//     const serviceStarted = hasServiceStarted(order);
//     const isVendorAssigned = order.vendor_id ? true : false;

//     if (userRole === 'user' || userRole === 'customer') {
//       console.log('👤 User initiated cancellation');

//       if (serviceStarted && penaltyFee !== 500 && isVendorAssigned) {
//         return res.status(400).json({
//           success: false,
//           message: 'Cancellation requires ৳500 penalty fee as service has started'
//         });
//       }

//       if (!serviceStarted && penaltyFee > 0) {
//         return res.status(400).json({
//           success: false,
//           message: 'No penalty fee required for cancellation before service starts'
//         });
//       }

//       await db.query('START TRANSACTION');

//       try {
//         await db.query(
//           `UPDATE orders 
//            SET status = 'Cancelled',
//                cancel_reason = ?,
//                cancelled_by = 'user',
//                cancelled_date = NOW(),
//                penalty_fee = ?,
//                updated_at = NOW()
//            WHERE order_id = ?`,
//           [reason || 'Customer requested cancellation', penaltyFee, orderId]
//         );

//         if (isVendorAssigned) {
//           if (serviceStarted && penaltyFee > 0) {
//             const vendorAmount = Math.round(penaltyFee * 0.70);
//             const adminAmount = penaltyFee - vendorAmount;

//             await db.query(
//               `INSERT INTO vendor_cancellations 
//                (vendor_id, order_id, user_id, penalty_amount, reason, 
//                 cancelled_by, vendor_amount, admin_amount, 
//                 cancellation_type, cancelled_at)
//                VALUES (?, ?, ?, ?, ?, 'user', ?, ?, 'user_cancelled_with_charge', NOW())`,
//               [order.vendor_id, orderId, userId, penaltyFee, reason || 'User cancellation',
//                vendorAmount, adminAmount]
//             );

//             await db.query(
//               `UPDATE vendors 
//                SET wallet_balance = COALESCE(wallet_balance, 0) + ?,
//                    canceled_orders = canceled_orders + 1,
//                    updated_at = NOW()
//                WHERE id = ?`,
//               [vendorAmount, order.vendor_id]
//             );

//             await db.query(
//               `INSERT INTO vendor_transactions 
//                (vendor_id, order_id, amount, transaction_type, description, created_at)
//                VALUES (?, ?, ?, 'penalty_fee_user_cancellation',
//                        'Penalty fee from user cancellation (Vendor: ৳${vendorAmount})', NOW())`,
//               [order.vendor_id, orderId, vendorAmount]
//             );

//           } else {
//             await db.query(
//               `INSERT INTO vendor_cancellations 
//                (vendor_id, order_id, user_id, reason, 
//                 cancelled_by, cancellation_type, cancelled_at)
//                VALUES (?, ?, ?, ?, 'user', 'user_cancelled_no_charge', NOW())`,
//               [order.vendor_id, orderId, userId, reason || 'User cancellation before service']
//             );

//             await db.query(
//               `UPDATE vendors 
//                SET pending_orders = GREATEST(0, pending_orders - 1),
//                    canceled_orders = canceled_orders + 1,
//                    updated_at = NOW()
//                WHERE id = ?`,
//               [order.vendor_id]
//             );
//           }

//           await db.query(
//             `INSERT INTO notifications 
//              (user_id, user_type, title, message, type, related_id, created_at)
//              VALUES (?, 'vendor', 'Order Cancelled by Customer', 
//                      'Order ${orderId} was cancelled by customer. ${penaltyFee > 0 ? 'Penalty fee applied.' : 'No penalty fee.'}', 
//                      'order_cancelled', ?, NOW())`,
//             [order.vendor_id, orderId]
//           );
//         }

//         await db.query(
//           `INSERT INTO notifications 
//            (user_id, user_type, title, message, type, related_id, created_at)
//            VALUES (?, 'user', 'Order Cancelled', 
//                    'Your order ${orderId} has been cancelled. ${penaltyFee > 0 ? `Penalty fee of ৳${penaltyFee} has been charged.` : ''}', 
//                    'order_cancelled', ?, NOW())`,
//           [userId, orderId]
//         );

//         await db.query('COMMIT');

//         res.json({
//           success: true,
//           message: penaltyFee > 0 
//             ? `Order cancelled successfully with ৳${penaltyFee} penalty fee`
//             : 'Order cancelled successfully',
//           orderId,
//           status: 'Cancelled',
//           cancelled_by: 'user',
//           penaltyFee,
//           serviceStarted,
//           cancelReason: reason
//         });

//       } catch (error) {
//         await db.query('ROLLBACK');
//         throw error;
//       }
//     } else if (userRole === 'admin' || userRole === 'superadmin') {
//       console.log('👑 Admin initiated cancellation');

//       await db.query('START TRANSACTION');

//       try {
//         await db.query(
//           `UPDATE orders 
//            SET status = 'Cancelled',
//                cancel_reason = ?,
//                cancelled_by = 'admin',
//                cancelled_date = NOW(),
//                penalty_fee = ?,
//                updated_at = NOW()
//            WHERE order_id = ?`,
//           [reason || 'Admin cancelled', penaltyFee, orderId]
//         );

//         if (order.vendor_id) {
//           await db.query(
//             `UPDATE vendors 
//              SET pending_orders = GREATEST(0, pending_orders - 1),
//                  canceled_orders = canceled_orders + 1,
//                  updated_at = NOW()
//              WHERE id = ?`,
//             [order.vendor_id]
//           );
//         }

//         await db.query(
//           `INSERT INTO notifications 
//            (user_id, user_type, title, message, type, related_id, created_at)
//            VALUES (?, 'user', 'Order Cancelled by Admin', 
//                    'Your order ${orderId} has been cancelled by admin. ${penaltyFee > 0 ? `Penalty fee of ৳${penaltyFee} was refunded.` : ''}', 
//                    'order_cancelled', ?, NOW())`,
//           [order.user_id, orderId]
//         );

//         await db.query('COMMIT');

//         res.json({
//           success: true,
//           message: 'Order cancelled by admin',
//           data: {
//             orderId,
//             status: 'Cancelled',
//             cancelled_by: 'admin',
//             penaltyFee
//           }
//         });

//       } catch (error) {
//         await db.query('ROLLBACK');
//         throw error;
//       }
//     }

//   } catch (error) {
//     console.error('❌ Cancel order error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to cancel order',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// // ---------- SERVICE EXPERT RATING ----------
// app.post('/api/service-expert/:id/rate', authenticateJWT, async (req, res) => {
//   const { id } = req.params;
//   const { rating, orderId } = req.body;
//   const userId = req.user.userId;

//   try {
//     const [orderRows] = await db.query(
//       'SELECT * FROM orders WHERE order_id = ? AND user_id = ?',
//       [orderId, userId]
//     );

//     if (orderRows.length === 0) {
//       return res.status(403).json({
//         success: false,
//         message: 'You can only rate service experts for your own orders'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Rating submitted successfully'
//     });
//   } catch (error) {
//     console.error('Rating error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to submit rating'
//     });
//   }
// });

// // ---------- ORDER HOLD ----------
// app.patch('/orders/:orderId/hold', authenticateJWT, async (req, res) => {
//   const { orderId } = req.params;
//   const { reason, checkoutCharge } = req.body;
//   const userId = req.user.userId;

//   try {
//     const [orderRows] = await db.query(
//       'SELECT * FROM orders WHERE order_id = ? AND user_id = ?',
//       [orderId, userId]
//     );

//     if (orderRows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     const order = orderRows[0];

//     if (order.status !== 'Active' || !hasServiceStarted(order)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Only active orders with service started can be put on hold'
//       });
//     }

//     await db.query(
//       `UPDATE orders 
//        SET status = 'Hold',
//            hold_reason = ?,
//            checkout_charge = ?,
//            hold_date = NOW()
//        WHERE order_id = ?`,
//       [reason, checkoutCharge, orderId]
//     );

//     if (order.vendor_id) {
//       await db.query(
//         `UPDATE vendors 
//          SET pending_orders = pending_orders - 1,
//              hold_orders = hold_orders + 1,
//              updated_at = NOW()
//          WHERE id = ?`,
//         [order.vendor_id]
//       );
//     }

//     res.json({
//       success: true,
//       message: 'Order put on hold successfully',
//       order: {
//         order_id: orderId,
//         status: 'Hold',
//         checkout_charge: checkoutCharge
//       }
//     });

//   } catch (error) {
//     console.error('Hold order error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to put order on hold'
//     });
//   }
// });

// // ---------- NOTIFICATIONS ----------
// app.get('/api/notifications', authenticateJWT, async (req, res) => {
//   try {
//     const userId = req.user.userId || req.user.id;
//     const userType = req.user.role === 'vendor' ? 'vendor' : 'user';

//     const [notifications] = await db.query(
//       `SELECT id, title, message, type, related_id, is_read, 
//               created_at, read_at
//        FROM notifications 
//        WHERE user_id = ? AND user_type = ?
//        ORDER BY created_at DESC
//        LIMIT 50`,
//       [userId, userType]
//     );

//     const [unreadCount] = await db.query(
//       `SELECT COUNT(*) as count 
//        FROM notifications 
//        WHERE user_id = ? AND user_type = ? AND is_read = FALSE`,
//       [userId, userType]
//     );

//     res.json({
//       success: true,
//       notifications,
//       unreadCount: unreadCount[0].count
//     });
//   } catch (error) {
//     console.error('Get notifications error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch notifications'
//     });
//   }
// });

// app.patch('/api/notifications/:id/read', authenticateJWT, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user.userId || req.user.id;
//     const userType = req.user.role === 'vendor' ? 'vendor' : 'user';

//     const [result] = await db.query(
//       `UPDATE notifications 
//        SET is_read = TRUE, read_at = NOW()
//        WHERE id = ? AND user_id = ? AND user_type = ?`,
//       [id, userId, userType]
//     );

//     if (result.affectedRows === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Notification not found'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Notification marked as read'
//     });
//   } catch (error) {
//     console.error('Mark as read error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to mark notification as read'
//     });
//   }
// });

// app.patch('/api/notifications/mark-all-read', authenticateJWT, async (req, res) => {
//   try {
//     const userId = req.user.userId || req.user.id;
//     const userType = req.user.role === 'vendor' ? 'vendor' : 'user';

//     await db.query(
//       `UPDATE notifications 
//        SET is_read = TRUE, read_at = NOW()
//        WHERE user_id = ? AND user_type = ? AND is_read = FALSE`,
//       [userId, userType]
//     );

//     res.json({
//       success: true,
//       message: 'All notifications marked as read'
//     });
//   } catch (error) {
//     console.error('Mark all as read error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to mark notifications as read'
//     });
//   }
// });

// app.delete('/api/notifications/:id', authenticateJWT, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user.userId || req.user.id;
//     const userType = req.user.role === 'vendor' ? 'vendor' : 'user';

//     const [result] = await db.query(
//       `DELETE FROM notifications 
//        WHERE id = ? AND user_id = ? AND user_type = ?`,
//       [id, userId, userType]
//     );

//     if (result.affectedRows === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Notification not found'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Notification deleted'
//     });
//   } catch (error) {
//     console.error('Delete notification error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to delete notification'
//     });
//   }
// });

// app.get('/api/notifications/unread-count', authenticateJWT, async (req, res) => {
//   try {
//     const userId = req.user.userId || req.user.id;
//     const userType = req.user.role === 'vendor' ? 'vendor' : 'user';

//     try {
//       const [result] = await db.query(
//         `SELECT COUNT(*) as count 
//          FROM notifications 
//          WHERE user_id = ? AND user_type = ? AND is_read = FALSE`,
//         [userId, userType]
//       );

//       return res.json({
//         success: true,
//         count: result[0].count || 0
//       });
//     } catch (tableError) {
//       console.log('⚠️ Notifications table not found, returning default count');
//       return res.json({
//         success: true,
//         count: 0
//       });
//     }

//   } catch (error) {
//     console.error('Get unread count error:', error);
//     res.json({
//       success: false,
//       count: 0,
//       message: 'Error fetching unread count'
//     });
//   }
// });

// // ---------- SCHEDULE CHANGE ----------
// app.patch('/orders/:orderId/schedule', authenticateJWT, async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { newDate, newTimeSlot, reason } = req.body;
//     const userId = req.user.userId || req.user.id;
//     const userRole = req.user.role || 'user';

//     console.log(`🔄 Schedule change request for order: ${orderId}`);
//     console.log(`📅 New Date: ${newDate}`);
//     console.log(`⏰ New Time: ${newTimeSlot}`);

//     const [orderRows] = await db.query(
//       `SELECT * FROM orders WHERE order_id = ?`,
//       [orderId]
//     );

//     if (orderRows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     const order = orderRows[0];

//     if (userRole === 'user' || userRole === 'customer') {
//       if (order.user_id !== userId) {
//         return res.status(403).json({
//           success: false,
//           message: 'You can only change schedule for your own orders'
//         });
//       }
//     }

//     if (!['Pending', 'Processing'].includes(order.status)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Cannot change schedule for this order status'
//       });
//     }

//     if (order.vendor_id || order.service_expert) {
//       return res.status(400).json({
//         success: false,
//         message: 'Cannot change schedule after expert assignment'
//       });
//     }

//     if (hasServiceStarted(order)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Cannot change schedule after service has started'
//       });
//     }

//     const newDateObj = new Date(newDate);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     if (newDateObj < today) {
//       return res.status(400).json({
//         success: false,
//         message: 'New date must be in the future'
//       });
//     }

//     if (!newTimeSlot || !newTimeSlot.includes('-')) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid time slot format'
//       });
//     }

//     await db.query('START TRANSACTION');

//     try {
//       await db.query(
//         `INSERT INTO schedule_changes 
//          (order_id, user_id, previous_date, previous_time_slot, 
//           new_date, new_time_slot, changed_by, reason) 
//          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//         [
//           orderId,
//           userId,
//           order.order_date,
//           order.time_slot,
//           newDate,
//           newTimeSlot,
//           userRole,
//           reason || 'Customer requested schedule change'
//         ]
//       );

//       await db.query(
//         `UPDATE orders 
//          SET order_date = ?,
//              time_slot = ?,
//              schedule_changed = TRUE,
//              schedule_changed_date = NOW(),
//              updated_at = NOW()
//          WHERE order_id = ?`,
//         [newDate, newTimeSlot, orderId]
//       );

//       await db.query(
//         `INSERT INTO notifications 
//          (user_id, user_type, title, message, type, related_id, created_at) 
//          VALUES (?, 'user', 'Schedule Updated', 
//                  'Your order ${orderId} schedule has been changed to ${new Date(newDate).toLocaleDateString()} at ${newTimeSlot}', 
//                  'schedule_change', ?, NOW())`,
//         [userId, orderId]
//       );

//       await db.query('COMMIT');

//       console.log(`✅ Schedule changed successfully for order ${orderId}`);

//       res.json({
//         success: true,
//         message: 'Schedule updated successfully',
//         data: {
//           order_id: orderId,
//           previous_date: order.order_date,
//           previous_time_slot: order.time_slot,
//           new_date: newDate,
//           new_time_slot: newTimeSlot,
//           changed_by: userRole,
//           change_date: new Date()
//         }
//       });

//     } catch (error) {
//       await db.query('ROLLBACK');
//       throw error;
//     }

//   } catch (error) {
//     console.error('Schedule change error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to update schedule',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// // ---------- SCHEDULE HISTORY ----------
// app.get('/orders/:orderId/schedule-history', authenticateJWT, async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const userId = req.user.userId || req.user.id;
//     const userRole = req.user.role || 'user';

//     const [orderRows] = await db.query(
//       `SELECT * FROM orders 
//        WHERE order_id = ? AND user_id = ?`,
//       [orderId, userId]
//     );

//     if (orderRows.length === 0 && userRole !== 'admin' && userRole !== 'superadmin') {
//       return res.status(403).json({
//         success: false,
//         message: 'Access denied to order history'
//       });
//     }

//     const [history] = await db.query(
//       `SELECT sc.*, 
//               u.name as user_name,
//               u.email as user_email
//        FROM schedule_changes sc
//        LEFT JOIN users u ON sc.user_id = u.custom_id
//        WHERE sc.order_id = ?
//        ORDER BY sc.change_date DESC`,
//       [orderId]
//     );

//     res.json({
//       success: true,
//       history: history.map(record => ({
//         id: record.id,
//         order_id: record.order_id,
//         user_name: record.user_name,
//         previous_date: record.previous_date,
//         previous_time_slot: record.previous_time_slot,
//         new_date: record.new_date,
//         new_time_slot: record.new_time_slot,
//         changed_by: record.changed_by,
//         reason: record.reason,
//         change_date: record.change_date
//       }))
//     });

//   } catch (error) {
//     console.error('Get schedule history error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch schedule history'
//     });
//   }
// });

// // ---------- CAN CHANGE SCHEDULE ----------
// app.get('/orders/:orderId/can-change-schedule', authenticateJWT, async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const userId = req.user.userId || req.user.id;
//     const userRole = req.user.role || 'user';

//     const [orderRows] = await db.query(
//       `SELECT * FROM orders WHERE order_id = ?`,
//       [orderId]
//     );

//     if (orderRows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         can_change: false,
//         message: 'Order not found'
//       });
//     }

//     const order = orderRows[0];

//     if (userRole === 'user' && order.user_id !== userId) {
//       return res.status(403).json({
//         success: false,
//         can_change: false,
//         message: 'Access denied'
//       });
//     }

//     const canChangeSchedule = () => {
//       if (!['Pending', 'Processing'].includes(order.status)) {
//         return {
//           can_change: false,
//           reason: `Order status is ${order.status}`
//         };
//       }

//       if (order.vendor_id || order.service_expert) {
//         return {
//           can_change: false,
//           reason: 'Service expert already assigned'
//         };
//       }

//       if (hasServiceStarted(order)) {
//         return {
//           can_change: false,
//           reason: 'Service has already started'
//         };
//       }

//       if (order.schedule_changed) {
//         return {
//           can_change: false,
//           reason: 'Schedule already changed once'
//         };
//       }

//       return {
//         can_change: true,
//         reason: 'Schedule can be changed'
//       };
//     };

//     const result = canChangeSchedule();

//     res.json({
//       success: true,
//       order_id: orderId,
//       current_date: order.order_date,
//       current_time_slot: order.time_slot,
//       ...result,
//       conditions: {
//         valid_status: ['Pending', 'Processing'].includes(order.status),
//         no_vendor_assigned: !(order.vendor_id || order.service_expert),
//         service_not_started: !hasServiceStarted(order),
//         not_changed_before: !order.schedule_changed
//       }
//     });

//   } catch (error) {
//     console.error('Check schedule change error:', error);
//     res.status(500).json({
//       success: false,
//       can_change: false,
//       message: 'Failed to check schedule change status'
//     });
//   }
// });

// // ---------- VENDOR DASHBOARD ----------
// app.get('/api/vendor/dashboard', authenticateVendor, async (req, res) => {
//   try {
//     const vendorId = req.vendor.vendorId;

//     if (!vendorId) {
//       return res.status(401).json({
//         success: false,
//         message: 'Vendor ID not found'
//       });
//     }

//     const [stats] = await db.query(
//       `SELECT 
//         id,
//         name,
//         email,
//         phone_number,
//         vendor_photo,
//         status,
//         total_orders,
//         completed_orders,
//         pending_orders,
//         canceled_orders,
//         hold_orders,
//         active_orders,
//         average_rating,
//         success_rate,
//         wallet_balance,
//         created_at
//        FROM vendors 
//        WHERE id = ?`,
//       [vendorId]
//     );

//     if (stats.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Vendor not found'
//       });
//     }

//     const [recentOrders] = await db.query(
//       `SELECT 
//         order_id,
//         order_date,
//         time_slot,
//         status,
//         created_at,
//         (SELECT COUNT(*) FROM order_reviews WHERE order_id = orders.order_id) as review_count
//        FROM orders 
//        WHERE vendor_id = ?
//        ORDER BY created_at DESC 
//        LIMIT 10`,
//       [vendorId]
//     );

//     const [monthlyStats] = await db.query(
//       `SELECT 
//         DATE_FORMAT(created_at, '%Y-%m') as month,
//         COUNT(*) as total,
//         SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed,
//         SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END) as cancelled
//        FROM orders 
//        WHERE vendor_id = ?
//        AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
//        GROUP BY DATE_FORMAT(created_at, '%Y-%m')
//        ORDER BY month DESC`,
//       [vendorId]
//     );

//     res.json({
//       success: true,
//       dashboard: {
//         stats: stats[0],
//         recent_orders: recentOrders,
//         monthly_stats: monthlyStats
//       }
//     });

//   } catch (error) {
//     console.error('❌ Vendor dashboard error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch dashboard data'
//     });
//   }
// });

// // ---------- VENDOR ORDER DETAILS ----------
// app.get('/api/vendor/orders/:orderId', authenticateVendor, async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const vendorId = req.vendor.vendorId;

//     const [orders] = await db.query(
//       `SELECT 
//         o.*,
//         u.name as customer_name,
//         u.email as customer_email,
//         u.phone_number as customer_phone,
//         u.photo as customer_photo
//        FROM orders o
//        LEFT JOIN users u ON o.user_id = u.custom_id
//        WHERE o.order_id = ? AND o.vendor_id = ?`,
//       [orderId, vendorId]
//     );

//     if (orders.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found or not assigned to you'
//       });
//     }

//     const order = orders[0];

//     const parsedCart = safeParseJSON(order.cart_items, []);
//     const parsedServiceExpert = safeParseJSON(order.service_expert, null);
//     const parsedReviews = safeParseJSON(order.reviews, null);

//     let addressField = null;
//     if (order.address_type === 'home' && order.home_address) {
//       addressField = order.home_address;
//     } else if (order.address_type === 'office' && order.office_address) {
//       addressField = order.office_address;
//     } else if (order.address_type === 'another' && order.temp_address) {
//       addressField = order.temp_address;
//     }

//     const parsedAddress = safeParseJSON(addressField, {});
//     const cartItems = Array.isArray(parsedCart) ? parsedCart : [];
//     const total = cartItems.reduce((sum, item) => 
//       sum + ((item?.price || 0) * (item?.quantity || 0)), 0
//     );

//     res.json({
//       success: true,
//       order: {
//         ...order,
//         cart_items: cartItems,
//         service_expert: parsedServiceExpert,
//         address: parsedAddress,
//         reviews: parsedReviews,
//         total: total.toFixed(2)
//       }
//     });

//   } catch (error) {
//     console.error('❌ Get vendor order error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch order details'
//     });
//   }
// });

// // ---------- VENDOR REVIEWS ----------
// app.get('/api/vendor/reviews', authenticateVendor, async (req, res) => {
//   try {
//     const vendorId = req.vendor.vendorId;
//     const { limit = 20, offset = 0 } = req.query;

//     const [reviews] = await db.query(
//       `SELECT 
//         r.*,
//         u.name as customer_name,
//         u.photo as customer_photo,
//         o.order_id,
//         o.order_date
//        FROM order_reviews r
//        JOIN orders o ON r.order_id = o.order_id
//        JOIN users u ON r.user_id = u.custom_id
//        WHERE o.vendor_id = ?
//        ORDER BY r.created_at DESC
//        LIMIT ? OFFSET ?`,
//       [vendorId, parseInt(limit), parseInt(offset)]
//     );

//     const [total] = await db.query(
//       `SELECT COUNT(*) as count
//        FROM order_reviews r
//        JOIN orders o ON r.order_id = o.order_id
//        WHERE o.vendor_id = ?`,
//       [vendorId]
//     );

//     const [avgRatings] = await db.query(
//       `SELECT 
//         AVG(service_expert_rating) as avg_service_rating,
//         AVG(website_service_rating) as avg_website_rating
//        FROM order_reviews r
//        JOIN orders o ON r.order_id = o.order_id
//        WHERE o.vendor_id = ?`,
//       [vendorId]
//     );

//     res.json({
//       success: true,
//       reviews: reviews,
//       pagination: {
//         total: total[0].count,
//         limit: parseInt(limit),
//         offset: parseInt(offset)
//       },
//       averages: {
//         service_rating: Math.round(avgRatings[0].avg_service_rating || 0),
//         website_rating: Math.round(avgRatings[0].avg_website_rating || 0)
//       }
//     });

//   } catch (error) {
//     console.error('❌ Get vendor reviews error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch reviews'
//     });
//   }
// });

// // ---------- VENDOR TECHNICIANS ----------
// app.get('/api/vendor/technicians', authenticateVendor, async (req, res) => {
//   try {
//     const vendorId = req.vendor.vendorId;

//     const [technicians] = await db.query(
//       `SELECT 
//         id, name, email, phone_number, photo, 
//         skills, experience, hourly_rate, status,
//         rating, total_orders, completed_orders,
//         created_at
//        FROM technicians 
//        WHERE vendor_id = ?
//        ORDER BY created_at DESC`,
//       [vendorId]
//     );

//     const parsedTechnicians = technicians.map(tech => {
//       const skills = safeParseJSON(tech.skills, []);
//       return { ...tech, skills };
//     });

//     res.json({
//       success: true,
//       technicians: parsedTechnicians
//     });

//   } catch (error) {
//     console.error('❌ Get technicians error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch technicians'
//     });
//   }
// });

// // ---------- ADMIN TECHNICIANS ----------
// app.get('/api/admin/technicians', verifyToken(['admin', 'superadmin']), async (req, res) => {
//   try {
//     const [technicians] = await db.query(
//       `SELECT 
//         t.*,
//         v.name as vendor_name,
//         v.company_name as vendor_company
//        FROM technicians t
//        LEFT JOIN vendors v ON t.vendor_id = v.id
//        ORDER BY t.created_at DESC`
//     );

//     const parsedTechnicians = technicians.map(tech => {
//       const skills = safeParseJSON(tech.skills, []);
//       const serviceAreas = safeParseJSON(tech.service_areas, []);
//       return { ...tech, skills, service_areas: serviceAreas };
//     });

//     res.json({
//       success: true,
//       technicians: parsedTechnicians
//     });

//   } catch (error) {
//     console.error('❌ Get technicians error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch technicians'
//     });
//   }
// });

// // ---------- ADMIN TECHNICIAN STATUS UPDATE ----------
// app.patch('/api/admin/technicians/:id/status', verifyToken(['admin', 'superadmin']), async (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;

//   if (!['pending', 'active', 'inactive', 'suspended'].includes(status)) {
//     return res.status(400).json({
//       success: false,
//       message: 'Invalid status'
//     });
//   }

//   try {
//     await db.query(
//       'UPDATE technicians SET status = ?, updated_at = NOW() WHERE id = ?',
//       [status, id]
//     );

//     res.json({
//       success: true,
//       message: `Technician status updated to ${status}`
//     });

//   } catch (error) {
//     console.error('❌ Update technician status error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to update technician status'
//     });
//   }
// });

// // ---------- HEALTH CHECK ----------
// app.get('/api/health', (req, res) => {
//   res.json({
//     success: true,
//     status: 'Server is healthy',
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime(),
//     memory: process.memoryUsage(),
//     port: port
//   });
// });

// app.get('/api/vendor/health', (req, res) => {
//   res.json({
//     success: true,
//     status: 'Server is running',
//     timestamp: new Date().toISOString(),
//     port: port
//   });
// });

// // ---------- ERROR HANDLING MIDDLEWARE ----------
// app.use((err, req, res, next) => {
//   console.error('❌ Server Error:', err);

//   if (err instanceof multer.MulterError) {
//     if (err.code === 'FILE_TOO_LARGE') {
//       return res.status(413).json({
//         success: false,
//         message: 'File too large. Maximum size is 10MB.'
//       });
//     }
//     return res.status(400).json({
//       success: false,
//       message: err.message
//     });
//   }

//   res.status(500).json({
//     success: false,
//     message: 'Internal server error',
//     error: process.env.NODE_ENV === 'development' ? err.message : undefined
//   });
// });

// // ---------- 404 NOT FOUND ----------
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: `Route ${req.originalUrl} not found`
//   });
// });

// // ---------- START SERVER ----------
// app.listen(port, () => {
//   console.log(`🚀 Server running on port ${port}`);
//   console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
//   console.log(`📅 Started at: ${new Date().toLocaleString()}`);
// });

const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const nodemailer = require("nodemailer");
const cookieParser = require("cookie-parser");
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');
const validator = require('validator');

// ============================================================
// ENVIRONMENT VARIABLES
// ============================================================
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT) || 3306;
const DB_USER = process.env.DB_USER || 'pacific';
const DB_PASSWORD = process.env.DB_PASSWORD || 'Nahid0088@gmail.com';
const DB_NAME = process.env.DB_NAME || 'auth_system';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
const EMAIL_USER = process.env.EMAIL_USER || 'your-email@gmail.com';
const EMAIL_APP_PASSWORD = process.env.EMAIL_APP_PASSWORD || 'your-app-password';
const NODE_ENV = process.env.NODE_ENV || 'development';

console.log('📋 Environment Configuration:');
console.log(`  PORT: ${PORT}`);
console.log(`  DB_HOST: ${DB_HOST}`);
console.log(`  DB_PORT: ${DB_PORT}`);
console.log(`  DB_NAME: ${DB_NAME}`);
console.log(`  CLIENT_URL: ${CLIENT_URL}`);
console.log(`  NODE_ENV: ${NODE_ENV}`);

// ============================================================
// SAFE JSON PARSER HELPER
// ============================================================
function safeParseJSON(data, defaultValue = null) {
  if (data === null || data === undefined) {
    return defaultValue;
  }
  
  if (typeof data === 'object') {
    return data;
  }
  
  if (typeof data === 'string') {
    if (data === '' || data === 'null' || data === 'undefined') {
      return defaultValue;
    }
    
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('❌ JSON Parse Error:', e.message);
      console.error('📝 Data:', data.substring(0, 200) + (data.length > 200 ? '...' : ''));
      return defaultValue;
    }
  }
  
  return data;
}

// ============================================================
// CORS CONFIGURATION
// ============================================================
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:60174',
      'http://localhost',
      'http://192.168.0.4:3000',
      'http://192.168.0.4:60174',
      'http://192.168.0.4',
      CLIENT_URL
    ];

    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Origin',
    'Accept',
    'X-Requested-With',
    'X-App-Source',
    'X-App-Version',
    'X-Request-ID'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

// ============================================================
// CREATE UPLOAD DIRECTORIES
// ============================================================
function createUploadDirectories() {
  const directories = [
    path.join(__dirname, 'uploads'),
    path.join(__dirname, 'uploads/profiles'),
    path.join(__dirname, 'uploads/nids'),
    path.join(__dirname, 'uploads/services'),
    path.join(__dirname, 'uploads/cvs'),
    path.join(__dirname, 'uploads/licenses'),
    path.join(__dirname, 'uploads/reports')
  ];

  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  });
}

// ============================================================
// APP SETUP
// ============================================================
const app = express();

// Middleware setup
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.options('*', cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Additional CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && origin.startsWith('http://localhost:')) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  if (origin && origin.startsWith('http://192.168.0.5:')) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, Accept, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

createUploadDirectories();

// ============================================================
// DATABASE CONNECTION
// ============================================================
const db = mysql.createPool({
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  ...(DB_HOST !== "localhost" &&
  DB_HOST !== "127.0.0.1"
    ? {
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {}),
}).promise();

console.log(`📊 Database Configuration:
  Host: ${DB_HOST}
  Port: ${DB_PORT}
  User: ${DB_USER}
  Database: ${DB_NAME}
  SSL: ${DB_HOST && DB_HOST !== 'localhost' && DB_HOST !== '127.0.0.1' ? 'Enabled' : 'Disabled'}
`);

// ============================================================
// DATABASE INITIALIZATION
// ============================================================
const initializeDatabase = async () => {
  try {
    console.log("🔧 Initializing database tables...");

    // Check if orders table exists
    try {
      await db.query(`SELECT 1 FROM orders LIMIT 1`);
    } catch (err) {
      console.log("📝 Creating orders table...");
      await db.query(`
        CREATE TABLE IF NOT EXISTS orders (
          id INT AUTO_INCREMENT PRIMARY KEY,
          order_id VARCHAR(50) NOT NULL UNIQUE,
          user_id VARCHAR(50) NOT NULL,
          order_date DATE NOT NULL,
          time_slot VARCHAR(50) NOT NULL,
          notes TEXT,
          address_type VARCHAR(50),
          home_address TEXT,
          office_address TEXT,
          temp_address TEXT,
          recipient_name VARCHAR(255),
          recipient_phone VARCHAR(50),
          cart_items TEXT,
          status VARCHAR(50) DEFAULT 'Pending',
          cancel_reason TEXT,
          cancelled_at DATETIME,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      console.log("✅ Orders table created");
    }

    // Order schedule columns
    const orderScheduleColumns = [
      { name: 'schedule_changed', type: 'BOOLEAN DEFAULT FALSE' },
      { name: 'schedule_changed_date', type: 'DATETIME' }
    ];

    for (const column of orderScheduleColumns) {
      try {
        await db.query(`ALTER TABLE orders ADD COLUMN ${column.name} ${column.type}`);
        console.log(`✅ Added ${column.name} column to orders table`);
      } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
          console.log(`ℹ️ ${column.name} column already exists`);
        } else {
          console.error(`Error adding ${column.name}:`, err.message);
        }
      }
    }

    // schedule_changes table
    try {
      await db.query(`
        CREATE TABLE IF NOT EXISTS schedule_changes (
          id INT AUTO_INCREMENT PRIMARY KEY,
          order_id VARCHAR(50) NOT NULL,
          user_id VARCHAR(50) NOT NULL,
          previous_date DATE NOT NULL,
          previous_time_slot VARCHAR(50) NOT NULL,
          new_date DATE NOT NULL,
          new_time_slot VARCHAR(50) NOT NULL,
          changed_by VARCHAR(50) NOT NULL,
          reason TEXT,
          change_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
          INDEX idx_order_id (order_id),
          INDEX idx_user_id (user_id)
        )
      `);
      console.log("✅ schedule_changes table checked/created");
    } catch (err) {
      console.log("ℹ️ schedule_changes table already exists or error:", err.message);
    }

    // notifications table
    try {
      await db.query(`
        CREATE TABLE IF NOT EXISTS notifications (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id VARCHAR(50) NOT NULL,
          user_type ENUM('user', 'vendor', 'admin') NOT NULL,
          title VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          type VARCHAR(50),
          related_id VARCHAR(50),
          is_read BOOLEAN DEFAULT FALSE,
          read_at TIMESTAMP NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_user (user_id, user_type),
          INDEX idx_unread (user_id, user_type, is_read)
        )
      `);
      console.log("✅ notifications table checked/created");
    } catch (err) {
      console.log("ℹ️ notifications table already exists or error:", err.message);
    }

    // order_reviews table
    try {
      await db.query(`
        CREATE TABLE IF NOT EXISTS order_reviews (
          id INT AUTO_INCREMENT PRIMARY KEY,
          order_id VARCHAR(50) NOT NULL,
          user_id VARCHAR(50) NOT NULL,
          service_expert_rating INT NOT NULL DEFAULT 5,
          website_service_rating INT NOT NULL DEFAULT 5,
          comments TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
          INDEX idx_order_id (order_id),
          INDEX idx_user_id (user_id)
        )
      `);
      console.log("✅ order_reviews table checked");
    } catch (err) {
      console.log("ℹ️ order_reviews table already exists");
    }

    // Orders table columns
    const ordersColumns = [
      { name: 'service_expert', type: 'TEXT' },
      { name: 'reviews', type: 'TEXT' },
      { name: 'assigned_date', type: 'DATETIME' },
      { name: 'in_progress_date', type: 'DATETIME' },
      { name: 'completed_date', type: 'DATETIME' },
      { name: 'confirmed_date', type: 'DATETIME' },
      { name: 'vendor_id', type: 'INT' },
      { name: 'service_started_date', type: 'DATETIME' },
      { name: 'cancelled_by', type: 'VARCHAR(50)' },
      { name: 'cancelled_date', type: 'DATETIME' },
      { name: 'penalty_fee', type: 'DECIMAL(10,2) DEFAULT 0.00' },
      { name: 'hold_reason', type: 'TEXT' },
      { name: 'checkout_charge', type: 'DECIMAL(10,2) DEFAULT 0.00' },
      { name: 'hold_date', type: 'DATETIME' },
      { name: 'updated_by', type: 'VARCHAR(50)' }
    ];

    for (const column of ordersColumns) {
      try {
        await db.query(`ALTER TABLE orders ADD COLUMN ${column.name} ${column.type}`);
        console.log(`✅ Added ${column.name} column to orders table`);
      } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
          console.log(`ℹ️ ${column.name} column already exists`);
        } else {
          console.error(`Error adding ${column.name}:`, err.message);
        }
      }
    }

    // Foreign key
    try {
      await db.query(`
        ALTER TABLE orders 
        ADD FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE SET NULL
      `);
      console.log("✅ Added vendor_id foreign key");
    } catch (err) {
      if (err.code === 'ER_DUP_KEY' || err.code === 'ER_CANT_CREATE_TABLE') {
        console.log("ℹ️ Foreign key already exists");
      } else {
        console.error("Error adding foreign key:", err.message);
      }
    }

    // Indexes
    try {
      await db.query('CREATE INDEX idx_status ON orders(status)');
      console.log("✅ Created idx_status index");
    } catch (err) {
      if (err.code === 'ER_DUP_KEYNAME') {
        console.log("ℹ️ idx_status index already exists");
      }
    }

    try {
      await db.query('CREATE INDEX idx_vendor_id ON orders(vendor_id)');
      console.log("✅ Created idx_vendor_id index");
    } catch (err) {
      if (err.code === 'ER_DUP_KEYNAME') {
        console.log("ℹ️ idx_vendor_id index already exists");
      }
    }

    // Users table reset token columns
    try {
      await db.query(`
        ALTER TABLE users
        ADD COLUMN reset_token VARCHAR(255),
        ADD COLUMN reset_token_expiry DATETIME
      `);
      console.log("✅ Added reset token columns to users table");
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log("ℹ️ Reset token columns already exist in users table");
      }
    }

    // Vendors table columns
    const vendorColumns = [
      { name: 'total_orders', type: 'INT DEFAULT 0' },
      { name: 'completed_orders', type: 'INT DEFAULT 0' },
      { name: 'pending_orders', type: 'INT DEFAULT 0' },
      { name: 'canceled_orders', type: 'INT DEFAULT 0' },
      { name: 'active_orders', type: 'INT DEFAULT 0' },
      { name: 'hold_orders', type: 'INT DEFAULT 0' },
      { name: 'success_rate', type: 'INT DEFAULT 0' },
      { name: 'average_rating', type: 'DECIMAL(3,2) DEFAULT 0.0' },
      { name: 'wallet_balance', type: 'DECIMAL(10,2) DEFAULT 0.0' },
      { name: 'reset_token', type: 'VARCHAR(255)' },
      { name: 'reset_token_expiry', type: 'DATETIME' }
    ];

    for (const column of vendorColumns) {
      try {
        await db.query(`ALTER TABLE vendors ADD COLUMN ${column.name} ${column.type}`);
        console.log(`✅ Added ${column.name} column to vendors table`);
      } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
          console.log(`ℹ️ ${column.name} column already exists in vendors table`);
        }
      }
    }

    // Vendors table indexes
    try {
      await db.query('CREATE INDEX idx_vendor_status ON vendors(status)');
      console.log("✅ Created idx_vendor_status index");
    } catch (err) {
      if (err.code === 'ER_DUP_KEYNAME') {
        console.log("ℹ️ idx_vendor_status index already exists");
      }
    }

    // vendor_cancellations table
    try {
      await db.query(`
        CREATE TABLE IF NOT EXISTS vendor_cancellations (
          id INT AUTO_INCREMENT PRIMARY KEY,
          vendor_id INT NOT NULL,
          order_id VARCHAR(50) NOT NULL,
          user_id VARCHAR(50) NOT NULL,
          penalty_amount DECIMAL(10,2) DEFAULT 0.00,
          reason TEXT,
          cancelled_by VARCHAR(50) NOT NULL,
          vendor_amount DECIMAL(10,2) DEFAULT 0.00,
          admin_amount DECIMAL(10,2) DEFAULT 0.00,
          cancellation_type VARCHAR(50),
          accepted_by_vendor BOOLEAN DEFAULT FALSE,
          vendor_accepted_at TIMESTAMP NULL,
          cancelled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
          FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
          INDEX idx_vendor_id (vendor_id),
          INDEX idx_order_id (order_id)
        )
      `);
      console.log("✅ vendor_cancellations table checked/created");
    } catch (err) {
      console.log("ℹ️ vendor_cancellations table already exists or error:", err.message);
    }

    // vendor_transactions table
    try {
      await db.query(`
        CREATE TABLE IF NOT EXISTS vendor_transactions (
          id INT AUTO_INCREMENT PRIMARY KEY,
          vendor_id INT NOT NULL,
          order_id VARCHAR(50),
          amount DECIMAL(10,2) NOT NULL,
          transaction_type VARCHAR(50) NOT NULL,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
          INDEX idx_vendor_id (vendor_id)
        )
      `);
      console.log("✅ vendor_transactions table checked/created");
    } catch (err) {
      console.log("ℹ️ vendor_transactions table already exists or error:", err.message);
    }

    // order_history table
    try {
      await db.query(`
        CREATE TABLE IF NOT EXISTS order_history (
          id INT AUTO_INCREMENT PRIMARY KEY,
          order_id VARCHAR(50) NOT NULL,
          status VARCHAR(50),
          action_by VARCHAR(50),
          action_type VARCHAR(50),
          details TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_order_id (order_id)
        )
      `);
      console.log("✅ order_history table checked/created");
    } catch (err) {
      console.log("ℹ️ order_history table already exists or error:", err.message);
    }

    // order_reports table
    try {
      await db.query(`
        CREATE TABLE IF NOT EXISTS order_reports (
          id INT AUTO_INCREMENT PRIMARY KEY,
          order_id VARCHAR(50) NOT NULL,
          user_id VARCHAR(50) NOT NULL,
          description TEXT NOT NULL,
          file_url VARCHAR(255),
          status VARCHAR(50) DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_order_id (order_id),
          INDEX idx_user_id (user_id)
        )
      `);
      console.log("✅ order_reports table checked/created");
    } catch (err) {
      console.log("ℹ️ order_reports table already exists or error:", err.message);
    }

    console.log("🎉 Database initialization completed successfully!");

  } catch (error) {
    console.error("❌ Database initialization error:", error);
  }
};

// Database connection
(async () => {
  try {
    await db.query("SELECT 1");

    console.log("✅ Connected to MySQL database");

    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${NODE_ENV}`);
      console.log(`🔗 Client URL: ${CLIENT_URL}`);
    });

  } catch (err) {
    console.error("❌ Database connection error:", err);
    process.exit(1);
  }
})();

// ============================================================
// MULTER CONFIGURATION
// ============================================================
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, 'uploads/profiles');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `profile-${Date.now()}${ext}`);
  }
});

const serviceStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, 'uploads/services');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `service-${Date.now()}${ext}`);
  }
});

const vendorStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dir;
    switch (file.fieldname) {
      case 'profile_image':
        dir = path.join(__dirname, 'uploads/profiles');
        break;
      case 'nid_front':
      case 'nid_back':
        dir = path.join(__dirname, 'uploads/nids');
        break;
      case 'cv':
        dir = path.join(__dirname, 'uploads/cvs');
        break;
      case 'trade_license':
        dir = path.join(__dirname, 'uploads/licenses');
        break;
      default:
        dir = path.join(__dirname, 'uploads/others');
    }
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const timestamp = Date.now();
    cb(null, `${file.fieldname}-${timestamp}${ext}`);
  }
});

const imageFileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('শুধুমাত্র ইমেজ ফাইল (JPEG, JPG, PNG, GIF) অনুমোদিত'), false);
  }
};

const uploadProfile = multer({
  storage: profileStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFileFilter
});

const uploadService = multer({
  storage: serviceStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: imageFileFilter
});

const uploadVendorDocs = multer({
  storage: vendorStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    cb(null, true);
  }
});

// ============================================================
// AUTHENTICATION MIDDLEWARE
// ============================================================
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ success: false, message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "Token missing" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
};

const verifyToken = (roles = []) => (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "Authorization token missing" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role === 'superadmin') {
      req.user = decoded;
      return next();
    }

    if (roles.length > 0 && !roles.includes(decoded.role)) {
      return res.status(403).json({
        success: false,
        message: `Requires one of these roles: ${roles.join(', ')}`
      });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
      error: err.message
    });
  }
};

const authenticateAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error('Token verification error:', err);
        return res.status(403).json({
          success: false,
          message: 'Invalid or expired token'
        });
      }

      const allowedRoles = ['admin', 'superadmin'];
      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Admin privileges required.'
        });
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

const authenticateVendor = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token required"
      });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log('❌ Token verification failed:', err.message);
        return res.status(403).json({
          success: false,
          message: "Invalid or expired token"
        });
      }

      if (decoded.role !== 'vendor') {
        return res.status(403).json({
          success: false,
          message: "Access denied. Vendor role required."
        });
      }

      let vendorId = decoded.userId || decoded.id || decoded.vendorId || decoded.user_id;

      if (!vendorId && decoded.user && decoded.user.id) {
        vendorId = decoded.user.id;
      }

      if (!vendorId) {
        req.vendor = {
          email: decoded.email || decoded.userEmail,
          role: decoded.role,
        };
      } else {
        req.vendor = {
          vendorId: vendorId,
          email: decoded.email || decoded.userEmail,
          role: decoded.role
        };
      }

      next();
    });
  } catch (error) {
    console.error("❌ Authentication error:", error);
    res.status(500).json({
      success: false,
      message: "Authentication failed"
    });
  }
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

async function updateVendorStats(orderId, oldStatus, newStatus, vendorId, serviceExpert = null) {
  if (!vendorId || oldStatus === newStatus) return;

  try {
    await db.query('START TRANSACTION');

    console.log(`📊 Updating vendor stats: ${oldStatus} → ${newStatus}`);

    const decrementMap = {
      'Pending': 'pending_orders',
      'Active': 'active_orders',
      'Processing': 'active_orders',
      'Started': 'active_orders',
      'Completed': 'completed_orders',
      'Cancelled': 'canceled_orders',
      'Hold': 'hold_orders'
    };

    if (decrementMap[oldStatus]) {
      await db.query(
        `UPDATE vendors SET ${decrementMap[oldStatus]} = GREATEST(0, ${decrementMap[oldStatus]} - 1) WHERE id = ?`,
        [vendorId]
      );
      console.log(`   ✅ Decremented ${decrementMap[oldStatus]}`);
    }

    const incrementMap = {
      'Pending': 'pending_orders',
      'Active': 'active_orders',
      'Processing': 'active_orders',
      'Started': 'active_orders',
      'Completed': 'completed_orders',
      'Cancelled': 'canceled_orders',
      'Hold': 'hold_orders'
    };

    if (incrementMap[newStatus]) {
      await db.query(
        `UPDATE vendors SET ${incrementMap[newStatus]} = ${incrementMap[newStatus]} + 1 WHERE id = ?`,
        [vendorId]
      );
      console.log(`   ✅ Incremented ${incrementMap[newStatus]}`);
    }

    if (newStatus === 'Completed') {
      await db.query(
        'UPDATE vendors SET total_orders = total_orders + 1 WHERE id = ?',
        [vendorId]
      );
      console.log(`   ✅ Incremented total_orders`);

      if (serviceExpert) {
        try {
          const expertData = safeParseJSON(serviceExpert, null);
          
          if (expertData && expertData.rating) {
            await db.query(
              `UPDATE vendors v
               SET v.average_rating = (
                 SELECT COALESCE(AVG(
                   CASE 
                     WHEN JSON_EXTRACT(o.service_expert, '$.rating') IS NOT NULL 
                     THEN JSON_EXTRACT(o.service_expert, '$.rating')
                     ELSE 0 
                   END
                 ), 0)
                 FROM orders o
                 WHERE o.vendor_id = v.id 
                 AND o.status = 'Completed'
                 AND o.service_expert IS NOT NULL
               )
               WHERE v.id = ?`,
              [vendorId]
            );
            console.log(`   ✅ Updated average_rating`);
          }
        } catch (e) {
          console.error('   ⚠️ Rating update error:', e.message);
        }
      }
    }

    await db.query(
      `UPDATE vendors v
       SET v.success_rate = (
         SELECT CASE 
           WHEN (completed_orders + canceled_orders) > 0 
           THEN ROUND((completed_orders / (completed_orders + canceled_orders)) * 100)
           ELSE 0 
         END
         FROM vendors v2
         WHERE v2.id = v.id
       )
       WHERE v.id = ?`,
      [vendorId]
    );
    console.log(`   ✅ Updated success_rate`);

    await db.query('COMMIT');
    console.log(`✅ Vendor ${vendorId} stats updated successfully`);

  } catch (error) {
    await db.query('ROLLBACK');
    console.error('❌ Vendor stats update error:', error);
    throw error;
  }
}

function hasServiceStarted(order) {
  try {
    if (order.service_started_date) return true;
    if (order.time_slot && order.order_date) {
      const orderDate = new Date(order.order_date);
      const [startTimeStr] = order.time_slot.split('-');
      const [hours, minutes] = startTimeStr.split(':').map(Number);
      const serviceStartTime = new Date(orderDate);
      serviceStartTime.setHours(hours, minutes, 0, 0);
      return new Date() >= serviceStartTime;
    }
    return false;
  } catch (error) {
    return false;
  }
}

// ============================================================
// EMAIL TRANSPORTER
// ============================================================
const sendResetEmail = async (email, resetLink, userName) => {
  try {
    console.log("🔄 Attempting to send email...");

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_APP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false
      },
      logger: true,
      debug: true
    });

    const mailOptions = {
      from: {
        name: 'Pacific Support',
        address: EMAIL_USER
      },
      to: email,
      subject: 'Password Reset Request - Pacific Support',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset - Pacific Support</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: #f8fafc; }
                .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
                .header { background: linear-gradient(135deg, #3c8ce7 0%, #00c6ff 100%); padding: 40px 30px; text-align: center; color: white; }
                .header h1 { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
                .content { padding: 40px 30px; background: #ffffff; }
                .content h2 { color: #1e293b; font-size: 24px; font-weight: 600; margin-bottom: 16px; }
                .content p { color: #475569; font-size: 16px; margin-bottom: 20px; }
                .button { background: #3c8ce7; color: white; padding: 16px 36px; text-decoration: none; border-radius: 8px; display: inline-block; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px -1px rgba(60,140,231,0.3); }
                .button:hover { background: #2b7cd9; transform: translateY(-2px); }
                .footer { text-align: center; padding: 30px; color: #64748b; font-size: 14px; background: #f8fafc; border-top: 1px solid #e2e8f0; }
                .link-box { background: #f1f5f9; padding: 16px; border-radius: 8px; word-break: break-all; font-size: 14px; margin: 24px 0; border: 1px solid #e2e8f0; color: #475569; }
                .warning { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 16px; border-radius: 8px; margin: 20px 0; font-weight: 600; }
                .logo { font-size: 24px; font-weight: 700; margin-bottom: 8px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">🌊 Pacific Support</div>
                    <p>Password Reset Request</p>
                </div>
                <div class="content">
                    <h2>Hello ${userName},</h2>
                    <p>We received a request to reset your password for your Pacific Support account. Click the button below to create a new secure password:</p>
                    <div style="text-align: center; margin: 35px 0;">
                        <a href="${resetLink}" class="button">Reset Your Password</a>
                    </div>
                    <p>If the button doesn't work, copy and paste the following link into your web browser:</p>
                    <div class="link-box">${resetLink}</div>
                    <div class="warning">⚠️ This password reset link will expire in 1 hour for security reasons.</div>
                    <p>If you didn't request a password reset, you can safely ignore this email.</p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 Pacific Support. All rights reserved.</p>
                    <p style="font-size: 13px; opacity: 0.8;">This is an automated message, please do not reply to this email.</p>
                </div>
            </div>
        </body>
        </html>
      `,
      text: `
Password Reset Request - Pacific Support

Hello ${userName},

We received a request to reset your password for your Pacific Support account.

Reset your password here: ${resetLink}

This password reset link will expire in 1 hour for security reasons.

If you didn't request this password reset, you can safely ignore this email.

© 2024 Pacific Support. All rights reserved.
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");
    console.log("📨 Message ID:", info.messageId);

    return info;

  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    throw new Error(`Failed to send reset email: ${error.message}`);
  }
};

// ============================================================
// API ENDPOINTS
// ============================================================

// ---------- VENDOR ORDER ASSIGNMENT ----------
app.patch('/orders/:orderId/assign', verifyToken(['admin', 'superadmin']), async (req, res) => {
  const orderId = decodeURIComponent(req.params.orderId);
  const { vendor_id, status } = req.body;

  try {
    const [orderRows] = await db.query(
      'SELECT * FROM orders WHERE order_id = ?',
      [orderId]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
        debug: { orderId: orderId }
      });
    }

    const order = orderRows[0];
    let vendorData = null;

    if (vendor_id) {
      const [vendorRows] = await db.query(
        'SELECT * FROM vendors WHERE id = ? AND status = ?',
        [vendor_id, 'active']
      );

      if (vendorRows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Vendor not found or not active'
        });
      }
      vendorData = vendorRows[0];
    }

    const updateData = {
      vendor_id: vendor_id || null,
      status: vendor_id ? 'Active' : (status || 'Pending'),
      assigned_date: vendor_id ? new Date() : null,
      confirmed_date: vendor_id ? new Date() : null
    };

    if (!vendor_id && order.vendor_id) {
      await db.query(
        `UPDATE vendors 
         SET pending_orders = GREATEST(0, pending_orders - 1),
             updated_at = NOW()
         WHERE id = ?`,
        [order.vendor_id]
      );
      updateData.status = 'Pending';
    }

    await db.query(
      'UPDATE orders SET ? WHERE order_id = ?',
      [updateData, orderId]
    );

    if (vendor_id) {
      await db.query(
        `UPDATE vendors 
         SET total_orders = total_orders + 1,
             pending_orders = pending_orders + 1,
             updated_at = NOW()
         WHERE id = ?`,
        [vendor_id]
      );
    }

    await db.query(
      `INSERT INTO order_history 
       (order_id, status, action_by, action_type, details) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        orderId,
        updateData.status,
        req.user.id,
        vendor_id ? 'vendor_assigned' : 'vendor_removed',
        vendor_id
          ? `Vendor ${vendorData?.name} assigned - Order set to Active`
          : 'Vendor removed - Order set to Pending'
      ]
    );

    res.json({
      success: true,
      message: vendor_id
        ? 'Order assigned to vendor and set to Active'
        : 'Vendor removed from order',
      order: {
        order_id: orderId,
        status: updateData.status,
        vendor_id: vendor_id,
        vendor_data: vendorData,
        assigned_date: updateData.assigned_date,
        confirmed_date: updateData.confirmed_date
      }
    });

  } catch (error) {
    console.error('Order assignment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign order',
      error: error.message
    });
  }
});

// ---------- ORDER COMPLETION ----------
app.patch('/orders/:orderId/complete', verifyToken(['admin', 'vendor', 'superadmin']), async (req, res) => {
  const { orderId } = req.params;
  const userRole = req.user.role;

  try {
    const [orderRows] = await db.query(
      'SELECT * FROM orders WHERE order_id = ?',
      [orderId]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orderRows[0];

    if (userRole === 'vendor' && order.vendor_id !== req.user.vendorId) {
      return res.status(403).json({
        success: false,
        message: 'You can only complete your assigned orders'
      });
    }

    await db.query(
      `UPDATE orders 
       SET status = 'Completed',
           completed_date = NOW()
       WHERE order_id = ?`,
      [orderId]
    );

    if (order.vendor_id) {
      await db.query(
        `UPDATE vendors 
         SET completed_orders = completed_orders + 1,
             pending_orders = pending_orders - 1,
             updated_at = NOW()
         WHERE id = ?`,
        [order.vendor_id]
      );
    }

    res.json({
      success: true,
      message: 'Order marked as completed',
      order: {
        order_id: orderId,
        status: 'Completed',
        completed_date: new Date()
      }
    });
  } catch (error) {
    console.error('Order completion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete order'
    });
  }
});


// ---------- GET USER ORDERS ----------
app.get("/api/orders", authenticateJWT, async (req, res) => {
  const userId = req.user.userId;

  try {
    const [orders] = await db.query(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC",
      [userId]
    );

    const parsedOrders = orders.map(order => {
      const parsedCart = safeParseJSON(order.cart_items, []);
      const parsedServiceExpert = safeParseJSON(order.service_expert, null);
      const parsedReviews = safeParseJSON(order.reviews, null);
      
      const homeAddress = safeParseJSON(order.home_address, null);
      const officeAddress = safeParseJSON(order.office_address, null);
      const tempAddress = safeParseJSON(order.temp_address, null);

      let primaryAddress = null;
      let addressType = order.address_type || 'home';

      if (addressType === 'home' && homeAddress) primaryAddress = homeAddress;
      else if (addressType === 'office' && officeAddress) primaryAddress = officeAddress;
      else if (addressType === 'another' && tempAddress) primaryAddress = tempAddress;

      let fullAddress = "";
      if (primaryAddress) {
        const parts = [];
        if (primaryAddress.addressLine1) parts.push(primaryAddress.addressLine1);
        if (primaryAddress.addressLine2) parts.push(primaryAddress.addressLine2);
        if (primaryAddress.areaName) parts.push(primaryAddress.areaName);
        if (primaryAddress.city) parts.push(primaryAddress.city);
        if (primaryAddress.landmark) parts.push(`Near ${primaryAddress.landmark}`);
        fullAddress = parts.join(", ");
      }

      const cartItems = Array.isArray(parsedCart) ? parsedCart : [];
      const total = cartItems.reduce((sum, item) =>
        sum + ((item?.price || 0) * (item?.quantity || 0)), 0
      );

      return {
        ...order,
        cart_items: cartItems,
        service_expert: parsedServiceExpert,
        reviews: parsedReviews,
        home_address: homeAddress,
        office_address: officeAddress,
        temp_address: tempAddress,
        address: primaryAddress,
        full_address: fullAddress,
        total: total.toFixed(2)
      };
    });

    res.status(200).json({ success: true, orders: parsedOrders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
});

// ---------- VENDOR ORDERS ----------
app.get('/api/vendor/orders', authenticateVendor, async (req, res) => {
  try {
    const vendorId = req.vendor.vendorId;

    const [orders] = await db.query(
      `SELECT 
        o.order_id,
        o.user_id,
        o.order_date,
        o.time_slot,
        o.notes,
        o.address_type,
        o.home_address,
        o.office_address,
        o.temp_address,
        o.recipient_name,
        o.recipient_phone,
        o.cart_items,
        o.status,
        o.cancel_reason,
        o.service_expert,
        o.assigned_date,
        o.completed_date,
        u.name AS customer_name,
        u.email AS customer_email,
        u.phone_number AS customer_phone
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.custom_id
      WHERE o.vendor_id = ?
      ORDER BY o.order_date DESC`,
      [vendorId]
    );

    const parsedOrders = orders.map(order => {
      const parsedCart = safeParseJSON(order.cart_items, []);
      const parsedServiceExpert = safeParseJSON(order.service_expert, null);
      
      let addressField = null;
      if (order.address_type === 'home' && order.home_address) {
        addressField = order.home_address;
      } else if (order.address_type === 'office' && order.office_address) {
        addressField = order.office_address;
      } else if (order.address_type === 'another' && order.temp_address) {
        addressField = order.temp_address;
      }
      
      const parsedAddress = safeParseJSON(addressField, {});
      const cartItems = Array.isArray(parsedCart) ? parsedCart : [];
      const total = cartItems.reduce((sum, item) =>
        sum + ((item?.price || 0) * (item?.quantity || 0)), 0
      );

      return {
        ...order,
        cart_items: cartItems,
        service_expert: parsedServiceExpert,
        address: parsedAddress,
        total: total.toFixed(2)
      };
    });

    res.json({
      success: true,
      orders: parsedOrders
    });
  } catch (error) {
    console.error('Vendor orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
});

// ---------- ORDER REVIEW SUBMISSION ----------
app.post('/orders/:orderId/review', authenticateJWT, async (req, res) => {
  const { orderId } = req.params;
  const { serviceExpert, websiteService, comments } = req.body;
  const userId = req.user.userId;

  try {
    const [orderRows] = await db.query(
      `SELECT * FROM orders 
       WHERE order_id = ? AND user_id = ? AND status = 'Completed'`,
      [orderId, userId]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or not completed'
      });
    }

    const [existingReview] = await db.query(
      'SELECT id FROM order_reviews WHERE order_id = ?',
      [orderId]
    );

    if (existingReview.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Review already submitted for this order'
      });
    }

    const reviewData = {
      order_id: orderId,
      user_id: userId,
      service_expert_rating: serviceExpert || 5,
      website_service_rating: websiteService || 5,
      comments: comments || '',
      created_at: new Date()
    };

    await db.query(
      `INSERT INTO order_reviews 
       (order_id, user_id, service_expert_rating, website_service_rating, comments, created_at) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        reviewData.order_id,
        reviewData.user_id,
        reviewData.service_expert_rating,
        reviewData.website_service_rating,
        reviewData.comments,
        reviewData.created_at
      ]
    );

    const reviewSummary = {
      serviceExpert: reviewData.service_expert_rating,
      websiteService: reviewData.website_service_rating,
      comments: reviewData.comments,
      reviewedAt: reviewData.created_at
    };

    await db.query(
      'UPDATE orders SET reviews = ? WHERE order_id = ?',
      [JSON.stringify(reviewSummary), orderId]
    );

    res.json({
      success: true,
      message: 'Review submitted successfully',
      review: reviewData
    });
  } catch (error) {
    console.error('Review submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit review'
    });
  }
});

// ---------- GET ORDER REVIEWS ----------
app.get('/orders/:orderId/reviews', async (req, res) => {
  const { orderId } = req.params;

  try {
    const [reviews] = await db.query(
      `SELECT 
        r.*,
        u.name as user_name,
        u.photo as user_photo
       FROM order_reviews r
       LEFT JOIN users u ON r.user_id = u.custom_id
       WHERE r.order_id = ?
       ORDER BY r.created_at DESC`,
      [orderId]
    );

    if (reviews.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No reviews found for this order'
      });
    }

    res.json({
      success: true,
      reviews: reviews.map(review => ({
        id: review.id,
        order_id: review.order_id,
        user_name: review.user_name,
        user_photo: review.user_photo,
        service_expert_rating: review.service_expert_rating,
        website_service_rating: review.website_service_rating,
        comments: review.comments,
        created_at: review.created_at
      }))
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews'
    });
  }
});

// ---------- ORDER TRACKING ----------
app.get('/orders/:orderId/tracking', authenticateJWT, async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user.userId;

  try {
    const [orderRows] = await db.query(
      `SELECT 
        o.*,
        u.name as customer_name,
        u.email as customer_email,
        u.phone_number as customer_phone,
        v.name as vendor_name,
        v.email as vendor_email,
        v.phone_number as vendor_phone,
        v.vendor_photo as vendor_photo
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.custom_id
       LEFT JOIN vendors v ON o.vendor_id = v.id
       WHERE o.order_id = ? AND o.user_id = ?`,
      [orderId, userId]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orderRows[0];

    const parsedCart = safeParseJSON(order.cart_items, []);
    const parsedServiceExpert = safeParseJSON(order.service_expert, null);
    const parsedReviews = safeParseJSON(order.reviews, null);

    let addressField = null;
    if (order.address_type === 'home' && order.home_address) {
      addressField = order.home_address;
    } else if (order.address_type === 'office' && order.office_address) {
      addressField = order.office_address;
    } else if (order.address_type === 'another' && order.temp_address) {
      addressField = order.temp_address;
    }

    const parsedAddress = safeParseJSON(addressField, {});
    const cartItems = Array.isArray(parsedCart) ? parsedCart : [];
    const total = cartItems.reduce((sum, item) =>
      sum + ((item?.price || 0) * (item?.quantity || 0)), 0
    );

    const timeline = [
      {
        status: 'Order Placed',
        time: order.order_date,
        description: 'Order has been placed successfully',
        completed: true
      },
      {
        status: 'Order Confirmed',
        time: order.confirmed_date || null,
        description: 'Order has been confirmed',
        completed: !!order.confirmed_date
      },
      {
        status: 'Vendor Assigned',
        time: order.assigned_date || null,
        description: order.vendor_name ? `Assigned to ${order.vendor_name}` : 'Waiting for vendor assignment',
        completed: !!order.assigned_date
      },
      {
        status: 'Service In Progress',
        time: order.in_progress_date || null,
        description: 'Service expert is on the way',
        completed: order.status === 'Active' || order.status === 'Completed'
      },
      {
        status: 'Completed',
        time: order.completed_date || null,
        description: 'Service has been completed',
        completed: order.status === 'Completed'
      }
    ];

    res.json({
      success: true,
      order: {
        order_id: order.order_id,
        status: order.status,
        timeline: timeline,
        customer: {
          name: order.customer_name,
          email: order.customer_email,
          phone: order.customer_phone
        },
        vendor: order.vendor_id ? {
          name: order.vendor_name,
          email: order.vendor_email,
          phone: order.vendor_phone,
          photo: order.vendor_photo
        } : null,
        service_expert: parsedServiceExpert,
        address: parsedAddress,
        cart_items: cartItems,
        total: total.toFixed(2),
        reviews: parsedReviews,
        time_slot: order.time_slot,
        notes: order.notes || '',
        cancel_reason: order.cancel_reason || null
      }
    });
  } catch (error) {
    console.error('Tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tracking information'
    });
  }
});

// ---------- VERIFY RESET TOKEN ----------
app.post('/api/verify-reset-token', async (req, res) => {
  const { token, email } = req.body;

  if (!token || !email) {
    return res.status(400).json({
      success: false,
      message: 'Token and email are required'
    });
  }

  try {
    const [users] = await db.query(
      "SELECT email FROM users WHERE reset_token = ? AND email = ? AND reset_token_expiry > NOW()",
      [token, email]
    );

    const [vendors] = await db.query(
      "SELECT email FROM vendors WHERE reset_token = ? AND email = ? AND reset_token_expiry > NOW()",
      [token, email]
    );

    const isValid = users.length > 0 || vendors.length > 0;

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    res.json({
      success: true,
      message: 'Token is valid'
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Token verification failed'
    });
  }
});

// ---------- RESET PASSWORD ----------
app.post('/api/reset-password', async (req, res) => {
  const { token, email, newPassword } = req.body;

  if (!token || !email || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters'
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const [users] = await db.query(
      "SELECT * FROM users WHERE reset_token = ? AND email = ? AND reset_token_expiry > NOW()",
      [token, email]
    );

    const [vendors] = await db.query(
      "SELECT * FROM vendors WHERE reset_token = ? AND email = ? AND reset_token_expiry > NOW()",
      [token, email]
    );

    let userType = null;

    if (users.length > 0) {
      userType = 'user';
    } else if (vendors.length > 0) {
      userType = 'vendor';
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    if (userType === 'user') {
      await db.query(
        "UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE email = ?",
        [hashedPassword, email]
      );
    } else if (userType === 'vendor') {
      await db.query(
        "UPDATE vendors SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE email = ?",
        [hashedPassword, email]
      );
    }

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Password reset failed'
    });
  }
});

// ---------- FILTER ORDERS ----------
app.get('/orders/filter', authenticateJWT, async (req, res) => {
  const userId = req.user.userId;
  const { status, dateFrom, dateTo, search } = req.query;

  try {
    let query = `
      SELECT * FROM orders 
      WHERE user_id = ?
    `;
    const params = [userId];

    if (status && status !== 'all') {
      if (status === 'active') {
        query += ` AND status NOT IN ('Pending', 'Cancelled', 'Completed')`;
      } else {
        query += ` AND status = ?`;
        params.push(status);
      }
    }

    if (dateFrom) {
      query += ` AND order_date >= ?`;
      params.push(dateFrom);
    }
    if (dateTo) {
      query += ` AND order_date <= ?`;
      params.push(dateTo);
    }

    if (search) {
      query += ` AND (order_id LIKE ? OR status LIKE ? OR notes LIKE ?)`;
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam);
    }

    query += ` ORDER BY order_date DESC`;

    const [orders] = await db.query(query, params);

    const parsedOrders = orders.map(order => {
      const parsedCart = safeParseJSON(order.cart_items, []);
      const parsedServiceExpert = safeParseJSON(order.service_expert, null);

      let addressField = null;
      if (order.address_type === 'home' && order.home_address) {
        addressField = order.home_address;
      } else if (order.address_type === 'office' && order.office_address) {
        addressField = order.office_address;
      } else if (order.address_type === 'another' && order.temp_address) {
        addressField = order.temp_address;
      }

      const parsedAddress = safeParseJSON(addressField, {});
      const cartItems = Array.isArray(parsedCart) ? parsedCart : [];
      const total = cartItems.reduce((sum, item) =>
        sum + ((item?.price || 0) * (item?.quantity || 0)), 0
      );

      return {
        ...order,
        cart_items: cartItems,
        service_expert: parsedServiceExpert,
        address: parsedAddress,
        total: total.toFixed(2)
      };
    });

    res.json({
      success: true,
      orders: parsedOrders,
      count: parsedOrders.length
    });
  } catch (error) {
    console.error('Filter orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to filter orders'
    });
  }
});

// ---------- ORDER CONFIRMATION ----------
app.patch('/orders/:orderId/confirm', verifyToken(['admin', 'superadmin']), async (req, res) => {
  const { orderId } = req.params;

  try {
    const [orderRows] = await db.query(
      'SELECT * FROM orders WHERE order_id = ?',
      [orderId]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orderRows[0];

    if (order.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'Order is not in Pending status'
      });
    }

    await db.query(
      `UPDATE orders 
       SET status = 'Active',
           confirmed_date = NOW()
       WHERE order_id = ?`,
      [orderId]
    );

    res.json({
      success: true,
      message: 'Order confirmed successfully',
      order: {
        order_id: orderId,
        status: 'Active',
        confirmed_date: new Date()
      }
    });
  } catch (error) {
    console.error('Order confirmation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm order'
    });
  }
});

// ---------- GET VENDOR DETAILS ----------
app.get('/api/vendors/:vendorId', verifyToken(['admin', 'superadmin', 'user']), async (req, res) => {
  const vendorId = req.params.vendorId;

  try {
    const [columns] = await db.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'vendors' 
      AND TABLE_SCHEMA = DATABASE()
    `);

    const availableColumns = columns.map(col => col.COLUMN_NAME);
    console.log('Available columns:', availableColumns);

    const desiredColumns = [
      'id', 'name', 'email', 'phone_number',
      'dob', 'nid_number', 'company_name', 'permanent_address',
      'present_address', 'business_address', 'technician_quantity',
      'vendor_photo', 'service_areas', 'services', 'rating', 
      'completed_orders', 'pending_orders', 'canceled_orders',
      'specialization', 'vehicle_type', 'working_hours', 'location',
      'service_radius', 'verified', 'status', 'created_at',
      'total_orders', 'active_orders', 'hold_orders', 'success_rate',
      'average_rating', 'wallet_balance'
    ];

    const columnsToSelect = desiredColumns.filter(col => availableColumns.includes(col));

    if (columnsToSelect.length === 0) {
      columnsToSelect.push('id', 'name', 'email', 'phone_number', 'rating', 'created_at');
    }

    const selectQuery = `
      SELECT ${columnsToSelect.join(', ')}
      FROM vendors 
      WHERE id = ?
    `;

    const [vendorRows] = await db.query(selectQuery, [vendorId]);

    if (vendorRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    const vendor = vendorRows[0];

    vendor.service_areas = safeParseJSON(vendor.service_areas, []);
    vendor.services = safeParseJSON(vendor.services, []);

    const completed = vendor.completed_orders || 0;
    const canceled = vendor.canceled_orders || 0;

    if (completed > 0) {
      const totalOrders = completed + canceled;
      vendor.success_rate = Math.round((completed / totalOrders) * 100);
    } else {
      vendor.success_rate = 0;
    }

    vendor.avg_rating = vendor.rating || 4.5;

    if (vendor.dob) {
      const dobDate = new Date(vendor.dob);
      const currentDate = new Date();
      let yearsDiff = currentDate.getFullYear() - dobDate.getFullYear();

      const monthDiff = currentDate.getMonth() - dobDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < dobDate.getDate())) {
        yearsDiff--;
      }

      vendor.experience_years = Math.max(1, yearsDiff - 18);
    } else {
      const createdDate = new Date(vendor.created_at);
      const currentDate = new Date();
      const yearsDiff = currentDate.getFullYear() - createdDate.getFullYear();
      vendor.experience_years = Math.max(1, yearsDiff);
    }

    vendor.total_reviews = Math.floor(vendor.completed_orders * 0.7) || 25;

    if (!vendor.specialization) {
      if (vendor.services && vendor.services.length > 0) {
        vendor.specialization = vendor.services[0];
      } else {
        vendor.specialization = 'General Services';
      }
    }

    if (!vendor.vehicle_type) vendor.vehicle_type = 'Motorcycle';
    if (!vendor.working_hours) vendor.working_hours = '9:00 AM - 6:00 PM';
    if (!vendor.location) {
      if (vendor.service_areas && vendor.service_areas.length > 0) {
        vendor.location = vendor.service_areas[0];
      } else if (vendor.permanent_address) {
        vendor.location = vendor.permanent_address;
      } else {
        vendor.location = 'Location not specified';
      }
    }
    if (!vendor.service_radius) vendor.service_radius = 10;
    if (vendor.verified === undefined || vendor.verified === null) vendor.verified = true;

    vendor.photo = vendor.vendor_photo || null;

    delete vendor.password;
    if (vendor.hashedPassword) delete vendor.hashedPassword;

    res.json({
      success: true,
      vendor: vendor
    });

  } catch (error) {
    console.error('Fetch vendor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vendor details',
      error: error.message
    });
  }
});

// ---------- REPORT ISSUE ----------
app.post('/orders/:orderId/report', verifyToken(['user', 'admin']), async (req, res) => {
  const orderId = decodeURIComponent(req.params.orderId);
  const userId = req.user.id;

  try {
    const [orderRows] = await db.query(
      'SELECT * FROM orders WHERE order_id = ?',
      [orderId]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orderRows[0];

    if (order.user_id !== userId && req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'You can only report issues for your own orders'
      });
    }

    let fileUrl = null;
    if (req.files && req.files.file) {
      const file = req.files.file;
      const fileName = `${Date.now()}_${file.name}`;
      const uploadPath = path.join(__dirname, 'uploads', 'reports', fileName);

      const dirPath = path.join(__dirname, 'uploads', 'reports');
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      await file.mv(uploadPath);
      fileUrl = `/uploads/reports/${fileName}`;
    }

    const [result] = await db.query(
      `INSERT INTO order_reports 
       (order_id, user_id, description, file_url, status, created_at) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [orderId, userId, req.body.description, fileUrl, 'pending']
    );

    await db.query(
      `UPDATE orders 
       SET notes = CONCAT(IFNULL(notes, ''), '\n[${new Date().toLocaleString()}]: Issue reported - ${req.body.description}')
       WHERE order_id = ?`,
      [orderId]
    );

    res.json({
      success: true,
      message: 'Issue reported successfully',
      reportId: result.insertId
    });

  } catch (error) {
    console.error('Report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit report'
    });
  }
});

// ---------- USER PROFILE UPDATE ----------
app.put(
  "/api/user-profile",
  authenticateJWT,
  uploadProfile.single("photo"),
  async (req, res) => {
    const userId = req.user.userId;

    try {
      const { name, phone_number } = req.body;

      if (!name || name.trim() === '') {
        return res.status(400).json({
          success: false,
          message: "Name is required"
        });
      }

      let home_address = {};
      let office_address = {};

      try {
        home_address = safeParseJSON(req.body.home_address, {});
        office_address = safeParseJSON(req.body.office_address, {});
      } catch (parseError) {
        console.error("Address parsing error:", parseError);
      }

      const updateFields = {
        name: name.trim(),
        phone_number: phone_number || null,
        home_address: JSON.stringify(home_address),
        office_address: JSON.stringify(office_address),
      };

      if (req.file) {
        const photoPath = `/uploads/profiles/${req.file.filename}`;
        updateFields.photo = photoPath;
      }

      Object.keys(updateFields).forEach(key => {
        if (updateFields[key] === undefined) {
          delete updateFields[key];
        }
      });

      await db.query("UPDATE users SET ? WHERE custom_id = ?", [
        updateFields,
        userId,
      ]);

      const [updated] = await db.query(
        "SELECT * FROM users WHERE custom_id = ?",
        [userId]
      );

      if (!updated || updated.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const updatedUser = updated[0];

      const responseUser = {
        ...updatedUser,
        home_address: safeParseJSON(updatedUser.home_address, {}),
        office_address: safeParseJSON(updatedUser.office_address, {}),
      };

      res.json({
        success: true,
        user: responseUser,
      });
    } catch (err) {
      console.error("Profile update error:", err);
      res.status(500).json({
        success: false,
        message: "Error updating profile",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }
  }
);

// ---------- USER REGISTRATION ----------
console.log("✅ /api/register route registered");

app.post("/api/register", async (req, res) => {
  const { firstName, email, phoneNumber, password } = req.body;

  if (!firstName || !email || !phoneNumber || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const [duplicateCheck] = await db.query(
      "SELECT * FROM users WHERE email = ? OR phone_number = ?",
      [email, phoneNumber]
    );

    if (duplicateCheck.length > 0) {
      return res.status(400).json({ success: false, message: "Email or phone number already registered" });
    }

    const currentDate = new Date();
    const year = currentDate.getFullYear().toString().slice(-2);
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const datePrefix = `${year}${month}${day}`;

    const [maxIdResult] = await db.query(
      "SELECT MAX(CAST(SUBSTRING(custom_id, 6) AS UNSIGNED)) as maxSerial FROM users"
    );
    const nextSerial = (maxIdResult[0].maxSerial || 0) + 1;
    const customId = `${datePrefix}${nextSerial}`;

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (custom_id, name, email, phone_number, password, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
      [customId, firstName, email, phoneNumber, hashedPassword]
    );

    res.status(200).json({ success: true, message: "Registration successful!", customId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Registration error" });
  }
});

// ---------- LOGIN ----------
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  console.log(`🔐 Login attempt for: ${email}`);

  try {
    const [superRows] = await db.query("SELECT * FROM superadmins WHERE email = ?", [email]);
    const superUser = superRows[0];
    if (superUser && await bcrypt.compare(password, superUser.password)) {
      const token = jwt.sign({ id: superUser.id, role: "superadmin" }, JWT_SECRET, { expiresIn: "8h" });
      return res.json({
        success: true,
        role: "superadmin",
        token,
        user: {
          id: superUser.id,
          email: superUser.email,
          name: "Super Admin"
        }
      });
    }

    const [adminRows] = await db.query("SELECT * FROM admins WHERE email = ? AND verified = 1", [email]);
    const admin = adminRows[0];
    if (admin && await bcrypt.compare(password, admin.password)) {
      const token = jwt.sign({ id: admin.id, role: "admin" }, JWT_SECRET, { expiresIn: "8h" });
      return res.json({
        success: true,
        role: "admin",
        token,
        user: {
          id: admin.id,
          email: admin.email,
          name: "Admin"
        }
      });
    }

    const [userRows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    const user = userRows[0];
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ userId: user.custom_id, role: "user" }, JWT_SECRET, { expiresIn: "8h" });

      return res.json({
        success: true,
        role: "user",
        token,
        user: {
          id: user.custom_id,
          email: user.email,
          name: user.name,
          photo: user.photo,
        }
      });
    }

    const [vendorRows] = await db.query("SELECT * FROM vendors WHERE email = ?", [email]);
    const vendor = vendorRows[0];
    if (vendor && await bcrypt.compare(password, vendor.password)) {
      if (vendor.status !== 'active') {
        return res.status(403).json({
          success: false,
          message: "Your vendor account is pending approval"
        });
      }

      const token = jwt.sign({
        id: vendor.id,
        role: "vendor",
        email: vendor.email
      }, JWT_SECRET, { expiresIn: "8h" });

      return res.json({
        success: true,
        role: "vendor",
        token,
        user: {
          id: vendor.id,
          name: vendor.name,
          email: vendor.email,
          phone: vendor.phone_number,
          profileImage: vendor.vendor_photo,
          status: vendor.status
        }
      });
    }

    const [technicianRows] = await db.query("SELECT * FROM technicians WHERE email = ?", [email]);
    const technician = technicianRows[0];
    if (technician && await bcrypt.compare(password, technician.password)) {
      if (technician.status !== 'active') {
        return res.status(403).json({
          success: false,
          message: "Your technician account is pending approval"
        });
      }

      const token = jwt.sign({
        id: technician.id,
        role: "technician",
        email: technician.email
      }, JWT_SECRET, { expiresIn: "8h" });

      return res.json({
        success: true,
        role: "technician",
        token,
        user: {
          id: technician.id,
          name: technician.name,
          email: technician.email,
          phone: technician.phone_number,
          profileImage: technician.photo,
          status: technician.status,
          vendor_id: technician.vendor_id
        }
      });
    }

    console.log(`❌ No user found with email: ${email}`);
    return res.status(401).json({
      success: false,
      message: "Invalid email or password"
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed. Please try again later."
    });
  }
});

// ---------- VERIFY JWT TOKEN ----------
app.post("/api/auth/verify", authenticateJWT, async (req, res) => {
  const userId = req.user.userId;
  try {
    const [result] = await db.query("SELECT name, email FROM users WHERE custom_id = ?", [userId]);
    if (result.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user: result[0] });
  } catch (err) {
    console.error("Auth verify error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ---------- GET USER PROFILE ----------
app.get("/api/user-profile", authenticateJWT, async (req, res) => {
  const userId = req.user.userId;
  console.log("Authenticated userId:", userId);

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE custom_id = ?", [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const user = rows[0];
    const parsedUser = {
      ...user,
      home_address: safeParseJSON(user.home_address, {}),
      office_address: safeParseJSON(user.office_address, {}),
    };

    res.json({ success: true, user: parsedUser });
  } catch (err) {
    console.error("Fetch profile error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch profile" });
  }
});

// ---------- PLACE ORDER ----------
app.post("/api/place-order", authenticateJWT, async (req, res) => {
  const userId = req.user.userId;
  const {
    category,
    cart,
    selectedDate,
    selectedSlot,
    notes,
    addressType,
    address,
    home_address,
    office_address,
    temp_address,
    recipientName,
    recipientPhone
  } = req.body;

  let finalAddress = address;

  if (!finalAddress) {
    if (addressType === 'home' && home_address) finalAddress = home_address;
    else if (addressType === 'office' && office_address) finalAddress = office_address;
    else if (addressType === 'another' && temp_address) finalAddress = temp_address;
  }

  if (!category || !cart || cart.length === 0 || !addressType || !finalAddress) {
    return res.status(400).json({ success: false, message: "Required fields missing" });
  }

  try {
    const generateRandomNumber = () => Math.floor(1000 + Math.random() * 9000);
    const orderId = `#${category}${generateRandomNumber()}`;

    let homeAddress = null;
    let officeAddress = null;
    let tempAddress = null;

    if (addressType === 'home') homeAddress = safeParseJSON(finalAddress, {});
    if (addressType === 'office') officeAddress = safeParseJSON(finalAddress, {});
    if (addressType === 'another') tempAddress = safeParseJSON(finalAddress, {});

    await db.query(
      `INSERT INTO orders 
        (order_id, user_id, order_date, time_slot, notes, 
         address_type, home_address, office_address, temp_address, 
         recipient_name, recipient_phone, 
         cart_items, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`,
      [
        orderId,
        userId,
        selectedDate,
        selectedSlot,
        notes || "",
        addressType,
        JSON.stringify(homeAddress),
        JSON.stringify(officeAddress),
        JSON.stringify(tempAddress),
        recipientName || null,
        recipientPhone || null,
        JSON.stringify(cart),
      ]
    );

    res.status(200).json({ success: true, message: "Order placed successfully", orderId });
  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({ success: false, message: "Failed to place order" });
  }
});

// ---------- GET USER ORDERS ----------
app.get("/orders", authenticateJWT, async (req, res) => {
  const userId = req.user.userId;

  try {
    const [orders] = await db.query(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC",
      [userId]
    );

    const parsedOrders = orders.map(order => {
      const parsedCart = safeParseJSON(order.cart_items, []);
      const parsedServiceExpert = safeParseJSON(order.service_expert, null);
      const parsedReviews = safeParseJSON(order.reviews, null);
      
      const homeAddress = safeParseJSON(order.home_address, null);
      const officeAddress = safeParseJSON(order.office_address, null);
      const tempAddress = safeParseJSON(order.temp_address, null);

      let primaryAddress = null;
      let addressType = order.address_type || 'home';

      if (addressType === 'home' && homeAddress) primaryAddress = homeAddress;
      else if (addressType === 'office' && officeAddress) primaryAddress = officeAddress;
      else if (addressType === 'another' && tempAddress) primaryAddress = tempAddress;

      let fullAddress = "";
      if (primaryAddress) {
        const parts = [];
        if (primaryAddress.addressLine1) parts.push(primaryAddress.addressLine1);
        if (primaryAddress.addressLine2) parts.push(primaryAddress.addressLine2);
        if (primaryAddress.areaName) parts.push(primaryAddress.areaName);
        if (primaryAddress.city) parts.push(primaryAddress.city);
        if (primaryAddress.landmark) parts.push(`Near ${primaryAddress.landmark}`);
        fullAddress = parts.join(", ");
      }

      const cartItems = Array.isArray(parsedCart) ? parsedCart : [];
      const total = cartItems.reduce((sum, item) =>
        sum + ((item?.price || 0) * (item?.quantity || 0)), 0
      );

      return {
        ...order,
        cart_items: cartItems,
        service_expert: parsedServiceExpert,
        reviews: parsedReviews,
        home_address: homeAddress,
        office_address: officeAddress,
        temp_address: tempAddress,
        address: primaryAddress,
        full_address: fullAddress,
        total: total.toFixed(2)
      };
    });

    res.status(200).json({ success: true, orders: parsedOrders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
});

// ---------- VERIFY ROLE ----------
app.get('/api/auth/verify-role', verifyToken(), (req, res) => {
  const requiredRoles = req.query.requiredRole?.split(",") || [];
  const userRole = req.user.role;

  if (userRole === 'superadmin') {
    return res.json({
      success: true,
      isValid: true,
      user: req.user
    });
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
    return res.status(403).json({
      success: false,
      isValid: false,
      message: `Requires one of these roles: ${requiredRoles.join(', ')}`
    });
  }

  res.json({
    success: true,
    isValid: true,
    user: req.user
  });
});

// ---------- SUPER ADMIN REGISTRATION ----------
app.post("/api/superadmin/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required"
    });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format"
    });
  }

  if (!validator.isStrongPassword(password)) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 chars with uppercase, lowercase, number and symbol"
    });
  }

  try {
    const hashed = await bcrypt.hash(password, 12);
    const [exists] = await db.query(
      "SELECT id FROM superadmins LIMIT 1"
    );

    if (exists.length) {
      return res.status(403).json({
        success: false,
        message: "Super Admin already exists"
      });
    }

    await db.query(
      "INSERT INTO superadmins (email, password) VALUES (?, ?)",
      [email, hashed]
    );

    res.json({
      success: true,
      message: "Super Admin registered successfully",
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ---------- SUPER ADMIN LOGIN ----------
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts, please try again later"
});

app.post("/api/superadmin/login", loginLimiter, async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT * FROM superadmins WHERE email = ?",
      [email]
    );
    const user = rows[0];

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: "superadmin",
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 8 * 60 * 60 * 1000
    }).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: "superadmin"
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
});

// ---------- ADMIN CREATION ----------
app.post("/api/admin/create",
  verifyToken(["superadmin"]),
  async (req, res) => {
    const { email, password } = req.body;

    try {
      const [exists] = await db.query(
        "SELECT id FROM admins WHERE email = ?",
        [email]
      );

      if (exists.length) {
        return res.status(409).json({
          success: false,
          message: "Admin already exists"
        });
      }

      const hashed = await bcrypt.hash(password, 12);
      await db.query(
        "INSERT INTO admins (email, password, created_by) VALUES (?, ?, ?)",
        [email, hashed, req.user.id]
      );

      res.json({
        success: true,
        message: "Admin created successfully",
        admin: { email }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Admin creation failed"
      });
    }
  }
);

// ---------- ADMIN ALL ORDERS ----------
app.get("/api/admin/all-orders", verifyToken(["admin", "superadmin"]), async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT 
        o.order_id,
        o.user_id,
        o.order_date,
        o.time_slot,
        o.notes,
        o.address_type,
        o.home_address,
        o.office_address,
        o.temp_address,
        o.recipient_name,
        o.recipient_phone,
        o.cart_items,
        o.status,
        o.cancel_reason,
        o.cancelled_at,
        o.vendor_id,
        o.service_expert,
        o.reviews,
        o.assigned_date,
        o.completed_date,
        o.confirmed_date,
        u.name AS customer_name,
        u.email AS customer_email,
        u.phone_number AS customer_phone,
        v.name AS vendor_name,
        v.email AS vendor_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.custom_id
      LEFT JOIN vendors v ON o.vendor_id = v.id
      ORDER BY o.order_date DESC
    `);

    const ordersWithDetails = orders.map(order => {
      const parsedCart = safeParseJSON(order.cart_items, []);
      const parsedAddress = safeParseJSON(order.address, {});
      const parsedServiceExpert = safeParseJSON(order.service_expert, null);
      const parsedReviews = safeParseJSON(order.reviews, null);

      const cartItems = Array.isArray(parsedCart) ? parsedCart : [];
      const total = cartItems.reduce((sum, item) => 
        sum + ((item?.price || 0) * (item?.quantity || 0)), 0
      );

      return {
        ...order,
        cart_items: cartItems,
        address: parsedAddress,
        service_expert: parsedServiceExpert,
        reviews: parsedReviews,
        total: total.toFixed(2)
      };
    });

    res.json({ success: true, orders: ordersWithDetails });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch all order details" });
  }
});

// ---------- ADMIN DASHBOARD ----------
app.get('/api/admin/dashboard', verifyToken(['admin', 'superadmin']), async (req, res) => {
  try {
    const [users] = await db.query("SELECT COUNT(*) as count FROM users");
    const [orders] = await db.query("SELECT COUNT(*) as count FROM orders");
    const [pending] = await db.query("SELECT COUNT(*) as count FROM orders WHERE status = 'Pending'");
    const [active] = await db.query("SELECT COUNT(*) as count FROM orders WHERE status = 'Active'");
    const [completed] = await db.query("SELECT COUNT(*) as count FROM orders WHERE status = 'Completed'");
    const [cancelled] = await db.query("SELECT COUNT(*) as count FROM orders WHERE status = 'Cancelled'");
    const [vendors] = await db.query("SELECT COUNT(*) as count FROM vendors WHERE status = 'active'");

    const totalOrders = orders[0].count;
    const completionRate = totalOrders > 0
      ? ((completed[0].count / totalOrders) * 100).toFixed(2)
      : "0.00";

    const stats = {
      totalOrders,
      pendingOrders: pending[0].count,
      activeOrders: active[0].count,
      completedOrders: completed[0].count,
      canceledOrders: cancelled[0].count,
      activeVendors: vendors[0].count,
      totalUsers: users[0].count,
      completionRate
    };

    const [activity] = await db.query(`
      SELECT order_id, status, updated_at, order_date
      FROM orders
      ORDER BY updated_at DESC
      LIMIT 10
    `);

    const formattedRecentActivities = activity.map(act => ({
      orderId: act.order_id,
      status: act.status,
      time: act.updated_at,
      orderDate: act.order_date
    }));

    res.json({
      success: true,
      stats,
      recentActivity: formattedRecentActivities
    });

  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load dashboard data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ---------- ADMIN ALL USERS ----------
app.get("/api/admin/all-users", verifyToken(["admin", "superadmin"]), async (req, res) => {
  try {
    const [users] = await db.query(`
      SELECT 
        u.custom_id as id,
        u.custom_id,
        u.name,
        u.email,
        u.phone_number as phone,
        u.photo as profileImage,
        u.home_address,
        u.office_address,
        u.is_active as isActive,
        u.created_at as createdAt
      FROM users u
      ORDER BY u.created_at DESC
    `);

    const parsedUsers = users.map(user => ({
      ...user,
      home_address: safeParseJSON(user.home_address, {}),
      office_address: safeParseJSON(user.office_address, {})
    }));

    res.json({ success: true, users: parsedUsers });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ---------- ADMIN USER ORDERS ----------
app.get("/api/admin/user-orders/:userId", verifyToken(["admin", "superadmin"]), async (req, res) => {
  const { userId } = req.params;

  try {
    const [orders] = await db.query(`
      SELECT 
        order_id,
        order_date,
        time_slot,
        status,
        cart_items,
        cancel_reason,
        cancelled_at
      FROM orders
      WHERE user_id = ?
      ORDER BY order_date DESC
      LIMIT 10
    `, [userId]);

    const parsedOrders = orders.map(order => {
      const parsedCart = safeParseJSON(order.cart_items, []);
      const cartItems = Array.isArray(parsedCart) ? parsedCart : [];
      const total = cartItems.reduce((sum, item) => 
        sum + ((item?.price || 0) * (item?.quantity || 0)), 0
      );

      return {
        ...order,
        cart_items: cartItems,
        total: total.toFixed(2)
      };
    });

    res.json({ success: true, orders: parsedOrders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
});

// ---------- ADMIN USER STATS ----------
app.get("/api/admin/user-stats", verifyToken(["admin", "superadmin"]), async (req, res) => {
  try {
    const [total] = await db.query("SELECT COUNT(*) as count FROM users");
    const [newUsers] = await db.query(`
      SELECT COUNT(*) as count FROM users 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    `);
    const [active] = await db.query("SELECT COUNT(*) as count FROM users WHERE is_active = 1");
    const [last30] = await db.query(`
      SELECT COUNT(*) as count FROM users 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    `);

    res.json({
      totalUsers: total[0].count,
      newUsers: newUsers[0].count,
      activeUsers: active[0].count,
      last30Days: last30[0].count
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ success: false, message: "Error fetching stats" });
  }
});

// ---------- ADMIN UPDATE USER ----------
app.put("/api/admin/user/:id", verifyToken(["admin", "superadmin"]), async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, isActive, homeAddress, officeAddress } = req.body;

  try {
    await db.query(`
      UPDATE users 
      SET name = ?, 
          email = ?, 
          phone_number = ?, 
          is_active = ?,
          home_address = ?,
          office_address = ?
      WHERE custom_id = ?
    `, [
      name,
      email,
      phone,
      isActive,
      homeAddress ? JSON.stringify(homeAddress) : null,
      officeAddress ? JSON.stringify(officeAddress) : null,
      id
    ]);

    res.json({ success: true, message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, message: "Failed to update user" });
  }
});

// ---------- ADMIN DELETE USER ----------
app.delete("/api/admin/user/:id", verifyToken(["admin", "superadmin"]), async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM users WHERE custom_id = ?", [id]);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
});

// ---------- SERVICES ----------
app.get('/api/services', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM services');

    const services = results.map(service => {
      let imagePath = service.image;

      if (imagePath && imagePath.startsWith('/images/')) {
        return {
          ...service,
          image: `http://localhost:${PORT}${imagePath}`
        };
      }

      if (imagePath) {
        imagePath = imagePath.replace(/^\/?uploads\//, '');
        return {
          ...service,
          image: `http://localhost:${PORT}/uploads/${imagePath}`
        };
      }

      return service;
    });

    res.json(services);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/services/:category', async (req, res) => {
  const category = req.params.category.trim();

  try {
    const [rows] = await db.query('SELECT * FROM services WHERE category = ?', [category]);

    const services = rows.map(service => {
      let imagePath = service.image;

      if (imagePath && imagePath.startsWith('/images/')) {
        return {
          ...service,
          image: `http://localhost:${PORT}${imagePath}`
        };
      }

      if (imagePath) {
        imagePath = imagePath.replace(/^\/?uploads\//, '');
        return {
          ...service,
          image: `http://localhost:${PORT}/uploads/${imagePath}`
        };
      }

      return service;
    });

    res.status(200).json(services);
  } catch (err) {
    console.error("DB Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/services', uploadService.single('image'), async (req, res) => {
  const { _id, name, price, category } = req.body;
  const image = req.file ? `/uploads/services/${req.file.filename}` : null;

  if (!_id || !name || !price || !category || !image) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }

  const sql = `INSERT INTO services (_id, name, price, category, image) VALUES (?, ?, ?, ?, ?)`;

  try {
    await db.query(sql, [_id, name, price, category, image]);
    res.json({ success: true, message: 'Service added successfully!' });
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

app.put('/api/services/:_id', uploadService.single('image'), async (req, res) => {
  const { _id } = req.params;
  const { name, price, category } = req.body;
  let image = req.file ? `/uploads/services/${req.file.filename}` : null;

  try {
    const updates = [];
    const values = [];

    if (name) {
      updates.push('name=?');
      values.push(name);
    }
    if (price) {
      updates.push('price=?');
      values.push(price);
    }
    if (category) {
      updates.push('category=?');
      values.push(category);
    }
    if (image) {
      updates.push('image=?');
      values.push(image);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    const sql = `UPDATE services SET ${updates.join(', ')} WHERE _id=?`;
    values.push(_id);

    const [result] = await db.query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.json({ success: true, message: 'Service updated successfully' });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete("/api/services/:_id", async (req, res) => {
  const { _id } = req.params;
  try {
    await db.query("DELETE FROM services WHERE _id = ?", [_id]);
    res.json({ success: true, message: "Service deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ---------- VENDOR REGISTRATION ----------
app.post("/api/vendor/register", uploadVendorDocs.fields([
  { name: 'profile_image', maxCount: 1 },
  { name: 'nid_front', maxCount: 1 },
  { name: 'nid_back', maxCount: 1 },
  { name: 'cv', maxCount: 1 },
  { name: 'trade_license', maxCount: 1 }
]), async (req, res) => {
  const {
    name,
    email,
    phone,
    dob,
    password,
    nid_number,
    company_name,
    permanent_address,
    present_address,
    business_address,
    service_areas,
    services,
    technician_quantity
  } = req.body;

  const requiredFields = ['name', 'email', 'phone', 'dob', 'password', 'nid_number'];
  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res.status(400).json({
        success: false,
        message: `${field.replace('_', ' ')} is required`
      });
    }
  }

  console.log('📋 Received vendor registration data:');
  console.log('- Name:', name);
  console.log('- Email:', email);
  console.log('- Phone:', phone);

  try {
    const [duplicateCheck] = await db.query(
      "SELECT * FROM vendors WHERE email = ? OR phone_number = ?",
      [email, phone]
    );

    if (duplicateCheck.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email or phone number already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const getFileUrl = (fieldName, subfolder) => {
      return req.files[fieldName] && req.files[fieldName][0]
        ? `/uploads/${subfolder}/${req.files[fieldName][0].filename}`
        : null;
    };

    const nidFront = getFileUrl('nid_front', 'nids');
    const nidBack = getFileUrl('nid_back', 'nids');
    const profileImage = getFileUrl('profile_image', 'profiles');
    const cv = getFileUrl('cv', 'cvs');
    const tradeLicense = getFileUrl('trade_license', 'licenses');

    let serviceAreasArray = safeParseJSON(service_areas, []);
    let servicesArray = safeParseJSON(services, []);

    const [result] = await db.query(
      `INSERT INTO vendors 
        (name, email, phone_number, password, dob, nid_number, 
         company_name, permanent_address, present_address, business_address,
         technician_quantity, vendor_photo, nid_front, nid_back, cv, trade_license,
         service_areas, services, status, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW(), NOW())`,
      [
        name,
        email,
        phone,
        hashedPassword,
        dob,
        nid_number,
        company_name || null,
        permanent_address || '',
        present_address || '',
        business_address || null,
        technician_quantity || 0,
        profileImage,
        nidFront,
        nidBack,
        cv,
        tradeLicense,
        JSON.stringify(serviceAreasArray),
        JSON.stringify(servicesArray)
      ]
    );

    console.log(`✅ Vendor registered successfully: ${name} (ID: ${result.insertId})`);

    res.status(200).json({
      success: true,
      message: "Registration successful! Your account is pending approval.",
      vendorId: result.insertId
    });

  } catch (error) {
    console.error("❌ Registration error:", error);

    try {
      if (req.files) {
        Object.values(req.files).forEach(fileArray => {
          if (fileArray && fileArray[0] && fs.existsSync(fileArray[0].path)) {
            fs.unlinkSync(fileArray[0].path);
          }
        });
      }
    } catch (cleanupError) {
      console.error("Error cleaning up files:", cleanupError);
    }

    res.status(500).json({
      success: false,
      message: "Registration failed. Please try again.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});


// GET - Vendor Details by ID (সমস্ত ডাটা সহ)
app.get("/api/admin/vendors/:id", async (req, res) => {
  const { id } = req.params;
  
  try {
    const [vendors] = await db.query(
      `SELECT 
        v.*,
        v.dob,
        v.permanent_address,
        v.present_address,
        v.business_address,
        v.nid_front,
        v.nid_back,
        v.cv,
        v.trade_license,
        v.service_areas,
        v.services,
        v.vendor_photo as profile_image,
        v.nid_number,
        v.company_name,
        v.technician_quantity,
        v.total_orders,
        v.completed_orders,
        v.pending_orders,
        v.canceled_orders,
        v.average_rating,
        v.wallet_balance,
        v.status,
        v.is_verified,
        v.created_at,
        v.updated_at
      FROM vendors v 
      WHERE v.id = ?`,
      [id]
    );

    if (vendors.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found"
      });
    }

    const vendor = vendors[0];
    
    // JSON ফিল্ড পার্স করুন
    if (vendor.service_areas) {
      try {
        vendor.service_areas = JSON.parse(vendor.service_areas);
      } catch (e) {
        vendor.service_areas = [];
      }
    }
    
    if (vendor.services) {
      try {
        vendor.services = JSON.parse(vendor.services);
      } catch (e) {
        vendor.services = [];
      }
    }

    res.json({
      success: true,
      vendor: vendor
    });

  } catch (error) {
    console.error("❌ Error fetching vendor details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch vendor details",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ---------- TECHNICIAN REGISTRATION ----------
app.post("/api/technician/register", uploadVendorDocs.fields([
  { name: 'profile_image', maxCount: 1 },
  { name: 'nid_front', maxCount: 1 },
  { name: 'nid_back', maxCount: 1 },
  { name: 'cv', maxCount: 1 }
]), async (req, res) => {
  const {
    name,
    email,
    phone,
    dob,
    password,
    nid_number,
    permanent_address,
    present_address,
    skills,
    experience,
    vendor_id,
    service_areas,
    hourly_rate
  } = req.body;

  if (!name || !email || !phone || !password || !vendor_id) {
    return res.status(400).json({
      success: false,
      message: 'Required fields missing: name, email, phone, password, vendor_id'
    });
  }

  try {
    const [vendorCheck] = await db.query(
      'SELECT id FROM vendors WHERE id = ? AND status = ?',
      [vendor_id, 'active']
    );

    if (vendorCheck.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found or not active'
      });
    }

    const [duplicate] = await db.query(
      'SELECT id FROM technicians WHERE email = ? OR phone_number = ?',
      [email, phone]
    );

    if (duplicate.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email or phone already registered'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const getFileUrl = (fieldName, subfolder) => {
      return req.files[fieldName] && req.files[fieldName][0]
        ? `/uploads/${subfolder}/${req.files[fieldName][0].filename}`
        : null;
    };

    const profileImage = getFileUrl('profile_image', 'profiles');
    const nidFront = getFileUrl('nid_front', 'nids');
    const nidBack = getFileUrl('nid_back', 'nids');
    const cv = getFileUrl('cv', 'cvs');

    const skillsArray = safeParseJSON(skills, []);
    const serviceAreasArray = safeParseJSON(service_areas, []);

    const [result] = await db.query(
      `INSERT INTO technicians 
       (vendor_id, name, email, phone_number, password, dob, 
        nid_number, photo, nid_front, nid_back, cv,
        permanent_address, present_address, skills, experience,
        service_areas, hourly_rate, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW(), NOW())`,
      [
        vendor_id, name, email, phone, hashedPassword, dob || null,
        nid_number || null, profileImage, nidFront, nidBack, cv,
        permanent_address || null, present_address || null, 
        JSON.stringify(skillsArray), experience || 0,
        JSON.stringify(serviceAreasArray), hourly_rate || 0
      ]
    );

    res.json({
      success: true,
      message: 'Technician registered successfully',
      technicianId: result.insertId
    });

  } catch (error) {
    console.error('❌ Technician registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ---------- VENDOR PROFILE ----------
app.get("/api/vendor/profile", authenticateVendor, async (req, res) => {
  try {
    console.log('📱 Vendor Profile Request - Vendor ID:', req.vendor?.vendorId);

    if (!req.vendor || !req.vendor.vendorId) {
      return res.status(401).json({
        success: false,
        message: "Vendor ID not found in token"
      });
    }

    const [rows] = await db.query(
      `SELECT 
        id, name, email, phone_number, 
        dob, nid_number, company_name, 
        permanent_address, present_address, business_address,
        technician_quantity, vendor_photo, nid_front, nid_back, 
        cv, trade_license, service_areas, services, status, 
        created_at, updated_at, total_orders, completed_orders,
        pending_orders, canceled_orders, active_orders, hold_orders,
        average_rating, success_rate, wallet_balance
       FROM vendors WHERE id = ?`,
      [req.vendor.vendorId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found in database",
        vendorId: req.vendor.vendorId
      });
    }

    const vendor = rows[0];

    const serviceAreas = safeParseJSON(vendor.service_areas, []);
    const services = safeParseJSON(vendor.services, []);

    const responseData = {
      success: true,
      vendor: {
        id: vendor.id,
        name: vendor.name,
        email: vendor.email,
        phone: vendor.phone_number,
        dob: vendor.dob,
        nidNumber: vendor.nid_number,
        companyName: vendor.company_name,
        permanentAddress: vendor.permanent_address,
        presentAddress: vendor.present_address,
        businessAddress: vendor.business_address,
        technicianQuantity: vendor.technician_quantity,
        profileImage: vendor.vendor_photo,
        nidFront: vendor.nid_front,
        nidBack: vendor.nid_back,
        cv: vendor.cv,
        tradeLicense: vendor.trade_license,
        serviceAreas: serviceAreas,
        services: services,
        status: vendor.status,
        stats: {
          total_orders: vendor.total_orders || 0,
          completed_orders: vendor.completed_orders || 0,
          pending_orders: vendor.pending_orders || 0,
          canceled_orders: vendor.canceled_orders || 0,
          active_orders: vendor.active_orders || 0,
          hold_orders: vendor.hold_orders || 0,
          average_rating: vendor.average_rating || 0,
          success_rate: vendor.success_rate || 0,
          wallet_balance: vendor.wallet_balance || 0
        },
        createdAt: vendor.created_at,
        updatedAt: vendor.updated_at
      }
    };

    res.json(responseData);

  } catch (error) {
    console.error("❌ Profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ---------- VENDOR PROFILE UPDATE ----------
app.put("/api/vendor/profile", authenticateVendor, uploadVendorDocs.fields([
  { name: 'profile_image', maxCount: 1 },
  { name: 'nid_front', maxCount: 1 },
  { name: 'nid_back', maxCount: 1 },
  { name: 'cv', maxCount: 1 },
  { name: 'trade_license', maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      name,
      phone,
      dob,
      company_name,
      permanent_address,
      present_address,
      business_address,
      service_areas,
      services,
      technician_quantity,
      profile_image_base64,
      profile_image_name
    } = req.body;

    const vendorId = req.vendor.vendorId;

    let updateFields = [];
    let updateValues = [];

    if (name) {
      updateFields.push("name = ?");
      updateValues.push(name);
    }

    if (phone) {
      updateFields.push("phone_number = ?");
      updateValues.push(phone);
    }

    if (dob) {
      updateFields.push("dob = ?");
      updateValues.push(dob);
    }

    if (company_name !== undefined) {
      updateFields.push("company_name = ?");
      updateValues.push(company_name);
    }

    if (permanent_address !== undefined) {
      updateFields.push("permanent_address = ?");
      updateValues.push(permanent_address);
    }

    if (present_address !== undefined) {
      updateFields.push("present_address = ?");
      updateValues.push(present_address);
    }

    if (business_address !== undefined) {
      updateFields.push("business_address = ?");
      updateValues.push(business_address);
    }

    if (service_areas) {
      updateFields.push("service_areas = ?");
      updateValues.push(service_areas);
    }

    if (services) {
      updateFields.push("services = ?");
      updateValues.push(services);
    }

    if (technician_quantity !== undefined) {
      updateFields.push("technician_quantity = ?");
      updateValues.push(technician_quantity);
    }

    const getFileUrl = (fieldName, subfolder) => {
      return req.files[fieldName] && req.files[fieldName][0]
        ? `/uploads/${subfolder}/${req.files[fieldName][0].filename}`
        : null;
    };

    if (req.files['profile_image']) {
      updateFields.push("vendor_photo = ?");
      updateValues.push(getFileUrl('profile_image', 'profiles'));
    } else if (profile_image_base64 && profile_image_name) {
      try {
        const uploadsDir = path.join(__dirname, 'uploads/profiles');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const fileName = `${vendorId}_${Date.now()}_${profile_image_name}`;
        const filePath = path.join(uploadsDir, fileName);

        let base64Data = profile_image_base64;
        if (profile_image_base64.includes(',')) {
          base64Data = profile_image_base64.split(',')[1];
        }

        const buffer = Buffer.from(base64Data, 'base64');
        fs.writeFileSync(filePath, buffer);

        updateFields.push("vendor_photo = ?");
        updateValues.push(`/uploads/profiles/${fileName}`);

        console.log('✅ Base64 image saved:', fileName);
      } catch (fileError) {
        console.error('❌ Error saving base64 image:', fileError);
      }
    }

    if (req.files['nid_front']) {
      updateFields.push("nid_front = ?");
      updateValues.push(getFileUrl('nid_front', 'nids'));
    }

    if (req.files['nid_back']) {
      updateFields.push("nid_back = ?");
      updateValues.push(getFileUrl('nid_back', 'nids'));
    }

    if (req.files['cv']) {
      updateFields.push("cv = ?");
      updateValues.push(getFileUrl('cv', 'cvs'));
    }

    if (req.files['trade_license']) {
      updateFields.push("trade_license = ?");
      updateValues.push(getFileUrl('trade_license', 'licenses'));
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update"
      });
    }

    updateFields.push("updated_at = NOW()");
    updateValues.push(vendorId);

    const [result] = await db.query(
      `UPDATE vendors SET ${updateFields.join(", ")} WHERE id = ?`,
      updateValues
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found"
      });
    }

    res.json({
      success: true,
      message: "Profile updated successfully"
    });

  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile"
    });
  }
});

// ---------- FORGOT PASSWORD ----------
app.post("/api/forgot-password", async (req, res) => {
  console.log("Forgot password request received:", req.body);

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required"
    });
  }

  try {
    const [users] = await db.query(
      "SELECT custom_id, name, email FROM users WHERE email = ?",
      [email]
    );

    const [vendors] = await db.query(
      "SELECT id, name, email FROM vendors WHERE email = ?",
      [email]
    );

    const user = users[0] || vendors[0];

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email address"
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    console.log("Generated token for:", email);

    if (users[0]) {
      await db.query(
        "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
        [resetToken, resetTokenExpiry, email]
      );
    } else {
      await db.query(
        "UPDATE vendors SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
        [resetToken, resetTokenExpiry, email]
      );
    }

    const resetLink = `${CLIENT_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    console.log("Reset link generated:", resetLink);

    try {
      await sendResetEmail(email, resetLink, user.name);
      console.log("✅ Reset email sent successfully to:", email);

      res.json({
        success: true,
        message: "Password reset link has been sent to your email"
      });

    } catch (emailError) {
      console.error("❌ Email sending failed:", emailError);

      res.json({
        success: true,
        message: "Reset token generated but email failed. Use the link below.",
        resetLink: resetLink,
        debug: "Email error: " + emailError.message
      });
    }

  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process reset request"
    });
  }
});

// ---------- ADMIN VENDORS LIST (DETAILED) ----------
app.get('/api/admin/vendors', verifyToken(['admin', 'superadmin']), async (req, res) => {
  try {
    const { include_details = 'false', include_documents = 'false', include_address = 'false' } = req.query;

    // বেসিক কুয়েরি
    let query = `
      SELECT 
        id,
        name,
        email,
        phone_number as phone,
        vendor_photo as photo,
        nid_number,
        technician_quantity,
        status,
        is_verified,
        total_orders,
        completed_orders,
        pending_orders,
        canceled_orders,
        active_orders,
        hold_orders,
        average_rating,
        success_rate,
        wallet_balance,
        created_at as join_date
    `;

    // ডিটেইল ফিল্ড (যখন প্রয়োজন)
    if (include_details === 'true') {
      query += `,
        dob,
        gender,
        company_name,
        business_type,
        business_phone,
        registration_date
      `;
    }

    // ডকুমেন্ট ফিল্ড (যখন প্রয়োজন)
    if (include_documents === 'true') {
      query += `,
        nid_front,
        nid_back,
        cv,
        trade_license
      `;
    }

    // ঠিকানা ফিল্ড (যখন প্রয়োজন)
    if (include_address === 'true') {
      query += `,
        permanent_address,
        present_address,
        business_address
      `;
    }

    // সার্ভিস এবং সার্ভিস এলাকা (সর্বদা যোগ করুন)
    query += `,
        service_areas,
        services
    `;

    query += ` FROM vendors ORDER BY created_at DESC`;

    const [vendors] = await db.query(query);

    // JSON ফিল্ড পার্স করুন
    const parsedVendors = vendors.map(vendor => {
      const parsed = { ...vendor };
      
      // service_areas পার্স
      if (parsed.service_areas) {
        try {
          parsed.service_areas = typeof parsed.service_areas === 'string' 
            ? JSON.parse(parsed.service_areas) 
            : parsed.service_areas;
        } catch (e) {
          parsed.service_areas = [];
        }
      } else {
        parsed.service_areas = [];
      }
      
      // services পার্স
      if (parsed.services) {
        try {
          parsed.services = typeof parsed.services === 'string' 
            ? JSON.parse(parsed.services) 
            : parsed.services;
        } catch (e) {
          parsed.services = [];
        }
      } else {
        parsed.services = [];
      }
      
      return parsed;
    });

    res.json({
      success: true,
      vendors: parsedVendors,
      count: parsedVendors.length
    });

  } catch (error) {
    console.error('❌ Get vendors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vendors',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ---------- ADMIN VENDOR STATUS UPDATE ----------
app.patch('/api/admin/vendors/:id/status', verifyToken(['admin', 'superadmin']), async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['active', 'pending', 'rejected', 'suspended'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status'
    });
  }

  try {
    await db.query(
      'UPDATE vendors SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, id]
    );

    res.json({
      success: true,
      message: `Vendor status updated to ${status}`
    });
  } catch (error) {
    console.error('Update vendor status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update vendor status'
    });
  }
});

// ---------- ORDER STATUS UPDATE ----------
app.patch('/orders/:orderId/status', authenticateJWT, async (req, res) => {
  const { orderId } = req.params;
  const { status, notes, service_started } = req.body;
  const userId = req.user.userId || req.user.id;
  const userRole = req.user.role || 'user';

  console.log(`🔄 Order status update request: ${orderId}`);
  console.log(`📋 New status: ${status}`);
  console.log(`👤 User: ${userId} (${userRole})`);

  const validStatuses = ['Pending', 'Processing', 'Active', 'Completed', 'Cancelled', 'Hold', 'Assigned to Vendor', 'Started'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Valid statuses: ${validStatuses.join(', ')}`
    });
  }

  try {
    const [orderRows] = await db.query(
      'SELECT * FROM orders WHERE order_id = ?',
      [orderId]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orderRows[0];
    const oldStatus = order.status;
    const vendorId = order.vendor_id;

    console.log(`📋 Current status: ${oldStatus}, Vendor: ${vendorId || 'Not assigned'}`);

    if (userRole === 'vendor') {
      if (!vendorId || order.vendor_id !== parseInt(userId)) {
        return res.status(403).json({
          success: false,
          message: 'You can only update your assigned orders'
        });
      }
    }

    if (oldStatus === 'Completed' || oldStatus === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: `Cannot change status of ${oldStatus.toLowerCase()} order`
      });
    }

    await db.query('START TRANSACTION');

    let updateQuery = `UPDATE orders SET status = ?, updated_by = ?, updated_at = NOW()`;
    const updateParams = [status, userId || 'system'];

    if (service_started === true && !order.service_started_date) {
      updateQuery += `, service_started_date = NOW()`;
    }

    if (notes) {
      updateQuery += `, notes = CONCAT(IFNULL(notes, ''), '\n[${new Date().toLocaleString()}]: ${notes}')`;
    }

    if (status === 'Completed' && !order.completed_date) {
      updateQuery += `, completed_date = NOW()`;
    }

    if (status === 'Cancelled') {
      updateQuery += `, cancelled_date = NOW()`;
      if (!order.cancel_reason) {
        updateQuery += `, cancel_reason = ?`;
        updateParams.push(notes || 'Order cancelled');
      }
    }

    updateQuery += ` WHERE order_id = ?`;
    updateParams.push(orderId);

    await db.query(updateQuery, updateParams);

    if (vendorId) {
      await updateVendorStats(orderId, oldStatus, status, vendorId, order.service_expert);
    }

    await db.query(
      `INSERT INTO order_history 
       (order_id, status, action_by, action_type, details, created_at) 
       VALUES (?, ?, ?, 'status_change', ?, NOW())`,
      [orderId, status, userId || 'system', `Status changed from ${oldStatus} to ${status}`]
    );

    await db.query('COMMIT');

    const [updatedOrder] = await db.query(
      'SELECT * FROM orders WHERE order_id = ?',
      [orderId]
    );

    console.log(`✅ Order ${orderId} status updated successfully`);

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order: {
        order_id: orderId,
        status: status,
        old_status: oldStatus,
        vendor_id: vendorId,
        updated_at: new Date(),
        updated_by: userId || 'system'
      }
    });

  } catch (error) {
    await db.query('ROLLBACK');
    console.error('❌ Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ---------- ORDER CANCELLATION ----------
app.patch('/orders/:orderId/cancel', authenticateJWT, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason, penaltyFee = 0 } = req.body;
    const userId = req.user.userId || req.user.id;
    const userRole = req.user.role || 'user';

    console.log(`🔄 Cancellation request by ${userRole} for order ${orderId}`);

    const [orderRows] = await db.query(
      `SELECT o.*, 
              u.name as user_name,
              v.name as vendor_name
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.custom_id
       LEFT JOIN vendors v ON o.vendor_id = v.id
       WHERE o.order_id = ?`,
      [orderId]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orderRows[0];

    if (userRole === 'user' || userRole === 'customer') {
      if (order.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized: You can only cancel your own orders'
        });
      }
    } else if (userRole === 'vendor') {
      if (order.vendor_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized: This order is not assigned to you'
        });
      }
    }

    const currentStatus = order.status;
    if (currentStatus === 'Completed' || currentStatus === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: `Order is already ${currentStatus.toLowerCase()}`
      });
    }

    const serviceStarted = hasServiceStarted(order);
    const isVendorAssigned = order.vendor_id ? true : false;

    if (userRole === 'user' || userRole === 'customer') {
      console.log('👤 User initiated cancellation');

      if (serviceStarted && penaltyFee !== 500 && isVendorAssigned) {
        return res.status(400).json({
          success: false,
          message: 'Cancellation requires ৳500 penalty fee as service has started'
        });
      }

      if (!serviceStarted && penaltyFee > 0) {
        return res.status(400).json({
          success: false,
          message: 'No penalty fee required for cancellation before service starts'
        });
      }

      await db.query('START TRANSACTION');

      try {
        await db.query(
          `UPDATE orders 
           SET status = 'Cancelled',
               cancel_reason = ?,
               cancelled_by = 'user',
               cancelled_date = NOW(),
               penalty_fee = ?,
               updated_at = NOW()
           WHERE order_id = ?`,
          [reason || 'Customer requested cancellation', penaltyFee, orderId]
        );

        if (isVendorAssigned) {
          if (serviceStarted && penaltyFee > 0) {
            const vendorAmount = Math.round(penaltyFee * 0.70);
            const adminAmount = penaltyFee - vendorAmount;

            await db.query(
              `INSERT INTO vendor_cancellations 
               (vendor_id, order_id, user_id, penalty_amount, reason, 
                cancelled_by, vendor_amount, admin_amount, 
                cancellation_type, cancelled_at)
               VALUES (?, ?, ?, ?, ?, 'user', ?, ?, 'user_cancelled_with_charge', NOW())`,
              [order.vendor_id, orderId, userId, penaltyFee, reason || 'User cancellation',
               vendorAmount, adminAmount]
            );

            await db.query(
              `UPDATE vendors 
               SET wallet_balance = COALESCE(wallet_balance, 0) + ?,
                   canceled_orders = canceled_orders + 1,
                   updated_at = NOW()
               WHERE id = ?`,
              [vendorAmount, order.vendor_id]
            );

            await db.query(
              `INSERT INTO vendor_transactions 
               (vendor_id, order_id, amount, transaction_type, description, created_at)
               VALUES (?, ?, ?, 'penalty_fee_user_cancellation',
                       'Penalty fee from user cancellation (Vendor: ৳${vendorAmount})', NOW())`,
              [order.vendor_id, orderId, vendorAmount]
            );

          } else {
            await db.query(
              `INSERT INTO vendor_cancellations 
               (vendor_id, order_id, user_id, reason, 
                cancelled_by, cancellation_type, cancelled_at)
               VALUES (?, ?, ?, ?, 'user', 'user_cancelled_no_charge', NOW())`,
              [order.vendor_id, orderId, userId, reason || 'User cancellation before service']
            );

            await db.query(
              `UPDATE vendors 
               SET pending_orders = GREATEST(0, pending_orders - 1),
                   canceled_orders = canceled_orders + 1,
                   updated_at = NOW()
               WHERE id = ?`,
              [order.vendor_id]
            );
          }

          await db.query(
            `INSERT INTO notifications 
             (user_id, user_type, title, message, type, related_id, created_at)
             VALUES (?, 'vendor', 'Order Cancelled by Customer', 
                     'Order ${orderId} was cancelled by customer. ${penaltyFee > 0 ? 'Penalty fee applied.' : 'No penalty fee.'}', 
                     'order_cancelled', ?, NOW())`,
            [order.vendor_id, orderId]
          );
        }

        await db.query(
          `INSERT INTO notifications 
           (user_id, user_type, title, message, type, related_id, created_at)
           VALUES (?, 'user', 'Order Cancelled', 
                   'Your order ${orderId} has been cancelled. ${penaltyFee > 0 ? `Penalty fee of ৳${penaltyFee} has been charged.` : ''}', 
                   'order_cancelled', ?, NOW())`,
          [userId, orderId]
        );

        await db.query('COMMIT');

        res.json({
          success: true,
          message: penaltyFee > 0 
            ? `Order cancelled successfully with ৳${penaltyFee} penalty fee`
            : 'Order cancelled successfully',
          orderId,
          status: 'Cancelled',
          cancelled_by: 'user',
          penaltyFee,
          serviceStarted,
          cancelReason: reason
        });

      } catch (error) {
        await db.query('ROLLBACK');
        throw error;
      }
    } else if (userRole === 'admin' || userRole === 'superadmin') {
      console.log('👑 Admin initiated cancellation');

      await db.query('START TRANSACTION');

      try {
        await db.query(
          `UPDATE orders 
           SET status = 'Cancelled',
               cancel_reason = ?,
               cancelled_by = 'admin',
               cancelled_date = NOW(),
               penalty_fee = ?,
               updated_at = NOW()
           WHERE order_id = ?`,
          [reason || 'Admin cancelled', penaltyFee, orderId]
        );

        if (order.vendor_id) {
          await db.query(
            `UPDATE vendors 
             SET pending_orders = GREATEST(0, pending_orders - 1),
                 canceled_orders = canceled_orders + 1,
                 updated_at = NOW()
             WHERE id = ?`,
            [order.vendor_id]
          );
        }

        await db.query(
          `INSERT INTO notifications 
           (user_id, user_type, title, message, type, related_id, created_at)
           VALUES (?, 'user', 'Order Cancelled by Admin', 
                   'Your order ${orderId} has been cancelled by admin. ${penaltyFee > 0 ? `Penalty fee of ৳${penaltyFee} was refunded.` : ''}', 
                   'order_cancelled', ?, NOW())`,
          [order.user_id, orderId]
        );

        await db.query('COMMIT');

        res.json({
          success: true,
          message: 'Order cancelled by admin',
          data: {
            orderId,
            status: 'Cancelled',
            cancelled_by: 'admin',
            penaltyFee
          }
        });

      } catch (error) {
        await db.query('ROLLBACK');
        throw error;
      }
    }

  } catch (error) {
    console.error('❌ Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ---------- SERVICE EXPERT RATING ----------
app.post('/api/service-expert/:id/rate', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { rating, orderId } = req.body;
  const userId = req.user.userId;

  try {
    const [orderRows] = await db.query(
      'SELECT * FROM orders WHERE order_id = ? AND user_id = ?',
      [orderId, userId]
    );

    if (orderRows.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'You can only rate service experts for your own orders'
      });
    }

    res.json({
      success: true,
      message: 'Rating submitted successfully'
    });
  } catch (error) {
    console.error('Rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit rating'
    });
  }
});

// ---------- ORDER HOLD ----------
app.patch('/orders/:orderId/hold', authenticateJWT, async (req, res) => {
  const { orderId } = req.params;
  const { reason, checkoutCharge } = req.body;
  const userId = req.user.userId;

  try {
    const [orderRows] = await db.query(
      'SELECT * FROM orders WHERE order_id = ? AND user_id = ?',
      [orderId, userId]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orderRows[0];

    if (order.status !== 'Active' || !hasServiceStarted(order)) {
      return res.status(400).json({
        success: false,
        message: 'Only active orders with service started can be put on hold'
      });
    }

    await db.query(
      `UPDATE orders 
       SET status = 'Hold',
           hold_reason = ?,
           checkout_charge = ?,
           hold_date = NOW()
       WHERE order_id = ?`,
      [reason, checkoutCharge, orderId]
    );

    if (order.vendor_id) {
      await db.query(
        `UPDATE vendors 
         SET pending_orders = pending_orders - 1,
             hold_orders = hold_orders + 1,
             updated_at = NOW()
         WHERE id = ?`,
        [order.vendor_id]
      );
    }

    res.json({
      success: true,
      message: 'Order put on hold successfully',
      order: {
        order_id: orderId,
        status: 'Hold',
        checkout_charge: checkoutCharge
      }
    });

  } catch (error) {
    console.error('Hold order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to put order on hold'
    });
  }
});

// ---------- NOTIFICATIONS ----------
app.get('/api/notifications', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const userType = req.user.role === 'vendor' ? 'vendor' : 'user';

    const [notifications] = await db.query(
      `SELECT id, title, message, type, related_id, is_read, 
              created_at, read_at
       FROM notifications 
       WHERE user_id = ? AND user_type = ?
       ORDER BY created_at DESC
       LIMIT 50`,
      [userId, userType]
    );

    const [unreadCount] = await db.query(
      `SELECT COUNT(*) as count 
       FROM notifications 
       WHERE user_id = ? AND user_type = ? AND is_read = FALSE`,
      [userId, userType]
    );

    res.json({
      success: true,
      notifications,
      unreadCount: unreadCount[0].count
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications'
    });
  }
});

app.patch('/api/notifications/:id/read', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId || req.user.id;
    const userType = req.user.role === 'vendor' ? 'vendor' : 'user';

    const [result] = await db.query(
      `UPDATE notifications 
       SET is_read = TRUE, read_at = NOW()
       WHERE id = ? AND user_id = ? AND user_type = ?`,
      [id, userId, userType]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read'
    });
  }
});

app.patch('/api/notifications/mark-all-read', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const userType = req.user.role === 'vendor' ? 'vendor' : 'user';

    await db.query(
      `UPDATE notifications 
       SET is_read = TRUE, read_at = NOW()
       WHERE user_id = ? AND user_type = ? AND is_read = FALSE`,
      [userId, userType]
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notifications as read'
    });
  }
});

app.delete('/api/notifications/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId || req.user.id;
    const userType = req.user.role === 'vendor' ? 'vendor' : 'user';

    const [result] = await db.query(
      `DELETE FROM notifications 
       WHERE id = ? AND user_id = ? AND user_type = ?`,
      [id, userId, userType]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification deleted'
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification'
    });
  }
});

app.get('/api/notifications/unread-count', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const userType = req.user.role === 'vendor' ? 'vendor' : 'user';

    try {
      const [result] = await db.query(
        `SELECT COUNT(*) as count 
         FROM notifications 
         WHERE user_id = ? AND user_type = ? AND is_read = FALSE`,
        [userId, userType]
      );

      return res.json({
        success: true,
        count: result[0].count || 0
      });
    } catch (tableError) {
      console.log('⚠️ Notifications table not found, returning default count');
      return res.json({
        success: true,
        count: 0
      });
    }

  } catch (error) {
    console.error('Get unread count error:', error);
    res.json({
      success: false,
      count: 0,
      message: 'Error fetching unread count'
    });
  }
});

// ---------- SCHEDULE CHANGE ----------
app.patch('/orders/:orderId/schedule', authenticateJWT, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { newDate, newTimeSlot, reason } = req.body;
    const userId = req.user.userId || req.user.id;
    const userRole = req.user.role || 'user';

    console.log(`🔄 Schedule change request for order: ${orderId}`);
    console.log(`📅 New Date: ${newDate}`);
    console.log(`⏰ New Time: ${newTimeSlot}`);

    const [orderRows] = await db.query(
      `SELECT * FROM orders WHERE order_id = ?`,
      [orderId]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orderRows[0];

    if (userRole === 'user' || userRole === 'customer') {
      if (order.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'You can only change schedule for your own orders'
        });
      }
    }

    if (!['Pending', 'Processing'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change schedule for this order status'
      });
    }

    if (order.vendor_id || order.service_expert) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change schedule after expert assignment'
      });
    }

    if (hasServiceStarted(order)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change schedule after service has started'
      });
    }

    const newDateObj = new Date(newDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (newDateObj < today) {
      return res.status(400).json({
        success: false,
        message: 'New date must be in the future'
      });
    }

    if (!newTimeSlot || !newTimeSlot.includes('-')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid time slot format'
      });
    }

    await db.query('START TRANSACTION');

    try {
      await db.query(
        `INSERT INTO schedule_changes 
         (order_id, user_id, previous_date, previous_time_slot, 
          new_date, new_time_slot, changed_by, reason) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          userId,
          order.order_date,
          order.time_slot,
          newDate,
          newTimeSlot,
          userRole,
          reason || 'Customer requested schedule change'
        ]
      );

      await db.query(
        `UPDATE orders 
         SET order_date = ?,
             time_slot = ?,
             schedule_changed = TRUE,
             schedule_changed_date = NOW(),
             updated_at = NOW()
         WHERE order_id = ?`,
        [newDate, newTimeSlot, orderId]
      );

      await db.query(
        `INSERT INTO notifications 
         (user_id, user_type, title, message, type, related_id, created_at) 
         VALUES (?, 'user', 'Schedule Updated', 
                 'Your order ${orderId} schedule has been changed to ${new Date(newDate).toLocaleDateString()} at ${newTimeSlot}', 
                 'schedule_change', ?, NOW())`,
        [userId, orderId]
      );

      await db.query('COMMIT');

      console.log(`✅ Schedule changed successfully for order ${orderId}`);

      res.json({
        success: true,
        message: 'Schedule updated successfully',
        data: {
          order_id: orderId,
          previous_date: order.order_date,
          previous_time_slot: order.time_slot,
          new_date: newDate,
          new_time_slot: newTimeSlot,
          changed_by: userRole,
          change_date: new Date()
        }
      });

    } catch (error) {
      await db.query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('Schedule change error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update schedule',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ---------- SCHEDULE HISTORY ----------
app.get('/orders/:orderId/schedule-history', authenticateJWT, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.userId || req.user.id;
    const userRole = req.user.role || 'user';

    const [orderRows] = await db.query(
      `SELECT * FROM orders 
       WHERE order_id = ? AND user_id = ?`,
      [orderId, userId]
    );

    if (orderRows.length === 0 && userRole !== 'admin' && userRole !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied to order history'
      });
    }

    const [history] = await db.query(
      `SELECT sc.*, 
              u.name as user_name,
              u.email as user_email
       FROM schedule_changes sc
       LEFT JOIN users u ON sc.user_id = u.custom_id
       WHERE sc.order_id = ?
       ORDER BY sc.change_date DESC`,
      [orderId]
    );

    res.json({
      success: true,
      history: history.map(record => ({
        id: record.id,
        order_id: record.order_id,
        user_name: record.user_name,
        previous_date: record.previous_date,
        previous_time_slot: record.previous_time_slot,
        new_date: record.new_date,
        new_time_slot: record.new_time_slot,
        changed_by: record.changed_by,
        reason: record.reason,
        change_date: record.change_date
      }))
    });

  } catch (error) {
    console.error('Get schedule history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch schedule history'
    });
  }
});

// ---------- CAN CHANGE SCHEDULE ----------
app.get('/orders/:orderId/can-change-schedule', authenticateJWT, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.userId || req.user.id;
    const userRole = req.user.role || 'user';

    const [orderRows] = await db.query(
      `SELECT * FROM orders WHERE order_id = ?`,
      [orderId]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({
        success: false,
        can_change: false,
        message: 'Order not found'
      });
    }

    const order = orderRows[0];

    if (userRole === 'user' && order.user_id !== userId) {
      return res.status(403).json({
        success: false,
        can_change: false,
        message: 'Access denied'
      });
    }

    const canChangeSchedule = () => {
      if (!['Pending', 'Processing'].includes(order.status)) {
        return {
          can_change: false,
          reason: `Order status is ${order.status}`
        };
      }

      if (order.vendor_id || order.service_expert) {
        return {
          can_change: false,
          reason: 'Service expert already assigned'
        };
      }

      if (hasServiceStarted(order)) {
        return {
          can_change: false,
          reason: 'Service has already started'
        };
      }

      if (order.schedule_changed) {
        return {
          can_change: false,
          reason: 'Schedule already changed once'
        };
      }

      return {
        can_change: true,
        reason: 'Schedule can be changed'
      };
    };

    const result = canChangeSchedule();

    res.json({
      success: true,
      order_id: orderId,
      current_date: order.order_date,
      current_time_slot: order.time_slot,
      ...result,
      conditions: {
        valid_status: ['Pending', 'Processing'].includes(order.status),
        no_vendor_assigned: !(order.vendor_id || order.service_expert),
        service_not_started: !hasServiceStarted(order),
        not_changed_before: !order.schedule_changed
      }
    });

  } catch (error) {
    console.error('Check schedule change error:', error);
    res.status(500).json({
      success: false,
      can_change: false,
      message: 'Failed to check schedule change status'
    });
  }
});

// ---------- VENDOR DASHBOARD ----------
app.get('/api/vendor/dashboard', authenticateVendor, async (req, res) => {
  try {
    const vendorId = req.vendor.vendorId;

    if (!vendorId) {
      return res.status(401).json({
        success: false,
        message: 'Vendor ID not found'
      });
    }

    const [stats] = await db.query(
      `SELECT 
        id,
        name,
        email,
        phone_number,
        vendor_photo,
        status,
        total_orders,
        completed_orders,
        pending_orders,
        canceled_orders,
        hold_orders,
        active_orders,
        average_rating,
        success_rate,
        wallet_balance,
        created_at
       FROM vendors 
       WHERE id = ?`,
      [vendorId]
    );

    if (stats.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    const [recentOrders] = await db.query(
      `SELECT 
        order_id,
        order_date,
        time_slot,
        status,
        created_at,
        (SELECT COUNT(*) FROM order_reviews WHERE order_id = orders.order_id) as review_count
       FROM orders 
       WHERE vendor_id = ?
       ORDER BY created_at DESC 
       LIMIT 10`,
      [vendorId]
    );

    const [monthlyStats] = await db.query(
      `SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as total,
        SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END) as cancelled
       FROM orders 
       WHERE vendor_id = ?
       AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
       GROUP BY DATE_FORMAT(created_at, '%Y-%m')
       ORDER BY month DESC`,
      [vendorId]
    );

    res.json({
      success: true,
      dashboard: {
        stats: stats[0],
        recent_orders: recentOrders,
        monthly_stats: monthlyStats
      }
    });

  } catch (error) {
    console.error('❌ Vendor dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data'
    });
  }
});

// ---------- VENDOR ORDER DETAILS ----------
app.get('/vendor/orders/:orderId', authenticateVendor, async (req, res) => {
  try {
    const { orderId } = req.params;
    const vendorId = req.vendor.vendorId;

    const [orders] = await db.query(
      `SELECT 
        o.*,
        u.name as customer_name,
        u.email as customer_email,
        u.phone_number as customer_phone,
        u.photo as customer_photo
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.custom_id
       WHERE o.order_id = ? AND o.vendor_id = ?`,
      [orderId, vendorId]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or not assigned to you'
      });
    }

    const order = orders[0];

    const parsedCart = safeParseJSON(order.cart_items, []);
    const parsedServiceExpert = safeParseJSON(order.service_expert, null);
    const parsedReviews = safeParseJSON(order.reviews, null);

    let addressField = null;
    if (order.address_type === 'home' && order.home_address) {
      addressField = order.home_address;
    } else if (order.address_type === 'office' && order.office_address) {
      addressField = order.office_address;
    } else if (order.address_type === 'another' && order.temp_address) {
      addressField = order.temp_address;
    }

    const parsedAddress = safeParseJSON(addressField, {});
    const cartItems = Array.isArray(parsedCart) ? parsedCart : [];
    const total = cartItems.reduce((sum, item) => 
      sum + ((item?.price || 0) * (item?.quantity || 0)), 0
    );

    res.json({
      success: true,
      order: {
        ...order,
        cart_items: cartItems,
        service_expert: parsedServiceExpert,
        address: parsedAddress,
        reviews: parsedReviews,
        total: total.toFixed(2)
      }
    });

  } catch (error) {
    console.error('❌ Get vendor order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order details'
    });
  }
});

// ---------- VENDOR REVIEWS ----------
app.get('/api/vendor/reviews', authenticateVendor, async (req, res) => {
  try {
    const vendorId = req.vendor.vendorId;
    const { limit = 20, offset = 0 } = req.query;

    const [reviews] = await db.query(
      `SELECT 
        r.*,
        u.name as customer_name,
        u.photo as customer_photo,
        o.order_id,
        o.order_date
       FROM order_reviews r
       JOIN orders o ON r.order_id = o.order_id
       JOIN users u ON r.user_id = u.custom_id
       WHERE o.vendor_id = ?
       ORDER BY r.created_at DESC
       LIMIT ? OFFSET ?`,
      [vendorId, parseInt(limit), parseInt(offset)]
    );

    const [total] = await db.query(
      `SELECT COUNT(*) as count
       FROM order_reviews r
       JOIN orders o ON r.order_id = o.order_id
       WHERE o.vendor_id = ?`,
      [vendorId]
    );

    const [avgRatings] = await db.query(
      `SELECT 
        AVG(service_expert_rating) as avg_service_rating,
        AVG(website_service_rating) as avg_website_rating
       FROM order_reviews r
       JOIN orders o ON r.order_id = o.order_id
       WHERE o.vendor_id = ?`,
      [vendorId]
    );

    res.json({
      success: true,
      reviews: reviews,
      pagination: {
        total: total[0].count,
        limit: parseInt(limit),
        offset: parseInt(offset)
      },
      averages: {
        service_rating: Math.round(avgRatings[0].avg_service_rating || 0),
        website_rating: Math.round(avgRatings[0].avg_website_rating || 0)
      }
    });

  } catch (error) {
    console.error('❌ Get vendor reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews'
    });
  }
});

// ---------- VENDOR TECHNICIANS ----------
app.get('/api/vendor/technicians', authenticateVendor, async (req, res) => {
  try {
    const vendorId = req.vendor.vendorId;

    const [technicians] = await db.query(
      `SELECT 
        id, name, email, phone_number, photo, 
        skills, experience, hourly_rate, status,
        rating, total_orders, completed_orders,
        created_at
       FROM technicians 
       WHERE vendor_id = ?
       ORDER BY created_at DESC`,
      [vendorId]
    );

    const parsedTechnicians = technicians.map(tech => {
      const skills = safeParseJSON(tech.skills, []);
      return { ...tech, skills };
    });

    res.json({
      success: true,
      technicians: parsedTechnicians
    });

  } catch (error) {
    console.error('❌ Get technicians error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch technicians'
    });
  }
});

// ---------- ADMIN TECHNICIANS ----------
app.get('/api/admin/technicians', verifyToken(['admin', 'superadmin']), async (req, res) => {
  try {
    const [technicians] = await db.query(
      `SELECT 
        t.*,
        v.name as vendor_name,
        v.company_name as vendor_company
       FROM technicians t
       LEFT JOIN vendors v ON t.vendor_id = v.id
       ORDER BY t.created_at DESC`
    );

    const parsedTechnicians = technicians.map(tech => {
      const skills = safeParseJSON(tech.skills, []);
      const serviceAreas = safeParseJSON(tech.service_areas, []);
      return { ...tech, skills, service_areas: serviceAreas };
    });

    res.json({
      success: true,
      technicians: parsedTechnicians
    });

  } catch (error) {
    console.error('❌ Get technicians error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch technicians'
    });
  }
});

// ---------- ADMIN TECHNICIAN STATUS UPDATE ----------
app.patch('/api/admin/technicians/:id/status', verifyToken(['admin', 'superadmin']), async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['pending', 'active', 'inactive', 'suspended'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status'
    });
  }

  try {
    await db.query(
      'UPDATE technicians SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, id]
    );

    res.json({
      success: true,
      message: `Technician status updated to ${status}`
    });

  } catch (error) {
    console.error('❌ Update technician status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update technician status'
    });
  }
});

// ---------- HEALTH CHECK ----------
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    port: PORT,
    database: {
      host: DB_HOST,
      database: DB_NAME
    }
  });
});

app.get('/api/vendor/health', (req, res) => {
  res.json({
    success: true,
    status: 'Server is running',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// ---------- ERROR HANDLING MIDDLEWARE ----------
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);

  if (err instanceof multer.MulterError) {
    if (err.code === 'FILE_TOO_LARGE') {
      return res.status(413).json({
        success: false,
        message: 'File too large. Maximum size is 10MB.'
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ---------- 404 NOT FOUND ----------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

