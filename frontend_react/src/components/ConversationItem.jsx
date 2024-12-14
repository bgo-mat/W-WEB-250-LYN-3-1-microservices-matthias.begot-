// src/components/ConversationItem.jsx
import { useState } from 'react';
import { FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi';

export default function ConversationItem({
                                             conversation,
                                             onClick,
                                             isMember,
                                             onJoin,
                                             onEdit,
                                             onDelete,
                                             isCreator
                                         }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(conversation.title);

    const handleSave = () => {
        if (editedTitle.trim() !== '') {
            onEdit(conversation._id, editedTitle);
            setIsEditing(false);
        }
    };

    return (
        <div
            className="p-4 border-b border-gray-100 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
            onClick={() => onClick(conversation._id)}
        >
            <div className="flex flex-col">
                {isEditing ? (
                    <input
                        type="text"
                        className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        onClick={(e) => e.stopPropagation()} // Empêche la navigation lors du clic dans le champ
                    />
                ) : (
                    <div className="font-semibold text-gray-900">{conversation.title}</div>
                )}
                <div className="text-sm text-gray-600">
                    {isMember ? 'Membre' : 'Non membre'}
                </div>
            </div>
            <div className="flex items-center space-x-2">
                {!isMember && (
                    <button
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
                        onClick={(e) => {
                            e.stopPropagation(); // Empêche le clic de la conversation
                            onJoin(conversation._id);
                        }}
                        title="Rejoindre"
                    >
                        Rejoindre
                    </button>
                )}
                {isCreator && (
                    <>
                        {isEditing ? (
                            <>
                                <button
                                    className="text-green-500 hover:text-green-700"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Empêche le clic de la conversation
                                        handleSave();
                                    }}
                                    title="Sauvegarder"
                                >
                                    <FiSave />
                                </button>
                                <button
                                    className="text-red-500 hover:text-red-700"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Empêche le clic de la conversation
                                        setIsEditing(false);
                                        setEditedTitle(conversation.title);
                                    }}
                                    title="Annuler"
                                >
                                    <FiX />
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    className="text-blue-500 hover:text-blue-700"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Empêche le clic de la conversation
                                        setIsEditing(true);
                                    }}
                                    title="Éditer"
                                >
                                    <FiEdit2 />
                                </button>
                                <button
                                    className="text-red-500 hover:text-red-700"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Empêche le clic de la conversation
                                        onDelete(conversation._id);
                                    }}
                                    title="Supprimer"
                                >
                                    <FiTrash2 />
                                </button>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
