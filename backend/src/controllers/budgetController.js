const pool = require('../config/db');
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.setBudget = async (req, res) => {
    try {
        const { month, year, income, savings_target } = req.body;

        if (!month || !year || !income || !savings_target) {
            return errorResponse(res, 400, 'Please provide month, year, income, and savings_target');
        }

        const needs_limit = income * 0.50;
        const wants_limit = income * 0.30;
        const savings_limit = income * 0.20;

        // Use INSERT ... ON DUPLICATE KEY UPDATE or just DELETE then INSERT for simplicity
        await pool.query('DELETE FROM budgets WHERE user_id = ? AND month = ? AND year = ?', [req.user.id, month, year]);

        const [result] = await pool.query(
            'INSERT INTO budgets (user_id, month, year, income, savings_target, needs_limit, wants_limit, savings_limit) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [req.user.id, month, year, income, savings_target, needs_limit, wants_limit, savings_limit]
        );

        return successResponse(res, 201, 'Budget set successfully', { id: result.insertId });
    } catch (error) {
        console.error('Set Budget Error:', error);
        return errorResponse(res, 500, 'Server error while setting budget');
    }
};

exports.getBudget = async (req, res) => {
    try {
        const { month, year } = req.query;

        if (!month || !year) {
            return errorResponse(res, 400, 'Please provide month and year');
        }

        const [budgets] = await pool.query('SELECT * FROM budgets WHERE user_id = ? AND month = ? AND year = ?', [req.user.id, month, year]);

        if (budgets.length === 0) {
            return successResponse(res, 200, 'No budget found for this month', null);
        }

        return successResponse(res, 200, 'Budget retrieved', budgets[0]);
    } catch (error) {
        console.error('Get Budget Error:', error);
        return errorResponse(res, 500, 'Server error while retrieving budget');
    }
};
