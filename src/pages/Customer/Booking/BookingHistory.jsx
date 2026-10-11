import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import bookingService from "@/services/booking.service";

const BookingHistory = () => {
  const { user } = useAuth();
  const { t } = useTranslation("booking");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    if (!user) return;
    try {
      const data = await bookingService.getBookingsByUserId(user.id);
      setBookings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const handleCancel = async (bookingId) => {
    if (!confirm(t("history.confirmCancel"))) return;
    
    try {
      await bookingService.cancelBooking(bookingId);
      alert(t("history.cancelled"));
      fetchHistory(); // Reload lại danh sách
    } catch (error) {
      alert(t("history.cancelFailed") + error);
    }
  };

  return (
    <div>
       {/* Render danh sách bookings */}
       {bookings.map(item => (
         <div key={item.bookingId} className="booking-card">
            <h3>{item.propertyName}</h3>
            <p>{t("history.status", { status: item.status })}</p>
            
            {/* Chỉ cho hủy nếu trạng thái là PENDING hoặc CONFIRMED (tùy logic) */}
            {(item.status === 'PENDING' || item.status === 'CONFIRMED') && (
               <button onClick={() => handleCancel(item.bookingId)}>{t("history.cancel")}</button>
            )}
         </div>
       ))}
    </div>
  );
};

export default BookingHistory;