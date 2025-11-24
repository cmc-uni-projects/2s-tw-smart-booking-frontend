import React, { useState, useEffect } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { addDays, format, isValid, parseISO } from "date-fns";
import Button from "@/components/common/Button/Button";
import DestinationSelector from "@/components/search/DestinationSelector";
import DateSelector from "@/components/search/DateSelector";
import GuestSelector from "@/components/search/GuestSelector";

const SearchBox = ({ 
  initialValues = {}, // Giá trị khởi tạo (từ URL hoặc mặc định)
  onSearch,           // Hàm callback khi bấm tìm (nếu cần xử lý riêng)
  className = "",      // Class tùy chỉnh cho container
  vertical = false    // Chế độ hiển thị dọc (nếu cần cho mobile menu)
}) => {
  const navigate = useNavigate();

  // --- 1. STATE ---
  const [destination, setDestination] = useState(initialValues.destination || "");
  const [dates, setDates] = useState({
    startDate: (initialValues.checkIn && isValid(parseISO(initialValues.checkIn))) 
        ? parseISO(initialValues.checkIn) 
        : new Date(),
    endDate: (initialValues.checkOut && isValid(parseISO(initialValues.checkOut))) 
        ? parseISO(initialValues.checkOut) 
        : addDays(new Date(), 1),
  });
  const [guests, setGuests] = useState({
    adults: initialValues.guests || 2,
    children: 0,
    rooms: 1,
  });

  // Cập nhật state khi initialValues thay đổi (quan trọng cho trang Search)
  useEffect(() => {
    if (initialValues.destination !== undefined) setDestination(initialValues.destination);
    if (initialValues.guests) setGuests(prev => ({ ...prev, adults: initialValues.guests }));
    if (initialValues.checkIn) setDates(prev => ({ ...prev, startDate: parseISO(initialValues.checkIn) }));
    if (initialValues.checkOut) setDates(prev => ({ ...prev, endDate: parseISO(initialValues.checkOut) }));
  }, [initialValues]);

  // --- 2. HANDLE SEARCH ---
  const handleSearchClick = () => {
    const params = {
      keyword: destination,
      guests: guests.adults + guests.children,
      checkIn: format(dates.startDate, "yyyy-MM-dd"),
      checkOut: format(dates.endDate, "yyyy-MM-dd"),
      rooms: guests.rooms
    };

    // Nếu có prop onSearch (dùng ở trang kết quả), gọi nó
    if (onSearch) {
      onSearch(params);
    } else {
      // Mặc định: Điều hướng sang trang hotels
      navigate({
        pathname: "/hotels",
        search: `?${createSearchParams(params)}`,
      });
    }
  };

  // --- 3. RENDER ---
  return (
    <div className={`bg-white rounded-2xl shadow-xl border border-gray-100 p-4 grid gap-4 ${vertical ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-4'} ${className}`}>
      
      {/* Destination */}
      <div className="relative z-20">
         <DestinationSelector value={destination} onChange={setDestination} />
      </div>
      
      {/* Date */}
      <div className="relative z-10">
         <DateSelector value={dates} onChange={setDates} />
      </div>

      {/* Guests */}
      <div className="relative z-0">
         <GuestSelector value={guests} onChange={setGuests} />
      </div>

      {/* Search Button */}
      <div className="flex items-end">
        <Button
          size="lg"
          className="w-full bg-[rgb(40,169,224)] hover:bg-[#1b98d6] text-white font-semibold shadow-md rounded-xl h-[52px]" // Chiều cao cố định để khớp với các input
          onClick={handleSearchClick}
          leftIcon={<Search size={20} />}
        >
          Tìm kiếm
        </Button>
      </div>
    </div>
  );
};

export default SearchBox;