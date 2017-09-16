import jssCache from 'jss-cache'
import jssGlobal from 'jss-global'
import jssNested from 'jss-nested'
import jssDefaultUnit from 'jss-default-unit'
import jssPropsSort from 'jss-props-sort'
import * as JSS from 'jss'

const jss = JSS.create()

console.log('usiong new sjadsadas')

jss.use(jssCache(), jssGlobal(), jssNested(), jssDefaultUnit(), jssPropsSort())

export default jss

window.JSS = jss
