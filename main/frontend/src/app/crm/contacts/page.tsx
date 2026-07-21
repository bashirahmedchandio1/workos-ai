import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Users, Mail, Phone, Building2, MapPin } from "lucide-react"

export const dynamic = "force-dynamic"

const contacts = [
  { name: "Sarah Chen", email: "sarah.chen@acmecorp.com", phone: "+1 (555) 123-4567", company: "Acme Corp", location: "San Francisco, CA", role: "VP of Sales", status: "active" },
  { name: "Michael Torres", email: "michael.t@techstart.io", phone: "+1 (555) 234-5678", company: "TechStart Inc", location: "Austin, TX", role: "CTO", status: "active" },
  { name: "Priya Patel", email: "priya.patel@globex.co", phone: "+1 (555) 345-6789", company: "Globex Co", location: "New York, NY", role: "Procurement Manager", status: "active" },
  { name: "Alex Nakamura", email: "alex.n@devshop.io", phone: "+1 (555) 456-7890", company: "DevShop", location: "Seattle, WA", role: "Engineering Lead", status: "active" },
  { name: "James Wilson", email: "james.w@innovert.com", phone: "+1 (555) 567-8901", company: "InnoVert", location: "Chicago, IL", role: "Operations Director", status: "inactive" },
  { name: "Emily Rodriguez", email: "emily.r@datalake.io", phone: "+1 (555) 678-9012", company: "DataLake Inc", location: "Denver, CO", role: "Head of Data", status: "active" },
  { name: "David Kim", email: "david.k@cloudnine.com", phone: "+1 (555) 789-0123", company: "CloudNine", location: "Portland, OR", role: "CEO", status: "lead" },
  { name: "Lisa Thompson", email: "lisa.t@nexus.biz", phone: "+1 (555) 890-1234", company: "Nexus Corp", location: "Boston, MA", role: "Marketing Director", status: "active" },
]

const statusStyles: Record<string, string> = {
  active: "bg-success/10 text-success",
  inactive: "bg-surface-secondary text-text-tertiary",
  lead: "bg-primary-muted text-primary",
}

export default async function CRMContactsPage() {
  const { isAuthenticated } = await auth()
  if (!isAuthenticated) redirect("/sign-in")

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-text-primary">Contacts</h1>
        <p className="text-sm text-text-secondary">{contacts.length} total contacts</p>
      </div>

      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-background/50">
          <Users size={16} className="text-text-tertiary" />
          <span className="text-xs font-medium text-text-secondary">All Contacts</span>
        </div>

        <div className="divide-y divide-border">
          {contacts.map((contact, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3 hover:bg-surface-hover transition-colors cursor-pointer">
              <div className="flex items-center justify-center size-9 rounded-full bg-primary-muted text-primary text-sm font-medium shrink-0">
                {contact.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-medium text-text-primary">{contact.name}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] ${statusStyles[contact.status] || statusStyles.inactive}`}>
                    {contact.status}
                  </span>
                </div>
                <p className="text-xs text-text-secondary">{contact.role} at {contact.company}</p>
              </div>
              <div className="hidden sm:flex items-center gap-3 text-text-tertiary">
                <div className="flex items-center gap-1">
                  <Mail size={12} />
                  <span className="text-xs">{contact.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Building2 size={12} />
                  <span className="text-xs">{contact.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
