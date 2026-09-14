Design a complete modern web application UI/UX for a Personal Finance Management System.

PROJECT OVERVIEW:
Create a personal finance management web application that allows users to manage their money, track income and expenses, manage financial accounts, create spending budgets, and track financial goals.

The application is a student project built with:

* Frontend: React.js
* Backend: ASP.NET Core Web API
* Database: SQL Server
* Authentication: JWT

The system uses exactly 6 main database tables:

1. Users
2. Accounts
3. Categories
4. Transactions
5. Budgets
6. FinancialGoals

IMPORTANT:
Do NOT create features that require additional database tables.
Do NOT design bank API integration or real MoMo API integration.
Bank accounts and MoMo wallets are only simulated account types inside the application.

DESIGN STYLE:
Create a cute, friendly, modern fintech dashboard.

Visual direction:

* Cute but professional
* Soft pastel colors
* Clean and minimal interface
* Rounded cards and buttons
* Soft shadows
* Friendly illustrations
* Small cute financial icons
* Modern typography
* Lots of whitespace
* Simple visual hierarchy
* Smooth and pleasant user experience
* Avoid overly childish cartoon styling
* The application should still feel like a real personal finance product

Suggested visual mood:
"cute fintech + modern productivity app"

Use a soft pastel palette such as:

* Cream / off-white background
* Soft lavender
* Pastel purple
* Pastel blue
* Soft mint
* Light peach
* Gentle pink accents

Use color carefully:

* Income: positive green/mint
* Expense: soft coral/red
* Savings/goals: purple/blue
* Warning/budget exceeded: warm orange

TYPOGRAPHY:
Use a modern rounded font such as:

* Inter
* Nunito
* Plus Jakarta Sans

Prefer rounded and friendly typography while maintaining excellent readability.

DESIGN SYSTEM:
Create reusable components:

* Buttons
* Inputs
* Selects
* Dropdowns
* Cards
* Modal dialogs
* Tables
* Tabs
* Badges
* Progress bars
* Tooltips
* Toast notifications
* Navigation sidebar
* Top navigation
* Charts
* Empty states
* Loading states
* Error states

LAYOUT:
Desktop-first responsive web application.

Main layout:

* Left sidebar navigation
* Top header
* Main content area
* Responsive behavior for tablet and mobile

SIDEBAR:
Logo:
"Personal Finance" or "MoneyMate"

Navigation:

* Dashboard
* Accounts
* Transactions
* Categories
* Budgets
* Financial Goals

Bottom section:

* User profile
* Settings
* Logout

PAGE 1 — LOGIN:

Create a clean and cute login page.

Elements:

* Application logo
* Friendly financial illustration
* Email input
* Password input
* Remember me
* Login button
* "Forgot password?"
* Link to Register

Visual:
Soft pastel background with a small cute illustration related to saving money.

PAGE 2 — REGISTER:

Elements:

* Full name
* Email
* Password
* Confirm password
* Register button
* Link to Login

Show simple password validation.

PAGE 3 — DASHBOARD:

This is the main screen.

Header:
"Good morning, [User Name]!"
"Here's your financial overview."

Summary cards:

1. Total Balance
2. Total Income
3. Total Expenses
4. Savings

Use attractive rounded cards with small icons.

Example:
Total Balance
$12,450.00

Income
+$5,200

Expenses
-$2,850

Savings
$2,350

MAIN DASHBOARD SECTIONS:

1. Balance Overview
   Display a clean line or area chart showing balance over time.

2. Income vs Expenses
   Bar chart comparing monthly income and expenses.

3. Expense by Category
   Donut chart:

* Food
* Transport
* Shopping
* Entertainment
* Bills
* Education
* Other

4. Recent Transactions
   Display the latest transactions with:

* Category icon
* Description
* Date
* Account
* Amount

5. Budget Overview
   Show budget progress cards.

Example:
Food
$1,250 / $2,000
62.5%

6. Financial Goals
   Show progress cards.

Example:
New Laptop
$1,200 / $2,000
60%

Include a "View all" button.

PAGE 4 — ACCOUNTS:

Purpose:
Manage financial accounts.

Display account cards.

Examples:

* Cash
* Vietcombank
* MB Bank
* MoMo

Important:
These are simulated accounts. There is NO real bank or MoMo integration.

Each account card should show:

* Account icon
* Account name
* Account type
* Current balance
* Number of transactions
* Edit button
* Delete button

Example:

MoMo
E-Wallet

1,500,000 ₫

Buttons:
Edit
Delete

Add Account button.

ADD ACCOUNT MODAL:

Fields:

* Account Name
* Account Type

  * Cash
  * Bank
  * E-Wallet
* Initial Balance

PAGE 5 — TRANSACTIONS:

Create a transaction management page.

Header:
"Transactions"

Top section:

* Search transaction
* Filter by date
* Filter by type
* Filter by category
* Filter by account
* Add Transaction button

Transaction table:

Columns:

* Date
* Description
* Category
* Account
* Type
* Amount
* Actions

Income should visually differ from expenses.

Example:

Salary
Income
MB Bank
+20,000,000 ₫

Lunch
Expense
MoMo
-75,000 ₫

ADD TRANSACTION MODAL:

Fields:

* Type

  * Income
  * Expense
* Amount
* Account
* Category
* Description
* Transaction Date

Show clear validation.

PAGE 6 — CATEGORIES:

Purpose:
Manage income and expense categories.

Create two sections:

INCOME CATEGORIES:

* Salary
* Bonus
* Freelance
* Investment
* Other

EXPENSE CATEGORIES:

* Food
* Transport
* Shopping
* Entertainment
* Education
* Bills
* Other

Each category should have:

* Icon
* Category name
* Type
* Number of transactions
* Edit
* Delete

Add Category button.

ADD CATEGORY MODAL:

* Category Name
* Type
* Icon selector

PAGE 7 — BUDGETS:

Purpose:
Allow users to set monthly spending limits.

Header:
"Monthly Budgets"

Show current month prominently.

Budget cards:

Food
Spent: 1,200,000 ₫
Budget: 2,000,000 ₫
Remaining: 800,000 ₫
Progress: 60%

Shopping
Spent: 1,800,000 ₫
Budget: 1,500,000 ₫
Exceeded by: 300,000 ₫

Use progress bars.

When budget is exceeded:

* Show friendly warning
* Use soft orange/red
* Example: "Oops! You've gone a little over your shopping budget."

Add Budget button.

ADD BUDGET MODAL:

* Category
* Amount
* Month
* Year

Prevent duplicate budgets for the same category/month/year.

PAGE 8 — FINANCIAL GOALS:

Purpose:
Help users track savings goals.

Header:
"Financial Goals"

Display attractive goal cards.

Example:

New Laptop
Target: 30,000,000 ₫
Saved: 18,000,000 ₫
Remaining: 12,000,000 ₫
Progress: 60%
Deadline: June 30, 2027

Use a large circular progress indicator or horizontal progress bar.

Other examples:

* New Phone
* Emergency Fund
* Vacation
* New Bicycle

Each goal:

* Name
* Target amount
* Current amount
* Progress
* Deadline
* Status
* Edit
* Delete

Statuses:

* Active
* Completed
* Cancelled

ADD GOAL MODAL:

* Goal Name
* Target Amount
* Current Amount
* Deadline

PAGE 9 — USER PROFILE:

Show:

* Avatar
* Full Name
* Email
* Account creation date

Allow editing:

* Full Name
* Email

Do not create additional database entities.

PAGE 10 — EMPTY STATES:

Design cute empty states for:

* No accounts
* No transactions
* No budgets
* No categories
* No financial goals

Use small friendly illustrations.

Examples:
"No transactions yet"
"Your money story starts here ✨"

"No financial goals yet"
"Let's give your savings a little dream!"

PAGE 11 — RESPONSIVE DESIGN:

Create responsive versions for:

* Desktop
* Tablet
* Mobile

On mobile:

* Convert sidebar into bottom navigation or hamburger menu
* Cards become single-column
* Tables become transaction cards
* Charts remain readable
* Modals become full-screen or bottom sheets

UX REQUIREMENTS:

1. Keep navigation simple.
2. Users should be able to add a transaction within a few clicks.
3. Important financial numbers should be visually obvious.
4. Use clear icons for income, expenses, accounts, budgets and goals.
5. Use friendly microcopy.
6. Avoid information overload.
7. Keep consistent spacing and component design.
8. Use confirmation dialogs before deleting data.
9. Use toast messages for successful actions.
10. Include loading, empty and error states.

DATABASE FEATURE MAPPING:

Users:

* Login
* Register
* Profile

Accounts:

* Account management
* Balance management

Categories:

* Income categories
* Expense categories

Transactions:

* Income
* Expenses
* Transaction history
* Filtering
* Search
* Statistics

Budgets:

* Monthly spending limits
* Category-based budgets
* Budget progress

FinancialGoals:

* Savings goals
* Target amount
* Current amount
* Progress
* Deadline
* Status

FINAL FIGMA OUTPUT:

Create a complete design system and high-fidelity UI screens for all major pages.

Include:

* Desktop screens
* Mobile screens
* Components
* Modals
* Forms
* Charts
* Tables
* Cards
* Navigation
* Empty states
* Loading states
* Error states

The final design should feel like a polished real-world fintech application, but with a cute, warm, approachable personality.

Overall vibe:
"Cute + Clean + Modern + Friendly Fintech"
