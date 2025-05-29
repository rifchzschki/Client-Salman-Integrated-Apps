import { useState } from 'react';

export default function DiscussionInput({ onPost }: { onPost: (title: string, content: string) => void }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      setLoading(true);
      onPost(title, content);
      setTitle('');
      setContent('');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePost} className="bg-white p-4 rounded-xl shadow">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Judul diskusi"
        className="w-full border rounded p-2 mb-2"
        required
      />
      <textarea
        className="w-full p-2 border border-gray-300 rounded"
        placeholder="Ketik diskusi Anda di sini..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <div className="text-right mt-2 space-x-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800">
          {loading ? "Mengirim..." : "Post Diskusi"}
        </button>
        <button
          className="self-end text-gray-500 hover:text-gray-700"
          onClick={() => {
            setContent("");
            onPost("", ""); // Clear the reply input
          }}>
          Batal
        </button>
      </div>
    </form>
  );
}