import { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import {
  ArrowDownRight,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Plus,
  Search,
  UserRound,
  Users,
  X,
} from 'lucide-react'
import './App.css'

const roles = {
  students: { label: 'Students', singular: 'Student', roleName: 'ROLE_STUDENT', icon: GraduationCap, tone: 'violet' },
  teachers: { label: 'Teachers', singular: 'Teacher', roleName: 'ROLE_TEACHER', icon: Users, tone: 'mint' },
  employees: { label: 'Employees', singular: 'Employee', roleName: 'ROLE_TEMPUSER', icon: UserRound, tone: 'blue' },
}

const emptyForm = { name: '', username: '', email: '', phoneNo: '', password: '', confirmPassword: '' }

function getErrorMessage(error) {
  return error.response?.data?.errors?.map((item) => item.message).filter(Boolean).join(' ')
    || error.response?.data?.message
    || error.response?.data?.error
    || (error.response
      ? `Request failed (HTTP ${error.response.status}). Please check the details and try again.`
      : error.message || 'Could not connect to the school service.')
}

function getUserRoles(record) {
  return [
    record.roleName,
    ...(Array.isArray(record.authorities) ? record.authorities : []),
  ]
    .filter(Boolean)
    .map((role) => String(role).replace(/^ROLE_/i, '').toUpperCase())
}

function getDirectoryRole(record) {
  const userRoles = getUserRoles(record)
  if (userRoles.includes('STUDENT')) return 'students'
  if (userRoles.includes('TEACHER')) return 'teachers'
  if (userRoles.includes('TEMPUSER')) return 'employees'
  return null
}

function App({ user, onLogout }) {
  const institutionName = user.companyName || 'Your institution'
  const adminName = user.name || user.username
  const [activePage, setActivePage] = useState('Overview')
  const [directory, setDirectory] = useState([])
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [roleAssignmentError, setRoleAssignmentError] = useState('')

  const currentRole = roles[activePage.toLowerCase()]
  const api = useMemo(() => axios.create({
    baseURL: 'http://localhost:8080',
    headers: { Authorization: `Bearer ${user.token}` },
  }), [user.token])

  const loadDirectory = useCallback(async () => {
    try {
      const response = await api.get('/rest/v1/user/api/list')
      const users = response.data?.data
      if (!Array.isArray(users)) {
        throw new Error(response.data?.message || 'The server returned an invalid user list.')
      }

      setDirectory(users
        .map((record) => ({ ...record, role: getDirectoryRole(record) }))
        .filter((record) => record.role))
    } catch (requestError) {
      console.error('Could not load the college account directory:', requestError.response?.data || requestError)
      setError(getErrorMessage(requestError))
    } finally {
      setIsLoading(false)
    }
  }, [api])

  useEffect(() => {
    loadDirectory()
  }, [loadDirectory])

  const filteredDirectory = useMemo(() => {
    const roleKey = activePage.toLowerCase()
    if (!roles[roleKey]) return []
    return directory.filter((record) =>
      record.role === roleKey
      && `${record.name || ''} ${record.username || ''} ${record.email || ''} ${record.phoneNo || ''}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    )
  }, [activePage, directory, search])

  const openForm = () => {
    setForm(emptyForm)
    setError('')
    setNotice('')
    setRoleAssignmentError('')
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setForm(emptyForm)
    setError('')
  }

  const submitRecord = async (event) => {
    event.preventDefault()
    if (!currentRole || isSubmitting) return

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    const username = form.username.trim()
    const duplicateUsername = directory.some((record) => record.username?.toLowerCase() === username.toLowerCase())
    if (duplicateUsername) {
      setError('This username is already in the college directory.')
      return
    }

    setError('')
    setNotice('')
    setRoleAssignmentError('')
    setIsSubmitting(true)
    let accountCreated = false
    let assignmentErrorMessage = ''
    try {
      const response = await api.post('/rest/v1/user/api/save', {
        name: form.name.trim(),
        username,
        email: form.email.trim(),
        phoneNo: form.phoneNo.trim(),
        password: form.password,
        confirm: form.confirmPassword,
        companyName: institutionName,
        roleName: currentRole.roleName,
      })
      const savedUser = response.data?.data
      if (!savedUser?.id) {
        throw new Error(response.data?.message || 'The server did not confirm that the account was created.')
      }
      accountCreated = true

      if (currentRole.roleName !== 'ROLE_TEMPUSER') {
        try {
          await api.post('/rest/v1/role/user/save', {
            id: savedUser.id,
            username: savedUser.username || username,
            roles: [currentRole.roleName],
          })
        } catch (assignmentError) {
          console.error('Account created but role assignment failed:', assignmentError.response?.data || assignmentError)
          assignmentErrorMessage = getErrorMessage(assignmentError)
        }
      }

      setIsLoading(true)
      await loadDirectory()
      setForm(emptyForm)
      setShowForm(false)
      setRoleAssignmentError(assignmentErrorMessage)
      setNotice(assignmentErrorMessage
        ? `${currentRole.singular} account was created, but the dashboard role could not be assigned.`
        : `${currentRole.singular} account registered successfully.`)
    } catch (requestError) {
      console.error('Could not register the college account:', requestError.response?.data || requestError)
      if (accountCreated) {
        await loadDirectory()
        setForm(emptyForm)
        setShowForm(false)
        setNotice(`${currentRole.singular} account was created. Refresh the directory to verify it.`)
        setRoleAssignmentError(getErrorMessage(requestError))
      } else {
        setError(getErrorMessage(requestError))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const counts = Object.keys(roles).reduce((result, role) => {
    result[role] = directory.filter((record) => record.role === role).length
    return result
  }, {})
  const recentRecords = directory.slice(0, 6)

  return (
    <div className="college-admin-shell">
      <aside className="college-admin-sidebar">
        <a className="college-admin-brand" href="#" onClick={(event) => event.preventDefault()} aria-label="Brightpath home">
          <span className="college-admin-brand-mark"><GraduationCap size={21} strokeWidth={2.2} /></span>
          <span>brightpath<span>.</span></span>
        </a>

        <div className="college-admin-school">
          <div className="college-admin-school-logo">{institutionName.slice(0, 1).toUpperCase()}</div>
          <div><strong>{institutionName}</strong><span>College administration</span></div>
        </div>

        <p className="college-admin-nav-caption">COLLEGE MANAGEMENT</p>
        <nav className="college-admin-nav" aria-label="College management">
          <button type="button" className={activePage === 'Overview' ? 'college-admin-nav-active' : ''} onClick={() => { setActivePage('Overview'); setSearch(''); setNotice(''); setError('') }}>
            <LayoutDashboard size={18} /><span>Overview</span>
          </button>
          {Object.entries(roles).map(([key, role]) => {
            const Icon = role.icon
            return (
              <button type="button" key={key} className={activePage === role.label ? 'college-admin-nav-active' : ''} onClick={() => { setActivePage(role.label); setSearch(''); setNotice(''); setError(''); setShowForm(false) }}>
                <Icon size={18} /><span>{role.label}</span><span className="college-admin-nav-count">{counts[key]}</span>
              </button>
            )
          })}
        </nav>

        <div className="college-admin-profile">
          <div className="college-admin-avatar">{adminName.slice(0, 1).toUpperCase()}</div>
          <div><strong>{adminName}</strong><span>College administrator</span></div>
          <button type="button" aria-label="Sign out" onClick={onLogout}><LogOut size={17} /></button>
        </div>
      </aside>

      <main className="college-admin-main">
        <header className="college-admin-topbar">
          <div className="college-admin-breadcrumb"><span>{institutionName}</span><strong>{activePage}</strong></div>
          <button type="button" className="college-admin-user-chip" onClick={onLogout}>
            <span className="college-admin-avatar college-admin-avatar-small">{adminName.slice(0, 1).toUpperCase()}</span>
            <span>{adminName}</span><LogOut size={15} />
          </button>
        </header>

        <div className="college-admin-content">
          <section className="college-admin-welcome">
            <div>
              <p className="college-admin-eyebrow">COLLEGE ADMINISTRATION <i /> ADMIN PORTAL</p>
              <h1>{activePage === 'Overview' ? `Welcome, ${adminName}` : activePage}<span>✦</span></h1>
              <p>{activePage === 'Overview' ? `${institutionName} student and staff management.` : `Register and manage ${activePage.toLowerCase()} for ${institutionName}.`}</p>
            </div>
            {currentRole && (
              <button type="button" className="college-admin-primary-button" onClick={() => openForm()}>
                <Plus size={16} /> Register {currentRole.singular.toLowerCase()}
              </button>
            )}
          </section>

          {isLoading && <p className="college-admin-notice" role="status">Loading accounts from the school database…</p>}
          {roleAssignmentError && <p className="college-admin-error" role="alert">{roleAssignmentError}</p>}
          {notice && <p className="college-admin-notice" role="status">{notice}</p>}
          {error && <p className="college-admin-error" role="alert">{error}</p>}

          {activePage === 'Overview' ? (
            <>
              <section className="college-admin-metrics" aria-label="College totals">
                {Object.entries(roles).map(([key, role]) => {
                  const Icon = role.icon
                  return (
                    <article className="college-admin-card" key={key}>
                      <div className="college-admin-card-top"><span>Total {role.label.toLowerCase()}</span><span className={`college-admin-icon college-admin-tone-${role.tone}`}><Icon size={19} /></span></div>
                      <strong>{counts[key]}</strong>
                      <p><ArrowDownRight size={13} /> Registered in this browser</p>
                    </article>
                  )
                })}
              </section>

              <section className="college-admin-panel">
                <div className="college-admin-panel-heading">
                  <div><span className="college-admin-section-kicker">DIRECTORY</span><h2>Recently added people</h2></div>
                  <div className="college-admin-quick-actions">
                    {Object.entries(roles).map(([key, role]) => (
                      <button type="button" key={key} onClick={() => { setActivePage(role.label); setSearch(''); setNotice(''); setError('') }}>
                        Register {role.singular.toLowerCase()}
                      </button>
                    ))}
                  </div>
                </div>
                <DirectoryTable
                  records={recentRecords}
                  emptyMessage={isLoading ? 'Loading directory…' : 'No students or staff have been registered yet.'}
                />
              </section>
            </>
          ) : currentRole && (
            <>
              {showForm && (
                <form className="college-admin-panel college-admin-form" onSubmit={submitRecord}>
                  <div className="college-admin-panel-heading">
                    <div><span className="college-admin-section-kicker">{currentRole.singular.toUpperCase()} DETAILS</span><h2>Register {currentRole.singular.toLowerCase()}</h2></div>
                    <button className="college-admin-close-button" type="button" aria-label="Close form" onClick={closeForm}><X size={18} /></button>
                  </div>
                  <div className="college-admin-form-grid">
                    <label>Full name<input autoComplete="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></label>
                    <label>Username<input autoComplete="username" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} required /></label>
                    <label>Email address<input type="email" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></label>
                    <label>Phone number<input type="tel" autoComplete="tel" value={form.phoneNo} onChange={(event) => setForm({ ...form, phoneNo: event.target.value })} /></label>
                    <label>Password<input type="password" autoComplete="new-password" minLength={8} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required /></label>
                    <label>Confirm password<input type="password" autoComplete="new-password" minLength={8} value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} required /></label>
                  </div>
                  <div className="college-admin-form-actions">
                    <button type="button" className="college-admin-secondary-button" onClick={closeForm}>Cancel</button>
                    <button type="submit" className="college-admin-primary-button" disabled={isSubmitting}>
                      {isSubmitting ? 'Registering…' : `Register ${currentRole.singular.toLowerCase()}`}
                    </button>
                  </div>
                </form>
              )}

              <section className="college-admin-panel college-admin-directory-panel">
                <div className="college-admin-panel-heading">
                  <div><span className="college-admin-section-kicker">{currentRole.label.toUpperCase()} DIRECTORY</span><h2>{currentRole.label} <span className="college-admin-total">{counts[activePage.toLowerCase()]}</span></h2></div>
                  <label className="college-admin-search"><Search size={16} /><input aria-label={`Search ${currentRole.label.toLowerCase()}`} placeholder={`Search ${currentRole.label.toLowerCase()}...`} value={search} onChange={(event) => setSearch(event.target.value)} /></label>
                </div>
                <DirectoryTable
                  records={filteredDirectory}
                  emptyMessage={isLoading ? 'Loading directory…' : (search ? 'No records match your search.' : `No ${currentRole.label.toLowerCase()} registered yet.`)}
                />
              </section>
            </>
          )}

          <footer className="college-admin-footer"><span>© 2026 Brightpath · College administration</span><span>{user.email || ''}</span></footer>
        </div>
      </main>
    </div>
  )
}

function DirectoryTable({ records, emptyMessage }) {
  return (
    <div className="college-admin-table-wrap">
      <table className="college-admin-table">
        <thead><tr><th>Name</th><th>Username</th><th>Contact</th></tr></thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <td><strong>{record.name}</strong><small>{roles[record.role]?.singular}</small></td>
              <td>{record.username}</td>
              <td>{record.email}<small>{record.phoneNo || 'No phone number'}</small></td>
            </tr>
          ))}
          {records.length === 0 && <tr><td className="college-admin-empty" colSpan="3">{emptyMessage}</td></tr>}
        </tbody>
      </table>
    </div>
  )
}

export default App
