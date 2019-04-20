import ZenScroll from 'zenscroll'

export const scrollTo = (query: string) => ZenScroll.to(document.querySelector(query), 100)

window['ZenScroll'] = ZenScroll
