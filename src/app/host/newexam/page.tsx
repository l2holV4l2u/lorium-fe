"use client";

import { useState } from "react";
import { FormBuilder } from "@components/section/formBuilder";
import { GeneralInfo } from "@components/section/generalInfo";
import { Button } from "@components/ui/button";
import { LucideArrowLeft, LucideArrowRight } from "lucide-react";
import { eventWithFormTemplate } from "@lib/template";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { validateFormFields, validateGenInfo } from "@lib/utils/validator";
import { GoDot, GoDotFill } from "react-icons/go";
import { PageLayout } from "@components/layout/pageLayout";
import { trpc } from "@lib/trpc";
import { useHostSession } from "@lib/useSession";
import { LoadPage } from "@components/layout/loadPage";

export default function NewEventClient() {
  const createEventMutation = trpc.event.createEvent.useMutation();
  const [data, setData] = useState(eventWithFormTemplate());
  const [host] = useHostSession();
  const steps = ["ข้อมูลทั่วไป", "สร้างแบบฟอร์ม"];
  const [nav, setNav] = useState(1);
  const router = useRouter();

  if (!host) return <LoadPage />;

  const handleNext = async () => {
    switch (nav) {
      case 1:
        if (!validateGenInfo(data.event)) {
          toast.error("กรุณากรอกข้อมูลทั่วไปให้ครบถ้วน");
          return;
        }
        break;
      case 2:
        if (!validateFormFields(data.formFields)) {
          toast.error(
            "แบบฟอร์มต้องมีอย่างน้อยหนึ่งฟิลด์ และต้องกรอกให้ครบถ้วน"
          );
          return;
        }
        console.log(data);
        try {
          const response = await createEventMutation.mutateAsync({
            userId: host.id,
            event: data.event,
            formFields: data.formFields,
          });
          if (response.success) {
            toast.success("สร้างการสอบสำเร็จ");
            router.push("/host");
          } else {
            toast.error("สร้างการสอบล้มเหลว");
          }
        } catch (error) {
          toast.error("เกิดข้อผิดพลาดในการสร้างการสอบ");
          console.error(error);
        }
        return;
    }
    setNav(nav + 1);
  };

  return (
    <PageLayout
      breadcrumbs={[
        { label: "การสอบทั้งหมด", href: "/host" },
        { label: "เพิ่มการสอบ" },
      ]}
      title="เพิ่มการสอบใหม่"
    >
      <div className="flex flex-col gap-4 w-full h-full">
        {/* Stepper */}
        <div className="flex items-center justify-center text-gray-700">
          {steps.map((item, index) => (
            <div
              className="flex flex-col relative w-44 h-13 items-center"
              key={index}
            >
              {nav > index + 1 ? (
                <GoDotFill size={32} color="#3369eb" />
              ) : nav == index + 1 ? (
                <GoDot size={32} color="#3369eb" />
              ) : (
                <GoDot size={32} />
              )}
              <div className="absolute top-3.5 left-28">
                {index != steps.length - 1 &&
                  (nav > index + 1 ? (
                    <div className="w-32 h-1 bg-primary-400 rounded-lg" />
                  ) : (
                    <div className="w-32 h-1 bg-gray-400 rounded-lg" />
                  ))}
              </div>
              <div
                className={`text-sm ${
                  nav == index + 1 ? "font-bold" : "font-medium"
                }`}
              >
                {item}
              </div>
            </div>
          ))}
        </div>

        {nav == 1 && (
          <GeneralInfo
            event={data.event}
            setEvent={(e) => setData({ ...data, event: e })}
          />
        )}
        {nav == 2 && (
          <FormBuilder
            formFields={data.formFields}
            setFormFields={(f) => setData({ ...data, formFields: f })}
          />
        )}

        {/* Navigation */}
        <div className="flex gap-4 font-semibold">
          {nav > 1 && (
            <Button
              onClick={() => setNav(nav - 1)}
              variant="outline"
              size="full"
              className="flex-1"
            >
              <LucideArrowLeft size={16} /> ย้อนกลับ
            </Button>
          )}
          <Button
            onClick={handleNext}
            variant={"highlight"}
            size="full"
            className="flex-1"
          >
            {nav == 2 ? "ส่ง" : "ถัดไป"}
            <LucideArrowRight size={16} />
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
