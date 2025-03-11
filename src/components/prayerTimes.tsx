"use client";
import { useState, useEffect, JSX } from "react";
import {
  FaSun,
  FaCloudSun,
  FaCloudMoon,
  FaMoon,
  FaCloud,
} from "react-icons/fa";

const prayerIcon: {
  name: string;
  nameTimings: keyof PrayerTimes;
  icon: JSX.Element;
}[] = [
  {
    name: "Subuh",
    nameTimings: "Fajr",
    icon: <FaMoon className="text-blue-500" />,
  },
  {
    name: "Dzuhur",
    nameTimings: "Dhuhr",
    icon: <FaSun className="text-yellow-500" />,
  },
  {
    name: "Ashar",
    nameTimings: "Asr",
    icon: <FaCloudSun className="text-orange-500" />,
  },
  {
    name: "Maghrib",
    nameTimings: "Maghrib",
    icon: <FaCloud className="text-red-500" />,
  },
  {
    name: "Isya",
    nameTimings: "Isha",
    icon: <FaCloudMoon className="text-indigo-500" />,
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

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation tidak didukung di browser ini.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc: Location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocation(loc);
        fetchPrayerTimes(loc);
      },
      (err) => {
        setError("Gagal mendapatkan lokasi: " + err.message);
      }
    );
  }, []);

  const fetchPrayerTimes = async (loc: Location) => {
    try {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, "0"); // Format 01-31
      const month = String(now.getMonth() + 1).padStart(2, "0"); // Format 01-12 (karena getMonth() dimulai dari 0)
      const year = now.getFullYear();
      const formattedDate = `${day}-${month}-${year}`;
      const response = await fetch(
        `https://api.aladhan.com/v1/timings/${formattedDate}?latitude=${loc.latitude}&longitude=${loc.longitude}&method=20&shafaq=ahmer&tune=5%2C3%2C5%2C7%2C9%2C-1%2C0%2C8%2C-6&school=0&midnightMode=0&calendarMethod=UAQ`
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
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Jadwal Sholat</h1>
      <p className="text-lg text-gray-600 mb-6">
        Waktu Saat Ini: {currentTime}
      </p>
      <div className="flex space-x-6 bg-white p-4 rounded-xl shadow-lg">
        {prayerIcon.map((prayer, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 shadow-md">
              {prayer.icon}
            </div>
            <p className="mt-2 text-gray-700 font-semibold">{prayer.name}</p>
            <p className="text-sm text-gray-500">
              {findTimes(prayer.nameTimings)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
