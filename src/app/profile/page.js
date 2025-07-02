'use client';
import { useState, useEffect } from 'react';

export default function ProfilePage() {
  // Wir simulieren die eingeloggte Benutzer-ID.
  // In einer echten Anwendung käme diese ID von einem Authentifizierungssystem.
  const targetUserId = "user1"; 

  const [username, setUsername] = useState(''); 
  const [email, setEmail] = useState('');      
  const [password, setPassword] = useState('********'); 
  const [profilePicUrl, setProfilePicUrl] = useState(''); 

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialUserData, setInitialUserData] = useState(null); 

  useEffect(() => {
    async function fetchUserProfile() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/users/${targetUserId}`);

        if (!response.ok) {
          const errorBody = await response.json();
          throw new Error(`Error fetching user profile: ${response.status} - ${errorBody.message || response.statusText}`);
        }

        const userData = await response.json();
        setInitialUserData(userData); 
        setUsername(userData.username);
        setEmail(userData.email);
        // password wird nicht direkt aus der DB geladen, da es gehasht ist
        setProfilePicUrl(userData.profile_pic_url);

      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, [targetUserId]); 

  const handleSubmit = (e) => {
    e.preventDefault();
    // Hier würde die Logik zum Aktualisieren der Benutzerdaten über einen PUT/PATCH-API-Endpunkt stehen.
    // Fürs Erste loggen wir die Daten nur.
    console.log("Saving profile changes (simulated):", { username, email, password, profilePicUrl });
    // TODO: API Endpoint implementieren um Profil upzudaten oder abzurufen (PUT/PATCH /api/users/[id])
  };

  if (loading) {
    return <div className="p-4 text-xl text-white">Loading profile...</div>;
  }

  if (error) {
    return <div className="p-4 text-xl text-red-500">Error: {error}</div>;
  }

  if (!initialUserData) {
    return <div className="p-4 text-xl text-white">User profile for ID "{targetUserId}" could not be loaded.</div>;
  }

  return (
    <div className="p-4 bg-neutral-800 rounded-lg max-w-sm m-auto text-white">
      <h2 className="text-center text-2xl font-semibold mb-4">Profile</h2>
      <form onSubmit={handleSubmit}>
        {profilePicUrl && (
          <div className="flex justify-center mb-4">
            <img 
              src={profilePicUrl} 
              alt="Profile Picture" 
              className="w-24 h-24 rounded-full object-cover border-2 border-neutral-600" 
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/96x96/6B7280/FFFFFF?text=No+Image'; }} 
            />
          </div>
        )}

        <label htmlFor="username" className="block mt-2 font-medium">Username:</label>
        <input
          className="w-full p-2 mt-1 rounded-sm border border-neutral-600 bg-neutral-700 text-white focus:ring-blue-500 focus:border-blue-500"
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="email" className="block mt-2 font-medium">Email:</label>
        <input
          className="w-full p-2 mt-1 rounded-sm border border-neutral-600 bg-neutral-700 text-white focus:ring-blue-500 focus:border-blue-500"
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password" className="block mt-2 font-medium">Password:</label>
        <input
          className="w-full p-2 mt-1 rounded-sm border border-neutral-600 bg-neutral-700 text-white focus:ring-blue-500 focus:border-blue-500"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Leave blank to keep current password" 
        />
        {/* Hinweis: In einer echten Anwendung würden wir hier ein Feld für das alte Passwort und ein Bestätigungsfeld für das neue Passwort haben */}

        <label htmlFor="profilePicUrl" className="block mt-2 font-medium">Profile Picture URL:</label>
        <input
          className="w-full p-2 mt-1 rounded-sm border border-neutral-600 bg-neutral-700 text-white focus:ring-blue-500 focus:border-blue-500"
          type="url" 
          id="profilePicUrl"
          value={profilePicUrl}
          onChange={(e) => setProfilePicUrl(e.target.value)}
        />

        <button 
          type="submit" 
          className="mt-4 w-full p-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition-colors duration-200"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
