const { getDB } = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'your_jwt_secret_here', {
        expiresIn: '30d',
    });
};

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, income, savings_goal } = req.body;

        if (!name || !email || !password) {
            return errorResponse(res, 400, 'Please add all fields');
        }

        const db = await getDB();
        const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser) {
            return errorResponse(res, 400, 'User already exists');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const result = await db.run(
            'INSERT INTO users (name, email, password, income, savings_goal) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, income || 0, savings_goal || 0]
        );

        const user = {
            id: result.lastID,
            name,
            email,
            income: income || 0,
            savings_goal: savings_goal || 0,
            role: 'user'
        };

        return successResponse(res, 201, 'User registered successfully', {
            user,
            token: generateToken(user.id, user.role)
        });

    } catch (error) {
        console.error('Register Error:', error);
        return errorResponse(res, 500, 'Server error during registration');
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return errorResponse(res, 400, 'Please add all fields');
        }

        const db = await getDB();
        const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
        
        if (!user) {
            return errorResponse(res, 401, 'Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return errorResponse(res, 401, 'Invalid credentials');
        }

        return successResponse(res, 200, 'Login successful', {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                income: user.income,
                savings_goal: user.savings_goal,
                role: user.role
            },
            token: generateToken(user.id, user.role)
        });
    } catch (error) {
        console.error('Login Error:', error);
        return errorResponse(res, 500, 'Server error during login');
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const db = await getDB();
        const user = await db.get('SELECT id, name, email, income, savings_goal, role, created_at FROM users WHERE id = ?', [req.user.id]);
        
        if (!user) {
            return errorResponse(res, 404, 'User not found');
        }

        return successResponse(res, 200, 'User profile retrieved', user);
    } catch (error) {
        console.error('Profile Error:', error);
        return errorResponse(res, 500, 'Server error retrieving profile');
    }
};
