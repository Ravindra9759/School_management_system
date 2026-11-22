import { BriefcaseBusiness, LogOut } from 'lucide-react'
import './App.css'

function App({ user, onLogout }) {
  const name = user.name || user.username || 'Employee'

  return (
    <main className="employee-dashboard">
      <header className="employee-dashboard-header">
        <div className="employee-dashboard-brand"><BriefcaseBusiness size={21} /><span>Brightpath</span></div>
        <button type="button" onClick={onLogout}><LogOut size={16} /> Sign out</button>
      </header>
      <section className="employee-dashboard-card">
        <div className="employee-dashboard-icon"><BriefcaseBusiness size={25} /></div>
        <p>EMPLOYEE PORTAL</p>
        <h1>Welcome, {name}</h1>
        <span>You are signed in to your institution account.</span>
        <div className="employee-dashboard-account">
          <strong>Username</strong>
          <span>{user.username}</span>
        </div>
      </section>
    </main>
  )
}

export default App
