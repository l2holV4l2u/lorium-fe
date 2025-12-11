export default function VenueStats() {
  const venueStats = [
    {
      section: "A",
      booked: 30,
      total: 48,
      seats: ["filled", "filled", "filled", "empty", "empty"],
    },
    {
      section: "B",
      booked: 13,
      total: 32,
      seats: ["filled", "filled", "empty", "empty", "empty"],
    },
    {
      section: "C",
      booked: 14,
      total: 28,
      seats: ["filled", "filled", "filled", "empty", "empty"],
    },
    {
      section: "D",
      booked: 45,
      total: 45,
      seats: ["filled", "filled", "filled", "filled", "filled"],
    },
  ];

  return (
    <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-foreground text-sm">สถิติห้องสอบ</h3>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Section</span>
          <span className="text-muted-foreground">Booking</span>
        </div>
      </div>
      <div className="space-y-2.5">
        {venueStats.map((venue, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className="w-6 text-center font-semibold text-foreground text-sm">
              {venue.section}
            </div>
            <div className="flex-1 flex items-center gap-2">
              <div className="text-xs text-muted-foreground w-14">
                {venue.booked}/{venue.total}
              </div>
              <div className="flex gap-1 flex-1">
                {venue.seats.map((seat, seatIdx) => (
                  <div
                    key={seatIdx}
                    className={`h-4 flex-1 rounded ${
                      seat === "filled"
                        ? idx % 3 === 0
                          ? "bg-destructive"
                          : idx % 3 === 1
                          ? "bg-accent"
                          : "bg-secondary"
                        : "bg-muted"
                    }`}
                  />
                ))}
              </div>
              {venue.booked === venue.total && (
                <span className="text-secondary text-xs">✓</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
