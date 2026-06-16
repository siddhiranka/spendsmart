import React, { useState, useEffect, useContext } from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { 
    PieChart, Pie, Cell, 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
    LineChart, Line
} from 'recharts';
import { Wallet, TrendingUp, TrendingDown, Target, CreditCard, Activity } from 'lucide-react';

import { CurrencyContext } from '../context/CurrencyContext';
import api from '../services/api';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#64748b'];

const Dashboard = () => {
    const { currency } = useContext(CurrencyContext);
    // Mock Data for Charts
    const expenseData = [
        { name: 'Food', value: 400 },
        { name: 'Transport', value: 300 },
        { name: 'Shopping', value: 300 },
        { name: 'Bills', value: 200 },
    ];

    const monthlyTrendData = [
        { name: 'Jan', amount: 1200 },
        { name: 'Feb', amount: 1100 },
        { name: 'Mar', amount: 1500 },
        { name: 'Apr', amount: 1300 },
        { name: 'May', amount: 1800 },
        { name: 'Jun', amount: 1600 },
    ];

    const incomeVsExpenseData = [
        { name: 'Jan', income: 4000, expense: 2400 },
        { name: 'Feb', income: 3000, expense: 1398 },
        { name: 'Mar', income: 2000, expense: 9800 },
        { name: 'Apr', income: 2780, expense: 3908 },
        { name: 'May', income: 1890, expense: 4800 },
        { name: 'Jun', income: 2390, expense: 3800 },
    ];

    const [expenses, setExpenses] = useState([]);
    const [incomes, setIncomes] = useState([]);
    const [goals, setGoals] = useState([]);
    const [emis, setEmis] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [expRes, incRes, goalRes, emiRes] = await Promise.all([
                    api.get('/expenses'),
                    api.get('/income'),
                    api.get('/goals'),
                    api.get('/emi')
                ]);
                if (expRes.data?.data) setExpenses(expRes.data.data);
                if (incRes.data?.data) setIncomes(incRes.data.data);
                if (goalRes.data?.data) setGoals(goalRes.data.data);
                if (emiRes.data?.data) setEmis(emiRes.data.data);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            }
        };
        fetchData();

        window.addEventListener('dashboard_update', fetchData);
        return () => window.removeEventListener('dashboard_update', fetchData);
    }, []);

    const totalIncome = incomes.reduce((s, i) => s + parseFloat(i.amount || 0), 0);
    const totalExpenses = expenses.reduce((s, e) => s + parseFloat(e.amount || 0), 0);
    const totalSavings = goals.reduce((s, g) => s + parseFloat(g.saved_amount || 0), 0);
    const activeEmisCount = emis.length;

    const SummaryCard = ({ title, amount, prefix = currency.symbol, icon: Icon, colorClass, delay }) => (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className="bg-[var(--surface-color)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm hover:shadow-md transition-shadow"
        >
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-[var(--text-muted)] mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-[var(--text-color)]">{prefix}{amount.toLocaleString()}</h3>
                </div>
                <div className={`p-3 rounded-xl ${colorClass}`}>
                    <Icon size={24} />
                </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
                <TrendingUp size={16} className="text-green-500 mr-1" />
                <span className="text-green-500 font-medium">+0.0%</span>
                <span className="text-[var(--text-muted)] ml-2">from last month</span>
            </div>
        </motion.div>
    );

    return (
        <Layout title="Dashboard Overview">
            <div className="space-y-6">
                {/* Summary Cards - Horizontal scroll on mobile, Grid on desktop */}
                <div className="flex md:grid overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory gap-4 md:gap-6 md:grid-cols-2 xl:grid-cols-4 hide-scrollbar">
                    <div className="min-w-[85vw] sm:min-w-[45vw] md:min-w-0 snap-center"><SummaryCard title="Total Income" amount={totalIncome} icon={Wallet} colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" delay={0.1} /></div>
                    <div className="min-w-[85vw] sm:min-w-[45vw] md:min-w-0 snap-center"><SummaryCard title="Total Expenses" amount={totalExpenses} icon={TrendingDown} colorClass="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" delay={0.2} /></div>
                    <div className="min-w-[85vw] sm:min-w-[45vw] md:min-w-0 snap-center"><SummaryCard title="Total Savings" amount={totalSavings} icon={Target} colorClass="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" delay={0.3} /></div>
                    <div className="min-w-[85vw] sm:min-w-[45vw] md:min-w-0 snap-center"><SummaryCard title="Active EMIs" prefix="" amount={activeEmisCount} icon={CreditCard} colorClass="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" delay={0.4} /></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Expense Distribution */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="bg-[var(--surface-color)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm lg:col-span-1"
                    >
                        <h3 className="text-lg font-semibold text-[var(--text-color)] mb-4">Expense Distribution</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={expenseData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {expenseData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip 
                                        contentStyle={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)', color: 'var(--text-color)' }}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Income vs Expense */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="bg-[var(--surface-color)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm lg:col-span-2"
                    >
                        <h3 className="text-lg font-semibold text-[var(--text-color)] mb-4">Income vs Expense</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={incomeVsExpenseData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                                    <XAxis dataKey="name" stroke="var(--text-muted)" />
                                    <YAxis stroke="var(--text-muted)" />
                                    <RechartsTooltip 
                                        contentStyle={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)', color: 'var(--text-color)', borderRadius: '0.5rem' }}
                                        cursor={{ fill: 'var(--bg-color)' }}
                                    />
                                    <Legend />
                                    <Bar dataKey="income" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>

                {/* Monthly Spending Trend */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="bg-[var(--surface-color)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm"
                >
                    <h3 className="text-lg font-semibold text-[var(--text-color)] mb-4">Monthly Spending Trend</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlyTrendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                                <XAxis dataKey="name" stroke="var(--text-muted)" />
                                <YAxis stroke="var(--text-muted)" />
                                <RechartsTooltip 
                                    contentStyle={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)', color: 'var(--text-color)', borderRadius: '0.5rem' }}
                                />
                                <Line type="monotone" dataKey="amount" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
};

export default Dashboard;
