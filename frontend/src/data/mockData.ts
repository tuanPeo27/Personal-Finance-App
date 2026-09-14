export const fmtVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

export const accounts = [
  { id: 1, name: "Tiền mặt", type: "Tiền mặt", balance: 2500000, transactions: 12, icon: "💵", color: "#fbbf24" },
  { id: 2, name: "Vietcombank", type: "Ngân hàng", balance: 15800000, transactions: 34, icon: "🏦", color: "#7c6fcd" },
  { id: 3, name: "MB Bank", type: "Ngân hàng", balance: 8200000, transactions: 21, icon: "🏧", color: "#4ecdc4" },
  { id: 4, name: "MoMo", type: "Ví điện tử", balance: 1500000, transactions: 18, icon: "📱", color: "#ff9a8b" },
  { id: 5, name: "ZaloPay", type: "Ví điện tử", balance: 750000, transactions: 9, icon: "💜", color: "#818cf8" },
];

export const categories = [
  { id: 1, name: "Lương", type: "income" as const, icon: "💼", transactions: 3 },
  { id: 2, name: "Thưởng", type: "income" as const, icon: "🎁", transactions: 1 },
  { id: 3, name: "Freelance", type: "income" as const, icon: "💻", transactions: 5 },
  { id: 4, name: "Đầu tư", type: "income" as const, icon: "📈", transactions: 2 },
  { id: 5, name: "Khác (thu)", type: "income" as const, icon: "💰", transactions: 4 },
  { id: 6, name: "Ăn uống", type: "expense" as const, icon: "🍜", transactions: 42 },
  { id: 7, name: "Di chuyển", type: "expense" as const, icon: "🚗", transactions: 15 },
  { id: 8, name: "Mua sắm", type: "expense" as const, icon: "🛍", transactions: 18 },
  { id: 9, name: "Giải trí", type: "expense" as const, icon: "🎮", transactions: 8 },
  { id: 10, name: "Hóa đơn", type: "expense" as const, icon: "📄", transactions: 6 },
  { id: 11, name: "Giáo dục", type: "expense" as const, icon: "📚", transactions: 4 },
  { id: 12, name: "Khác (chi)", type: "expense" as const, icon: "🔖", transactions: 7 },
];

export const transactions = [
  { id: 1, date: "2026-09-14", description: "Lương tháng 9", category: "Lương", categoryIcon: "💼", account: "MB Bank", type: "income" as const, amount: 20000000 },
  { id: 2, date: "2026-09-13", description: "Ăn trưa với đồng nghiệp", category: "Ăn uống", categoryIcon: "🍜", account: "MoMo", type: "expense" as const, amount: 185000 },
  { id: 3, date: "2026-09-12", description: "Grab đi làm", category: "Di chuyển", categoryIcon: "🚗", account: "MoMo", type: "expense" as const, amount: 45000 },
  { id: 4, date: "2026-09-11", description: "Freelance dự án web", category: "Freelance", categoryIcon: "💻", account: "Vietcombank", type: "income" as const, amount: 5000000 },
  { id: 5, date: "2026-09-10", description: "Hoá đơn điện tháng 9", category: "Hóa đơn", categoryIcon: "📄", account: "Vietcombank", type: "expense" as const, amount: 320000 },
  { id: 6, date: "2026-09-09", description: "Mua quần áo", category: "Mua sắm", categoryIcon: "🛍", account: "Vietcombank", type: "expense" as const, amount: 890000 },
  { id: 7, date: "2026-09-08", description: "Phim tại CGV", category: "Giải trí", categoryIcon: "🎮", account: "MoMo", type: "expense" as const, amount: 120000 },
  { id: 8, date: "2026-09-07", description: "Khóa học lập trình", category: "Giáo dục", categoryIcon: "📚", account: "Vietcombank", type: "expense" as const, amount: 1200000 },
  { id: 9, date: "2026-09-06", description: "Thưởng quý 3", category: "Thưởng", categoryIcon: "🎁", account: "MB Bank", type: "income" as const, amount: 3000000 },
  { id: 10, date: "2026-09-05", description: "Cà phê", category: "Ăn uống", categoryIcon: "🍜", account: "Tiền mặt", type: "expense" as const, amount: 55000 },
  { id: 11, date: "2026-09-04", description: "Sách giáo trình", category: "Giáo dục", categoryIcon: "📚", account: "Tiền mặt", type: "expense" as const, amount: 180000 },
  { id: 12, date: "2026-09-03", description: "Bán đồ cũ", category: "Khác (thu)", categoryIcon: "💰", account: "MoMo", type: "income" as const, amount: 800000 },
];

export const budgets = [
  { id: 1, category: "Ăn uống", icon: "🍜", amount: 3000000, spent: 1850000, month: 9, year: 2026 },
  { id: 2, category: "Mua sắm", icon: "🛍", amount: 1500000, spent: 1890000, month: 9, year: 2026 },
  { id: 3, category: "Di chuyển", icon: "🚗", amount: 800000, spent: 450000, month: 9, year: 2026 },
  { id: 4, category: "Giải trí", icon: "🎮", amount: 500000, spent: 120000, month: 9, year: 2026 },
  { id: 5, category: "Giáo dục", icon: "📚", amount: 2000000, spent: 1380000, month: 9, year: 2026 },
];

export const goals = [
  { id: 1, name: "Laptop mới", icon: "💻", target: 30000000, current: 18000000, deadline: "2027-06-30", status: "active" as const },
  { id: 2, name: "Điện thoại mới", icon: "📱", target: 20000000, current: 20000000, deadline: "2026-12-31", status: "completed" as const },
  { id: 3, name: "Quỹ khẩn cấp", icon: "🛡", target: 50000000, current: 28500000, deadline: "2027-12-31", status: "active" as const },
  { id: 4, name: "Du lịch Nhật Bản", icon: "✈️", target: 40000000, current: 8000000, deadline: "2028-03-31", status: "active" as const },
  { id: 5, name: "Xe đạp mới", icon: "🚲", target: 8000000, current: 0, deadline: "2027-03-31", status: "cancelled" as const },
];

export const chartMonths = ["T4", "T5", "T6", "T7", "T8", "T9"];
export const incomeData = [18000000, 23000000, 20000000, 28000000, 22000000, 28000000];
export const expenseData = [12000000, 15000000, 11000000, 18000000, 14000000, 16000000];
export const balanceData = [45000000, 53000000, 62000000, 72000000, 80000000, 92000000];
