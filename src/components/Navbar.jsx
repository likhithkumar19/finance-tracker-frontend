import { useAuth } from '../context/AuthContext';
import { FiMenu, FiBell, FiSun } from 'react-icons/fi';

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header style={{
      background: '#fff',
      borderBottom: '1px solid #e2e8f0',
      padding: '0 24px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={onMenuClick}
          style={{
            border: 'none', background: '#f8fafc', borderRadius: '8px',
            width: 36, height: 36, display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', color: '#64748b',
            transition: 'all 0.2s'
          }}
        >
          <FiMenu size={18} />
        </button>
        <div>
          <p style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>
            Welcome back, {user?.firstName || 'User'} 👋
          </p>
          <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button style={{
          border: 'none', background: '#f8fafc', borderRadius: '8px',
          width: 36, height: 36, display: 'flex', alignItems: 'center',
          justifyContent: 'center', cursor: 'pointer', color: '#64748b',
          position: 'relative'
        }}>
          <FiBell size={18} />
          <span style={{
            position: 'absolute', top: 6, right: 6, width: 8, height: 8,
            background: '#ef4444', borderRadius: '50%', border: '2px solid #fff'
          }} />
        </button>

        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '6px 12px 6px 6px', borderRadius: '10px',
          background: '#f8fafc', border: '1px solid #e2e8f0', cursor: 'pointer'
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '8px',
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '13px', color: '#fff'
          }}>
            {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
              {user?.firstName} {user?.lastName}
            </p>
            <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>{user?.role || 'User'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
