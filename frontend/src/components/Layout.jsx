import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import BottomNav from './BottomNav';
import QuickAddModal from './QuickAddModal';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = ({ children, title }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-[var(--bg-color)]">
            {/* Mobile Overlay for Sidebar */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            
            <div className="flex-1 flex flex-col overflow-hidden w-full relative z-0">
                <Topbar title={title} onMenuClick={() => setIsSidebarOpen(true)} />
                {/* Notice the pb-24 padding bottom on mobile to accommodate BottomNav */}
                <main className="flex-1 overflow-y-auto p-4 pb-24 md:p-8 w-full">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile Native App Components */}
            <BottomNav onFabClick={() => setIsQuickAddOpen(true)} />
            <QuickAddModal isOpen={isQuickAddOpen} onClose={() => setIsQuickAddOpen(false)} />
        </div>
    );
};

export default Layout;
