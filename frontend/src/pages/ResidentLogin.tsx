import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const ResidentLogin: React.FC = () =>
{
  const { signIn, signInWithIdNumber, loading } = useAuth();
  const [mode, setMode] = useState<'email' | 'id'>('email');
  const [email, setEmail] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) =>
  {
    e.preventDefault();
    if (mode === 'email')
    {
      await signIn(email, password);
    } else
    {
      await signInWithIdNumber(idNumber, password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gold-50 to-cream-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gold-700">התחברות דיירים</h2>

        <div className="flex justify-center mb-4">
          <button
            className={`px-4 py-2 rounded-l ${mode === 'email' ? 'bg-gold-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setMode('email')}
          >
            התחברות במייל
          </button>
          <button
            className={`px-4 py-2 rounded-r ${mode === 'id' ? 'bg-gold-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setMode('id')}
          >
            התחברות בתעודת זהות
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'email' ? (
            <>
              <input
                type="email"
                placeholder="מייל"
                className="w-full border p-2 rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="תעודת זהות"
                className="w-full border p-2 rounded"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                required
              />
            </>
          )}

          <input
            type="password"
            placeholder="סיסמה"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-gold-600 text-white py-2 rounded hover:bg-gold-700 transition"
            disabled={loading}
          >
            {loading ? 'מתחבר...' : 'התחבר'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResidentLogin;
