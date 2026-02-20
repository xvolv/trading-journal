/* ============================================
   Trade Forge — Core Types
   ============================================ */

export type MarketType = 'crypto' | 'forex' | 'binary' | 'stocks' | 'futures';

export type TradeDirection = 'long' | 'short' | 'call' | 'put';

export type EmotionTag = 'calm' | 'confident' | 'fomo' | 'revenge' | 'anxious' | 'greedy';

export type StrategyTag = 'scalping' | 'swing' | 'day-trade' | 'news' | 'breakout' | 'reversal' | 'trend-follow';

export type MistakeTag = 'over-leveraged' | 'no-stop-loss' | 'early-exit' | 'late-entry' | 'revenge-trade' | 'ignored-plan';

export interface Trade {
  id: string;
  market: MarketType;
  symbol: string;
  direction: TradeDirection;
  entryPrice: number;
  exitPrice: number | null;
  size: number;
  stopLoss: number | null;
  takeProfit: number | null;
  pnl: number;
  fees: number;
  riskRewardRatio: number | null;
  strategyTags: StrategyTag[];
  emotionTags: EmotionTag[];
  mistakeTags: MistakeTag[];
  notes: string;
  screenshotUrl: string | null;
  isOpen: boolean;
  openedAt: string;
  closedAt: string | null;
}

export interface DashboardStats {
  netPnlToday: number;
  netPnlWeek: number;
  netPnlMonth: number;
  winRate: number;
  avgRiskReward: number;
  totalTrades: number;
  profitFactor: number;
  bestDay: { date: string; pnl: number };
  worstDay: { date: string; pnl: number };
  currentStreak: { type: 'win' | 'loss'; count: number };
}

export interface CalendarDay {
  date: string;
  pnl: number;
  tradeCount: number;
}

export interface EquityDataPoint {
  date: string;
  equity: number;
  drawdown: number;
}

export interface DisciplineRule {
  id: string;
  label: string;
  type: 'daily-loss' | 'daily-profit' | 'max-trades' | 'weekly-goal' | 'monthly-goal';
  threshold: number;
  currentValue: number;
  isBreached: boolean;
}

export type PnlPeriod = 'today' | 'week' | 'month';

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}
