// @flow
import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import DocPane from './doc'
import GithubPane from './github'

const icons = {
  cal: (
    <svg width="6.444in" height="5.722in">
      <defs>
        <filter
          filterUnits="userSpaceOnUse"
          id="Filter_0"
          x="0px"
          y="0px"
          width="464px"
          height="412px"
        >
          <feOffset in="SourceAlpha" dx="0" dy="6" />
          <feGaussianBlur result="blurOut" stdDeviation="5.916" />
          <feFlood floodColor="rgb(0, 0, 0)" result="floodOut" />
          <feComposite operator="atop" in="floodOut" in2="blurOut" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.2" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter
          filterUnits="userSpaceOnUse"
          id="Filter_1"
          x="34px"
          y="228px"
          width="10px"
          height="26px"
        >
          <feOffset in="SourceAlpha" dx="0" dy="3" />
          <feGaussianBlur result="blurOut" stdDeviation="0" />
          <feFlood floodColor="rgb(2, 3, 3)" result="floodOut" />
          <feComposite operator="atop" in="floodOut" in2="blurOut" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.1" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter
          filterUnits="userSpaceOnUse"
          id="Filter_2"
          x="419px"
          y="228px"
          width="10px"
          height="26px"
        >
          <feOffset in="SourceAlpha" dx="0" dy="3" />
          <feGaussianBlur result="blurOut" stdDeviation="0" />
          <feFlood floodColor="rgb(2, 3, 3)" result="floodOut" />
          <feComposite operator="atop" in="floodOut" in2="blurOut" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.1" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter
          filterUnits="userSpaceOnUse"
          id="Filter_3"
          x="34px"
          y="28px"
          width="395px"
          height="87px"
        >
          <feOffset in="SourceAlpha" dx="0" dy="3" />
          <feGaussianBlur result="blurOut" stdDeviation="0" />
          <feFlood floodColor="rgb(2, 3, 3)" result="floodOut" />
          <feComposite operator="atop" in="floodOut" in2="blurOut" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.1" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#Filter_0)">
        <path
          fillRule="evenodd"
          fillOpacity="0"
          fill="rgb(255, 0, 0)"
          d="M398.141,371.000 L64.859,371.000 C47.816,371.000 34.000,357.165 34.000,340.099 L34.000,327.739 L34.000,288.005 L34.000,288.005 L34.000,275.624 L34.000,71.334 L34.000,58.953 C34.000,41.858 47.816,28.000 64.859,28.000 L398.141,28.000 C415.184,28.000 429.000,41.858 429.000,58.953 L429.000,71.334 L429.000,111.432 L429.000,111.432 L429.000,123.793 L429.000,327.739 L429.000,340.099 C429.000,357.165 415.184,371.000 398.141,371.000 Z"
        />
      </g>
      <path
        fillRule="evenodd"
        fill="rgb(255, 255, 255)"
        d="M398.141,371.000 L64.859,371.000 C47.816,371.000 34.000,357.165 34.000,340.099 L34.000,327.739 L34.000,123.793 L34.000,111.432 L429.000,111.432 L429.000,123.793 L429.000,327.739 L429.000,340.099 C429.000,357.165 415.184,371.000 398.141,371.000 Z"
      />
      <g filter="url(#Filter_1)">
        <path
          fillRule="evenodd"
          fill="rgb(192, 200, 208)"
          d="M34.000,228.856 L43.258,228.856 L43.258,250.487 L34.000,250.487 L34.000,228.856 Z"
        />
      </g>
      <g filter="url(#Filter_2)">
        <path
          fillRule="evenodd"
          fill="rgb(193, 200, 208)"
          d="M419.742,228.856 L429.000,228.856 L429.000,250.487 L419.742,250.487 L419.742,228.856 Z"
        />
      </g>
      <path
        fillRule="evenodd"
        fillOpacity="0"
        opacity="0.678"
        fill="rgb(255, 255, 255)"
        d="M34.000,148.514 L429.000,148.514 L429.000,241.216 L34.000,241.216 L34.000,148.514 Z"
      />
      <path
        fill="url(#PSgrad_0)"
        d="M34.000,148.514 L429.000,148.514 L429.000,241.216 L34.000,241.216 L34.000,148.514 Z"
      />
      <g filter="url(#Filter_3)">
        <path
          fillRule="evenodd"
          fill="rgb(250, 86, 90)"
          d="M34.000,111.432 L34.000,58.901 C34.000,41.835 47.816,28.000 64.859,28.000 L398.141,28.000 C415.184,28.000 429.000,41.835 429.000,58.901 L429.000,111.432 L34.000,111.432 Z"
        />
      </g>
      <text
        fontFamily="Helvetica"
        fill="rgb(255, 255, 255)"
        transform="matrix( 3.0859375, 0, 0, 3.09009009009009,158.8871875, 56.9322432432432)"
        fontWeight="bold"
        fontSize="13px"
      >
        August
      </text>
      <path
        fillRule="evenodd"
        fill="rgb(228, 228, 228)"
        d="M86.461,120.703 L89.547,120.703 L89.547,371.000 L86.461,371.000 L86.461,120.703 Z"
      />
      <path
        fillRule="evenodd"
        fill="rgb(228, 228, 228)"
        d="M145.094,120.703 L148.180,120.703 L148.180,371.000 L145.094,371.000 L145.094,120.703 Z"
      />
      <path
        fillRule="evenodd"
        fill="rgb(228, 228, 228)"
        d="M203.727,120.703 L206.813,120.703 L206.813,371.000 L203.727,371.000 L203.727,120.703 Z"
      />
      <path
        fillRule="evenodd"
        fill="rgb(228, 228, 228)"
        d="M259.273,120.703 L262.359,120.703 L262.359,371.000 L259.273,371.000 L259.273,120.703 Z"
      />
      <path
        fillRule="evenodd"
        fill="rgb(228, 228, 228)"
        d="M317.906,120.703 L320.992,120.703 L320.992,371.000 L317.906,371.000 L317.906,120.703 Z"
      />
      <path
        fillRule="evenodd"
        fill="rgb(228, 228, 228)"
        d="M34.000,173.234 L34.000,170.144 L429.000,170.144 L429.000,173.234 L34.000,173.234 Z"
      />
      <path
        fillRule="evenodd"
        fill="rgb(228, 228, 228)"
        d="M34.000,225.766 L34.000,222.676 L429.000,222.676 L429.000,225.766 L34.000,225.766 Z"
      />
      <path
        fillRule="evenodd"
        fill="rgb(228, 228, 228)"
        d="M34.000,275.207 L34.000,272.117 L429.000,272.117 L429.000,275.207 L34.000,275.207 Z"
      />
      <path
        fillRule="evenodd"
        fill="rgb(228, 228, 228)"
        d="M34.000,324.649 L34.000,321.559 L429.000,321.559 L429.000,324.649 L34.000,324.649 Z"
      />
      <path
        fillRule="evenodd"
        fill="rgb(228, 228, 228)"
        d="M376.539,120.703 L379.625,120.703 L379.625,371.000 L376.539,371.000 L376.539,120.703 Z"
      />
    </svg>
  ),
  gmail: (
    <svg x="0px" y="0px" viewBox="0 0 512 512">
      <g>
        <polygon
          style={{ fill: '#0093EB' }}
          points="100.571,383.086 100.571,341.943 170.057,382.171 256,301.714 256,484.571 	"
        />
        <polygon
          style={{ fill: '#0093EB' }}
          points="17.371,274.286 107.886,192 256,283.429 170.057,363.886 	"
        />
        <polygon
          style={{ fill: '#0093EB' }}
          points="107.886,192 0,109.714 155.429,27.429 265.143,100.571 	"
        />
        <polygon
          style={{ fill: '#0093EB' }}
          points="411.429,384 256,484.571 256,301.714 344.686,378.514 411.429,336.457 	"
        />
        <polygon
          style={{ fill: '#0093EB' }}
          points="344.686,360.229 256,283.429 405.029,188.343 494.629,265.143 	"
        />
        <polygon
          style={{ fill: '#0093EB' }}
          points="405.029,188.343 265.143,100.571 374.857,27.429 512,109.714 	"
        />
      </g>
    </svg>
  ),

  drive: (
    <svg viewBox="0 0 139 120.4">
      <radialGradient
        id="a"
        cx="-254.81979"
        cy="705.83588"
        gradientTransform="matrix(2.827 1.6322 -1.6322 2.827 2092.1199 -1494.5786)"
        gradientUnits="userSpaceOnUse"
        r="82.978401"
      >
        <stop offset="0" stopColor="#4387fd" />
        <stop offset=".65" stopColor="#3078f0" />
        <stop offset=".9099" stopColor="#2b72ea" />
        <stop offset="1" stopColor="#286ee6" />
      </radialGradient>
      <radialGradient
        id="b"
        cx="-254.8174"
        cy="705.83691"
        gradientTransform="matrix(2.827 1.6322 -1.6322 2.827 2092.1199 -1494.5786)"
        gradientUnits="userSpaceOnUse"
        r="82.973"
      >
        <stop offset="0" stopColor="#ffd24d" />
        <stop offset="1" stopColor="#f6c338" />
      </radialGradient>
      <path d="m24.2 120.4-24.2-41.9 45.3-78.5 24.2 41.9z" fill="#0da960" />
      <path d="m24.2 120.4 24.2-41.9h90.6l-24.2 41.9z" fill="url(#a)" />
      <path d="m139 78.5h-48.4l-45.3-78.5h48.4z" fill="url(#b)" />
      <path d="m69.5 78.5h-21.1l10.5-18.3-34.7 60.2z" fill="#2d6fdd" />
      <path d="m90.6 78.5h48.4l-58.9-18.3z" fill="#e5b93c" />
      <path d="m58.9 60.2 10.6-18.3-24.2-41.9z" fill="#0c9b57" />
    </svg>
  ),
}

class BarFeedStore {
  start() {
    this.props.getRef(this)
  }

  get results() {
    return [
      {
        id: 0,
        title: 'Item 1',
        action: 'edited',
        date: '2m ago',
        content: (
          <DocPane
            key={'docPane'}
            data={{
              title: 'Product Page Planning Meeting Aug. 5',
              id: '52',
              author: 'Nate',
            }}
          />
        ),
        author: {
          title: 'Nate',
          image: 'me',
        },
      },
      {
        id: 1,
        title: 'Item 1',
        action: 'edited',
        date: '2m ago',
        content: (
          <p key="edit">
            This is a much longer edit. Lorem ipsum dolor sit amet, consectetur
            adipisicing elit.
          </p>
        ),
        icon: 'drive',
        author: {
          title: 'Nick',
          image: 'nick',
        },
      },
      {
        id: 3,
        title: 'Item 1',
        action: 'uploaded a new document',
        content: (
          <GithubPane
            key="ghPane"
            data={{
              title: 'Kubernetes React Integration',
              id: '52',
              author: 'Steph',
            }}
          />
        ),
        date: '2m ago',
        author: {
          title: 'Steph',
          image: 'steph',
        },
      },
      {
        id: 2,
        title: 'Item 1',
        action: 'edited',
        date: '2m ago',
        content: (
          <p key="gmail">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          </p>
        ),
        icon: 'gmail',
        author: {
          title: 'Nick',
          image: 'nick',
        },
      },
    ].filter(x => !!x)
  }
}

@view({
  store: BarFeedStore,
})
export default class BarFeed {
  render({ store, highlightIndex, activeIndex, data }) {
    const results = store.results.map((result, index) => {
      const parent = (data && data.author) || result.author

      return (
        <feeditem $active={activeIndex === index} key={result.id}>
          <meta>
            <avatar $img={`/images/${parent.image}.jpg`} />
            <UI.Text $name>
              {parent.title}{' '}
            </UI.Text>
            <UI.Text $action>
              {result.action}{' '}
            </UI.Text>
            <UI.Text $date>
              {result.date}{' '}
            </UI.Text>
          </meta>
          <body if={result.content}>
            <content>
              <UI.Text>
                {result.content}
              </UI.Text>
            </content>
            <icon if={result.icon}>
              <iconBg />
              {icons[result.icon]}
            </icon>
          </body>
        </feeditem>
      )
    })

    const content = (
      <contents>
        <section>
          <UI.Title size={2}>Stephanie He</UI.Title>
        </section>

        <section $$row>
          <UI.Title>Now</UI.Title>{' '}
          <subtitle $$row $$centered>
            <UI.Badge
              background="rgb(34.5%, 64.6%, 67.5%)"
              color="white"
              marginRight={8}
            >
              #52
            </UI.Badge>{' '}
            <UI.Text color="#fff" size={1.05}>
              Kubernetes integration with new cloud setup
            </UI.Text>
          </subtitle>
        </section>

        <section $personal>
          <UI.Title>Calender</UI.Title>
          <content
            $$row
            css={{ width: '100%', overflowX: 'scroll', margin: [-5, 0] }}
          >
            <item
              if={false}
              css={{
                width: 50,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <icon css={{ transform: { scale: 0.1, x: -200, y: -210 } }}>
                {icons.cal}
              </icon>
            </item>

            {[
              {
                content: (
                  <cool
                    $$row
                    css={{
                      color: '#000',
                      width: 60,
                      justifyContent: 'center',
                      position: 'relative',
                      fontWeight: 500,
                      transform: {
                        y: 35,
                        scale: 1.1,
                      },
                    }}
                  >
                    <icon
                      css={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        transform: { scale: 0.1, x: -200, y: -300 },
                      }}
                    >
                      {icons.cal}
                    </icon>

                    <inner
                      css={{
                        transform: { y: 3, x: -6, scale: 0.9 },
                        flexFlow: 'row',
                      }}
                    >
                      <month
                        key={0}
                        css={{
                          fontSize: 16,
                          marginRight: 3,
                          flexFlow: 'row',
                          transform: {
                            scale: 1,
                          },
                        }}
                      >
                        <month css={{ fontSize: 14, transform: { y: -6 } }}>
                          12
                        </month>
                        <sep
                          css={{
                            fontSize: 18,
                            opacity: 0.6,
                            transform: { rotate: '25deg', x: -19, y: 4 },
                          }}
                        >
                          /
                        </sep>
                        <day css={{ fontSize: 18, transform: { y: 6, x: -3 } }}>
                          7
                        </day>
                      </month>
                    </inner>
                  </cool>
                ),
              },
              {
                month: '12',
                day: '7',
                time: '7am',
                description: 'IdeaDrive w/Search team',
              },
              {
                month: '12',
                day: '7',
                time: '10am',
                description: 'OKR Review w/James',
              },
              {
                month: '12',
                day: '7',
                time: '3pm',
                description: 'Planetary fundraiser',
              },
              {
                month: '12',
                day: '8',
                time: '8am',
                description: 'Q4 linkup review',
              },
              {
                month: '12',
                day: '8',
                time: '10:30am',
                description: '1on1 with Dave',
              },
            ].map(
              (item, index) =>
                item.content ||
                <item
                  if={!item.content}
                  key={index}
                  css={{
                    width: '16.6666%',
                    minWidth: 110,
                    padding: [10, 25, 10, 0],
                    color: '#fff',
                  }}
                >
                  <date
                    css={{
                      opacity: 1,
                      flexFlow: 'row',
                    }}
                  >
                    <time
                      css={{
                        fontSize: 16,
                        opacity: 0.5,
                        fontWeight: 300,
                        marginLeft: 0,
                      }}
                    >
                      {item.time}
                    </time>
                  </date>
                  <description
                    css={{
                      fontSize: 14,
                      lineHeight: '17px',
                      marginTop: 10,
                      fontWeight: 400,
                    }}
                  >
                    {item.description}
                  </description>
                </item>
            )}
          </content>
        </section>

        <section $feeditems $inApp={data.special}>
          <UI.Title>Recently</UI.Title>
          <unpad>
            {results}
          </unpad>
        </section>
      </contents>
    )

    if (!data.special) {
      return (
        <feed>
          {content}
        </feed>
      )
    }

    return (
      <UI.Theme name="light">
        <feed>
          <apps
            if={data.special}
            css={{ borderBottom: [2, [0, 0, 0, 0.0001]] }}
          >
            <UI.TabPane
              tabs={[
                <tab>
                  <UI.Badge
                    background="rgb(34.5%, 67.5%, 34.5%)"
                    color="white"
                    marginRight={8}
                  >
                    #301
                  </UI.Badge>
                  <UI.Text ellipse>Product Page Something Or Other</UI.Text>
                </tab>,
                <tab>
                  <UI.Badge
                    background="rgb(34.5%, 64.6%, 67.5%)"
                    color="white"
                    marginRight={8}
                  >
                    #52
                  </UI.Badge>
                  <UI.Text ellipse>
                    Kubernetes React Integration Thingie
                  </UI.Text>
                </tab>,
              ]}
            >
              <DocPane
                data={{
                  title: 'Product Page Integration',
                  id: '301',
                  author: 'Nate',
                }}
              />
              <GithubPane
                data={{
                  title: 'Kubernetes React Integration',
                  id: '52',
                  author: 'Steph',
                }}
              />
            </UI.TabPane>
          </apps>

          {content}
        </feed>
      </UI.Theme>
    )
  }

  static style = {
    feed: {
      flex: 1,
      minWidth: 200,
      padding: [0, 10],
      overflowY: 'scroll',
    },
    unpad: {
      margin: [0, -15],
    },
    tab: {
      flexFlow: 'row',
      overflow: 'hidden',
      maxWidth: '100%',
    },
    feeditem: {
      padding: [10, 25],
      margin: [0, -5],
      color: '#fff',
      borderBottom: [1, [0, 0, 0, 0.05]],
    },
    meta: {
      flexFlow: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      whiteSpace: 'pre',
      fontSize: 13,
      marginBottom: 5,
    },
    name: {
      fontWeight: 500,
    },
    action: {
      opacity: 0.5,
    },
    date: {
      opacity: 0.5,
    },
    body: {
      flexFlow: 'row',
    },
    inApp: {
      padding: [10, 15],
      background: '#f2f2f2',
    },
    content: {
      flex: 1,
      padding: [2, 5],
    },
    icon: {
      width: 30,
      height: 30,
      margin: [10, 5, 0],
      position: 'relative',
    },
    section: {
      padding: [8, 10],
      borderBottom: [1, [0, 0, 0, 0.05]],
    },
    iconBg: {
      position: 'absolute',
      top: -2,
      zIndex: -1,
      width: '100%',
      height: '100%',
      transform: {
        scale: 1.2,
      },
      background: '#fff',
      borderRadius: 1000,
      opacity: 0.05,
    },
    span: {
      marginRight: 4,
    },
    avatar: {
      width: 18,
      height: 18,
      borderRadius: 100,
      marginRight: 8,
    },
    img: src => ({
      background: `url(${src})`,
      backgroundSize: 'cover',
    }),
    active: {
      background: [0, 0, 0, 0.05],
    },
  }
}
