# Portfolio Dashboard

A dynamic portfolio tracking application built with React.js, Next.js, TypeScript, Tailwind CSS, and Node.js. This application provides real-time stock data from Yahoo Finance API with automatic updates every 15 seconds.

## 🚀 Features

- **Real-time Stock Data**: Fetch current market prices (CMP) from Yahoo Finance
- **Auto-Refresh**: Automatic data updates every 15 seconds
- **Portfolio Analytics**: 
  - Total investment tracking
  - Present value calculation
  - Gain/Loss analysis with color-coded indicators
  - P/E Ratio display
  - Latest earnings data
- **Sector-wise Grouping**: View portfolio performance by sector
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Interactive Dashboard**: 
  - Summary cards for quick insights
  - Detailed table view with all metrics
  - Toggle auto-refresh on/off
  - Manual refresh button

## 📋 Tech Stack

### Frontend
- **Next.js 14**: React framework for production
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **@tanstack/react-table**: Powerful table component
- **Axios**: HTTP client for API requests

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web application framework
- **TypeScript**: Type-safe backend development
- **yahoo-finance2**: Library for fetching stock data
- **node-cache**: In-memory caching for API responses
- **CORS**: Cross-origin resource sharing

## 🛠️ Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd portfolio-dashboard/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional):
```env
PORT=5000
```

4. Start the development server:
```bash
npm run dev
```

The backend API will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd portfolio-dashboard/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file (optional):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🏃 Running the Application

### Development Mode

1. **Start Backend** (Terminal 1):
```bash
cd portfolio-dashboard/backend
npm run dev
```

2. **Start Frontend** (Terminal 2):
```bash
cd portfolio-dashboard/frontend
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

### Production Build

**Backend:**
```bash
cd portfolio-dashboard/backend
npm run build
npm start
```

**Frontend:**
```bash
cd portfolio-dashboard/frontend
npm run build
npm start
```

## 📁 Project Structure

```
portfolio-dashboard/
├── backend/
│   ├── src/
│   │   ├── data/
│   │   │   └── samplePortfolio.ts    # Sample stock data
│   │   ├── routes/
│   │   │   └── portfolio.ts          # API routes
│   │   ├── services/
│   │   │   ├── yahooFinance.ts       # Yahoo Finance integration
│   │   │   └── portfolioService.ts   # Portfolio business logic
│   │   ├── types/
│   │   │   └── portfolio.ts          # TypeScript interfaces
│   │   └── server.ts                 # Express server setup
│   ├── package.json
│   ├── tsconfig.json
│   └── nodemon.json
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx                  # Main dashboard page
│   │   ├── layout.tsx                # Root layout
│   │   └── globals.css               # Global styles
│   ├── components/
│   │   ├── PortfolioTable.tsx        # Stock holdings table
│   │   ├── SectorSummary.tsx         # Sector cards
│   │   └── PortfolioSummary.tsx      # Summary statistics
│   ├── services/
│   │   └── api.ts                    # API client
│   ├── types/
│   │   └── portfolio.ts              # TypeScript interfaces
│   ├── utils/
│   │   └── format.ts                 # Formatting utilities
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   └── next.config.js
│
└── README.md
```

## 🔌 API Endpoints

### Portfolio Endpoints

- `GET /api/portfolio` - Get complete portfolio with live data
- `GET /api/portfolio/holdings` - Get portfolio holdings without live data
- `POST /api/portfolio/stock` - Add a new stock
- `DELETE /api/portfolio/stock/:symbol` - Remove a stock
- `PUT /api/portfolio/stock/:symbol` - Update a stock

### Health Check

- `GET /health` - Server health check
- `GET /` - API information

## 📊 Data Model

### Stock Interface
```typescript
interface Stock {
  symbol: string;        // Stock symbol (e.g., "INFY.NS")
  name: string;          // Company name
  purchasePrice: number; // Purchase price per share
  quantity: number;      // Number of shares
  exchange: string;      // Exchange (NSE/BSE)
  sector: string;        // Sector classification
}
```

### StockData Interface
```typescript
interface StockData extends Stock {
  investment: number;         // Total investment
  portfolioPercentage: number;// Portfolio weight
  cmp: number;               // Current Market Price
  presentValue: number;      // Current value
  gainLoss: number;          // Profit/Loss
  peRatio: number | null;    // P/E Ratio
  latestEarnings: string | null; // Earnings data
}
```

## 🎨 Features in Detail

### Auto-Refresh Functionality
- Data refreshes automatically every 15 seconds
- Can be toggled on/off using the dashboard button
- Manual refresh button available

### Color-Coded Indicators
- 🟢 Green: Positive gains
- 🔴 Red: Losses
- ⚪ Gray: Neutral/No change

### Sector Grouping
- Stocks grouped by sector (Technology, Financials, Automobile, FMCG, Energy)
- Sector-wise investment and gain/loss summary
- Visual cards for each sector

### Portfolio Metrics
- Total Investment
- Present Value
- Total Gain/Loss (absolute and percentage)
- Individual stock performance

## ⚠️ Important Notes

### API Limitations
- **Yahoo Finance**: This application uses the `yahoo-finance2` unofficial library as Yahoo Finance does not provide an official public API
- **Rate Limiting**: Requests are cached for 60 seconds to minimize API calls
- **Data Accuracy**: Stock data may occasionally be unavailable or delayed

### Sample Data
The application comes with pre-configured Indian stocks (NSE):
- Technology: Infosys, TCS, Wipro
- Financials: HDFC Bank, ICICI Bank, Axis Bank
- Automobile: Tata Motors, Maruti Suzuki
- FMCG: ITC, Hindustan Unilever
- Energy: Reliance Industries, ONGC

## 🔧 Customization

### Adding Your Own Stocks

Edit `backend/src/data/samplePortfolio.ts`:

```typescript
{
  symbol: 'SYMBOL.NS',    // Yahoo Finance symbol
  name: 'Company Name',
  purchasePrice: 1000.00,
  quantity: 50,
  exchange: 'NSE',
  sector: 'Technology'
}
```

### Changing Refresh Interval

Edit `frontend/app/page.tsx`, line 39:

```typescript
const interval = setInterval(() => {
  fetchPortfolio();
}, 15000); // Change this value (in milliseconds)
```

## 🐛 Troubleshooting

### Backend Issues

1. **Port already in use**:
   - Change the PORT in `.env` file
   - Or kill the process using the port

2. **CORS errors**:
   - Ensure backend is running
   - Check NEXT_PUBLIC_API_URL in frontend .env.local

3. **Stock data not loading**:
   - Verify stock symbols are correct for Yahoo Finance
   - Check internet connection
   - Review backend console for errors

### Frontend Issues

1. **Blank page**:
   - Check browser console for errors
   - Ensure backend is running
   - Verify API_URL configuration

2. **Styling issues**:
   - Clear `.next` folder and rebuild
   - Ensure Tailwind CSS is properly configured

## 📝 Technical Decisions

### Why yahoo-finance2?
- Most reliable unofficial library for Yahoo Finance data
- Active maintenance and community support
- Comprehensive data coverage including P/E ratios

### Caching Strategy
- 60-second cache for stock prices (balance between freshness and API limits)
- 1-hour cache for earnings data (changes less frequently)
- In-memory caching with node-cache for simplicity

### 15-Second Refresh
- Provides near real-time updates
- Respects API rate limits with caching
- Can be disabled by users if needed

## 🚀 Future Enhancements

- [ ] User authentication and personalized portfolios
- [ ] Historical performance charts with Recharts
- [ ] Export portfolio to PDF/Excel
- [ ] Real-time notifications for price alerts
- [ ] Support for multiple currencies
- [ ] Comparison with market indices
- [ ] News feed integration
- [ ] Mobile app version

## 📄 License

This project is created for educational purposes as part of a case study assignment.

## 👥 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check browser and server console logs

## 🙏 Acknowledgments

- Yahoo Finance for stock data
- Next.js team for the excellent framework
- Tailwind CSS for the utility framework
- Open source community for various libraries used
