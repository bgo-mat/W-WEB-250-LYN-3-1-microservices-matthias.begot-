import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { fetchConversations } from '../services/api';
import ConversationItem from '../components/ConversationItem';
import { useNavigate } from 'react-router-dom';

export default function ConversationsPage() {
    const { token } = useContext(AuthContext);
    const [conversations, setConversations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            navigate('/');
            return;
        }
        //fetchConversations(token).then(data => setConversations(data.conversations));
    }, [token, navigate]);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <header className="p-4 bg-white border-b border-gray-200 flex justify-between items-center">
                <h1 className="text-xl font-semibold text-gray-800">Mes Conversations</h1>
                <button
                    className="text-blue-600 hover:underline"
                    onClick={() => navigate('/settings')}
                >
                    Paramètres du compte
                </button>
            </header>
            <div className="flex-1 overflow-y-auto">

                    <ConversationItem
                        key={1}
                        conversation={"conv"}
                        onClick={()=>navigate(`/messages/${1}`)}
                    />

            </div>
        </div>
    );
}
