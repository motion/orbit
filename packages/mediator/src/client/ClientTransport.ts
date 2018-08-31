import Observable = require('zen-observable')
import { TransportRequestType, TransportRequestValues } from '../common'

export interface ClientTransport {
  observe(type: TransportRequestType, values: TransportRequestValues): Observable<any>
  execute(type: TransportRequestType, values: TransportRequestValues): Promise<any>
}
