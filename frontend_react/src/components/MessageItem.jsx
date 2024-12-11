export default function MessageItem({ message, currentUserId }) {
    const isOwn = 1 === currentUserId;
    return (
        <div className={`flex mb-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs p-2 rounded ${isOwn ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'}`}>
                {"message.text"}
            </div>
        </div>
    );
}
