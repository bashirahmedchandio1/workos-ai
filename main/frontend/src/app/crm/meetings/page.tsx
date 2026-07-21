import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Calendar, Clock, User, Video, MapPin } from "lucide-react"

export const dynamic = "force-dynamic"

const meetings = [
  { title: "Enterprise Demo - Acme Corp", organizer: "You", date: "Today", time: "2:00 PM - 3:00 PM", type: "video", location: "Google Meet" },
  { title: "Weekly Sales Sync", organizer: "You", date: "Today", time: "3:30 PM - 4:00 PM", type: "video", location: "Zoom" },
  { title: "Contract Review with Priya Patel", organizer: "Priya Patel", date: "Tomorrow", time: "10:00 AM - 11:00 AM", type: "video", location: "Google Meet" },
  { title: "Product Roadmap Presentation", organizer: "Alex K.", date: "Tomorrow", time: "2:00 PM - 3:30 PM", type: "in_person", location: "Conference Room A" },
  { title: "Q3 Strategy Planning", organizer: "You", date: "Jul 24", time: "9:00 AM - 10:30 AM", type: "video", location: "Microsoft Teams" },
  { title: "Lunch with Michael Torres", organizer: "Michael Torres", date: "Jul 24", time: "12:30 PM - 1:30 PM", type: "in_person", location: "The Italian Place" },
  { title: "DataLake Requirements Workshop", organizer: "Emily Rodriguez", date: "Jul 25", time: "1:00 PM - 3:00 PM", type: "video", location: "Google Meet" },
  { title: "Board Meeting", organizer: "Board", date: "Jul 26", time: "11:00 AM - 12:00 PM", type: "video", location: "Zoom" },
]

const typeIcons: Record<string, React.ElementType> = {
  video: Video,
  in_person: MapPin,
}

const typeLabels: Record<string, string> = {
  video: "Video Call",
  in_person: "In Person",
}

export default async function CRMMeetingsPage() {
  const { isAuthenticated } = await auth()
  if (!isAuthenticated) redirect("/sign-in")

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-text-primary">Meetings</h1>
        <p className="text-sm text-text-secondary">{meetings.length} upcoming meetings</p>
      </div>

      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-background/50">
          <Calendar size={16} className="text-text-tertiary" />
          <span className="text-xs font-medium text-text-secondary">Upcoming Meetings</span>
        </div>

        <div className="divide-y divide-border">
          {meetings.map((meeting, i) => {
            const TypeIcon = typeIcons[meeting.type] || Video
            return (
              <div key={i} className="flex items-center gap-4 px-4 py-3 hover:bg-surface-hover transition-colors cursor-pointer">
                <div className="flex items-center justify-center size-10 rounded-lg bg-primary-muted text-primary shrink-0">
                  <Calendar size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-text-primary">{meeting.title}</span>
                  <div className="flex items-center gap-3 mt-1 text-xs text-text-tertiary">
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {meeting.date}, {meeting.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <User size={11} />
                      {meeting.organizer}
                    </span>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <span className="flex items-center gap-1 text-xs text-text-tertiary justify-end">
                    <TypeIcon size={12} />
                    {typeLabels[meeting.type]}
                  </span>
                  <p className="text-xs text-text-tertiary mt-0.5">{meeting.location}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
