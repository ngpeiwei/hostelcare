import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';
import './SignUp.css';
import logoImage from '../../assets/logo.png';
import SignUpSuccess from './SignUpSuccess';


export default function SignUp() {
	const navigate = useNavigate();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

	const validate = () => {
        if (!name) return 'Please enter your name.';
		if (!email) return 'Please enter your email.';
        if (!phone) return 'Please enter your phone number.';
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
				const userCred = await createUserWithEmailAndPassword(auth, email, password);
				// optionally get ID token and store
				const idToken = await userCred.user.getIdToken();
				localStorage.setItem('token', idToken);
				// show success modal
				setShowSuccess(true);
			} catch (err) {
				const msg = (err && err.message) ? err.message : 'Signup failed';
				setError(msg);
			} finally {
				setLoading(false);
			}
	};

	return (
		<div className="hc-signup-root">
			<div className="hc-left">
				<div className="hc-logo-wrap">
					<img src={logoImage} alt="HostelCare logo" className="hc-logo" />
				</div>
			</div>

			<div className="hc-right">
				<div className="hc-form-card">
					<h1 className="hc-title">Sign Up Page</h1>

					<form onSubmit={handleSubmit} className="hc-form">
                        <label className="hc-label">NAME</label>
						<input
							className="hc-input"
							type="text"
							placeholder="Name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>

						<label className="hc-label">EMAIL</label>
						<input
							className="hc-input"
							type="email"
							placeholder="*@usm.my or any *.usm.my subdomains"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>

                        <label className="hc-label">PHONE NUMBER</label>
						<input
							className="hc-input"
							type="tel"
							placeholder="+60 12-345 6789"
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
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
							{loading ? 'Please wait...' : 'SIGN UP'}
						</button>
					</form>

					<div className="hc-links">
						<p><a href="/auth/Login">Back to Login</a></p>
					</div>
				</div>
			</div>
			{/* Success modal - when closed navigate to login */}
			<SignUpSuccess open={showSuccess} onClose={() => {
				setShowSuccess(false);
				navigate('/auth/Login');
			}} />
		</div>
	);
}

