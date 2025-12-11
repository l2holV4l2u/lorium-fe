import { MapPin } from "lucide-react";

export default function UpcomingEventCard() {
  const upcomingEvent = {
    name: "สอบกลางภาค ภาคเรียนที่ 1/2567",
    date: "21",
    month: "เม.ย.",
    location: "อาคาร A ชั้น 3",
    registrationDeadline: "5 วัน",
    attendees: 156,
    ticketsLeft: 44,
  };

  return (
    <div className="bg-linear-to-br from-primary via-primary/90 to-primary/80 rounded-xl p-5 text-primary-foreground shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-xs opacity-80 mb-1">{upcomingEvent.month}</div>
          <div className="text-3xl font-bold mb-2">{upcomingEvent.date}</div>
          <h2 className="text-lg font-bold mb-1">{upcomingEvent.name}</h2>
          <div className="flex items-center gap-2 text-xs opacity-90">
            <MapPin className="w-3 h-3" />
            {upcomingEvent.location}
          </div>
        </div>
        <button className="px-3 py-1.5 bg-primary-foreground/20 hover:bg-primary-foreground/30 rounded-lg text-xs transition backdrop-blur-sm">
          แก้ไขการสอบ
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3 pt-4 border-t border-primary-foreground/20">
        <div>
          <div className="text-xs opacity-80">เริ่มรับสมัคร</div>
          <div className="text-sm font-semibold">เริ่มแล้ว</div>
        </div>
        <div>
          <div className="text-xs opacity-80">ปิดรับสมัครใน</div>
          <div className="text-sm font-semibold">
            {upcomingEvent.registrationDeadline}
          </div>
        </div>
        <div>
          <div className="text-xs opacity-80">ผู้เข้าสอบ</div>
          <div className="text-sm font-semibold">{upcomingEvent.attendees}</div>
        </div>
        <div>
          <div className="text-xs opacity-80">ที่นั่งเหลือ</div>
          <div className="text-sm font-semibold">
            {upcomingEvent.ticketsLeft}
          </div>
        </div>
      </div>
    </div>
  );
}
