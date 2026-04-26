import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Package, ClipboardCheck, AlertTriangle,
  FileText, Calendar, LogOut, User
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Batches', path: '/batches', icon: Package },
  { label: 'Inspections', path: '/inspections', icon: ClipboardCheck },
  { label: 'Defects', path: '/defects', icon: AlertTriangle },
  { label: 'Reports', path: '/reports', icon: FileText },
  { label: 'Calendar', path: '/calendar', icon: Calendar },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h1>Glass QC</h1>
        <span>Quality Control System</span>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section">
          <div className="sidebar-section-title">Main Menu</div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
            >
              <item.icon />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="sidebar-user">
        <NavLink to="/profile" className="sidebar-user-avatar" title="View Profile">
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </NavLink>
        <div className="sidebar-user-info">
          <NavLink to="/profile" className="sidebar-user-name">{user?.name || 'User'}</NavLink>
          <div className="sidebar-user-role">{user?.role || 'operator'}</div>
        </div>
        <button className="btn-icon" onClick={logout} title="Logout">
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
