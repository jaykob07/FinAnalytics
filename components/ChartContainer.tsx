import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    TooltipProps
} from 'recharts';
import { FinancialDataPoint, MetricType } from '../types';
import { getMetricLabel } from '../utils/dataParser';

interface ChartContainerProps {
    data: FinancialDataPoint[];
    metric: MetricType;
}

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-800 border border-gray-700 p-3 rounded-lg shadow-xl">
                <p className="text-gray-400 text-xs mb-1">{label}</p>
                <p className="text-white font-bold text-lg">
                    {payload[0].value?.toLocaleString('es-CO')}
                    <span className="text-xs font-normal text-gray-500 ml-1">pts</span>
                </p>
            </div>
        );
    }
    return null;
};

export const ChartContainer: React.FC<ChartContainerProps> = ({ data, metric }) => {
    return (
        <div className="h-[400px] w-full bg-gray-800 rounded-xl border border-gray-700 p-4 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-100">{getMetricLabel(metric)} - Tendencia Histórica</h2>
            </div>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                    <XAxis 
                        dataKey="date" 
                        stroke="#9ca3af" 
                        tick={{fontSize: 12}}
                        tickMargin={10}
                        minTickGap={30}
                    />
                    <YAxis 
                        stroke="#9ca3af"
                        tick={{fontSize: 12}}
                        domain={['auto', 'auto']}
                        tickFormatter={(val) => val.toLocaleString('es-CO', { notation: "compact" })}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                        type="monotone" 
                        dataKey={metric} 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};