// src/pages/Owner/Properties/PropertyListPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Building2 } from "lucide-react";
import Card from "@/components/common/Card/Card";
import CardHeader from "@/components/common/Card/CardHeader";
import Button from "@/components/common/Button/Button";
import EmptyState from "@/components/common/EmptyState/EmptyState";

const PropertyListPage = () => {
  const navigate = useNavigate();
  const properties = []; // Giả lập chưa có cơ sở nào

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <CardHeader
          title="Quản lý Chỗ nghỉ"
          subtitle="Thêm, sửa hoặc cập nhật trạng thái các cơ sở của bạn."
          icon={<Building2 className="text-[rgb(40,169,224)]" />}
        />
        <Button
          onClick={() => navigate("/owner/properties/new")}
          leftIcon={<Plus size={18} />}
        >
          Thêm chỗ nghỉ mới
        </Button>
      </div>

      {properties.length === 0 ? (
        <EmptyState
          title="Chưa có cơ sở lưu trú nào"
          description="Hãy bắt đầu bằng cách thêm cơ sở lưu trú đầu tiên của bạn."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* TODO: Map qua danh sách 'properties' và render Card cho mỗi cơ sở */}
        </div>
      )}
    </Card>
  );
};

export default PropertyListPage;