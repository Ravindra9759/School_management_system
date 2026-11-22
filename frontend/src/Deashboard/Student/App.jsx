import { useMemo, useState } from 'react'
import {
  ArrowRight,
  Bell,
  BookOpen,
  Bus,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  CreditCard,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  Trophy,
} from 'lucide-react'
import './App.css'

const navigation = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'My classes', icon: BookOpen },
  { label: 'Homework', icon: FileText, count: '3' },
  { label: 'Attendance', icon: ClipboardCheck },
  { label: 'Exams & results', icon: Trophy },
  { label: 'Fees', icon: CreditCard },
  { label: 'Calendar', icon: CalendarDays },
]

const initialHomework = [
  { id: 1, subject: 'Physics', title: 'Write about Theory of Pendulum', teacher: 'Mr. Morgan · Grade 8A', due: 'Today, 4:00 PM', tone: 'violet' },
  { id: 2, subject: 'Chemistry', title: 'Change of Elements worksheet', teacher: 'Ms. Wilson · Grade 8A', due: 'Tomorrow', tone: 'mint' },
  { id: 3, subject: 'Mathematics', title: 'Problems to Solve · Page 21', teacher: 'Mr. Lee · Grade 8A', due: 'Friday, 21 Jun', tone: 'peach' },
]

const classes = [
  { time: '09:00 AM', subject: 'Mathematics', teacher: 'Mr. Morgan', room: 'Room 12', tone: 'violet' },
  { time: '10:30 AM', subject: 'Science', teacher: 'Ms. Sarah Wilson', room: 'Lab 2', tone: 'mint' },
  { time: '12:00 PM', subject: 'English', teacher: 'Mrs. Clarke', room: 'Room 08', tone: 'peach' },
]

function App({ email, onLogout }) {
  const [activePage, setActivePage] = useState('Dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [completedHomework, setCompletedHomework] = useState([])
  const [week, setWeek] = useState('This week')
  const [actionMessage, setActionMessage] = useState('')
  const isStudentId = /^(student|stu|st)(?:[-_ ]?\d|$)/i.test(email || '')
  const studentName = isStudentId ? 'Angelo Riana' : (email || 'Angelo Riana')
  const initials = studentName.split(/[ ._-]+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join('') || 'ST'

  const filteredHomework = useMemo(
    () => initialHomework.filter((item) =>
      `${item.subject} ${item.title} ${item.teacher}`.toLowerCase().includes(search.toLowerCase()),
    ),
    [search],
  )

  const navigate = (page) => {
    setActivePage(page)
    setSidebarOpen(false)
    setActionMessage('')
  }

  const toggleHomework = (id) => {
    setCompletedHomework((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  return (
    <div className="student-shell">
      <aside className={`student-sidebar ${sidebarOpen ? 'student-sidebar-open' : ''}`}>
        <a className="student-brand" href="#" onClick={(event) => event.preventDefault()} aria-label="Brightpath home">
          <span className="student-brand-mark"><GraduationCap size={21} strokeWidth={2.2} /></span>
          <span>brightpath<span>.</span></span>
        </a>
        <div className="student-school-card"><span>W</span><div><strong>Westfield Academy</strong><small>Student portal</small></div><ChevronDown size={15} /></div>
        <p className="student-nav-caption">MY SCHOOL</p>
        <nav className="student-nav" aria-label="Student navigation">
          {navigation.map(({ label, icon: Icon, count }) => (
            <button type="button" className={`student-nav-link ${activePage === label ? 'student-nav-active' : ''}`} key={label} onClick={() => navigate(label)}>
              <Icon size={18} /><span>{label}</span>{count && <span className="student-nav-count">{count}</span>}
            </button>
          ))}
        </nav>
        <div className="student-sidebar-bottom">
          <button type="button" className="student-nav-link" onClick={() => navigate('Settings')}><Settings size={18} /><span>Settings</span></button>
          <div className="student-profile"><span className="student-avatar">{initials}</span><div><strong>{studentName}</strong><small>Grade 8 · Section A</small></div><button type="button" className="student-icon-button" aria-label="Sign out" onClick={onLogout}><LogOut size={16} /></button></div>
        </div>
      </aside>
      {sidebarOpen && <button className="student-sidebar-scrim" onClick={() => setSidebarOpen(false)} aria-label="Close menu" />}

      <main className="student-main">
        <header className="student-topbar">
          <button type="button" className="student-icon-button student-menu-button" aria-label="Open menu" onClick={() => setSidebarOpen(true)}><Menu size={21} /></button>
          <div className="student-breadcrumb">Westfield Academy <ChevronRight size={14} /> <strong>{activePage}</strong></div>
          <div className="student-top-actions">
            <label className="student-search"><Search size={16} /><input aria-label="Search homework" placeholder="Search homework..." value={search} onChange={(event) => setSearch(event.target.value)} /></label>
            <div className="student-notice-wrap">
              <button type="button" className={`student-icon-button student-bell ${notificationsOpen ? 'student-pressed' : ''}`} aria-label="Notifications" onClick={() => setNotificationsOpen(!notificationsOpen)}><Bell size={19} /><i /></button>
              {notificationsOpen && <div className="student-notifications"><strong>Notifications</strong><p><i /> Science class has a lab this morning.</p><p><i className="student-notice-green" /> Your Chemistry worksheet is due tomorrow.</p></div>}
            </div>
            <div className="student-top-divider" />
            <button type="button" className="student-user-chip" onClick={onLogout}><span className="student-avatar student-avatar-small">{initials}</span><span>{studentName}</span><LogOut size={14} /></button>
          </div>
        </header>

        <div className="student-page">
          <section className="student-welcome">
            <div><p className="student-eyebrow">MONDAY, JUNE 17, 2024 <i /> WEEK 24</p><h1>{activePage === 'Dashboard' ? `Good morning, ${studentName.split(' ')[0]}` : activePage}<span>✦</span></h1><p>{activePage === 'Dashboard' ? 'Ready for a great day? Here’s your school day at a glance.' : `Your ${activePage.toLowerCase()} and latest school updates.`}</p></div>
            <button type="button" className="student-week-button" onClick={() => setWeek(week === 'This week' ? 'Next week' : 'This week')}><CalendarDays size={15} />{week}<ChevronDown size={14} /></button>
          </section>
          {actionMessage && <p className="student-feedback" role="status">{actionMessage}</p>}

          <section className="student-stats" aria-label="My school summary">
            <article className="student-stat-card"><div><span>Attendance</span><i className="stat-mint"><ClipboardCheck size={18} /></i></div><strong>96<span>%</span></strong><small><b>25 present</b> · 2 absent this term</small><div className="student-progress"><i style={{ width: '96%' }} /></div></article>
            <article className="student-stat-card"><div><span>Homework due</span><i className="stat-violet"><BookOpen size={18} /></i></div><strong>03 <em>tasks</em></strong><small><b>1 due today</b> · Keep up the good work</small><button type="button" className="student-stat-link" onClick={() => navigate('Homework')}>View homework <ArrowRight size={13} /></button></article>
            <article className="student-stat-card"><div><span>Next class</span><i className="stat-peach"><GraduationCap size={18} /></i></div><strong className="student-next-class">Science</strong><small><b>10:30 AM</b> · Lab 2 with Ms. Wilson</small><button type="button" className="student-stat-link" onClick={() => navigate('My classes')}>Open schedule <ArrowRight size={13} /></button></article>
            <article className="student-stat-card"><div><span>Latest result</span><i className="stat-blue"><Trophy size={18} /></i></div><strong>A− <em>Grade</em></strong><small><b>Term 2 report</b> · You’re improving!</small><button type="button" className="student-stat-link" onClick={() => navigate('Exams & results')}>See results <ArrowRight size={13} /></button></article>
          </section>

          <section className="student-content-grid">
            <article className="student-panel student-classes-panel">
              <div className="student-panel-heading"><div><span className="student-kicker">MONDAY · JUNE 17</span><h2>Today’s classes</h2></div><button type="button" className="student-text-link" onClick={() => navigate('My classes')}>Full timetable <ArrowRight size={14} /></button></div>
              <div className="student-class-list">
                {classes.map((lesson, index) => <div className="student-class-item" key={lesson.subject}><span className={`student-class-icon class-${lesson.tone}`}><BookOpen size={17} /></span><span className="student-class-time">{lesson.time}</span><div><strong>{lesson.subject}</strong><small>{lesson.teacher} · {lesson.room}</small></div><span className={`student-class-status ${index === 0 ? 'class-done' : index === 1 ? 'class-current' : ''}`}>{index === 0 ? 'Completed' : index === 1 ? 'Next' : 'Upcoming'}</span></div>)}
              </div>
              <div className="student-class-note"><Bus size={15} /><span>Remember: Science practical today. Bring your lab notebook.</span></div>
            </article>

            <article className="student-panel student-attendance-panel">
              <div className="student-panel-heading"><div><span className="student-kicker">THIS TERM</span><h2>Attendance</h2></div><button type="button" className="student-icon-button" aria-label="Attendance details" onClick={() => navigate('Attendance')}><ArrowRight size={17} /></button></div>
              <div className="student-attendance-summary"><div className="student-attendance-ring"><div><strong>96<span>%</span></strong><small>Present</small></div></div><div className="student-attendance-details"><div><i className="attendance-present" /><span>Present</span><strong>25 days</strong></div><div><i className="attendance-absent" /><span>Absent</span><strong>2 days</strong></div><div><i className="attendance-leave" /><span>On leave</span><strong>0 days</strong></div></div></div>
              <button type="button" className="student-card-link" onClick={() => navigate('Attendance')}>View attendance report <ArrowRight size={14} /></button>
            </article>
          </section>

          <section className="student-bottom-grid">
            <article className="student-panel student-homework-panel">
              <div className="student-panel-heading"><div><span className="student-kicker">KEEP LEARNING</span><h2>Homework <span className="student-homework-count">{filteredHomework.length}</span></h2></div><button type="button" className="student-text-link" onClick={() => navigate('Homework')}>See all <ArrowRight size={14} /></button></div>
              <div className="student-homework-list">
                {filteredHomework.map((item) => {
                  const done = completedHomework.includes(item.id)
                  return <div className={`student-homework-item ${done ? 'student-homework-done' : ''}`} key={item.id}><button type="button" className={`student-homework-check ${done ? 'student-check-done' : ''}`} onClick={() => toggleHomework(item.id)} aria-label={done ? 'Mark homework incomplete' : `Mark ${item.subject} homework complete`}>{done && <Check size={13} />}</button><span className={`student-homework-icon homework-${item.tone}`}><BookOpen size={16} /></span><div className="student-homework-copy"><span>{item.subject}</span><strong>{item.title}</strong><small>{item.teacher}</small></div><span className="student-homework-due">{done ? 'Done' : item.due}</span></div>
                })}
                {filteredHomework.length === 0 && <p className="student-empty">No homework matches “{search}”.</p>}
              </div>
            </article>

            <article className="student-panel student-fee-panel">
              <div className="student-panel-heading"><div><span className="student-kicker">STUDENT ACCOUNT</span><h2>Fee status</h2></div><CreditCard size={18} className="student-fee-icon" /></div>
              <div className="student-fee-status"><span>Term 2 tuition fee</span><strong>Paid</strong></div>
              <p className="student-fee-date">Last payment · 10 June 2024</p>
              <div className="student-fee-progress"><i /></div>
              <button type="button" className="student-card-link" onClick={() => { navigate('Fees'); setActionMessage('Your fee account is up to date.') }}>View fee details <ArrowRight size={14} /></button>
            </article>

            <article className="student-panel student-event-panel">
              <div className="student-panel-heading"><div><span className="student-kicker">SAVE THE DATE</span><h2>Coming up</h2></div><button type="button" className="student-text-link" onClick={() => navigate('Calendar')}>Calendar <ArrowRight size={14} /></button></div>
              <div className="student-event-item"><span><strong>21</strong><small>JUN</small></span><div><strong>Annual day celebration</strong><small>4:30 PM · School grounds</small></div><ChevronRight size={15} /></div>
              <div className="student-event-item"><span className="event-peach"><strong>26</strong><small>JUN</small></span><div><strong>Mathematics unit test</strong><small>9:00 AM · Room 12</small></div><ChevronRight size={15} /></div>
            </article>
          </section>

          <footer className="student-footer"><span>© 2026 Brightpath · Westfield Academy</span><span>Keep learning, keep growing <span>✦</span></span></footer>
        </div>
      </main>
      {notificationsOpen && <button type="button" className="student-dismiss-layer" aria-label="Close notifications" onClick={() => setNotificationsOpen(false)} />}
    </div>
  )
}

export default App
