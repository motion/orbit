import { AppPackage } from '@mcro/kit'

type Props = {
  sourceId: number
  app?: AppPackage
}

/**
 * Cache of bitCount to prevent bitCounts from flickering.
 */
const bitsCountCache = {}

export const OrbitSourceInfo = (props: Props) => {
  console.warn('todo', props, bitsCountCache, !!shortNumber)

  return null

  // const sourceId = props.app.source ? props.app.source.id : false
  // const { bitsCount } = useSourceInfo(sourceId)
  // const allJobs = useJobs(sourceId)
  // const isSyncing = !!(allJobs && allJobs.activeJobs && allJobs.activeJobs.length)

  // if (!sourceId) {
  //   return null
  // }

  // if (bitsCount !== 0) {
  //   bitsCountCache[sourceId] = bitsCount
  // }
  // const countSubtitle = shortNumber(bitsCount === 0 ? bitsCountCache[sourceId] || 0 : bitsCount)

  // return (
  //   <Row alignItems="center" flex={1}>
  //     <View flex={1} justifyContent="center">
  //       <Text size={0.9} alpha={0.5} ellipse>
  //         {props.app.name}&nbsp;·&nbsp;
  //         {countSubtitle}&nbsp;{pluralize(props.app.itemName || 'item', countSubtitle)}
  //       </Text>
  //     </View>
  //     <HorizontalSpace />
  //     {!!isSyncing && (
  //       <Text size={0.9} alpha={0.75}>
  //         Syncing...
  //       </Text>
  //     )}
  //   </Row>
  // )
}

function shortNumber(num: number) {
  const countSubtitle = num >= 0 ? Number(num).toLocaleString() : '...'
  const commaIndex = countSubtitle.indexOf(',')
  return commaIndex > -1 ? `${countSubtitle.slice(0, commaIndex)}k` : countSubtitle
}
