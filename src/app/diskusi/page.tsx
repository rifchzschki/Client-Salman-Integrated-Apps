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

export default function DiscussionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [discussions, setDiscussions] = useState([]);

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
  }, []);

  const handlePost = async (content: string) => {
    await postDiscussion(content);
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
      <main className="flex flex-col w-full p-0 snap-y snap-mandatory overflow-y-scroll bg-cream h-dvh">
        <Navbar />
        <div className="flex flex-1 p-6 gap-6">
          <div className="flex-1 space-y-4 overflow-y-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Forum Diskusi
            </h1>
            <DiscussionInput onPost={handlePost} />
            <DiscussionList
              discussions={discussions}
              onDelete={handleRequestDelete}
              onEdit={handleEdit}
            />
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
        </div>
        <Footer />
      </main>
    </UserContext.Provider>
  );
}
