import React, { createContext, useState, useEffect } from 'react';

export const CurrencyContext = createContext();

export const CURRENCIES = [
    { code: 'USD', symbol: '$', label: 'US Dollar (USD)' },
    { code: 'INR', symbol: '₹', label: 'Indian Rupee (INR)' },
    { code: 'EUR', symbol: '€', label: 'Euro (EUR)' },
    { code: 'GBP', symbol: '£', label: 'British Pound (GBP)' },
];

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState(() => {
        const saved = localStorage.getItem('user_currency');
        if (saved) {
            const found = CURRENCIES.find(c => c.code === saved);
            if (found) return found;
        }
        return CURRENCIES[0]; // Default to USD
    });

    const changeCurrency = (code) => {
        const newCurrency = CURRENCIES.find(c => c.code === code);
        if (newCurrency) {
            setCurrency(newCurrency);
            localStorage.setItem('user_currency', newCurrency.code);
        }
    };

    return (
        <CurrencyContext.Provider value={{ currency, changeCurrency, CURRENCIES }}>
            {children}
        </CurrencyContext.Provider>
    );
};
