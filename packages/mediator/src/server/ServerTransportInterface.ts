
export interface ServerTransportInterface {

  onMessage(callback: (data: any) => any): void
  send(data: any)

}
