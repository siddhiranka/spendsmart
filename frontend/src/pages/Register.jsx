import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CurrencyContext } from '../context/CurrencyContext';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Target, DollarSign } from 'lucide-react';

const Register = () => {
    const { currency } = useContext(CurrencyContext);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        income: '',
        savings_goal: ''
    });
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }
        try {
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                income: parseFloat(formData.income),
                savings_goal: parseFloat(formData.savings_goal)
            });
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)] p-4 py-12">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-xl bg-[var(--surface-color)] rounded-2xl shadow-xl overflow-hidden border border-[var(--border-color)]"
            >
                <div className="p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                            <UserPlus size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-[var(--text-color)] mb-2">Create Account</h2>
                        <p className="text-[var(--text-muted)]">Join SpendSmart and take control of your finances</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-color)] mb-2">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <User size={20} />
                                    </div>
                                    <input 
                                        type="text" 
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--text-color)] mb-2">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <Mail size={20} />
                                    </div>
                                    <input 
                                        type="email" 
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--text-color)] mb-2">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <Lock size={20} />
                                    </div>
                                    <input 
                                        type="password" 
                                        name="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                        placeholder="Enter password"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--text-color)] mb-2">Confirm Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <Lock size={20} />
                                    </div>
                                    <input 
                                        type="password" 
                                        name="confirmPassword"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                        placeholder="Confirm password"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--text-color)] mb-2">Monthly Income ({currency.symbol})</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <DollarSign size={20} />
                                    </div>
                                    <input 
                                        type="number" 
                                        name="income"
                                        value={formData.income}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                        placeholder="5000"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--text-color)] mb-2">Savings Goal ({currency.symbol})</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <Target size={20} />
                                    </div>
                                    <input 
                                        type="number" 
                                        name="savings_goal"
                                        value={formData.savings_goal}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                        placeholder="10000"
                                    />
                                </div>
                            </div>
                        </div>

                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 transition-all"
                        >
                            Create Account
                        </motion.button>
                    </form>

                    <div className="mt-8 text-center text-sm text-[var(--text-muted)]">
                        Already have an account? <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-500 transition-colors">Sign In</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
