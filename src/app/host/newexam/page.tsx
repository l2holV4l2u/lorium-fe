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

export default function NewEventClient() {
  const [event, setEvent] = useState(eventWithFormTemplate());
  const steps = ["ข้อมูลทั่วไป", "สร้างแบบฟอร์ม"];
  const [nav, setNav] = useState(1);
  const router = useRouter();

  const handleNext = async () => {
    switch (nav) {
      case 1:
        if (!validateGenInfo(event)) {
          toast.error("กรุณากรอกข้อมูลทั่วไปให้ครบถ้วน");
          return;
        }
        break;
      case 2:
        if (!validateFormFields(event.formFields)) {
          toast.error(
            "แบบฟอร์มต้องมีอย่างน้อยหนึ่งฟิลด์ และต้องกรอกให้ครบถ้วน"
          );
          return;
        }
        //await createEvent(user, event, form, formFields);
        router.push("/host");
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

        {/*
        {nav == 1 && <GeneralInfo event={event} setEvent={setEvent} />}
        {nav == 2 && (
          <FormBuilder
            formFields={event.formFields}
            setFormFields={(fields) =>
              setEvent({ ...event, formFields: fields })
            }
          />
        )}
        */}
        <FormBuilder
          formFields={event.formFields}
          setFormFields={(fields) => setEvent({ ...event, formFields: fields })}
        />

        {/* Navigation */}
        <div className="flex gap-4 font-semibold">
          {nav > 1 && (
            <Button
              onClick={() => setNav(nav - 1)}
              variant="outline"
              size="full"
            >
              <LucideArrowLeft size={16} /> ย้อนกลับ
            </Button>
          )}
          <Button onClick={handleNext} variant={"highlight"} size="full">
            {nav === 2 ? "ส่ง" : "ถัดไป"}
            <LucideArrowRight size={16} />
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
