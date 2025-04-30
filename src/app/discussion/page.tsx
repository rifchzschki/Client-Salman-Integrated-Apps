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
import { UserContext } from "@/contexts/UserContext";
import Navbar from "@/components/Navbar";
import PrayerSchedule from "@/components/PrayerTimes";
import VisitorGraph from "@/components/VisitorGraph";
import FinanceInfo from "@/components/FinanceInfo";

export default function DiscussionPage() {
  const [discussions, setDiscussions] = useState([]);
  const user = { id: 1, name: "Alice", role: "user" as "user" }; // mock user

  useEffect(() => {
    getDiscussions().then((res) => setDiscussions(res.data));
  });

  const handlePost = async (content: string) => {
    await postDiscussion(content);
    const updated = await getDiscussions();
    console.log(updated.data);
    if (updated.status === 200) {
      setDiscussions(updated.data);
    }
    else {
      console.error('Failed to post discussion:', updated.error);
    }
  };

  const handleDelete = async (id: number) => {
    await deleteDiscussion(id);
    const updated = await getDiscussions();
    setDiscussions(updated.data);
  };

  const handleEdit = async (discussion: any) => {
    const newContent = prompt("Edit your post", discussion.content);
    if (newContent !== null) {
      await editDiscussion(discussion.id, newContent);
      const updated = await getDiscussions();
      setDiscussions(updated.data);
    }
  };

  return (
    <UserContext.Provider value={{ user }}>
      <main className="flex flex-col w-full p-0 snap-y snap-mandatory overflow-y-scroll bg-cream h-dvh">
        <Navbar />
        <div className="flex flex-1 p-6 gap-6">
          <div className="flex-1 space-y-4 overflow-y-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Discussion Forum
            </h1>
            <DiscussionInput onPost={handlePost} />
            <DiscussionList
              discussions={discussions}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          </div>
          <div className="w-1/3 gap-y-4">
            <div className="h-full flex flex-col gap-y-4">
              <PrayerSchedule />
              <VisitorGraph />
              <FinanceInfo />
            </div>
          </div>
        </div>
      </main>
    </UserContext.Provider>
  );
}
