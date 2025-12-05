import { Link } from 'react-router-dom';
import './wpadmin-toolbar.css';

const formatRole = (role) => {
  if (!role) return 'Member';
  return role.charAt(0).toUpperCase() + role.slice(1);
};

const initialsFrom = (value) => {
  if (!value) return '?';
  const letters = value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('');
  return letters ? letters.toUpperCase() : '?';
};

const WPAdminToolbar = ({ user, onLogout }) => {
  const isAdmin = user?.role === 'admin';

  if (!isAdmin) {
    return null;
  }

  const displayName = user.name || user.username || 'Member';
  const firstName = displayName.split(' ')[0];
  const roleLabel = formatRole(user.role);
  const initials = initialsFrom(displayName);

  const quickLinks = [
    { to: '/admin', label: 'Dashboard', description: 'Review activity & stats' },
    { to: '/subjects', label: 'Subjects', description: 'Browse and edit lessons' },
    { to: '/forum', label: 'Forum', description: 'Join the latest discussions' }
  ];

  const creationLinks = [
    { to: '/subjects/new', label: 'Add Lesson' },
    { to: '/quizzes/new', label: 'Add Quiz' },
    { to: '/resources/new', label: 'Upload Resource' }
  ];

  return (
    <div id="adminbarwrap" className="wpadmin-bar" role="navigation" aria-label="WPAdmin toolbar">
      <ul id="adminbar" className="wp-menu" role="menubar">
        <li className="wp-menu-top wp-first-item wp-has-submenu" role="none">
          <div className="wp-menu-image" aria-hidden>
            <Link to="/" className="wp-logo" aria-label="SciBridge dashboard">
              SB
            </Link>
          </div>
          <Link to="/" className="wp-menu-name" role="menuitem">
            SciBridge
          </Link>
          <div className="wp-submenu">
            <div className="wp-submenu-wrap">
              <div className="wp-submenu-head">SciBridge</div>
              <ul>
                {quickLinks.map((item) => (
                  <li key={item.label}>
                    <Link to={item.to}>
                      <span className="wp-submenu-title">{item.label}</span>
                      <span className="wp-submenu-description">{item.description}</span>
                    </Link>
                  </li>
                ))}
                <li>
                  <a href="https://github.com/DMOJ/dmoj-wpadmin" target="_blank" rel="noreferrer">
                    About DMOJ WPAdmin
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </li>

        <li className="wp-menu-top wp-has-submenu" role="none">
          <div className="wp-menu-image" aria-hidden>
            <span className="wp-icon">＋</span>
          </div>
          <button type="button" className="wp-menu-name" aria-haspopup="true">
            New
          </button>
          <div className="wp-submenu">
            <div className="wp-submenu-wrap">
              <div className="wp-submenu-head">Create</div>
              <ul>
                {creationLinks.map((item) => (
                  <li key={item.label}>
                    <Link to={item.to}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </li>

        <li className="wp-menu-top wp-has-submenu wp-user-tools wp-last-item" role="none">
          <div className="wp-menu-image" aria-hidden>
            <span className="wp-small-gravatar" aria-hidden>
              {initials}
            </span>
          </div>
          <button type="button" className="wp-menu-name" aria-haspopup="true">
            Welcome, <strong>{firstName}</strong>.
          </button>
          <div className="wp-submenu">
            <div className="wp-submenu-wrap">
              <div className="wp-submenu-head">{displayName}</div>
              <ul>
                <li>
                  <div className="wp-profile-card">
                    <span className="wp-big-gravatar" aria-hidden>
                      {initials}
                    </span>
                    <div>
                      <span className="wp-profile-name">{displayName}</span>
                      <span className="wp-profile-role">{roleLabel}</span>
                    </div>
                  </div>
                </li>
                <li>
                  <Link to="/profile">View profile</Link>
                </li>
                <li>
                  <Link to="/settings">Account settings</Link>
                </li>
                <li>
                  <button type="button" className="wp-logout" onClick={onLogout}>
                    Log out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default WPAdminToolbar;
