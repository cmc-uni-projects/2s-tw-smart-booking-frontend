import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { FaFacebook } from 'react-icons/fa'; // Icon Facebook từ thư viện
import Button from '@/components/common/Button/Button';
import Card from '@/components/common/Card/Card';
import { Link2, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

// ✅ 1. Component Google Icon (Lấy từ Login.jsx)
const GoogleIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    width="24px" // Tăng kích thước lên một chút cho đẹp
    height="24px"
    className={className}
  >
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    />
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    />
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C39.712,35.619,44,30.397,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    />
  </svg>
);

const LinkedAccounts = () => {
  const { currentUser } = useAuth();
  const [linkedProviders, setLinkedProviders] = useState([]);

  useEffect(() => {
    if (currentUser && currentUser.socialAccounts) {
      const providers = currentUser.socialAccounts.map((acc) =>
        acc.provider ? acc.provider.toLowerCase() : ""
      );
      setLinkedProviders(providers);
    }
  }, [currentUser]);

  const handleLink = (provider) => {
    window.location.href = `http://localhost:8386/oauth2/authorization/${provider}`;
  };

  // Helper render item để code gọn hơn
  const SocialItem = ({ provider, icon, title, description, isConnected, colorClass }) => (
    <div className="group flex flex-col sm:flex-row items-center justify-between p-5 border border-gray-100 rounded-2xl hover:border-blue-200 hover:shadow-md transition-all duration-200 bg-white">
      <div className="flex items-center gap-5 mb-4 sm:mb-0 w-full sm:w-auto">
        <div className={`w-14 h-14 flex items-center justify-center rounded-full shadow-sm border border-gray-100 ${colorClass} bg-opacity-10`}>
          {icon}
        </div>
        <div>
          <h4 className="font-bold text-gray-800 text-lg flex items-center gap-2">
            {title}
            {isConnected && <CheckCircle size={16} className="text-green-500" />}
          </h4>
          <p className="text-sm text-gray-500 max-w-[250px]">
            {isConnected
              ? `Tài khoản ${title} đã được liên kết thành công.`
              : description}
          </p>
        </div>
      </div>

      <div className="w-full sm:w-auto flex justify-end">
        {isConnected ? (
          <div className="flex items-center justify-center gap-2 text-green-600 font-semibold bg-green-50 px-6 py-2.5 rounded-xl border border-green-100 min-w-[160px]">
            <CheckCircle size={18} />
            <span>Đã kết nối</span>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={() => handleLink(provider)}
            className="w-full sm:w-auto min-w-[160px] justify-center hover:bg-gray-50"
            // Thêm icon mũi tên nhỏ để kích thích hành động
            rightIcon={<ExternalLink size={14} />}
          >
            Kết nối {title}
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <Card>
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-5 mb-6">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Link2 size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Liên kết tài khoản</h3>
              <p className="text-sm text-gray-500">Quản lý các phương thức đăng nhập bổ sung</p>
            </div>
          </div>

          <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 p-4 rounded-xl flex gap-3 items-start border border-blue-100">
            <AlertCircle size={22} className="mt-0.5 flex-shrink-0 text-blue-600" />
            <div className="text-sm leading-relaxed">
              <strong>Mẹo:</strong> Liên kết tài khoản mạng xã hội giúp bạn đăng nhập nhanh chóng vào TravelMate mà không cần nhớ mật khẩu. 
              Chúng tôi cam kết không đăng bài viết lên trang cá nhân của bạn.
            </div>
          </div>

          <div className="space-y-4">
            {/* Google */}
            <SocialItem
              provider="google"
              title="Google"
              description="Sử dụng tài khoản Google để đăng nhập một chạm."
              isConnected={linkedProviders.includes('google')}
              icon={<GoogleIcon />}
              colorClass="bg-white" // Nền trắng cho icon Google vì nó đã có màu
            />

            {/* Facebook */}
            <SocialItem
              provider="facebook"
              title="Facebook"
              description="Kết nối với Facebook để đăng nhập và chia sẻ dễ dàng."
              isConnected={linkedProviders.includes('facebook')}
              icon={<FaFacebook className="text-[#1877F2] text-3xl" />} // Icon FB to hơn chút cho cân
              colorClass="bg-blue-50"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LinkedAccounts;