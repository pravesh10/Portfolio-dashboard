import express, { Request, Response } from 'express';
import { portfolioService } from '../services/portfolioService';

const router = express.Router();

/**
 * GET /api/portfolio
 * Get complete portfolio with live data
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const portfolio = await portfolioService.getPortfolio();
    res.json(portfolio);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ 
      error: 'Failed to fetch portfolio data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/portfolio/holdings
 * Get portfolio holdings without live data
 */
router.get('/holdings', (req: Request, res: Response) => {
  try {
    const holdings = portfolioService.getHoldings();
    res.json(holdings);
  } catch (error) {
    console.error('Error fetching holdings:', error);
    res.status(500).json({ 
      error: 'Failed to fetch holdings',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/portfolio/stock
 * Add a new stock to the portfolio
 */
router.post('/stock', (req: Request, res: Response) => {
  try {
    const stock = req.body;
    
    // Validate required fields
    if (!stock.symbol || !stock.name || !stock.purchasePrice || 
        !stock.quantity || !stock.exchange || !stock.sector) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['symbol', 'name', 'purchasePrice', 'quantity', 'exchange', 'sector']
      });
    }

    portfolioService.addStock(stock);
    res.status(201).json({ message: 'Stock added successfully', stock });
  } catch (error) {
    console.error('Error adding stock:', error);
    res.status(500).json({ 
      error: 'Failed to add stock',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * DELETE /api/portfolio/stock/:symbol
 * Remove a stock from the portfolio
 */
router.delete('/stock/:symbol', (req: Request, res: Response) => {
  try {
    const symbol = req.params.symbol as string;
    const removed = portfolioService.removeStock(symbol);
    
    if (removed) {
      res.json({ message: 'Stock removed successfully', symbol });
    } else {
      res.status(404).json({ error: 'Stock not found', symbol });
    }
  } catch (error) {
    console.error('Error removing stock:', error);
    res.status(500).json({ 
      error: 'Failed to remove stock',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/portfolio/stock/:symbol
 * Update a stock in the portfolio
 */
router.put('/stock/:symbol', (req: Request, res: Response) => {
  try {
    const symbol = req.params.symbol as string;
    const updates = req.body;
    
    const updated = portfolioService.updateStock(symbol, updates);
    
    if (updated) {
      res.json({ message: 'Stock updated successfully', symbol, updates });
    } else {
      res.status(404).json({ error: 'Stock not found', symbol });
    }
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ 
      error: 'Failed to update stock',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
