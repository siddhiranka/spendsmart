const { getDB } = require('../config/db');
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.addIncome = async (req, res) => {
    try {
        const { source, amount, date, notes } = req.body;

        if (!source || !amount || !date) {
            return errorResponse(res, 400, 'Please provide source, amount, and date');
        }

        const db = await getDB();
        const result = await db.run(
            'INSERT INTO income (user_id, source, amount, date, notes) VALUES (?, ?, ?, ?, ?)',
            [req.user.id, source, amount, date, notes]
        );

        return successResponse(res, 201, 'Income added successfully', { id: result.lastID });
    } catch (error) {
        console.error('Add Income Error:', error);
        return errorResponse(res, 500, 'Server error while adding income');
    }
};

exports.getIncome = async (req, res) => {
    try {
        const { startDate, endDate, source, sortBy, order } = req.query;
        let query = 'SELECT * FROM income WHERE user_id = ?';
        const params = [req.user.id];

        if (startDate && endDate) {
            query += ' AND date BETWEEN ? AND ?';
            params.push(startDate, endDate);
        }

        if (source) {
            query += ' AND source = ?';
            params.push(source);
        }

        const validSortColumns = ['date', 'amount'];
        const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'date';
        const sortOrder = order === 'asc' ? 'ASC' : 'DESC';

        query += ` ORDER BY ${sortColumn} ${sortOrder}`;

        const db = await getDB();
        const income = await db.all(query, params);
        return successResponse(res, 200, 'Income retrieved', income);
    } catch (error) {
        console.error('Get Income Error:', error);
        return errorResponse(res, 500, 'Server error while retrieving income');
    }
};

exports.updateIncome = async (req, res) => {
    try {
        const { id } = req.params;
        const { source, amount, date, notes } = req.body;

        const db = await getDB();
        const result = await db.run(
            'UPDATE income SET source = ?, amount = ?, date = ?, notes = ? WHERE id = ? AND user_id = ?',
            [source, amount, date, notes, id, req.user.id]
        );

        if (result.changes === 0) {
            return errorResponse(res, 404, 'Income not found or unauthorized');
        }

        return successResponse(res, 200, 'Income updated successfully');
    } catch (error) {
        console.error('Update Income Error:', error);
        return errorResponse(res, 500, 'Server error while updating income');
    }
};

exports.deleteIncome = async (req, res) => {
    try {
        const { id } = req.params;
        const db = await getDB();
        const result = await db.run('DELETE FROM income WHERE id = ? AND user_id = ?', [id, req.user.id]);

        if (result.changes === 0) {
            return errorResponse(res, 404, 'Income not found or unauthorized');
        }

        return successResponse(res, 200, 'Income deleted successfully');
    } catch (error) {
        console.error('Delete Income Error:', error);
        return errorResponse(res, 500, 'Server error while deleting income');
    }
};
