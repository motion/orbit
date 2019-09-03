// for easy pre-loading
export const routeTable = {
  '/docs': () => import(/* webpackChunkName: "DocsPage" */ './pages/DocsPage'),
  '/guides': () => import(/* webpackChunkName: "GuidesPage" */ './pages/GuidesPage'),
  '/blog': () => import(/* webpackChunkName: "BlogPage" */ './pages/BlogPage'),
  '/about': () => import(/* webpackChunkName: "AboutPage" */ './pages/AboutPage'),
  '/beta': () => import(/* webpackChunkName: "BetaPage" */ './pages/BetaPage'),
  '/apps': () => import(/* webpackChunkName: "AppsPage" */ './pages/AppsPage'),
  '/privacy': () => import(/* webpackChunkName: "PrivacyPage" */ './pages/PrivacyPage'),
  '/terms': () => import(/* webpackChunkName: "TermsPage" */ './pages/TermsPage'),
  '/faq': () => import(/* webpackChunkName: "FAQPage" */ './pages/FAQPage'),
}
