import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { logout } = useAuth();

  return (
    <>
    <h2>Welcome to the Dashboard</h2>
    <button onClick={logout}>Logout</button>
    </>
  );
};