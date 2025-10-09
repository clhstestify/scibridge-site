const ResourceCard = ({ resource }) => {
  return (
    <article className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">{resource.title}</h3>
      <p className="text-sm text-slate-600">{resource.description}</p>
      <a
        href={resource.url}
        target="_blank"
        rel="noreferrer"
        className="text-sm font-semibold text-brand hover:text-brand-dark"
      >
        Visit resource
      </a>
    </article>
  );
};

export default ResourceCard;
