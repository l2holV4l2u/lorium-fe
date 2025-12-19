import { GeneralInfo } from "@components/section/generalInfo";
import { Button } from "@components/ui/button";
import { THAI_MONTH_SHORT } from "@lib/utils/const";
import { Event } from "@lorium/prisma-zod";
import { MapPin, Calendar, DollarSign, Edit2, Save, X } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { Separator } from "@components/ui/separator";
import { trpc } from "@lib/trpc";
import { toast } from "sonner";

export default function Overview({
  event,
  setEvent,
}: {
  event: Event;
  setEvent: (e: Event) => void;
}) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [tempEvent, setTempEvent] = useState<Event>(event);
  const eventUpdateMutation = trpc.event.updateEvent.useMutation();

  const date = new Date(event.startDate);
  const endDate = event.endDate ? new Date(event.endDate) : null;

  const handleSave = async () => {
    try {
      const result = await eventUpdateMutation.mutateAsync(tempEvent);

      if (result.success) {
        console.log(result.event);
        setEvent(result.event);
        setIsEditMode(false);
        toast.success("บันทึกสำเร็จ");
      }
    } catch (error) {
      console.error("Failed to update event:", error);
      toast.error("เกิดข้อผิดพลาด");
    }
  };
  const handleCancel = () => {
    setTempEvent(event);
    setIsEditMode(false);
  };

  console.log("New Event: ", event);

  return (
    <div className="h-full">
      {isEditMode ? (
        <div className="pb-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b">
            <div>
              <h3 className="text-xl font-semibold">แก้ไขข้อมูลการสอบ</h3>
              <p className="text-sm text-muted-foreground mt-1">
                อัพเดทรายละเอียดการสอบของคุณ
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="destructive" onClick={handleCancel}>
                <X size={16} /> ยกเลิก
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save size={16} /> บันทึก
              </Button>
            </div>
          </div>
          <GeneralInfo event={tempEvent} setEvent={setTempEvent} />
        </div>
      ) : (
        <div>
          {/* Header Section */}
          <div className="bg-linear-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground rounded-lg p-6 mb-6 relative overflow-hidden">
            {event.profileURL && (
              <div className="absolute inset-0 opacity-20">
                <img
                  src={event.profileURL}
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="relative space-y-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{event.name}</h2>
                  {event.description && (
                    <p className="opacity-90 line-clamp-2 max-w-3xl">
                      {event.description}
                    </p>
                  )}
                </div>
                <Button
                  size="sm"
                  onClick={() => setIsEditMode(true)}
                  variant="ghost"
                  className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground hover:text-white"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  แก้ไข
                </Button>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
                {/* Date */}
                <div className="flex gap-4">
                  <div className="shrink-0 w-16 h-16 bg-primary-foreground/10 rounded-lg flex flex-col items-center justify-center">
                    <span className="text-sm font-medium uppercase">
                      {THAI_MONTH_SHORT[date.getMonth()]}
                    </span>
                    <span className="text-2xl font-bold">{date.getDate()}</span>
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-sm font-medium uppercase tracking-wider mb-1">
                      วันที่จัดงาน
                    </span>
                    <span className="font-medium">
                      {format(date, "d MMMM yyyy", { locale: th })}
                      {endDate && endDate.getTime() !== date.getTime() && (
                        <span>
                          {" "}
                          - {format(endDate, "d MMM yyyy", { locale: th })}
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Location */}
                {event.location && (
                  <div className="flex gap-4">
                    <div className="shrink-0 w-16 h-16 bg-primary-foreground/10 rounded-lg flex items-center justify-center">
                      <MapPin size={24} />
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-sm font-medium uppercase tracking-wider mb-1">
                        สถานที่
                      </span>
                      <span className="font-medium">{event.location}</span>
                    </div>
                  </div>
                )}

                {/* Registration Deadline */}
                {event.regist && (
                  <div className="flex gap-4">
                    <div className="shrink-0 w-16 h-16 bg-primary-foreground/10 rounded-lg flex items-center justify-center">
                      <Calendar size={24} />
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-sm font-medium uppercase tracking-wider mb-1">
                        ปิดรับสมัคร
                      </span>
                      <span className="font-medium">
                        {format(new Date(event.regist), "d MMMM yyyy", {
                          locale: th,
                        })}
                      </span>
                    </div>
                  </div>
                )}

                {/* Price */}
                <div className="flex gap-4">
                  <div className="shrink-0 w-16 h-16 bg-primary-foreground/10 rounded-lg flex items-center justify-center">
                    <DollarSign size={24} />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-sm font-medium uppercase tracking-wider mb-1">
                      ค่าลงทะเบียน
                    </span>
                    <span className="font-medium">
                      {event.price > 0
                        ? `${event.price.toLocaleString()} บาท`
                        : "ฟรี"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">ชื่อการสอบ</div>
                <div className="font-medium">{event.name}</div>
              </div>

              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">รายละเอียด</div>
                <div className="font-medium">{event.description}</div>
              </div>

              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">สถานที่</div>
                <div className="font-medium">{event.location}</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">
                  วันที่จัดงาน
                </div>
                <div className="font-medium">
                  {format(date, "d MMMM yyyy", { locale: th })}
                  {endDate && endDate.getTime() !== date.getTime() && (
                    <> ถึง {format(endDate, "d MMMM yyyy", { locale: th })}</>
                  )}
                </div>
              </div>

              {event.regist && (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">
                    ปิดรับสมัคร
                  </div>
                  <div className="font-medium">
                    {format(new Date(event.regist), "d MMMM yyyy", {
                      locale: th,
                    })}
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">
                  ค่าลงทะเบียน
                </div>
                <div className="font-medium">
                  {event.price > 0
                    ? `${event.price.toLocaleString()} ฿`
                    : "ฟรี"}
                </div>
              </div>
            </div>

            {event.profileURL && (
              <div className="col-span-2">
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                  รูปโปรไฟล์
                </div>
                <img
                  src={event.profileURL}
                  alt={event.name}
                  className="w-full max-w-lg h-48 object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
