import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProjectsPage from './pages/ProjectsPage';
import ProtectedRoute from './components/ProtectedRoute';
import { api } from './app/api';
import { setCredentials, logout } from './features/auth/authSlice';
import type { RootState, AppDispatch } from './app/store';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const authChecked = useSelector((state: RootState) => state.auth.authChecked);

  useEffect(() => {
    dispatch(api.endpoints.refresh.initiate())
      .unwrap()
      .then((tokens) => {
        dispatch(setCredentials(tokens));
      })
      .catch(() => {
        dispatch(logout());
      });
    // Runs once on mount to restore a session from the HttpOnly refresh
    // cookie, if one still exists (e.g. after a page reload).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
