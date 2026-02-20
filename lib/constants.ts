import type {
  SymbolInfo,
  TagOption,
  StrategyTag,
  EmotionTag,
  MistakeTag,
  DisciplineRule,
  DashboardStats,
} from '@/types/types';

/* ============================================
   Account Balance
   ============================================ */

export const DEFAULT_ACCOUNT_BALANCE = 12925;

/* ============================================
   Symbols List (fallback when API is unavailable)
   ============================================ */

export const SYMBOLS_LIST: SymbolInfo[] = [
  // Crypto
  { symbol: 'BTC/USDT', market: 'crypto', precision: 2, mockPrice: 43280 },
  { symbol: 'ETH/USDT', market: 'crypto', precision: 2, mockPrice: 2890 },
  { symbol: 'SOL/USDT', market: 'crypto', precision: 2, mockPrice: 112.8 },
  { symbol: 'BNB/USDT', market: 'crypto', precision: 2, mockPrice: 605.2 },
  { symbol: 'XRP/USDT', market: 'crypto', precision: 4, mockPrice: 0.6245 },
  { symbol: 'DOGE/USDT', market: 'crypto', precision: 4, mockPrice: 0.0825 },
  { symbol: 'ADA/USDT', market: 'crypto', precision: 4, mockPrice: 0.5820 },
  { symbol: 'AVAX/USDT', market: 'crypto', precision: 2, mockPrice: 38.45 },
  // Forex
  { symbol: 'EUR/USD', market: 'forex', precision: 4, mockPrice: 1.0892 },
  { symbol: 'GBP/USD', market: 'forex', precision: 4, mockPrice: 1.2655 },
  { symbol: 'USD/JPY', market: 'forex', precision: 2, mockPrice: 149.80 },
  { symbol: 'GBP/JPY', market: 'forex', precision: 2, mockPrice: 188.42 },
  { symbol: 'AUD/USD', market: 'forex', precision: 4, mockPrice: 0.6580 },
  { symbol: 'XAU/USD', market: 'forex', precision: 2, mockPrice: 2024.50 },
  // Stocks
  { symbol: 'AAPL', market: 'stocks', precision: 2, mockPrice: 185.60 },
  { symbol: 'NVDA', market: 'stocks', precision: 2, mockPrice: 892.30 },
  { symbol: 'TSLA', market: 'stocks', precision: 2, mockPrice: 198.50 },
  { symbol: 'META', market: 'stocks', precision: 2, mockPrice: 485.20 },
  { symbol: 'MSFT', market: 'stocks', precision: 2, mockPrice: 415.80 },
  // Futures
  { symbol: 'ES', market: 'futures', precision: 2, mockPrice: 5120.25 },
  { symbol: 'NQ', market: 'futures', precision: 2, mockPrice: 18245.50 },
  { symbol: 'CL', market: 'futures', precision: 2, mockPrice: 78.35 },
];

export const RECENT_SYMBOLS = ['BTC/USDT', 'EUR/USD', 'ETH/USDT', 'SOL/USDT', 'NVDA'];

/* ============================================
   Tag Options
   ============================================ */

export const STRATEGY_TAG_OPTIONS: TagOption<StrategyTag>[] = [
  { value: 'scalping', label: 'Scalping', color: 'accent' },
  { value: 'swing', label: 'Swing', color: 'accent' },
  { value: 'day-trade', label: 'Day Trade', color: 'accent' },
  { value: 'news', label: 'News', color: 'blue' },
  { value: 'breakout', label: 'Breakout', color: 'accent' },
  { value: 'reversal', label: 'Reversal', color: 'blue' },
  { value: 'trend-follow', label: 'Trend Follow', color: 'accent' },
  { value: 'mean-reversion', label: 'Mean Reversion', color: 'blue' },
];

export const EMOTION_TAG_OPTIONS: TagOption<EmotionTag>[] = [
  { value: 'calm', label: 'Calm', color: 'green' },
  { value: 'confident', label: 'Confident', color: 'green' },
  { value: 'tired', label: 'Tired', color: 'yellow' },
  { value: 'anxious', label: 'Anxious', color: 'yellow' },
  { value: 'fomo', label: 'FOMO', color: 'red' },
  { value: 'revenge', label: 'Revenge', color: 'red' },
  { value: 'greedy', label: 'Greedy', color: 'red' },
];

export const MISTAKE_TAG_OPTIONS: TagOption<MistakeTag>[] = [
  { value: 'no-stop-loss', label: 'No SL', color: 'red' },
  { value: 'over-leveraged', label: 'Over-sized', color: 'red' },
  { value: 'chased', label: 'Chased', color: 'red' },
  { value: 'no-plan', label: 'No Plan', color: 'red' },
  { value: 'late-entry', label: 'Late Entry', color: 'yellow' },
  { value: 'early-exit', label: 'Early Exit', color: 'yellow' },
  { value: 'revenge-trade', label: 'Revenge Trade', color: 'red' },
  { value: 'ignored-plan', label: 'Ignored Plan', color: 'red' },
];

/* ============================================
   Discipline Rules (until API is built)
   ============================================ */

export const DEFAULT_DISCIPLINE_RULES: DisciplineRule[] = [
  {
    id: 'r1',
    label: 'Daily Loss Limit',
    type: 'daily-loss',
    threshold: -500,
    currentValue: 0,
    isBreached: false,
  },
  {
    id: 'r2',
    label: 'Max Trades Per Day',
    type: 'max-trades',
    threshold: 5,
    currentValue: 0,
    isBreached: false,
  },
  {
    id: 'r3',
    label: 'Daily Profit Target',
    type: 'daily-profit',
    threshold: 1000,
    currentValue: 0,
    isBreached: false,
  },
];

/* ============================================
   Hero Chart Data (landing page demo)
   ============================================ */

export const HERO_CHART_DATA = [
  { month: 'Jan', pnl: 1200 },
  { month: 'Feb', pnl: 1800 },
  { month: 'Mar', pnl: 1400 },
  { month: 'Apr', pnl: 2800 },
  { month: 'May', pnl: 2200 },
  { month: 'Jun', pnl: 3500 },
  { month: 'Jul', pnl: 3100 },
  { month: 'Aug', pnl: 4200 },
  { month: 'Sep', pnl: 3800 },
  { month: 'Oct', pnl: 5100 },
  { month: 'Nov', pnl: 4800 },
  { month: 'Dec', pnl: 6200 },
];
