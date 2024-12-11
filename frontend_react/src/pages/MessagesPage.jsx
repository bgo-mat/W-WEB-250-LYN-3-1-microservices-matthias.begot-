import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { fetchConversations, fetchMessages } from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import MessageItem from '../components/MessageItem';

export default function MessagesPage() {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const { conversationId } = useParams();
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const currentUserId = 'me';

    useEffect(() => {
        if (token) {
            navigate('/');
            return;
        }
        //fetchConversations(token).then(data => setConversations(data.conversations));
    }, [token, navigate]);

    useEffect(() => {
        if (token && conversationId) {
            fetchMessages(token, conversationId).then(data => setMessages(data.messages));
        }
    }, [token, conversationId]);

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar conversations={conversations} onSelect={() => navigate(`/messages/${1}`)} />
            <div className="flex-1 flex flex-col">
                <header className="p-4 bg-white border-b border-gray-200 flex items-center">
                    <h1 className="text-xl font-semibold text-gray-800 flex-1">Conversation {conversationId}</h1>
                </header>
                <div className="flex-1 overflow-y-auto p-4">

                        <MessageItem key={1} message={"msg"} currentUserId={currentUserId} />

                </div>
            </div>
        </div>
    );
}
