import { useLanguage } from '../context/LanguageContext.jsx';

const ContactPage = () => {
  const { t } = useLanguage();
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand/80">
          {t('contactPage.eyebrow', 'Contact')}
        </p>
        <h1 className="text-3xl font-display font-semibold text-white">
          {t('contactPage.heading', 'Connect with the SciBridge team')}
        </h1>
      </header>
      <section className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-3xl border border-slate-800/70 bg-slate-900/70 p-6 shadow-lg shadow-slate-950/40">
          <h2 className="text-xl font-semibold text-white">{t('contactPage.formTitle', 'Send us a message')}</h2>
          <p className="text-sm text-slate-300">
            {t(
              'contactPage.formDescription',
              'Share feedback, ask for lesson ideas, or tell us how you use SciBridge in your classroom.'
            )}
          </p>
          <form className="space-y-4">
            <label className="block text-sm text-slate-300">
              <span className="text-slate-300">{t('contactPage.nameLabel', 'Name')}</span>
              <input
                type="text"
                className="mt-1 w-full rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-2 text-slate-100 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                placeholder={t('contactPage.namePlaceholder', 'Your full name')}
              />
            </label>
            <label className="block text-sm text-slate-300">
              <span className="text-slate-300">{t('contactPage.emailLabel', 'Email')}</span>
              <input
                type="email"
                className="mt-1 w-full rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-2 text-slate-100 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                placeholder={t('contactPage.emailPlaceholder', 'you@example.com')}
              />
            </label>
            <label className="block text-sm text-slate-300">
              <span className="text-slate-300">{t('contactPage.messageLabel', 'Message')}</span>
              <textarea
                rows="4"
                className="mt-1 w-full rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-2 text-slate-100 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                placeholder={t('contactPage.messagePlaceholder', 'How can we help?')}
              />
            </label>
            <button
              type="button"
              className="w-full rounded-full bg-brand px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(56,189,248,0.3)] transition hover:bg-brand-dark"
            >
              {t('contactPage.submit', 'Send message')}
            </button>
          </form>
        </div>
        <div className="space-y-4 rounded-3xl border border-brand/40 bg-brand/10 p-6 text-slate-200 shadow-lg shadow-slate-950/40">
          <h2 className="text-xl font-semibold text-white">{t('contactPage.quickInfoTitle', 'Quick information')}</h2>
          <div className="space-y-3 text-sm">
            <p>
              <strong className="text-slate-100">Email:</strong> hello@scibridge.edu
            </p>
            <p>
              <strong className="text-slate-100">Phone:</strong> +1 (555) 123-4567
            </p>
            <p>
              <strong className="text-slate-100">{t('contactPage.officeHours', 'Office hours')}:</strong> Monday – Friday, 09:00 – 17:00 (GMT)
            </p>
            <p>
              <strong className="text-slate-100">{t('contactPage.community', 'Community')}:</strong> {t(
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
