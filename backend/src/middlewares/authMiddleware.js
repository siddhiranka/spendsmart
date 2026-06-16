const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/responseHandler');

const protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_here');
            
            req.user = decoded;
            next();
        } catch (error) {
            console.error('Auth Middleware Error:', error);
            return errorResponse(res, 401, 'Not authorized, token failed');
        }
    }

    if (!token) {
        return errorResponse(res, 401, 'Not authorized, no token');
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return errorResponse(res, 403, 'Not authorized as an admin');
    }
};

module.exports = { protect, admin };
