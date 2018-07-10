import * as React from 'react'
import { view } from '@mcro/black'
import { PeekHeader } from '../PeekHeader'
// import { SubTitle } from '~/views'
// import * as UI from '@mcro/ui'

@view
export class Team extends React.Component {
  render({ bit }) {
    if (!bit) {
      return null
    }
    return (
      <>
        <PeekHeader title={bit.title} subtitle="Team" />
      </>
    )
    // const BitContent = bitContents(bit)
    // return (
    //   <BitContent
    //     appStore={appStore}
    //     bit={bit}
    //     shownLimit={Infinity}
    //     isExpanded
    //   >
    //     {({ permalink, location, title, icon, content }) => {
    //       return (
    //         <>
    //           <PeekHeader
    //             title={title}
    //             subtitle={location}
    //             after={
    //               <after>
    //                 <permalink>{permalink}</permalink>
    //                 <space />
    //                 <OrbitIcon if={icon} icon={icon} size={16} />
    //               </after>
    //             }
    //           />
    //           <main>
    //             <mainInner>
    //               <content>
    //                 <UI.Text
    //                   if={false}
    //                   selectable
    //                   css={{ margin: [5, 0, 20] }}
    //                   size={1.2}
    //                 >
    //                   <strong>Key points</strong>: a16z partners, orbit domain,
    //                   mock-up, Formidable and refactor.
    //                 </UI.Text>
    //                 {content}
    //               </content>
    //             </mainInner>
    //           </main>
    //         </>
    //       )
    //     }}
    //   </BitContent>
    // )
  }

  static style = {
    main: {
      flex: 1,
      overflowY: 'scroll',
      margin: [15, 10],
    },
    mainInner: {
      margin: [0, -10, -5],
    },
    content: {
      padding: [10, 20],
    },
    section: {
      padding: [10, 20, 0],
    },
    carouselInner: {
      margin: [0, -10, 10, -30],
    },
    after: {
      flexFlow: 'row',
      alignItems: 'center',
    },
    space: {
      width: 7,
    },
    permalink: {
      opacity: 0.5,
    },
  }
}
