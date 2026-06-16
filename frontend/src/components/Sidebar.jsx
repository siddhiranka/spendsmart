import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { 
    LayoutDashboard, 
    Receipt, 
    Wallet, 
    PieChart, 
    Target, 
    TrendingUp, 
    Sparkles, 
    LogOut,
    Sun,
    Moon,
    X
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => {
  return twMerge(clsx(inputs));
}

const Sidebar = ({ isOpen, setIsOpen }) => {
    const { logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);

    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Expenses', path: '/expenses', icon: Receipt },
        { name: 'Income', path: '/income', icon: Wallet },
        { name: 'Budget & EMI', path: '/budget', icon: PieChart },
        { name: 'Goals', path: '/goals', icon: Target },
        { name: 'Investments', path: '/investments', icon: TrendingUp },
        { name: 'AI Advisor', path: '/ai-advisor', icon: Sparkles },
    ];

    return (
        <aside className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-[var(--surface-color)] border-r border-[var(--border-color)] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen shadow-xl lg:shadow-none",
            isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
            <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-xl">S</span>
                    </div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                        SpendSmart
                    </h1>
                </div>
                <button 
                    onClick={() => setIsOpen(false)} 
                    className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-color)] lg:hidden"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1 px-3">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                                isActive 
                                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" 
                                    : "text-[var(--text-muted)] hover:bg-[var(--bg-color)] hover:text-[var(--text-color)]"
                            )}
                        >
                            <item.icon size={20} className="transition-transform group-hover:scale-110" />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="p-4 border-t border-[var(--border-color)] space-y-2 bg-[var(--surface-color)]">
                <button 
                    onClick={toggleTheme}
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:bg-[var(--bg-color)] hover:text-[var(--text-color)] transition-all duration-200"
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </button>
                
                <button 
                    onClick={logout}
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
