import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CurrencyContext } from '../context/CurrencyContext';
import { Bell, Search, User, Menu } from 'lucide-react';

const Topbar = ({ title, onMenuClick }) => {
    const { user } = useContext(AuthContext);
    const { currency, changeCurrency, CURRENCIES } = useContext(CurrencyContext);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/expenses?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    return (
        <header className="h-16 md:h-20 bg-[var(--surface-color)] border-b border-[var(--border-color)] flex items-center justify-between px-4 md:px-8 transition-colors duration-300">
            <div className="flex items-center gap-4">
                <button 
                    onClick={onMenuClick}
                    className="p-2 -ml-2 rounded-lg text-[var(--text-color)] hover:bg-[var(--bg-color)] lg:hidden"
                >
                    <Menu size={24} />
                </button>
                <div className="hidden sm:block">
                    <h2 className="text-xl md:text-2xl font-bold text-[var(--text-color)]">{title}</h2>
                    <p className="text-xs md:text-sm text-[var(--text-muted)] hidden md:block">Manage your finances efficiently</p>
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-6">
                <div className="relative hidden lg:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search transactions (Press Enter)..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                        className="pl-10 pr-4 py-2.5 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-full text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 md:w-80 transition-all"
                    />
                </div>

                <select 
                    value={currency.code}
                    onChange={(e) => changeCurrency(e.target.value)}
                    className="px-2 md:px-3 py-1.5 md:py-2 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg text-xs md:text-sm text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                    {CURRENCIES.map(c => (
                        <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
                    ))}
                </select>

                <button className="relative p-2 text-[var(--text-muted)] hover:text-blue-600 transition-colors hidden sm:block">
                    <Bell size={24} />
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[var(--surface-color)]"></span>
                </button>

                <div className="flex items-center gap-3 pl-2 md:pl-6 border-l border-[var(--border-color)]">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-[var(--text-color)]">{user?.name || 'User'}</p>
                        <p className="text-xs text-[var(--text-muted)]">Free Plan</p>
                    </div>
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md text-sm md:text-base">
                        {user?.name ? user.name.charAt(0).toUpperCase() : <User size={20} />}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
