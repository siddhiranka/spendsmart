const pool = require('../config/db');
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.addGoal = async (req, res) => {
    try {
        const { goal_name, target_amount, target_date } = req.body;

        if (!goal_name || !target_amount || !target_date) {
            return errorResponse(res, 400, 'Please provide goal name, target amount, and target date');
        }

        const [result] = await pool.query(
            'INSERT INTO goals (user_id, goal_name, target_amount, target_date) VALUES (?, ?, ?, ?)',
            [req.user.id, goal_name, target_amount, target_date]
        );

        return successResponse(res, 201, 'Goal added successfully', { id: result.insertId });
    } catch (error) {
        console.error('Add Goal Error:', error);
        return errorResponse(res, 500, 'Server error while adding goal');
    }
};

exports.getGoals = async (req, res) => {
    try {
        const [goals] = await pool.query('SELECT * FROM goals WHERE user_id = ?', [req.user.id]);
        return successResponse(res, 200, 'Goals retrieved', goals);
    } catch (error) {
        console.error('Get Goals Error:', error);
        return errorResponse(res, 500, 'Server error while retrieving goals');
    }
};

exports.updateGoalProgress = async (req, res) => {
    try {
        const { id } = req.params;
        const { saved_amount } = req.body;

        const [result] = await pool.query(
            'UPDATE goals SET saved_amount = ? WHERE id = ? AND user_id = ?',
            [saved_amount, id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return errorResponse(res, 404, 'Goal not found or unauthorized');
        }

        return successResponse(res, 200, 'Goal progress updated successfully');
    } catch (error) {
        console.error('Update Goal Error:', error);
        return errorResponse(res, 500, 'Server error while updating goal');
    }
};

exports.deleteGoal = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM goals WHERE id = ? AND user_id = ?', [id, req.user.id]);

        if (result.affectedRows === 0) {
            return errorResponse(res, 404, 'Goal not found or unauthorized');
        }

        return successResponse(res, 200, 'Goal deleted successfully');
    } catch (error) {
        console.error('Delete Goal Error:', error);
        return errorResponse(res, 500, 'Server error while deleting goal');
    }
};
