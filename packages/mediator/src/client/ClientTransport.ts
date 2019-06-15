import Observable from 'zen-observable'
import { TransportRequestType, TransportRequestValues, TransportResponse } from '../common'

export interface ClientTransport {
  observe(type: TransportRequestType, values: TransportRequestValues): Observable<TransportResponse>
  execute(type: TransportRequestType, values: TransportRequestValues): Promise<TransportResponse>
}
