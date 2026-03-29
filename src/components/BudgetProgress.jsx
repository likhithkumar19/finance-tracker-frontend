const BudgetProgress = ({ budget, spent }) => {
  const percentage = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
  const isOver = spent > budget;

  const getColor = () => {
    if (percentage >= 100) return '#ef4444';
    if (percentage >= 80) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div className="budget-progress-item">
      <div className="budget-progress-header">
        <span className="budget-category">{budget.category || 'Category'}</span>
        <span className={`budget-amount ${isOver ? 'over-budget' : ''}`}>
          ₹{spent?.toLocaleString()} / ₹{budget?.limitAmount?.toLocaleString()}
        </span>
      </div>
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${percentage}%`, backgroundColor: getColor() }}
        ></div>
      </div>
      <div className="budget-progress-footer">
        <span style={{ color: getColor() }}>{percentage.toFixed(1)}% used</span>
        {isOver && <span className="over-budget-badge">Over Budget!</span>}
      </div>
    </div>
  );
};

export default BudgetProgress;
