// src/DummySignIn.js
import React, { useState } from 'react';

function DummySignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    const handleSignIn = (e) => {
        e.preventDefault();
        // Dummy logic for signing in
        if (email === 'test@example.com' && password === 'password') {
            setUser({ email });
            setError('');
        } else {
            setError('Invalid email or password');
        }
    };

    const handleSignOut = () => {
        setUser(null);
    };

    return (
        <div>
            {user ? (
                <div>
                    <h2>Welcome, {user.email}</h2>
                    <button onClick={handleSignOut}>Sign Out</button>
                </div>
            ) : (
                <div>
                    <h2>Sign In</h2>
                    <form onSubmit={handleSignIn}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit">Sign In</button>
                    </form>
                    {error && <p>{error}</p>}
                </div>
            )}
        </div>
    );
}

export default DummySignIn;
