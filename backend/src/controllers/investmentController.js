const Investment = require('../models/Investment');
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.addInvestment = async (req, res) => {
    try {
        const { investment_name, investment_type, amount, purchase_date } = req.body;

        if (!investment_name || !investment_type || !amount || !purchase_date) {
            return errorResponse(res, 400, 'Please provide all investment fields');
        }

        const investment = await Investment.create({
            user_id: req.user.id,
            investment_name,
            investment_type,
            amount,
            purchase_date
        });

        return successResponse(res, 201, 'Investment added successfully', { id: investment.id });
    } catch (error) {
        console.error('Add Investment Error:', error);
        return errorResponse(res, 500, 'Server error while adding investment');
    }
};

exports.getInvestments = async (req, res) => {
    try {
        const investments = await Investment.find({ user_id: req.user.id });
        return successResponse(res, 200, 'Investments retrieved', investments);
    } catch (error) {
        console.error('Get Investments Error:', error);
        return errorResponse(res, 500, 'Server error while retrieving investments');
    }
};

exports.deleteInvestment = async (req, res) => {
    try {
        const { id } = req.params;
        const investment = await Investment.findOneAndDelete({ _id: id, user_id: req.user.id });

        if (!investment) {
            return errorResponse(res, 404, 'Investment not found or unauthorized');
        }

        return successResponse(res, 200, 'Investment deleted successfully');
    } catch (error) {
        console.error('Delete Investment Error:', error);
        return errorResponse(res, 500, 'Server error while deleting investment');
    }
};
