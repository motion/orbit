import { view } from '@mcro/black'

export Header from './header'
export const SubTitle = props => (
  <UI.Title size={1.75} fontWeight={500} {...props} />
)
export const SubText = props => <UI.Text selectable {...props} />

export const Content = view('content', {
  padding: 20,
  border: [1, [0, 0, 0, 0.1]],
})

export const Section = view('section', {
  flexFlow: 'row',
  flexWrap: 'wrap',
})

export const Col = view(
  'col',
  {
    padding: 20,
    flex: 1,
  },
  {
    half: {
      minWidth: '50%',
    },
  }
)

export const Page = view({
  padding: 10,
})
