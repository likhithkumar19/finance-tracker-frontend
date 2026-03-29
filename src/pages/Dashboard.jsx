import { useState, useEffect } from 'react';
import { expenseAPI, incomeAPI, budgetAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiPieChart } from 'react-icons/fi';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const Dashboard = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [expRes, incRes, budRes] = await Promise.all([expenseAPI.getAll(), incomeAPI.getAll(), budgetAPI.getAll()]);
        setExpenses(expRes.data || []);
        setIncomes(incRes.data || []);
        setBudgets(budRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const totalIncome = incomes.reduce((sum, i) => sum + Number(i.amount), 0);
  const totalExpense = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const balance = totalIncome - totalExpense;

  const categoryData = expenses.reduce((acc, exp) => {
    const existing = acc.find((a) => a.name === exp.category);
    if (existing) existing.value += Number(exp.amount);
    else acc.push({ name: exp.category, value: Number(exp.amount) });
    return acc;
  }, []);

  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    const monthNum = date.getMonth();
    const monthIncome = incomes.filter((inc) => { const d = new Date(inc.date); return d.getMonth() === monthNum && d.getFullYear() === year; }).reduce((sum, inc) => sum + Number(inc.amount), 0);
    const monthExpense = expenses.filter((exp) => { const d = new Date(exp.date); return d.getMonth() === monthNum && d.getFullYear() === year; }).reduce((sum, exp) => sum + Number(exp.amount), 0);
    return { month, income: monthIncome, expense: monthExpense };
  });

  const recentTransactions = [
    ...expenses.map((e) => ({ ...e, type: 'expense' })),
    ...incomes.map((i) => ({ ...i, type: 'income' })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  if (loading) return <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}><div className="spinner-border text-primary" /></div>;

  const summaryCards = [
    { label: 'Total Income', value: totalIncome, icon: <FiTrendingUp size={20} />, bg: 'bg-success' },
    { label: 'Total Expenses', value: totalExpense, icon: <FiTrendingDown size={20} />, bg: 'bg-danger' },
    { label: 'Balance', value: balance, icon: <FiDollarSign size={20} />, bg: balance >= 0 ? 'bg-primary' : 'bg-danger' },
    { label: 'Monthly Savings', value: balance, icon: <FiPieChart size={20} />, bg: 'bg-purple' },
  ];

  return (
    <div>
      <div className="mb-4">
        <h4 className="fw-bold mb-1">Dashboard</h4>
        <p className="text-muted small">Welcome back, {user?.firstName}! Here's your financial overview.</p>
      </div>

      <div className="row g-3 mb-4">
        {summaryCards.map((card) => (
          <div key={card.label} className="col-6 col-md-3">
            <div className={`card border-0 text-white ${card.bg}`} style={{ background: card.bg === 'bg-purple' ? '#8b5cf6' : undefined }}>
              <div className="card-body d-flex align-items-center gap-3">
                <div className="bg-white bg-opacity-25 rounded p-2">{card.icon}</div>
                <div>
                  <p className="mb-0 small opacity-75">{card.label}</p>
                  <h5 className="mb-0 fw-bold">₹{card.value.toLocaleString()}</h5>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-7">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="fw-semibold mb-3">Monthly Income vs Expenses</h6>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(val) => `₹${val.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Income" />
                  <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expense" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-md-5">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="fw-semibold mb-3">Expense by Category</h6>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {categoryData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(val) => `₹${val.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted text-center mt-5">No expense data yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {budgets.length > 0 && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <h6 className="fw-semibold mb-3">Budget Overview</h6>
            {budgets.map((budget) => {
              const spent = expenses.filter((e) => e.category === budget.category).reduce((sum, e) => sum + Number(e.amount), 0);
              const percentage = budget.limitAmount > 0 ? Math.min((spent / budget.limitAmount) * 100, 100) : 0;
              const isOver = spent > budget.limitAmount;
              const color = percentage >= 100 ? '#ef4444' : percentage >= 80 ? '#f59e0b' : '#10b981';
              return (
                <div key={budget.id} className="mb-3">
                  <div className="d-flex justify-content-between small mb-1">
                    <span className="fw-medium">{budget.category}</span>
                    <span className={isOver ? 'text-danger' : ''}>₹{spent.toLocaleString()} / ₹{budget.limitAmount?.toLocaleString()}</span>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div className="progress-bar" style={{ width: `${percentage}%`, backgroundColor: color }} />
                  </div>
                  {isOver && <small className="text-danger">⚠ Over Budget!</small>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h6 className="fw-semibold mb-3">Recent Transactions</h6>
          {recentTransactions.length === 0 ? (
            <p className="text-muted text-center">No transactions yet. Start by adding income or expenses.</p>
          ) : (
            recentTransactions.map((tx) => (
              <div key={`${tx.type}-${tx.id}`} className="d-flex align-items-center gap-3 py-2 border-bottom">
                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 36, height: 36, background: tx.type === 'income' ? '#d1fae5' : '#fee2e2', flexShrink: 0 }}>
                  {tx.type === 'income' ? <FiTrendingUp color="#10b981" /> : <FiTrendingDown color="#ef4444" />}
                </div>
                <div className="flex-grow-1">
                  <p className="mb-0 small fw-medium">{tx.category || tx.source}</p>
                  <p className="mb-0 text-muted" style={{ fontSize: '12px' }}>{new Date(tx.date).toLocaleDateString('en-IN')}</p>
                </div>
                <span className={`fw-semibold small ${tx.type === 'income' ? 'text-success' : 'text-danger'}`}>
                  {tx.type === 'income' ? '+' : '-'}₹{Number(tx.amount).toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
