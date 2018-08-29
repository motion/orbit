import * as React from 'react'
import ZenScroll from 'zenscroll'
import reactRenderer from 'remark-react'
import remark from 'remark'
import { A, P2, SubTitle, Title } from '~/views'

export const scrollTo = query => () =>
  ZenScroll.to(document.querySelector(query), 100)

export const pProps = {
  size: 1.7,
  sizeLineHeight: 1.15,
  alpha: 0.8,
  margin: [0, 0, 50],
}

const P = props => <P2 {...pProps} {...props} />

export const Renderer = remark().use(reactRenderer, {
  remarkReactComponents: {
    a: A,
    p: P,
    h1: Title,
    h2: props => <P2 size={2.2} {...props} />,
    h3: props => <SubTitle size={2.3} {...props} />,
    h4: props => <SubTitle size={2.2} {...props} />,
    li: props => (
      <li>
        <P margin={[0, 0, 10]}>{props.children}</P>
      </li>
    ),
    ul: props => <ul style={{ margin: '0 0 50px 20px' }}>{props.children}</ul>,
    ol: props => <ol style={{ margin: '0 0 50px 20px' }}>{props.children}</ol>,
  },
})
