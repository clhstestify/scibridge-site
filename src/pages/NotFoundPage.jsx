import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="text-4xl font-display font-semibold text-slate-900">Page not found</h1>
      <p className="mt-4 text-sm text-slate-600">
        The page you are looking for does not exist. Use the navigation bar or explore our main subjects.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow hover:bg-brand-dark"
      >
        Back to home
      </Link>
    </div>
  );
};

export default NotFoundPage;
