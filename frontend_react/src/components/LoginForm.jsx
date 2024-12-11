import { useState } from 'react';

export default function LoginForm({ onLogin, onRegister, error }) {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
        if (isRegister) {
            onRegister(email, username, password);
        } else {
            onLogin(username, password);
        }
    };

    return (
        <div className="w-full max-w-sm mx-auto p-6 border rounded shadow-sm bg-white">
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">
                {isRegister ? 'Inscription' : 'Connexion'}
            </h1>
            {error && <div className="text-red-600 mb-2 text-sm">{error}</div>}
            {isRegister && (
                <input
                    className="block w-full mb-2 border border-gray-300 rounded p-2"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            )}
            <input
                className="block w-full mb-2 border border-gray-300 rounded p-2"
                placeholder={isRegister ? "Nom d'utilisateur" : "Nom d'utilisateur ou Email"}
                value={username}
                onChange={e => setUsername(e.target.value)}
            />
            <input
                className="block w-full mb-4 border border-gray-300 rounded p-2"
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <button
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 mb-2"
                onClick={handleSubmit}
            >
                {isRegister ? "S'inscrire" : 'Se connecter'}
            </button>
            <div className="text-sm text-center">
                {isRegister ? (
                    <span>
            Déjà un compte ?{' '}
                        <button
                            className="text-blue-600 hover:underline"
                            onClick={() => setIsRegister(false)}
                        >
              Connecte-toi
            </button>
          </span>
                ) : (
                    <span>
            Pas de compte ?{' '}
                        <button
                            className="text-blue-600 hover:underline"
                            onClick={() => setIsRegister(true)}
                        >
              Inscris-toi
            </button>
          </span>
                )}
            </div>
        </div>
    );
}
