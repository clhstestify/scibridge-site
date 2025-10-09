import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiAlertCircle,
  FiCheckCircle,
  FiLock,
  FiLogIn,
  FiMail,
  FiMessageCircle,
  FiSend,
  FiUser
} from 'react-icons/fi';
import { registerUser, verifyEmail, loginUser } from '../services/authService';

const initialPosts = [
  {
    id: 'post-1',
    author: 'Maya (Physics Explorer)',
    subject: 'Physics',
    createdAt: '2024-04-14T10:15:00Z',
    content:
      'I used the velocity simulation from the Physics lessons to practice English direction words. Try describing the movement using north, south, east, west!',
    comments: [
      {
        id: 'comment-1',
        author: 'Leo',
        createdAt: '2024-04-14T12:05:00Z',
        content: 'Thanks Maya! I will add arrows to my science notebook to explain directions.'
      }
    ]
  },
  {
    id: 'post-2',
    author: 'Sara (Future Biologist)',
    subject: 'Biology',
    createdAt: '2024-04-13T08:45:00Z',
    content:
      'Does anyone have tips for remembering the steps of photosynthesis in English? I created a song with “sunlight, water, and carbon dioxide” as the chorus.',
    comments: [
      {
        id: 'comment-2',
        author: 'Aisha',
        createdAt: '2024-04-13T09:10:00Z',
        content: 'I like to make a diagram with labels: sunlight → leaves → glucose. Maybe we can share our songs?'
      },
      {
        id: 'comment-3',
        author: 'Diego',
        createdAt: '2024-04-13T10:02:00Z',
        content: 'My teacher says to remember “plants use light to cook sugar.” Simple but it helps!'
      }
    ]
  }
];

const subjectAccent = {
  Physics: 'bg-purple-100 text-purple-700',
  Chemistry: 'bg-amber-100 text-amber-700',
  Biology: 'bg-emerald-100 text-emerald-700',
  'Earth Science': 'bg-sky-100 text-sky-700'
};

const formatDate = (isoDate) =>
  new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(isoDate));

const authTabs = [
  { key: 'register', label: 'Register' },
  { key: 'verify', label: 'Verify email' },
  { key: 'login', label: 'Log in' }
];

const ForumPage = ({ user, onAuthSuccess, onLogout }) => {
  const [posts, setPosts] = useState(initialPosts);
  const [subject, setSubject] = useState('Physics');
  const [statusText, setStatusText] = useState('');
  const [commentDrafts, setCommentDrafts] = useState({});
  const [forumMessage, setForumMessage] = useState('');

  const [authView, setAuthView] = useState('register');
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '' });
  const [verifyForm, setVerifyForm] = useState({ email: '', code: '' });
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [authMessage, setAuthMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeSubjects = useMemo(
    () => ['Physics', 'Chemistry', 'Biology', 'Earth Science'],
    []
  );

  const handleStatusSubmit = (event) => {
    event.preventDefault();
    if (!user) {
      setForumMessage('Please log in before posting to the forum.');
      return;
    }
    if (!statusText.trim()) {
      setForumMessage('Write a short idea or question before sharing.');
      return;
    }

    const newPost = {
      id: `post-${Date.now()}`,
      author: `${user.name} (${user.email})`,
      subject,
      createdAt: new Date().toISOString(),
      content: statusText.trim(),
      comments: []
    };

    setPosts((previous) => [newPost, ...previous]);
    setStatusText('');
    setForumMessage('Your update has been shared with the community!');
  };

  const handleCommentSubmit = (postId) => {
    if (!user) {
      setForumMessage('Please log in to join the discussion.');
      return;
    }

    const draft = commentDrafts[postId]?.trim();
    if (!draft) {
      setForumMessage('Add a helpful comment before submitting.');
      return;
    }

    const newComment = {
      id: `comment-${Date.now()}`,
      author: `${user.name} (${user.email})`,
      createdAt: new Date().toISOString(),
      content: draft
    };

    setPosts((previous) =>
      previous.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      )
    );

    setCommentDrafts((previous) => ({ ...previous, [postId]: '' }));
    setForumMessage('Thank you for adding to the conversation!');
  };

  const resetMessages = () => {
    setAuthMessage(null);
    setForumMessage('');
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    resetMessages();
    setIsSubmitting(true);
    try {
      const { message } = await registerUser(registerForm);
      setAuthMessage({ type: 'success', text: message });
      setVerifyForm({ email: registerForm.email, code: '' });
      setLoginForm((previous) => ({ ...previous, email: registerForm.email }));
      setRegisterForm({ name: '', email: '', password: '' });
      setAuthView('verify');
    } catch (error) {
      setAuthMessage({ type: 'error', text: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async (event) => {
    event.preventDefault();
    resetMessages();
    setIsSubmitting(true);
    try {
      const { message } = await verifyEmail({
        email: verifyForm.email,
        code: verifyForm.code
      });
      setAuthMessage({ type: 'success', text: message });
      setAuthView('login');
    } catch (error) {
      setAuthMessage({ type: 'error', text: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    resetMessages();
    setIsSubmitting(true);
    try {
      const { message, user: profile } = await loginUser(loginForm);
      setAuthMessage({ type: 'success', text: message });
      setLoginForm((previous) => ({ ...previous, password: '' }));
      onAuthSuccess?.(profile);
      setForumMessage('You are signed in and ready to post!');
    } catch (error) {
      setAuthMessage({ type: 'error', text: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const AuthMessage = () => {
    if (!authMessage) {
      return null;
    }
    const isSuccess = authMessage.type === 'success';
    return (
      <div
        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
          isSuccess
            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
            : 'border-rose-200 bg-rose-50 text-rose-700'
        }`}
      >
        {isSuccess ? <FiCheckCircle aria-hidden /> : <FiAlertCircle aria-hidden />}
        <span>{authMessage.text}</span>
      </div>
    );
  };

  const ForumMessage = () => {
    if (!forumMessage) {
      return null;
    }
    return (
      <div className="flex items-center gap-2 rounded-lg border border-brand-light bg-brand-light/40 px-3 py-2 text-sm font-semibold text-brand-dark">
        <FiMessageCircle aria-hidden />
        <span>{forumMessage}</span>
      </div>
    );
  };

  return (
    <section className="bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4">
        <header className="rounded-3xl bg-brand-light/60 p-8 shadow-sm">
          <h1 className="font-display text-3xl font-bold text-brand-dark">SciBridge Forum</h1>
          <p className="mt-4 max-w-3xl text-base text-slate-600">
            Share science ideas in English, ask classmates questions, and practice academic vocabulary together. Create an account, verify your email address, and log in to join the conversation.
          </p>
          {!user ? (
            <div className="mt-6 rounded-2xl bg-white p-6 shadow-inner">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                {authTabs.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => {
                      setAuthView(tab.key);
                      setAuthMessage(null);
                    }}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      authView === tab.key
                        ? 'bg-brand text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-brand-light/60'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <AuthMessage />
              {authView === 'register' && (
                <form onSubmit={handleRegister} className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2 flex items-center gap-2 text-sm font-semibold text-brand-dark">
                    <FiUser aria-hidden />
                    Create your SciBridge account
                  </div>
                  <label className="flex flex-col text-sm font-semibold text-slate-600">
                    Full name
                    <input
                      type="text"
                      value={registerForm.name}
                      onChange={(event) =>
                        setRegisterForm((previous) => ({ ...previous, name: event.target.value }))
                      }
                      className="mt-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                      placeholder="e.g., Jamie the Chemist"
                      required
                    />
                  </label>
                  <label className="flex flex-col text-sm font-semibold text-slate-600">
                    Email
                    <input
                      type="email"
                      value={registerForm.email}
                      onChange={(event) =>
                        setRegisterForm((previous) => ({ ...previous, email: event.target.value }))
                      }
                      className="mt-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                      placeholder="you@example.com"
                      required
                    />
                  </label>
                  <label className="flex flex-col text-sm font-semibold text-slate-600">
                    Password
                    <input
                      type="password"
                      value={registerForm.password}
                      onChange={(event) =>
                        setRegisterForm((previous) => ({ ...previous, password: event.target.value }))
                      }
                      className="mt-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                      placeholder="Use at least 8 characters"
                      required
                      minLength={8}
                    />
                  </label>
                  <p className="sm:col-span-2 text-xs text-slate-500">
                    We send a verification code to your email using secure SMTP delivery. Enter the code to activate your account before you post.
                  </p>
                  <button
                    type="submit"
                    className="sm:col-span-2 inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isSubmitting}
                  >
                    <FiMail aria-hidden />
                    {isSubmitting ? 'Sending verification email…' : 'Register and send code'}
                  </button>
                </form>
              )}
              {authView === 'verify' && (
                <form onSubmit={handleVerify} className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2 flex items-center gap-2 text-sm font-semibold text-brand-dark">
                    <FiMail aria-hidden />
                    Verify your email address
                  </div>
                  <label className="flex flex-col text-sm font-semibold text-slate-600">
                    Email
                    <input
                      type="email"
                      value={verifyForm.email}
                      onChange={(event) =>
                        setVerifyForm((previous) => ({ ...previous, email: event.target.value }))
                      }
                      className="mt-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                      placeholder="you@example.com"
                      required
                    />
                  </label>
                  <label className="flex flex-col text-sm font-semibold text-slate-600">
                    Verification code
                    <input
                      type="text"
                      value={verifyForm.code}
                      onChange={(event) =>
                        setVerifyForm((previous) => ({ ...previous, code: event.target.value.toUpperCase() }))
                      }
                      className="mt-2 uppercase tracking-widest rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                      placeholder="Enter 6 letters"
                      required
                      minLength={6}
                      maxLength={6}
                    />
                  </label>
                  <button
                    type="submit"
                    className="sm:col-span-2 inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isSubmitting}
                  >
                    <FiCheckCircle aria-hidden />
                    {isSubmitting ? 'Checking code…' : 'Confirm email'}
                  </button>
                </form>
              )}
              {authView === 'login' && (
                <form onSubmit={handleLogin} className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2 flex items-center gap-2 text-sm font-semibold text-brand-dark">
                    <FiLogIn aria-hidden />
                    Welcome back! Log in to post.
                  </div>
                  <label className="flex flex-col text-sm font-semibold text-slate-600">
                    Email
                    <input
                      type="email"
                      value={loginForm.email}
                      onChange={(event) =>
                        setLoginForm((previous) => ({ ...previous, email: event.target.value }))
                      }
                      className="mt-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                      placeholder="you@example.com"
                      required
                    />
                  </label>
                  <label className="flex flex-col text-sm font-semibold text-slate-600">
                    Password
                    <input
                      type="password"
                      value={loginForm.password}
                      onChange={(event) =>
                        setLoginForm((previous) => ({ ...previous, password: event.target.value }))
                      }
                      className="mt-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                      placeholder="Enter your password"
                      required
                    />
                  </label>
                  <button
                    type="submit"
                    className="sm:col-span-2 inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isSubmitting}
                  >
                    <FiLock aria-hidden />
                    {isSubmitting ? 'Signing in…' : 'Log in'}
                  </button>
                </form>
              )}
              <p className="mt-6 text-xs text-slate-500">
                Need another email? Submit the register form again to generate a new code. Verification emails are sent with SMTP so your teacher can connect the classroom mail provider.
              </p>
            </div>
          ) : (
            <div className="mt-6 flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-inner sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600">Signed in as</p>
                <p className="text-lg font-display font-semibold text-brand-dark">{user.name}</p>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onLogout?.();
                  setAuthView('login');
                  setAuthMessage(null);
                  setForumMessage('');
                }}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
              >
                <FiLogIn aria-hidden />
                Sign out
              </button>
            </div>
          )}
        </header>

        <ForumMessage />

        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="font-display text-2xl font-semibold text-brand-dark">Start a discussion</h2>
            <p className="mt-2 text-sm text-slate-500">
              Choose a science subject, write a short status, and help your classmates practice English academic language.
            </p>
            <form onSubmit={handleStatusSubmit} className="mt-6 space-y-4">
              <label className="flex flex-col text-sm font-semibold text-slate-600">
                Subject focus
                <select
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  className="mt-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                >
                  {activeSubjects.map((subjectName) => (
                    <option key={subjectName}>{subjectName}</option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col text-sm font-semibold text-slate-600">
                Share your idea
                <textarea
                  value={statusText}
                  onChange={(event) => setStatusText(event.target.value)}
                  rows={4}
                  className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                  placeholder="Explain a concept, ask a question, or share a study tip."
                />
              </label>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
              >
                <FiSend aria-hidden />
                Post status
              </button>
            </form>
            <div className="mt-8 space-y-6">
              {posts.map((post) => (
                <article key={post.id} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-6 shadow-inner">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-brand-dark">{post.author}</p>
                      <p className="text-xs uppercase tracking-wide text-slate-400">{formatDate(post.createdAt)}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${subjectAccent[post.subject]}`}>
                      {post.subject}
                    </span>
                  </div>
                  <p className="mt-4 text-sm text-slate-600">{post.content}</p>
                  <div className="mt-6 space-y-4">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-brand-dark">{comment.author}</span>
                          <span className="text-xs uppercase tracking-wide text-slate-400">{formatDate(comment.createdAt)}</span>
                        </div>
                        <p className="mt-2 text-sm text-slate-600">{comment.content}</p>
                      </div>
                    ))}
                    <form
                      onSubmit={(event) => {
                        event.preventDefault();
                        handleCommentSubmit(post.id);
                      }}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-3"
                    >
                      <label className="flex flex-col text-xs font-semibold text-slate-500">
                        Add a comment
                        <textarea
                          value={commentDrafts[post.id] ?? ''}
                          onChange={(event) =>
                            setCommentDrafts((previous) => ({ ...previous, [post.id]: event.target.value }))
                          }
                          rows={2}
                          className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                          placeholder="Give feedback using friendly science vocabulary."
                        />
                      </label>
                      <button
                        type="submit"
                        className="mt-3 inline-flex items-center gap-2 rounded-full bg-brand/90 px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-dark"
                      >
                        <FiSend aria-hidden />
                        Reply
                      </button>
                    </form>
                  </div>
                </article>
              ))}
            </div>
          </article>

          <aside className="rounded-3xl bg-white p-8 shadow-sm">
            <h3 className="font-display text-xl font-semibold text-brand-dark">Forum tips</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="rounded-xl bg-slate-50 p-3">
                <span className="font-semibold text-brand-dark">Use English sentence frames:</span> “I wonder if…”, “In my experiment…”, “I predict that…”.
              </li>
              <li className="rounded-xl bg-slate-50 p-3">
                <span className="font-semibold text-brand-dark">Respect classmates:</span> Celebrate new ideas and ask curious questions. Keep posts kind and academic.
              </li>
              <li className="rounded-xl bg-slate-50 p-3">
                <span className="font-semibold text-brand-dark">Cite resources:</span> Link to SciBridge lessons, quizzes, or outside sources using <Link to="/resources" className="text-brand underline">Resources</Link>.
              </li>
              <li className="rounded-xl bg-slate-50 p-3">
                <span className="font-semibold text-brand-dark">Stay safe:</span> Never share private passwords. Email verification keeps the forum limited to invited learners.
              </li>
            </ul>
          </aside>
        </section>
      </div>
    </section>
  );
};

export default ForumPage;
