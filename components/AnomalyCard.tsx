import React, { useState } from 'react';
import { Anomaly } from '../types';
import { analyzeAnomaly } from '../services/geminiService';
import { AlertTriangle, BrainCircuit, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

interface AnomalyCardProps {
    anomaly: Anomaly;
}

export const AnomalyCard: React.FC<AnomalyCardProps> = ({ anomaly }) => {
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleAnalyze = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (analysis) {
            setIsOpen(!isOpen);
            return;
        }
        setIsOpen(true);
        setLoading(true);
        const result = await analyzeAnomaly(anomaly);
        setAnalysis(result);
        setLoading(false);
    };

    const toggleOpen = () => setIsOpen(!isOpen);

    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden hover:border-gray-600 transition-colors">
            <div 
                className="p-4 cursor-pointer flex items-center justify-between"
                onClick={toggleOpen}
            >
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full bg-red-500/10 text-red-500`}>
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-white font-medium">{anomaly.date}</p>
                        <p className="text-sm text-red-400 font-mono font-bold">
                            {anomaly.changePercent.toFixed(2)}% 
                            <span className="text-gray-500 font-normal ml-2 text-xs">
                                ({anomaly.previousValue.toLocaleString()} → {anomaly.value.toLocaleString()})
                            </span>
                        </p>
                    </div>
                </div>

                <button 
                    onClick={handleAnalyze}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        analysis 
                            ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' 
                            : 'bg-blue-600 text-white hover:bg-blue-500'
                    }`}
                    disabled={loading}
                >
                    {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <BrainCircuit className="w-3 h-3" />}
                    {analysis ? 'Ver Análisis' : 'Analizar Causa'}
                </button>
            </div>

            {isOpen && (
                <div className="px-4 pb-4 pt-0 bg-gray-800/30 border-t border-gray-700/50">
                     <div className="mt-4 text-sm text-gray-300 leading-relaxed animate-fadeIn">
                        {loading ? (
                             <div className="flex items-center gap-2 text-blue-400">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Consultando inteligencia histórica...
                             </div>
                        ) : analysis ? (
                            <div className="prose prose-invert max-w-none">
                                <p className="italic border-l-2 border-blue-500 pl-3 text-gray-400">
                                    {analysis}
                                </p>
                            </div>
                        ) : null}
                     </div>
                </div>
            )}
        </div>
    );
};