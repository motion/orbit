import { view } from '@mcro/black'
import Media from 'react-media'
import Logo from '~/views/logo'
import * as React from 'react'
import * as UI from '@mcro/ui'
import * as Constants from '~/constants'
import { MailIcon } from '~/views/icons'

export const P = props => (
  <UI.Text selectable css={{ display: 'block' }} {...props} />
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

export const Title = ({
  children,
  reduceCapsPct,
  italic,
  size = 4,
  ...props
}) => (
  <P
    size={size}
    fontWeight={700}
    margin={[0, 0, 5]}
    css={{
      fontFamily: '"Mercury Display A", "Mercury Display B"',
      fontStyle: italic ? 'italic' : 'normal',
      letterSpacing: size <= 5 ? -2 : 0,
    }}
    {...props}
  >
    {reduceCapsPct ? changeCaps(children, reduceCapsPct) : children}
  </P>
)

export const SubTitle = UI.injectTheme(
  view(({ theme, size, ...props }) => (
    <Media query={Constants.screen.small}>
      {isSmall => (
        <Title
          size={isSmall ? 3 : size || 3.5}
          color={theme.subTitleColor || theme.base.color}
          reduceCapsPct={8}
          {...(isSmall ? { margin: [0, 0, 25, 0] } : null)}
          {...props}
        />
      )}
    </Media>
  )),
)

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
        <leftSide css={{ padding: [0, 0, sidePadSmall, 0] }}>
          {children}
        </leftSide>
      ) : (
        <leftSide
          css={{
            zIndex: 3,
            flex: 1,
            position: 'absolute',
            left: 0,
            right: '50%',
            bottom: noPad ? 0 : 80,
            top: noPad ? 0 : 80,
            paddingRight: noEdge ? 0 : 20,
            justifyContent: 'center',
            textAlign: 'right',
          }}
          {...props}
        >
          <inner
            style={innerStyle}
            css={{
              display: 'block',
              height: '100%',
            }}
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
          </inner>
        </leftSide>
      )
    }
  </Media>
)

export const RightSide = ({ children, inverse, noEdge, ...props }) => (
  <Media query={Constants.screen.small}>
    {isSmall =>
      isSmall ? (
        <rightSide>{children}</rightSide>
      ) : (
        <rightSide
          css={{
            zIndex: 3,
            flex: 1,
            position: 'absolute',
            left: '50%',
            right: 0,
            bottom: 80,
            top: 80,
            paddingRight: 20,
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

@view
export class BrandLogo {
  render() {
    return (
      <brandMark {...this.props}>
        <Logo
          size={0.25}
          color={Constants.brandColor}
          iconColor={Constants.brandColor}
        />
        <P
          if={false}
          size={1}
          fontWeight={700}
          alpha={0.8}
          css={{ marginTop: 10 }}
        >
          Your cloud, home
        </P>
      </brandMark>
    )
  }

  static style = {
    brandMark: {
      alignItems: 'center',
      textAlign: 'center',
    },
  }
}

export const Border = UI.injectTheme(
  view(({ theme, ...props }) => (
    <border
      css={{
        position: 'absolute',
        left: -30,
        right: -30,
        borderBottom: [4, 'dotted', theme.base.color.alpha(0.08)],
        transform: {
          y: -2,
        },
        minWidth: 660,
        maxWidth: Constants.smallSize + 200,
        zIndex: 2,
        margin: [0, 'auto'],
        alignItems: 'center',
        pointerEvents: 'none',
      }}
      {...props}
    />
  )),
)

export const FadedArea = ({
  fadeRight,
  fadeDown,
  fadeLeft,
  fadeBackground,
  children,
}) => (
  <React.Fragment>
    {children}
    <fadeRight
      if={fadeRight}
      $$fullscreen
      css={{
        left: 'auto',
        width: 100,
        zIndex: 100,
        background: `linear-gradient(to right, transparent, ${fadeBackground ||
          Constants.backgroundColor} 80%)`,
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
          Constants.backgroundColor} 80%)`,
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
          Constants.backgroundColor})`,
      }}
    />
  </React.Fragment>
)

export const AppleLogo = props => (
  <svg width="170px" height="170px" viewBox="0 0 170 170" {...props}>
    <path d="m150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.197-2.12-9.973-3.17-14.34-3.17-4.58 0-9.492 1.05-14.746 3.17-5.262 2.13-9.501 3.24-12.742 3.35-4.929 0.21-9.842-1.96-14.746-6.52-3.13-2.73-7.045-7.41-11.735-14.04-5.032-7.08-9.169-15.29-12.41-24.65-3.471-10.11-5.211-19.9-5.211-29.378 0-10.857 2.346-20.221 7.045-28.068 3.693-6.303 8.606-11.275 14.755-14.925s12.793-5.51 19.948-5.629c3.915 0 9.049 1.211 15.429 3.591 6.362 2.388 10.447 3.599 12.238 3.599 1.339 0 5.877-1.416 13.57-4.239 7.275-2.618 13.415-3.702 18.445-3.275 13.63 1.1 23.87 6.473 30.68 16.153-12.19 7.386-18.22 17.731-18.1 31.002 0.11 10.337 3.86 18.939 11.23 25.769 3.34 3.17 7.07 5.62 11.22 7.36-0.9 2.61-1.85 5.11-2.86 7.51zm-31.26-123.01c0 8.1021-2.96 15.667-8.86 22.669-7.12 8.324-15.732 13.134-25.071 12.375-0.119-0.972-0.188-1.995-0.188-3.07 0-7.778 3.386-16.102 9.399-22.908 3.002-3.446 6.82-6.3113 11.45-8.597 4.62-2.2516 8.99-3.4968 13.1-3.71 0.12 1.0831 0.17 2.1663 0.17 3.2409z" />
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
      color: Constants.brandColor,
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
  <svg height={height} width={width} style={style} class="pattern-swatch">
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
export class Callout {
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
                  background: theme.base.background.lighten(0.028),
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
      boxShadow: [[0, 3, 10, [0, 0, 0, 0.065]]],
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

export const Glow = ({ below, style = {}, ...props }) => (
  <glow
    $$fullscreen
    css={{
      zIndex: below ? -1 : 0,
      background: '#fff',
      ...style,
      filter: {
        blur: 160,
        ...style.filter,
      },
      transform: {
        scale: 0.38,
        y: '-20%',
        ...style.transform,
      },
    }}
    {...props}
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
