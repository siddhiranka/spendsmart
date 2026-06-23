const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { connectDB } = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const emiRoutes = require('./routes/emiRoutes');
const goalRoutes = require('./routes/goalRoutes');
const investmentRoutes = require('./routes/investmentRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Connect to Database
connectDB();

const apiRouter = express.Router();
apiRouter.use('/auth', authRoutes);
apiRouter.use('/expenses', expenseRoutes);
apiRouter.use('/income', incomeRoutes);
apiRouter.use('/budgets', budgetRoutes);
apiRouter.use('/emi', emiRoutes);
apiRouter.use('/goals', goalRoutes);
apiRouter.use('/investments', investmentRoutes);
apiRouter.use('/ai', aiRoutes);

app.use('/api', apiRouter);
app.use('/_/backend/api', apiRouter);

// Basic Route
app.get('/', (req, res) => res.json({ message: 'Welcome to SpendSmart API' }));
app.get('/_/backend', (req, res) => res.json({ message: 'Welcome to SpendSmart API' }));

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// Port and Server Start
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}

module.exports = app;
