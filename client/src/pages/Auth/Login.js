import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import './Login.css';
import logoImage from '../../assets/logo.png';

export default function Login() {
  const navigate = useNavigate();

  // Current login type (default is 'student')
  const [role, setRole] = useState('student');

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
      // Sign in with Supabase Auth (Authenticate user)
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) throw authError;

      const { user, session } = data;

      // Fetch user role for authorization
      const { data: userData, error: dbError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (dbError) throw dbError;

      // Store token and role in localStorage for session tracking 
      localStorage.setItem('token', session.access_token);
      localStorage.setItem('role', userData.role);

      // Track last activity for session timeout
      localStorage.setItem('lastActivity', Date.now());

      // Role-based redirection (Authorization)
      switch (userData.role) {
        case 'student': navigate('/student/dashboard'); break;
        case 'staff': navigate('/staff/dashboard'); break;
        case 'admin': navigate('/admin/dashboard'); break;
        default: navigate('/');
      }

    } catch (err) {
      setError(err.message || 'Login failed');
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
          <h1 className="hc-title">
            {role === 'student' ? 'Student Login Page' : role === 'admin' ? 'Admin Login Page' : 'Maintenance Staff Login Page'}
          </h1>

          <form onSubmit={handleSubmit} className="hc-form">
            <label className="hc-label">EMAIL</label>
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
             <p>
              <a href="#" onClick={(e) => { e.preventDefault(); setRole('admin'); }}>
                Login As Admin
              </a>
            </p>

            <p>
              <a href="#" onClick={(e) => { e.preventDefault(); setRole('staff'); }}>
                Login As Maintenance Staff
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
