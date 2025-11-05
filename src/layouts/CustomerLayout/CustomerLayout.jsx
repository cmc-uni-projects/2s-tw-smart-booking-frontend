import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import FloatingChatBot from "./FloatingChatBot";

const CustomerLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Header />

      {/* Nội dung chính */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <Footer />

      {/* Chatbot nổi góc phải */}
      <FloatingChatBot />
    </div>
  );
};

export default CustomerLayout;
