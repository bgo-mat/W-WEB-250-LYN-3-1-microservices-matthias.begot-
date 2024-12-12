// src/pages/MessagesPage.jsx
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
    fetchConversations,
    getMessages,
    createMessage,
    updateMessage,
    deleteMessage,
} from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import MessageItem from '../components/MessageItem';

export default function MessagesPage() {
    const { token, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const { conversationId } = useParams();
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [error, setError] = useState(null);

    // Récupérer les conversations
    useEffect(() => {
        if (!token) {
            navigate('/');
            return;
        }

        fetchConversations(token)
            .then((data) => setConversations(data.conversations))
            .catch((err) => setError(err.message));
    }, [token, navigate]);

    // Récupérer les messages de la conversation sélectionnée
    useEffect(() => {
        if (token && conversationId) {
            getMessages(conversationId, token)
                .then((data) => {
                    setMessages(data); // data est un tableau de messages
                    console.log(data);
                })
                .catch((err) => setError(err.message));
        }
    }, [token, conversationId]);

    // Envoyer un nouveau message
    const handleSendMessage = async () => {
        if (newMessage.trim() === '') return;
        try {
            const data = await createMessage(conversationId, newMessage, token);
            setMessages((prev) => [...prev, data]); // Ajoutez l'objet message complet
            setNewMessage('');
        } catch (e) {
            setError(e.message || 'Erreur lors de l\'envoi du message');
        }
    };

    // Mettre à jour un message existant
    const handleUpdateMessage = async (id, content) => {
        try {
            const data = await updateMessage(id, content, token);
            setMessages((prev) =>
                prev.map((msg) => (msg.id === id ? data : msg)) // Remplacez le message complet
            );
        } catch (e) {
            setError(e.message || 'Erreur lors de la mise à jour du message');
        }
    };

    // Supprimer un message existant
    const handleDeleteMessage = async (id) => {
        if (!window.confirm('Voulez-vous vraiment supprimer ce message ?')) return;
        try {
            await deleteMessage(id, token);
            setMessages((prev) => prev.filter((msg) => msg.id !== id));
        } catch (e) {
            setError(e.message || 'Erreur lors de la suppression du message');
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar
                conversations={conversations}
                onSelect={(id) => navigate(`/messages/${id}`)}
            />
            <div className="flex-1 flex flex-col">
                <header className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
                    <h1 className="text-xl font-semibold text-gray-800">
                        Conversation {conversationId}
                    </h1>
                    <button
                        className="text-blue-600 hover:underline"
                        onClick={() => navigate('/settings')}
                    >
                        Paramètres du compte
                    </button>
                </header>
                <div className="flex-1 overflow-y-auto p-4">
                    {messages.length === 0 ? (
                        <p className="text-gray-600">Aucun message dans cette conversation.</p>
                    ) : (
                        messages.map((msg) => (
                            <MessageItem
                                key={msg.id} // Assurez-vous que msg.id est unique
                                message={msg}
                                currentUserId={user ? user.id : null}
                                onUpdate={handleUpdateMessage}
                                onDelete={handleDeleteMessage}
                            />
                        ))
                    )}
                </div>
                <div className="p-4 bg-white border-t border-gray-200 flex">
                    <input
                        type="text"
                        className="flex-1 border border-gray-300 rounded p-2 mr-2"
                        placeholder="Écrire un message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSendMessage();
                            }
                        }}
                    />
                    <button
                        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                        onClick={handleSendMessage}
                    >
                        Envoyer
                    </button>
                </div>
            </div>
        </div>
    );
}
