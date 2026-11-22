import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from './AuthLayout.jsx'

function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [notice, setNotice] = useState('')

  const submitResetRequest = (event) => {
    event.preventDefault()
    setNotice('Password reset is ready, but a password-reset API has not been connected yet.')
  }

  return (
    <AuthLayout>
      <form className="login-form" onSubmit={submitResetRequest}>
        <div className="login-heading">
          <p className="auth-kicker">ACCOUNT RECOVERY</p>
          <h2>Forgot password?</h2>
          <p>Enter the email address linked to your account to request a reset.</p>
        </div>

        <label className="auth-label" htmlFor="reset-email">Email address</label>
        <input
          id="reset-email"
          className="auth-input"
          type="email"
          autoComplete="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(event) => { setEmail(event.target.value); setNotice('') }}
          required
        />

        {notice && <p className="login-notice" role="status">{notice}</p>}
        <button type="submit" className="sign-in-button">Send reset instructions</button>
        <p className="create-account"><Link to="/login">Back to sign in</Link></p>
        <p className="auth-back-link">New here? <Link to="/signup">Create an account</Link></p>
      </form>
    </AuthLayout>
  )
}

export default ForgotPasswordPage
