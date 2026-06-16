import React, { useState, useEffect, useRef, useContext } from 'react';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, User, Bot, Activity } from 'lucide-react';
import { CurrencyContext } from '../context/CurrencyContext';

const AIAdvisor = () => {
    const { currency } = useContext(CurrencyContext);
    
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'ai',
            content: `Hello! I'm your SpendSmart AI Advisor. I've analyzed your recent spending patterns and current balance.\n\nYour **Financial Health Score is 85/100**. \n\nHow can I help you optimize your finances today?`
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const newUserMsg = {
            id: Date.now(),
            role: 'user',
            content: inputValue.trim()
        };

        setMessages(prev => [...prev, newUserMsg]);
        setInputValue('');
        setIsTyping(true);

        // Simulate AI Response
        setTimeout(() => {
            let aiResponse = "I'm still learning, but based on your data, I recommend focusing on reducing discretionary spending to boost your emergency fund.";
            
            const lowerInput = newUserMsg.content.toLowerCase();
            if (lowerInput.includes('food') || lowerInput.includes('eat')) {
                aiResponse = `I see you've spent around ${currency.symbol}450 on Food this month. That's 15% higher than last month. Consider meal prepping to cut costs!`;
            } else if (lowerInput.includes('invest') || lowerInput.includes('stock')) {
                aiResponse = `Your S&P 500 ETF is performing well (+8.5%). Since you have some extra cash this month, you might want to increase your contribution by ${currency.symbol}100.`;
            } else if (lowerInput.includes('save') || lowerInput.includes('emergency')) {
                aiResponse = `Your emergency fund currently covers 2 months of expenses. The goal should be 3-6 months. I suggest setting up an automatic transfer of ${currency.symbol}50 every payday to reach that goal faster.`;
            }

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'ai',
                content: aiResponse
            }]);
            setIsTyping(false);
        }, 1500);
    };

    // Helper to format bold text in chat messages
    const formatMessageText = (text) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    return (
        <Layout title="AI Financial Advisor">
            <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] md:h-[calc(100vh-160px)] flex flex-col bg-[var(--surface-color)] rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-sm relative">
                
                {/* Decorative Header Background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none z-0"></div>

                {/* Header */}
                <div className="p-4 md:p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--surface-color)] z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg md:text-xl font-bold text-[var(--text-color)]">SpendSmart AI</h2>
                            <p className="text-xs md:text-sm text-[var(--text-muted)] flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Online
                            </p>
                        </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-medium">
                        <Activity size={16} /> Health Score: 85
                    </div>
                </div>

                {/* Chat Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 z-10 scrollbar-hide">
                    {messages.map((msg) => (
                        <motion.div 
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm ${msg.role === 'ai' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400' : 'bg-gradient-to-tr from-blue-500 to-indigo-500 text-white'}`}>
                                {msg.role === 'ai' ? <Bot size={20} /> : <User size={20} />}
                            </div>
                            
                            <div className={`max-w-[80%] md:max-w-[70%] rounded-2xl p-4 shadow-sm ${
                                msg.role === 'user' 
                                    ? 'bg-blue-600 text-white rounded-tr-none' 
                                    : 'bg-[var(--bg-color)] border border-[var(--border-color)] text-[var(--text-color)] rounded-tl-none'
                            }`}>
                                <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                                    {formatMessageText(msg.content)}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                    
                    {/* Typing Indicator */}
                    {isTyping && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex flex-shrink-0 items-center justify-center shadow-sm">
                                <Bot size={20} />
                            </div>
                            <div className="bg-[var(--bg-color)] border border-[var(--border-color)] rounded-2xl rounded-tl-none p-4 flex items-center gap-1.5 shadow-sm">
                                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500" />
                                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500" />
                                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500" />
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} className="h-1" />
                </div>

                {/* Input Area */}
                <div className="p-4 md:p-6 bg-[var(--surface-color)] border-t border-[var(--border-color)] z-10 pb-safe">
                    <form onSubmit={handleSendMessage} className="relative flex items-center">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask about your spending, goals, or advice..."
                            className="w-full pl-6 pr-14 py-3 md:py-4 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-full text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow text-sm md:text-base shadow-inner"
                        />
                        <button 
                            type="submit"
                            disabled={!inputValue.trim() || isTyping}
                            className="absolute right-2 md:right-3 p-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-full transition-colors disabled:cursor-not-allowed"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                    <div className="hidden md:flex justify-center gap-4 mt-4">
                        <button type="button" onClick={() => setInputValue("How much did I spend on food?")} className="text-xs text-[var(--text-muted)] hover:text-indigo-500 transition-colors bg-[var(--bg-color)] px-3 py-1.5 rounded-full border border-[var(--border-color)]">"How much did I spend on food?"</button>
                        <button type="button" onClick={() => setInputValue("Can I afford a new laptop?")} className="text-xs text-[var(--text-muted)] hover:text-indigo-500 transition-colors bg-[var(--bg-color)] px-3 py-1.5 rounded-full border border-[var(--border-color)]">"Can I afford a new laptop?"</button>
                    </div>
                </div>

            </div>
        </Layout>
    );
};

export default AIAdvisor;
