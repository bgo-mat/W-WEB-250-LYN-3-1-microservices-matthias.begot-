import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getUserInfo, updateUser, deleteUser } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function UserSettingsPage() {
    const { token, setToken, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        if (!token) {
            navigate('/');
            return;
        }

        if(user){
            setEmail(user.email);
            setName(user.name);
        }

    }, [token, navigate, user]);

    const handleUpdate = async () => {
        setFeedback(null);
        try {
            await updateUser(token, { email, name, password: password || undefined });
            setFeedback("Informations mises à jour avec succès");
        } catch(e) {
            setFeedback("Erreur lors de la mise à jour");
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Voulez-vous vraiment supprimer votre compte ? Cette action est irréversible.")) {
            try {
                await deleteUser(token);
                setToken(null);
                navigate('/');
            } catch(e) {
                setFeedback("Erreur lors de la suppression du compte");
            }
        }
    };

    function disconect(){
        localStorage.removeItem('token');
        window.location.reload();
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <header className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
                <h1 className="text-xl font-semibold text-gray-800">Paramètres du compte</h1>
                <button
                    className="text-blue-600 hover:underline"
                    onClick={() => navigate('/conversations')}
                >
                    Retour
                </button>
            </header>
            <div className="max-w-md w-full mx-auto mt-6 p-4 bg-white rounded shadow">
                {feedback && <div className="mb-4 text-sm text-center text-green-500">{feedback}</div>}
                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-1">Email</label>
                    <input
                        className="block w-full border border-gray-300 rounded p-2"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        type="email"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-1">Nom d'utilisateur</label>
                    <input
                        className="block w-full border border-gray-300 rounded p-2"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-semibold mb-1">Nouveau mot de passe (laisser vide si inchangé)</label>
                    <input
                        className="block w-full border border-gray-300 rounded p-2"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                    />
                </div>
                <div className="flex justify-between items-center">
                    <button
                        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                        onClick={handleUpdate}
                    >
                        Mettre à jour
                    </button>
                    <button
                        className="text-red-600 hover:underline"
                        onClick={handleDeleteAccount}
                    >
                        Supprimer mon compte
                    </button>
                </div>
            </div>

            <div onClick={disconect} className="cursor-pointer hover:scale-95 transition-all max-w-md w-full mx-auto mt-6 p-4 flex items-center justify-center bg-red-600 text-white rounded shadow">
                Déconnexion
            </div>
        </div>
    );
}
