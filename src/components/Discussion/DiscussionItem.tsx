import { useUser } from '@/contexts/UserContext';
import { useState } from 'react';

export default function DiscussionItem({ discussion, onDelete, onEdit }: any) {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(discussion.content);
  const isOwner = user?.id === discussion.authorId;
  const isAdmin = user?.role === 'admin';

  const handleSave = async () => {
    await onEdit(discussion.id, editContent);
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-2">
      <p className="text-sm text-gray-500">
        <strong>{discussion.author}</strong> - {discussion.created_at}
      </p>
      
      {isEditing ? (
        <textarea
          className="w-full border p-2 rounded"
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
        />
      ) : (
        <p>{discussion.content}</p>
      )}

      {(isOwner || isAdmin) && (
        <div className="text-right space-x-2">
          {isOwner && !isEditing && (
            <button className="text-blue-500" onClick={() => setIsEditing(true)}>
              Edit
            </button>
          )}
          {isEditing && (
            <>
              <button className="text-green-500" onClick={handleSave}>
                Save
              </button>
              <button className="text-gray-500" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </>
          )}
          {!isEditing && (
            <button className="text-red-500" onClick={() => onDelete(discussion.id)}>
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
