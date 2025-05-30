"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DiscussionInput from "@/components/Discussion/DiscussionInput";
import DiscussionList from "@/components/Discussion/DiscussionList";
import {
  getDiscussions,
  postDiscussion,
  deleteDiscussion,
  editDiscussion,
} from "@/lib/api/discussions";
import PopUp from "@/components/PopUp";
import { UserContext } from "@/contexts/UserContext";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import PrayerSchedule from "@/components/PrayerTimes";
import { Discussion } from "@/types/types";

export default function DiscussionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [isPosting, setIsPosting] = useState(false);


  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((res) => {
        setUser(res.data);
        return getDiscussions();
      })
      .then((res) => {
        if (res) setDiscussions(res.data);
      })
      .catch(() => router.replace("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const handlePost = async (title: string, content: string) => {
    await postDiscussion(title, content);
    const updated = await getDiscussions();
    if (updated.status === 200) {
      setDiscussions(updated.data);
    } else {
      console.error("Failed to post discussion:", updated.error);
    }
  };

  const handleRequestDelete = (id: number) => {
    setToDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (toDeleteId !== null) {
      await deleteDiscussion(toDeleteId);
      const updated = await getDiscussions();
      setDiscussions(updated.data);
    }
    setConfirmOpen(false);
    setToDeleteId(null);
  };

  const handleEdit = async (id: number, newContent: string) => {
    await editDiscussion(id, newContent);
    const updated = await getDiscussions();
    setDiscussions(updated.data);
  };

  return (
    <UserContext.Provider value={{ user }}>
      <div className="min-h-screen flex flex-col bg-cream">
        <Navbar />
        <main className="flex-1 flex p-6 gap-6">
          <div className="flex-1 space-y-4 overflow-y-auto pb-5">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Forum Diskusi
            </h1>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800" onClick={() => setIsPosting(true)}>
              Diskusi Baru
            </button>
            {isPosting && (
              <DiscussionInput
                onPost={(title, content) => {
                  handlePost(title, content);
                  setIsPosting(false);
                }}
              />
            )}
            {loading ? (
              <div className="flex items-center justify-center">
                <p className="text-gray-500">Loading...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {discussions.length === 0 ? (
                  <p className="text-gray-500">Belum ada diskusi.</p>
                ) : (
                  <DiscussionList
                    discussions={discussions}
                    onDelete={handleRequestDelete}
                    onEdit={handleEdit}
                  />
                )}
              </div>
            )}
            <PopUp
              isOpen={confirmOpen}
              onConfirm={handleConfirmDelete}
              onCancel={() => setConfirmOpen(false)}
              message="Apakah Anda yakin ingin menghapus diskusi ini?"
            />
          </div>
          <div className="w-1/3 gap-y-4">
            <div className="h-full flex flex-col gap-y-4">
              <PrayerSchedule />
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </UserContext.Provider>
  );
}
