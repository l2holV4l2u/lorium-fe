"use client";

import { useParams } from "next/navigation";
import { Home, FileText, MessageSquare, Settings } from "lucide-react";
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
import {
  Event,
  EventWithRelations,
  FormField,
  FormFieldWithRelations,
} from "@lorium/prisma-zod";
import { LoadPage } from "@components/layout/loadPage";
import { Form } from "./tabs/form";

const restoreRelations = (
  prev: FormFieldWithRelations[],
  next: FormField[]
): FormFieldWithRelations[] =>
  next.map((field) => {
    const old = prev.find((f) => f.id === field.id);
    return old ? { ...old, ...field } : (field as FormFieldWithRelations);
  });

export default function ExamDetails() {
  const params = useParams();
  const eventId = params.id as string;
  const [activeTab, setActiveTab] = useState("overview");

  const [event, setEvent] = useState<EventWithRelations | null>(null);

  const { data, isLoading, error } = trpc.event.getFullById.useQuery(eventId, {
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
      element: event && (
        <Overview
          event={event}
          setEvent={(e: Event) => setEvent({ ...event, ...e })}
        />
      ),
    },
    {
      id: "form",
      label: "แบบฟอร์ม",
      icon: FileText,
      element: event?.form && (
        <Form
          formId={event.form.id}
          formFields={event.form.fields}
          setFormFields={(fields: FormField[]) =>
            setEvent((prev) => {
              if (!prev || !prev.form) return prev;
              return {
                ...prev,
                form: {
                  ...prev.form,
                  fields: restoreRelations(prev.form.fields, fields),
                },
              };
            })
          }
        />
      ),
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

  if (!event) return <LoadPage />;

  return (
    <div className="h-screen w-full bg-gray-50 p-8 flex flex-col mx-auto">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/host">การสอบทั้งหมด</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{event.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        รายละเอียดการสอบ {event.name}
      </h1>

      <Card className="overflow-hidden flex-1 py-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
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
            <div className="flex-1">
              {tabs.map((t) => (
                <TabsContent
                  key={t.id}
                  value={t.id}
                  className="h-full overflow-auto"
                >
                  <CardContent className="p-6 h-full">{t.element}</CardContent>
                </TabsContent>
              ))}
            </div>
          </div>
        </Tabs>
      </Card>
    </div>
  );
}
