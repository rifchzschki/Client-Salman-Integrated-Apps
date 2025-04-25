import { useUser } from '@/contexts/UserContext';

export default function DiscussionItem({ discussion, onDelete, onEdit }: any) {
  const { user } = useUser();
  const isOwner = user?.id === discussion.authorId;
  const isAdmin = user?.role === 'admin';

  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-2">
      <p className="text-sm text-gray-500">
        <strong>{discussion.author}</strong> - {discussion.timestamp}
      </p>
      <p>{discussion.content}</p>

      {(isOwner || isAdmin) && (
        <div className="text-right space-x-2">
          {isOwner && (
            <button className="text-blue-500" onClick={() => onEdit(discussion)}>Edit</button>
          )}
          <button className="text-red-500" onClick={() => onDelete(discussion.id)}>Delete</button>
        </div>
      )}
    </div>
  );
}
