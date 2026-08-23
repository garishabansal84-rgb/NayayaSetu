import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { connectDB, getDBStatus } from './config/db.js';
import intakeRoutes from './routes/intakeRoutes.js';
import evidenceRoutes from './routes/evidenceRoutes.js';
import draftRoutes from './routes/draftRoutes.js';
import schemeRoutes from './routes/schemeRoutes.js';
import jurisdictionRoutes from './routes/jurisdictionRoutes.js';
import ragRoutes from './routes/ragRoutes.js';
import authRoutes from './routes/authRoutes.js';
import civicAnalysisRoutes from './routes/civicAnalysisRoutes.js';
import { initScheduledIngestion } from './services/schedulerService.js';
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Storage directories
const uploadDir = path.join(__dirname, 'uploads');
const docsDir = path.join(__dirname, 'generated_docs');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });

const app = express();
const PORT = process.env.PORT || 5005;

// Connect to Database
connectDB();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

app.use('/uploads', express.static(uploadDir));
app.use('/generated_docs', express.static(docsDir));

// Root Status
app.get('/', (req, res) => {
  const dbStatus = getDBStatus();
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>NyayaSetu RAG & Civic API</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px; }
        .card { max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 16px; padding: 30px; border: 1px solid #334155; }
        h1 { color: #60a5fa; margin-top: 0; }
        .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; background: #065f46; color: #6ee7b7; font-size: 12px; font-weight: bold; }
        ul { list-style: none; padding: 0; }
        li { margin: 12px 0; }
        a { color: #38bdf8; text-decoration: none; font-weight: 500; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class="card">
        <span class="badge">● ONLINE ON PORT ${PORT}</span>
        <h1>⚖️ NyayaSetu RAG & Civic API Server</h1>
        <p>AI-Powered Grounded Civic & Legal Action Engine.</p>
        <hr style="border-color: #334155; margin: 20px 0;" />
        <h3>Active Endpoints:</h3>
        <ul>
          <li>🔹 <a href="/api/health" target="_blank">GET /api/health</a></li>
          <li>🔹 <a href="/api/rag/sources" target="_blank">GET /api/rag/sources</a></li>
          <li>🔹 <a href="/api/rag/chunks" target="_blank">GET /api/rag/chunks</a></li>
          <li>🔹 <a href="/api/schemes/list" target="_blank">GET /api/schemes/list</a></li>
        </ul>
      </div>
    </body>
    </html>
  `);
});

// Health check
app.get('/api/health', (req, res) => {
  const dbStatus = getDBStatus();
  res.status(200).json({
    success: true,
    service: 'NyayaSetu RAG & Civic AI Backend',
    version: '2.0.0 (RAG Enabled)',
    status: 'ONLINE',
    port: PORT,
    timestamp: new Date().toISOString(),
    database: dbStatus,
    aiModel: process.env.GEMINI_API_KEY ? 'Google Gemini 2.5/1.5 Flash + text-embedding-004' : 'High-Fidelity Legal Fallback Engine'
  });
});

// Routes
app.use('/api/intake', intakeRoutes);
app.use('/api/evidence', evidenceRoutes);
app.use('/api/drafts', draftRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/jurisdiction', jurisdictionRoutes);
app.use('/api/rag', ragRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/civic-analysis', civicAnalysisRoutes);

app.use(errorHandler);

// Ingestion Scheduler
initScheduledIngestion(60);

if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(PORT, () => {
    console.log(`
=========================================================
  🚀 NyayaSetu RAG & Civic Action Engine Backend Running
  📡 Local Server : http://localhost:${PORT}
  🩺 Health Check  : http://localhost:${PORT}/api/health
  📚 RAG Endpoints : /api/rag/query, /api/rag/sources
=========================================================
    `);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n❌ Port ${PORT} is already occupied by a previously running backend process.`);
      console.error(`👉 Run: npx kill-port ${PORT} (or kill -9 $(lsof -ti:${PORT})) then run 'npm run dev'\n`);
    } else {
      console.error('Server error:', err);
    }
  });
}

export default app;