export interface GmailBitData {
  messages: {
    id: string
    date: number
    body: string
    participants: GailBitDataParticipant[]
  }[]
}

export interface GailBitDataParticipant {
  name?: string
  email: string
  type: "from"|"to"
}