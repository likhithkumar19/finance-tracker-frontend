import { useAuth } from '../context/AuthContext';
import { FiMenu, FiBell } from 'react-icons/fi';

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="bg-white border-bottom px-4 py-2 d-flex align-items-center justify-content-between">
      <button className="btn btn-light btn-sm" onClick={onMenuClick}>
        <FiMenu />
      </button>
      <div className="d-flex align-items-center gap-3">
        <button className="btn btn-light btn-sm position-relative">
          <FiBell />
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '10px' }}>3</span>
        </button>
        <div className="d-flex align-items-center gap-2">
          <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: 32, height: 32, fontSize: '13px' }}>
            {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <span className="small fw-medium">{user?.firstName || 'User'}</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
