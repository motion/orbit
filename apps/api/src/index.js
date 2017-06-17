console.log('starting api', process.env.REDIS_HOSTNAME)

import API from './api'

new API({}).start()
