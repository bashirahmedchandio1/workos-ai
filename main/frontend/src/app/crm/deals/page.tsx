import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Briefcase, Building2, User } from "lucide-react"

export const dynamic = "force-dynamic"

const deals = [
  { name: "Enterprise Platform License", company: "Acme Corp", contact: "Sarah Chen", value: "$48,000", stage: "negotiation", probability: "70%" },
  { name: "Startup Growth Pack", company: "TechStart Inc", contact: "Michael Torres", value: "$12,000", stage: "proposal", probability: "50%" },
  { name: "Data Analytics Suite", company: "DataLake Inc", contact: "Emily Rodriguez", value: "$36,000", stage: "discovery", probability: "25%" },
  { name: "Cloud Migration Service", company: "CloudNine", contact: "David Kim", value: "$24,000", stage: "closed_won", probability: "100%" },
  { name: "Contract Renewal", company: "Globex Co", contact: "Priya Patel", value: "$18,000", stage: "negotiation", probability: "80%" },
  { name: "DevOps Tooling License", company: "DevShop", contact: "Alex Nakamura", value: "$9,600", stage: "proposal", probability: "45%" },
  { name: "Marketing Analytics", company: "Nexus Corp", contact: "Lisa Thompson", value: "$15,000", stage: "discovery", probability: "20%" },
  { name: "Infrastructure Upgrade", company: "InnoVert", contact: "James Wilson", value: "$28,000", stage: "closed_lost", probability: "0%" },
]

const stageConfig: Record<string, { label: string; color: string; bar: string }> = {
  discovery: { label: "Discovery", color: "text-blue-500 bg-blue-500/10", bar: "bg-blue-500 w-1/4" },
  proposal: { label: "Proposal", color: "text-amber-500 bg-amber-500/10", bar: "bg-amber-500 w-2/4" },
  negotiation: { label: "Negotiation", color: "text-violet-500 bg-violet-500/10", bar: "bg-violet-500 w-3/4" },
  closed_won: { label: "Closed Won", color: "text-success bg-success/10", bar: "bg-success w-full" },
  closed_lost: { label: "Closed Lost", color: "text-destructive bg-destructive/10", bar: "bg-destructive w-full" },
}

const totalValue = deals
  .filter((d) => d.stage !== "closed_lost")
  .reduce((sum, d) => sum + Number(d.value.replace(/[^0-9.-]+/g, "")), 0)

export default async function CRMDealsPage() {
  const { isAuthenticated } = await auth()
  if (!isAuthenticated) redirect("/sign-in")

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-text-primary">Deals</h1>
        <p className="text-sm text-text-secondary">Pipeline value: ${totalValue.toLocaleString()}</p>
      </div>

      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-background/50">
          <Briefcase size={16} className="text-text-tertiary" />
          <span className="text-xs font-medium text-text-secondary">Sales Pipeline</span>
        </div>

        <div className="divide-y divide-border">
          {deals.map((deal, i) => {
            const stage = stageConfig[deal.stage] || stageConfig.discovery
            return (
              <div key={i} className="px-4 py-3 hover:bg-surface-hover transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-sm font-medium text-text-primary">{deal.name}</span>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-text-tertiary">
                      <span className="flex items-center gap-1">
                        <Building2 size={12} />
                        {deal.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <User size={12} />
                        {deal.contact}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-text-primary">{deal.value}</span>
                    <div className="mt-0.5">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] ${stage.color}`}>
                        {stage.label}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-surface-secondary overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${stage.bar}`} />
                  </div>
                  <span className="text-[10px] text-text-tertiary w-8 text-right">{deal.probability}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
