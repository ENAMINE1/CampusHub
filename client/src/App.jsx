// Route table: which page component renders for which URL. Layout wraps every page.
import { lazy } from 'react';
import { Route, Routes } from 'react-router';
import Layout from './pages/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import EventsPage from './pages/EventsPage.jsx';
import EventDetailsPage from './pages/EventDetailsPage.jsx';
import ClubsPage from './pages/ClubsPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import GuestOnly from './routes/GuestOnly.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';

// Loaded on demand: most visitors never open this page, so its code stays out of the first download.
const MyRegistrationsPage = lazy(() => import('./pages/MyRegistrationsPage.jsx'));

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="events/:id" element={<EventDetailsPage />} />
        <Route path="clubs" element={<ClubsPage />} />
        <Route
          path="login"
          element={
            <GuestOnly>
              <LoginPage />
            </GuestOnly>
          }
        />
        <Route
          path="register"
          element={
            <GuestOnly>
              <RegisterPage />
            </GuestOnly>
          }
        />
        <Route
          path="me/registrations"
          element={
            <ProtectedRoute roles={['student']}>
              <MyRegistrationsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
