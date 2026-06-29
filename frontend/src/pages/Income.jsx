import React, { useState, useEffect, useContext } from 'react';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Trash2, Edit2, Calendar, Tag, Wallet } from 'lucide-react';
import { CurrencyContext } from '../context/CurrencyContext';
import api from '../services/api';
import { useSearchParams } from 'react-router-dom';

const Income = () => {
    const { currency } = useContext(CurrencyContext);
    const [searchParams, setSearchParams] = useSearchParams();
    const [income, setIncome] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ source: '', amount: '', date: '', notes: '' });

    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

    useEffect(() => {
        const fetchIncome = async () => {
            try {
                const res = await api.get('/income');
                if (res.data?.data) {
                    setIncome(res.data.data);
                }
            } catch (err) {
                console.error('Failed to fetch income', err);
            }
        };
        fetchIncome();
    }, []);

    const handleAddIncome = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/income/${editingId}`, formData);
                const updatedIncome = { ...formData, id: editingId, amount: parseFloat(formData.amount) };
                setIncome(income.map(inc => inc.id === editingId ? updatedIncome : inc));
            } else {
                const res = await api.post('/income', formData);
                const newIncome = { ...formData, id: res.data.data.id, amount: parseFloat(formData.amount) };
                setIncome([newIncome, ...income]);
            }
            setIsModalOpen(false);
            setEditingId(null);
            setFormData({ source: '', amount: '', date: '', notes: '' });
        } catch (error) {
            console.error('Failed to save income', error);
        }
    };

    const handleEditClick = (inc) => {
        let formattedDate = inc.date;
        if (formattedDate && formattedDate.includes('T')) {
            formattedDate = formattedDate.split('T')[0];
        }
        setFormData({
            source: inc.source,
            amount: inc.amount,
            date: formattedDate,
            notes: inc.notes || ''
        });
        setEditingId(inc.id);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/income/${id}`);
            setIncome(income.filter(inc => inc.id !== id));
        } catch (error) {
            console.error('Failed to delete income', error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        if (e.target.value) {
            setSearchParams({ search: e.target.value });
        } else {
            setSearchParams({});
        }
    };

    const filteredIncome = income.filter(inc => {
        return inc.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
               (inc.notes || '').toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <Layout title="Income Management">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex gap-4 w-full sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search income..." 
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="w-full pl-10 pr-4 py-2.5 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                            />
                        </div>
                    </div>
                    
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            setEditingId(null);
                            setFormData({ source: '', amount: '', date: '', notes: '' });
                            setIsModalOpen(true);
                        }}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl shadow-lg shadow-green-500/30 transition-all"
                    >
                        <Plus size={20} />
                        Add Income
                    </motion.button>
                </div>

                <div className="bg-[var(--surface-color)] rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead>
                                <tr className="bg-[var(--bg-color)] border-b border-[var(--border-color)] text-[var(--text-muted)] text-sm font-semibold uppercase tracking-wider">
                                    <th className="p-4 pl-6">Source</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Notes</th>
                                    <th className="p-4 text-right pr-6">Amount</th>
                                    <th className="p-4 w-16"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                {filteredIncome.map((inc) => (
                                    <motion.tr 
                                        key={inc.id} 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--bg-color)] transition-colors"
                                    >
                                        <td className="p-4 pl-6 font-medium text-[var(--text-color)]">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-green-100 text-green-600 rounded-lg dark:bg-green-900/30 dark:text-green-400">
                                                    <Wallet size={16} />
                                                </div>
                                                {inc.source}
                                            </div>
                                        </td>
                                        <td className="p-4 text-[var(--text-muted)] flex items-center gap-2 mt-2">
                                            <Calendar size={16} /> {inc.date}
                                        </td>
                                        <td className="p-4 text-[var(--text-muted)]">{inc.notes || '-'}</td>
                                        <td className="p-4 text-right pr-6 font-bold text-[var(--text-color)] text-green-600 dark:text-green-400">
                                            +{currency.symbol}{parseFloat(inc.amount).toFixed(2)}
                                        </td>
                                        <td className="p-4 pr-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleEditClick(inc)} className="p-2 text-gray-400 hover:text-green-600 transition-colors rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(inc.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                        {filteredIncome.length === 0 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-12 text-center text-[var(--text-muted)]">
                                <Search size={48} className="mx-auto mb-4 opacity-20" />
                                <p className="text-lg font-medium">No income found</p>
                                <p className="text-sm mt-1">Try adjusting your search.</p>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[var(--surface-color)] rounded-2xl border border-[var(--border-color)] shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            <div className="p-6 border-b border-[var(--border-color)]">
                                <h3 className="text-xl font-bold text-[var(--text-color)]">{editingId ? 'Edit Income' : 'Add New Income'}</h3>
                            </div>
                            <form onSubmit={handleAddIncome} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-color)] mb-1">Source</label>
                                    <input required type="text" value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})} className="w-full px-4 py-2 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g. Salary, Freelance" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-color)] mb-1">Amount</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{currency.symbol}</span>
                                            <input required type="number" step="0.01" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full pl-8 pr-3 py-2 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="0.00" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-color)] mb-1">Date</label>
                                        <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-2 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-color)] mb-1">Notes</label>
                                    <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full px-4 py-2 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-[var(--text-color)]"></textarea>
                                </div>
                                <div className="pt-4 flex gap-3">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 bg-[var(--bg-color)] border border-[var(--border-color)] text-[var(--text-color)] rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                        Cancel
                                    </button>
                                    <button type="submit" className="flex-1 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors shadow-lg shadow-green-500/30">
                                        {editingId ? 'Update Income' : 'Save Income'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </Layout>
    );
};

export default Income;
