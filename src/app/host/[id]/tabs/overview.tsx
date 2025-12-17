import { GeneralInfo } from "@components/section/generalInfo";
import { Card, CardContent } from "@components/ui/card";
import { THAI_MONTH_SHORT } from "@lib/utils/const";
import { Event } from "@lorium/prisma-zod";
import { MapPin } from "lucide-react";

export default function Overview({
  event,
  setEvent,
}: {
  event: Event;
  setEvent: (e: Event) => void;
}) {
  const date = new Date(event.startDate);

  return (
    <div className="space-y-4">
      <Card className="bg-linear-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground border-0 shadow-lg h-2/5">
        <CardContent className="p-5">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              {event.name}
            </div>
            <div className="flex w-full h-full justify-between">
              <div className="text-center">
                <div className="text-sm opacity-80">
                  {THAI_MONTH_SHORT[date.getMonth()]}
                </div>
                <div className="text-4xl font-bold">{date.getDay()}</div>
              </div>
              <div className="w-96 flex flex-col items-end">
                {event.description && (
                  <p className="text-sm opacity-90 line-clamp-2 mb-2 text-end">
                    {event.description}
                  </p>
                )}
                <div className="flex items-center gap-2 text-sm opacity-90 w-fit">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <GeneralInfo event={event} setEvent={setEvent} />
    </div>
  );
}
