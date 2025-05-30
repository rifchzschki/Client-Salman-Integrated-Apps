import { Reply } from '@/types/types';

interface ReplyItemProps {
    reply: Reply;
}

export default function ReplyItem({ reply }: ReplyItemProps) {
    const formattedCreatedAt = reply.created_at ? new Date(reply.created_at).toLocaleString() : null;

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-700 mb-2">{reply.content}</p>
            <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Posted by {reply.author} on {formattedCreatedAt}</span>
            </div>
        </div>
    );
}