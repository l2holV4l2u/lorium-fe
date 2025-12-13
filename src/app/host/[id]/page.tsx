"use client";

import { useState } from "react";
import {
  Home,
  FileText,
  MessageSquare,
  BarChart3,
  Settings,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@components/ui/breadcrumb";

const VerticalTabs = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "ภาพรวม", icon: Home },
    { id: "form", label: "แบบฟอร์ม", icon: FileText },
    { id: "response", label: "คำตอบ", icon: MessageSquare },
    { id: "result", label: "ผลลัพธ์", icon: BarChart3 },
    { id: "setting", label: "การตั้งค่า", icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">ภาพรวม</h2>
            <p className="text-gray-600">เนื้อหาภาพรวมของอีเวนต์</p>
          </div>
        );
      case "form":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">แบบฟอร์ม</h2>
            <p className="text-gray-600">สร้างและจัดการแบบฟอร์มลงทะเบียน</p>
          </div>
        );
      case "response":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">คำตอบ</h2>
            <p className="text-gray-600">ดูคำตอบจากผู้เข้าร่วม</p>
          </div>
        );
      case "result":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">ผลลัพธ์</h2>
            <p className="text-gray-600">ตารางผลลัพธ์และสถิติ</p>
          </div>
        );
      case "setting":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">การตั้งค่า</h2>
            <p className="text-gray-600">จัดการการตั้งค่าอีเวนต์</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/host">อีเวนต์ที่จัด</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>จัดการอีเวนต์</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">จัดการอีเวนต์</h1>
          <p className="text-gray-600 mt-2">จัดการและติดตามอีเวนต์ของคุณ</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex min-h-[600px]">
          {/* Vertical Tab List */}
          <div className="w-64 border-r border-gray-200 p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors
                      ${
                        activeTab === tab.id
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default VerticalTabs;
