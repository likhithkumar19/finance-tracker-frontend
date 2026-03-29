import { useState, useEffect } from 'react';
import { expenseAPI } from '../services/api';

const CATEGORIES = ['Groceries', 'Utilities', 'Entertainment', 'Transportation', 'Shopping', 'Others'];

const ExpenseForm = ({ expense, onSuccess, onCancel }) => {
  const [form, setForm] = useState({ amount: '', category: 'Groceries', description: '', date: new Date().toISOString().split('T')[0] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (expense) setForm({ amount: expense.amount, category: expense.category, description: expense.description, date: expense.date });
  }, [expense]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (expense) await expenseAPI.update(expense.id, form);
      else await expenseAPI.create(form);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{expense ? 'Edit Expense' : 'Add Expense'}</h5>
            <button type="button" className="btn-close" onClick={onCancel} />
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-medium">Amount (₹)</label>
                <input type="number" className="form-control" min="0" step="0.01" required value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0.00" />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-medium">Category</label>
                <select className="form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map((cat) => <option key={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label small fw-medium">Description</label>
                <input type="text" className="form-control" value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Enter description" />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-medium">Date</label>
                <input type="date" className="form-control" required value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-secondary btn-sm" onClick={onCancel}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
                  {loading ? <span className="spinner-border spinner-border-sm" /> : expense ? 'Update' : 'Add Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseForm;
