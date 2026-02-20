/* ============================================
   Trade Forge — Core Types
   ============================================ */

export type MarketType = 'crypto' | 'forex' | 'binary' | 'stocks' | 'futures';

export type TradeDirection = 'long' | 'short' | 'call' | 'put';

export type EmotionTag = 'calm' | 'confident' | 'fomo' | 'revenge' | 'anxious' | 'greedy' | 'tired';

export type StrategyTag = 'scalping' | 'swing' | 'day-trade' | 'news' | 'breakout' | 'reversal' | 'trend-follow' | 'mean-reversion';

export type MistakeTag = 'over-leveraged' | 'no-stop-loss' | 'early-exit' | 'late-entry' | 'revenge-trade' | 'ignored-plan' | 'chased' | 'no-plan';

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

/* ============================================
   New Trade Form Types
   ============================================ */

export type SizeMode = 'quantity' | 'risk-dollar';

export interface SymbolInfo {
  symbol: string;
  market: MarketType;
  precision: number;
  mockPrice: number;
}

export interface NewTradeFormData {
  symbol: SymbolInfo | null;
  direction: TradeDirection | null;
  entryPrice: string;
  exitPrice: string;
  sizeMode: SizeMode;
  quantity: string;
  riskDollars: string;
  feesPercent: string;
  stopLoss: string;
  takeProfit: string;
  strategyTags: StrategyTag[];
  emotionTags: EmotionTag[];
  mistakeTags: MistakeTag[];
  notes: string;
  screenshotDataUrl: string | null;
  commissionOverride: string;
  fundingFee: string;
  customField: string;
}

export interface LivePreview {
  potentialPnl: number | null;
  riskReward: number | null;
  riskPercent: number | null;
  breakeven: number | null;
  feeImpact: number | null;
  ruleViolations: string[];
  emotionalWarning: string | null;
}

export interface TagOption<T extends string> {
  value: T;
  label: string;
  color: 'green' | 'red' | 'yellow' | 'accent' | 'blue';
}

/* ============================================
   Dashboard & Analytics Types
   ============================================ */

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
