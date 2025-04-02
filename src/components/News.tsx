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

  const fetchNews = async (query = "") => {
    console.log("fetch")
    if (!nextPageUrl || loading) return;
  
    setLoading(true);
    try {
      const url = query ? `/api/news?search=${query}` : nextPageUrl;
      const response = await fetch(url);
      const data = await response.json();
  
      setNews(query ? data.data : [...new Set([...news, ...data.data])]); 
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

  return (
    <div className="flex flex-col items-center p-6 space-y-6">
      <input
        placeholder="Search news..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-80 border-2 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
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
                <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  Read More
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {loading && <p className="text-gray-500">Loading more news...</p>}
    </div>
  );
}
