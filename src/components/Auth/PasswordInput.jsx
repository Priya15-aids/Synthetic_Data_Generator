import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

function PasswordInput({ id, placeholder, value, onChange, autoComplete }) {
  const [show, setShow] = useState(false);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        id={id}
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        style={{ width: '100%', paddingRight: '2.8rem', boxSizing: 'border-box' }}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? 'Hide password' : 'Show password'}
        title={show ? 'Hide password' : 'Show password'}
        style={{
          position: 'absolute',
          right: '0.75rem',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          color: 'inherit',
          opacity: 0.7,
          display: 'flex',
          alignItems: 'center',
          fontSize: '1.1rem',
        }}
      >
        {show ? <FiEyeOff /> : <FiEye />}
      </button>
    </div>
  );
}

export default PasswordInput;
