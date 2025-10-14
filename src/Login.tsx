import { useState } from 'react'
import { supabase } from './supabaseClient'

export function Login() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        
        if (error) setError(error.message)
    }

    const handleSignup = async (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        setError(null)

        const { error } = await supabase.auth.signUp({
           email,
           password,
        })

        if (error) setError(error.message)
    }

    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: "https://bcthomas22.github.io/infinitejustice/",
            },
        });
    }

    return(
        <div className='auth-box'>
            <h2>Login / Sign Up</h2>
            <form>
                <input
                    type="email"
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div className='auth-buttons'>
                    <button onClick={handleLogin}>Log In</button>
                    <button onClick={handleSignup}>Sign Up</button>
                </div>
            </form>
                
            <div className="divider">or</div>

            <button className="google-btn" onClick={handleGoogleLogin}>
                <img
                    src="https://developers.google.com/identity/images/g-logo.png"
                    alt="Google logo"
                    width="20"
                    height="20"
                    style={{ marginRight: '8px' }}
                />
                Sign in with Google
            </button>
            {error && <p className="error">{error}</p>}
        </div>
    )

        
}