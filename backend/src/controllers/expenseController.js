const { getDB } = require('../config/db');
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.addExpense = async (req, res) => {
    try {
        const { title, amount, category, payment_method, date, notes } = req.body;

        if (!title || !amount || !category || !date) {
            return errorResponse(res, 400, 'Please provide title, amount, category, and date');
        }

        const db = await getDB();
        const result = await db.run(
            'INSERT INTO expenses (user_id, title, amount, category, payment_method, date, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [req.user.id, title, amount, category, payment_method, date, notes]
        );

        return successResponse(res, 201, 'Expense added successfully', { id: result.lastID });
    } catch (error) {
        console.error('Add Expense Error:', error);
        return errorResponse(res, 500, 'Server error while adding expense');
    }
};

exports.getExpenses = async (req, res) => {
    try {
        const { startDate, endDate, category, sortBy, order } = req.query;
        let query = 'SELECT * FROM expenses WHERE user_id = ?';
        const params = [req.user.id];

        if (startDate && endDate) {
            query += ' AND date BETWEEN ? AND ?';
            params.push(startDate, endDate);
        }

        if (category) {
            query += ' AND category = ?';
            params.push(category);
        }

        const validSortColumns = ['date', 'amount'];
        const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'date';
        const sortOrder = order === 'asc' ? 'ASC' : 'DESC';

        query += ` ORDER BY ${sortColumn} ${sortOrder}`;

        const db = await getDB();
        const expenses = await db.all(query, params);
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

        const db = await getDB();
        const result = await db.run(
            'UPDATE expenses SET title = ?, amount = ?, category = ?, payment_method = ?, date = ?, notes = ? WHERE id = ? AND user_id = ?',
            [title, amount, category, payment_method, date, notes, id, req.user.id]
        );

        if (result.changes === 0) {
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
        const db = await getDB();
        const result = await db.run('DELETE FROM expenses WHERE id = ? AND user_id = ?', [id, req.user.id]);

        if (result.changes === 0) {
            return errorResponse(res, 404, 'Expense not found or unauthorized');
        }

        return successResponse(res, 200, 'Expense deleted successfully');
    } catch (error) {
        console.error('Delete Expense Error:', error);
        return errorResponse(res, 500, 'Server error while deleting expense');
    }
};
