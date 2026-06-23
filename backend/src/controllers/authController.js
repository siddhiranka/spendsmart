const User = require('../models/User');
const bcrypt = require('bcryptjs');
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

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return errorResponse(res, 400, 'User already exists');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            income: income || 0,
            savings_goal: savings_goal || 0,
            role: 'user'
        });

        return successResponse(res, 201, 'User registered successfully', {
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
        console.error('Registration error:', error);
        return errorResponse(res, 500, 'Server error during registration', error.toString());
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return errorResponse(res, 400, 'Please add all fields');
        }

        const user = await User.findOne({ email });
        
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
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return errorResponse(res, 404, 'User not found');
        }

        return successResponse(res, 200, 'User profile retrieved', user);
    } catch (error) {
        console.error('Profile Error:', error);
        return errorResponse(res, 500, 'Server error retrieving profile');
    }
};
