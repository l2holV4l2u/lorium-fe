"use client";

import { useHostSession } from "@lib/useSession";
import DashboardHeader from "./header";
import UpcomingEventCard from "./upcoming";
import TicketStats from "./ticketStats";
import VenueStats from "./venueStats";
import RecentActivity from "./recent";
import SalesChart from "./salesChart";

export default function HostedIndex() {
  const [hostUser] = useHostSession();

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <DashboardHeader hostUser={hostUser} />

      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-[1600px] mx-auto p-4">
          <div className="grid grid-cols-12 gap-4 h-full">
            {/* Left Column */}
            <div className="col-span-8 flex flex-col gap-3 h-full">
              <div className="shrink-0">
                <UpcomingEventCard />
              </div>
              <div className="flex-1 grid grid-cols-2 gap-3 min-h-0">
                <TicketStats />
                <VenueStats />
              </div>
            </div>

            {/* Right Column */}
            <div className="col-span-4 flex flex-col gap-3 h-full">
              <div className="flex-1 min-h-0">
                <RecentActivity />
              </div>
              <div className="flex-1 min-h-0">
                <SalesChart />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
