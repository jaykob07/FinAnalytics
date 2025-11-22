export interface FinancialDataPoint {
    date: string; // DD/MM/YYYY original string
    timestamp: number; // For sorting/charting
    usdCop: number;
    oil: number;
    gold: number;
    colBonds: number;
}

export enum MetricType {
    USD_COP = 'usdCop',
    OIL = 'oil',
    GOLD = 'gold',
    COL_BONDS = 'colBonds',
}

export interface Anomaly {
    date: string;
    metric: MetricType;
    value: number;
    previousValue: number;
    changePercent: number;
    severity: 'low' | 'medium' | 'high';
}

export interface AiAnalysisResult {
    date: string;
    metric: string;
    analysis: string;
}