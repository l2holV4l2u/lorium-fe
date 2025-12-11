import { HostUser } from "@type/user";
import { Bell, Search, Plus, ChevronDown } from "lucide-react";

export default function DashboardHeader({
  hostUser,
}: {
  hostUser: HostUser | null;
}) {
  return (
    <div className="bg-card border-b border-border px-6 py-3 shrink-0">
      <div className="flex items-center justify-between max-w-[1600px] mx-auto">
        <div className="flex items-center gap-6">
          <div className="text-xl font-bold text-primary">Loreum</div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="ค้นหาการสอบ..."
              className="pl-10 pr-4 py-1.5 bg-muted rounded-lg w-64 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-1.5 rounded-lg flex items-center gap-2 transition text-sm">
            <Plus className="w-4 h-4" />
            สร้างการสอบใหม่
            <ChevronDown className="w-3 h-3" />
          </button>
          <div className="relative">
            <Bell className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-foreground" />
            <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs w-4 h-4 rounded-full flex items-center justify-center">
              3
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-sm font-semibold cursor-pointer">
            {hostUser?.name?.[0] || "H"}
          </div>
        </div>
      </div>
    </div>
  );
}
