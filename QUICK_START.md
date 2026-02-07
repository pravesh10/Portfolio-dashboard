# Quick Start Guide

## Running the Portfolio Dashboard

### Step 1: Start the Backend Server

Open a terminal and run:

```bash
cd /Users/kqpraves/Desktop/portfolio-dashboard/backend
npm run dev
```

You should see:
```
=================================
Portfolio Dashboard API Server
=================================
Server running on port 5000
Health check: http://localhost:5000/health
API base URL: http://localhost:5000/api
=================================
```

### Step 2: Start the Frontend Application

Open a **new terminal** (keep the backend running) and run:

```bash
cd /Users/kqpraves/Desktop/portfolio-dashboard/frontend
npm run dev
```

You should see:
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
```

### Step 3: Open the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## What You'll See

1. **Portfolio Summary Cards** - Top section showing:
   - Total Investment
   - Present Value
   - Total Gain/Loss

2. **Sector Summary** - Cards for each sector showing:
   - Technology
   - Financials
   - Automobile
   - FMCG
   - Energy

3. **Holdings Table** - Detailed table with:
   - Stock name and symbol
   - Purchase price and quantity
   - Current market price (CMP)
   - Gain/Loss (color-coded)
   - P/E Ratio
   - Latest earnings

## Features to Try

- **Auto-Refresh**: Watch data update every 15 seconds automatically
- **Toggle Auto-Refresh**: Click the "Auto-Refresh ON/OFF" button
- **Manual Refresh**: Click "Refresh Now" to update immediately
- **Responsive Design**: Resize your browser to see mobile layout

## Stopping the Application

1. Stop the frontend: Press `Ctrl+C` in the frontend terminal
2. Stop the backend: Press `Ctrl+C` in the backend terminal

## Troubleshooting

### Backend not starting?
- Check if port 5000 is available
- Run `lsof -i :5000` to see if something is using the port
- Kill the process or change PORT in backend/.env

### Frontend not connecting to backend?
- Ensure backend is running on port 5000
- Check browser console for errors
- Verify NEXT_PUBLIC_API_URL in frontend/.env.local

### No stock data showing?
- This is normal - Yahoo Finance API may take a moment
- Check backend console for API errors
- Ensure you have internet connection
- Some stocks may not have data available

## Sample Stocks Included

The application comes pre-loaded with 12 Indian stocks across 5 sectors:

**Technology**: Infosys, TCS, Wipro  
**Financials**: HDFC Bank, ICICI Bank, Axis Bank  
**Automobile**: Tata Motors, Maruti Suzuki  
**FMCG**: ITC, Hindustan Unilever  
**Energy**: Reliance Industries, ONGC  

## Next Steps

- Read the [README.md](README.md) for detailed documentation
- Review [TECHNICAL_DOCUMENT.md](TECHNICAL_DOCUMENT.md) for technical details
- Customize stocks in `backend/src/data/samplePortfolio.ts`
- Adjust refresh interval in `frontend/app/page.tsx`

Enjoy your Portfolio Dashboard! 📊
