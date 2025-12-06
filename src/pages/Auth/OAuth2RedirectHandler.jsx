import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingOverlay from '../../components/common/Loading/LoadingOverlay'; // Tận dụng component loading có sẵn của bạn

const OAuth2RedirectHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithOAuth2 } = useAuth(); // Chúng ta sẽ viết hàm này ở bước 2

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      // Gọi hàm xử lý đăng nhập bằng token
      loginWithOAuth2(token)
        .then((success) => {
          if (success) {
            navigate('/'); // Thành công về trang chủ
          } else {
            navigate('/login'); // Thất bại về trang login
          }
        })
        .catch((err) => {
          console.error("OAuth2 Login Error:", err);
          navigate('/login');
        });
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate, loginWithOAuth2]);

  return <LoadingOverlay isLoading={true} message="Đang xác thực..." />;
};

export default OAuth2RedirectHandler;