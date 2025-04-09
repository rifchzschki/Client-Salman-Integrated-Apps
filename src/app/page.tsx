import Link from "next/link";
import PrayerSchedule from "../components/prayerTimes";
import AppPortal from "@/components/portalApps";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ImageCarousel from "@/components/imageCarousel";
import VisitorGraph from "@/components/visitorGraph";
import FinanceInfo from "@/components/financeInfo";

export default function HomePage() {
  return (
    <main className="flex flex-row w-full py-12 px-10 bg-cream">
      <section className="w-3/4 flex-grow flex flex-col space-y-10">
        <div className="flex flex-col max-h-dvh h-1/2 items-center justify-center ">
          <ImageCarousel />
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-6">
            <AppPortal />
          </div>
        </div>
      </section>
      <section className="w-1/3 flex flex-col space-y-6">
        <PrayerSchedule />
        <VisitorGraph />
        <FinanceInfo />
      </section>
    </main>
  );
}
