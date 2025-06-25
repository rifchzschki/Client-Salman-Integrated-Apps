"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getDiscussionDetail, postReply } from "@/lib/api/discussions";
import ReplyInput from "@/components/Reply/ReplyInput";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import MainDiscussion from "@/components/Reply/mainDiscussion";
import PrayerSchedule from "@/components/PrayerTimes";
import ReplyList from "@/components/Reply/replyList";
import { useUser } from "@/contexts/UserContext";
import { Discussion, Reply } from "@/types/types";

export default function DiscussionDetailPage() {
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const numericId = parseInt(id as string, 10);
  const [discussion, setDiscussion] = useState<Discussion|null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [isReplying, setIsReplying] = useState(false);
  const {user} = useUser();

  useEffect(()=>{
    if(user){
      getDiscussionDetail(numericId).then((res)=>{
        setDiscussion(res.data.discussion as Discussion);
        setReplies(res.data.replies as Reply[]);
        setLoading(false);
      })
    }
  },[numericId, user])

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
