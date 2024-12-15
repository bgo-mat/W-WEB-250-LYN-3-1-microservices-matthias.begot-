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
        getDiscussion(token)
            .then((data) => {
                setConversations(data);
            })
            .catch((err) => setError(err.message));
    }, [token, navigate]);

    const handleJoin = async (conversationId) => {
        try {
            await joinDiscussion(user.id, conversationId, token);
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
            <header className="p-6 border-b-2 border-gray-200 h-32">
                <div className="flex flex-col">
                    {!isCreating ? (
                        <button
                            className="bg-green-500 text-white px-4 py-2 mb-2 rounded hover:bg-green-600 transition-colors"
                            onClick={() => setIsCreating(true)}
                        >
                            Créer une Conversation
                        </button>
                    ) : (
                        <div className="flex space-x-2 mb-2">
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
                        className="bg-blue-400 text-white justify-center px-4 py-2 rounded hover:bg-blue-500 transition-colors flex items-center"
                        onClick={() => navigate('/settings')}
                    >
                        Paramètres du compte
                    </button>
                </div>
            </header>
            <div className="flex-1 overflow-y-auto p-4">
                {conversations.length === 0 ? (
                    <p className="text-gray-600">Aucune conversation.</p>
                ) : (
                    conversations.map((conv) => (
                        <ConversationItem
                            key={conv._id}
                            conversation={conv}
                            members={conv.members}
                            onClick={(id) => navigate(`/messages/${id}`)}
                            onJoin={handleJoin}
                            onEdit={handleUpdateConversation}
                            onDelete={handleDeleteConversation}
                            creatorId={conv.user_id}
                        />
                    ))
                )}
            </div>
        </div>
    )
}
