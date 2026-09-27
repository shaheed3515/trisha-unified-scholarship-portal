// ─────────────────────────────────────────────────────────────────────────────
// TRISHA Backend Server — Express + MongoDB Atlas
// ─────────────────────────────────────────────────────────────────────────────

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './data/database.js'
import apiRouter from './routes/api.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// ──── Middleware ────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:4173', 'http://127.0.0.1:5173'],
  credentials: true
}))
app.use(express.json())

// Request logging
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  next()
})

// ──── API Routes ────
app.use('/api', apiRouter)

// ──── Health Check ────
app.get('/health', (_req, res) => {
  res.json({
    service: 'TRISHA MoTA Scholarship Backend',
    version: '1.0.0',
    status: 'operational',
    database: 'MongoDB Atlas (Free M0)',
    timestamp: new Date().toISOString()
  })
})

// 404
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found. See /health for info.' })
})

// Error handler
app.use((err, _req, res, _next) => {
  console.error('[SERVER ERROR]', err.message)
  res.status(500).json({ success: false, error: 'Internal server error', detail: err.message })
})

// ──── Start Server ────
async function start() {
  const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI

  if (!MONGO_URI) {
    console.error(`
  ╔═══════════════════════════════════════════════════════════════╗
  ║  ERROR: MongoDB connection string not found!                 ║
  ║                                                              ║
  ║  Create a .env file in the project root with:                ║
  ║                                                              ║
  ║  MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/trisha║
  ║                                                              ║
  ║  Get this from: MongoDB Atlas → Connect → Drivers → Node.js  ║
  ╚═══════════════════════════════════════════════════════════════╝
    `)
    process.exit(1)
  }

  await connectDB(MONGO_URI)

  app.listen(PORT, () => {
    console.log(`
  ╔═══════════════════════════════════════════════════════════════╗
  ║   TRISHA Backend API Server                                  ║
  ║   Ministry of Tribal Affairs Scholarship Portal              ║
  ║                                                              ║
  ║   Running on:   http://localhost:${PORT}                      ║
  ║   Health:       http://localhost:${PORT}/health                ║
  ║   API Base:     http://localhost:${PORT}/api                   ║
  ║   Database:     MongoDB Atlas (Connected)                     ║
  ╚═══════════════════════════════════════════════════════════════╝
    `)
  })
}

start()
