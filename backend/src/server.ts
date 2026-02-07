import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import portfolioRoutes from './routes/portfolio';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/portfolio', portfolioRoutes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'Portfolio Dashboard API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      portfolio: '/api/portfolio',
      holdings: '/api/portfolio/holdings',
      addStock: 'POST /api/portfolio/stock',
      removeStock: 'DELETE /api/portfolio/stock/:symbol',
      updateStock: 'PUT /api/portfolio/stock/:symbol'
    }
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log('=================================');
  console.log('Portfolio Dashboard API Server');
  console.log('=================================');
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API base URL: http://localhost:${PORT}/api`);
  console.log('=================================');
});

export default app;
