'use client';
import { useState } from 'react';

export default function ProfilePage() {
  const [username, setUsername] = useState('exampleuser');
  const [email, setEmail] = useState('examplemail@user.com');
  const [password, setPassword] = useState('********');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ username, email, password });
  };

  return (
    <div className="p-4 bg-neutral-800 rounded-lg max-w-sm m-auto">
      <h2 className="text-center">Profile</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username" className="block mt-2">Username:</label>
        <input
        className="w-full p-2 mt-1 rounded-sm border border-neutral-600 "
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="email" className="block mt-2">Email:</label>
        <input
        className="w-full p-2 mt-1 rounded-sm border border-neutral-600 "
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password" className="block mt-2">Password:</label>
        <input
        className="w-full p-2 mt-1 rounded-sm border border-neutral-600 "
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="mt-4 w-full p-2 bg-white text-black rounded-xs cursor-pointer hover:bg-neutral-600 ">Save</button>
      </form>
    </div>
  );
}
