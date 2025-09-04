const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'dist')));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'tennsational-secret-key-2025',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Database setup
const dbPath = process.env.NODE_ENV === 'production' 
  ? '/opt/render/project/src/database.sqlite'
  : path.join(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  // Restaurant submissions table
  db.run(`
    CREATE TABLE IF NOT EXISTS restaurant_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      county TEXT NOT NULL,
      phone TEXT,
      website TEXT,
      cuisine TEXT NOT NULL,
      price_range TEXT,
      description TEXT,
      hours TEXT,
      amenities TEXT,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'pending'
    )
  `);

  // Reviews table
  db.run(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      restaurant_id INTEGER,
      reviewer_name TEXT NOT NULL,
      rating INTEGER NOT NULL,
      review_text TEXT NOT NULL,
      visit_date TEXT NOT NULL,
      photos TEXT,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'pending'
    )
  `);

  // Newsletter subscribers table
  db.run(`
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Admin users table
  db.run(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, () => {
    // Create default admin user if none exists
    db.get("SELECT COUNT(*) as count FROM admin_users", (err, row) => {
      if (!err && row.count === 0) {
        const defaultPassword = 'tennsational2025';
        const hashedPassword = bcrypt.hashSync(defaultPassword, 10);
        db.run(
          "INSERT INTO admin_users (username, password_hash) VALUES (?, ?)",
          ['admin', hashedPassword],
          (err) => {
            if (!err) {
              console.log('Default admin user created - Username: admin, Password: tennsational2025');
            }
          }
        );
      }
    });
  });
}

// Auth middleware
function requireAuth(req, res, next) {
  if (req.session && req.session.adminId) {
    next();
  } else {
    res.status(401).json({ error: 'Authentication required' });
  }
}

// ============= API ROUTES =============

// TEMPORARY DEBUG ENDPOINT - Add this to check what's in your database
app.get('/api/debug/all-restaurants', (req, res) => {
  console.log('DEBUG: Checking all restaurants in database...');
  
  db.all("SELECT * FROM restaurant_submissions ORDER BY submitted_at DESC", (err, rows) => {
    if (err) {
      console.error('Debug query error:', err);
      return res.json({ 
        error: err.message,
        restaurants: [],
        count: 0 
      });
    }
    
    console.log('DEBUG: Found', rows.length, 'total restaurants');
    if (rows.length > 0) {
      console.log('DEBUG: First restaurant:', rows[0]);
    }
    
    // Parse amenities for display
    const restaurants = rows.map(row => ({
      ...row,
      amenities: row.amenities ? JSON.parse(row.amenities) : []
    }));
    
    const result = {
      success: true,
      count: restaurants.length,
      restaurants: restaurants,
      approved_count: restaurants.filter(r => r.status === 'approved').length,
      pending_count: restaurants.filter(r => r.status === 'pending').length,
      rejected_count: restaurants.filter(r => r.status === 'rejected').length,
      database_path: dbPath,
      environment: process.env.NODE_ENV || 'development'
    };
    
    console.log('DEBUG: Returning result:', {
      count: result.count,
      approved: result.approved_count,
      pending: result.pending_count,
      rejected: result.rejected_count
    });
    
    res.json(result);
  });
});

// Admin Authentication
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  db.get(
    "SELECT * FROM admin_users WHERE username = ?",
    [username],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (!user || !bcrypt.compareSync(password, user.password_hash)) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      req.session.adminId = user.id;
      res.json({ success: true, message: 'Logged in successfully' });
    }
  );
});

app.post('/api/admin/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true, message: 'Logged out successfully' });
});

// Restaurant Submissions
app.post('/api/restaurants/submit', (req, res) => {
  const {
    name, address, city, county, phone, website,
    cuisine, price_range, description, hours, amenities
  } = req.body;

  // Validate required fields
  if (!name || !address || !city || !county || !cuisine) {
    return res.status(400).json({ 
      error: 'Missing required fields: name, address, city, county, cuisine' 
    });
  }

  const amenitiesStr = Array.isArray(amenities) ? JSON.stringify(amenities) : amenities;

  db.run(`
    INSERT INTO restaurant_submissions 
    (name, address, city, county, phone, website, cuisine, price_range, description, hours, amenities)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [name, address, city, county, phone, website, cuisine, price_range, description, hours, amenitiesStr],
  function(err) {
    if (err) {
      console.error('Error inserting restaurant submission:', err);
      return res.status(500).json({ error: 'Failed to submit restaurant' });
    }
    
    res.json({ 
      success: true, 
      message: 'Restaurant submitted successfully! It will be reviewed and added to the directory.',
      id: this.lastID 
    });
  });
});

// Get approved restaurants for public display
app.get('/api/restaurants/approved', (req, res) => {
  console.log('API: Getting approved restaurants...');
  
  db.all(
    "SELECT * FROM restaurant_submissions WHERE status = 'approved' ORDER BY name ASC",
    (err, rows) => {
      if (err) {
        console.error('Error getting approved restaurants:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      console.log('API: Found', rows.length, 'approved restaurants');
      
      // Parse amenities JSON for each restaurant
      const restaurants = rows.map(row => ({
        ...row,
        amenities: row.amenities ? JSON.parse(row.amenities) : [],
        // Add default values for fields that might be missing
        rating: 0, // Default rating since we don't have reviews calculated yet
        reviews: 0 // Default review count
      }));
      
      res.json(restaurants);
    }
  );
});

// Get restaurant submissions (admin only)
app.get('/api/admin/restaurant-submissions', requireAuth, (req, res) => {
  const status = req.query.status || 'all';
  
  let query = "SELECT * FROM restaurant_submissions";
  let params = [];
  
  if (status !== 'all') {
    query += " WHERE status = ?";
    params.push(status);
  }
  
  query += " ORDER BY submitted_at DESC";
  
  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    // Parse amenities JSON
    const submissions = rows.map(row => ({
      ...row,
      amenities: row.amenities ? JSON.parse(row.amenities) : []
    }));
    
    res.json(submissions);
  });
});

// Update restaurant submission status
app.put('/api/admin/restaurant-submissions/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  console.log(`Updating restaurant ${id} status to: ${status}`);
  
  db.run(
    "UPDATE restaurant_submissions SET status = ? WHERE id = ?",
    [status, id],
    function(err) {
      if (err) {
        console.error('Error updating restaurant status:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Submission not found' });
      }
      
      console.log(`Successfully updated restaurant ${id} to ${status}`);
      res.json({ success: true, message: 'Status updated successfully' });
    }
  );
});

// Delete restaurant submission
app.delete('/api/admin/restaurant-submissions/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  
  db.run(
    "DELETE FROM restaurant_submissions WHERE id = ?",
    [id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Submission not found' });
      }
      
      res.json({ success: true, message: 'Submission deleted successfully' });
    }
  );
});

// Reviews
app.post('/api/reviews/submit', (req, res) => {
  const {
    restaurant_id, reviewer_name, rating, review_text, visit_date, photos
  } = req.body;

  // Validate required fields
  if (!restaurant_id || !reviewer_name || !rating || !review_text || !visit_date) {
    return res.status(400).json({ 
      error: 'Missing required fields' 
    });
  }

  const photosStr = photos ? JSON.stringify(photos) : null;

  db.run(`
    INSERT INTO reviews 
    (restaurant_id, reviewer_name, rating, review_text, visit_date, photos)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [restaurant_id, reviewer_name, rating, review_text, visit_date, photosStr],
  function(err) {
    if (err) {
      console.error('Error inserting review:', err);
      return res.status(500).json({ error: 'Failed to submit review' });
    }
    
    res.json({ 
      success: true, 
      message: 'Review submitted successfully! It will be reviewed before appearing on the site.',
      id: this.lastID 
    });
  });
});

// Get reviews (admin only)
app.get('/api/admin/reviews', requireAuth, (req, res) => {
  const status = req.query.status || 'all';
  
  let query = "SELECT * FROM reviews";
  let params = [];
  
  if (status !== 'all') {
    query += " WHERE status = ?";
    params.push(status);
  }
  
  query += " ORDER BY submitted_at DESC";
  
  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    // Parse photos JSON
    const reviews = rows.map(row => ({
      ...row,
      photos: row.photos ? JSON.parse(row.photos) : []
    }));
    
    res.json(reviews);
  });
});

// Get approved reviews for public display
app.get('/api/reviews/approved', (req, res) => {
  const restaurant_id = req.query.restaurant_id;
  
  let query = "SELECT * FROM reviews WHERE status = 'approved'";
  let params = [];
  
  if (restaurant_id) {
    query += " AND restaurant_id = ?";
    params.push(restaurant_id);
  }
  
  query += " ORDER BY submitted_at DESC";
  
  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    // Parse photos JSON and remove sensitive data
    const reviews = rows.map(row => ({
      id: row.id,
      restaurant_id: row.restaurant_id,
      reviewer_name: row.reviewer_name,
      rating: row.rating,
      review_text: row.review_text,
      visit_date: row.visit_date,
      photos: row.photos ? JSON.parse(row.photos) : [],
      submitted_at: row.submitted_at
    }));
    
    res.json(reviews);
  });
});

// Update review status
app.put('/api/admin/reviews/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  db.run(
    "UPDATE reviews SET status = ? WHERE id = ?",
    [status, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Review not found' });
      }
      
      res.json({ success: true, message: 'Review status updated successfully' });
    }
  );
});

// Delete review
app.delete('/api/admin/reviews/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  
  db.run(
    "DELETE FROM reviews WHERE id = ?",
    [id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Review not found' });
      }
      
      res.json({ success: true, message: 'Review deleted successfully' });
    }
  );
});

// Newsletter Subscriptions
app.post('/api/newsletter/subscribe', (req, res) => {
  const { firstName, lastName, email } = req.body;

  if (!firstName || !lastName || !email) {
    return res.status(400).json({ 
      error: 'Missing required fields: firstName, lastName, email' 
    });
  }

  db.run(`
    INSERT INTO newsletter_subscribers (first_name, last_name, email)
    VALUES (?, ?, ?)
  `, [firstName, lastName, email],
  function(err) {
    if (err) {
      if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(409).json({ error: 'Email already subscribed' });
      }
      console.error('Error inserting newsletter subscription:', err);
      return res.status(500).json({ error: 'Failed to subscribe to newsletter' });
    }
    
    res.json({ 
      success: true, 
      message: 'Successfully subscribed to newsletter!',
      id: this.lastID 
    });
  });
});

// Get newsletter subscribers (admin only)
app.get('/api/admin/newsletter-subscribers', requireAuth, (req, res) => {
  db.all("SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// Delete newsletter subscriber
app.delete('/api/admin/newsletter-subscribers/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  
  db.run(
    "DELETE FROM newsletter_subscribers WHERE id = ?",
    [id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Subscriber not found' });
      }
      
      res.json({ success: true, message: 'Subscriber deleted successfully' });
    }
  );
});

// Dashboard Stats (admin only)
app.get('/api/admin/stats', requireAuth, (req, res) => {
  const stats = {};
  
  // Get counts for each table
  const queries = [
    { name: 'pendingRestaurants', query: "SELECT COUNT(*) as count FROM restaurant_submissions WHERE status = 'pending'" },
    { name: 'approvedRestaurants', query: "SELECT COUNT(*) as count FROM restaurant_submissions WHERE status = 'approved'" },
    { name: 'rejectedRestaurants', query: "SELECT COUNT(*) as count FROM restaurant_submissions WHERE status = 'rejected'" },
    { name: 'pendingReviews', query: "SELECT COUNT(*) as count FROM reviews WHERE status = 'pending'" },
    { name: 'approvedReviews', query: "SELECT COUNT(*) as count FROM reviews WHERE status = 'approved'" },
    { name: 'rejectedReviews', query: "SELECT COUNT(*) as count FROM reviews WHERE status = 'rejected'" },
    { name: 'newsletterSubscribers', query: "SELECT COUNT(*) as count FROM newsletter_subscribers" }
  ];
  
  let completed = 0;
  
  queries.forEach(({ name, query }) => {
    db.get(query, (err, row) => {
      if (!err && row) {
        stats[name] = row.count;
      } else {
        stats[name] = 0;
      }
      
      completed++;
      if (completed === queries.length) {
        res.json(stats);
      }
    });
  });
});

// ============= NO-AUTH RESTAURANT MANAGEMENT ENDPOINTS =============

// Get restaurant submissions (no auth required)
app.get('/api/public/restaurant-submissions', (req, res) => {
  const status = req.query.status || 'all';
  
  let query = "SELECT * FROM restaurant_submissions";
  let params = [];
  
  if (status !== 'all') {
    query += " WHERE status = ?";
    params.push(status);
  }
  
  query += " ORDER BY submitted_at DESC";
  
  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    // Parse amenities JSON
    const submissions = rows.map(row => ({
      ...row,
      amenities: row.amenities ? JSON.parse(row.amenities) : []
    }));
    
    res.json(submissions);
  });
});

// Update restaurant submission status (no auth required)
app.put('/api/public/restaurant-submissions/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  db.run(
    "UPDATE restaurant_submissions SET status = ? WHERE id = ?",
    [status, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Submission not found' });
      }
      
      res.json({ success: true, message: 'Status updated successfully' });
    }
  );
});

// Delete restaurant submission (no auth required)
app.delete('/api/public/restaurant-submissions/:id', (req, res) => {
  const { id } = req.params;
  
  db.run(
    "DELETE FROM restaurant_submissions WHERE id = ?",
    [id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Submission not found' });
      }
      
      res.json({ success: true, message: 'Submission deleted successfully' });
    }
  );
});

// Dashboard Stats (no auth required)
app.get('/api/public/stats', (req, res) => {
  const stats = {};
  
  const queries = [
    { name: 'pendingRestaurants', query: "SELECT COUNT(*) as count FROM restaurant_submissions WHERE status = 'pending'" },
    { name: 'approvedRestaurants', query: "SELECT COUNT(*) as count FROM restaurant_submissions WHERE status = 'approved'" },
    { name: 'rejectedRestaurants', query: "SELECT COUNT(*) as count FROM restaurant_submissions WHERE status = 'rejected'" },
    { name: 'pendingReviews', query: "SELECT COUNT(*) as count FROM reviews WHERE status = 'pending'" },
    { name: 'approvedReviews', query: "SELECT COUNT(*) as count FROM reviews WHERE status = 'approved'" },
    { name: 'rejectedReviews', query: "SELECT COUNT(*) as count FROM reviews WHERE status = 'rejected'" },
    { name: 'newsletterSubscribers', query: "SELECT COUNT(*) as count FROM newsletter_subscribers" }
  ];
  
  let completed = 0;
  
  queries.forEach(({ name, query }) => {
    db.get(query, (err, row) => {
      if (!err && row) {
        stats[name] = row.count;
      } else {
        stats[name] = 0;
      }
      
      completed++;
      if (completed === queries.length) {
        res.json(stats);
      }
    });
  });
});

// Serve restaurant admin page
app.get('/admin/restaurants', (req, res) => {
  res.sendFile(path.join(__dirname, 'restaurant-admin.html'));
});

// Serve restaurant submission form
app.get('/submit-restaurant', (req, res) => {
  res.sendFile(path.join(__dirname, 'restaurant-submission.html'));
});

// Serve the React app for specific routes only
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.get('/merch', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Catch-all for any other React routes
app.get(/^\/((?!api|admin|submit-restaurant|restaurant-directory).)*$/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Serve dynamic restaurant listings page
app.get('/restaurant-directory', (req, res) => {
  res.sendFile(path.join(__dirname, 'restaurants-listing.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});
