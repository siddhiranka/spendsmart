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
const apiRouter = express.Router();
apiRouter.use('/auth', require('./routes/authRoutes'));
apiRouter.use('/expenses', require('./routes/expenseRoutes'));
apiRouter.use('/income', require('./routes/incomeRoutes'));
apiRouter.use('/budgets', require('./routes/budgetRoutes'));
apiRouter.use('/emi', require('./routes/emiRoutes'));
apiRouter.use('/goals', require('./routes/goalRoutes'));
apiRouter.use('/investments', require('./routes/investmentRoutes'));
apiRouter.use('/ai', require('./routes/aiRoutes'));

app.use('/api', apiRouter);
app.use('/_/backend/api', apiRouter);

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to SpendSmart API' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;
