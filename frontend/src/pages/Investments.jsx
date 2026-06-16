import React, { useState, useContext } from 'react';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Plus, Activity, Briefcase, PieChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { CurrencyContext } from '../context/CurrencyContext';

const data = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4500 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 6500 },
  { name: 'Jul', value: 8000 },
];

const Investments = () => {
    const { currency } = useContext(CurrencyContext);
    const [assets, setAssets] = useState(() => {
        const saved = localStorage.getItem('mock_investments');
        if (saved) return JSON.parse(saved);
        return [];
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', symbol: '', amount: '', return_rate: '', type: '' });

    const handleAddAsset = (e) => {
        e.preventDefault();
        const newAsset = {
            id: Date.now(),
            name: formData.name,
            symbol: formData.symbol,
            amount: parseFloat(formData.amount),
            return_rate: parseFloat(formData.return_rate),
            type: formData.type
        };
        const updatedAssets = [...assets, newAsset];
        setAssets(updatedAssets);
        localStorage.setItem('mock_investments', JSON.stringify(updatedAssets));
        setIsModalOpen(false);
        setFormData({ name: '', symbol: '', amount: '', return_rate: '', type: '' });
    };

    const totalPortfolioValue = assets.reduce((sum, asset) => sum + asset.amount, 0);

    return (
        <Layout title="Investment Portfolio">
            <div className="space-y-6">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-500/20 text-indigo-500 rounded-xl">
                            <PieChart size={32} />
                        </div>
                        <div>
                            <p className="text-[var(--text-muted)] text-sm">Total Portfolio Value</p>
                            <h2 className="text-3xl font-bold text-[var(--text-color)]">{currency.symbol}{totalPortfolioValue.toLocaleString()}</h2>
                        </div>
                    </div>
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsModalOpen(true)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/30 transition-all"
                    >
                        <Plus size={20} />
                        Add Asset
                    </motion.button>
                </div>

                {/* Chart Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[var(--surface-color)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-[var(--text-color)] flex items-center gap-2">
                            <Activity className="text-indigo-500" />
                            Performance Overview
                        </h3>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                                <XAxis dataKey="name" stroke="var(--text-muted)" tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--text-muted)" tickLine={false} axisLine={false} />
                                <RechartsTooltip 
                                    contentStyle={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)', color: 'var(--text-color)' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Assets List */}
                <div className="bg-[var(--surface-color)] rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center">
                        <h3 className="text-lg font-bold text-[var(--text-color)] flex items-center gap-2">
                            <Briefcase className="text-blue-500" />
                            Your Assets
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead>
                                <tr className="bg-[var(--bg-color)] border-b border-[var(--border-color)] text-[var(--text-muted)] text-sm font-semibold uppercase tracking-wider">
                                    <th className="p-4 pl-6">Asset Name</th>
                                    <th className="p-4">Type</th>
                                    <th className="p-4 text-right">Return Rate</th>
                                    <th className="p-4 text-right pr-6">Total Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assets.map((asset) => (
                                    <tr key={asset.id} className="border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--bg-color)] transition-colors">
                                        <td className="p-4 pl-6">
                                            <div className="font-bold text-[var(--text-color)]">{asset.name}</div>
                                            <div className="text-sm text-[var(--text-muted)]">{asset.symbol}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[var(--bg-color)] border border-[var(--border-color)] text-[var(--text-color)]">
                                                {asset.type}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className={`flex items-center justify-end gap-1 font-medium ${asset.return_rate >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                {asset.return_rate >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                                {Math.abs(asset.return_rate)}%
                                            </div>
                                        </td>
                                        <td className="p-4 text-right pr-6 font-bold text-[var(--text-color)]">
                                            {currency.symbol}{asset.amount.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add Asset Modal */}
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
                                <h3 className="text-xl font-bold text-[var(--text-color)]">Add New Asset</h3>
                            </div>
                            <form onSubmit={handleAddAsset} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-color)] mb-1">Asset Name</label>
                                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-[var(--text-color)]" placeholder="e.g. S&P 500 ETF" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-color)] mb-1">Symbol/Ticker</label>
                                        <input required type="text" value={formData.symbol} onChange={e => setFormData({...formData, symbol: e.target.value})} className="w-full px-4 py-2 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-[var(--text-color)]" placeholder="e.g. VOO" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-color)] mb-1">Asset Type</label>
                                        <select required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-2 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-[var(--text-color)]">
                                            <option value="">Select...</option>
                                            <option value="Stocks">Stocks / ETFs</option>
                                            <option value="Crypto">Cryptocurrency</option>
                                            <option value="Bonds">Bonds</option>
                                            <option value="Cash">Cash / Savings</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-color)] mb-1">Amount ({currency.symbol})</label>
                                        <input required type="number" step="0.01" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full px-4 py-2 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-[var(--text-color)]" placeholder="1000" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-color)] mb-1">Est. Return Rate (%)</label>
                                        <input required type="number" step="0.01" value={formData.return_rate} onChange={e => setFormData({...formData, return_rate: e.target.value})} className="w-full px-4 py-2 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-[var(--text-color)]" placeholder="8.5" />
                                    </div>
                                </div>
                                <div className="pt-4 flex gap-3">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 bg-[var(--bg-color)] border border-[var(--border-color)] text-[var(--text-color)] rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                        Cancel
                                    </button>
                                    <button type="submit" className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30">
                                        Add Asset
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

export default Investments;
