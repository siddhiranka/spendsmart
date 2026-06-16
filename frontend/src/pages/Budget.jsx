import React, { useState, useContext } from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { AlertTriangle, Calculator } from 'lucide-react';
import { CurrencyContext } from '../context/CurrencyContext';

const COLORS = ['#ef4444', '#f59e0b', '#10b981']; // Needs, Wants, Savings

const Budget = () => {
    const { currency } = useContext(CurrencyContext);
    const [income, setIncome] = useState(() => {
        const saved = localStorage.getItem('mock_budget_income');
        return saved ? parseFloat(saved) : 5000;
    });
    
    const [budgetData, setBudgetData] = useState(() => {
        const saved = localStorage.getItem('mock_budget_data');
        if (saved) return JSON.parse(saved);
        return [];
    });

    const [emis, setEmis] = useState(() => {
        const saved = localStorage.getItem('mock_emis');
        if (saved) return JSON.parse(saved);
        return [];
    });

    const [emiForm, setEmiForm] = useState({ name: '', principal: '', rate: '', tenure: '' });

    const handleCalculate = (e) => {
        e.preventDefault();
        const newData = [
            { name: 'Needs (50%)', value: income * 0.5, used: 0 },
            { name: 'Wants (30%)', value: income * 0.3, used: 0 },
            { name: 'Savings (20%)', value: income * 0.2, used: 0 },
        ];
        setBudgetData(newData);
        localStorage.setItem('mock_budget_income', income.toString());
        localStorage.setItem('mock_budget_data', JSON.stringify(newData));
    };

    const calculateEmi = (p, r, n) => {
        const monthlyRate = r / 12 / 100;
        const emi = p * monthlyRate * Math.pow(1 + monthlyRate, n) / (Math.pow(1 + monthlyRate, n) - 1);
        return emi || 0;
    };

    const handleAddEmi = (e) => {
        e.preventDefault();
        const p = parseFloat(emiForm.principal);
        const r = parseFloat(emiForm.rate);
        const n = parseInt(emiForm.tenure);
        const emiAmt = calculateEmi(p, r, n);

        const newEmi = {
            id: Date.now(),
            name: emiForm.name,
            principal: p,
            rate: r,
            tenure: n,
            emi: emiAmt
        };

        const updatedEmis = [...emis, newEmi];
        setEmis(updatedEmis);
        localStorage.setItem('mock_emis', JSON.stringify(updatedEmis));
        setEmiForm({ name: '', principal: '', rate: '', tenure: '' });
    };

    const totalEmi = emis.reduce((sum, item) => sum + item.emi, 0);
    const totalPrincipal = emis.reduce((sum, item) => sum + item.principal, 0);
    const averageRate = emis.length > 0 ? (emis.reduce((sum, item) => sum + item.rate, 0) / emis.length).toFixed(1) : 0;

    return (
        <Layout title="Budget Planner & EMI">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 50/30/20 Planner */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-[var(--surface-color)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg dark:bg-blue-900/30 dark:text-blue-400">
                            <Calculator size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-[var(--text-color)]">50/30/20 Budget Rule</h2>
                    </div>

                    <form onSubmit={handleCalculate} className="mb-8">
                        <label className="block text-sm font-medium text-[var(--text-color)] mb-2">Monthly Income ({currency.symbol})</label>
                        <div className="flex gap-4">
                            <input 
                                type="number" 
                                value={income}
                                onChange={(e) => setIncome(Number(e.target.value))}
                                className="flex-1 px-4 py-2.5 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors">
                                Calculate
                            </button>
                        </div>
                    </form>

                    <div className="h-64 mb-8">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={budgetData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {budgetData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="space-y-4">
                        {budgetData.map((item, idx) => {
                            const percentUsed = (item.used / item.value) * 100 || 0;
                            return (
                                <div key={item.name} className="p-4 bg-[var(--bg-color)] rounded-xl border border-[var(--border-color)]">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                                            <span className="font-semibold text-[var(--text-color)]">{item.name}</span>
                                        </div>
                                        <span className="font-bold">{currency.symbol}{item.value.toLocaleString()}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
                                        <div className="h-2.5 rounded-full" style={{ width: `${Math.min(percentUsed, 100)}%`, backgroundColor: COLORS[idx] }}></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
                                        <span>Used: {currency.symbol}{item.used}</span>
                                        {percentUsed > 90 && <span className="text-red-500 flex items-center gap-1"><AlertTriangle size={12}/> Near limit</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* EMI Calculator */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-[var(--surface-color)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm"
                >
                    <h2 className="text-xl font-bold text-[var(--text-color)] mb-6">EMI Calculator & Tracker</h2>
                    
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white mb-6">
                        <p className="text-indigo-100 text-sm mb-1">Total Active EMIs</p>
                        <h3 className="text-4xl font-bold mb-4">{currency.symbol}{totalEmi.toFixed(2)} <span className="text-lg font-normal">/mo</span></h3>
                        <div className="flex justify-between text-sm">
                            <span>Total Principal: {currency.symbol}{totalPrincipal.toLocaleString()}</span>
                            <span>Avg Interest: {averageRate}%</span>
                        </div>
                    </div>

                    <form onSubmit={handleAddEmi} className="mb-6 space-y-4 bg-[var(--bg-color)] p-4 rounded-xl border border-[var(--border-color)]">
                        <h3 className="font-semibold text-[var(--text-color)] text-sm">Add New Loan</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input required type="text" placeholder="Loan Name" value={emiForm.name} onChange={e => setEmiForm({...emiForm, name: e.target.value})} className="md:col-span-2 px-3 py-2 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-color)] focus:outline-none focus:border-blue-500" />
                            <input required type="number" placeholder={`Principal (${currency.symbol})`} value={emiForm.principal} onChange={e => setEmiForm({...emiForm, principal: e.target.value})} className="px-3 py-2 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-color)] focus:outline-none focus:border-blue-500" />
                            <input required type="number" step="0.1" placeholder="Rate (%)" value={emiForm.rate} onChange={e => setEmiForm({...emiForm, rate: e.target.value})} className="px-3 py-2 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-color)] focus:outline-none focus:border-blue-500" />
                            <input required type="number" placeholder="Months" value={emiForm.tenure} onChange={e => setEmiForm({...emiForm, tenure: e.target.value})} className="md:col-span-2 px-3 py-2 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-color)] focus:outline-none focus:border-blue-500" />
                        </div>
                        <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition-colors">
                            Calculate & Add
                        </button>
                    </form>

                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                        <h3 className="font-semibold text-[var(--text-color)] mb-2">Active Loans</h3>
                        {emis.length === 0 ? (
                            <p className="text-sm text-[var(--text-muted)] text-center py-4">No active loans found.</p>
                        ) : (
                            emis.map(loan => (
                                <div key={loan.id} className="p-4 border border-[var(--border-color)] rounded-xl flex justify-between items-center hover:bg-[var(--bg-color)] transition-colors">
                                    <div>
                                        <h4 className="font-bold text-[var(--text-color)]">{loan.name}</h4>
                                        <p className="text-sm text-[var(--text-muted)]">{loan.tenure} months @ {loan.rate}%</p>
                                    </div>
                                    <div className="text-right flex flex-col items-end">
                                        <p className="font-bold text-[var(--text-color)]">{currency.symbol}{loan.emi.toFixed(2)}</p>
                                        <button 
                                            onClick={() => {
                                                const newEmis = emis.filter(e => e.id !== loan.id);
                                                setEmis(newEmis);
                                                localStorage.setItem('mock_emis', JSON.stringify(newEmis));
                                            }}
                                            className="text-xs text-red-500 hover:underline mt-1"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
};

export default Budget;
