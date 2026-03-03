import { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { store } from './store/store';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import AccountsPage from './pages/AccountsPage';
import StudentsSidebarPage from './pages/StudentsSidebarPage';
import StudentRegister from './pages/student_register';
import PeopleSection from './pages/People_section';
import StudentAttendence from './pages/attendence_student';

function DarkModeInit() {
  const darkMode = useSelector((state) => state.ui.darkMode);
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  return null;
}

function ProtectedRoute({ children }) {
  const user = useSelector((state) => state.ui.user);
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function PublicRoute({ children }) {
  const user = useSelector((state) => state.ui.user);
  if (user) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function RefreshToDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const didRun = useRef(false);
  useEffect(() => {
    if (didRun.current) return;
    try {
      const nav = performance.getEntriesByType?.('navigation')?.[0];
      const isReload = nav?.type === 'reload';
      const isLogin = location.pathname === '/login' || location.pathname.startsWith('/login');
      if (isReload && location.pathname !== '/' && !isLogin) {
        didRun.current = true;
        navigate('/', { replace: true });
      }
    } catch (_) {}
  }, [location.pathname, navigate]);
  return null;
}

function AppContent() {
  return (
    <>
      <DarkModeInit />
      <RefreshToDashboard />
      <Routes>
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/classes" element={<AccountsPage />} />
                  <Route path="/accounts" element={<AccountsPage />} />
                  <Route path="/studentssidebar" element={<StudentsSidebarPage />} />
                  <Route path="/student_register" element={<StudentRegister />} />
                  <Route path="/people_section" element={<PeopleSection />} />
                  <Route path="/student_attendence" element={<StudentAttendence />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
}
