import * as React from 'react'
import fuzzy from 'fuzzysort'
import { SVG } from './SVG'
import { memo } from '../helpers/memo'

const icons = {
  orbitalSmall: require('!raw-loader!../../public/orbital-small.svg'),
  sidebar: require('!raw-loader!../../public/streamline/sidebar.svg'),

  add: require('!raw-loader!../../public/streamline/add.svg'),
  addCircle: require('!raw-loader!../../public/streamline/add-circle.svg'),
  alertCircle: require('!raw-loader!../../public/streamline/alert-circle.svg'),
  alertDiamond: require('!raw-loader!../../public/streamline/alert-diamond.svg'),
  alertTriangle: require('!raw-loader!../../public/streamline/alert-triangle.svg'),
  appWindow: require('!raw-loader!../../public/streamline/app-window.svg'),
  appWindowTwo: require('!raw-loader!../../public/streamline/app-window-two.svg'),
  bin1: require('!raw-loader!../../public/streamline/bin-1.svg'),
  bookLibrary1: require('!raw-loader!../../public/streamline/book-library-1.svg'),
  bookOpenBookmark: require('!raw-loader!../../public/streamline/book-open-bookmark.svg'),
  bookOpenText: require('!raw-loader!../../public/streamline/book-open-text.svg'),
  calendar: require('!raw-loader!../../public/streamline/calendar.svg'),
  calendar1: require('!raw-loader!../../public/streamline/calendar-1.svg'),
  calendar3: require('!raw-loader!../../public/streamline/calendar-3.svg'),
  calendarDate: require('!raw-loader!../../public/streamline/calendar-date.svg'),
  checkCircle1: require('!raw-loader!../../public/streamline/check-circle-1.svg'),
  checklist: require('!raw-loader!../../public/streamline/checklist.svg'),
  cog: require('!raw-loader!../../public/streamline/cog.svg'),
  delete: require('!raw-loader!../../public/streamline/delete.svg'),
  expand3: require('!raw-loader!../../public/streamline/expand-3.svg'),
  expand6: require('!raw-loader!../../public/streamline/expand-6.svg'),
  filter: require('!raw-loader!../../public/streamline/filter.svg'),
  filter1: require('!raw-loader!../../public/streamline/filter-1.svg'),
  filter2: require('!raw-loader!../../public/streamline/filter-2.svg'),
  flash: require('!raw-loader!../../public/streamline/flash.svg'),
  folder: require('!raw-loader!../../public/streamline/folder.svg'),
  folderEmpty: require('!raw-loader!../../public/streamline/folder-empty.svg'),
  graphStatsAscend: require('!raw-loader!../../public/streamline/graph-stats-ascend.svg'),
  graphStatsCircle: require('!raw-loader!../../public/streamline/graph-stats-circle.svg'),
  graphStatsSquare: require('!raw-loader!../../public/streamline/graph-stats-square.svg'),
  house: require('!raw-loader!../../public/streamline/house.svg'),
  house1: require('!raw-loader!../../public/streamline/house-1.svg'),
  houseChimney2: require('!raw-loader!../../public/streamline/house-chimney-2.svg'),
  informationCircle: require('!raw-loader!../../public/streamline/information-circle.svg'),
  irisScan1: require('!raw-loader!../../public/streamline/iris-scan-1.svg'),
  irisScanSearch: require('!raw-loader!../../public/streamline/iris-scan-search.svg'),
  keyboardArrowDown: require('!raw-loader!../../public/streamline/keyboard-arrow-down.svg'),
  keyboardArrowReturn: require('!raw-loader!../../public/streamline/keyboard-arrow-return.svg'),
  keyboardArrowUp: require('!raw-loader!../../public/streamline/keyboard-arrow-up.svg'),
  keyboardButtonDirection: require('!raw-loader!../../public/streamline/keyboard-button-direction.svg'),
  keyboardCommand: require('!raw-loader!../../public/streamline/keyboard-command.svg'),
  keyboardOption: require('!raw-loader!../../public/streamline/keyboard-option.svg'),
  keyboardReturn: require('!raw-loader!../../public/streamline/keyboard-return.svg'),
  keyboardShift1: require('!raw-loader!../../public/streamline/keyboard-shift-1.svg'),
  layoutCornersDashboard1: require('!raw-loader!../../public/streamline/layout-corners-dashboard-1.svg'),
  layoutDashboard: require('!raw-loader!../../public/streamline/layout-dashboard.svg'),
  layoutModule: require('!raw-loader!../../public/streamline/layout-module.svg'),
  layoutModule1: require('!raw-loader!../../public/streamline/layout-module-1.svg'),
  layoutModule2: require('!raw-loader!../../public/streamline/layout-module-2.svg'),
  listBullets: require('!raw-loader!../../public/streamline/list-bullets.svg'),
  loading: require('!raw-loader!../../public/streamline/loading.svg'),
  loading1: require('!raw-loader!../../public/streamline/loading-1.svg'),
  loading2: require('!raw-loader!../../public/streamline/loading-2.svg'),
  loading3: require('!raw-loader!../../public/streamline/loading-3.svg'),
  loadingBar1: require('!raw-loader!../../public/streamline/loading-bar-1.svg'),
  loadingCircle: require('!raw-loader!../../public/streamline/loading-circle.svg'),
  loadingCircle1: require('!raw-loader!../../public/streamline/loading-circle-1.svg'),
  loadingCircle2: require('!raw-loader!../../public/streamline/loading-circle-2.svg'),
  loadingHalf: require('!raw-loader!../../public/streamline/loading-half.svg'),
  lock2: require('!raw-loader!../../public/streamline/lock-2.svg'),
  login3: require('!raw-loader!../../public/streamline/login-3.svg'),
  loginKey: require('!raw-loader!../../public/streamline/login-key.svg'),
  loveIt: require('!raw-loader!../../public/streamline/love-it.svg'),
  messagesBubble: require('!raw-loader!../../public/streamline/messages-bubble.svg'),
  messagesBubbleSquare: require('!raw-loader!../../public/streamline/messages-bubble-square.svg'),
  messagesBubbleSquareTyping1: require('!raw-loader!../../public/streamline/messages-bubble-square-typing-1.svg'),
  menu: require('!raw-loader!../../public/streamline/menu.svg'),
  menu2: require('!raw-loader!../../public/streamline/menu2.svg'),
  module: require('!raw-loader!../../public/streamline/module.svg'),
  multipleActionsAdd: require('!raw-loader!../../public/streamline/multiple-actions-add.svg'),
  multipleActionsEdit1: require('!raw-loader!../../public/streamline/multiple-actions-edit-1.svg'),
  multipleCircle: require('!raw-loader!../../public/streamline/multiple-circle.svg'),
  multipleHome: require('!raw-loader!../../public/streamline/multiple-home.svg'),
  multipleManWoman1: require('!raw-loader!../../public/streamline/multiple-man-woman-1.svg'),
  multipleManWoman2: require('!raw-loader!../../public/streamline/multiple-man-woman-2.svg'),
  multipleManWoman4: require('!raw-loader!../../public/streamline/multiple-man-woman-4.svg'),
  multipleNeutral1: require('!raw-loader!../../public/streamline/multiple-neutral-1.svg'),
  multipleNeutral2: require('!raw-loader!../../public/streamline/multiple-neutral-2.svg'),
  multipleUsers1: require('!raw-loader!../../public/streamline/multiple-users-1.svg'),
  multipleUsers3: require('!raw-loader!../../public/streamline/multiple-users-3.svg'),
  multipleWoman2: require('!raw-loader!../../public/streamline/multiple-woman-2.svg'),
  navigationDownCircle: require('!raw-loader!../../public/streamline/navigation-down-circle.svg'),
  navigationLeftCircle: require('!raw-loader!../../public/streamline/navigation-left-circle.svg'),
  navigationLeftCircle2: require('!raw-loader!../../public/streamline/navigation-left-circle-2.svg'),
  navigationUpCircle: require('!raw-loader!../../public/streamline/navigation-up-circle.svg'),
  newspaperReadMan: require('!raw-loader!../../public/streamline/newspaper-read-man.svg'),
  notesPaperText: require('!raw-loader!../../public/streamline/notes-paper-text.svg'),
  passwordLock2: require('!raw-loader!../../public/streamline/password-lock-2.svg'),
  pencil: require('!raw-loader!../../public/streamline/pencil.svg'),
  pin: require('!raw-loader!../../public/streamline/pin.svg'),
  powerButton: require('!raw-loader!../../public/streamline/power-button.svg'),
  questionCircle: require('!raw-loader!../../public/streamline/question-circle.svg'),
  questionHelpMessage: require('!raw-loader!../../public/streamline/question-help-message.svg'),
  questionHelpSquare: require('!raw-loader!../../public/streamline/question-help-square.svg'),
  ratingStar: require('!raw-loader!../../public/streamline/rating-star.svg'),
  ratingStar1: require('!raw-loader!../../public/streamline/rating-star-1.svg'),
  remove: require('!raw-loader!../../public/streamline/remove.svg'),
  removeCircle: require('!raw-loader!../../public/streamline/remove-circle.svg'),
  share: require('!raw-loader!../../public/streamline/share.svg'),
  share1: require('!raw-loader!../../public/streamline/share-1.svg'),
  share2: require('!raw-loader!../../public/streamline/share-2.svg'),
  share3: require('!raw-loader!../../public/streamline/share-3.svg'),
  singleNeutral: require('!raw-loader!../../public/streamline/single-neutral.svg'),
  singleNeutralActionsAdd: require('!raw-loader!../../public/streamline/single-neutral-actions-add.svg'),
  singleNeutralActionsCheck1: require('!raw-loader!../../public/streamline/single-neutral-actions-check-1.svg'),
  singleNeutralActionsEdit1: require('!raw-loader!../../public/streamline/single-neutral-actions-edit-1.svg'),
  singleNeutralActionsStar: require('!raw-loader!../../public/streamline/single-neutral-actions-star.svg'),
  singleNeutralActionsView: require('!raw-loader!../../public/streamline/single-neutral-actions-view.svg'),
  singleNeutralBook: require('!raw-loader!../../public/streamline/single-neutral-book.svg'),
  singleNeutralChat: require('!raw-loader!../../public/streamline/single-neutral-chat.svg'),
  singleNeutralCircle: require('!raw-loader!../../public/streamline/single-neutral-circle.svg'),
  singleNeutralFind: require('!raw-loader!../../public/streamline/single-neutral-find.svg'),
  singleNeutralFocus: require('!raw-loader!../../public/streamline/single-neutral-focus.svg'),
  singleNeutralHierachy: require('!raw-loader!../../public/streamline/single-neutral-hierachy.svg'),
  singleNeutralHome: require('!raw-loader!../../public/streamline/single-neutral-home.svg'),
  singleNeutralProfilePicture: require('!raw-loader!../../public/streamline/single-neutral-profile-picture.svg'),
  singleNeutralSearch: require('!raw-loader!../../public/streamline/single-neutral-search.svg'),
  subtractCircle: require('!raw-loader!../../public/streamline/subtract-circle.svg'),
  tags: require('!raw-loader!../../public/streamline/tags.svg'),
  timeClockCircle: require('!raw-loader!../../public/streamline/time-clock-circle.svg'),
  trendsHotFlame: require('!raw-loader!../../public/streamline/trends-hot-flame.svg'),
  view1: require('!raw-loader!../../public/streamline/view-1.svg'),
  viewOff: require('!raw-loader!../../public/streamline/view-off.svg'),
  zoomIn: require('!raw-loader!../../public/streamline/zoom-in.svg'),
  zoomOut: require('!raw-loader!../../public/streamline/zoom-out.svg'),
  // custom icons
  neutral: require('!raw-loader!../../public/icons/neutral.svg'),
  upArrow: require('!raw-loader!../../public/icons/up-arrow.svg'),
  downArrow: require('!raw-loader!../../public/icons/down-arrow.svg'),
}

const iconNames = Object.keys(icons)
const cache = {}
const findIconName = name => {
  if (cache[name]) {
    return cache[name]
  }
  if (iconNames[name]) {
    return iconNames[name]
  }
  const matches = fuzzy.go(name, iconNames)
  if (matches.length) {
    return matches[0].target
  }
  return false
}

type IconProps = React.HTMLProps<SVGElement> & {
  name: string
  fill?: string
  size?: number
  style?: any
}

export const Icon = memo(({ name, fill, size = 32, style = null, ...props }: IconProps) => {
  const iconName = findIconName(name)
  if (!iconName) {
    return null
  }
  const icon = icons[iconName]
  return (
    <SVG
      {...(fill ? { fill } : null)}
      svg={icon}
      width={`${size}`}
      height={`${size}`}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        width: size,
        height: size,
        ...style,
      }}
      cleanup={['fill', 'title', 'desc']}
      {...props}
    />
  )
})
