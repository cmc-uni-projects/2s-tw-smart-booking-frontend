// src/pages/Owner/Properties/AddPropertyPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import Card from "@/components/common/Card/Card";
import Button from "@/components/common/Button/Button";
import { ArrowLeft } from "lucide-react";

// *** ĐÂY CHỈ LÀ FILE TẠM THỜI ***
// Chúng ta sẽ thay thế toàn bộ file này ở các giai đoạn sau.

const AddPropertyPage = () => {
  return (
    <Card>
      <h1 className="text-2xl font-bold mb-4">Thêm Chỗ nghỉ Mới (WIP)</h1>
      <p className="mb-6">
        Đây là trang sẽ chứa wizard 8 bước để thêm cơ sở lưu trú.
      </p>
      <Button
        as={Link}
        to="/owner/properties"
        variant="outline"
        leftIcon={<ArrowLeft size={18} />}
      >
        Quay lại
      </Button>
    </Card>
  );
};

export default AddPropertyPage;