import { ArrowRight, UserPlus } from 'lucide-react'
import { Link } from 'react-router-dom'
import AuthLayout from './AuthLayout.jsx'

function SignupPage() {
  return (
    <AuthLayout>
      <section className="login-form">
        <div className="login-heading">
          <p className="auth-kicker">JOIN YOUR SCHOOL COMMUNITY</p>
          <h2>Create your account</h2>
          <p>Start by entering your details. Your school may need to approve your account.</p>
        </div>
        <div className="signup-callout">
          <UserPlus size={20} />
          <p>Have your school and account details ready before registering.</p>
        </div>
        <Link className="sign-in-button auth-action-link" to="/register">
          Continue to registration <ArrowRight size={16} />
        </Link>
        <p className="create-account">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </AuthLayout>
  )
}

export default SignupPage
