import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { CurrencyContext } from '../context/CurrencyContext';
import api from '../services/api';

const QuickAddModal = ({ isOpen, onClose }) => {
    const { currency } = useContext(CurrencyContext);
    const [formData, setFormData] = useState({ title: '', amount: '', category: 'General', type: 'expense' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = formData.type === 'expense' ? '/expenses' : '/income';
        const payload = formData.type === 'expense' ? {
            title: formData.title,
            amount: parseFloat(formData.amount),
            category: formData.category,
            date: new Date().toISOString().split('T')[0],
            payment_method: 'Cash'
        } : {
            source: formData.title,
            amount: parseFloat(formData.amount),
            date: new Date().toISOString().split('T')[0],
            notes: formData.category
        };

        try {
            await api.post(endpoint, payload);
            onClose();
            setFormData({ title: '', amount: '', category: 'General', type: 'expense' });
            window.dispatchEvent(new Event('dashboard_update'));
        } catch (error) {
            console.error('Failed to quick add', error);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
                    />
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed bottom-0 left-0 right-0 bg-[var(--surface-color)] rounded-t-3xl z-50 p-6 shadow-2xl border-t border-[var(--border-color)] lg:hidden"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-[var(--text-color)]">Quick Add</h3>
                            <button onClick={onClose} className="p-2 bg-[var(--bg-color)] rounded-full text-[var(--text-muted)] hover:text-[var(--text-color)]">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex gap-4 p-1 bg-[var(--bg-color)] rounded-xl">
                                <button type="button" onClick={() => setFormData({...formData, type: 'expense'})} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${formData.type === 'expense' ? 'bg-white shadow-sm text-red-600 dark:bg-gray-800' : 'text-[var(--text-muted)]'}`}>Expense</button>
                                <button type="button" onClick={() => setFormData({...formData, type: 'income'})} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${formData.type === 'income' ? 'bg-white shadow-sm text-green-600 dark:bg-gray-800' : 'text-[var(--text-muted)]'}`}>Income</button>
                            </div>

                            <div>
                                <input required type="text" placeholder="Title (e.g. Coffee)" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-[var(--text-color)]" />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">{currency.symbol}</span>
                                    <input required type="number" step="0.01" placeholder="0.00" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full pl-8 pr-4 py-3 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-[var(--text-color)] font-bold" />
                                </div>
                                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-[var(--text-color)]">
                                    <option value="General">General</option>
                                    <option value="Food">Food</option>
                                    <option value="Transport">Transport</option>
                                    <option value="Shopping">Shopping</option>
                                </select>
                            </div>

                            <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-transform active:scale-95 pb-safe">
                                Save {formData.type === 'expense' ? 'Expense' : 'Income'}
                            </button>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default QuickAddModal;
