import type { SVGProps } from "react"
import { FaFacebookMessenger, FaWhatsapp, FaInstagram, FaSlack } from "react-icons/fa6"

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

export function GmailIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.91 12 9.548l6.545-4.637 1.528-1.418C21.691 2.28 24 3.434 24 5.457Z" fill="#4285F4"/>
    </svg>
  )
}

export function GoogleSheetsIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="3" fill="#0F9D58"/>
      <path d="M6 7h12M6 10.5h12M6 14h8" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
      <rect x="9" y="16.5" width="3" height="3" rx="0.5" fill="#fff"/>
    </svg>
  )
}

export function GoogleCalendarIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="3" fill="#4285F4"/>
      <rect x="3" y="5" width="18" height="3" rx="0.5" fill="#fff" opacity="0.9"/>
      <text x="12" y="18" textAnchor="middle" fill="#fff" fontSize="8" fontFamily="Arial" fontWeight="bold">31</text>
    </svg>
  )
}

export function NotionIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.047-.513.326-.373.513l1.822 1.4ZM5.588 6.642v14.546c0 .513.42.653.887.606l14.44-.886c.466-.047.606-.42.606-.793V5.708c0-.373-.14-.56-.56-.513l-14.887.887c-.326.047-.513.233-.513.56h.027Z" fill="#fff"/>
      <path d="M20.375 5.708c0-.373-.14-.56-.56-.513l-14.887.887c-.326.047-.513.233-.513.56v14.546c0 .373.373.513.793.46l14.44-.887c.466-.047.606-.326.606-.7V5.709h-.046v-.001ZM8.35 7.23c.466-.047 1.026-.093 1.633-.14l.233.747-.42-.047c-.186 0-.326.047-.326.28v9.773c-.56.047-1.073.093-1.586.14V8.565c-.7.047-1.306.093-1.96.14l-.28-.793c.56-.093 1.12-.187 1.726-.28l.98-.402Z" fill="#111"/>
    </svg>
  )
}

export function GoogleFormsIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#673AB7"/>
      <rect x="5" y="5" width="14" height="2" rx="0.5" fill="#fff" opacity="0.9"/>
      <rect x="5" y="9.5" width="10" height="2" rx="0.5" fill="#fff" opacity="0.7"/>
      <rect x="5" y="14" width="8" height="2" rx="0.5" fill="#fff" opacity="0.6"/>
      <rect x="5" y="18.5" width="6" height="1.5" rx="0.5" fill="#fff" opacity="0.4"/>
      <circle cx="17" cy="17" r="4" fill="#fff" opacity="0.3"/>
      <path d="M17 15v4m-2-2h4" stroke="#673AB7" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )
}

type ConnectorIconMap = Record<string, React.ComponentType<IconProps>>

export const connectorIcons: ConnectorIconMap = {
  gmail: GmailIcon,
  "google-sheets": GoogleSheetsIcon,
  "google-calendar": GoogleCalendarIcon,
  "google-forms": GoogleFormsIcon,
  notion: NotionIcon,
  slack: FaSlack as unknown as React.ComponentType<IconProps>,
  messenger: FaFacebookMessenger as unknown as React.ComponentType<IconProps>,
  whatsapp: FaWhatsapp as unknown as React.ComponentType<IconProps>,
  instagram: FaInstagram as unknown as React.ComponentType<IconProps>,
}

export function ConnectorIcon({ connector, size = 20, ...props }: IconProps & { connector: string }) {
  const Icon = connectorIcons[connector]
  if (!Icon) {
    return (
      <div
        style={{ width: size, height: size }}
        className="flex items-center justify-center rounded bg-surface text-text-tertiary text-xs font-bold"
      >
        {connector.charAt(0).toUpperCase()}
      </div>
    )
  }
  return <Icon size={size} {...props} />
}
