import { useState } from 'react';

export default function LoginForm({ onLogin, onRegister, error, logOrRegister,setLogOrRegister  }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
        if (logOrRegister) {
            onRegister(email, name, password);
        } else {
            onLogin(email, password);
        }
    };

    return (
        <div className="w-full max-w-sm mx-auto p-6 border rounded shadow-sm bg-white">
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">
                {logOrRegister ? 'Inscription' : 'Connexion'}
            </h1>
            {error && <div className="text-red-600 mb-2 text-sm">{error}</div>}
            {logOrRegister && (

                <input
                    className="block w-full mb-2 border border-gray-300 rounded p-2"
                    placeholder="pseudo"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
            )
            }
            <input
                className="block w-full mb-2 border border-gray-300 rounded p-2"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
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
                {logOrRegister ? "S'inscrire" : 'Se connecter'}
            </button>
            <div className="text-sm text-center">
                {logOrRegister ? (
                    <span>
            Déjà un compte ?{' '}
                        <button
                            className="text-blue-600 hover:underline"
                            onClick={() => setLogOrRegister(false)}
                        >
              Connecte-toi
            </button>
          </span>
                ) : (
                    <span>
            Pas de compte ?{' '}
                        <button
                            className="text-blue-600 hover:underline"
                            onClick={() => setLogOrRegister(true)}
                        >
              Inscris-toi
            </button>
          </span>
                )}
            </div>
        </div>
    );
}
