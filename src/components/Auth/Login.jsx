import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FiDatabase, FiMail, FiLock } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { checkEmailTypo, isValidEmailFormat } from '../../utils/emailValidator';
import './Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailSuggestion, setEmailSuggestion] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');

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

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    if (!isValidEmailFormat(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    const result = login(email, password);
    if (result.success) {
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
          <h2>Welcome Back</h2>
          <p>Sign in to access your dashboard and datasets</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}

          <div className="auth-field">
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <div className="auth-submit">
            <button type="submit" className="btn btn-primary">
              <FiLock />
              Sign In
            </button>
          </div>
        </form>

        <div className="auth-forgot">
          <Link to="/forgot-password">Forgot your password?</Link>
        </div>

        <div className="auth-footer">
          Don't have an account? <Link to={`/signup${redirect ? `?redirect=${redirect}` : ''}`}>Create one</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;