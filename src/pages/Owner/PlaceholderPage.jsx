import React from 'react';
import Card from "@/components/common/Card/Card";
import { useLocation } from 'react-router-dom';
import { useTranslation } from "react-i18next";

// Đây là component giữ chỗ cho các trang Owner chưa được tạo
export default function PlaceholderPage({ title, titleKey }) {
  const { t } = useTranslation();
  const location = useLocation();
  
  // Tự động lấy title từ path nếu không được truyền vào
  const autoTitle = location.pathname.split('/').pop().replace('-', ' ');
  const finalTitle = (titleKey && t(titleKey)) || title || autoTitle;

  return (
    <Card>
      <div className="p-6">
        <h1 className="text-2xl font-bold capitalize text-[rgb(40,169,224)]">{finalTitle}</h1>
        <p className="mt-4 text-gray-600">
          {t("owner:PlaceholderPage.thisIsAPlaceholderPage")} <strong className="capitalize">{finalTitle}</strong>.
          <br />
          {t("owner:PlaceholderPage.theActualContentWillBe")}
        </p>
        <code className="block w-full bg-gray-100 text-gray-700 p-3 rounded-md mt-4 text-sm">
          {t("owner:PlaceholderPage.path", { pathname: location.pathname })}
        </code>
      </div>
    </Card>
  );
}