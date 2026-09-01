import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Investors from './pages/Investors';
import Entrepreneurs from './pages/Entrepreneurs';
import Payment from './pages/Payment';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import Reports from './pages/Reports';
import ActivityLogs from './pages/ActivityLogs';
import Settings from './pages/Settings';

const App = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register/investor" element={<Register role="investor" />} />
    <Route path="/register/entrepreneur" element={<Register role="entrepreneur" />} />

    <Route element={<DashboardLayout />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/investors" element={<Investors />} />
      <Route path="/entrepreneurs" element={<Entrepreneurs />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/activity" element={<ActivityLogs />} />
      <Route path="/settings" element={<Settings />} />
    </Route>

    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

export default App;
