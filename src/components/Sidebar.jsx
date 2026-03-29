import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiTrendingDown, FiTrendingUp, FiTarget, FiList, FiUser, FiLogOut, FiDollarSign } from 'react-icons/fi';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const navItems = [
    { to: '/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { to: '/expenses', icon: <FiTrendingDown />, label: 'Expenses' },
    { to: '/income', icon: <FiTrendingUp />, label: 'Income' },
    { to: '/budget', icon: <FiTarget />, label: 'Budget' },
    { to: '/history', icon: <FiList />, label: 'History' },
    { to: '/profile', icon: <FiUser />, label: 'Profile' },
  ];

  return (
    <>
      {isOpen && <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50" style={{ zIndex: 1040 }} onClick={onClose}></div>}
      <div className="position-fixed top-0 start-0 h-100 bg-white border-end d-flex flex-column p-3" style={{ width: '240px', zIndex: 1045 }}>
        <div className="d-flex align-items-center gap-2 mb-4 px-2">
          <FiDollarSign size={24} className="text-primary" />
          <span className="fw-bold fs-5">FinTracker</span>
        </div>

        <div className="d-flex align-items-center gap-2 mb-4 p-2 bg-light rounded">
          <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: 36, height: 36, flexShrink: 0 }}>
            {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="mb-0 fw-semibold text-truncate small">{user?.firstName} {user?.lastName}</p>
            <p className="mb-0 text-muted" style={{ fontSize: '11px' }}>{user?.role || 'User'}</p>
          </div>
        </div>

        <nav className="flex-grow-1 d-flex flex-column gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `d-flex align-items-center gap-2 px-3 py-2 rounded text-decoration-none small fw-medium ${isActive ? 'bg-primary text-white' : 'text-secondary'}`
              }
            >
              {item.icon} {item.label}
            </NavLink>
          ))}
        </nav>

        <button className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2 mt-3" onClick={handleLogout}>
          <FiLogOut /> Logout
        </button>
      </div>
    </>
  );
};

export default Sidebar;
