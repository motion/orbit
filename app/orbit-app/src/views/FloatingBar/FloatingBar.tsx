import { gloss } from '@mcro/gloss'

export const FloatingBar = gloss({
  flexFlow: 'row',
  padding: [8, 12],
}).theme((_, theme) => ({
  borderBottom: [1, theme.borderColor.alpha(a => a * 0.2)],
}))

// export function FloatingBar(props: { children: any }) {
//   return (
//     <Absolute top={8} right={16} left={16} zIndex={100000}>
//       <Row>{props.children}</Row>
//     </Absolute>
//   )
// }
