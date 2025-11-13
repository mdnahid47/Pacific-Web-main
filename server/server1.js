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

// CORS configuration to allow frontend access
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

const app = express();
const port = 5001;

// Middleware setup
app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.options('*', cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }))

// Database connection configuration
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Nahid0088@gmail.com", // Change to your MySQL password
  database: "auth_system",
}).promise();

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

// Service Image Storage
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

// File Filter
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

// Upload Middleware
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
const vendorStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dir;
    if (file.fieldname === 'profile_image') {
      dir = path.join(__dirname, 'uploads/profiles');
    } else {
      dir = path.join(__dirname, 'uploads/nids');
    }
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const prefix = file.fieldname === 'profile_image' ? 'profile' : file.fieldname;
    cb(null, `${prefix}-${Date.now()}${ext}`);
  }
});
const uploadVendorDocs = multer({
  storage: vendorStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});
// JWT Authentication Middleware
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ success: false, message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "Token missing" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
};


app.put(
  "/api/user-profile",
  authenticateJWT,
  uploadProfile.single("photo"), // Multer middleware from your config
  async (req, res) => {
    const userId = req.user.userId;

    try {
      const { name, phone_number } = req.body;

      let home_address = {};
      let office_address = {};

      try {
        home_address =
          typeof req.body.home_address === "string"
            ? JSON.parse(req.body.home_address)
            : req.body.home_address || {};

        office_address =
          typeof req.body.office_address === "string"
            ? JSON.parse(req.body.office_address)
            : req.body.office_address || {};
      } catch (parseError) {
        console.error("Address parsing error:", parseError);
      }

      const updateFields = {
        name,
        phone_number,
        home_address: JSON.stringify(home_address),
        office_address: JSON.stringify(office_address),
      };

      if (req.file) {
        const photoPath = `/uploads/profiles/${req.file.filename}`;
        updateFields.photo = photoPath;
      }

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
        home_address:
          typeof updatedUser.home_address === "string"
            ? JSON.parse(updatedUser.home_address)
            : updatedUser.home_address || {},
        office_address:
          typeof updatedUser.office_address === "string"
            ? JSON.parse(updatedUser.office_address)
            : updatedUser.office_address || {},
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
        error:
          process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }
  }
);


// Database connection check
db.connect((err) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

// API Endpoints

// User Registration
app.post("/api/register", async (req, res) => {
  const { firstName, email, phoneNumber, password } = req.body;

  // Input validation
  if (!firstName || !email || !phoneNumber || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    // Check for duplicate email or phone
    const [duplicateCheck] = await db.query(
      "SELECT * FROM users WHERE email = ? OR phone_number = ?",
      [email, phoneNumber]
    );

    if (duplicateCheck.length > 0) {
      return res.status(400).json({ success: false, message: "Email or phone number already registered" });
    }

    // Generate custom user ID
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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
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

// universal login endpoint for all user types
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  // 🔐 Check Super Admin
  const [superRows] = await db.query("SELECT * FROM superadmins WHERE email = ?", [email]);
  const superUser = superRows[0];
  if (superUser && await bcrypt.compare(password, superUser.password)) {
    const token = jwt.sign({ id: superUser.id, role: "superadmin" }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return res.cookie("token", token, { httpOnly: true, secure: true }).json({
      success: true,
      role: "superadmin",
      token,
      user: {
        email: superUser.email,
        name: "Super Admin"
      }
    });
  }

  // 🔐 Check Admin
  const [adminRows] = await db.query("SELECT * FROM admins WHERE email = ? AND verified = 1", [email]);
  const admin = adminRows[0];
  if (admin && await bcrypt.compare(password, admin.password)) {
    const token = jwt.sign({ id: admin.id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return res.cookie("token", token, { httpOnly: true, secure: true }).json({
      success: true,
      role: "admin",
      token,
      user: {
        email: admin.email,
        name: "Admin"
      }
    });
  }

// 🔐 Check Regular User
const [userRows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
const user = userRows[0];
if (user && await bcrypt.compare(password, user.password)) {
  const token = jwt.sign({ userId: user.custom_id, role: "user" }, process.env.JWT_SECRET, { expiresIn: "1h" });

  // Fetch fresh user data to return
  const [freshUserRows] = await db.query("SELECT * FROM users WHERE custom_id = ?", [user.custom_id]);
  const freshUser = freshUserRows[0];

  return res.cookie("token", token, { httpOnly: true, secure: true }).json({
    success: true,
    role: "user",
    token,
    user: {
      email: freshUser.email,
      name: freshUser.name,
      photo: freshUser.photo,
    }
  });
}


  return res.status(401).json({ success: false, message: "Invalid credentials" });
});


//  verify JWT token
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


// // Get User Profile
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
      home_address: typeof user.home_address === "string" ? JSON.parse(user.home_address) : {},
      office_address: typeof user.office_address === "string" ? JSON.parse(user.office_address) : {},
    };

    res.json({ success: true, user: parsedUser });
  } catch (err) {
    console.error("Fetch profile error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch profile" });
  }
});


// Place Order
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
    recipientName,       
    recipientPhone       
  } = req.body;

  if (!category || !cart || cart.length === 0 || !addressType || !address) {
    return res.status(400).json({ success: false, message: "Required fields missing" });
  }

  try {
    const generateRandomNumber = () => Math.floor(1000 + Math.random() * 9000);
    const orderId = `#${category}${generateRandomNumber()}`;

    let homeAddress = null;
    let officeAddress = null;
    let tempAddress = null;

    if (addressType === 'home') homeAddress = address;
    if (addressType === 'office') officeAddress = address;
    if (addressType === 'another') tempAddress = address;

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




// Cancel Order
app.patch('/api/orders/:orderId/cancel', authenticateJWT, async (req, res) => {
  const { orderId } = req.params;
  const { reason } = req.body;
  const userId = req.user.userId;

  try {
    const [result] = await db.query(
      `UPDATE orders SET status = 'Cancelled', cancel_reason = ?, cancelled_at = NOW() WHERE order_id = ? AND user_id = ?`,
      [reason, orderId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, message: "Order cancelled successfully" });
  } catch (err) {
    console.error("Order cancellation error:", err);
    res.status(500).json({ success: false, message: "Failed to cancel order" });
  }
});

// Get All Orders of the Logged-in User
app.get("/api/orders", authenticateJWT, async (req, res) => {
  const userId = req.user.userId;

  try {
    const [orders] = await db.query(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC",
      [userId]
    );

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
});

// Enhanced JWT Middleware with multi-role support
const verifyToken = (roles = []) => (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "Authorization token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //  Allow superadmin to access all routes
    if (decoded.role === 'superadmin') {
      req.user = decoded;
      return next();
    }

    // Otherwise check for allowed roles
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


// verify role endpoint for multi-role support
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

// Normal role check for multi-role support
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

// Enhanced Super Admin Registration with security checks
app.post("/api/superadmin/register", async (req, res) => {
  const { email, password } = req.body;

  // Input validation
  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: "Email and password are required" 
    });
  }

  // Validate email format
  if (!validator.isEmail(email)) {
    return res.status(400).json({ 
      success: false, 
      message: "Invalid email format" 
    });
  }

  // Password strength check
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
      // No sensitive data in response
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

// Enhanced Super Admin Login with rate limiting
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts
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
      process.env.JWT_SECRET, 
      { expiresIn: "8h" } // Longer expiration for superadmin
    );

    res.cookie("token", token, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 8 * 60 * 60 * 1000 // 8 hours
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

// Enhanced Admin Creation with validation
app.post("/api/admin/create", 
  verifyToken(["superadmin"]),
  async (req, res) => {
    const { email, password } = req.body;

    try {
      // Check for existing admin
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
        admin: { email } // Don't return sensitive data
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Admin creation failed" 
      });
    }
  }
);

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
  o.tracking_status,
  u.name AS customer_name,
  u.email AS customer_email,
  u.phone_number AS customer_phone
FROM orders o
LEFT JOIN users u ON o.user_id = u.custom_id
ORDER BY o.order_date DESC

    `);

    // Parse cart_items, address, and calculate total price
    const ordersWithDetails = orders.map(order => {
      let total = 0;
      let parsedCart = [];
      let parsedAddress = {};

      try {
  parsedCart = typeof order.cart_items === 'string' 
    ? JSON.parse(order.cart_items) 
    : order.cart_items;
    
  total = parsedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
} catch (e) {
  console.error("Cart parse error:", order.cart_items);
}

try {
  parsedAddress = typeof order.address === 'string'
    ? JSON.parse(order.address)
    : order.address;
} catch (e) {
  console.error("Address parse error:", order.address);
}


      return {
        ...order,
        cart_items: parsedCart,
        address: parsedAddress,
        total: total.toFixed(2)
      };
    });

    res.json({ success: true, orders: ordersWithDetails });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch all order details" });
  }
});


// DASHBOARD API for Admins
// This endpoint provides basic stats and recent activity for the admin dashboard

app.get('/api/admin/dashboard', verifyToken(['admin', 'superadmin']), async (req, res) => {
  try {
    // Basic stats
    const [users] = await db.query("SELECT COUNT(*) as count FROM users");
    const [orders] = await db.query("SELECT COUNT(*) as count FROM orders");
    const [pending] = await db.query("SELECT COUNT(*) as count FROM orders WHERE status = 'Pending'");
    const [completed] = await db.query("SELECT COUNT(*) as count FROM orders WHERE status = 'Completed'");
    const [cancelled] = await db.query("SELECT COUNT(*) as count FROM orders WHERE status = 'Cancelled'");
    const [vendors] = await db.query("SELECT COUNT(*) as count FROM vendors WHERE status = 'active'");

    const totalOrders = orders[0].count;
    const completionRate = totalOrders > 0
      ? ((completed[0].count / totalOrders) * 100).toFixed(2)
      : "0.00";

    // Stats object
    const stats = {
      totalOrders,
      pendingOrders: pending[0].count,
      completedOrders: completed[0].count,
      canceledOrders: cancelled[0].count,
      activeVendors: vendors[0].count,
      totalUsers: users[0].count,
      completionRate
    };

    // Recent activity
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

    // Single valid response
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

// USER MANAGEMENT API for Admins
// This endpoint allows admins to manage users, including fetching all users, updating user details, and
// Get all users
// Update your /api/admin/all-users endpoint
// API endpoint to get all users with proper address handling
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

    // json parse
    const parsedUsers = users.map(user => ({
      ...user,
      home_address: user.home_address ? JSON.parse(user.home_address) : {},
      office_address: user.office_address ? JSON.parse(user.office_address) : {}
    }));

    res.json({ success: true, users: parsedUsers });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Helper function to safely parse JSON
function safeParseJSON(jsonString) {
  try {
    return jsonString ? JSON.parse(jsonString) : null;
  } catch (e) {
    console.error("JSON parse error:", jsonString);
    return null;
  }
}
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
      let parsedCart = [];
      let total = 0;

      try {
        parsedCart = typeof order.cart_items === "string"
          ? JSON.parse(order.cart_items)
          : order.cart_items;

        total = parsedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      } catch (err) {
        console.error("Cart parse error:", order.cart_items);
      }

      return {
        ...order,
        cart_items: parsedCart,
        total: total.toFixed(2)
      };
    });

    res.json({ success: true, orders: parsedOrders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
});

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
// API endpoint to update user with address handling
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

// Delete user
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
// =============================Service Setup============================= //
// All services
app.get('/api/services', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM services');

    const services = results.map(service => {
      let imagePath = service.image;

      if (imagePath.startsWith('/images/')) {
        return {
          ...service,
          image: `http://localhost:5001${imagePath}`
        };
      }

      imagePath = imagePath.replace(/^\/?uploads\//, '');
      return {
        ...service,
        image: `http://localhost:5001/uploads/${imagePath}`
      };
    });

    res.json(services);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Category-wise services
app.get('/api/services/:category', async (req, res) => {
  const category = req.params.category.trim();

  try {
    const [rows] = await db.query('SELECT * FROM services WHERE category = ?', [category]);

    const services = rows.map(service => {
      let imagePath = service.image;

      if (imagePath.startsWith('/images/')) {
        return {
          ...service,
          image: `http://localhost:5001${imagePath}`
        };
      }

      imagePath = imagePath.replace(/^\/?uploads\//, '');
      return {
        ...service,
        image: `http://localhost:5001/uploads/${imagePath}`
      };
    });

    res.status(200).json(services);
  } catch (err) {
    console.error("DB Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Add new service
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

// update an existing service
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


// Fix: Use _id instead of id
app.delete("/api/services/:_id", (req, res) => {
  const { _id } = req.params;
  db.query("DELETE FROM services WHERE _id = ?", [_id], (err) => {
    if (err) {
      console.error("Delete error:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ success: true, message: "Service deleted successfully" });
  });
});

// ================================Vendor =================================================
app.post("/api/vendor/register", uploadVendorDocs.fields([
  { name: 'nid_front', maxCount: 1 },
  { name: 'nid_back', maxCount: 1 },
  { name: 'profile_image', maxCount: 1 }
]), async (req, res) => {
  const {
    name,
    email,
    phone,
    dob,
    password,
    nid_number,
    address,
    technician_quantity
  } = req.body;

  // Input validation
  if (!name || !email || !phone || !dob || !password || !nid_number || !address) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    // Check for duplicate email or phone
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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Handle file uploads
    const nidFront = req.files['nid_front'] ? `/uploads/nids/${req.files['nid_front'][0].filename}` : null;
    const nidBack = req.files['nid_back'] ? `/uploads/nids/${req.files['nid_back'][0].filename}` : null;
    const profileImage = req.files['profile_image'] ? `/uploads/profiles/${req.files['profile_image'][0].filename}` : null;

    // Create new vendor
    await db.query(
      `INSERT INTO vendors 
        (name, email, phone_number, password, dob, nid_number, 
         address, technician_quantity, vendor_photo, nid_front, nid_back,
         completed_orders, total_orders, canceled_orders, pending_orders,
         due_amount, amount_paid, join_date, status, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, 0, 0, 0, CURDATE(), 'pending', NOW(), NOW())`,
      [
        name, email, phone, hashedPassword, dob, nid_number,
        address, technician_quantity || 0, profileImage, nidFront, nidBack
      ]
    );

    res.status(200).json({ 
      success: true, 
      message: "Registration successful! Your account is pending approval."
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Registration failed",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});


// login endpoint for vendors

app.post("/api/vendor/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT * FROM vendors WHERE email = ?",
      [email]
    );
    const vendor = rows[0];

    if (!vendor) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    // Check if vendor is approved
    if (vendor.status !== 'active') {
      return res.status(403).json({ 
        success: false, 
        message: "Your account is pending approval" 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        vendorId: vendor.id, 
        role: "vendor",
        email: vendor.email
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: "8h" }
    );

    res.json({
      success: true,
      token,
      vendor: {
        id: vendor.id,
        name: vendor.name,
        email: vendor.email,
        phone: vendor.phone_number,
        profileImage: vendor.vendor_photo,
        status: vendor.status
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Login failed" 
    });
  }
});

// authentication middleware for vendors
const authenticateVendor = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: "Authorization token missing" 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== 'vendor') {
      return res.status(403).json({ 
        success: false, 
        message: "Access restricted to vendors only" 
      });
    }

    req.vendor = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ 
      success: false, 
      message: "Invalid or expired token" 
    });
  }
};

// Vendor profile endpoint
app.get("/api/vendor/profile", authenticateVendor, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, email, phone_number, address, vendor_photo, status FROM vendors WHERE id = ?",
      [req.vendor.vendorId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Vendor not found" 
      });
    }

    const vendor = rows[0];
    res.json({
      success: true,
      vendor: {
        id: vendor.id,
        name: vendor.name,
        email: vendor.email,
        phone: vendor.phone_number,
        address: vendor.address,
        profileImage: vendor.vendor_photo,
        status: vendor.status
      }
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch profile" 
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});