'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import type {
  NewTradeFormData,
  LivePreview,
  SymbolInfo,
  TradeDirection,
  StrategyTag,
  EmotionTag,
  MistakeTag,
  SizeMode,
  DisciplineRule,
} from '@/types/types';
import {
  calcPnl,
  calcRiskReward,
  calcBreakeven,
  calcRiskPercent,
} from '@/lib/utils';
import { DEFAULT_ACCOUNT_BALANCE } from '@/lib/constants';
import { useTrades } from '@/context/TradesContext';

const INITIAL_FORM: NewTradeFormData = {
  symbol: null,
  direction: null,
  entryPrice: '',
  exitPrice: '',
  sizeMode: 'quantity',
  quantity: '',
  riskDollars: '',
  feesPercent: '0.1',
  stopLoss: '',
  takeProfit: '',
  strategyTags: [],
  emotionTags: [],
  mistakeTags: [],
  notes: '',
  screenshotDataUrl: null,
  commissionOverride: '',
  fundingFee: '',
  customField: '',
};

export function useNewTradeForm() {
  const [form, setForm] = useState<NewTradeFormData>(INITIAL_FORM);
  const { trades } = useTrades();

  // --- Fetch discipline rules & compute live values ---
  const [fetchedRules, setFetchedRules] = useState<DisciplineRule[]>([]);

  useEffect(() => {
    fetch('/api/discipline-rules')
      .then((r) => (r.ok ? r.json() : []))
      .then(setFetchedRules)
      .catch(() => setFetchedRules([]));
  }, []);

  const liveRules: DisciplineRule[] = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const todayTrades = trades.filter(
      (t) => !t.isOpen && (t.closedAt ?? t.openedAt).slice(0, 10) === today
    );
    const todayPnl = todayTrades.reduce((s, t) => s + t.pnl, 0);
    const todayCount = todayTrades.length;

    return fetchedRules.map((rule) => {
      let currentValue = 0;
      let isBreached = false;
      if (rule.type === 'daily-loss') {
        currentValue = Math.min(todayPnl, 0);
        isBreached = currentValue <= rule.threshold;
      } else if (rule.type === 'daily-profit') {
        currentValue = Math.max(todayPnl, 0);
        isBreached = currentValue >= rule.threshold;
      } else if (rule.type === 'max-trades') {
        currentValue = todayCount;
        isBreached = currentValue >= rule.threshold;
      }
      return { ...rule, currentValue, isBreached };
    });
  }, [fetchedRules, trades]);

  // --- field updaters ---
  const setField = useCallback(
    <K extends keyof NewTradeFormData>(key: K, value: NewTradeFormData[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const setSymbol = useCallback((symbol: SymbolInfo) => {
    setForm((prev) => ({
      ...prev,
      symbol,
      entryPrice: String(symbol.mockPrice),
    }));
  }, []);

  const setDirection = useCallback((dir: TradeDirection) => {
    setField('direction', dir);
  }, [setField]);

  const setSizeMode = useCallback((mode: SizeMode) => {
    setField('sizeMode', mode);
  }, [setField]);

  const toggleTag = useCallback(
    <T extends StrategyTag | EmotionTag | MistakeTag>(
      key: 'strategyTags' | 'emotionTags' | 'mistakeTags',
      tag: T
    ) => {
      setForm((prev) => {
        const arr = prev[key] as T[];
        const next = arr.includes(tag)
          ? arr.filter((t) => t !== tag)
          : [...arr, tag];
        return { ...prev, [key]: next };
      });
    },
    []
  );

  // --- parse helpers ---
  const entry = parseFloat(form.entryPrice) || 0;
  const exit = parseFloat(form.exitPrice) || 0;
  const sl = parseFloat(form.stopLoss) || 0;
  const tp = parseFloat(form.takeProfit) || 0;
  const feePct = parseFloat(form.feesPercent) || 0;
  const qty = parseFloat(form.quantity) || 0;
  const riskDollars = parseFloat(form.riskDollars) || 0;

  // Auto-calc quantity from risk dollars + SL distance
  const effectiveQty = useMemo(() => {
    if (form.sizeMode === 'risk-dollar' && form.direction && entry > 0 && sl > 0 && riskDollars > 0) {
      const isLong = form.direction === 'long' || form.direction === 'call';
      const slDistance = isLong ? entry - sl : sl - entry;
      if (slDistance > 0) return riskDollars / slDistance;
    }
    return qty;
  }, [form.sizeMode, form.direction, entry, sl, riskDollars, qty]);

  // --- live preview ---
  const preview: LivePreview = useMemo(() => {
    const result: LivePreview = {
      potentialPnl: null,
      riskReward: null,
      riskPercent: null,
      breakeven: null,
      feeImpact: null,
      ruleViolations: [],
      emotionalWarning: null,
    };

    if (!form.direction || entry <= 0 || effectiveQty <= 0) return result;

    const notional = entry * effectiveQty;
    const fees = notional * (feePct / 100);
    result.feeImpact = fees;

    // PnL if exit is filled
    if (exit > 0) {
      result.potentialPnl = calcPnl(form.direction, entry, exit, effectiveQty, fees);
    } else if (tp > 0) {
      // Show potential PnL at TP
      result.potentialPnl = calcPnl(form.direction, entry, tp, effectiveQty, fees);
    }

    // R:R
    if (sl > 0 && tp > 0) {
      result.riskReward = calcRiskReward(form.direction, entry, sl, tp);
    }

    // Risk % of account
    if (sl > 0) {
      const isLong = form.direction === 'long' || form.direction === 'call';
      const riskAmt = isLong
        ? (entry - sl) * effectiveQty
        : (sl - entry) * effectiveQty;
      result.riskPercent = calcRiskPercent(riskAmt, DEFAULT_ACCOUNT_BALANCE);
    }

    // Breakeven
    if (fees > 0) {
      result.breakeven = calcBreakeven(entry, fees, effectiveQty, form.direction);
    }

    // Rule violations (use live rules from API + today's stats)
    for (const rule of liveRules) {
      if (rule.type === 'max-trades' && rule.currentValue >= rule.threshold) {
        result.ruleViolations.push(`Max trades reached (${rule.threshold}/day)`);
      }
      if (rule.type === 'daily-loss' && result.potentialPnl !== null && result.potentialPnl < 0) {
        const totalLoss = rule.currentValue + result.potentialPnl;
        if (totalLoss <= rule.threshold) {
          result.ruleViolations.push(`Daily loss limit hit ($${Math.abs(rule.threshold)})`);
        }
      }
    }

    // Emotional warnings
    const dangerEmotions: EmotionTag[] = ['fomo', 'revenge', 'greedy'];
    const hasDanger = form.emotionTags.some((t) => dangerEmotions.includes(t));
    const hasDangerMistake = form.mistakeTags.includes('no-stop-loss') || form.mistakeTags.includes('revenge-trade');

    if (hasDanger && hasDangerMistake) {
      result.emotionalWarning = 'HIGH RISK: Dangerous emotion + mistake combo detected';
    } else if (hasDanger) {
      result.emotionalWarning = `High ${form.emotionTags.filter((t) => dangerEmotions.includes(t)).join(', ')} risk detected`;
    }

    return result;
  }, [form.direction, entry, exit, sl, tp, effectiveQty, feePct, form.emotionTags, form.mistakeTags]);

  // --- validation ---
  const isValid = useMemo(() => {
    return (
      form.symbol !== null &&
      form.direction !== null &&
      entry > 0 &&
      effectiveQty > 0
    );
  }, [form.symbol, form.direction, entry, effectiveQty]);

  const hasRuleViolation = preview.ruleViolations.length > 0;

  // --- TP from R:R multiplier ---
  const setTpFromRMultiple = useCallback(
    (multiple: number) => {
      if (!form.direction || entry <= 0 || sl <= 0) return;
      const isLong = form.direction === 'long' || form.direction === 'call';
      const risk = isLong ? entry - sl : sl - entry;
      const tpPrice = isLong ? entry + risk * multiple : entry - risk * multiple;
      setField('takeProfit', tpPrice.toFixed(form.symbol?.precision ?? 2));
    },
    [form.direction, entry, sl, form.symbol?.precision, setField]
  );

  const resetForm = useCallback(() => {
    setForm(INITIAL_FORM);
  }, []);

  return {
    form,
    setField,
    setSymbol,
    setDirection,
    setSizeMode,
    toggleTag,
    preview,
    isValid,
    hasRuleViolation,
    effectiveQty,
    setTpFromRMultiple,
    resetForm,
  };
}
