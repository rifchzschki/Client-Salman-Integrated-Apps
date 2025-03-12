import Link from "next/link";
import PrayerSchedule from "../components/prayerTimes";
import AppPortal from "@/components/portalApps";

export default function HomePage() {
  return (
    <main className="flex flex-row w-full p-5">
      <section className="w-3/4">
        <div className="flex flex-col items-center justify-center p-6">
          <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-6 border">
            <AppPortal />
          </div>
        </div>
        <div>
          
        </div>
      </section>
      <section className="w-1/4">
        <PrayerSchedule />
      </section>
    </main>
  );
}
