import { Plus } from "lucide-react";

export default function TicketStats() {
  const ticketStats = [
    { type: "VIP", sold: 30, total: 48, colorClass: "stroke-destructive" },
    { type: "Standard", sold: 20, total: 65, colorClass: "stroke-accent" },
    { type: "Economy", sold: 40, total: 48, colorClass: "stroke-secondary" },
  ];

  return (
    <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
      <h3 className="font-semibold mb-3 text-foreground text-sm">ประเภทบัตร</h3>
      <div className="grid grid-cols-2 gap-3">
        {ticketStats.map((ticket, idx) => (
          <div key={idx} className="text-center">
            <svg className="w-20 h-20 mx-auto mb-2" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                className="stroke-muted"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                className={ticket.colorClass}
                strokeWidth="8"
                strokeDasharray={`${
                  (ticket.sold / ticket.total) * 251.2
                } 251.2`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
              <text
                x="50"
                y="48"
                textAnchor="middle"
                fontSize="18"
                fontWeight="bold"
                className="fill-foreground"
              >
                {ticket.sold}
              </text>
              <text
                x="50"
                y="62"
                textAnchor="middle"
                fontSize="9"
                className="fill-muted-foreground"
              >
                /{ticket.total}
              </text>
            </svg>
            <div className="font-semibold text-foreground text-xs">
              {ticket.type}
            </div>
          </div>
        ))}
        <div className="text-center flex flex-col items-center justify-center">
          <div className="w-20 h-20 border-2 border-dashed border-border rounded-full flex items-center justify-center mb-2 cursor-pointer hover:border-primary hover:bg-primary/5 transition">
            <Plus className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="font-semibold text-foreground text-xs">เพิ่ม</div>
        </div>
      </div>
    </div>
  );
}
