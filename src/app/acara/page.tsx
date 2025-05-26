"use client";
import Navbar from "@/components/NavBar";
import { useRouter } from "next/navigation";
import React, {useState, MouseEvent, useEffect} from "react";
import RoleGuard from "@/app/auth/RoleGuard";
import Footer from "@/components/Footer";
import { User } from "@/contexts/UserContext";


type EventItem = {
  id: number;
  date: string;
  title: string;
};

type PopupState = {
  show: boolean;
  event: EventItem | null;
  pos: { top: number; left: number };
};

const daysInMonth = (year: number, month: number): number =>
  new Date(year, month + 1, 0).getDate();

const firstDayOfMonth = (year: number, month: number): number =>
  new Date(year, month, 1).getDay(); // 0 = Sunday

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function Calendar() {

  const now = new Date();
  const [user, setUser] = useState<User|null>(null);
  const [, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());

  const days = daysInMonth(selectedYear, selectedMonth);
  const firstDay = firstDayOfMonth(selectedYear, selectedMonth);

  const [events, setEvents] = useState<EventItem[]>([]);
  const [popup, setPopup] = useState<PopupState>({
    show: false,
    event: null,
    pos: { top: 0, left: 0 },
  });

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
        .then((res) => {
          if (!res.ok) throw new Error("Unauthorized");
          return res.json();
        })
        .then((data) => setUser(data.data))
        .catch(() => router.replace("/login"))
        .finally(() => setLoading(false));
  }, [router]);

  const isManager = user && user.role === "manajemen";
  const addEvent = (date: string): void => {
    const title = prompt("Event title:");
    if (!title) return;
    setEvents([...events, { id: Date.now(), date, title }]);
  };

  const editEvent = (id: number): void => {
    const ev = events.find((e) => e.id === id);
    if (!ev) return;
    const title = prompt("Edit title:", ev.title);
    if (!title) return;
    setEvents(events.map((e) => (e.id === id ? { ...e, title } : e)));
  };

  const deleteEvent = (id: number): void => {
    if (!window.confirm("Delete event?")) return;
    setEvents(events.filter((e) => e.id !== id));
  };

  const onEventClick = (e: MouseEvent<HTMLDivElement>, ev: EventItem): void => {
    e.stopPropagation();
    const container = e.currentTarget.closest(".container-event");
    if (!container) return;
    const rect = container.getBoundingClientRect();
    setPopup({
      show: true,
      event: ev,
      pos: { top: rect.top, left: rect.right },
    });
  };

  const closePopup = (): void =>
    setPopup({ show: false, event: null, pos: { top: 0, left: 0 } });

  // Buat grid tanggal dengan padding di awal dan akhir agar jadi 6 minggu (42 kotak)
  const dateGrid = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ];
  while (dateGrid.length < 42) dateGrid.push(null); // padding akhir

  return (
    <div className="h-dvh">
      <div className="absolute w-full">
        <Navbar />
      </div>

      <div className="flex flex-col items-center justify-end h-full py-12">
        {/* Dropdown bulan dan tahun */}
        <div className="mb-2 flex gap-4">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="border px-2 py-1 rounded bg-cream text-brown"
          >
            {monthNames.map((name, idx) => (
              <option key={idx} value={idx}>
                {name}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border px-2 py-1 rounded bg-cream text-brown"
          >
            {Array.from({ length: 11 }, (_, i) => selectedYear - 5 + i).map(
              (year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              )
            )}
          </select>
        </div>

        <div className="grid grid-cols-7 auto-rows-[45px] gap-2 h-13/15 w-11/12 border-2 border-brown rounded-lg p-4 bg-white shadow-lg overflow-y-auto">
          {/* Header hari */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div
              key={d}
              className="row-span-1 flex justify-center items-center font-bold h-full"
            >
              {d}
            </div>
          ))}

          {/* Tanggal + Event */}
          {dateGrid.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="row-span-2" />;
            }
            const dateKey = `${selectedYear}-${selectedMonth + 1}-${day}`;
            return (
              <div
                key={dateKey}
                className="row-span-2 border rounded p-2 w-full h-full relative bg-cream text-brown flex flex-col container-event"
                onClick={() => {
                  if (isManager) {
                    addEvent(dateKey);
                  }
                }}
              >
                <div className="flex justify-between text-sm">
                  <span>{day}</span>
                </div>
                <div className="mt-1 space-y-1 overflow-y-auto">
                  {events
                    .filter((ev) => ev.date === dateKey)
                    .map((ev) => (
                      <div
                        key={ev.id}
                        className="bg-white rounded p-1 text-sm cursor-pointer"
                        onClick={(e) => onEventClick(e, ev)}
                      >
                        {ev.title}
                      </div>
                    ))}
                </div>
              </div>
            );
          })}
        </div>

        {popup.show && popup.event && (
          <div
            className="absolute z-10"
            style={{ top: popup.pos.top, left: popup.pos.left }}
          >
            <div className="bg-white border p-4 shadow-lg rounded">
              <h3>{popup.event.title}</h3>
              <p>{popup.event.date}</p>
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => {
                    editEvent(popup.event!.id);
                    closePopup();
                  }}
                  className="px-2 py-1 rounded bg-brown text-white"
                >
                  Edit
                </button>
                <RoleGuard allowedRoles={["manajemen"]}>
                  <button
                      onClick={() => {
                        deleteEvent(popup.event!.id);
                        closePopup();
                      }}
                      className="px-2 py-1 rounded border border-brown text-brown"
                  >
                    Delete
                  </button>
                </RoleGuard>

                <button onClick={closePopup} className="px-2 py-1 rounded">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
