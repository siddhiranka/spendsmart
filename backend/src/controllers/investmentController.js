const { getDB } = require('../config/db');
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.addInvestment = async (req, res) => {
    try {
        const { investment_name, investment_type, amount, purchase_date } = req.body;

        if (!investment_name || !investment_type || !amount || !purchase_date) {
            return errorResponse(res, 400, 'Please provide all investment fields');
        }

        const db = await getDB();
        const result = await db.run(
            'INSERT INTO investments (user_id, investment_name, investment_type, amount, purchase_date) VALUES (?, ?, ?, ?, ?)',
            [req.user.id, investment_name, investment_type, amount, purchase_date]
        );

        return successResponse(res, 201, 'Investment added successfully', { id: result.lastID });
    } catch (error) {
        console.error('Add Investment Error:', error);
        return errorResponse(res, 500, 'Server error while adding investment');
    }
};

exports.getInvestments = async (req, res) => {
    try {
        const db = await getDB();
        const investments = await db.all('SELECT * FROM investments WHERE user_id = ?', [req.user.id]);
        return successResponse(res, 200, 'Investments retrieved', investments);
    } catch (error) {
        console.error('Get Investments Error:', error);
        return errorResponse(res, 500, 'Server error while retrieving investments');
    }
};

exports.deleteInvestment = async (req, res) => {
    try {
        const { id } = req.params;
        const db = await getDB();
        const result = await db.run('DELETE FROM investments WHERE id = ? AND user_id = ?', [id, req.user.id]);

        if (result.changes === 0) {
            return errorResponse(res, 404, 'Investment not found or unauthorized');
        }

        return successResponse(res, 200, 'Investment deleted successfully');
    } catch (error) {
        console.error('Delete Investment Error:', error);
        return errorResponse(res, 500, 'Server error while deleting investment');
    }
};
