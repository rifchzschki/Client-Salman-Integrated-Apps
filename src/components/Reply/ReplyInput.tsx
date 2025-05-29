import { useState } from "react";
import { postReply } from "@/lib/api/discussions";

export default function ReplyInput({
  onReply,
}: {
  onReply: (content: string) => void;
}) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setLoading(true);
    onReply(content);
    setContent("");
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-2 bg-white p-4 rounded-xl shadow">
      <textarea
        className="border rounded-md p-2 w-full"
        rows={3}
        placeholder="Tulis balasan..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="text-right space-x-2">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="self-end bg-teal-600 text-white px-4 py-1 rounded hover:bg-teal-700 disabled:opacity-50"
        >
          {loading ? "Mengirim..." : "Balas"}
        </button>
        <button
        className="self-end text-gray-500 hover:text-gray-700"
        onClick={() => {
          setContent("");
          onReply(""); // Clear the reply input
        }}>
          Batal
        </button>
      </div>
    </div>
  );
}
