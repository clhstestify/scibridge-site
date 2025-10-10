import { useEffect, useMemo, useState } from 'react';
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiEdit,
  FiLayers,
  FiShield,
  FiUserCheck,
  FiUsers
} from 'react-icons/fi';
import { WPAdminLayout, WPAdminCard, WPAdminStat } from '../components/wpadmin';
import {
  createAnnouncement,
  createContest,
  createPracticeSet,
  fetchDashboard,
  updateUserRole,
  updateUserStatus
} from '../services/adminService';

const defaultAnnouncement = { title: '', message: '', audience: 'global' };
const defaultContest = { name: '', description: '', deadline: '', audience: 'global' };
const defaultPractice = { title: '', focusArea: '', description: '', resourceUrl: '', audience: 'global' };

const sectionIds = {
  overview: 'wpadmin-section-overview',
  announcements: 'wpadmin-section-announcements',
  contests: 'wpadmin-section-contests',
  practice: 'wpadmin-section-practice',
  people: 'wpadmin-section-people'
};

const AdminPanelPage = ({ user, onProfileUpdate }) => {
  const [dashboard, setDashboard] = useState(null);
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeSection, setActiveSection] = useState('overview');

  const [announcementForm, setAnnouncementForm] = useState(defaultAnnouncement);
  const [contestForm, setContestForm] = useState(defaultContest);
  const [practiceForm, setPracticeForm] = useState(defaultPractice);

  const [roleDrafts, setRoleDrafts] = useState({});
  const [orgDrafts, setOrgDrafts] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const role = user?.role;
  const isAdmin = role === 'admin';
  const isTeacher = role === 'teacher';
  const canAccessPanel = Boolean(user) && (isAdmin || isTeacher);

  useEffect(() => {
    if (!canAccessPanel) {
      return;
    }

    let isMounted = true;
    setStatus('loading');
    fetchDashboard(user)
      .then((data) => {
        if (!isMounted) return;
        setDashboard(data);
        setStatus('ready');
        setErrorMessage('');
      })
      .catch((error) => {
        if (!isMounted) return;
        setStatus('error');
        setErrorMessage(error.message);
      });

    return () => {
      isMounted = false;
    };
  }, [canAccessPanel, user]);

  useEffect(() => {
    if (!dashboard || !user) {
      return;
    }
    if (dashboard.viewer && dashboard.viewer.email === user.email) {
      onProfileUpdate?.(dashboard.viewer);
    }
  }, [dashboard, onProfileUpdate, user]);

  const setRoleDraft = (userId, value) => {
    setRoleDrafts((previous) => ({ ...previous, [userId]: value }));
  };

  const setOrgDraft = (userId, value) => {
    setOrgDrafts((previous) => ({ ...previous, [userId]: value }));
  };

  const handleError = (message) => {
    setErrorMessage(message);
    setSuccessMessage('');
  };

  const handleSuccess = (message) => {
    setSuccessMessage(message);
    setErrorMessage('');
  };

  const handleAnnouncementSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const { announcement } = await createAnnouncement(user, announcementForm);
      setDashboard((previous) => {
        if (!previous) {
          return previous;
        }
        return {
          ...previous,
          announcements: [announcement, ...(previous.announcements ?? [])]
        };
      });
      setAnnouncementForm(defaultAnnouncement);
      handleSuccess('Announcement published successfully.');
    } catch (error) {
      handleError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContestSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const { contest } = await createContest(user, contestForm);
      setDashboard((previous) => {
        if (!previous) {
          return previous;
        }
        return {
          ...previous,
          contests: [contest, ...(previous.contests ?? [])]
        };
      });
      setContestForm(defaultContest);
      handleSuccess('Contest created for learners.');
    } catch (error) {
      handleError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePracticeSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const { practiceSet } = await createPracticeSet(user, practiceForm);
      setDashboard((previous) => {
        if (!previous) {
          return previous;
        }
        return {
          ...previous,
          practiceSets: [practiceSet, ...(previous.practiceSets ?? [])]
        };
      });
      setPracticeForm(defaultPractice);
      handleSuccess('Practice set shared with your learners.');
    } catch (error) {
      handleError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleUpdate = async (target) => {
    const nextRole = roleDrafts[target.id] ?? target.role;
    const nextOrg = orgDrafts[target.id] ?? target.organization ?? '';

    setIsSubmitting(true);
    try {
      const { user: updatedUser } = await updateUserRole(user, {
        userId: target.id,
        role: nextRole,
        organization: nextOrg
      });

      setDashboard((previous) => {
        if (!previous) {
          return previous;
        }
        return {
          ...previous,
          users: previous.users.map((entry) => (entry.id === updatedUser.id ? updatedUser : entry))
        };
      });

      if (updatedUser.email === user.email) {
        onProfileUpdate?.(updatedUser);
      }

      setRoleDrafts((previous) => ({ ...previous, [target.id]: undefined }));
      setOrgDrafts((previous) => ({ ...previous, [target.id]: undefined }));
      handleSuccess('User role updated successfully.');
    } catch (error) {
      handleError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusToggle = async (target) => {
    const nextStatus = target.status === 'active' ? 'banned' : 'active';
    setIsSubmitting(true);
    try {
      const { user: updatedUser } = await updateUserStatus(user, {
        userId: target.id,
        status: nextStatus
      });

      setDashboard((previous) => {
        if (!previous) {
          return previous;
        }
        return {
          ...previous,
          users: previous.users.map((entry) => (entry.id === updatedUser.id ? updatedUser : entry))
        };
      });
      handleSuccess(`User status changed to ${nextStatus}.`);
    } catch (error) {
      handleError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSectionSelect = (section) => {
    setActiveSection(section);
    const element = document.getElementById(sectionIds[section] ?? section);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const headline = useMemo(() => {
    if (isAdmin) {
      return 'WPAdmin community command center';
    }
    if (isTeacher) {
      return 'WPAdmin teaching leadership hub';
    }
    return 'Admin panel';
  }, [isAdmin, isTeacher]);

  const users = dashboard?.users ?? [];
  const announcements = dashboard?.announcements ?? [];
  const contests = dashboard?.contests ?? [];
  const practiceSets = dashboard?.practiceSets ?? [];

  const stats = useMemo(() => {
    const activeUsers = users.filter((entry) => entry.status === 'active').length;
    const teachers = users.filter((entry) => entry.role === 'teacher').length;
    const admins = users.filter((entry) => entry.role === 'admin').length;
    return [
      {
        label: 'Community members',
        value: users.length,
        tone: 'accent',
        hint: `${teachers} teachers · ${admins} admins`
      },
      {
        label: 'Announcements',
        value: announcements.length,
        tone: 'default',
        hint: 'Shared English-language updates'
      },
      {
        label: 'Active contests',
        value: contests.length,
        tone: 'success',
        hint: 'Learning challenges currently live'
      },
      {
        label: 'Practice sets',
        value: practiceSets.length,
        tone: 'warning',
        hint: 'Guided science-language exercises'
      },
      {
        label: 'Active users',
        value: activeUsers,
        tone: 'default',
        hint: `${users.length - activeUsers} awaiting action`
      }
    ];
  }, [announcements.length, contests.length, practiceSets.length, users]);

  const navItems = useMemo(
    () => [
      { id: 'overview', label: 'Overview', icon: FiLayers },
      { id: 'announcements', label: 'Announcements', icon: FiEdit, badge: announcements.length || undefined },
      { id: 'contests', label: 'Contests', icon: FiUsers, badge: contests.length || undefined },
      { id: 'practice', label: 'Practice', icon: FiUserCheck, badge: practiceSets.length || undefined },
      { id: 'people', label: 'People', icon: FiShield, badge: users.length || undefined }
    ],
    [announcements.length, contests.length, practiceSets.length, users.length]
  );

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <FiShield className="mx-auto h-12 w-12 text-brand" aria-hidden />
        <h1 className="mt-6 text-3xl font-display font-semibold text-slate-900">Sign in to access the admin panel</h1>
        <p className="mt-3 text-sm text-slate-600">
          Please register, verify your email, and log in. Administrator or teacher permissions are required to view this page.
        </p>
      </div>
    );
  }

  if (!canAccessPanel) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <FiAlertTriangle className="mx-auto h-12 w-12 text-amber-500" aria-hidden />
        <h1 className="mt-6 text-3xl font-display font-semibold text-slate-900">Limited access</h1>
        <p className="mt-3 text-sm text-slate-600">
          Your account is currently a student account. Please contact an administrator if you need teacher or admin permissions
          to manage community content.
        </p>
      </div>
    );
  }

  const sidebar = (
    <>
      <div className="wpadmin-sidebar__brand">
        <span className="wpadmin-sidebar__logo">SciBridge WPAdmin</span>
        <span className="wpadmin-sidebar__subtitle">Leadership console</span>
      </div>
      <nav className="wpadmin-sidebar__nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`wpadmin-sidebar__button ${isActive ? 'is-active' : ''}`}
              onClick={() => handleSectionSelect(item.id)}
            >
              <Icon aria-hidden />
              <span>{item.label}</span>
              {item.badge ? <span className="wpadmin-sidebar__badge">{item.badge}</span> : null}
            </button>
          );
        })}
      </nav>
      <div className="wpadmin-sidebar__foot">
        <p>
          <strong>{user?.name ?? user?.email}</strong>
          <br />
          {role?.toUpperCase()} · {user?.organization || 'Global scope'}
        </p>
      </div>
    </>
  );

  const header = (
    <>
      <div className="wpadmin-topbar">
        <div>
          <h1 className="wpadmin-topbar__title">{headline}</h1>
          <p className="wpadmin-topbar__subtitle">
            Coordinate English-first science instruction, manage community members, and publish announcements from one familiar
            WordPress-style console.
          </p>
          {status === 'loading' && <p className="wpadmin-topbar__subtitle">Loading dashboard data…</p>}
        </div>
        <div className="wpadmin-topbar__meta">
          <span className={`wpadmin-tag ${isAdmin ? 'wpadmin-tag--success' : 'wpadmin-tag--warning'}`}>
            {isAdmin ? 'Admin' : 'Teacher'}
          </span>
          <span>{user.email}</span>
        </div>
      </div>
      {errorMessage && (
        <div className="wpadmin-message wpadmin-message--error" role="alert">
          <FiAlertTriangle aria-hidden />
          <span>{errorMessage}</span>
        </div>
      )}
      {successMessage && (
        <div className="wpadmin-message wpadmin-message--success" role="status">
          <FiCheckCircle aria-hidden />
          <span>{successMessage}</span>
        </div>
      )}
    </>
  );

  return (
    <WPAdminLayout sidebar={sidebar} header={header}>
      <WPAdminCard
        id={sectionIds.overview}
        icon={FiLayers}
        title="Insights overview"
        description="Monitor your science learning community at a glance."
      >
        <dl className="wpadmin-stat-grid">
          {stats.map((entry) => (
            <WPAdminStat key={entry.label} label={entry.label} value={entry.value} tone={entry.tone} hint={entry.hint} />
          ))}
        </dl>
      </WPAdminCard>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1.1fr]">
        <div className="grid gap-6">
          <WPAdminCard
            id={sectionIds.announcements}
            icon={FiEdit}
            title="Publish announcement"
            description="Share timely English announcements across your learners."
          >
            <form onSubmit={handleAnnouncementSubmit} className="wpadmin-form-grid">
              <label className="wpadmin-form-group">
                <span className="wpadmin-label">Title</span>
                <input
                  type="text"
                  value={announcementForm.title}
                  onChange={(event) => setAnnouncementForm((previous) => ({ ...previous, title: event.target.value }))}
                  className="wpadmin-input"
                  placeholder="Weekly English immersion focus"
                  required
                />
              </label>
              <label className="wpadmin-form-group">
                <span className="wpadmin-label">Message</span>
                <textarea
                  value={announcementForm.message}
                  onChange={(event) => setAnnouncementForm((previous) => ({ ...previous, message: event.target.value }))}
                  className="wpadmin-textarea"
                  placeholder="Use friendly academic language to guide students."
                  required
                />
              </label>
              {isAdmin && (
                <label className="wpadmin-form-group">
                  <span className="wpadmin-label">Audience</span>
                  <input
                    type="text"
                    value={announcementForm.audience}
                    onChange={(event) => setAnnouncementForm((previous) => ({ ...previous, audience: event.target.value }))}
                    className="wpadmin-input"
                    placeholder="global or organization name"
                  />
                </label>
              )}
              <button type="submit" className="wpadmin-button" disabled={isSubmitting}>
                <FiEdit aria-hidden />
                Share announcement
              </button>
            </form>
          </WPAdminCard>

          <WPAdminCard
            id={sectionIds.contests}
            icon={FiUsers}
            title="Launch contest or challenge"
            description="Create science-language challenges and keep learners on schedule."
          >
            <form onSubmit={handleContestSubmit} className="wpadmin-form-grid">
              <label className="wpadmin-form-group">
                <span className="wpadmin-label">Contest name</span>
                <input
                  type="text"
                  value={contestForm.name}
                  onChange={(event) => setContestForm((previous) => ({ ...previous, name: event.target.value }))}
                  className="wpadmin-input"
                  placeholder="English Lab Journal Showcase"
                  required
                />
              </label>
              <label className="wpadmin-form-group">
                <span className="wpadmin-label">Description</span>
                <textarea
                  value={contestForm.description}
                  onChange={(event) => setContestForm((previous) => ({ ...previous, description: event.target.value }))}
                  className="wpadmin-textarea"
                  placeholder="Students submit a one-page explanation of a recent experiment in English."
                  required
                />
              </label>
              <label className="wpadmin-form-group">
                <span className="wpadmin-label">Deadline (optional)</span>
                <input
                  type="date"
                  value={contestForm.deadline}
                  onChange={(event) => setContestForm((previous) => ({ ...previous, deadline: event.target.value }))}
                  className="wpadmin-input"
                />
              </label>
              {isAdmin && (
                <label className="wpadmin-form-group">
                  <span className="wpadmin-label">Audience</span>
                  <input
                    type="text"
                    value={contestForm.audience}
                    onChange={(event) => setContestForm((previous) => ({ ...previous, audience: event.target.value }))}
                    className="wpadmin-input"
                    placeholder="global or organization name"
                  />
                </label>
              )}
              <button type="submit" className="wpadmin-button" disabled={isSubmitting}>
                <FiUsers aria-hidden />
                Create contest
              </button>
            </form>
          </WPAdminCard>

          <WPAdminCard
            id={sectionIds.practice}
            icon={FiUserCheck}
            title="Build English practice sets"
            description="Connect vocabulary, grammar, and science concepts with curated resources."
          >
            <form onSubmit={handlePracticeSubmit} className="wpadmin-form-grid">
              <label className="wpadmin-form-group">
                <span className="wpadmin-label">Title</span>
                <input
                  type="text"
                  value={practiceForm.title}
                  onChange={(event) => setPracticeForm((previous) => ({ ...previous, title: event.target.value }))}
                  className="wpadmin-input"
                  placeholder="Climate change terminology drill"
                  required
                />
              </label>
              <label className="wpadmin-form-group">
                <span className="wpadmin-label">Focus area</span>
                <input
                  type="text"
                  value={practiceForm.focusArea}
                  onChange={(event) => setPracticeForm((previous) => ({ ...previous, focusArea: event.target.value }))}
                  className="wpadmin-input"
                  placeholder="Biology · Scientific writing"
                  required
                />
              </label>
              <label className="wpadmin-form-group">
                <span className="wpadmin-label">Description</span>
                <textarea
                  value={practiceForm.description}
                  onChange={(event) => setPracticeForm((previous) => ({ ...previous, description: event.target.value }))}
                  className="wpadmin-textarea"
                  placeholder="Explain how learners should use this practice set to reinforce English-language science skills."
                />
              </label>
              <label className="wpadmin-form-group">
                <span className="wpadmin-label">Resource link (optional)</span>
                <input
                  type="url"
                  value={practiceForm.resourceUrl}
                  onChange={(event) => setPracticeForm((previous) => ({ ...previous, resourceUrl: event.target.value }))}
                  className="wpadmin-input"
                  placeholder="https://"
                />
              </label>
              {isAdmin && (
                <label className="wpadmin-form-group">
                  <span className="wpadmin-label">Audience</span>
                  <input
                    type="text"
                    value={practiceForm.audience}
                    onChange={(event) => setPracticeForm((previous) => ({ ...previous, audience: event.target.value }))}
                    className="wpadmin-input"
                    placeholder="global or organization name"
                  />
                </label>
              )}
              <button type="submit" className="wpadmin-button" disabled={isSubmitting}>
                <FiUserCheck aria-hidden />
                Save practice set
              </button>
            </form>
          </WPAdminCard>
        </div>

        <div className="grid gap-6">
          <WPAdminCard
            icon={FiEdit}
            title="Latest announcements"
            description="Track the English-language updates already shared with learners."
          >
            <div className="wpadmin-list">
              {announcements.length === 0 && <p className="text-sm text-slate-600">No announcements yet.</p>}
              {announcements.map((announcement) => (
                <article key={announcement.id} className="wpadmin-list__item">
                  <h3 className="font-semibold text-slate-900">{announcement.title}</h3>
                  <p className="wpadmin-list__meta">
                    {new Date(announcement.createdAt).toLocaleString('en-US', {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                    {' · '}Audience: {announcement.audience}
                  </p>
                  <p className="text-sm text-slate-700">{announcement.message}</p>
                </article>
              ))}
            </div>
          </WPAdminCard>

          <WPAdminCard icon={FiUsers} title="Active contests" description="Monitor running contests and their deadlines.">
            <div className="wpadmin-list">
              {contests.length === 0 && <p className="text-sm text-slate-600">No contests created yet.</p>}
              {contests.map((contest) => (
                <article key={contest.id} className="wpadmin-list__item">
                  <h3 className="font-semibold text-slate-900">{contest.name}</h3>
                  <p className="wpadmin-list__meta">
                    Audience: {contest.audience}
                    {contest.deadline ? ` · Due ${contest.deadline}` : ''}
                  </p>
                  <p className="text-sm text-slate-700">{contest.description}</p>
                </article>
              ))}
            </div>
          </WPAdminCard>

          <WPAdminCard
            icon={FiUserCheck}
            title="Practice sets"
            description="Reference the resources you and other leaders have published."
          >
            <div className="wpadmin-list">
              {practiceSets.length === 0 && <p className="text-sm text-slate-600">No practice sets created yet.</p>}
              {practiceSets.map((practice) => (
                <article key={practice.id} className="wpadmin-list__item">
                  <h3 className="font-semibold text-slate-900">{practice.title}</h3>
                  <p className="wpadmin-list__meta">
                    Focus: {practice.focusArea} · Audience: {practice.audience}
                  </p>
                  {practice.description && <p className="text-sm text-slate-700">{practice.description}</p>}
                  {practice.resourceUrl && (
                    <a
                      href={practice.resourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold text-brand underline"
                    >
                      Open linked resource
                    </a>
                  )}
                </article>
              ))}
            </div>
          </WPAdminCard>
        </div>
      </div>

      <WPAdminCard
        id={sectionIds.people}
        icon={FiShield}
        title="Manage people"
        description="Adjust permissions, update organizations, and toggle account access."
      >
        <div className="grid gap-4">
          {users.length === 0 && <p className="text-sm text-slate-600">No members found yet.</p>}
          {users.map((entry) => {
            const currentRole = roleDrafts[entry.id] ?? entry.role;
            const currentOrganization = orgDrafts[entry.id] ?? entry.organization ?? '';
            const isTeacherDraft = currentRole === 'teacher';
            return (
              <div key={entry.id} className="wpadmin-user-card">
                <div className="wpadmin-user-card__heading">
                  <span className="wpadmin-user-card__name">{entry.name}</span>
                  <span className="wpadmin-user-card__email">{entry.email}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className={`wpadmin-tag ${entry.status === 'active' ? 'wpadmin-tag--success' : 'wpadmin-tag--warning'}`}>
                    {entry.status}
                  </span>
                  <span className="wpadmin-badge">Role: {entry.role}</span>
                  {entry.organization && <span className="wpadmin-badge">Org: {entry.organization}</span>}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="wpadmin-form-group">
                    <span className="wpadmin-label">Role</span>
                    <select
                      value={currentRole}
                      onChange={(event) => setRoleDraft(entry.id, event.target.value)}
                      className="wpadmin-select"
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="admin">Admin</option>
                    </select>
                  </label>
                  {isTeacherDraft && (
                    <label className="wpadmin-form-group">
                      <span className="wpadmin-label">Organization</span>
                      <input
                        type="text"
                        value={currentOrganization}
                        onChange={(event) => setOrgDraft(entry.id, event.target.value)}
                        className="wpadmin-input"
                        placeholder="e.g., Green Valley High"
                      />
                    </label>
                  )}
                </div>
                <div className="wpadmin-user-card__actions">
                  <button
                    type="button"
                    className="wpadmin-button"
                    onClick={() => handleRoleUpdate(entry)}
                    disabled={isSubmitting}
                  >
                    <FiCheckCircle aria-hidden />
                    Save role
                  </button>
                  <button
                    type="button"
                    className={`wpadmin-button ${entry.status === 'active' ? 'wpadmin-button--danger' : ''}`}
                    onClick={() => handleStatusToggle(entry)}
                    disabled={isSubmitting}
                  >
                    <FiShield aria-hidden />
                    {entry.status === 'active' ? 'Ban user' : 'Reinstate'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </WPAdminCard>
    </WPAdminLayout>
  );
};

export default AdminPanelPage;
