import { Route, Routes } from "react-router-dom";
import CustomerLayout from "@/layouts/CustomerLayout/CustomerLayout";
import ProfilePage from "@/pages/Customer/Profile/ProfilePage";
import SettingsPage from "@/pages/Customer/Profile/SettingsPage";
import BookingHistory from "@/pages/Customer/Booking/BookingHistory";

const TransactionHistoryPage = () => <h2>Lịch sử giao dịch</h2>;
const RefundsPage = () => <h2>Refunds</h2>;
const WishlistPage = () => <h2>Yêu thích</h2>;

const CustomerRoutes = () => {
  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        <Route path="/customer/profile" element={<ProfilePage />} />
        <Route path="/customer/settings" element={<SettingsPage />} />
        <Route path="/customer/bookings" element={<BookingHistory />} />
        <Route path="/customer/transactions" element={<TransactionHistoryPage />} />
        <Route path="/customer/refunds" element={<RefundsPage />} />
        <Route path="/customer/wishlist" element={<WishlistPage />} />
      </Route>
    </Routes>
  );
};

export default CustomerRoutes;