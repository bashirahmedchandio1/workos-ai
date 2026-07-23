export interface Message {
  id: string
  from: string
  senderName: string
  content: string
  time: string
  timestamp: number
  isMine?: boolean
}

export interface Conversation {
  id: string
  name: string
  avatar: string
  lastMessage: string
  time: string
  unread: boolean
  online?: boolean
  messages: Message[]
}

export interface ChannelDef {
  key: string
  label: string
  color: string
  bgColor: string
}

export const channels: ChannelDef[] = [
  { key: "messenger", label: "Messenger", color: "#0084FF", bgColor: "bg-[#0084FF]/10" },
  { key: "whatsapp", label: "WhatsApp", color: "#25D366", bgColor: "bg-[#25D366]/10" },
  { key: "instagram", label: "Instagram", color: "#E4405F", bgColor: "bg-[#E4405F]/10" },
  { key: "slack", label: "Slack", color: "#4A154B", bgColor: "bg-[#4A154B]/10" },
]

export const channelData: Record<string, Conversation[]> = {
  slack: [
    {
      id: "slack-1",
      name: "#general",
      avatar: "#general",
      lastMessage: "Mike Torres: Reminder: All-hands meeting at 3pm today 📢",
      time: "15m ago",
      unread: true,
      messages: [
        { id: "s1", from: "#general", senderName: "Mike Torres", content: "Reminder: All-hands meeting at 3pm today 📢", time: "15m ago", timestamp: Date.now() - 900000 },
        { id: "s2", from: "#general", senderName: "Sarah Chen", content: "Got it, thanks Mike!", time: "14m ago", timestamp: Date.now() - 840000, isMine: true },
        { id: "s3", from: "#general", senderName: "Alex K.", content: "Will the Q3 roadmap be discussed?", time: "13m ago", timestamp: Date.now() - 780000 },
      ],
    },
    {
      id: "slack-2",
      name: "#engineering",
      avatar: "#engineering",
      lastMessage: "Alex K.: PR #284 is ready for review",
      time: "1h ago",
      unread: true,
      messages: [
        { id: "s4", from: "#engineering", senderName: "Alex K.", content: "PR #284 is ready for review — adds Slack integration support", time: "1h ago", timestamp: Date.now() - 3600000 },
        { id: "s5", from: "#engineering", senderName: "David K.", content: "Nice, I'll review it this afternoon", time: "55m ago", timestamp: Date.now() - 3300000 },
      ],
    },
    {
      id: "slack-3",
      name: "#design",
      avatar: "#design",
      lastMessage: "Sarah Chen: New mockups for the CRM dashboard are in the shared drive",
      time: "2h ago",
      unread: false,
      messages: [
        { id: "s6", from: "#design", senderName: "Sarah Chen", content: "New mockups for the CRM dashboard are in the shared drive", time: "2h ago", timestamp: Date.now() - 7200000 },
      ],
    },
    {
      id: "slack-4",
      name: "#sales",
      avatar: "#sales",
      lastMessage: "Priya Patel: Q3 pipeline review tomorrow at 10am",
      time: "3h ago",
      unread: true,
      messages: [
        { id: "s7", from: "#sales", senderName: "Priya Patel", content: "Q3 pipeline review tomorrow at 10am. Bring your forecasts!", time: "3h ago", timestamp: Date.now() - 10800000 },
      ],
    },
    {
      id: "slack-5",
      name: "#random",
      avatar: "#random",
      lastMessage: "James Wilson: Anyone up for lunch at The Italian Place? 🍝",
      time: "5h ago",
      unread: false,
      messages: [
        { id: "s8", from: "#random", senderName: "James Wilson", content: "Anyone up for lunch at The Italian Place? 🍝", time: "5h ago", timestamp: Date.now() - 18000000 },
        { id: "s9", from: "#random", senderName: "Emily R.", content: "I'm in! What time?", time: "4h ago", timestamp: Date.now() - 14400000 },
      ],
    },
    {
      id: "slack-6",
      name: "@david.k",
      avatar: "@david.k",
      lastMessage: "David Kim: Can you share the latest analytics report?",
      time: "1d ago",
      unread: false,
      messages: [
        { id: "s10", from: "@david.k", senderName: "David Kim", content: "Can you share the latest analytics report?", time: "1d ago", timestamp: Date.now() - 86400000 },
      ],
    },
  ],

  messenger: [
    {
      id: "m-1",
      name: "Alice Johnson",
      avatar: "AJ",
      lastMessage: "Hey, are you free for a quick call this afternoon?",
      time: "2m ago",
      unread: true,
      online: true,
      messages: [
        { id: "m1", from: "Alice Johnson", senderName: "Alice Johnson", content: "Hey, are you free for a quick call this afternoon?", time: "2m ago", timestamp: Date.now() - 120000 },
        { id: "m2", from: "me", senderName: "You", content: "Sure, what time works for you?", time: "1m ago", timestamp: Date.now() - 60000, isMine: true },
      ],
    },
    {
      id: "m-2",
      name: "Bob Smith",
      avatar: "BS",
      lastMessage: "The design mockups are ready for review on Figma",
      time: "1h ago",
      unread: true,
      messages: [
        { id: "m3", from: "Bob Smith", senderName: "Bob Smith", content: "The design mockups are ready for review on Figma", time: "1h ago", timestamp: Date.now() - 3600000 },
      ],
    },
    {
      id: "m-3",
      name: "Carol Davis",
      avatar: "CD",
      lastMessage: "Thanks for the update! Let me check and get back to you",
      time: "3h ago",
      unread: false,
      messages: [
        { id: "m4", from: "Carol Davis", senderName: "Carol Davis", content: "Thanks for the update! Let me check and get back to you", time: "3h ago", timestamp: Date.now() - 10800000 },
      ],
    },
    {
      id: "m-4",
      name: "Diana Ross",
      avatar: "DR",
      lastMessage: "Can you send me the link to the presentation?",
      time: "5h ago",
      unread: false,
      messages: [
        { id: "m5", from: "Diana Ross", senderName: "Diana Ross", content: "Can you send me the link to the presentation?", time: "5h ago", timestamp: Date.now() - 18000000 },
      ],
    },
    {
      id: "m-5",
      name: "Eve Martinez",
      avatar: "EM",
      lastMessage: "Great meeting today! Here are my notes...",
      time: "1d ago",
      unread: false,
      online: true,
      messages: [
        { id: "m6", from: "Eve Martinez", senderName: "Eve Martinez", content: "Great meeting today! Here are my notes...", time: "1d ago", timestamp: Date.now() - 86400000 },
      ],
    },
  ],

  whatsapp: [
    {
      id: "w-1",
      name: "David Wilson",
      avatar: "DW",
      lastMessage: "Can you send me the contract draft?",
      time: "30m ago",
      unread: true,
      online: true,
      messages: [
        { id: "w1", from: "David Wilson", senderName: "David Wilson", content: "Can you send me the contract draft?", time: "30m ago", timestamp: Date.now() - 1800000 },
      ],
    },
    {
      id: "w-2",
      name: "Emma Brown",
      avatar: "EB",
      lastMessage: "Meeting confirmed for tomorrow at 2pm. See you there!",
      time: "2h ago",
      unread: false,
      messages: [
        { id: "w2", from: "Emma Brown", senderName: "Emma Brown", content: "Meeting confirmed for tomorrow at 2pm. See you there!", time: "2h ago", timestamp: Date.now() - 7200000 },
      ],
    },
    {
      id: "w-3",
      name: "Frank Ocean",
      avatar: "FO",
      lastMessage: "The files have been uploaded to the shared drive",
      time: "4h ago",
      unread: true,
      messages: [
        { id: "w3", from: "Frank Ocean", senderName: "Frank Ocean", content: "The files have been uploaded to the shared drive", time: "4h ago", timestamp: Date.now() - 14400000 },
        { id: "w4", from: "me", senderName: "You", content: "Thanks Frank, I'll take a look", time: "3h ago", timestamp: Date.now() - 10800000, isMine: true },
      ],
    },
    {
      id: "w-4",
      name: "Grace Lee",
      avatar: "GL",
      lastMessage: "Happy Birthday! 🎉 Hope you have a great day!",
      time: "1d ago",
      unread: false,
      messages: [
        { id: "w5", from: "Grace Lee", senderName: "Grace Lee", content: "Happy Birthday! 🎉 Hope you have a great day!", time: "1d ago", timestamp: Date.now() - 86400000 },
        { id: "w6", from: "me", senderName: "You", content: "Thank you Grace! 🎉", time: "23h ago", timestamp: Date.now() - 82800000, isMine: true },
      ],
    },
  ],

  instagram: [
    {
      id: "i-1",
      name: "Hannah Kim",
      avatar: "HK",
      lastMessage: "Love your latest post! Where was that taken? 🌟",
      time: "1h ago",
      unread: true,
      online: true,
      messages: [
        { id: "i1", from: "Hannah Kim", senderName: "Hannah Kim", content: "Love your latest post! Where was that taken? 🌟", time: "1h ago", timestamp: Date.now() - 3600000 },
        { id: "i2", from: "me", senderName: "You", content: "Thank you! It was in Santorini, Greece 🇬🇷", time: "50m ago", timestamp: Date.now() - 3000000, isMine: true },
      ],
    },
    {
      id: "i-2",
      name: "Ian Chen",
      avatar: "IC",
      lastMessage: "DM me the details when you get a chance",
      time: "4h ago",
      unread: false,
      messages: [
        { id: "i3", from: "Ian Chen", senderName: "Ian Chen", content: "DM me the details when you get a chance", time: "4h ago", timestamp: Date.now() - 14400000 },
      ],
    },
    {
      id: "i-3",
      name: "Julia Roberts",
      avatar: "JR",
      lastMessage: "Thanks for the follow! Your content is amazing",
      time: "6h ago",
      unread: true,
      messages: [
        { id: "i4", from: "Julia Roberts", senderName: "Julia Roberts", content: "Thanks for the follow! Your content is amazing", time: "6h ago", timestamp: Date.now() - 21600000 },
      ],
    },
    {
      id: "i-4",
      name: "Kevin Hart",
      avatar: "KH",
      lastMessage: "Can you tag me in that photo from yesterday?",
      time: "1d ago",
      unread: false,
      messages: [
        { id: "i5", from: "Kevin Hart", senderName: "Kevin Hart", content: "Can you tag me in that photo from yesterday?", time: "1d ago", timestamp: Date.now() - 86400000 },
      ],
    },
  ],
}

export function getChannel(key: string): ChannelDef | undefined {
  return channels.find((c) => c.key === key)
}

export function getConversations(channelKey: string): Conversation[] {
  return channelData[channelKey] || []
}

export function getConversation(channelKey: string, conversationId: string): Conversation | undefined {
  return channelData[channelKey]?.find((c) => c.id === conversationId)
}
