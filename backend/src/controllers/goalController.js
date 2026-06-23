const Goal = require('../models/Goal');
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.addGoal = async (req, res) => {
    try {
        const { goal_name, target_amount, target_date } = req.body;

        if (!goal_name || !target_amount || !target_date) {
            return errorResponse(res, 400, 'Please provide goal name, target amount, and target date');
        }

        const goal = await Goal.create({
            user_id: req.user.id,
            goal_name,
            target_amount,
            target_date
        });

        return successResponse(res, 201, 'Goal added successfully', { id: goal.id });
    } catch (error) {
        console.error('Add Goal Error:', error);
        return errorResponse(res, 500, 'Server error while adding goal');
    }
};

exports.getGoals = async (req, res) => {
    try {
        const goals = await Goal.find({ user_id: req.user.id });
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

        const goal = await Goal.findOneAndUpdate(
            { _id: id, user_id: req.user.id },
            { saved_amount },
            { new: true }
        );

        if (!goal) {
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
        const goal = await Goal.findOneAndDelete({ _id: id, user_id: req.user.id });

        if (!goal) {
            return errorResponse(res, 404, 'Goal not found or unauthorized');
        }

        return successResponse(res, 200, 'Goal deleted successfully');
    } catch (error) {
        console.error('Delete Goal Error:', error);
        return errorResponse(res, 500, 'Server error while deleting goal');
    }
};
