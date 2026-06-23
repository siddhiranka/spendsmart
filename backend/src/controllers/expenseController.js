const Expense = require('../models/Expense');
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.addExpense = async (req, res) => {
    try {
        const { title, amount, category, payment_method, date, notes } = req.body;

        if (!title || !amount || !category || !date) {
            return errorResponse(res, 400, 'Please provide title, amount, category, and date');
        }

        const expense = await Expense.create({
            user_id: req.user.id,
            title,
            amount,
            category,
            payment_method,
            date,
            notes
        });

        return successResponse(res, 201, 'Expense added successfully', { id: expense.id });
    } catch (error) {
        console.error('Add Expense Error:', error);
        return errorResponse(res, 500, 'Server error while adding expense');
    }
};

exports.getExpenses = async (req, res) => {
    try {
        const { startDate, endDate, category, sortBy, order } = req.query;
        let query = { user_id: req.user.id };

        if (startDate && endDate) {
            query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        if (category) {
            query.category = category;
        }

        const validSortColumns = ['date', 'amount'];
        const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'date';
        const sortOrder = order === 'asc' ? 1 : -1;

        const expenses = await Expense.find(query).sort({ [sortColumn]: sortOrder });
        return successResponse(res, 200, 'Expenses retrieved', expenses);
    } catch (error) {
        console.error('Get Expenses Error:', error);
        return errorResponse(res, 500, 'Server error while retrieving expenses');
    }
};

exports.updateExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, amount, category, payment_method, date, notes } = req.body;

        const expense = await Expense.findOneAndUpdate(
            { _id: id, user_id: req.user.id },
            { title, amount, category, payment_method, date, notes },
            { new: true }
        );

        if (!expense) {
            return errorResponse(res, 404, 'Expense not found or unauthorized');
        }

        return successResponse(res, 200, 'Expense updated successfully');
    } catch (error) {
        console.error('Update Expense Error:', error);
        return errorResponse(res, 500, 'Server error while updating expense');
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const expense = await Expense.findOneAndDelete({ _id: id, user_id: req.user.id });

        if (!expense) {
            return errorResponse(res, 404, 'Expense not found or unauthorized');
        }

        return successResponse(res, 200, 'Expense deleted successfully');
    } catch (error) {
        console.error('Delete Expense Error:', error);
        return errorResponse(res, 500, 'Server error while deleting expense');
    }
};
