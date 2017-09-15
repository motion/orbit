import preset from 'jss-preset-default'
import cache from 'jss-cache'
import * as JSS from 'jss'

const JSSInstance = JSS.create(preset())

export default JSSInstance

window.JSS = JSSInstance
