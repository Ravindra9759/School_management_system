import { useState } from 'react'
import {
  ArrowRight,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  MoreHorizontal,
  Search,
  Settings,
  Users,
} from 'lucide-react'
import './App.css'

const navigation = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'My classes', icon: BookOpen },
  { label: 'Students', icon: Users },
  { label: 'Attendance', icon: ClipboardCheck },
  { label: 'Homework', icon: GraduationCap, count: '18' },
  { label: 'Schedule', icon: CalendarDays },
]

const lessons = [
  { time: '09:00 AM', end: '09:45 AM', grade: 'Grade 4 · Section C', subject: 'Mathematics', room: 'Room 12', tone: 'violet', state: 'Completed' },
  { time: '10:30 AM', end: '11:15 AM', grade: 'Grade 3 · Section B', subject: 'Science', room: 'Lab 2', tone: 'mint', state: 'Starting soon' },
  { time: '12:00 PM', end: '12:45 PM', grade: 'Grade 5 · Section A', subject: 'Mathematics', room: 'Room 18', tone: 'peach', state: 'Upcoming' },
]

const initialHomework = [
  { id: 1, title: 'Fractions · Practice worksheet', className: 'Grade 4C Mathematics', submitted: '28 / 32 submitted', tone: 'violet' },
  { id: 2, title: 'Plant cells · Lab questions', className: 'Grade 3B Science', submitted: '24 / 30 submitted', tone: 'mint' },
  { id: 3, title: 'Geometry · Chapter review', className: 'Grade 5A Mathematics', submitted: '18 / 29 submitted', tone: 'peach' },
]

const performers = [
  { name: 'Susan Boswell', className: 'Grade 4 · Section C', score: '98%', initials: 'SB', tone: 'lavender' },
  { name: 'Richard Mayes', className: 'Grade 3 · Section B', score: '96%', initials: 'RM', tone: 'peach' },
  { name: 'Veronica Randle', className: 'Grade 5 · Section A', score: '94%', initials: 'VR', tone: 'mint' },
]

const events = [
  { date: '21 JUN', title: 'Parents, teacher meet', time: '9:00 AM · School auditorium', tone: 'violet' },
  { date: '24 JUN', title: 'Vacation meeting', time: '1:00 PM · Staff room', tone: 'peach' },
  { date: '28 JUN', title: 'Staff meeting', time: '3:30 PM · Conference room', tone: 'mint' },
]

function App({ email, onLogout }) {
  const [activePage, setActivePage] = useState('Dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [markedLessons, setMarkedLessons] = useState([0])
  const [reviewedHomework, setReviewedHomework] = useState([])
  const [period, setPeriod] = useState('This month')
  const [actionMessage, setActionMessage] = useState('')
  const isTeacherId = /^(teacher|teach|tch|tc)(?:[-_ ]?\d|$)/i.test(email || '')
  const teacherName = isTeacherId ? 'Ms. Teena' : (email || 'Ms. Teena')
  const initials = teacherName.split(/[ ._-]+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join('') || 'TC'
  const filteredLessons = lessons.filter((lesson) => `${lesson.grade} ${lesson.subject} ${lesson.room}`.toLowerCase().includes(search.toLowerCase()))

  const navigate = (page) => {
    setActivePage(page)
    setSidebarOpen(false)
    setActionMessage('')
  }

  const markAttendance = (lesson) => {
    setMarkedLessons((current) => current.includes(lesson) ? current.filter((item) => item !== lesson) : [...current, lesson])
    setActionMessage(markedLessons.includes(lesson) ? 'Attendance reopened for this class.' : 'Attendance marked for this class.')
  }

  const toggleReviewed = (homework) => {
    setReviewedHomework((current) => current.includes(homework) ? current.filter((item) => item !== homework) : [...current, homework])
  }

  return (
    <div className="teacher-shell">
      <aside className={`teacher-sidebar ${sidebarOpen ? 'teacher-sidebar-open' : ''}`}>
        <a className="teacher-brand" href="#" onClick={(event) => event.preventDefault()} aria-label="Brightpath home"><span className="teacher-brand-mark"><GraduationCap size={21} strokeWidth={2.2} /></span><span>brightpath<span>.</span></span></a>
        <div className="teacher-school-card"><span>W</span><div><strong>Westfield Academy</strong><small>Teacher portal</small></div><ChevronDown size={15} /></div>
        <p className="teacher-nav-caption">TEACHING</p>
        <nav className="teacher-nav" aria-label="Teacher navigation">
          {navigation.map(({ label, icon: Icon, count }) => <button type="button" className={`teacher-nav-link ${activePage === label ? 'teacher-nav-active' : ''}`} key={label} onClick={() => navigate(label)}><Icon size={18} /><span>{label}</span>{count && <span className="teacher-nav-count">{count}</span>}</button>)}
        </nav>
        <div className="teacher-sidebar-bottom">
          <button type="button" className="teacher-nav-link" onClick={() => navigate('Settings')}><Settings size={18} /><span>Settings</span></button>
          <div className="teacher-profile"><span className="teacher-avatar teacher-avatar-profile">{initials}</span><div><strong>{teacherName}</strong><small>Mathematics teacher</small></div><button type="button" className="teacher-icon-button teacher-logout" aria-label="Sign out" onClick={onLogout}><LogOut size={16} /></button></div>
        </div>
      </aside>
      {sidebarOpen && <button className="teacher-sidebar-scrim" onClick={() => setSidebarOpen(false)} aria-label="Close menu" />}

      <main className="teacher-main">
        <header className="teacher-topbar">
          <button type="button" className="teacher-icon-button teacher-menu-button" aria-label="Open menu" onClick={() => setSidebarOpen(true)}><Menu size={21} /></button>
          <div className="teacher-breadcrumb">Westfield Academy <ChevronRight size={14} /> <strong>{activePage}</strong></div>
          <div className="teacher-top-actions">
            <label className="teacher-search"><Search size={16} /><input aria-label="Search classes" placeholder="Search classes..." value={search} onChange={(event) => setSearch(event.target.value)} /></label>
            <div className="teacher-notice-wrap"><button type="button" className={`teacher-icon-button teacher-bell ${notificationsOpen ? 'teacher-pressed' : ''}`} aria-label="Notifications" onClick={() => setNotificationsOpen(!notificationsOpen)}><Bell size={19} /><i /></button>
              {notificationsOpen && <div className="teacher-notifications"><strong>Notifications</strong><p><i /> 18 homework submissions need review.</p><p><i className="teacher-notice-green" /> Grade 4C attendance is complete.</p></div>}
            </div>
            <div className="teacher-top-divider" />
            <button type="button" className="teacher-user-chip" onClick={onLogout}><span className="teacher-avatar teacher-avatar-small">{initials}</span><span>{teacherName}</span><LogOut size={14} /></button>
          </div>
        </header>

        <div className="teacher-page">
          <section className="teacher-welcome">
            <div><p className="teacher-eyebrow">MONDAY, JUNE 17, 2024 <i /> WEEK 24</p><h1>{activePage === 'Dashboard' ? `Good morning, ${teacherName}` : activePage}<span>✦</span></h1><p>{activePage === 'Dashboard' ? 'Your classes, attendance, and tasks for today.' : `Your ${activePage.toLowerCase()} overview for Westfield Academy.`}</p></div>
            <button type="button" className="teacher-period-button" onClick={() => setPeriod(period === 'This month' ? 'This week' : 'This month')}><CalendarDays size={15} />{period}<ChevronDown size={14} /></button>
          </section>
          {actionMessage && <p className="teacher-feedback" role="status">{actionMessage}</p>}

          <section className="teacher-hero">
            <div className="teacher-hero-content"><span>YOUR CLASSROOM, AT A GLANCE</span><h2>A great day to inspire.</h2><p>You have 5 classes and 124 students on your schedule today.</p><button type="button" onClick={() => navigate('Schedule')}>View today’s schedule <ArrowRight size={14} /></button></div>
            <div className="teacher-hero-art"><div className="teacher-hero-orbit orbit-one" /><div className="teacher-hero-orbit orbit-two" /><span><BookOpen size={37} /></span><i className="hero-sparkle sparkle-one">✦</i><i className="hero-sparkle sparkle-two">✦</i></div>
            <div className="teacher-hero-date"><CalendarDays size={14} /> MONDAY <strong>17</strong> JUN</div>
          </section>

          <section className="teacher-stats" aria-label="Teaching summary">
            <article className="teacher-stat-card"><div><span>My students</span><i className="teacher-stat-violet"><Users size={18} /></i></div><strong>124</strong><small>Across 4 classes <b>↗ 6 new</b></small></article>
            <article className="teacher-stat-card"><div><span>Classes today</span><i className="teacher-stat-mint"><BookOpen size={18} /></i></div><strong>05</strong><small>Next class at <b>10:30 AM</b></small></article>
            <article className="teacher-stat-card"><div><span>Attendance taken</span><i className="teacher-stat-peach"><ClipboardCheck size={18} /></i></div><strong>01 <em>/ 05</em></strong><small><b>4 classes</b> remaining today</small></article>
            <article className="teacher-stat-card"><div><span>Homework to review</span><i className="teacher-stat-blue"><GraduationCap size={18} /></i></div><strong>18</strong><small><b>12 submitted today</b> · across classes</small></article>
          </section>

          <section className="teacher-main-grid">
            <article className="teacher-panel teacher-lessons-panel">
              <div className="teacher-panel-heading"><div><span className="teacher-kicker">MONDAY · JUNE 17</span><h2>Today’s classes</h2></div><button type="button" className="teacher-text-link" onClick={() => navigate('Schedule')}>Full schedule <ArrowRight size={14} /></button></div>
              <div className="teacher-lesson-list">
                {filteredLessons.map((lesson) => {
                  const index = lessons.indexOf(lesson)
                  const complete = markedLessons.includes(index)
                  return <div className="teacher-lesson" key={`${lesson.time}-${lesson.subject}`}><div className="teacher-lesson-time"><strong>{lesson.time}</strong><span>{lesson.end}</span></div><span className={`teacher-subject-icon subject-${lesson.tone}`}><BookOpen size={17} /></span><div className="teacher-lesson-copy"><span>{lesson.grade}</span><strong>{lesson.subject}</strong><small>{lesson.room}</small></div><button type="button" className={`teacher-attendance-button ${complete ? 'attendance-marked' : ''}`} onClick={() => markAttendance(index)}>{complete ? <><Check size={12} /> Taken</> : 'Take attendance'}</button></div>
                })}
                {filteredLessons.length === 0 && <p className="teacher-empty">No classes match “{search}”.</p>}
              </div>
              <div className="teacher-class-footer"><Clock3 size={14} /><span>Next class starts in <strong>38 minutes</strong></span><button type="button" onClick={() => navigate('Attendance')}>Attendance overview <ArrowRight size={13} /></button></div>
            </article>

            <article className="teacher-panel teacher-performers-panel">
              <div className="teacher-panel-heading"><div><span className="teacher-kicker">CELEBRATE THEIR PROGRESS</span><h2>Best performers</h2></div><button type="button" className="teacher-icon-button" aria-label="More student options" onClick={() => navigate('Students')}><MoreHorizontal size={19} /></button></div>
              <p className="teacher-panel-description">Top scores across your classes this month.</p>
              <div className="teacher-performer-list">{performers.map((student, index) => <div className="teacher-performer" key={student.name}><span className={`teacher-avatar student-${student.tone}`}>{student.initials}</span><div><strong>{student.name}</strong><small>{student.className}</small></div><span className="teacher-rank">{index === 0 ? '✦ ' : ''}{student.score}</span></div>)}</div>
              <button type="button" className="teacher-card-link" onClick={() => navigate('Students')}>View student progress <ArrowRight size={14} /></button>
            </article>
          </section>

          <section className="teacher-lower-grid">
            <article className="teacher-panel teacher-homework-panel">
              <div className="teacher-panel-heading"><div><span className="teacher-kicker">CLASSROOM TASKS</span><h2>Homework to review <span className="teacher-task-count">18</span></h2></div><button type="button" className="teacher-text-link" onClick={() => navigate('Homework')}>All homework <ArrowRight size={14} /></button></div>
              <div className="teacher-homework-list">{initialHomework.map((item) => {
                const reviewed = reviewedHomework.includes(item.id)
                return <div className="teacher-homework-item" key={item.id}><span className={`teacher-homework-icon homework-${item.tone}`}><BookOpen size={16} /></span><div><strong>{item.title}</strong><small>{item.className} · {item.submitted}</small></div><button type="button" className={reviewed ? 'homework-reviewed' : ''} onClick={() => toggleReviewed(item.id)}>{reviewed ? <><Check size={12} /> Reviewed</> : 'Review'}</button></div>
              })}</div>
            </article>

            <article className="teacher-panel teacher-progress-panel">
              <div className="teacher-panel-heading"><div><span className="teacher-kicker">STUDENT PROGRESS</span><h2>This month</h2></div><button type="button" className="teacher-icon-button" aria-label="Progress options" onClick={() => setPeriod(period === 'This month' ? 'This week' : 'This month')}><MoreHorizontal size={19} /></button></div>
              <div className="teacher-progress-summary"><strong>84<span>%</span></strong><span className="progress-up">↗ 6.4%</span><small>Class average · up from last month</small></div>
              <div className="teacher-progress-bars"><div><span>Grade 4C</span><i><b style={{ width: '91%' }} /></i><strong>91%</strong></div><div><span>Grade 3B</span><i><b style={{ width: '84%' }} /></i><strong>84%</strong></div><div><span>Grade 5A</span><i><b style={{ width: '78%' }} /></i><strong>78%</strong></div></div>
            </article>

            <article className="teacher-panel teacher-events-panel">
              <div className="teacher-panel-heading"><div><span className="teacher-kicker">ON YOUR CALENDAR</span><h2>Upcoming events</h2></div><button type="button" className="teacher-text-link" onClick={() => navigate('Schedule')}>Calendar <ArrowRight size={14} /></button></div>
              <div className="teacher-event-list">{events.map((event) => <div className="teacher-event" key={event.title}><span className={`teacher-event-date event-${event.tone}`}>{event.date}</span><div><strong>{event.title}</strong><small>{event.time}</small></div><ChevronRight size={14} /></div>)}</div>
            </article>
          </section>

          <footer className="teacher-footer"><span>© 2026 Brightpath · Westfield Academy</span><span>Thank you for making a difference <span>✦</span></span></footer>
        </div>
      </main>
      {notificationsOpen && <button type="button" className="teacher-dismiss-layer" aria-label="Close notifications" onClick={() => setNotificationsOpen(false)} />}
    </div>
  )
}

export default App
