import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="app-layout">
      {/* Mobile menu button */}
      <button
        className="mobile-menu-btn"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu"
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      {/* Mobile overlay */}
      <div
        className={`mobile-overlay ${menuOpen ? 'visible' : ''}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-logo">🏊</div>
            <div>
              <div className="sidebar-title">Natação</div>
              <div className="sidebar-subtitle">UNAERP</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
            onClick={() => setMenuOpen(false)}
          >
            <span className="nav-icon">📊</span>
            Análise Comparativa
          </NavLink>

          <NavLink
            to="/analise-individual"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
            onClick={() => setMenuOpen(false)}
          >
            <span className="nav-icon">👤</span>
            Análise Individual
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          UNAERP © {new Date().getFullYear()}
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
