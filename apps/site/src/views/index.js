import Media from 'react-media'
import * as React from 'react'
import * as UI from '@mcro/ui'
import * as Constants from '~/constants'

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

export const SubTitle = UI.injectTheme(({ theme, size, ...props }) => (
  <Media query={Constants.screen.small}>
    {isSmall => (
      <Title
        size={isSmall ? 3 : size || 5}
        color={theme.subTitleColor || theme.base.color}
        reduceCapsPct={8}
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
            bottom: 80,
            top: 80,
            paddingRight: 20,
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
