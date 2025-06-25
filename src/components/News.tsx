"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import RoleGuard from "@/app/auth/RoleGuard";
import Image from "next/image";
import { useUser } from "@/contexts/UserContext";
import { SlIcon } from "@/app/shoelace/shoelace-setup";

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
  const { user } = useUser();
  const isAdmin = user && user.role === "manajemen";
  const [news, setNews] = useState<NewsItem[]>([]);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(
    `${process.env.NEXT_PUBLIC_API_URL}/news`
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editingNewsId, setEditingNewsId] = useState<number | null>(null);
  const [newNews, setNewNews] = useState({
    title: "",
    author: [""],
    description: "",
    link: "",
    poster: null as File | null,
    cover: null as File | null,
  });
  const [editNews, setEditNews] = useState({
    title: "",
    author: [""],
    description: "",
    link: "",
    poster: null as File | null,
    cover: null as File | null,
  });

  const currentUserRole = isAdmin;
  console.log("isAdmin ", user);

  const fetchNews = useCallback(
    async (query = "") => {
      console.log("fetch");
      if (!nextPageUrl || loading) return;

      setLoading(true);
      try {
        const url = query ? `/api/news?search=${query}` : nextPageUrl;
        const response = await fetch(url);
        const data = await response.json();
        data.map((news: NewsItem) => {
          if (typeof news.author === "string") {
            try {
              news.author = JSON.parse(news.author);
            } catch {
              // Kalau gagal parse, biarkan tetap string saja atau kasih default array kosong
              news.author = [];
            }
          }
        });
        console.log(data);
        setNews((prevNews) => {
          if (query) return data;
          const existingIds = new Set(prevNews.map((item) => item.news_id));
          const newItems = data.filter(
            (item: NewsItem) => !existingIds.has(item.news_id)
          );
          return [...prevNews, ...newItems];
        });
        console.log("after setnews", news);
        setNextPageUrl(data.next_page_url);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    },
    [nextPageUrl, loading, news]
  );

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 50 &&
      !loading
    ) {
      fetchNews();
    }
  }, [fetchNews, loading]);

  useEffect(() => {
    fetchNews();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchNews, handleScroll]);

  useEffect(() => {
    if (searchTerm) {
      const delayDebounceFn = setTimeout(() => {
        fetchNews(searchTerm);
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchTerm, fetchNews]);

  const handleAddNews = async () => {
    const formData = new FormData();
    formData.append("title", newNews.title);
    newNews.author.forEach((a, i) => formData.append(`author[${i}]`, a));
    formData.append("link", newNews.link);
    formData.append("description", newNews.description);
    if (newNews.poster) formData.append("poster", newNews.poster);
    if (newNews.cover) formData.append("cover", newNews.cover);

    console.log(newNews);
    console.log(formData.get("author"));
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log(data);
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/${id}`, {
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

  const openLink = (link: string) => {
    console.log("clicked");
    window.open(link, "_blank", "noopener,noreferrer");
  };

  const handleEditClick = (item: NewsItem) => {
    setEditingNewsId(item.news_id);
    setEditNews({
      title: item.title,
      author: Array.isArray(item.author) ? item.author : [item.author],
      description: item.description || "",
      link: item.link,
      poster: null,
      cover: null,
    });
    setShowEditPopup(true);
  };

  const formatAuthor = (authors: string[]) => {
    let formatAuthors = "";
    authors.forEach((author: string, index) => {
      if (index === 0) {
        formatAuthors += author;
      } else {
        formatAuthors += " & " + author;
      }
    });
    return formatAuthors;
    // return typeof authors;
  };

  const handleSaveEdit = async () => {
    // Simple client-side update without backend calls
    setNews(
      news.map((item) => {
        if (item.news_id === editingNewsId) {
          return {
            ...item,
            title: editNews.title,
            author: editNews.author,
            description: editNews.description,
            link: editNews.link,
          };
        }
        return item;
      })
    );

    const formData = new FormData();
    formData.append("title", editNews.title);
    formData.append("link", editNews.link);
    formData.append("description", editNews.description);

    // Properly append author as JSON string
    editNews.author.forEach((a, i) => formData.append(`author[${i}]`, a));
    // formData.append("author", JSON.stringify(editNews.author));

    if (editNews.poster) formData.append("poster", editNews.poster);
    if (editNews.cover) formData.append("cover", editNews.cover);

    try {
      // Better logging of FormData contents
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/news/${editingNewsId}`,
        {
          method: "POST",
          body: formData,
          headers: {
            "X-HTTP-Method-Override": "PATCH",
          },
        }
      );

      // Log full response details
      console.log("Full response:", res);
      console.log("Status:", res.status);
      console.log("Headers:", Object.fromEntries(res.headers.entries()));

      const responseText = await res.text();
      console.log("Response text:", responseText);
    } catch (err) {
      console.error("Error updating news:", err);
    }

    setShowEditPopup(false);
    setEditingNewsId(null);
  };

  console.log(news);

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex gap-4 items-center justify-start">
        <input
          placeholder="Search news..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-80 border-2 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <RoleGuard allowedRoles={["manajemen"]}>
          <button
            onClick={() => setShowAddPopup(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + Tambah Berita
          </button>
        </RoleGuard>
      </div>
      <div className="w-full flex flex-col gap-3 max-h-[300px] overflow-x-auto scroll-smooth">
        {news.map((item) => {
          // console.log(typeof item.author, "test");
          return (
            <motion.div key={item.news_id} whileHover={{ scale: 1.05 }}>
              <div className="w-full flex flex-row items-center justify-between text-center p-4 space-y-4 shadow-lg rounded-m -z-10 ">
                <Image
                  src={item.cover}
                  alt={item.title}
                  width={200}
                  height={200}
                  className="object-cover rounded-lg "
                  unoptimized
                />
                <div className="w-3/4 h-full flex flex-col items-center ">
                  <div className="flex flex-col justify-start items-start">
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-500">
                      By {formatAuthor(item.author)}
                    </p>
                    <p className="text-gray-700">{item.description}</p>
                    <a href={item.link} className="text-blue-500 underline">
                      Read More
                    </a>
                    {/* <button
                    onClick={() => openLink(item.link)}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Read More
                    </button> */}
                  </div>
                </div>
                {currentUserRole && (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleDeleteNews(item.news_id)}
                      className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 self-start"
                    >
                      <SlIcon
                        name="trash"
                        label="delete"
                        className="text-white"
                      ></SlIcon>
                    </button>
                    <button
                      onClick={() => handleEditClick(item)}
                      className="bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 self-start"
                    >
                      <SlIcon
                        name="pencil"
                        label="Edit"
                        className="text-white"
                      ></SlIcon>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
      {loading && <p className="text-gray-500">Loading more news...</p>}

      {/* Add News Popup */}
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

      {/* Edit News Popup */}
      {showEditPopup && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md">
            <h2 className="text-lg font-bold mb-4">Edit News</h2>
            <label className="block mb-2 font-medium">Judul</label>
            <input
              type="text"
              placeholder="Judul"
              value={editNews.title}
              onChange={(e) =>
                setEditNews({ ...editNews, title: e.target.value })
              }
              className="w-full border p-2 mb-2"
            />

            <label className="block mb-2 font-medium">Authors</label>
            {editNews.author.map((a, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder={`Author ${i + 1}`}
                  value={a}
                  onChange={(e) => {
                    const updated = [...editNews.author];
                    updated[i] = e.target.value;
                    setEditNews({ ...editNews, author: updated });
                  }}
                  className="flex-1 border p-2"
                />
                <button
                  onClick={() => {
                    const updated = editNews.author.filter(
                      (_, index) => index !== i
                    );
                    setEditNews({ ...editNews, author: updated });
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
                setEditNews({ ...editNews, author: [...editNews.author, ""] });
              }}
            >
              + Add Author
            </button>

            <label className="block mb-2 font-medium">Link</label>
            <input
              type="text"
              placeholder="Link"
              value={editNews.link}
              onChange={(e) =>
                setEditNews({ ...editNews, link: e.target.value })
              }
              className="w-full border p-2 mb-2"
            />

            <label className="block mb-2 font-medium">Deskripsi</label>
            <textarea
              placeholder="Deskripsi"
              value={editNews.description}
              onChange={(e) =>
                setEditNews({ ...editNews, description: e.target.value })
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
                      setEditNews({
                        ...editNews,
                        poster: e.target.files?.[0] || null,
                      })
                    }
                  />
                </label>
                <span className="text-sm text-gray-700">
                  {editNews.poster
                    ? editNews.poster.name
                    : "Keep current poster"}
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
                    className="hidden"
                    onChange={(e) =>
                      setEditNews({
                        ...editNews,
                        cover: e.target.files?.[0] || null,
                      })
                    }
                  />
                </label>
                <span className="text-sm text-gray-700">
                  {editNews.cover ? editNews.cover.name : "Keep current cover"}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowEditPopup(false)}
                className="text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
