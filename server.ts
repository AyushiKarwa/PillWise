import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { connectDB } from './server/config/db';
import medicineRoutes from './server/routes/medicineRoutes';
import historyRoutes from './server/routes/historyRoutes';
import aiRoutes from './server/routes/aiRoutes';
import reminderRoutes from './server/routes/reminderRoutes';
import pharmacyRoutes from './server/routes/pharmacyRoutes';
import { errorHandler } from './server/middlewares/errorHandler';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Attempt database connection
  await connectDB();

  // Middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // API Routes FIRST
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'PillWise - Your AI-Powered Medicine Cabinet' });
  });

  app.use('/api/medicines', medicineRoutes);
  app.use('/api/history', historyRoutes);
  app.use('/api/ai', aiRoutes);
  app.use('/api/reminders', reminderRoutes);
  app.use('/api/pharmacy', pharmacyRoutes);

  // Centralized Error Middleware for API
  app.use(errorHandler);

  // Vite middleware or Static files
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 PillWise server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
