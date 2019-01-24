import { gloss } from '@mcro/gloss'

export const FloatingBar = gloss({
  flexFlow: 'row',
  padding: [10, 12],
}).theme((_, theme) => ({
  borderBottom: [1, theme.borderColor.alpha(0.2)],
}))

// export function FloatingBar(props: { children: any }) {
//   return (
//     <Absolute top={8} right={16} left={16} zIndex={100000}>
//       <Row>{props.children}</Row>
//     </Absolute>
//   )
// }
