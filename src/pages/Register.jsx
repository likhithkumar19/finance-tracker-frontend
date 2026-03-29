import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiDollarSign } from 'react-icons/fi';

const Register = () => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    setError('');
    try {
      const { confirmPassword, ...registerData } = form;
      await register(registerData);
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex">
      <div className="d-none d-md-flex flex-column justify-content-center align-items-center bg-primary text-white p-5" style={{ width: '40%' }}>
        <FiDollarSign size={48} className="mb-3" />
        <h1 className="fw-bold">FinTracker</h1>
        <p className="text-white-50 mb-4">Start your financial journey today</p>
        <ul className="list-unstyled">
          {['✅ Free to use', '📊 Real-time analytics', '🔔 Budget alerts', '📱 Responsive design'].map(f => (
            <li key={f} className="mb-2">{f}</li>
          ))}
        </ul>
      </div>

      <div className="flex-grow-1 d-flex align-items-center justify-content-center p-4 bg-light">
        <div className="card shadow-sm p-4" style={{ width: '100%', maxWidth: '440px' }}>
          <h2 className="fw-bold mb-1">Create Account</h2>
          <p className="text-muted mb-4">Join thousands managing their finances</p>

          {error && <div className="alert alert-danger py-2">{error}</div>}
          {success && <div className="alert alert-success py-2">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col">
                <label className="form-label small fw-medium">First Name</label>
                <div className="input-group">
                  <span className="input-group-text"><FiUser /></span>
                  <input type="text" className="form-control" required value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="John" />
                </div>
              </div>
              <div className="col">
                <label className="form-label small fw-medium">Last Name</label>
                <div className="input-group">
                  <span className="input-group-text"><FiUser /></span>
                  <input type="text" className="form-control" required value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Doe" />
                </div>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label small fw-medium">Email Address</label>
              <div className="input-group">
                <span className="input-group-text"><FiMail /></span>
                <input type="email" className="form-control" required value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label small fw-medium">Password</label>
              <div className="input-group">
                <span className="input-group-text"><FiLock /></span>
                <input type={showPassword ? 'text' : 'password'} className="form-control" required value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min. 6 characters" />
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label small fw-medium">Confirm Password</label>
              <div className="input-group">
                <span className="input-group-text"><FiLock /></span>
                <input type="password" className="form-control" required value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Repeat password" />
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm" /> : 'Create Account'}
            </button>
          </form>

          <p className="text-center mt-3 mb-0 small">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
