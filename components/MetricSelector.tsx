import React from 'react';
import { MetricType } from '../types';

interface MetricSelectorProps {
    selected: MetricType;
    onSelect: (m: MetricType) => void;
}

const buttons = [
    { id: MetricType.USD_COP, label: 'USD / COP' },
    { id: MetricType.OIL, label: 'Petróleo' },
    { id: MetricType.GOLD, label: 'Oro' },
    { id: MetricType.COL_BONDS, label: 'Bonos' },
];

export const MetricSelector: React.FC<MetricSelectorProps> = ({ selected, onSelect }) => {
    return (
        <div className="flex flex-wrap gap-2 bg-gray-800 p-1 rounded-xl w-fit">
            {buttons.map((btn) => (
                <button
                    key={btn.id}
                    onClick={() => onSelect(btn.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selected === btn.id
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                >
                    {btn.label}
                </button>
            ))}
        </div>
    );
};