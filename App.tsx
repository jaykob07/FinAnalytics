import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { MetricSelector } from './components/MetricSelector';
import { ChartContainer } from './components/ChartContainer';
import { AnomalyCard } from './components/AnomalyCard';
import { InputModal } from './components/InputModal';
import { YearSelector } from './components/YearSelector';
import { MetricType, FinancialDataPoint } from './types';
import { INITIAL_CSV_DATA } from './constants';
import { parseCSV, detectAnomalies, getMetricLabel } from './utils/dataParser';
import { UploadCloud, TrendingDown } from 'lucide-react';



function App() {
    const [rawData, setRawData] = useState<string>(INITIAL_CSV_DATA);
    const [data, setData] = useState<FinancialDataPoint[]>([]);
    const [selectedMetric, setSelectedMetric] = useState<MetricType>(MetricType.USD_COP);
    const [selectedYear, setSelectedYear] = useState<number | 'ALL'>('ALL');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Parse data on mount or when rawData changes
    useEffect(() => {
        const parsed = parseCSV(rawData);
        setData(parsed);
    }, [rawData]);

    // Extract unique years from data
    const years = useMemo(() => {
        const uniqueYears = new Set(data.map(d => new Date(d.timestamp).getFullYear()));
        return Array.from(uniqueYears).sort((a: number, b: number) => b - a);
    }, [data]);

    // Filter data based on selected year
    const filteredData = useMemo(() => {
        if (selectedYear === 'ALL') return data;
        return data.filter(d => new Date(d.timestamp).getFullYear() === selectedYear);
    }, [data, selectedYear]);

    // Detect anomalies when filtered data or metric changes
    const anomalies = useMemo(() => {
        return detectAnomalies(filteredData, selectedMetric);
    }, [filteredData, selectedMetric]);

    // Calculate quick stats
    const currentStat = useMemo(() => {
        if (filteredData.length === 0) return { val: 0, diff: 0 };
        // If filtered by year, "current" is the last entry of that year (or current dataset)
        const last = filteredData[filteredData.length - 1];
        const prev = filteredData[filteredData.length - 2];
        const val = last[selectedMetric];
        const prevVal = prev ? prev[selectedMetric] : val; // Fallback if only 1 point
        const diff = prevVal !== 0 ? ((val - prevVal) / prevVal) * 100 : 0;
        return { val, diff };
    }, [filteredData, selectedMetric]);

    return (
        <div className="min-h-screen bg-gray-900 pb-20">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                
                {/* Controls Section */}
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-8">
                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                         <MetricSelector selected={selectedMetric} onSelect={setSelectedMetric} />
                         <YearSelector years={years} selectedYear={selectedYear} onSelect={setSelectedYear} />
                    </div>
                    
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-800 whitespace-nowrap"
                    >
                        <UploadCloud className="w-4 h-4" />
                        Cargar Nuevos Datos
                    </button>
                </div>

                {/* Main Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Charts & Stats */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Summary Card */}
                        <div className="grid grid-cols-2 gap-4">
                             <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                                <p className="text-gray-400 text-sm">
                                    {selectedYear === 'ALL' ? 'Último Valor' : `Cierre ${selectedYear}`} ({getMetricLabel(selectedMetric)})
                                </p>
                                <div className="mt-2 flex items-end gap-3">
                                    <h3 className="text-3xl font-bold text-white">
                                        {currentStat.val.toLocaleString('es-CO')}
                                    </h3>
                                    <span className={`text-sm font-medium mb-1 ${currentStat.diff >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {currentStat.diff > 0 ? '+' : ''}{currentStat.diff.toFixed(2)}%
                                    </span>
                                </div>
                             </div>
                             <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex items-center justify-between">
                                <div>
                                     <p className="text-gray-400 text-sm">Registros {selectedYear === 'ALL' ? 'Totales' : selectedYear}</p>
                                     <h3 className="text-3xl font-bold text-white mt-2">{filteredData.length}</h3>
                                </div>
                                <div className="h-10 w-1 bg-gray-700 rounded-full"></div>
                                <div>
                                     <p className="text-gray-400 text-sm">Caídas Detectadas</p>
                                     <h3 className="text-3xl font-bold text-red-400 mt-2">{anomalies.length}</h3>
                                </div>
                             </div>
                        </div>

                        {/* Main Chart */}
                        <ChartContainer data={filteredData} metric={selectedMetric} />
                    </div>

                    {/* Right Column: Anomalies & AI Analysis */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-800 rounded-xl border border-gray-700 h-full max-h-[600px] flex flex-col">
                            <div className="p-6 border-b border-gray-700">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <TrendingDown className="w-5 h-5 text-red-400" />
                                    Caídas Abruptas {selectedYear !== 'ALL' && `(${selectedYear})`}
                                </h3>
                                <p className="text-sm text-gray-400 mt-1">
                                    Detectando variaciones negativas mayores al 1.5% diario.
                                </p>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                                {anomalies.length === 0 ? (
                                    <div className="text-center py-10 text-gray-500">
                                        <p>No se detectaron caídas significativas en este periodo para este indicador.</p>
                                    </div>
                                ) : (
                                    anomalies.map((anomaly, idx) => (
                                        <AnomalyCard key={`${anomaly.date}-${idx}`} anomaly={anomaly} />
                                    ))
                                )}
                            </div>
                            <div className="p-4 bg-gray-900/50 border-t border-gray-700 text-xs text-center text-gray-500">
                                Los análisis son generados por IA y pueden contener imprecisiones históricas.
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <InputModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={setRawData} 
            />
        </div>
    );
}

export default App;