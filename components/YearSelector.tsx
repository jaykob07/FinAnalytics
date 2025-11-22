import React from 'react';

interface YearSelectorProps {
    years: number[];
    selectedYear: number | 'ALL';
    onSelect: (year: number | 'ALL') => void;
}

export const YearSelector: React.FC<YearSelectorProps> = ({ years, selectedYear, onSelect }) => {
    return (
        <div className="flex flex-wrap gap-2 bg-gray-800 p-1 rounded-xl w-fit items-center">
            <span className="text-xs text-gray-500 px-2 font-medium uppercase tracking-wider">Año:</span>
            <button
                onClick={() => onSelect('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    selectedYear === 'ALL'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
            >
                Todos
            </button>
            {years.map((year) => (
                <button
                    key={year}
                    onClick={() => onSelect(year)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                        selectedYear === year
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                >
                    {year}
                </button>
            ))}
        </div>
    );
};
