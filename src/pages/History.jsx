import { useState, useEffect } from 'react';
import { expenseAPI, incomeAPI } from '../services/api';
import TransactionTable from '../components/TransactionTable';
import { FiFilter } from 'react-icons/fi';

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [expRes, incRes] = await Promise.all([expenseAPI.getAll(), incomeAPI.getAll()]);
        const combined = [
          ...(expRes.data || []).map((e) => ({ ...e, type: 'expense' })),
          ...(incRes.data || []).map((i) => ({ ...i, type: 'income' })),
        ].sort((a, b) => new Date(b.date) - new Date(a.date));
        setTransactions(combined);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const filtered = transactions.filter((tx) => {
    const matchSearch = search === '' || (tx.category || '').toLowerCase().includes(search.toLowerCase()) || (tx.source || '').toLowerCase().includes(search.toLowerCase()) || (tx.description || '').toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || tx.type === typeFilter;
    const matchFrom = !dateFrom || new Date(tx.date) >= new Date(dateFrom);
    const matchTo = !dateTo || new Date(tx.date) <= new Date(dateTo);
    return matchSearch && matchType && matchFrom && matchTo;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const totalIncome = filtered.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
  const totalExpense = filtered.filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);

  return (
    <div>
      <div className="mb-4">
        <h4 className="fw-bold mb-1">Transaction History</h4>
        <p className="text-muted small mb-0">View all your income and expense records</p>
      </div>

      <div className="row g-3 mb-4">
        {[
          { label: 'Filtered Income', value: `+₹${totalIncome.toLocaleString()}`, cls: 'text-success' },
          { label: 'Filtered Expenses', value: `-₹${totalExpense.toLocaleString()}`, cls: 'text-danger' },
          { label: 'Net', value: `₹${(totalIncome - totalExpense).toLocaleString()}`, cls: totalIncome - totalExpense >= 0 ? 'text-success' : 'text-danger' },
        ].map((s) => (
          <div key={s.label} className="col-md-4">
            <div className="card border-0 shadow-sm text-center py-3">
              <p className="text-muted small mb-1">{s.label}</p>
              <h5 className={`fw-bold mb-0 ${s.cls}`}>{s.value}</h5>
            </div>
          </div>
        ))}
      </div>

      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body">
          <div className="row g-2 align-items-end">
            <div className="col-md-4">
              <input type="text" className="form-control form-control-sm" placeholder="Search by category, source, description..." value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} />
            </div>
            <div className="col-md-2">
              <select className="form-select form-select-sm" value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}>
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div className="col-md-2">
              <input type="date" className="form-control form-control-sm" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1); }} />
            </div>
            <div className="col-md-2">
              <input type="date" className="form-control form-control-sm" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1); }} />
            </div>
            <div className="col-md-2">
              <button className="btn btn-outline-secondary btn-sm w-100 d-flex align-items-center justify-content-center gap-1"
                onClick={() => { setSearch(''); setTypeFilter('all'); setDateFrom(''); setDateTo(''); setCurrentPage(1); }}>
                <FiFilter /> Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center py-5"><div className="spinner-border text-primary" /></div>
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            <TransactionTable transactions={paginated} showType={true} />
          </div>
          {totalPages > 1 && (
            <div className="card-footer d-flex justify-content-between align-items-center">
              <button className="btn btn-sm btn-outline-secondary" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>Previous</button>
              <span className="small text-muted">Page {currentPage} of {totalPages}</span>
              <button className="btn btn-sm btn-outline-secondary" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>Next</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default History;
