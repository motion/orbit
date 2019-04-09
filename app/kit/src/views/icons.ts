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
    }

export const icons = isNode
  ? {}
  : {
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
      sidebar: require('!raw-loader!../../public/streamline/sidebar.svg').default,

      add: require('!raw-loader!../../public/streamline/add.svg').default,
      addCircle: require('!raw-loader!../../public/streamline/add-circle.svg').default,
      alertCircle: require('!raw-loader!../../public/streamline/alert-circle.svg').default,
      alertDiamond: require('!raw-loader!../../public/streamline/alert-diamond.svg').default,
      alertTriangle: require('!raw-loader!../../public/streamline/alert-triangle.svg').default,
      appWindow: require('!raw-loader!../../public/streamline/app-window.svg').default,
      appWindowTwo: require('!raw-loader!../../public/streamline/app-window-two.svg').default,
      bin1: require('!raw-loader!../../public/streamline/bin-1.svg').default,
      bookLibrary1: require('!raw-loader!../../public/streamline/book-library-1.svg').default,
      bookOpenBookmark: require('!raw-loader!../../public/streamline/book-open-bookmark.svg')
        .default,
      bookOpenText: require('!raw-loader!../../public/streamline/book-open-text.svg').default,
      checkCircle1: require('!raw-loader!../../public/streamline/check-circle-1.svg').default,
      checklist: require('!raw-loader!../../public/streamline/checklist.svg').default,
      delete: require('!raw-loader!../../public/streamline/delete.svg').default,
      expand3: require('!raw-loader!../../public/streamline/expand-3.svg').default,
      expand6: require('!raw-loader!../../public/streamline/expand-6.svg').default,
      flash: require('!raw-loader!../../public/streamline/flash.svg').default,
      folder: require('!raw-loader!../../public/streamline/folder.svg').default,
      folderEmpty: require('!raw-loader!../../public/streamline/folder-empty.svg').default,
      graphStatsAscend: require('!raw-loader!../../public/streamline/graph-stats-ascend.svg')
        .default,
      graphStatsCircle: require('!raw-loader!../../public/streamline/graph-stats-circle.svg')
        .default,
      graphStatsSquare: require('!raw-loader!../../public/streamline/graph-stats-square.svg')
        .default,
      house: require('!raw-loader!../../public/streamline/house.svg').default,
      house1: require('!raw-loader!../../public/streamline/house-1.svg').default,
      houseChimney2: require('!raw-loader!../../public/streamline/house-chimney-2.svg').default,
      informationCircle: require('!raw-loader!../../public/streamline/information-circle.svg')
        .default,
      irisScan1: require('!raw-loader!../../public/streamline/iris-scan-1.svg').default,
      irisScanSearch: require('!raw-loader!../../public/streamline/iris-scan-search.svg').default,
      keyboardArrowDown: require('!raw-loader!../../public/streamline/keyboard-arrow-down.svg')
        .default,
      keyboardArrowReturn: require('!raw-loader!../../public/streamline/keyboard-arrow-return.svg')
        .default,
      keyboardArrowUp: require('!raw-loader!../../public/streamline/keyboard-arrow-up.svg').default,
      keyboardButtonDirection: require('!raw-loader!../../public/streamline/keyboard-button-direction.svg')
        .default,
      keyboardCommand: require('!raw-loader!../../public/streamline/keyboard-command.svg').default,
      keyboardOption: require('!raw-loader!../../public/streamline/keyboard-option.svg').default,
      keyboardReturn: require('!raw-loader!../../public/streamline/keyboard-return.svg').default,
      keyboardShift1: require('!raw-loader!../../public/streamline/keyboard-shift-1.svg').default,
      layoutCornersDashboard1: require('!raw-loader!../../public/streamline/layout-corners-dashboard-1.svg')
        .default,
      layoutDashboard: require('!raw-loader!../../public/streamline/layout-dashboard.svg').default,
      layoutModule: require('!raw-loader!../../public/streamline/layout-module.svg').default,
      layoutModule1: require('!raw-loader!../../public/streamline/layout-module-1.svg').default,
      layoutModule2: require('!raw-loader!../../public/streamline/layout-module-2.svg').default,
      listBullets: require('!raw-loader!../../public/streamline/list-bullets.svg').default,
      loading: require('!raw-loader!../../public/streamline/loading.svg').default,
      loading1: require('!raw-loader!../../public/streamline/loading-1.svg').default,
      loading2: require('!raw-loader!../../public/streamline/loading-2.svg').default,
      loading3: require('!raw-loader!../../public/streamline/loading-3.svg').default,
      loadingBar1: require('!raw-loader!../../public/streamline/loading-bar-1.svg').default,
      loadingCircle: require('!raw-loader!../../public/streamline/loading-circle.svg').default,
      loadingCircle1: require('!raw-loader!../../public/streamline/loading-circle-1.svg').default,
      loadingCircle2: require('!raw-loader!../../public/streamline/loading-circle-2.svg').default,
      loadingHalf: require('!raw-loader!../../public/streamline/loading-half.svg').default,
      lock2: require('!raw-loader!../../public/streamline/lock-2.svg').default,
      login3: require('!raw-loader!../../public/streamline/login-3.svg').default,
      loginKey: require('!raw-loader!../../public/streamline/login-key.svg').default,
      loveIt: require('!raw-loader!../../public/streamline/love-it.svg').default,
      messagesBubble: require('!raw-loader!../../public/streamline/messages-bubble.svg').default,
      messagesBubbleSquare: require('!raw-loader!../../public/streamline/messages-bubble-square.svg')
        .default,
      messagesBubbleSquareTyping1: require('!raw-loader!../../public/streamline/messages-bubble-square-typing-1.svg')
        .default,
      menu: require('!raw-loader!../../public/streamline/menu.svg').default,
      menu2: require('!raw-loader!../../public/streamline/menu2.svg').default,
      module: require('!raw-loader!../../public/streamline/module.svg').default,
      multipleActionsAdd: require('!raw-loader!../../public/streamline/multiple-actions-add.svg')
        .default,
      multipleActionsEdit1: require('!raw-loader!../../public/streamline/multiple-actions-edit-1.svg')
        .default,
      multipleCircle: require('!raw-loader!../../public/streamline/multiple-circle.svg').default,
      multipleHome: require('!raw-loader!../../public/streamline/multiple-home.svg').default,
      multipleManWoman1: require('!raw-loader!../../public/streamline/multiple-man-woman-1.svg')
        .default,
      multipleManWoman2: require('!raw-loader!../../public/streamline/multiple-man-woman-2.svg')
        .default,
      multipleManWoman4: require('!raw-loader!../../public/streamline/multiple-man-woman-4.svg')
        .default,
      multipleNeutral1: require('!raw-loader!../../public/streamline/multiple-neutral-1.svg')
        .default,
      multipleNeutral2: require('!raw-loader!../../public/streamline/multiple-neutral-2.svg')
        .default,
      multipleUsers1: require('!raw-loader!../../public/streamline/multiple-users-1.svg').default,
      multipleUsers3: require('!raw-loader!../../public/streamline/multiple-users-3.svg').default,
      multipleWoman2: require('!raw-loader!../../public/streamline/multiple-woman-2.svg').default,
      notesPaperText: require('!raw-loader!../../public/streamline/notes-paper-text.svg').default,
      passwordLock2: require('!raw-loader!../../public/streamline/password-lock-2.svg').default,
      pencil: require('!raw-loader!../../public/streamline/pencil.svg').default,
      powerButton: require('!raw-loader!../../public/streamline/power-button.svg').default,
      questionCircle: require('!raw-loader!../../public/streamline/question-circle.svg').default,
      questionHelpMessage: require('!raw-loader!../../public/streamline/question-help-message.svg')
        .default,
      questionHelpSquare: require('!raw-loader!../../public/streamline/question-help-square.svg')
        .default,
      ratingStar: require('!raw-loader!../../public/streamline/rating-star.svg').default,
      ratingStar1: require('!raw-loader!../../public/streamline/rating-star-1.svg').default,
      remove: require('!raw-loader!../../public/streamline/remove.svg').default,
      removeCircle: require('!raw-loader!../../public/streamline/remove-circle.svg').default,
      subtractCircle: require('!raw-loader!../../public/streamline/subtract-circle.svg').default,
      tags: require('!raw-loader!../../public/streamline/tags.svg').default,
      timeClockCircle: require('!raw-loader!../../public/streamline/time-clock-circle.svg').default,
      trendsHotFlame: require('!raw-loader!../../public/streamline/trends-hot-flame.svg').default,
      view1: require('!raw-loader!../../public/streamline/view-1.svg').default,
      viewOff: require('!raw-loader!../../public/streamline/view-off.svg').default,
      zoomIn: require('!raw-loader!../../public/streamline/zoom-in.svg').default,
      zoomOut: require('!raw-loader!../../public/streamline/zoom-out.svg').default,
      // custom icons
      neutral: require('!raw-loader!../../public/icons/neutral.svg').default,
      upArrow: require('!raw-loader!../../public/icons/up-arrow.svg').default,
      downArrow: require('!raw-loader!../../public/icons/down-arrow.svg').default,
      verticalDots: require('!raw-loader!../../public/icons/vertical-dots.svg').default,
    }
