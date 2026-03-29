import { useState, useEffect } from 'react';
import { incomeAPI } from '../services/api';
import IncomeForm from '../components/IncomeForm';
import TransactionTable from '../components/TransactionTable';
import { FiPlus } from 'react-icons/fi';

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editIncome, setEditIncome] = useState(null);

  const fetchIncomes = async () => {
    try {
      const res = await incomeAPI.getAll();
      setIncomes(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchIncomes(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this income?')) return;
    try {
      await incomeAPI.delete(id);
      setIncomes((prev) => prev.filter((i) => i.id !== id));
    } catch (err) { console.error(err); }
  };

  const handleEdit = (income) => { setEditIncome(income); setShowForm(true); };
  const handleSuccess = () => { setShowForm(false); setEditIncome(null); fetchIncomes(); };

  const total = incomes.reduce((sum, i) => sum + Number(i.amount), 0);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Income</h4>
          <p className="text-muted small mb-0">Manage your income sources</p>
        </div>
        <button className="btn btn-success btn-sm d-flex align-items-center gap-1" onClick={() => { setEditIncome(null); setShowForm(true); }}>
          <FiPlus /> Add Income
        </button>
      </div>

      <div className="alert alert-light border d-flex justify-content-between py-2 mb-3">
        <span className="small">Total Income</span>
        <strong className="text-success">₹{total.toLocaleString()}</strong>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center py-5"><div className="spinner-border text-primary" /></div>
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            <TransactionTable transactions={incomes.map((i) => ({ ...i, type: 'income' }))} onEdit={handleEdit} onDelete={handleDelete} showType={false} />
          </div>
        </div>
      )}

      {showForm && <IncomeForm income={editIncome} onSuccess={handleSuccess} onCancel={() => { setShowForm(false); setEditIncome(null); }} />}
    </div>
  );
};

export default Income;
