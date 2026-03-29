import { useState, useEffect } from 'react';
import { expenseAPI } from '../services/api';
import ExpenseForm from '../components/ExpenseForm';
import TransactionTable from '../components/TransactionTable';
import { FiPlus } from 'react-icons/fi';

const CATEGORIES = ['All', 'Groceries', 'Utilities', 'Entertainment', 'Transportation', 'Shopping', 'Others'];

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editExpense, setEditExpense] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');

  const fetchExpenses = async () => {
    try {
      const res = await expenseAPI.getAll();
      setExpenses(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExpenses(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await expenseAPI.delete(id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch (err) { console.error(err); }
  };

  const handleEdit = (expense) => { setEditExpense(expense); setShowForm(true); };
  const handleSuccess = () => { setShowForm(false); setEditExpense(null); fetchExpenses(); };

  const filtered = filterCategory === 'All' ? expenses : expenses.filter((e) => e.category === filterCategory);
  const total = filtered.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Expenses</h4>
          <p className="text-muted small mb-0">Track and manage your spending</p>
        </div>
        <button className="btn btn-primary btn-sm d-flex align-items-center gap-1" onClick={() => { setEditExpense(null); setShowForm(true); }}>
          <FiPlus /> Add Expense
        </button>
      </div>

      <div className="d-flex flex-wrap gap-2 mb-3">
        {CATEGORIES.map((cat) => (
          <button key={cat} className={`btn btn-sm ${filterCategory === cat ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setFilterCategory(cat)}>
            {cat}
          </button>
        ))}
      </div>

      <div className="alert alert-light border d-flex justify-content-between py-2 mb-3">
        <span className="small">Total {filterCategory !== 'All' ? filterCategory : ''} Expenses</span>
        <strong className="text-danger">₹{total.toLocaleString()}</strong>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center py-5"><div className="spinner-border text-primary" /></div>
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            <TransactionTable transactions={filtered.map((e) => ({ ...e, type: 'expense' }))} onEdit={handleEdit} onDelete={handleDelete} showType={false} />
          </div>
        </div>
      )}

      {showForm && <ExpenseForm expense={editExpense} onSuccess={handleSuccess} onCancel={() => { setShowForm(false); setEditExpense(null); }} />}
    </div>
  );
};

export default Expenses;
