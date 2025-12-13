"use client";

import { useState } from "react";
import {
  Bell,
  Search,
  Plus,
  ChevronDown,
  MapPin,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { useHostSession } from "@lib/useSession";
import { Button } from "@components/ui/button";
import Link from "next/link";

// Mock data for multiple events
const mockEvents = [
  {
    id: 1,
    name: "สอบกลางภาค ภาคเรียนที่ 1/2567",
    date: "21",
    month: "เม.ย.",
    location: "อาคาร A ชั้น 3",
    registrationDeadline: "5 วัน",
    attendees: 156,
    ticketsLeft: 44,
    ticketStats: [
      { type: "VIP", sold: 30, total: 48, colorClass: "stroke-destructive" },
      { type: "Standard", sold: 20, total: 65, colorClass: "stroke-accent" },
      { type: "Economy", sold: 40, total: 48, colorClass: "stroke-secondary" },
    ],
    venueStats: [
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
    ],
    salesData: [2, 1, 4, 5, 3, 6],
  },
  {
    id: 2,
    name: "สอบปลายภาค ภาคเรียนที่ 1/2567",
    date: "15",
    month: "พ.ค.",
    location: "อาคาร B ชั้น 2",
    registrationDeadline: "12 วัน",
    attendees: 243,
    ticketsLeft: 57,
    ticketStats: [
      { type: "VIP", sold: 45, total: 50, colorClass: "stroke-destructive" },
      { type: "Standard", sold: 120, total: 150, colorClass: "stroke-accent" },
      { type: "Economy", sold: 78, total: 100, colorClass: "stroke-secondary" },
    ],
    venueStats: [
      {
        section: "A",
        booked: 50,
        total: 50,
        seats: ["filled", "filled", "filled", "filled", "filled"],
      },
      {
        section: "B",
        booked: 48,
        total: 50,
        seats: ["filled", "filled", "filled", "filled", "empty"],
      },
      {
        section: "C",
        booked: 45,
        total: 50,
        seats: ["filled", "filled", "filled", "filled", "empty"],
      },
      {
        section: "D",
        booked: 40,
        total: 50,
        seats: ["filled", "filled", "filled", "empty", "empty"],
      },
    ],
    salesData: [3, 5, 2, 7, 4, 8],
  },
  {
    id: 3,
    name: "สอบซ่อม ภาคเรียนที่ 2/2566",
    date: "28",
    month: "มี.ค.",
    location: "อาคาร C ชั้น 1",
    registrationDeadline: "2 วัน",
    attendees: 89,
    ticketsLeft: 11,
    ticketStats: [
      { type: "VIP", sold: 15, total: 20, colorClass: "stroke-destructive" },
      { type: "Standard", sold: 44, total: 50, colorClass: "stroke-accent" },
      { type: "Economy", sold: 30, total: 30, colorClass: "stroke-secondary" },
    ],
    venueStats: [
      {
        section: "A",
        booked: 25,
        total: 25,
        seats: ["filled", "filled", "filled", "filled", "filled"],
      },
      {
        section: "B",
        booked: 22,
        total: 25,
        seats: ["filled", "filled", "filled", "filled", "empty"],
      },
      {
        section: "C",
        booked: 20,
        total: 25,
        seats: ["filled", "filled", "filled", "empty", "empty"],
      },
      {
        section: "D",
        booked: 22,
        total: 25,
        seats: ["filled", "filled", "filled", "filled", "empty"],
      },
    ],
    salesData: [1, 2, 3, 2, 4, 3],
  },
];

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
  {
    userName: "ประไพ สุขใจ",
    action: "ชำระเงิน",
    eventName: "สอบกลางภาค",
    time: "3 ชั่วโมง",
    avatar: "PS",
  },
];

export default function RefinedDashboard() {
  const [host] = useHostSession();
  const [selectedEvent, setSelectedEvent] = useState(mockEvents[0]);
  const [showEventDropdown, setShowEventDropdown] = useState(false);

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-3 shrink-0">
        <div className="flex items-center justify-between max-w-[1600px] mx-auto">
          <div className="flex items-center gap-6">
            <div className="text-xl font-bold text-primary">Lorium</div>
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
            <Link href="/host/newexam">
              <Button variant="highlight">
                <Plus className="w-4 h-4" />
                เพิ่มการสอบใหม่
              </Button>
            </Link>
            <div className="relative">
              <Bell className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-foreground" />
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs w-4 h-4 rounded-full flex items-center justify-center">
                3
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-sm font-semibold cursor-pointer">
              H
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="h-full max-w-[1600px] mx-auto p-4">
          <div
            className="grid grid-cols-12 gap-4"
            style={{ height: "calc(100vh - 120px)" }}
          >
            {/* Left Column */}
            <div className="col-span-8 flex flex-col gap-4 h-full">
              {/* Event Card with Selector */}
              <div
                className="bg-linear-to-br from-primary via-primary/90 to-primary/80 rounded-xl p-5 text-primary-foreground shadow-lg"
                style={{ height: "38%" }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative">
                        <button
                          onClick={() =>
                            setShowEventDropdown(!showEventDropdown)
                          }
                          className="flex items-center gap-2 px-3 py-1.5 bg-primary-foreground/20 hover:bg-primary-foreground/30 rounded-lg text-sm transition backdrop-blur-sm"
                        >
                          <Calendar className="w-4 h-4" />
                          {selectedEvent.name}
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        {showEventDropdown && (
                          <div className="absolute top-full left-0 mt-2 bg-card rounded-lg shadow-xl z-10 min-w-[300px] border border-border">
                            {mockEvents.map((event) => (
                              <button
                                key={event.id}
                                onClick={() => {
                                  setSelectedEvent(event);
                                  setShowEventDropdown(false);
                                }}
                                className={`w-full text-left px-4 py-3 hover:bg-muted first:rounded-t-lg last:rounded-b-lg ${
                                  selectedEvent.id === event.id
                                    ? "bg-accent/10"
                                    : ""
                                }`}
                              >
                                <div className="font-semibold text-foreground text-sm">
                                  {event.name}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {event.date} {event.month} • {event.location}
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="text-center">
                        <div className="text-xs opacity-80">
                          {selectedEvent.month}
                        </div>
                        <div className="text-4xl font-bold">
                          {selectedEvent.date}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm opacity-90 mb-2">
                          <MapPin className="w-4 h-4" />
                          {selectedEvent.location}
                        </div>
                      </div>
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
                      {selectedEvent.registrationDeadline}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs opacity-80">ผู้เข้าสอบ</div>
                    <div className="text-sm font-semibold">
                      {selectedEvent.attendees}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs opacity-80">ที่นั่งเหลือ</div>
                    <div className="text-sm font-semibold">
                      {selectedEvent.ticketsLeft}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-4 flex-1">
                {/* Ticket Stats */}
                <div className="bg-card rounded-xl p-4 shadow-sm border border-border flex flex-col">
                  <h3 className="font-semibold mb-3 text-foreground text-sm">
                    ประเภทบัตร
                  </h3>
                  <div className="grid grid-cols-2 gap-3 flex-1 content-center">
                    {selectedEvent.ticketStats.map((ticket, idx) => (
                      <div key={idx} className="text-center">
                        <svg
                          className="w-20 h-20 mx-auto mb-2"
                          viewBox="0 0 100 100"
                        >
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
                      <div className="font-semibold text-foreground text-xs">
                        เพิ่ม
                      </div>
                    </div>
                  </div>
                </div>

                {/* Venue Stats */}
                <div className="bg-card rounded-xl p-4 shadow-sm border border-border flex flex-col">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-foreground text-sm">
                      สถิติห้องสอบ
                    </h3>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground">Section</span>
                      <span className="text-muted-foreground">Booking</span>
                    </div>
                  </div>
                  <div className="space-y-3 flex-1 flex flex-col justify-center">
                    {selectedEvent.venueStats.map((venue, idx) => (
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
              </div>
            </div>

            {/* Right Column */}
            <div className="col-span-4 flex flex-col gap-4 h-full">
              {/* Recent Activity */}
              <div className="bg-card rounded-xl p-4 shadow-sm border border-border flex-1 flex flex-col">
                <h3 className="font-semibold mb-3 text-foreground text-sm">
                  กิจกรรมล่าสุด
                </h3>
                <div className="space-y-3 flex-1 overflow-auto">
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

              {/* Sales Chart */}
              <div className="bg-card rounded-xl p-4 shadow-sm border border-border flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-foreground text-sm">
                    ยอดขายบัตร
                  </h3>
                  <button className="text-xs text-primary hover:text-primary/80">
                    Analytics →
                  </button>
                </div>
                <div className="mb-3">
                  <div className="text-2xl font-bold text-foreground">
                    12{" "}
                    <span className="text-sm font-normal text-muted-foreground">
                      Tickets
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">ขายวันนี้</div>
                </div>
                <div className="relative flex-1 flex items-end gap-1">
                  {selectedEvent.salesData.map((val, idx) => (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center h-full justify-end"
                    >
                      <div
                        className="w-full bg-linear-to-t from-primary to-primary/60 rounded-t"
                        style={{ height: `${(val / 8) * 100}%` }}
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
                    {selectedEvent.salesData.map((v, i) => (
                      <span key={i}>+{v}</span>
                    ))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
