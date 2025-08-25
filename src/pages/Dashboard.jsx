import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProfileAPI } from '../api';

function Dashboard() {
  const { token, profile, setProfileData, logout } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    if (!profile && token) {
      getProfileAPI(token).then((res) => {
        if (res.success) {
          setProfileData(res.data);
        } else {
          setError(res.message || 'Failed to load profile');
        }
      }).catch((err) => {
        setError('Error fetching profile');
        console.error(err);
      });
    }
  }, [profile, token, setProfileData]);

  return (
    <div>
      <h2>Dashboard</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {profile ? (
        <div>
          <p><strong>Username:</strong> {profile.username}</p>
          <p><strong>Email:</strong> {profile.email}</p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Dashboard;
