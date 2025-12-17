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
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@components/ui/avatar";
import { Badge } from "@components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import { cn } from "@lib/utils";
import Link from "next/link";

// Mock data for multiple events
const mockEvents = [
  {
    id: 1,
    name: "สอบกลางภาค ภาคเรียนที่ 1/2567",
    description:
      "การสอบกลางภาคสำหรับนักศึกษาทุกคณะ ครอบคลุมเนื้อหาตั้งแต่ต้นภาคเรียนจนถึงสัปดาห์ที่ 7 โปรดตรวจสอบรายชื่อและเวลาสอบล่วงหน้า",
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
    description:
      "การสอบปลายภาคเรียน ใช้เป็นคะแนนหลักในการประเมินผลการเรียน นักศึกษาต้องนำบัตรประจำตัวมาในวันสอบ",
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
    description:
      "การสอบสำหรับนักศึกษาที่ไม่ผ่านเกณฑ์ขั้นต่ำจากการสอบหลัก ตารางสอบอาจมีการเปลี่ยนแปลง",
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

export default function HostDashboard() {
  const [selectedEvent, setSelectedEvent] = useState(mockEvents[0]);
  const [showEventDropdown, setShowEventDropdown] = useState(false);

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-3 shrink-0">
        <div className="flex items-center justify-between max-w-400 mx-auto">
          <div className="flex items-center gap-6">
            <div className="text-xl font-bold text-primary">Lorium</div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="ค้นหาการสอบ..."
                className="pl-10 w-64"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href={"/host/newexam"}>
              <Button>
                <Plus size={16} />
                เพิ่มการสอบใหม่
              </Button>
            </Link>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell />
                  <Badge className="absolute -top-0.5 -right-0.5 h-5 w-5 flex items-center justify-center p-0">
                    3
                  </Badge>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-semibold">การแจ้งเตือน</h4>
                  <p className="text-sm text-muted-foreground">
                    คุณมี 3 การแจ้งเตือนใหม่
                  </p>
                </div>
              </PopoverContent>
            </Popover>

            <Avatar>
              <AvatarFallback className="bg-linear-to-br from-primary to-secondary text-primary-foreground">
                H
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="h-full max-w-400 mx-auto p-4">
          <div className="grid grid-cols-12 gap-4 h-full">
            {/* Left Column */}
            <div className="col-span-8 flex flex-col gap-4 h-full">
              {/* Event Card with Selector */}
              <Card className="bg-linear-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground border-0 shadow-lg h-2/5">
                <CardContent className="p-5">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <DropdownMenu
                        open={showEventDropdown}
                        onOpenChange={setShowEventDropdown}
                      >
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground"
                          >
                            <Calendar />
                            <div className="text-base">
                              {selectedEvent.name}
                            </div>
                            <ChevronDown />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="min-w-75 space-y-2">
                          {mockEvents.map((event) => (
                            <DropdownMenuItem
                              key={event.id}
                              onClick={() => setSelectedEvent(event)}
                              className={cn(
                                selectedEvent.id === event.id && "bg-accent"
                              )}
                            >
                              <div>
                                <div className="font-semibold text-base">
                                  {event.name}
                                </div>
                                <div className="text-sm text-muted-foreground mt-1">
                                  {event.date} {event.month} • {event.location}
                                </div>
                              </div>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Link href={"/host/" + selectedEvent.id}>
                        <Button
                          variant="ghost"
                          className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground"
                        >
                          ดูรายละเอียดการสอบ <ExternalLink />
                        </Button>
                      </Link>
                    </div>
                    <div className="flex w-full h-full justify-between">
                      <div className="text-center">
                        <div className="text-sm opacity-80">
                          {selectedEvent.month}
                        </div>
                        <div className="text-4xl font-bold">
                          {selectedEvent.date}
                        </div>
                      </div>
                      <div className="w-96 flex flex-col items-end">
                        {selectedEvent.description && (
                          <p className="text-sm opacity-90 line-clamp-2 mb-2 text-end">
                            {selectedEvent.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-sm opacity-90 w-fit">
                          <MapPin className="w-4 h-4 shrink-0" />
                          <span>{selectedEvent.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3 pt-4 border-t border-primary-foreground/20">
                    <div>
                      <div className="text-sm opacity-80">เริ่มรับสมัคร</div>
                      <div className="text-xl font-semibold">เริ่มแล้ว</div>
                    </div>
                    <div>
                      <div className="text-sm opacity-80">ปิดรับสมัครใน</div>
                      <div className="text-xl font-semibold">
                        {selectedEvent.registrationDeadline}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm opacity-80">ผู้เข้าสอบ</div>
                      <div className="text-xl font-semibold">
                        {selectedEvent.attendees}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm opacity-80">ที่นั่งเหลือ</div>
                      <div className="text-xl font-semibold">
                        {selectedEvent.ticketsLeft}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-4 flex-1">
                {/* Ticket Stats */}
                <Card className="flex flex-col">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl">ประเภทบัตร</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex items-center">
                    <div className="grid grid-cols-2 gap-3 w-full">
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
                          <div className="font-semibold text-xs">
                            {ticket.type}
                          </div>
                        </div>
                      ))}
                      <div className="text-center flex flex-col items-center justify-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-20 h-20 rounded-full border-dashed mb-2"
                        >
                          <Plus className="w-6 h-6" />
                        </Button>
                        <div className="font-semibold text-xs">เพิ่ม</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Venue Stats */}
                <Card className="flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-sm">สถิติห้องสอบ</CardTitle>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Section</span>
                        <span>Booking</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex items-center">
                    <div className="space-y-3 w-full">
                      {selectedEvent.venueStats.map((venue, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <Badge
                            variant="outline"
                            className="w-6 h-6 flex items-center justify-center p-0"
                          >
                            {venue.section}
                          </Badge>
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
                              <Badge variant="secondary" className="h-5 px-1.5">
                                ✓
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-span-4 flex flex-col gap-4 h-full">
              {/* Recent Activity */}
              <Card className="flex-1 flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl">กิจกรรมล่าสุด</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto">
                  <div className="space-y-3">
                    {recentActivity.map((activity, idx) => (
                      <div key={idx} className="flex gap-3 items-center">
                        <Avatar className="h-10 w-10 shrink-0">
                          <AvatarFallback className="bg-linear-to-br from-primary to-secondary text-primary-foreground text-sm">
                            {activity.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">
                            <span className="font-semibold">
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
                </CardContent>
              </Card>

              {/* Sales Chart */}
              <Card className="flex-1 flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">ยอดสมัครสอบ</CardTitle>
                    <Button variant="link" size="sm" className="h-auto p-0">
                      การวิเคราะห์ <ArrowRight />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="mb-4">
                    <div className="text-2xl font-bold">
                      12{" "}
                      <span className="text-sm font-normal text-muted-foreground">
                        คนสมัครวันนี้
                      </span>
                    </div>
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
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
