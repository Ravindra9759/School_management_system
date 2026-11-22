import { useMemo, useState } from 'react'
import {
  ArrowDownRight,
  ArrowRight,
  Bell,
  BookOpen,
  Bus,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  CreditCard,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Search,
  Settings,
  ShieldCheck,
  X,
} from 'lucide-react'
import './App.css'

const children = [
  { name: 'Janet Bown', grade: 'Grade 3 · Section A', initials: 'JB', color: 'lavender', id: 'ST-35013' },
  { name: 'Oliver Bown', grade: 'Grade 1 · Section B', initials: 'OB', color: 'peach', id: 'ST-35028' },
]

const initialHomework = [
  { id: 1, subject: 'Physics', title: 'Write about Theory of Pendulum', teacher: 'Aaron Williams', due: 'Today, 4:00 PM', color: 'blue' },
  { id: 2, subject: 'Chemistry', title: 'Change of Elements — worksheet', teacher: 'Hellana David', due: 'Tomorrow', color: 'green' },
  { id: 3, subject: 'Mathematics', title: 'Problems to Solve · Page 21', teacher: 'Morgan Lee', due: 'Fri, 21 Jun', color: 'purple' },
]

const initialNotices = [
  { title: 'New syllabus and class instructions', date: 'Today · 9:15 AM', tag: 'Academic' },
  { title: 'World Environment Day program', date: 'Yesterday · 2:30 PM', tag: 'Events' },
  { title: 'Exam preparation notification', date: '12 Jun · 11:00 AM', tag: 'Reminder' },
]

const navigation = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Attendance', icon: ClipboardCheck },
  { label: 'Homework', icon: BookOpen, count: '3' },
  { label: 'Fees & payments', icon: CreditCard },
  { label: 'Events calendar', icon: CalendarDays },
  { label: 'Transport', icon: Bus },
  { label: 'Messages', icon: MessageCircle, count: '2' },
]

function App({ onLogout }) {
  const [activePage, setActivePage] = useState('Overview')
  const [selectedChild, setSelectedChild] = useState(0)
  const [period, setPeriod] = useState('This month')
  const [completedHomework, setCompletedHomework] = useState([])
  const [search, setSearch] = useState('')
  const [noticeOpen, setNoticeOpen] = useState(false)
  const [modal, setModal] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [leaveSent, setLeaveSent] = useState(false)
  const [paidFees, setPaidFees] = useState([])
  const child = children[selectedChild]

  const filteredHomework = useMemo(
    () => initialHomework.filter((item) =>
      `${item.subject} ${item.title} ${item.teacher}`.toLowerCase().includes(search.toLowerCase()),
    ),
    [search],
  )

  const toggleHomework = (id) => {
    setCompletedHomework((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  const closeModal = () => {
    setModal('')
    setLeaveSent(false)
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <a className="brand" href="#" onClick={(event) => event.preventDefault()} aria-label="Brightpath home">
          <span className="brand-mark"><GraduationCap size={21} strokeWidth={2.2} /></span>
          <span>brightpath<span className="brand-period">.</span></span>
        </a>

        <div className="school-switcher">
          <div className="school-logo">W</div>
          <div className="school-copy"><strong>Westfield Academy </strong><span>Parent portal</span></div>
          <ChevronDown size={16} />
        </div>

        <p className="nav-caption">PARENT MENU</p>
        <nav className="main-nav" aria-label="Main navigation">
          {navigation.map(({ label, icon: Icon, count }) => (
            <button
              className={`nav-link ${activePage === label ? 'nav-active' : ''}`}
              key={label}
              onClick={() => { setActivePage(label); setSidebarOpen(false) }}
              type="button"
            >
              <Icon size={18} />
              <span>{label}</span>
              {count && <span className="nav-count">{count}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon"><CircleHelp size={17} /></div>
            <strong>Need a hand?</strong>
            <p>We’re here to help with anything you need.</p>
            <button type="button" onClick={() => setActivePage('Messages')}>Contact support <ArrowRight size={14} /></button>
          </div>
          <button type="button" className="nav-link sidebar-setting" onClick={() => setModal('settings')}>
            <Settings size={18} /><span>Settings</span>
          </button>
          <div className="sidebar-profile">
            <div className="avatar avatar-parent">TB</div>
            <div className="sidebar-person"><strong>Thomas Bown</strong><span>Parent account</span></div>
            <button type="button" aria-label="Sign out" className="icon-button logout-button" onClick={onLogout}><LogOut size={17} /></button>
          </div>
        </div>
      </aside>

      {sidebarOpen && <button className="sidebar-scrim" onClick={() => setSidebarOpen(false)} aria-label="Close menu" />}

      <main className="main-area">
        <header className="topbar">
          <button type="button" className="icon-button menu-button" aria-label="Open menu" onClick={() => setSidebarOpen(true)}><Menu size={21} /></button>
          <div className="breadcrumb"><span>Parent portal</span><ChevronRight size={14} /><strong>{activePage}</strong></div>
          <div className="topbar-actions">
            <label className="search-field">
              <Search size={17} />
              <input aria-label="Search dashboard" placeholder="Search anything..." value={search} onChange={(event) => setSearch(event.target.value)} />
              <kbd>⌘ K</kbd>
            </label>
            <div className="notification-wrap">
              <button type="button" className={`icon-button notification-button ${noticeOpen ? 'pressed' : ''}`} aria-label="Notifications" onClick={() => setNoticeOpen(!noticeOpen)}>
                <Bell size={19} /><span className="notification-dot" />
              </button>
              {noticeOpen && (
                <div className="notification-popover">
                  <div className="popover-heading"><strong>Notifications</strong><span>2 new</span></div>
                  <p><span className="notice-dot" /> Janet’s class has a field trip this Friday.</p>
                  <p><span className="notice-dot notice-dot-green" /> Your monthly fee statement is ready.</p>
                  <button type="button" onClick={() => { setActivePage('Messages'); setNoticeOpen(false) }}>See all updates <ArrowRight size={14} /></button>
                </div>
              )}
            </div>
            <div className="topbar-divider" />
            <button type="button" className="user-chip" onClick={() => setModal('profile')}>
              <span className="avatar avatar-parent avatar-small">TB</span>
              <span className="user-chip-name">Thomas Bown</span>
              <ChevronDown size={15} />
            </button>
          </div>
        </header>

        <div className="page-content">
          <section className="welcome-row">
            <div>
              <p className="eyebrow">MONDAY, JUNE 17, 2024 <span className="eyebrow-dot" /> WEEK 24</p>
              <h1>Good morning, Thomas <span className="wave">✦</span></h1>
              <p className="welcome-subtitle">Here’s what’s happening with your family at school today.</p>
            </div>
            <button type="button" className="primary-button" onClick={() => setModal('leave')}><CalendarDays size={16} /> Apply for leave</button>
          </section>

          <section className="children-bar">
            <div className="children-heading"><span className="children-title">Your children</span><span className="child-count">02</span></div>
            <div className="child-switcher" role="group" aria-label="Select child">
              {children.map((item, index) => (
                <button type="button" key={item.id} className={`child-option ${selectedChild === index ? 'child-selected' : ''}`} onClick={() => setSelectedChild(index)}>
                  <span className={`avatar avatar-child ${item.color}`}>{item.initials}</span>
                  <span className="child-info"><strong>{item.name}</strong><small>{item.grade}</small></span>
                  {selectedChild === index && <span className="selected-check"><Check size={12} /></span>}
                </button>
              ))}
              <button type="button" className="add-child" onClick={() => setModal('add-child')}><span>+</span> Add child</button>
            </div>
          </section>

          {activePage !== 'Overview' && (
            <div className="page-context">
              <div><p className="eyebrow">FAMILY PORTAL</p><h2>{activePage}</h2><p>Viewing {activePage.toLowerCase()} information for {child.name}.</p></div>
              <button type="button" className="text-button" onClick={() => setActivePage('Overview')}><ChevronLeft size={16} /> Back to overview</button>
            </div>
          )}

          <section className="overview-grid" aria-label="School dashboard">
            <article className="student-card">
              <div className="student-card-top">
                <div className="student-avatar-wrap">
                  <div className={`student-avatar ${child.color}`}>{child.initials}</div>
                  <span className="online-indicator" />
                </div>
                <span className="student-status"><span /> Enrolled</span>
              </div>
              <p className="student-label">STUDENT PROFILE <span className="student-id">{child.id}</span></p>
              <h2>{child.name}</h2>
              <p className="student-grade">{child.grade} <span>·</span> Westfield Academy</p>
              <div className="student-card-divider" />
              <div className="student-meta">
                <div><span>Class teacher</span><strong>Ms. Sarah Wilson</strong></div>
                <button type="button" className="message-teacher" onClick={() => setActivePage('Messages')}><MessageCircle size={15} /> Message</button>
              </div>
              <div className="card-decoration decoration-one" /><div className="card-decoration decoration-two" />
            </article>

            <article className="attendance-card panel">
              <div className="panel-heading">
                <div><span className="section-kicker">ATTENDANCE</span><h2>Looking good!</h2></div>
                <button type="button" className="select-button" onClick={() => setPeriod(period === 'This month' ? 'This year' : 'This month')}>{period}<ChevronDown size={14} /></button>
              </div>
              <div className="attendance-content">
                <div className="attendance-ring" aria-label="96 percent attendance"><div><strong>96<span>%</span></strong><small>Attendance</small></div></div>
                <div className="attendance-details">
                  <div className="attendance-stat"><span className="legend-dot present-dot" /><span>Present</span><strong>{period === 'This month' ? '21' : '184'} days</strong></div>
                  <div className="attendance-stat"><span className="legend-dot absent-dot" /><span>Absent</span><strong>{period === 'This month' ? '1' : '4'} day</strong></div>
                  <div className="attendance-stat"><span className="legend-dot leave-dot" /><span>On leave</span><strong>1 day</strong></div>
                </div>
              </div>
              <button type="button" className="card-footer-link" onClick={() => setActivePage('Attendance')}>View attendance report <ArrowRight size={14} /></button>
            </article>

            <article className="leave-card panel">
              <div className="panel-heading"><div><span className="section-kicker">LEAVE BALANCE</span><h2>Time to recharge</h2></div><span className="leave-emoji">🌿</span></div>
              <div className="leave-balance">
                <div className="leave-balance-row"><span className="leave-type-dot casual" /> Casual leave <strong>8 <small>days</small></strong></div>
                <div className="leave-progress"><span className="casual-progress" /></div>
                <div className="leave-balance-row"><span className="leave-type-dot medical" /> Medical leave <strong>10 <small>days</small></strong></div>
                <div className="leave-progress"><span className="medical-progress" /></div>
              </div>
              <button type="button" className="card-footer-link" onClick={() => setModal('leave')}>Request a day off <ArrowRight size={14} /></button>
            </article>

            <article className="panel events-card">
              <div className="panel-heading"><div><span className="section-kicker">MARK YOUR CALENDAR</span><h2>Upcoming events</h2></div><button type="button" className="text-button" onClick={() => setActivePage('Events calendar')}>View calendar <ArrowRight size={14} /></button></div>
              <div className="event-list">
                <div className="event-item"><div className="event-date"><strong>21</strong><span>JUN</span></div><div className="event-copy"><strong>Parent–teacher meeting</strong><span>9:00 AM – 12:00 PM <i /> School auditorium</span></div><span className="event-tag tag-blue">School</span></div>
                <div className="event-item"><div className="event-date date-peach"><strong>24</strong><span>JUN</span></div><div className="event-copy"><strong>Annual day celebration</strong><span>4:30 PM – 7:00 PM <i /> Main school grounds</span></div><span className="event-tag tag-peach">Event</span></div>
              </div>
            </article>

            <article className="panel homework-card">
              <div className="panel-heading homework-heading">
                <div><span className="section-kicker">A LITTLE LEARNING</span><h2>Homework <span className="heading-count">03</span></h2></div>
                <button type="button" className="text-button" onClick={() => setActivePage('Homework')}>See all <ArrowRight size={14} /></button>
              </div>
              <div className="homework-list">
                {filteredHomework.map((item) => {
                  const done = completedHomework.includes(item.id)
                  return (
                    <div className={`homework-item ${done ? 'homework-done' : ''}`} key={item.id}>
                      <button type="button" className={`homework-check ${done ? 'check-done' : ''}`} onClick={() => toggleHomework(item.id)} aria-label={done ? 'Mark homework incomplete' : 'Mark homework complete'}>{done && <Check size={13} />}</button>
                      <span className={`subject-icon subject-${item.color}`}><BookOpen size={16} /></span>
                      <div className="homework-copy"><span>{item.subject}</span><strong>{item.title}</strong><small>{item.teacher}</small></div>
                      <span className="homework-due">{done ? 'Completed' : item.due}</span>
                      <button type="button" className="icon-button more-button" aria-label={`More options for ${item.title}`} onClick={() => setModal(`homework-${item.id}`)}><MoreHorizontal size={18} /></button>
                    </div>
                  )
                })}
                {filteredHomework.length === 0 && <p className="empty-search">No homework matches “{search}”.</p>}
              </div>
            </article>

            <article className="panel fees-card">
              <div className="panel-heading"><div><span className="section-kicker">STAY ON TRACK</span><h2>Fee reminders</h2></div><button type="button" className="text-button" onClick={() => setActivePage('Fees & payments')}>All fees <ArrowRight size={14} /></button></div>
              <div className="fees-highlight"><span className="fees-icon"><CreditCard size={17} /></span><div><span>Next payment due</span><strong>25 June 2024</strong></div><span className="due-pill">In 8 days</span></div>
              <div className="fee-row"><div><strong>Tuition fee</strong><span>Term 2 · 2024</span></div><strong>$2,500</strong></div>
              <div className="fee-row"><div><strong>Transport fee</strong><span>June 2024</span></div><strong>$250</strong></div>
              <button type="button" className="pay-button" onClick={() => setModal('payment')}><CreditCard size={15} /> Pay $2,750 <ArrowRight size={15} /></button>
            </article>

            <article className="panel results-card">
              <div className="panel-heading"><div><span className="section-kicker">KEEP IT UP</span><h2>Latest results</h2></div><button type="button" className="text-button" onClick={() => setActivePage('Results')}>Full report <ArrowRight size={14} /></button></div>
              <div className="result-summary"><div className="result-grade">A<span>−</span></div><div><strong>Doing great, {child.name.split(' ')[0]}!</strong><span>Term 2 · Progress report</span></div><span className="result-change"><ArrowDownRight size={14} /> 4.2%</span></div>
              <div className="subject-results">
                <div><span>Mathematics</span><div className="result-track"><i style={{ width: '92%' }} /></div><strong>92</strong></div>
                <div><span>Science</span><div className="result-track"><i className="track-green" style={{ width: '88%' }} /></div><strong>88</strong></div>
                <div><span>English</span><div className="result-track"><i className="track-orange" style={{ width: '84%' }} /></div><strong>84</strong></div>
              </div>
            </article>

            <article className="panel notices-card">
              <div className="panel-heading"><div><span className="section-kicker">FROM YOUR SCHOOL</span><h2>Notice board</h2></div><button type="button" className="icon-button more-button" aria-label="More notices" onClick={() => setActivePage('Messages')}><MoreHorizontal size={19} /></button></div>
              <div className="notice-list">
                {initialNotices.map((notice, index) => (
                  <button type="button" className="notice-item" key={notice.title} onClick={() => setModal(`notice-${index}`)}>
                    <span className={`notice-icon notice-icon-${index}`}><FileText size={16} /></span>
                    <span className="notice-copy"><strong>{notice.title}</strong><small>{notice.date}</small></span>
                    <ChevronRight size={16} />
                  </button>
                ))}
              </div>
              <button type="button" className="card-footer-link" onClick={() => setActivePage('Messages')}>See all announcements <ArrowRight size={14} /></button>
            </article>
          </section>
          <footer className="page-footer"><span>© 2024 Brightpath School Portal</span><span><ShieldCheck size={13} /> Your family’s information is private</span></footer>
        </div>
      </main>

      {modal && (
        <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) closeModal() }}>
          <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
            <div className="dialog-heading"><div><span className="dialog-icon"><GraduationCap size={19} /></span><div><span className="section-kicker">BRIGHTPATH PORTAL</span><h2 id="dialog-title">{modal === 'leave' ? 'Apply for leave' : modal === 'payment' ? 'Fee payment' : modal === 'profile' ? 'Parent profile' : modal === 'settings' ? 'Portal settings' : modal === 'logout' ? 'Sign out' : modal === 'add-child' ? 'Add a child' : modal.startsWith('homework') ? 'Homework details' : 'School announcement'}</h2></div></div><button type="button" className="icon-button" aria-label="Close dialog" onClick={closeModal}><X size={19} /></button></div>
            {modal === 'leave' ? (
              leaveSent ? <div className="success-message"><span><Check size={20} /></span><strong>Leave request sent</strong><p>The school has received your request for {child.name.split(' ')[0]}. You can track its status in your leave balance.</p></div> :
                <form className="leave-form" onSubmit={(event) => { event.preventDefault(); setLeaveSent(true) }}>
                  <label>Child<select defaultValue={child.id}><option value={children[0].id}>{children[0].name}</option><option value={children[1].id}>{children[1].name}</option></select></label>
                  <div className="form-two"><label>Leave type<select><option>Casual leave</option><option>Medical leave</option></select></label><label>Date<input type="date" defaultValue="2024-06-21" /></label></div>
                  <label>Reason<textarea required placeholder="Let the school know why your child will be away..." rows="3" /></label>
                  <button type="submit" className="primary-button form-submit">Send request <ArrowRight size={15} /></button>
                </form>
            ) : modal === 'payment' ? (
              paidFees.includes(child.id) ? <div className="success-message"><span><Check size={20} /></span><strong>Payment complete</strong><p>Your payment of $2,750 for {child.name} has been recorded.</p></div> :
                <div className="payment-summary"><p>Outstanding balance for <strong>{child.name}</strong></p><div className="payment-total"><span>Tuition + transport fees</span><strong>$2,750.00</strong></div><button type="button" className="primary-button form-submit" onClick={() => setPaidFees((current) => [...current, child.id])}><CreditCard size={16} /> Confirm payment</button><small>Secure payment · No payment details are collected in this demo.</small></div>
            ) : (
              <div className="simple-dialog-content">
                <p>{modal === 'profile' ? 'Thomas Bown · Parent account · thomas.bown@example.com' : modal === 'settings' ? 'Manage your account preferences, notifications, and privacy settings.' : modal === 'logout' ? 'Your account has been signed out.' : modal === 'add-child' ? 'To link another student to your account, please contact the school office.' : modal.startsWith('homework') ? 'Review this assignment with your child and mark it complete when finished.' : 'Open this announcement in the school messages area to read the full details.'}</p>
                <button type="button" className="primary-button form-submit" onClick={closeModal}>Got it</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
