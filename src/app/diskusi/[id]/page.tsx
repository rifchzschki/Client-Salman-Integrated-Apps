"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { getDiscussionDetail, postReply } from "@/lib/api/discussions";
import ReplyInput from "@/components/Reply/ReplyInput";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import MainDiscussion from "@/components/Reply/mainDiscussion";
import PrayerSchedule from "@/components/PrayerTimes";
import ReplyList from "@/components/Reply/replyList";

export default function DiscussionDetailPage() {
  const router = useRouter();
  const [, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const numericId = parseInt(id as string, 10);
  const [discussion, setDiscussion] = useState(null);
  const [replies, setReplies] = useState([]);
  const [isReplying, setIsReplying] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    if (!id) return;

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
      return getDiscussionDetail(numericId);
    })
    .then((res) => {
      if (res.status === 200) {
        setDiscussion(res.data.discussion);
        setReplies(res.data.replies);
      }
    })
    .catch(() => router.replace("/login"))
    .finally(() => setLoading(false));
  }, [id, numericId, router]);

  const handleReply = async (content: string) => {
    await postReply(numericId, content);
    const updated = await getDiscussionDetail(numericId);
    if (updated.status === 200) {
      setReplies(updated.data.replies);
    } else {
      console.error('Failed to post reply:', updated.error);
    }
  }

  return (
    <div className="flex flex-col bg-cream">
      <Navbar />
      <main className="min-h-screen flex-1 flex p-6 gap-6">
        {loading ? (
          <div className="flex-1 p-6 space-y-4 overflow-y-auto pb-5">
            <div className="flex items-center justify-center">
              <p className="text-gray-500">Loading...</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 p-6 space-y-4 overflow-y-auto pb-5">
            {discussion!=null && (
              <MainDiscussion 
                discussion={discussion} 
                onReplying={() => setIsReplying(true)}
              />
            )}

            {isReplying && (
              <ReplyInput onReply={(content) => {
                handleReply(content);
                setIsReplying(false);
              }} />
            )}

            <h3 className="text-lg font-semibold mt-6">Balasan</h3>

            {replies.length === 0 ? (
              <p>Belum ada balasan.</p>
            ) : (
              <ReplyList replies={replies} />
            )}
          </div>
        )}
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
