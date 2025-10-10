const WPAdminCard = ({ icon: Icon, title, description, actions, children, footer, id }) => {
  return (
    <section id={id} className="wpadmin-card">
      <header className="wpadmin-card__header">
        <div className="wpadmin-card__title">
          {Icon && (
            <span className="wpadmin-card__icon" aria-hidden>
              <Icon />
            </span>
          )}
          <div>
            <h2 className="wpadmin-card__heading">{title}</h2>
            {description && <p className="wpadmin-card__description">{description}</p>}
          </div>
        </div>
        {actions && <div className="wpadmin-card__actions">{actions}</div>}
      </header>
      <div className="wpadmin-card__body">{children}</div>
      {footer && <footer className="wpadmin-card__footer">{footer}</footer>}
    </section>
  );
};

export default WPAdminCard;
