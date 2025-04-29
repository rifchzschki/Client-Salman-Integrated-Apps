"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Tipe untuk Event
type Event = {
  id: number;
  title: string;
  description: string;
  cover_image: string;
  location: string;
  start_time: string;
  end_time: string;
  organizer: string;
  is_online: boolean;
  link: string;
  poster: string;
};

const EventList = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [lengthEvent, setLengthEvent] = useState(0);
  const [dateError, setDateError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});


  // State untuk mengontrol form popup
  const [showAddEventPopup, setShowAddEventPopup] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    start_time: "",
    end_time: "",
    organizer: "",
    is_online: false,
    link: "",
    cover_image: null as File | null,
    poster: null as File | null,
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/events");
        const data = await response.json();
        if (data.length > 0) {
          console.log("events",data)
          setLengthEvent(data.length);
          setEvents(data); // Pastikan response API kamu seperti { data: [...] }
        } else {
          setLengthEvent(0);
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);
    // Saat user pilih file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  // Handle input biasa
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, type } = e.target;
  
    let value: any;
  
    if (type === "checkbox") {
      value = (e.target as HTMLInputElement).checked;
    } else if (type === "file") {
      value = (e.target as HTMLInputElement).files?.[0] || null;

      if (value.type !== "image/jpeg" && value.type !== "image/png") {
        alert("Hanya file JPG atau PNG yang diperbolehkan!");
        e.target.value = ""; 
        return;
      }
    } else {
      value = e.target.value;
    }
  
    const updatedFormData = {
      ...formData,
      [name]: value,
    };
  
    // Validasi tanggal saat start_time atau end_time berubah
    if ((name === "start_time" || name === "end_time") &&
        updatedFormData.start_time && updatedFormData.end_time) {
      const start = new Date(updatedFormData.start_time);
      const end = new Date(updatedFormData.end_time);
      if (end < start) {
        setDateError("Waktu selesai tidak boleh lebih awal dari waktu mulai.");
      } else {
        setDateError(null);
      }
    }
  
    setFormData(updatedFormData);
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: boolean } = {};
    const requiredFields = ["title", "description", "start_time", "end_time", "cover_image", "is_online"];

    requiredFields.forEach((field) => {
      const value = formData[field as keyof typeof formData];
      if (!value || (typeof value === "string" && value.trim() === "")) {
        newErrors[field] = true;
      }
    });

    // Validasi tanggal juga
    if (
      formData.start_time &&
      formData.end_time &&
      new Date(formData.end_time) < new Date(formData.start_time)
    ) {
      newErrors.end_time = true;
      setDateError("Waktu selesai tidak boleh lebih awal dari waktu mulai.");
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return; // Stop submit jika ada error
    }

    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("location", formData.location);
      form.append("start_time", formData.start_time);
      form.append("end_time", formData.end_time);
      form.append("organizer", formData.organizer);
      form.append("is_online", formData.is_online ? "true" : "false");
      form.append("link", formData.link);
      if (formData.cover_image) {
        form.append("cover_image", formData.cover_image);
      }
      if (formData.poster) {
        form.append("poster", formData.poster);
      }

      const response = await fetch("http://localhost:8000/api/events", {
        method: "POST",
        body: form,
      });

      if (response.ok) {
        const newEvent = await response.json();
        setEvents((prevEvents) => [...prevEvents, newEvent.data]);
        setShowAddEventPopup(false);
        resetForm();
      }
    } catch (error) {
      console.error("Failed to add event:", error);
    }
  };
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      location: "",
      start_time: "",
      end_time: "",
      organizer: "",
      is_online: false,
      link: "",
      cover_image: null,
      poster: null,
    });
  };

  const renderPopup = () => (
    <div className="absolute top-0 left-0 w-screen h-screen flex justify-center items-start bg-white/30 backdrop-blur-md z-50 overflow-auto">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <h3 className="text-xl font-semibold mb-4">Tambah Event</h3>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {[
            { label: "Judul Event", name: "title", type: "text" },
            { label: "Deskripsi", name: "description", type: "textarea" },
            { label: "Lokasi", name: "location", type: "text" },
            { label: "Waktu Mulai", name: "start_time", type: "datetime-local" },
            { label: "Waktu Selesai", name: "end_time", type: "datetime-local" },
            { label: "Penyelenggara", name: "organizer", type: "text" },
            { label: "Link", name: "link", type: "url" },
            { label: "Gambar Cover", name: "cover_image", type: "file" }, 
            { label: "Poster", name: "poster", type: "file" },   
          ].map((field) => (
            <div className="mb-4" key={field.name}>
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                {field.label}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  value={formData[field.name as keyof typeof formData] as string || ""}
                  onChange={handleInputChange}
                  className={`mt-1 p-2 w-full border border-gray-300 rounded-md ${errors[field.name] ? "border-red-500" : "border-gray-300"}`}
                  rows={3}
                />
              ) : field.type === "file" ? (
                <input
                  type="file"
                  id={field.name}
                  name={field.name}
                  accept="image/jpeg, image/png"
                  onChange={handleInputChange}
                  className={`mt-1 p-2 w-full border border-gray-300 rounded-md ${errors[field.name] ? "border-red-500" : "border-gray-300"}`}
                />
              ) : (
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  value={formData[field.name as keyof typeof formData] as string || ""}
                  onChange={handleInputChange}
                  className={`mt-1 p-2 w-full border border-gray-300 rounded-md ${errors[field.name] ? "border-red-500" : "border-gray-300"}`}
                />
              )}
              {field.name === "end_time" && dateError && (
                <p className="text-sm text-red-600 mt-1">{dateError}</p>
              )}
              {errors[field.name] && (
                <p className="text-sm text-red-600 mt-1">Field ini wajib diisi.</p>
              )}
            </div>
          ))}

          <div className="mb-4">
            <label htmlFor="is_online" className="block text-sm font-medium text-gray-700">
              Apakah Event Online?
            </label>
            <input
              type="checkbox"
              id="is_online"
              name="is_online"
              checked={formData.is_online}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setShowAddEventPopup(false)}
              className="px-4 py-2 bg-gray-400 text-white rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );


  if (loading) {
    return <div className="text-center py-10">Loading events...</div>;
  }

  if (lengthEvent === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-xl font-semibold">Tidak ada kegiatan terdekat bulan ini</p>
        <button
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg cursor-pointer"
          onClick={() => setShowAddEventPopup(true)}
        >
          Tambah Event
        </button>
        {showAddEventPopup && renderPopup()}
      </div>
    );
  }



  return (
    <div className="cursor-pointer w-full flex flex-col items-center justify-center">
      <div className="overflow-auto flex gap-4 py-8 scrollbar-thin scrollbar-thumb-gray-300 w-full">
        {events.map((item, index) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="min-w-[280px] max-w-[300px] min-h-[300px] bg-white shadow-xl rounded-xl overflow-scroll hover:shadow-2xl transition-shadow duration-300"
          >
            <img
              src={item.cover_image || "/default-cover.jpg"}
              alt={item.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">{item.title}</h2>
              <p className="text-sm text-gray-500 mt-2">
                {item.description.slice(0, 100) || "No description available."}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Button to open Add Event Popup */}
      <button
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg"
        onClick={() => setShowAddEventPopup(true)}
      >
        Tambah Event
      </button>

      {/* Add Event Popup */}
      {showAddEventPopup && renderPopup()}
    </div>
  );
};

export default EventList;
