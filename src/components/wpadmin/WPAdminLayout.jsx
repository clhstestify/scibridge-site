import './wpadmin.css';

const WPAdminLayout = ({ sidebar, header, children }) => {
  return (
    <div className="wpadmin-shell">
      <aside className="wpadmin-shell__sidebar" aria-label="Admin navigation">
        {sidebar}
      </aside>
      <div className="wpadmin-shell__main">
        <div className="wpadmin-shell__header">{header}</div>
        <div className="wpadmin-shell__content">{children}</div>
      </div>
    </div>
  );
};

export default WPAdminLayout;
