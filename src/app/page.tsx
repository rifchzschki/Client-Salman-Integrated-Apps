import PrayerSchedule from "../components/prayerTimes";
import AppPortal from "@/components/portalApps";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ImageCarousel from "@/components/imageCarousel";
import VisitorGraph from "@/components/visitorGraph";
import Navbar from "@/components/navbar";
import News from "@/components/News";
import Quotes from "@/components/Quotes";

export default function HomePage() {
  return (
    <main className="flex flex-col w-full p-0 m-0 bg-cream snap-y snap-mandatory overflow-y-scroll h-dvh">
      <section className="h-dvh snap-start snap-always">
        <Navbar />
        <div className="flex flex-row p-10">
          <div className="w-3/4 flex flex-col gap-10">
            <div className="flex flex-col h-1/2 items-center justify-center">
              <ImageCarousel />
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
                <News/>
              </div>
            </div>
          </div>
          <div className="w-1/3">
            <div className="flex flex-col items-center justify-between h-full">
              <PrayerSchedule />
              <VisitorGraph />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
