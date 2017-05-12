console.log('starting api222...', process.env.REDIS_HOSTNAME)

import API from './api'

new API({}).start()
