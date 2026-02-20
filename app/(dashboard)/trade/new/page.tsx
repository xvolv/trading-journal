'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Save, Zap, CheckCircle } from 'lucide-react';
import { useNewTradeForm } from '@/hooks/useNewTradeForm';
import { useTrades } from '@/context/TradesContext';
import { SymbolSearch } from '@/components/trade/SymbolSearch';
import { DirectionChips } from '@/components/trade/DirectionChips';
import { PriceInput } from '@/components/trade/PriceInput';
import { PositionSizeInput } from '@/components/trade/PositionSizeInput';
import { StopTakeProfit } from '@/components/trade/StopTakeProfit';
import { LivePreviewPanel } from '@/components/trade/LivePreviewPanel';
import { TagSelector } from '@/components/trade/TagSelector';
import { NotesSection } from '@/components/trade/NotesSection';
import { AdvancedSection } from '@/components/trade/AdvancedSection';
import {
  STRATEGY_TAG_OPTIONS,
  EMOTION_TAG_OPTIONS,
  MISTAKE_TAG_OPTIONS,
} from '@/lib/mock-data';
import type { Trade } from '@/types/types';

export default function NewTradePage() {
  const router = useRouter();
  const { addTrade } = useTrades();
  const {
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
  } = useNewTradeForm();

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!isValid || !form.symbol) return;

    const exitPrice = form.exitPrice ? parseFloat(form.exitPrice) : null;
    const entryPrice = parseFloat(form.entryPrice);
    const sl = form.stopLoss ? parseFloat(form.stopLoss) : null;
    const tp = form.takeProfit ? parseFloat(form.takeProfit) : null;
    const fees = preview.feeImpact ?? 0;

    const trade: Trade = {
      id: `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      market: form.symbol.market,
      symbol: form.symbol.symbol,
      direction: form.direction!,
      entryPrice,
      exitPrice,
      size: effectiveQty,
      stopLoss: sl,
      takeProfit: tp,
      pnl: preview.potentialPnl ?? 0,
      fees,
      riskRewardRatio: preview.riskReward,
      strategyTags: form.strategyTags,
      emotionTags: form.emotionTags,
      mistakeTags: form.mistakeTags,
      notes: form.notes,
      screenshotUrl: form.screenshotDataUrl,
      isOpen: exitPrice === null,
      openedAt: new Date().toISOString(),
      closedAt: exitPrice !== null ? new Date().toISOString() : null,
    };

    addTrade(trade);

    setSaved(true);
    setTimeout(() => {
      router.push('/trades');
    }, 1200);
  };

  if (saved) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center animate-fade-in">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center bg-[var(--color-profit-bg)]">
            <CheckCircle className="h-8 w-8 text-[var(--color-profit)]" />
          </div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Trade Logged!</h2>
          <p className="mt-1 text-sm text-[var(--color-text-tertiary)]">
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  const precision = form.symbol?.precision ?? 2;

  return (
    <div className="mx-auto max-w-3xl animate-fade-in">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--color-surface-border)] bg-[var(--color-bg-primary)]/95 px-1 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-[var(--color-accent)]" />
          <h1 className="text-lg font-bold text-[var(--color-text-primary)]">New Trade</h1>
        </div>
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-8 w-8 items-center justify-center text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-primary)]"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-6 space-y-6 pb-28">
        {/* Live Preview — always visible at top */}
        <LivePreviewPanel
          preview={preview}
          symbolLabel={form.symbol?.symbol}
          precision={precision}
        />

        {/* Symbol Search */}
        <SymbolSearch value={form.symbol} onSelect={setSymbol} />

        {/* Direction */}
        <DirectionChips
          market={form.symbol?.market ?? null}
          value={form.direction}
          onChange={setDirection}
        />

        {/* Entry & Exit Price */}
        <div className="grid grid-cols-2 gap-4">
          <PriceInput
            label="Entry Price"
            value={form.entryPrice}
            onChange={(v) => setField('entryPrice', v)}
            precision={precision}
            mockPrice={form.symbol?.mockPrice}
            showMarketButton
          />
          <PriceInput
            label="Exit Price (optional)"
            value={form.exitPrice}
            onChange={(v) => setField('exitPrice', v)}
            precision={precision}
            placeholder="Open trade"
          />
        </div>

        {/* Position Size */}
        <PositionSizeInput
          sizeMode={form.sizeMode}
          onModeChange={setSizeMode}
          quantity={form.quantity}
          onQuantityChange={(v) => setField('quantity', v)}
          riskDollars={form.riskDollars}
          onRiskDollarsChange={(v) => setField('riskDollars', v)}
          feesPercent={form.feesPercent}
          onFeesPercentChange={(v) => setField('feesPercent', v)}
          symbolLabel={form.symbol?.symbol}
          effectiveQty={effectiveQty}
        />

        {/* Stop Loss & Take Profit */}
        <StopTakeProfit
          stopLoss={form.stopLoss}
          onStopLossChange={(v) => setField('stopLoss', v)}
          takeProfit={form.takeProfit}
          onTakeProfitChange={(v) => setField('takeProfit', v)}
          riskReward={preview.riskReward}
          onSetTpMultiple={setTpFromRMultiple}
          precision={precision}
        />

        {/* Divider */}
        <div className="border-t border-[var(--color-surface-border)]" />

        {/* Tags */}
        <TagSelector
          label="Strategy"
          options={STRATEGY_TAG_OPTIONS}
          selected={form.strategyTags}
          onToggle={(t) => toggleTag('strategyTags', t)}
        />
        <TagSelector
          label="Emotion"
          options={EMOTION_TAG_OPTIONS}
          selected={form.emotionTags}
          onToggle={(t) => toggleTag('emotionTags', t)}
        />
        <TagSelector
          label="Mistakes"
          options={MISTAKE_TAG_OPTIONS}
          selected={form.mistakeTags}
          onToggle={(t) => toggleTag('mistakeTags', t)}
        />

        {/* Divider */}
        <div className="border-t border-[var(--color-surface-border)]" />

        {/* Notes & Screenshot */}
        <NotesSection
          notes={form.notes}
          onNotesChange={(v) => setField('notes', v)}
          screenshotDataUrl={form.screenshotDataUrl}
          onScreenshotChange={(v) => setField('screenshotDataUrl', v)}
        />

        {/* Advanced */}
        <AdvancedSection
          commissionOverride={form.commissionOverride}
          onCommissionChange={(v) => setField('commissionOverride', v)}
          fundingFee={form.fundingFee}
          onFundingFeeChange={(v) => setField('fundingFee', v)}
          customField={form.customField}
          onCustomFieldChange={(v) => setField('customField', v)}
        />
      </div>

      {/* Fixed Bottom Save Button */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--color-surface-border)] bg-[var(--color-bg-primary)]/95 p-4 backdrop-blur-sm md:left-[var(--sidebar-width)]">
        <div className="mx-auto max-w-3xl">
          <button
            type="button"
            onClick={handleSave}
            disabled={!isValid}
            className={`flex w-full items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold uppercase tracking-wider transition-all duration-200 ${
              hasRuleViolation
                ? 'border-2 border-[var(--color-loss)] bg-[var(--color-loss-bg)] text-[var(--color-loss-light)] pulse-danger'
                : isValid
                  ? 'bg-[var(--color-profit)] text-white shadow-lg hover:shadow-xl'
                  : 'cursor-not-allowed bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)]'
            }`}
          >
            <Save className="h-4 w-4" />
            {hasRuleViolation
              ? 'Rule Violation — Review Before Saving'
              : isValid
                ? 'Save Trade'
                : 'Fill Required Fields'}
          </button>
        </div>
      </div>
    </div>
  );
}
