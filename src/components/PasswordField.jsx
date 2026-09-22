import { useState, useId } from 'react';

export default function PasswordField({ label, value, onChange, autoComplete, error }) {
  const [visible, setVisible] = useState(false);
  const id = useId();

  return (
    <div className="field">
      <div className="field__row">
        <label htmlFor={id} className="field__label">
          {label}
        </label>
        <button
          type="button"
          className="field__toggle"
          onClick={() => setVisible((v) => !v)}
          aria-pressed={visible}
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      </div>
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        className={'field__input' + (error ? ' field__input--error' : '')}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? id + '-error' : undefined}
      />
      {error ? (
        <p id={id + '-error'} className="field__error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
