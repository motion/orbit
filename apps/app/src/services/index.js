// import { store } from '@mcro/black'
import CurrentUser from '~/stores/currentUserStore'
import * as ServiceClasses from './all'

// this sets up services on demand to avoid resource usage

const Services = new Proxy(
  {
    services: {},
  },
  {
    get(target, method) {
      if (Reflect.has(target, method)) {
        return target[method]
      }
      if (!ServiceClasses[method]) {
        console.error(`No service found ${method}`)
        return
      }
      if (target.services[method]) {
        return target.services[method]
      }
      target.services[method] = new ServiceClasses[method](CurrentUser)
      return target.services[method]
    },
  }
)

window.Services = Services

export default Services
