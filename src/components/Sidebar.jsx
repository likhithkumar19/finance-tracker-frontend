import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiTrendingDown, FiTrendingUp, FiTarget, FiList, FiUser, FiLogOut, FiDollarSign } from 'react-icons/fi';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const navItems = [
    { to: '/dashboard', icon: <FiHome size={18} />, label: 'Dashboard' },
    { to: '/expenses', icon: <FiTrendingDown size={18} />, label: 'Expenses' },
    { to: '/income', icon: <FiTrendingUp size={18} />, label: 'Income' },
    { to: '/budget', icon: <FiTarget size={18} />, label: 'Budget' },
    { to: '/history', icon: <FiList size={18} />, label: 'History' },
    { to: '/profile', icon: <FiUser size={18} />, label: 'Profile' },
  ];

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1040, backdropFilter: 'blur(2px)' }}
        />
      )}
      <div style={{
        position: 'fixed', top: 0, left: 0, height: '100%', width: '260px', zIndex: 1045,
        background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
        display: 'flex', flexDirection: 'column', padding: '24px 16px',
        boxShadow: '4px 0 24px rgba(0,0,0,0.15)'
      }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', padding: '0 8px' }}>
          <div style={{
            width: 40, height: 40, borderRadius: '10px',
            background: 'linear-gradient(135deg, #818cf8, #6366f1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99,102,241,0.4)'
          }}>
            <FiDollarSign size={20} color="#fff" />
          </div>
          <div>
            <span style={{ fontWeight: 800, fontSize: '18px', color: '#fff', letterSpacing: '-0.3px' }}>FinTracker</span>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Finance Manager</p>
          </div>
        </div>

        {/* User Info */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px',
          padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #818cf8, #a78bfa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '16px', color: '#fff'
          }}>
            {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ margin: 0, fontWeight: 600, fontSize: '13px', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.firstName} {user?.lastName}
            </p>
            <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>{user?.role || 'User'}</p>
          </div>
        </div>

        {/* Nav Label */}
        <p style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 8px', marginBottom: '8px' }}>
          NAVIGATION
        </p>

        {/* Nav Items */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '11px 14px', borderRadius: '10px',
                textDecoration: 'none', fontSize: '14px', fontWeight: 500,
                transition: 'all 0.2s ease',
                background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
                borderLeft: isActive ? '3px solid #818cf8' : '3px solid transparent',
              })}
            >
              {item.icon} {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '11px 14px', borderRadius: '10px', border: 'none',
            background: 'rgba(239,68,68,0.15)', color: '#fca5a5',
            fontSize: '14px', fontWeight: 500, cursor: 'pointer',
            transition: 'all 0.2s ease', marginTop: '8px',
            border: '1px solid rgba(239,68,68,0.2)'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.25)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
        >
          <FiLogOut size={16} /> Logout
        </button>
      </div>
    </>
  );
};

export default Sidebar;
