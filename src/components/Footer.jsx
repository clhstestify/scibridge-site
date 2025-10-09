import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-20 bg-slate-900 py-12 text-slate-200">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-4">
        <div>
          <h3 className="font-display text-xl font-semibold text-white">SciBridge</h3>
          <p className="mt-3 text-sm text-slate-300">
            Bridging science learning and English support for high school students around the world.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/subjects" className="hover:text-brand">
                Subjects
              </Link>
            </li>
            <li>
              <Link to="/quizzes" className="hover:text-brand">
                Quizzes
              </Link>
            </li>
            <li>
              <Link to="/resources" className="hover:text-brand">
                Resources
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>Email: hello@scibridge.edu</li>
            <li>Phone: +1 (555) 123-4567</li>
            <li>Address: 42 Learning Lane, Global City</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Stay Curious</h4>
          <p className="mt-3 text-sm text-slate-300">
            Subscribe for updates about new lessons, live events, and teacher tips.
          </p>
          <form className="mt-3 flex gap-2">
            <input
              type="email"
              className="flex-1 rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-brand focus:outline-none"
              placeholder="Email address"
              aria-label="Email address"
            />
            <button
              type="button"
              className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow hover:bg-brand-dark"
            >
              Join
            </button>
          </form>
        </div>
      </div>
      <p className="mt-10 text-center text-xs text-slate-500">© {new Date().getFullYear()} SciBridge. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
