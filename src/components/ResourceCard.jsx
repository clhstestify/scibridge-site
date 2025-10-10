import { useLanguage } from '../context/LanguageContext.jsx';

const ResourceCard = ({ resource }) => {
  const { t } = useLanguage();
  const description = t(['resources', resource.id, 'description'], resource.description);
  return (
    <article className="flex flex-col gap-3 rounded-3xl border border-slate-800/70 bg-slate-900/70 p-6 shadow-lg shadow-slate-950/40">
      <h3 className="text-lg font-semibold text-white">{resource.title}</h3>
      <p className="text-sm text-slate-300">{description}</p>
      <a
        href={resource.url}
        target="_blank"
        rel="noreferrer"
        className="text-sm font-semibold text-brand hover:text-brand-dark"
      >
        {t('resourcesPage.visit', 'Visit resource')}
      </a>
    </article>
  );
};

export default ResourceCard;
