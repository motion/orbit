import ZenScroll from 'zenscroll'

export const scrollTo = query => () =>
  ZenScroll.to(document.querySelector(query))
