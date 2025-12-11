import { Card } from "@components/ui/card";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { Event } from "prisma/generated/zod";
import { useState } from "react";

export function EventCard({
  event,
  asRegister,
}: {
  event: Event;
  asRegister?: boolean;
}) {
  const { profileURL, name, description, id } = event;
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Link
      href={asRegister ? `/dashboard/home/${id}` : `./${id}`}
      onClick={() => setIsLoading(true)}
    >
      <Card className="w-full p-2 h-full flex flex-col gap-2 text-sm relative">
        {isLoading && (
          <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-sm flex items-center justify-center rounded-xl">
            <LoaderCircle
              size={24}
              strokeWidth={1.5}
              className="animate-spin"
            />
          </div>
        )}
        <img
          src={profileURL || undefined}
          className="w-full aspect-4/3 object-contain rounded-xl"
        />
        <div className="flex flex-col gap-1 flex-1 overflow-hidden">
          <h1 className="text-xl font-semibold line-clamp-1">{name}</h1>
          <div className="line-clamp-2 font-medium text-muted-foreground">
            {description}
          </div>
        </div>
      </Card>
    </Link>
  );
}
