import { TrendingUp } from "lucide-react";

export default function SalesChart() {
  return (
    <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-foreground text-sm">ยอดขายบัตร</h3>
        <button className="text-xs text-primary hover:text-primary/80">
          Analytics →
        </button>
      </div>
      <div className="mb-2">
        <div className="text-2xl font-bold text-foreground">
          12{" "}
          <span className="text-sm font-normal text-muted-foreground">
            Tickets
          </span>
        </div>
        <div className="text-xs text-muted-foreground">ขายวันนี้</div>
      </div>
      <div className="relative h-24 flex items-end gap-1 mt-4">
        {[2, 1, 4, 5, 3, 6].map((val, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center">
            <div
              className="w-full bg-linear-to-t from-primary to-primary/60 rounded-t"
              style={{ height: `${val * 15}%` }}
            />
            <div className="text-xs text-muted-foreground mt-1.5">
              {["06", "08", "09", "10", "11", "12"][idx]}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2 text-xs">
        <span className="text-secondary flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          +2
        </span>
        <span className="text-secondary">+1</span>
        <span className="text-secondary">+4</span>
        <span className="text-secondary">+5</span>
      </div>
    </div>
  );
}
