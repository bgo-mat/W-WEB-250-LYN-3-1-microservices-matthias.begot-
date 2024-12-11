export default function ConversationItem({ conversation, onClick }) {
    return (
        <div
            onClick={() => onClick(1)}
            className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
        >
            <div className="font-semibold text-gray-900">{"conversation.name"}</div>
            <div className="text-sm text-gray-600">{"conversation.lastMessage"}</div>
        </div>
    );
}
