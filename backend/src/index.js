const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/income', require('./routes/incomeRoutes'));
app.use('/api/budgets', require('./routes/budgetRoutes'));
app.use('/api/emi', require('./routes/emiRoutes'));
app.use('/api/goals', require('./routes/goalRoutes'));
app.use('/api/investments', require('./routes/investmentRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to SpendSmart API' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
