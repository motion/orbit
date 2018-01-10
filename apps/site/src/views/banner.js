import * as Constants from '~/constants'

export default () => (
  <View.Section
    css={{
      transform: { rotate: '-1deg' },
      zIndex: 1000,
      position: 'relative',
      overflow: 'visible',
      top: -80,
      left: -100,
      right: -100,
      width: '120%',
      background: `linear-gradient(to right, ${Constants.colorMain}, ${
        Constants.colorSecondary
      })`,
      height: 80,
      marginBottom: -80,
      marginTop: -90,
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: [[0, 0, 70, [0, 0, 0, 0.1]]],
    }}
  >
    <View.SectionContent
      css={{
        flexFlow: 'row',
        transform: {
          // rotate: '2deg',
        },
        // opacity: 0,
      }}
    >
      <left css={{ width: '46%', marginRight: '2%', textAlign: 'right' }}>
        <UI.Text size={2} fontWeight={200} color={Constants.colorMain}>
          It's about time
        </UI.Text>
      </left>

      <across
        css={{
          textAlign: 'left',
        }}
      >
        <UI.Text size={2} fontWeight={200} color={Constants.colorSecondary}>
          you tamed the cloud
        </UI.Text>
      </across>
    </View.SectionContent>
  </View.Section>
)
