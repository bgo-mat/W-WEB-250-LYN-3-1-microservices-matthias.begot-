import {useContext, useEffect, useState} from 'react';
import { AuthContext } from '../context/AuthContext';
import {getUserInfo, login, register} from '../services/api';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
    const { setToken, token, setUser } = useContext(AuthContext);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [logOrRegister, setLogOrRegister] = useState(true);

    useEffect(() => {
        if(token!==null)
            navigate('/conversations')
    }, [token]);

    async function handleLogin(email, password) {
        setError(null);
        try {
            const data = await login(email, password);
            if(data){
                setToken(data.token);
                getUserInfo(data.token).then(data2 => {
                    setUser(data2)
                    navigate('/conversations');
                })
            }
        } catch(e) {
            setError(e.message || 'Identifiants incorrects');
        }
    }

    async function handleRegister(email, name, password) {
        setError(null);
        try {
            const data = await register(email, name, password);
           if(data){
               setLogOrRegister(false)
           }
        } catch(e) {
            console.log(e)
            setError(e.message || 'Erreur lors de l\'inscription');
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <LoginForm logOrRegister={logOrRegister} setLogOrRegister={setLogOrRegister} onLogin={handleLogin} onRegister={handleRegister} error={error} />
        </div>
    );
}
