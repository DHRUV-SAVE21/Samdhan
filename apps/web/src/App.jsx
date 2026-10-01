import { useEffect, useMemo, useState } from 'react'
import './Landing.css'
import BloodLoader from './components/BloodLoader'
import Icon from './components/Icon'
import SmartBloodBoxVisual from './components/SmartBloodBoxVisual'
import { CAMPAIGN_HIGHLIGHTS, PLATFORM_MODULES } from './data/bloodgridData'
import {
  createBloodRequest,
  fetchDashboardStats,
  fetchDonors,
  fetchInventory,
  fetchRequests,
  getCurrentUser,
  loginUser,
  logoutUser,
  registerDonor,
  registerUser,
  updateInventoryUnit,
  verifyCustodyChain
} from './services/api'

const PRIMARY_NAV = [
  { path: '/', label: 'Home', icon: 'home' },
  { path: '/dashboard', label: 'Command Center', icon: 'dashboard' },
  { path: '/request-blood', label: 'Request Blood', icon: 'activity' },
  { path: '/donor-network', label: 'Donor Network', icon: 'users' }
]

const SERVICES_DROPDOWN = [
  {
    path: '/smart-box',
    label: 'Smart Blood Box IoT',
    sub: 'Live 2°C–6°C cold-chain telemetry',
    endpoint: '/api/feature/smart-box',
    icon: 'thermometer'
  },
  {
    path: '/inventory',
    label: 'Blood Bank Inventory',
    sub: 'Regional group reserves & FEFO alerts',
    endpoint: '/api/feature/inventory',
    icon: 'droplet'
  },
  {
    path: '/custody',
    label: 'Chain of Custody',
    sub: 'Vein-to-vein QR verification',
    endpoint: '/api/feature/custody/verify',
    icon: 'qr'
  },
  {
    path: '/request-blood',
    label: 'Emergency Dispatch API',
    sub: 'Hospital requisition & geo-ring alert',
    endpoint: '/api/feature/requests',
    icon: 'truck'
  }
]

function useRouter() {
  const [path, setPath] = useState(() => window.location.pathname || '/')

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname || '/')
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const navigate = (nextPath) => {
    if (nextPath !== window.location.pathname) {
      window.history.pushState({}, '', nextPath)
      setPath(nextPath)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return { path, navigate }
}

export default function App() {
  const { path, navigate } = useRouter()

  const [showLoader, setShowLoader] = useState(true)

  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('bg_theme') || 'light'
    } catch {
      return 'light'
    }
  })

  const [user, setUser] = useState(() => getCurrentUser())
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)

  // Shared live state backed by /api/feature/*
  const [stats, setStats] = useState(null)
  const [requests, setRequests] = useState([])
  const [donors, setDonors] = useState([])
  const [stocks, setStocks] = useState([])
  const [toast, setToast] = useState(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem('bg_theme', theme)
    } catch {
      // ignore storage errors
    }
  }, [theme])

  // Ensure Ctrl+R / Cmd+R / F5 always triggers a full website refresh from any view
  useEffect(() => {
    const onKeyDown = (e) => {
      const isCtrlR = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'r'
      const isF5 = e.key === 'F5'
      if (isCtrlR || isF5) {
        e.preventDefault()
        try {
          sessionStorage.clear()
        } catch {
          // ignore
        }
        window.location.reload()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const showNotification = (message, type = 'info') => {
    setToast({ message, type })
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev))
    }, 4200)
  }

  const refreshFeatureData = async () => {
    const [statsRes, reqRes, donorRes, invRes] = await Promise.all([
      fetchDashboardStats(),
      fetchRequests(),
      fetchDonors(),
      fetchInventory()
    ])
    setStats(statsRes)
    setRequests(reqRes.items || [])
    setDonors(donorRes.items || [])
    setStocks(invRes.items || [])
  }

  useEffect(() => {
    let active = true
    Promise.all([
      fetchDashboardStats(),
      fetchRequests(),
      fetchDonors(),
      fetchInventory()
    ]).then(([statsRes, reqRes, donorRes, invRes]) => {
      if (!active) return
      setStats(statsRes)
      setRequests(reqRes.items || [])
      setDonors(donorRes.items || [])
      setStocks(invRes.items || [])
    })
    return () => {
      active = false
    }
  }, [])

  const handleLoaderFinish = () => {
    setShowLoader(false)
  }

  const handleNav = (targetPath) => {
    setMobileMenuOpen(false)
    setServicesOpen(false)
    navigate(targetPath)
  }

  const handleLogout = () => {
    logoutUser()
    setUser(null)
    showNotification('Signed out of BloodGrid session.')
    handleNav('/')
  }

  return (
    <div className="bg-app">
      {showLoader && <BloodLoader onFinish={handleLoaderFinish} />}

      {/* Sticky Top Navbar modeled after annadatasaathi.vercel.app */}
      <header className="bg-navbar">
        <div className="bg-navbar__container">
          <div className="bg-navbar__left">
            <button
              type="button"
              className="bg-navbar__burger"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
            >
              <Icon name="menu" size={20} />
            </button>

            <a
              href="/"
              onClick={(e) => {
                e.preventDefault()
                handleNav('/')
              }}
              className="bg-brand"
            >
              <img
                src="/bloodgrid-logo.jpg"
                alt="BloodGrid Logo"
                className="bg-brand__logo"
              />
              <div className="bg-brand__text">
                <span className="bg-brand__name">BloodGrid</span>
                <span className="bg-brand__tagline">Emergency Blood Network</span>
              </div>
            </a>
          </div>

          {/* Desktop Center Navigation */}
          <nav className="bg-navbar__Links" aria-label="Main Navigation">
            {PRIMARY_NAV.map((item) => {
              const isActive = path === item.path
              return (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault()
                    handleNav(item.path)
                  }}
                  className={`bg-nav-link ${isActive ? 'is-active' : ''}`}
                >
                  <Icon name={item.icon} size={16} />
                  <span>{item.label}</span>
                </a>
              )
            })}

            {/* Services Hover Dropdown */}
            <div
              className="bg-dropdown"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                type="button"
                className={`bg-nav-link bg-dropdown__trigger ${
                  ['/smart-box', '/inventory', '/custody'].includes(path) ? 'is-active' : ''
                }`}
                onClick={() => setServicesOpen((prev) => !prev)}
              >
                <Icon name="box" size={16} />
                <span>Services</span>
                <Icon name="chevronDown" size={15} />
              </button>

              {servicesOpen && (
                <div className="bg-dropdown__menu">
                  <div className="bg-dropdown__header">
                    <span>Platform Modules & API Endpoints</span>
                  </div>
                  {SERVICES_DROPDOWN.map((srv) => (
                    <a
                      key={srv.path + srv.label}
                      href={srv.path}
                      onClick={(e) => {
                        e.preventDefault()
                        handleNav(srv.path)
                      }}
                      className="bg-dropdown__item"
                    >
                      <span className="bg-dropdown__icon">
                        <Icon name={srv.icon} size={18} />
                      </span>
                      <span className="bg-dropdown__body">
                        <strong>{srv.label}</strong>
                        <small>{srv.sub}</small>
                        <code>{srv.endpoint}</code>
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right Controls: Theme Toggle + Auth */}
          <div className="bg-navbar__right">
            <button
              type="button"
              className="bg-icon-btn"
              onClick={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
              title={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
              aria-label="Toggle color theme"
            >
              <Icon name={theme === 'light' ? 'moon' : 'sun'} size={18} />
            </button>

            {user ? (
              <div className="bg-user-pill">
                <button
                  type="button"
                  className="bg-user-pill__profile"
                  onClick={() => handleNav('/dashboard')}
                >
                  <span className="bg-user-pill__avatar">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                  <span className="bg-user-pill__info">
                    <strong>{user.name}</strong>
                    <small>{user.role} · {user.bloodGroup}</small>
                  </span>
                </button>
                <button
                  type="button"
                  className="bg-user-pill__logout"
                  onClick={handleLogout}
                  title="Sign Out"
                >
                  <Icon name="logout" size={16} />
                </button>
              </div>
            ) : (
              <a
                href="/auth"
                onClick={(e) => {
                  e.preventDefault()
                  handleNav('/auth')
                }}
                className="bg-btn bg-btn--primary bg-btn--sm"
              >
                <Icon name="login" size={16} />
                <span>Login / Register</span>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Slide-Out Drawer (matches annadatasaathi mobile navigation pattern) */}
      {mobileMenuOpen && (
        <div className="bg-drawer-backdrop" onClick={() => setMobileMenuOpen(false)}>
          <aside className="bg-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="bg-drawer__top">
              <div className="bg-brand">
                <img src="/bloodgrid-logo.jpg" alt="BloodGrid" className="bg-brand__logo" />
                <div className="bg-brand__text">
                  <span className="bg-brand__name">BloodGrid</span>
                  <span className="bg-brand__tagline">Emergency Blood Network</span>
                </div>
              </div>
              <button
                type="button"
                className="bg-icon-btn"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            {user && (
              <div className="bg-drawer__user">
                <div className="bg-user-pill__avatar">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <strong>{user.name}</strong>
                  <p>{user.role} · Group {user.bloodGroup}</p>
                </div>
              </div>
            )}

            <div className="bg-drawer__section">
              <span className="bg-drawer__label">Navigation</span>
              {PRIMARY_NAV.map((item) => (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault()
                    handleNav(item.path)
                  }}
                  className={`bg-drawer__link ${path === item.path ? 'is-active' : ''}`}
                >
                  <Icon name={item.icon} size={18} />
                  <span>{item.label}</span>
                </a>
              ))}
            </div>

            <div className="bg-drawer__section">
              <span className="bg-drawer__label">Platform Services</span>
              {SERVICES_DROPDOWN.map((srv) => (
                <a
                  key={srv.path + srv.label}
                  href={srv.path}
                  onClick={(e) => {
                    e.preventDefault()
                    handleNav(srv.path)
                  }}
                  className={`bg-drawer__link ${path === srv.path ? 'is-active' : ''}`}
                >
                  <Icon name={srv.icon} size={18} />
                  <div>
                    <div>{srv.label}</div>
                    <small className="bg-drawer__endpoint">{srv.endpoint}</small>
                  </div>
                </a>
              ))}
            </div>

            <div className="bg-drawer__footer">
              {user ? (
                <button
                  type="button"
                  className="bg-btn bg-btn--outline bg-btn--full"
                  onClick={handleLogout}
                >
                  <Icon name="logout" size={16} />
                  <span>Sign Out</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="bg-btn bg-btn--primary bg-btn--full"
                  onClick={() => handleNav('/auth')}
                >
                  <Icon name="login" size={16} />
                  <span>Login / Register</span>
                </button>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`bg-toast bg-toast--${toast.type}`} role="status">
          <Icon name="check" size={16} />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Multi-Page Route Outlet */}
      <main className="bg-main">
        {path === '/' && (
          <HomePage
            navigate={handleNav}
            stats={stats}
            requests={requests}
            stocks={stocks}
          />
        )}

        {path === '/auth' && (
          <AuthPage
            user={user}
            onAuthSuccess={(loggedUser, msg) => {
              setUser(loggedUser)
              showNotification(msg, 'success')
              handleNav('/dashboard')
            }}
            navigate={handleNav}
          />
        )}

        {path === '/dashboard' && (
          <DashboardPage
            stats={stats}
            requests={requests}
            stocks={stocks}
            donors={donors}
            navigate={handleNav}
          />
        )}

        {path === '/request-blood' && (
          <RequestBloodPage
            requests={requests}
            onCreateRequest={async (payload) => {
              const res = await createBloodRequest(payload)
              await refreshFeatureData()
              showNotification(
                `Emergency requisition ${res.request.id} broadcast to ${res.request.radius}.`,
                'success'
              )
            }}
          />
        )}

        {path === '/donor-network' && (
          <DonorNetworkPage
            donors={donors}
            onRegisterDonor={async (payload) => {
              const res = await registerDonor(payload)
              await refreshFeatureData()
              showNotification(
                `Registered ${res.donor.name} (${res.donor.bloodGroup}) in ${res.donor.ring} ring.`,
                'success'
              )
            }}
          />
        )}

        {path === '/smart-box' && <SmartBoxPage requests={requests} navigate={handleNav} />}

        {path === '/inventory' && (
          <InventoryPage
            stocks={stocks}
            onUpdateStock={async (group, delta) => {
              await updateInventoryUnit(group, delta)
              await refreshFeatureData()
              showNotification(`Updated ${group} reserve inventory.`, 'success')
            }}
            navigate={handleNav}
          />
        )}

        {path === '/custody' && (
          <CustodyPage requests={requests} onNotify={showNotification} />
        )}

        {![
          '/',
          '/auth',
          '/dashboard',
          '/request-blood',
          '/donor-network',
          '/smart-box',
          '/inventory',
          '/custody'
        ].includes(path) && (
          <HomePage
            navigate={handleNav}
            stats={stats}
            requests={requests}
            stocks={stocks}
          />
        )}
      </main>

      {/* Clean Standard Footer */}
      <footer className="bg-footer">
        <div className="bg-container bg-footer__grid">
          <div className="bg-footer__brand">
            <div className="bg-brand">
              <img src="/bloodgrid-logo.jpg" alt="BloodGrid" className="bg-brand__logo" />
              <div className="bg-brand__text">
                <span className="bg-brand__name">BloodGrid</span>
                <span className="bg-brand__tagline">Emergency Blood Network</span>
              </div>
            </div>
            <p className="bg-footer__desc">
              A unified emergency blood requisition, voluntary donor mobilization, and cold-chain
              monitoring network connecting licensed blood banks and hospitals.
            </p>
          </div>

          <div className="bg-footer__col">
            <h4>Primary Pages</h4>
            <ul>
              <li>
                <a href="/" onClick={(e) => { e.preventDefault(); handleNav('/') }}>
                  Home Overview
                </a>
              </li>
              <li>
                <a href="/dashboard" onClick={(e) => { e.preventDefault(); handleNav('/dashboard') }}>
                  Command Dashboard
                </a>
              </li>
              <li>
                <a href="/request-blood" onClick={(e) => { e.preventDefault(); handleNav('/request-blood') }}>
                  Hospital Blood Requisition
                </a>
              </li>
              <li>
                <a href="/donor-network" onClick={(e) => { e.preventDefault(); handleNav('/donor-network') }}>
                  Voluntary Donor Registry
                </a>
              </li>
              <li>
                <a href="/auth" onClick={(e) => { e.preventDefault(); handleNav('/auth') }}>
                  Portal Login & Registration
                </a>
              </li>
            </ul>
          </div>

          <div className="bg-footer__col">
            <h4>Feature Endpoints</h4>
            <ul>
              <li>
                <a href="/smart-box" onClick={(e) => { e.preventDefault(); handleNav('/smart-box') }}>
                  /api/feature/smart-box
                </a>
              </li>
              <li>
                <a href="/inventory" onClick={(e) => { e.preventDefault(); handleNav('/inventory') }}>
                  /api/feature/inventory
                </a>
              </li>
              <li>
                <a href="/custody" onClick={(e) => { e.preventDefault(); handleNav('/custody') }}>
                  /api/feature/custody/verify
                </a>
              </li>
              <li>
                <a href="/request-blood" onClick={(e) => { e.preventDefault(); handleNav('/request-blood') }}>
                  /api/feature/requests
                </a>
              </li>
              <li>
                <a href="/donor-network" onClick={(e) => { e.preventDefault(); handleNav('/donor-network') }}>
                  /api/feature/donors
                </a>
              </li>
            </ul>
          </div>

          <div className="bg-footer__col">
            <h4>Emergency Helpline</h4>
            <p className="bg-footer__stat">24 × 7 Control Room</p>
            <p className="bg-footer__phone">1800-BLOOD-GRID</p>
            <p className="bg-footer__meta">
              Cold-Chain Standard: 2.0°C – 6.0°C Continuous Telemetry
            </p>
          </div>
        </div>

        <div className="bg-container bg-footer__bottom">
          <span>© {new Date().getFullYear()} BloodGrid Network. All rights reserved.</span>
          <span>Standardized Medical Cold-Chain & Voluntary Donor Platform</span>
        </div>
      </footer>
    </div>
  )
}

/* ============================================================================
   1. HOME PAGE (/)
   ============================================================================ */
function HomePage({ navigate, stats, requests, stocks }) {
  const criticalStocks = useMemo(
    () => stocks.filter((item) => item.status === 'Critical' || item.units <= 5),
    [stocks]
  )

  return (
    <div className="bg-page">
      {/* Hero Section inspired by World Blood Donor Day template + clean classic typography */}
      <section className="bg-hero">
        <div className="bg-container bg-hero__grid">
          <div className="bg-hero__content">
            <div className="bg-hero__eyebrow">
              <span className="bg-hero__date-badge">14 JUNE · WORLD BLOOD DONOR DAY</span>
              <span className="bg-hero__divider">|</span>
              <span>REGIONAL BLOOD LOGISTICS NETWORK</span>
            </div>

            <h1 className="bg-hero__title">
              Every Drop Counts. <br />
              <span>Connecting Donors, Blood Banks, and Hospitals in Real Time.</span>
            </h1>

            <p className="bg-hero__subtitle">
              BloodGrid coordinates emergency hospital requisitions, concentric geo-fenced voluntary
              donor mobilization, and 2°C–6°C Smart Blood Box cold-chain transport across partner
              medical centers.
            </p>

            <div className="bg-hero__actions">
              <button
                type="button"
                className="bg-btn bg-btn--primary bg-btn--lg"
                onClick={() => navigate('/request-blood')}
              >
                <Icon name="activity" size={18} />
                <span>Raise Emergency Blood Request</span>
              </button>
              <button
                type="button"
                className="bg-btn bg-btn--outline bg-btn--lg"
                onClick={() => navigate('/donor-network')}
              >
                <Icon name="heart" size={18} />
                <span>Register as Voluntary Donor</span>
              </button>
            </div>

            <div className="bg-hero__metrics">
              <div className="bg-hero__metric">
                <strong>{stats?.partnerHospitals || 28}</strong>
                <span>Connected Hospitals</span>
              </div>
              <div className="bg-hero__metric">
                <strong>{stats?.verifiedDonors?.toLocaleString() || '1,420'}</strong>
                <span>Verified Geo-Ring Donors</span>
              </div>
              <div className="bg-hero__metric">
                <strong>2°C – 6°C</strong>
                <span>Monitored Cold-Chain</span>
              </div>
              <div className="bg-hero__metric">
                <strong>{stats?.avgDispatchTime || '13 mins'}</strong>
                <span>Average Dispatch ETA</span>
              </div>
            </div>
          </div>

          {/* Right Visual Poster Card matching the World Blood Donor Day aesthetic */}
          <div className="bg-hero__visual">
            <div className="bg-poster-card">
              <div className="bg-poster-card__top">
                <div>
                  <span className="bg-poster-card__date">14 JUNE</span>
                  <p className="bg-poster-card__sub">WORLD BLOOD DONOR DAY</p>
                </div>
                <img
                  src="/bloodgrid-logo.jpg"
                  alt="BloodGrid Emblem"
                  className="bg-poster-card__logo"
                />
              </div>

              <div className="bg-poster-card__image-wrap">
                <img
                  src="/blood-donor-hero.jpg"
                  alt="Blood Donation Saves Lives"
                  className="bg-poster-card__image"
                />
              </div>

              <div className="bg-poster-card__footer">
                <div>
                  <h3>Give Blood, Save Lives</h3>
                  <p>Verified vein-to-vein cold chain & instant donor matching.</p>
                </div>
                <button
                  type="button"
                  className="bg-btn bg-btn--primary bg-btn--sm"
                  onClick={() => navigate('/dashboard')}
                >
                  <span>Live Grid</span>
                  <Icon name="chevronRight" size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Normal, Professional Multi-Page Feature Directory */}
      <section className="bg-section">
        <div className="bg-container">
          <div className="bg-section__header">
            <div>
              <span className="bg-section__kicker">Platform Architecture</span>
              <h2 className="bg-section__title">Dedicated Modules & Service Endpoints</h2>
            </div>
            <p className="bg-section__desc">
              Each operational workflow runs on its own dedicated page and service route so
              hospitals, blood bank officers, and voluntary donors can manage requests without
              clutter.
            </p>
          </div>

          <div className="bg-feature-list">
            {PLATFORM_MODULES.map((mod, idx) => (
              <article key={mod.id} className="bg-feature-row">
                <div className="bg-feature-row__index">0{idx + 1}</div>
                <div className="bg-feature-row__main">
                  <div className="bg-feature-row__meta">
                    <span className="bg-feature-row__category">{mod.category}</span>
                    <code className="bg-feature-row__endpoint">{mod.apiEndpoint}</code>
                  </div>
                  <h3 className="bg-feature-row__title">{mod.title}</h3>
                  <p className="bg-feature-row__summary">{mod.summary}</p>
                  <ul className="bg-feature-row__bullets">
                    {mod.details.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-feature-row__action">
                  <button
                    type="button"
                    className="bg-btn bg-btn--outline"
                    onClick={() => navigate(mod.path)}
                  >
                    <span>Open Module</span>
                    <Icon name="chevronRight" size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Live Snapshot Strip: Active Dispatches & Critical Reserves */}
      <section className="bg-section bg-section--muted">
        <div className="bg-container">
          <div className="bg-split-panel">
            <div className="bg-card">
              <div className="bg-card__header">
                <div>
                  <span className="bg-section__kicker">Live Requisitions</span>
                  <h3>Active Emergency Dispatches</h3>
                </div>
                <button
                  type="button"
                  className="bg-link-btn"
                  onClick={() => navigate('/request-blood')}
                >
                  View All / New Request →
                </button>
              </div>

              <div className="bg-table-wrap">
                <table className="bg-table">
                  <thead>
                    <tr>
                      <th>Req ID</th>
                      <th>Hospital</th>
                      <th>Group</th>
                      <th>Status</th>
                      <th>Box Temp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.slice(0, 3).map((req) => (
                      <tr key={req.id}>
                        <td><strong>{req.id}</strong></td>
                        <td>{req.hospital}</td>
                        <td>
                          <span className="bg-badge bg-badge--crimson">{req.bloodGroup}</span>
                        </td>
                        <td>{req.status}</td>
                        <td>{req.temp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-card">
              <div className="bg-card__header">
                <div>
                  <span className="bg-section__kicker">Regional Blood Banks</span>
                  <h3>Priority Reserve Alerts</h3>
                </div>
                <button
                  type="button"
                  className="bg-link-btn"
                  onClick={() => navigate('/inventory')}
                >
                  Manage Inventory →
                </button>
              </div>

              <div className="bg-reserve-list">
                {criticalStocks.map((item) => (
                  <div key={item.group} className="bg-reserve-item">
                    <div className="bg-reserve-item__group">{item.group}</div>
                    <div className="bg-reserve-item__info">
                      <strong>{item.hospital}</strong>
                      <span>{item.units} units available (Target: {item.target} units)</span>
                    </div>
                    <span className="bg-badge bg-badge--critical">{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campaign Highlight Cards */}
      <section className="bg-section">
        <div className="bg-container">
          <div className="bg-campaign-grid">
            {CAMPAIGN_HIGHLIGHTS.map((camp) => (
              <div key={camp.title} className="bg-campaign-card">
                <div className="bg-campaign-card__top">
                  <span className="bg-campaign-card__date">{camp.date}</span>
                  <span className="bg-campaign-card__tag">{camp.tag}</span>
                </div>
                <h3>{camp.title}</h3>
                <p>{camp.description}</p>
                <button
                  type="button"
                  className="bg-btn bg-btn--primary"
                  onClick={() => navigate(camp.targetPath)}
                >
                  <span>{camp.cta}</span>
                  <Icon name="chevronRight" size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

/* ============================================================================
   2. DEDICATED LOGIN / REGISTER PAGE (/auth)
   ============================================================================ */
function AuthPage({ user, onAuthSuccess, navigate }) {
  const [mode, setMode] = useState('login')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Voluntary Donor',
    bloodGroup: 'O+',
    city: 'Mumbai Central',
    organization: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === 'login') {
        const res = await loginUser({
          email: form.email,
          password: form.password,
          role: form.role
        })
        onAuthSuccess(res.user, `Welcome back, ${res.user.name}.`)
      } else {
        const res = await registerUser(form)
        onAuthSuccess(res.user, `Account created for ${res.user.name}.`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleQuickDemo = async (demoRole, demoName, demoEmail, demoGroup) => {
    setLoading(true)
    try {
      const res = await loginUser({
        email: demoEmail,
        role: demoRole,
        name: demoName,
        bloodGroup: demoGroup
      })
      onAuthSuccess(res.user, `Signed in as ${demoName} (${demoRole}).`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-page bg-auth-page">
      <div className="bg-container bg-auth-grid">
        {/* Left Column: Brand & Role Information */}
        <div className="bg-auth-aside">
          <span className="bg-section__kicker">BloodGrid Access Portal</span>
          <h1 className="bg-auth-aside__title">
            Unified Authentication for Donors, Hospitals & Blood Banks
          </h1>
          <p className="bg-auth-aside__desc">
            Sign in to raise verified hospital blood requisitions, manage regional blood bank
            inventory, or receive geo-fenced emergency donation alerts in your locality.
          </p>

          <div className="bg-auth-roles">
            <div className="bg-auth-role-item">
              <Icon name="heart" size={18} />
              <div>
                <strong>Voluntary Blood Donors</strong>
                <p>Track your 90-day recovery eligibility and respond to nearby 0–5 km emergency calls.</p>
              </div>
            </div>
            <div className="bg-auth-role-item">
              <Icon name="activity" size={18} />
              <div>
                <strong>Hospital Transfusion Officers</strong>
                <p>Submit priority blood requisitions and verify QR chain-of-custody upon delivery.</p>
              </div>
            </div>
            <div className="bg-auth-role-item">
              <Icon name="thermometer" size={18} />
              <div>
                <strong>Blood Bank & Cold-Chain Operators</strong>
                <p>Update group reserves and monitor Smart Blood Box 2°C–6°C telemetry in transit.</p>
              </div>
            </div>
          </div>

          <div className="bg-auth-demo-box">
            <span>Instant Role Access (One-Click Demo Login):</span>
            <div className="bg-auth-demo-buttons">
              <button
                type="button"
                className="bg-btn bg-btn--outline bg-btn--sm"
                onClick={() =>
                  handleQuickDemo(
                    'Hospital Officer',
                    'Dr. Siddharth Mehta',
                    'trauma.officer@kem.org',
                    'O-'
                  )
                }
              >
                Hospital Officer
              </button>
              <button
                type="button"
                className="bg-btn bg-btn--outline bg-btn--sm"
                onClick={() =>
                  handleQuickDemo(
                    'Blood Bank Admin',
                    'Anjali Deshmukh',
                    'inventory@redcross-hub.org',
                    'A+'
                  )
                }
              >
                Blood Bank Admin
              </button>
              <button
                type="button"
                className="bg-btn bg-btn--outline bg-btn--sm"
                onClick={() =>
                  handleQuickDemo(
                    'Voluntary Donor',
                    'Aarav Kulkarni',
                    'aarav.k@donorgrid.in',
                    'O-'
                  )
                }
              >
                Voluntary Donor
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Clean Login / Registration Form */}
        <div className="bg-auth-card">
          {user && (
            <div className="bg-auth-current">
              <div>
                <strong>Currently signed in as {user.name}</strong>
                <p>{user.role} · {user.email}</p>
              </div>
              <button
                type="button"
                className="bg-btn bg-btn--primary bg-btn--sm"
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </button>
            </div>
          )}

          <div className="bg-auth-tabs" role="tablist">
            <button
              type="button"
              className={`bg-auth-tab ${mode === 'login' ? 'is-active' : ''}`}
              onClick={() => setMode('login')}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`bg-auth-tab ${mode === 'register' ? 'is-active' : ''}`}
              onClick={() => setMode('register')}
            >
              Create Account
            </button>
          </div>

          <form className="bg-form" onSubmit={handleSubmit}>
            <div className="bg-form__group">
              <label htmlFor="auth-role">Portal Role</label>
              <select
                id="auth-role"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="Voluntary Donor">Voluntary Donor</option>
                <option value="Hospital Officer">Hospital Transfusion Officer</option>
                <option value="Blood Bank Admin">Blood Bank Administrator</option>
                <option value="Cold-Chain Courier">Cold-Chain Logistics Operator</option>
              </select>
            </div>

            {mode === 'register' && (
              <div className="bg-form__row">
                <div className="bg-form__group">
                  <label htmlFor="auth-name">Full Name</label>
                  <input
                    id="auth-name"
                    type="text"
                    required
                    placeholder="Dr. Meera Deshmukh"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="bg-form__group">
                  <label htmlFor="auth-bg">Blood Group</label>
                  <select
                    id="auth-bg"
                    value={form.bloodGroup}
                    onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                  >
                    {['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="bg-form__group">
              <label htmlFor="auth-email">Official or Personal Email</label>
              <input
                id="auth-email"
                type="email"
                required
                placeholder="name@hospital-network.org"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="bg-form__group">
              <label htmlFor="auth-password">Password</label>
              <input
                id="auth-password"
                type="password"
                required
                placeholder="••••••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            {mode === 'register' && (
              <div className="bg-form__row">
                <div className="bg-form__group">
                  <label htmlFor="auth-city">Primary Locality / City</label>
                  <input
                    id="auth-city"
                    type="text"
                    required
                    placeholder="Mumbai Central"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                  />
                </div>
                <div className="bg-form__group">
                  <label htmlFor="auth-org">Hospital / Organization (Optional)</label>
                  <input
                    id="auth-org"
                    type="text"
                    placeholder="KEM Regional Hospital"
                    value={form.organization}
                    onChange={(e) => setForm({ ...form, organization: e.target.value })}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="bg-btn bg-btn--primary bg-btn--full bg-btn--lg"
              disabled={loading}
            >
              <Icon name="lock" size={16} />
              <span>
                {loading
                  ? 'Authenticating...'
                  : mode === 'login'
                    ? 'Sign In to BloodGrid'
                    : 'Complete Registration'}
              </span>
            </button>

            <div className="bg-form__endpoint-note">
              <span>Authenticated via</span>
              <code>{mode === 'login' ? 'POST /api/auth/login' : 'POST /api/auth/register'}</code>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

/* ============================================================================
   3. COMMAND CENTER DASHBOARD PAGE (/dashboard)
   ============================================================================ */
function DashboardPage({ stats, requests, stocks, donors, navigate }) {
  return (
    <div className="bg-page">
      <div className="bg-container">
        <div className="bg-page-header">
          <div>
            <span className="bg-section__kicker">Endpoint: /api/feature/dashboard-stats</span>
            <h1 className="bg-page-header__title">Emergency Blood Grid Command Center</h1>
            <p className="bg-page-header__desc">
              Consolidated operational view of active hospital requisitions, regional blood group
              reserves, and nearby eligible donors.
            </p>
          </div>
          <div className="bg-page-header__actions">
            <button
              type="button"
              className="bg-btn bg-btn--primary"
              onClick={() => navigate('/request-blood')}
            >
              <Icon name="activity" size={16} />
              <span>New Blood Request</span>
            </button>
            <button
              type="button"
              className="bg-btn bg-btn--outline"
              onClick={() => navigate('/smart-box')}
            >
              <Icon name="thermometer" size={16} />
              <span>Smart Box Telemetry</span>
            </button>
          </div>
        </div>

        {/* Top KPI Cards */}
        <div className="bg-kpi-grid">
          <div className="bg-kpi-card">
            <span className="bg-kpi-card__label">Active Emergency Requests</span>
            <strong className="bg-kpi-card__value">{requests.length}</strong>
            <span className="bg-kpi-card__meta">Live hospital dispatches</span>
          </div>
          <div className="bg-kpi-card">
            <span className="bg-kpi-card__label">Total Regional Units</span>
            <strong className="bg-kpi-card__value">
              {stocks.reduce((sum, s) => sum + Number(s.units || 0), 0)}
            </strong>
            <span className="bg-kpi-card__meta">Across 8 blood groups</span>
          </div>
          <div className="bg-kpi-card">
            <span className="bg-kpi-card__label">Verified Geo-Ring Donors</span>
            <strong className="bg-kpi-card__value">
              {stats?.verifiedDonors?.toLocaleString() || donors.length}
            </strong>
            <span className="bg-kpi-card__meta">90-day cooldown cleared</span>
          </div>
          <div className="bg-kpi-card">
            <span className="bg-kpi-card__label">Cold-Chain Compliance</span>
            <strong className="bg-kpi-card__value">{stats?.coldChainCompliance || '99.8%'}</strong>
            <span className="bg-kpi-card__meta">2.0°C – 6.0°C target window</span>
          </div>
        </div>

        {/* Active Requisitions Table */}
        <div className="bg-card bg-card--spaced">
          <div className="bg-card__header">
            <div>
              <span className="bg-section__kicker">Live Dispatch Queue</span>
              <h3>Active Hospital Requisitions</h3>
            </div>
            <button
              type="button"
              className="bg-btn bg-btn--outline bg-btn--sm"
              onClick={() => navigate('/custody')}
            >
              Verify Custody Chain
            </button>
          </div>

          <div className="bg-table-wrap">
            <table className="bg-table">
              <thead>
                <tr>
                  <th>Requisition ID</th>
                  <th>Hospital</th>
                  <th>Group & Component</th>
                  <th>Units</th>
                  <th>Geo-Ring</th>
                  <th>Smart Box</th>
                  <th>Temp</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id}>
                    <td><strong>{req.id}</strong></td>
                    <td>{req.hospital}</td>
                    <td>
                      <span className="bg-badge bg-badge--crimson">{req.bloodGroup}</span>{' '}
                      <span>{req.component}</span>
                    </td>
                    <td>{req.units} Units</td>
                    <td>{req.radius}</td>
                    <td><code>{req.boxId}</code></td>
                    <td>{req.temp}</td>
                    <td>
                      <span className="bg-badge bg-badge--status">{req.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Blood Bank Stock Overview */}
        <div className="bg-card bg-card--spaced">
          <div className="bg-card__header">
            <div>
              <span className="bg-section__kicker">Regional Blood Bank Matrix</span>
              <h3>Blood Group Availability</h3>
            </div>
            <button
              type="button"
              className="bg-btn bg-btn--outline bg-btn--sm"
              onClick={() => navigate('/inventory')}
            >
              Open Full Inventory Page
            </button>
          </div>

          <div className="bg-stock-grid">
            {stocks.map((item) => (
              <div key={item.group} className="bg-stock-tile">
                <div className="bg-stock-tile__top">
                  <span className="bg-stock-tile__group">{item.group}</span>
                  <span
                    className={`bg-badge ${
                      item.status === 'Critical'
                        ? 'bg-badge--critical'
                        : item.status === 'Low'
                          ? 'bg-badge--warning'
                          : 'bg-badge--stable'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="bg-stock-tile__units">
                  <strong>{item.units}</strong>
                  <span>/ {item.target} units</span>
                </div>
                <p className="bg-stock-tile__hosp">{item.hospital}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ============================================================================
   4. HOSPITAL BLOOD REQUISITION PAGE (/request-blood)
   ============================================================================ */
function RequestBloodPage({ requests, onCreateRequest }) {
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    hospital: 'KEM Hospital Trauma Care',
    bloodGroup: 'O-',
    component: 'Packed RBC',
    units: 2,
    urgency: 'Critical',
    radius: '0-2 km Ring',
    doctorName: 'Dr. S. Kulkarni',
    contactPhone: '+91 22 2410 7000'
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await onCreateRequest(form)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-page">
      <div className="bg-container">
        <div className="bg-page-header">
          <div>
            <span className="bg-section__kicker">Endpoint: /api/feature/requests</span>
            <h1 className="bg-page-header__title">Hospital Emergency Blood Requisition</h1>
            <p className="bg-page-header__desc">
              Submit a verified hospital requisition to reserve regional blood bank stock and
              trigger concentric geo-ring donor mobilization.
            </p>
          </div>
        </div>

        <div className="bg-two-col">
          {/* Left: Requisition Form */}
          <div className="bg-card">
            <h3>New Emergency Requisition</h3>
            <p className="bg-card__sub">
              All hospital requests are logged with a unique requisition ID and assigned a Smart
              Blood Box unit for cold-chain dispatch.
            </p>

            <form className="bg-form" onSubmit={handleSubmit}>
              <div className="bg-form__group">
                <label htmlFor="req-hospital">Requesting Hospital & Ward</label>
                <input
                  id="req-hospital"
                  type="text"
                  required
                  value={form.hospital}
                  onChange={(e) => setForm({ ...form, hospital: e.target.value })}
                />
              </div>

              <div className="bg-form__row">
                <div className="bg-form__group">
                  <label htmlFor="req-bg">Blood Group</label>
                  <select
                    id="req-bg"
                    value={form.bloodGroup}
                    onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                  >
                    {['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-form__group">
                  <label htmlFor="req-comp">Blood Component</label>
                  <select
                    id="req-comp"
                    value={form.component}
                    onChange={(e) => setForm({ ...form, component: e.target.value })}
                  >
                    <option value="Packed RBC">Packed Red Blood Cells (PRBC)</option>
                    <option value="Fresh Frozen Plasma">Fresh Frozen Plasma (FFP)</option>
                    <option value="Single Donor Platelets">Single Donor Platelets (SDP)</option>
                    <option value="Whole Blood">Whole Blood</option>
                  </select>
                </div>
              </div>

              <div className="bg-form__row">
                <div className="bg-form__group">
                  <label htmlFor="req-units">Units Required</label>
                  <input
                    id="req-units"
                    type="number"
                    min="1"
                    max="20"
                    required
                    value={form.units}
                    onChange={(e) => setForm({ ...form, units: Number(e.target.value) })}
                  />
                </div>

                <div className="bg-form__group">
                  <label htmlFor="req-urgency">Clinical Urgency</label>
                  <select
                    id="req-urgency"
                    value={form.urgency}
                    onChange={(e) => setForm({ ...form, urgency: e.target.value })}
                  >
                    <option value="Critical">Critical (Immediate Dispatch)</option>
                    <option value="High">High (Within 30 Mins)</option>
                    <option value="Standard">Standard Cross-Match</option>
                  </select>
                </div>
              </div>

              <div className="bg-form__row">
                <div className="bg-form__group">
                  <label htmlFor="req-ring">Geo-Ring Donor Alert Radius</label>
                  <select
                    id="req-ring"
                    value={form.radius}
                    onChange={(e) => setForm({ ...form, radius: e.target.value })}
                  >
                    <option value="0-2 km Ring">Ring 1: 0–2 km Immediate Radius</option>
                    <option value="2-5 km Ring">Ring 2: 2–5 km Suburban Radius</option>
                    <option value="5-10 km Ring">Ring 3: 5–10 km District Radius</option>
                  </select>
                </div>

                <div className="bg-form__group">
                  <label htmlFor="req-doc">Authorizing Medical Officer</label>
                  <input
                    id="req-doc"
                    type="text"
                    required
                    value={form.doctorName}
                    onChange={(e) => setForm({ ...form, doctorName: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-btn bg-btn--primary bg-btn--full bg-btn--lg"
                disabled={submitting}
              >
                <Icon name="activity" size={18} />
                <span>{submitting ? 'Broadcasting Requisition...' : 'Submit & Broadcast Requisition'}</span>
              </button>
            </form>
          </div>

          {/* Right: Live Requisition Queue */}
          <div className="bg-card">
            <h3>Active Requisition Log ({requests.length})</h3>
            <p className="bg-card__sub">
              Real-time status of hospital requisitions and assigned Smart Blood Box units.
            </p>

            <div className="bg-req-cards">
              {requests.map((req) => (
                <div key={req.id} className="bg-req-item">
                  <div className="bg-req-item__top">
                    <span className="bg-badge bg-badge--crimson">
                      {req.bloodGroup} · {req.units} Units
                    </span>
                    <code>{req.id}</code>
                  </div>
                  <h4>{req.hospital}</h4>
                  <p className="bg-req-item__meta">
                    Component: <strong>{req.component}</strong> · Ring: <strong>{req.radius}</strong>
                  </p>
                  <div className="bg-req-item__footer">
                    <span>Box: {req.boxId} ({req.temp})</span>
                    <span>ETA: {req.eta}</span>
                    <span className="bg-badge bg-badge--status">{req.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ============================================================================
   5. VOLUNTARY DONOR NETWORK PAGE (/donor-network)
   ============================================================================ */
function DonorNetworkPage({ donors, onRegisterDonor }) {
  const [filterGroup, setFilterGroup] = useState('ALL')
  const [filterRing, setFilterRing] = useState('ALL')
  const [form, setForm] = useState({
    name: '',
    bloodGroup: 'O-',
    city: 'Mumbai Central',
    ring: '0-2 km',
    phone: ''
  })

  const filteredDonors = useMemo(() => {
    return donors.filter((d) => {
      const matchGroup = filterGroup === 'ALL' || d.bloodGroup === filterGroup
      const matchRing = filterRing === 'ALL' || d.ring === filterRing
      return matchGroup && matchRing
    })
  }, [donors, filterGroup, filterRing])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    await onRegisterDonor(form)
    setForm({ name: '', bloodGroup: 'O-', city: 'Mumbai Central', ring: '0-2 km', phone: '' })
  }

  return (
    <div className="bg-page">
      <div className="bg-container">
        <div className="bg-page-header">
          <div>
            <span className="bg-section__kicker">Endpoint: /api/feature/donors</span>
            <h1 className="bg-page-header__title">Voluntary Donor Registry & Geo-Rings</h1>
            <p className="bg-page-header__desc">
              Concentric ring mobilization alerts only cooldown-eligible donors within 0–2 km,
              2–5 km, and 5–10 km of the requesting hospital.
            </p>
          </div>
        </div>

        <div className="bg-two-col">
          {/* Donor Directory & Filters */}
          <div className="bg-card">
            <div className="bg-card__header">
              <h3>Verified Donor Directory ({filteredDonors.length})</h3>
              <div className="bg-filter-bar">
                <select
                  value={filterGroup}
                  onChange={(e) => setFilterGroup(e.target.value)}
                  aria-label="Filter by blood group"
                >
                  <option value="ALL">All Groups</option>
                  {['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map((bg) => (
                    <option key={bg} value={bg}>
                      Group {bg}
                    </option>
                  ))}
                </select>

                <select
                  value={filterRing}
                  onChange={(e) => setFilterRing(e.target.value)}
                  aria-label="Filter by distance ring"
                >
                  <option value="ALL">All Geo-Rings</option>
                  <option value="0-2 km">0–2 km Ring</option>
                  <option value="2-5 km">2–5 km Ring</option>
                  <option value="5-10 km">5–10 km Ring</option>
                </select>
              </div>
            </div>

            <div className="bg-donor-list">
              {filteredDonors.map((donor) => (
                <div key={donor.id} className="bg-donor-card">
                  <div className="bg-donor-card__group">{donor.bloodGroup}</div>
                  <div className="bg-donor-card__body">
                    <strong>{donor.name}</strong>
                    <p>
                      {donor.city} · {donor.distance} ({donor.ring} Ring)
                    </p>
                    <small>Last Donated: {donor.lastDonated} · {donor.status}</small>
                  </div>
                  <div className="bg-donor-card__right">
                    <span className="bg-badge bg-badge--stable">{donor.reliability}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Register as Donor Form */}
          <div className="bg-card">
            <h3>Enroll in Voluntary Donor Network</h3>
            <p className="bg-card__sub">
              Register your blood group and locality to receive verified hospital emergency alerts
              when your blood group is needed nearby.
            </p>

            <form className="bg-form" onSubmit={handleSubmit}>
              <div className="bg-form__group">
                <label htmlFor="dnr-name">Full Name</label>
                <input
                  id="dnr-name"
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="bg-form__row">
                <div className="bg-form__group">
                  <label htmlFor="dnr-bg">Blood Group</label>
                  <select
                    id="dnr-bg"
                    value={form.bloodGroup}
                    onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                  >
                    {['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-form__group">
                  <label htmlFor="dnr-ring">Preferred Response Ring</label>
                  <select
                    id="dnr-ring"
                    value={form.ring}
                    onChange={(e) => setForm({ ...form, ring: e.target.value })}
                  >
                    <option value="0-2 km">0–2 km Immediate Zone</option>
                    <option value="2-5 km">2–5 km City Zone</option>
                    <option value="5-10 km">5–10 km Extended Zone</option>
                  </select>
                </div>
              </div>

              <div className="bg-form__row">
                <div className="bg-form__group">
                  <label htmlFor="dnr-city">Locality / Area</label>
                  <input
                    id="dnr-city"
                    type="text"
                    required
                    placeholder="e.g. Dadar West, Mumbai"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                  />
                </div>

                <div className="bg-form__group">
                  <label htmlFor="dnr-phone">Mobile Contact</label>
                  <input
                    id="dnr-phone"
                    type="tel"
                    required
                    placeholder="+91 98200 00000"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="bg-btn bg-btn--primary bg-btn--full bg-btn--lg">
                <Icon name="heart" size={18} />
                <span>Register in Donor Grid</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ============================================================================
   6. SMART BLOOD BOX IOT PAGE (/smart-box)
   ============================================================================ */
function SmartBoxPage({ requests, navigate }) {
  return (
    <div className="bg-page">
      <div className="bg-container">
        <div className="bg-page-header">
          <div>
            <span className="bg-section__kicker">Endpoint: /api/feature/smart-box</span>
            <h1 className="bg-page-header__title">Smart Blood Box Cold-Chain Telemetry</h1>
            <p className="bg-page-header__desc">
              Interactive hardware inspection and real-time thermal telemetry for portable
              2.0°C–6.0°C blood transport containers.
            </p>
          </div>
          <button
            type="button"
            className="bg-btn bg-btn--outline"
            onClick={() => navigate('/custody')}
          >
            <Icon name="qr" size={16} />
            <span>Verify Chain of Custody</span>
          </button>
        </div>

        <SmartBloodBoxVisual activeEmergencies={requests} />
      </div>
    </div>
  )
}

/* ============================================================================
   7. BLOOD BANK INVENTORY PAGE (/inventory)
   ============================================================================ */
function InventoryPage({ stocks, onUpdateStock, navigate }) {
  return (
    <div className="bg-page">
      <div className="bg-container">
        <div className="bg-page-header">
          <div>
            <span className="bg-section__kicker">Endpoint: /api/feature/inventory</span>
            <h1 className="bg-page-header__title">Regional Blood Bank Inventory & Reserves</h1>
            <p className="bg-page-header__desc">
              Live unit counts across licensed blood banks with direct stock adjustment controls
              and shortage indicators.
            </p>
          </div>
          <button
            type="button"
            className="bg-btn bg-btn--primary"
            onClick={() => navigate('/request-blood')}
          >
            <Icon name="activity" size={16} />
            <span>Raise Emergency Requisition</span>
          </button>
        </div>

        <div className="bg-stock-grid bg-stock-grid--large">
          {stocks.map((item) => {
            const pct = Math.min(100, Math.round((item.units / item.target) * 100))
            return (
              <div key={item.group} className="bg-card bg-inventory-card">
                <div className="bg-inventory-card__top">
                  <span className="bg-inventory-card__group">{item.group}</span>
                  <span
                    className={`bg-badge ${
                      item.status === 'Critical'
                        ? 'bg-badge--critical'
                        : item.status === 'Low'
                          ? 'bg-badge--warning'
                          : 'bg-badge--stable'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="bg-inventory-card__count">
                  <strong>{item.units}</strong>
                  <span>/ {item.target} target units</span>
                </div>

                <div className="bg-progress">
                  <div
                    className={`bg-progress__bar ${
                      item.status === 'Critical' ? 'is-critical' : ''
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <p className="bg-inventory-card__meta">
                  Hub: <strong>{item.hospital}</strong>
                </p>
                <p className="bg-inventory-card__trend">Demand Status: {item.trend}</p>

                <div className="bg-inventory-card__actions">
                  <button
                    type="button"
                    className="bg-btn bg-btn--outline bg-btn--sm"
                    onClick={() => onUpdateStock(item.group, -1)}
                  >
                    − Dispatch 1 Unit
                  </button>
                  <button
                    type="button"
                    className="bg-btn bg-btn--outline bg-btn--sm"
                    onClick={() => onUpdateStock(item.group, 1)}
                  >
                    + Log 1 Unit
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ============================================================================
   8. DIGITAL CHAIN OF CUSTODY PAGE (/custody)
   ============================================================================ */
function CustodyPage({ requests, onNotify }) {
  const [selectedId, setSelectedId] = useState(() => requests[0]?.id || 'REQ-8492')
  const [auditRecord, setAuditRecord] = useState(null)

  const handleVerify = async (reqId) => {
    setSelectedId(reqId)
    const res = await verifyCustodyChain(reqId)
    setAuditRecord(res)
    onNotify(`Verified digital chain of custody for ${reqId}.`, 'success')
  }

  useEffect(() => {
    verifyCustodyChain(selectedId).then(setAuditRecord)
  }, [selectedId])

  return (
    <div className="bg-page">
      <div className="bg-container">
        <div className="bg-page-header">
          <div>
            <span className="bg-section__kicker">Endpoint: /api/feature/custody/verify</span>
            <h1 className="bg-page-header__title">Digital Chain of Custody Verification</h1>
            <p className="bg-page-header__desc">
              Tamper-evident vein-to-vein audit log verifying donor collection, lab screening,
              2°C–6°C cold-chain transit, and hospital ward handover.
            </p>
          </div>
        </div>

        <div className="bg-two-col">
          <div className="bg-card">
            <h3>Select Active Requisition to Verify</h3>
            <p className="bg-card__sub">
              Click any requisition below or enter a requisition ID to inspect its cryptographic
              cold-chain checkpoints.
            </p>

            <div className="bg-custody-selector">
              {requests.map((req) => (
                <button
                  key={req.id}
                  type="button"
                  className={`bg-custody-btn ${selectedId === req.id ? 'is-active' : ''}`}
                  onClick={() => handleVerify(req.id)}
                >
                  <div>
                    <strong>{req.id}</strong> · {req.hospital}
                  </div>
                  <span className="bg-badge bg-badge--crimson">
                    {req.bloodGroup} ({req.boxId})
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-card">
            {auditRecord ? (
              <div>
                <div className="bg-card__header">
                  <div>
                    <span className="bg-section__kicker"> Custody Certificate</span>
                    <h3>Requisition {auditRecord.requestId}</h3>
                  </div>
                  <span className="bg-badge bg-badge--stable">{auditRecord.compliance}</span>
                </div>

                <p className="bg-card__sub">
                  Smart Blood Box: <strong>{auditRecord.smartBoxId}</strong> · Mean Transit
                  Temperature: <strong>{auditRecord.meanTemp}</strong>
                </p>

                <div className="bg-timeline">
                  {auditRecord.checkpoints.map((cp, i) => (
                    <div key={cp.stage} className="bg-timeline__step">
                      <div className="bg-timeline__marker">{i + 1}</div>
                      <div className="bg-timeline__content">
                        <div className="bg-timeline__top">
                          <strong>{cp.stage}</strong>
                          <span>{cp.timestamp}</span>
                        </div>
                        <p>Verified by: {cp.actor}</p>
                        <small className="bg-timeline__status">{cp.status}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p>Loading custody certificate...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
