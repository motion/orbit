console.log('starting api2...', process.env.REDIS_HOSTNAME)

import API from './api'

new API({}).start()
