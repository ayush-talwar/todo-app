import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { card, input, btnPrimary } from '../ui';
import { getErrorMessage } from '../utils/errors';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(username, password, email);
      navigate('/dashboard');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className={`${card} w-full max-w-sm`}>
      <h2 className="mb-4 text-xl font-bold">Register</h2>
      {error && (
        <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="grid gap-3">
        <input className={input} type="text" placeholder="Username" value={username}
          onChange={(e) => {setUsername(e.target.value);setError('')}} required />
        <input className={input} type="email" placeholder="Email" value={email}
          onChange={(e) => {setEmail(e.target.value);setError('')}} required />
        <input className={input} type="password" placeholder="Password" value={password}
          onChange={(e) => {setPassword(e.target.value);setError('')}} required minLength={8} />
        <button type="submit">Register</button>
      </form>
      <p className="mt-4 text-sm text-gray-500">Already have an account? {' '}
        <Link to="/login" className="font-medium text-indigo-600 hover:underline">
        Login
        </Link>
      </p>
      </div>
    </div>
  );
}