
export interface SlackBitData {
  messages: SlackBitDataMessage[]
}

export interface SlackBitDataMessage {
  user: string
  text: string
  time: number
}