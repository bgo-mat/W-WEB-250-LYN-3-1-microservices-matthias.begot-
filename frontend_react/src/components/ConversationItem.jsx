// src/components/ConversationItem.jsx
import {useContext, useEffect, useState} from 'react';
import { FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi';
import {AuthContext} from "../context/AuthContext";

export default function ConversationItem({
                                             conversation,
                                             onClick,
                                             members,
                                             onJoin,
                                             onEdit,
                                             onDelete,
                                             creatorId
                                         }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(conversation.title);
    const { token, user } = useContext(AuthContext);
    const [isMember, setIsMember] = useState(false);
    const [isCreator, setIsCreator] = useState(false);
    const [haveRequest, setHaveRequest] = useState(false);

    const handleSave = () => {
        if (editedTitle.trim() !== '') {
            onEdit(conversation._id, editedTitle);
            setIsEditing(false);
        }
    };

    useEffect(() => {
        if (user && members) {
            setIsMember(members.includes(user.id.toString()));
        }
    }, [user, members]);

    useEffect(() => {
        if(creatorId ===  user?.id.toString()){
            setIsCreator(true)
        }
        else {
            setIsCreator(false)
        }

        setHaveRequest(conversation.pending_requests.includes(user?.id.toString()));

    }, [user, creatorId]);

    return (
        <div
            className={`p-4 border-b border-gray-100 flex justify-between rounded-md bg-white items-center hover:bg-gray-50 ${
                isMember ? 'cursor-pointer' : 'cursor-default opacity-90'
            }`}
            onClick={isMember ? () => onClick(conversation._id) : undefined}
            title={isMember ? "Cliquez pour ouvrir la conversation" : "Rejoignez la conversation pour accéder aux messages"}
        >
            <div className="flex flex-col">
                {isEditing ? (
                    <input
                        type="text"
                        className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <div className="font-semibold text-gray-900">{conversation.title}</div>
                )}
                <div className="text-sm text-gray-600">
                    {isMember ? 'Membre' : 'Non membre'}
                </div>
            </div>
            <div className="flex items-center space-x-2">
                {!isMember && !haveRequest && (
                    <button
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            onJoin(conversation._id);
                            setHaveRequest(true)
                        }}
                        title="Rejoindre"
                    >
                        Rejoindre
                    </button>
                )}
                {haveRequest && (
                    <p className="text-yellow-500">Demande en attente</p>
                )}
                {isCreator && (
                    <>
                        {isEditing ? (
                            <>
                                <button
                                    className="text-green-500 hover:text-green-700"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSave();
                                    }}
                                    title="Sauvegarder"
                                >
                                    <FiSave/>
                                </button>
                                <button
                                    className="text-red-500 hover:text-red-700"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsEditing(false);
                                        setEditedTitle(conversation.title);
                                    }}
                                    title="Annuler"
                                >
                                    <FiX/>
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    className="text-blue-500 hover:text-blue-700"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsEditing(true);
                                    }}
                                    title="Éditer"
                                >
                                    <FiEdit2/>
                                </button>
                                <button
                                    className="text-red-500 hover:text-red-700"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(conversation._id);
                                    }}
                                    title="Supprimer"
                                >
                                    <FiTrash2/>
                                </button>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
