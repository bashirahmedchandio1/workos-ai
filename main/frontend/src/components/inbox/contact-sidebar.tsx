"use client"

import { X, Mail, Phone, Calendar, MapPin, Building2, ExternalLink } from "lucide-react"
import type { Conversation, ChannelDef } from "@/lib/inbox/data"

const mockContacts: Record<string, { name: string; email: string; phone: string; company: string; location: string; role: string; notes: string }> = {
  "Alice Johnson": { name: "Alice Johnson", email: "alice.j@example.com", phone: "+1 (555) 111-2233", company: "TechStart Inc", location: "San Francisco, CA", role: "Product Manager", notes: "Met at TechConf 2024. Interested in enterprise plan." },
  "Bob Smith": { name: "Bob Smith", email: "bob.s@designlab.io", phone: "+1 (555) 222-3344", company: "DesignLab", location: "Austin, TX", role: "Lead Designer", notes: "Freelance collaborator on Q2 branding project." },
  "David Wilson": { name: "David Wilson", email: "david.w@acmecorp.com", phone: "+1 (555) 333-4455", company: "Acme Corp", location: "Chicago, IL", role: "Procurement Manager", notes: "Key decision maker for Q4 contract renewal." },
  "Hannah Kim": { name: "Hannah Kim", email: "hannah.k@influence.io", phone: "+1 (555) 444-5566", company: "Influence.io", location: "Los Angeles, CA", role: "Content Creator", notes: "Social media influencer with 50K+ followers." },
}

export function ContactSidebar({
  conversation,
  channel,
  onClose,
}: {
  conversation: Conversation
  channel: ChannelDef
  onClose: () => void
}) {
  const contact = mockContacts[conversation.name]
  if (!contact) return null

  return (
    <div className="flex h-full flex-col border-l border-border bg-surface/50">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="text-sm font-semibold text-text-primary">Contact Info</span>
        <button
          onClick={onClose}
          className="flex items-center justify-center size-7 rounded-lg hover:bg-surface-hover text-text-secondary hover:text-text-primary transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center pt-6 pb-4 px-4 border-b border-border">
          <div
            className="flex items-center justify-center size-16 rounded-full text-white text-xl font-medium mb-3"
            style={{ backgroundColor: channel.color }}
          >
            {contact.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <h2 className="text-base font-semibold text-text-primary">{contact.name}</h2>
          <p className="text-xs text-text-tertiary mt-0.5">{contact.role}</p>
          <button
            className="mt-3 text-xs font-medium text-primary hover:text-primary-hover transition-colors inline-flex items-center gap-1"
          >
            <ExternalLink size={12} />
            View Profile
          </button>
        </div>

        <div className="px-4 py-4 space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Mail size={14} className="text-text-tertiary shrink-0" />
            <span className="text-text-secondary truncate">{contact.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone size={14} className="text-text-tertiary shrink-0" />
            <span className="text-text-secondary truncate">{contact.phone}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Building2 size={14} className="text-text-tertiary shrink-0" />
            <span className="text-text-secondary truncate">{contact.company}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <MapPin size={14} className="text-text-tertiary shrink-0" />
            <span className="text-text-secondary truncate">{contact.location}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar size={14} className="text-text-tertiary shrink-0" />
            <span className="text-text-secondary truncate">Last contact: 2 days ago</span>
          </div>
        </div>

        <div className="px-4 py-4 border-t border-border">
          <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Notes</h3>
          <p className="text-sm text-text-secondary leading-relaxed">{contact.notes}</p>
        </div>
      </div>
    </div>
  )
}
