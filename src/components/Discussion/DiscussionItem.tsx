import { useUser } from '@/contexts/UserContext';
import { useEffect, useState, useRef } from 'react';
import { MoreVertical } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/id';
dayjs.extend(relativeTime);
dayjs.locale('id');

export default function DiscussionItem({ discussion, onDelete, onEdit }: any) {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(discussion.content);
  const [menuOpen, setMenuOpen] = useState(false);

  const isOwner = user?.id === discussion.author_id;
  const isAdmin = user?.role === 'manajemen';

  const menuRef = useRef<HTMLDivElement>(null);

  const formattedCreated_at = discussion.created_at ? dayjs(discussion.created_at).format('D MMMM YYYY HH:mm') : null;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const handleSave = async () => {
    await onEdit(discussion.id, editContent);
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-2">
      <div className="flex justify-between items-start">
        <p className="text-sm text-gray-500">
          <strong>{discussion.author}</strong> - 
          Dibuat {formattedCreated_at}
          {discussion.updated_at && discussion.updated_at !== discussion.created_at && (
            <> - Diperbarui {dayjs(discussion.updated_at).fromNow()}</>
          )}
        </p>

        {(isOwner || isAdmin) && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 rounded hover:bg-gray-100"
            >
              <MoreVertical className="w-5 h-5" />
              {/* or: <span className="text-xl">⋮</span> */}
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-1 w-32 bg-white border rounded shadow z-10">
                {!isEditing && isOwner && (
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setIsEditing(true);
                      setMenuOpen(false);
                    }}
                  >
                    Edit
                  </button>
                )}
                {!isEditing && (
                  <button
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  onClick={() => {
                    onDelete(discussion.id);
                    setMenuOpen(false);
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      {isEditing ? (
        <textarea
        className="w-full border p-2 rounded"
        value={editContent}
        onChange={(e) => setEditContent(e.target.value)}
        />
      ) : (
        <p>{discussion.content}</p>
      )}
      {isEditing && (
        <div className='text-right space-x-2'>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800"
            onClick={handleSave}
            >
            Save
          </button>
          <button
            className="px-4 py-2 rounded hover:bg-gray-100"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
