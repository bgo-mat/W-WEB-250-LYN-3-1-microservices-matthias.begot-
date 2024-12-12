import { useState } from 'react';

export default function MessageItem({ message, currentUserId, onUpdate, onDelete }) {
    const isOwn = (message.user?.id ?? message.user_id) === currentUserId;
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(message.content);

    const handleUpdate = () => {
        if (editContent.trim() !== '') {
            onUpdate(message.id, editContent);
            setIsEditing(false);
        }
    };

    return (
        <div className={`flex mb-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <div className={` p-2 rounded ${isOwn ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'} relative`}>
                {isEditing ? (
                    <div>
            <textarea
                className="w-full p-2 rounded border border-gray-300"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
            />
                        <div className="flex justify-end mt-2">
                            <button
                                className="text-green-600 hover:underline mr-2"
                                onClick={handleUpdate}
                            >
                                Sauvegarder
                            </button>
                            <button
                                className="text-red-600 hover:underline"
                                onClick={() => setIsEditing(false)}
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        {message.content}
                        {isOwn && (
                            <div className=" flex space-x-1 mt-1 mr-1">
                                <button
                                    className="text-sm text-gray-300 hover:text-white"
                                    onClick={() => setIsEditing(true)}
                                    title="Éditer"
                                >
                                    ✏️
                                </button>
                                <button
                                    className="text-sm text-gray-300 hover:text-white"
                                    onClick={() => onDelete(message.id)}
                                    title="Supprimer"
                                >
                                    🗑️
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
