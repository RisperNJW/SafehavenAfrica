// src/App.tsx
import { useState, useEffect } from 'react';
import { AuthModal } from './components/AuthModal';
import HomeDashboard from './pages/HomeDashboard';
import { authAPI } from '../client_side/src/api/auth';
import type { User } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (token) {
      authAPI
        .me()
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-rose-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-3xl font-bold text-white">SafeSpace</h2>
          <p className="text-white mt-4">Loading your safe space...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {user ? (
        <HomeDashboard user={user} onLogout={handleLogout} />
      ) : (
        <AuthModal
          isOpen={true}
          onClose={() => {}}
          onLogin={handleLogin}
        />
      )}
    </>
  );
}

export default App;