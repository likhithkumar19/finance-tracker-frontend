import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiShield } from 'react-icons/fi';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('info');

  return (
    <div>
      <div className="mb-4">
        <h4 className="fw-bold mb-1">Profile</h4>
        <p className="text-muted small mb-0">Manage your account information</p>
      </div>

      <div className="row g-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm text-center p-4">
            <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold mx-auto mb-3" style={{ width: 72, height: 72, fontSize: '28px' }}>
              {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <h5 className="fw-bold mb-1">{user?.firstName} {user?.lastName}</h5>
            <p className="text-muted small mb-2">{user?.email}</p>
            <span className="badge bg-primary">{user?.role || 'USER'}</span>
          </div>
        </div>

        <div className="col-md-9">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom">
              <ul className="nav nav-tabs card-header-tabs">
                <li className="nav-item">
                  <button className={`nav-link ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>Account Info</button>
                </li>
                <li className="nav-item">
                  <button className={`nav-link ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>Security</button>
                </li>
              </ul>
            </div>
            <div className="card-body">
              {activeTab === 'info' && (
                <div className="d-flex flex-column gap-3">
                  {[
                    { icon: <FiUser />, label: 'Full Name', value: `${user?.firstName} ${user?.lastName}` },
                    { icon: <FiMail />, label: 'Email Address', value: user?.email },
                    { icon: <FiShield />, label: 'Role', value: user?.role || 'USER' },
                  ].map((row) => (
                    <div key={row.label} className="d-flex align-items-center gap-3 p-3 bg-light rounded">
                      <span className="text-primary fs-5">{row.icon}</span>
                      <div>
                        <p className="text-muted small mb-0">{row.label}</p>
                        <p className="fw-medium mb-0">{row.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'security' && (
                <div className="d-flex align-items-start gap-3 p-3 bg-light rounded">
                  <FiShield className="text-primary fs-4 mt-1" />
                  <div>
                    <h6 className="fw-semibold">Password & Security</h6>
                    <p className="text-muted small mb-1">Your account is secured with BCrypt password hashing and JWT authentication.</p>
                    <p className="text-muted small mb-0">To change your password, please contact your administrator or use the password reset feature.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
