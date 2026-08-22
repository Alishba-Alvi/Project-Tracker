import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProjectsPage from './pages/ProjectsPage';
import MembersPage from './pages/MembersPage';
import ProtectedRoute from './components/ProtectedRoute';
import { api } from './app/api';
import { setCredentials, logout } from './features/auth/authSlice';
import type { AppDispatch } from './app/store';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const refreshResult = await dispatch(api.endpoints.refresh.initiate()).unwrap();

        dispatch(setCredentials({ accessToken: refreshResult.accessToken }));

        const meResult = await dispatch(api.endpoints.getMe.initiate());
        if ('data' in meResult && meResult.data) {
          dispatch(
            setCredentials({
              accessToken: refreshResult.accessToken,
              user: {
                id: meResult.data.userId,
                email: meResult.data.email,
                systemRole: meResult.data.role,
                name: '',
              },
            }),
          );
        }
      } catch {
        dispatch(logout());
      } finally {
        setAuthChecked(true);
      }
    };

    restoreSession();
  }, [dispatch]);

  if (!authChecked) {
    return null;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:projectId/members" element={<MembersPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;