import { IoLogOut } from "react-icons/io5";
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
    const { logout } = useAuth();

    return (
        <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                alignItems: 'center',
                padding: '16px 20px',
              }}
            >
              <h2 style={{ margin: 0, color: 'black', textAlign: 'center' }}>My Tasks</h2>
              <div className="logout-button">
                  <IoLogOut onClick={logout} />
              </div>
            </div>
    );
};