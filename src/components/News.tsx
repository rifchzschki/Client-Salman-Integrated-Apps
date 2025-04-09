"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface NewsItem {
  news_id: number;
  title: string;
  author: string[];
  description: string;
  poster: string;
  cover: string;
  link: string;
  created_at: string;
  updated_at: string;
}
export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(
    "http://127.0.0.1:8000/api/news"
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [newNews, setNewNews] = useState({
    title: "",
    author: [""],
    description: "",
    link: "",
    poster: null as File | null,
    cover: null as File | null,
  });

  const currentUserRole = "management";
  // untuk sementara pakai ini dulu sebelum bisa login

  const fetchNews = async (query = "") => {
    console.log("fetch");
    if (!nextPageUrl || loading) return;

    setLoading(true);
    try {
      const url = query ? `/api/news?search=${query}` : nextPageUrl;
      const response = await fetch(url);
      const data = (await response.json());
      console.log(data)
      setNews(query ? data : [...new Set([...news, ...data])]);
      setNextPageUrl(data.next_page_url);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 50 &&
      !loading
    ) {
      fetchNews();
    }
  };

  useEffect(() => {
    fetchNews();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const delayDebounceFn = setTimeout(() => {
        fetchNews(searchTerm);
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchTerm]);

  const handleAddNews = async () => {
    const formData = new FormData();
    formData.append("title", newNews.title);
    newNews.author.forEach((a, i) => formData.append(`author[${i}]`, a));
    formData.append("link", newNews.link);
    formData.append("description", newNews.description);
    if (newNews.poster) formData.append("poster", newNews.poster);
    if (newNews.cover) formData.append("cover", newNews.cover);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/news", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setNews([data.news, ...news]);
        setShowAddPopup(false);
        setNewNews({
          title: "",
          author: [""],
          description: "",
          link: "",
          poster: null,
          cover: null,
        });
      } else {
        alert("Validation failed:\n" + JSON.stringify(data.errors));
      }
    } catch (err) {
      console.error("Error uploading news:", err);
    }
  };

  const handleDeleteNews = async (id: number) => {
    if (!confirm("Are you sure you want to delete this news item?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/news/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setNews(news.filter((n) => n.news_id !== id));
      } else {
        const err = await res.json();
        alert("Delete failed: " + err.message);
      }
    } catch (err) {
      console.error("Error deleting news:", err);
    }
  };

  const openLink = (link : string)=>{
    console.log("clicked")
    window.open(link, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="flex flex-col items-center p-6 space-y-6">
      <div className="flex gap-4 items-center">
        <input
          placeholder="Search news..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-80 border-2 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {currentUserRole === "management" && (
          <button
            onClick={() => setShowAddPopup(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Add News
          </button>
        )}
      </div>
      <div className="w-full flex flex-col gap-3 max-h-[300] overflow-y-auto scroll-snap-align-none">
        {news.map((item) => (
          <motion.div key={item.news_id} whileHover={{ scale: 1.05 }}>
            <div className="w-full flex flex-row items-center justify-between text-center p-4 space-y-4 shadow-lg rounded-m -z-10">
              <img
                src={`http://127.0.0.1:8000/storage/${item.cover}`}
                alt={item.title}
                className="w-1/3 h-auto object-cover rounded-lg"
              />
              <div className=" w-3/5 h-full">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-500">By {item.author}</p>
                <p className="text-gray-700">{item.description}</p>
                  <button onClick={() => openLink(item.link)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  Read More
                </button>
              </div>
              {currentUserRole === "management" && (
                <button
                  onClick={() => handleDeleteNews(item.news_id)}
                  className="ml-auto bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 self-start"
                >
                  Delete
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      {loading && <p className="text-gray-500">Loading more news...</p>}

      {showAddPopup && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md">
            <h2 className="text-lg font-bold mb-4">Add News</h2>
            <label className="block mb-2 font-medium">Judul</label>
            <input
              type="text"
              placeholder="Judul"
              value={newNews.title}
              onChange={(e) =>
                setNewNews({ ...newNews, title: e.target.value })
              }
              className="w-full border p-2 mb-2"
            />

            <label className="block mb-2 font-medium">Authors</label>
            {newNews.author.map((a, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder={`Author ${i + 1}`}
                  value={a}
                  onChange={(e) => {
                    const updated = [...newNews.author];
                    updated[i] = e.target.value;
                    setNewNews({ ...newNews, author: updated });
                  }}
                  className="flex-1 border p-2"
                />
                <button
                  onClick={() => {
                    const updated = newNews.author.filter(
                      (_, index) => index !== i
                    );
                    setNewNews({ ...newNews, author: updated });
                  }}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              className="text-blue-600 text-sm mb-2"
              onClick={(e) => {
                e.preventDefault();
                setNewNews({ ...newNews, author: [...newNews.author, ""] });
              }}
            >
              + Add Author
            </button>

            <label className="block mb-2 font-medium">Link</label>
            <input
              type="text"
              placeholder="Link"
              value={newNews.link}
              onChange={(e) => setNewNews({ ...newNews, link: e.target.value })}
              className="w-full border p-2 mb-2"
            />

            <label className="block mb-2 font-medium">Deskripsi</label>
            <textarea
              placeholder="Deskripsi"
              value={newNews.description}
              onChange={(e) =>
                setNewNews({ ...newNews, description: e.target.value })
              }
              className="w-full border p-2 mb-2"
            />

            <div className="mb-2">
              <label className="block font-medium mb-1">
                Poster (opsional)
              </label>
              <div className="flex items-center gap-3">
                <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer">
                  Choose File
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      setNewNews({
                        ...newNews,
                        poster: e.target.files?.[0] || null,
                      })
                    }
                  />
                </label>
                <span className="text-sm text-gray-700">
                  {newNews.poster ? newNews.poster.name : "No file chosen"}
                </span>
              </div>
            </div>

            <div className="mb-2">
              <label className="block font-medium mb-1">Cover</label>
              <div className="flex items-center gap-3">
                <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer">
                  Choose File
                  <input
                    type="file"
                    accept="image/*"
                    required
                    className="hidden"
                    onChange={(e) =>
                      setNewNews({
                        ...newNews,
                        cover: e.target.files?.[0] || null,
                      })
                    }
                  />
                </label>
                <span className="text-sm text-gray-700">
                  {newNews.cover ? newNews.cover.name : "No file chosen"}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddPopup(false)}
                className="text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNews}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
