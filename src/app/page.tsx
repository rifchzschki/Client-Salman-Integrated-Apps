"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import News from "@/components/News";
import Quotes from "@/components/Quotes";
import EventList from "@/components/EventList";
import PrayerSchedule from "@/components/PrayerTimes";
import AppPortal from "@/components/PortalApps";
import FinanceInfo from "@/components/FinanceInfo";
import VisitorGraph from "@/components/VisitorGraph";
import Navbar from "@/components/NavBar";
import ProtectedRoute from "@/app/auth/ProtectedRoute";
import Footer from "@/components/Footer";


export default function HomePage() {
  return (
      <ProtectedRoute>
        <main className="flex flex-col w-full p-0 m-0 bg-cream snap-y snap-mandatory overflow-y-scroll h-dvh">
          <section className="h-dvh snap-start snap-always">
            <Navbar />
            <div className="flex flex-row p-10">
              <div className="w-3/4 flex flex-col gap-5 justify-around overflow-hidden h-fit">
                <div className="w-full flex justify-start pl-20">
                  <h1 className="text-5xl font-bold text-gray-900">
                    Salman{" "}
                    <span className="text-[#6B3F1D] font-extrabold">
                  Integrated Apps
                </span>
                  </h1>
                </div>
                <div className="flex flex-col items-center justify-center px-10">
                  <EventList/>
                </div>
              </div>
              <div className="w-1/3">
                <div className="flex flex-col gap-3 items-center justify-between">
                  <PrayerSchedule />
                  <Quotes />
                </div>
              </div>
            </div>
          </section>
          <section className="snap-start snap-always">
            <div className="h-dvh flex flex-row p-10">
              <div className="w-3/4 flex flex-col gap-10">
                <div className="h-full flex flex-col items-center justify-center gap-5">
                  <div className="max-w-4xl w-full h-3/11 bg-white rounded-lg p-6">
                    <AppPortal />
                  </div>
                  <div className="max-w-4xl w-full h-8/11 bg-white rounded-lg p-6">
                    <News />
                  </div>
                </div>
              </div>
              <div className="w-1/3">
                <div className="flex flex-col items-center justify-between h-full gap-y-4">
                  <FinanceInfo />
                  <VisitorGraph />
                </div>
              </div>
            </div>
        </section>
        <section className="h-dvh snap-start snap-always">
          <Footer />
        </section>
      </main>
    </ProtectedRoute>
  );
}
