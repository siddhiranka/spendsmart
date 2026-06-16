const pool = require('../config/db');
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.addEMI = async (req, res) => {
    try {
        const { loan_name, principal, interest, tenure, start_date } = req.body;

        if (!loan_name || !principal || !interest || !tenure || !start_date) {
            return errorResponse(res, 400, 'Please provide all EMI fields');
        }

        const [result] = await pool.query(
            'INSERT INTO emi (user_id, loan_name, principal, interest, tenure, start_date) VALUES (?, ?, ?, ?, ?, ?)',
            [req.user.id, loan_name, principal, interest, tenure, start_date]
        );

        return successResponse(res, 201, 'EMI added successfully', { id: result.insertId });
    } catch (error) {
        console.error('Add EMI Error:', error);
        return errorResponse(res, 500, 'Server error while adding EMI');
    }
};

exports.getEMIs = async (req, res) => {
    try {
        const [emis] = await pool.query('SELECT * FROM emi WHERE user_id = ?', [req.user.id]);
        
        // Calculate EMI mathematically here if needed, or simply return data
        const calculatedEMIs = emis.map(emi => {
            const P = emi.principal;
            const r = (emi.interest / 12) / 100;
            const n = emi.tenure;
            const emiAmount = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            return {
                ...emi,
                emiAmount: emiAmount ? parseFloat(emiAmount.toFixed(2)) : 0
            };
        });

        return successResponse(res, 200, 'EMIs retrieved', calculatedEMIs);
    } catch (error) {
        console.error('Get EMIs Error:', error);
        return errorResponse(res, 500, 'Server error while retrieving EMIs');
    }
};

exports.deleteEMI = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM emi WHERE id = ? AND user_id = ?', [id, req.user.id]);

        if (result.affectedRows === 0) {
            return errorResponse(res, 404, 'EMI not found or unauthorized');
        }

        return successResponse(res, 200, 'EMI deleted successfully');
    } catch (error) {
        console.error('Delete EMI Error:', error);
        return errorResponse(res, 500, 'Server error while deleting EMI');
    }
};
