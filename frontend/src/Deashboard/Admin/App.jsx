import { useMemo, useState } from 'react'
import axios from 'axios'
import {
  ArrowDownRight,
  Building2,
  ChevronRight,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings,
  Users,
  X,
} from 'lucide-react'
import './App.css'

const storageKey = 'brightpath-colleges'
const currentMonth = new Date().toISOString().slice(0, 7)

function readColleges() {
  try {
    const savedColleges = JSON.parse(localStorage.getItem(storageKey) || '[]')
    return Array.isArray(savedColleges) ? savedColleges : []
  } catch (error) {
    console.error('Could not read saved colleges:', error)
    return []
  }
}

const emptyForm = {
  name: '',
  email: '',
  phoneNo: '',
  address: '',
  adminName: '',
  adminUsername: '',
  adminPassword: '',
  confirmPassword: '',
}

function App({ onLogout, token }) {
  const [activePage, setActivePage] = useState('Dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [colleges, setColleges] = useState(readColleges)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredColleges = useMemo(
    () => colleges.filter((college) =>
      `${college.name} ${college.email} ${college.adminName} ${college.adminUsername}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    ),
    [colleges, search],
  )

  const navigate = (page) => {
    setActivePage(page)
    setSidebarOpen(false)
    setError('')
    setNotice('')
    setSearch('')
    if (page === 'Colleges') setShowForm(false)
  }

  const saveColleges = (updatedColleges) => {
    setColleges(updatedColleges)
    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedColleges))
    } catch (storageError) {
      console.error('Could not save colleges in this browser:', storageError)
      setNotice('College list changed for this session, but browser storage is unavailable.')
    }
  }

  const updateForm = (field) => (event) => {
    setForm((currentForm) => ({ ...currentForm, [field]: event.target.value }))
    setError('')
  }

  const registerCollege = async (event) => {
    event.preventDefault()
    if (isSubmitting) return
    if (form.adminPassword !== form.confirmPassword) {
      setError('Admin passwords do not match.')
      return
    }

    if (!token) {
      setError('Your sign-in session has expired. Please sign in again.')
      return
    }

    setError('')
    setNotice('')
    setIsSubmitting(true)
    try {
      const response = await axios.post(
        'http://localhost:8080/rest/v1/institution/save',
        {
          companyName: form.name.trim(),
          email: form.email.trim(),
          password: form.adminPassword,
          confirm: form.confirmPassword,
          name: form.adminName.trim(),
          username: form.adminUsername.trim(),
          phoneNo: form.phoneNo.trim(),
          address: form.address.trim(),
        },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      const savedInstitution = response.data?.data || {}
      const college = {
        id: savedInstitution.id || globalThis.crypto?.randomUUID?.() || `${Date.now()}`,
        name: savedInstitution.companyName || form.name.trim(),
        email: savedInstitution.email || form.email.trim(),
        phoneNo: savedInstitution.phoneNo || form.phoneNo.trim(),
        address: savedInstitution.address || form.address.trim(),
        adminName: savedInstitution.name || form.adminName.trim(),
        adminUsername: savedInstitution.username || form.adminUsername.trim(),
        status: savedInstitution.enabled === false ? 'Inactive' : 'Active',
        createdAt: savedInstitution.added || new Date().toISOString(),
      }

      saveColleges([college, ...colleges])
      setForm(emptyForm)
      setShowForm(false)
      setNotice('Institution registered successfully.')
    } catch (requestError) {
      if (import.meta.env.DEV && requestError.response) {
        console.error('Institution registration API error:', requestError.response.data)
      }

      setError(
        requestError.response?.data?.message
          || requestError.response?.data?.error
          || (requestError.response
            ? `Institution registration failed (HTTP ${requestError.response.status}). Check the details and try again.`
            : 'Could not connect to the institution registration service. Please try again.')
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const removeCollege = (collegeId) => {
    const updatedColleges = colleges.filter((college) => college.id !== collegeId)
    saveColleges(updatedColleges)
    setNotice('College removed from this browser.')
  }

  const metrics = [
    { label: 'Total colleges', value: colleges.length, detail: 'Registered on this browser', icon: Building2, tone: 'violet' },
    { label: 'College administrators', value: colleges.length, detail: 'One admin contact per college', icon: Users, tone: 'mint' },
    { label: 'Active colleges', value: colleges.filter((college) => college.status === 'Active').length, detail: 'Currently active', icon: GraduationCap, tone: 'blue' },
    { label: 'New this month', value: colleges.filter((college) => college.createdAt.startsWith(currentMonth)).length, detail: 'Added this calendar month', icon: ArrowDownRight, tone: 'peach' },
  ]

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar-open' : ''}`}>
        <a className="admin-brand" href="#" onClick={(event) => event.preventDefault()} aria-label="Brightpath home">
          <span className="admin-brand-mark"><GraduationCap size={21} strokeWidth={2.2} /></span>
          <span>brightpath<span className="admin-brand-period">.</span></span>
        </a>

        <div className="admin-school-switcher">
          <div className="admin-school-logo">B</div>
          <div><strong>Brightpath</strong><span>Platform administration</span></div>
        </div>

        <p className="admin-nav-caption">ADMIN MENU</p>
        <nav className="admin-nav" aria-label="Platform administration">
          {[
            { label: 'Dashboard', icon: LayoutDashboard },
            { label: 'Colleges', icon: Building2 },
          ].map(({ label, icon: Icon }) => (
            <button
              className={`admin-nav-link ${activePage === label ? 'admin-nav-active' : ''}`}
              key={label}
              onClick={() => navigate(label)}
              type="button"
            >
              <Icon size={18} />
              <span>{label}</span>
              {label === 'Colleges' && <span className="admin-nav-count">{colleges.length}</span>}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <button type="button" className="admin-nav-link admin-settings" onClick={() => setNotice('Platform settings are not configured yet.')}>
            <Settings size={18} /><span>Settings</span>
          </button>
          <div className="admin-profile">
            <div className="admin-avatar admin-avatar-profile">SA</div>
            <div className="admin-profile-copy"><strong>Super Admin</strong><span>Platform administrator</span></div>
            <button type="button" className="admin-icon-button admin-logout" aria-label="Sign out" onClick={onLogout}><LogOut size={17} /></button>
          </div>
        </div>
      </aside>

      {sidebarOpen && <button className="admin-sidebar-scrim" onClick={() => setSidebarOpen(false)} aria-label="Close menu" />}

      <main className="admin-main">
        <header className="admin-topbar">
          <button type="button" className="admin-icon-button admin-menu-button" aria-label="Open menu" onClick={() => setSidebarOpen(true)}><Menu size={21} /></button>
          <div className="admin-breadcrumb"><span>Brightpath</span><ChevronRight size={14} /><strong>{activePage}</strong></div>
          <div className="admin-topbar-actions">
            {activePage === 'Colleges' && (
              <label className="admin-search">
                <Search size={17} />
                <input aria-label="Search colleges" placeholder="Search colleges..." value={search} onChange={(event) => setSearch(event.target.value)} />
              </label>
            )}
            <div className="admin-topbar-divider" />
            <button type="button" className="admin-user-chip" onClick={onLogout}>
              <span className="admin-avatar admin-avatar-small">SA</span>
              <span>Super Admin</span>
              <LogOut size={15} />
            </button>
          </div>
        </header>

        <div className="admin-page-content">
          <section className="admin-welcome">
            <div>
              <p className="admin-eyebrow">BRIGHTPATH PLATFORM <i /> SUPER ADMIN</p>
              <h1>{activePage === 'Dashboard' ? 'Platform dashboard' : 'Colleges'}<span>✦</span></h1>
              <p className="admin-welcome-subtitle">
                {activePage === 'Dashboard'
                  ? 'Overview of colleges and their administrator accounts.'
                  : 'Register colleges and manage their administrator details.'}
              </p>
            </div>
            {activePage === 'Colleges' && (
              <div className="admin-welcome-actions">
                <button type="button" className="admin-primary-button" onClick={() => { setShowForm(!showForm); setError(''); setNotice('') }}>
                  {showForm ? <X size={16} /> : <Plus size={16} />}
                  {showForm ? 'Cancel' : 'Register college'}
                </button>
              </div>
            )}
          </section>

          {notice && <p className="admin-action-message" role="status">{notice}</p>}
          {error && <p className="admin-form-error" role="alert">{error}</p>}

          {activePage === 'Dashboard' ? (
            <>
              <section className="admin-metrics" aria-label="Platform summary">
                {metrics.map(({ label, value, detail, icon: Icon, tone }) => (
                  <article className="admin-metric-card" key={label}>
                    <div className="admin-metric-top"><span>{label}</span><span className={`admin-metric-icon admin-tone-${tone}`}><Icon size={19} /></span></div>
                    <div className="admin-metric-value-row"><strong>{value}</strong></div>
                    <p>{detail}</p>
                  </article>
                ))}
              </section>

              <section className="admin-panel admin-students-panel admin-colleges-panel">
                <div className="admin-panel-heading">
                  <div><span className="admin-section-kicker">LATEST REGISTRATIONS</span><h2>Recently added colleges</h2></div>
                  <button type="button" className="admin-text-link" onClick={() => navigate('Colleges')}>View all <ChevronRight size={14} /></button>
                </div>
                <CollegeTable colleges={colleges.slice(0, 5)} onRemove={removeCollege} />
              </section>
            </>
          ) : (
            <>
              {showForm && (
                <form className="admin-panel college-form" onSubmit={registerCollege}>
                  <div className="admin-panel-heading">
                    <div><span className="admin-section-kicker">COLLEGE DETAILS</span><h2>Register a college and its admin</h2></div>
                  </div>
                  <div className="college-form-grid">
                    <label>College name<input value={form.name} onChange={updateForm('name')} placeholder="e.g. Westfield College" required /></label>
                    <label>College email<input type="email" value={form.email} onChange={updateForm('email')} placeholder="college@example.com" required /></label>
                    <label>Phone number<input type="tel" value={form.phoneNo} onChange={updateForm('phoneNo')} placeholder="Phone number" required /></label>
                    <label>Address<input value={form.address} onChange={updateForm('address')} placeholder="College address" required /></label>
                    <label>Admin full name<input value={form.adminName} onChange={updateForm('adminName')} placeholder="College administrator" required /></label>
                    <label>Admin username<input autoComplete="username" value={form.adminUsername} onChange={updateForm('adminUsername')} placeholder="Choose an admin username" required /></label>
                    <label>Admin password<input type="password" autoComplete="new-password" minLength={8} value={form.adminPassword} onChange={updateForm('adminPassword')} placeholder="At least 8 characters" required /></label>
                    <label>Confirm password<input type="password" autoComplete="new-password" minLength={8} value={form.confirmPassword} onChange={updateForm('confirmPassword')} placeholder="Re-enter admin password" required /></label>
                  </div>
                  <div className="college-form-actions">
                    <button type="button" className="admin-secondary-button" onClick={() => { setShowForm(false); setError('') }}>Cancel</button>
                    <button type="submit" className="admin-primary-button" disabled={isSubmitting}>
                      <Plus size={15} /> {isSubmitting ? 'Registering…' : 'Add college'}
                    </button>
                  </div>
                </form>
              )}

              <section className="admin-panel admin-students-panel admin-colleges-panel">
                <div className="admin-panel-heading">
                  <div><span className="admin-section-kicker">COLLEGE DIRECTORY</span><h2>Registered colleges <span className="college-total">{colleges.length}</span></h2></div>
                </div>
                <CollegeTable colleges={filteredColleges} onRemove={removeCollege} emptyMessage={search ? 'No colleges match your search.' : 'No colleges registered yet. Use “Register college” to add one.'} />
              </section>
            </>
          )}

          <footer className="admin-footer"><span>© 2026 Brightpath · Platform administration</span><span><span className="admin-footer-dot" /> Admin workspace</span></footer>
        </div>
      </main>
    </div>
  )
}

function CollegeTable({ colleges, onRemove, emptyMessage = 'No colleges registered yet.' }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-student-table college-table">
        <thead><tr><th>College</th><th>Admin</th><th>Contact</th><th>Registered</th><th>Status</th><th /></tr></thead>
        <tbody>
          {colleges.map((college) => (
            <tr key={college.id}>
              <td><span className="admin-avatar admin-student-avatar avatar-lavender">{college.name.slice(0, 1).toUpperCase()}</span><strong>{college.name}</strong></td>
              <td>{college.adminName}<small className="college-username">{college.adminUsername}</small></td>
              <td>{college.email}<small className="college-username">{college.phoneNo}</small></td>
              <td>{new Date(college.createdAt).toLocaleDateString()}</td>
              <td><span className="admin-status status-active"><i />{college.status}</span></td>
              <td><button type="button" className="college-remove-button" onClick={() => onRemove(college.id)} aria-label={`Remove ${college.name}`}>Remove</button></td>
            </tr>
          ))}
          {colleges.length === 0 && <tr><td className="admin-no-results" colSpan="6">{emptyMessage}</td></tr>}
        </tbody>
      </table>
    </div>
  )
}

export default App
