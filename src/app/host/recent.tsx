export default function RecentActivity() {
  const recentActivity = [
    {
      userName: "สมชาย ใจดี",
      action: "ลงทะเบียน",
      eventName: "สอบกลางภาค",
      time: "3 นาทีที่แล้ว",
      avatar: "SC",
    },
    {
      userName: "สมหญิง รักเรียน",
      action: "ชำระเงิน",
      eventName: "สอบปลายภาค",
      time: "1 ชั่วโมง",
      avatar: "SR",
    },
    {
      userName: "วิชัย มานะ",
      action: "ลงทะเบียน",
      eventName: "สอบย่อย",
      time: "2 ชั่วโมง",
      avatar: "VM",
    },
  ];

  return (
    <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
      <h3 className="font-semibold mb-3 text-foreground text-sm">
        กิจกรรมล่าสุด
      </h3>
      <div className="space-y-3">
        {recentActivity.map((activity, idx) => (
          <div key={idx} className="flex gap-2.5">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-xs font-semibold shrink-0">
              {activity.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs">
                <span className="font-semibold text-foreground">
                  {activity.userName}
                </span>
                <span className="text-muted-foreground">
                  {" "}
                  {activity.action}{" "}
                </span>
                <span className="font-medium text-primary">
                  {activity.eventName}
                </span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
