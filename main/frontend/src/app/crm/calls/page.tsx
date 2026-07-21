import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, User, Clock } from "lucide-react"

export const dynamic = "force-dynamic"

const calls = [
  { contact: "Sarah Chen", company: "Acme Corp", type: "outgoing", duration: "12:34", date: "Today, 2:30 PM", status: "completed" },
  { contact: "Michael Torres", company: "TechStart Inc", type: "incoming", duration: "8:15", date: "Today, 11:00 AM", status: "completed" },
  { contact: "Priya Patel", company: "Globex Co", type: "missed", duration: "-", date: "Today, 9:45 AM", status: "missed" },
  { contact: "Alex Nakamura", company: "DevShop", type: "outgoing", duration: "22:08", date: "Yesterday, 4:20 PM", status: "completed" },
  { contact: "James Wilson", company: "InnoVert", type: "incoming", duration: "5:42", date: "Yesterday, 1:15 PM", status: "completed" },
  { contact: "Emily Rodriguez", company: "DataLake Inc", type: "missed", duration: "-", date: "Yesterday, 10:30 AM", status: "missed" },
  { contact: "David Kim", company: "CloudNine", type: "outgoing", duration: "18:22", date: "Jul 20, 3:00 PM", status: "completed" },
  { contact: "Lisa Thompson", company: "Nexus Corp", type: "incoming", duration: "15:10", date: "Jul 19, 11:30 AM", status: "completed" },
  { contact: "Sarah Chen", company: "Acme Corp", type: "missed", duration: "-", date: "Jul 18, 4:15 PM", status: "missed" },
]

const callIcons: Record<string, React.ElementType> = {
  incoming: PhoneIncoming,
  outgoing: PhoneOutgoing,
  missed: PhoneMissed,
}

const callStyles: Record<string, string> = {
  incoming: "text-emerald-500",
  outgoing: "text-blue-500",
  missed: "text-rose-500",
}

export default async function CRMCallsPage() {
  const { isAuthenticated } = await auth()
  if (!isAuthenticated) redirect("/sign-in")

  const missedCount = calls.filter((c) => c.status === "missed").length

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-text-primary">Calls</h1>
        <p className="text-sm text-text-secondary">{missedCount} missed calls</p>
      </div>

      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-background/50">
          <Phone size={16} className="text-text-tertiary" />
          <span className="text-xs font-medium text-text-secondary">Call Log</span>
        </div>

        <div className="divide-y divide-border">
          {calls.map((call, i) => {
            const CallIcon = callIcons[call.type] || Phone
            return (
              <div key={i} className="flex items-center gap-4 px-4 py-3 hover:bg-surface-hover transition-colors cursor-pointer">
                <div className={`${callStyles[call.type]} shrink-0`}>
                  <CallIcon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-text-primary">{call.contact}</span>
                    <span className={`text-[10px] rounded-full px-1.5 py-0.5 ${
                      call.status === "missed" ? "bg-rose-500/10 text-rose-500" : "bg-surface-secondary text-text-tertiary"
                    }`}>
                      {call.status === "missed" ? "Missed" : call.type === "incoming" ? "Incoming" : "Outgoing"}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary">{call.company}</p>
                </div>
                <div className="text-right text-xs text-text-tertiary">
                  <div className="flex items-center gap-1 justify-end">
                    <Clock size={11} />
                    <span>{call.duration}</span>
                  </div>
                  <p className="mt-0.5">{call.date}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
