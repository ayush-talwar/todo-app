import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { card, input, btnPrimary } from '../ui';
import { getErrorMessage } from '../utils/errors';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };
  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className={`${card} w-full max-w-sm`}>
      <h2 className="mb-4 text-xl font-bold">Login</h2>
     {error && (
        <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="grid gap-3">
        <input
        className={input}
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required 
        />
        <input 
        className={input}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        />
        <button type="submit" className={btnPrimary}>
          Login
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-500">Don't have an account? {' '} 
        <Link to="/register" className="font-medium text-indigo-600 hover:underline">
        Register
        </Link>
      </p>
      </div>
    </div>
  );
};