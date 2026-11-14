import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FiDatabase, FiUser, FiMail, FiLock } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { checkEmailTypo, isValidEmailFormat } from '../../utils/emailValidator';
import './Auth.css';

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [emailSuggestion, setEmailSuggestion] = useState(null);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectParam = searchParams.get('redirect');

  const handleEmailBlur = () => {
    if (email.trim()) {
      const result = checkEmailTypo(email.trim());
      if (result.hasSuggestion) {
        setEmailSuggestion(result.suggestion);
      } else {
        setEmailSuggestion(null);
      }
    }
  };

  const acceptSuggestion = () => {
    setEmail(emailSuggestion);
    setEmailSuggestion(null);
  };

  const dismissSuggestion = () => {
    setEmailSuggestion(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !confirmEmail.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    if (!isValidEmailFormat(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (email.trim().toLowerCase() !== confirmEmail.trim().toLowerCase()) {
      setError('Email addresses do not match. Please re-enter.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const result = signup(name, email, password);
    if (result.success) {
      const redirect = searchParams.get('redirect');
      if (redirect) {
        navigate('/');
        setTimeout(() => {
          const el = document.getElementById(redirect);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        navigate('/');
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <FiDatabase />
            <span>SynthData</span>
          </Link>
          <h2>Create Account</h2>
          <p>Get started with synthetic data generation</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {error && <div className="auth-error">{error}</div>}

          <div className="auth-field">
            <label htmlFor="signup-name">Full Name</label>
            <input
              id="signup-name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              autoComplete="name"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="signup-email">Email Address</label>
            <input
              id="signup-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              onBlur={handleEmailBlur}
              autoComplete="email"
            />
            {emailSuggestion && (
              <div className="email-suggestion">
                <span>Did you mean <strong>{emailSuggestion}</strong>?</span>
                <button type="button" className="suggestion-btn yes" onClick={acceptSuggestion}>Yes</button>
                <button type="button" className="suggestion-btn no" onClick={dismissSuggestion}>No</button>
              </div>
            )}
          </div>

          <div className="auth-field">
            <label htmlFor="signup-confirm-email">Confirm Email Address</label>
            <input
              id="signup-confirm-email"
              type="email"
              placeholder="Re-enter your email"
              value={confirmEmail}
              onChange={(e) => {
                setConfirmEmail(e.target.value);
                if (error) setError('');
              }}
              autoComplete="off"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              autoComplete="new-password"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="signup-confirm">Confirm Password</label>
            <input
              id="signup-confirm"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (error) setError('');
              }}
              autoComplete="new-password"
            />
          </div>

          <div className="auth-submit">
            <button type="submit" className="btn btn-primary">
              <FiUser />
              Create Account
            </button>
          </div>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to={`/login${redirectParam ? `?redirect=${redirectParam}` : ''}`}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
