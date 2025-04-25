'use client';
import PrayerSchedule from "../components/prayerTimes";
import AppPortal from "@/components/portalApps";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import VisitorGraph from "@/components/visitorGraph";
import FinanceInfo from "@/components/financeInfo";
import Navbar from "@/components/navbar";
import News from "@/components/News";
import Quotes from "@/components/Quotes";
import ImageCardList from "@/components/imageCardList";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // useEffect(() => {
  //   const token = localStorage.getItem('token');

  //   // if (!token) {
  //   //   router.replace("/login");
  //   //   return;
  //   // }

  //   fetch("http://localhost:8000/api/me", {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   })
  //       .then((res) => {
  //         if (!res.ok) throw new Error("Unauthorized");
  //         return res.json();
  //       })
  //       .then((data) => setUser(data))
  //       .catch(() => router.replace("/login"))
  //       .finally(() => setLoading(false));
  // }, [router]);

  // if (loading) return null;
  return (
    <main className="flex flex-col w-full p-0 m-0 bg-cream snap-y snap-mandatory overflow-y-scroll h-dvh">
      <section className="h-dvh snap-start snap-always">
        <Navbar />
        <div className="flex flex-row p-10">
          <div className="w-3/4 flex flex-col gap-10 justify-around overflow-hidden">
            <div className="w-full flex justify-center">
              <h1 className="text-5xl font-bold text-gray-900">
                Salman{" "}
                <span className="text-[#4B2E2E] font-extrabold">
                  Integrated Apps
                </span>
              </h1>
            </div>
            <div className="flex flex-col items-center justify-center px-10">
              <ImageCardList />
            </div>
            {/* <div className="flex flex-col items-center justify-center">
              <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-6">
                <AppPortal />
              </div>
            </div> */}
          </div>
          <div className="w-1/3">
            <div className="flex flex-col gap-3 items-center justify-between">
              {/* <PrayerSchedule /> */}
              <PrayerSchedule />
              <Quotes />
              {/* <VisitorGraph /> */}
            </div>
          </div>
        </div>
      </section>
      <section className="snap-start snap-always">
        <div className="h-dvh flex flex-row p-10">
          <div className="w-3/4 flex flex-col gap-10">
            <div className="h-full flex flex-col items-center justify-center gap-2">
              <div className="max-w-4xl w-full h-3/11 bg-white shadow-lg rounded-lg p-6">
                <AppPortal />
              </div>
              <div className="max-w-4xl w-full h-8/11 bg-white shadow-lg rounded-lg p-6">
                <News />
              </div>
            </div>
          </div>
          <div className="w-1/3">
            <div className="flex flex-col items-center justify-between h-full gap-3">
              <FinanceInfo />
              <VisitorGraph />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
