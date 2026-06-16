-- SpendSmart Database Seed Data
USE spendsmart;

-- 1. Insert Dummy Users
-- Password is 'password123' hashed using bcrypt for testing (if needed, replace with actual hashed values)
-- For simplicity in SQL seed, we might just put plain text or a known hash. 
-- Here is a bcrypt hash for 'password123': $2b$10$X7vW.D/mS.o5Y/hR8h/mZ.Q4U3Yv3yZ5U8w5V9v8X8.0.o5Y/hR8h
INSERT INTO users (name, email, password, income, savings_goal, role) VALUES 
('John Doe', 'john@example.com', '$2b$10$X7vW.D/mS.o5Y/hR8h/mZ.Q4U3Yv3yZ5U8w5V9v8X8.0.o5Y/hR8h', 5000.00, 1000.00, 'user'),
('Admin User', 'admin@example.com', '$2b$10$X7vW.D/mS.o5Y/hR8h/mZ.Q4U3Yv3yZ5U8w5V9v8X8.0.o5Y/hR8h', 8000.00, 2000.00, 'admin');

-- 2. Insert Expenses for John Doe (user_id = 1)
INSERT INTO expenses (user_id, title, amount, category, payment_method, date, notes) VALUES
(1, 'Groceries', 150.00, 'Food', 'Credit Card', '2023-10-01', 'Monthly groceries'),
(1, 'Electricity Bill', 60.00, 'Bills', 'Bank Transfer', '2023-10-05', 'October Bill'),
(1, 'Movie Night', 40.00, 'Entertainment', 'Cash', '2023-10-10', 'Watched latest movie'),
(1, 'Gasoline', 50.00, 'Travel', 'Credit Card', '2023-10-15', 'Fuel for car'),
(1, 'New Shoes', 120.00, 'Shopping', 'Debit Card', '2023-10-20', 'Running shoes');

-- 3. Insert Income for John Doe (user_id = 1)
INSERT INTO income (user_id, source, amount, date, notes) VALUES
(1, 'Salary', 4500.00, '2023-10-01', 'October Salary'),
(1, 'Freelance', 500.00, '2023-10-15', 'Web design project');

-- 4. Insert EMI for John Doe (user_id = 1)
INSERT INTO emi (user_id, loan_name, principal, interest, tenure, start_date) VALUES
(1, 'Car Loan', 15000.00, 7.5, 60, '2023-01-01');

-- 5. Insert Goals for John Doe (user_id = 1)
INSERT INTO goals (user_id, goal_name, target_amount, saved_amount, target_date) VALUES
(1, 'Emergency Fund', 10000.00, 2500.00, '2024-12-31'),
(1, 'New Laptop', 1500.00, 500.00, '2024-05-01');

-- 6. Insert Investments for John Doe (user_id = 1)
INSERT INTO investments (user_id, investment_name, investment_type, amount, purchase_date) VALUES
(1, 'S&P 500 Index', 'Stocks', 2000.00, '2023-06-15'),
(1, 'Bitcoin', 'Crypto', 500.00, '2023-08-20');

-- 7. Insert Notifications
INSERT INTO notifications (user_id, message) VALUES
(1, 'Welcome to SpendSmart! Start by adding your income and expenses.');
