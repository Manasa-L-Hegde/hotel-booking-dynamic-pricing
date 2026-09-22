import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { AdminShell } from './components/AppShell';
import AiChatbot from './components/AiChatbot';
import Auth from './pages/Auth';
import Home from './pages/user/Home';
import HotelSearch from './pages/user/HotelSearch';
import HotelDetails from './pages/user/HotelDetails';
import Booking from './pages/user/Booking';
import Confirmation from './pages/user/Confirmation';
import CustomerDashboard from './pages/user/CustomerDashboard';
import DynamicPricing from './pages/DynamicPricing';
import {
  AdminOverview,
  AnalyticsAdmin,
  BookingsAdmin,
  HotelsAdmin,
  LoginActivityAdmin,
  PricingAdmin,
  RoomsAdmin,
  SettingsAdmin,
  UsersAdmin
} from './pages/admin/AdminPages';

const AdminPage = ({ children }) => (
  <ProtectedRoute adminOnly>
    <AdminShell>{children}</AdminShell>
  </ProtectedRoute>
);

export default function App() {
  return (
    <>
      <Routes>
        {/* Customer discovery and booking routes */}
        <Route path="/" element={<Home />} />
        <Route path="/hotels" element={<HotelSearch />} />
        <Route path="/hotels/:id" element={<HotelDetails />} />
        <Route path="/pricing" element={<DynamicPricing />} />
        <Route
          path="/booking"
          element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking/confirmation"
          element={
            <ProtectedRoute>
              <Confirmation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Authentication */}
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth register />} />

        {/* Admin workspace */}
        <Route path="/admin" element={<AdminPage><AdminOverview /></AdminPage>} />
        <Route path="/admin/hotels" element={<AdminPage><HotelsAdmin /></AdminPage>} />
        <Route path="/admin/rooms" element={<AdminPage><RoomsAdmin /></AdminPage>} />
        <Route path="/admin/bookings" element={<AdminPage><BookingsAdmin /></AdminPage>} />
        <Route path="/admin/pricing" element={<AdminPage><PricingAdmin /></AdminPage>} />
        <Route path="/admin/login-activity" element={<AdminPage><LoginActivityAdmin /></AdminPage>} />
        <Route path="/admin/users" element={<AdminPage><UsersAdmin /></AdminPage>} />
        <Route path="/admin/analytics" element={<AdminPage><AnalyticsAdmin /></AdminPage>} />
        <Route path="/admin/settings" element={<AdminPage><SettingsAdmin /></AdminPage>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Floating SmartStay AI Concierge Chatbot across all screens */}
      <AiChatbot />
    </>
  );
}
