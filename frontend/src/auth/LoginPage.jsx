import { useState } from 'react'
import axios from 'axios'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import AuthLayout from './AuthLayout.jsx'

function findRegisteredCollege(username) {
  try {
    const colleges = JSON.parse(localStorage.getItem('brightpath-colleges') || '[]')
    if (!Array.isArray(colleges)) return null

    return colleges.find((college) =>
      college.adminUsername?.toLowerCase() === username.toLowerCase(),
    ) || null
  } catch (storageError) {
    console.error('Could not read registered college details:', storageError)
    return null
  }
}

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState(
    () => localStorage.getItem('brightpath-remembered-username') || '',
  )
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [rememberMe, setRememberMe] = useState(
    () => Boolean(localStorage.getItem('brightpath-remembered-username')),
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submitLogin = async (event) => {
    event.preventDefault()
    if (isSubmitting) return

    const trimmedUsername = username.trim()
    if (!trimmedUsername || !password) {
      setError('Enter your user ID and password to continue.')
      return
    }

    setError('')
    setIsSubmitting(true)
    try {
      const registeredCollege = findRegisteredCollege(trimmedUsername)
      const response = await axios.post('http://localhost:8080/auth/v1/login', {
        ...(registeredCollege ? { companyName: registeredCollege.name } : {}),
        username: trimmedUsername,
        password,
      })
      const user = response.data?.data
      const token = user?.token
      if (!token) {
        setError('Sign-in response did not include an access token.')
        return
      }
      if (rememberMe) {
        localStorage.setItem('brightpath-remembered-username', trimmedUsername)
      } else {
        localStorage.removeItem('brightpath-remembered-username')
      }
      onLogin({ ...user, username: user.username || trimmedUsername, token })
    } catch (requestError) {
      if (import.meta.env.DEV && requestError.response) {
        console.error('Sign-in API error response:', requestError.response.data)
      }

      setError(
        requestError.response?.data?.errors?.map((item) => item.message).filter(Boolean).join(' ')
          || requestError.response?.data?.message
          || requestError.response?.data?.error
          || (requestError.response
            ? `Sign-in failed (HTTP ${requestError.response.status}). Check the account details or contact the system administrator.`
            : 'Could not connect to the sign-in service. Please try again.')
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <form className="login-form" onSubmit={submitLogin}>
        <div className="login-heading">
          <p className="auth-kicker">WELCOME TO YOUR SCHOOL PORTAL</p>
          <h2>Sign in to Skill Naresh</h2>
          <p>Sign in with the username and password provided by your institution.</p>
        </div>

        <label className="auth-label" htmlFor="login-username">Username</label>
        <input
          id="login-username"
          className="auth-input"
          type="text"
          autoComplete="username"
          placeholder="Enter your username"
          value={username}
          onChange={(event) => { setUsername(event.target.value); setError('') }}
        />

        <div className="password-label-row">
          <label className="auth-label" htmlFor="login-password">Password</label>
        </div>
        <input
          id="login-password"
          className="auth-input"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <div className="remember-row">
          <label className="remember-me" htmlFor="remember-me">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
            />
            <span>Remember me</span>
          </label>
          <Link className="forgot-password" to="/forgot-password">Forgot password?</Link>
        </div>

        {error && <p className="login-error" role="alert">{error}</p>}
        <button type="submit" className="sign-in-button" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in…' : 'Sign in'} {!isSubmitting && <ArrowRight size={16} />}
        </button>
        <p className="create-account">
          Don’t have an account? <Link to="/signup">Create Account</Link>
        </p>
      </form>
    </AuthLayout>
  )
}

export default LoginPage
