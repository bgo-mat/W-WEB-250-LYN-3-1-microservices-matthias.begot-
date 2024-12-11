import ConversationItem from './ConversationItem';

export default function Sidebar({ conversations, onSelect }) {
    return (
        <div className="w-64 border-r border-gray-200 bg-white overflow-y-auto">
                <ConversationItem key={1} conversation={"conv"} onClick={onSelect} />
        </div>
    );
}
