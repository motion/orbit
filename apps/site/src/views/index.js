import { view } from '@mcro/black'
import Media from 'react-media'
import * as React from 'react'
import * as UI from '@mcro/ui'
import * as Constants from '~/constants'
import { MailIcon } from '~/views/icons'
import Router from '~/router'

export * from './section'

const TITLE_FONT_FAMILY = '"Eesti Pro"'

export const P = ({ size, titleFont, ...props }) => (
  <Media query={Constants.screen.small}>
    {isSmall => (
      <UI.Text
        size={size * (isSmall ? 0.9 : 1)}
        selectable
        css={{
          display: 'block',
          fontFamily: titleFont ? TITLE_FONT_FAMILY : 'inherit',
        }}
        {...props}
      />
    )}
  </Media>
)

export const P2 = props => (
  <P size={2} alpha={0.9} margin={[0, 0, 20]} {...props} />
)

const IS_UPPER = /[A-Z]/
const changeCaps = (str, reducePct) =>
  typeof str === 'string'
    ? str
        .split('')
        .map(
          char =>
            IS_UPPER.test(char) ? (
              <span style={{ fontSize: `${100 - reducePct}%` }}>{char}</span>
            ) : (
              char
            ),
        )
    : str

export const Title = UI.injectTheme(
  ({ theme, children, reduceCapsPct, italic, size = 4, ...props }) => (
    <Media query={Constants.screen.small}>
      {isSmall => (
        <P
          fontWeight={600}
          size={size * (isSmall ? 0.8 : 1)}
          sizeLineHeight={1.1}
          color={
            theme.titleColor ||
            theme.base.color
              .desaturate(0.3)
              .rotate(-90)
              .alpha(0.8)
          }
          css={{
            fontFamily: TITLE_FONT_FAMILY,
            fontStyle: italic ? 'normal' : 'normal',
            // Eesti font adds space at bottom
            marginBottom: '-1%',
          }}
          {...props}
        >
          {reduceCapsPct ? changeCaps(children, reduceCapsPct) : children}
        </P>
      )}
    </Media>
  ),
)

export const SubTitle = UI.injectTheme(({ theme, size = 3, ...props }) => (
  <Media query={Constants.screen.small}>
    {isSmall => (
      <Title
        size={size}
        color={theme.subTitleColor || theme.base.color}
        {...(isSmall ? { margin: [0, 0, 25, 0] } : null)}
        {...props}
      />
    )}
  </Media>
))

export const SubSubTitle = props => (
  <P size={1.2} fontWeight={800} {...props} margin={[0, 0, 8]} />
)

export const SmallTitle = props => (
  <P
    size={1}
    fontWeight={500}
    textTransform="uppercase"
    alpha={0.45}
    padding={[0, 2]}
    margin={[0, 0, 5]}
    {...props}
  />
)

const sidePadSmall = 40

export const LeftSide = ({
  children,
  innerStyle,
  noPad,
  noEdge,
  inverse,
  ...props
}) => (
  <Media query={Constants.screen.small}>
    {isSmall =>
      isSmall ? (
        <leftSide css={{ padding: [sidePadSmall, 0, 0] }}>{children}</leftSide>
      ) : (
        <outer
          css={{
            flex: 1,
            width: '50%',
            position: 'relative',
            zIndex: (props.style && props.style.zIndex) || 3,
          }}
        >
          <leftSide
            css={{
              display: 'block',
              height: '100%',
              width: '100%',
              position: 'relative',
              paddingRight: noEdge ? 0 : '3%',
              justifyContent: 'center',
              textAlign: 'right',
            }}
            style={innerStyle}
            {...props}
          >
            <edge
              if={!noEdge}
              css={{
                shapeOutside: inverse
                  ? 'polygon(105% 0%, 90px 0%, 0% 1096px)'
                  : 'polygon(0% 0%, 1px 0%, 96% 1096px)',
                float: 'right',
                width: 110,
                height: 990,
                marginLeft: inverse ? 5 : -20,
              }}
            />
            {children}
          </leftSide>
        </outer>
      )
    }
  </Media>
)

export const RightSide = ({ children, inverse, noPad, noEdge, ...props }) => (
  <Media query={Constants.screen.small}>
    {isSmall =>
      isSmall ? (
        <rightSide css={{ padding: [sidePadSmall, 0, 0] }}>
          {children}
        </rightSide>
      ) : (
        <rightSide
          css={{
            zIndex: 3,
            flex: 1,
            position: 'absolute',
            left: '50%',
            right: 0,
            bottom: noPad ? 0 : 80,
            top: noPad ? 0 : 80,
            paddingRight: noPad ? 0 : 20,
            justifyContent: 'center',
          }}
          {...props}
        >
          <inner
            if={!noEdge}
            css={{
              display: 'block',
              height: '100%',
              paddingLeft: 20,
            }}
          >
            <edge
              css={{
                shapeOutside: inverse
                  ? 'polygon(0% 0%, 0% 21px, 174% 2131px)'
                  : 'polygon(0% 0%, 90px 0%, 0% 1096px)',
                float: 'left',
                width: 187,
                height: '100%',
                marginLeft: inverse ? -75 : -90,
              }}
            />
            {children}
          </inner>
          {noEdge && children}
        </rightSide>
      )
    }
  </Media>
)

export const Border = UI.injectTheme(
  ({ theme, width = 4, color, type = 'dotted', ...props }) => (
    <border
      css={{
        position: 'absolute',
        left: -30,
        right: -30,
        borderBottom: [width, type, color || theme.base.color.alpha(0.08)],
        transform: {
          y: -2,
        },
        maxWidth: Constants.smallSize + 200,
        zIndex: 2,
        margin: [0, 'auto'],
        alignItems: 'center',
        pointerEvents: 'none',
      }}
      {...props}
    />
  ),
)

export const FadedArea = UI.injectTheme(
  ({ theme, fadeRight, fadeDown, fadeLeft, fadeBackground, children }) => (
    <>
      {children}
      <fadeRight
        if={fadeRight}
        $$fullscreen
        css={{
          left: 'auto',
          width: 100,
          zIndex: 100,
          background: `linear-gradient(to right, transparent, ${fadeBackground ||
            theme.base.background} 80%)`,
        }}
      />
      <fadeLeft
        if={fadeLeft}
        $$fullscreen
        css={{
          right: 'auto',
          width: 100,
          zIndex: 100,
          background: `linear-gradient(to left, transparent, ${fadeBackground ||
            theme.base.background} 80%)`,
        }}
      />
      <fadeDown
        if={fadeDown}
        $$fullscreen
        css={{
          top: 'auto',
          height: 100,
          zIndex: 100,
          background: `linear-gradient(transparent, ${fadeBackground ||
            theme.base.background})`,
        }}
      />
      <circleWrap $$fullscreen css={{ zIndex: 1000, overflow: 'hidden' }}>
        <div
          $circle
          css={{
            width: '100%',
            paddingBottom: '100%',
            borderRadius: 1000,
            boxShadow: [[0, 0, 0, 250, theme.base.background]],
            border: [
              [
                2,
                theme.base.background
                  .darken(0.2)
                  .desaturate(0.4)
                  .alpha(0.5),
              ],
            ],
          }}
        />
      </circleWrap>
    </>
  ),
)

export const AppleLogo = props => (
  <svg width="170px" height="170px" viewBox="0 0 170 170" {...props}>
    <path d="m150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.197-2.12-9.973-3.17-14.34-3.17-4.58 0-9.492 1.05-14.746 3.17-5.262 2.13-9.501 3.24-12.742 3.35-4.929 0.21-9.842-1.96-14.746-6.52-3.13-2.73-7.045-7.41-11.735-14.04-5.032-7.08-9.169-15.29-12.41-24.65-3.471-10.11-5.211-19.9-5.211-29.378 0-10.857 2.346-20.221 7.045-28.068 3.693-6.303 8.606-11.275 14.755-14.925s12.793-5.51 19.948-5.629c3.915 0 9.049 1.211 15.429 3.591 6.362 2.388 10.447 3.599 12.238 3.599 1.339 0 5.877-1.416 13.57-4.239 7.275-2.618 13.415-3.702 18.445-3.275 13.63 1.1 23.87 6.473 30.68 16.153-12.19 7.386-18.22 17.731-18.1 31.002 0.11 10.337 3.86 18.939 11.23 25.769 3.34 3.17 7.07 5.62 11.22 7.36-0.9 2.61-1.85 5.11-2.86 7.51zm-31.26-123.01c0 8.1021-2.96 15.667-8.86 22.669-7.12 8.324-15.732 13.134-25.071 12.375-0.119-0.972-0.188-1.995-0.188-3.07 0-7.778 3.386-16.102 9.399-22.908 3.002-3.446 6.82-6.3113 11.45-8.597 4.62-2.2516 8.99-3.4968 13.1-3.71 0.12 1.0831 0.17 2.1663 0.17 3.2409z" />
  </svg>
)

export const WindowsLogo = props => (
  <svg width="88px" height="88px" viewBox="0 0 88 88" {...props}>
    <path
      d="m0 12.402 35.687-4.8602.0156 34.423-35.67.20313zm35.67 33.529.0277 34.453-35.67-4.9041-.002-29.78zm4.3261-39.025 47.318-6.906v41.527l-47.318.37565zm47.329 39.349-.0111 41.34-47.318-6.6784-.0663-34.739z"
      fill="#00adef"
    />
  </svg>
)

export const DottedButton = props => (
  <btn
    css={{
      display: 'inline-block',
      padding: [8, 12],
      borderRadius: 8,
      border: [1, 'dashed', '#eee'],
      flex: 'none',
      cursor: 'pointer',
      fontWeight: 500,
      fontSize: 16,
      flexFlow: 'row',
      alignItems: 'center',
    }}
    {...props}
  />
)

export const Cmd = view('span', {
  padding: [2, 5],
  margin: [-2, 0],
  border: [1, 'dotted', '#ccc'],
  borderRadius: 12,
})

const Lines = ({ width = 100, height = 100, style }) => (
  <svg height={height} width={width} style={style}>
    <rect
      style={{ fill: 'url(#diagonal-stripe-3)' }}
      x="0"
      y="0"
      height={height}
      width={width}
    />
  </svg>
)

@UI.injectTheme
@view
export class Callout extends React.Component {
  render({ style, theme, ...props }) {
    return (
      <Media query={Constants.screen.small}>
        {isSmall =>
          isSmall ? (
            <section style={style} {...props} />
          ) : (
            <section $largeCallout style={style}>
              <Lines width={1000} height={2000} $lines />
              <innerSection
                css={{
                  background: theme.base.background.lighten(0.028).alpha(0.8),
                }}
                {...props}
              />
            </section>
          )
        }
      </Media>
    )
  }

  static style = {
    largeCallout: {
      // border: [1, [0, 0, 0, 0.02]],
      boxShadow: [[0, 5, 20, [0, 0, 0, 0.065]]],
      background: [255, 255, 255, 0.1],
      zIndex: 10,
      overflow: 'hidden',
      position: 'relative',
    },
    lines: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: -2,
      opacity: 0.02,
      transformOrigin: 'top left',
      transform: {
        scale: 12,
      },
    },
    innerSection: {
      margin: 4,
      padding: 26,
      overflow: 'hidden',
      position: 'relative',
      [Constants.screen.smallQuery]: {
        margin: 0,
      },
    },
  }
}

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

export const Glow = ({ below, style = {}, ...props }) => (
  <Media
    if={!isSafari}
    query={Constants.screen.large}
    render={() => (
      <glow
        $$fullscreen
        css={{
          zIndex: below ? -1 : 0,
          background: '#fff',
          ...style,
          filter: {
            blur: 200,
            ...style.filter,
          },
          transform: {
            y: '-20%',
            ...style.transform,
          },
        }}
        {...props}
      />
    )}
  />
)

export const Notification = ({ title, body, ...props }) => (
  <notification
    css={{
      width: 300,
      height: 70,
      background: '#f3f3f3',
      border: [1, '#ddd'],
      padding: 10,
      borderRadius: 7,
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      flexFlow: 'row',
      overflow: 'hidden',
      marginBottom: 20,
      textAlign: 'left',
    }}
    {...props}
  >
    <MailIcon size={0.09} css={{ margin: [0, 10, 0, 0] }} />
    <content
      css={{
        padding: 3,
        flex: 1,
        overflow: 'hidden',
      }}
    >
      <notTitle css={{ fontWeight: 600 }}>{title}</notTitle>
      <UI.Text ellipse={1}>{body}</UI.Text>
    </content>
  </notification>
)

export const HalfSection = view('section', {
  flex: 1,
  width: '50%',
  padding: [0, 50, 0, 0],
  justifyContent: 'flex-end',
  [Constants.screen.smallQuery]: {
    width: '100%',
    padding: [0, 0, 40, 0],
  },
})

@view.ui
export class A extends React.Component {
  render({ color, isLarge, active, ...props }) {
    return <a $active={active} {...props} />
  }

  static style = {
    a: {
      textDecoration: 'none',
      fontSize: 14,
      color: [0, 0, 0, 0.6],
      fontWeight: 600,
      padding: [3, 2],
      borderBottom: [2, 'transparent'],
    },
  }

  static theme = (props, theme) => {
    const bg = theme.base.background.darken(0.1).desaturate(0.1)
    const color = UI.color(props.color || theme.base.color)
    return {
      a: {
        margin: props.isLarge ? [0, 0, 0, 30] : [0, 0, 0, 15],
        color,
        '&:hover': {
          color: color.alpha(0.6),
          borderBottom: [2, bg.alpha(0.4)],
        },
      },
      active: {
        borderBottom: [2, bg],
        '&:hover': {
          color,
          borderBottom: [2, bg],
        },
      },
    }
  }
}

export const Link = ({ to, ...props }) => (
  <A
    active={Router.isActive(to)}
    href={to}
    onClick={Router.link(to)}
    {...props}
  />
)

export const LinkSimple = ({ to, ...props }) => (
  <a
    active={Router.isActive(to)}
    href={to}
    onClick={Router.link(to)}
    {...props}
  />
)

export const TopoBg = () => (
  <topoBg
    if={false}
    $$fullscreen
    css={{
      zIndex: 0,
      opacity: 0.17,
      background: `url(${require('../../public/topo2.svg')})`,
    }}
  />
)

import screenImg from '~/../public/home.jpg'
export const HomeImg = props => (
  <img
    src={screenImg}
    css={{
      width: 1101 / 2,
      height: 2016 / 2,
      borderRadius: 17,
      userSelect: 'none',
    }}
    {...props}
  />
)

export const FeatureSubTitle = props => (
  <Media query={Constants.screen.large}>
    {isLarge => (
      <P
        if={isLarge}
        size={1.9}
        alpha={0.7}
        css={{ marginBottom: 20 }}
        {...props}
      />
    )}
  </Media>
)

export const Card = view('div', {
  textAlign: 'left',
  background: '#fff',
  borderRadius: 6,
  padding: ['7%', '8%'],
  margin: [10, '12%'],
  boxShadow: [[0, 7, 20, [0, 0, 0, 0.04]]],
  [Constants.screen.smallQuery]: {
    margin: [0, -50],
    padding: [40, '20%'],
  },
})

Card.Title = props => (
  <P2
    sizeLineHeight={1.2}
    margin={[0, 0, 5]}
    size={1.5}
    fontWeight={400}
    alpha={1}
    {...props}
  />
)

Card.Body = props => (
  <P2 sizeLineHeight={1.1} margin={0} size={1.3} {...props} />
)

Card.Icon = props => (
  <UI.Icon
    size={40}
    color="black"
    css={{ position: 'absolute', top: 30, right: 30, opacity: 0.5, zIndex: -1 }}
    {...props}
  />
)
