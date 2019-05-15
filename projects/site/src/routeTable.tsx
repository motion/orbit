// for easy pre-loading
export const routeTable = {
  '/docs': () => import('./pages/DocsPage'),
  '/blog': () => import('./pages/BlogPage'),
  '/about': () => import('./pages/AboutPage'),
  '/beta': () => import('./pages/BetaPage'),
  '/apps': () => import('./pages/AppsPage'),
  '/privacy': () => import('./pages/PrivacyPage'),
  '/terms': () => import('./pages/TermsPage'),
  '/faq': () => import('./pages/FAQPage'),
}
