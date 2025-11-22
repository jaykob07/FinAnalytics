import { FinancialDataPoint, MetricType, Anomaly } from '../types';

const parseNumber = (val: string): number => {
    if (!val) return 0;
    // Replace comma with dot, remove currency symbols or thousands separators if any (though this CSV is clean besides ,)
    const cleanVal = val.replace(/\./g, '').replace(',', '.');
    const num = parseFloat(cleanVal);
    return isNaN(num) ? 0 : num;
};

const parseDate = (dateStr: string): number => {
    // Format DD/MM/YYYY
    const parts = dateStr.split('/');
    if (parts.length !== 3) return 0;
    // Month is 0-indexed in JS Date
    const date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    return date.getTime();
};

export const parseCSV = (csvContent: string): FinancialDataPoint[] => {
    const lines = csvContent.trim().split('\n');
    const data: FinancialDataPoint[] = [];

    // Skip header
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const cols = line.split(';');
        if (cols.length < 5) continue;

        // Fecha;Dólar-COP;Petroleo;Oro;Bonos Colombia
        data.push({
            date: cols[0],
            timestamp: parseDate(cols[0]),
            usdCop: parseNumber(cols[1]),
            oil: parseNumber(cols[2]),
            gold: parseNumber(cols[3]),
            colBonds: parseNumber(cols[4])
        });
    }

    // Sort by date ascending
    return data.sort((a, b) => a.timestamp - b.timestamp);
};

export const detectAnomalies = (data: FinancialDataPoint[], metric: MetricType): Anomaly[] => {
    const anomalies: Anomaly[] = [];
    
    // Threshold for "Abrupt Drop" (e.g., more than 1.5% drop in a day)
    // This is configurable.
    const DROP_THRESHOLD = -1.5; 

    for (let i = 1; i < data.length; i++) {
        const current = data[i][metric];
        const previous = data[i-1][metric];
        
        if (previous === 0) continue;

        const changePercent = ((current - previous) / previous) * 100;

        if (changePercent < DROP_THRESHOLD) {
            let severity: 'low' | 'medium' | 'high' = 'low';
            if (changePercent < -3.0) severity = 'high';
            else if (changePercent < -2.0) severity = 'medium';

            anomalies.push({
                date: data[i].date,
                metric,
                value: current,
                previousValue: previous,
                changePercent,
                severity
            });
        }
    }
    
    // Return most recent anomalies first
    return anomalies.reverse();
};

export const getMetricLabel = (metric: MetricType): string => {
    switch(metric) {
        case MetricType.USD_COP: return 'Dólar (COP)';
        case MetricType.OIL: return 'Petróleo (Brent)';
        case MetricType.GOLD: return 'Oro';
        case MetricType.COL_BONDS: return 'Bonos Colombia';
        default: return '';
    }
};