"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { useState } from "react";
import { Event } from "@lorium/prisma-zod";

export function GeneralInfo({
  event,
  setEvent,
}: {
  event: Event;
  setEvent: (e: Event) => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* ชื่ออีเวนต์ */}
      <div className="flex flex-col gap-1 w-full">
        <Label>ชื่อการสอบ</Label>
        <Input
          value={event.name}
          onChange={(e) => setEvent({ ...event, name: e.target.value })}
          placeholder="พิมพ์ชื่อการสอบของคุณ"
        />
      </div>

      {/* รายละเอียด */}
      <div className="flex flex-col gap-1 w-full">
        <Label>รายละเอียด</Label>
        <Textarea
          value={event.description}
          onChange={(e) => setEvent({ ...event, description: e.target.value })}
          placeholder="คุณจะอธิบายการสอบของคุณอย่างไร?"
        />
      </div>

      {/* สถานที่ */}
      <div className="flex flex-col gap-1 w-full">
        <Label>สถานที่</Label>
        <Input
          value={event.location}
          onChange={(e) => setEvent({ ...event, location: e.target.value })}
          placeholder="จัดที่ไหน?"
        />
      </div>

      {/* ราคา */}
      <div className="flex flex-col gap-1 w-full">
        <Label>ค่าลงทะเบียน</Label>
        <Input
          type="number"
          value={event.price}
          onChange={(e) =>
            setEvent({ ...event, price: Number(e.target.value) })
          }
          placeholder="ขั้นต่ำ 100฿"
        />
      </div>

      {/* วันที่จัดงาน */}
      <div className="flex flex-col gap-1 w-full">
        <Label>วันที่จัดงาน *</Label>

        <Tabs defaultValue="range">
          <TabsList className="w-full">
            <TabsTrigger value="single">วันเดียว</TabsTrigger>
            <TabsTrigger value="range">หลายวัน</TabsTrigger>
          </TabsList>

          {/* SINGLE DATE */}
          <TabsContent value="single">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  {event.startDate
                    ? format(event.startDate, "PPP")
                    : "เลือกวันที่"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Calendar
                  mode="single"
                  selected={event.startDate}
                  onSelect={(date) => {
                    if (!date) return;
                    setEvent({ ...event, startDate: date, endDate: date });
                  }}
                />
              </PopoverContent>
            </Popover>
          </TabsContent>

          {/* DATE RANGE */}
          <TabsContent value="range">
            <div className="flex gap-4">
              {/* START DATE */}
              <div className="flex flex-col gap-1 w-full">
                <Label>จาก</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      {event.startDate
                        ? format(event.startDate, "PPP")
                        : "เลือกวันที่"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Calendar
                      mode="single"
                      selected={event.startDate}
                      onSelect={(date) => {
                        if (!date) return;
                        setEvent({ ...event, startDate: date });
                      }}
                      toDate={event.endDate || undefined}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* END DATE */}
              <div className="flex flex-col gap-1 w-full">
                <Label>ถึง</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      {event.endDate
                        ? format(event.endDate, "PPP")
                        : "เลือกวันที่"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Calendar
                      mode="single"
                      selected={event.endDate}
                      onSelect={(date) => {
                        if (!date) return;
                        setEvent({ ...event, endDate: date });
                      }}
                      fromDate={event.startDate || undefined}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* วันสุดท้ายของการลงทะเบียน */}
      <div className="flex flex-col gap-1 w-full">
        <Label>วันสุดท้ายของการลงทะเบียน *</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              {event.regist ? format(event.regist, "PPP") : "เลือกวันที่"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Calendar
              mode="single"
              selected={event.regist}
              onSelect={(date) => date && setEvent({ ...event, regist: date })}
              toDate={event.startDate || undefined}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* รูปโปรไฟล์ */}
      <div className="flex flex-col gap-2 w-full">
        <Label>รูปโปรไฟล์</Label>

        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = () => {
              const url = reader.result as string;

              setEvent({ ...event, profileURL: url }); // store string
              setPreview(url); // preview
            };
            reader.readAsDataURL(file);
          }}
        />

        {preview && (
          <img
            src={preview}
            className="w-32 h-32 object-cover rounded-md border"
          />
        )}
      </div>
    </div>
  );
}
