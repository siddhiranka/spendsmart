const Income = require('../models/Income');
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.addIncome = async (req, res) => {
    try {
        const { source, amount, date, notes } = req.body;

        if (!source || !amount || !date) {
            return errorResponse(res, 400, 'Please provide source, amount, and date');
        }

        const income = await Income.create({
            user_id: req.user.id,
            source,
            amount,
            date,
            notes
        });

        return successResponse(res, 201, 'Income added successfully', { id: income.id });
    } catch (error) {
        console.error('Add Income Error:', error);
        return errorResponse(res, 500, 'Server error while adding income');
    }
};

exports.getIncome = async (req, res) => {
    try {
        const { startDate, endDate, source, sortBy, order } = req.query;
        let query = { user_id: req.user.id };

        if (startDate && endDate) {
            query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        if (source) {
            query.source = source;
        }

        const validSortColumns = ['date', 'amount'];
        const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'date';
        const sortOrder = order === 'asc' ? 1 : -1;

        const income = await Income.find(query).sort({ [sortColumn]: sortOrder });
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

        const income = await Income.findOneAndUpdate(
            { _id: id, user_id: req.user.id },
            { source, amount, date, notes },
            { new: true }
        );

        if (!income) {
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
        const income = await Income.findOneAndDelete({ _id: id, user_id: req.user.id });

        if (!income) {
            return errorResponse(res, 404, 'Income not found or unauthorized');
        }

        return successResponse(res, 200, 'Income deleted successfully');
    } catch (error) {
        console.error('Delete Income Error:', error);
        return errorResponse(res, 500, 'Server error while deleting income');
    }
};
