import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const TransactionTable = ({ transactions, onEdit, onDelete, showType = true }) => {
  if (!transactions || transactions.length === 0) {
    return <div className="text-center text-muted py-5">No transactions found</div>;
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            {showType && <th className="small">Type</th>}
            <th className="small">Category / Source</th>
            <th className="small">Description</th>
            <th className="small">Date</th>
            <th className="small">Amount</th>
            {(onEdit || onDelete) && <th className="small">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={`${tx.type || 'tx'}-${tx.id}`}>
              {showType && (
                <td>
                  <span className={`badge ${tx.type === 'income' ? 'bg-success' : 'bg-danger'}`}>
                    {tx.type === 'income' ? 'Income' : 'Expense'}
                  </span>
                </td>
              )}
              <td><span className="badge bg-light text-dark border">{tx.category || tx.source}</span></td>
              <td className="small text-muted">{tx.description || tx.source || '—'}</td>
              <td className="small">{new Date(tx.date).toLocaleDateString('en-IN')}</td>
              <td className={`fw-semibold small ${tx.type === 'income' ? 'text-success' : 'text-danger'}`}>
                {tx.type === 'income' ? '+' : '-'}₹{Number(tx.amount).toLocaleString()}
              </td>
              {(onEdit || onDelete) && (
                <td>
                  <div className="d-flex gap-1">
                    {onEdit && <button className="btn btn-sm btn-outline-secondary p-1" onClick={() => onEdit(tx)}><FiEdit2 size={13} /></button>}
                    {onDelete && <button className="btn btn-sm btn-outline-danger p-1" onClick={() => onDelete(tx.id)}><FiTrash2 size={13} /></button>}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
