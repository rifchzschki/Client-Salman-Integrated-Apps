import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import EventCard from "@/components/ui/eventCard"; // Adjust path as needed
// Import icons from Lucide React
import { ChevronLeft, ChevronRight, Plus, X, Calendar, MapPin } from "lucide-react";
import RoleGuard from "@/app/auth/RoleGuard";

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

type EventFormData = {
  title: string;
  description: string;
  location: string;
  start_time: string; // ISO string or date string
  end_time: string;
  organizer: string;
  is_online: boolean;
  link: string;
  cover_image: File | null;
  poster: File | null;
};

const EventList = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [lengthEvent, setLengthEvent] = useState(0);
  const [showAddEventPopup, setShowAddEventPopup] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  
  // Form state
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`);
        const data = await response.json();
        if (data.length > 0) {
          setLengthEvent(data.length);
          setEvents(data);
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

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, type } = e.target;
  
    let value: string | boolean | File | null;
  
    if (type === "checkbox") {
      value = (e.target as HTMLInputElement).checked;
    } else if (type === "file") {
      value = (e.target as HTMLInputElement).files?.[0] || null;

      if (value && value.type !== "image/jpeg" && value.type !== "image/png") {
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

  // Reset form
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
    setErrors({});
    setDateError(null);
  };

  // Close popup
  const handleClosePopup = () => {
    setShowAddEventPopup(false);
    resetForm();
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: boolean } = {};
    const requiredFields = ["title", "description", "start_time", "end_time"];

    requiredFields.forEach((field) => {
      const value = formData[field as keyof typeof formData];
      if (!value || (typeof value === "string" && value.trim() === "")) {
        newErrors[field] = true;
      }
    });

    // Validate date
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
      return; // Stop submission if there are errors
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
        method: "POST",
        body: form,
      });

      if (response.ok) {
        const newEvent = await response.json();
        // Update events list with the new event
        setEvents((prevEvents) => [...prevEvents, newEvent.data || newEvent]);
        setLengthEvent((prev) => prev + 1);
        handleClosePopup();
      } else {
        console.error("Server responded with an error:", await response.text());
      }
    } catch (error) {
      console.error("Failed to add event:", error);
    }
  };

  const [currentPage, setCurrentPage] = useState(0);
  const chunkArray = (arr: Event[], size: number) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  const eventPages = chunkArray(events, 3);
  const totalPages = eventPages.length;


  if (loading) {
    return <div className="text-center py-10">Loading events...</div>;
  }

  if (lengthEvent === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-xl font-semibold">Tidak ada kegiatan terdekat bulan ini</p>
        <RoleGuard allowedRoles={["manajemen"]}>
          <button
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg cursor-pointer flex items-center justify-center mx-auto gap-2"
              onClick={() => setShowAddEventPopup(true)}
          >
            <Plus size={18} />
            <span>Tambah Event</span>
          </button>
        </RoleGuard>

        
        {/* Add Event Dialog */}
        {showAddEventPopup && (
          <AddEventDialog 
            onClose={handleClosePopup}
            onSubmit={handleSubmit}
            formData={formData}
            handleInputChange={handleInputChange}
            errors={errors}
            dateError={dateError}
          />
        )}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* Carousel Container */}
      <div className="flex justify-center items-center w-full relative px-4">
        {/* Left Arrow */}
        {currentPage > 0 && (
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="absolute left-7 top-1/2 -translate-y-1/2 z-10 bg-[#6B3F1D] p-2 rounded-full hover:bg-[#5D3719] transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft size={20} className="text-white" />
          </button>
        )}
  
        {/* Carousel Page */}
        <div className="flex gap-4 overflow-hidden py-8 w-full justify-center">
          {eventPages[currentPage].map((item, index) => { 
            return (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <EventCard
                title={item.title}
                description={item.description}
                coverImage={item.cover_image}
                location={item.location}
                startTime={item.start_time}
                endTime={item.end_time}
              />
            </motion.div>
          )})}
        </div>
  
        {/* Right Arrow */}
        {currentPage < totalPages - 1 && (
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="absolute right-7 top-1/2 -translate-y-1/2 z-10 bg-[#6B3F1D] p-2 rounded-full hover:bg-[#5D3719] transition-colors"
            aria-label="Next page"
          >
            <ChevronRight size={20} className="text-white" />
          </button>
        )}
      </div>
  
      {/* Pagination Dots */}
      <div className="flex gap-2 mt-2">
        {eventPages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index)}
            className={`w-2 h-2 rounded-full ${
              index === currentPage ? "bg-[#543310]" : "bg-gray-300"
            }`}
            aria-label={`Go to page ${index + 1}`}
          />
        ))}
      </div>
  
      {/* Add Event Button */}
      <button
        className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        onClick={() => setShowAddEventPopup(true)}
      >
        <Plus size={18} />
        <span>Tambah Acara</span>
      </button>
  
      {/* Add Event Dialog */}
      {showAddEventPopup && (
        <AddEventDialog
          onClose={handleClosePopup}
          onSubmit={handleSubmit}
          formData={formData}
          handleInputChange={handleInputChange}
          errors={errors}
          dateError={dateError}
        />
      )}
    </div>
  );  
};

// Add Event Dialog Component
type AddEventDialogProps = {
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: EventFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  errors: { [key: string]: boolean };
  dateError: string | null;
};

const AddEventDialog = ({ 
  onClose, 
  onSubmit, 
  formData, 
  handleInputChange, 
  errors, 
  dateError 
}: AddEventDialogProps) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        {/* Updated to use a white background with blur effect instead of dark overlay */}
        <div 
          className="fixed inset-0 bg-white/60 backdrop-blur-sm transition-opacity" 
          onClick={onClose}
        ></div>
        
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-md">
          <div className="bg-white p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Tambah Event</h3>
              <button 
                type="button" 
                className="text-gray-400 hover:text-gray-500" 
                onClick={onClose}
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={onSubmit} encType="multipart/form-data">
              {/* Title */}
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Judul Event *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`mt-1 p-2 w-full border rounded-md ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.title && (
                  <p className="text-sm text-red-600 mt-1">Judul wajib diisi.</p>
                )}
              </div>
              
              {/* Description */}
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Deskripsi *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className={`mt-1 p-2 w-full border rounded-md ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">Deskripsi wajib diisi.</p>
                )}
              </div>
              
              {/* Location */}
              <div className="mb-4">
                <label htmlFor="location" className="flex items-center gap-1 text-sm font-medium text-gray-700">
                  <MapPin size={16} />
                  <span>Lokasi</span>
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  placeholder="Masukkan lokasi acara"
                />
              </div>
              
              {/* Start Time */}
              <div className="mb-4">
                <label htmlFor="start_time" className="flex items-center gap-1 text-sm font-medium text-gray-700">
                  <Calendar size={16} />
                  <span>Waktu Mulai *</span>
                </label>
                <input
                  type="datetime-local"
                  id="start_time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleInputChange}
                  className={`mt-1 p-2 w-full border rounded-md ${
                    errors.start_time ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.start_time && (
                  <p className="text-sm text-red-600 mt-1">Waktu mulai wajib diisi.</p>
                )}
              </div>
              
              {/* End Time */}
              <div className="mb-4">
                <label htmlFor="end_time" className="flex items-center gap-1 text-sm font-medium text-gray-700">
                  <Calendar size={16} />
                  <span>Waktu Selesai *</span>
                </label>
                <input
                  type="datetime-local"
                  id="end_time"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleInputChange}
                  className={`mt-1 p-2 w-full border rounded-md ${
                    errors.end_time ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.end_time && (
                  <p className="text-sm text-red-600 mt-1">Waktu selesai wajib diisi.</p>
                )}
                {dateError && (
                  <p className="text-sm text-red-600 mt-1">{dateError}</p>
                )}
              </div>
              
              {/* Organizer */}
              <div className="mb-4">
                <label htmlFor="organizer" className="block text-sm font-medium text-gray-700">
                  Penyelenggara
                </label>
                <input
                  type="text"
                  id="organizer"
                  name="organizer"
                  value={formData.organizer}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  placeholder="Nama penyelenggara"
                />
              </div>
              
              {/* Is Online */}
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  id="is_online"
                  name="is_online"
                  checked={formData.is_online}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                />
                <label htmlFor="is_online" className="ml-2 block text-sm text-gray-700">
                  Event Online
                </label>
              </div>
              
              {/* Cover Image */}
              <div className="mb-4">
                <label htmlFor="cover_image" className="block text-sm font-medium text-gray-700">
                  Gambar Cover
                </label>
                <input
                  type="file"
                  id="cover_image"
                  name="cover_image"
                  onChange={handleInputChange}
                  accept="image/jpeg, image/png"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>
              
              {/* Poster */}
              <div className="mb-4">
                <label htmlFor="poster" className="block text-sm font-medium text-gray-700">
                  Poster
                </label>
                <input
                  type="file"
                  id="poster"
                  name="poster"
                  onChange={handleInputChange}
                  accept="image/jpeg, image/png"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none flex items-center gap-1"
                  onClick={onClose}
                >
                  <X size={16} />
                  <span>Batal</span>
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none flex items-center gap-1"
                >
                  <Plus size={16} />
                  <span>Simpan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventList;