"use client";

import { useEffect, useState } from "react";
import DiscussionInput from "@/components/Discussion/DiscussionInput";
import DiscussionList from "@/components/Discussion/DiscussionList";
import {
  getDiscussions,
  postDiscussion,
  deleteDiscussion,
  editDiscussion,
} from "@/lib/api/discussions";
import PopUp from "@/components/PopUp";
import { useUser } from "@/contexts/UserContext";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import PrayerSchedule from "@/components/PrayerTimes";
import { Discussion } from "@/types/types";

export default function DiscussionPage() {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<number | null>(null);

  const { user } = useUser();
  useEffect(() => {
    if (user) {
      getDiscussions().then((res) => {
        if (res) setDiscussions(res.data);
        setIsLoading(false);
      });
    }
  }, [user]);

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
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />
      <main className="flex-1 flex p-6 gap-6">
        <div className="flex-1 space-y-4 overflow-y-auto pb-5">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Forum Diskusi
          </h1>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800"
            onClick={() => setIsPosting(true)}
          >
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

          { isLoading && (
            <div className="flex items-center justify-center">
              <p className="text-gray-500">Loading...</p>
            </div>
          )}

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
      <Footer />
    </div>
  );
}
