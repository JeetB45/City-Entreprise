import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            alert('Invalid credentials');
        }
    };

    return (
        <form className="login-form" onSubmit={handleLogin}>
            <h2>Admin Login</h2>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
            <input value={password} type="password" onChange={e => setPassword(e.target.value)} placeholder="Password" required />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
