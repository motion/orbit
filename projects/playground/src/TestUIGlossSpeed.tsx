import { Button, CardSimple, Stack } from '@o/ui'
import _ from 'lodash'

export function TestUIGlossSpeed() {
  const [key, setKey] = React.useState(0)
  console.time('render')
  console.time('write')
  React.useLayoutEffect(() => {
    console.timeEnd('write')
  }, [])
  const items = (
    <Stack space>
      <Button onClick={() => setKey(key + 1)}>render</Button>
      <Stack space>
        {_.fill(new Array(50), 0).map((_, index) => (
          <CardSimple key={index} title={`card ${index}`}>
            lorem ipsume sit amet
          </CardSimple>
        ))}
      </Stack>
    </Stack>
  )
  console.timeEnd('render')
  return items
}
