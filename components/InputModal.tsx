import React, { useState } from 'react';
import { X } from 'lucide-react';

interface InputModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: string) => void;
}

export const InputModal: React.FC<InputModalProps> = ({ isOpen, onClose, onSave }) => {
    const [text, setText] = useState('');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-2xl shadow-2xl">
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-white">Cargar Datos CSV</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-4">
                    <p className="text-sm text-gray-400 mb-2">
                        Pega tu CSV con formato: <code>Fecha;Dólar-COP;Petroleo;Oro;Bonos Colombia</code>
                    </p>
                    <textarea
                        className="w-full h-64 bg-gray-900 border border-gray-700 rounded-lg p-3 text-xs font-mono text-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Pegar datos aquí..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    ></textarea>
                </div>
                <div className="p-4 border-t border-gray-700 flex justify-end gap-3">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-gray-300 hover:text-white"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={() => { onSave(text); onClose(); }}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-500"
                    >
                        Procesar Datos
                    </button>
                </div>
            </div>
        </div>
    );
};