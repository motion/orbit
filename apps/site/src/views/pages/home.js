import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

const Text = props => <UI.Text size={1.5} marginBottom={20} {...props} />
const SubText = props => <Text size={1.25} lineHeight="1.7rem" {...props} />
const Hl = props => (
  <UI.Text display="inline" background="yellow" color="#111" {...props} />
)
const Title = props => <Text fontWeight={800} lineHeight="3.5rem" {...props} />
const SubTitle = props => (
  <UI.Title fontWeight={800} marginBottom={30} opacity={0.6} {...props} />
)

const Logo = ({ fill, ...props }) => (
  <svg viewBox="0 0 498 157" {...props}>
    <g
      id="Page-1"
      stroke="none"
      stroke-width="1"
      fill="none"
      fill-rule="evenodd"
    >
      <g id="Group-4" fill={fill}>
        <path
          d="M428.590792,122.971985 C428.590792,116.305319 428.590792,96.9698096 428.590792,64.9654579 L428.590792,35.4879188 L428.590792,22.5391884 L467.755343,21.8917274 L467.755343,37.4879188 L481.992647,37.4879188 L481.992647,75.9654579 L467.755343,75.9654579 C467.304569,90.8416458 467.181666,102.02227 467.386633,109.507332 C467.5916,116.992393 474.599426,119.147278 488.41011,115.971985 C494.41011,139.971985 497.41011,151.971985 497.41011,151.971985 C496.41011,152.971985 478.698196,156.971985 465.41011,156.971985 C450.41011,156.971985 428.590792,147.370423 428.590792,122.971985 Z"
          id="Path"
        />
        <polygon
          id="Path"
          points="375.302081 152.948368 375.302081 35.5073319 415.34505 35.5073319 415.34505 152.948368"
        />
        <path
          d="M284.836613,1.42108547e-14 L284.933548,37 C292.600215,32.6666667 300.751243,30.502444 309.386633,30.5073319 C332.021489,30.5201441 364.933548,49 364.375675,96.1573524 C363.817803,143.314705 336.285744,155.34875 308.58466,155.948368 C300.881274,156.115116 292.989757,153.46566 284.91011,148 L284.933548,154 C259.543895,154 246.210561,154 244.933548,154 C244.933548,145.333333 244.933548,94 244.933548,2.40855698e-14 L284.836613,1.42108547e-14 Z M303.763537,126.758879 C319.501199,126.835646 328.298329,112.605404 328.298329,95.2014667 C328.298329,77.7975292 322.889563,61.5073319 303.763537,61.5073319 C298.108062,61.5073319 291.831399,63.6715546 284.933548,68 L284.933548,117 C290.375509,123.471231 296.652172,126.724191 303.763537,126.758879 Z"
          id="Combined-Shape"
          transform="translate(304.658111, 77.977886) rotate(-360.000000) translate(-304.658111, -77.977886) "
        />
        <path
          d="M197.933548,48 C200.488235,41 213.238184,37 221.933548,37 C224.822806,37 229.15614,38.6666667 234.933548,42 L231.933548,81 C212.933548,71 197.933548,80.7558594 197.933548,102 L197.933548,152.948368 L158.933548,152.948368 L158.933548,38 L197.933548,38 L197.933548,48 Z"
          id="Path"
        />
        <path
          d="M20.884054,133.924116 C5.59164737,118.596145 0.70703125,102.534782 0.70703125,79.845118 C0.70703125,57.0843267 5.59164737,41.0051815 20.884054,25.7127748 C36.1764606,10.4203682 52.3626086,2.77427959 75.1233998,2.77427959 C97.8841911,2.77427959 114.070339,10.4203682 129.362746,25.7127748 C144.655152,41.0051815 149.539768,57.0843267 149.539768,79.845118 C149.539768,102.605909 144.655152,118.685055 129.362746,133.977461 C114.070339,149.269868 97.8841911,156.915956 75.1233998,156.915956 C52.3626086,156.915956 36.1764606,149.252086 20.884054,133.924116 Z M75.2342518,117.293559 C86.8777265,117.293559 94.5508872,112.621066 101.195061,105.445359 C107.839234,98.2696516 110.492723,89.2809976 110.492723,79.845118 C110.492723,70.4092384 108.135898,61.7409809 101.195061,54.2448771 C94.2542238,46.7487732 86.8192175,42.3966769 75.0587229,42.3966769 C63.4152483,42.3966769 55.9552903,46.8389108 49.0979141,54.2448771 C42.240538,61.6508433 40.7364658,70.3927815 40.7364658,79.845118 C40.7364658,89.2974545 42.4573928,98.2735959 49.0979141,105.445359 C55.7384355,112.617122 63.4737573,117.293559 75.2342518,117.293559 Z"
          id="Combined-Shape"
        />
      </g>
    </g>
  </svg>
)

const Icon = ({ fill, ...props }) => (
  <svg viewBox="0 0 396 396" {...props}>
    <g
      id="Page-1"
      stroke="none"
      stroke-width="1"
      fill="none"
      fill-rule="evenodd"
    >
      <g id="Custom-Preset" transform="translate(-58.000000, -58.000000)">
        <path
          d="M400.795627,309.284347 C406.953875,292.576393 410.315609,274.52289 410.315609,255.687029 C410.315609,169.82373 340.458986,100.217774 254.286475,100.217774 C168.113963,100.217774 98.25734,169.82373 98.25734,255.687029 C98.25734,341.550328 168.113963,411.156285 254.286475,411.156285 C260.969181,411.156285 267.553763,410.737671 274.015249,409.925324 C264.174408,400.932306 256.552412,389.583576 252.057174,376.780341 C185.955905,375.595706 132.737045,321.834032 132.737045,255.687029 C132.737045,188.798015 187.156578,134.573755 254.286475,134.573755 C321.416371,134.573755 375.835904,188.798015 375.835904,255.687029 C375.835904,264.319315 374.929552,272.740672 373.206497,280.86177 C384.57776,287.945949 394.075845,297.71962 400.795627,309.284347 Z"
          id="border"
          fill={fill}
        />
        <g
          id="Circle"
          transform="translate(258.779071, 274.755860) rotate(-3.000000) translate(-258.779071, -274.755860) translate(133.279071, 134.755860)"
        >
          <path
            d="M20.7356311,192.264605 C8.11631429,172.857679 0.769499347,149.554459 0.769499347,124.396002 C0.769499347,56.0237732 54.9924616,0.597130449 121.879875,0.597130449 C169.338736,0.597130449 210.421833,28.5009965 230.284218,69.1342417 C208.552365,35.99269 171.573707,14.1769504 129.610363,14.1769504 C62.7229495,14.1769504 8.49998727,69.6035931 8.49998727,137.975822 C8.49998727,157.449409 12.8985996,175.87284 20.7356311,192.264605 Z"
            id="Path"
            fill="#000000"
            opacity="0.0600000024"
          />
          <ellipse
            id="Path"
            fill={fill}
            cx="191.940484"
            cy="221.384129"
            rx="58.1147622"
            ry="58.6059326"
          />
        </g>
      </g>
    </g>
  </svg>
)

let blurredRef

@view
export default class HomePage extends React.Component {
  setRef = ref => {
    this.node = ref
    if (!ref) {
      return
    }
    if (this.props.blurred) {
      blurredRef = ref.childNodes[0]
    } else {
      this.on(this.node, 'scroll', () => {
        console.log(
          this.node.scrollTop,
          `translateY(-${this.node.scrollTop}px)`
        )
        blurredRef.style.transform = `translateY(-${this.node.scrollTop}px)`
      })
    }
  }

  render({ blurred }) {
    function getStyle() {
      if (!blurred) {
        return {
          page: {
            height: window.innerHeight,
            overflowY: 'scroll',
          },
        }
      }
      const pad = 20
      const width = 280
      const height = 300
      const bottom = height + pad
      const right = window.innerWidth - pad
      const left = window.innerWidth - width - pad
      return {
        page: {
          background: '#fff',
          pointerEvents: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          // rounded:
          // polygon(5% 0, 95% 0, 100% 4%, 100% 95%, 95% 100%, 5% 100%, 0 95%, 0 5%)
          clip: `rect(${pad}px, ${right}px, ${bottom}px, ${left}px)`,
        },
      }
    }

    const styles = getStyle()

    const oraStyle = {
      position: 'fixed',
      top: 20,
      right: 20,
      width: 280,
      height: 300,
      borderRadius: 10,
    }

    return (
      <page css={styles.page} ref={this.setRef}>
        <ora
          if={!blurred}
          css={{
            ...oraStyle,
            background: [0, 0, 0, 0.29],
            color: '#fff',
            zIndex: 10000,
            boxShadow: '0 0 10px rgba(0,0,0,0.25)',
          }}
        >
          <header css={{ padding: 10 }}>
            <UI.Icon name="zoom" />
          </header>
          <content css={{ padding: 20 }}>
            lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor lorem ipsum
            dolor lorem ipsum dolor
          </content>
        </ora>

        <contents>
          <section
            css={{
              background: '#f2f2f2',
              height: window.innerHeight - 20,
              minHeight: 700,
            }}
          >
            <header $$row css={{ background: '#fff', zIndex: 100 }}>
              <sectionContent>
                <thing $$row css={{ alignItems: 'center', padding: [10, 0] }}>
                  <Icon
                    fill="blue"
                    css={{
                      height: 40,
                      marginRight: 10,
                    }}
                  />
                  <Logo css={{ height: 30 }} fill="blue" />
                </thing>
              </sectionContent>
            </header>

            <sectionContent
              $padded
              css={{
                flex: 1,
                justifyContent: 'center',
              }}
            >
              <content>
                <Title size={4}>
                  A smart assistant<br /> that unifies knowledge.
                </Title>

                <Text size={2.2}>
                  A desktop assistant thats always on,<br />
                  bringing context to what you're doing.<br />
                  <Hl>Your companys knowledge, automatically.</Hl>
                  <br />
                </Text>

                <hr />

                <narrow if={false}>
                  <Text textAlign="center" size={2.2}>
                    Search across every service and see an activity feed for any
                    project or team.
                  </Text>
                </narrow>

                <logos
                  css={{
                    flexFlow: 'row',
                    flex: 1,
                    justifyContent: 'space-around',
                    margin: [20, 0, 40],
                  }}
                >
                  <UI.PassProps size={40}>
                    <UI.Icon name="social-slack" />
                    <UI.Icon name="social-github" />
                    <UI.Icon name="social-google" />
                    <UI.Icon name="social-dropbox" />
                    <UI.Icon name="social-trello" />
                    <UI.Icon name="social-slack" />
                    <UI.Icon name="social-github" />
                    <UI.Icon name="social-google" />
                    <UI.Icon name="social-dropbox" />
                    <UI.Icon name="social-trello" />
                  </UI.PassProps>
                </logos>

                <hr />

                <tooltip
                  css={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <inner
                    css={{
                      background: '#fff',
                      borderRadius: 10,
                      padding: [10, 20],
                      marginBottom: -20,
                    }}
                  >
                    <Text size={1.1} textAlign="center">
                      Scroll down to see it in action
                    </Text>
                  </inner>
                </tooltip>
              </content>
            </sectionContent>
          </section>

          <section $bordered $padded>
            <sectionContent $padRight>
              <img
                css={{
                  position: 'absolute',
                  top: -20,
                  right: -350,
                  transition: 'all ease-in 300ms',
                  animation: 'rotate 2s infinite',
                }}
                src="/orbitals.svg"
              />
              <Title size={3}>Unified Knowledge</Title>
              <Text size={2}>How it works:</Text>
              <Text size={1.6}>
                <ol $list>
                  <li>Orbit hooks into all your cloud services and content.</li>
                  <li>Orbit privately hooks into your own email and chat.</li>
                  <li>
                    Orbit builds a smart index of your company knowledge using
                    machine learning discovered in the last year.
                  </li>
                  <li>
                    Orbit provides you precise and relevant answers in context,
                    wherever you are -- in chat, while writing emails, or while
                    browsing the web.
                  </li>
                  <li>
                    Search your entire company, including your slack
                    conversations, instantly.
                  </li>
                </ol>
              </Text>
            </sectionContent>
          </section>

          <UI.Theme name="dark">
            <section $bordered $padded $dark>
              <sectionContent $padRight>
                <Title size={3}>The No-Cloud Infrastructure</Title>
                <Text size={2}>
                  Orbit needed to invent a new model:<br />
                  one that keeps your company safe.
                </Text>
                <Text>
                  Here's the rub. To provide great context, Orbit needs to hook
                  into a lot of company data to be valuable. Your Slack, email,
                  documents, tasks, and all company knowledge.
                </Text>

                <Text>How do you do that completely securely?</Text>

                <Text>
                  Answer: your data never once leaves your local computer. We
                  never see it, and neither does anyone else.
                </Text>
                <Text>
                  <Hl>
                    This allows us to both be ambitious from day one while not
                    causing a security nightmare.
                  </Hl>{' '}
                  Orbit can crawl everything that's relevant to you and your
                  team without fear of data breaches, permissions exposures, or
                  the need to run a complicated on-prem installs.
                </Text>
              </sectionContent>
            </section>
          </UI.Theme>

          <footer>
            <section $padded $$centered>
              <Text>Orbit is going into private beta in December.</Text>
            </section>
          </footer>
        </contents>
      </page>
    )
  }

  static theme = ({ blurred }) => {
    if (!blurred) {
      return {}
    }
    return {
      section: {
        filter: 'blur(40px)',
      },
    }
  }

  static style = {
    page: {},
    section: {
      marginLeft: -100,
      marginRight: -100,
      paddingLeft: 100,
      paddingRight: 100,
    },
    sectionContent: {
      width: '85%',
      minWidth: 300,
      maxWidth: 800,
      margin: [0, 'auto'],
      position: 'relative',
    },
    padded: {
      padding: [85, 0],
    },
    padRight: {
      paddingRight: 300,
    },
    dark: {
      background: '#171717',
    },
    narrow: {
      maxWidth: 500,
      alignSelf: 'center',
    },
    bordered: {
      borderBottom: [1, [0, 0, 0, 0.05]],
    },
    screen: {
      marginTop: 25,
      marginBottom: -25,
      zIndex: 100,
      width: 2054 / 3,
      height: 1762 / 3,
      alignSelf: 'center',
    },
    liTitle: {
      marginLeft: 15,
      marginBottom: 0,
    },
    mainList: {
      padding: [0, 20],

      '& > li': {
        listStylePosition: 'inside',
        listStyleType: 'decimal-leading-zero',
        margin: [0, 0, 0, -40],
      },
    },
    list: {
      '& > li': {
        listStylePosition: 'auto',
        listStyleType: 'decimal',
        margin: [0, 0, 15, 30],
      },
    },
    hr: {
      display: 'flex',
      height: 0,
      border: 'none',
      borderTop: [1, [0, 0, 0, 0.05]],
      margin: [15, 0],
      padding: [10, 0],
    },
    break: {
      height: 30,
    },
    footer: {
      height: 150,
    },
    starry: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: 0,
      backgroundImage: `url(/4-point-stars.svg)`,
      backgroundSize: '1%',
    },
  }
}
