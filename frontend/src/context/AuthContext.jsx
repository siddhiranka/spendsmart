import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                if (token.startsWith('mock_token_')) {
                    // Handle mock session persistence
                    const storedUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
                    const mockUser = storedUsers.find(u => u.token === token);
                    if (mockUser) {
                        setUser({ id: mockUser.id, name: mockUser.name, email: mockUser.email });
                    } else if (token === 'mock_token_123') {
                        // Legacy mock fallback
                        setUser({ id: 1, name: 'Test User', email: 'test@example.com' });
                    } else {
                        localStorage.removeItem('token');
                    }
                } else {
                    // Try real backend API
                    try {
                        const response = await api.get('/auth/profile');
                        setUser(response.data.data);
                    } catch (error) {
                        console.error('Error fetching profile:', error);
                        localStorage.removeItem('token');
                    }
                }
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', response.data.data.token);
            setUser(response.data.data.user);
        } catch (error) {
            console.warn('Backend login failed. Falling back to mock DB.');
            const storedUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
            const mockUser = storedUsers.find(u => u.email === email && u.password === password);
            
            if (mockUser) {
                localStorage.setItem('token', mockUser.token);
                setUser({ id: mockUser.id, name: mockUser.name, email: mockUser.email });
            } else {
                throw new Error('Invalid email or password');
            }
        }
    };

    const register = async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            localStorage.setItem('token', response.data.data.token);
            setUser(response.data.data.user);
        } catch (error) {
            console.warn('Backend register failed. Falling back to mock DB.');
            const storedUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
            
            if (storedUsers.some(u => u.email === userData.email)) {
                throw new Error('User already exists');
            }
            
            const newUser = {
                id: Date.now(),
                name: userData.name,
                email: userData.email,
                password: userData.password,
                token: 'mock_token_' + Date.now()
            };
            
            storedUsers.push(newUser);
            localStorage.setItem('mock_users', JSON.stringify(storedUsers));
            localStorage.setItem('token', newUser.token);
            setUser({ id: newUser.id, name: newUser.name, email: newUser.email });
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
