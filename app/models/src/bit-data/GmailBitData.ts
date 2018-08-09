export interface GmailBitData {
  messages: {
    id: string
    date: number
    body: string
    participants: GmailBitDataParticipant[]
  }[]
}

export interface GmailBitDataParticipant {
  name?: string
  email: string
  type: "from"|"to"
}