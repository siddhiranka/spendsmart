import React, { useState, useEffect, useContext } from 'react';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, CheckCircle, TrendingUp, AlertTriangle } from 'lucide-react';
import { CurrencyContext } from '../context/CurrencyContext';
import api from '../services/api';

const Goals = () => {
    const { currency } = useContext(CurrencyContext);
    const [goals, setGoals] = useState([]);
    
    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const res = await api.get('/goals');
                if (res.data?.data) {
                    setGoals(res.data.data.map(g => ({
                        id: g.id || g._id,
                        title: g.goal_name,
                        target: g.target_amount,
                        current: g.saved_amount || 0,
                        deadline: new Date(g.target_date).toISOString().split('T')[0]
                    })));
                }
            } catch (err) {
                console.error('Failed to fetch goals', err);
            }
        };
        fetchGoals();
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ title: '', target: '', current: '', deadline: '' });

    const handleAddGoal = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/goals', {
                goal_name: formData.title,
                target_amount: parseFloat(formData.target),
                target_date: formData.deadline
            });
            const newGoal = {
                id: res.data.data.id,
                title: formData.title,
                target: parseFloat(formData.target),
                current: parseFloat(formData.current) || 0,
                deadline: formData.deadline
            };
            setGoals([...goals, newGoal]);
            setIsModalOpen(false);
            setFormData({ title: '', target: '', current: '', deadline: '' });
        } catch (error) {
            console.error('Failed to add goal', error);
        }
    };

    return (
        <Layout title="Financial Goals">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-[var(--text-color)]">Your Goals</h2>
                        <p className="text-[var(--text-muted)]">Track and achieve your milestones</p>
                    </div>
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/30 transition-all"
                    >
                        <Plus size={20} />
                        Create Goal
                    </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {goals.map((goal, idx) => {
                        const progress = (goal.current / goal.target) * 100;
                        return (
                            <motion.div 
                                key={goal.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-[var(--surface-color)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl dark:bg-indigo-900/30 dark:text-indigo-400">
                                            <Target size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-[var(--text-color)]">{goal.title}</h3>
                                            <p className="text-sm text-[var(--text-muted)]">Target: {goal.deadline}</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-sm font-semibold">
                                        {progress.toFixed(1)}%
                                    </span>
                                </div>
                                
                                <div className="mb-2 flex justify-between text-sm font-medium text-[var(--text-color)]">
                                    <span>{currency.symbol}{goal.current.toLocaleString()} saved</span>
                                    <span>{currency.symbol}{goal.target.toLocaleString()}</span>
                                </div>
                                <div className="w-full bg-[var(--bg-color)] rounded-full h-3 mb-4 overflow-hidden border border-[var(--border-color)]">
                                    <div 
                                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-1000" 
                                        style={{ width: `${Math.min(progress, 100)}%` }}
                                    ></div>
                                </div>

                                <div className="flex justify-between items-center text-sm text-[var(--text-muted)]">
                                    <div className="flex items-center gap-1">
                                        <TrendingUp size={16} className="text-green-500" />
                                        <span>On track</span>
                                    </div>
                                    <button className="text-indigo-600 dark:text-indigo-400 hover:underline">Add Funds</button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {goals.length === 0 && (
                    <div className="p-12 text-center text-[var(--text-muted)] bg-[var(--surface-color)] rounded-2xl border border-[var(--border-color)]">
                        <Target size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No goals set yet. Start dreaming big and add a goal!</p>
                    </div>
                )}
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
                                <h3 className="text-xl font-bold text-[var(--text-color)]">Create New Goal</h3>
                            </div>
                            <form onSubmit={handleAddGoal} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-color)] mb-1">Goal Title</label>
                                    <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-[var(--text-color)]" placeholder="e.g. Vacation to Japan" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-color)] mb-1">Target Amount ({currency.symbol})</label>
                                        <input required type="number" step="0.01" value={formData.target} onChange={e => setFormData({...formData, target: e.target.value})} className="w-full px-4 py-2 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-[var(--text-color)]" placeholder="5000" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-color)] mb-1">Current Saved ({currency.symbol})</label>
                                        <input type="number" step="0.01" value={formData.current} onChange={e => setFormData({...formData, current: e.target.value})} className="w-full px-4 py-2 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-[var(--text-color)]" placeholder="0" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-color)] mb-1">Target Date</label>
                                    <input required type="date" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} className="w-full px-4 py-2 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-[var(--text-color)]" />
                                </div>
                                <div className="pt-4 flex gap-3">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 bg-[var(--bg-color)] border border-[var(--border-color)] text-[var(--text-color)] rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                        Cancel
                                    </button>
                                    <button type="submit" className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
                                        Create Goal
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

export default Goals;
