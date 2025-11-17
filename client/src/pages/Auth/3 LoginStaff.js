import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';
import './LoginStaff.css';
import logoImage from '../../assets/logo.png';

export default function LoginStaff() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validate = () => {
    if (!email) return 'Please enter your email.';
    if (!password) return 'Please enter your password.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const v = validate();
    if (v) return setError(v);

    setLoading(true);
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCred.user.getIdToken();
      localStorage.setItem('token', idToken);
      // navigate to staff dashboard
      navigate('/staff/dashboard');
    } catch (err) {
      const msg = (err && err.message) ? err.message : 'Login failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hc-login-root">
      <div className="hc-left">
        <div className="hc-logo-wrap">
          <img src={logoImage} alt="HostelCare logo" className="hc-logo" />
        </div>
      </div>

      <div className="hc-right">
        <div className="hc-form-card">
          <h1 className="hc-title">Maintenance Staff Login Page</h1>

          <form onSubmit={handleSubmit} className="hc-form">
            <label className="hc-label">STAFF EMAIL</label>
            <input
              className="hc-input"
              type="email"
              placeholder="@usm.my or any *.usm.my subdomains"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label className="hc-label">PASSWORD</label>
            <input
              className="hc-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <div className="hc-error">{error}</div>}

            <button type="submit" className="hc-submit" disabled={loading}>
              {loading ? 'Please wait...' : 'LOGIN'}
            </button>
          </form>

          <div className="hc-links">
            <p>Don't have an account? <a href="/auth/SignUp">Sign Up</a></p>
            <p><a href="/auth/Login">Login As Student</a></p>
            <p><a href="/auth/LoginAdmin">Login As Admin</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}