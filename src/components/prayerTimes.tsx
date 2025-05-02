"use client";
import { useState, useEffect, JSX } from "react";
import {
  FaSun,
  FaCloudSun,
  FaCloudMoon,
  FaMoon,
  FaCloud,
} from "react-icons/fa";
import "@shoelace-style/shoelace/dist/themes/light.css";
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";
import dynamic from "next/dynamic";

setBasePath(
  "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.0/cdn/"
);
const SlIcon = dynamic(
  () => import("@shoelace-style/shoelace/dist/react/icon/index.js"),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
);
const SlAlert = dynamic(
  () => import("@shoelace-style/shoelace/dist/react/alert/index.js"),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
);

const prayerIcon: {
  name: string;
  nameTimings: keyof PrayerTimes;
  icon: JSX.Element;
}[] = [
  {
    name: "Subuh",
    nameTimings: "Fajr",
    icon: <FaMoon className="text-[#2C3E50] text-2xl" />,
  },
  {
    name: "Dzuhur",
    nameTimings: "Dhuhr",
    icon: <FaSun className="text-[#2C3E50] text-2xl" />,
  },
  {
    name: "Ashar",
    nameTimings: "Asr",
    icon: <FaCloudSun className="text-[#2C3E50] text-2xl" />,
  },
  {
    name: "Maghrib",
    nameTimings: "Maghrib",
    icon: <FaCloud className="text-[#2C3E50] text-2xl" />,
  },
  {
    name: "Isya",
    nameTimings: "Isha",
    icon: <FaCloudMoon className="text-[#2C3E50] text-2xl" />,
  },
];

interface Location {
  latitude: number;
  longitude: number;
}

interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
  Firstthird: string;
  Lastthird: string;
  Sunset: string;
}

export default function PrayerSchedule() {
  const [currentTime, setCurrentTime] = useState("");
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string>("");
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkLocation = () => {
      if (!navigator.geolocation) {
        setError("Geolocation tidak didukung di browser ini.");
        setShowAlert(true);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setLocation(loc);
          setShowAlert(false);
          fetchPrayerTimes(loc);
        },
        (err) => {
          setError("Gagal mendapatkan lokasi: " + err.message);
          setShowAlert(true);
        }
      );
    };
    checkLocation();
    const interval = setInterval(checkLocation, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchPrayerTimes = async (loc: Location) => {
    try {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, "0"); // Format 01-31
      const month = String(now.getMonth() + 1).padStart(2, "0"); // Format 01-12 (karena getMonth() dimulai dari 0)
      const year = now.getFullYear();
      const formattedDate = `${day}-${month}-${year}`;
      // tune 2,2,-5,2,0,5,5,2,0 (bandung) --> setiap daerah punya galat sedikit,kita nyesuain galat ke muslim pro
      const response = await fetch(
        `https://api.aladhan.com/v1/timings/${formattedDate}?latitude=${loc.latitude}&longitude=${loc.longitude}&method=20&shafaq=ahmer&tune=2%2C2%2C-5%2C2%2C0%2C5%2C5%2C2%2C0&calendarMethod=UAQ`
      );
      const result = await response.json();

      if (result.status === "OK") {
        setPrayerTimes(result.data.timings);
      }
    } catch (err) {
      setError("Terjadi kesalahan mengambil data waktu sholat");
    }
  };

  const findTimes = (nameTimings: keyof PrayerTimes) => {
    if (prayerTimes) {
      return prayerTimes?.[nameTimings] || "Loading...";
    }
  };

  return (
    <div className="flex flex-col items-start p-6 rounded-lg bg-white w-11/12 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4 text-[#1A2C4F]">Jadwal Sholat</h1>
      <p className="text-lg text-[#1A2C4F] text-opacity-70 mb-6">
        Waktu Saat Ini: {currentTime}
      </p>
      <div className="flex flex-col w-full">
        {showAlert && (
          <SlAlert variant="warning" open className="w-full m-0 mb-4">
            <SlIcon slot="icon" name="exclamation-triangle" className="text-[#1A2C4F]" />
            <strong className="text-[#1A2C4F]">Lokasi belum diberikan</strong>
            <br />
            <span className="text-[#1A2C4F] text-opacity-80">Mohon berikan izin lokasi untuk melihat jadwal sholat.</span>
          </SlAlert>
        )}
        <div className="flex flex-row items-center justify-between">
          {prayerIcon.map((prayer, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center"
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#A9BDDF] bg-opacity-30 shadow-md">
                {prayer.icon}
              </div>
              <p className="mt-2 text-[#1A2C4F] font-semibold">{prayer.name}</p>
              {!showAlert ? (
                <p className="text-sm text-[#1A2C4F] text-opacity-70">
                  {findTimes(prayer.nameTimings)}
                </p>
              ) : (
                <p className="text-[#1A2C4F]">...</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}