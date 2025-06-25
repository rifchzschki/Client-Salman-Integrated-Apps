"use client";

import { useState, useEffect } from "react";
import { SlIcon, SlDialog } from "@/app/shoelace/shoelace-setup";
import { useUser } from "@/contexts/UserContext";

interface Quote{
  id: number,
  content: string,
  created_at: Date,
  updated_at: Date
}

const Quotes = () => {
  const [open, setOpen] = useState(false);
  const [newQuote, setNewQuote] = useState("");
  const {user} = useUser();
  const isAdmin = user && user.role === 'manajemen';
  const [quotes, setQuotes] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    fetchQuotes();
  }, []);

  useEffect(() => {
    if (quotes.length === 0) return;

    const interval = setInterval(() => {
      // Fade out
      setIsVisible(false);
      
      // After fade out, change index and fade in
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % quotes.length);
        setIsVisible(true);
      }, 500); // Match this to your CSS transition duration
    }, 10000);

    return () => clearInterval(interval);
  }, [quotes]);

  const fetchQuotes = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quotes`);
      if (!response.ok) {
        throw new Error("Gagal mengambil quotes");
      }
      const data = await response.json();
      const contents = data.map((item: Quote) => item.content); // asumsi response array of objects
      setQuotes(contents);
    } catch (error) {
      console.error(error);
      setQuotes(["Gagal mengambil quotes."]);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quotes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newQuote,
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal menambahkan quote");
      }

      alert("Quote berhasil ditambahkan!");
      setOpen(false);
      setNewQuote("");
      fetchQuotes(); // Refresh list quotes setelah submit
    } catch (error) {
      console.error(error);
      alert("Gagal menambahkan quote.");
    }
  };

  return (
    <>
      <div className="w-11/12 p-4 pl-6 bg-white rounded-lg flex flex-col">
        <h5 className="text-xl font-bold my-2">Daily Quotes</h5>
        <p 
          className={`
            py-2 min-h-[80px] flex items-center 
            transition-opacity duration-500 
            ${isVisible ? 'opacity-100' : 'opacity-0'}
          `}
        >
          {quotes.length > 0 ? quotes[currentIndex] : "Loading..."}
        </p>
        { isAdmin && (
          <div className="w-full flex justify-end">
            <button
              onClick={() => setOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 cursor-pointer rounded-sm w-10 h-7 flex items-center justify-center"
            >
              <SlIcon name="pencil" label="Edit" className="text-white"></SlIcon>
            </button>
          </div>
        )}
      </div>

      {/* Popup */}
      <SlDialog open={open} onSlAfterHide={() => setOpen(false)}>
        <h2 className="text-lg font-bold mb-2">Tambah Quote</h2>
        <textarea
          className="w-full p-2 border border-gray-300 rounded mb-4"
          rows={4}
          value={newQuote}
          onChange={(e) => setNewQuote(e.target.value)}
          placeholder="Tulis quote di sini..."
        ></textarea>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-amber-400 text-white rounded"
          >
            Submit
          </button>
        </div>
      </SlDialog>
    </>
  );
};

export default Quotes;