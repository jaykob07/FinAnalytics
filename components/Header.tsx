import React from 'react';
import { TrendingDown, Activity } from 'lucide-react';

export const Header: React.FC = () => {
    return (
        <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <Activity className="text-white h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">FinAnalytics Colombia</h1>
                        <p className="text-xs text-gray-400">Análisis de volatilidad y patrones</p>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-4 text-sm text-gray-400">
                    <span>Potenciado por <strong className="text-blue-400">Grupo Analisis Precio del Dolar con Respecto al Peso</strong></span>
                </div>
            </div>
        </header>
    );
};