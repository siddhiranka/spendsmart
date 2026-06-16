import React, { useState, useEffect, useContext } from 'react';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Trash2, Edit2, Calendar, Tag, CreditCard } from 'lucide-react';
import api from '../services/api';
import { CurrencyContext } from '../context/CurrencyContext';
import { useSearchParams } from 'react-router-dom';

const Expenses = () => {
    const { currency } = useContext(CurrencyContext);
    const [searchParams, setSearchParams] = useSearchParams();
    const [expenses, setExpenses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ title: '', amount: '', category: '', payment_method: '', date: '', notes: '' });
    
    // Search and Filter State
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [filterCategory, setFilterCategory] = useState('All');
    // Fetch data
    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const res = await api.get('/expenses');
                if (res.data?.data) {
                    setExpenses(res.data.data);
                }
            } catch (err) {
                console.error('Failed to fetch expenses', err);
            }
        };
        fetchExpenses();
    }, []);

    const handleAddExpense = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/expenses', formData);
            const newExpense = { ...formData, id: res.data.data.id, amount: parseFloat(formData.amount) };
            setExpenses([newExpense, ...expenses]);
            setIsModalOpen(false);
            setFormData({ title: '', amount: '', category: '', payment_method: '', date: '', notes: '' });
        } catch (error) {
            console.error('Failed to add expense', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/expenses/${id}`);
            setExpenses(expenses.filter(exp => exp.id !== id));
        } catch (error) {
            console.error('Failed to delete expense', error);
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

    const filteredExpenses = expenses.filter(exp => {
        const matchesSearch = exp.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              exp.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'All' || exp.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const uniqueCategories = ['All', ...new Set(expenses.map(exp => exp.category))];

    return (
        <Layout title="Expense Management">
            <div className="space-y-6">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex gap-4 w-full sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search expenses..." 
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="w-full pl-10 pr-4 py-2.5 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                            <select 
                                value={filterCategory}
                                onChange={e => setFilterCategory(e.target.value)}
                                className="pl-10 pr-8 py-2.5 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl text-[var(--text-color)] appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-full sm:w-auto"
                            >
                                {uniqueCategories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsModalOpen(true)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/30 transition-all"
                    >
                        <Plus size={20} />
                        Add Expense
                    </motion.button>
                </div>

                {/* Expenses Table */}
                <div className="bg-[var(--surface-color)] rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead>
                                <tr className="bg-[var(--bg-color)] border-b border-[var(--border-color)] text-[var(--text-muted)] text-sm font-semibold uppercase tracking-wider">
                                    <th className="p-4 pl-6">Expense Title</th>
                                    <th className="p-4">Category</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Payment</th>
                                    <th className="p-4 text-right pr-6">Amount</th>
                                    <th className="p-4 w-16"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                {filteredExpenses.map((expense) => (
                                    <motion.tr 
                                        key={expense.id} 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--bg-color)] transition-colors"
                                    >
                                        <td className="p-4 pl-6 font-medium text-[var(--text-color)]">{expense.title}</td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                                <Tag size={12} /> {expense.category}
                                            </span>
                                        </td>
                                        <td className="p-4 text-[var(--text-muted)] flex items-center gap-2">
                                            <Calendar size={16} /> {expense.date}
                                        </td>
                                        <td className="p-4 text-[var(--text-muted)]">
                                            <div className="flex items-center gap-2">
                                                <CreditCard size={16} /> {expense.payment_method}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right pr-6 font-bold text-[var(--text-color)]">
                                            {currency.symbol}{parseFloat(expense.amount).toFixed(2)}
                                        </td>
                                        <td className="p-4 pr-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(expense.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                        {filteredExpenses.length === 0 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-12 text-center text-[var(--text-muted)]">
                                <Search size={48} className="mx-auto mb-4 opacity-20" />
                                <p className="text-lg font-medium">No expenses found</p>
                                <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Expense Modal */}
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
                                <h3 className="text-xl font-bold text-[var(--text-color)]">Add New Expense</h3>
                            </div>
                            <form onSubmit={handleAddExpense} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-color)] mb-1">Title</label>
                                    <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Groceries" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-color)] mb-1">Amount</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{currency.symbol}</span>
                                            <input required type="number" step="0.01" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full pl-8 pr-3 py-2 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0.00" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-color)] mb-1">Date</label>
                                        <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-2 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-color)] mb-1">Category</label>
                                        <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-[var(--text-color)]">
                                            <option value="">Select...</option>
                                            <option value="Food">Food</option>
                                            <option value="Shopping">Shopping</option>
                                            <option value="Bills">Bills</option>
                                            <option value="Entertainment">Entertainment</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-color)] mb-1">Payment Method</label>
                                        <select required value={formData.payment_method} onChange={e => setFormData({...formData, payment_method: e.target.value})} className="w-full px-4 py-2 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-[var(--text-color)]">
                                            <option value="">Select...</option>
                                            <option value="Credit Card">Credit Card</option>
                                            <option value="Debit Card">Debit Card</option>
                                            <option value="Cash">Cash</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="pt-4 flex gap-3">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 bg-[var(--bg-color)] border border-[var(--border-color)] text-[var(--text-color)] rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                        Cancel
                                    </button>
                                    <button type="submit" className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
                                        Save Expense
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

// Quick fix for missing Receipt icon
import { Receipt } from 'lucide-react';

export default Expenses;
