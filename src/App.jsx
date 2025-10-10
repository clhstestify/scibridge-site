import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SubjectsPage from './pages/SubjectsPage';
import SubjectDetailPage from './pages/SubjectDetailPage';
import LessonPage from './pages/LessonPage';
import QuizzesPage from './pages/QuizzesPage';
import ResourcesPage from './pages/ResourcesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import ForumPage from './pages/ForumPage';
import AdminPanelPage from './pages/AdminPanelPage';
import { useProgress } from './hooks/useProgress';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { progress, markCompleted, resetProgress } = useProgress();
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') {
      return null;
    }
    try {
      const stored = window.localStorage.getItem('scibridge-auth-user');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      return null;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (user) {
      window.localStorage.setItem('scibridge-auth-user', JSON.stringify(user));
    } else {
      window.localStorage.removeItem('scibridge-auth-user');
    }
  }, [user]);

  const handleAuthSuccess = (profile) => {
    setUser(profile);
  };

  const handleProfileUpdate = (profile) => {
    setUser(profile);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="flex min-h-screen flex-col text-slate-100">
      <Navbar onSearch={setSearchQuery} user={user} onLogout={handleLogout} />
      <main className="flex-1 pb-20">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/subjects"
            element={
              <SubjectsPage
                query={searchQuery}
                setQuery={setSearchQuery}
                progress={progress}
                onComplete={markCompleted}
                onResetProgress={resetProgress}
              />
            }
          />
          <Route
            path="/subjects/:subjectId"
            element={<SubjectDetailPage progress={progress} onComplete={markCompleted} />}
          />
          <Route
            path="/subjects/:subjectId/lessons/:lessonId"
            element={<LessonPage progress={progress} onComplete={markCompleted} />}
          />
          <Route path="/quizzes" element={<QuizzesPage />} />
          <Route
            path="/forum"
            element={<ForumPage user={user} onAuthSuccess={handleAuthSuccess} onLogout={handleLogout} />}
          />
          <Route
            path="/admin"
            element={<AdminPanelPage user={user} onProfileUpdate={handleProfileUpdate} />}
          />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
