const express = require('express');
const cors = require('cors');
const connectDB = require('./database/database');
const apiRoutes = require('./routes/api');
const pageRoutes = require('./routes/pages');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Connect Database
connectDB();

// Keep process alive hack (debugging)
setInterval(() => { }, 60000);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', apiRoutes);
app.use('/api/pages', pageRoutes); // Public (GET)
app.use('/api/admin/pages', pageRoutes); // Admin (POST/PUT/DELETE) - reusing same router for simplicity, but logic handles paths
// Actually, let's just mount it at /api/pages and /api/admin/pages handled inside? No, better structure:
// Let's simpler: app.use('/api', pageRoutes) is messy if it overrides.
// Better: Mount pageRoutes to /api/pages and have admin routes inside it?
// The router I wrote has /:slug, /, and POST /.
// If I mount it to /api/pages, then GET /api/pages/:slug works.
// POST /api/pages would correspond to router.post('/').
// So:
app.use('/api/pages', pageRoutes);
// But wait, my router has /api/admin/pages routes? No, I defined router.post('/', ...)
// So if I mount at /api/pages, creates are at POST /api/pages. That's fine.
// BUT I also want specific admin routes?
// I defined router.post('/', ...) in routes/pages.js.
// So mounting at /api/pages means creating is POST /api/pages.
// Updating is PUT /api/pages/:id.
// Deleting is DELETE /api/pages/:id.
// That's RESTful and fine. No need for /api/admin/pages prefix if auth is handled.

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
