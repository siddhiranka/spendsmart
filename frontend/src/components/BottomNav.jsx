import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, Target, Sparkles, Plus } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

const BottomNav = ({ onFabClick }) => {
    const navItems = [
        { name: 'Home', path: '/', icon: LayoutDashboard },
        { name: 'Expenses', path: '/expenses', icon: Receipt },
        { name: 'Goals', path: '/goals', icon: Target },
        { name: 'AI', path: '/ai-advisor', icon: Sparkles },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--surface-color)]/90 backdrop-blur-md border-t border-[var(--border-color)] pb-safe lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.2)] transition-colors duration-300">
            <div className="flex items-center justify-around px-2 h-16 relative">
                {navItems.map((item, index) => {
                    // We insert a blank space in the middle for the FAB
                    if (index === 2) {
                        return (
                            <React.Fragment key="fab-spacer">
                                <div className="w-12 h-12" /> {/* Spacer for FAB */}
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    className={({ isActive }) => cn(
                                        "flex flex-col items-center justify-center w-16 h-full space-y-1 text-xs font-medium transition-colors",
                                        isActive ? "text-blue-600 dark:text-blue-400" : "text-[var(--text-muted)] hover:text-[var(--text-color)]"
                                    )}
                                >
                                    <item.icon size={20} />
                                    <span>{item.name}</span>
                                </NavLink>
                            </React.Fragment>
                        );
                    }

                    return (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) => cn(
                                "flex flex-col items-center justify-center w-16 h-full space-y-1 text-xs font-medium transition-colors",
                                isActive ? "text-blue-600 dark:text-blue-400" : "text-[var(--text-muted)] hover:text-[var(--text-color)]"
                            )}
                        >
                            <item.icon size={20} />
                            <span>{item.name}</span>
                        </NavLink>
                    );
                })}

                {/* FAB (Floating Action Button) */}
                <button 
                    onClick={onFabClick}
                    className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all duration-200"
                >
                    <Plus size={28} />
                </button>
            </div>
        </div>
    );
};

export default BottomNav;
