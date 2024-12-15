import {useEffect, useState} from 'react';
import { FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi';

export default function MessageItem({ message, currentUserId, onUpdate, onDelete, onAcceptJoin, isCreator }) {
    const isOwn = (message.user?.id ?? message.user_id) === currentUserId;
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(message.content);
    const isJoinRequest = message.content.endsWith('a demandé à rejoindre la conversation.');

    const handleUpdate = () => {
        if (editContent.trim() !== '') {
            onUpdate(message.id, editContent);
            setIsEditing(false);
        }
    };

    return (
        <div className={`flex mb-4 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <div>
                <p className={`text-xs text-gray-500 ${isOwn ? 'text-end' : 'text-start'}`}>
                    {isOwn ? "Moi" : (message.user?.name || 'Système')}
                </p>
                {isEditing ? (
                    <div className={`w-auto p-3 rounded-lg shadow ${
                        isOwn ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-900'
                    }`}>
                        <textarea
                            className="w-full p-2 rounded bg-blue-400 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                        />
                        <div className="flex justify-end mt-2 space-x-2">
                            <button
                                className="flex items-center text-green-500 hover:text-green-700 transition-colors"
                                onClick={handleUpdate}
                                title="Sauvegarder"
                            >
                                <FiSave className="mr-1" /> Sauvegarder
                            </button>
                            <button
                                className="flex items-center text-red-500 hover:text-red-700 transition-colors"
                                onClick={() => setIsEditing(false)}
                                title="Annuler"
                            >
                                <FiX className="mr-1" /> Annuler
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={`w-auto p-3 gap-2 flex rounded-lg shadow ${
                        isOwn ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-900'
                    }`}>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        {isOwn && !isJoinRequest && (
                            <div className="flex space-x-2">
                                <button
                                    className="text-yellow-200 hover:text-gray-600 transition-colors"
                                    onClick={() => setIsEditing(true)}
                                    title="Éditer"
                                >
                                    <FiEdit2 />
                                </button>
                                <button
                                    className="text-red-500 hover:text-gray-600 transition-colors"
                                    onClick={() => onDelete(message.id)}
                                    title="Supprimer"
                                >
                                    <FiTrash2 />
                                </button>
                            </div>
                        )}
                        {isJoinRequest && isCreator && (
                            <div className="mt-2 flex space-x-2">
                                <button
                                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                    onClick={() => onAcceptJoin(message.user?.id || message.user_id, true)}
                                >
                                    Accepter
                                </button>
                                <button
                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                    onClick={() => onAcceptJoin(message.user?.id || message.user_id, false)}
                                >
                                    Rejeter
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
