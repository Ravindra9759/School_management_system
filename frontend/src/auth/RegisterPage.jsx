import { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import AuthLayout from './AuthLayout.jsx'

function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submitRegistration = async (event) => {
    event.preventDefault()
    if (isSubmitting) return

    setError('')
    setSuccess('')
    setIsSubmitting(true)

    try {
      const response = await axios.post('http://localhost:8080/auth/v1/register', {
        companyName: 'bvrsoftware',
        fullName: fullName.trim(),
        email: email.trim(),
        username: username.trim(),
        password,
      })
      setSuccess(response.data?.message || 'Your account has been registered. You can now sign in.')
    } catch (requestError) {
      if (import.meta.env.DEV && requestError.response) {
        console.error('Registration API error response:', requestError.response.data)
      }

      setError(
        requestError.response?.data?.message
          || requestError.response?.data?.error
          || (requestError.response
            ? `Registration failed (HTTP ${requestError.response.status}). Please check your details and try again.`
            : 'Could not connect to the registration service. Please try again.')
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <form className="login-form" onSubmit={submitRegistration}>
        <div className="login-heading">
          <p className="auth-kicker">NEW SCHOOL PORTAL ACCOUNT</p>
          <h2>Register</h2>
          <p>Enter your details to request an account.</p>
        </div>

        <label className="auth-label" htmlFor="register-name">Full name</label>
        <input
          id="register-name"
          className="auth-input"
          type="text"
          autoComplete="name"
          placeholder="Enter your full name"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          required
        />

        <label className="auth-label" htmlFor="register-email">Email address</label>
        <input
          id="register-email"
          className="auth-input"
          type="email"
          autoComplete="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label className="auth-label" htmlFor="register-username">Username</label>
        <input
          id="register-username"
          className="auth-input"
          type="text"
          autoComplete="username"
          placeholder="Choose a username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        />

        <label className="auth-label" htmlFor="register-password">Password</label>
        <input
          id="register-password"
          className="auth-input"
          type="password"
          autoComplete="new-password"
          placeholder="Create a password"
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        {error && <p className="login-error" role="alert">{error}</p>}
        {success && <p className="login-notice" role="status">{success}</p>}
        <button type="submit" className="sign-in-button" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </button>
        <p className="create-account">
          Already registered? <Link to="/login">Sign in</Link>
        </p>
        <p className="auth-back-link"><Link to="/signup">Back to sign up</Link></p>
      </form>
    </AuthLayout>
  )
}

export default RegisterPage
