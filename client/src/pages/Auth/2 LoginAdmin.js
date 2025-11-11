import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';
import './LoginAdmin.css';
import logoImage from '../../assets/logo.png';

export default function LoginAdmin() {
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
				// get Firebase ID token
				const idToken = await userCred.user.getIdToken();
				// store token locally (optional)
				localStorage.setItem('token', idToken);
				// navigate to admin dashboard
				navigate('/admin/dashboard');
			} catch (err) {
				// Firebase auth errors often have a code and message
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
					<h1 className="hc-title">Admin Login Page</h1>

					<form onSubmit={handleSubmit} className="hc-form">
						<label className="hc-label">STAFF EMAIL</label>
						<input
							className="hc-input"
							type="email"
							placeholder="Email address"
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
						<p>Don't have an account? <a href="/auth/register">Sign Up</a></p>
						<p><a href="/auth/login">Login As Student</a></p>
					</div>
				</div>
			</div>
		</div>
	);
}

