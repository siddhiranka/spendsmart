const { GoogleGenAI } = require('@google/genai');
const User = require('../models/User');
const Expense = require('../models/Expense');
const { successResponse, errorResponse } = require('../utils/responseHandler');

let ai;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

exports.getFinancialInsights = async (req, res) => {
    try {
        // Fetch user data for context
        const user = await User.findById(req.user.id).select('income savings_goal');
        if (!user) {
            return errorResponse(res, 404, 'User not found');
        }

        const expenses = await Expense.find({ user_id: req.user.id })
            .select('amount category date')
            .sort({ date: -1 })
            .limit(30);
        
        // Prepare prompt
        const prompt = `
            Act as a professional financial advisor.
            User's monthly income: $${user.income}
            User's savings goal: $${user.savings_goal}
            Recent expenses (last 30 days):
            ${expenses.map(e => `- $${e.amount} on ${e.category} (${e.date})`).join('\n')}
            
            Based on this, provide a short 3-paragraph financial insight, highlighting spending patterns, a health score (0-100), and personalized recommendations for saving. Keep it concise.
        `;

        if (ai) {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            return successResponse(res, 200, 'AI Insights Generated', { insights: response.text });
        } else {
            // Mock Response Fallback
            const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
            const mockInsight = `
                **Financial Health Score: 75/100**\n\n
                Your income is $${user.income} and your recent expenses total $${totalExpenses}. You are on track but there's room for improvement.\n\n
                **Insights:** A large portion of your expenses recently went to various categories. Consider tracking the largest category closely next month.\n\n
                **Recommendations:** To reach your savings goal of $${user.savings_goal}, try applying the 50/30/20 rule and cut back on discretionary spending. (This is a mock response, add GEMINI_API_KEY to .env for real insights).
            `;
            return successResponse(res, 200, 'Mock AI Insights Generated', { insights: mockInsight });
        }
    } catch (error) {
        console.error('AI Insights Error:', error);
        return errorResponse(res, 500, 'Server error while generating AI insights');
    }
};
