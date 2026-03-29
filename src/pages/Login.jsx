import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiDollarSign } from 'react-icons/fi';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex">
      <div className="d-none d-md-flex flex-column justify-content-center align-items-center bg-primary text-white p-5" style={{ width: '40%' }}>
        <FiDollarSign size={48} className="mb-3" />
        <h1 className="fw-bold">FinTracker</h1>
        <p className="text-white-50 mb-4">Your personal finance companion</p>
        <ul className="list-unstyled">
          {['📊 Track income & expenses', '🎯 Set & monitor budgets', '📈 Visualize your finances', '🔒 Secure & private'].map(f => (
            <li key={f} className="mb-2">{f}</li>
          ))}
        </ul>
      </div>

      <div className="flex-grow-1 d-flex align-items-center justify-content-center p-4 bg-light">
        <div className="card shadow-sm p-4" style={{ width: '100%', maxWidth: '400px' }}>
          <h2 className="fw-bold mb-1">Welcome Back</h2>
          <p className="text-muted mb-4">Sign in to your account</p>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-medium">Email Address</label>
              <div className="input-group">
                <span className="input-group-text"><FiMail /></span>
                <input type="email" className="form-control" required value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label small fw-medium">Password</label>
              <div className="input-group">
                <span className="input-group-text"><FiLock /></span>
                <input type={showPassword ? 'text' : 'password'} className="form-control" required value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Enter your password" />
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm" /> : 'Sign In'}
            </button>
          </form>

          <p className="text-center mt-3 mb-0 small">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
