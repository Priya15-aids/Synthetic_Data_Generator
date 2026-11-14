import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiDatabase, FiMail, FiArrowLeft, FiCheck } from 'react-icons/fi';
import { checkEmailTypo, isValidEmailFormat } from '../../utils/emailValidator';
import './Auth.css';

function getStoredUsers() {
  const stored = localStorage.getItem('synthdata_users');
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); 
  const [emailSuggestion, setEmailSuggestion] = useState(null);

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

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!isValidEmailFormat(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    const users = getStoredUsers();
    const found = users.find((u) => u.email === email.toLowerCase().trim());

    if (!found) {

      setError("If that email exists in our system, you'll be able to reset. Please double-check your spelling or contact support.");
      return;
    }

    setStep(2);
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!newPassword.trim() || !confirmPassword.trim()) {
      setError('Please fill in both password fields.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const users = getStoredUsers();
    const userIndex = users.findIndex((u) => u.email === email.toLowerCase().trim());

    if (userIndex !== -1) {
      let hash = 0;
      for (let i = 0; i < newPassword.length; i++) {
        const char = newPassword.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      users[userIndex].passwordHash = hash.toString(36);
      localStorage.setItem('synthdata_users', JSON.stringify(users));
      setSuccess(true);
    } else {
      setError('Something went wrong. Please try again.');
    }
  };

  const goBackToEmail = () => {
    setStep(1);
    setError('');
    setNewPassword('');
    setConfirmPassword('');
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <FiDatabase />
              <span>SynthData</span>
            </Link>
            <div className="auth-success-icon">
              <FiCheck />
            </div>
            <h2>Password Reset Successful</h2>
            <p>Your password has been updated. You can now sign in with your new password.</p>
          </div>
          <div className="auth-submit" style={{ marginTop: '1.5rem' }}>
            <Link to="/login" className="btn btn-primary" style={{ textDecoration: 'none', justifyContent: 'center' }}>
              Go to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <FiDatabase />
            <span>SynthData</span>
          </Link>
          <h2>{step === 1 ? 'Forgot Password' : 'Reset Password'}</h2>
          <p>
            {step === 1
              ? 'Enter your email address to reset your password'
              : `Reset password for ${email}`}
          </p>
        </div>

        {step === 1 && (
          <form className="auth-form" onSubmit={handleEmailSubmit} noValidate>
            {error && <div className="auth-error">{error}</div>}

            <div className="auth-field">
              <label htmlFor="forgot-email">Email Address</label>
              <input
                id="forgot-email"
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

            <div className="auth-help-text">
              Enter the email you used to create your account. Double-check the spelling before continuing.
            </div>

            <div className="auth-submit">
              <button type="submit" className="btn btn-primary">
                <FiMail />
                Verify Email
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form className="auth-form" onSubmit={handleResetSubmit} noValidate>
            {error && <div className="auth-error">{error}</div>}

            <div className="auth-field">
              <label htmlFor="new-password">New Password</label>
              <input
                id="new-password"
                type="password"
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (error) setError('');
                }}
                autoComplete="new-password"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="confirm-new-password">Confirm New Password</label>
              <input
                id="confirm-new-password"
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
                <FiCheck />
                Reset Password
              </button>
            </div>

            <div className="auth-help-text" style={{ textAlign: 'center' }}>
              Wrong email?{' '}
              <button
                type="button"
                onClick={goBackToEmail}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: 'inherit',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  font: 'inherit',
                }}
              >
                Go back
              </button>
            </div>
          </form>
        )}

        <div className="auth-footer">
          <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <FiArrowLeft /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
