// src/pages/ConversationsPage.jsx
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
    joinDiscussion,
    createMessage,
    getDiscussion,
    createConversation,
    updateDiscussion,
    deleteDiscussion
} from '../services/api';
import ConversationItem from '../components/ConversationItem';
import { useNavigate } from 'react-router-dom';

export default function ConversationsPage() {
    const { token, user } = useContext(AuthContext);
    const [conversations, setConversations] = useState([]);
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    // États pour gérer la création des conversations
    const [newConversationTitle, setNewConversationTitle] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        if (!token) {
            navigate('/');
            return;
        }
        console.log(user)
        getDiscussion(token)
            .then((data) => {
                setConversations(data);
                console.log(data);
            })
            .catch((err) => setError(err.message));
    }, [token, navigate]);

    const handleJoin = async (conversationId) => {
        try {
            // Envoyer la demande de rejoindre
            await joinDiscussion(user.id, conversationId, token);
            // Créer un message système indiquant la demande de rejoindre
            await createMessage(conversationId, `${user.name} a demandé à rejoindre la conversation.`, token);
            // Rafraîchir les conversations pour mettre à jour la liste des membres
            const data = await getDiscussion(token);
            setConversations(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCreateConversation = async () => {
        if (newConversationTitle.trim() === '') return;
        try {
            const data = await createConversation(newConversationTitle, token);
            setConversations((prev) => [...prev, data]);
            setNewConversationTitle('');
            setIsCreating(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleUpdateConversation = async (id, newTitle) => {
        if (newTitle.trim() === '') return;
        try {
            const data = await updateDiscussion(id, newTitle, token);
            setConversations((prev) => prev.map(conv => conv._id === id ? data : conv));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteConversation = async (id) => {
        if (!window.confirm('Voulez-vous vraiment supprimer cette conversation ?')) return;
        try {
            await deleteDiscussion(id, token);
            setConversations((prev) => prev.filter(conv => conv._id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    return (

        <div className="min-h-screen bg-gray-100 flex flex-col">
            <header className="p-4 bg-white border-b border-gray-200 flex justify-between items-center">
                <h1 className="text-xl font-semibold text-gray-800">Mes Conversations</h1>
                <div className="flex space-x-4">
                    {!isCreating ? (
                        <button
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                            onClick={() => setIsCreating(true)}
                        >
                            Créer une Conversation
                        </button>
                    ) : (
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                                placeholder="Titre de la Conversation"
                                value={newConversationTitle}
                                onChange={(e) => setNewConversationTitle(e.target.value)}
                            />
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                                onClick={handleCreateConversation}
                                disabled={!newConversationTitle.trim()}
                            >
                                Créer
                            </button>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                                onClick={() => {
                                    setIsCreating(false);
                                    setNewConversationTitle('');
                                }}
                            >
                                Annuler
                            </button>
                        </div>
                    )}
                    <button
                        className="text-blue-600 hover:underline"
                        onClick={() => navigate('/settings')}
                    >
                        Paramètres du compte
                    </button>
                </div>
            </header>
            <div className="flex-1 overflow-y-auto p-4">
                {error && (
                    <div className="mb-4 text-red-600 text-center">{error}</div>
                )}
                {conversations.length === 0 ? (
                    <p className="text-gray-600">Aucune conversation.</p>
                ) : (
                    conversations.map((conv) => (
                        <ConversationItem
                            key={conv._id}
                            conversation={conv}
                            isMember={conv.members}
                            onClick={(id) => navigate(`/messages/${id}`)}
                            onJoin={handleJoin}
                            onEdit={handleUpdateConversation}
                            onDelete={handleDeleteConversation}
                            isCreator={conv.user_id === user?.id}
                        />
                    ))
                )}
            </div>
        </div>
    )
}
