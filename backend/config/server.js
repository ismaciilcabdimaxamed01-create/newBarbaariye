/**
 * server.js - Express server-ka backend-ka
 * 
 * SIDEE UU U SHAQEEYO:
 * 1. Express server-ka wuxuu sameeyaa REST API endpoints (/api/all, /api/data, /api/stream)
 * 2. Wuxuu isticmaalayaa middleware-ka (helmet, cors, compression, bodyParser)
 * 3. Wuxuu u wacaa dynamicController-ka si uu u fuliyo PostgreSQL stored procedures
 * 
 * TALLAABO:
 * - Step 1: require() → soo deji dependencies (express, cors, helmet, compression, bodyParser, dotenv)
 * - Step 2: require() → soo deji dynamicController (handleDynamicRequest, handleDataRequest, handleStreamRequest)
 * - Step 3: express() → abuur Express app instance
 * - Step 4: app.use() → ku dar middleware-ka (compression, helmet, cors, bodyParser, logger)
 * - Step 5: app.post() → abuur API endpoints (/api/all, /api/data, /api/stream)
 * - Step 6: app.get() → abuur health check endpoint (/health)
 * - Step 7: app.listen() → billow server-ka port-ka (3000)
 */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const bodyParser = require('body-parser');
const path = require('path');

// Load .env from backend folder so DB_PASSWORD is always available
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

// Step 2: Soo deji dynamicController iyo api config
const dynamicController = require('./dynamicController');
const api = require('./api');

// Step 3: Abuur Express app instance
const app = express();

// Step 4a: Ku dar compression middleware (Gzip compression) – response-ka wuxuu noqon karaa yar
app.use(compression());

// Step 4b: Xisaabi PORT-ka (process.env.PORT ama 3000 default)
const PORT = process.env.PORT || 3000;

// Step 4c: Ku dar helmet middleware (Security headers) – ilaali XSS, clickjacking, iwm
app.use(helmet());

// Step 4d: Ku dar cors middleware (Enable CORS) – oggolow requests-ka frontend-ka
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Step 4e: Ku dar bodyParser middleware (Parse urlencoded and JSON)
// Muhiim: Frontend-ka wuxuu soo gudbinayaa form data (urlencoded) ama JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// Step 4f: Ku dar logger middleware (Simple request logger)
// TALLAABO: Muuji method + URL marka request-ka soo dhaco
app.use((req, res, next) => {
    console.log(`[LOG] ${req.method} ${req.url}`);
    next(); // U gudbi request-ka endpoint-ka
});

// Step 4g: Test database connection (development only – disabled in production for security)
app.post('/api/test-db', (req, res) => {
    if (process.env.NODE_ENV === 'production') {
        return res.status(404).send('Not found');
    }
    const db = require('./db');
    db.query('SELECT 1')
        .then(() => res.json({ success: true, message: 'DB connected' }))
        .catch((error) => res.status(500).json({
            success: false,
            message: 'Database connection failed',
            error: error.message,
        }));
});

// Step 5: Abuur API endpoints
// Step 5a: /api/all – Legacy endpoint (la mid ah all.php) – u waca PostgreSQL stored procedures
// TALLAABO: Frontend-ka wuxuu soo gudbinayaa POST request adiga oo maraya JSON payload
//           dynamicController.handleDynamicRequest wuxuu u wacaa PostgreSQL function-ka
app.post('/api/all', dynamicController.handleDynamicRequest);

// Step 6: Abuur health check endpoint (/health)
// TALLAABO: GET request → soo celi "Nidaamku wuu shaqaynayaa" (si loo hubiyo server-ku waa shaqaynayaa)
app.get('/health', (req, res) => {
    res.send('Nidaamku wuu shaqaynayaa (System operational)');
});

// Step 6b: Barbaariye API routes (from api config)
api.registerApiRoutes(app);

// Step 7: Billow server-ka port-ka (3000)
// TALLAABO: app.listen() → billow server-ka + muuji fariin
const server = app.listen(PORT, () => {
    console.log(`Server-ku wuxuu ku socdaa port-ka ${PORT}`);
    console.log(`Habka Ku-dayashada ee Legacy: WAA DIYAAR`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\nPort ${PORT} waa la isticmaalayaa (address already in use).`);
        console.error('Ka dami process-ka isticmaala port-kan, ka dibna dib u bilow server-ka.');
        console.error('Windows (PowerShell):');
        console.error(`  Get-NetTCPConnection -LocalPort ${PORT} -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }\n`);
    } else {
        console.error(err);
    }
    process.exit(1);
});

module.exports = app;
