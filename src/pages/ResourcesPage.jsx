import ResourceCard from '../components/ResourceCard';

const resources = [
  {
    title: 'NASA Climate Kids',
    description: 'Colorful articles, videos, and games that explain Earth Science topics for young learners.',
    url: 'https://climatekids.nasa.gov/'
  },
  {
    title: 'Physics Classroom Tutorials',
    description: 'Interactive explanations, diagrams, and practice questions that cover core Physics ideas.',
    url: 'https://www.physicsclassroom.com/'
  },
  {
    title: 'Khan Academy Chemistry',
    description: 'Short video lessons and practice for atomic structure, bonding, and chemical reactions.',
    url: 'https://www.khanacademy.org/science/chemistry'
  },
  {
    title: 'BioDigital Human',
    description: '3D models and animations of the human body to support Biology studies.',
    url: 'https://www.biodigital.com/'
  }
];

const ResourcesPage = () => {
  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-10">
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-dark">Resources</p>
        <h1 className="text-3xl font-display font-semibold text-slate-900">Extra study tools</h1>
        <p className="text-sm text-slate-600">
          Explore safe websites that offer videos, animations, articles, and downloadable worksheets. Use these tools to review
          lessons or extend your learning in English.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {resources.map((resource) => (
          <ResourceCard key={resource.url} resource={resource} />
        ))}
      </div>
    </div>
  );
};

export default ResourcesPage;
