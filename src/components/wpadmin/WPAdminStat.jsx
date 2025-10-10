const WPAdminStat = ({ label, value, tone = 'default', hint }) => {
  return (
    <div className={`wpadmin-stat wpadmin-stat--${tone}`}>
      <dt className="wpadmin-stat__label">{label}</dt>
      <dd className="wpadmin-stat__value">{value}</dd>
      {hint && <p className="wpadmin-stat__hint">{hint}</p>}
    </div>
  );
};

export default WPAdminStat;
