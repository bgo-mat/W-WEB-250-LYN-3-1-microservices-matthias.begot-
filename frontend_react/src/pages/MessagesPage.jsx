// src/pages/MessagesPage.jsx
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
    getMessages,
    createMessage,
    updateMessage,
    deleteMessage,
    getConversationDetails,
    acceptJoin, getUserById,
} from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import MessageItem from '../components/MessageItem';
import ConversationsPage from "./ConversationsPage";

export default function MessagesPage() {
    const { token, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const { conversationId } = useParams();
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [conversation, setConversation] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [error, setError] = useState(null);
    const [isCreator, setIsCreator] = useState(false);
    const [pendingUsers, setPendingUsers] = useState([]);

    useEffect(() => {
        if (!token) {
            navigate('/');
        }
    }, [token, navigate]);


    useEffect(() => {
        if (token && conversationId) {
            getConversationDetails(conversationId, token)
                .then((data) => {setConversations(data);
                if(data.user_id === user?.id.toString()){
                    setIsCreator(true)
                }
                else{
                    setIsCreator(false)
                }

                    if (data.pending_requests.length > 0 && Array.isArray(data.pending_requests)) {
                        fetchPendingUsers(data.pending_requests);
                    } else {
                        setPendingUsers([]);
                    }
                })
                .catch((err) => setError(err.message));
        }
    }, [token, conversationId, user]);

    const fetchPendingUsers = async (pendingRequestIds) => {
        try {
            const userPromises = pendingRequestIds.map((id) => getUserById(id, token));
            const users = await Promise.all(userPromises);
            console.log(users)
            setPendingUsers(users);
        } catch (err) {
            console.error('Erreur lors de la récupération des utilisateurs en attente:', err);
            setError('Erreur lors de la récupération des utilisateurs en attente.');
        }
    };

    useEffect(() => {
        if (token && conversationId) {
            getMessages(conversationId, token)
                .then((data) => {
                    setMessages(data);
                })
                .catch((err) => setError(err.message));
        }
    }, [token, conversationId]);

    const handleSendMessage = async () => {
        if (newMessage.trim() === '') return;
        try {
            const data = await createMessage(conversationId, newMessage, token);
            setMessages((prev) => [...prev, data]);
            setNewMessage('');
        } catch (e) {
            setError(e.message || 'Erreur lors de l\'envoi du message');
        }
    };

    const handleUpdateMessage = async (id, content) => {
        try {
            const data = await updateMessage(id, content, token);
            setMessages((prev) =>
                prev.map((msg) => (msg.id === id ? data : msg))
            );
        } catch (e) {
            setError(e.message || 'Erreur lors de la mise à jour du message');
        }
    };

    const handleDeleteMessage = async (id) => {
        if (!window.confirm('Voulez-vous vraiment supprimer ce message ?')) return;
        try {
            await deleteMessage(id, token);
            setMessages((prev) => prev.filter((msg) => msg.id !== id));
        } catch (e) {
            setError(e.message || 'Erreur lors de la suppression du message');
        }
    };

    const handleAcceptJoin = async (userId, decision) => {
        try {
            await acceptJoin(conversationId, userId, decision, token);
            setPendingUsers((prev) => prev.filter((user) => user.id !== userId));
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <ConversationsPage></ConversationsPage>
            <div className="flex-1 flex flex-col">
                <header className="p-6  flex items-center justify-end">
                    <h1 className="text-2xl font-semibold text-gray-800 border-b-2 border-gray-900">
                        Conversation {conversation?.title}
                    </h1>
                </header>
                <div className="flex-1 overflow-y-auto p-6">
                    {isCreator && pendingUsers.length > 0 && (
                        <div className="space-y-2 mb-6 flex justify-center">
                            {pendingUsers.map((pendingUser) => (
                                <div key={pendingUser.id} className="p-4 w-fit border border-yellow-400 rounded flex items-center gap-2 justify-center">
                                    <p className="text-yellow-800">
                                        {pendingUser.name} souhaite rejoindre la discussion.
                                    </p>
                                    <div className="mt-2 space-x-2">
                                        <button
                                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                            onClick={() => handleAcceptJoin(pendingUser.id, true)}
                                        >
                                            Accepter
                                        </button>
                                        <button
                                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                            onClick={() => handleAcceptJoin(pendingUser.id, false)}
                                        >
                                            Rejeter
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {messages.length === 0 ? (
                        <p className="text-gray-500 text-center mt-10">Aucun message dans cette conversation.</p>
                    ) : (
                        messages.map((msg) => (
                            <MessageItem
                                key={msg.id}
                                message={msg}
                                currentUserId={user ? user?.id : null}
                                onUpdate={handleUpdateMessage}
                                onDelete={handleDeleteMessage}
                                onAcceptJoin={handleAcceptJoin}
                                isCreator={isCreator}
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
