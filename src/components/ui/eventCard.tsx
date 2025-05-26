import React from "react";
import { MapPin, Calendar } from "lucide-react";
import Image from "next/image";

type EventCardProps = {
  title: string;
  description: string;
  coverImage: string;
  location: string;
  startTime: string;
  endTime: string;
};

const EventCard: React.FC<EventCardProps> = ({
  title,
  description,
  coverImage,
  location,
  startTime,
  endTime,
}) => {
  const formatTime = (datetime: string) =>
    new Date(datetime).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC"
    });

  const formatDate = (datetime: string) =>
    new Date(datetime).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  // const formatLocale = (datetime: string) => 
  //   new Date(datetime).getUTCHours();

  return (
    <div className="rounded-2xl overflow-hidden border w-[240px] bg-white flex flex-col">
      {/* Image container with fixed width and height - scaled proportionally */}
      <div className="relative w-full h-[228px]">
        <Image
          src={coverImage || "/default-cover.jpg"}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover rounded-t-2xl"
        />
      </div>
      
      <div className="bg-[#6B3F1D] text-white min-h-20 h-fit p-2.5 rounded-b-2xl flex flex-col">
        <h2 className="text-base font-semibold">{title.slice(0, 60)}</h2>
        
        <div className="flex items-center gap-1 text-xs mt-1">
          <MapPin size={14} className="flex-shrink-0" />
          <span>{location}</span>
        </div>
        
        <div className="flex items-center gap-1 text-xs">
          <Calendar size={14} className="flex-shrink-0" />
          <span>{formatDate(startTime)}, {formatTime(startTime)} - {formatTime(endTime)} WIB</span>
        </div>
        
        {/* <div className="flex items-center gap-1 text-xs mb-1">
          <Clock size={14} className="flex-shrink-0" />
          <span>{formatTime(startTime)} - {formatTime(endTime)}</span>
        </div> */}
        
        <h1 className="text-xs">{description.slice(0, 50)}</h1>
      </div>
    </div>
  );
};

export default EventCard;