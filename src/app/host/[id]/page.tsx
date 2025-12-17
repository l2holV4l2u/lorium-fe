"use client";

import { useParams } from "next/navigation";
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
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@lib/trpc";
import Overview from "./tabs/overview";
import { useEffect, useState } from "react";
import { Event } from "@lorium/prisma-zod";

export default function ExamDetails() {
  const params = useParams();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);

  const { data, isLoading, error } = trpc.event.getById.useQuery(eventId, {
    enabled: !!eventId,
  });

  useEffect(() => {
    if (data) setEvent(data);
  }, [data]);

  const tabs = [
    {
      id: "overview",
      label: "ภาพรวม",
      icon: Home,
      element: event && <Overview event={event} setEvent={setEvent} />,
    },
    {
      id: "form",
      label: "แบบฟอร์ม",
      icon: FileText,
    },
    {
      id: "response",
      label: "คำตอบ",
      icon: MessageSquare,
    },
    {
      id: "setting",
      label: "การตั้งค่า",
      icon: Settings,
    },
  ];

  return (
    <div className="h-screen bg-gray-50 p-8">
      <div className="max-w-8xl h-full flex flex-col mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/host">การสอบทั้งหมด</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>จัดการอีเวนต์</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">จัดการอีเวนต์</h1>
          <p className="text-gray-600 mt-2">
            จัดการและติดตามอีเวนต์ของคุณ {eventId && `(ID: ${eventId})`}
          </p>
        </div>

        <Card className="overflow-hidden flex-1 py-0">
          <Tabs defaultValue="overview" className="h-full">
            <div className="flex h-full">
              {/* Vertical Tab List - Full Height */}
              <div className="border-r">
                <TabsList className="flex flex-col justify-start items-stretch h-fit w-64 bg-transparent p-4 rounded-none space-y-2">
                  {tabs.map((t) => {
                    const Icon = t.icon;
                    return (
                      <TabsTrigger
                        key={t.id}
                        value={t.id}
                        className="flex-1 w-full justify-start gap-3 px-4 py-3 data-[state=active]:bg-primary-50 data-[state=active]:text-primary-700 data-[state=active]:font-medium text-gray-700 hover:bg-gray-50"
                      >
                        <Icon className="w-5 h-5" />
                        <span>{t.label}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </div>

              {/* Content Area - Full Height */}
              <div className="flex-1 overflow-auto">
                {tabs.map((t) => (
                  <TabsContent
                    key={t.id}
                    value={t.id}
                    className="h-full m-0 p-6 data-[state=inactive]:hidden"
                  >
                    <div className="h-full flex flex-col">
                      <CardContent className="flex-1 p-0">
                        {t.element}
                      </CardContent>
                    </div>
                  </TabsContent>
                ))}
              </div>
            </div>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
