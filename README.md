# Which Memecoin Are You? 🚀

A Web3-powered interactive quiz that helps users discover which memecoin matches their personality. Built with React, Next.js, Base blockchain integration, and real-time analytics.

## Features

### 🎯 Core Functionality
- **Interactive Quiz**: 5-question personality quiz with 14+ memecoin results
- **Web3 Integration**: Wallet connection with Base blockchain support
- **Real-time Analytics**: Global dashboard showing community results
- **Personal Results**: Detailed scoring breakdown with beautiful charts
- **Social Sharing**: Share results on Twitter and Warpcast

### 🔧 Technical Features
- **User Authentication**: Wallet-based login system
- **Database Storage**: Supabase integration for user data and quiz results
- **Real-time Updates**: WebSocket connections for live dashboard updates
- **Responsive Design**: Beautiful UI with dark/light mode support
- **SEO Optimized**: Proper meta tags and semantic HTML

### 🎨 Advanced Features
- **Confetti Animations**: Celebration effects on quiz completion
- **Donation System**: Support developer with ETH donations
- **Filtering Options**: Filter results by animal theme and blockchain
- **Chart Visualizations**: Beautiful Chart.js visualizations
- **Error Handling**: Comprehensive error handling and loading states

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Blockchain**: Wagmi, Viem, Base network
- **Database**: Supabase (PostgreSQL)
- **Charts**: Chart.js, React Chart.js 2
- **Real-time**: Socket.io
- **Build Tool**: Vite
- **UI Components**: shadcn/ui, Radix UI

## Database Schema

```sql
-- Users table
CREATE TABLE users (
  wallet_address TEXT PRIMARY KEY,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Quiz results table  
CREATE TABLE quiz_results (
  id SERIAL PRIMARY KEY,
  user_address TEXT REFERENCES users(wallet_address),
  memecoin_match TEXT NOT NULL,
  scores JSONB NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  animal_restriction TEXT,
  blockchain_restriction TEXT
);

-- Donations table
CREATE TABLE donations (
  id SERIAL PRIMARY KEY,
  user_address TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  currency TEXT DEFAULT 'ETH',
  to_address TEXT NOT NULL,
  cause TEXT DEFAULT 'developer',
  dev_donation DECIMAL DEFAULT 0,
  tx_hash TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project
- Base wallet (MetaMask, Coinbase Wallet, etc.)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd which-memecoin-are-you
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Fill in your environment variables:
- Supabase URL and keys
- WalletConnect project ID
- Other API keys as needed

4. **Set up Supabase**
- Create the database tables using the schema above
- Enable Row Level Security (RLS) policies as needed
- Set up authentication if required

5. **Start the development server**
```bash
npm run dev
```

6. **Start the WebSocket server** (optional, for real-time updates)
```bash
cd server
node server.js
```

The app will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── Quiz.tsx              # Main quiz component
│   ├── WalletConnection.tsx  # Wallet integration
│   ├── Filters.tsx           # Filter controls
│   ├── DonationForm.tsx      # ETH donation form
│   └── Providers.tsx         # Wagmi/React Query providers
├── hooks/
│   └── useQuiz.ts           # Quiz logic and data management
├── pages/
│   └── Index.tsx            # Main quiz page
├── app/
│   ├── login/page.tsx       # Login/wallet connection
│   ├── dashboard/page.tsx   # Global analytics dashboard
│   └── api/
│       ├── global-results/  # API for fetching aggregated results
│       └── donate/          # API for processing donations
└── lib/
    └── supabase.ts          # Database client and helpers
```

## Key Components

### Quiz Flow
1. **Login**: Users connect their wallet
2. **Filters**: Optional animal/blockchain restrictions
3. **Quiz**: 5 questions with multiple choice answers
4. **Results**: Personal result with sharing options
5. **Analytics**: View global community results

### Security Features
- Wallet address validation
- Input sanitization
- Error boundary handling
- RLS policies on database

### Performance Optimizations
- Lazy loading of components
- Optimized re-renders with React hooks
- Efficient chart updates
- WebSocket connection management

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on git push

### Manual Deployment
```bash
npm run build
npm run start
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Environment Variables

See `.env.example` for all required environment variables. Key variables include:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (server-side)
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: WalletConnect project ID

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Built during Onchain Summer with Base blockchain
- Inspired by the vibrant memecoin community
- Uses amazing tools from the Ethereum ecosystem

---

**Take the quiz and discover your memecoin personality!** 🎉

-- novas implementações a caminho
