// YO
// these are here because they mess up HMR
// leave them in their own file

const isNode = process.env.PROCESS_NAME === 'syncers' || process.env.PROCESS_NAME === 'desktop'

export const appIcons = isNode
  ? {}
  : {
      ['orbit-search-full']: require('!raw-loader!../../public/icons/appicon-search.svg').default,
      ['orbit-topics-full']: require('!raw-loader!../../public/icons/appicon-topics.svg').default,
      ['orbit-people-full']: require('!raw-loader!../../public/icons/appicon-people.svg').default,
      ['orbit-lists-full']: require('!raw-loader!../../public/icons/appicon-lists.svg').default,
      ['orbit-apps-full']: require('!raw-loader!../../public/icons/appicon-apps.svg').default,
      ['orbit-home-full']: require('!raw-loader!../../public/icons/appicon-home.svg').default,
      ['orbit-custom-full']: require('!raw-loader!../../public/icons/appicon-custom.svg').default,
      ['orbit-settings-full']: require('!raw-loader!../../public/icons/appicon-settings.svg')
        .default,
      orbit: require('!raw-loader!../../public/icons/icon-orbit.svg').default,
      ['orbit-search']: require('!raw-loader!../../public/icons/icon-search.svg').default,
      ['orbit-home']: require('!raw-loader!../../public/icons/icon-home.svg').default,
      ['orbit-topics']: require('!raw-loader!../../public/icons/icon-topics.svg').default,
      ['orbit-people']: require('!raw-loader!../../public/icons/icon-people.svg').default,
      ['orbit-lists']: require('!raw-loader!../../public/icons/icon-lists.svg').default,
      ['orbit-apps']: require('!raw-loader!../../public/icons/icon-apps.svg').default,
      ['orbit-custom']: require('!raw-loader!../../public/icons/icon-custom.svg').default,
      ['orbit-sources']: require('!raw-loader!../../public/icons/icon-sources.svg').default,
      ['orbit-settings']: require('!raw-loader!../../public/icons/icon-settings.svg').default,

      orbitalSmall: require('!raw-loader!../../public/orbital-small.svg').default,

      neutral: require('!raw-loader!../../public/icons/neutral.svg').default,
      upArrow: require('!raw-loader!../../public/icons/up-arrow.svg').default,
      downArrow: require('!raw-loader!../../public/icons/down-arrow.svg').default,
      verticalDots: require('!raw-loader!../../public/icons/vertical-dots.svg').default,
    }
