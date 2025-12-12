// ============================================================================
// DUMMY DATA FOR DEMO MODE
// ============================================================================

import {
    TradingStats,
    EquityCurvePoint,
    StrategyPerformance,
    SymbolPerformance,
} from "@/lib/types/dashboard";

export const DUMMY_STATS: TradingStats = {
    totalTrades: 142,
    openTrades: 3,
    closedTrades: 139,
    winningTrades: 95,
    losingTrades: 44,
    breakevenTrades: 3,
    winRate: 68.5,
    profitFactor: 2.4,
    avgRMultiple: 1.6,
    netPnL: 12450.50,
    totalPnL: 12800.00,
    totalFees: 349.50,
    avgWin: 450.20,
    avgLoss: -180.50,
    largestWin: 1200.00,
    largestLoss: -450.00,

    expectancy: 87.68,
    currentStreak: 3,
    streakType: "winning",
    bestStreak: 8,
    worstStreak: 4,
};

export const DUMMY_EQUITY_CURVE: EquityCurvePoint[] = [
    { date: "2024-01-01", pnl: 0, cumulativePnl: 10000, tradeCount: 0 },
    { date: "2024-01-05", pnl: 250, cumulativePnl: 10250, tradeCount: 5 },
    { date: "2024-01-08", pnl: -150, cumulativePnl: 10100, tradeCount: 8 },
    { date: "2024-01-12", pnl: 500, cumulativePnl: 10600, tradeCount: 15 },
    { date: "2024-01-15", pnl: -150, cumulativePnl: 10450, tradeCount: 18 },
    { date: "2024-01-19", pnl: 450, cumulativePnl: 10900, tradeCount: 22 },
    { date: "2024-01-22", pnl: 300, cumulativePnl: 11200, tradeCount: 26 },
    { date: "2024-01-26", pnl: -150, cumulativePnl: 11050, tradeCount: 30 },
    { date: "2024-01-29", pnl: 450, cumulativePnl: 11500, tradeCount: 35 },
    { date: "2024-02-02", pnl: 300, cumulativePnl: 11800, tradeCount: 40 },
    { date: "2024-02-05", pnl: -200, cumulativePnl: 11600, tradeCount: 45 },
    { date: "2024-02-09", pnl: 500, cumulativePnl: 12100, tradeCount: 52 },
    { date: "2024-02-12", pnl: 300, cumulativePnl: 12400, tradeCount: 58 },
    { date: "2024-02-16", pnl: -150, cumulativePnl: 12250, tradeCount: 65 },
    { date: "2024-02-19", pnl: 450, cumulativePnl: 12700, tradeCount: 72 },
    { date: "2024-02-23", pnl: 400, cumulativePnl: 13100, tradeCount: 78 },
    { date: "2024-02-26", pnl: -200, cumulativePnl: 12900, tradeCount: 85 },
    { date: "2024-03-01", pnl: 500, cumulativePnl: 13400, tradeCount: 92 },
    { date: "2024-03-05", pnl: 400, cumulativePnl: 13800, tradeCount: 100 },
    { date: "2024-03-08", pnl: 400, cumulativePnl: 14200, tradeCount: 108 },
    { date: "2024-03-12", pnl: -250, cumulativePnl: 13950, tradeCount: 115 },
    { date: "2024-03-15", pnl: 550, cumulativePnl: 14500, tradeCount: 122 },
    { date: "2024-03-19", pnl: 300, cumulativePnl: 14800, tradeCount: 130 },
    { date: "2024-03-22", pnl: 400, cumulativePnl: 15200, tradeCount: 136 },
    { date: "2024-03-26", pnl: -200, cumulativePnl: 15000, tradeCount: 140 },
    { date: "2024-03-29", pnl: 600, cumulativePnl: 15600, tradeCount: 142 },
];

export const DUMMY_STRATEGIES: StrategyPerformance[] = [
    { id: "1", name: "Breakout", totalPnL: 5400, winRate: 65, trades: 45, profitFactor: 2.1, avgRMultiple: 1.8 },
    { id: "2", name: "Pullback", totalPnL: 3200, winRate: 72, trades: 38, profitFactor: 2.8, avgRMultiple: 1.5 },
    { id: "3", name: "Reversal", totalPnL: 1800, winRate: 55, trades: 32, profitFactor: 1.5, avgRMultiple: 2.2 },
    { id: "4", name: "Scalping", totalPnL: 2050.50, winRate: 82, trades: 27, profitFactor: 1.9, avgRMultiple: 0.8 },
];

export const DUMMY_SYMBOLS: SymbolPerformance[] = [
    { symbol: "EURUSD", totalPnL: 4200.50, trades: 52, winRate: 68, avgRMultiple: 1.9 },
    { symbol: "GBPUSD", totalPnL: 3100.25, trades: 38, winRate: 62, avgRMultiple: 1.7 },
    { symbol: "XAUUSD", totalPnL: 2800.00, trades: 24, winRate: 58, avgRMultiple: 2.1 },
    { symbol: "US30", totalPnL: 1450.75, trades: 16, winRate: 50, avgRMultiple: 1.5 },
    { symbol: "BTCUSD", totalPnL: 899.00, trades: 12, winRate: 45, avgRMultiple: 2.5 },
];
