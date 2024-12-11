import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { login, register } from '../services/api';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
    const { setToken } = useContext(AuthContext);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    async function handleLogin(username, password) {
        setError(null);
        try {
            const data = await login(username, password);
            setToken(data.token);
            navigate('/conversations');
        } catch(e) {
            setError(e.message || 'Identifiants incorrects');
        }
    }

    async function handleRegister(email, username, password) {
        setError(null);
        try {
            const data = await register(email, username, password);
            setToken(data.token);
            navigate('/conversations');
        } catch(e) {
            setError(e.message || 'Erreur lors de l\'inscription');
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <LoginForm onLogin={handleLogin} onRegister={handleRegister} error={error} />
        </div>
    );
}
