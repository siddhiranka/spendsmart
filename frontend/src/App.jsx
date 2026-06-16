import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CurrencyProvider } from './context/CurrencyContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Income from './pages/Income';
import Budget from './pages/Budget';
import AIAdvisor from './pages/AIAdvisor';
import Goals from './pages/Goals';
import Investments from './pages/Investments';
import Layout from './components/Layout';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] transition-colors duration-300">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected Routes */}
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
                <Route path="/income" element={<ProtectedRoute><Income /></ProtectedRoute>} />
                <Route path="/budget" element={<ProtectedRoute><Budget /></ProtectedRoute>} />
                <Route path="/ai-advisor" element={<ProtectedRoute><AIAdvisor /></ProtectedRoute>} />
                <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
                <Route path="/investments" element={<ProtectedRoute><Investments /></ProtectedRoute>} />
                
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
}

export default App;
