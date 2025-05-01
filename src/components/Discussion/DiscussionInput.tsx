import { useState } from 'react';

export default function DiscussionInput({ onPost }: { onPost: (content: string) => void }) {
  const [content, setContent] = useState('');

  const handlePost = () => {
    if (content.trim()) {
      onPost(content);
      setContent('');
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <textarea
        className="w-full p-2 border border-gray-300 rounded"
        placeholder="Ketik diskusi Anda di sini..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="text-right mt-2">
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handlePost}>
          Post
        </button>
      </div>
    </div>
  );
}