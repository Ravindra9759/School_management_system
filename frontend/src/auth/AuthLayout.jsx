import { CheckCircle2, GraduationCap } from 'lucide-react'
import { Link } from 'react-router-dom'

function AuthLayout({ children }) {
  return (
    <main className="login-page">
      <section className="login-intro">
        <Link className="auth-brand" to="/login">
          <span className="auth-brand-icon"><GraduationCap size={21} /></span>
          <span>Skill Naresh<span>.</span></span>
        </Link>
        <div className="intro-content">
          <p className="auth-kicker">NARESH PAL ACADEMY</p>
          <h1>Every school day,<br />all in one place.</h1>
          <p className="intro-description">A simpler way for our school community to stay connected, informed, and ready for what’s next.</p>
          <div className="intro-highlights">
            <span><CheckCircle2 size={16} /> School updates in one place</span>
            <span><CheckCircle2 size={16} /> Your own role-based workspace</span>
          </div>
        </div>
        <p className="intro-footer">A brighter school experience for everyone.</p>
        <div className="intro-orb intro-orb-one" />
        <div className="intro-orb intro-orb-two" />
      </section>

      <section className="login-panel">
        {children}
        <p className="login-privacy">© 2026 Westfield Academy <span>·</span> Secure admin access</p>
      </section>
    </main>
  )
}

export default AuthLayout
