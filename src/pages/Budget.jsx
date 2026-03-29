import { useState, useEffect } from 'react';
import { budgetAPI, expenseAPI } from '../services/api';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

const CATEGORIES = ['Groceries', 'Utilities', 'Entertainment', 'Transportation', 'Shopping', 'Others'];

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editBudget, setEditBudget] = useState(null);
  const [form, setForm] = useState({ category: 'Groceries', limitAmount: '', month: new Date().toISOString().slice(0, 7) });
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const [budRes, expRes] = await Promise.all([budgetAPI.getAll(), expenseAPI.getAll()]);
      setBudgets(budRes.data || []);
      setExpenses(expRes.data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const getSpent = (category) => expenses.filter((e) => e.category === category).reduce((sum, e) => sum + Number(e.amount), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editBudget) await budgetAPI.update(editBudget.id, form);
      else await budgetAPI.create(form);
      setShowForm(false);
      setEditBudget(null);
      setForm({ category: 'Groceries', limitAmount: '', month: new Date().toISOString().slice(0, 7) });
      fetchData();
    } catch (err) { setError(err.response?.data?.message || 'Failed to save budget'); }
  };

  const handleEdit = (budget) => {
    setEditBudget(budget);
    setForm({ category: budget.category, limitAmount: budget.limitAmount, month: budget.month || new Date().toISOString().slice(0, 7) });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this budget?')) return;
    try { await budgetAPI.delete(id); setBudgets((prev) => prev.filter((b) => b.id !== id)); }
    catch (err) { console.error(err); }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Budget</h4>
          <p className="text-muted small mb-0">Set and monitor your spending limits</p>
        </div>
        <button className="btn btn-primary btn-sm d-flex align-items-center gap-1"
          onClick={() => { setEditBudget(null); setForm({ category: 'Groceries', limitAmount: '', month: new Date().toISOString().slice(0, 7) }); setShowForm(true); }}>
          <FiPlus /> Set Budget
        </button>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center py-5"><div className="spinner-border text-primary" /></div>
      ) : budgets.length === 0 ? (
        <div className="card border-0 shadow-sm"><div className="card-body text-center text-muted py-5">No budgets set yet. Click "Set Budget" to get started.</div></div>
      ) : (
        <div className="row g-3">
          {budgets.map((budget) => {
            const spent = getSpent(budget.category);
            const percentage = budget.limitAmount > 0 ? Math.min((spent / budget.limitAmount) * 100, 100) : 0;
            const isOver = spent > budget.limitAmount;
            const color = percentage >= 100 ? '#ef4444' : percentage >= 80 ? '#f59e0b' : '#10b981';
            return (
              <div key={budget.id} className="col-md-4">
                <div className={`card border-0 shadow-sm ${isOver ? 'border-danger border' : ''}`}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="fw-semibold mb-0">{budget.category}</h6>
                      <div className="d-flex gap-1">
                        <button className="btn btn-sm btn-outline-secondary p-1" onClick={() => handleEdit(budget)}><FiEdit2 size={13} /></button>
                        <button className="btn btn-sm btn-outline-danger p-1" onClick={() => handleDelete(budget.id)}><FiTrash2 size={13} /></button>
                      </div>
                    </div>
                    <p className="small text-muted mb-2">₹{spent.toLocaleString()} spent of ₹{Number(budget.limitAmount).toLocaleString()}</p>
                    <div className="progress mb-2" style={{ height: '8px' }}>
                      <div className="progress-bar" style={{ width: `${percentage}%`, backgroundColor: color }} />
                    </div>
                    <div className="d-flex justify-content-between small">
                      <span style={{ color }}>{percentage.toFixed(1)}% used</span>
                      {isOver
                        ? <span className="text-danger fw-medium">⚠ Over by ₹{(spent - budget.limitAmount).toLocaleString()}</span>
                        : <span className="text-success">₹{(budget.limitAmount - spent).toLocaleString()} left</span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editBudget ? 'Edit Budget' : 'Set Budget'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowForm(false)} />
              </div>
              <div className="modal-body">
                {error && <div className="alert alert-danger py-2">{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-medium">Category</label>
                    <select className="form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                      {CATEGORIES.map((cat) => <option key={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-medium">Monthly Limit (₹)</label>
                    <input type="number" className="form-control" min="0" step="0.01" required value={form.limitAmount}
                      onChange={(e) => setForm({ ...form, limitAmount: e.target.value })} placeholder="0.00" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-medium">Month</label>
                    <input type="month" className="form-control" required value={form.month}
                      onChange={(e) => setForm({ ...form, month: e.target.value })} />
                  </div>
                  <div className="d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary btn-sm">{editBudget ? 'Update' : 'Set Budget'}</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budget;
