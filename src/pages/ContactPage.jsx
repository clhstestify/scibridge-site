import { useLanguage } from '../context/LanguageContext.jsx';

const ContactPage = () => {
  const { t } = useLanguage();
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-dark">
          {t('contactPage.eyebrow', 'Contact')}
        </p>
        <h1 className="text-3xl font-display font-semibold text-slate-900">
          {t('contactPage.heading', 'Connect with the SciBridge team')}
        </h1>
      </header>
      <section className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-3xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold text-slate-900">{t('contactPage.formTitle', 'Send us a message')}</h2>
          <p className="text-sm text-slate-600">
            {t(
              'contactPage.formDescription',
              'Share feedback, ask for lesson ideas, or tell us how you use SciBridge in your classroom.'
            )}
          </p>
          <form className="space-y-4">
            <label className="block text-sm">
              <span className="text-slate-600">{t('contactPage.nameLabel', 'Name')}</span>
              <input
                type="text"
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                placeholder={t('contactPage.namePlaceholder', 'Your full name')}
              />
            </label>
            <label className="block text-sm">
              <span className="text-slate-600">{t('contactPage.emailLabel', 'Email')}</span>
              <input
                type="email"
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                placeholder={t('contactPage.emailPlaceholder', 'you@example.com')}
              />
            </label>
            <label className="block text-sm">
              <span className="text-slate-600">{t('contactPage.messageLabel', 'Message')}</span>
              <textarea
                rows="4"
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                placeholder={t('contactPage.messagePlaceholder', 'How can we help?')}
              />
            </label>
            <button
              type="button"
              className="w-full rounded-full bg-brand px-4 py-3 text-sm font-semibold text-white shadow hover:bg-brand-dark"
            >
              {t('contactPage.submit', 'Send message')}
            </button>
          </form>
        </div>
        <div className="space-y-4 rounded-3xl border border-brand/30 bg-brand-light/60 p-6">
          <h2 className="text-xl font-semibold text-brand-dark">{t('contactPage.quickInfoTitle', 'Quick information')}</h2>
          <div className="space-y-3 text-sm text-slate-700">
            <p>
              <strong>Email:</strong> hello@scibridge.edu
            </p>
            <p>
              <strong>Phone:</strong> +1 (555) 123-4567
            </p>
            <p>
              <strong>{t('contactPage.officeHours', 'Office hours')}:</strong> Monday – Friday, 09:00 – 17:00 (GMT)
            </p>
            <p>
              <strong>{t('contactPage.community', 'Community')}:</strong> {t(
                'contactPage.communityText',
                'Join the SciBridge teachers forum to share ideas and best practices.'
              )}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
