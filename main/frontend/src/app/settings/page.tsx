import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { User, Palette, Bell, Key } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function SettingsPage() {
  const { isAuthenticated } = await auth()
  if (!isAuthenticated) redirect("/sign-in")

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-text-primary">Settings</h1>
        <p className="text-sm text-text-secondary">Manage your account and application preferences</p>
      </div>

      <div className="space-y-4">
        <SettingCard
          icon={<User size={16} />}
          title="Profile"
          description="Manage your name, email, and profile picture"
        />
        <SettingCard
          icon={<Palette size={16} />}
          title="Appearance"
          description="Customize the look and feel of the application"
        />
        <SettingCard
          icon={<Bell size={16} />}
          title="Notifications"
          description="Configure email and in-app notification preferences"
        />
        <SettingCard
          icon={<Key size={16} />}
          title="API Keys"
          description="Manage API keys for programmatic access"
        />
      </div>
    </div>
  )
}

function SettingCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <button className="flex w-full items-center gap-4 rounded-xl border border-border bg-surface p-4 text-left hover:border-primary/30 hover:shadow-sm transition-all">
      <div className="flex size-10 items-center justify-center rounded-lg bg-surface-secondary text-text-tertiary">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-medium text-text-primary">{title}</h3>
        <p className="text-xs text-text-secondary">{description}</p>
      </div>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-text-tertiary"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  )
}
