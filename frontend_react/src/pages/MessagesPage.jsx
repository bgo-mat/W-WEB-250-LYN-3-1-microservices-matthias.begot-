// src/pages/MessagesPage.jsx
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
    getMessages,
    createMessage,
    updateMessage,
    deleteMessage,
    getConversationDetails,
    acceptJoin, getDiscussion,
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
    const [conversation, setConversation] = useState(null); // Détails de la conversation
    const [newMessage, setNewMessage] = useState('');
    const [error, setError] = useState(null);

    // Récupérer les conversations
    useEffect(() => {
        if (!token) {
            navigate('/');
            return;
        }

        getDiscussion(token)
            .then((data) => setConversations(data.conversations))
            .catch((err) => setError(err.message));
    }, [token, navigate]);

    // Récupérer les détails de la conversation
    useEffect(() => {
        if (token && conversationId) {
            getConversationDetails(conversationId, token)
                .then((data) => setConversation(data))
                .catch((err) => setError(err.message));
        }
    }, [token, conversationId]);

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
            setMessages((prev) => [...prev, data.message]); // Ajoutez l'objet message complet
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
                prev.map((msg) => (msg.id === id ? data.message : msg)) // Remplacez le message complet
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

    // Accepter ou rejeter une demande de rejoindre
    const handleAcceptJoin = async (userId, decision) => {
        try {
            await acceptJoin(conversationId, userId, decision, token);
            // Trouver le message de demande de rejoindre pour obtenir le nom de l'utilisateur
            const joinRequestMessage = messages.find(msg =>
                (msg.user_id === userId || msg.user?.id === userId) &&
                msg.content.endsWith('a demandé à rejoindre la conversation.')
            );
            const userName = joinRequestMessage ? (joinRequestMessage.user?.name || 'Un utilisateur') : 'Un utilisateur';

            // Créer un message système indiquant la décision
            const systemMessageContent = decision
                ? `${userName} a rejoint la conversation.`
                : `La demande de rejoindre de ${userName} a été rejetée.`;

            await createMessage(conversationId, systemMessageContent, token);

            // Rafraîchir les messages
            const updatedMessages = await getMessages(conversationId, token);
            setMessages(updatedMessages);

            // Mettre à jour les membres de la conversation si accepté
            if (decision && conversation) {
                setConversation(prev => ({
                    ...prev,
                    members: [...prev.members, userId],
                }));
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar
                conversations={conversations}
                onSelect={(id) => navigate(`/messages/${id}`)}
            />
            <div className="flex-1 flex flex-col">
                <header className="p-6 bg-white shadow-md flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Conversation {conversationId}
                    </h1>
                    <button
                        className="text-blue-500 hover:text-blue-700 transition-colors flex items-center"
                        onClick={() => navigate('/settings')}
                    >
                        Paramètres du compte
                    </button>
                </header>
                <div className="flex-1 overflow-y-auto p-6">
                    {error && (
                        <div className="mb-4 text-red-600 text-center">{error}</div>
                    )}
                    {messages.length === 0 ? (
                        <p className="text-gray-500 text-center mt-10">Aucun message dans cette conversation.</p>
                    ) : (
                        messages.map((msg) => (
                            <MessageItem
                                key={msg.id}
                                message={msg}
                                currentUserId={user ? user.id : null}
                                onUpdate={handleUpdateMessage}
                                onDelete={handleDeleteMessage}
                                onAcceptJoin={handleAcceptJoin}
                                isCreator={conversation ? conversation.creator_id === user.id : false}
                            />
                        ))
                    )}
                </div>
                <div className="p-6 bg-white shadow-inner flex items-center">
                    <input
                        type="text"
                        className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
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
                        className="ml-4 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        title="Envoyer"
                    >
                        Envoyer
                    </button>
                </div>
            </div>
        </div>
    );
}
