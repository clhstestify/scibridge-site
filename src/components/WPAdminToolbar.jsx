import { FiLogOut, FiShield } from 'react-icons/fi';
import './wpadmin-toolbar.css';

const roleCopy = {
  admin: 'Administrator',
  teacher: 'Teacher',
  student: 'Student'
};

const WPAdminToolbar = ({ user, onLogout }) => {
  if (!user) {
    return null;
  }

  const readableRole = roleCopy[user.role] ?? user.role;

  return (
    <div className="wpadmin-toolbar" role="status" aria-live="polite">
      <div className="wpadmin-toolbar__user" data-role={readableRole}>
        <div className="wpadmin-toolbar__avatar" aria-hidden>
          {user?.name?.[0]?.toUpperCase() ?? '?'}
        </div>
        <div className="wpadmin-toolbar__labels">
          <span className="wpadmin-toolbar__greeting">Hi, {user?.name ?? user?.email}</span>
          <span className="wpadmin-toolbar__role">
            <FiShield aria-hidden /> ROLE: {readableRole?.toUpperCase()}
          </span>
        </div>
      </div>
      <button type="button" className="wpadmin-toolbar__logout" onClick={onLogout}>
        <FiLogOut aria-hidden />
        Sign out
      </button>
    </div>
  );
};

export default WPAdminToolbar;
