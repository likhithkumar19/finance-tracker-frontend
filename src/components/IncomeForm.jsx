import { useState, useEffect } from 'react';
import { incomeAPI } from '../services/api';

const IncomeForm = ({ income, onSuccess, onCancel }) => {
  const [form, setForm] = useState({ source: '', amount: '', description: '', date: new Date().toISOString().split('T')[0] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (income) setForm({ source: income.source, amount: income.amount, description: income.description || '', date: income.date });
  }, [income]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (income) await incomeAPI.update(income.id, form);
      else await incomeAPI.create(form);
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
            <h5 className="modal-title">{income ? 'Edit Income' : 'Add Income'}</h5>
            <button type="button" className="btn-close" onClick={onCancel} />
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-medium">Source</label>
                <input type="text" className="form-control" required value={form.source}
                  onChange={(e) => setForm({ ...form, source: e.target.value })} placeholder="e.g. Salary, Freelance" />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-medium">Amount (₹)</label>
                <input type="number" className="form-control" min="0" step="0.01" required value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0.00" />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-medium">Description</label>
                <input type="text" className="form-control" value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="e.g. Monthly salary" />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-medium">Date</label>
                <input type="date" className="form-control" required value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-secondary btn-sm" onClick={onCancel}>Cancel</button>
                <button type="submit" className="btn btn-success btn-sm" disabled={loading}>
                  {loading ? <span className="spinner-border spinner-border-sm" /> : income ? 'Update' : 'Add Income'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeForm;
